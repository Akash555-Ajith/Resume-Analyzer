import React from 'react';
import { Sparkles, FileSearch, Wand2, LayoutTemplate, Key } from 'lucide-react';

interface NavbarProps {
  activePage: 'analyser' | 'generator' | 'templates';
  setActivePage: (page: 'analyser' | 'generator' | 'templates') => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  onOpenApiKeyModal,
  hasApiKey
}) => {
  return (
    <header className="bg-[#0F172A] text-white border-b border-slate-800 px-6 py-3 sticky top-0 z-30 font-sans shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActivePage('analyser')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-orange text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block leading-none">
              AI Resume Analyzer
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mt-0.5">
              INTELLIGENCE ENGINE
            </span>
          </div>
        </div>

        {/* 3 Navigation Links */}
        <nav className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs font-semibold">
          <button
            onClick={() => setActivePage('analyser')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activePage === 'analyser'
                ? 'bg-brand-orange text-white shadow-xs font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <FileSearch className="w-4 h-4" />
            <span>Analyser</span>
          </button>

          <button
            onClick={() => setActivePage('generator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activePage === 'generator'
                ? 'bg-brand-orange text-white shadow-xs font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Generator</span>
          </button>

          <button
            onClick={() => setActivePage('templates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activePage === 'templates'
                ? 'bg-brand-orange text-white shadow-xs font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            <span>Templates</span>
          </button>
        </nav>

        {/* Gemini API Key config */}
        <button
          onClick={onOpenApiKeyModal}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
            hasApiKey
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
              : 'bg-amber-950/80 text-amber-400 border-amber-800 hover:bg-amber-900'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {hasApiKey ? 'Gemini Pro Active' : 'Set Gemini Key'}
          </span>
        </button>

      </div>
    </header>
  );
};
