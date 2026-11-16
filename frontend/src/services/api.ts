import axios from 'axios';
import {
  ResumeData, ResumeAnalysisResponse, JobMatchResult,
  GitHubRepoAnalysis, ResumeVersion, ValidationResult,
  InlineAssistResponse, AICommandResponse
} from '../types/resume';

const API_BASE = 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

export const api = {
  // Health & Status
  async getHealth() {
    try {
      const res = await client.get('/health');
      return res.data;
    } catch {
      return { status: 'offline', gemini_configured: false, model: 'offline-mode' };
    }
  },

  // Analyze
  async uploadAndAnalyze(file: File, targetRole: string, targetCompany: string, jobDescription: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_role', targetRole);
    formData.append('target_company', targetCompany);
    formData.append('job_description', jobDescription);

    const res = await client.post<{ resume: ResumeData; analysis: ResumeAnalysisResponse }>('/analyze/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  async evaluateResume(resumeData: ResumeData, targetRole: string, targetCompany: string, jobDescription: string) {
    const res = await client.post<ResumeAnalysisResponse>('/analyze/evaluate', {
      resume_data: resumeData,
      target_role: targetRole,
      target_company: targetCompany,
      job_description: jobDescription
    });
    return res.data;
  },

  async validateResume(resumeData: ResumeData) {
    const res = await client.post<ValidationResult>('/analyze/validate', resumeData);
    return res.data;
  },

  // Generate
  async generateFromPrompt(prompt: string, careerStage: string, targetRole: string) {
    const res = await client.post<ResumeData>('/generate/prompt', {
      prompt,
      career_stage: careerStage,
      target_role: targetRole
    });
    return res.data;
  },

  async generateGuided(resumeData: ResumeData) {
    const res = await client.post<ResumeData>('/generate/guided', resumeData);
    return res.data;
  },

  // GitHub
  async fetchGithubRepos(username: string) {
    const res = await client.get<{ username: string; repositories: any[] }>(`/github/user/${username}`);
    return res.data.repositories;
  },

  async analyzeGithubRepos(username: string, selectedRepos: string[]) {
    const res = await client.post<GitHubRepoAnalysis[]>('/github/analyze', {
      username,
      selected_repos: selectedRepos
    });
    return res.data;
  },

  async generateFromGithub(username: string, selectedRepos: string[], careerStage: string, targetRole: string) {
    const res = await client.post<ResumeData>('/github/generate-resume', {
      username,
      selected_repos: selectedRepos,
      career_stage: careerStage,
      target_role: targetRole
    });
    return res.data;
  },

  // Job Match
  async matchJob(resumeData: ResumeData, jobDescription: string, targetRole: string, tailorResume: boolean = false) {
    const res = await client.post<{ match_result: JobMatchResult; tailored_resume?: ResumeData }>('/jobs/match', {
      resume_data: resumeData,
      job_description: jobDescription,
      target_role: targetRole,
      tailor_resume: tailorResume
    });
    return res.data;
  },

  // Editor AI
  async executeCommand(resumeData: ResumeData, command: string) {
    const res = await client.post<AICommandResponse>('/edit/command', {
      resume_data: resumeData,
      command
    });
    return res.data;
  },

  async inlineAssist(action: string, selectedText: string, context: string = '', targetRole: string = '', jobDescription: string = '') {
    const res = await client.post<InlineAssistResponse>('/edit/assist', {
      action,
      selected_text: selectedText,
      context,
      target_role: targetRole,
      job_description: jobDescription
    });
    return res.data;
  },

  // Resumes Storage CRUD
  async listResumes() {
    const res = await client.get<ResumeData[]>('/resumes');
    return res.data;
  },

  async getResume(id: string) {
    const res = await client.get<ResumeData>(`/resumes/${id}`);
    return res.data;
  },

  async saveResume(resume: ResumeData) {
    const res = await client.post<ResumeData>('/resumes', resume);
    return res.data;
  },

  async deleteResume(id: string) {
    const res = await client.delete(`/resumes/${id}`);
    return res.data;
  },

  async duplicateResume(id: string) {
    const res = await client.post<ResumeData>(`/resumes/${id}/duplicate`);
    return res.data;
  },

  // Versioning
  async getVersions(resumeId: string) {
    const res = await client.get<ResumeVersion[]>(`/resumes/${resumeId}/versions`);
    return res.data;
  },

  async createVersion(resumeId: string, versionName: string, changeSummary: string, resumeData: ResumeData) {
    const res = await client.post<ResumeVersion>(`/resumes/${resumeId}/versions`, {
      version_name: versionName,
      change_summary: changeSummary,
      resume_data: resumeData
    });
    return res.data;
  },

  // Master Profile
  async getProfile() {
    const res = await client.get<ResumeData>('/resumes/user/profile');
    return res.data;
  },

  async saveProfile(profile: ResumeData) {
    const res = await client.post<ResumeData>('/resumes/user/profile', profile);
    return res.data;
  },

  // Export URLs
  getDocxUrl(id: string) {
    return `${API_BASE}/resumes/${id}/export/docx`;
  },

  getTxtUrl(id: string) {
    return `${API_BASE}/resumes/${id}/export/txt`;
  }
};
