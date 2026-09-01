import React, { useState } from 'react';
import {
  PenTool,
  Timer,
  RotateCcw,
  Award,
  Flame,
  ChevronRight,
  ChevronLeft,
  Shuffle,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SwitchProfileId } from '../types';
import { SWITCH_PROFILES } from '../audio/profiles';
import { SPEED_CHALLENGE_QUOTES } from '../data/quotes';

interface TypingSandboxProps {
  currentProfileId: SwitchProfileId;
  onSimulateKeyPress: (key: string, code: string) => void;
  onRegisterKeystroke: () => void;
  isTrialExpired?: boolean;
  onOpenTrialModal?: () => void;
}

export const TypingSandbox: React.FC<TypingSandboxProps> = ({
  currentProfileId,
  onRegisterKeystroke,
  isTrialExpired = false,
  onOpenTrialModal,
}) => {
  const [activeTab, setActiveTab] = useState<'free' | 'test'>('free');

  // Free Mode State
  const [freeText, setFreeText] = useState('');

  // Speed Test State
  const [testTextIndex, setTestTextIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const profile = SWITCH_PROFILES[currentProfileId] || SWITCH_PROFILES.thocky;
  const currentQuote = SPEED_CHALLENGE_QUOTES[testTextIndex] || SPEED_CHALLENGE_QUOTES[0];
  const targetText = currentQuote.text;

  // Handle typing test input
  const handleTestInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (isFinished) return;

    if (!startTime && val.length === 1) {
      setStartTime(Date.now());
    }

    setUserInput(val);
    onRegisterKeystroke();

    // Compute accuracy
    let correctChars = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetText[i]) {
        correctChars++;
      }
    }
    const acc = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
    setAccuracy(acc);

    // Check completion
    if (val.length >= targetText.length) {
      const timeElapsedMin = (Date.now() - (startTime || Date.now())) / 60000;
      const wordCount = targetText.split(/\s+/).length;
      const calculatedWpm = timeElapsedMin > 0 ? Math.round(wordCount / timeElapsedMin) : 0;
      
      setWpm(calculatedWpm);
      setIsFinished(true);

      // Trigger victory confetti on test completion
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'],
        });
      } catch {
        // Fallback silently if confetti canvas context is restricted
      }
    }
  };

  const resetTest = () => {
    setUserInput('');
    setStartTime(null);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
  };

  const nextTestQuote = () => {
    setTestTextIndex((prev) => (prev + 1) % SPEED_CHALLENGE_QUOTES.length);
    resetTest();
  };

  const prevTestQuote = () => {
    setTestTextIndex((prev) => (prev - 1 + SPEED_CHALLENGE_QUOTES.length) % SPEED_CHALLENGE_QUOTES.length);
    resetTest();
  };

  const randomTestQuote = () => {
    const randomIndex = Math.floor(Math.random() * SPEED_CHALLENGE_QUOTES.length);
    setTestTextIndex(randomIndex);
    resetTest();
  };

  return (
    <div id="typing-sandbox-panel" className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-7 backdrop-blur-md shadow-2xl space-y-5 relative overflow-hidden">
      {isTrialExpired && (
        <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shadow-lg shadow-rose-500/10">
            <Lock className="w-6 h-6" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-base font-black text-white">1-Day Free Trial Concluded</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Typing sandbox, speed metrics, and real-time acoustic feedback are locked. Subscribe for $3.99/year to unlock full access.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenTrialModal}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-500/30 transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            Open Trial & License Manager
          </button>
        </div>
      )}

      {/* Tab Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            id="tab-free-typing"
            onClick={() => setActiveTab('free')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'free'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 border-white/5 bg-slate-950/40 hover:bg-slate-800'
            }`}
          >
            <PenTool className="w-4 h-4 text-amber-400" />
            <span>Free ASMR Notepad</span>
          </button>

          <button
            type="button"
            id="tab-speed-test"
            onClick={() => setActiveTab('test')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'test'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 border-white/5 bg-slate-950/40 hover:bg-slate-800'
            }`}
          >
            <Timer className="w-4 h-4 text-cyan-400" />
            <span>Speed Challenge</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
          <span>Active Profile:</span>
          <span className="font-bold uppercase tracking-wider" style={{ color: profile.accentColor }}>
            {profile.name}
          </span>
        </div>
      </div>

      {/* 1. Free Mode ASMR Notepad */}
      {activeTab === 'free' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
            <span className="font-medium">Type freely to experience real-time mechanical acoustics and zero latency:</span>
            <button
              type="button"
              onClick={() => setFreeText('')}
              className="text-slate-400 hover:text-indigo-400 font-semibold underline text-xs transition-colors cursor-pointer"
            >
              Clear text
            </button>
          </div>

          <textarea
            id="free-typing-textarea"
            rows={5}
            value={freeText}
            onChange={(e) => {
              setFreeText(e.target.value);
              onRegisterKeystroke();
            }}
            placeholder="Start typing on your keyboard... Listen to the creamy, thocky, clacky acoustics through your speakers as you write."
            className="w-full bg-slate-950/90 border border-white/10 rounded-2xl p-4 text-slate-100 placeholder-slate-500 font-mono text-sm leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all resize-none shadow-inner"
            aria-label="Free typing ASMR notepad"
          />

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono flex-wrap gap-2">
            <span>
              Characters: <strong className="text-slate-200">{freeText.length}</strong> | Words:{' '}
              <strong className="text-slate-200">{freeText.trim() ? freeText.trim().split(/\s+/).length : 0}</strong>
            </span>
            <span className="text-emerald-400 font-bold">Zero Audio Latency Active</span>
          </div>
        </div>
      )}

      {/* 2. Speed Challenge Mode */}
      {activeTab === 'test' && (
        <div className="space-y-4">
          {/* Quote Header Navigation (Counter + Prev / Next / Random) */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-200 font-bold">
                Quote {testTextIndex + 1} / {SPEED_CHALLENGE_QUOTES.length}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-semibold uppercase tracking-wider">
                {currentQuote.difficulty}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prevTestQuote}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="Previous Quote"
                aria-label="Previous Quote"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={randomTestQuote}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-white/10 transition-colors text-xs font-semibold cursor-pointer"
                title="Random Quote"
                aria-label="Random Quote"
              >
                <Shuffle className="w-3 h-3 text-cyan-400" />
                <span>Random</span>
              </button>
              <button
                type="button"
                onClick={nextTestQuote}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="Next Quote"
                aria-label="Next Quote"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Reference Quote Display with Real-time Character Highlighting */}
          <div
            id="speed-challenge-quote-display"
            className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 font-mono text-sm leading-relaxed select-none overflow-hidden"
          >
            {targetText.split('').map((char, index) => {
              let colorClass = 'text-slate-500';
              let bgClass = '';

              if (index < userInput.length) {
                if (userInput[index] === char) {
                  colorClass = 'text-emerald-400 font-semibold';
                } else {
                  colorClass = 'text-rose-400 font-semibold';
                  bgClass = 'bg-rose-500/20 rounded';
                }
              } else if (index === userInput.length) {
                bgClass = 'bg-indigo-500/40 text-white rounded animate-pulse underline';
              }

              return (
                <span key={index} className={`${colorClass} ${bgClass} transition-colors duration-75`}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* User Input Area */}
          <textarea
            id="speed-challenge-input"
            rows={3}
            value={userInput}
            onChange={handleTestInputChange}
            disabled={isFinished}
            placeholder={isFinished ? "Great job! Click 'Next Quote' or 'Reset' to test again." : "Type the text above as fast as you can..."}
            className={`w-full bg-slate-950/90 border rounded-2xl p-4 text-slate-100 font-mono text-sm leading-relaxed focus:outline-none transition-all resize-none shadow-inner ${
              isFinished ? 'border-emerald-500/80 bg-emerald-950/20' : 'border-white/10 focus:border-cyan-400'
            }`}
            aria-label="Speed test input"
          />

          {/* Live Speed & Accuracy Results */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-white/5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-slate-400">WPM:</span>
                <span className="text-amber-300 font-bold text-sm">{wpm}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-white/5">
                <Award className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400">Accuracy:</span>
                <span className="text-cyan-300 font-bold text-sm">{accuracy}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="reset-test-btn"
                onClick={resetTest}
                className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-white/10 transition-colors font-bold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                id="next-quote-btn"
                onClick={nextTestQuote}
                className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors font-bold shadow-sm cursor-pointer"
              >
                <span>Next Quote</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
