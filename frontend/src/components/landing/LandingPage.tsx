import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { 
  Sparkles, 
  Wand2, 
  Github, 
  Target, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  Cpu, 
  GraduationCap, 
  Briefcase, 
  Microscope, 
  Layers,
  FileCheck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActivePage } = useResume();

  const roleCategories = [
    { name: 'Software Engineer', icon: Code2, desc: 'Experience, technical skills, scalable architectures & engineering outcomes.' },
    { name: 'Student & Graduate', icon: GraduationCap, desc: 'Education, academic coursework, hackathons & hands-on projects (CGPA optional).' },
    { name: 'Hardware / FPGA Engineer', icon: Cpu, desc: 'Verilog, RTL synthesis, timing closure, microcontrollers & embedded testing.' },
    { name: 'Researcher & Scholar', icon: Microscope, desc: 'Peer-reviewed publications, methodology, academic appointments & citations.' },
    { name: 'Manager & Director', icon: Briefcase, desc: 'Team leadership, business impact, organizational roadmaps & delivery scale.' },
    { name: 'Product Manager', icon: Layers, desc: 'Product requirements, KPI milestones, user research & go-to-market strategies.' },
  ];

  return (
    <div className="bg-[#F8FAFC] text-slate-900 font-sans min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-8 animate-fade-in shadow-xs">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>AI Resume Intelligence & Generation Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Build a Resume That <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Actually Represents Your Work.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Analyze, generate, tailor, and edit professional resumes using AI. Grounded in factual project evidence without manufactured metrics.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => setActivePage('analyze')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze My Resume</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => setActivePage('generate')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md hover:bg-slate-800 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              <span>Generate My Resume</span>
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
            <span className="text-slate-400">Explore Workflows:</span>
            <button
              onClick={() => setActivePage('github')}
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5 underline underline-offset-4"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Generate From GitHub</span>
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setActivePage('job-match')}
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5 underline underline-offset-4"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Match With Job Description</span>
            </button>
          </div>

          {/* Interactive Preview Teaser Card */}
          <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-white border border-slate-200/80 shadow-2xl p-6 sm:p-8 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Real-Time ATS Health Analysis</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Multi-Vector Audit & Scoring Matrix</h3>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-500">Overall Score:</span>
                <span className="text-2xl font-black text-blue-600">87 <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
              {[
                { label: 'ATS Compatibility', score: 87, color: 'text-emerald-600' },
                { label: 'Content Quality', score: 78, color: 'text-blue-600' },
                { label: 'Role Alignment', score: 84, color: 'text-indigo-600' },
                { label: 'Keyword Match', score: 76, color: 'text-amber-600' },
                { label: 'Formatting Index', score: 91, color: 'text-purple-600' },
              ].map((m, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 truncate">{m.label}</div>
                  <div className={`text-xl font-bold mt-1 ${m.color}`}>{m.score}%</div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700 flex items-start gap-3">
              <FileCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">Zero-Hallucination Architecture: </span>
                Our AI analyzes your actual repositories and text without manufacturing fictional metrics, degrees, or employers.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Role-Specific Adaptation Grid */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Role-Specific Structural Adaptation
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            The platform dynamically reshapes section hierarchy, bullet emphasis, and ATS keywords to match your career stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roleCategories.map((role, idx) => {
            const Icon = role.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{role.name}</h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">{role.desc}</p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span onClick={() => setActivePage('generate')} className="cursor-pointer hover:underline">
                    Create {role.name} Resume
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base">Deep ATS Flaw Detection</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Diagnoses table structures, column compatibility, font types, header standardizations, and keyword density with actionable <em>Problem → Why → Recommendation</em> guidance.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base">GitHub Evidence Extractor</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspects your GitHub repositories, codebases, frameworks, and architecture to extract factual resume bullet points backed by real repository evidence.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base">Split-Screen Visual IDE</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Edit structured JSON with live visual preview, drag-and-drop section reordering, natural language AI command bar, and instant template switching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white text-sm">AI Resume Analyzer</span>
            <span>— Precision Career Intelligence</span>
          </div>
          <div className="text-slate-500">
            Powered by Google Gemini Pro • Backend API Secured
          </div>
        </div>
      </footer>

    </div>
  );
};
