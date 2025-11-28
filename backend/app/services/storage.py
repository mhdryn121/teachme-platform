import shutil
import os
from abc import ABC, abstractmethod
from fastapi import UploadFile
from pathlib import Path

class StorageService(ABC):
    @abstractmethod
    async def upload_file(self, file: UploadFile, destination: str) -> str:
        pass

class LocalStorage(StorageService):
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    async def upload_file(self, file: UploadFile, destination: str) -> str:
        file_path = self.upload_dir / destination
        # Ensure parent directory exists for nested paths
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return relative path or URL
        return f"/static/{destination}"

# Factory or Singleton
def get_storage_service() -> StorageService:
    # In production, check settings to decide between S3 and Local
    return LocalStorage()
