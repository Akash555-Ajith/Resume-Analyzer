import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { AnalyserPage } from './components/analyzer/AnalyserPage';
import { GeneratorPage } from './components/generator/GeneratorPage';
import { TemplatesPage } from './components/templates/TemplatesPage';
import { ApiKeyModal } from './components/common/ApiKeyModal';
import { ResumeData, SimpleAnalysisResult } from './types/resume';

// Default Master Sample Resume
const initialResume: ResumeData = {
  id: 'master-1',
  title: 'Master Professional Resume',
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
  summary: 'L7 Staff Architect specializing in high-throughput payment infrastructure, distributed consensus protocols, and ultra-low latency transaction processing.',
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
      position: 'Staff Infrastructure Architect',
      location: 'San Francisco, CA',
      start_date: '2021',
      end_date: 'Present',
      is_current: true,
      bullet_points: [
        'Engineered core multi-region transaction ledger processing 148k RPS with 99.995% availability under network degradation.',
        'Replaced legacy microservices synchronization with Raft Consensus and eBPF zero-copy networking, reducing p99 latency by 26ms.'
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
      technologies: ['Go', 'Raft Consensus', 'gRPC'],
      description: 'High-performance distributed key-value storage engine with fault-tolerant linearizable reads.',
      bullet_points: [
        'Implemented Raft consensus algorithm with dynamic cluster membership changes.',
        'Benchmarked 85,000 write ops/sec across 5-node cluster with zero data loss.'
      ]
    }
  ],
  skills: [
    { category: 'Languages', skills: ['Go', 'Rust', 'Python', 'TypeScript', 'C++', 'SQL'] },
    { category: 'Infrastructure', skills: ['Kubernetes', 'Docker', 'eBPF', 'AWS', 'gRPC', 'Kafka', 'PostgreSQL', 'Redis'] }
  ],
  certifications: ['AWS Certified Solutions Architect', 'Certified Kubernetes Administrator (CKA)'],
  achievements: ['Top 3% Staff Infrastructure Benchmark'],
  publications: ['Low-Latency Consensus in Payment Ledgers (ACM Queue 2023)'],
  leadership: [],
  extracurriculars: []
};

const initialAnalysis: SimpleAnalysisResult = {
  overall_score: 88,
  strengths: [
    "Strong quantified achievements with action-oriented metrics (148k RPS, 99.995% availability).",
    "High technical complexity demonstrated in distributed systems (Raft Consensus, eBPF).",
    "Stanford CS degree with specialized coursework in distributed computing."
  ],
  weaknesses: [
    "Summary section could be slightly more concise.",
    "Missing explicit mention of automated CI/CD pipeline automation."
  ],
  section_feedback: {
    summary: "Clear and authoritative position statement. Can be condensed into 2 punchy lines.",
    experience: "Exceptional bullet point density using Action + Work + Context + Result formula.",
    education: "Solid Stanford CS degree presentation with relevant coursework.",
    skills: "Indexed cleanly by category. High searchability for ATS systems.",
    projects: "High complexity Go / Raft consensus project demonstrates deep systems engineering."
  },
  missing_sections: ["Certifications"],
  missing_keywords: ["Docker", "CI/CD", "Terraform", "AWS"],
  formatting_issues: ["Dates are consistent across all entries."],
  grammar_issues: [],
  jd_match_score: undefined,
  jd_keyword_gaps: []
};

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<'analyser' | 'generator' | 'templates'>('analyser');
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [analysis, setAnalysis] = useState<SimpleAnalysisResult>(initialAnalysis);

  const handleSaveApiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleUseTemplateForAnalyser = (templateId: string) => {
    setResume({ ...resume, template_id: templateId });
    setActivePage('analyser');
  };

  const handleUseTemplateForGenerator = (templateId: string) => {
    setResume({ ...resume, template_id: templateId });
    setActivePage('generator');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 flex flex-col font-sans">
      {/* Top Navbar with 3 Page Links */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(geminiApiKey)}
      />

      {/* Main 3 Pages */}
      <main className="flex-1 pb-12">
        {activePage === 'analyser' && (
          <AnalyserPage
            resume={resume}
            setResume={setResume}
            analysis={analysis}
            setAnalysis={setAnalysis}
            onGoToTemplates={() => setActivePage('templates')}
          />
        )}

        {activePage === 'generator' && (
          <GeneratorPage
            resume={resume}
            setResume={setResume}
            onGoToTemplates={() => setActivePage('templates')}
          />
        )}

        {activePage === 'templates' && (
          <TemplatesPage
            resume={resume}
            setResume={setResume}
            onUseTemplateForGenerator={handleUseTemplateForGenerator}
            onUseTemplateForAnalyser={handleUseTemplateForAnalyser}
          />
        )}
      </main>

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
