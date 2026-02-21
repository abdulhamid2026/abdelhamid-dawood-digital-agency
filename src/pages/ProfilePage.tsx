import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Save, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: 'خطأ', description: 'فشل في رفع الصورة', variant: 'destructive' });
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setAvatarUrl(publicUrl);

    // Update profile with avatar URL
    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('user_id', user.id);
    toast({ title: 'تم الرفع', description: 'تم تحديث الصورة الشخصية' });
    setIsUploading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({ name, email, avatar_url: avatarUrl })
      .eq('user_id', user.id);

    if (error) {
      toast({ title: 'خطأ', description: 'فشل في حفظ البيانات', variant: 'destructive' });
    } else {
      toast({ title: 'تم الحفظ', description: 'تم تحديث الملف الشخصي بنجاح' });
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-lg">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowRight className="w-4 h-4 ml-2" />رجوع
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-gold flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">الملف الشخصي</h1>
            <p className="text-muted-foreground">عرض وتعديل بياناتك الشخصية</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 space-y-6"
          >
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-primary/30">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="text-2xl">{name?.charAt(0) || 'م'}</AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full gradient-gold flex items-center justify-center text-primary-foreground shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>
              {isUploading && <p className="text-sm text-muted-foreground">جاري رفع الصورة...</p>}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">الاسم</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك الكامل" className="h-12 bg-secondary" />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">البريد الإلكتروني</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="بريدك الإلكتروني" className="h-12 bg-secondary" disabled />
            </div>

            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">معرف المستخدم</label>
              <Input value={user?.id || ''} className="h-12 bg-secondary text-muted-foreground" disabled />
            </div>

            <Button onClick={handleSave} disabled={isSaving} className="w-full h-12 gradient-gold text-primary-foreground font-bold">
              <Save className="w-5 h-5 ml-2" />
              {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
