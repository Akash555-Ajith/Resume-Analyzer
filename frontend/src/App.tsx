import React from 'react';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { AnalyserPage } from './components/analyzer/AnalyserPage';
import { GeneratorPage } from './components/generator/GeneratorPage';
import { GitHubPage } from './components/github/GitHubPage';
import { JobMatchPage } from './components/jobs/JobMatchPage';
import { EditorPage } from './components/editor/EditorPage';
import { ResumesPage } from './components/resumes/ResumesPage';
import { TemplatesPage } from './components/templates/TemplatesPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { SettingsPage } from './components/settings/SettingsPage';

const AppContent: React.FC = () => {
  const { activePage } = useResume();

  // If on landing page, show full-width landing without sidebar
  if (activePage === 'landing') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <LandingPage />
        </main>
      </div>
    );
  }

  // If on editor page, show full-width IDE without sidebar to maximize editing space
  if (activePage === 'editor') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 overflow-hidden">
          <EditorPage />
        </main>
      </div>
    );
  }

  // Standard app workspace pages with Sidebar on left
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {activePage === 'dashboard' && <DashboardPage />}
          {activePage === 'analyze' && <AnalyserPage />}
          {activePage === 'generate' && <GeneratorPage />}
          {activePage === 'github' && <GitHubPage />}
          {activePage === 'job-match' && <JobMatchPage />}
          {activePage === 'resumes' && <ResumesPage />}
          {activePage === 'templates' && <TemplatesPage />}
          {activePage === 'profile' && <ProfilePage />}
          {activePage === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ResumeProvider>
      <AppContent />
    </ResumeProvider>
  );
};
