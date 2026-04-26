import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Leaf, Rocket, Globe, ChevronRight, RefreshCcw, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { getFuturePrediction } from '../services/gemini';
import { PredictionResponse } from '../types';

export const Section = ({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={cn("min-h-screen w-full flex flex-col items-center justify-center relative p-8", className)}>
    {children}
  </section>
);

export const Timeline = ({ progress }: { progress: number }) => {
  const years = [2025, 2030, 2040, 2050];
  const activeYearIndex = Math.min(Math.floor(progress * years.length), years.length - 1);
  
  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-4">
      <div className="h-64 w-[2px] bg-white/10 relative overflow-hidden rounded-full">
        <motion.div 
          className="absolute top-0 w-full timeline-gradient"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
      <div className="flex flex-col gap-8 items-start">
        {years.map((year, i) => (
          <div key={year} className="flex items-center gap-3 group translate-x-[-11px]">
            <div className={cn(
              "w-6 h-6 rounded-full border-2 transition-all duration-500 flex items-center justify-center bg-deep-space",
              i <= activeYearIndex ? "border-neon-cyan scale-110 shadow-[0_0_10px_rgba(0,242,255,0.5)]" : "border-white/20"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-500",
                i <= activeYearIndex ? "bg-neon-cyan" : "bg-white/20"
              )} />
            </div>
            <span className={cn(
              "text-xs font-mono transition-all duration-500 tracking-widest",
              i <= activeYearIndex ? "text-neon-cyan opacity-100" : "text-white/30 opacity-50"
            )}>
              {year}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PredictorQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      q: "How do you view economic growth?",
      options: ["Stability first", "Hyper-innovation", "Circular economy"]
    },
    {
      q: "Your stance on Biological AI integration?",
      options: ["Total rejection", "Human-centric assist", "Full symbiosis"]
    },
    {
      q: "The primary solution for Earth?",
      options: ["Geoengineering", "Rewilding", "Space Migration"]
    }
  ];

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      const res = await getFuturePrediction(newAnswers);
      setPrediction(res);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full glass-card p-8 neon-border-cyan">
      <AnimatePresence mode="wait">
        {!prediction && !loading && (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-2xl font-sans font-bold mb-6 text-neon-cyan">{questions[step].q}</h3>
            <div className="grid gap-4">
              {questions[step].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="p-4 text-left glass-card hover:bg-neon-cyan/20 transition-colors border-white/5 hover:border-neon-cyan/50 group"
                >
                  <span className="group-hover:translate-x-2 transition-transform inline-block">{opt}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {loading && (
          <motion.div key="loading" className="flex flex-col items-center gap-4 py-12">
            <RefreshCcw className="w-12 h-12 text-neon-cyan animate-spin" />
            <p className="font-mono text-sm tracking-widest animate-pulse">ANALYZING TEMPORAL VECTORS...</p>
          </motion.div>
        )}

        {prediction && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold font-sans flex items-center gap-2">
                <Sparkles className="text-neon-cyan" />
                Your 2050 Reality
              </h3>
              <div className="text-right">
                <span className="text-3xl font-mono font-bold text-neon-cyan">{prediction.impactScore}%</span>
                <p className="text-[10px] text-white/50 uppercase tracking-tighter">Congruence</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed italic border-l-2 border-neon-cyan pl-4">
              "{prediction.scenario}"
            </p>
            <div className="flex gap-2">
              {prediction.tags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-1 bg-neon-cyan/10 border border-neon-cyan/30 rounded-full font-mono">
                  #{tag}
                </span>
              ))}
            </div>
            <button 
              onClick={() => { setPrediction(null); setStep(0); setAnswers([]); }}
              className="mt-4 text-xs font-mono text-neon-cyan/50 hover:text-neon-cyan transition-colors"
            >
              GENERATE NEW TIMELINE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
