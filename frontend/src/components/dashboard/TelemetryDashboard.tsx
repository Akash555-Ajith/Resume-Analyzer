import React from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Download, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Zap,
  Shield,
  Layers,
  FileCode,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { FullAnalysisResult, ResumeData } from '../../types/resume';

interface TelemetryDashboardProps {
  analysis: FullAnalysisResult;
  resume: ResumeData;
  targetRole: string;
  onDeepReScan: () => void;
  onApplyRewrite: () => void;
  onOpenIDE: () => void;
  onExportPDF: () => void;
}

export const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({
  analysis,
  resume,
  targetRole,
  onDeepReScan,
  onApplyRewrite,
  onOpenIDE,
  onExportPDF
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* 1. TOP POSITION DOSSIER CARD */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              TOP 3% STAFF INFRASTRUCTURE BENCHMARK
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-200">
              <Shield className="w-3 h-3 text-slate-500" /> L7 Institutional Audit Clear
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDeepReScan}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Deep Re-Scan
            </button>
            <button
              onClick={onExportPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-lg shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Production PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
              TARGET POSITION DOSSIER
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex flex-wrap items-center gap-3">
              {targetRole || "Staff Infrastructure & Payments"}
              <span className="text-base font-normal text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                @ Stripe <span className="font-mono text-xs text-slate-400">$360k - $420k base + equity</span>
              </span>
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Algorithmic indexing confirms 89% structural parity with Stripe Foundation Core Engine requisitions. 4 high-yield telemetry deltas identified for immediate pipeline conversion.
            </p>
          </div>

          {/* Right Stats Widgets */}
          <div className="lg:col-span-4 grid grid-cols-3 gap-2 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 text-center">
            <div className="p-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase">PARSE FIDELITY</div>
              <div className="text-base font-extrabold font-mono text-slate-900 flex items-center justify-center gap-1">
                {analysis.parse_fidelity}% <TrendingUp className="w-3 h-3 text-emerald-500" />
              </div>
              <div className="text-[9px] text-slate-500 font-mono">{analysis.table_faults} Table Faults</div>
            </div>

            <div className="p-2 border-x border-slate-200">
              <div className="text-[10px] font-mono text-slate-400 uppercase">QUANT IMPACT</div>
              <div className="text-base font-extrabold font-mono text-slate-900 flex items-center justify-center gap-1">
                {analysis.quant_impact_ratio} <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-[9px] text-slate-500 font-mono">X-Y-Z Fully Saturated</div>
            </div>

            <div className="p-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase">RECRUITER PASS</div>
              <div className="text-base font-extrabold font-mono text-emerald-600">
                {analysis.recruiter_pass_time}
              </div>
              <div className="text-[9px] text-slate-500 font-mono">Avg Skim Index</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TELEMETRY SCORES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ATS Readiness Index (Circular Gauge) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                  COMPOSITE EVALUATION
                </span>
                <h3 className="text-base font-bold text-slate-900">ATS Readiness Index</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 uppercase">
                STABLE
              </span>
            </div>

            {/* Circular Gauge Ring */}
            <div className="relative w-44 h-44 mx-auto my-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="text-slate-100 stroke-current"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="text-brand-orange stroke-current transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - analysis.overall_score / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold font-mono text-slate-900 tracking-tight">
                  {analysis.overall_score}
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-medium uppercase">
                  / 100 PTS
                </span>
              </div>
            </div>

            {/* Gauge Legend */}
            <div className="flex items-center justify-center gap-6 text-[11px] font-mono text-slate-600 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-orange" />
                <span>Core ATS Weight (80%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span>Semantic Depth (20%)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={onDeepReScan}
              className="px-3 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Deep Re-Scan
            </button>
            <button
              onClick={onExportPDF}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Production PDF
            </button>
          </div>
        </div>

        {/* Sub-System Verification Vectors */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                  ALGORITHMIC BREAKDOWN
                </span>
                <h3 className="text-base font-bold text-slate-900">Sub-System Verification Vectors</h3>
              </div>
              <span className="text-xs font-mono text-slate-400 font-medium">
                Target Requisition: STRIPE-PAY-L7
              </span>
            </div>

            {/* Progress Bars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
              
              {/* Vector 1 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Keyword Alignment</span>
                  <span className="font-mono font-bold text-slate-900">
                    {analysis.keyword_relevance_score}% <span className="text-emerald-600 text-[10px] font-normal">(+4%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-orange h-full rounded-full" style={{ width: `${analysis.keyword_relevance_score}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  48 of 50 Target Tokens Indexed • High Cluster Density
                </p>
              </div>

              {/* Vector 2 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Metric & Revenue Density</span>
                  <span className="font-mono font-bold text-slate-900">
                    {analysis.content_quality_score}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full rounded-full" style={{ width: `${analysis.content_quality_score}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Quantified Impact in 92% of Experience Statements
                </p>
              </div>

              {/* Vector 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Google X-Y-Z Adherence</span>
                  <span className="font-mono font-bold text-brand-orange">
                    {analysis.google_xyz_adherence}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-orange h-full rounded-full" style={{ width: `${analysis.google_xyz_adherence}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Accomplished [X], measured by [Y], by doing [Z]
                </p>
              </div>

              {/* Vector 4 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">ATS Parseability & Schema</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {analysis.ats_parseability_schema}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${analysis.ats_parseability_schema}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Flawless UTF-8 token extraction on Greenhouse & Workday
                </p>
              </div>

            </div>
          </div>

          {/* 7-Day Iteration Delta Sparkline */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-semibold text-slate-800">7-Day Score Iteration Delta</span>
                <p className="text-[10px] text-slate-500 font-mono">Progress from initial baseline: +18 points across 4 revisions</p>
              </div>
            </div>
            {/* SVG Sparkline */}
            <svg className="w-28 h-7 stroke-brand-orange" fill="none" viewBox="0 0 100 30">
              <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M 0 25 L 25 20 L 50 15 L 75 18 L 100 5" />
            </svg>
          </div>
        </div>

      </div>

      {/* 3. HIGH-YIELD OPTIMIZATION BANNER */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 max-w-3xl">
          <div className="w-9 h-9 rounded-lg bg-brand-orange text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-brand-orange text-white text-[10px] font-mono font-bold uppercase rounded">
                HIGH-YIELD OPTIMIZATION
              </span>
              <span className="text-xs font-mono font-bold text-amber-900">+5 ATS Points Potential</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Inject distributed consensus keywords into Experience block #1 (Stripe Ledger Infra parity)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Replacing generic <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">microservices synchronization</code> with <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono font-bold">Raft Consensus</code> and <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono font-bold">eBPF zero-copy latency</code> will bridge the remaining L7 gap.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-amber-100/60 rounded-lg transition-colors">
            Dismiss
          </button>
          <button
            onClick={onApplyRewrite}
            className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            Apply AI Rewrite <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. TARGET VARIANTS & LIVE AUDIT STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Target Architecture Variants */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-900">Target Architecture Variants</h3>
            </div>
            <button className="text-[11px] font-mono text-brand-orange font-bold hover:underline">
              + NEW TARGET VARIANT
            </button>
          </div>

          <div className="space-y-3">
            {/* Variant 1 (Active) */}
            <div className="p-4 rounded-xl border border-brand-orange/40 bg-orange-50/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">Staff SWE Platform & Payment Core</h4>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-brand-orange text-white uppercase rounded">
                    ACTIVE MAIN
                  </span>
                </div>
                <span className="text-xs font-mono font-extrabold text-brand-orange">94% Match</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">Targeting: Stripe, Adyen, Block • Revised Today, 14:24</p>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-600">
                <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">✓ Distributed Consensus</span>
                <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">✓ p99 Latency Tuning</span>
                <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">✓ Multi-Region Failover</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-[10px] font-mono text-slate-400">Build v4.2.8 • 2 Pages • 624 Words</span>
                <div className="flex items-center gap-2">
                  <button onClick={onOpenIDE} className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-semibold">
                    Compare Diff
                  </button>
                  <button onClick={onOpenIDE} className="px-2.5 py-1 text-white bg-brand-orange hover:bg-brand-orange-hover rounded text-[11px] font-semibold">
                    Open in IDE
                  </button>
                </div>
              </div>
            </div>

            {/* Variant 2 */}
            <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">Engineering Manager - Core Infrastructure</h4>
                  <span className="px-2 py-0.5 text-[9px] font-mono text-slate-500 bg-slate-100 uppercase rounded">
                    Secondary
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700">88% Match</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">Targeting: Datadog, Snowflake • Revised Yesterday, 18:10</p>
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[10px] font-mono text-slate-400">Build v3.9.1 • 2 Pages • 590 Words</span>
                <button className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-semibold">
                  Activate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Audit Stream */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Live Audit Stream</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">GREENHOUSE ENGINE v3.8</span>
            </div>

            {/* Timeline Logs */}
            <div className="space-y-3 font-mono text-[11px] my-2">
              
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>14:28:13 PST</span>
                  <span className="text-emerald-600 font-bold">● PASS (100%)</span>
                </div>
                <div className="font-bold text-slate-800">Workday Schema Extraction Verified</div>
                <p className="text-slate-500 text-[10px]">Full nested object serialization without token loss. Headers and dates categorized cleanly.</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>13:58:44 PST</span>
                  <span className="text-brand-orange font-bold">⚡ OPTIMIZED</span>
                </div>
                <div className="font-bold text-slate-800">Injected 3 Missing Domain Vectors</div>
                <p className="text-slate-500 text-[10px]">Appended Terraform Enterprise, Raft Consensus, and eBPF tracing to Skills Taxonomy block.</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>12:15:03 PST</span>
                  <span className="text-teal-600 font-bold">⌘ IMPACT RESTRUCTURE</span>
                </div>
                <div className="font-bold text-slate-800">Replaced Passive Sentence with Quant Formula</div>
                <p className="text-slate-500 text-[10px]">"Worked on payment throughput" → "Engineered fault-tolerant pipeline processing 140k req/s at 99.99% availability".</p>
              </div>

            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-right">
            <button className="text-[11px] font-mono text-slate-500 hover:text-slate-900 font-semibold inline-flex items-center gap-1">
              INSPECT COMPLETE AUDIT LEDGER <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* 5. INSTITUTIONAL HIRING BAR BENCHMARK MATRIX TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
              COMPARATIVE TALENT TOPOLOGY
            </span>
            <h3 className="text-base font-bold text-slate-900">Institutional Hiring Bar Benchmark Matrix</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Evaluated Against 2,400+ Verified Hires (2025-2026)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-400 bg-slate-50/50">
                <th className="py-2.5 px-3">EVALUATION VECTOR</th>
                <th className="py-2.5 px-3">CANDIDATE CURRENT</th>
                <th className="py-2.5 px-3 text-brand-orange">STRIPE STAFF TARGET</th>
                <th className="py-2.5 px-3">GOOGLE L6 SWE</th>
                <th className="py-2.5 px-3">META E6 INFRA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              
              <tr>
                <td className="py-3 px-3 font-sans font-bold flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-brand-orange" /> Distributed Systems Scale
                </td>
                <td className="py-3 px-3 font-bold text-emerald-600">
                  148k RPS / Multi-Region
                </td>
                <td className="py-3 px-3 font-bold text-brand-orange">
                  100k+ RPS Required
                </td>
                <td className="py-3 px-3 text-slate-600">
                  Planetary Scale (Spanner)
                </td>
                <td className="py-3 px-3 text-slate-600">
                  Exabyte / Sharded Core
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 font-sans font-bold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-500" /> Cross-Org Scope & Leverage
                </td>
                <td className="py-3 px-3 font-bold text-emerald-600">
                  4 Squads / 28 Engineers
                </td>
                <td className="py-3 px-3 font-bold text-brand-orange">
                  Company-wide Pillar
                </td>
                <td className="py-3 px-3 text-slate-600">
                  Multi-Team (25+ Eng)
                </td>
                <td className="py-3 px-3 text-slate-600">
                  Org-Level Strategy
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 font-sans font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-teal-600" /> Quantified Revenue Impact
                </td>
                <td className="py-3 px-3 font-bold text-slate-900">
                  $4.2M Cloud Savings
                </td>
                <td className="py-3 px-3 font-bold text-brand-orange">
                  Payment Latency &lt; 26ms
                </td>
                <td className="py-3 px-3 text-slate-600">
                  Efficiency / Tier-0 Infra
                </td>
                <td className="py-3 px-3 text-slate-600">
                  Bottom-Line Margin Gain
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 font-sans font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" /> Reliability & SLA Commitment
                </td>
                <td className="py-3 px-3 font-bold text-emerald-600">
                  99.995% Achieved
                </td>
                <td className="py-3 px-3 font-bold text-brand-orange">
                  99.999% Critical SLA
                </td>
                <td className="py-3 px-3 text-slate-600">
                  Five Nines Core Tier
                </td>
                <td className="py-3 px-3 text-slate-600">
                  99.99% Global Uptime
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
