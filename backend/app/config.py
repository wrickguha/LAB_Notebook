"""
Application configuration — reads from .env (or environment variables).
All settings have safe development defaults so the app works out-of-the-box.
"""
from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    database_url: str = "mysql+pymysql://root:password@localhost:3306/labnotebook"

    # Security
    secret_key: str = "dev-secret-change-in-production-please"

    # CORS — comma-separated origins
    allowed_origins: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    # App metadata
    app_name: str = "LAB Notebook API"
    app_version: str = "1.0.0"
    debug: bool = True

    @property
    def origins_list(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings instance (reads .env once)."""
    return Settings()
