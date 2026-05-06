"use client";

import React from "react"

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import type { ChatMessage } from '@/lib/database-types';

interface ChatDialogProps {
  listingId: string;
  sellerId: string;
  sellerName: string;
}

export function ChatDialog({ listingId, sellerId, sellerName }: ChatDialogProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Load chat messages
      loadMessages();
    }
  }, [isOpen, listingId]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    try {
      // Mock data - in production, fetch from API
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          listingId,
          senderId: sellerId,
          receiverId: user?.id || '',
          message: 'Hello! Thanks for your interest in this listing.',
          isRead: true,
          createdAt: new Date(Date.now() - 3600000),
        },
        {
          id: '2',
          listingId,
          senderId: user?.id || '',
          receiverId: sellerId,
          message: 'Hi! Is this item still available?',
          isRead: true,
          createdAt: new Date(Date.now() - 1800000),
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('[v0] Load messages error:', error);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !user) return;

    setIsSending(true);
    try {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        listingId,
        senderId: user.id,
        receiverId: sellerId,
        message: message.trim(),
        isRead: false,
        createdAt: new Date(),
      };

      console.log('[v0] Sending message:', newMessage);
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      toast.success('Message sent');
    } catch (error) {
      console.error('[v0] Send message error:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user || user.id === sellerId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <MessageCircle className="h-4 w-4" />
          Chat with Seller
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{sellerName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            {sellerName}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6" ref={scrollRef}>
          <div className="space-y-4 py-4">
            {messages.map((msg) => {
              const isOwn = msg.senderId === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${isOwn ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-2">
                      {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isSending}
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isSending}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
