/**
 * Electron & Tauri Desktop Bridge Interface
 * Exposes IPC channels, global keyboard hook listeners, tray controls,
 * and Microsoft Store IAP bridge commands.
 */

export interface DesktopRuntimeInfo {
  isDesktopRuntime: boolean;
  platform: 'electron' | 'tauri' | 'web';
  appVersion: string;
  isGlobalHookActive: boolean;
  isPackagedForStore: boolean;
  systemArchitecture: string;
}

declare global {
  interface Window {
    // Electron IPC Bridge
    electronAPI?: {
      onGlobalKeyDown: (callback: (data: { code: string; key: string }) => void) => () => void;
      onGlobalKeyUp: (callback: (data: { code: string; key: string }) => void) => () => void;
      toggleGlobalHook: (enable: boolean) => Promise<boolean>;
      isGlobalHookEnabled: () => Promise<boolean>;
      minimizeToTray: () => void;
      checkStoreLicense: () => Promise<{ isLicensed: boolean; expiration?: number }>;
      purchaseStorePass: () => Promise<{ success: boolean; licenseKey?: string }>;
    };
    // Tauri IPC Bridge
    __TAURI__?: {
      invoke: (cmd: string, args?: Record<string, any>) => Promise<any>;
      event: {
        listen: (event: string, handler: (event: any) => void) => Promise<() => void>;
      };
    };
  }
}

export function detectDesktopRuntime(): DesktopRuntimeInfo {
  const isElectron = typeof window !== 'undefined' && Boolean(window.electronAPI);
  const isTauri = typeof window !== 'undefined' && Boolean(window.__TAURI__);

  return {
    isDesktopRuntime: isElectron || isTauri,
    platform: isElectron ? 'electron' : isTauri ? 'tauri' : 'web',
    appVersion: '1.4.0',
    isGlobalHookActive: isElectron || isTauri,
    isPackagedForStore: true,
    systemArchitecture: 'x64 / ARM64 Windows',
  };
}

/**
 * Initializes global OS-wide keyboard hooks if running inside Electron or Tauri
 */
export function initDesktopGlobalHooks(
  onKeyTrigger: (code: string, key?: string) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  // 1. Electron global hook listener
  if (window.electronAPI?.onGlobalKeyDown) {
    const unsubscribe = window.electronAPI.onGlobalKeyDown((data) => {
      onKeyTrigger(data.code, data.key);
    });
    return unsubscribe;
  }

  // 2. Tauri global hook listener
  if (window.__TAURI__?.event?.listen) {
    let unlistenFn: (() => void) | null = null;
    window.__TAURI__.event
      .listen('global-key-down', (event: any) => {
        if (event.payload?.code) {
          onKeyTrigger(event.payload.code, event.payload.key);
        }
      })
      .then((unlisten) => {
        unlistenFn = unlisten;
      })
      .catch((err) => console.warn('Tauri global hook registration failed:', err));

    return () => {
      if (unlistenFn) unlistenFn();
    };
  }

  return () => {};
}
