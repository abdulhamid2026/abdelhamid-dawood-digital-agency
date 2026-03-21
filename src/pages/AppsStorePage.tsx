import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Shield, Download, Star, MessageCircle, Users, Share2, Smartphone, Palette, Video, Scissors, Wrench, Calculator, Clock, FileText, QrCode, Wifi } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AppItem {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  size: string;
  rating: number;
  downloads: string;
  color: string;
}

const socialApps: AppItem[] = [
  { name: 'واتساب الذهبي', description: 'نسخة معدلة بمميزات إضافية وحماية متقدمة', icon: MessageCircle, size: '45 MB', rating: 4.8, downloads: '10K+', color: 'from-yellow-500 to-amber-600' },
  { name: 'واتساب الأزرق', description: 'نسخة مميزة بثيمات احترافية وخصوصية عالية', icon: MessageCircle, size: '42 MB', rating: 4.7, downloads: '8K+', color: 'from-blue-500 to-blue-700' },
  { name: 'انستجرام برو', description: 'مميزات إضافية لتحميل الصور والفيديوهات', icon: Share2, size: '38 MB', rating: 4.6, downloads: '5K+', color: 'from-pink-500 to-purple-600' },
  { name: 'تيليجرام بلس', description: 'نسخة محسنة بمميزات متقدمة وحماية أقوى', icon: Users, size: '35 MB', rating: 4.9, downloads: '12K+', color: 'from-sky-400 to-blue-600' },
];

const toolsApps: AppItem[] = [
  { name: 'ماسح QR احترافي', description: 'أسرع ماسح باركود مع حفظ السجل', icon: QrCode, size: '8 MB', rating: 4.5, downloads: '3K+', color: 'from-slate-600 to-slate-800' },
  { name: 'مدير الملفات', description: 'إدارة ملفاتك بسهولة وأمان تام', icon: FileText, size: '12 MB', rating: 4.4, downloads: '4K+', color: 'from-orange-500 to-red-600' },
  { name: 'الآلة الحاسبة المتقدمة', description: 'حاسبة علمية ومالية متعددة الوظائف', icon: Calculator, size: '5 MB', rating: 4.3, downloads: '2K+', color: 'from-emerald-500 to-green-700' },
  { name: 'اختبار سرعة النت', description: 'قياس دقيق لسرعة الإنترنت', icon: Wifi, size: '6 MB', rating: 4.6, downloads: '6K+', color: 'from-violet-500 to-purple-700' },
];

const designApps: AppItem[] = [
  { name: 'محرر الصور برو', description: 'أدوات تعديل احترافية بفلاتر مميزة', icon: Palette, size: '55 MB', rating: 4.7, downloads: '7K+', color: 'from-pink-500 to-rose-600' },
  { name: 'صانع الفيديو', description: 'إنشاء وتحرير الفيديوهات باحترافية', icon: Video, size: '68 MB', rating: 4.8, downloads: '9K+', color: 'from-red-500 to-orange-600' },
  { name: 'مصمم الشعارات', description: 'تصميم شعارات وبطاقات بسهولة', icon: Scissors, size: '30 MB', rating: 4.5, downloads: '4K+', color: 'from-indigo-500 to-blue-600' },
  { name: 'محرر الريلز', description: 'إنشاء ريلز وستوريز احترافية', icon: Clock, size: '48 MB', rating: 4.6, downloads: '5K+', color: 'from-amber-500 to-yellow-600' },
];

const AppCard: React.FC<{ app: AppItem; index: number }> = ({ app, index }) => {
  const Icon = app.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-sm">{app.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{app.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-xs text-muted-foreground">{app.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">{app.size}</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{app.downloads}</Badge>
          </div>
        </div>
      </div>
      <Button
        size="sm"
        className="w-full mt-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs h-9"
      >
        <Download className="w-3.5 h-3.5 ml-1" />
        تحميل مجاني
      </Button>
    </motion.div>
  );
};

const AppsStorePage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 p-6 text-center"
          >
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
            <div className="relative z-10">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="inline-block mb-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-9 h-9 text-white" fill="currentColor">
                    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
                  </svg>
                </div>
              </motion.div>
              <h1 className="text-2xl font-bold text-white mb-1">متجر تطبيقاتنا</h1>
              <p className="text-white/80 text-sm">برمجة وتطوير عبدالحميد داوؤد</p>
              <div className="flex items-center justify-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <Shield className="w-3.5 h-3.5" />
                  <span>تطبيقات آمنة 100%</span>
                </div>
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل مباشر</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Categories Tabs */}
          <Tabs defaultValue="social" dir="rtl" className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-12 rounded-xl bg-muted/50">
              <TabsTrigger value="social" className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
                <MessageCircle className="w-3.5 h-3.5 ml-1" />
                التواصل
              </TabsTrigger>
              <TabsTrigger value="tools" className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
                <Wrench className="w-3.5 h-3.5 ml-1" />
                الأدوات
              </TabsTrigger>
              <TabsTrigger value="design" className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
                <Palette className="w-3.5 h-3.5 ml-1" />
                التصاميم
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="social" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {socialApps.map((app, i) => <AppCard key={app.name} app={app} index={i} />)}
                </div>
              </TabsContent>

              <TabsContent value="tools" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {toolsApps.map((app, i) => <AppCard key={app.name} app={app} index={i} />)}
                </div>
              </TabsContent>

              <TabsContent value="design" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {designApps.map((app, i) => <AppCard key={app.name} app={app} index={i} />)}
                </div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-foreground text-sm">جميع التطبيقات آمنة ومحمية</h3>
            </div>
            <p className="text-xs text-muted-foreground">تم فحص جميع التطبيقات والتأكد من خلوها من أي برمجيات ضارة</p>
          </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AppsStorePage;
