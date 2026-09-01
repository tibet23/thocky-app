import React from 'react';
import {
  Volume2,
  VolumeX,
  Sliders,
  Music,
  Activity,
  Sparkles,
  Layers,
  RotateCcw,
  Headphones,
  Lock,
} from 'lucide-react';
import { AudioSettings } from '../types';

interface AudioControlsProps {
  settings: AudioSettings;
  onChangeSettings: (newSettings: AudioSettings) => void;
  onResetDefaults: () => void;
  isTrialExpired?: boolean;
  onOpenTrialModal?: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  settings,
  onChangeSettings,
  onResetDefaults,
  isTrialExpired = false,
  onOpenTrialModal,
}) => {
  const updateSetting = <K extends keyof AudioSettings>(key: K, value: AudioSettings[K]) => {
    if (isTrialExpired) {
      onOpenTrialModal?.();
      return;
    }
    onChangeSettings({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div id="audio-controls-panel" className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-7 backdrop-blur-md shadow-2xl space-y-6 relative overflow-hidden">
      {isTrialExpired && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-400 shrink-0" />
            <span><strong>Acoustic DSP Tuning Locked:</strong> Evaluation period expired. Fine-tuning parameters are in read-only mode.</span>
          </div>
          <button
            type="button"
            onClick={onOpenTrialModal}
            className="px-3 py-1 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-lg transition-all shrink-0 cursor-pointer shadow-sm"
          >
            Unlock Pro
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Acoustic Tuning</h3>
            <p className="text-base font-bold text-white tracking-tight">Fine-Tune Volume, Pitch, and Soundstage</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            id="mute-toggle-btn"
            disabled={isTrialExpired}
            onClick={() => updateSetting('isMuted', !settings.isMuted)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm active:scale-95 ${
              isTrialExpired
                ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-60'
                : settings.isMuted
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
            aria-pressed={settings.isMuted}
            aria-label={settings.isMuted ? 'Unmute keyboard audio' : 'Mute keyboard audio'}
          >
            {settings.isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span className="uppercase tracking-wider">{settings.isMuted ? 'Muted' : 'Live Engine'}</span>
          </button>

          <button
            type="button"
            id="reset-audio-btn"
            disabled={isTrialExpired}
            onClick={isTrialExpired ? onOpenTrialModal : onResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-white/10 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Reset audio settings to defaults"
            aria-label="Reset audio parameters to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${isTrialExpired ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* 1. Master Volume */}
        <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              Volume
            </span>
            <span className="font-mono text-indigo-400 font-black text-sm">
              {Math.round(settings.masterVolume * 100)}%
            </span>
          </div>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1.5"
            step="0.05"
            disabled={isTrialExpired}
            value={settings.masterVolume}
            onChange={(e) => updateSetting('masterVolume', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
            aria-label="Master volume slider"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono font-medium">
            <span>0%</span>
            <span>100%</span>
            <span>150%</span>
          </div>
        </div>

        {/* 2. Pitch Multiplier */}
        <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-cyan-400" />
              Pitch Tuning
            </span>
            <span className="font-mono text-cyan-400 font-black text-sm">
              {settings.pitchMultiplier.toFixed(2)}x
            </span>
          </div>
          <input
            id="pitch-slider"
            type="range"
            min="0.5"
            max="1.7"
            step="0.02"
            disabled={isTrialExpired}
            value={settings.pitchMultiplier}
            onChange={(e) => updateSetting('pitchMultiplier', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-400"
            aria-label="Pitch tuning slider"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono font-medium">
            <span>Low (0.5x)</span>
            <span onClick={() => updateSetting('pitchMultiplier', 1.0)} className="cursor-pointer text-cyan-400 hover:underline">1.0x (Std)</span>
            <span>High (1.7x)</span>
          </div>
        </div>

        {/* 3. Lube & Foam Level */}
        <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Lube & Damping
            </span>
            <span className="font-mono text-pink-400 font-black text-sm">
              {Math.round(settings.lubeModifier * 100)}%
            </span>
          </div>
          <input
            id="lube-slider"
            type="range"
            min="0"
            max="1.0"
            step="0.05"
            disabled={isTrialExpired}
            value={settings.lubeModifier}
            onChange={(e) => updateSetting('lubeModifier', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-pink-400"
            aria-label="Lube and damping level slider"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono font-medium">
            <span>Crisp Dry</span>
            <span>Balanced</span>
            <span>Ultra Buttery</span>
          </div>
        </div>

        {/* 4. Spacebar Thock Boost */}
        <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-yellow-400" />
              Spacebar Thock
            </span>
            <span className="font-mono text-yellow-400 font-black text-sm">
              +{Math.round((settings.spacebarBoost - 1.0) * 100)}%
            </span>
          </div>
          <input
            id="spacebar-boost-slider"
            type="range"
            min="1.0"
            max="2.0"
            step="0.05"
            disabled={isTrialExpired}
            value={settings.spacebarBoost}
            onChange={(e) => updateSetting('spacebarBoost', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-yellow-400"
            aria-label="Spacebar thock resonance boost slider"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono font-medium">
            <span>Flat</span>
            <span>Standard</span>
            <span>Sub-Bass Thud</span>
          </div>
        </div>
      </div>

      {/* Toggles Row */}
      <div className={`pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 ${isTrialExpired ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Toggle 1: Organic Micro-Pitch Jitter */}
        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-white/15 cursor-pointer transition-colors">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-xs font-bold text-slate-200">Acoustic Micro-Jitter</div>
              <div className="text-[10px] text-slate-400 font-medium">Organic typing variance</div>
            </div>
          </div>
          <input
            type="checkbox"
            disabled={isTrialExpired}
            checked={settings.pitchJitterEnabled}
            onChange={(e) => updateSetting('pitchJitterEnabled', e.target.checked)}
            className="w-4 h-4 rounded bg-slate-800 border-white/10 text-emerald-500 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
          />
        </label>

        {/* Toggle 2: Stereo Pan */}
        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-white/15 cursor-pointer transition-colors">
          <div className="flex items-center gap-2.5">
            <Headphones className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-xs font-bold text-slate-200">Stereo Spatial Pan</div>
              <div className="text-[10px] text-slate-400 font-medium">Position audio in headphones</div>
            </div>
          </div>
          <input
            type="checkbox"
            disabled={isTrialExpired}
            checked={settings.stereoPanEnabled}
            onChange={(e) => updateSetting('stereoPanEnabled', e.target.checked)}
            className="w-4 h-4 rounded bg-slate-800 border-white/10 text-cyan-500 focus:ring-cyan-500 accent-cyan-500 cursor-pointer"
          />
        </label>

        {/* Toggle 3: Key Release Sound (Top-Out Clack) */}
        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-white/15 cursor-pointer transition-colors">
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-4 h-4 text-yellow-400" />
            <div>
              <div className="text-xs font-bold text-slate-200">Key Release Clack</div>
              <div className="text-[10px] text-slate-400 font-medium">Top-out return snap on keyup</div>
            </div>
          </div>
          <input
            type="checkbox"
            disabled={isTrialExpired}
            checked={settings.releaseSoundEnabled}
            onChange={(e) => updateSetting('releaseSoundEnabled', e.target.checked)}
            className="w-4 h-4 rounded bg-slate-800 border-white/10 text-yellow-500 focus:ring-yellow-500 accent-yellow-500 cursor-pointer"
          />
        </label>

        {/* Toggle 4: Desk Room Reverb */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-xs font-bold text-slate-200">Desk Mat Reverb</div>
              <div className="text-[10px] text-slate-400 font-medium">{Math.round(settings.reverbAmount * 100)}% room acoustic tail</div>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            disabled={isTrialExpired}
            value={settings.reverbAmount}
            onChange={(e) => updateSetting('reverbAmount', parseFloat(e.target.value))}
            className="w-20 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
            aria-label="Desk room reverb level"
          />
        </div>
      </div>
    </div>
  );
};

