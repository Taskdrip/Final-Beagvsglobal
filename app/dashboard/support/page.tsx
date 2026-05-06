"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

interface Ticket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: Date;
  messages: {
    id: string;
    sender: 'user' | 'admin';
    message: string;
    timestamp: Date;
  }[];
}

export default function SupportPage() {
  const { user, isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const stored = localStorage.getItem('support_tickets');
      if (stored) {
        try {
          const allTickets = JSON.parse(stored);
          const userTickets = allTickets.filter((t: Ticket) => t.userId === user.id);
          setTickets(userTickets);
        } catch (e) {
          console.error('[v0] Error loading tickets:', e);
        }
      }
    }
  }, [user]);

  if (!isAuthenticated) {
    redirect('/');
  }

  const handleCreateTicket = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const newTicket: Ticket = {
      id: `ticket_${Date.now()}`,
      userId: user!.id,
      subject,
      message,
      status: 'open',
      createdAt: new Date(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: 'user',
          message,
          timestamp: new Date(),
        }
      ],
    };

    const allTickets = [...tickets, newTicket];
    setTickets(allTickets);

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('support_tickets');
      const existingTickets = stored ? JSON.parse(stored) : [];
      localStorage.setItem('support_tickets', JSON.stringify([...existingTickets, newTicket]));
    }

    setSubject('');
    setMessage('');
    toast.success('Support ticket created! Admin will respond soon.');
  };

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user' as const,
      message: replyMessage,
      timestamp: new Date(),
    };

    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
    };

    const updatedTickets = tickets.map(t => 
      t.id === selectedTicket.id ? updatedTicket : t
    );

    setTickets(updatedTickets);
    setSelectedTicket(updatedTicket);

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('support_tickets');
      if (stored) {
        const allTickets = JSON.parse(stored);
        const updated = allTickets.map((t: Ticket) =>
          t.id === selectedTicket.id ? updatedTicket : t
        );
        localStorage.setItem('support_tickets', JSON.stringify(updated));
      }
    }

    setReplyMessage('');
    toast.success('Message sent');
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Support Center</h1>
        <p className="text-muted-foreground">
          Create tickets and chat with admin for help
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Create New Ticket */}
        <Card>
          <CardHeader>
            <CardTitle>Create Support Ticket</CardTitle>
            <CardDescription>
              Need help? Create a ticket and our admin will respond
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Describe your issue..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
              />
            </div>
            <Button onClick={handleCreateTicket} className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </CardContent>
        </Card>

        {/* Ticket List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Tickets</CardTitle>
            <CardDescription>
              View and manage your support tickets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tickets.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No tickets yet</p>
              </div>
            ) : (
              tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 break-words">{ticket.subject}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 break-words">
                          {ticket.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'}>
                        {ticket.status === 'open' ? 'Open' : 'Resolved'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ticket Chat Dialog */}
      {selectedTicket && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{selectedTicket.subject}</CardTitle>
                <CardDescription>
                  Ticket #{selectedTicket.id.slice(-8)}
                </CardDescription>
              </div>
              <Badge variant={selectedTicket.status === 'open' ? 'default' : 'secondary'}>
                {selectedTicket.status === 'open' ? 'Open' : 'Resolved'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="max-h-96 overflow-y-auto space-y-3 p-4 bg-muted rounded-lg">
              {selectedTicket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {msg.sender === 'user' ? user?.username.charAt(0).toUpperCase() : 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-semibold">
                        {msg.sender === 'user' ? 'You' : 'Admin'}
                      </span>
                    </div>
                    <p className="text-sm break-words">{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            {selectedTicket.status === 'open' && (
              <div className="flex gap-2">
                <Input
                  placeholder="Type your reply..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                />
                <Button onClick={handleSendReply}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
