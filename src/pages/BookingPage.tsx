import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, User, MessageSquare, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { services } from '@/data/services';

const BookingPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const text = `*طلب حجز خدمة*%0A%0Aالاسم: ${name}%0Aالهاتف: ${phone}%0Aالخدمة: ${service}%0Aالتفاصيل: ${message}`;
    window.open(`https://wa.me/967778215553?text=${text}`, '_blank');
    
    toast({
      title: 'تم الإرسال',
      description: 'سيتم التواصل معك قريباً',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-lg">
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-gold flex items-center justify-center">
              <Calendar className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">حجز الخدمات</h1>
            <p className="text-muted-foreground">احجز خدمتك الآن وسنتواصل معك</p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                الاسم الكامل
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="أدخل اسمك"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pr-10 h-12 bg-secondary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                رقم الهاتف
              </label>
              <div className="relative">
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="رقم الواتساب"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pr-10 h-12 bg-secondary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                الخدمة المطلوبة
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full h-12 px-4 bg-secondary border border-border rounded-lg text-foreground"
                required
              >
                <option value="">اختر الخدمة</option>
                {services.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                تفاصيل إضافية
              </label>
              <div className="relative">
                <MessageSquare className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                <Textarea
                  placeholder="اكتب تفاصيل طلبك..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="pr-10 min-h-24 bg-secondary"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 gradient-gold text-primary-foreground font-bold"
            >
              <Send className="w-5 h-5 ml-2" />
              إرسال الطلب عبر واتساب
            </Button>
          </motion.form>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default BookingPage;
