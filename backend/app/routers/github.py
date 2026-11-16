from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from app.services.github_service import github_service
from app.services.storage_service import storage_service
from app.schemas.resume import GitHubRepoAnalysis, ResumeData, GitHubGenerateRequest

router = APIRouter(prefix="/api/github", tags=["GitHub"])

class GitHubAnalyzeRequest(BaseModel):
    username: str
    selected_repos: List[str]

@router.get("/user/{username}")
async def get_user_repositories(username: str):
    try:
        repos = await github_service.fetch_user_repos(username)
        return {"username": username, "repositories": repos}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch repositories: {str(e)}")

@router.post("/analyze", response_model=List[GitHubRepoAnalysis])
async def analyze_repositories(request: GitHubAnalyzeRequest):
    try:
        results = await github_service.analyze_repositories(
            username=request.username,
            selected_repo_names=request.selected_repos
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze repositories: {str(e)}")

@router.post("/generate-resume", response_model=ResumeData)
async def generate_resume_from_github(request: GitHubGenerateRequest):
    try:
        resume = await github_service.generate_resume_from_repos(
            username=request.username,
            selected_repo_names=request.selected_repos,
            career_stage=request.career_stage or "student",
            target_role=request.target_role or "Software Engineer"
        )
        saved = storage_service.save_resume(resume)
        storage_service.create_version(
            resume_id=saved.id,
            version_name="Original",
            change_summary=f"Generated from GitHub projects ({len(request.selected_repos)} repos)",
            resume=saved
        )
        return saved
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate resume from GitHub: {str(e)}")
