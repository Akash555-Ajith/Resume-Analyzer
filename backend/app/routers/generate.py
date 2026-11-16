from fastapi import APIRouter, HTTPException
from app.services.gemini_service import gemini_service
from app.services.storage_service import storage_service
from app.schemas.resume import ResumeData, PromptGenerateRequest

router = APIRouter(prefix="/api/generate", tags=["Generation"])

@router.post("/prompt", response_model=ResumeData)
async def generate_from_prompt(request: PromptGenerateRequest):
    try:
        resume = gemini_service.generate_from_prompt(
            prompt=request.prompt,
            career_stage=request.career_stage or "software_engineer",
            target_role=request.target_role or "Software Engineer"
        )
        storage_service.save_resume(resume)
        storage_service.create_version(
            resume_id=resume.id,
            version_name="Original",
            change_summary="Initial generation from AI prompt",
            resume=resume
        )
        return resume
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate resume from prompt: {str(e)}")

@router.post("/guided", response_model=ResumeData)
async def generate_guided_resume(resume_data: ResumeData):
    try:
        # Dynamically adjust section order based on career stage
        stage = (resume_data.career_stage or "experienced").lower()
        if stage == "student":
            resume_data.sections_order = [
                "education", "projects", "skills", "experience", "certifications", "achievements", "leadership"
            ]
        elif stage == "manager":
            resume_data.sections_order = [
                "summary", "leadership", "experience", "skills", "projects", "education", "achievements"
            ]
        elif stage == "researcher":
            resume_data.sections_order = [
                "summary", "publications", "education", "experience", "projects", "skills", "achievements"
            ]

        saved = storage_service.save_resume(resume_data)
        storage_service.create_version(
            resume_id=saved.id,
            version_name="Original",
            change_summary="Generated from Guided Resume Builder",
            resume=saved
        )
        return saved
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save guided resume: {str(e)}")
