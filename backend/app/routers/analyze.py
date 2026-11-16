from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from pydantic import BaseModel

from app.services.parser_service import parser_service
from app.services.gemini_service import gemini_service
from app.services.ats_analyzer import ats_analyzer
from app.schemas.resume import ResumeData, ResumeAnalysisResponse, ValidationResult

router = APIRouter(prefix="/api/analyze", tags=["Analyze"])

class AnalyzeEvaluateRequest(BaseModel):
    resume_data: ResumeData
    target_role: Optional[str] = "Software Engineer"
    target_company: Optional[str] = ""
    job_description: Optional[str] = ""

@router.post("/upload")
async def upload_and_analyze_resume(
    file: UploadFile = File(...),
    target_role: Optional[str] = Form("Software Engineer"),
    target_company: Optional[str] = Form(""),
    job_description: Optional[str] = Form("")
):
    try:
        content = await file.read()
        extracted_text = parser_service.parse_file(file.filename, content)
        if not extracted_text or len(extracted_text.strip()) < 10:
            raise HTTPException(status_code=400, detail="The uploaded file appears to be empty or unreadable.")

        # Parse text into structured resume
        parsed_resume = gemini_service.parse_resume_content(extracted_text)
        if target_role:
            parsed_resume.target.role = target_role
        if target_company:
            parsed_resume.target.company = target_company
        if job_description:
            parsed_resume.target.job_description = job_description

        # Perform deep analysis
        analysis_result = gemini_service.analyze_resume_deep(
            resume=parsed_resume,
            target_role=target_role or "Software Engineer",
            target_company=target_company or "",
            job_description=job_description or ""
        )

        return {
            "resume": parsed_resume,
            "analysis": analysis_result,
            "raw_text_length": len(extracted_text)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process and analyze resume: {str(e)}")

@router.post("/evaluate", response_model=ResumeAnalysisResponse)
async def evaluate_existing_resume(request: AnalyzeEvaluateRequest):
    try:
        analysis_result = gemini_service.analyze_resume_deep(
            resume=request.resume_data,
            target_role=request.target_role or "Software Engineer",
            target_company=request.target_company or "",
            job_description=request.job_description or ""
        )
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/validate", response_model=ValidationResult)
async def validate_resume_readiness(resume_data: ResumeData):
    try:
        return ats_analyzer.validate_pre_export(resume_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")
