from typing import List, Union, Optional, Dict, Any
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TeachMe Platform"
    BACKEND_CORS_ORIGINS: Union[List[str], str] = []

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@db:5432/platform_db"

    @validator("DATABASE_URL", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            if v.startswith("postgres://"):
                v = v.replace("postgres://", "postgresql+asyncpg://", 1)
            elif v.startswith("postgresql://") and not v.startswith("postgresql+asyncpg://"):
                v = v.replace("postgresql://", "postgresql+asyncpg://", 1)
            
            # Remove sslmode query param as asyncpg doesn't support it in the URL
            if "sslmode=" in v:
                base_url, query = v.split("?", 1) if "?" in v else (v, "")
                if query:
                    params = [p for p in query.split("&") if not p.startswith("sslmode=")]
                    v = base_url + ("?" + "&".join(params) if params else "")
        return v

    REDIS_URL: str = "redis://redis:6379/0"

    STRIPE_SECRET_KEY: str = "sk_test_mock_key"
    STRIPE_PUBLISHABLE_KEY: str = "pk_test_mock_key"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
# Force redeploy
