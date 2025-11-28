from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.db.session import engine, Base
from app.api.v1.api import api_router
import os
# Import models to ensure they are registered with Base.metadata
from app.models import course, user

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    async with engine.begin() as conn:
        # await conn.run_sync(Base.metadata.drop_all) # Uncomment to reset DB
        await conn.run_sync(Base.metadata.create_all)
        # Migration: Add price column if it doesn't exist
        from sqlalchemy import text
        try:
            await conn.execute(text("ALTER TABLE courses ADD COLUMN IF NOT EXISTS price INTEGER DEFAULT 0"))
        except Exception as e:
            print(f"Migration warning: {e}")

        # Migration: Create enrollments table if it doesn't exist
        try:
            await conn.execute(text("""
                CREATE TABLE IF NOT EXISTS enrollments (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id),
                    course_id INTEGER REFERENCES courses(id),
                    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
        except Exception as e:
            print(f"Migration warning (enrollments): {e}")
    yield

app = FastAPI(
    title="TeachMe Platform API",
    version="0.1.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Mount static files for local storage
os.makedirs("uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="uploads"), name="static")

app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "platform-api"}

@app.get("/")
async def root():
    return {"message": "Welcome to TeachMe Platform API"}
