import { AudioSettings, KeyCategory, SwitchProfileId } from '../types';
import { SWITCH_PROFILES } from './profiles';

// Key location map to calculate stereo panning (-0.8 to +0.8) and acoustic micro-weight
const KEY_COLUMN_MAP: Record<string, number> = {
  // Row 1
  Backquote: -0.85, Digit1: -0.75, Digit2: -0.65, Digit3: -0.52, Digit4: -0.38, Digit5: -0.25,
  Digit6: -0.1, Digit7: 0.1, Digit8: 0.25, Digit9: 0.4, Digit0: 0.55, Minus: 0.68, Equal: 0.8, Backspace: 0.9,
  // Row 2
  Tab: -0.85, KeyQ: -0.7, KeyW: -0.55, KeyE: -0.4, KeyR: -0.25, KeyT: -0.1,
  KeyY: 0.1, KeyU: 0.25, KeyI: 0.4, KeyO: 0.55, KeyP: 0.7, BracketLeft: 0.8, BracketRight: 0.88, Backslash: 0.95,
  // Row 3
  CapsLock: -0.85, KeyA: -0.68, KeyS: -0.52, KeyD: -0.36, KeyF: -0.2, KeyG: -0.05,
  KeyH: 0.12, KeyJ: 0.28, KeyK: 0.44, KeyL: 0.6, Semicolon: 0.74, Quote: 0.85, Enter: 0.92,
  // Row 4
  ShiftLeft: -0.85, KeyZ: -0.62, KeyX: -0.46, KeyC: -0.3, KeyV: -0.14, KeyB: 0.0,
  KeyN: 0.15, KeyM: 0.32, Comma: 0.48, Period: 0.64, Slash: 0.78, ShiftRight: 0.88,
  // Bottom Row
  ControlLeft: -0.85, MetaLeft: -0.7, AltLeft: -0.55, Space: 0.0, AltRight: 0.55, MetaRight: 0.7, ContextMenu: 0.8, ControlRight: 0.88,
  // Navigation / Arrows
  ArrowLeft: 0.75, ArrowUp: 0.82, ArrowDown: 0.82, ArrowRight: 0.9,
};

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private analyser: AnalyserNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private reverbGain: GainNode | null = null;
  
  // Ambient Sound Nodes
  private rainSource: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;
  private hissSource: AudioBufferSourceNode | null = null;
  private hissGain: GainNode | null = null;
  private cafeSource: AudioBufferSourceNode | null = null;
  private cafeGain: GainNode | null = null;

  private isInitialized = false;

  private ensureAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass({ latencyHint: 'interactive' });

      // Create Analyser for oscilloscope / ASMR visualizer
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.65;

      // Create Master Compressor to prevent clipping during fast typing
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(8, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.002, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.05, this.ctx.currentTime);

      // Create Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      // Connect: Master Gain -> Compressor -> Analyser -> Destination
      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Create acoustic room reverb impulse
      this.setupReverb();
      this.isInitialized = true;
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    return this.ctx;
  }

  private setupReverb() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const sampleRate = this.ctx.sampleRate;
      const length = sampleRate * 0.45; // 450ms subtle desk room tail
      const impulse = this.ctx.createBuffer(2, length, sampleRate);
      const left = impulse.getChannelData(0);
      const right = impulse.getChannelData(1);

      for (let i = 0; i < length; i++) {
        const decay = Math.exp(-i / (sampleRate * 0.08));
        left[i] = (Math.random() * 2 - 1) * decay;
        right[i] = (Math.random() * 2 - 1) * decay;
      }

      this.reverbNode = this.ctx.createConvolver();
      this.reverbNode.buffer = impulse;

      this.reverbGain = this.ctx.createGain();
      this.reverbGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      this.reverbNode.connect(this.reverbGain);
      this.reverbGain.connect(this.masterGain);
    } catch {
      // Reverb setup failure fallback gracefully
    }
  }

  /**
   * Main synthesis trigger for keypress (Down stroke - Bottom-out impact)
   */
  public triggerKeyDown(
    code: string,
    profileId: SwitchProfileId,
    category: KeyCategory,
    settings: AudioSettings
  ): { pitch: number; pan: number; volume: number } {
    if (settings.isMuted) return { pitch: 1, pan: 0, volume: 0 };
    const ctx = this.ensureAudioContext();
    const profile = SWITCH_PROFILES[profileId] || SWITCH_PROFILES.thocky;
    const now = ctx.currentTime;

    // Calculate Stereo Pan (-0.8 to +0.8)
    const rawPan = settings.stereoPanEnabled ? (KEY_COLUMN_MAP[code] ?? 0.0) : 0.0;
    const panValue = Math.max(-0.85, Math.min(0.85, rawPan));

    // Calculate Pitch with micro-jitter (natural ASMR acoustic variation per key)
    let pitchJitterRatio = 1.0;
    if (settings.pitchJitterEnabled) {
      // Slight randomized jitter between -3.5% and +3.5%
      pitchJitterRatio = 1.0 + (Math.random() * 2 - 1) * profile.pitchJitter;
    }
    
    // Category pitch shift: Spacebar has deeper pitch, Backspace/Enter are resonant, NumPad is punchy
    let categoryPitchMultiplier = 1.0;
    let categoryVolMultiplier = 1.0;
    let spaceThockMultiplier = 1.0;

    if (category === 'spacebar') {
      categoryPitchMultiplier = 0.58;
      categoryVolMultiplier = 1.25;
      spaceThockMultiplier = settings.spacebarBoost * profile.spacebarThockFactor;
    } else if (category === 'enter' || category === 'backspace') {
      categoryPitchMultiplier = 0.78;
      categoryVolMultiplier = 1.12;
    } else if (category === 'modifier') {
      categoryPitchMultiplier = 0.88;
      categoryVolMultiplier = 0.95;
    }

    const calculatedPitch = profile.basePitch * settings.pitchMultiplier * categoryPitchMultiplier * pitchJitterRatio;
    const calculatedVolume = settings.masterVolume * categoryVolMultiplier;

    // Create Stereo Panner
    let targetNode: AudioNode = this.masterGain!;
    if (ctx.createStereoPanner && settings.stereoPanEnabled) {
      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(panValue, now);
      panner.connect(this.masterGain!);
      targetNode = panner;
    }

    // Connect to Reverb if enabled
    if (this.reverbNode && settings.reverbAmount > 0) {
      const sendGain = ctx.createGain();
      sendGain.gain.setValueAtTime(settings.reverbAmount * 0.25, now);
      sendGain.connect(this.reverbNode);
    }

    // Synthesize based on switch archetype
    switch (profileId) {
      case 'creamy':
        this.synthesizeCreamySwitch(ctx, now, targetNode, calculatedPitch, calculatedVolume, settings.lubeModifier, category);
        break;
      case 'poppy':
        this.synthesizePoppySwitch(ctx, now, targetNode, calculatedPitch, calculatedVolume, category);
        break;
      case 'clacky':
        this.synthesizeClackySwitch(ctx, now, targetNode, calculatedPitch, calculatedVolume, category);
        break;
      case 'thocky':
        this.synthesizeThockySwitch(ctx, now, targetNode, calculatedPitch, calculatedVolume, spaceThockMultiplier, category);
        break;
      case 'buckling':
        this.synthesizeBucklingSpringSwitch(ctx, now, targetNode, calculatedPitch, calculatedVolume, category);
        break;
      case 'hi-fi':
        this.synthesizeHiFiCeramicSwitch(ctx, now, targetNode, calculatedPitch, calculatedVolume, category);
        break;
      default:
        this.synthesizeThockySwitch(ctx, now, targetNode, calculatedPitch, calculatedVolume, spaceThockMultiplier, category);
    }

    return { pitch: calculatedPitch, pan: panValue, volume: calculatedVolume };
  }

  /**
   * Key-up release sound synthesis (Top-out return clack)
   */
  public triggerKeyUp(
    code: string,
    profileId: SwitchProfileId,
    category: KeyCategory,
    settings: AudioSettings
  ) {
    if (settings.isMuted || !settings.releaseSoundEnabled) return;
    const ctx = this.ensureAudioContext();
    const profile = SWITCH_PROFILES[profileId] || SWITCH_PROFILES.thocky;
    const now = ctx.currentTime;

    const rawPan = settings.stereoPanEnabled ? (KEY_COLUMN_MAP[code] ?? 0.0) : 0.0;
    const panValue = Math.max(-0.85, Math.min(0.85, rawPan));

    let targetNode: AudioNode = this.masterGain!;
    if (ctx.createStereoPanner && settings.stereoPanEnabled) {
      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(panValue, now);
      panner.connect(this.masterGain!);
      targetNode = panner;
    }

    const releasePitch = profile.basePitch * 1.35 * settings.pitchMultiplier;
    const releaseGain = ctx.createGain();
    const relVol = settings.masterVolume * profile.releaseVolume * (profileId === 'buckling' ? 0.95 : 0.55);
    
    releaseGain.gain.setValueAtTime(relVol, now);
    releaseGain.gain.exponentialRampToValueAtTime(0.0001, now + (profileId === 'buckling' ? 0.045 : 0.035));
    releaseGain.connect(targetNode);

    // High pass filter for crisp top-out snap
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(profileId === 'buckling' ? 3600 : releasePitch * 2.2, now);
    filter.Q.setValueAtTime(profileId === 'buckling' ? 4.2 : 3.5, now);
    filter.connect(releaseGain);

    // Noise burst for keycap release snap
    const bufferSize = ctx.sampleRate * (profileId === 'buckling' ? 0.05 : 0.04);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008));
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.connect(filter);
    noiseSource.start(now);
    noiseSource.stop(now + (profileId === 'buckling' ? 0.05 : 0.04));

    // For buckling spring: add a subtle spring unbuckle ping on release
    if (profileId === 'buckling') {
      const pingOsc = ctx.createOscillator();
      pingOsc.type = 'sawtooth';
      pingOsc.frequency.setValueAtTime(2780, now);
      pingOsc.frequency.linearRampToValueAtTime(2600, now + 0.04);

      const pingFilter = ctx.createBiquadFilter();
      pingFilter.type = 'bandpass';
      pingFilter.frequency.setValueAtTime(2780, now);
      pingFilter.Q.setValueAtTime(9.0, now);

      const pingGain = ctx.createGain();
      pingGain.gain.setValueAtTime(relVol * 0.45, now);
      pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      pingOsc.connect(pingFilter);
      pingFilter.connect(pingGain);
      pingGain.connect(targetNode);

      pingOsc.start(now);
      pingOsc.stop(now + 0.04);
    }
  }

  // -------------------------------------------------------------
  // 1. CREAMY SWITCH SYNTHESIS (Smooth, Lube-damped, Soft Cushion)
  // -------------------------------------------------------------
  private synthesizeCreamySwitch(
    ctx: AudioContext,
    now: number,
    target: AudioNode,
    pitch: number,
    volume: number,
    lubeMod: number,
    category: KeyCategory
  ) {
    const duration = category === 'spacebar' ? 0.085 : 0.055;

    // 1. Butter POM Body Oscillator (Warm Triangle/Sine hybrid)
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.72, now + duration);

    // Lowpass filter for buttery damped sound (models Krytox 205g0 lube)
    const lpFilter = ctx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    const cutoff = 1200 - lubeMod * 350;
    lpFilter.frequency.setValueAtTime(cutoff, now);
    lpFilter.Q.setValueAtTime(1.8, now);

    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(0, now);
    bodyGain.gain.linearRampToValueAtTime(volume * 0.85, now + 0.003); // Soft, velvety attack
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(lpFilter);
    lpFilter.connect(bodyGain);
    bodyGain.connect(target);

    osc.start(now);
    osc.stop(now + duration);

    // 2. Soft Damped Transient (Lube squelch & switch bottom cushion)
    const transientBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
    const data = transientBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.006));
    }
    const transientSource = ctx.createBufferSource();
    transientSource.buffer = transientBuffer;

    const bpFilter = ctx.createBiquadFilter();
    bpFilter.type = 'bandpass';
    bpFilter.frequency.setValueAtTime(pitch * 2.1, now);
    bpFilter.Q.setValueAtTime(2.2, now);

    const transGain = ctx.createGain();
    transGain.gain.setValueAtTime(volume * 0.45, now);
    transGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    transientSource.connect(bpFilter);
    bpFilter.connect(transGain);
    transGain.connect(target);

    transientSource.start(now);
    transientSource.stop(now + 0.03);
  }

  // -------------------------------------------------------------
  // 2. THOCKY SWITCH SYNTHESIS (Deep, Hollow, Brass & PC Bottom)
  // -------------------------------------------------------------
  private synthesizeThockySwitch(
    ctx: AudioContext,
    now: number,
    target: AudioNode,
    pitch: number,
    volume: number,
    spaceThock: number,
    category: KeyCategory
  ) {
    const duration = category === 'spacebar' ? 0.12 : 0.075;

    // 1. Deep Sub-bass Thud (Hollow cavity impact)
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    const fundamental = pitch * (category === 'spacebar' ? 0.75 : 1.0);
    subOsc.frequency.setValueAtTime(fundamental * 1.2, now);
    subOsc.frequency.exponentialRampToValueAtTime(fundamental * 0.65, now + duration);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(volume * 0.95 * spaceThock, now);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    subOsc.connect(subGain);
    subGain.connect(target);

    subOsc.start(now);
    subOsc.stop(now + duration);

    // 2. Hollow Case Resonance (Bandpass resonant cavity)
    const cavityNoise = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate);
    const cData = cavityNoise.getChannelData(0);
    for (let i = 0; i < cData.length; i++) {
      cData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.012));
    }
    const cavitySource = ctx.createBufferSource();
    cavitySource.buffer = cavityNoise;

    const cavityFilter = ctx.createBiquadFilter();
    cavityFilter.type = 'bandpass';
    cavityFilter.frequency.setValueAtTime(pitch * 1.8, now);
    cavityFilter.Q.setValueAtTime(4.5, now); // High Q for hollow acoustic box ring

    const cavityGain = ctx.createGain();
    cavityGain.gain.setValueAtTime(volume * 0.7, now);
    cavityGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

    cavitySource.connect(cavityFilter);
    cavityFilter.connect(cavityGain);
    cavityGain.connect(target);

    cavitySource.start(now);
    cavitySource.stop(now + 0.06);

    // 3. Spacebar stabilizer deep hollow body (extra punch for spacebar)
    if (category === 'spacebar') {
      const stabOsc = ctx.createOscillator();
      stabOsc.type = 'triangle';
      stabOsc.frequency.setValueAtTime(95, now);
      stabOsc.frequency.exponentialRampToValueAtTime(65, now + 0.1);

      const stabGain = ctx.createGain();
      stabGain.gain.setValueAtTime(volume * 0.6 * spaceThock, now);
      stabGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      stabOsc.connect(stabGain);
      stabGain.connect(target);

      stabOsc.start(now);
      stabOsc.stop(now + 0.1);
    }
  }

  // -------------------------------------------------------------
  // 3. CLACKY SWITCH SYNTHESIS (Crisp, High-Register, Aluminum Plate)
  // -------------------------------------------------------------
  private synthesizeClackySwitch(
    ctx: AudioContext,
    now: number,
    target: AudioNode,
    pitch: number,
    volume: number,
    category: KeyCategory
  ) {
    const duration = category === 'spacebar' ? 0.07 : 0.048;

    // 1. Sharp Aluminum Plate Ping (High-frequency transient)
    const pingBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
    const pData = pingBuffer.getChannelData(0);
    for (let i = 0; i < pData.length; i++) {
      pData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.005));
    }
    const pingSource = ctx.createBufferSource();
    pingSource.buffer = pingBuffer;

    const hpFilter = ctx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.setValueAtTime(2200, now);
    hpFilter.Q.setValueAtTime(2.0, now);

    const bpFilter = ctx.createBiquadFilter();
    bpFilter.type = 'peaking';
    bpFilter.frequency.setValueAtTime(3600, now);
    bpFilter.gain.setValueAtTime(8, now);

    const clackGain = ctx.createGain();
    clackGain.gain.setValueAtTime(volume * 1.1, now);
    clackGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    pingSource.connect(hpFilter);
    hpFilter.connect(bpFilter);
    bpFilter.connect(clackGain);
    clackGain.connect(target);

    pingSource.start(now);
    pingSource.stop(now + duration);

    // 2. Punchy Mid-tone Strike (ABS keycap bottom strike)
    const midOsc = ctx.createOscillator();
    midOsc.type = 'square';
    midOsc.frequency.setValueAtTime(pitch * 1.5, now);
    midOsc.frequency.exponentialRampToValueAtTime(pitch * 0.8, now + duration);

    const midFilter = ctx.createBiquadFilter();
    midFilter.type = 'bandpass';
    midFilter.frequency.setValueAtTime(pitch * 2.8, now);
    midFilter.Q.setValueAtTime(3.0, now);

    const midGain = ctx.createGain();
    midGain.gain.setValueAtTime(volume * 0.45, now);
    midGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    midOsc.connect(midFilter);
    midFilter.connect(midGain);
    midGain.connect(target);

    midOsc.start(now);
    midOsc.stop(now + 0.035);
  }

  // -------------------------------------------------------------
  // 4. POPPY SWITCH SYNTHESIS (Marbly Pop, Bubble PE Foam Sweep)
  // -------------------------------------------------------------
  private synthesizePoppySwitch(
    ctx: AudioContext,
    now: number,
    target: AudioNode,
    pitch: number,
    volume: number,
    category: KeyCategory
  ) {
    const duration = category === 'spacebar' ? 0.08 : 0.052;

    // 1. Dynamic Pitch Drop Bubble Pop (Frequency drops rapidly 1800Hz -> 450Hz)
    const popOsc = ctx.createOscillator();
    popOsc.type = 'sine';
    const startFreq = pitch * 3.8;
    const endFreq = pitch * 1.1;
    popOsc.frequency.setValueAtTime(startFreq, now);
    popOsc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.018); // Snappy bubble sweep!

    const popGain = ctx.createGain();
    popGain.gain.setValueAtTime(volume * 0.9, now);
    popGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    popOsc.connect(popGain);
    popGain.connect(target);

    popOsc.start(now);
    popOsc.stop(now + duration);

    // 2. Marbly Glass-on-Wood Impact Transient
    const marbleBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.035, ctx.sampleRate);
    const mData = marbleBuffer.getChannelData(0);
    for (let i = 0; i < mData.length; i++) {
      mData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.007));
    }
    const marbleSource = ctx.createBufferSource();
    marbleSource.buffer = marbleBuffer;

    const marbleFilter = ctx.createBiquadFilter();
    marbleFilter.type = 'bandpass';
    marbleFilter.frequency.setValueAtTime(1450, now);
    marbleFilter.Q.setValueAtTime(5.2, now); // Marbly acoustic resonance

    const marbleGain = ctx.createGain();
    marbleGain.gain.setValueAtTime(volume * 0.75, now);
    marbleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    marbleSource.connect(marbleFilter);
    marbleFilter.connect(marbleGain);
    marbleGain.connect(target);

    marbleSource.start(now);
    marbleSource.stop(now + 0.035);
  }

  // -------------------------------------------------------------
  // 5. IBM BUCKLING SPRING SYNTHESIS (Crisp Mechanical Return Snap & Coil Ping)
  // -------------------------------------------------------------
  private synthesizeBucklingSpringSwitch(
    ctx: AudioContext,
    now: number,
    target: AudioNode,
    _pitch: number,
    volume: number,
    category: KeyCategory
  ) {
    const isSpacebar = category === 'spacebar';
    const duration = isSpacebar ? 0.055 : 0.045;
    const masterVol = volume * (isSpacebar ? 1.4 : 1.25);

    // 1. High-frequency crisp bandpassed release snap burst
    const releaseGain = ctx.createGain();
    releaseGain.gain.setValueAtTime(masterVol, now);
    releaseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    releaseGain.connect(target);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3600, now);
    filter.Q.setValueAtTime(4.2, now);
    filter.connect(releaseGain);

    const bufferSize = Math.floor(ctx.sampleRate * 0.05);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008));
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.connect(filter);
    noiseSource.start(now);
    noiseSource.stop(now + 0.05);

    // 2. Harmonic spring coil unbuckle ping
    const pingOsc = ctx.createOscillator();
    pingOsc.type = 'sawtooth';
    pingOsc.frequency.setValueAtTime(2780, now);
    pingOsc.frequency.linearRampToValueAtTime(2600, now + 0.04);

    const pingFilter = ctx.createBiquadFilter();
    pingFilter.type = 'bandpass';
    pingFilter.frequency.setValueAtTime(2780, now);
    pingFilter.Q.setValueAtTime(9.0, now);

    const pingGain = ctx.createGain();
    pingGain.gain.setValueAtTime(masterVol * 0.45, now);
    pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    pingOsc.connect(pingFilter);
    pingFilter.connect(pingGain);
    pingGain.connect(target);

    pingOsc.start(now);
    pingOsc.stop(now + 0.04);
  }

  // -------------------------------------------------------------
  // 6. HI-FI GLASS & CERAMIC SYNTHESIS (Cerakey Crystal Bell Pop)
  // -------------------------------------------------------------
  private synthesizeHiFiCeramicSwitch(
    ctx: AudioContext,
    now: number,
    target: AudioNode,
    pitch: number,
    volume: number,
    category: KeyCategory
  ) {
    const duration = category === 'spacebar' ? 0.09 : 0.06;

    // 1. Crystal Harmonic Bell Chime (High dual-frequency sine bell ring)
    const bellOsc1 = ctx.createOscillator();
    bellOsc1.type = 'sine';
    bellOsc1.frequency.setValueAtTime(pitch * 2.8, now);
    bellOsc1.frequency.exponentialRampToValueAtTime(pitch * 2.6, now + duration);

    const bellOsc2 = ctx.createOscillator();
    bellOsc2.type = 'sine';
    bellOsc2.frequency.setValueAtTime(pitch * 5.4, now);
    bellOsc2.frequency.exponentialRampToValueAtTime(pitch * 5.1, now + duration * 0.7);

    const bellFilter = ctx.createBiquadFilter();
    bellFilter.type = 'highpass';
    bellFilter.frequency.setValueAtTime(1200, now);

    const bellGain = ctx.createGain();
    bellGain.gain.setValueAtTime(volume * 0.85, now);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    bellOsc1.connect(bellFilter);
    bellOsc2.connect(bellFilter);
    bellFilter.connect(bellGain);
    bellGain.connect(target);

    bellOsc1.start(now);
    bellOsc1.stop(now + duration);
    bellOsc2.start(now);
    bellOsc2.stop(now + duration * 0.7);

    // 2. Ceramic Glaze Click Transient
    const glazeBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.035, ctx.sampleRate);
    const gData = glazeBuffer.getChannelData(0);
    for (let i = 0; i < gData.length; i++) {
      gData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.004));
    }
    const glazeSource = ctx.createBufferSource();
    glazeSource.buffer = glazeBuffer;

    const glazeFilter = ctx.createBiquadFilter();
    glazeFilter.type = 'bandpass';
    glazeFilter.frequency.setValueAtTime(3800, now);
    glazeFilter.Q.setValueAtTime(4.5, now);

    const glazeGain = ctx.createGain();
    glazeGain.gain.setValueAtTime(volume * 0.75, now);
    glazeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    glazeSource.connect(glazeFilter);
    glazeFilter.connect(glazeGain);
    glazeGain.connect(target);

    glazeSource.start(now);
    glazeSource.stop(now + 0.035);
  }

  // -------------------------------------------------------------
  // AMBIENT SOUND GENERATION (Rain, Lo-Fi Tape Hiss, Cozy Room)
  // -------------------------------------------------------------
  public updateAmbientSounds(
    rainVol: number,
    cafeVol: number,
    hissVol: number,
    roomVol: number
  ) {
    const ctx = this.ensureAudioContext();
    const now = ctx.currentTime;

    // 1. Rain
    if (rainVol > 0) {
      if (!this.rainSource) {
        const buffer = this.createNoiseBuffer(ctx, 4.0);
        this.rainSource = ctx.createBufferSource();
        this.rainSource.buffer = buffer;
        this.rainSource.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, now);

        this.rainGain = ctx.createGain();
        this.rainGain.gain.setValueAtTime(0.001, now);

        this.rainSource.connect(filter);
        filter.connect(this.rainGain);
        this.rainGain.connect(this.masterGain!);

        this.rainSource.start(now);
      }
      this.rainGain?.gain.setTargetAtTime(rainVol * 0.35, now, 0.2);
    } else if (this.rainGain) {
      this.rainGain.gain.setTargetAtTime(0, now, 0.2);
    }

    // 2. Tape Hiss
    if (hissVol > 0) {
      if (!this.hissSource) {
        const buffer = this.createNoiseBuffer(ctx, 3.0);
        this.hissSource = ctx.createBufferSource();
        this.hissSource.buffer = buffer;
        this.hissSource.loop = true;

        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.setValueAtTime(2500, now);

        this.hissGain = ctx.createGain();
        this.hissGain.gain.setValueAtTime(0.001, now);

        this.hissSource.connect(hp);
        hp.connect(this.hissGain);
        this.hissGain.connect(this.masterGain!);

        this.hissSource.start(now);
      }
      this.hissGain?.gain.setTargetAtTime(hissVol * 0.15, now, 0.2);
    } else if (this.hissGain) {
      this.hissGain.gain.setTargetAtTime(0, now, 0.2);
    }

    // 3. Cafe & Room Tone
    if (cafeVol > 0 || roomVol > 0) {
      const combinedVol = Math.max(cafeVol, roomVol);
      if (!this.cafeSource) {
        const buffer = this.createNoiseBuffer(ctx, 5.0);
        this.cafeSource = ctx.createBufferSource();
        this.cafeSource.buffer = buffer;
        this.cafeSource.loop = true;

        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(450, now);

        this.cafeGain = ctx.createGain();
        this.cafeGain.gain.setValueAtTime(0.001, now);

        this.cafeSource.connect(lp);
        lp.connect(this.cafeGain);
        this.cafeGain.connect(this.masterGain!);

        this.cafeSource.start(now);
      }
      this.cafeGain?.gain.setTargetAtTime(combinedVol * 0.25, now, 0.2);
    } else if (this.cafeGain) {
      this.cafeGain.gain.setTargetAtTime(0, now, 0.2);
    }
  }

  private createNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
    const buffer = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let lastOut = 0.0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        // Pinkish noise filter
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
      }
    }
    return buffer;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setMasterVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(2.0, vol)), this.ctx.currentTime, 0.02);
    }
  }

  public unlockAudio() {
    this.ensureAudioContext();
  }
}

// Global Singleton Sound Engine
export const soundEngine = new SoundEngine();
