from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PersonalInfo(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    github: str = ""
    portfolio: str = ""
    title: str = ""

class TargetInfo(BaseModel):
    role: str = ""
    company: str = ""
    job_description: str = ""

class EducationEntry(BaseModel):
    id: Optional[str] = None
    degree: str = ""
    institution: str = ""
    graduation_year: str = ""
    gpa: str = ""  # CGPA strictly optional
    location: str = ""
    coursework: List[str] = Field(default_factory=list)

class WorkExperienceEntry(BaseModel):
    id: Optional[str] = None
    company: str = ""
    position: str = ""
    location: str = ""
    start_date: str = ""
    end_date: str = ""
    is_current: bool = False
    bullet_points: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)

class ProjectEntry(BaseModel):
    id: Optional[str] = None
    name: str = ""
    description: str = ""
    technologies: List[str] = Field(default_factory=list)
    link: str = ""
    contribution: str = ""
    results: str = ""
    bullet_points: List[str] = Field(default_factory=list)
    evidence: str = ""

class SkillsCategorized(BaseModel):
    languages: List[str] = Field(default_factory=list)
    frameworks: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)
    databases: List[str] = Field(default_factory=list)
    other: List[str] = Field(default_factory=list)

class ResumeData(BaseModel):
    id: str = "resume-1"
    title: str = "Master Resume"
    template_id: str = "modern"  # ats_classic, modern, technical, academic, management, student
    career_stage: str = "experienced"  # student, software_engineer, hardware_engineer, researcher, manager, etc.
    personal: PersonalInfo = Field(default_factory=PersonalInfo)
    target: TargetInfo = Field(default_factory=TargetInfo)
    summary: str = ""
    education: List[EducationEntry] = Field(default_factory=list)
    experience: List[WorkExperienceEntry] = Field(default_factory=list)
    projects: List[ProjectEntry] = Field(default_factory=list)
    skills: SkillsCategorized = Field(default_factory=SkillsCategorized)
    certifications: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)
    publications: List[str] = Field(default_factory=list)
    leadership: List[str] = Field(default_factory=list)
    sections_order: List[str] = Field(
        default_factory=lambda: [
            "summary",
            "experience",
            "projects",
            "skills",
            "education",
            "certifications",
            "achievements",
            "publications",
            "leadership"
        ]
    )
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class ResumeVersion(BaseModel):
    id: str
    resume_id: str
    version_name: str  # Original, AI Optimized, After Manual Editing, Final
    created_at: str
    change_summary: str
    data: ResumeData

class CategoryScore(BaseModel):
    name: str
    score: int
    status: str  # excellent, good, needs_work
    description: str

class AnalysisIssue(BaseModel):
    id: str
    title: str
    category: str
    priority: str  # critical, recommended, optional
    problem: str
    why_it_matters: str
    recommended_change: str

class BulletImprovement(BaseModel):
    id: str
    section: str
    entry_title: str
    original: str
    ai_recommendation: str
    explanation: str
    has_metrics_suggestion: bool = False

class CategoryScoresBreakdown(BaseModel):
    ats_compatibility: int = 87
    content_quality: int = 78
    role_alignment: int = 84
    keyword_match: int = 76
    formatting: int = 91
    project_strength: int = 82
    experience_strength: int = 74

class ResumeAnalysisResponse(BaseModel):
    overall_health: int = 87
    target_role: str = ""
    target_company: str = ""
    category_scores: CategoryScoresBreakdown = Field(default_factory=CategoryScoresBreakdown)
    critical_issues: List[AnalysisIssue] = Field(default_factory=list)
    recommended_improvements: List[AnalysisIssue] = Field(default_factory=list)
    optional_improvements: List[AnalysisIssue] = Field(default_factory=list)
    before_after_improvements: List[BulletImprovement] = Field(default_factory=list)
    ats_checks: Dict[str, Any] = Field(default_factory=dict)
    summary_verdict: str = ""

class JobMatchResult(BaseModel):
    match_score: int = 80
    target_role: str = ""
    target_company: str = ""
    skills_found: List[str] = Field(default_factory=list)
    skills_missing: List[str] = Field(default_factory=list)
    skills_weakly_demonstrated: List[str] = Field(default_factory=list)
    relevant_projects: List[str] = Field(default_factory=list)
    relevant_experience: List[str] = Field(default_factory=list)
    recommended_keywords: List[str] = Field(default_factory=list)
    tailored_advice: List[str] = Field(default_factory=list)

class GitHubRepoAnalysis(BaseModel):
    repo_name: str
    overview: str = ""
    technologies: List[str] = Field(default_factory=list)
    technical_features: List[str] = Field(default_factory=list)
    architecture: str = ""
    potential_resume_bullets: List[str] = Field(default_factory=list)
    evidence_from_repository: str = ""
    stargazers_count: int = 0
    primary_language: str = ""
    topics: List[str] = Field(default_factory=list)
    repo_url: str = ""

class GitHubGenerateRequest(BaseModel):
    username: str
    selected_repos: List[str]
    target_role: Optional[str] = "Software Engineer"
    career_stage: Optional[str] = "student"

class InlineAssistRequest(BaseModel):
    action: str  # improve, shorten, expand, fix_grammar, make_technical, make_ats_friendly, add_impact, tailor_to_job, rewrite
    selected_text: str
    context: Optional[str] = ""
    target_role: Optional[str] = ""
    job_description: Optional[str] = ""

class InlineAssistResponse(BaseModel):
    action: str
    original_text: str
    suggested_text: str
    explanation: str

class AICommandRequest(BaseModel):
    resume_data: ResumeData
    command: str

class AICommandResponse(BaseModel):
    updated_resume: ResumeData
    explanation: str
    changes_made: List[str] = Field(default_factory=list)

class PromptGenerateRequest(BaseModel):
    prompt: str
    career_stage: Optional[str] = "software_engineer"
    target_role: Optional[str] = "Software Engineer"

class ValidationCheckItem(BaseModel):
    id: str
    label: str
    passed: bool
    details: str

class ValidationResult(BaseModel):
    all_passed: bool
    score: int
    items: List[ValidationCheckItem]
