from typing import List, Optional, Dict, Any
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

class ResumeData(BaseModel):
    id: Optional[str] = "main-resume"
    title: Optional[str] = "Master Resume"
    template_id: str = "classic"
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

class SectionFeedback(BaseModel):
    summary: str = ""
    experience: str = ""
    education: str = ""
    skills: str = ""
    projects: str = ""

class SimpleAnalysisResult(BaseModel):
    overall_score: int = 88
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    section_feedback: SectionFeedback = Field(default_factory=SectionFeedback)
    missing_sections: List[str] = Field(default_factory=list)
    missing_keywords: List[str] = Field(default_factory=list)
    formatting_issues: List[str] = Field(default_factory=list)
    grammar_issues: List[str] = Field(default_factory=list)
    jd_match_score: Optional[int] = None
    jd_keyword_gaps: List[str] = Field(default_factory=list)

class DiffItem(BaseModel):
    id: str
    section: str
    original_text: str
    proposed_text: str
    explanation: str

class ChatEditRequest(BaseModel):
    resume_data: ResumeData
    instruction: str
    api_key: Optional[str] = ""

class ChatEditResponse(BaseModel):
    updated_resume: ResumeData
    diffs: List[DiffItem] = Field(default_factory=list)
    summary_explanation: str

class FieldAssistRequest(BaseModel):
    field_name: str
    rough_notes: str
    target_role: Optional[str] = "Software Engineer"
    api_key: Optional[str] = ""

class FieldAssistResponse(BaseModel):
    field_name: str
    suggested_text: str
    explanation: str

class PromptGenerationRequest(BaseModel):
    prompt: str
    user_profile: Optional[Dict[str, Any]] = None
    api_key: Optional[str] = ""

class GitHubRepoAnalysis(BaseModel):
    repo_name: str
    description: Optional[str] = ""
    technologies: List[str] = Field(default_factory=list)
    technical_complexity: List[str] = Field(default_factory=list)
    evidence: str
    resume_bullets: List[str] = Field(default_factory=list)

class ChatMessage(BaseModel):
    role: str # user or assistant
    content: str

class ChatAssistantRequest(BaseModel):
    messages: List[ChatMessage]
    current_resume: Optional[ResumeData] = None
    api_key: Optional[str] = ""

class ChatAssistantResponse(BaseModel):
    reply: str
