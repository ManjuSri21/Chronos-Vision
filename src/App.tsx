import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { GlobeScene } from './components/Globe';
import { Section, Timeline, PredictorQuiz } from './components/Sections';
import { AudioPlayer } from './components/AudioPlayer';
import { Brain, Leaf, Rocket, Globe as GlobeIcon, ChevronDown, Zap, Monitor, Space as SpaceIcon } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHopeMode, setIsHopeMode] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Preloading sequence
  React.useEffect(() => {
    setTimeout(() => setIsLoaded(true), 2500);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-deep-space flex flex-col items-center justify-center gap-6"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-full border-2 border-neon-cyan/20 border-t-neon-cyan shadow-[0_0_20px_rgba(0,242,255,0.3)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <GlobeIcon className="w-8 h-8 text-neon-cyan animate-pulse" />
              </div>
            </motion.div>
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-sans tracking-[0.5em] font-light">INITIALIZING FUTURE</h2>
              <div className="flex gap-1 mt-2">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1 h-1 bg-neon-cyan rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GlobeScene scrollYProgress={scrollYProgress.get()} isHopeMode={isHopeMode} />
      <Timeline progress={scrollYProgress.get()} />
      <AudioPlayer intensity={scrollYProgress.get()} />

      {/* Main Content */}
      <main className="relative z-10">
        
        {/* HERO - 2025 */}
        <Section id="present" className="h-[120vh]">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center"
          >
          <span className="mono text-[10px] text-neon-cyan tracking-[0.4em] mb-8 block neon-glow uppercase">Present Horizon / 2025</span>
          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter leading-none mb-12">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">THE FUTURE</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple neon-glow">IS BEING BUILT</span>
          </h1>
          <p className="max-w-xs mx-auto text-xs font-light tracking-[0.2em] uppercase text-slate-400 leading-relaxed mb-24">
            The future isn't coming...<br/>it's being built right now.
          </p>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-24 flex flex-col items-center gap-2 text-white/50"
            >
              <p className="text-[10px] font-mono tracking-widest">SCROLL TO ENTER 2030</p>
              <ChevronDown className="w-5 h-5 text-neon-cyan" />
            </motion.div>
          </motion.div>
        </Section>

      {/* 2030 - NEAR FUTURE */}
      <Section id="2030" className="px-12">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="md:col-span-12 lg:col-span-5 space-y-10"
          >
            <div>
              <h2 className="mono text-[10px] text-neon-blue tracking-[0.4em] mb-4">Near Horizon / 2030</h2>
              <h3 className="text-6xl font-black italic tracking-tighter leading-none text-white mb-6">
                Age of <span className="text-neon-blue neon-glow">Intelligence</span>
              </h3>
            </div>
            
            <p className="text-sm leading-relaxed text-slate-300 max-w-sm">
              By 2030, AI has moved from the screen to the cellular level. <span className="text-neon-blue">Digital neural networks</span> optimize human existence in real-time.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="glass p-5 rounded-2xl border-neon-blue/20">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Brain className="w-3 h-3 text-neon-blue" /> AI Doctors
                </p>
                <p className="text-xs leading-relaxed text-slate-300">Errors reduced by <span className="text-neon-blue">92%</span> through hyper-personalized bio-modules.</p>
              </div>
              <div className="glass p-5 rounded-2xl border-neon-blue/20">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-neon-blue" /> Smart Grid
                </p>
                <p className="text-xs leading-relaxed text-slate-300">Urban environments reach <span className="text-neon-blue">Net Zero</span> efficiency via neural nodes.</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="md:col-span-12 lg:col-span-7 relative h-[500px] w-full glass rounded-3xl overflow-hidden border border-slate-800 flex items-center justify-center group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/10 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxmaWx0ZXIgaWQ9Im4iPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIuOCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iLjMiLz48L3N2Zz4=')] opacity-5" />
            <Monitor className="w-24 h-24 text-neon-blue/50 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between border-t border-white/5 pt-4">
              <span className="mono text-[10px] text-neon-blue">Streaming data...</span>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-neon-blue/30 rounded-full" />)}
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* 2050 - FAR FUTURE */}
      <Section id="2050" className="pt-32 pb-64">
        <div className="max-w-6xl w-full text-center mb-32">
           <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mono text-[10px] text-neon-purple tracking-[0.4em] mb-12 block neon-glow uppercase"
          >
            Far Horizon / 2050
          </motion.div>
          <h2 className="text-7xl md:text-9xl font-black italic leading-none mb-16 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
            THE <span className="text-neon-purple neon-glow">DIVERGENCE</span>
          </h2>
          
          {/* Mode Toggle */}
          <div className="flex items-center justify-center gap-12 mb-40">
            <div className={cn("transition-all duration-700 flex flex-col items-center", !isHopeMode && "opacity-20 blur-md grayscale")}>
              <Leaf className="w-10 h-10 text-emerald-400 mb-4" />
              <p className="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase">Hope</p>
            </div>
            
            <button 
              onClick={() => setIsHopeMode(!isHopeMode)}
              className="w-24 h-12 glass rounded-full p-1.5 relative flex items-center transition-all duration-500 hover:scale-110"
            >
              <div className={cn(
                "absolute inset-0 transition-colors duration-500 rounded-full",
                isHopeMode ? "bg-emerald-500/10" : "bg-red-500/10"
              )} />
              <motion.div 
                className={cn(
                  "w-9 h-9 rounded-full z-10 shadow-[0_0_15px_rgba(34,211,238,0.3)]",
                  isHopeMode ? "bg-emerald-400" : "bg-red-500"
                )}
                animate={{ x: isHopeMode ? 0 : 48 }}
              />
            </button>

            <div className={cn("transition-all duration-700 flex flex-col items-center", isHopeMode && "opacity-20 blur-md grayscale")}>
              <Zap className="w-10 h-10 text-red-500 mb-4" />
              <p className="text-[10px] font-bold tracking-[0.3em] text-red-500 uppercase">Collapse</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="glass p-10 rounded-3xl border-neon-purple/20 space-y-6 hover:translate-y-[-10px] transition-all duration-500">
              <Brain className="w-12 h-12 text-neon-purple mx-auto opacity-50" />
              <h4 className="text-xl font-black italic tracking-tight uppercase">Human 2.0</h4>
              <p className="text-[11px] leading-relaxed text-slate-400 uppercase tracking-widest">Brain-computer interfaces allow neural connectivity for 60% of humanity.</p>
            </div>
            <div className="glass p-10 rounded-3xl border-neon-purple/20 space-y-6 hover:translate-y-[-10px] transition-all duration-500">
              <Rocket className="w-12 h-12 text-neon-purple mx-auto opacity-50" />
              <h4 className="text-xl font-black italic tracking-tight uppercase">Base Genesis</h4>
              <p className="text-[11px] leading-relaxed text-slate-400 uppercase tracking-widest">First sustainable Mars base housing 5,000 citizens by mid-century.</p>
            </div>
            <div className="glass p-10 rounded-3xl border-neon-purple/20 space-y-6 hover:translate-y-[-10px] transition-all duration-500">
              <Monitor className="w-12 h-12 text-neon-purple mx-auto opacity-50" />
              <h4 className="text-xl font-black italic tracking-tight uppercase">Digital Echo</h4>
              <p className="text-[11px] leading-relaxed text-slate-400 uppercase tracking-widest">Digital avatars now possess full legal rights and property status.</p>
            </div>
          </div>
        </div>
      </Section>

        {/* AI Predictor */}
        <Section id="predictor" className="pb-48 bg-gradient-to-t from-deep-space via-transparent to-transparent">
          <div className="max-w-4xl w-full flex flex-col items-center gap-16">
            <div className="text-center space-y-6">
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase">The Tomorrow <span className="text-neon-cyan neon-glow">Matrix</span></h2>
              <p className="mono text-[10px] text-slate-500 tracking-[0.5em] uppercase">Temporal Probability Engine v4.0</p>
            </div>
            <PredictorQuiz />
          </div>
        </Section>

        {/* Footer */}
        <footer className="relative h-96 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/40" />
          <div className="relative z-10 text-center space-y-8">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full border-2 border-neon-cyan flex items-center justify-center">
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]" />
              </div>
              <h3 className="mono text-sm tracking-[0.8em] font-black italic text-white/40">VISION 2050</h3>
            </div>
            <div className="flex gap-16 border-t border-white/5 pt-12 px-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-tighter mono">Automation</span>
                <span className="text-2xl font-black text-neon-cyan mono italic shadow-neon-cyan/20">88.4%</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-tighter mono">Temp Dev</span>
                <span className="text-2xl font-black text-orange-400 mono italic">+1.8°C</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-tighter mono">Off-World</span>
                <span className="text-2xl font-black text-neon-purple mono italic">0.06%</span>
              </div>
            </div>
            <p className="text-[10px] font-mono text-slate-700 tracking-widest mt-12">SYSTEMS ACTIVE. ALL TIMELINES SECURED.</p>
          </div>
        </footer>
      </main>

      <div className="stars-container" />
    </div>
  );
}
