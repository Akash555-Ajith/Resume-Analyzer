import React from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  Target, 
  Code2, 
  Grid, 
  Github, 
  User, 
  FolderGit2, 
  LayoutTemplate, 
  Settings, 
  Zap, 
  ChevronLeft,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenApiKeyModal: () => void;
  userName?: string;
  userTitle?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenApiKeyModal,
  userName = "Erik Rostad",
  userTitle = "L7 Staff Architect"
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Telemetry Dashboard', icon: BarChart3 },
    { id: 'audit', label: 'ATS Deep Audit', icon: ShieldCheck },
    { id: 'jd-studio', label: 'JD Match Studio', icon: Target },
    { id: 'ide', label: 'AI Resume IDE', icon: Code2 },
    { id: 'benchmark', label: 'Benchmark Matrix', icon: Grid },
    { id: 'github', label: 'GitHub Scanner', icon: Github },
    { id: 'profile', label: 'Master Profile', icon: User },
    { id: 'my-resumes', label: 'My Resumes', icon: FolderGit2 },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  ];

  return (
    <aside className="w-64 bg-[#FFFFFF] border-r border-slate-200 h-screen flex flex-col justify-between shrink-0 select-none sticky top-0 font-sans z-30">
      <div>
        {/* Logo & Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-orange text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Sparkles className="w-4 h-4 fill-current text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-base tracking-tight leading-none">ResumeIQ</span>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 font-semibold block mt-0.5 uppercase">
                INTELLIGENCE v4.2
              </span>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Section Label */}
        <div className="px-4 pt-4 pb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            WORKSPACE NAVIGATION
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-xs transition-all duration-150 ${
                  isActive
                    ? 'bg-[#C4450C] text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer & User Card */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50 space-y-3">
        {/* Token Balance Gauge (Matching Screenshot) */}
        <div 
          onClick={onOpenApiKeyModal}
          className="bg-slate-100/90 rounded-lg p-2.5 border border-slate-200/80 cursor-pointer hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              AUDIT TOKENS
            </span>
            <Zap className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
          </div>
          <div className="font-mono font-bold text-xs text-slate-800 flex items-center justify-between">
            <span>4,820 / 5,000</span>
            <span className="text-[10px] font-normal text-slate-500">96.4%</span>
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-brand-orange h-full rounded-full" style={{ width: '96.4%' }} />
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-teal-700 shadow-xs">
              ER
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate">{userName}</div>
              <div className="text-[10px] text-slate-500 truncate">{userTitle}</div>
            </div>
          </div>
          <button 
            onClick={onOpenApiKeyModal} 
            title="Settings & API Key"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
