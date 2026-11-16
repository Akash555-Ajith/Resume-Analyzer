import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { api } from '../../services/api';
import { ResumeData, EducationEntry, WorkExperienceEntry, ProjectEntry, SkillsCategorized } from '../../types/resume';
import { 
  Wand2, 
  Sparkles, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Check, 
  RefreshCw,
  Cpu,
  Microscope,
  Layers,
  Award
} from 'lucide-react';

export const GeneratorPage: React.FC = () => {
  const { currentResume, setCurrentResume, setActivePage, saveCurrentResume } = useResume();

  const [activeTab, setActiveTab] = useState<'prompt' | 'guided'>('prompt');
  
  // Prompt Generator State
  const [promptText, setPromptText] = useState(
    'Create a one-page ATS-friendly resume for a backend engineering internship. Emphasize Python, Django, PostgreSQL and Docker. Highlight my backend projects and keep the design clean and technical.'
  );
  const [promptRole, setPromptRole] = useState('Software Engineer');
  const [promptStage, setPromptStage] = useState('student');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptError, setPromptError] = useState<string | null>(null);

  // Guided Generator State
  const [careerStage, setCareerStage] = useState<string>('student');
  const [personalName, setPersonalName] = useState(currentResume?.personal.name || '');
  const [personalEmail, setPersonalEmail] = useState(currentResume?.personal.email || '');
  const [personalPhone, setPersonalPhone] = useState(currentResume?.personal.phone || '');
  const [personalLocation, setPersonalLocation] = useState(currentResume?.personal.location || '');
  const [personalLinkedin, setPersonalLinkedin] = useState(currentResume?.personal.linkedin || '');
  const [personalGithub, setPersonalGithub] = useState(currentResume?.personal.github || '');
  const [personalPortfolio, setPersonalPortfolio] = useState(currentResume?.personal.portfolio || '');
  const [targetRole, setTargetRole] = useState(currentResume?.target.role || 'Software Engineer');

  // Education (CGPA strictly optional)
  const [degree, setDegree] = useState('B.S. in Computer Science');
  const [institution, setInstitution] = useState('University of California, Berkeley');
  const [gradYear, setGradYear] = useState('2025');
  const [gpa, setGpa] = useState(''); // OPTIONAL

  // Experience
  const [experiences, setExperiences] = useState<WorkExperienceEntry[]>([
    {
      company: 'Tech Innovations Inc.',
      position: 'Software Engineering Intern',
      location: 'San Francisco, CA',
      start_date: 'May 2024',
      end_date: 'Aug 2024',
      is_current: false,
      bullet_points: [
        'Developed REST API endpoints using Python, FastAPI, and PostgreSQL.',
        'Collaborated with senior engineers to implement automated testing suites with 85% coverage.'
      ],
      technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Docker']
    }
  ]);

  // Projects
  const [projects, setProjects] = useState<ProjectEntry[]>([
    {
      name: 'Distributed Key-Value Engine',
      description: 'High-concurrency distributed storage service with Raft consensus.',
      technologies: ['Go', 'Raft', 'gRPC', 'Docker'],
      link: 'github.com/user/raft-kv',
      contribution: 'Engineered leader election and log compaction routines.',
      results: 'Linearizable read throughput verified across 5 test nodes.',
      bullet_points: [
        'Implemented Raft consensus algorithm with dynamic cluster rebalancing.',
        'Benchmarked write throughput to 40,000 operations per second.'
      ]
    }
  ]);

  // Skills
  const [skillsLanguages, setSkillsLanguages] = useState('Python, TypeScript, Go, C++, SQL');
  const [skillsFrameworks, setSkillsFrameworks] = useState('FastAPI, React, Node.js, Next.js');
  const [skillsTools, setSkillsTools] = useState('Docker, Kubernetes, Git, Linux, GitHub Actions');

  // Certifications & Awards
  const [certificationsText, setCertificationsText] = useState('AWS Certified Cloud Practitioner');
  const [achievementsText, setAchievementsText] = useState('Dean\'s Honor List, 1st Place CalHacks');

  // Handler for AI Prompt Generator
  const handlePromptGenerate = async () => {
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setPromptError(null);

    try {
      const generated = await api.generateFromPrompt(promptText, promptStage, promptRole);
      setCurrentResume(generated);
      await saveCurrentResume(generated);
      setActivePage('editor');
    } catch (err: any) {
      setPromptError(err.response?.data?.detail || "Failed to generate resume from prompt. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler for Guided Generation
  const handleGuidedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const langs = skillsLanguages.split(',').map(s => s.trim()).filter(Boolean);
    const frameworks = skillsFrameworks.split(',').map(s => s.trim()).filter(Boolean);
    const tools = skillsTools.split(',').map(s => s.trim()).filter(Boolean);
    const certs = certificationsText.split(',').map(s => s.trim()).filter(Boolean);
    const honors = achievementsText.split(',').map(s => s.trim()).filter(Boolean);

    // Dynamic section ordering based on role stage (Section 14)
    let sectionsOrder = ["summary", "experience", "projects", "skills", "education", "certifications", "achievements"];
    if (careerStage === "student") {
      sectionsOrder = ["education", "projects", "skills", "experience", "certifications", "achievements"];
    } else if (careerStage === "manager") {
      sectionsOrder = ["summary", "leadership", "experience", "skills", "projects", "education", "achievements"];
    } else if (careerStage === "researcher") {
      sectionsOrder = ["summary", "publications", "education", "experience", "projects", "skills", "achievements"];
    }

    const newResume: ResumeData = {
      id: `resume-${Date.now().toString(36)}`,
      title: `${targetRole} Resume`,
      template_id: careerStage === "student" ? "student" : "modern",
      career_stage: careerStage,
      personal: {
        name: personalName || "Candidate Name",
        email: personalEmail || "candidate@example.com",
        phone: personalPhone || "+1 (555) 019-2834",
        location: personalLocation || "San Francisco, CA",
        linkedin: personalLinkedin,
        github: personalGithub,
        portfolio: personalPortfolio,
        title: careerStage === "student" ? "Student" : targetRole
      },
      target: {
        role: targetRole,
        company: "",
        job_description: ""
      },
      summary: `${careerStage === 'student' ? 'Dedicated student and aspiring software engineer' : 'Experienced technical professional'} specializing in ${langs.slice(0, 3).join(', ') || 'modern engineering'} with strong analytical problem-solving skills.`,
      education: [
        {
          id: 'edu-1',
          degree,
          institution,
          graduation_year: gradYear,
          gpa: gpa || '', // CGPA optional
          coursework: ['Data Structures & Algorithms', 'Operating Systems', 'Database Systems']
        }
      ],
      experience: experiences,
      projects: projects,
      skills: {
        languages: langs,
        frameworks: frameworks,
        tools: tools,
        databases: ['PostgreSQL', 'Redis'],
        other: ['RESTful APIs', 'Microservices Architecture']
      },
      certifications: certs,
      achievements: honors,
      publications: [],
      leadership: [],
      sections_order: sectionsOrder
    };

    try {
      const saved = await api.generateGuided(newResume);
      setCurrentResume(saved);
      setActivePage('editor');
    } catch (err: any) {
      setPromptError("Failed to save guided resume. Opening in editor directly.");
      setCurrentResume(newResume);
      setActivePage('editor');
    } finally {
      setIsGenerating(false);
    }
  };

  const addExperienceEntry = () => {
    setExperiences([
      ...experiences,
      {
        company: 'New Company',
        position: 'Role Title',
        location: 'City, State',
        start_date: '2023',
        end_date: 'Present',
        is_current: true,
        bullet_points: ['Describe key responsibility or engineering accomplishment.'],
        technologies: ['Tech']
      }
    ]);
  };

  const addProjectEntry = () => {
    setProjects([
      ...projects,
      {
        name: 'New Project',
        description: 'Brief overview of project architecture.',
        technologies: ['Tech1', 'Tech2'],
        link: '',
        bullet_points: ['Engineered key functionality. (Consider adding a measurable result if available.)']
      }
    ]);
  };

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8 font-sans">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Generate Resume
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Create an ATS-compliant, role-tailored resume using natural language AI or our guided step-by-step wizard.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex border-b border-slate-200 text-sm font-bold gap-8">
        <button
          onClick={() => setActiveTab('prompt')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'prompt' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Prompt Generator (Structured JSON)</span>
        </button>

        <button
          onClick={() => setActiveTab('guided')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'guided' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          <span>Guided Step-by-Step Builder</span>
        </button>
      </div>

      {/* MODE 1: AI Prompt Generator */}
      {activeTab === 'prompt' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Natural Language AI Resume Synthesis</h2>
            <p className="text-xs text-slate-500">
              Describe your target role, preferred technologies, and background in plain English. Gemini Pro compiles your request into structured resume JSON matching your selected template.
            </p>
          </div>

          {/* Prompt Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Role
              </label>
              <select
                value={promptRole}
                onChange={(e) => setPromptRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="ML Engineer">Machine Learning Engineer</option>
                <option value="FPGA Engineer">FPGA / Hardware Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Researcher">Researcher / Scholar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Career Stage Structure
              </label>
              <select
                value={promptStage}
                onChange={(e) => setPromptStage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="student">Student / Fresh Graduate (Education first, CGPA optional)</option>
                <option value="software_engineer">Software Engineer (Experience & Technical Skills)</option>
                <option value="manager">Manager / Lead (Leadership & Business Impact)</option>
                <option value="researcher">Researcher (Publications & Methodology)</option>
              </select>
            </div>
          </div>

          {/* Large Prompt Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              AI Generation Prompt
            </label>
            <textarea
              rows={5}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g. Create a one-page ATS-friendly resume for a backend engineering internship. Emphasize Python, Django, PostgreSQL and Docker. Highlight my backend projects and keep the design clean and technical..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-normal text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed font-sans"
            />
          </div>

          {/* Quick Preset Prompts */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Prompt Starters:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                "Create a student resume for backend internship with Python, Django, and PostgreSQL.",
                "Build a Senior Full Stack Engineer resume highlighting React, Go, Kafka, and microservices.",
                "Create an FPGA engineer resume emphasizing Verilog, Vivado, and PCIe communication.",
                "Create a Research resume with publications, PyTorch experiments, and distributed systems."
              ].map((starter, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPromptText(starter)}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] transition-colors text-left"
                >
                  «{starter}»
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {promptError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {promptError}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              disabled={isGenerating || !promptText.trim()}
              onClick={handlePromptGenerate}
              className="px-7 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Structured Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Resume & Open Editor</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: Guided Step-by-Step Builder */}
      {activeTab === 'guided' && (
        <form onSubmit={handleGuidedSubmit} className="space-y-8">
          
          {/* Section 1: Role & Career Stage Adaptation */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Briefcase className="w-4 h-4" />
              <span>Step 1: Role-Specific Adaptation</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Select Career Stage & Target Position</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { id: 'student', label: 'Student / Fresher', desc: 'Education & Projects first' },
                { id: 'software_engineer', label: 'Software Engineer', desc: 'Experience & Tech Skills' },
                { id: 'hardware_engineer', label: 'Hardware / FPGA', desc: 'Silicon, RTL & Hardware' },
                { id: 'manager', label: 'Manager / Lead', desc: 'Leadership & Team scale' },
              ].map((stage) => (
                <div
                  key={stage.id}
                  onClick={() => setCareerStage(stage.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    careerStage === stage.id
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-800">{stage.label}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{stage.desc}</div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Job Title
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Distributed Systems Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Section 2: Personal Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <User className="w-4 h-4" />
              <span>Step 2: Personal Information</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Contact & Online Presence</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={personalName}
                  onChange={(e) => setPersonalName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                  placeholder="alex.mercer@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={personalPhone}
                  onChange={(e) => setPersonalPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
                <input
                  type="text"
                  value={personalLocation}
                  onChange={(e) => setPersonalLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={personalLinkedin}
                  onChange={(e) => setPersonalLinkedin(e.target.value)}
                  placeholder="linkedin.com/in/username"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">GitHub Profile</label>
                <input
                  type="text"
                  value={personalGithub}
                  onChange={(e) => setPersonalGithub(e.target.value)}
                  placeholder="github.com/username"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Education (CGPA Strictly Optional) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Step 3: Education</span>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Academic Background</h3>
              <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                CGPA is optional
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Degree</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="B.S. in Computer Science"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Institution</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="University / College"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Graduation Year</label>
                <input
                  type="text"
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  placeholder="2025"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">CGPA / GPA (Optional)</label>
                <input
                  type="text"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  placeholder="Optional (leave empty if desired)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Experience */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
                <Briefcase className="w-4 h-4" />
                <span>Step 4: Experience</span>
              </div>
              <button
                type="button"
                onClick={addExperienceEntry}
                className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const copy = [...experiences];
                        copy[idx].company = e.target.value;
                        setExperiences(copy);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) => {
                        const copy = [...experiences];
                        copy[idx].position = e.target.value;
                        setExperiences(copy);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Dates (e.g. 2023 - Present)"
                      value={exp.start_date}
                      onChange={(e) => {
                        const copy = [...experiences];
                        copy[idx].start_date = e.target.value;
                        setExperiences(copy);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Bullet Point</label>
                    <textarea
                      rows={2}
                      value={exp.bullet_points[0] || ''}
                      onChange={(e) => {
                        const copy = [...experiences];
                        copy[idx].bullet_points = [e.target.value];
                        setExperiences(copy);
                      }}
                      placeholder="Engineered key feature. (Consider adding a measurable result if available.)"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Projects */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
                <Code2 className="w-4 h-4" />
                <span>Step 5: Technical Projects</span>
              </div>
              <button
                type="button"
                onClick={addProjectEntry}
                className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={proj.name}
                      onChange={(e) => {
                        const copy = [...projects];
                        copy[idx].name = e.target.value;
                        setProjects(copy);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Technologies (e.g. Go, Docker, gRPC)"
                      value={proj.technologies.join(', ')}
                      onChange={(e) => {
                        const copy = [...projects];
                        copy[idx].technologies = e.target.value.split(',').map(s => s.trim());
                        setProjects(copy);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Project bullet describing implementation and outcome."
                    value={proj.bullet_points?.[0] || ''}
                    onChange={(e) => {
                      const copy = [...projects];
                      copy[idx].bullet_points = [e.target.value];
                      setProjects(copy);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Skills */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Step 6: Skills & Technologies</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Programming Languages</label>
                <input
                  type="text"
                  value={skillsLanguages}
                  onChange={(e) => setSkillsLanguages(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Frameworks & Libraries</label>
                <input
                  type="text"
                  value={skillsFrameworks}
                  onChange={(e) => setSkillsFrameworks(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tools, Cloud & Platforms</label>
                <input
                  type="text"
                  value={skillsTools}
                  onChange={(e) => setSkillsTools(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isGenerating}
              className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Compile Resume & Open Editor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
