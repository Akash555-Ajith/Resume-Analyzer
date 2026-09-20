import React, { useState } from 'react';
import { Target, Building2, FileText, CheckCircle2, AlertCircle, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { ResumeData, FullAnalysisResult, JDRequirementItem } from '../../types/resume';
import { apiService } from '../../services/api';

interface JDMatchStudioProps {
  resume: ResumeData;
  targetRole: string;
  setTargetRole: (role: string) => void;
  analysis: FullAnalysisResult;
  setAnalysis: (res: FullAnalysisResult) => void;
  onOpenIDE: () => void;
}

export const JDMatchStudio: React.FC<JDMatchStudioProps> = ({
  resume,
  targetRole,
  setTargetRole,
  analysis,
  setAnalysis,
  onOpenIDE
}) => {
  const [companyName, setCompanyName] = useState('Stripe');
  const [jdText, setJdText] = useState(
    'Seeking a Staff Infrastructure Engineer to design multi-region transaction ledgers, Raft consensus systems, and eBPF zero-copy networking. Must have Go, C++, Python, and Kubernetes experience.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunMatch = async () => {
    setIsAnalyzing(true);
    try {
      const res = await apiService.scoreResume(resume, targetRole, companyName, jdText);
      setAnalysis(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
            REQUISITION AUDIT STUDIO
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            JD Match Studio & Company-Specific Intelligence
          </h1>
        </div>

        <button
          onClick={onOpenIDE}
          className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          Open AI Resume IDE <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Input Form Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-orange" /> Target Role & Company
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-orange outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Company</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Google, Stripe, NVIDIA..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-orange outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Paste Job Description</label>
            <textarea
              rows={6}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste job requirements here..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-brand-orange outline-none"
            />
          </div>

          <button
            onClick={handleRunMatch}
            disabled={isAnalyzing}
            className="w-full py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>Running Gemini Pro JD Matrix Audit...</>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Run Matrix Analysis & Company Fit
              </>
            )}
          </button>
        </div>

        {/* Right Company Insights Card */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">COMPANY INTELLIGENCE</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded">
                VERIFIED CONVENTIONS
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900">
              {companyName} Target Requisition Emphasis
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono">
              "{analysis.company_analysis?.emphasis_advice || `For ${companyName}, emphasize production reliability, high-scale engineering metrics, and clear project impact.`}"
            </p>

            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-semibold text-slate-700">Key Verification Vectors to Highlight:</span>
              <ul className="space-y-1 text-xs text-slate-600">
                {analysis.company_analysis?.key_vectors.map((vec) => (
                  <li key={vec} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{vec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-mono">
            {analysis.company_analysis?.hiring_bar_benchmark || "Exceeds 92% of target candidate hiring bar baseline."}
          </div>
        </div>

      </div>

      {/* Requirement Matrix Table (Requirement | Resume Evidence | Match | Recommendation) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Job Description Requirement Matrix
          </h3>
          <span className="text-xs font-mono text-slate-500">
            {analysis.jd_matrix.length} Requirements Analyzed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase font-mono text-slate-400 bg-slate-50">
                <th className="py-2.5 px-3">REQUIREMENT</th>
                <th className="py-2.5 px-3">RESUME EVIDENCE</th>
                <th className="py-2.5 px-3">MATCH LEVEL</th>
                <th className="py-2.5 px-3">RECOMMENDATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {analysis.jd_matrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold">{item.requirement}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{item.resume_evidence}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        item.match_level === 'Strong'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.match_level === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.match_level}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{item.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
