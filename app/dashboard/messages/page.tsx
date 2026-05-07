"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Send, Search, User, Circle, Paperclip, ImageIcon, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  files?: string[];
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  userId: string;
  username: string;
  profilePicture?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  online?: boolean;
}

export default function MessagesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Load conversations and messages
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      loadConversations();
    }
  }, [user]);

  // Handle pre-selected user from URL parameter
  useEffect(() => {
    const username = searchParams?.get('user');
    if (username && conversations.length > 0 && !selectedUser) {
      const userConvo = conversations.find(c => c.username === username);
      if (userConvo) {
        setSelectedUser(userConvo);
      } else {
        // User not in following list, add them temporarily
        const stored = localStorage.getItem('beagvs_users');
        if (stored) {
          const allUsers = JSON.parse(stored);
          const targetUser = allUsers.find((u: any) => u.username === username);
          if (targetUser && targetUser.id !== user?.id) {
            const newConvo: Conversation = {
              userId: targetUser.id,
              username: targetUser.username,
              profilePicture: targetUser.profilePicture,
              unreadCount: 0,
            };
            setConversations(prev => [newConvo, ...prev]);
            setSelectedUser(newConvo);
          }
        }
      }
    }
  }, [searchParams, conversations, selectedUser, user]);

  // Load messages when user is selected
  useEffect(() => {
    if (selectedUser && user) {
      loadMessages(selectedUser.userId);
    }
  }, [selectedUser, user]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isAuthenticated) return null;

  const loadConversations = () => {
    if (!user) return;

    // Get all users that current user is following
    const stored = localStorage.getItem('beagvs_users');
    if (stored) {
      try {
        const allUsers = JSON.parse(stored);
        const following = allUsers.filter((u: any) => 
          user.following?.includes(u.id) && u.id !== user.id
        );

        // Get messages to determine last message and unread count
        const messagesStored = localStorage.getItem('chat_messages');
        const allMessages: Message[] = messagesStored ? JSON.parse(messagesStored, (key, value) => {
          if (key === 'timestamp') return new Date(value);
          return value;
        }) : [];

        const convos: Conversation[] = following.map((u: any) => {
          const userMessages = allMessages.filter((m: Message) => 
            (m.senderId === u.id && m.receiverId === user.id) ||
            (m.senderId === user.id && m.receiverId === u.id)
          );

          const lastMsg = userMessages.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0];

          const unread = userMessages.filter((m: Message) => 
            m.receiverId === user.id && !m.read
          ).length;

          return {
            userId: u.id,
            username: u.username,
            profilePicture: u.profilePicture,
            lastMessage: lastMsg?.content,
            lastMessageTime: lastMsg?.timestamp,
            unreadCount: unread,
            online: false, // Can be enhanced with real-time presence
          };
        });

        setConversations(convos);
      } catch (e) {
        console.error('[v0] Error loading conversations:', e);
      }
    }
  };

  const loadMessages = (userId: string) => {
    if (!user) return;

    const stored = localStorage.getItem('chat_messages');
    if (stored) {
      try {
        const allMessages: Message[] = JSON.parse(stored, (key, value) => {
          if (key === 'timestamp') return new Date(value);
          return value;
        });

        const userMessages = allMessages.filter((m: Message) => 
          (m.senderId === userId && m.receiverId === user.id) ||
          (m.senderId === user.id && m.receiverId === userId)
        ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        setMessages(userMessages);

        // Mark messages as read
        const updated = allMessages.map((m: Message) => 
          m.senderId === userId && m.receiverId === user.id 
            ? { ...m, read: true }
            : m
        );
        localStorage.setItem('chat_messages', JSON.stringify(updated));
        loadConversations(); // Refresh to update unread count
      } catch (e) {
        console.error('[v0] Error loading messages:', e);
      }
    }
  };

  const handleSendMessage = () => {
    if ((!messageText.trim() && attachedFiles.length === 0) || !selectedUser || !user) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      receiverId: selectedUser.userId,
      content: messageText.trim(),
      files: attachedFiles.length > 0 ? attachedFiles : undefined,
      timestamp: new Date(),
      read: false,
    };

    // Save to localStorage
    const stored = localStorage.getItem('chat_messages');
    const allMessages = stored ? JSON.parse(stored) : [];
    allMessages.push(newMessage);
    localStorage.setItem('chat_messages', JSON.stringify(allMessages));

    setMessages([...messages, newMessage]);
    setMessageText('');
    setAttachedFiles([]);
    loadConversations(); // Refresh conversations
    toast.success('Message sent');
  };

  const filteredConversations = conversations.filter(c => 
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="bg-transparent">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="grid md:grid-cols-3 h-[600px]">
            {/* Conversations List */}
            <div className="border-r">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold mb-3">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <ScrollArea className="h-[calc(600px-120px)]">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      {conversations.length === 0 
                        ? 'Follow users to start chatting'
                        : 'No conversations found'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredConversations.map((convo) => (
                      <button
                        key={convo.userId}
                        onClick={() => setSelectedUser(convo)}
                        className={`w-full p-4 hover:bg-muted/50 transition-colors text-left ${
                          selectedUser?.userId === convo.userId ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={convo.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${convo.username}`} />
                              <AvatarFallback>{convo.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            {convo.online && (
                              <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold truncate">{convo.username}</span>
                              {convo.lastMessageTime && (
                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                  {new Date(convo.lastMessageTime).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-muted-foreground truncate">
                                {convo.lastMessage || 'Start a conversation'}
                              </p>
                              {convo.unreadCount > 0 && (
                                <Badge className="ml-2 flex-shrink-0">{convo.unreadCount}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="md:col-span-2 flex flex-col">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedUser.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.username}`} />
                        <AvatarFallback>{selectedUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedUser.username}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedUser.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="ml-auto bg-transparent"
                      >
                        <Link href={`/profile/${selectedUser.username}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No messages yet. Say hi!</p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                message.senderId === user?.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              {message.content && (
                                <p className="text-sm break-words">{message.content}</p>
                              )}
                              
                              {/* Display attached files */}
                              {message.files && message.files.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {message.files.map((file, idx) => (
                                    <div key={idx} className="relative rounded overflow-hidden">
                                      <Image
                                        src={file || "/placeholder.svg"}
                                        alt={`Attachment ${idx + 1}`}
                                        width={200}
                                        height={200}
                                        className="w-full h-auto max-w-xs rounded"
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <p className={`text-xs mt-1 ${
                                message.senderId === user?.id 
                                  ? 'text-primary-foreground/70' 
                                  : 'text-muted-foreground'
                              }`}>
                                {new Date(message.timestamp).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    {/* File Preview */}
                    {attachedFiles.length > 0 && (
                      <div className="mb-3 flex gap-2 flex-wrap">
                        {attachedFiles.map((file, idx) => (
                          <div key={idx} className="relative group">
                            <Image
                              src={file || "/placeholder.svg"}
                              alt={`Attachment ${idx + 1}`}
                              width={80}
                              height={80}
                              className="rounded-lg object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {/* File Upload Button */}
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            files.forEach(file => {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setAttachedFiles(prev => [...prev, reader.result as string]);
                              };
                              reader.readAsDataURL(file);
                            });
                            e.target.value = '';
                          }}
                        />
                        <Button variant="outline" size="icon" className="bg-transparent" type="button">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Input
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!messageText.trim() && attachedFiles.length === 0}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
                    <p className="text-muted-foreground">
                      Choose a conversation from the left to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
