import React, { useState } from 'react';
import {
  Laptop,
  CheckCircle2,
  Mail,
  ShieldCheck,
  ArrowRight,
  User,
  Gift,
} from 'lucide-react';
import { registerUser } from '../utils/authManager';
import { ThockyBrandIcon } from './ThockyBrandIcon';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [campaignId, setCampaignId] = useState('website_landing_page');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address to link your license.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    setTimeout(() => {
      // Register with exclusive microsoft_store installSource
      registerUser(email, name, 'microsoft_store', campaignId);
      setIsSubmitting(false);
      setStep(2);
    }, 450);
  };

  const handleFinish = () => {
    onComplete();
  };

  return (
    <div
      id="in-app-onboarding-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6">
        {step === 1 ? (
          <>
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 shadow-lg shadow-indigo-500/10 mb-1">
                <ThockyBrandIcon className="w-10 h-10" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Microsoft Store Windows Client</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Welcome to Thocky
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                Sign in or register your email to activate your <strong>1-Day Full Access Trial</strong> on this Windows device.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label htmlFor="onboarding-email" className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Customer Email Address (Required)</span>
                  </label>
                  <input
                    id="onboarding-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="onboarding-name" className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Display Name (Optional)</span>
                  </label>
                  <input
                    id="onboarding-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Value Props */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-950/70 p-3 rounded-2xl border border-white/5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>1-Day Trial Unlocked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Global Keystroke Hooks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Zero Latency Web Audio</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>$3.99/yr Pass Eligible</span>
                </div>
              </div>

              <button
                type="submit"
                id="btn-complete-onboarding-signup"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Registering Device...</span>
                ) : (
                  <>
                    <span>Activate 1-Day Trial & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Step 2: Success Confirmation */
          <div className="text-center space-y-5 py-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-xl shadow-emerald-500/20">
              <Gift className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-white">You're All Set!</h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                Account registered under <strong className="text-indigo-400">{email}</strong>. Your 1-day (24h) evaluation pass is now active on this device.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Account Email:</span>
                <span className="text-white font-bold">{email}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Trial Status:</span>
                <span className="text-emerald-400 font-bold">24-Hour Evaluation (Active)</span>
              </div>
            </div>

            <button
              type="button"
              id="btn-finish-onboarding"
              onClick={handleFinish}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Start Typing & Enjoy ASMR
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
