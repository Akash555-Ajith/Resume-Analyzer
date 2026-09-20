import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { TelemetryDashboard } from './components/dashboard/TelemetryDashboard';
import { ATSDeepAudit } from './components/analyzer/ATSDeepAudit';
import { JDMatchStudio } from './components/jd/JDMatchStudio';
import { AIResumeIDE } from './components/editor/AIResumeIDE';
import { GithubScanner } from './components/github/GithubScanner';
import { UserProfileManager } from './components/profile/UserProfileManager';
import { ApiKeyModal } from './components/common/ApiKeyModal';
import { ResumeData, FullAnalysisResult, UserProfile } from './types/resume';
import { apiService } from './services/api';

// Initial Mock Resume matching screenshot dossier
const initialResume: ResumeData = {
  id: 'master-1',
  title: 'Staff SWE Platform & Payment Core',
  template_id: 'modern_professional',
  contact: {
    name: 'Erik Rostad',
    email: 'erik.rostad@stripe.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/erik-rostad',
    github: 'github.com/erikrostad',
    portfolio: 'erikrostad.dev',
    other_links: []
  },
  summary: 'L7 Staff Architect specializing in high-throughput payment infrastructure, distributed consensus systems, and ultra-low latency transaction processing.',
  education: [
    {
      degree: 'B.S. in Computer Science & Distributed Systems',
      institution: 'Stanford University',
      graduation_year: '2018',
      gpa: '3.92',
      coursework: ['Distributed Operating Systems', 'Database Internals', 'Parallel Computing']
    }
  ],
  experience: [
    {
      company: 'Stripe',
      position: 'Staff Infrastructure & Payment Architect',
      location: 'San Francisco, CA',
      start_date: '2021',
      end_date: 'Present',
      is_current: true,
      bullet_points: [
        'Engineered core multi-region transaction ledger processing 148k RPS with 99.995% availability under global network degradation.',
        'Replaced legacy microservices synchronization with Raft Consensus and eBPF zero-copy networking, reducing p99 latency by 26ms.',
        'Architected automated fraud audit stream processing $4.2M daily payload volume across 28 distributed engineering squads.'
      ]
    },
    {
      company: 'Datadog',
      position: 'Senior Distributed Systems Engineer',
      location: 'New York, NY',
      start_date: '2018',
      end_date: '2021',
      is_current: false,
      bullet_points: [
        'Designed real-time Telemetry Pipeline indexing 5.2B metric events/sec using Rust, Go, and Kafka.',
        'Optimized memory layout and cache alignment in indexing daemon, yielding a $1.4M annual cloud infrastructure cost reduction.'
      ]
    }
  ],
  projects: [
    {
      name: 'Distributed RaftKV Engine',
      technologies: ['Go', 'Raft Consensus', 'gRPC', 'LevelDB'],
      description: 'High-performance distributed key-value storage engine with fault-tolerant linearizable reads.',
      bullet_points: [
        'Implemented Raft consensus algorithm with dynamic cluster membership changes and snapshot compression.',
        'Benchmarked 85,000 write ops/sec across 5-node cluster with zero data loss during network partition simulations.'
      ]
    }
  ],
  skills: [
    { category: 'Languages', skills: ['Go', 'Rust', 'Python', 'C++', 'TypeScript', 'SQL'] },
    { category: 'Infrastructure & Cloud', skills: ['Kubernetes', 'Docker', 'eBPF', 'AWS', 'gRPC', 'Kafka', 'PostgreSQL', 'Redis'] },
    { category: 'Architecture', skills: ['Distributed Systems', 'Consensus Protocols', 'High Availability', 'p99 Latency Tuning'] }
  ],
  certifications: ['AWS Certified Solutions Architect', 'Certified Kubernetes Administrator'],
  achievements: ['Top 3% Staff Infrastructure Benchmark', 'L7 Institutional Audit Clear'],
  publications: ['Low-Latency Consensus in Payment Ledgers (ACM Queue 2023)'],
  leadership: [],
  extracurriculars: []
};

// Initial Analysis matching Stitch UI screenshot
const initialAnalysis: FullAnalysisResult = {
  overall_score: 94,
  ats_score: 96,
  content_quality_score: 92,
  role_relevance_score: 94,
  keyword_relevance_score: 95,
  experience_strength_score: 91,
  project_strength_score: 93,
  skills_relevance_score: 96,
  formatting_score: 98,
  readability_score: 95,
  achievement_impact_score: 92,
  parse_fidelity: 99.2,
  table_faults: 0,
  quant_impact_ratio: '14 / 14',
  recruiter_pass_time: '6.2s',
  google_xyz_adherence: 98,
  ats_parseability_schema: 99,
  ats_flaws: [
    {
      id: 'flaw-1',
      problem: 'Skills represented using graphical progress bars in PDF export.',
      why: 'ATS systems like Workday & Greenhouse cannot interpret graphic meters and drop tokens.',
      recommendation: 'Replace visual bars with a text-based Skills category block.',
      severity: 'medium',
      category: 'ATS Formatting'
    },
    {
      id: 'flaw-2',
      problem: 'Inject distributed consensus keywords into Experience block #1 (Stripe Ledger Infra parity).',
      why: 'Replacing microservices synchronization with Raft Consensus will bridge remaining L7 gap.',
      recommendation: 'Apply 1-click AI rewrite.',
      severity: 'high',
      category: 'Keyword Alignment'
    }
  ],
  sub_scores: [],
  jd_matrix: [
    { requirement: 'Distributed Systems Scale', resume_evidence: '148k RPS / Multi-Region', match_level: 'Strong', recommendation: 'Highlight cross-region failover.' },
    { requirement: 'p99 Latency Tuning', resume_evidence: 'eBPF zero-copy latency (26ms reduction)', match_level: 'Strong', recommendation: 'Keep at top bullet.' },
    { requirement: 'Kubernetes & gRPC', resume_evidence: 'Listed in skills and Datadog project', match_level: 'Moderate', recommendation: 'Add 500+ node metric.' }
  ],
  high_yield_recommendations: [
    'Inject distributed consensus keywords into Experience block #1'
  ]
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [targetRole, setTargetRole] = useState('Staff Software Engineer - Distributed Systems');
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [analysis, setAnalysis] = useState<FullAnalysisResult>(initialAnalysis);
  const [profile, setProfile] = useState<UserProfile>({
    contact: initialResume.contact,
    current_position: 'Staff Architect',
    target_position: targetRole,
    industry: 'Financial Technology / Software',
    experience_level: 'Senior / Staff',
    years_of_experience: 8,
    is_student: false,
    education: initialResume.education,
    certifications: initialResume.certifications,
    publications: initialResume.publications,
    achievements: initialResume.achievements
  });

  const handleSaveApiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleDeepReScan = async () => {
    try {
      const res = await apiService.scoreResume(resume, targetRole);
      setAnalysis(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyRewrite = () => {
    setActiveTab('ide');
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 flex font-sans">
      {/* Sidebar Navigation matching screenshot */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          targetRole={targetRole}
          setTargetRole={setTargetRole}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          hasApiKey={Boolean(geminiApiKey)}
        />

        <main className="flex-1 pb-12">
          {activeTab === 'dashboard' && (
            <TelemetryDashboard
              analysis={analysis}
              resume={resume}
              targetRole={targetRole}
              onDeepReScan={handleDeepReScan}
              onApplyRewrite={handleApplyRewrite}
              onOpenIDE={() => setActiveTab('ide')}
              onExportPDF={handleExportPDF}
            />
          )}

          {activeTab === 'audit' && (
            <ATSDeepAudit
              analysis={analysis}
              resume={resume}
              setResume={setResume}
              setAnalysis={setAnalysis}
              targetRole={targetRole}
              onOpenIDE={() => setActiveTab('ide')}
            />
          )}

          {activeTab === 'jd-studio' && (
            <JDMatchStudio
              resume={resume}
              targetRole={targetRole}
              setTargetRole={setTargetRole}
              analysis={analysis}
              setAnalysis={setAnalysis}
              onOpenIDE={() => setActiveTab('ide')}
            />
          )}

          {activeTab === 'ide' && (
            <AIResumeIDE
              resume={resume}
              setResume={setResume}
              analysis={analysis}
              onExportPDF={handleExportPDF}
              targetRole={targetRole}
            />
          )}

          {activeTab === 'github' && (
            <GithubScanner
              resume={resume}
              setResume={setResume}
              onOpenIDE={() => setActiveTab('ide')}
            />
          )}

          {activeTab === 'profile' && (
            <UserProfileManager
              profile={profile}
              setProfile={setProfile}
            />
          )}

          {(activeTab === 'benchmark' || activeTab === 'my-resumes' || activeTab === 'templates') && (
            <TelemetryDashboard
              analysis={analysis}
              resume={resume}
              targetRole={targetRole}
              onDeepReScan={handleDeepReScan}
              onApplyRewrite={handleApplyRewrite}
              onOpenIDE={() => setActiveTab('ide')}
              onExportPDF={handleExportPDF}
            />
          )}
        </main>
      </div>

      {/* Gemini Key Config Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaveKey={handleSaveApiKey}
        currentKey={geminiApiKey}
      />
    </div>
  );
};
