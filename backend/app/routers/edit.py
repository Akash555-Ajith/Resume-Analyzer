from fastapi import APIRouter, HTTPException
from app.services.gemini_service import gemini_service
from app.services.storage_service import storage_service
from app.schemas.resume import (
    InlineAssistRequest, InlineAssistResponse,
    AICommandRequest, AICommandResponse
)

router = APIRouter(prefix="/api/edit", tags=["Editor AI"])

@router.post("/command", response_model=AICommandResponse)
async def execute_command(request: AICommandRequest):
    try:
        response = gemini_service.execute_command_bar(
            resume=request.resume_data,
            command=request.command
        )
        # Update resume in storage
        storage_service.save_resume(response.updated_resume)
        storage_service.create_version(
            resume_id=response.updated_resume.id,
            version_name="AI Optimized",
            change_summary=f"Command Bar: {request.command[:50]}",
            resume=response.updated_resume
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to execute command: {str(e)}")

@router.post("/assist", response_model=InlineAssistResponse)
async def inline_selection_assist(request: InlineAssistRequest):
    try:
        response = gemini_service.inline_assist(
            action=request.action,
            selected_text=request.selected_text,
            context=request.context or "",
            target_role=request.target_role or "",
            job_description=request.job_description or ""
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inline assistant failed: {str(e)}")
