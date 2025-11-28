from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

# Video Schemas
class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    duration: Optional[int] = 0

class VideoCreate(VideoBase):
    url: str

class Video(VideoBase):
    id: int
    url: str
    module_id: int

    class Config:
        from_attributes = True

# Module Schemas
class ModuleBase(BaseModel):
    title: str
    order: int = 0

class ModuleCreate(ModuleBase):
    pass

class Module(ModuleBase):
    id: int
    course_id: int
    videos: List[Video] = []

    class Config:
        from_attributes = True

# Course Schemas
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: int = 0
    is_published: bool = False

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    is_published: Optional[bool] = None


class Course(CourseBase):
    id: int
    created_at: datetime
    updated_at: datetime
    modules: List[Module] = []

    class Config:
        from_attributes = True
