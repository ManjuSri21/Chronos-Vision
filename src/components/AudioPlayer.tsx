import React, { useState, useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AudioPlayer = ({ intensity }: { intensity: number }) => {
  const [isMuted, setIsMuted] = useState(true);
  const soundRef = useRef<Howl | null>(null);
  const localBgSrc = `${import.meta.env.BASE_URL}bg.mp3`;

  // 🔥 GLOBAL AUDIO UNLOCK
  useEffect(() => {
    const unlock = async () => {
      try {
        if (Howler.ctx.state === 'suspended') {
          await Howler.ctx.resume();
        }
      } catch (e) {
        console.log("Unlock failed", e);
      }
    };

    window.addEventListener("click", unlock, { once: true });
    return () => window.removeEventListener("click", unlock);
  }, []);

  // 🔹 Initialize sound
  useEffect(() => {
    const sound = new Howl({
      // Vite serves files in /public at BASE_URL (works in dev + prod subpaths)
      src: [localBgSrc],
      loop: true,
      volume: 0.7,
      html5: true,
      preload: true,
      onload: () => {
        console.log(`Audio successfully loaded from ${localBgSrc}`);
      },
      onloaderror: (id, err) => {
        console.warn("Local bg.mp3 not found or failed to load, trying fallback.", err);
        if (soundRef.current) {
          soundRef.current.unload();
          const fallback = new Howl({
            src: ['https://assets.mixkit.co/music/preview/mixkit-cinematic-mystery-dark-ambient-2.mp3'],
            loop: true,
            volume: 0.5,
            html5: true,
            onload: () => console.log("Fallback audio loaded")
          });
          soundRef.current = fallback;
        }
      }
    });

    soundRef.current = sound;

    return () => {
      if (soundRef.current) soundRef.current.unload();
    };
  }, []);

  // 🔹 Adjust volume based on intensity
  useEffect(() => {
    const sound = soundRef.current;
    if (!sound || isMuted) return;

    const targetVolume = Math.min(1, 0.5 + intensity * 0.5);
    sound.volume(targetVolume); 
  }, [intensity, isMuted]);

  // 🔹 Toggle sound
  const toggleMute = async () => {
    const sound = soundRef.current;
    if (!sound) return;

    try {
      if (Howler.ctx.state === 'suspended') {
        await Howler.ctx.resume();
      }
    } catch (e) {
      console.log("Resume failed:", e);
    }

    if (isMuted) {
      sound.play();      
      sound.volume(0.7);  
    } else {
      sound.stop();       
    }

    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-2">
      
      <AnimatePresence>
        {isMuted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/20 rounded-md text-[10px] font-mono text-neon-cyan tracking-widest uppercase mb-2"
          >
            Click to Enable Sound 🔊
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={toggleMute}
        className="p-4 glass-card bg-black/40 border-neon-cyan/30 hover:border-neon-cyan/60 transition-all group relative overflow-hidden"
      >
        <div className="relative z-10">
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-white/50" />
          ) : (
            <Volume2 className="w-6 h-6 text-neon-cyan animate-pulse" />
          )}
        </div>

        {!isMuted && (
          <motion.div
            className="absolute inset-0 bg-neon-cyan/5"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  );
};
