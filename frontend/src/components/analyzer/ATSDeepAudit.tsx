import React, { useState } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { FullAnalysisResult, ResumeData } from '../../types/resume';
import { apiService } from '../../services/api';

interface ATSDeepAuditProps {
  analysis: FullAnalysisResult;
  resume: ResumeData;
  setResume: (data: ResumeData) => void;
  setAnalysis: (analysis: FullAnalysisResult) => void;
  targetRole: string;
  onOpenIDE: () => void;
}

export const ATSDeepAudit: React.FC<ATSDeepAuditProps> = ({
  analysis,
  resume,
  setResume,
  setAnalysis,
  targetRole,
  onOpenIDE
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    try {
      const parsedData = await apiService.uploadResume(file);
      setResume(parsedData);
      const newScore = await apiService.scoreResume(parsedData, targetRole);
      setAnalysis(newScore);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to parse resume file');
    } finally {
      setIsUploading(false);
    }
  };

  const vectorScores = [
    { label: 'ATS Compatibility', score: analysis.ats_score, color: 'bg-emerald-500' },
    { label: 'Content Quality', score: analysis.content_quality_score, color: 'bg-teal-600' },
    { label: 'Role Relevance', score: analysis.role_relevance_score, color: 'bg-brand-orange' },
    { label: 'Keyword Density', score: analysis.keyword_relevance_score, color: 'bg-brand-orange' },
    { label: 'Experience Strength', score: analysis.experience_strength_score, color: 'bg-blue-600' },
    { label: 'Project Technical Complexity', score: analysis.project_strength_score, color: 'bg-indigo-600' },
    { label: 'Skills Alignment', score: analysis.skills_relevance_score, color: 'bg-emerald-500' },
    { label: 'Formatting Hierarchy', score: analysis.formatting_score, color: 'bg-purple-600' },
    { label: 'Readability Index', score: analysis.readability_score, color: 'bg-amber-500' },
    { label: 'Achievement Impact (X-Y-Z)', score: analysis.achievement_impact_score, color: 'bg-brand-orange' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
            AUTOMATED RESUME PARSING & AUDIT
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            ATS Deep Audit & Flaw Detector
          </h1>
        </div>

        <button
          onClick={onOpenIDE}
          className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          Generate Optimized Resume <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Upload className="w-4 h-4 text-brand-orange" /> Upload Resume for Instant Scan
        </h3>

        <label className="border-2 border-dashed border-slate-300 hover:border-brand-orange rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
          <FileText className="w-10 h-10 text-slate-400 mb-2" />
          <span className="text-sm font-semibold text-slate-700">
            {isUploading ? 'Parsing Resume with Gemini Pro...' : 'Drop your PDF, DOCX, or TXT resume here'}
          </span>
          <span className="text-xs text-slate-500 mt-1">Preserves structure, extracts contact, work history, projects, and skills</span>
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

      {/* 10-Vector Score Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">10-Vector Resume Score Breakdown</h3>
          <span className="text-xs font-mono font-extrabold text-brand-orange">
            Overall: {analysis.overall_score} / 100 PTS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vectorScores.map((v) => (
            <div key={v.label} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{v.label}</span>
                <span className="font-mono font-bold text-slate-900">{v.score}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className={`${v.color} h-full rounded-full`} style={{ width: `${v.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ATS Flaws Section (Problem / Why / Recommendation) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">ATS Flaw Detector & Fixes</h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {analysis.ats_flaws.length} Issues Identified
          </span>
        </div>

        <div className="space-y-4">
          {analysis.ats_flaws.map((flaw) => (
            <div
              key={flaw.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  Problem: {flaw.problem}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-200 font-bold text-slate-700">
                  {flaw.severity} severity
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-700">
                <p>
                  <strong className="text-slate-900">Why it matters:</strong> {flaw.why}
                </p>
                <p className="text-emerald-700 font-semibold bg-emerald-50/80 p-2 rounded border border-emerald-200">
                  <strong>Recommendation:</strong> {flaw.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
