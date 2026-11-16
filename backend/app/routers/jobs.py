from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel
from app.services.gemini_service import gemini_service
from app.services.storage_service import storage_service
from app.schemas.resume import ResumeData, JobMatchResult

router = APIRouter(prefix="/api/jobs", tags=["Job Match"])

class JobMatchRequest(BaseModel):
    resume_data: ResumeData
    job_description: str
    target_role: Optional[str] = "Software Engineer"
    tailor_resume: Optional[bool] = False

@router.post("/match")
async def match_resume_with_job(request: JobMatchRequest):
    try:
        match_result, tailored_resume = gemini_service.match_and_tailor_job(
            resume=request.resume_data,
            job_description=request.job_description,
            target_role=request.target_role or "Software Engineer"
        )

        response = {
            "match_result": match_result,
            "tailored_resume": None
        }

        if request.tailor_resume:
            saved = storage_service.save_resume(tailored_resume)
            storage_service.create_version(
                resume_id=saved.id,
                version_name="AI Optimized",
                change_summary=f"Tailored for {request.target_role} JD",
                resume=saved
            )
            response["tailored_resume"] = saved

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job match analysis failed: {str(e)}")
