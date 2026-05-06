'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, ExternalLink, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminTasksPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [approvedTasks, setApprovedTasks] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    loadData();
  }, [user, router]);

  const loadData = () => {
    if (typeof window !== 'undefined') {
      const subs = JSON.parse(localStorage.getItem('task_submissions') || '[]');
      const approved = JSON.parse(localStorage.getItem('approved_tasks') || '[]');
      console.log('[v0] Loaded task submissions:', subs);
      console.log('[v0] Loaded approved tasks:', approved);
      setSubmissions(subs);
      setApprovedTasks(approved);
    }
  };

  const handleApprove = (submissionId: string) => {
    if (typeof window !== 'undefined') {
      const subs = JSON.parse(localStorage.getItem('task_submissions') || '[]');
      const submission = subs.find((s: any) => s.id === submissionId);
      
      if (submission) {
        // Update submission status
        const updatedSubs = subs.map((s: any) =>
          s.id === submissionId ? { ...s, status: 'approved', approvedAt: new Date().toISOString() } : s
        );
        localStorage.setItem('task_submissions', JSON.stringify(updatedSubs));
        
        // Add to approved tasks for public display
        const approved = JSON.parse(localStorage.getItem('approved_tasks') || '[]');
        approved.push({
          ...submission,
          status: 'approved',
          approvedAt: new Date().toISOString(),
        });
        localStorage.setItem('approved_tasks', JSON.stringify(approved));
        
        // Award points to user
        const users = JSON.parse(localStorage.getItem('beagvs_users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === submission.userId || u.email === submission.userEmail);
        if (userIndex !== -1) {
          users[userIndex].totalPoints = (users[userIndex].totalPoints || 0) + (submission.taskReward || 10);
          localStorage.setItem('beagvs_users', JSON.stringify(users));
        }
        
        toast.success('Task approved! User awarded ' + (submission.taskReward || 10) + ' Pi');
        loadData();
      }
    }
  };

  const handleReject = (submissionId: string) => {
    if (typeof window !== 'undefined') {
      const subs = JSON.parse(localStorage.getItem('task_submissions') || '[]');
      const updatedSubs = subs.map((s: any) =>
        s.id === submissionId ? { ...s, status: 'rejected', rejectedAt: new Date().toISOString() } : s
      );
      localStorage.setItem('task_submissions', JSON.stringify(updatedSubs));
      toast.error('Task rejected');
      loadData();
    }
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const approvedSubmissions = submissions.filter(s => s.status === 'approved');
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected');

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Task Submissions Management</h1>
          <p className="text-muted-foreground">Review and approve user task completions</p>
        </div>
        <Button onClick={loadData} variant="outline">Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSubmissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedSubmissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedSubmissions.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingSubmissions.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedSubmissions.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedSubmissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingSubmissions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No pending submissions
              </CardContent>
            </Card>
          ) : (
            pendingSubmissions.map((submission) => (
              <Card key={submission.id} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{submission.taskTitle}</CardTitle>
                      <CardDescription className="mt-2">
                        <div>Submitted by: <strong>{submission.username}</strong> ({submission.userEmail})</div>
                        <div>Reward: <strong>{submission.taskReward || 10} π</strong></div>
                        <div>Date: {new Date(submission.submittedAt).toLocaleDateString()}</div>
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {submission.submissionLink && (
                    <div>
                      <strong>Submission Link:</strong>
                      <div className="mt-1">
                        <a 
                          href={submission.submissionLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          {submission.submissionLink}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {submission.submissionMessage && (
                    <div>
                      <strong>Message:</strong>
                      <div className="mt-1 bg-muted p-3 rounded">
                        {submission.submissionMessage}
                      </div>
                    </div>
                  )}
                  
                  {submission.submissionFile && (
                    <div>
                      <strong>Proof / Evidence:</strong>
                      <div className="mt-2 border rounded-lg overflow-hidden max-w-md">
                        <img 
                          src={submission.submissionFile || "/placeholder.svg"} 
                          alt="Submission proof" 
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={() => handleApprove(submission.id)}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve & Award {submission.taskReward || 10} π
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleReject(submission.id)}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-6">
          {approvedSubmissions.map((submission) => (
            <Card key={submission.id} className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{submission.taskTitle}</CardTitle>
                    <CardDescription className="mt-2">
                      Submitted by: {submission.username} • Approved: {new Date(submission.approvedAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant="default">Approved</Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-6">
          {rejectedSubmissions.map((submission) => (
            <Card key={submission.id} className="border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{submission.taskTitle}</CardTitle>
                    <CardDescription className="mt-2">
                      Submitted by: {submission.username} • Rejected: {new Date(submission.rejectedAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant="destructive">Rejected</Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
