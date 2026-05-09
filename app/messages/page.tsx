'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft, MessageSquare, LogIn } from 'lucide-react';
import { toast } from 'sonner';

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const currentUser = auth?.user;
  const isAuthenticated = auth?.isAuthenticated;
  const isLoading = auth?.isLoading;
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return;

    const storedConversations = localStorage.getItem('beagvs_conversations');
    if (storedConversations) {
      const allConversations = JSON.parse(storedConversations);
      const userConversations = allConversations.filter((conv: any) =>
        conv.participants.includes(currentUser?.id)
      );
      setConversations(userConversations);
    }

    const userParam = searchParams.get('user');
    if (userParam && currentUser) {
      const users = JSON.parse(localStorage.getItem('beagvs_users') || '[]');
      const targetUser = users.find((u: any) => u.username === userParam);
      
      if (targetUser) {
        const storedConvs = localStorage.getItem('beagvs_conversations');
        let allConversations = storedConvs ? JSON.parse(storedConvs) : [];
        
        let existingConv = allConversations.find((conv: any) =>
          conv.participants.includes(currentUser.id) && conv.participants.includes(targetUser.id)
        );

        if (!existingConv) {
          existingConv = {
            id: `conv_${Date.now()}`,
            participants: [currentUser.id, targetUser.id],
            participantDetails: {
              [currentUser.id]: {
                username: currentUser.username,
                avatar: currentUser.avatar || currentUser.profilePicture,
              },
              [targetUser.id]: {
                username: targetUser.username,
                avatar: targetUser.avatar || targetUser.profilePicture,
              },
            },
            lastMessage: null,
            createdAt: new Date().toISOString(),
          };
          
          allConversations.push(existingConv);
          localStorage.setItem('beagvs_conversations', JSON.stringify(allConversations));
        }

        setSelectedConversation(existingConv);
        loadMessages(existingConv.id);
      }
    }
  }, [searchParams, currentUser, isAuthenticated, isLoading]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = (conversationId: string) => {
    const storedMessages = localStorage.getItem('beagvs_messages');
    if (storedMessages) {
      const allMessages = JSON.parse(storedMessages);
      const convMessages = allMessages.filter((msg: any) => msg.conversationId === conversationId);
      setMessages(convMessages);
    } else {
      setMessages([]);
    }
  };

  const sendMessage = () => {
    if (!messageText.trim() || !selectedConversation || !currentUser) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUser.id,
      senderUsername: currentUser.username,
      text: messageText,
      createdAt: new Date().toISOString(),
    };

    const storedMessages = localStorage.getItem('beagvs_messages');
    const allMessages = storedMessages ? JSON.parse(storedMessages) : [];
    allMessages.push(newMessage);
    localStorage.setItem('beagvs_messages', JSON.stringify(allMessages));

    const storedConversations = localStorage.getItem('beagvs_conversations');
    if (storedConversations) {
      const allConversations = JSON.parse(storedConversations);
      const updatedConversations = allConversations.map((conv: any) => {
        if (conv.id === selectedConversation.id) {
          return { ...conv, lastMessage: messageText, lastMessageAt: new Date().toISOString() };
        }
        return conv;
      });
      localStorage.setItem('beagvs_conversations', JSON.stringify(updatedConversations));
    }

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const getOtherParticipant = (conversation: any) => {
    const otherUserId = conversation.participants.find((id: string) => id !== currentUser?.id);
    return conversation.participantDetails?.[otherUserId];
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card className="p-12">
          <div className="text-center space-y-4">
            <MessageSquare className="h-16 w-16 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Sign In to View Messages</h2>
            <p className="text-muted-foreground">
              You need to be logged in to send and receive messages.
            </p>
            <Button onClick={auth?.login} size="lg" className="w-full">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button variant="outline" onClick={() => router.push('/')} className="w-full bg-transparent">
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Conversations List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.length === 0 ? (
                <div className="text-center py-10 px-4 space-y-2">
                  <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground opacity-40" />
                  <p className="text-muted-foreground text-sm">No conversations yet</p>
                  <p className="text-xs text-muted-foreground">
                    Start a conversation from a seller&apos;s profile or marketplace listing.
                  </p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const other = getOtherParticipant(conv);
                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setSelectedConversation(conv);
                        loadMessages(conv.id);
                      }}
                      className={`w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                        selectedConversation?.id === conv.id ? 'bg-muted' : ''
                      }`}
                    >
                      <Avatar>
                        <AvatarImage src={other?.avatar || `/placeholder.svg`} />
                        <AvatarFallback>{other?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <p className="font-semibold">{other?.username || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage || 'Start a conversation'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Messages Area */}
        <Card className="md:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={getOtherParticipant(selectedConversation)?.avatar || `/placeholder.svg`} />
                    <AvatarFallback>
                      {getOtherParticipant(selectedConversation)?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{getOtherParticipant(selectedConversation)?.username}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-96 overflow-y-auto mb-4 space-y-3">
                  {messages.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      No messages yet. Say hello!
                    </p>
                  )}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.senderId === currentUser?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm break-words">{msg.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button onClick={sendMessage} disabled={!messageText.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="h-full flex flex-col items-center justify-center py-20 space-y-3">
              <MessageSquare className="h-12 w-12 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground">Select a conversation to start messaging</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
