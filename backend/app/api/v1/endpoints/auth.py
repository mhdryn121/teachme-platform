from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.core import security
from app.models.user import User
from app.schemas import user as user_schema

router = APIRouter()

@router.post("/signup", response_model=user_schema.User)
async def create_user(
    user_in: user_schema.UserCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Create new user.
    """
    # Check if user exists
    email = user_in.email.lower()
    result = await db.execute(select(User).where(User.email == email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    # Create user
    user = User(
        email=email,
        hashed_password=security.get_password_hash(user_in.password),
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        username=user_in.username,
        phone_number=user_in.phone_number,
        address=user_in.address,
        country=user_in.country,
        date_of_birth=user_in.date_of_birth,
        is_active=user_in.is_active,
        is_superuser=user_in.is_superuser,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=user_schema.Token)
async def login_access_token(
    user_in: user_schema.UserLogin,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    email = user_in.email.lower()
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    
    if not user or not security.verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=60 * 24 * 8) # 8 days
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(security.oauth2_scheme)
) -> User:
    try:
        payload = security.jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        token_data = payload.get("sub")
        if token_data is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except (security.jwt.JWTError, Exception):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    result = await db.execute(select(User).where(User.id == int(token_data)))
    user = result.scalars().first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/me", response_model=user_schema.User)
async def read_users_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get current user.
    """
    return current_user
