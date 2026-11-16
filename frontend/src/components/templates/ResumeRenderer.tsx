import React from 'react';
import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from 'lucide-react';

interface ResumeRendererProps {
  resume: ResumeData;
  templateId?: string; // override if supplied
  scale?: number;
  className?: string;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({
  resume,
  templateId,
  scale = 1,
  className = ""
}) => {
  const activeTemplate = templateId || resume.template_id || "modern";
  const { personal, summary, education, experience, projects, skills, certifications, achievements, publications, leadership, sections_order } = resume;

  // Determine order of sections
  const order = sections_order && sections_order.length > 0 ? sections_order : [
    "summary", "experience", "projects", "skills", "education", "certifications", "achievements", "publications", "leadership"
  ];

  // Helper renderers for sections
  const renderSummary = (accentClass: string, headingStyle: string) => {
    if (!summary) return null;
    return (
      <section className="mb-4">
        <h2 className={headingStyle}>PROFESSIONAL SUMMARY</h2>
        <p className="text-[12.5px] leading-relaxed text-slate-700 font-normal mt-1">{summary}</p>
      </section>
    );
  };

  const renderEducation = (accentClass: string, headingStyle: string) => {
    if (!education || education.length === 0) return null;
    return (
      <section className="mb-4">
        <h2 className={headingStyle}>EDUCATION</h2>
        <div className="space-y-2 mt-1.5">
          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="text-xs">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-[13px]">{edu.degree}</span>
                <span className="text-slate-500 font-medium text-[11.5px]">{edu.graduation_year}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700 text-[12px] font-medium">
                <span>{edu.institution} {edu.location ? `— ${edu.location}` : ''}</span>
                {edu.gpa && <span className="text-slate-600 font-semibold text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">GPA: {edu.gpa}</span>}
              </div>
              {edu.coursework && edu.coursework.length > 0 && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  <span className="font-medium text-slate-700">Coursework:</span> {edu.coursework.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderExperience = (accentClass: string, headingStyle: string) => {
    if (!experience || experience.length === 0) return null;
    return (
      <section className="mb-4">
        <h2 className={headingStyle}>WORK EXPERIENCE</h2>
        <div className="space-y-3 mt-1.5">
          {experience.map((exp, idx) => (
            <div key={exp.id || idx}>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-[13px]">{exp.position}</span>
                <span className="text-slate-500 font-medium text-[11.5px]">
                  {exp.start_date} – {exp.end_date || (exp.is_current ? 'Present' : '')}
                </span>
              </div>
              <div className="flex justify-between items-baseline text-slate-700 text-[12px] font-semibold mb-1">
                <span>{exp.company}</span>
                {exp.location && <span className="text-slate-400 font-normal text-[11px]">{exp.location}</span>}
              </div>
              <ul className="list-disc list-outside ml-4 space-y-1 text-[12px] text-slate-700 leading-normal">
                {exp.bullet_points.map((b, bIdx) => (
                  <li key={bIdx} className="pl-0.5">{b}</li>
                ))}
              </ul>
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1 text-[10.5px] text-slate-500">
                  <span className="font-semibold text-slate-700">Tech:</span>
                  {exp.technologies.map((t, tIdx) => (
                    <span key={tIdx} className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderProjects = (accentClass: string, headingStyle: string) => {
    if (!projects || projects.length === 0) return null;
    return (
      <section className="mb-4">
        <h2 className={headingStyle}>PROJECTS</h2>
        <div className="space-y-3 mt-1.5">
          {projects.map((proj, idx) => (
            <div key={proj.id || idx}>
              <div className="flex justify-between items-baseline">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-[13px]">{proj.name}</span>
                  {proj.link && (
                    <a
                      href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-0.5 text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Link</span>
                    </a>
                  )}
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <span className="text-[11px] font-mono text-slate-500 font-medium">
                    {proj.technologies.slice(0, 4).join(' • ')}
                  </span>
                )}
              </div>
              {proj.description && (
                <p className="text-[12px] text-slate-600 italic my-0.5">{proj.description}</p>
              )}
              {proj.bullet_points && proj.bullet_points.length > 0 && (
                <ul className="list-disc list-outside ml-4 space-y-1 text-[12px] text-slate-700 leading-normal">
                  {proj.bullet_points.map((b, bIdx) => (
                    <li key={bIdx} className="pl-0.5">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSkills = (accentClass: string, headingStyle: string) => {
    const hasAny = skills && (
      skills.languages.length > 0 ||
      skills.frameworks.length > 0 ||
      skills.tools.length > 0 ||
      skills.databases.length > 0 ||
      skills.other.length > 0
    );
    if (!hasAny) return null;

    const categories = [
      { label: 'Languages', items: skills.languages },
      { label: 'Frameworks & Libraries', items: skills.frameworks },
      { label: 'Developer Tools & Cloud', items: skills.tools },
      { label: 'Databases & Storage', items: skills.databases },
      { label: 'Architectural Concepts', items: skills.other },
    ].filter(c => c.items && c.items.length > 0);

    return (
      <section className="mb-4">
        <h2 className={headingStyle}>TECHNICAL SKILLS</h2>
        <div className="space-y-1 mt-1 text-[12px]">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-wrap items-baseline gap-1">
              <span className="font-bold text-slate-800 text-[12px] min-w-[130px]">{cat.label}:</span>
              <span className="text-slate-700">{cat.items.join(', ')}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertifications = (accentClass: string, headingStyle: string) => {
    if (!certifications || certifications.length === 0) return null;
    return (
      <section className="mb-3">
        <h2 className={headingStyle}>CERTIFICATIONS</h2>
        <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-[12px] text-slate-700">
          {certifications.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </section>
    );
  };

  const renderAchievements = (accentClass: string, headingStyle: string) => {
    if (!achievements || achievements.length === 0) return null;
    return (
      <section className="mb-3">
        <h2 className={headingStyle}>HONORS & ACHIEVEMENTS</h2>
        <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-[12px] text-slate-700">
          {achievements.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </section>
    );
  };

  const renderPublications = (accentClass: string, headingStyle: string) => {
    if (!publications || publications.length === 0) return null;
    return (
      <section className="mb-3">
        <h2 className={headingStyle}>PUBLICATIONS & RESEARCH</h2>
        <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-[12px] text-slate-700">
          {publications.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </section>
    );
  };

  const renderLeadership = (accentClass: string, headingStyle: string) => {
    if (!leadership || leadership.length === 0) return null;
    return (
      <section className="mb-3">
        <h2 className={headingStyle}>LEADERSHIP & INITIATIVES</h2>
        <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-[12px] text-slate-700">
          {leadership.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </section>
    );
  };

  const sectionMap: Record<string, () => React.ReactNode> = {
    summary: () => renderSummary(getAccentColor(activeTemplate), getHeadingStyle(activeTemplate)),
    education: () => renderEducation(getAccentColor(activeTemplate), getHeadingStyle(activeTemplate)),
    experience: () => renderExperience(getAccentColor(activeTemplate), getHeadingStyle(activeTemplate)),
    projects: () => renderProjects(getAccentColor(activeTemplate), getHeadingStyle(activeTemplate)),
    skills: () => renderSkills(getAccentColor(activeTemplate), getHeadingStyle(activeTemplate)),
    certifications: () => renderCertifications(getAccentColor(activeTemplate), getHeadingStyle(activeTemplate)),
    achievements: () => renderAchievements(getAccentColor(activeTemplate), getHeadingStyle(activeTemplate)),
    publications: () => renderPublications(getAccentColor(activeTemplate), getHeadingStyle(activeTemplate)),
    leadership: () => renderLeadership(getAccentColor(activeTemplate), getHeadingStyle(activeTemplate)),
  };

  function getAccentColor(t: string) {
    switch (t) {
      case 'modern': return 'text-indigo-600 border-indigo-600';
      case 'technical': return 'text-emerald-700 border-emerald-600';
      case 'academic': return 'text-sky-800 border-sky-800';
      case 'management': return 'text-amber-800 border-amber-800';
      case 'student': return 'text-blue-700 border-blue-600';
      default: return 'text-slate-900 border-slate-900'; // ats_classic
    }
  }

  function getHeadingStyle(t: string) {
    switch (t) {
      case 'ats_classic':
        return 'font-serif font-bold text-xs tracking-wider text-black border-b border-black pb-0.5 uppercase';
      case 'modern':
        return 'font-sans font-extrabold text-[12px] tracking-wide text-slate-900 border-b-2 border-indigo-500 pb-0.5 uppercase';
      case 'technical':
        return 'font-mono font-bold text-[11.5px] tracking-wider text-emerald-800 border-b border-emerald-300 pb-0.5 uppercase flex items-center gap-1.5';
      case 'academic':
        return 'font-serif font-bold text-xs tracking-widest text-slate-900 border-b border-slate-300 pb-0.5 uppercase';
      case 'management':
        return 'font-sans font-extrabold text-[12px] tracking-wide text-slate-900 border-b-2 border-amber-600 pb-0.5 uppercase';
      case 'student':
        return 'font-sans font-bold text-[12px] tracking-wider text-blue-900 border-b-2 border-blue-500 pb-0.5 uppercase';
      default:
        return 'font-sans font-bold text-xs tracking-wide text-slate-900 border-b border-slate-300 pb-0.5 uppercase';
    }
  }

  // Contact info bar
  const renderContactBar = () => {
    return (
      <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 mt-1.5">
        {personal.email && (
          <span className="flex items-center gap-1">
            <Mail className="w-3 h-3 text-slate-400" />
            <a href={`mailto:${personal.email}`} className="hover:text-slate-900">{personal.email}</a>
          </span>
        )}
        {personal.phone && (
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{personal.phone}</span>
          </span>
        )}
        {personal.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{personal.location}</span>
          </span>
        )}
        {personal.linkedin && (
          <span className="flex items-center gap-1">
            <Linkedin className="w-3 h-3 text-slate-400" />
            <a href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} target="_blank" rel="noreferrer" className="hover:text-slate-900">
              {personal.linkedin.replace(/^https?:\/\//, '')}
            </a>
          </span>
        )}
        {personal.github && (
          <span className="flex items-center gap-1">
            <Github className="w-3 h-3 text-slate-400" />
            <a href={personal.github.startsWith('http') ? personal.github : `https://${personal.github}`} target="_blank" rel="noreferrer" className="hover:text-slate-900">
              {personal.github.replace(/^https?:\/\//, '')}
            </a>
          </span>
        )}
        {personal.portfolio && (
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-slate-400" />
            <a href={personal.portfolio.startsWith('http') ? personal.portfolio : `https://${personal.portfolio}`} target="_blank" rel="noreferrer" className="hover:text-slate-900">
              {personal.portfolio.replace(/^https?:\/\//, '')}
            </a>
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      id="printable-resume"
      className={`bg-white text-slate-900 shadow-xl rounded-sm p-8 sm:p-10 transition-all select-text print:shadow-none print:p-0 print:m-0 print:w-full min-h-[1050px] w-full max-w-[850px] mx-auto ${className}`}
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
        fontFamily: activeTemplate === 'ats_classic' ? 'Georgia, serif' : 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      {/* Header */}
      <header className="text-center pb-3 mb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {personal.name || 'Candidate Name'}
        </h1>
        {personal.title && (
          <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5 tracking-wide uppercase">
            {personal.title}
          </p>
        )}
        {renderContactBar()}
      </header>

      {/* Sections dynamically rendered in order */}
      <main>
        {order.map((sectionKey) => (
          <React.Fragment key={sectionKey}>
            {sectionMap[sectionKey] ? sectionMap[sectionKey]() : null}
          </React.Fragment>
        ))}
      </main>
    </div>
  );
};
