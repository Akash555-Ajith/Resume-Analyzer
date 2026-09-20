import React, { useState } from 'react';
import { LayoutTemplate, Sparkles, Check, ArrowRight, Eye, X } from 'lucide-react';
import { ResumeData, TemplateConfig } from '../../types/resume';
import { ResumeRenderer } from './ResumeRenderer';

interface TemplatesPageProps {
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
  onUseTemplateForGenerator: (templateId: string) => void;
  onUseTemplateForAnalyser: (templateId: string) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({
  resume,
  setResume,
  onUseTemplateForGenerator,
  onUseTemplateForAnalyser
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewTemplateModal, setPreviewTemplateModal] = useState<TemplateConfig | null>(null);

  const templatesList: TemplateConfig[] = [
    {
      id: 'ats_classic',
      name: 'ATS Classic',
      category: 'Classic',
      styleTag: 'Single Column • 100% Machine-Readable',
      suggestedUse: 'Best for traditional corporate & enterprise ATS applications'
    },
    {
      id: 'modern_professional',
      name: 'Modern Professional',
      category: 'Modern',
      styleTag: 'Clean Typography • Subtle Borders',
      suggestedUse: 'Best for mid-level professionals & software engineers'
    },
    {
      id: 'minimal',
      name: 'Minimalist Clean',
      category: 'Minimal',
      styleTag: 'Generous Whitespace • Ultra Clean',
      suggestedUse: 'Best for freshers, students & design-minded roles'
    },
    {
      id: 'creative',
      name: 'Creative Portfolio',
      category: 'Creative',
      styleTag: 'Bold Accent Colors • Strong Visual Hierarchy',
      suggestedUse: 'Best for designers, marketers & product owners'
    },
    {
      id: 'technical',
      name: 'Tech / Developer',
      category: 'Tech',
      styleTag: 'High Code Density • Skills Matrix Indexed',
      suggestedUse: 'Best for SWE, DevOps, ML/AI, FPGA & Embedded Systems'
    },
    {
      id: 'executive',
      name: 'Executive Leadership',
      category: 'Executive',
      styleTag: 'Strategic Overview • Authority Layout',
      suggestedUse: 'Best for Directors, VPs, Managers & Lead Architects'
    },
    {
      id: 'twocolumn',
      name: 'Two-Column Split',
      category: 'Two-column',
      styleTag: 'Sidebar Skills Panel • Compact Experience',
      suggestedUse: 'Best for fitting extensive project lists into 1 page'
    },
    {
      id: 'compact',
      name: 'Compact One-Page',
      category: 'Compact',
      styleTag: 'High Information Density • Tight Margins',
      suggestedUse: 'Best for candidates with 5+ years experience needing 1 page'
    }
  ];

  const categories = ['All', 'Classic', 'Modern', 'Minimal', 'Creative', 'Tech', 'Executive', 'Two-column', 'Compact'];

  const filteredTemplates = selectedCategory === 'All'
    ? templatesList
    : templatesList.filter(t => t.category === selectedCategory);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-orange">
            PAGE 3: TEMPLATES GALLERY
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Professional Resume Template Gallery
          </h1>
          <p className="text-xs text-slate-600">
            Choose from 8 ready-made, ATS-vetted resume templates. Apply directly to your Analyser resume or launch the step-by-step Generator.
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              selectedCategory === cat
                ? 'bg-brand-orange text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of 8 Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => {
          const isSelected = resume.template_id === template.id;
          return (
            <div
              key={template.id}
              className={`bg-white rounded-xl border p-4 shadow-2xs flex flex-col justify-between transition-all space-y-3 ${
                isSelected ? 'border-brand-orange ring-2 ring-brand-orange/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                {/* Mini Renderer Thumbnail */}
                <div 
                  onClick={() => setPreviewTemplateModal(template)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3 h-48 overflow-hidden relative cursor-pointer group"
                >
                  <div className="transform scale-[0.4] origin-top-left w-[250%] pointer-events-none">
                    <ResumeRenderer resume={{ ...resume, template_id: template.id }} />
                  </div>
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 bg-white text-slate-900 font-bold text-xs rounded-lg shadow-md flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-brand-orange" /> Preview Full Template
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{template.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{template.styleTag}</p>
                </div>

                <div className="p-2 bg-slate-50 rounded text-[10px] text-slate-600 border border-slate-100 font-medium">
                  ✨ <strong>Suggested Use:</strong> {template.suggestedUse}
                </div>
              </div>

              {/* Template Action Buttons */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onUseTemplateForAnalyser(template.id)}
                  className="w-full py-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded shadow-2xs transition-colors flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Apply to Analyser Resume
                </button>
                <button
                  onClick={() => onUseTemplateForGenerator(template.id)}
                  className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1"
                >
                  Start Generator with this
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Full Preview Modal */}
      {previewTemplateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setPreviewTemplateModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">{previewTemplateModal.name}</h3>
              <p className="text-xs text-slate-500 font-mono">{previewTemplateModal.styleTag}</p>
            </div>

            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl">
              <ResumeRenderer resume={{ ...resume, template_id: previewTemplateModal.id }} />
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => setPreviewTemplateModal(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  onUseTemplateForAnalyser(previewTemplateModal.id);
                  setPreviewTemplateModal(null);
                }}
                className="px-4 py-2 bg-brand-orange text-white text-xs font-semibold rounded-lg shadow-2xs hover:bg-brand-orange-hover"
              >
                Use Template for Analyser
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
