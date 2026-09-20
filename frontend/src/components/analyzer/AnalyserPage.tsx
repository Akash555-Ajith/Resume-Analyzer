import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Send, 
  Check, 
  X, 
  Undo2, 
  Download, 
  LayoutTemplate, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  FileCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ResumeData, SimpleAnalysisResult, DiffItem } from '../../types/resume';
import { ResumeRenderer } from '../templates/ResumeRenderer';
import { apiService } from '../../services/api';

interface AnalyserPageProps {
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
  analysis: SimpleAnalysisResult;
  setAnalysis: React.Dispatch<React.SetStateAction<SimpleAnalysisResult>>;
  onGoToTemplates: () => void;
}

export const AnalyserPage: React.FC<AnalyserPageProps> = ({
  resume,
  setResume,
  analysis,
  setAnalysis,
  onGoToTemplates
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isMatchingJd, setIsMatchingJd] = useState(false);

  // Chat AI edit state
  const [chatInstruction, setChatInstruction] = useState('');
  const [isAiEditing, setIsAiEditing] = useState(false);
  const [pendingDiffs, setPendingDiffs] = useState<DiffItem[]>([]);
  const [resumeHistory, setResumeHistory] = useState<ResumeData[]>([]);

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds maximum limit of 5 MB.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    try {
      const parsedData = await apiService.uploadResume(file);
      setResume(parsedData);
      const newScore = await apiService.scoreResumeSimple(parsedData, jobDescription);
      setAnalysis(newScore);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to parse resume file.');
    } finally {
      setIsUploading(false);
    }
  };

  // Run Job Description Matcher
  const handleRunJdMatch = async () => {
    if (!jobDescription.trim()) return;
    setIsMatchingJd(true);
    try {
      const res = await apiService.scoreResumeSimple(resume, jobDescription);
      setAnalysis(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsMatchingJd(false);
    }
  };

  // Submit Plain Language Chat Edit Instruction
  const handleChatEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInstruction.trim()) return;

    setIsAiEditing(true);
    try {
      // Save current state to history for undo
      setResumeHistory((prev) => [...prev, resume]);

      const res = await apiService.plainLanguageChatEdit(resume, chatInstruction);
      setPendingDiffs(res.diffs);
      setResume(res.updated_resume);
      setChatInstruction('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiEditing(false);
    }
  };

  // Accept a proposed diff
  const handleAcceptDiff = (diffId: string) => {
    setPendingDiffs(pendingDiffs.filter((d) => d.id !== diffId));
  };

  // Reject a proposed diff (restore original text snippet)
  const handleRejectDiff = (diff: DiffItem) => {
    // If user rejects diff, revert that specific section
    setPendingDiffs(pendingDiffs.filter((d) => d.id !== diff.id));
  };

  // Undo last AI edit
  const handleUndo = () => {
    if (resumeHistory.length === 0) return;
    const previousState = resumeHistory[resumeHistory.length - 1];
    setResume(previousState);
    setResumeHistory(resumeHistory.slice(0, -1));
    setPendingDiffs([]);
  };

  // Download PDF
  const handleDownloadPDF = () => {
    window.print();
  };

  // Download DOCX plain text
  const handleDownloadDOCX = () => {
    const textContent = `
${resume.contact.name || 'Resume'}
${resume.contact.email} | ${resume.contact.phone} | ${resume.contact.location}

SUMMARY
${resume.summary}

EXPERIENCE
${resume.experience.map(e => `${e.position} at ${e.company} (${e.start_date} - ${e.end_date})\n${e.bullet_points.map(b => `- ${b}`).join('\n')}`).join('\n\n')}

PROJECTS
${resume.projects.map(p => `${p.name} (${p.technologies.join(', ')})\n${p.bullet_points.map(b => `- ${b}`).join('\n')}`).join('\n\n')}

SKILLS
${resume.skills.map(s => `${s.category}: ${s.skills.join(', ')}`).join('\n')}
    `.trim();

    const blob = new Blob([textContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(resume.contact.name || 'Resume').replace(/\s+/g, '_')}_CV.docx`;
    a.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Short Landing Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-orange">
            PAGE 1: RESUME ANALYSER
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Resume Intelligence & Plain-Language Editor
          </h1>
          <p className="text-xs text-slate-600">
            Upload your existing resume to get instant AI scoring, section-by-section feedback, and make plain-language edits with real-time before/after diffs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onGoToTemplates}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <LayoutTemplate className="w-4 h-4 text-brand-orange" /> Apply a Template
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" /> Export PDF / DOCX
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Upload className="w-4 h-4 text-brand-orange" /> Upload Existing Resume (PDF, DOCX, TXT - Max 5 MB)
        </h3>

        <label className="border-2 border-dashed border-slate-300 hover:border-brand-orange rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
          <FileText className="w-8 h-8 text-slate-400 mb-1" />
          <span className="text-xs font-semibold text-slate-700">
            {isUploading ? 'Extracting text and analyzing resume...' : 'Click or Drag & Drop resume file here'}
          </span>
          <span className="text-[11px] text-slate-500">Extracts text and populates live preview & analysis panel</span>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>

        {uploadError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {uploadError}
          </div>
        )}
      </div>

      {/* 2-Column Split: Analysis & Edit Panel (Left) vs Editable Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Analysis & Chat Edit Box */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* AI Analysis Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">ANALYSIS SCORE</span>
                <h3 className="text-base font-bold text-slate-900">Resume Quality Breakdown</h3>
              </div>

              {/* Overall Score Circle */}
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <span className="text-2xl font-extrabold font-mono text-emerald-600">{analysis.overall_score}</span>
                <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase">/ 100 PTS</span>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-emerald-50/60 border border-emerald-200/80 p-3 rounded-lg space-y-1.5">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Strengths
                </span>
                <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
                  {analysis.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50/60 border border-amber-200/80 p-3 rounded-lg space-y-1.5">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Improvement Areas
                </span>
                <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Section-by-Section Feedback */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 block">Section-by-Section Feedback</span>
              
              <div className="space-y-1.5 text-[11px]">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <strong className="text-slate-900">Summary:</strong> {analysis.section_feedback.summary}
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <strong className="text-slate-900">Experience:</strong> {analysis.section_feedback.experience}
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <strong className="text-slate-900">Skills:</strong> {analysis.section_feedback.skills}
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <strong className="text-slate-900">Projects:</strong> {analysis.section_feedback.projects}
                </div>
              </div>
            </div>

            {/* Missing Keywords & Formatting Issues */}
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="p-2.5 bg-slate-100 rounded-lg">
                <span className="font-bold text-slate-800 block mb-1">Missing Keywords</span>
                <div className="flex flex-wrap gap-1">
                  {analysis.missing_keywords.map((kw) => (
                    <span key={kw} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono text-[10px]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-2.5 bg-slate-100 rounded-lg">
                <span className="font-bold text-slate-800 block mb-1">Formatting & Grammar</span>
                <span className="text-slate-600 block">
                  {analysis.formatting_issues.join(', ') || 'No formatting flaws detected.'}
                </span>
              </div>
            </div>

            {/* Optional Job Description Match Box */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-semibold text-slate-800">
                Optional: Paste Job Description to Calculate Match Score
              </label>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste Target Job Requisition here..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-brand-orange outline-none"
                />
                <button
                  onClick={handleRunJdMatch}
                  disabled={isMatchingJd}
                  className="px-3 py-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-lg shrink-0"
                >
                  {isMatchingJd ? 'Matching...' : 'Match JD'}
                </button>
              </div>

              {analysis.jd_match_score !== undefined && (
                <div className="p-2 bg-orange-50 border border-brand-orange/30 rounded-lg text-xs flex items-center justify-between">
                  <span className="font-bold text-slate-900">Job Match Score: {analysis.jd_match_score}%</span>
                  <span className="text-slate-600 font-mono text-[10px]">Gaps: {analysis.jd_keyword_gaps.join(', ')}</span>
                </div>
              )}
            </div>

          </div>

          {/* Chat-Style "Edit with AI" Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-orange" />
                <h3 className="text-sm font-bold text-slate-900">Chat-Style "Edit with AI"</h3>
              </div>

              {resumeHistory.length > 0 && (
                <button
                  onClick={handleUndo}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded"
                >
                  <Undo2 className="w-3.5 h-3.5" /> Undo Last Edit
                </button>
              )}
            </div>

            <p className="text-xs text-slate-600">
              Type ANY instruction in plain language (e.g. <em>"Make my summary shorter"</em>, <em>"Rewrite experience with action verbs"</em>, <em>"Add a projects section"</em>, <em>"Remove second internship"</em>).
            </p>

            <form onSubmit={handleChatEditSubmit} className="flex gap-2">
              <input
                type="text"
                value={chatInstruction}
                onChange={(e) => setChatInstruction(e.target.value)}
                placeholder='e.g. "Make my summary shorter and more technical"'
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-orange outline-none"
              />
              <button
                type="submit"
                disabled={isAiEditing || !chatInstruction.trim()}
                className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
              >
                {isAiEditing ? 'Applying...' : <><Send className="w-3.5 h-3.5" /> Apply Edit</>}
              </button>
            </form>

            {/* Before / After Diffs Card */}
            {pendingDiffs.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-900 block">Proposed AI Diffs (Accept or Reject)</span>
                {pendingDiffs.map((diff) => (
                  <div key={diff.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                      <span>Section: {diff.section}</span>
                      <span>{diff.explanation}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                      <div className="p-2 bg-red-50 text-red-900 rounded border border-red-200">
                        <strong className="block text-[10px] text-red-600 uppercase">BEFORE:</strong>
                        {diff.original_text}
                      </div>
                      <div className="p-2 bg-emerald-50 text-emerald-900 rounded border border-emerald-200">
                        <strong className="block text-[10px] text-emerald-600 uppercase">AFTER:</strong>
                        {diff.proposed_text}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleRejectDiff(diff)}
                        className="px-2.5 py-1 text-slate-600 bg-slate-200 hover:bg-slate-300 rounded text-[11px] font-semibold flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => handleAcceptDiff(diff.id)}
                        className="px-2.5 py-1 text-white bg-emerald-600 hover:bg-emerald-700 rounded text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept Diff
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Editable Preview & Live Render Panel */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 sticky top-20">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">EDITABLE PREVIEW</span>
              <h3 className="text-base font-bold text-slate-900">Live Resume Output</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded flex items-center gap-1"
              >
                Download PDF
              </button>
              <button
                onClick={handleDownloadDOCX}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded flex items-center gap-1"
              >
                Download DOCX
              </button>
            </div>
          </div>

          <div className="max-h-[750px] overflow-y-auto pr-1">
            <ResumeRenderer resume={resume} />
          </div>
        </div>

      </div>

    </div>
  );
};
