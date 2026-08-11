import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, Mail, Lock, User, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSiteSettings } from '@/hooks/useSiteSettings';

type AuthMode = 'login' | 'register';

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login, register, loginAsGuest } = useAuth();
  const { toast } = useToast();
  const { getSetting, getBool } = useSiteSettings();

  const logoUrl = getSetting('site_logo_url');
  const logoSize = parseInt(getSetting('auth_logo_size', '80'), 10) || 80;
  const authTitle = getSetting('auth_title') || getSetting('site_name');
  const authSubtitle = getSetting('auth_subtitle');
  const showRegister = getBool('auth_show_register');
  const showGuest = getBool('auth_show_guest');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result: { error: string | null };
      if (mode === 'login') {
        result = await login(email, password);
      } else {
        result = await register(name, email, password);
      }

      if (result.error) {
        toast({
          title: 'خطأ',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: mode === 'login' ? 'تم تسجيل الدخول' : 'تم إنشاء الحساب',
          description: mode === 'login' ? `مرحباً بك في ${authTitle}` : 'يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب',
        });
        if (mode === 'login') {
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    toast({
      title: 'مرحباً بك',
      description: 'تم الدخول كزائر',
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'var(--gradient-glow)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          {getBool('auth_show_logo') && (
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="mx-auto mb-4 flex items-center justify-center"
              style={{ width: logoSize, height: logoSize }}
            >
              {logoUrl ? (
                <img src={logoUrl} alt={authTitle} className="w-full h-full rounded-2xl object-contain shadow-elevated" />
              ) : (
                <div className="w-full h-full rounded-2xl gradient-gold flex items-center justify-center shadow-elevated">
                  <Sparkles style={{ width: logoSize / 2, height: logoSize / 2 }} className="text-primary-foreground" />
                </div>
              )}
            </motion.div>
          )}
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">{authTitle}</h1>
          {authSubtitle && <p className="text-muted-foreground">{authSubtitle}</p>}
        </div>

        {/* Auth Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-elevated">
          {/* Mode Tabs */}
          <div className="flex bg-secondary rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                mode === 'login'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              تسجيل الدخول
            </button>
            {showRegister && <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                mode === 'register'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              حساب جديد
            </button>}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="الاسم الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pr-10 h-12 bg-secondary border-border"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10 h-12 bg-secondary border-border"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 pl-10 h-12 bg-secondary border-border"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 gradient-gold text-primary-foreground font-bold text-lg"
              disabled={isLoading}
            >
              {isLoading ? 'جاري...' : mode === 'login' ? getSetting('auth_login_button_text', 'دخول') : getSetting('auth_register_button_text', 'إنشاء حساب')}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-sm">أو</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {showGuest && (
            <Button variant="outline" className="w-full h-12" onClick={handleGuest}>
              الدخول كضيف
            </Button>
          )}

          {getSetting('auth_footer_text') && (
            <p className="text-center text-xs text-muted-foreground mt-4">{getSetting('auth_footer_text')}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
