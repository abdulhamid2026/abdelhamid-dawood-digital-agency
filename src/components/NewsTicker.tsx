import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import { newsItems } from '@/data/services';

const NewsTicker: React.FC = () => {
  return (
    <div className="w-full bg-secondary/50 border border-border rounded-xl overflow-hidden">
      <div className="flex items-center">
        {/* Icon */}
        <div className="flex-shrink-0 px-4 py-3 bg-primary">
          <Newspaper className="w-5 h-5 text-primary-foreground" />
        </div>

        {/* Ticker */}
        <div className="flex-1 overflow-hidden py-3">
          <motion.div
            className="flex gap-16 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...newsItems, ...newsItems].map((news, index) => (
              <span
                key={index}
                className="text-muted-foreground inline-flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {news}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
