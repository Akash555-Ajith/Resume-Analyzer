import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "ResumeIQ Intelligence API"
    VERSION: str = "4.2.0"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DEFAULT_MODEL: str = "gemini-2.5-pro"
    FALLBACK_MODEL: str = "gemini-2.5-flash"

settings = Settings()
