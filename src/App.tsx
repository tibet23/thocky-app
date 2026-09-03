import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Keyboard,
  Laptop,
  Clock,
  Lock,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Unlock,
  Users,
  UserCheck,
} from 'lucide-react';
import {
  AudioSettings,
  KeyCategory,
  KeyTriggerEvent,
  OverlaySettings,
  SwitchProfileId,
} from './types';
import {
  DEFAULT_AUDIO_SETTINGS,
  DEFAULT_OVERLAY_SETTINGS,
  SWITCH_PROFILES,
} from './audio/profiles';
import { getKeyCategory, getKeyDisplayName } from './audio/keyboardLayout';
import { soundEngine } from './audio/soundEngine';
import { getTrialState, TrialState } from './utils/trialManager';
import {
  getActiveUser,
  hasCompletedOnboarding,
  setOnboardingCompleted,
  updateUserStats,
  RegisteredUser,
} from './utils/authManager';
import { initDesktopGlobalHooks, detectDesktopRuntime } from './desktop/desktopBridge';
import { SoundProfileSelector } from './components/SoundProfileSelector';
import { KeyboardVisualizer } from './components/KeyboardVisualizer';
import { AudioControls } from './components/AudioControls';
import { KeystrokeOverlay } from './components/KeystrokeOverlay';
import { TypingSandbox } from './components/TypingSandbox';
import { WindowsDownloadModal } from './components/WindowsDownloadModal';
import { TrialModal } from './components/TrialModal';
import { OnboardingModal } from './components/OnboardingModal';
import { UserTrackingDashboardModal } from './components/UserTrackingDashboardModal';
import { ThockyBrandIcon } from './components/ThockyBrandIcon';

// Safely access Electron's IPC module without crashing in a web browser
const ipcRenderer = (window as any).require ? (window as any).require('electron').ipcRenderer : null;

export default function App() {
  // 1-Day (24h) Local Trial State & Auth
  const [trialState, setTrialState] = useState<TrialState>(getTrialState());
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<RegisteredUser | null>(getActiveUser());
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!hasCompletedOnboarding());
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);

  // Application State
  const [currentProfileId, setCurrentProfileId] = useState<SwitchProfileId>('thocky');
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(DEFAULT_AUDIO_SETTINGS);
  const [overlaySettings, setOverlaySettings] = useState<OverlaySettings>(DEFAULT_OVERLAY_SETTINGS);

  // Keyboard & Trigger State
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);
  const [recentTriggers, setRecentTriggers] = useState<KeyTriggerEvent[]>([]);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [streak, setStreak] = useState(0);

  // Modals & PWA State
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // WPM & Streak Calculation
  const keystrokeTimestampsRef = useRef<number[]>([]);
  const streakTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Refresh trial state and user info periodically
  const refreshTrial = useCallback(() => {
    setTrialState(getTrialState());
    setActiveUser(getActiveUser());
  }, []);

  useEffect(() => {
    refreshTrial();
    const interval = setInterval(refreshTrial, 15000);
    window.addEventListener('trial_state_changed', refreshTrial);
    window.addEventListener('thocky_auth_changed', refreshTrial);
    window.addEventListener('storage', refreshTrial);

    return () => {
      clearInterval(interval);
      window.removeEventListener('trial_state_changed', refreshTrial);
      window.removeEventListener('thocky_auth_changed', refreshTrial);
      window.removeEventListener('storage', refreshTrial);
    };
  }, [refreshTrial]);

  // Audio Engine Unlock on user interaction
  const handleUserInteraction = useCallback(() => {
    soundEngine.unlockAudio();
  }, []);

  // Play Key Down Sound
  const triggerKeyAudio = useCallback(
    (code: string, category: KeyCategory, char?: string) => {
      handleUserInteraction();

      // If trial is expired, lock the core audio synthesis and open modal on request
      if (trialState.isExpired) {
        const triggerEvent: KeyTriggerEvent = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          key: getKeyDisplayName(code, char),
          code,
          category,
          timestamp: Date.now(),
          pitch: 1,
          volume: 0,
          pan: 0,
          profileId: currentProfileId,
        };
        setRecentTriggers((prev) => [...prev.slice(-9), triggerEvent]);
        setLastPressedKey(code);
        return;
      }

      const result = soundEngine.triggerKeyDown(
        code,
        currentProfileId,
        category,
        audioSettings
      );

      const triggerEvent: KeyTriggerEvent = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        key: getKeyDisplayName(code, char),
        code,
        category,
        timestamp: Date.now(),
        pitch: result.pitch,
        volume: result.volume,
        pan: result.pan,
        profileId: currentProfileId,
      };

      setRecentTriggers((prev) => [...prev.slice(-9), triggerEvent]);
      setLastPressedKey(code);
      setTotalKeystrokes((prev) => prev + 1);
      updateUserStats(1, trialState.isSubscribed);

      // Update WPM calculation (keystrokes in last 5 seconds)
      const now = Date.now();
      keystrokeTimestampsRef.current.push(now);
      keystrokeTimestampsRef.current = keystrokeTimestampsRef.current.filter(
        (t) => now - t <= 5000
      );
      const keysPerMinute = Math.round((keystrokeTimestampsRef.current.length / 5) * 60);
      const currentWpm = Math.round(keysPerMinute / 5);
      setWpm(currentWpm);

      // Streak tracker
      setStreak((prev) => prev + 1);
      if (streakTimerRef.current) clearTimeout(streakTimerRef.current);
      streakTimerRef.current = setTimeout(() => {
        setStreak(0);
      }, 3000);
    },
    [handleUserInteraction, trialState.isExpired, trialState.isSubscribed, currentProfileId, audioSettings]
  );

  // Play Key Up Sound (Top-out return clack)
  const triggerKeyUpAudio = useCallback(
    (code: string, category: KeyCategory) => {
      if (trialState.isExpired) return;
      soundEngine.triggerKeyUp(code, currentProfileId, category, audioSettings);
    },
    [currentProfileId, audioSettings, trialState.isExpired]
  );

  // Global Background Key Listener (Electron OS Hook)
  useEffect(() => {
    if (!ipcRenderer) return;

    const handleGlobalKeyDown = (_event: any, webCode: string) => {
      const category = getKeyCategory(webCode);
      setActiveKeys((prev) => new Set(prev).add(webCode));
      const char = webCode.replace(/(Key|Digit)/, '');
      triggerKeyAudio(webCode, category, char);
    };

    const handleGlobalKeyUp = (_event: any, webCode: string) => {
      const category = getKeyCategory(webCode);
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(webCode);
        return next;
      });
      triggerKeyUpAudio(webCode, category);
    };

    ipcRenderer.on('global-keydown', handleGlobalKeyDown);
    ipcRenderer.on('global-keyup', handleGlobalKeyUp);

    return () => {
      ipcRenderer.removeListener('global-keydown', handleGlobalKeyDown);
      ipcRenderer.removeListener('global-keyup', handleGlobalKeyUp);
    };
  }, [triggerKeyAudio, triggerKeyUpAudio]);

  // Initialize Desktop Global Hooks (Electron / Tauri Option B)
  useEffect(() => {
    const unsubscribe = initDesktopGlobalHooks((code, char) => {
      const category = getKeyCategory(code);
      triggerKeyAudio(code, category, char);
    });
    return () => {
      unsubscribe();
    };
  }, [triggerKeyAudio]);

  // Global Window Keydown / Keyup Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Trigger acoustic sound on key press without hijacking 1-4 or M keys
      const category = getKeyCategory(e.code);
      setActiveKeys((prev) => new Set(prev).add(e.code));
      triggerKeyAudio(e.code, category, e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const category = getKeyCategory(e.code);
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
      triggerKeyUpAudio(e.code, category);
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerKeyAudio, triggerKeyUpAudio]);

  // PWA Install Prompt Listener
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleTriggerPwaInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    } else {
      setIsDownloadModalOpen(true);
    }
  };

  // Picture-in-Picture / Floating window mode
  const handleOpenPiP = () => {
    // If Document PiP is supported in modern browsers
    if ('documentPictureInPicture' in window) {
      try {
        (window as any).documentPictureInPicture.requestWindow({
          width: 420,
          height: 180,
        }).then((pipWindow: Window) => {
          pipWindow.document.body.innerHTML = `
            <div style="background:#09090b;color:#fff;font-family:sans-serif;padding:16px;height:100vh;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;align-items:center;">
              <div style="font-weight:bold;font-size:14px;margin-bottom:8px;color:#f59e0b;">ThockyApp Live ASMR HUD</div>
              <div style="font-size:12px;color:#a1a1aa;">Active Switch: <strong>${SWITCH_PROFILES[currentProfileId].name}</strong></div>
              <div style="margin-top:12px;padding:6px 12px;background:#27272a;border-radius:8px;font-size:12px;">Audio Active in Background</div>
            </div>
          `;
        });
        return;
      } catch {
        // Fallback to popup window
      }
    }

    // Fallback: popup window
    window.open(
      window.location.href,
      'ThockyAppMiniHUD',
      'width=420,height=220,menubar=no,toolbar=no,location=no,status=no'
    );
  };

  const currentProfile = SWITCH_PROFILES[currentProfileId];

  return (
    <div
      id="thockyapp-app-root"
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative font-sans"
      onClick={handleUserInteraction}
    >
      {/* Top Navigation Bar */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5">
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 relative overflow-hidden"
              style={{
                backgroundColor: currentProfile.accentColor,
                boxShadow: `0 4px 24px ${currentProfile.keycapTheme.glow}`,
              }}
            >
              <ThockyBrandIcon
                className="w-7 h-7 sm:w-8 sm:h-8"
                accentColor={currentProfile.accentColor}
                glowColor={currentProfile.keycapTheme.glow}
                isLightBackground={true}
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-black text-white tracking-tight">Thocky</h1>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v1.0.2
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block font-medium">
                Mechanical Keyboard ASMR Acoustic Engine
              </p>
            </div>
          </div>

          {/* Quick Actions & Trial Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* 1-Day Trial / $3.99/yr Subscription Badge */}
            <button
              type="button"
              id="trial-status-badge-btn"
              onClick={() => setIsTrialModalOpen(true)}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl text-xs font-bold transition-all border shadow-sm cursor-pointer active:scale-95 ${
                trialState.isSubscribed
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : trialState.isExpired
                  ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/50 animate-pulse'
                  : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40'
              }`}
              title="Click to view subscription pricing, trial status, and license details"
            >
              {trialState.isSubscribed ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Pro Plan:</span>
                  <span className="text-emerald-200">Active ($3.99/yr)</span>
                </>
              ) : trialState.isExpired ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-rose-200 font-extrabold">Trial Ended</span>
                  <span className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-rose-500/30 font-black">$3.99/yr</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-slate-300 font-medium">1-Day Trial:</span>
                  <span className="text-amber-200 font-black">
                    {trialState.hoursRemaining > 0
                      ? `${trialState.hoursRemaining}h remaining`
                      : `${trialState.minutesRemaining}m remaining`}
                  </span>
                </>
              )}
            </button>

            {/* Stats Badge */}
            <div className="hidden xl:flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-slate-900 border border-white/10 text-xs font-mono">
              <span className="text-slate-400">Keystrokes: <strong className="text-white font-bold">{totalKeystrokes}</strong></span>
              <span className="text-slate-700">|</span>
              <span className="text-slate-400">Live WPM: <strong className="text-yellow-400 font-bold">{wpm}</strong></span>
            </div>

            {/* Customer Signups & Attribution Tracker Button */}
            <button
              type="button"
              id="header-users-btn"
              onClick={() => setIsUserDashboardOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-all cursor-pointer"
              title="Customer Signups & Attribution Dashboard"
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Customers</span>
              {activeUser && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active user linked" />
              )}
            </button>

            {/* Microsoft Store Windows App Download */}
            <button
              type="button"
              id="header-download-btn"
              onClick={() => setIsDownloadModalOpen(true)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <Laptop className="w-4 h-4" />
              <span className="hidden sm:inline">Microsoft Store</span>
              <span className="sm:hidden">Store</span>
            </button>
          </div>
        </div>
      </header>

      {/* Trial Expired Top Lockout Banner */}
      {trialState.isExpired && (
        <div className="bg-gradient-to-r from-rose-950/90 via-slate-900 to-rose-950/90 border-b border-rose-500/30 px-4 py-3 text-center">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Your 1-day free trial has concluded.</strong> Real-time switch acoustic DSP synthesis is locked. Subscribe for only <strong>$3.99/year</strong> ($0.33/mo) to unlock.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsTrialModalOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black uppercase tracking-wider text-[11px] transition-all shadow-md shadow-rose-500/30 shrink-0 cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Subscribe ($3.99/yr)</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 flex-1 w-full">
        {/* 1. Switch Profiles Showcase */}
        <section aria-label="Switch Profiles">
          <SoundProfileSelector
            currentProfileId={currentProfileId}
            onSelectProfile={(id) => setCurrentProfileId(id)}
            onTestSound={(id) => triggerKeyAudio('Space', 'spacebar')}
            isTrialExpired={trialState.isExpired}
            onOpenTrialModal={() => setIsTrialModalOpen(true)}
          />
        </section>

        {/* 2. Interactive Mechanical Keyboard Visualizer */}
        <section aria-label="Mechanical Keyboard Visualizer">
          <KeyboardVisualizer
            activeKeys={activeKeys}
            lastPressedKey={lastPressedKey}
            currentProfileId={currentProfileId}
            onKeyClick={(code, category) => triggerKeyAudio(code, category)}
          />
        </section>

        {/* 3. Audio & Acoustic Controls */}
        <section aria-label="Audio and Pitch Controls">
          <AudioControls
            settings={audioSettings}
            onChangeSettings={setAudioSettings}
            onResetDefaults={() => setAudioSettings(DEFAULT_AUDIO_SETTINGS)}
            isTrialExpired={trialState.isExpired}
            onOpenTrialModal={() => setIsTrialModalOpen(true)}
          />
        </section>

        {/* 4. Typing Sandbox & Speed Challenge */}
        <section aria-label="Typing Sandbox">
          <TypingSandbox
            currentProfileId={currentProfileId}
            onSimulateKeyPress={(char, code) => triggerKeyAudio(code, getKeyCategory(code), char)}
            onRegisterKeystroke={() => setTotalKeystrokes((p) => p + 1)}
            isTrialExpired={trialState.isExpired}
            onOpenTrialModal={() => setIsTrialModalOpen(true)}
          />
        </section>
      </main>

      {/* 6. Customizable Keystroke Overlay HUD */}
      <KeystrokeOverlay
        recentTriggers={recentTriggers}
        currentProfileId={currentProfileId}
        wpm={wpm}
        streak={streak}
        settings={overlaySettings}
        onChangeSettings={setOverlaySettings}
        onOpenPiP={handleOpenPiP}
      />

      {/* Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={() => {
          setIsOnboardingOpen(false);
          refreshTrial();
        }}
      />

      <UserTrackingDashboardModal
        isOpen={isUserDashboardOpen}
        onClose={() => setIsUserDashboardOpen(false)}
      />

      <TrialModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
        trialState={trialState}
        onTrialStateUpdate={refreshTrial}
      />

      <WindowsDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        canInstallPwa={Boolean(deferredPrompt)}
        onTriggerPwaInstall={handleTriggerPwaInstall}
      />
    </div>
  );
}