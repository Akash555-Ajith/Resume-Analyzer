import React, { useState } from 'react';
import { Github, Code2, Sparkles, Check, ArrowRight, FolderGit2 } from 'lucide-react';
import { ResumeData, GitHubRepoAnalysis, ProjectEntry } from '../../types/resume';
import { apiService } from '../../services/api';

interface GithubScannerProps {
  resume: ResumeData;
  setResume: (res: ResumeData) => void;
  onOpenIDE: () => void;
}

export const GithubScanner: React.FC<GithubScannerProps> = ({
  resume,
  setResume,
  onOpenIDE
}) => {
  const [username, setUsername] = useState('erikrostad');
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [analysisResults, setAnalysisResults] = useState<GitHubRepoAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleConnect = async () => {
    if (!username.trim()) return;
    setIsLoading(true);
    try {
      const data = await apiService.fetchGitHubRepos(username);
      setRepos(data.repositories || []);
      setSelectedRepos((data.repositories || []).slice(0, 3).map((r: any) => r.name));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeRepos = async () => {
    if (selectedRepos.length === 0) return;
    setIsAnalyzing(true);
    try {
      const results = await apiService.analyzeGitHubRepos(username, selectedRepos);
      setAnalysisResults(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImportToResume = (repo: GitHubRepoAnalysis) => {
    const newProject: ProjectEntry = {
      id: `gh-${Date.now()}`,
      name: repo.repo_name,
      technologies: repo.technologies,
      description: repo.description,
      bullet_points: repo.resume_bullets
    };

    setResume({
      ...resume,
      projects: [newProject, ...resume.projects]
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
            REPOSITORY CODE INTELLIGENCE
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            GitHub Repository to Resume AI
          </h1>
        </div>

        <button
          onClick={onOpenIDE}
          className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          View in Resume IDE <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* GitHub Username Input */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Github className="w-4 h-4 text-slate-900" /> Connect Public GitHub Profile
        </h3>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="GitHub Username"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-brand-orange outline-none"
          />
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            {isLoading ? 'Fetching Repos...' : 'Fetch Repositories'}
          </button>
        </div>
      </div>

      {/* Repositories List */}
      {repos.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Select Repositories to Analyze</h3>
            <button
              onClick={handleAnalyzeRepos}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4" /> {isAnalyzing ? 'Analyzing Technical Complexity...' : 'Extract Factual Bullet Points'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {repos.map((repo) => {
              const isSelected = selectedRepos.includes(repo.name);
              return (
                <div
                  key={repo.name}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedRepos(selectedRepos.filter(r => r !== repo.name));
                    } else {
                      setSelectedRepos([...selectedRepos, repo.name]);
                    }
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected ? 'border-brand-orange bg-orange-50/20' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">{repo.name}</span>
                    <span className="text-[10px] font-mono font-semibold text-slate-500">{repo.language}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{repo.description || 'No description provided'}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analysis & Extracted Bullets */}
      {analysisResults.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Extracted Factual Project Entries</h3>

          <div className="space-y-4">
            {analysisResults.map((analysis) => (
              <div key={analysis.repo_name} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{analysis.repo_name}</h4>
                    <span className="text-[10px] font-mono text-slate-500">Tech: {analysis.technologies.join(', ')}</span>
                  </div>
                  <button
                    onClick={() => handleImportToResume(analysis)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Add to Resume
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Factual Action Bullets (Action + Tech + Context + Result)</span>
                  <ul className="space-y-1 text-xs text-slate-700 font-mono">
                    {analysis.resume_bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-brand-orange font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
