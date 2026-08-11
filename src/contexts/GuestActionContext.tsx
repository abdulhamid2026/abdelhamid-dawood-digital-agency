import React, { createContext, useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, UserPlus, LogIn, ShieldCheck, Gift, Rocket, Sparkles } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface GuestActionOptions {
  title?: string;
  description?: string;
}

interface GuestActionContextType {
  /** Runs the action for members. For guests it opens the registration invite and returns false. */
  requireAccount: (action?: () => void, options?: GuestActionOptions) => boolean;
  openInvite: (options?: GuestActionOptions) => void;
}

const GuestActionContext = createContext<GuestActionContextType | undefined>(undefined);

const perks = [
  { icon: Rocket, text: 'الوصول الكامل لكل الخدمات والطلبات' },
  { icon: ShieldCheck, text: 'متابعة طلباتك ومراسلة الإدارة' },
  { icon: Gift, text: 'نقاط ومكافآت نظام الإحالة' },
];

export const GuestActionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<GuestActionOptions>({});

  const openInvite = useCallback((options?: GuestActionOptions) => {
    setOpts(options || {});
    setOpen(true);
  }, []);

  const requireAccount = useCallback(
    (action?: () => void, options?: GuestActionOptions) => {
      if (!user) {
        openInvite(options);
        return false;
      }
      action?.();
      return true;
    },
    [user, openInvite]
  );

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <GuestActionContext.Provider value={{ requireAccount, openInvite }}>
      {children}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm p-0 overflow-hidden border-primary/25">
          <div className="relative">
            <div className="absolute inset-0 opacity-70" style={{ background: 'var(--gradient-glow)' }} />
            <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative flex flex-col items-center text-center p-6"
            >
              <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center shadow-elevated mb-4">
                <Lock className="w-7 h-7 text-primary-foreground" />
              </div>

              <span className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/15 text-primary border border-primary/30">
                <Sparkles className="w-3 h-3" /> وضع الزائر
              </span>

              <h3 className="text-lg font-black text-gradient-gold mb-2">
                {opts.title || 'هذه الخدمة تتطلب حساباً'}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {opts.description ||
                  'أنت تتصفح كزائر. سجّل حسابك المجاني في منصة ابوكيان الرقمية للحصول على الخدمة كاملة ومتابعة طلباتك ومراسلة الإدارة.'}
              </p>

              <div className="grid gap-2 mt-4 w-full">
                {perks.map((p) => (
                  <div key={p.text} className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2">
                    <p.icon className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-xs font-medium text-foreground text-right">{p.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 mt-5 w-full">
                <Button onClick={() => go('/auth?mode=register')} className="h-11 gradient-gold text-primary-foreground font-bold">
                  <UserPlus className="w-4 h-4 ml-2" /> إنشاء حساب مجاني
                </Button>
                <Button variant="outline" onClick={() => go('/auth?mode=login')} className="h-11 font-bold border-primary/30">
                  <LogIn className="w-4 h-4 ml-2" /> تسجيل الدخول
                </Button>
                <button onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground mt-1">
                  متابعة التصفح كزائر
                </button>
              </div>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </GuestActionContext.Provider>
  );
};

export const useGuestAction = () => {
  const ctx = useContext(GuestActionContext);
  if (!ctx) throw new Error('useGuestAction must be used within GuestActionProvider');
  return ctx;
};
