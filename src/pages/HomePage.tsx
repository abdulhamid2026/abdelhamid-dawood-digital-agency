import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import HeroSlider from '@/components/HeroSlider';
import NewsTicker from '@/components/NewsTicker';
import ServiceGrid from '@/components/ServiceGrid';
import PackagesPromoCard from '@/components/PackagesPromoCard';
import AppsPromoCard from '@/components/AppsPromoCard';
import SocialIcons from '@/components/SocialIcons';

const HomePage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <HeroSlider />
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <NewsTicker />
          </motion.section>

          <PackagesPromoCard />
          <AppsPromoCard />

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">خدماتنا</h2>
              <span className="text-sm text-muted-foreground">اختر الخدمة المطلوبة</span>
            </div>
            <ServiceGrid />
          </motion.section>

          {/* Social Icons */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-foreground mb-1">تابعنا على</h3>
            </div>
            <SocialIcons />
          </motion.section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default HomePage;
