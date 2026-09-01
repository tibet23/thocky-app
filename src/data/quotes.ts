export type QuoteDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export interface SpeedQuote {
  id: number;
  text: string;
  difficulty: QuoteDifficulty;
}

export const SPEED_CHALLENGE_QUOTES: SpeedQuote[] = [
  // ==========================================
  // EASY (25 Quotes) - Clean, simple, rhythmic flow
  // ==========================================
  {
    id: 1,
    difficulty: 'easy',
    text: 'The quick brown fox jumps over the lazy dog near the river bank.',
  },
  {
    id: 2,
    difficulty: 'easy',
    text: 'Fresh morning coffee smells wonderful before starting the work day.',
  },
  {
    id: 3,
    difficulty: 'easy',
    text: 'Mechanical switches provide crisp tactile feedback with every tap.',
  },
  {
    id: 4,
    difficulty: 'easy',
    text: 'Clean code is simple, readable, and easy for everyone to maintain.',
  },
  {
    id: 5,
    difficulty: 'easy',
    text: 'Soft rain falls quietly on the roof while I type at my desk.',
  },
  {
    id: 6,
    difficulty: 'easy',
    text: 'The sound of smooth linear switches makes typing a true pleasure.',
  },
  {
    id: 7,
    difficulty: 'easy',
    text: 'A good keyboard turns everyday writing into a calming habit.',
  },
  {
    id: 8,
    difficulty: 'easy',
    text: 'Practice every single day to build muscle memory and high typing speed.',
  },
  {
    id: 9,
    difficulty: 'easy',
    text: 'Golden sunlight streams through the open window on a calm Sunday morning.',
  },
  {
    id: 10,
    difficulty: 'easy',
    text: 'Typing fast requires rhythm, steady focus, and relaxed hands.',
  },
  {
    id: 11,
    difficulty: 'easy',
    text: 'Keep your fingers resting gently on the home row keys.',
  },
  {
    id: 12,
    difficulty: 'easy',
    text: 'A quiet room and a cup of warm tea help you focus deeply.',
  },
  {
    id: 13,
    difficulty: 'easy',
    text: 'Every great journey starts with a single step forward into the unknown.',
  },
  {
    id: 14,
    difficulty: 'easy',
    text: 'The blue sky is clear and bright without a single cloud in sight.',
  },
  {
    id: 15,
    difficulty: 'easy',
    text: 'Listen to the gentle click of keys as you type your favorite story.',
  },
  {
    id: 16,
    difficulty: 'easy',
    text: 'Great ideas often start with simple notes typed late at night.',
  },
  {
    id: 17,
    difficulty: 'easy',
    text: 'Consistency and patience are the true secrets to master any skill.',
  },
  {
    id: 18,
    difficulty: 'easy',
    text: 'Sound and touch work together to create an enjoyable typing flow.',
  },
  {
    id: 19,
    difficulty: 'easy',
    text: 'Take a deep breath, sit up straight, and begin typing with joy.',
  },
  {
    id: 20,
    difficulty: 'easy',
    text: 'Beautiful words come alive when your thoughts move smoothly onto the screen.',
  },
  {
    id: 21,
    difficulty: 'easy',
    text: 'The ocean waves roll gently onto the sandy shore in the warm breeze.',
  },
  {
    id: 22,
    difficulty: 'easy',
    text: 'Fast fingers glide across the keycaps like water flowing down a stream.',
  },
  {
    id: 23,
    difficulty: 'easy',
    text: 'Keep a steady pace and your typing accuracy will improve naturally.',
  },
  {
    id: 24,
    difficulty: 'easy',
    text: 'Music plays softly in the background while ideas turn into reality.',
  },
  {
    id: 25,
    difficulty: 'easy',
    text: 'Enjoy every moment of creating something new with your own hands.',
  },

  // ==========================================
  // MEDIUM (25 Quotes) - Moderate length & vocabulary
  // ==========================================
  {
    id: 26,
    difficulty: 'medium',
    text: 'Custom mechanical keyboards combine industrial engineering, acoustics, and tactile aesthetics into a personalized typing instrument.',
  },
  {
    id: 27,
    difficulty: 'medium',
    text: 'Applying thin layers of Krytox 205g0 lubricant to switch housings significantly dampens unwanted plastic friction and spring ping.',
  },
  {
    id: 28,
    difficulty: 'medium',
    text: 'Gasket mount designs suspend the internal switch plate using soft silicone or poron dampeners, yielding a cushioned bottom-out sensation.',
  },
  {
    id: 29,
    difficulty: 'medium',
    text: 'Double-shot PBT keycaps feature thick walls that never develop oily shine, ensuring clear legends that endure millions of keystrokes.',
  },
  {
    id: 30,
    difficulty: 'medium',
    text: 'The acoustics of a keyboard depend heavily on plate material, case density, switch travel distance, and desk surface dampening.',
  },
  {
    id: 31,
    difficulty: 'medium',
    text: 'Polycarbonate switch plates produce a deeper acoustic signature compared to the high-pitched resonance of stiff aluminum or brass plates.',
  },
  {
    id: 32,
    difficulty: 'medium',
    text: 'Touch typing relies on spatial muscle memory, allowing the typist to translate mental sentences into rapid keystrokes without looking down.',
  },
  {
    id: 33,
    difficulty: 'medium',
    text: 'Hot-swappable printed circuit boards allow keyboard enthusiasts to audition different tactile, linear, and clicky switches effortlessly.',
  },
  {
    id: 34,
    difficulty: 'medium',
    text: 'Properly balanced stabilizer wires eliminate spacebar rattle and ensure uniform acoustic feedback across all elongated modifier keys.',
  },
  {
    id: 35,
    difficulty: 'medium',
    text: 'Ergonomic typing postures with floating wrists reduce tendon strain and enhance sustained words-per-minute performance over long sessions.',
  },
  {
    id: 36,
    difficulty: 'medium',
    text: 'Mechanical switches actuate midway through their physical travel, eliminating the need to harshly bottom out on every single keystroke.',
  },
  {
    id: 37,
    difficulty: 'medium',
    text: 'Sound dampening foam placed inside the bottom case absorbs internal air reverberation, creating a deeper, more focused acoustic profile.',
  },
  {
    id: 38,
    difficulty: 'medium',
    text: 'Tactile switches feature a distinct physical bump before actuation, providing instant confirmation without the loud snap of a click-leaf.',
  },
  {
    id: 39,
    difficulty: 'medium',
    text: 'High-speed typing contests demonstrate that consistent rhythmic cadence consistently outperforms erratic bursts of extreme speed.',
  },
  {
    id: 40,
    difficulty: 'medium',
    text: 'The transition from membrane keyboards to mechanical switches often revitalizes the daily writing workflow for software engineers and authors.',
  },
  {
    id: 41,
    difficulty: 'medium',
    text: 'Anodized aluminum keyboard cases offer substantial desktop weight, preventing unintended sliding during aggressive competitive gaming or typing sprints.',
  },
  {
    id: 42,
    difficulty: 'medium',
    text: 'Screw-in stabilizers provide superior structural stability compared to snap-in alternatives, drastically reducing unwanted keycap wobble on large keys.',
  },
  {
    id: 43,
    difficulty: 'medium',
    text: 'South-facing LED orientation ensures broad compatibility with Cherry profile keycaps by avoiding physical interference with switch top housings.',
  },
  {
    id: 44,
    difficulty: 'medium',
    text: 'The acoustic resonance of a hollow desk can be mitigated by placing a thick, multi-layered felt or stitched rubber desk mat beneath the chassis.',
  },
  {
    id: 45,
    difficulty: 'medium',
    text: 'Key chatter and debounce latency in firmware can lead to phantom double-strikes if actuation parameters are not finely calibrated.',
  },
  {
    id: 46,
    difficulty: 'medium',
    text: 'Modern mechanical keyboards often support open-source QMK and VIA firmware, giving users infinite flexibility over custom keymap layers.',
  },
  {
    id: 47,
    difficulty: 'medium',
    text: 'Linear switches with progressive 62-gram gold-plated springs offer a featherlight initial touch with smooth, predictable bottoming resistance.',
  },
  {
    id: 48,
    difficulty: 'medium',
    text: 'ASMR typing enthusiasts seek out the acoustic sweet spot where switch pop, bottom-out thud, and stem return snap harmonize perfectly.',
  },
  {
    id: 49,
    difficulty: 'medium',
    text: 'Writing prose on a well-tuned mechanical keyboard creates an immersive sensory feedback loop that encourages continuous flow state.',
  },
  {
    id: 50,
    difficulty: 'medium',
    text: 'Regularly cleaning your keycaps and dusting between switch switches preserves both optical aesthetics and internal slider smoothness.',
  },

  // ==========================================
  // HARD (25 Quotes) - Technical vocabulary & nuanced syntax
  // ==========================================
  {
    id: 51,
    difficulty: 'hard',
    text: 'The acoustic timbre of an injection-molded POM stem descending into a high-density nylon housing generates a subterranean 140Hz fundamental resonant frequency.',
  },
  {
    id: 52,
    difficulty: 'hard',
    text: 'Dialing in stabilizer tolerances requires micro-lubricating the wire hooks with fluorinated synthetic grease while tape-modding the PCB beneath the housing feet.',
  },
  {
    id: 53,
    difficulty: 'hard',
    text: 'High-performance mechanical key switch travel matrices operate within strict dimensional tolerances, typically featuring 3.8mm total travel and a 1.8mm pre-actuation point.',
  },
  {
    id: 54,
    difficulty: 'hard',
    text: 'Implementing non-blocking matrix scanning algorithms with full N-key rollover over USB HID endpoints prevents ghosting and guarantees microsecond input fidelity.',
  },
  {
    id: 55,
    difficulty: 'hard',
    text: 'By utilizing tape mods (tempest modding) on the backside of the solder mask, higher-frequency vibrations are filtered, leaving only a satisfying, isolated low-end acoustic thock.',
  },
  {
    id: 56,
    difficulty: 'hard',
    text: 'The physical friction coefficient (mu) between unlubricated Polyoxymethylene and Polycarbonate components produces microscopic stick-slip oscillations, perceived as auditory scratch.',
  },
  {
    id: 57,
    difficulty: 'hard',
    text: 'Dual-stage symmetric long springs deliver a snappier, more energetic return trajectory, preventing sluggish stem recovery during rapid 140+ WPM burst sequences.',
  },
  {
    id: 58,
    difficulty: 'hard',
    text: 'Anisotropic dampening characteristics of multi-density EVA and Poron foam layers selectively attenuate parasitic reverberations across the 1kHz-4kHz acoustic spectrum.',
  },
  {
    id: 59,
    difficulty: 'hard',
    text: 'Custom FR4 switch plates offer a balanced middle ground between the flexible, deep acoustic profile of POM and the rigid, high-frequency clack of carbon fiber.',
  },
  {
    id: 60,
    difficulty: 'hard',
    text: 'The Hall effect magnetic switch paradigm replaces traditional metallic leaf contacts with Hall sensors, enabling dynamic rapid trigger and adjustable actuation down to 0.1mm.',
  },
  {
    id: 61,
    difficulty: 'hard',
    text: 'Acoustic wave propagation within an enclosed CNC-machined brass enclosure exhibits distinct boundary reflection modes that amplify harmonic overtones.',
  },
  {
    id: 62,
    difficulty: 'hard',
    text: 'Keycap wall thickness exceeding 1.5mm contributes substantial mass to the moving assembly, lowering the center of gravity and deepening the perceived bottom-out timbre.',
  },
  {
    id: 63,
    difficulty: 'hard',
    text: 'Measuring typing metrics across extended corpora reveals that cognitive processing latency between semantic units outweighs raw motor finger articulation speed.',
  },
  {
    id: 64,
    difficulty: 'hard',
    text: 'Dielectric grease application on stabilizer wire bends must be calibrated precisely: insufficient damping causes wire rattle, whereas excess causes sluggish key return.',
  },
  {
    id: 65,
    difficulty: 'hard',
    text: 'Interleaved scanning matrix topologies with surface-mount switching diodes isolate each electrical junction, enabling concurrent multi-key recognition without ghosting.',
  },
  {
    id: 66,
    difficulty: 'hard',
    text: 'Actuation force displacement curves illustrate the subtle transitional gradient between progressive spring compression and sudden tactile leaf collapse.',
  },
  {
    id: 67,
    difficulty: 'hard',
    text: 'Artisan keycap casting with vacuum-degassed epoxy resin requires precise curing temperatures to maintain strict stem cross-mount tolerances and prevent warping.',
  },
  {
    id: 68,
    difficulty: 'hard',
    text: 'Gasket mounting isolation strips decouple the plate assembly from the perimeter chassis, converting localized typing impacts into gentle vertical compliance.',
  },
  {
    id: 69,
    difficulty: 'hard',
    text: 'Typing with unyielding rigid posture induces micro-fatigue in the extensor digitorum muscles, degrading burst accuracy during sustained paragraph transcription.',
  },
  {
    id: 70,
    difficulty: 'hard',
    text: 'Optical switch switches utilize infrared light beam interruption to achieve sub-millisecond debounce times, completely bypassing mechanical contact degradation.',
  },
  {
    id: 71,
    difficulty: 'hard',
    text: 'The psychoacoustic phenomenon of tactile ASMR stems from the tight multimodal synchronization between fingertip haptic sensation and auditory frequency response.',
  },
  {
    id: 72,
    difficulty: 'hard',
    text: 'High-speed burst typing tests demand rapid eye tracking across upcoming phonetic clusters while maintaining an asynchronous buffered finger coordination queue.',
  },
  {
    id: 73,
    difficulty: 'hard',
    text: 'Plate-mounted switches exhibit higher vibrational coupling directly to the keyboard frame compared to PCB-mount 5-pin switches stabilized by solder anchors.',
  },
  {
    id: 74,
    difficulty: 'hard',
    text: 'The transition from linear downward displacement to elastic collision upon the bottom housing generates high-amplitude transient shockwaves captured by studio microphones.',
  },
  {
    id: 75,
    difficulty: 'hard',
    text: 'Fine-tuning dynamic sound synthesis algorithms involves convolving impulse response profiles with real-time multi-band biquad resonant filtering.',
  },

  // ==========================================
  // EXTREME HARD (25 Quotes) - Complex syntax, punctuation & code symbols
  // ==========================================
  {
    id: 76,
    difficulty: 'extreme',
    text: 'In ANSI 65% layouts, the alphanumeric matrix [Q-P, A-L, Z-M] requires concurrent 1000Hz USB polling, 0.05ms debounce thresholds, and zero scan-rate jitter for sub-frame execution.',
  },
  {
    id: 77,
    difficulty: 'extreme',
    text: 'Analyzing FFT spectrograms of custom lubricated switches reveals a 60dB SNR differential between high-frequency leaf chatter (3.2kHz-6.5kHz) and damped sub-bass bottom-out (120Hz-280Hz).',
  },
  {
    id: 78,
    difficulty: 'extreme',
    text: 'Synthesized DSP convolution kernels: H(z) = [b0 + b1*z^-1 + b2*z^-2] / [1 + a1*z^-1 + a2*z^-2] model acoustic room reverberation, cavity Helmholtz resonance, and polyurethane mat absorption.',
  },
  {
    id: 79,
    difficulty: 'extreme',
    text: 'Dynamic Rapid-Trigger calibration: f(x) = { actuate: x >= 0.4mm, reset: dx/dt < -0.05mm/ms } enables instantaneous key de-registration for competitive apex-tier gaming performance.',
  },
  {
    id: 80,
    difficulty: 'extreme',
    text: 'When configuring bespoke QMK firmware rules: #define TAPPING_TERM 175, #define PERMISSIVE_HOLD, and #define TAPPING_FORCE_HOLD resolve complex dual-role modifier conflicts under 150+ WPM.',
  },
  {
    id: 81,
    difficulty: 'extreme',
    text: 'void handle_matrix_scan(uint8_t row, uint8_t col) { if ((matrix_debounced[row] & (1 << col)) ^ (matrix_raw[row] & (1 << col))) debounce_timer[row][col] = timer_read(); }',
  },
  {
    id: 82,
    difficulty: 'extreme',
    text: 'The acoustic boundary value problem for sound pressure P(x,y,z,t) within an irregular CNC cavity obeys the Helmholtz wave equation nabla^2 P + (omega/c)^2 P = 0 with mixed Robin boundary conditions.',
  },
  {
    id: 83,
    difficulty: 'extreme',
    text: 'Krytox GPL-205 Grade 0 PTFE suspension grease (CF3-(CF(CF3)-CF2-O)n-CF2CF3) maintains zero shear thinning across -36 deg C to 204 deg C, ensuring permanent acoustic viscosity.',
  },
  {
    id: 84,
    difficulty: 'extreme',
    text: 'Actuation force F(x) = k1*x + k2*x^2 + Delta_F_tactile * exp(-((x - x_peak)/sigma)^2) quantitatively predicts the non-linear hysteretic dip before gold-plated contact closure.',
  },
  {
    id: 85,
    difficulty: 'extreme',
    text: 'To eliminate high-frequency acoustic rattle: apply 205g0 to stem rails, XHT-BDZ to wire ends, 0.5mm PE foam between PCB and switches, plus 3.0mm Poron beneath the hot-swap sockets!',
  },
  {
    id: 86,
    difficulty: 'extreme',
    text: 'struct KeySwitchAcoustics { float fundamentalHz; float harmonicDecay[8]; float mechanicalJitter; bool isStabilized; double roomReverbGain; };',
  },
  {
    id: 87,
    difficulty: 'extreme',
    text: 'Micro-benchmarking 200+ WPM transcription accuracy requires tokenizing trigrams, computing Damerau-Levenshtein edit distances, and isolating transposition error bursts under high cognitive load.',
  },
  {
    id: 88,
    difficulty: 'extreme',
    text: 'PBT-GF30 keycap formulations infused with 30% short glass-fiber reinforcement increase Young modulus to 9.5 GPa, shifting acoustic bottom-out transients into clean, sharp high-frequency clacks.',
  },
  {
    id: 89,
    difficulty: 'extreme',
    text: 'Quantum tunneling composite (QTC) pressure sensors exhibit exponential resistance drops R(P) approx R_0 * exp(-gamma * P), providing continuous analog depth sensing per switch location.',
  },
  {
    id: 90,
    difficulty: 'extreme',
    text: "Precision typing benchmark: Pack my box with five dozen liquor jugs; sphinx of black quartz, judge my vow; 1234567890! @#$%^&*()_+-=[]{}|;':,./<>?",
  },
  {
    id: 91,
    difficulty: 'extreme',
    text: "High-speed typing engines must handle race conditions where key-down events arrive interleaved: KeyDown('A', t=0.00ms) -> KeyDown('B', t=1.12ms) -> KeyUp('A', t=12.45ms) -> KeyUp('B', t=14.02ms).",
  },
  {
    id: 92,
    difficulty: 'extreme',
    text: 'Acoustic impedance mismatch between polycarbonate (Z_1 = 2.7 * 10^6 kg/(m^2*s)) and brass (Z_2 = 3.7 * 10^7 kg/(m^2*s)) dictates the transmission and reflection coefficients of stem impact energy.',
  },
  {
    id: 93,
    difficulty: 'extreme',
    text: 'In 5-pin PCB mount switches, the secondary plastic locating pins (dia = 1.70 +/- 0.05mm) prevent rotational torsion without requiring plate reinforcement, preserving gasket flex travel.',
  },
  {
    id: 94,
    difficulty: 'extreme',
    text: 'const computeWPM = (chars: number, errors: number, ms: number): number => Math.max(0, Math.round(((chars / 5) - errors) / (ms / 60000)));',
  },
  {
    id: 95,
    difficulty: 'extreme',
    text: 'Surface acoustic wave (SAW) resonators and piezoelectric transducers can map ultrasonic strain wave dispersion across the FR4 composite substrate during aggressive 180 WPM typing sprints.',
  },
  {
    id: 96,
    difficulty: 'extreme',
    text: 'The tactile sensation of buckling spring mechanisms relies on Euler buckling formula P_critical = (pi^2 * E * I) / (K * L)^2, triggering a sudden snapping collapse and hammer strike.',
  },
  {
    id: 97,
    difficulty: 'extreme',
    text: 'Thermodynamic dissipation of kinetic finger impact energy: E_k = 0.5 * m * v^2 converts into elastomeric gasket deformation, acoustic wave radiation, and localized thermal micro-loss.',
  },
  {
    id: 98,
    difficulty: 'extreme',
    text: 'typedef enum { SWITCH_LINEAR_POM, SWITCH_TACTILE_HP, SWITCH_CLICKBAR_BOX, SWITCH_MAGNETIC_HALL, SWITCH_OPTO_ANALOG } SwitchActuationType;',
  },
  {
    id: 99,
    difficulty: 'extreme',
    text: 'Biquad low-pass filter transfer function: H(s) = omega_0^2 / (s^2 + (omega_0/Q)*s + omega_0^2) filters mechanical key-chatter while preserving rich sub-bass thock harmonics in real-time.',
  },
  {
    id: 100,
    difficulty: 'extreme',
    text: 'Ultra-precision high-cadence transcription: The 1984 IBM Model-M (Part #1391406) featured buckling springs, removable keycaps, and a 2.5kg steel backplate that defined mechanical computing history!',
  },
];

