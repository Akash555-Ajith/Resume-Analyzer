import React from 'react';
import { ResumeData } from '../../types/resume';

interface ResumeRendererProps {
  resume: ResumeData;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({ resume }) => {
  const { contact, summary, education, experience, projects, skills, certifications, template_id } = resume;

  // 1. ATS CLASSIC TEMPLATE (Single column, minimal typography, machine-readable)
  if (template_id === 'ats_classic') {
    return (
      <div className="resume-container bg-white text-black p-8 max-w-2xl mx-auto font-serif text-sm leading-normal">
        {/* Contact Header */}
        <div className="text-center border-b border-black pb-3 mb-4">
          <h1 className="text-xl font-bold uppercase tracking-wider">{contact.name || 'YOUR NAME'}</h1>
          <div className="text-xs font-sans mt-1 space-x-2">
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>• {contact.phone}</span>}
            {contact.location && <span>• {contact.location}</span>}
          </div>
          <div className="text-xs font-sans mt-0.5 space-x-2 text-slate-700">
            {contact.linkedin && <span>{contact.linkedin}</span>}
            {contact.github && <span>• {contact.github}</span>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1 font-sans">SUMMARY</h2>
            <p className="text-xs leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-2 font-sans">EXPERIENCE</h2>
            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-bold text-xs font-sans">
                    <span>{exp.position} — {exp.company}</span>
                    <span>{exp.start_date} – {exp.end_date}</span>
                  </div>
                  <ul className="list-disc list-inside text-xs space-y-0.5 pl-1">
                    {exp.bullet_points.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-2 font-sans">KEY PROJECTS</h2>
            <div className="space-y-2">
              {projects.map((proj, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold text-xs font-sans">
                    <span>{proj.name} ({proj.technologies.join(', ')})</span>
                  </div>
                  <ul className="list-disc list-inside text-xs space-y-0.5 pl-1">
                    {proj.bullet_points.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1 font-sans">TECHNICAL SKILLS</h2>
            <div className="text-xs space-y-0.5">
              {skills.map((sk, idx) => (
                <div key={idx}>
                  <strong className="font-sans">{sk.category}:</strong> {sk.skills.join(', ')}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1 font-sans">EDUCATION</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between text-xs font-sans">
                <span><strong>{edu.degree}</strong>, {edu.institution}</span>
                <span>{edu.graduation_year}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. DEFAULT MODERN / TECHNICAL TEMPLATE
  return (
    <div className="resume-container bg-white text-slate-900 p-8 max-w-2xl mx-auto font-sans text-xs leading-relaxed shadow-xs rounded-lg border border-slate-200">
      {/* Header */}
      <div className="border-b border-slate-300 pb-3 mb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{contact.name || 'YOUR NAME'}</h1>
        <div className="text-slate-600 font-mono text-[11px] mt-1 flex flex-wrap items-center gap-2">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>• {contact.phone}</span>}
          {contact.location && <span>• {contact.location}</span>}
        </div>
        <div className="text-brand-orange font-mono text-[10px] mt-0.5 flex flex-wrap gap-2">
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.github && <span>• {contact.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <h2 className="text-xs font-mono font-bold uppercase text-brand-orange border-b border-slate-200 pb-1 mb-1">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-slate-700 leading-normal">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-mono font-bold uppercase text-brand-orange border-b border-slate-200 pb-1 mb-2">
            WORK EXPERIENCE
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{exp.position} <span className="font-normal text-slate-600">@ {exp.company}</span></span>
                  <span className="font-mono text-[10px] text-slate-500">{exp.start_date} – {exp.end_date}</span>
                </div>
                <ul className="list-disc list-inside text-slate-700 space-y-1 pl-1">
                  {exp.bullet_points.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-mono font-bold uppercase text-brand-orange border-b border-slate-200 pb-1 mb-2">
            TECHNICAL PROJECTS
          </h2>
          <div className="space-y-2">
            {projects.map((proj, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{proj.name}</span>
                  <span className="font-mono text-[10px] text-slate-500">{proj.technologies.join(', ')}</span>
                </div>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5 pl-1">
                  {proj.bullet_points.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-mono font-bold uppercase text-brand-orange border-b border-slate-200 pb-1 mb-1.5">
            SKILLS & ARCHITECTURE
          </h2>
          <div className="space-y-1">
            {skills.map((sk, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="font-bold text-slate-800 shrink-0">{sk.category}:</span>
                <span className="text-slate-600 font-mono text-[11px]">{sk.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div>
          <h2 className="text-xs font-mono font-bold uppercase text-brand-orange border-b border-slate-200 pb-1 mb-1">
            EDUCATION
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between text-slate-800">
              <span><strong>{edu.degree}</strong> — {edu.institution}</span>
              <span className="font-mono text-[10px] text-slate-500">{edu.graduation_year}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
