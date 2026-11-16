from fastapi import APIRouter, HTTPException, Response
from typing import List, Optional
from pydantic import BaseModel

from app.services.storage_service import storage_service
from app.services.export_service import export_service
from app.schemas.resume import ResumeData, ResumeVersion

router = APIRouter(prefix="/api/resumes", tags=["Resumes & Storage"])

class SaveVersionRequest(BaseModel):
    version_name: str
    change_summary: str
    resume_data: ResumeData

@router.get("", response_model=List[ResumeData])
async def list_resumes():
    return storage_service.list_resumes()

@router.get("/{resume_id}", response_model=ResumeData)
async def get_resume(resume_id: str):
    resume = storage_service.get_resume(resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.post("", response_model=ResumeData)
async def save_or_update_resume(resume: ResumeData):
    return storage_service.save_resume(resume)

@router.delete("/{resume_id}")
async def delete_resume(resume_id: str):
    success = storage_service.delete_resume(resume_id)
    if not success:
        raise HTTPException(status_code=400, detail="Cannot delete the only remaining resume.")
    return {"status": "deleted", "resume_id": resume_id}

@router.post("/{resume_id}/duplicate", response_model=ResumeData)
async def duplicate_resume(resume_id: str):
    dup = storage_service.duplicate_resume(resume_id)
    if not dup:
        raise HTTPException(status_code=404, detail="Resume not found")
    return dup

# Versioning
@router.get("/{resume_id}/versions", response_model=List[ResumeVersion])
async def get_resume_versions(resume_id: str):
    return storage_service.get_versions(resume_id)

@router.post("/{resume_id}/versions", response_model=ResumeVersion)
async def create_resume_version(resume_id: str, request: SaveVersionRequest):
    return storage_service.create_version(
        resume_id=resume_id,
        version_name=request.version_name,
        change_summary=request.change_summary,
        resume=request.resume_data
    )

# Master Profile
@router.get("/user/profile", response_model=ResumeData)
async def get_master_profile():
    return storage_service.get_profile()

@router.post("/user/profile", response_model=ResumeData)
async def update_master_profile(profile: ResumeData):
    return storage_service.save_profile(profile)

# Export endpoints
@router.get("/{resume_id}/export/docx")
async def export_resume_docx(resume_id: str):
    resume = storage_service.get_resume(resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    stream = export_service.generate_docx(resume)
    filename = f"{resume.personal.name or 'Resume'}_{resume.title}.docx".replace(" ", "_")
    return Response(
        content=stream.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.get("/{resume_id}/export/txt")
async def export_resume_txt(resume_id: str):
    resume = storage_service.get_resume(resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    text = export_service.generate_txt(resume)
    filename = f"{resume.personal.name or 'Resume'}_{resume.title}.txt".replace(" ", "_")
    return Response(
        content=text,
        media_type="text/plain; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
