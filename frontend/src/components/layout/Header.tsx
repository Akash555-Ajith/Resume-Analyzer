import React from 'react';
import { Search, Bell, SlidersHorizontal, Key, CheckCircle2, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  targetRole: string;
  setTargetRole: (role: string) => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  targetRole,
  setTargetRole,
  onOpenApiKeyModal,
  hasApiKey
}) => {
  const roles = [
    "Staff Software Engineer - Distributed Systems",
    "Software Engineer - Full Stack",
    "Backend Engineer (Python / Go)",
    "Frontend Engineer (React / TypeScript)",
    "Data Scientist & ML Architect",
    "AI / Machine Learning Engineer",
    "Hardware Engineer (FPGA / Verilog / VLSI)",
    "Embedded Systems Engineer",
    "Product Manager - Infrastructure",
    "Engineering Manager",
    "Student / Graduate Intern"
  ];

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 font-sans shadow-xs">
      {/* Left: Role Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-md px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange cursor-pointer shadow-2xs hover:bg-slate-100/80 transition-colors"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
            ▼
          </div>
        </div>

        {/* ATS Engine Badge matching screenshot */}
        <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ATS ENGINE: GREENHOUSE v3.8</span>
        </div>
      </div>

      {/* Middle: Quick Search */}
      <div className="hidden lg:flex items-center relative w-72">
        <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
        <input
          type="text"
          placeholder="Audit symbols..."
          className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-8 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-orange"
        />
        <span className="absolute right-2.5 bg-slate-200 text-slate-500 text-[10px] font-mono px-1 rounded">
          ⌘K
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Gemini API Key Indicator */}
        <button
          onClick={onOpenApiKeyModal}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
            hasApiKey
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {hasApiKey ? 'Gemini Pro Active' : 'Configure Gemini Key'}
          </span>
          {hasApiKey ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          )}
        </button>

        <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
          <Bell className="w-4 h-4" />
        </button>

        <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center border border-slate-300">
          ER
        </div>
      </div>
    </header>
  );
};
