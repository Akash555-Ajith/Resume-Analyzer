import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ResumeData, ResumeAnalysisResponse, ResumeVersion } from '../types/resume';
import { api } from '../services/api';

interface BackendStatus {
  online: boolean;
  gemini_configured: boolean;
  model: string;
}

interface ResumeContextType {
  currentResume: ResumeData | null;
  setCurrentResume: React.Dispatch<React.SetStateAction<ResumeData | null>>;
  resumes: ResumeData[];
  loadResumes: () => Promise<void>;
  saveCurrentResume: (resume?: ResumeData) => Promise<ResumeData | null>;
  activeAnalysis: ResumeAnalysisResponse | null;
  setActiveAnalysis: React.Dispatch<React.SetStateAction<ResumeAnalysisResponse | null>>;
  versions: ResumeVersion[];
  loadVersions: (resumeId: string) => Promise<void>;
  createSnapshot: (versionName: string, summary: string) => Promise<void>;
  activePage: string;
  setActivePage: (page: string) => void;
  backendStatus: BackendStatus;
  checkBackendStatus: () => Promise<void>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  selectResume: (resumeId: string) => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<ResumeAnalysisResponse | null>(null);
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [activePage, setActivePage] = useState<string>('landing');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    online: false,
    gemini_configured: false,
    model: 'gemini-2.5-pro'
  });

  const checkBackendStatus = async () => {
    try {
      const data = await api.getHealth();
      setBackendStatus({
        online: data.status === 'online',
        gemini_configured: Boolean(data.gemini_configured),
        model: data.model || 'gemini-2.5-pro'
      });
    } catch {
      setBackendStatus({
        online: false,
        gemini_configured: false,
        model: 'offline'
      });
    }
  };

  const loadResumes = async () => {
    try {
      const list = await api.listResumes();
      setResumes(list);
      if (list.length > 0 && !currentResume) {
        setCurrentResume(list[0]);
      }
    } catch (e) {
      console.warn("Could not load resumes from backend:", e);
    }
  };

  const loadVersions = async (resumeId: string) => {
    try {
      const list = await api.getVersions(resumeId);
      setVersions(list);
    } catch (e) {
      console.warn("Could not load versions:", e);
    }
  };

  const selectResume = async (resumeId: string) => {
    const found = resumes.find(r => r.id === resumeId);
    if (found) {
      setCurrentResume(found);
      await loadVersions(found.id);
    } else {
      try {
        const remote = await api.getResume(resumeId);
        setCurrentResume(remote);
        await loadVersions(remote.id);
      } catch (e) {
        console.error("Failed to load resume:", e);
      }
    }
  };

  const saveCurrentResume = async (resumeToSave?: ResumeData): Promise<ResumeData | null> => {
    const target = resumeToSave || currentResume;
    if (!target) return null;
    try {
      const saved = await api.saveResume(target);
      setCurrentResume(saved);
      await loadResumes();
      return saved;
    } catch (e) {
      console.error("Failed to save resume:", e);
      return null;
    }
  };

  const createSnapshot = async (versionName: string, summary: string) => {
    if (!currentResume) return;
    try {
      const version = await api.createVersion(currentResume.id, versionName, summary, currentResume);
      setVersions(prev => [...prev, version]);
    } catch (e) {
      console.error("Failed to create snapshot:", e);
    }
  };

  useEffect(() => {
    checkBackendStatus();
    loadResumes();
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        currentResume,
        setCurrentResume,
        resumes,
        loadResumes,
        saveCurrentResume,
        activeAnalysis,
        setActiveAnalysis,
        versions,
        loadVersions,
        createSnapshot,
        activePage,
        setActivePage,
        backendStatus,
        checkBackendStatus,
        isLoading,
        setIsLoading,
        selectResume
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
