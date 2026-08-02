import React, { useState } from 'react';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import GuestGate from '@/components/GuestGate';

const GuestBlockedPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <main className="pt-24 pb-28 px-4">
        <div className="container mx-auto max-w-lg">
          <GuestGate
            title="هذا القسم متاح للأعضاء فقط"
            description="أنت تتصفح كزائر. أنشئ حسابك المجاني في منصة ابوكيان الرقمية لمشاهدة هذا القسم وكل الخدمات والمحتوى."
          />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default GuestBlockedPage;