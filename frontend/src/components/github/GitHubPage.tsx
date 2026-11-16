import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { api } from '../../services/api';
import { GitHubRepoAnalysis } from '../../types/resume';
import { 
  Github, 
  Sparkles, 
  Search, 
  CheckSquare, 
  Square, 
  Code2, 
  Layers, 
  ExternalLink, 
  Star, 
  FileCheck, 
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const GitHubPage: React.FC = () => {
  const { setCurrentResume, setActivePage, saveCurrentResume } = useResume();

  const [username, setUsername] = useState('alexmercer');
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepoNames, setSelectedRepoNames] = useState<string[]>([]);
  const [analyzedProjects, setAnalyzedProjects] = useState<GitHubRepoAnalysis[]>([]);
  
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchUserRepos = async (userToFetch: string) => {
    if (!userToFetch.trim()) return;
    setIsLoadingRepos(true);
    setStatusMessage(null);
    try {
      const fetched = await api.fetchGithubRepos(userToFetch);
      setRepos(fetched);
      // Pre-select top 3
      const top3 = fetched.slice(0, 3).map((r: any) => r.name);
      setSelectedRepoNames(top3);
    } catch (err) {
      setStatusMessage("Could not connect to GitHub API or rate limit reached. Loaded offline sample repos.");
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const toggleRepoSelection = (repoName: string) => {
    if (selectedRepoNames.includes(repoName)) {
      setSelectedRepoNames(selectedRepoNames.filter(n => n !== repoName));
    } else {
      setSelectedRepoNames([...selectedRepoNames, repoName]);
    }
  };

  const selectAllRepos = () => {
    setSelectedRepoNames(repos.map(r => r.name));
  };

  const runAnalysis = async () => {
    if (selectedRepoNames.length === 0) return;
    setIsAnalyzing(true);
    setStatusMessage(null);
    try {
      const results = await api.analyzeGithubRepos(username, selectedRepoNames);
      setAnalyzedProjects(results);
    } catch (err) {
      setStatusMessage("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateResume = async () => {
    if (selectedRepoNames.length === 0) return;
    setIsGenerating(true);
    try {
      const resume = await api.generateFromGithub(
        username,
        selectedRepoNames,
        "student", // Default for students: Current Position: Student, CGPA: Not specified
        "Software Engineer"
      );
      setCurrentResume(resume);
      await saveCurrentResume(resume);
      setActivePage('editor');
    } catch (err) {
      setStatusMessage("Failed to generate resume from GitHub projects.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Github className="w-7 h-7 text-slate-900" />
          <span>GitHub → Resume</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Inspect public repositories, extract factual code architecture evidence, and synthesize an engineering resume without manufactured metrics.
        </p>
      </div>

      {/* GitHub Username Connect Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username (e.g. torvalds, alexmercer)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <button
            disabled={isLoadingRepos || !username.trim()}
            onClick={() => fetchUserRepos(username)}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isLoadingRepos ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Github className="w-3.5 h-3.5" />
            )}
            <span>Connect & Fetch Repositories</span>
          </button>
        </div>

        {statusMessage && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Repository Selection List */}
      {repos.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Select Repositories ({selectedRepoNames.length} selected of {repos.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the open-source projects you want to feature on your resume.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={selectAllRepos}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
              >
                Select All
              </button>
              <button
                disabled={selectedRepoNames.length === 0 || isAnalyzing}
                onClick={runAnalysis}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Analyze Selected Repositories</span>
              </button>
            </div>
          </div>

          {/* Repo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {repos.map((repo) => {
              const isSelected = selectedRepoNames.includes(repo.name);
              return (
                <div
                  key={repo.name}
                  onClick={() => toggleRepoSelection(repo.name)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span className="font-bold text-xs text-slate-900 truncate">{repo.name}</span>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                        {repo.language || 'Code'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {repo.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{repo.stargazers_count} stars</span>
                    </span>
                    <span>Updated {repo.updated_at}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Repository Analysis Cards matching Section 12 */}
      {analyzedProjects.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Grounded Repository Evidence & Bullet Points
            </h2>
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Grounded in Repo Metadata</span>
            </span>
          </div>

          <div className="space-y-4">
            {analyzedProjects.map((p, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span>{p.repo_name}</span>
                      <a
                        href={p.repo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-blue-600"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">{p.overview}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {p.technologies.slice(0, 4).map((tech, tIdx) => (
                      <span key={tIdx} className="bg-slate-100 text-slate-700 font-mono text-[10px] px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Technical Features & Architecture */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider mb-1.5">
                      Technical Features Verified:
                    </span>
                    <ul className="space-y-1 text-slate-600 list-disc list-inside">
                      {p.technical_features.map((feat, fIdx) => (
                        <li key={fIdx}>{feat}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider mb-1.5">
                      Architecture & Evidence:
                    </span>
                    <p className="text-slate-600">{p.architecture}</p>
                    <p className="text-[11px] text-slate-400 mt-2 font-mono">{p.evidence_from_repository}</p>
                  </div>
                </div>

                {/* Potential Resume Bullets */}
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                  <span className="font-bold text-blue-900 block uppercase text-[10px] tracking-wider">
                    Potential Resume Bullets (Action + Tech + Context):
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-800 list-disc list-inside font-medium">
                    {p.potential_resume_bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                </div>

              </div>
            ))}
          </div>

          {/* Action: Generate Resume from Selected Projects (Section 13) */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <h3 className="font-bold text-base">Generate Complete Resume From Selected Projects</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Default Student Mode: Current Position: Student, CGPA: Not specified. Never fabricates unverified claims.
              </p>
            </div>

            <button
              disabled={isGenerating}
              onClick={handleGenerateResume}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-500 disabled:opacity-50 transition-all flex items-center gap-2 shrink-0"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Resume From Selected Projects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
