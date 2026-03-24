import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { sliderItems } from '@/data/services';

const HeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { activeSlides, isLoading } = useHeroSlides();

  const items = activeSlides.length > 0
    ? activeSlides.map(s => ({
        id: s.id, title: s.title, description: s.description || '',
        gradient: s.gradient, image_url: (s as any).image_url || null,
      }))
    : sliderItems.map(s => ({ ...s, image_url: null }));

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  useEffect(() => {
    if (currentIndex >= items.length && items.length > 0) setCurrentIndex(0);
  }, [items.length, currentIndex]);

  if (items.length === 0) return null;

  const goToSlide = (index: number) => setCurrentIndex(index);
  const nextSlide = () => setCurrentIndex(prev => (prev + 1) % items.length);
  const prevSlide = () => setCurrentIndex(prev => (prev - 1 + items.length) % items.length);

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 bg-gradient-to-br ${currentItem?.gradient} border border-border rounded-2xl`}
        >
          <div className="absolute inset-0 flex items-center p-6">
            {/* Image/Icon on the side */}
            {currentItem?.image_url && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                className="hidden sm:flex flex-shrink-0 ml-4">
                <img src={currentItem.image_url} alt="" className="w-28 h-28 object-contain rounded-xl drop-shadow-lg" />
              </motion.div>
            )}
            <div className={`flex flex-col ${currentItem?.image_url ? 'items-start text-right' : 'items-center text-center w-full'} justify-center`}>
              <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold text-foreground mb-3"
              >{currentItem?.title}</motion.h2>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                className="text-muted-foreground max-w-md text-sm"
              >{currentItem?.description}</motion.p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <Button variant="ghost" size="icon" onClick={prevSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/70 text-foreground">
        <ChevronRight className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={nextSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/70 text-foreground">
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button key={index} onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'w-6 bg-primary' : 'bg-muted-foreground/50 hover:bg-muted-foreground'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
