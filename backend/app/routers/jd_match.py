from fastapi import APIRouter, Header
from typing import Optional, List
from pydantic import BaseModel
from app.services.gemini_service import gemini_service
from app.schemas.resume import ResumeData, JDRequirementItem, CompanyAnalysis

router = APIRouter(prefix="/api/jd", tags=["Job Description"])

class JDCompareRequest(BaseModel):
    resume_data: ResumeData
    job_description: str
    target_role: Optional[str] = "Software Engineer"
    company_name: Optional[str] = "Stripe"

class JDCompareResponse(BaseModel):
    matrix: List[JDRequirementItem]
    company_analysis: CompanyAnalysis

@router.post("/compare", response_model=JDCompareResponse)
async def compare_jd(
    request: JDCompareRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    analysis = gemini_service.analyze_resume_deep(
        resume=request.resume_data,
        target_role=request.target_role or "Software Engineer",
        company_name=request.company_name or "Stripe",
        job_description=request.job_description,
        user_key=x_gemini_api_key
    )
    return JDCompareResponse(
        matrix=analysis.jd_matrix,
        company_analysis=analysis.company_analysis or CompanyAnalysis(
            company=request.company_name or "Target Company",
            target_role=request.target_role or "Software Engineer",
            emphasis_advice="Focus on core technical deliverables and production stability metrics."
        )
    )
