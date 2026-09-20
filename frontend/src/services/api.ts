import axios from 'axios';
import { ResumeData, SimpleAnalysisResult, ChatEditResponse, FieldAssistResponse } from '../types/resume';

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

  // Simple structured analysis
  scoreResumeSimple: async (
    resumeData: ResumeData,
    jobDescription: string = ''
  ): Promise<SimpleAnalysisResult> => {
    const response = await axios.post(
      `${API_BASE_URL}/analyze/simple`,
      {
        resume_data: resumeData,
        job_description: jobDescription,
      },
      { headers: getHeaders() }
    );
    return response.data;
  },

  // Plain language chat edit with before/after diffs
  plainLanguageChatEdit: async (
    resumeData: ResumeData,
    instruction: string
  ): Promise<ChatEditResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}/edit/chat`,
      {
        resume_data: resumeData,
        instruction: instruction,
      },
      { headers: getHeaders() }
    );
    return response.data;
  },

  // Per-field AI writing assist
  assistField: async (
    fieldName: string,
    roughNotes: string,
    targetRole: string = 'Software Engineer'
  ): Promise<FieldAssistResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}/assist/field`,
      {
        field_name: fieldName,
        rough_notes: roughNotes,
        target_role: targetRole,
      },
      { headers: getHeaders() }
    );
    return response.data;
  },
};
