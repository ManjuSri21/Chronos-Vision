import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AudioPlayer = ({ intensity }: { intensity: number }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [sound, setSound] = useState<Howl | null>(null);

  useEffect(() => {
    const s = new Howl({
      src: ['https://cdn.pixabay.com/download/audio/2022/01/18/audio_61aadd309a.mp3?filename=ambient-scifi-12345.mp3'],
      loop: true,
      volume: 0,
      autoplay: false,
      html5: true, // Use HTML5 audio for potentially better streaming
    });
    setSound(s);

    return () => {
      s.unload();
    };
  }, []);

  useEffect(() => {
    if (sound && !isMuted) {
      // Scale volume with intensity (0.2 to 0.8)
      const targetVolume = 0.2 + (intensity * 0.6);
      sound.fade(sound.volume(), targetVolume, 1000);
    }
  }, [intensity, isMuted, sound]);

  const toggleMute = () => {
    if (!sound) return;
    if (isMuted) {
      if (!sound.playing()) {
        sound.play();
      }
      sound.fade(sound.volume(), 0.4, 1000);
    } else {
      sound.fade(sound.volume(), 0, 1000);
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
            Play Soundtrack
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
