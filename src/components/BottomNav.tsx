import React from 'react';
import { motion } from 'framer-motion';
import { Home, Users, Calendar, Phone, Bot } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { id: 'home', label: 'الرئيسية', icon: Home, path: '/' },
  { id: 'about', label: 'من نحن', icon: Users, path: '/about' },
  { id: 'booking', label: 'حجز', icon: Calendar, path: '/booking' },
  { id: 'contact', label: 'اتصل بنا', icon: Phone, path: '/contact' },
  { id: 'assistant', label: 'المساعد', icon: Bot, path: '/assistant' },
];

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 glass bg-background/90 border-t border-border safe-area-bottom"
    >
      <div className="container mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-300"
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  className={`p-2 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default BottomNav;
