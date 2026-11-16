import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { 
  Sparkles, 
  Wand2, 
  Github, 
  Target, 
  ShieldCheck, 
  FileText, 
  ArrowUpRight, 
  Plus, 
  Clock, 
  Layers, 
  CheckCircle2, 
  BarChart3,
  ExternalLink
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentResume, resumes, activeAnalysis, setActivePage, selectResume } = useResume();

  const healthScores = activeAnalysis?.category_scores || {
    ats_compatibility: 87,
    content_quality: 78,
    role_alignment: 82,
    keyword_match: 74,
    formatting: 91,
    project_strength: 82,
    experience_strength: 74
  };

  const sampleRecentResumes = [
    { id: 'master-1', title: 'Software Engineer Resume', role: 'Software Engineer', template: 'Modern', date: 'Edited 2h ago' },
    { id: 'res-backend', title: 'Backend Engineer Resume', role: 'Backend Engineer', template: 'Technical', date: 'Edited yesterday' },
    { id: 'res-fpga', title: 'FPGA Engineer Resume', role: 'FPGA Engineer', template: 'ATS Classic', date: 'Edited 3d ago' },
    { id: 'res-research', title: 'Research Resume', role: 'Researcher', template: 'Academic', date: 'Edited 1w ago' },
  ];

  const displayResumes = resumes.length > 0 ? resumes.map(r => ({
    id: r.id,
    title: r.title,
    role: r.target.role || r.personal.title || 'Engineer',
    template: r.template_id.charAt(0).toUpperCase() + r.template_id.slice(1),
    date: r.updated_at ? new Date(r.updated_at).toLocaleDateString() : 'Active'
  })) : sampleRecentResumes;

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back! Monitor your resume health, manage active dossiers, and tailor for roles.
          </p>
        </div>

        {/* Quick Actions Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActivePage('analyze')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-xs hover:bg-blue-700 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Analyze Resume</span>
          </button>
          <button
            onClick={() => setActivePage('generate')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs shadow-xs hover:bg-slate-800 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Resume</span>
          </button>
        </div>
      </div>

      {/* Resume Health Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-none">Resume Health</h2>
              <p className="text-xs text-slate-500 mt-1">Latest diagnostic scoring for {currentResume?.title || 'active resume'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Overall Health:</span>
            <span className="text-2xl font-black text-emerald-600">
              {activeAnalysis?.overall_health || 87} <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </span>
          </div>
        </div>

        {/* Health Vector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
          {[
            { label: 'ATS Compatibility', value: healthScores.ats_compatibility, target: '87%', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { label: 'Content Quality', value: healthScores.content_quality, target: '78%', color: 'bg-blue-50 text-blue-700 border-blue-100' },
            { label: 'Role Match', value: healthScores.role_alignment, target: '82%', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
            { label: 'Keyword Match', value: healthScores.keyword_match, target: '74%', color: 'bg-amber-50 text-amber-700 border-amber-100' },
            { label: 'Formatting', value: healthScores.formatting, target: '91%', color: 'bg-purple-50 text-purple-700 border-purple-100' },
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${item.color}`}>
              <div className="text-[11px] font-semibold text-slate-600 truncate">{item.label}</div>
              <div className="text-2xl font-extrabold mt-1 text-slate-900">{item.value}%</div>
              <div className="w-full bg-white/80 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-current h-full rounded-full" 
                  style={{ width: `${item.value}%` }} 
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
          <span>Target Standard: High-bar engineering & ATS compliance verified.</span>
          <button 
            onClick={() => setActivePage('analyze')}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
          >
            <span>View Full Diagnostic Audit</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Actions 4-Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div 
            onClick={() => setActivePage('analyze')}
            className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">+ Analyze Resume</h4>
            <p className="text-xs text-slate-500 mt-1">Upload PDF, DOCX, or TXT for multi-vector ATS scoring.</p>
          </div>

          <div 
            onClick={() => setActivePage('generate')}
            className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Wand2 className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">+ Generate Resume</h4>
            <p className="text-xs text-slate-500 mt-1">Use guided wizard or natural language AI prompt generator.</p>
          </div>

          <div 
            onClick={() => setActivePage('github')}
            className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Github className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">+ Generate From GitHub</h4>
            <p className="text-xs text-slate-500 mt-1">Extract factual bullets from your code repos without fake metrics.</p>
          </div>

          <div 
            onClick={() => setActivePage('job-match')}
            className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Target className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">+ Analyze Job Description</h4>
            <p className="text-xs text-slate-500 mt-1">Compare against target job postings and tailor keywords.</p>
          </div>

        </div>
      </div>

      {/* Recent Resumes Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Recent Resumes
          </h3>
          <button 
            onClick={() => setActivePage('resumes')}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All ({displayResumes.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayResumes.slice(0, 4).map((r) => (
            <div 
              key={r.id}
              onClick={() => {
                selectResume(r.id);
                setActivePage('editor');
              }}
              className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {r.template}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {r.date}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{r.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{r.role}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Open Editor</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
