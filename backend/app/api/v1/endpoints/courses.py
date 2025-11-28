from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.course import Course, Module, Video
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
from app.schemas import course as schemas
from app.services.storage import get_storage_service, StorageService

router = APIRouter()

@router.post("/", response_model=schemas.Course)
async def create_course(course: schemas.CourseCreate, db: AsyncSession = Depends(get_db)):
    db_course = Course(**course.model_dump())
    db.add(db_course)
    await db.commit()
    await db.refresh(db_course)
    return db_course

@router.get("/", response_model=List[schemas.Course])
async def read_courses(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Course)
        .options(selectinload(Course.modules).selectinload(Module.videos))
        .where(Course.is_published == True)
        .offset(skip)
        .limit(limit)
    )
    courses = result.scalars().all()
    return courses

@router.get("/my-courses", response_model=List[schemas.Course])
async def read_my_courses(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # In a real app, we would filter by instructor_id=current_user.id
    # For this prototype, we'll return all courses but this endpoint is protected
    # TODO: Add instructor_id to Course model and filter here
    result = await db.execute(
        select(Course)
        .options(selectinload(Course.modules).selectinload(Module.videos))
        .offset(skip)
        .limit(limit)
    )
    courses = result.scalars().all()
    return courses

@router.get("/{course_id}", response_model=schemas.Course)
async def read_course(course_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Course).options(selectinload(Course.modules).selectinload(Module.videos)).where(Course.id == course_id)
    )
    course = result.scalars().first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.patch("/{course_id}", response_model=schemas.Course)
async def update_course(
    course_id: int, 
    course_update: schemas.CourseUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Course)
        .options(selectinload(Course.modules).selectinload(Module.videos))
        .where(Course.id == course_id)
    )
    db_course = result.scalars().first()
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    
    update_data = course_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_course, key, value)

    db.add(db_course)
    await db.commit()
    await db.refresh(db_course)
    return db_course

@router.post("/{course_id}/modules", response_model=schemas.Module)
async def create_module(course_id: int, module: schemas.ModuleCreate, db: AsyncSession = Depends(get_db)):
    db_module = Module(**module.model_dump(), course_id=course_id)
    db.add(db_module)
    await db.commit()
    await db.refresh(db_module)
    return db_module

@router.post("/{module_id}/videos", response_model=schemas.Video)
async def upload_video(
    module_id: int,
    title: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    storage: StorageService = Depends(get_storage_service)
):
    # Save file
    import uuid
    file_extension = file.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{file_extension}"
    file_url = await storage.upload_file(file, file_name)
    
    # Create video record
    video = Video(
        title=title,
        url=file_url,
        module_id=module_id
    )
    db.add(video)
    await db.commit()
    await db.refresh(video)

    # Trigger Transcription (Background Task in real app)
    # For now, we just print that we would do it
    # await ai_service.transcribe_video(file_path) 
    
    return video
