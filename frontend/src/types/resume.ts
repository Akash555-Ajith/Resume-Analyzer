export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  title: string;
}

export interface TargetInfo {
  role: string;
  company: string;
  job_description: string;
}

export interface EducationEntry {
  id?: string;
  degree: string;
  institution: string;
  graduation_year: string;
  gpa: string; // Strictly optional
  location?: string;
  coursework: string[];
}

export interface WorkExperienceEntry {
  id?: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  bullet_points: string[];
  technologies: string[];
}

export interface ProjectEntry {
  id?: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  contribution?: string;
  results?: string;
  bullet_points: string[];
  evidence?: string;
}

export interface SkillsCategorized {
  languages: string[];
  frameworks: string[];
  tools: string[];
  databases: string[];
  other: string[];
}

export interface ResumeData {
  id: string;
  title: string;
  template_id: string; // ats_classic, modern, technical, academic, management, student
  career_stage: string; // student, software_engineer, hardware_engineer, researcher, manager, etc.
  personal: PersonalInfo;
  target: TargetInfo;
  summary: string;
  education: EducationEntry[];
  experience: WorkExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillsCategorized;
  certifications: string[];
  achievements: string[];
  publications: string[];
  leadership: string[];
  sections_order: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ResumeVersion {
  id: string;
  resume_id: string;
  version_name: string;
  created_at: string;
  change_summary: string;
  data: ResumeData;
}

export interface CategoryScoresBreakdown {
  ats_compatibility: number;
  content_quality: number;
  role_alignment: number;
  keyword_match: number;
  formatting: number;
  project_strength: number;
  experience_strength: number;
}

export interface AnalysisIssue {
  id: string;
  title: string;
  category: string;
  priority: 'critical' | 'recommended' | 'optional';
  problem: string;
  why_it_matters: string;
  recommended_change: string;
}

export interface BulletImprovement {
  id: string;
  section: string;
  entry_title: string;
  original: string;
  ai_recommendation: string;
  explanation: string;
  has_metrics_suggestion: boolean;
}

export interface ResumeAnalysisResponse {
  overall_health: number;
  target_role: string;
  target_company: string;
  category_scores: CategoryScoresBreakdown;
  critical_issues: AnalysisIssue[];
  recommended_improvements: AnalysisIssue[];
  optional_improvements: AnalysisIssue[];
  before_after_improvements: BulletImprovement[];
  ats_checks: Record<string, boolean>;
  summary_verdict: string;
}

export interface JobMatchResult {
  match_score: number;
  target_role: string;
  target_company: string;
  skills_found: string[];
  skills_missing: string[];
  skills_weakly_demonstrated: string[];
  relevant_projects: string[];
  relevant_experience: string[];
  recommended_keywords: string[];
  tailored_advice: string[];
}

export interface GitHubRepoAnalysis {
  repo_name: string;
  overview: string;
  technologies: string[];
  technical_features: string[];
  architecture: string;
  potential_resume_bullets: string[];
  evidence_from_repository: string;
  stargazers_count: number;
  primary_language: string;
  topics: string[];
  repo_url: string;
}

export interface ValidationCheckItem {
  id: string;
  label: string;
  passed: boolean;
  details: string;
}

export interface ValidationResult {
  all_passed: boolean;
  score: number;
  items: ValidationCheckItem[];
}

export interface InlineAssistResponse {
  action: string;
  original_text: string;
  suggested_text: string;
  explanation: string;
}

export interface AICommandResponse {
  updated_resume: ResumeData;
  explanation: string;
  changes_made: string[];
}
