import os
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables from backend/.env if present
load_dotenv()

class Settings(BaseModel):
    APP_NAME: str = "AI Resume Analyzer API"
    VERSION: str = "4.2.0"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DEFAULT_MODEL: str = "gemini-2.5-pro"
    FALLBACK_MODEL: str = "gemini-2.5-flash"

settings = Settings()
