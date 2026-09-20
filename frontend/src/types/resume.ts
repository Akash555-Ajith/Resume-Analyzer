export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  other_links: string[];
}

export interface EducationEntry {
  id?: string;
  degree: string;
  institution: string;
  graduation_year: string;
  gpa: string;
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
}

export interface ProjectEntry {
  id?: string;
  name: string;
  technologies: string[];
  description: string;
  link?: string;
  bullet_points: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface UserProfile {
  contact: ContactInfo;
  current_position: string;
  target_position: string;
  industry: string;
  experience_level: string; // Student, Entry, Mid-Level, Senior, Lead, Executive
  years_of_experience: number;
  is_student: boolean;
  education: EducationEntry[];
  certifications: string[];
  publications: string[];
  achievements: string[];
}

export interface ResumeData {
  id: string;
  title: string;
  template_id: string; // ats_classic, modern_professional, technical, academic, management, executive, student
  contact: ContactInfo;
  summary: string;
  education: EducationEntry[];
  experience: WorkExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillCategory[];
  certifications: string[];
  achievements: string[];
  publications: string[];
  leadership: string[];
  extracurriculars: string[];
}

export interface ATSFlaw {
  id: string;
  problem: string;
  why: string;
  recommendation: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
}

export interface VectorSubScore {
  name: string;
  score: number;
  explanation: string;
}

export interface RoleAnalysis {
  target_role: string;
  strong_matches: string[];
  missing_skills: string[];
  weak_evidence: string[];
  irrelevant_content: string[];
  recommended_emphasis: string[];
}

export interface CompanyAnalysis {
  company: string;
  target_role: string;
  emphasis_advice: string;
  key_vectors: string[];
  hiring_bar_benchmark?: string;
}

export interface JDRequirementItem {
  requirement: string;
  resume_evidence: string;
  match_level: 'Strong' | 'Moderate' | 'Missing' | 'Irrelevant';
  recommendation: string;
}

export interface FullAnalysisResult {
  overall_score: number;
  ats_score: number;
  content_quality_score: number;
  role_relevance_score: number;
  keyword_relevance_score: number;
  experience_strength_score: number;
  project_strength_score: number;
  skills_relevance_score: number;
  formatting_score: number;
  readability_score: number;
  achievement_impact_score: number;
  
  parse_fidelity: number;
  table_faults: number;
  quant_impact_ratio: string;
  recruiter_pass_time: string;
  google_xyz_adherence: number;
  ats_parseability_schema: number;

  ats_flaws: ATSFlaw[];
  sub_scores: VectorSubScore[];
  role_analysis?: RoleAnalysis;
  company_analysis?: CompanyAnalysis;
  jd_matrix: JDRequirementItem[];
  high_yield_recommendations: string[];
}

export interface GitHubRepoAnalysis {
  repo_name: string;
  description: string;
  technologies: string[];
  technical_complexity: string[];
  evidence: string;
  resume_bullets: string[];
}

export interface RewriteResponse {
  original_text: string;
  rewritten_text: string;
  explanation: string;
}
