from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import analyze, edit, assist, generate, github, chatbot

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="AI Resume Analyzer Backend API - Powered by Gemini Pro"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(edit.router)
app.include_router(assist.router)
app.include_router(generate.router)
app.include_router(github.router)
app.include_router(chatbot.router)

@app.get("/")
@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "gemini_configured": bool(settings.GEMINI_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
