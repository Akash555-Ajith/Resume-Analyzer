import React, { useState, useEffect } from 'react';
import { 
  Wand2, 
  Sparkles, 
  Upload, 
  Download, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Plus, 
  Trash2, 
  FileText, 
  Save, 
  LayoutTemplate 
} from 'lucide-react';
import { ResumeData, WorkExperienceEntry, ProjectEntry, EducationEntry, SkillCategory } from '../../types/resume';
import { ResumeRenderer } from '../templates/ResumeRenderer';
import { apiService } from '../../services/api';

interface GeneratorPageProps {
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
  onGoToTemplates: () => void;
}

export const GeneratorPage: React.FC<GeneratorPageProps> = ({
  resume,
  setResume,
  onGoToTemplates
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [assistLoadingField, setAssistLoadingField] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState('Saved to LocalStorage');
  const [customTemplateFile, setCustomTemplateFile] = useState<File | null>(null);
  const [customTemplateName, setCustomTemplateName] = useState('');

  // Auto-save form progress in browser localStorage
  useEffect(() => {
    localStorage.setItem('generator_form_resume', JSON.stringify(resume));
    setAutoSaveStatus('Auto-saved just now');
  }, [resume]);

  // Handle per-field AI Assist
  const handleFieldAiAssist = async (fieldName: string, roughNotes: string, updateCallback: (text: string) => void) => {
    if (!roughNotes.trim()) return;
    setAssistLoadingField(fieldName);
    try {
      const res = await apiService.assistField(fieldName, roughNotes);
      updateCallback(res.suggested_text);
    } catch (e) {
      console.error(e);
    } finally {
      setAssistLoadingField(null);
    }
  };

  // Upload Custom Template (DOCX / PDF)
  const handleCustomTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCustomTemplateFile(file);
    setCustomTemplateName(file.name);
    // Parse custom template layout
    setResume({ ...resume, template_id: 'custom' });
  };

  const steps = [
    { id: 1, title: 'Personal Info' },
    { id: 2, title: 'Summary' },
    { id: 3, title: 'Experience' },
    { id: 4, title: 'Projects' },
    { id: 5, title: 'Education & Skills' },
    { id: 6, title: 'Template Choice' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-orange">
            PAGE 2: RESUME GENERATOR
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Step-by-Step AI Resume Builder
          </h1>
          <p className="text-xs text-slate-600">
            Build a professional resume from scratch. Use AI Assist on any field to polish rough notes, pick a template, or upload your custom layout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded flex items-center gap-1">
            <Save className="w-3.5 h-3.5" /> {autoSaveStatus}
          </span>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" /> Export Resume
          </button>
        </div>
      </div>

      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              currentStep === step.id
                ? 'bg-brand-orange text-white'
                : step.id < currentStep
                ? 'bg-slate-100 text-slate-800'
                : 'text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center font-mono text-[10px]">
              {step.id}
            </span>
            <span>{step.title}</span>
          </button>
        ))}
      </div>

      {/* 2-Column Form vs Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Step Form Controls */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          
          {/* STEP 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Step 1: Contact Information</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume.contact.name}
                    onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, name: e.target.value } })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={resume.contact.email}
                    onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, email: e.target.value } })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={resume.contact.phone}
                    onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, phone: e.target.value } })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={resume.contact.location}
                    onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, location: e.target.value } })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={resume.contact.linkedin}
                    onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, linkedin: e.target.value } })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GitHub / Portfolio</label>
                  <input
                    type="text"
                    value={resume.contact.github}
                    onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, github: e.target.value } })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Summary */}
          {currentStep === 2 && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Step 2: Professional Summary</h3>
                <button
                  onClick={() => handleFieldAiAssist('summary', resume.summary, (text) => setResume({ ...resume, summary: text }))}
                  disabled={assistLoadingField === 'summary'}
                  className="px-2.5 py-1 bg-brand-orange hover:bg-brand-orange-hover text-white text-[11px] font-semibold rounded flex items-center gap-1 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" /> {assistLoadingField === 'summary' ? 'Writing...' : 'AI Assist'}
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Summary / Objective (or type rough notes & click AI Assist)</label>
                <textarea
                  rows={5}
                  value={resume.summary}
                  onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                  placeholder="e.g. 8 years software engineering experience in payment backend ledgers..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange font-mono"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Experience */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Step 3: Work Experience</h3>
                <button
                  onClick={() => {
                    const newExp: WorkExperienceEntry = {
                      id: `exp-${Date.now()}`,
                      company: 'New Company',
                      position: 'Software Engineer',
                      location: 'San Francisco, CA',
                      start_date: '2022',
                      end_date: 'Present',
                      is_current: true,
                      bullet_points: ['Developed core backend microservices.']
                    };
                    setResume({ ...resume, experience: [...resume.experience, newExp] });
                  }}
                  className="px-2.5 py-1 bg-slate-100 text-slate-800 text-[11px] font-semibold rounded flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Job
                </button>
              </div>

              {resume.experience.map((exp, idx) => (
                <div key={exp.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...resume.experience];
                        updated[idx].company = e.target.value;
                        setResume({ ...resume, experience: updated });
                      }}
                      className="px-2.5 py-1.5 border border-slate-300 rounded font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) => {
                        const updated = [...resume.experience];
                        updated[idx].position = e.target.value;
                        setResume({ ...resume, experience: updated });
                      }}
                      className="px-2.5 py-1.5 border border-slate-300 rounded font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">Bullet Points</label>
                      <button
                        onClick={() => {
                          const notes = exp.bullet_points.join('\n');
                          handleFieldAiAssist(`exp-${idx}`, notes, (text) => {
                            const updated = [...resume.experience];
                            updated[idx].bullet_points = text.split('\n').filter(Boolean);
                            setResume({ ...resume, experience: updated });
                          });
                        }}
                        className="text-[10px] font-semibold text-brand-orange flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> AI Assist
                      </button>
                    </div>

                    {exp.bullet_points.map((b, bIdx) => (
                      <input
                        key={bIdx}
                        type="text"
                        value={b}
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[idx].bullet_points[bIdx] = e.target.value;
                          setResume({ ...resume, experience: updated });
                        }}
                        className="w-full px-2 py-1 border border-slate-200 rounded font-mono"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 4: Projects */}
          {currentStep === 4 && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Step 4: Key Projects</h3>
                <button
                  onClick={() => {
                    const newProj: ProjectEntry = {
                      id: `proj-${Date.now()}`,
                      name: 'New Project',
                      technologies: ['Python', 'Docker'],
                      description: 'Project summary',
                      bullet_points: ['Built API pipeline.']
                    };
                    setResume({ ...resume, projects: [...resume.projects, newProj] });
                  }}
                  className="px-2.5 py-1 bg-slate-100 text-slate-800 text-[11px] font-semibold rounded flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Project
                </button>
              </div>

              {resume.projects.map((proj, idx) => (
                <div key={proj.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => {
                      const updated = [...resume.projects];
                      updated[idx].name = e.target.value;
                      setResume({ ...resume, projects: updated });
                    }}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-bold"
                  />
                  {proj.bullet_points.map((b, bIdx) => (
                    <input
                      key={bIdx}
                      type="text"
                      value={b}
                      onChange={(e) => {
                        const updated = [...resume.projects];
                        updated[idx].bullet_points[bIdx] = e.target.value;
                        setResume({ ...resume, projects: updated });
                      }}
                      className="w-full px-2 py-1 border border-slate-200 rounded font-mono"
                    />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* STEP 5: Education & Skills */}
          {currentStep === 5 && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Step 5: Education & Skills</h3>
              
              {resume.education.map((edu, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[idx].degree = e.target.value;
                      setResume({ ...resume, education: updated });
                    }}
                    placeholder="Degree"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-bold"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[idx].institution = e.target.value;
                      setResume({ ...resume, education: updated });
                    }}
                    placeholder="University"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              ))}
            </div>
          )}

          {/* STEP 6: Template Choice (Built-in or Upload Custom) */}
          {currentStep === 6 && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Step 6: Template Selection</h3>
              
              <div className="space-y-3">
                <span className="font-semibold text-slate-800 block">Option A: Select Built-in Template</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'classic', label: 'Classic Single-Column' },
                    { id: 'modern', label: 'Modern Professional' },
                    { id: 'minimal', label: 'Minimalist' },
                    { id: 'creative', label: 'Creative' },
                    { id: 'tech', label: 'Tech / Developer' },
                    { id: 'executive', label: 'Executive' },
                    { id: 'twocolumn', label: 'Two-Column' },
                    { id: 'compact', label: 'Compact One-Page' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setResume({ ...resume, template_id: t.id })}
                      className={`p-3 rounded-lg border text-left font-bold transition-all ${
                        resume.template_id === t.id
                          ? 'border-brand-orange bg-orange-50/40 text-brand-orange'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="font-semibold text-slate-800 block">Option B: Upload Custom Layout Template (DOCX or PDF)</span>
                <label className="border border-dashed border-slate-300 hover:border-brand-orange p-4 rounded-xl flex items-center justify-center cursor-pointer bg-slate-50/50">
                  <div className="text-center space-y-1">
                    <Upload className="w-5 h-5 text-brand-orange mx-auto" />
                    <span className="font-semibold text-slate-700 block">
                      {customTemplateName || 'Upload custom DOCX or PDF layout'}
                    </span>
                    <span className="text-[10px] text-slate-500">AI reads custom layout structure & populates user data</span>
                  </div>
                  <input
                    type="file"
                    accept=".docx,.pdf"
                    onChange={handleCustomTemplateUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 disabled:opacity-50 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Previous Step
            </button>

            <button
              onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
              disabled={currentStep === 6}
              className="px-4 py-2 bg-brand-orange text-white text-xs font-semibold rounded-lg shadow-2xs hover:bg-brand-orange-hover disabled:opacity-50 flex items-center gap-1"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right: Live Preview */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-xs sticky top-20 max-h-[750px] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">LIVE GENERATED OUTPUT</span>
            <span className="text-xs font-mono font-semibold text-brand-orange">Template: {resume.template_id}</span>
          </div>

          <ResumeRenderer resume={resume} />
        </div>

      </div>

    </div>
  );
};
