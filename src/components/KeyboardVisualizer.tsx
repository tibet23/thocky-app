import React from 'react';
import { ANSI_65_LAYOUT, KeyDef } from '../audio/keyboardLayout';
import { SoundProfile, SwitchProfileId } from '../types';
import { SWITCH_PROFILES } from '../audio/profiles';

interface KeyboardVisualizerProps {
  activeKeys: Set<string>;
  lastPressedKey: string | null;
  currentProfileId: SwitchProfileId;
  onKeyClick: (code: string, category: KeyDef['category']) => void;
}

export const KeyboardVisualizer: React.FC<KeyboardVisualizerProps> = ({
  activeKeys,
  lastPressedKey,
  currentProfileId,
  onKeyClick,
}) => {
  const profile: SoundProfile = SWITCH_PROFILES[currentProfileId] || SWITCH_PROFILES.thocky;

  return (
    <div
      id="keyboard-visualizer-container"
      className="w-full bg-slate-900 border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl relative select-none"
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-1">
        {/* Left Side: Status & Profile Badge */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div
            className="w-2.5 h-2.5 rounded-full shadow-lg shadow-current animate-pulse shrink-0"
            style={{ backgroundColor: profile.accentColor, color: profile.accentColor }}
          />
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-300">
            Interactive Visualizer
          </span>
          <span
            className="text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border shadow-sm"
            style={{
              backgroundColor: `${profile.accentColor}15`,
              color: profile.accentColor,
              borderColor: `${profile.accentColor}40`,
            }}
          >
            {profile.name}
          </span>
        </div>

        {/* Right Side: Live DSP Driver Status */}
        <div className="flex items-center gap-3">
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-medium">Live DSP Driver</span>
          </div>
        </div>
      </div>

      {/* Keyboard Case & Plate */}
      <div
        className="w-full bg-slate-950/90 border-2 rounded-2xl p-2.5 sm:p-4 shadow-inner transition-colors duration-300 overflow-x-auto"
        style={{ borderColor: `${profile.accentColor}40` }}
      >
        <div className="flex flex-col gap-1.5 min-w-[660px]">
          {ANSI_65_LAYOUT.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex gap-1.5 w-full">
              {row.map((keyDef) => {
                const isActive = activeKeys.has(keyDef.code) || lastPressedKey === keyDef.code;
                const isSpacebar = keyDef.code === 'Space';

                return (
                  <button
                    key={keyDef.code}
                    id={`key-${keyDef.code}`}
                    type="button"
                    style={{
                      flexGrow: keyDef.width,
                      flexBasis: `${keyDef.width * 38}px`,
                      minWidth: `${keyDef.width * 34}px`,
                      height: '44px',
                      backgroundColor: isActive ? profile.accentColor : undefined,
                      color: isActive ? '#0f172a' : undefined,
                      boxShadow: isActive
                        ? `0 0 20px ${profile.keycapTheme.glow}, inset 0 2px 4px rgba(0,0,0,0.4)`
                        : undefined,
                    }}
                    onClick={() => onKeyClick(keyDef.code, keyDef.category)}
                    className={`relative rounded-xl flex flex-col items-center justify-center transition-all duration-75 text-center font-mono cursor-pointer border ${
                      isActive
                        ? 'translate-y-1 shadow-none border-transparent text-slate-950 font-black'
                        : 'shadow-[0_3px_0_0_rgba(0,0,0,0.6)] hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.8)] text-slate-300 bg-slate-800/90 border-white/10 hover:bg-slate-750'
                    } ${isSpacebar ? 'text-xs tracking-wider' : ''}`}
                    aria-label={`Key ${keyDef.label}`}
                  >
                    {/* Keycap Sublabel if available */}
                    {keyDef.subLabel && (
                      <span
                        className={`text-[9px] leading-none absolute top-1 right-1.5 opacity-60 font-mono ${
                          isActive ? 'text-slate-950 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {keyDef.subLabel}
                      </span>
                    )}

                    {/* Main Keycap Legend */}
                    <span
                      className={`font-bold tracking-tight ${
                        keyDef.width > 1.25 ? 'text-[10px]' : 'text-xs'
                      }`}
                    >
                      {keyDef.label}
                    </span>

                    {/* Active Keycap Ripple Indicator */}
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-xl animate-ping opacity-30 pointer-events-none"
                        style={{ backgroundColor: profile.accentColor }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Under-case Acoustic Sub-Footer */}
      <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="text-slate-300 font-semibold">Zero Latency DSP Driver</span>
          <span>•</span>
          <span>65% ANSI Mechanical Layout</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-indigo-400 font-medium">Click any key or type on your physical keyboard</span>
        </div>
      </div>
    </div>
  );
};
