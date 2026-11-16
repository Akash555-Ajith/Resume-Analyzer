import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { api } from '../../services/api';
import { 
  FolderGit2, 
  Plus, 
  Copy, 
  Trash2, 
  Edit3, 
  Download, 
  Calendar, 
  Briefcase, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const ResumesPage: React.FC = () => {
  const { resumes, loadResumes, selectResume, setActivePage } = useResume();
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.duplicateResume(id);
      await loadResumes();
      setActionMsg("Resume duplicated successfully!");
      setTimeout(() => setActionMsg(null), 3000);
    } catch {
      setActionMsg("Failed to duplicate resume.");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (resumes.length <= 1) {
      alert("Cannot delete your only resume.");
      return;
    }
    if (!confirm("Are you sure you want to delete this resume?")) return;
    try {
      await api.deleteResume(id);
      await loadResumes();
      setActionMsg("Resume deleted.");
      setTimeout(() => setActionMsg(null), 3000);
    } catch {
      setActionMsg("Failed to delete resume.");
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <FolderGit2 className="w-7 h-7 text-blue-600" />
            <span>My Resumes</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain multiple customized resumes tailored for specific companies, roles, and engineering domains.
          </p>
        </div>

        <button
          onClick={() => setActivePage('generate')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Resume</span>
        </button>
      </div>

      {actionMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
          {actionMsg}
        </div>
      )}

      {/* Resumes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            onClick={() => {
              selectResume(resume.id);
              setActivePage('editor');
            }}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">
                  {resume.template_id}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {resume.updated_at ? new Date(resume.updated_at).toLocaleDateString() : 'Active'}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {resume.title}
              </h3>

              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>{resume.target.role || resume.personal.title || 'General Engineering'}</span>
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1 text-[10px] text-slate-500">
                <span className="font-semibold text-slate-700">Top Tech:</span>
                {resume.skills.languages.slice(0, 4).join(', ') || 'Software'}
              </div>
            </div>

            {/* Card Actions Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  title="Duplicate"
                  onClick={(e) => handleDuplicate(resume.id, e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  title="Delete"
                  onClick={(e) => handleDelete(resume.id, e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
