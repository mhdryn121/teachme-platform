from typing import List
from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import Mapped, relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    username = Column(String, unique=True, index=True, nullable=True)
    phone_number = Column(String, nullable=True)
    address = Column(String, nullable=True)
    country = Column(String, nullable=True)
    date_of_birth = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    enrollments: Mapped[List["Enrollment"]] = relationship("Enrollment", back_populates="user", cascade="all, delete-orphan")
