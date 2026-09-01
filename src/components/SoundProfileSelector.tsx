import React from 'react';
import { Volume2, Sparkles, Check, Lock, ShieldAlert } from 'lucide-react';
import { SwitchProfileId } from '../types';
import { SWITCH_PROFILES } from '../audio/profiles';

interface SoundProfileSelectorProps {
  currentProfileId: SwitchProfileId;
  onSelectProfile: (id: SwitchProfileId) => void;
  onTestSound: (id: SwitchProfileId) => void;
  isTrialExpired?: boolean;
  onOpenTrialModal?: () => void;
}

export const SoundProfileSelector: React.FC<SoundProfileSelectorProps> = ({
  currentProfileId,
  onSelectProfile,
  onTestSound,
  isTrialExpired = false,
  onOpenTrialModal,
}) => {
  const profileList = Object.values(SWITCH_PROFILES);

  return (
    <div id="sound-profile-selector" className="w-full space-y-4 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Sound Profile Library
          </h2>
          <p className="text-sm font-semibold text-slate-200 mt-0.5">
            6 iconic mechanical & acoustic profiles synthesized with zero-latency Web Audio DSP
          </p>
        </div>

        {isTrialExpired && (
          <button
            type="button"
            onClick={onOpenTrialModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold hover:bg-rose-500/30 transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Profile Switching Locked</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
        {profileList.map((profile) => {
          const isActive = currentProfileId === profile.id;
          const isLocked = isTrialExpired && !isActive;

          return (
            <div
              key={profile.id}
              id={`switch-card-${profile.id}`}
              onClick={() => {
                if (isTrialExpired) {
                  onOpenTrialModal?.();
                } else {
                  onSelectProfile(profile.id);
                }
              }}
              className={`p-1 rounded-3xl group cursor-pointer transition-all duration-300 relative ${
                isActive
                  ? `bg-gradient-to-br ${profile.gradientBorder} ring-4 ring-white/20 shadow-2xl shadow-black/60 scale-[1.02]`
                  : isLocked
                  ? 'bg-slate-900/20 border-2 border-slate-800 opacity-60 hover:opacity-80'
                  : 'bg-slate-900/40 border-2 border-dashed border-white/10 hover:border-white/30 hover:scale-[1.01]'
              }`}
              role="radio"
              aria-checked={isActive}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (isTrialExpired) {
                    onOpenTrialModal?.();
                  } else {
                    onSelectProfile(profile.id);
                  }
                }
              }}
            >
              <div className="bg-slate-900 w-full h-full rounded-[20px] p-5 flex flex-col justify-between border border-white/5 transition-colors">
                {/* Top Row: Ghost Numeral + Active Status Badge */}
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className="font-black text-3xl font-mono tracking-tight select-none opacity-25"
                      style={{ color: profile.accentColor }}
                    >
                      {profile.ghostNumber}
                    </span>

                    {isActive ? (
                      <div
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1"
                        style={{ backgroundColor: profile.accentColor, color: '#0f172a' }}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                        Active
                      </div>
                    ) : isLocked ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        Locked
                      </span>
                    ) : (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${profile.badgeBg}`}>
                        {profile.categoryName}
                      </span>
                    )}
                  </div>

                  {/* Profile Title */}
                  <h3 className="text-lg font-black tracking-tight text-white mb-1 flex items-center gap-1.5">
                    {profile.name}
                    {isLocked && <Lock className="w-3.5 h-3.5 text-slate-500" />}
                  </h3>

                  {/* Acoustic Tagline */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {profile.tagline}
                  </p>
                </div>

                {/* Card Bottom: Specs & Audition Button */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 font-mono font-medium">
                    <span>{profile.basePitch}Hz</span> • <span>{profile.damping > 0.5 ? 'Damped' : 'Crisp'}</span>
                  </div>

                  <button
                    type="button"
                    id={`preview-btn-${profile.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isTrialExpired) {
                        onOpenTrialModal?.();
                      } else {
                        onTestSound(profile.id);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all border border-white/10 active:scale-95 shadow-sm font-semibold"
                    title="Audition switch sound"
                    aria-label={`Audition ${profile.name} sound`}
                  >
                    {isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" style={{ color: profile.accentColor }} />
                    )}
                    <span>{isLocked ? 'Unlock' : 'Test'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

