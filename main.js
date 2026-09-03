import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { GlobalKeyboardListener } from 'node-global-key-listener';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });


  win.loadFile(path.join(__dirname, 'dist', 'index.html'));

  const v = new GlobalKeyboardListener();

  const keyMap = {
    'SPACE': 'Space',
    'RETURN': 'Enter',
    'BACKSPACE': 'Backspace',
    'ESCAPE': 'Escape',
    'TAB': 'Tab',
    'LEFT SHIFT': 'ShiftLeft',
    'RIGHT SHIFT': 'ShiftRight',
    'LEFT CTRL': 'ControlLeft',
    'RIGHT CTRL': 'ControlRight',
    'LEFT ALT': 'AltLeft',
    'RIGHT ALT': 'AltRight',
    'UP': 'ArrowUp',
    'DOWN': 'ArrowDown',
    'LEFT': 'ArrowLeft',
    'RIGHT': 'ArrowRight'
  };

  v.addListener(function (e, down) {
    let webCode = e.name;

    if (/^[A-Z]$/.test(e.name)) {
      webCode = `Key${e.name}`;
    } else if (/^[0-9]$/.test(e.name)) {
      webCode = `Digit${e.name}`;
    } else if (keyMap[e.name]) {
      webCode = keyMap[e.name];
    }

    if (e.state === 'DOWN') {
      win.webContents.send('global-keydown', webCode);
    } else if (e.state === 'UP') {
      win.webContents.send('global-keyup', webCode);
    }

  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});