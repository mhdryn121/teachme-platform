from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Text, Boolean, ForeignKey, DateTime, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship, DeclarativeBase

class Base(DeclarativeBase):
    pass

class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price: Mapped[int] = mapped_column(Integer, default=0)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    modules: Mapped[List["Module"]] = relationship(back_populates="course", cascade="all, delete-orphan")
    enrollments: Mapped[List["Enrollment"]] = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")

class Module(Base):
    __tablename__ = "modules"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String)
    order: Mapped[int] = mapped_column(default=0)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"))

    course: Mapped["Course"] = relationship(back_populates="modules")
    videos: Mapped[List["Video"]] = relationship(back_populates="module", cascade="all, delete-orphan")

class Video(Base):
    __tablename__ = "videos"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    url: Mapped[str] = mapped_column(String)  # Path to local file or S3 URL
    duration: Mapped[Optional[int]] = mapped_column(default=0)  # In seconds
    module_id: Mapped[int] = mapped_column(ForeignKey("modules.id"))

    module: Mapped["Module"] = relationship(back_populates="videos")
