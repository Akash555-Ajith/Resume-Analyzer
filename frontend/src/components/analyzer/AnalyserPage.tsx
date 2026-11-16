import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { api } from '../../services/api';
import { ResumeAnalysisResponse, BulletImprovement, AnalysisIssue } from '../../types/resume';
import { 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  Building2, 
  FileCode, 
  Check, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  Edit3
} from 'lucide-react';

export const AnalyserPage: React.FC = () => {
  const { currentResume, setCurrentResume, activeAnalysis, setActiveAnalysis, setActivePage } = useResume();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState(currentResume?.target.role || 'Software Engineer');
  const [targetCompany, setTargetCompany] = useState(currentResume?.target.company || '');
  const [jobDescription, setJobDescription] = useState(currentResume?.target.job_description || '');
  
  // Pipeline stage tracking
  const [analyzingStage, setAnalyzingStage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'audit' | 'beforeAfter' | 'atsChecks'>('audit');
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);

  const stages = [
    "Uploading...",
    "Extracting content...",
    "Analyzing structure...",
    "Checking ATS compatibility...",
    "Analyzing keywords...",
    "Generating recommendations..."
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx' && ext !== 'txt') {
      setErrorMsg("Please upload a valid PDF, DOCX, or TXT document.");
      return;
    }
    setErrorMsg(null);
    setSelectedFile(file);
  };

  const runAnalysisPipeline = async (fileToAnalyze?: File) => {
    setIsProcessing(true);
    setErrorMsg(null);

    // Simulate pipeline stage progression visually
    for (let i = 0; i < stages.length; i++) {
      setAnalyzingStage(stages[i]);
      await new Promise(r => setTimeout(r, 400));
    }

    try {
      if (fileToAnalyze) {
        const result = await api.uploadAndAnalyze(fileToAnalyze, targetRole, targetCompany, jobDescription);
        setCurrentResume(result.resume);
        setActiveAnalysis(result.analysis);
      } else if (currentResume) {
        const result = await api.evaluateResume(currentResume, targetRole, targetCompany, jobDescription);
        setActiveAnalysis(result);
      } else {
        setErrorMsg("Please select a file to upload or load an existing resume.");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "The AI analysis could not be completed. Please try again.");
    } finally {
      setIsProcessing(false);
      setAnalyzingStage(null);
    }
  };

  const scores = activeAnalysis?.category_scores || {
    ats_compatibility: 87,
    content_quality: 78,
    role_alignment: 84,
    keyword_match: 76,
    formatting: 91,
    project_strength: 82,
    experience_strength: 74
  };

  const applyBulletToResume = (improvement: BulletImprovement) => {
    if (!currentResume) return;
    const updated = { ...currentResume };
    
    // Check if in experience
    let applied = false;
    updated.experience = updated.experience.map(exp => {
      const idx = exp.bullet_points.indexOf(improvement.original);
      if (idx !== -1) {
        const newBullets = [...exp.bullet_points];
        newBullets[idx] = improvement.ai_recommendation.replace(/\s*\(Consider adding a measurable result if available\.\)/g, '');
        applied = true;
        return { ...exp, bullet_points: newBullets };
      }
      return exp;
    });

    if (!applied) {
      updated.projects = updated.projects.map(proj => {
        const idx = proj.bullet_points.indexOf(improvement.original);
        if (idx !== -1) {
          const newBullets = [...proj.bullet_points];
          newBullets[idx] = improvement.ai_recommendation.replace(/\s*\(Consider adding a measurable result if available\.\)/g, '');
          return { ...proj, bullet_points: newBullets };
        }
        return proj;
      });
    }

    setCurrentResume(updated);
    api.saveResume(updated);
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Analyze Resume
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Deep diagnostic audit covering ATS compatibility, content quality, role alignment, and before/after bullet improvements.
        </p>
      </div>

      {/* Upload & Context Parameters Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        
        {/* Upload Zone */}
        <div 
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
          }`}
        >
          <input
            type="file"
            id="resume-file-input"
            accept=".pdf,.docx,.txt"
            onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])}
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <label 
                htmlFor="resume-file-input"
                className="text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer underline underline-offset-2"
              >
                Upload a file
              </label>
              <span className="text-sm text-slate-600"> or drag and drop</span>
              <p className="text-xs text-slate-400 mt-1">PDF, DOCX, or TXT up to 10MB</p>
            </div>

            {selectedFile && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>{selectedFile.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Target Role & Company Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Role</span>
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {[
                "Software Engineer",
                "Backend Engineer",
                "Frontend Engineer",
                "Data Scientist",
                "ML Engineer",
                "FPGA Engineer",
                "VLSI Engineer",
                "Embedded Engineer",
                "Product Manager",
                "Project Manager",
                "Researcher",
                "Student / Fresh Graduate"
              ].map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Company (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Google, Stripe, NVIDIA, Startups"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Optional Job Description Paste */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-slate-400" />
            <span>Target Job Description (Optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Paste job posting text here to extract keywords, required skills, and qualification match matrix..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-normal text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Action Trigger Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            {currentResume ? `Active loaded resume: ${currentResume.title}` : 'No resume loaded yet'}
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={isProcessing}
              onClick={() => runAnalysisPipeline(selectedFile || undefined)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{analyzingStage || 'Processing...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Complete Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Progress Stage Pipeline Visualization when processing */}
      {isProcessing && (
        <div className="bg-white rounded-2xl border border-blue-200 shadow-md p-6 animate-pulse space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-blue-700 uppercase">
            <span>AI Diagnostic Pipeline Active</span>
            <span>{analyzingStage}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {stages.map((stg, i) => (
              <div 
                key={i}
                className={`p-2 rounded-lg text-center text-[10px] font-semibold transition-all ${
                  stg === analyzingStage
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {stg}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Results Display */}
      {activeAnalysis && (
        <div className="space-y-6">
          
          {/* Health Score & Category Cards */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Diagnostic Health Audit Completed</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Overall Resume Health
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{activeAnalysis.summary_verdict}</p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500">Score:</span>
                <span className="text-3xl font-black text-emerald-600">
                  {activeAnalysis.overall_health} <span className="text-xs font-normal text-slate-400">/ 100</span>
                </span>
              </div>
            </div>

            {/* 7 Category Score Cards matching Section 7 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: 'ATS Compatibility', score: scores.ats_compatibility, color: 'text-emerald-600' },
                { label: 'Content Quality', score: scores.content_quality, color: 'text-blue-600' },
                { label: 'Role Alignment', score: scores.role_alignment, color: 'text-indigo-600' },
                { label: 'Keyword Match', score: scores.keyword_match, color: 'text-amber-600' },
                { label: 'Formatting', score: scores.formatting, color: 'text-purple-600' },
                { label: 'Project Strength', score: scores.project_strength, color: 'text-teal-600' },
                { label: 'Experience Strength', score: scores.experience_strength, color: 'text-sky-600' },
              ].map((c, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <div className="text-[10px] font-semibold text-slate-500 truncate" title={c.label}>
                    {c.label}
                  </div>
                  <div className={`text-xl font-bold mt-1 ${c.color}`}>{c.score}</div>
                </div>
              ))}
            </div>

            {/* Sub-Tabs: Issues vs Before/After vs ATS Checks */}
            <div className="flex border-b border-slate-200 text-xs font-bold gap-6 pt-2">
              <button
                onClick={() => setActiveTab('audit')}
                className={`pb-2.5 transition-colors border-b-2 ${
                  activeTab === 'audit' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Diagnostic Issues ({activeAnalysis.critical_issues.length + activeAnalysis.recommended_improvements.length + activeAnalysis.optional_improvements.length})
              </button>
              <button
                onClick={() => setActiveTab('beforeAfter')}
                className={`pb-2.5 transition-colors border-b-2 ${
                  activeTab === 'beforeAfter' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Before / After Improvements ({activeAnalysis.before_after_improvements.length})
              </button>
              <button
                onClick={() => setActiveTab('atsChecks')}
                className={`pb-2.5 transition-colors border-b-2 ${
                  activeTab === 'atsChecks' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                ATS Technical Checks
              </button>
            </div>

            {/* TAB 1: Diagnostic Issues */}
            {activeTab === 'audit' && (
              <div className="space-y-6 pt-2">
                {/* Critical Issues */}
                {activeAnalysis.critical_issues.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Critical Issues (High Priority)</span>
                    </div>
                    {activeAnalysis.critical_issues.map((issue) => (
                      <IssueCard 
                        key={issue.id} 
                        issue={issue} 
                        isExpanded={expandedIssueId === issue.id}
                        toggleExpand={() => setExpandedIssueId(expandedIssueId === issue.id ? null : issue.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Recommended Improvements */}
                {activeAnalysis.recommended_improvements.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
                      <Info className="w-4 h-4 text-amber-600" />
                      <span>Recommended Improvements</span>
                    </div>
                    {activeAnalysis.recommended_improvements.map((issue) => (
                      <IssueCard 
                        key={issue.id} 
                        issue={issue} 
                        isExpanded={expandedIssueId === issue.id}
                        toggleExpand={() => setExpandedIssueId(expandedIssueId === issue.id ? null : issue.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Optional Improvements */}
                {activeAnalysis.optional_improvements.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Optional Refinements</span>
                    </div>
                    {activeAnalysis.optional_improvements.map((issue) => (
                      <IssueCard 
                        key={issue.id} 
                        issue={issue} 
                        isExpanded={expandedIssueId === issue.id}
                        toggleExpand={() => setExpandedIssueId(expandedIssueId === issue.id ? null : issue.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Before / After Improvements */}
            {activeTab === 'beforeAfter' && (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-slate-500">
                  Real bullet point revisions with strong action verbs and impact framing. No fake metrics are invented.
                </p>
                {activeAnalysis.before_after_improvements.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">{item.entry_title}</span>
                      <span className="text-[11px] font-medium text-slate-400">{item.section}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-100">
                        <span className="font-bold text-rose-800 block mb-1 uppercase text-[10px]">Original:</span>
                        <p className="text-slate-700 italic">«{item.original}»</p>
                      </div>

                      <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100">
                        <span className="font-bold text-emerald-800 block mb-1 uppercase text-[10px]">AI Recommendation:</span>
                        <p className="text-slate-800 font-medium">«{item.ai_recommendation}»</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500">{item.explanation}</span>
                      <button
                        onClick={() => applyBulletToResume(item)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1 self-start sm:self-auto"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Apply to Resume</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: ATS Technical Checks */}
            {activeTab === 'atsChecks' && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(activeAnalysis.ats_checks || {}).map(([key, val]) => (
                    <div key={key} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <span className="font-medium text-slate-700">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      {val ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Passed
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" /> Flagged
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Open in Editor CTA Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActivePage('editor')}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Open in Visual Editor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

interface IssueCardProps {
  issue: AnalysisIssue;
  isExpanded: boolean;
  toggleExpand: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, isExpanded, toggleExpand }) => {
  const badgeColor = {
    critical: 'bg-rose-100 text-rose-800 border-rose-200',
    recommended: 'bg-amber-100 text-amber-800 border-amber-200',
    optional: 'bg-blue-100 text-blue-800 border-blue-200',
  }[issue.priority];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden transition-all">
      <div 
        onClick={toggleExpand}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50"
      >
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${badgeColor}`}>
            {issue.priority}
          </span>
          <h4 className="font-bold text-xs text-slate-800">{issue.title}</h4>
        </div>
        <div className="text-slate-400">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-2.5 text-xs bg-slate-50/30">
          <div>
            <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">Problem:</span>
            <p className="text-slate-600 mt-0.5">{issue.problem}</p>
          </div>
          <div>
            <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">Why it matters:</span>
            <p className="text-slate-600 mt-0.5">{issue.why_it_matters}</p>
          </div>
          <div>
            <span className="font-bold text-emerald-800 block uppercase text-[10px] tracking-wider">Recommended change:</span>
            <p className="text-emerald-900 font-medium mt-0.5">{issue.recommended_change}</p>
          </div>
        </div>
      )}
    </div>
  );
};
