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

export interface ResumeData {
  id: string;
  title: string;
  template_id: string; // classic, modern, minimal, creative, tech, executive, twocolumn, compact
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

export interface SectionFeedback {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  projects: string;
}

export interface SimpleAnalysisResult {
  overall_score: number;
  strengths: string[];
  weaknesses: string[];
  section_feedback: SectionFeedback;
  missing_sections: string[];
  missing_keywords: string[];
  formatting_issues: string[];
  grammar_issues: string[];
  jd_match_score?: number;
  jd_keyword_gaps: string[];
}

export interface DiffItem {
  id: string;
  section: string;
  original_text: string;
  proposed_text: string;
  explanation: string;
}

export interface ChatEditResponse {
  updated_resume: ResumeData;
  diffs: DiffItem[];
  summary_explanation: string;
}

export interface FieldAssistResponse {
  field_name: string;
  suggested_text: string;
  explanation: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  category: 'Classic' | 'Modern' | 'Minimal' | 'Creative' | 'Tech' | 'Executive' | 'Two-column' | 'Compact';
  styleTag: string;
  suggestedUse: string;
  previewImage?: string;
}
