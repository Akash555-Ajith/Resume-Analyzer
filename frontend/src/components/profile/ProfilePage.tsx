import React, { useState, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { api } from '../../services/api';
import { ResumeData } from '../../types/resume';
import { User, Save, CheckCircle2, Briefcase, GraduationCap, Code2, Sparkles, ArrowRight } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentResume, setCurrentResume, setActivePage } = useResume();
  const [profile, setProfile] = useState<ResumeData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    api.getProfile().then(data => setProfile(data)).catch(() => {
      if (currentResume) setProfile(currentResume);
    });
  }, [currentResume]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    try {
      const saved = await api.saveProfile(profile);
      setProfile(saved);
      setMsg("Master profile successfully updated!");
      setTimeout(() => setMsg(null), 3000);
    } catch {
      setMsg("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeedResume = () => {
    if (!profile) return;
    const newResume: ResumeData = {
      ...profile,
      id: `resume-${Date.now().toString(36)}`,
      title: `${profile.personal.title || 'Master'} Resume (Copy)`
    };
    setCurrentResume(newResume);
    api.saveResume(newResume);
    setActivePage('editor');
  };

  if (!profile) return <div className="p-8 text-center text-slate-500">Loading master profile...</div>;

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8 font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <User className="w-7 h-7 text-blue-600" />
            <span>Master Career Profile</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your single source of truth. Seed new resumes, keep skills updated, and generate role-specific versions.
          </p>
        </div>

        <button
          onClick={handleSeedResume}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs hover:bg-slate-800 transition-all"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Generate Resume from Profile</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* Personal Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Personal & Contact Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={profile.personal.name}
                onChange={(e) => setProfile({ ...profile, personal: { ...profile.personal, name: e.target.value } })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Professional Title</label>
              <input
                type="text"
                value={profile.personal.title}
                onChange={(e) => setProfile({ ...profile, personal: { ...profile.personal, title: e.target.value } })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Email</label>
              <input
                type="email"
                value={profile.personal.email}
                onChange={(e) => setProfile({ ...profile, personal: { ...profile.personal, email: e.target.value } })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Phone</label>
              <input
                type="text"
                value={profile.personal.phone}
                onChange={(e) => setProfile({ ...profile, personal: { ...profile.personal, phone: e.target.value } })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Location</label>
              <input
                type="text"
                value={profile.personal.location}
                onChange={(e) => setProfile({ ...profile, personal: { ...profile.personal, location: e.target.value } })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">GitHub</label>
              <input
                type="text"
                value={profile.personal.github}
                onChange={(e) => setProfile({ ...profile, personal: { ...profile.personal, github: e.target.value } })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-2">
          <h3 className="font-bold text-sm text-slate-900">Master Summary</h3>
          <textarea
            rows={3}
            value={profile.summary}
            onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800"
          />
        </div>

        {/* Technical Skills */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Technical Skills Inventory</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Programming Languages</label>
              <input
                type="text"
                value={profile.skills.languages.join(', ')}
                onChange={(e) => setProfile({
                  ...profile,
                  skills: { ...profile.skills, languages: e.target.value.split(',').map(s => s.trim()) }
                })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Frameworks</label>
              <input
                type="text"
                value={profile.skills.frameworks.join(', ')}
                onChange={(e) => setProfile({
                  ...profile,
                  skills: { ...profile.skills, frameworks: e.target.value.split(',').map(s => s.trim()) }
                })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Tools & Platforms</label>
              <input
                type="text"
                value={profile.skills.tools.join(', ')}
                onChange={(e) => setProfile({
                  ...profile,
                  skills: { ...profile.skills, tools: e.target.value.split(',').map(s => s.trim()) }
                })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Master Profile</span>
          </button>
        </div>

      </form>

    </div>
  );
};
