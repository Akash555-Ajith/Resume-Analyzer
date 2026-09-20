from fastapi import APIRouter, Header
from typing import Optional
from app.services.gemini_service import gemini_service
from app.schemas.resume import ChatAssistantRequest, ChatAssistantResponse

router = APIRouter(prefix="/api/chat", tags=["AI Chatbot"])

@router.post("/assistant", response_model=ChatAssistantResponse)
async def career_chat_assistant(
    request: ChatAssistantRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    api_key = request.api_key or x_gemini_api_key
    response = gemini_service.chat_career_assistant(
        messages=request.messages,
        current_resume=request.current_resume,
        user_key=api_key
    )
    return response
