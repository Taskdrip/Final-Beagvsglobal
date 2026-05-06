'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Package, DollarSign, Shield, AlertTriangle, CheckCircle, Clock, X, Eye, MessageSquare, Trash2, ExternalLink, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { PaymentManagement } from './payment-management';

export function AdminDashboard() {
  const [taskRequests, setTaskRequests] = useState<any[]>([]);
  const [previewTask, setPreviewTask] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  const loadTaskRequests = () => {
    if (typeof window !== 'undefined') {
      try {
        const submissions = JSON.parse(localStorage.getItem('task_submissions') || '[]');
        console.log('[v0] Loading task requests:', submissions);
        setTaskRequests(submissions);
        
        const pendingCount = submissions.filter((s: any) => s.status === 'pending').length;
        if (submissions.length > 0) {
          toast.success(`Found ${submissions.length} task request(s) (${pendingCount} pending)`);
        }
      } catch (error) {
        console.error('[v0] Error loading task requests:', error);
        toast.error('Failed to load task requests');
        setTaskRequests([]);
      }
    }
  };
  
  useEffect(() => {
    loadTaskRequests();
  }, []);

  const handleApprove = (requestId: string) => {
    if (typeof window !== 'undefined') {
      const requests = JSON.parse(localStorage.getItem('task_submissions') || '[]');
      const request = requests.find((r: any) => r.id === requestId);
      
      if (request && request.tasks && request.tasks.length > 0) {
        // Add approved tasks to earn_tasks
        const existingTasks = JSON.parse(localStorage.getItem('earn_tasks') || '[]');
        const newTasks = request.tasks.map((task: any) => ({
          ...task,
          id: task.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'approved',
          category: task.taskType || 'General',
          reward: Number(task.budget) || 5,
          timeEstimate: '5-10 min',
          difficulty: 'easy',
          requirements: [task.requirements || `${task.participants} participants in ${task.region}`],
          instructions: [task.description || 'Complete the task as described'],
          approvedAt: new Date().toISOString(),
          publisherId: request.userId,
          publisherName: request.username,
        }));
        
        localStorage.setItem('earn_tasks', JSON.stringify([...existingTasks, ...newTasks]));
        console.log('[v0] Tasks approved and published:', newTasks);
      }
      
      // Update request status
      const updated = requests.map((r: any) => 
        r.id === requestId ? { ...r, status: 'approved', approvedAt: new Date().toISOString() } : r
      );
      localStorage.setItem('task_submissions', JSON.stringify(updated));
      setTaskRequests(updated);
      toast.success('Task request approved and published to Earn Pi page!');
    }
  };

  const handleDelete = (requestId: string) => {
    if (window.confirm('Are you sure you want to delete this task request? This action cannot be undone.')) {
      if (typeof window !== 'undefined') {
        const requests = JSON.parse(localStorage.getItem('task_submissions') || '[]');
        const updated = requests.filter((r: any) => r.id !== requestId);
        localStorage.setItem('task_submissions', JSON.stringify(updated));
        setTaskRequests(updated);
        toast.success('Task request deleted');
      }
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    // In a real app, this would send an email or notification
    toast.success(`Message sent to ${selectedRequest?.username}`);
    setChatMessage('');
    setShowChatDialog(false);
  };

  const stats = {
    totalUsers: 1234,
    totalListings: 567,
    totalRevenue: 12450.75,
    pendingVerifications: 15,
    activeDisputes: 3,
    completedOrders: 890,
    pendingRequests: taskRequests.filter(r => r.status === 'pending').length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage tasks, payments, and users</p>
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          <PaymentManagement />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalListings}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue} π</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Task Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Disputes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDisputes}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Task Requests Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Task Requests Management</CardTitle>
              <CardDescription>Review, approve, and manage all task requests from users</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={loadTaskRequests} className="bg-transparent">
                Refresh
              </Button>
              <Badge variant="secondary">{stats.pendingRequests} pending</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {taskRequests.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 bg-muted/30 rounded-lg">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No task requests yet</p>
                <p className="text-sm mt-2">Task requests from users will appear here for review</p>
              </div>
            ) : (
              taskRequests.map((request) => (
                <Card key={request.id} className={`border-l-4 ${request.status === 'pending' ? 'border-l-orange-500' : request.status === 'approved' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">
                              Task Request from {request.username}
                            </h4>
                            <Badge variant={request.status === 'pending' ? 'secondary' : request.status === 'approved' ? 'default' : 'destructive'}>
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {request.userEmail} • Submitted {new Date(request.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Tasks Details */}
                      {request.tasks && request.tasks.length > 0 && (
                        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">Requested Tasks ({request.tasks.length})</p>
                            <p className="text-sm font-medium">Total: π {request.totalAmount}</p>
                          </div>
                          {request.tasks.map((task: any, idx: number) => (
                            <div key={idx} className="bg-background p-3 rounded border">
                              <p className="font-medium">{task.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                              <div className="flex flex-wrap gap-3 mt-2 text-xs">
                                <span className="flex items-center gap-1">
                                  <strong>Budget:</strong> π {task.budget}
                                </span>
                                <span className="flex items-center gap-1">
                                  <strong>Type:</strong> {task.taskType}
                                </span>
                                <span className="flex items-center gap-1">
                                  <strong>Participants:</strong> {task.participants}
                                </span>
                                <span className="flex items-center gap-1">
                                  <strong>Region:</strong> {task.region}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Transaction Hash */}
                      {request.transactionHash && (
                        <div className="bg-muted/30 p-3 rounded border">
                          <p className="text-sm font-semibold mb-1">Transaction Hash</p>
                          <code className="text-xs break-all font-mono bg-background p-2 rounded block">
                            {request.transactionHash}
                          </code>
                        </div>
                      )}

                      {/* Payment Proof */}
                      {request.paymentProof && (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold flex items-center gap-2">
                            Payment Evidence
                            <ExternalLink className="h-3 w-3" />
                          </p>
                          <div 
                            className="border rounded-lg overflow-hidden max-w-sm cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                            onClick={() => window.open(request.paymentProof, '_blank')}
                          >
                            <img 
                              src={request.paymentProof || "/placeholder.svg"} 
                              alt="Payment proof" 
                              className="w-full h-auto"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">Click image to view full size in new tab</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2 border-t flex-wrap">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setPreviewTask(request);
                            setShowPreview(true);
                          }}
                          className="bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        
                        {request.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleApprove(request.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve & Publish
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowChatDialog(true);
                              }}
                              className="bg-transparent"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Chat Creator
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDelete(request.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </>
                        )}
                        
                        {request.status === 'approved' && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDelete(request.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Task Request Preview</DialogTitle>
            <DialogDescription>
              Detailed view of the task request
            </DialogDescription>
          </DialogHeader>
          {previewTask && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Requester Information</h3>
                <div className="bg-muted p-3 rounded space-y-1 text-sm">
                  <p><strong>Name:</strong> {previewTask.username}</p>
                  <p><strong>Email:</strong> {previewTask.userEmail}</p>
                  <p><strong>User ID:</strong> {previewTask.userId}</p>
                  <p><strong>Submitted:</strong> {new Date(previewTask.submittedAt).toLocaleString()}</p>
                  <p><strong>Status:</strong> <Badge>{previewTask.status}</Badge></p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Tasks ({previewTask.tasks?.length || 0})</h3>
                <div className="space-y-3">
                  {previewTask.tasks?.map((task: any, idx: number) => (
                    <div key={idx} className="bg-muted p-4 rounded">
                      <h4 className="font-medium mb-2">{idx + 1}. {task.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Type:</strong> {task.taskType}</div>
                        <div><strong>Budget:</strong> π {task.budget}</div>
                        <div><strong>Participants:</strong> {task.participants}</div>
                        <div><strong>Region:</strong> {task.region}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Payment Proof</h3>
                {previewTask.paymentProof ? (
                  <img 
                    src={previewTask.paymentProof || "/placeholder.svg"} 
                    alt="Payment proof" 
                    className="w-full max-h-96 object-contain border rounded"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">No payment proof provided</p>
                )}
              </div>

              <div className="bg-primary/10 p-3 rounded">
                <p className="text-sm"><strong>Total Amount:</strong> π {previewTask.totalAmount}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message Task Creator</DialogTitle>
            <DialogDescription>
              Send a message to {selectedRequest?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded text-sm">
              <p><strong>To:</strong> {selectedRequest?.username} ({selectedRequest?.userEmail})</p>
            </div>
            <Textarea
              placeholder="Type your message here..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              rows={6}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowChatDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Manage platform content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start bg-transparent" variant="outline">
              <Link href="/admin/post-task">
                <Package className="mr-2 h-4 w-4" />
                Post New Task
              </Link>
            </Button>
            <Button asChild className="w-full justify-start bg-transparent" variant="outline">
              <Link href="/admin/news">
                <Package className="mr-2 h-4 w-4" />
                Post News Article
              </Link>
            </Button>
            <Button asChild className="w-full justify-start bg-transparent" variant="outline">
              <Link href="/admin/listings">
                <Package className="mr-2 h-4 w-4" />
                Manage All Listings
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Actions</CardTitle>
            <CardDescription>Platform management tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/admin?tab=verifications">
                <Shield className="mr-2 h-4 w-4" />
                Review Verifications ({stats.pendingVerifications})
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/admin?tab=disputes">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Resolve Disputes ({stats.activeDisputes})
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
