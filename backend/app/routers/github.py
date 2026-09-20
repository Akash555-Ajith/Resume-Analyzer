from fastapi import APIRouter, Header
from typing import List, Optional
from pydantic import BaseModel
from app.services.github_service import github_service
from app.schemas.resume import GitHubRepoAnalysis

router = APIRouter(prefix="/api/github", tags=["GitHub"])

class GitHubAnalyzeRequest(BaseModel):
    username: str
    selected_repos: List[str]

@router.get("/user/{username}")
async def get_user_repositories(username: str):
    repos = await github_service.fetch_user_repos(username)
    return {"username": username, "repositories": repos}

@router.post("/analyze", response_model=List[GitHubRepoAnalysis])
async def analyze_repositories(
    request: GitHubAnalyzeRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    results = await github_service.analyze_repos_for_resume(
        username=request.username,
        selected_repo_names=request.selected_repos,
        user_key=x_gemini_api_key
    )
    return results
