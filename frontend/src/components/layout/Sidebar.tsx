import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { 
  LayoutDashboard, 
  FileSearch, 
  Wand2, 
  Github, 
  Target, 
  FolderGit2, 
  LayoutTemplate, 
  User, 
  Settings,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, currentResume } = useResume();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Resume', icon: FileSearch },
    { id: 'generate', label: 'Generate Resume', icon: Wand2 },
    { id: 'github', label: 'GitHub → Resume', icon: Github },
    { id: 'job-match', label: 'Job Match', icon: Target },
    { id: 'resumes', label: 'My Resumes', icon: FolderGit2 },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-4rem)] flex flex-col justify-between shrink-0 select-none sticky top-16 font-sans">
      <div className="py-4">
        {/* Navigation Section Title */}
        <div className="px-5 pb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            APPLICATION WORKSPACE
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Resume Mini Card in Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
            ACTIVE DOSSIER
          </span>
          <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-1.5 py-0.2 rounded">
            {currentResume?.template_id || 'Modern'}
          </span>
        </div>
        <div 
          onClick={() => setActivePage('editor')}
          className="bg-white p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300 hover:shadow-xs transition-all"
        >
          <div className="text-xs font-bold text-slate-800 truncate">
            {currentResume?.title || 'Master Resume'}
          </div>
          <div className="text-[11px] text-slate-500 truncate mt-0.5">
            {currentResume?.personal.name || 'Candidate Name'}
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-blue-600 font-semibold">
            <span>Open in Editor</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
      </div>
    </aside>
  );
};
