import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { ResumeRenderer } from './ResumeRenderer';
import { 
  LayoutTemplate, 
  Check, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Code2, 
  GraduationCap, 
  Briefcase, 
  Microscope 
} from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const { currentResume, setCurrentResume, setActivePage } = useResume();
  const [selectedTemplate, setSelectedTemplate] = useState<string>(currentResume?.template_id || 'modern');

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      icon: Sparkles,
      tag: 'Most Popular',
      desc: 'Clean typography, subtle visual hierarchy, and balanced whitespace. Ideal for software engineers, product managers, and modern tech roles.'
    },
    {
      id: 'ats_classic',
      name: 'ATS Classic',
      icon: ShieldCheck,
      tag: '100% ATS Safe',
      desc: 'Single-column monochrome layout with standard serif headings and minimal styling. Guaranteed maximum parser compatibility across legacy ATS systems.'
    },
    {
      id: 'technical',
      name: 'Technical Engineer',
      icon: Code2,
      tag: 'Engineering Focus',
      desc: 'Optimized for software, systems, hardware, and FPGA engineering. Highlights technologies, GitHub repository links, and architectural complexity.'
    },
    {
      id: 'student',
      name: 'Student & Graduate',
      icon: GraduationCap,
      tag: 'Entry-Level',
      desc: 'Prioritizes education, relevant coursework, academic hackathons, and personal projects. CGPA is optional and cleanly handled.'
    },
    {
      id: 'management',
      name: 'Management & Leadership',
      icon: Briefcase,
      tag: 'Executive',
      desc: 'Designed for engineering managers, directors, and business professionals. Accentuates team orchestration, business metrics, and strategic delivery.'
    },
    {
      id: 'academic',
      name: 'Academic & Research',
      icon: Microscope,
      tag: 'Scholarly',
      desc: 'Optimized for researchers, PhD candidates, and academics. Gives prominence to peer-reviewed publications, methodology, citations, and university credentials.'
    },
  ];

  const handleApplyTemplate = (tmplId: string) => {
    setSelectedTemplate(tmplId);
    if (currentResume) {
      setCurrentResume({ ...currentResume, template_id: tmplId });
    }
  };

  const handleUseAndOpenEditor = () => {
    if (currentResume) {
      setCurrentResume({ ...currentResume, template_id: selectedTemplate });
      setActivePage('editor');
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutTemplate className="w-7 h-7 text-blue-600" />
            <span>Resume Templates</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Choose from 6 professionally crafted, ATS-compliant React templates. Content and design remain completely separate.
          </p>
        </div>

        <button
          onClick={handleUseAndOpenEditor}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 transition-all"
        >
          <span>Use Selected in Editor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tmpl) => {
          const Icon = tmpl.icon;
          const isSelected = selectedTemplate === tmpl.id;
          return (
            <div
              key={tmpl.id}
              onClick={() => handleApplyTemplate(tmpl.id)}
              className={`bg-white rounded-2xl border cursor-pointer transition-all p-6 flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 shadow-md ring-2 ring-blue-600/20'
                  : 'border-slate-200/80 shadow-xs hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                    {tmpl.tag}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900">{tmpl.name}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{tmpl.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                {isSelected ? (
                  <span className="text-blue-600 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Selected Template
                  </span>
                ) : (
                  <span className="text-slate-400 font-medium">Click to select</span>
                )}
                <span className="text-blue-600 font-semibold hover:underline">Preview</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Preview of Selected Template */}
      {currentResume && (
        <div className="bg-slate-100 rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
            <span>Live Preview with Your Data ({selectedTemplate}):</span>
            <button
              onClick={handleUseAndOpenEditor}
              className="text-blue-600 hover:underline flex items-center gap-1 font-bold"
            >
              <span>Edit this template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex justify-center overflow-x-auto py-2">
            <ResumeRenderer resume={currentResume} templateId={selectedTemplate} scale={0.85} />
          </div>
        </div>
      )}

    </div>
  );
};
