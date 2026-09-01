export type SwitchProfileId =
  | 'creamy'
  | 'poppy'
  | 'clacky'
  | 'thocky'
  | 'buckling'
  | 'hi-fi';

export type KeyCategory = 'alphanumeric' | 'spacebar' | 'enter' | 'backspace' | 'modifier' | 'numpad' | 'arrow';

export interface SoundProfile {
  id: SwitchProfileId;
  name: string;
  categoryName: string;
  tagline: string;
  description: string;
  acousticSignature: string;
  accentColor: string;
  badgeBg: string;
  gradientBorder: string;
  ghostNumber: string;
  keycapTheme: {
    bg: string;
    text: string;
    border: string;
    activeBg: string;
    activeText: string;
    glow: string;
  };
  // Synthesis parameters
  basePitch: number; // Base frequency in Hz
  pitchJitter: number; // Randomization variance
  damping: number; // 0 (bright/open) to 1 (muffled/damped)
  plateResonance: number; // 0 to 1
  bottomOutDepth: number; // Low-end weight
  clickSharpness: number; // Metallic snap transient (0 to 1)
  popSweep: number; // Frequency sweep for poppy sound (0 to 1)
  lubeLevel: number; // Smoothness & soft attack (0 to 1)
  releaseVolume: number; // Key-up clack volume (0 to 1)
  spacebarThockFactor: number; // Spacebar bass & hollow resonance multiplier
}

export interface AudioSettings {
  masterVolume: number; // 0 to 1.5 (default 0.85)
  pitchMultiplier: number; // 0.5 to 1.8 (default 1.0)
  pitchJitterEnabled: boolean; // Subtle organic variation per keystroke
  stereoPanEnabled: boolean; // Stereo panning based on key position
  releaseSoundEnabled: boolean; // Play sound on keyup (top-out clack)
  lubeModifier: number; // 0 to 1 (affects sound damping)
  spacebarBoost: number; // 1 to 2
  reverbAmount: number; // 0 to 1
  isMuted: boolean;
}

export interface OverlaySettings {
  enabled: boolean;
  position: 'bottom-dock' | 'top-right' | 'bottom-right' | 'minimal-pill' | 'floating-hud';
  opacity: number; // 0.3 to 1.0
  showActiveKey: boolean;
  showOscilloscope: boolean;
  showWpm: boolean;
  showSoundProfile: boolean;
  visualFeedbackMode: 'ripple' | 'glow' | 'meter' | 'subtle';
  size: 'compact' | 'normal' | 'large';
}

export interface AmbientSettings {
  enabled: boolean;
  rainVolume: number; // 0 to 1
  cafeVolume: number; // 0 to 1
  tapeHissVolume: number; // 0 to 1
  roomResonanceVolume: number; // 0 to 1
}

export interface KeyTriggerEvent {
  id: string;
  key: string;
  code: string;
  category: KeyCategory;
  timestamp: number;
  pitch: number;
  volume: number;
  pan: number;
  profileId: SwitchProfileId;
}

export interface TypingStats {
  totalKeystrokes: number;
  wpm: number;
  streak: number;
  bestWpm: number;
  accuracy: number;
  sessionStartTime: number;
}
