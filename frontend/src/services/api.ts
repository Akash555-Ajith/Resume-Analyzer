import axios from 'axios';
import { ResumeData, FullAnalysisResult, GitHubRepoAnalysis, RewriteResponse } from '../types/resume';

const API_BASE_URL = 'http://localhost:8000/api';

const getHeaders = () => {
  const apiKey = localStorage.getItem('gemini_api_key') || '';
  return {
    'Content-Type': 'application/json',
    'x-gemini-api-key': apiKey,
  };
};

export const apiService = {
  // Upload and parse PDF/DOCX/TXT resume
  uploadResume: async (file: File): Promise<ResumeData> => {
    const formData = new FormData();
    formData.append('file', file);
    const apiKey = localStorage.getItem('gemini_api_key') || '';

    const response = await axios.post(`${API_BASE_URL}/analyze/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-gemini-api-key': apiKey,
      },
    });
    return response.data;
  },

  // Deep ATS analysis and scoring
  scoreResume: async (
    resumeData: ResumeData,
    targetRole: string = 'Software Engineer',
    companyName: string = 'Stripe',
    jobDescription: string = ''
  ): Promise<FullAnalysisResult> => {
    const response = await axios.post(
      `${API_BASE_URL}/analyze/score`,
      {
        resume_data: resumeData,
        target_role: targetRole,
        company_name: companyName,
        job_description: jobDescription,
      },
      { headers: getHeaders() }
    );
    return response.data;
  },

  // Job Description skill matrix comparison
  compareJD: async (
    resumeData: ResumeData,
    jobDescription: string,
    targetRole: string = 'Software Engineer',
    companyName: string = 'Stripe'
  ) => {
    const response = await axios.post(
      `${API_BASE_URL}/jd/compare`,
      {
        resume_data: resumeData,
        job_description: jobDescription,
        target_role: targetRole,
        company_name: companyName,
      },
      { headers: getHeaders() }
    );
    return response.data;
  },

  // GitHub User Repositories & Complexity Analysis
  fetchGitHubRepos: async (username: string) => {
    const response = await axios.get(`${API_BASE_URL}/github/user/${username}`);
    return response.data;
  },

  analyzeGitHubRepos: async (username: string, selectedRepos: string[]): Promise<GitHubRepoAnalysis[]> => {
    const response = await axios.post(
      `${API_BASE_URL}/github/analyze`,
      {
        username,
        selected_repos: selectedRepos,
      },
      { headers: getHeaders() }
    );
    return response.data;
  },

  // Inline AI Rewrite Assistant
  rewriteText: async (
    selectedText: string,
    action: string,
    targetRole: string = 'Software Engineer',
    context: string = ''
  ): Promise<RewriteResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}/rewrite`,
      {
        selected_text: selectedText,
        action: action,
        target_role: targetRole,
        context: context,
      },
      { headers: getHeaders() }
    );
    return response.data;
  },

  // Prompt Resume Generator
  generateFromPrompt: async (prompt: string, userProfile?: any): Promise<ResumeData> => {
    const response = await axios.post(
      `${API_BASE_URL}/generate/prompt`,
      {
        prompt,
        user_profile: userProfile,
      },
      { headers: getHeaders() }
    );
    return response.data;
  },
};
