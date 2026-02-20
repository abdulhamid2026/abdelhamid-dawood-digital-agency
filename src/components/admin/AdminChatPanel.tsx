import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAdminChat } from '@/hooks/useAdminChat';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const AdminChatPanel: React.FC = () => {
  const { user } = useAuth();
  const { chatUsers, messages, selectedUserId, setSelectedUserId, sendMessage, isLoading } = useAdminChat();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUserId) return;
    await sendMessage(selectedUserId, newMessage.trim());
    setNewMessage('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!selectedUserId) {
    return (
      <div className="space-y-4">
        {chatUsers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">لا توجد محادثات حالياً</p>
              <p className="text-xs text-muted-foreground mt-2">ستظهر المحادثات عندما يرسل المستخدمون رسائل</p>
            </CardContent>
          </Card>
        ) : (
          chatUsers.map(chatUser => (
            <Card
              key={chatUser.user_id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setSelectedUserId(chatUser.user_id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={chatUser.avatar_url || undefined} />
                    <AvatarFallback>{chatUser.name?.charAt(0) || 'م'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{chatUser.name}</h3>
                      {chatUser.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">{chatUser.unreadCount}</Badge>
                      )}
                    </div>
                    {chatUser.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">{chatUser.lastMessage}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  }

  const selectedUser = chatUsers.find(u => u.user_id === selectedUserId);

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardContent className="p-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedUserId(null)}>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarImage src={selectedUser?.avatar_url || undefined} />
            <AvatarFallback>{selectedUser?.name?.charAt(0) || 'م'}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground text-sm">{selectedUser?.name}</h3>
            <p className="text-xs text-muted-foreground">{selectedUser?.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] p-4">
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-2 ${
                    msg.sender_id === user?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-[10px] opacity-70 mt-1">
                      {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: ar })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="اكتب رسالتك..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!newMessage.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AdminChatPanel;
