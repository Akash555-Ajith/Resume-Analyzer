import React, { useState, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { api } from '../../services/api';
import { ResumeRenderer } from '../templates/ResumeRenderer';
import { 
  ResumeData, 
  ResumeVersion, 
  ValidationResult, 
  WorkExperienceEntry, 
  ProjectEntry, 
  EducationEntry 
} from '../../types/resume';
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
  Wand2,
  Save,
  Download,
  GripVertical,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronDown,
  Layers,
  History,
  FileCheck,
  RotateCcw,
  RefreshCw,
  Send,
  Eye,
  Edit,
  X,
  Check
} from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export const EditorPage: React.FC = () => {
  const { currentResume, setCurrentResume, saveCurrentResume, versions, loadVersions, createSnapshot, resumes } = useResume();

  // Mobile active tab: 'editor' | 'preview'
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  
  // Section order & drag state
  const [sections, setSections] = useState<string[]>(
    currentResume?.sections_order || [
      'summary', 'experience', 'projects', 'skills', 'education', 'certifications', 'achievements'
    ]
  );

  // Template selection
  const [templateId, setTemplateId] = useState<string>(currentResume?.template_id || 'modern');
  const [previewScale, setPreviewScale] = useState<number>(0.95);

  // AI Command Bar state
  const [commandText, setCommandText] = useState('');
  const [isExecutingCommand, setIsExecutingCommand] = useState(false);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  // AI Inline Selection Assistant state
  const [selectedText, setSelectedText] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiAssistantAction, setAiAssistantAction] = useState('improve');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiAssisting, setIsAiAssisting] = useState(false);

  // Validation modal state
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Version snapshot state
  const [showVersionDrawer, setShowVersionDrawer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  useEffect(() => {
    if (currentResume) {
      setSections(currentResume.sections_order || ['summary', 'experience', 'projects', 'skills', 'education']);
      setTemplateId(currentResume.template_id || 'modern');
      loadVersions(currentResume.id);
    }
  }, [currentResume?.id]);

  // DND setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.indexOf(active.id as string);
      const newIndex = sections.indexOf(over.id as string);
      const newOrder = arrayMove(sections, oldIndex, newIndex);
      setSections(newOrder);
      if (currentResume) {
        const updated = { ...currentResume, sections_order: newOrder };
        setCurrentResume(updated);
      }
    }
  };

  const handleSave = async () => {
    if (!currentResume) return;
    setIsSaving(true);
    try {
      const updated = { ...currentResume, sections_order: sections, template_id: templateId };
      await saveCurrentResume(updated);
      await createSnapshot("After Manual Editing", "Saved manual edits in Visual Editor");
      setSaveToast("Resume successfully saved!");
      setTimeout(() => setSaveToast(null), 3000);
    } catch (e) {
      setSaveToast("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandText.trim() || !currentResume) return;
    setIsExecutingCommand(true);
    setCommandFeedback(null);
    try {
      const res = await api.executeCommand(currentResume, commandText);
      setCurrentResume(res.updated_resume);
      setSections(res.updated_resume.sections_order);
      setCommandFeedback(res.explanation);
      setCommandText('');
      setTimeout(() => setCommandFeedback(null), 4000);
    } catch (e) {
      setCommandFeedback("Failed to execute command.");
    } finally {
      setIsExecutingCommand(false);
    }
  };

  const handleInlineAssist = async (action: string) => {
    if (!selectedText.trim()) return;
    setIsAiAssisting(true);
    setAiAssistantAction(action);
    setAiSuggestion(null);
    try {
      const res = await api.inlineAssist(
        action,
        selectedText,
        currentResume?.title || '',
        currentResume?.target.role || 'Software Engineer',
        currentResume?.target.job_description || ''
      );
      setAiSuggestion(res.suggested_text);
      setAiExplanation(res.explanation);
    } catch (e) {
      setAiSuggestion("Could not generate suggestion. Please try again.");
    } finally {
      setIsAiAssisting(false);
    }
  };

  const runPreExportValidation = async () => {
    if (!currentResume) return;
    setIsValidating(true);
    try {
      const res = await api.validateResume(currentResume);
      setValidationResult(res);
      setShowValidationModal(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsValidating(false);
    }
  };

  const exportPDF = () => {
    const element = document.getElementById('printable-resume');
    if (!element) return;
    const opt = {
      margin: 0.3,
      filename: `${currentResume?.personal.name || 'Resume'}_${templateId}.pdf`.replace(/\s+/g, '_'),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  if (!currentResume) {
    return (
      <div className="p-12 text-center text-slate-500 font-sans">
        Loading active resume dossier...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-100 font-sans overflow-hidden">
      
      {/* Top Toolbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between gap-4 z-20 shrink-0">
        
        {/* Left: Resume Title & Template Selector */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={currentResume.title}
            onChange={(e) => setCurrentResume({ ...currentResume, title: e.target.value })}
            className="font-bold text-sm text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 px-1 py-0.5 focus:outline-none"
          />

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Template:</span>
            <select
              value={templateId}
              onChange={(e) => {
                setTemplateId(e.target.value);
                setCurrentResume({ ...currentResume, template_id: e.target.value });
              }}
              className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
            >
              <option value="modern">Modern Professional</option>
              <option value="ats_classic">ATS Classic</option>
              <option value="technical">Technical Engineer</option>
              <option value="academic">Academic & Research</option>
              <option value="management">Management & Leadership</option>
              <option value="student">Student & Graduate</option>
            </select>
          </div>
        </div>

        {/* Mobile View Toggle Buttons */}
        <div className="flex sm:hidden border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs">
          <button
            onClick={() => setMobileTab('editor')}
            className={`px-3 py-1 rounded-md font-bold ${mobileTab === 'editor' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'}`}
          >
            Editor
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`px-3 py-1 rounded-md font-bold ${mobileTab === 'preview' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'}`}
          >
            Preview
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-semibold animate-fade-in">
              {saveToast}
            </span>
          )}

          <button
            onClick={() => setShowVersionDrawer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 hover:bg-slate-50 font-semibold"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Versions ({versions.length})</span>
          </button>

          <button
            onClick={runPreExportValidation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-xs text-blue-700 hover:bg-blue-100 font-semibold"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Validate</span>
          </button>

          <button
            disabled={isSaving}
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          <button
            onClick={exportPDF}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>

      </header>

      {/* AI Command Bar (Section 19) */}
      <div className="bg-slate-900 text-white px-6 py-2 flex items-center justify-between gap-3 text-xs shrink-0 shadow-inner">
        <div className="flex items-center gap-2 text-blue-400 font-bold tracking-wide uppercase text-[10px]">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>AI Command Bar:</span>
        </div>

        <form onSubmit={handleCommandSubmit} className="flex-1 flex items-center gap-2 max-w-3xl">
          <input
            type="text"
            value={commandText}
            onChange={(e) => setCommandText(e.target.value)}
            placeholder='Ask AI to modify your resume (e.g. "Move Education to top", "Make project descriptions more concise", "Tailor for Backend Engineer")...'
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-sans"
          />
          <button
            type="submit"
            disabled={isExecutingCommand || !commandText.trim()}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs disabled:opacity-50 flex items-center gap-1 shrink-0"
          >
            {isExecutingCommand ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            <span>Execute</span>
          </button>
        </form>

        {commandFeedback && (
          <span className="text-emerald-400 text-xs font-medium animate-fade-in truncate max-w-xs">
            {commandFeedback}
          </span>
        )}
      </div>

      {/* Split-Screen Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANE: Editable Content & DND Section Reordering */}
        <div className={`w-full sm:w-1/2 lg:w-5/12 border-r border-slate-200 bg-white overflow-y-auto p-6 space-y-6 ${mobileTab === 'editor' ? 'block' : 'hidden sm:block'}`}>
          
          {/* Personal Info Accordion */}
          <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-4 space-y-3">
            <span className="font-bold text-xs text-slate-800 uppercase tracking-wider block">
              Header & Contact Details
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                placeholder="Full Name"
                value={currentResume.personal.name}
                onChange={(e) => setCurrentResume({
                  ...currentResume,
                  personal: { ...currentResume.personal, name: e.target.value }
                })}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
              />
              <input
                type="text"
                placeholder="Professional Title"
                value={currentResume.personal.title}
                onChange={(e) => setCurrentResume({
                  ...currentResume,
                  personal: { ...currentResume.personal, title: e.target.value }
                })}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
              />
              <input
                type="email"
                placeholder="Email"
                value={currentResume.personal.email}
                onChange={(e) => setCurrentResume({
                  ...currentResume,
                  personal: { ...currentResume.personal, email: e.target.value }
                })}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
              />
              <input
                type="text"
                placeholder="Phone"
                value={currentResume.personal.phone}
                onChange={(e) => setCurrentResume({
                  ...currentResume,
                  personal: { ...currentResume.personal, phone: e.target.value }
                })}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
              />
              <input
                type="text"
                placeholder="Location (City, State)"
                value={currentResume.personal.location}
                onChange={(e) => setCurrentResume({
                  ...currentResume,
                  personal: { ...currentResume.personal, location: e.target.value }
                })}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
              />
              <input
                type="text"
                placeholder="LinkedIn URL"
                value={currentResume.personal.linkedin}
                onChange={(e) => setCurrentResume({
                  ...currentResume,
                  personal: { ...currentResume.personal, linkedin: e.target.value }
                })}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>
          </div>

          {/* DND Section Reordering & Field Editors */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold uppercase tracking-wider text-[10px]">
                Reorderable Sections (Drag handle to reorganize)
              </span>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {sections.map((sectionKey) => (
                    <SortableSectionItem
                      key={sectionKey}
                      id={sectionKey}
                      currentResume={currentResume}
                      setCurrentResume={setCurrentResume}
                      onSelectText={(txt) => {
                        setSelectedText(txt);
                        setShowAiModal(true);
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

        </div>

        {/* RIGHT PANE: Real-time Live Preview */}
        <div className={`w-full sm:w-1/2 lg:w-7/12 bg-slate-200/80 overflow-y-auto p-4 sm:p-8 flex justify-center items-start ${mobileTab === 'preview' ? 'block' : 'hidden sm:block'}`}>
          <div className="w-full flex justify-center">
            <ResumeRenderer resume={currentResume} templateId={templateId} scale={previewScale} />
          </div>
        </div>

      </div>

      {/* Floating AI Text Selection Assistant Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase">
                <Sparkles className="w-4 h-4 fill-current" />
                <span>AI Selection Assistant</span>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
              <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Selected Text:</span>
              <p className="italic">«{selectedText}»</p>
            </div>

            {/* Action Buttons from Section 18 */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Choose Transformation:
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'improve', label: 'Improve' },
                  { id: 'shorten', label: 'Shorten' },
                  { id: 'expand', label: 'Expand' },
                  { id: 'fix_grammar', label: 'Fix Grammar' },
                  { id: 'make_technical', label: 'Make Technical' },
                  { id: 'make_ats_friendly', label: 'Make ATS Friendly' },
                  { id: 'add_impact', label: 'Add Impact' },
                  { id: 'tailor_to_job', label: 'Tailor to Job' },
                  { id: 'rewrite', label: 'Rewrite' },
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() => handleInlineAssist(act.id)}
                    className="p-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 font-medium text-[11px] transition-all text-center"
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            {isAiAssisting && (
              <div className="p-4 rounded-xl bg-blue-50/50 flex items-center justify-center gap-2 text-xs text-blue-600 font-semibold">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Refining with zero-hallucination rules...</span>
              </div>
            )}

            {aiSuggestion && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                <span className="font-bold text-emerald-800 uppercase text-[10px] block">AI Recommendation:</span>
                <p className="text-slate-900 font-medium">{aiSuggestion}</p>
                {aiExplanation && <p className="text-emerald-700 text-[11px] italic">{aiExplanation}</p>}
                
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiSuggestion);
                      setShowAiModal(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Copy Suggestion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pre-Export Validation Modal (Section 23) */}
      {showValidationModal && validationResult && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase">
                <FileCheck className="w-4 h-4" />
                <span>Pre-Export Readiness Checklist</span>
              </div>
              <button onClick={() => setShowValidationModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {validationResult.items.map((it) => (
                <div key={it.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">{it.label}</span>
                    <span className="text-[11px] text-slate-500">{it.details}</span>
                  </div>
                  {it.passed ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Verified
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold">Needs Attention</span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs">
                <span className="font-bold text-slate-700">Readiness Score: </span>
                <span className="font-black text-emerald-600">{validationResult.score}%</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={api.getDocxUrl(currentResume.id)}
                  download
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
                >
                  DOCX
                </a>
                <a
                  href={api.getTxtUrl(currentResume.id)}
                  download
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
                >
                  TXT
                </a>
                <button
                  onClick={() => {
                    setShowValidationModal(false);
                    exportPDF();
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
                >
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version History Drawer (Section 22) */}
      {showVersionDrawer && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-2xl z-50 p-6 flex flex-col justify-between font-sans">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase">
                <History className="w-4 h-4 text-blue-600" />
                <span>Version Snapshots</span>
              </div>
              <button onClick={() => setShowVersionDrawer(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-12rem)]">
              {versions.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No previous snapshots saved.</p>
              ) : (
                versions.map((v) => (
                  <div key={v.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{v.version_name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {new Date(v.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{v.change_summary}</p>
                    <button
                      onClick={() => {
                        setCurrentResume(v.data);
                        setSections(v.data.sections_order);
                        setShowVersionDrawer(false);
                      }}
                      className="text-[11px] text-blue-600 hover:underline font-semibold flex items-center gap-1 pt-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore This Snapshot</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setShowVersionDrawer(false)}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700"
          >
            Close
          </button>
        </div>
      )}

    </div>
  );
};

// Sortable Section Component
interface SortableSectionProps {
  id: string;
  currentResume: ResumeData;
  setCurrentResume: (resume: ResumeData) => void;
  onSelectText: (txt: string) => void;
}

const SortableSectionItem: React.FC<SortableSectionProps> = ({
  id,
  currentResume,
  setCurrentResume,
  onSelectText
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const getSectionTitle = (key: string) => {
    switch (key) {
      case 'summary': return 'Professional Summary';
      case 'experience': return 'Work Experience';
      case 'projects': return 'Technical Projects';
      case 'skills': return 'Skills & Competencies';
      case 'education': return 'Education & Credentials';
      case 'certifications': return 'Certifications';
      case 'achievements': return 'Honors & Achievements';
      case 'publications': return 'Publications';
      case 'leadership': return 'Leadership & Activities';
      default: return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-slate-50/80 rounded-xl border border-slate-200 p-4 space-y-3">
      {/* Header with Grip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab text-slate-400 hover:text-slate-700">
            <GripVertical className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
            {getSectionTitle(id)}
          </span>
        </div>
      </div>

      {/* Field Renderers based on section key */}
      {id === 'summary' && (
        <div className="space-y-1">
          <textarea
            rows={3}
            value={currentResume.summary}
            onChange={(e) => setCurrentResume({ ...currentResume, summary: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none"
            placeholder="Write professional summary..."
          />
          <button
            type="button"
            onClick={() => onSelectText(currentResume.summary)}
            className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 font-semibold"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Assistant on Summary</span>
          </button>
        </div>
      )}

      {id === 'experience' && (
        <div className="space-y-3">
          {currentResume.experience.map((exp, idx) => (
            <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center gap-2">
                <input
                  type="text"
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) => {
                    const copy = [...currentResume.experience];
                    copy[idx].position = e.target.value;
                    setCurrentResume({ ...currentResume, experience: copy });
                  }}
                  className="font-bold text-slate-800 w-1/2 border-b border-transparent hover:border-slate-200 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => {
                    const copy = [...currentResume.experience];
                    copy[idx].company = e.target.value;
                    setCurrentResume({ ...currentResume, experience: copy });
                  }}
                  className="text-slate-600 text-right w-1/2 border-b border-transparent hover:border-slate-200 focus:outline-none"
                />
              </div>

              {exp.bullet_points.map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => {
                      const copy = [...currentResume.experience];
                      copy[idx].bullet_points[bIdx] = e.target.value;
                      setCurrentResume({ ...currentResume, experience: copy });
                    }}
                    className="w-full px-2 py-1 rounded border border-slate-200 text-[11.5px]"
                  />
                  <button
                    type="button"
                    onClick={() => onSelectText(bullet)}
                    title="AI Assistant"
                    className="p-1 text-slate-400 hover:text-blue-600"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {id === 'projects' && (
        <div className="space-y-3">
          {currentResume.projects.map((proj, idx) => (
            <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={proj.name}
                  onChange={(e) => {
                    const copy = [...currentResume.projects];
                    copy[idx].name = e.target.value;
                    setCurrentResume({ ...currentResume, projects: copy });
                  }}
                  className="font-bold text-slate-800 border-b border-transparent hover:border-slate-200 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Technologies"
                  value={proj.technologies.join(', ')}
                  onChange={(e) => {
                    const copy = [...currentResume.projects];
                    copy[idx].technologies = e.target.value.split(',').map(s => s.trim());
                    setCurrentResume({ ...currentResume, projects: copy });
                  }}
                  className="text-slate-500 font-mono text-[10px] text-right border-b border-transparent hover:border-slate-200 focus:outline-none"
                />
              </div>

              {proj.bullet_points.map((b, bIdx) => (
                <div key={bIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={b}
                    onChange={(e) => {
                      const copy = [...currentResume.projects];
                      copy[idx].bullet_points[bIdx] = e.target.value;
                      setCurrentResume({ ...currentResume, projects: copy });
                    }}
                    className="w-full px-2 py-1 rounded border border-slate-200 text-[11.5px]"
                  />
                  <button
                    type="button"
                    onClick={() => onSelectText(b)}
                    title="AI Assistant"
                    className="p-1 text-slate-400 hover:text-blue-600"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {id === 'skills' && (
        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Languages</label>
            <input
              type="text"
              value={currentResume.skills.languages.join(', ')}
              onChange={(e) => setCurrentResume({
                ...currentResume,
                skills: { ...currentResume.skills, languages: e.target.value.split(',').map(s => s.trim()) }
              })}
              className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Frameworks</label>
            <input
              type="text"
              value={currentResume.skills.frameworks.join(', ')}
              onChange={(e) => setCurrentResume({
                ...currentResume,
                skills: { ...currentResume.skills, frameworks: e.target.value.split(',').map(s => s.trim()) }
              })}
              className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Tools & Cloud</label>
            <input
              type="text"
              value={currentResume.skills.tools.join(', ')}
              onChange={(e) => setCurrentResume({
                ...currentResume,
                skills: { ...currentResume.skills, tools: e.target.value.split(',').map(s => s.trim()) }
              })}
              className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-white"
            />
          </div>
        </div>
      )}

      {id === 'education' && (
        <div className="space-y-2">
          {currentResume.education.map((edu, idx) => (
            <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => {
                  const copy = [...currentResume.education];
                  copy[idx].degree = e.target.value;
                  setCurrentResume({ ...currentResume, education: copy });
                }}
                className="font-bold border-b border-transparent hover:border-slate-200 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => {
                  const copy = [...currentResume.education];
                  copy[idx].institution = e.target.value;
                  setCurrentResume({ ...currentResume, education: copy });
                }}
                className="text-right border-b border-transparent hover:border-slate-200 focus:outline-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
