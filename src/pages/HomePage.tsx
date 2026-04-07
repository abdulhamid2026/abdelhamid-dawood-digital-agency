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
import LiveStreamPromoCard from '@/components/LiveStreamPromoCard';
import WifiPromoCard from '@/components/WifiPromoCard';
import PortfolioPromoCard from '@/components/PortfolioPromoCard';
import SocialIcons from '@/components/SocialIcons';
import FeaturedClientsSection from '@/components/FeaturedClientsSection';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const HomePage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { settings, isLoading } = useSiteSettings();

  const show = (key: string) => !settings[key] || settings[key] === 'true';

  return (
    <div className="min-h-screen bg-background">
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <HeroSlider />
          </motion.section>

          {show('show_news') && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <NewsTicker />
            </motion.section>
          )}

          {show('show_packages') && <PackagesPromoCard />}
          {show('show_apps') && <AppsPromoCard />}
          {show('show_livestream') && <LiveStreamPromoCard />}
          {show('show_wifi') && <WifiPromoCard />}
          {show('show_portfolio') && <PortfolioPromoCard />}

          {show('show_services') && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">خدماتنا</h2>
                <span className="text-sm text-muted-foreground">اختر الخدمة المطلوبة</span>
              </div>
              <ServiceGrid />
            </motion.section>
          )}

          {show('show_featured_clients') && <FeaturedClientsSection />}

          {show('show_social') && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-foreground mb-1">تابعنا على</h3>
              </div>
              <SocialIcons />
            </motion.section>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default HomePage;
