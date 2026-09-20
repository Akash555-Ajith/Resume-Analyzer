from fastapi import APIRouter, UploadFile, File, Header, HTTPException
from typing import Optional
from pydantic import BaseModel
from app.services.parser_service import parser_service
from app.services.gemini_service import gemini_service
from app.schemas.resume import ResumeData, SimpleAnalysisResult

router = APIRouter(prefix="/api/analyze", tags=["Analyze"])

class SimpleScoreRequest(BaseModel):
    resume_data: ResumeData
    job_description: Optional[str] = ""

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

@router.post("/simple", response_model=SimpleAnalysisResult)
async def score_resume_simple(
    request: SimpleScoreRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    result = gemini_service.analyze_resume_simple(
        resume=request.resume_data,
        job_description=request.job_description or "",
        user_key=x_gemini_api_key
    )
    return result
