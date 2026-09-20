from fastapi import APIRouter, Header
from typing import Optional
from app.services.gemini_service import gemini_service
from app.schemas.resume import RewriteRequest, RewriteResponse

router = APIRouter(prefix="/api/rewrite", tags=["Rewrite AI"])

@router.post("", response_model=RewriteResponse)
async def rewrite_text(
    request: RewriteRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    result = gemini_service.rewrite_inline_text(
        selected_text=request.selected_text,
        action=request.action,
        target_role=request.target_role or "Software Engineer",
        context=request.context or "",
        user_key=x_gemini_api_key
    )
    return result
