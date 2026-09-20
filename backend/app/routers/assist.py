from fastapi import APIRouter, Header
from typing import Optional
from app.services.gemini_service import gemini_service
from app.schemas.resume import FieldAssistRequest, FieldAssistResponse

router = APIRouter(prefix="/api/assist", tags=["AI Assist"])

@router.post("/field", response_model=FieldAssistResponse)
async def assist_field(
    request: FieldAssistRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    api_key = request.api_key or x_gemini_api_key
    response = gemini_service.field_assist(
        field_name=request.field_name,
        rough_notes=request.rough_notes,
        target_role=request.target_role or "Software Engineer",
        user_key=api_key
    )
    return response
