import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Send, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const botResponses: Record<string, string> = {
  'مرحبا': 'أهلاً وسهلاً بك! كيف يمكنني مساعدتك اليوم؟',
  'السلام عليكم': 'وعليكم السلام ورحمة الله وبركاته! كيف يمكنني خدمتك؟',
  'خدمات': 'نقدم العديد من الخدمات منها:\n• الدعاية والإعلان\n• التسويق الإلكتروني\n• إدارة الصفحات والمواقع\n• المونتاج\n• الحماية والأمان\n• الطباعة\n\nما الخدمة التي تهمك؟',
  'اسعار': 'أسعارنا تنافسية ومناسبة لجميع الميزانيات. للحصول على عرض سعر مخصص، يرجى التواصل معنا عبر واتساب على الرقم: 778215553',
  'تسويق': 'نقدم خدمات تسويق إلكتروني شاملة تشمل:\n• إدارة حملات السوشيال ميديا\n• الإعلانات المدفوعة\n• تحسين محركات البحث\n• التسويق بالمحتوى\n\nهل تريد معرفة المزيد؟',
  'دعاية': 'خدمات الدعاية والإعلان لدينا تشمل:\n• تصميم الشعارات والهوية البصرية\n• الإعلانات الرقمية\n• المطبوعات الدعائية\n• الفيديوهات الترويجية\n\nكيف يمكننا مساعدتك؟',
  'مونتاج': 'نقدم خدمات مونتاج فيديو احترافية:\n• مونتاج إعلاني\n• فيديوهات ترويجية\n• موشن جرافيك\n• تعديل الفيديوهات\n\nهل لديك مشروع معين؟',
  'حماية': 'خدمات الحماية والأمان تشمل:\n• حماية الحسابات\n• تأمين المواقع\n• استعادة الحسابات المخترقة\n• فحص الثغرات الأمنية\n\nهل تحتاج مساعدة في هذا المجال؟',
  'تواصل': 'يمكنك التواصل معنا عبر:\n📱 واتساب: 778215553\n📧 البريد: info@abdulhamid.com\n\nنحن متاحون على مدار الساعة لخدمتك!',
  'شكرا': 'عفواً! سعدنا بخدمتك. لا تتردد في التواصل معنا في أي وقت 😊',
};

const getResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  for (const [key, response] of Object.entries(botResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return 'شكراً لتواصلك معنا! للحصول على مساعدة متخصصة، يرجى التواصل مع فريقنا عبر واتساب على الرقم: 778215553\n\nيمكنك أيضاً سؤالي عن: الخدمات، الأسعار، التسويق، الدعاية، المونتاج، الحماية، أو التواصل';
};

const AssistantPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'مرحباً بك! أنا المساعد الذكي لـ منصة ابوكيان الرقمية. كيف يمكنني مساعدتك اليوم؟\n\nيمكنك سؤالي عن:\n• الخدمات المتاحة\n• الأسعار\n• التسويق الإلكتروني\n• الدعاية والإعلان\n• المونتاج\n• الحماية والأمان',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: getResponse(input),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="flex-1 pt-16 pb-20 flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border bg-card">
          <div className="container mx-auto max-w-lg flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-foreground">المساعد الذكي</h1>
              <p className="text-xs text-muted-foreground">متصل الآن</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-custom">
          <div className="container mx-auto max-w-lg space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl ${
                    message.isBot
                      ? 'bg-card border border-border rounded-tr-none'
                      : 'gradient-gold text-primary-foreground rounded-tl-none'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.isBot && (
                      <Bot className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    )}
                    <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-card border border-border rounded-2xl rounded-tr-none p-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-border bg-card">
          <div className="container mx-auto max-w-lg flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اكتب رسالتك..."
              className="flex-1 h-12 bg-secondary"
            />
            <Button
              onClick={handleSend}
              className="h-12 w-12 gradient-gold p-0"
              disabled={!input.trim()}
            >
              <Send className="w-5 h-5 text-primary-foreground" />
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AssistantPage;
