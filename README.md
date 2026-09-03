# Thocky ⌨️🔊

> **Zero-latency mechanical keyboard acoustic simulator & live typing companion powered by Web Audio DSP synthesis.**

[![Microsoft Store](https://img.shields.io/badge/Microsoft_Store-Validated-0078D6?logo=windows)](https://partner.microsoft.com)
[![Platform](https://img.shields.io/badge/Platform-Windows_10%2F11-blue?logo=windows10)](https://www.microsoft.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Thocky brings the satisfying tactile acoustics of custom mechanical switches directly to any Windows setup. Rather than relying on laggy pre-recorded audio samples, Thocky uses real-time procedural Web Audio DSP (Digital Signal Processing) synthesis to model the physical acoustics of switch bottom-outs, top-out returns, stabilizer thock, and housing resonance with zero latency.

Published by **Maximus Labs** for **Windows PC (Microsoft Store)**.

---

## 💎 Pricing & Trial

| Plan | Price | Trial Period | Details |
|---|---|---|---|
| **1-Day Free Trial** | **$0.00** | 1 Day (24 Hours) | Full unrestricted access to all 6 switch sound engines, DSP tuning parameters, ambient audio mixing, and typing metrics upon first launch. |
| **Yearly Subscription** | **$3.99 / year** *(~$0.33/month)* | 1 Day Free Included | Continuous unrestricted access, system-wide Windows background keystroke hook, all future switch acoustic profiles, and desktop updates. Managed securely via the Microsoft Store. |

*Subscriptions and licensing are handled exclusively through the **Microsoft Store** In-App Purchase (IAP) system.*

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
  - Stereo spatial panning (left-to-right acoustic positioning based on physical keyboard layout).
  - Key-release return clack toggle, room reverb, and cafe background ambiance.

- **⌨️ Keystroke Visualizer & Typing Sandbox**
  - Interactive visual keyboard displaying active keypress highlights and acoustic wave pulses.
  - Live typing test suite featuring real-time WPM, accuracy calculation, and keystroke streaks.
  - Free typing scratchpad with instant audio feedback.

- **🪟 Windows Store & Desktop Background Typing Hook**
  - Official Microsoft Store AppX packaging by **Maximus Labs**.
  - Operates quietly in the Windows system tray with lightweight background execution.
  - System-wide global keyboard listener for mechanical switch sounds across Word, Discord, VS Code, and PC games.

---

## 🔒 Permissions & Capabilities (`runFullTrust`)

Thocky is packaged as a Win32 desktop application using the Microsoft Store bridge framework.

* **Capability:** `runFullTrust`
* **Purpose:** Required to execute low-level system operations, specifically registering local background keyboard listeners and managing low-latency native audio streams.
* **Privacy Assurance:** Thocky collects **zero telemetry, logs no keystrokes, and requires no external network connections.** All audio synthesis and keyboard hooks execute strictly offline on your local machine.

---

## 🛠️ Tech Stack

- **Desktop Framework**: [Electron](https://www.electronjs.org/) + `electron-builder`
- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Audio Engine**: [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) (Zero-latency procedural DSP synthesis)
- **Distribution**: Microsoft Partner Center (AppX / Win32)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- `npm` (or `pnpm` / `yarn`)

### Installation & Development

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/MaximusLabs/thocky.git](https://github.com/MaximusLabs/thocky.git)
   cd thocky

2. **Install dependencies:**
    ```bash
    npm install

3. **Start local development mode:**
    ```bash 
    npm install

4. **Build Windows AppX Store Package:**
    ```bash
    npm run build



## 📦 Windows AppX Identity Configuration

Configured for automated Windows packaging via `electron-builder` matching official Microsoft Partner Center credentials, including the required Store tile assets and background formatting:

```json
{
  "build": {
    "appId": "com.maximuslabs.thocky",
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
      "target": ["appx"],
      "icon": "build/icon.ico"
    },
    "appx": {
      "identityName": "MaximusLabs.Thocky",
      "publisher": "CN=F9B66ACC-8C31-4360-AE8B-D0A167BA1200",
      "publisherDisplayName": "Maximus Labs",
      "applicationId": "Thocky",
      "backgroundColor": "#000000",
      "showNameOnTiles": true
    }
  }
}
```

## 📄 License & Privacy

* **Privacy Policy:** [Thocky Privacy Policy](https://gist.github.com/tibet23/4b1472050b1db7935f3e299888c45830)
* **License:** Copyright © 2026 **Maximus Labs**. All rights reserved. Available under the [MIT License](LICENSE).
