from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException
from typing import Optional
from app.services.parser_service import parser_service
from app.services.gemini_service import gemini_service
from app.schemas.resume import ResumeData, FullAnalysisResult, AnalyzeResumeRequest

router = APIRouter(prefix="/api/analyze", tags=["Analyze"])

@router.post("/upload", response_model=ResumeData)
async def upload_and_parse_resume(
    file: UploadFile = File(...),
    x_gemini_api_key: Optional[str] = Header(None)
):
    try:
        content = await file.read()
        extracted_text = parser_service.parse_file(file.filename, content)
        parsed_resume = gemini_service.parse_resume(extracted_text, user_key=x_gemini_api_key)
        return parsed_resume
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse resume file: {str(e)}")

@router.post("/score", response_model=FullAnalysisResult)
async def score_resume(
    request: AnalyzeResumeRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    api_key = request.api_key or x_gemini_api_key
    result = gemini_service.analyze_resume_deep(
        resume=request.resume_data,
        target_role=request.target_role or "Software Engineer",
        company_name=request.company_name or "Stripe",
        job_description=request.job_description or "",
        user_key=api_key
    )
    return result
