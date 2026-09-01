/**
 * Electron Preload Bridge Script
 * Exposes safe, isolated IPC methods to the renderer window
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onGlobalKeyDown: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on('global-keydown', handler);
    return () => ipcRenderer.removeListener('global-keydown', handler);
  },
  onGlobalKeyUp: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on('global-keyup', handler);
    return () => ipcRenderer.removeListener('global-keyup', handler);
  },
  minimizeToTray: () => ipcRenderer.send('minimize-to-tray'),
  checkStoreLicense: async () => ipcRenderer.invoke('check-store-license'),
  purchaseStorePass: async () => ipcRenderer.invoke('purchase-store-pass'),
});
