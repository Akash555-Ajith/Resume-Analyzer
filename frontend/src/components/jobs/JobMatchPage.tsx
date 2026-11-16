import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { api } from '../../services/api';
import { JobMatchResult } from '../../types/resume';
import { 
  Target, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  Layers, 
  Briefcase, 
  RefreshCw,
  FolderGit2
} from 'lucide-react';

export const JobMatchPage: React.FC = () => {
  const { currentResume, setCurrentResume, setActivePage, resumes, selectResume } = useResume();

  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState(currentResume?.target.role || 'Software Engineer');
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleJobDescription = `Senior Backend Engineer
We are looking for a Software Engineer to design high-throughput microservices.
Requirements:
- Strong experience in Python, FastAPI, or Go
- Knowledge of relational databases (PostgreSQL) and caching (Redis)
- Experience with Docker, Kubernetes, and automated CI/CD pipelines
- Familiarity with distributed message queues like Kafka or RabbitMQ
- Excellent API architecture and system performance benchmarking skills`;

  const handleRunMatch = async () => {
    if (!currentResume || !jobDescription.trim()) return;
    setIsMatching(true);
    setErrorMsg(null);
    try {
      const response = await api.matchJob(currentResume, jobDescription, targetRole, false);
      setMatchResult(response.match_result);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Job match analysis failed. Please try again.");
    } finally {
      setIsMatching(false);
    }
  };

  const handleTailorResume = async () => {
    if (!currentResume || !jobDescription.trim()) return;
    setIsTailoring(true);
    setErrorMsg(null);
    try {
      const response = await api.matchJob(currentResume, jobDescription, targetRole, true);
      if (response.tailored_resume) {
        setCurrentResume(response.tailored_resume);
        setActivePage('editor');
      }
    } catch (err: any) {
      setErrorMsg("Failed to tailor resume. Please try again.");
    } finally {
      setIsTailoring(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Target className="w-7 h-7 text-blue-600" />
          <span>Job Match Mode</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Paste a target job posting to uncover missing technical competencies, keyword gaps, and generate a tailored resume version preserving your factual history.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        
        {/* Active Resume Selector & Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Select Active Resume</span>
            </label>
            <select
              value={currentResume?.id || ''}
              onChange={(e) => selectResume(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {resumes.map(r => (
                <option key={r.id} value={r.id}>{r.title} ({r.personal.name})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Role Requisition</span>
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Job Description Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Paste Target Job Description
            </label>
            <button
              type="button"
              onClick={() => setJobDescription(sampleJobDescription)}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Use Sample Requisition
            </button>
          </div>
          <textarea
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste complete job posting description, requirements, and preferred qualifications here..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-normal text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed font-sans"
          />
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            disabled={isMatching || !jobDescription.trim()}
            onClick={handleRunMatch}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isMatching ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Comparing Qualifications Matrix...</span>
              </>
            ) : (
              <>
                <Target className="w-3.5 h-3.5" />
                <span>Run Matrix Match Analysis</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Analysis Output Cards matching Section 20 */}
      {matchResult && (
        <div className="space-y-6">
          
          {/* Top Score Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                Job Description Match Result
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Alignment for {matchResult.target_role}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation against stated requirements and tech competencies.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500">Match Index:</span>
              <span className="text-3xl font-black text-blue-600">
                {matchResult.match_score}%
              </span>
            </div>
          </div>

          {/* 3-Column Skills Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Skills Found */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Skills Found ({matchResult.skills_found.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchResult.skills_found.map((s, i) => (
                  <span key={i} className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-1 rounded-lg text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills Missing */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Skills Missing ({matchResult.skills_missing.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchResult.skills_missing.map((s, i) => (
                  <span key={i} className="bg-rose-50 text-rose-800 border border-rose-100 px-2 py-1 rounded-lg text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills Weakly Demonstrated */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Weakly Demonstrated</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchResult.skills_weakly_demonstrated.map((s, i) => (
                  <span key={i} className="bg-amber-50 text-amber-800 border border-amber-100 px-2 py-1 rounded-lg text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Relevant Projects & Experience Match */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Most Relevant Projects for this Requisition:
              </span>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {matchResult.relevant_projects.map((p, i) => (
                  <li key={i} className="font-medium">{p}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Recommended Keywords to Incorporate:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.recommended_keywords.map((k, i) => (
                  <span key={i} className="bg-blue-50 text-blue-800 border border-blue-100 px-2 py-0.5 rounded text-xs font-semibold">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action: Tailor My Resume */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <h3 className="font-bold text-base">Tailor My Resume For This Requisition</h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Generates a new tailored resume version highlighting matching experience while strictly preserving your factual employment and project history.
              </p>
            </div>

            <button
              disabled={isTailoring}
              onClick={handleTailorResume}
              className="px-6 py-3 rounded-xl bg-white text-blue-950 font-bold text-xs shadow-md hover:bg-blue-50 disabled:opacity-50 transition-all flex items-center gap-2 shrink-0"
            >
              {isTailoring ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Tailored Version...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tailor My Resume</span>
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
