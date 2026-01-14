import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Button } from '@/components/ui/button';

const portfolioItems = [
  {
    id: 1,
    title: 'حملة إعلانية - مطعم الخليج',
    category: 'دعاية وإعلان',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 2,
    title: 'موقع إلكتروني - شركة التقنية',
    category: 'تصميم مواقع',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 3,
    title: 'هوية بصرية - متجر الأناقة',
    category: 'تصميم',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 4,
    title: 'فيديو ترويجي - شركة البناء',
    category: 'مونتاج',
    color: 'from-red-500 to-pink-600',
  },
  {
    id: 5,
    title: 'إدارة صفحات - مقهى الروائع',
    category: 'سوشيال ميديا',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 6,
    title: 'تطبيق موبايل - خدمات التوصيل',
    category: 'تطوير تطبيقات',
    color: 'from-indigo-500 to-blue-600',
  },
];

const PortfolioPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.open('https://wa.me/967778215553?text=مرحباً، أريد رؤية المزيد من أعمالكم', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            رجوع
          </Button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gradient-gold mb-2">معرض أعمالنا</h1>
            <p className="text-muted-foreground">نماذج من أحدث مشاريعنا وأعمالنا المميزة</p>
          </motion.div>

          {/* Portfolio Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          >
            {portfolioItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group relative aspect-square bg-card border border-border rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-80`} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-white text-xs mb-3">
                    {item.category}
                  </span>
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 ml-2" />
                    عرض التفاصيل
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-muted-foreground mb-4">
              هل تريد رؤية المزيد من أعمالنا؟
            </p>
            <Button
              onClick={openWhatsApp}
              className="gradient-gold text-primary-foreground h-12 px-8"
            >
              تواصل معنا
            </Button>
          </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default PortfolioPage;
