from fastapi import APIRouter, Header
from typing import Optional
from app.services.gemini_service import gemini_service
from app.schemas.resume import ChatEditRequest, ChatEditResponse

router = APIRouter(prefix="/api/edit", tags=["Edit Chat"])

@router.post("/chat", response_model=ChatEditResponse)
async def plain_language_chat_edit(
    request: ChatEditRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    api_key = request.api_key or x_gemini_api_key
    response = gemini_service.apply_plain_language_edit(
        resume=request.resume_data,
        instruction=request.instruction,
        user_key=api_key
    )
    return response
