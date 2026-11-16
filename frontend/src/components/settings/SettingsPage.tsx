import React, { useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { 
  Settings, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Server, 
  Cpu, 
  RefreshCw,
  Lock
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { backendStatus, checkBackendStatus } = useResume();

  useEffect(() => {
    checkBackendStatus();
  }, []);

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8 font-sans">
      
      {/* Title */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Settings className="w-7 h-7 text-blue-600" />
          <span>System Settings & Architecture</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review backend connectivity, Gemini Pro configuration, security boundaries, and runtime status.
        </p>
      </div>

      {/* Backend & Gemini Security Architecture Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Python Backend & Gemini Pro Engine</h3>
              <p className="text-xs text-slate-500">Service Status & Security Boundary</p>
            </div>
          </div>

          <button
            onClick={() => checkBackendStatus()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check Health</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">API Service</span>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              {backendStatus.online ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Online (Port 8000)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Offline</span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Gemini Pro API Key</span>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              {backendStatus.gemini_configured ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Configured in Backend</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Smart Heuristic Mode</span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Model Runtime</span>
            <div className="font-mono font-bold text-slate-800 text-sm">
              {backendStatus.model || 'gemini-2.5-pro'}
            </div>
          </div>
        </div>

        {/* Security Architecture Notice */}
        <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-blue-400">
            <Lock className="w-4 h-4" />
            <span>Strict Security Architecture (Section 24 & 28)</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11.5px]">
            In strict compliance with the project specifications, API keys are <strong>never</strong> requested in client headers, frontend dialogs, or stored in browser <code>localStorage</code>.
            The Python FastAPI backend securely manages <code>GEMINI_API_KEY</code> and GitHub secrets directly through server environment variables in <code>backend/.env</code>.
          </p>
        </div>

      </div>

      {/* Export & Validation Defaults */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Export & Formatting Preferences</h3>
        
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
            <div>
              <span className="font-bold text-slate-800 block">Pre-Export ATS Validation Gate</span>
              <span className="text-[11px] text-slate-500">Run automated checklist before downloading PDF or DOCX</span>
            </div>
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-bold text-[11px]">Enabled</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
            <div>
              <span className="font-bold text-slate-800 block">Zero-Hallucination Grounding Rule</span>
              <span className="text-[11px] text-slate-500">Append "(Consider adding a measurable result if available)" instead of making up metrics</span>
            </div>
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-bold text-[11px]">Enforced</span>
          </div>
        </div>
      </div>

    </div>
  );
};
