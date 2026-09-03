# Thocky ⌨️🔊 (Standalone Prototype Branch)

> **Zero-latency mechanical keyboard acoustic simulator & live typing companion powered by Web Audio DSP synthesis and native global OS hooks.**

[![Build: NSIS](https://img.shields.io/badge/Build-NSIS_.exe-blue?logo=windows)](https://electron.build/)
[![Platform](https://img.shields.io/badge/Platform-Windows_10%2F11-blue?logo=windows10)](https://www.microsoft.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*Note: This branch contains the standalone `.exe` prototype of Thocky. It features a native C++ background keyboard listener via Electron IPC to allow keystroke audio synthesis even when the application is minimized or unfocused. For the strict sandboxed version, see the `main` branch (Microsoft Store AppX version).*

Thocky brings the satisfying tactile acoustics of custom mechanical switches directly to any Windows setup. Rather than relying on laggy pre-recorded audio samples, Thocky uses real-time procedural Web Audio DSP (Digital Signal Processing) synthesis to model the physical acoustics of switch bottom-outs, top-out returns, stabilizer thock, and housing resonance with zero latency.

---

## 💎 Pricing & Trial (Prototype)

| Plan | Price | Trial Period | Details |
|---|---|---|---|
| **1-Day Free Trial** | **$0.00** | 1 Day (24 Hours) | Full unrestricted access to all 6 switch sound engines, DSP tuning parameters, ambient audio mixing, and typing metrics upon first launch. |
| **Yearly Subscription** | **$3.99 / year** *(~$0.33/month)* | 1 Day Free Included | Continuous unrestricted access to the system-wide background keystroke hook and all future switch acoustic profiles. |

---

## ✨ Features

- **⚡ Zero-Latency Procedural Audio Engine**
  - Synthesized in real time using the Web Audio API (oscillators, biquad filters, dynamic envelope generators, and shaped noise bursts).
  - Realistic keydown bottom-out impact and snappy keyup top-out return clacks.

- **🎛️ 6 Iconic Switch & Acoustic Sound Profiles**
  1. **Creamy Linear** – Butter-smooth, lubed switch acoustic.
  2. **Marbly Poppy** – Bubbly, glass-marble pop with PE foam acoustic resonance.
  3. **Crisp Clack** – High-pitched, snappy polycarbonate plate bottom-out.
  4. **Deep Thock** – Low-frequency, heavy bass acoustic body with gasket housing thud.
  5. **Buckling Spring** *(Iconic Vintage)* – 1980s mainframe mechanical click with resonant steel spring harmonic ping.
  6. **Glass & Ceramic Pop** – Glazed ceramic keycaps on brass plate with crystal-clear high-definition chime.

- **🎚️ Live Acoustic DSP Tuning**
  - Master volume & pitch multiplier control.
  - Lube level modifier (adjusts acoustic dampening and high-frequency roll-off).
  - Spacebar stabilizer thock amplifier.
  - Organic micro-pitch jitter (subtle frequency variation per keystroke for humanized acoustics).

- **⌨️ Keystroke Visualizer & Typing Sandbox**
  - Interactive visual keyboard displaying active keypress highlights and acoustic wave pulses.
  - Live typing test suite featuring real-time WPM, accuracy calculation, and keystroke streaks.

- **🪟 Advanced Background Typing Hook (Electron IPC)**
  - System-wide global keyboard listener bypasses browser focus limitations.
  - Implements native C++ bindings (`node-global-key-listener`) to capture OS-level keystrokes.
  - Safely bridges global keystroke data to the React UI layer via secure Electron `ipcRenderer` channels.
  - Operates quietly in the Windows system tray across Word, Discord, VS Code, and PC games.

---

## 🔒 Security & Antivirus Notes

This standalone build implements a global keyboard hook to function in the background. 
* **Privacy Assurance:** Thocky collects **zero telemetry, logs no keystrokes, and requires no external network connections.** All audio synthesis and keyboard hooks execute strictly offline in local memory.
* **Developer Note:** During local builds, strict antivirus software (like Windows Defender) may flag the `WinKeyServer.exe` dependency as a false positive due to its C++ keystroke-listening nature. Add a folder exclusion in Windows Security to successfully compile the `.exe`.

---

## 🛠️ Tech Stack

- **Desktop Framework**: [Electron](https://www.electronjs.org/) + `electron-builder`
- **Native OS Bridge**: `node-global-key-listener` (C++ to Node.js)
- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Audio Engine**: [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- `npm` (or `pnpm` / `yarn`)

### Installation & Build Instructions

1. **Clone the repository (and switch to prototype branch):**
   ```bash
   git clone [https://github.com/MaximusLabs/thocky.git](https://github.com/MaximusLabs/thocky.git)
   cd thocky
   git checkout prototype-global-hook

2. **Install dependencies:**
    ```bash
    npm install

3. **Compile web assets:**
    ```bash 
    npm run build

4. **Package the Standalone Windows Installer (.exe):**
    ```bash
    npx electron-builder --win nsis

    //The compiled installer will be located in the dist-electron/ directory.



## 📦 Electron-Builder NSIS Configuration

Configured to build a standard Windows executable (.exe) utilizing relative paths for internal Vite asset routing:

```json
{
  "build": {
    "appId": "com.maximuslabs.thocky.standalone",
    "productName": "Thocky",
    "directories": {
      "output": "dist-electron",
      "buildResources": "build"
    },
    "files": [
      "dist/**/*",
      "main.js",
      "package.json"
    ],
    "win": {
      "target": ["nsis"],
      "icon": "build/icon.ico"
    }
  }
}
```

## 📄 License & Privacy

* **Privacy Policy:** [Thocky Privacy Policy](https://gist.github.com/tibet23/4b1472050b1db7935f3e299888c45830)
* **License:** Copyright © 2026 **Maximus Labs**. All rights reserved. Available under the [MIT License](LICENSE).