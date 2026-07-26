import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { getSetting, getBool } = useSiteSettings();

  const duration = parseInt(getSetting('splash_duration', '5000'), 10) || 5000;
  const logoUrl = getSetting('site_logo_url');
  const logoSize = parseInt(getSetting('splash_logo_size', '112'), 10) || 112;
  const title = getSetting('splash_title') || getSetting('site_name');
  const subtitle = getSetting('splash_subtitle') || getSetting('site_tagline');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const splashTimer = setTimeout(() => onComplete(), duration);
    return () => { clearInterval(timer); clearTimeout(splashTimer); };
  }, [onComplete, duration]);

  const formatTime = (date: Date) => date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formatDate = (date: Date) => date.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden platform-glow">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: 'var(--gradient-glow)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {getBool('splash_show_logo') && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'backOut' }}
            className="relative z-10 mb-8"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={title}
                style={{ width: logoSize, height: logoSize }}
                className="rounded-3xl object-contain shadow-elevated"
              />
            ) : (
              <div
                style={{ width: logoSize, height: logoSize }}
                className="rounded-3xl gradient-gold flex items-center justify-center shadow-elevated"
              >
                <Sparkles style={{ width: logoSize / 2, height: logoSize / 2 }} className="text-primary-foreground" />
              </div>
            )}
          </motion.div>
        )}

        {title && (
          <motion.h1
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4 text-center px-4"
          >{title}</motion.h1>
        )}

        {subtitle && (
          <motion.p
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground text-center max-w-md px-4 mb-8"
          >{subtitle}</motion.p>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-primary text-lg">{getSetting('splash_welcome', 'مرحباً بك')}</p>
          <p className="text-muted-foreground">{getSetting('splash_welcome_sub', '')}</p>
        </motion.div>

        {getBool('splash_show_time') && (
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }}
            className="text-center glass bg-card/50 rounded-2xl px-8 py-4 border border-border"
          >
            <p className="text-3xl font-bold text-primary mb-2">{formatTime(currentTime)}</p>
            <p className="text-muted-foreground">{formatDate(currentTime)}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-12 flex items-center gap-2"
        >
          {[0, 0.2, 0.4].map(d => (
            <motion.div key={d} className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: d }} />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
