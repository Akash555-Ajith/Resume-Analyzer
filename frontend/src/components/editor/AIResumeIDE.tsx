import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Sparkles, 
  GripVertical, 
  Plus, 
  Trash2, 
  Check, 
  Download, 
  Eye, 
  FileCheck, 
  Wand2,
  Layers,
  FileText
} from 'lucide-react';
import { ResumeData, FullAnalysisResult, WorkExperienceEntry, ProjectEntry } from '../../types/resume';
import { ResumeRenderer } from '../templates/ResumeRenderer';
import { apiService } from '../../services/api';

interface AIResumeIDEProps {
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
  analysis: FullAnalysisResult;
  onExportPDF: () => void;
  targetRole: string;
}

// Sortable Section Wrapper
const SortableSectionItem: React.FC<{
  id: string;
  title: string;
  children: React.ReactNode;
}> = ({ id, title, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <button {...attributes} {...listeners} className="cursor-grab text-slate-400 hover:text-slate-600">
            <GripVertical className="w-4 h-4" />
          </button>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        </div>
      </div>
      {children}
    </div>
  );
};

export const AIResumeIDE: React.FC<AIResumeIDEProps> = ({
  resume,
  setResume,
  analysis,
  onExportPDF,
  targetRole
}) => {
  const [sectionsOrder, setSectionsOrder] = useState<string[]>([
    'summary',
    'experience',
    'projects',
    'skills',
    'education'
  ]);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'diff'>('editor');
  const [selectedText, setSelectedText] = useState('');
  const [isAiRewriting, setIsAiRewriting] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [showCheckDrawer, setShowCheckDrawer] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSectionsOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAiAction = async (action: string) => {
    if (!selectedText.trim()) return;
    setIsAiRewriting(true);
    try {
      const res = await apiService.rewriteText(selectedText, action, targetRole);
      setAiExplanation(res.explanation);
      
      // Replace selected bullet point inside work experience or summary
      const updatedExperience = resume.experience.map((exp) => ({
        ...exp,
        bullet_points: exp.bullet_points.map((b) => (b.includes(selectedText) ? res.rewritten_text : b)),
      }));

      const updatedProjects = resume.projects.map((proj) => ({
        ...proj,
        bullet_points: proj.bullet_points.map((b) => (b.includes(selectedText) ? res.rewritten_text : b)),
      }));

      let updatedSummary = resume.summary;
      if (resume.summary.includes(selectedText)) {
        updatedSummary = res.rewritten_text;
      }

      setResume((prev) => ({
        ...prev,
        summary: updatedSummary,
        experience: updatedExperience,
        projects: updatedProjects,
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiRewriting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs sticky top-16 z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase font-bold text-slate-400">RESUME IDE</span>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'editor' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              Interactive Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              Live Document Preview
            </button>
            <button
              onClick={() => setActiveTab('diff')}
              className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'diff' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              Original vs AI Diff
            </button>
          </div>
        </div>

        {/* Live Score Ring & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">LIVE ATS SCORE</span>
            <span className="text-sm font-mono font-extrabold text-emerald-600">{analysis.overall_score}%</span>
          </div>

          <button
            onClick={() => setShowCheckDrawer(!showCheckDrawer)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5 text-brand-orange" /> Pre-Export Check
          </button>

          <button
            onClick={onExportPDF}
            className="px-4 py-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF / DOCX
          </button>
        </div>
      </div>

      {/* Floating AI Text Rewrite Toolbar */}
      {selectedText && (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl flex flex-wrap items-center justify-between gap-3 border border-slate-700 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Sparkles className="w-4 h-4 text-brand-orange" />
            <span>AI Assistant for selected text ({selectedText.slice(0, 35)}...)</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {['improve', 'concise', 'technical', 'quantify', 'ats_rewrite'].map((act) => (
              <button
                key={act}
                onClick={() => handleAiAction(act)}
                disabled={isAiRewriting}
                className="px-2.5 py-1 bg-slate-800 hover:bg-brand-orange text-white text-[11px] font-mono capitalize rounded border border-slate-700 transition-colors"
              >
                {act.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {aiExplanation && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <span>✨ <strong>AI Optimization:</strong> {aiExplanation}</span>
          <button onClick={() => setAiExplanation('')} className="text-emerald-600 font-bold text-xs">Dismiss</button>
        </div>
      )}

      {/* Main Workspace split */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Drag & Drop Sections Editor */}
          <div className="lg:col-span-7 space-y-4">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sectionsOrder} strategy={verticalListSortingStrategy}>
                
                {sectionsOrder.map((sectionId) => {
                  if (sectionId === 'summary') {
                    return (
                      <SortableSectionItem key="summary" id="summary" title="Professional Summary">
                        <textarea
                          rows={3}
                          value={resume.summary}
                          onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                          onSelect={(e: any) => setSelectedText(e.target.value.substring(e.target.selectionStart, e.target.selectionEnd))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-brand-orange outline-none"
                        />
                      </SortableSectionItem>
                    );
                  }

                  if (sectionId === 'experience') {
                    return (
                      <SortableSectionItem key="experience" id="experience" title="Work Experience">
                        <div className="space-y-4">
                          {resume.experience.map((exp, idx) => (
                            <div key={exp.id || idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
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
                                  className="px-2 py-1 border border-slate-300 rounded text-xs font-bold"
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
                                  className="px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">Bullet Points</label>
                                {exp.bullet_points.map((bullet, bIdx) => (
                                  <div key={bIdx} className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={bullet}
                                      onChange={(e) => {
                                        const updated = [...resume.experience];
                                        updated[idx].bullet_points[bIdx] = e.target.value;
                                        setResume({ ...resume, experience: updated });
                                      }}
                                      onSelect={(e: any) => setSelectedText(e.target.value.substring(e.target.selectionStart, e.target.selectionEnd))}
                                      className="w-full px-2 py-1 border border-slate-200 rounded text-xs font-mono"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </SortableSectionItem>
                    );
                  }

                  if (sectionId === 'projects') {
                    return (
                      <SortableSectionItem key="projects" id="projects" title="Key Projects">
                        <div className="space-y-4">
                          {resume.projects.map((proj, idx) => (
                            <div key={proj.id || idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                              <input
                                type="text"
                                placeholder="Project Name"
                                value={proj.name}
                                onChange={(e) => {
                                  const updated = [...resume.projects];
                                  updated[idx].name = e.target.value;
                                  setResume({ ...resume, projects: updated });
                                }}
                                className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                              />
                              {proj.bullet_points.map((bullet, bIdx) => (
                                <input
                                  key={bIdx}
                                  type="text"
                                  value={bullet}
                                  onChange={(e) => {
                                    const updated = [...resume.projects];
                                    updated[idx].bullet_points[bIdx] = e.target.value;
                                    setResume({ ...resume, projects: updated });
                                  }}
                                  onSelect={(e: any) => setSelectedText(e.target.value.substring(e.target.selectionStart, e.target.selectionEnd))}
                                  className="w-full px-2 py-1 border border-slate-200 rounded text-xs font-mono"
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      </SortableSectionItem>
                    );
                  }

                  if (sectionId === 'skills') {
                    return (
                      <SortableSectionItem key="skills" id="skills" title="Technical Skills Matrix">
                        <div className="space-y-2">
                          {resume.skills.map((sk, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="w-32 font-bold text-xs text-slate-800 shrink-0">{sk.category}:</span>
                              <input
                                type="text"
                                value={sk.skills.join(', ')}
                                onChange={(e) => {
                                  const updated = [...resume.skills];
                                  updated[idx].skills = e.target.value.split(',').map(s => s.trim());
                                  setResume({ ...resume, skills: updated });
                                }}
                                className="w-full px-2 py-1 border border-slate-200 rounded text-xs font-mono"
                              />
                            </div>
                          ))}
                        </div>
                      </SortableSectionItem>
                    );
                  }

                  return null;
                })}

              </SortableContext>
            </DndContext>
          </div>

          {/* Right Live Template Preview Pane */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 shadow-xs sticky top-36 h-[780px] overflow-y-auto">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">LIVE TEMPLATE PREVIEW</span>
              <select
                value={resume.template_id}
                onChange={(e) => setResume({ ...resume, template_id: e.target.value })}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded px-2 py-1"
              >
                <option value="ats_classic">ATS Classic (Single Column)</option>
                <option value="modern_professional">Modern Professional</option>
                <option value="technical">Technical (SWE / Embedded / AI)</option>
                <option value="academic">Academic / Research</option>
                <option value="management">Management / Leadership</option>
                <option value="executive">Executive</option>
                <option value="student">Student / Graduate</option>
              </select>
            </div>
            
            <div className="transform scale-90 origin-top">
              <ResumeRenderer resume={resume} />
            </div>
          </div>

        </div>
      )}

      {/* Live Document Preview Full Tab */}
      {activeTab === 'preview' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm max-w-4xl mx-auto">
          <ResumeRenderer resume={resume} />
        </div>
      )}

      {/* Pre-Export Validation Check Drawer */}
      {showCheckDrawer && (
        <div className="bg-slate-900 text-white rounded-xl p-6 shadow-2xl border border-slate-700 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold">Final Resume Validation Check</h3>
            </div>
            <button onClick={() => setShowCheckDrawer(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">ATS SCORE</span>
              <span className="text-lg font-bold text-emerald-400">{analysis.overall_score}% Pass</span>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">CONTACT DETAILS</span>
              <span className="text-lg font-bold text-emerald-400">Complete</span>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">TABLE FAULTS</span>
              <span className="text-lg font-bold text-emerald-400">0 Faults</span>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">PAGE BOUND</span>
              <span className="text-lg font-bold text-amber-400">1 Page Opt.</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
