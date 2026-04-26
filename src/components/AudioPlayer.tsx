import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

export const AudioPlayer = ({ intensity }: { intensity: number }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [sound, setSound] = useState<Howl | null>(null);

  useEffect(() => {
    const s = new Howl({
      src: ['https://assets.mixkit.co/music/preview/mixkit-futuristic-space-cinematic-99.mp3'],
      loop: true,
      volume: 0,
      autoplay: false,
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
    if (isMuted) {
      sound?.play();
      sound?.fade(0, 0.4, 1000);
    } else {
      sound?.fade(sound.volume(), 0, 1000);
      setTimeout(() => sound?.pause(), 1000);
    }
    setIsMuted(!isMuted);
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={toggleMute}
      className="fixed bottom-8 right-8 z-50 p-4 glass-card bg-black/40 border-neon-cyan/30 hover:border-neon-cyan/60 transition-all group"
    >
      <div className="relative">
        <div className="absolute -inset-2 bg-neon-cyan/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white/50" />
        ) : (
          <Volume2 className="w-6 h-6 text-neon-cyan animate-pulse" />
        )}
      </div>
    </motion.button>
  );
};
