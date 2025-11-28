from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.payment import payment_service
from app.models.course import Course
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/create-checkout-session/{course_id}")
async def create_checkout_session(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch course details
    course = await db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Create Stripe Checkout Session
    checkout_url = await payment_service.create_checkout_session(
        course_id=course.id,
        course_title=course.title,
        price=course.price,
        user_id=current_user.id
    )

    return {"checkout_url": checkout_url}
