from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.schemas import course as course_schemas

router = APIRouter()

@router.post("/{course_id}", response_model=Any)
async def enroll_course(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if course exists
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalars().first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Check if already enrolled
    result = await db.execute(
        select(Enrollment).where(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == course_id
        )
    )
    existing_enrollment = result.scalars().first()
    if existing_enrollment:
        return {"message": "Already enrolled"}

    # Create enrollment
    enrollment = Enrollment(user_id=current_user.id, course_id=course_id)
    db.add(enrollment)
    await db.commit()
    
    return {"message": "Successfully enrolled"}

@router.get("/my-courses", response_model=List[course_schemas.Course])
async def read_my_enrollments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch courses the user is enrolled in
    # We join Enrollment and Course to get the course details
    result = await db.execute(
        select(Course)
        .join(Enrollment)
        .where(Enrollment.user_id == current_user.id)
        .options(selectinload(Course.modules).selectinload(course_schemas.Module.videos)) # Eager load for display
    )
    courses = result.scalars().all()
    return courses
