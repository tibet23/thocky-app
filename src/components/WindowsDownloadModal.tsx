import React, { useState } from 'react';
import {
  Download,
  Laptop,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Lock,
} from 'lucide-react';
import { ThockyBrandIcon } from './ThockyBrandIcon';

interface WindowsDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  canInstallPwa: boolean;
  onTriggerPwaInstall: () => void;
}

export const WindowsDownloadModal: React.FC<WindowsDownloadModalProps> = ({
  isOpen,
  onClose,
  canInstallPwa,
  onTriggerPwaInstall,
}) => {
  const [hasClickedStore, setHasClickedStore] = useState(false);

  if (!isOpen) return null;

  // Microsoft Store App Protocol & Web PDP Link
  const MS_STORE_DEEP_LINK = 'ms-windows-store://pdp/?productid=9NBLGGH4NNS1&cid=website_landing_page';
  const MS_STORE_WEB_LINK = 'https://apps.microsoft.com/detail/thockyapp?cid=website_landing_page';

  const handleOpenStore = () => {
    setHasClickedStore(true);
    // Attempt deep link protocol first, then fallback to web
    try {
      window.location.href = MS_STORE_DEEP_LINK;
    } catch {
      window.open(MS_STORE_WEB_LINK, '_blank');
    }
  };

  return (
    <div
      id="windows-download-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-white space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 text-indigo-400 border border-indigo-500/40 shadow-lg shadow-indigo-500/10">
              <ThockyBrandIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="modal-title" className="text-lg font-black text-white">
                  Get Thocky for Windows
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official Microsoft Store certified app for Windows 10 & 11
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-white/10 hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Main Content: Microsoft Store */}
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-950 border border-indigo-500/40 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  Verified by Microsoft
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono">
                <span>1-Day Trial • $3.99/yr Pass</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base sm:text-lg font-black text-white">
                Download on Microsoft Store
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enjoy zero-latency mechanical switch typing acoustics across all Windows desktop applications (Word, VS Code, Discord, games) with silent background updates.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 py-1">
              <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>One-click safe installation</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Global OS keystroke audio</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automatic silent updates</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero latency audio engine</span>
              </div>
            </div>

            {/* Primary Call to Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                id="btn-open-ms-store"
                onClick={handleOpenStore}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-indigo-500/25 transition-all active:scale-98 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Get from Microsoft Store</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>

              {canInstallPwa && (
                <button
                  type="button"
                  onClick={onTriggerPwaInstall}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 transition-colors cursor-pointer"
                >
                  Open in App Window
                </button>
              )}
            </div>

            {hasClickedStore && (
              <div className="text-[11px] text-cyan-300/90 font-mono bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-500/20 text-center animate-in fade-in">
                Opening Microsoft Store product page...
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Microsoft Store Certified • Windows 10 / 11</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
