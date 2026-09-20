import React from 'react';
import { User, GraduationCap, Briefcase, Award, Check } from 'lucide-react';
import { UserProfile } from '../../types/resume';

interface UserProfileManagerProps {
  profile: UserProfile;
  setProfile: (prof: UserProfile) => void;
}

export const UserProfileManager: React.FC<UserProfileManagerProps> = ({
  profile,
  setProfile
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
            MASTER CAREER DOSSIER
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            User Profile & Student vs Professional Mode
          </h1>
        </div>

        {/* Student / Professional Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setProfile({ ...profile, is_student: false })}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              !profile.is_student ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Experienced Professional
          </button>
          <button
            onClick={() => setProfile({ ...profile, is_student: true })}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              profile.is_student ? 'bg-white text-brand-orange shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> Student / Graduate Mode
          </button>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-brand-orange" /> Personal & Contact Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.contact.name}
              onChange={(e) => setProfile({ ...profile, contact: { ...profile.contact, name: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={profile.contact.email}
              onChange={(e) => setProfile({ ...profile, contact: { ...profile.contact, email: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phone</label>
            <input
              type="text"
              value={profile.contact.phone}
              onChange={(e) => setProfile({ ...profile, contact: { ...profile.contact, phone: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Location</label>
            <input
              type="text"
              value={profile.contact.location}
              onChange={(e) => setProfile({ ...profile, contact: { ...profile.contact, location: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">LinkedIn URL</label>
            <input
              type="text"
              value={profile.contact.linkedin}
              onChange={(e) => setProfile({ ...profile, contact: { ...profile.contact, linkedin: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">GitHub URL</label>
            <input
              type="text"
              value={profile.contact.github}
              onChange={(e) => setProfile({ ...profile, contact: { ...profile.contact, github: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
        </div>
      </div>

      {/* Career Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-brand-orange" /> Career & Experience Level
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Current Position</label>
            <input
              type="text"
              value={profile.current_position}
              onChange={(e) => setProfile({ ...profile, current_position: e.target.value })}
              placeholder="e.g. Student / Software Engineer"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Position</label>
            <input
              type="text"
              value={profile.target_position}
              onChange={(e) => setProfile({ ...profile, target_position: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Years of Experience</label>
            <input
              type="number"
              value={profile.years_of_experience}
              onChange={(e) => setProfile({ ...profile, years_of_experience: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
