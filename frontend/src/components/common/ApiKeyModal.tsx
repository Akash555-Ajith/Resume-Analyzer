import React, { useState } from 'react';
import { Key, Check, ShieldCheck, Sparkles, X } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKey: (key: string) => void;
  currentKey: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSaveKey,
  currentKey
}) => {
  const [keyInput, setKeyInput] = useState(currentKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(keyInput);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-orange-100 text-brand-orange flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Gemini Pro API Key</h3>
            <p className="text-xs text-slate-500">Configure Google Gemini 2.5/3 Pro LLM Engine</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Enter your Google Gemini API key below. This key will be used for all live ATS scoring, job description extraction, GitHub project bullet generation, and AI re-writing.
          </p>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">API Key</label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none"
            />
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
              <span>Smart Mock Fallback Active</span>
            </div>
            <p>
              If no API key is set, the system seamlessly uses built-in heuristic analysis vectors to ensure all UI features remain 100% interactive.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" /> Saved!
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Save API Key
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
