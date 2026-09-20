from fastapi import APIRouter, Header
from typing import Optional
from app.services.gemini_service import gemini_service
from app.schemas.resume import ResumeData, PromptGenerationRequest

router = APIRouter(prefix="/api/generate", tags=["Generation"])

@router.post("/prompt", response_model=ResumeData)
async def generate_from_prompt(
    request: PromptGenerationRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    api_key = request.api_key or x_gemini_api_key
    profile_dict = request.user_profile.model_dump() if request.user_profile else None
    resume = gemini_service.generate_from_prompt(
        user_prompt=request.prompt,
        profile=profile_dict,
        user_key=api_key
    )
    return resume
