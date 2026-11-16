import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Sparkles, FileText, Wand2, Github, Target, Code2, FolderGit2, LayoutTemplate, User, Settings, CheckCircle2, AlertCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activePage, setActivePage, backendStatus } = useResume();

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: FileText },
    { id: 'analyze', label: 'Analyze', icon: Sparkles },
    { id: 'generate', label: 'Generate', icon: Wand2 },
    { id: 'github', label: 'GitHub → Resume', icon: Github },
    { id: 'job-match', label: 'Job Match', icon: Target },
    { id: 'editor', label: 'Editor', icon: Code2 },
    { id: 'resumes', label: 'My Resumes', icon: FolderGit2 },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActivePage('landing')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block leading-none">
              AI Resume Analyzer
            </span>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider block mt-1 uppercase">
              Production Intelligence
            </span>
          </div>
        </div>

        {/* Primary Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Backend Status */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Backend Status Indicator */}
          <div 
            title={backendStatus.online ? (backendStatus.gemini_configured ? "Gemini Pro Connected" : "Local AI Fallback Active") : "Backend Offline"}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              backendStatus.online
                ? backendStatus.gemini_configured
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                  : 'bg-blue-950/80 text-blue-300 border-blue-800'
                : 'bg-rose-950/80 text-rose-400 border-rose-800'
            }`}
          >
            {backendStatus.online ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3 h-3 text-rose-400" />
            )}
            <span className="hidden sm:inline">
              {backendStatus.online
                ? (backendStatus.gemini_configured ? "Gemini Pro Active" : "Backend Connected")
                : "Backend Offline"}
            </span>
          </div>

          {/* Profile & Settings Buttons */}
          <button
            onClick={() => setActivePage('profile')}
            title="Master Profile"
            className={`p-2 rounded-lg transition-colors ${activePage === 'profile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <User className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActivePage('settings')}
            title="Settings"
            className={`p-2 rounded-lg transition-colors ${activePage === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
