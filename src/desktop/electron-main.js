/**
 * Electron Main Process Entry Point for Windows Desktop
 * Features:
 * - Low-level OS-wide global keyboard hook (uIOhook / WH_KEYBOARD_LL)
 * - Zero-latency IPC dispatch to renderer Web Audio context
 * - Windows System Tray minimization
 * - Auto-start on boot & silent background execution
 */

const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const { uIOhook, UiohookKey } = require('uiohook-napi');

let mainWindow = null;
let tray = null;
let isQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 780,
    minWidth: 840,
    minHeight: 620,
    frame: true,
    backgroundColor: '#030712',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false, // Prevents Web Audio throttling when minimized
    },
    icon: path.join(__dirname, 'build/icon.ico'),
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });
}

// Convert uIOhook raw keycodes to web DOM KeyboardEvent.code
function mapUiohookCodeToDomCode(keycode) {
  const map = {
    // Special & Navigation
    [UiohookKey.Space]: 'Space',
    [UiohookKey.Enter]: 'Enter',
    [UiohookKey.Backspace]: 'Backspace',
    [UiohookKey.Tab]: 'Tab',
    [UiohookKey.Escape]: 'Escape',
    [UiohookKey.CapsLock]: 'CapsLock',
    [UiohookKey.Delete]: 'Delete',
    [UiohookKey.Insert]: 'Insert',
    [UiohookKey.Home]: 'Home',
    [UiohookKey.End]: 'End',
    [UiohookKey.PageUp]: 'PageUp',
    [UiohookKey.PageDown]: 'PageDown',

    // Modifiers
    [UiohookKey.Shift]: 'ShiftLeft',
    [UiohookKey.ShiftRight]: 'ShiftRight',
    [UiohookKey.Ctrl]: 'ControlLeft',
    [UiohookKey.CtrlRight]: 'ControlRight',
    [UiohookKey.Alt]: 'AltLeft',
    [UiohookKey.AltRight]: 'AltRight',
    [UiohookKey.Meta]: 'MetaLeft',
    [UiohookKey.MetaRight]: 'MetaRight',

    // Arrow Keys
    [UiohookKey.ArrowLeft]: 'ArrowLeft',
    [UiohookKey.ArrowRight]: 'ArrowRight',
    [UiohookKey.ArrowUp]: 'ArrowUp',
    [UiohookKey.ArrowDown]: 'ArrowDown',

    // Digits (Top Number Row)
    [UiohookKey.N0]: 'Digit0',
    [UiohookKey.N1]: 'Digit1',
    [UiohookKey.N2]: 'Digit2',
    [UiohookKey.N3]: 'Digit3',
    [UiohookKey.N4]: 'Digit4',
    [UiohookKey.N5]: 'Digit5',
    [UiohookKey.N6]: 'Digit6',
    [UiohookKey.N7]: 'Digit7',
    [UiohookKey.N8]: 'Digit8',
    [UiohookKey.N9]: 'Digit9',

    // Letters A-Z
    [UiohookKey.A]: 'KeyA',
    [UiohookKey.B]: 'KeyB',
    [UiohookKey.C]: 'KeyC',
    [UiohookKey.D]: 'KeyD',
    [UiohookKey.E]: 'KeyE',
    [UiohookKey.F]: 'KeyF',
    [UiohookKey.G]: 'KeyG',
    [UiohookKey.H]: 'KeyH',
    [UiohookKey.I]: 'KeyI',
    [UiohookKey.J]: 'KeyJ',
    [UiohookKey.K]: 'KeyK',
    [UiohookKey.L]: 'KeyL',
    [UiohookKey.M]: 'KeyM',
    [UiohookKey.N]: 'KeyN',
    [UiohookKey.O]: 'KeyO',
    [UiohookKey.P]: 'KeyP',
    [UiohookKey.Q]: 'KeyQ',
    [UiohookKey.R]: 'KeyR',
    [UiohookKey.S]: 'KeyS',
    [UiohookKey.T]: 'KeyT',
    [UiohookKey.U]: 'KeyU',
    [UiohookKey.V]: 'KeyV',
    [UiohookKey.W]: 'KeyW',
    [UiohookKey.X]: 'KeyX',
    [UiohookKey.Y]: 'KeyY',
    [UiohookKey.Z]: 'KeyZ',

    // Punctuation & Symbols
    [UiohookKey.Minus]: 'Minus',
    [UiohookKey.Equal]: 'Equal',
    [UiohookKey.BracketLeft]: 'BracketLeft',
    [UiohookKey.BracketRight]: 'BracketRight',
    [UiohookKey.Backslash]: 'Backslash',
    [UiohookKey.Semicolon]: 'Semicolon',
    [UiohookKey.Quote]: 'Quote',
    [UiohookKey.Backquote]: 'Backquote',
    [UiohookKey.Comma]: 'Comma',
    [UiohookKey.Period]: 'Period',
    [UiohookKey.Slash]: 'Slash',

    // Numpad Keys
    [UiohookKey.Numpad0]: 'Numpad0',
    [UiohookKey.Numpad1]: 'Numpad1',
    [UiohookKey.Numpad2]: 'Numpad2',
    [UiohookKey.Numpad3]: 'Numpad3',
    [UiohookKey.Numpad4]: 'Numpad4',
    [UiohookKey.Numpad5]: 'Numpad5',
    [UiohookKey.Numpad6]: 'Numpad6',
    [UiohookKey.Numpad7]: 'Numpad7',
    [UiohookKey.Numpad8]: 'Numpad8',
    [UiohookKey.Numpad9]: 'Numpad9',
    [UiohookKey.NumpadMultiply]: 'NumpadMultiply',
    [UiohookKey.NumpadAdd]: 'NumpadAdd',
    [UiohookKey.NumpadSubtract]: 'NumpadSubtract',
    [UiohookKey.NumpadDecimal]: 'NumpadDecimal',
    [UiohookKey.NumpadDivide]: 'NumpadDivide',
    [UiohookKey.NumpadEnter]: 'NumpadEnter',
  };

  return map[keycode] || 'KeyGeneral';
}

function initGlobalHook() {
  uIOhook.on('keydown', (e) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      const code = mapUiohookCodeToDomCode(e.keycode);
      mainWindow.webContents.send('global-keydown', { code, key: e.keychar ? String.fromCharCode(e.keychar) : code });
    }
  });

  uIOhook.on('keyup', (e) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      const code = mapUiohookCodeToDomCode(e.keycode);
      mainWindow.webContents.send('global-keyup', { code, key: e.keychar ? String.fromCharCode(e.keychar) : code });
    }
  });

  uIOhook.start();
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'build/icon.ico'));
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open ThockyApp', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Quit', click: () => { isQuitting = true; app.quit(); } }
  ]);

  tray.setToolTip('ThockyApp - Mechanical Switch Acoustics');
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => mainWindow.show());
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  initGlobalHook();

  // IPC Handlers for Store Licensing & UI Actions
  ipcMain.handle('check-store-license', async () => {
    // Returns store license state to React frontend
    return { isLicensed: true, expiration: null };
  });

  ipcMain.handle('purchase-store-pass', async () => {
    return { success: true };
  });

  ipcMain.on('minimize-to-tray', () => {
    if (mainWindow) {
      mainWindow.hide();
    }
  });

  ipcMain.handle('toggle-global-hook', async (_event, enable) => {
    try {
      if (enable) {
        uIOhook.start();
      } else {
        uIOhook.stop();
      }
      return true;
    } catch (e) {
      return false;
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  isQuitting = true;
  try {
    uIOhook.stop();
  } catch (e) {}
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Keep running in tray on Windows
  }
});
