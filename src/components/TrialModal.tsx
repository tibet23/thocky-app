import React, { useState } from 'react';
import {
  Clock,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X,
  Check,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import {
  TrialState,
  subscribeYearlyPlan,
  activateLicenseKey,
  restorePurchases,
  cancelSubscription,
  YEARLY_PRICE_USD,
  YEARLY_PRICE_PERIOD,
  MONTHLY_EQUIVALENT_USD,
} from '../utils/trialManager';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  trialState: TrialState;
  onTrialStateUpdate: () => void;
}

export const TrialModal: React.FC<TrialModalProps> = ({
  isOpen,
  onClose,
  trialState,
  onTrialStateUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'pricing' | 'license' | 'manage'>('pricing');
  const [licenseInput, setLicenseInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Microsoft Store IAP Checkout Simulation
  const handleMicrosoftStoreSubscribe = () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    setTimeout(() => {
      setIsProcessing(false);
      subscribeYearlyPlan('windows_store', `MS-STORE-SUB-${Date.now().toString(36).toUpperCase()}`);
      setSuccessMessage('Microsoft Store purchase completed! 1-Year ThockyApp Pass unlocked.');
      onTrialStateUpdate();
    }, 600);
  };

  // License Key Activation
  const handleActivateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseInput.trim()) {
      setErrorMessage('Please enter your license key or order voucher.');
      return;
    }

    const success = activateLicenseKey(licenseInput);
    if (success) {
      setErrorMessage(null);
      setSuccessMessage('Yearly Subscription license successfully activated!');
      onTrialStateUpdate();
    } else {
      setErrorMessage('Invalid license key format. Keys must be at least 4 characters.');
    }
  };

  // Restore Purchases
  const handleRestore = () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsProcessing(false);
      const result = restorePurchases();
      setSuccessMessage(result.message);
      onTrialStateUpdate();
    }, 500);
  };

  // Cancel Subscription
  const handleCancelSub = () => {
    if (window.confirm('Are you sure you want to cancel your active yearly subscription auto-renewal?')) {
      cancelSubscription();
      setSuccessMessage('Subscription auto-renew cancelled. Returned to standard evaluation status.');
      onTrialStateUpdate();
    }
  };

  return (
    <div
      id="subscription-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="subscription-modal"
        className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden space-y-6 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          id="close-subscription-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
          aria-label="Close pricing and trial manager"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 pr-10">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${
              trialState.isSubscribed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/10'
                : trialState.isExpired
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-rose-500/10'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-amber-500/10'
            }`}
          >
            {trialState.isSubscribed ? (
              <ShieldCheck className="w-6 h-6" />
            ) : trialState.isExpired ? (
              <Lock className="w-6 h-6" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-black text-white tracking-tight">
                {trialState.isSubscribed
                  ? 'ThockyApp Yearly Subscription'
                  : trialState.isExpired
                  ? '1-Day Free Trial Ended — Subscribe to Continue'
                  : '1-Day Free Trial & Pricing'}
              </h2>
              <span
                className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  trialState.isSubscribed
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : trialState.isExpired
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {trialState.isSubscribed
                  ? 'Active ($3.99/yr)'
                  : trialState.isExpired
                  ? 'Expired'
                  : trialState.hoursRemaining > 0
                  ? `${trialState.hoursRemaining} Hours Trial Left`
                  : `${trialState.minutesRemaining} Minutes Trial Left`}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {trialState.isSubscribed
                ? `Active plan billed annually at ${YEARLY_PRICE_USD}/year. Renews on ${trialState.formattedSubscriptionRenewalDate}.`
                : trialState.isExpired
                ? `Your 1-day free evaluation has concluded. Subscribe for just ${YEARLY_PRICE_USD}/year (${MONTHLY_EQUIVALENT_USD}) to restore full acoustic synthesis.`
                : `Enjoy full access to all 6 acoustic switch engines during your 1-day trial. Subscribe anytime for ${YEARLY_PRICE_USD}/year.`}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 gap-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('pricing');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pricing'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{trialState.isSubscribed ? 'Plan Overview' : 'Microsoft Store Subscription'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('license');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'license'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Have a License Key?</span>
          </button>
          {trialState.isSubscribed && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('manage');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'manage'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Manage Subscription</span>
            </button>
          )}
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: Pricing & Subscription Options */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            {/* Trial Countdown Bar (If not yet subscribed) */}
            {!trialState.isSubscribed && (
              <div
                className={`p-4 rounded-2xl border ${
                  trialState.isExpired
                    ? 'bg-rose-950/30 border-rose-500/30'
                    : 'bg-slate-950/60 border-white/10'
                } space-y-2.5`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>1-Day Evaluation Status</span>
                  </div>
                  <div className="font-mono text-slate-400">
                    {trialState.isExpired ? (
                      <span className="text-rose-400 font-bold">Expired</span>
                    ) : (
                      <span>
                        {trialState.hoursRemaining > 0
                          ? `${trialState.hoursRemaining} hours left`
                          : `${trialState.minutesRemaining} minutes left`}{' '}
                        (Expires {trialState.formattedTrialExpirationDate})
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      trialState.isExpired
                        ? 'bg-rose-500'
                        : 'bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-500'
                    }`}
                    style={{ width: `${trialState.percentElapsed}%` }}
                  />
                </div>
              </div>
            )}

            {/* Pricing Hero Card */}
            <div className="relative rounded-3xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 p-6 border-2 border-indigo-500/40 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    Annual Pro Membership
                  </div>
                  <h3 className="text-xl font-black text-white">ThockyApp Full Access</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Continuous access to all mechanical switch sound engines & Windows background hooks
                  </p>
                </div>

                <div className="text-left sm:text-right bg-slate-950/60 sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-white/5 sm:border-0">
                  <div className="flex items-baseline gap-1 sm:justify-end">
                    <span className="text-3xl font-black text-white">{YEARLY_PRICE_USD}</span>
                    <span className="text-xs text-slate-400 font-bold">{YEARLY_PRICE_PERIOD}</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-bold">
                    Just {MONTHLY_EQUIVALENT_USD} • Billed annually
                  </div>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>All 6 Switch Sound Profiles (Creamy, Poppy, Clack, Thock, Buckling Spring, Ceramic)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>Zero-latency procedural DSP synthesis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>Windows Store & Desktop background typing hook</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>Full acoustic fine-tuning & spatial stereo panning</span>
                </div>
              </div>

              {/* Purchase Action Buttons */}
              {!trialState.isSubscribed ? (
                <div className="space-y-3 pt-3">
                  {/* Single Option: Microsoft Store In-App Purchase */}
                  <button
                    type="button"
                    id="subscribe-ms-store-btn"
                    disabled={isProcessing}
                    onClick={handleMicrosoftStoreSubscribe}
                    className="w-full px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4 text-indigo-200" />
                    <span>{isProcessing ? 'Connecting Microsoft Store...' : `Subscribe via Microsoft Store (${YEARLY_PRICE_USD}/year)`}</span>
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                      1-Day Free Trial included • Managed securely via Microsoft Store
                    </span>
                    <button
                      type="button"
                      onClick={handleRestore}
                      className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                    >
                      Restore existing purchase
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Yearly Plan Active:</strong> Full access enabled until {trialState.formattedSubscriptionRenewalDate}.
                    </span>
                  </div>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                    {trialState.subscriptionPrice}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: License Key Activation */}
        {activeTab === 'license' && (
          <form onSubmit={handleActivateKey} className="space-y-4">
            <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/10 space-y-1">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Activate Web or Store License
              </h4>
              <p className="text-xs text-slate-400">
                If you purchased a yearly subscription key from our website, Microsoft Store receipt, or promotional voucher, enter it below.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">License / Product Key</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="license-key-input"
                    type="text"
                    value={licenseInput}
                    onChange={(e) => setLicenseInput(e.target.value)}
                    placeholder="e.g. THOCKY-PRO-YEARLY-2026"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  id="activate-key-btn"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all shadow-md shadow-indigo-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Activate</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Need help with your order?</span>
              <button
                type="button"
                onClick={handleRestore}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline"
              >
                Restore Store Purchase
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: Manage Active Subscription */}
        {activeTab === 'manage' && trialState.isSubscribed && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Subscription Tier</span>
                <strong className="text-white font-bold">ThockyApp Annual Plan ({YEARLY_PRICE_USD}/year)</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Next Renewal Date</span>
                <span className="text-indigo-300 font-mono font-bold">{trialState.formattedSubscriptionRenewalDate}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Billing Platform</span>
                <span className="text-slate-200 capitalize font-medium">
                  {trialState.subscriptionSource === 'windows_store' ? 'Microsoft Store' : 'Web Direct'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Active License</span>
                <span className="text-slate-300 font-mono text-[11px]">{trialState.licenseKey || 'ACTIVE-PLAN'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                id="cancel-sub-btn"
                onClick={handleCancelSub}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 transition-all cursor-pointer"
              >
                Cancel Subscription Auto-Renewal
              </button>
              <button
                type="button"
                onClick={handleRestore}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Status</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
