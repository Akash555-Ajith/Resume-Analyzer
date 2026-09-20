from typing import List, Optional
from pydantic import BaseModel, Field

class ContactInfo(BaseModel):
    name: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    location: Optional[str] = ""
    linkedin: Optional[str] = ""
    github: Optional[str] = ""
    portfolio: Optional[str] = ""
    other_links: List[str] = Field(default_factory=list)

class EducationEntry(BaseModel):
    id: Optional[str] = None
    degree: Optional[str] = ""
    institution: Optional[str] = ""
    graduation_year: Optional[str] = ""
    gpa: Optional[str] = ""
    coursework: List[str] = Field(default_factory=list)

class WorkExperienceEntry(BaseModel):
    id: Optional[str] = None
    company: Optional[str] = ""
    position: Optional[str] = ""
    location: Optional[str] = ""
    start_date: Optional[str] = ""
    end_date: Optional[str] = ""
    is_current: bool = False
    bullet_points: List[str] = Field(default_factory=list)

class ProjectEntry(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = ""
    technologies: List[str] = Field(default_factory=list)
    description: Optional[str] = ""
    link: Optional[str] = ""
    bullet_points: List[str] = Field(default_factory=list)

class SkillCategory(BaseModel):
    category: str
    skills: List[str]

class UserProfile(BaseModel):
    contact: ContactInfo = Field(default_factory=ContactInfo)
    current_position: Optional[str] = ""
    target_position: Optional[str] = ""
    industry: Optional[str] = ""
    experience_level: Optional[str] = "Mid-Level" # Student, Entry, Mid-Level, Senior, Lead, Executive
    years_of_experience: Optional[float] = 0
    is_student: bool = False
    education: List[EducationEntry] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    publications: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)

class ResumeData(BaseModel):
    id: Optional[str] = "main-resume"
    title: Optional[str] = "Master Resume"
    template_id: str = "modern_professional"
    contact: ContactInfo = Field(default_factory=ContactInfo)
    summary: Optional[str] = ""
    education: List[EducationEntry] = Field(default_factory=list)
    experience: List[WorkExperienceEntry] = Field(default_factory=list)
    projects: List[ProjectEntry] = Field(default_factory=list)
    skills: List[SkillCategory] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)
    publications: List[str] = Field(default_factory=list)
    leadership: List[str] = Field(default_factory=list)
    extracurriculars: List[str] = Field(default_factory=list)

class ATSFlaw(BaseModel):
    id: str
    problem: str
    why: str
    recommendation: str
    severity: str = "high" # high, medium, low
    category: str = "ATS Formatting" # Formatting, Keywords, Content, Schema

class VectorSubScore(BaseModel):
    score: int
    name: str
    explanation: str

class RoleAnalysis(BaseModel):
    target_role: str
    strong_matches: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    weak_evidence: List[str] = Field(default_factory=list)
    irrelevant_content: List[str] = Field(default_factory=list)
    recommended_emphasis: List[str] = Field(default_factory=list)

class JDRequirementItem(BaseModel):
    requirement: str
    resume_evidence: str
    match_level: str # Strong, Moderate, Missing, Irrelevant
    recommendation: str

class CompanyAnalysis(BaseModel):
    company: str
    target_role: str
    emphasis_advice: str
    key_vectors: List[str] = Field(default_factory=list)
    hiring_bar_benchmark: Optional[str] = ""

class FullAnalysisResult(BaseModel):
    overall_score: int = 94
    ats_score: int = 96
    content_quality_score: int = 92
    role_relevance_score: int = 94
    keyword_relevance_score: int = 95
    experience_strength_score: int = 91
    project_strength_score: int = 93
    skills_relevance_score: int = 96
    formatting_score: int = 98
    readability_score: int = 95
    achievement_impact_score: int = 92
    
    # Specific verification vectors matching UI screenshot
    parse_fidelity: float = 99.2
    table_faults: int = 0
    quant_impact_ratio: str = "14 / 14"
    recruiter_pass_time: str = "6.2s"
    google_xyz_adherence: int = 98
    ats_parseability_schema: int = 99
    
    ats_flaws: List[ATSFlaw] = Field(default_factory=list)
    sub_scores: List[VectorSubScore] = Field(default_factory=list)
    role_analysis: Optional[RoleAnalysis] = None
    company_analysis: Optional[CompanyAnalysis] = None
    jd_matrix: List[JDRequirementItem] = Field(default_factory=list)
    high_yield_recommendations: List[str] = Field(default_factory=list)

class GitHubRepoAnalysis(BaseModel):
    repo_name: str
    description: Optional[str] = ""
    technologies: List[str] = Field(default_factory=list)
    technical_complexity: List[str] = Field(default_factory=list)
    evidence: str
    resume_bullets: List[str] = Field(default_factory=list)

class RewriteRequest(BaseModel):
    selected_text: str
    action: str # improve, concise, technical, professional, quantify, fix_grammar, ats_rewrite
    target_role: Optional[str] = "Software Engineer"
    context: Optional[str] = ""

class RewriteResponse(BaseModel):
    original_text: str
    rewritten_text: str
    explanation: str

class PromptGenerationRequest(BaseModel):
    prompt: str
    user_profile: Optional[UserProfile] = None
    api_key: Optional[str] = ""

class AnalyzeResumeRequest(BaseModel):
    resume_data: ResumeData
    target_role: Optional[str] = "Software Engineer"
    company_name: Optional[str] = "Stripe"
    job_description: Optional[str] = ""
    api_key: Optional[str] = ""
