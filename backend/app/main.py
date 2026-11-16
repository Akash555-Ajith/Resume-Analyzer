from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import analyze, generate, github, jobs, edit, resumes
from app.services.gemini_service import gemini_service

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Production Full-Stack AI Resume Analyzer & Generator API"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all feature routers
app.include_router(analyze.router)
app.include_router(generate.router)
app.include_router(github.router)
app.include_router(jobs.router)
app.include_router(edit.router)
app.include_router(resumes.router)

@app.get("/")
@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "gemini_configured": gemini_service.is_configured(),
        "model": settings.DEFAULT_MODEL
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
