import React, { useEffect, useRef } from 'react';
import {
  Activity,
  Zap,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { KeyTriggerEvent, OverlaySettings, SwitchProfileId } from '../types';
import { SWITCH_PROFILES } from '../audio/profiles';
import { soundEngine } from '../audio/soundEngine';

interface KeystrokeOverlayProps {
  recentTriggers: KeyTriggerEvent[];
  currentProfileId: SwitchProfileId;
  wpm: number;
  streak: number;
  settings: OverlaySettings;
  onChangeSettings: (settings: OverlaySettings) => void;
  onOpenPiP?: () => void;
}

export const KeystrokeOverlay: React.FC<KeystrokeOverlayProps> = ({
  recentTriggers,
  currentProfileId,
  wpm,
  streak,
  settings,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const profile = SWITCH_PROFILES[currentProfileId] || SWITCH_PROFILES.thocky;

  // Real-time 60fps audio waveform oscilloscope renderer
  useEffect(() => {
    if (!settings.showOscilloscope || !settings.enabled) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = soundEngine.getAnalyser();
    const bufferLength = analyser ? analyser.frequencyBinCount : 256;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (analyser) {
        analyser.getByteTimeDomainData(dataArray);
      } else {
        dataArray.fill(128);
      }

      // Draw Waveform Line
      ctx.lineWidth = 2;
      ctx.strokeStyle = profile.accentColor;
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Subtle glow effect
      ctx.shadowBlur = 8;
      ctx.shadowColor = profile.accentColor;
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [settings.showOscilloscope, settings.enabled, profile.accentColor]);

  if (!settings.enabled) return null;

  return (
    <div
      id="keystroke-overlay-hud"
      className="w-full sticky bottom-0 z-30 transition-all duration-200"
      style={{ opacity: settings.opacity }}
    >
      <div
        className="bg-slate-900/95 border border-white/10 border-b-0 backdrop-blur-md shadow-2xl rounded-t-3xl p-4 text-white"
        style={{
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.7), 0 -4px 24px -4px ${profile.keycapTheme.glow}`,
        }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap max-w-7xl mx-auto px-2">
          {/* Section 1: Active Key Ribbon with Vibrant Palette Chips */}
          {settings.showActiveKey && (
            <div className="flex items-center gap-3 min-w-[200px]">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono font-bold">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">REAL-TIME MONITOR:</span>
              </div>
              
              <div className="flex items-center gap-1.5 overflow-hidden h-9 bg-black/40 px-2.5 py-1 rounded-xl border border-white/5">
                {recentTriggers.length === 0 ? (
                  <span className="text-xs text-slate-500 font-mono italic px-2">
                    Press any key to test acoustics...
                  </span>
                ) : (
                  recentTriggers.slice(-6).map((trigger, idx, arr) => {
                    const isLatest = idx === arr.length - 1;
                    return (
                      <span
                        key={trigger.id}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          isLatest
                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-white/20 scale-105'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                        style={{
                          backgroundColor: isLatest ? profile.accentColor : `${profile.accentColor}25`,
                          color: isLatest ? '#0f172a' : profile.accentColor,
                          borderColor: `${profile.accentColor}40`,
                        }}
                      >
                        {trigger.key}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Section 2: Real-time Audio Oscilloscope Waveform */}
          {settings.showOscilloscope && (
            <div className="hidden md:flex items-center gap-2.5 bg-slate-950/80 px-3.5 py-1.5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono font-bold">
                <Volume2 className="w-3.5 h-3.5" style={{ color: profile.accentColor }} />
                <span>OSCILLOSCOPE</span>
              </div>
              <canvas
                ref={canvasRef}
                width={120}
                height={28}
                className="w-[120px] h-[28px] rounded-lg bg-black/50"
              />
            </div>
          )}

          {/* Section 3: WPM & Streak HUD */}
          {settings.showWpm && (
            <div className="flex items-center gap-3 bg-slate-950/80 px-3.5 py-1.5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs text-slate-400 font-medium">WPM:</span>
                <span className="text-xs font-mono font-black text-yellow-400">{wpm}</span>
              </div>

              <div className="h-3.5 w-px bg-slate-800" />

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium">Streak:</span>
                <span className="text-xs font-mono font-black text-emerald-400">{streak}</span>
              </div>
            </div>
          )}

          {/* Section 4: Sound Profile Badge */}
          {settings.showSoundProfile && (
            <div className="flex items-center gap-2.5">
              <div
                className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full border ${profile.badgeBg}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{profile.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
