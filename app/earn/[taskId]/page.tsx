'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { ArrowLeft, Clock, Coins, Upload, Link2, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function TaskDetailPage({ params }: { params: { taskId: string } }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [submissionFile, setSubmissionFile] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      if (!isAuthenticated) {
        console.log('[v0] User not authenticated, redirecting');
        router.push('/');
        return;
      }

      // Load task from earn_tasks
      if (typeof window !== 'undefined') {
        try {
          const tasks = JSON.parse(localStorage.getItem('earn_tasks') || '[]');
          console.log('[v0] Looking for task ID:', params.taskId);
          console.log('[v0] Available tasks in earn_tasks:', tasks);
          
          const foundTask = tasks.find((t: any) => t.id === params.taskId);
          
          if (foundTask) {
            console.log('[v0] Task found:', foundTask);
            setTask(foundTask);
            setLoading(false);
          } else {
            console.log('[v0] Task not found in earn_tasks, checking if this is a default task');
            // Check if it's a default task ID
            if (params.taskId.startsWith('default_task_')) {
              console.log('[v0] This is a default task, creating it');
              // Return mock task data for default tasks
              setTask({
                id: params.taskId,
                title: 'Default Task',
                description: 'This is a default task',
                reward: 5,
                category: 'General',
                difficulty: 'easy',
                timeEstimate: '5-10 min',
                requirements: ['Active account'],
                instructions: ['Complete the task', 'Submit proof'],
                publisherId: 'admin',
                publisherName: 'Beagvs Team'
              });
              setLoading(false);
            } else {
              console.log('[v0] Task not found anywhere');
              toast.error('Task not found');
              setTimeout(() => router.push('/earn'), 2000);
              setLoading(false);
            }
          }
        } catch (error) {
          console.error('[v0] Error loading task:', error);
          toast.error('Error loading task');
          setLoading(false);
        }
      }
    };
    
    loadTask();
  }, [params.taskId, isAuthenticated, router]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSubmissionFile(reader.result as string);
        toast.success('File uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!user || !task) return;

    if (!submissionLink && !submissionMessage && !submissionFile) {
      toast.error('Please provide at least one form of submission (link, message, or file)');
      return;
    }

    setSubmitting(true);

    // Create submission object
    const submission = {
      id: `submission_${Date.now()}`,
      taskId: task.id,
      taskTitle: task.title,
      taskReward: task.reward || 0,
      userId: user.id,
      username: user.username,
      userEmail: user.email,
      submissionLink,
      submissionMessage,
      submissionFile,
      publisherId: task.publisherId || 'admin',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    console.log('[v0] ===== TASK SUBMISSION =====');
    console.log('[v0] Submission data:', submission);
    console.log('[v0] Task details:', task);
    console.log('[v0] User details:', user);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      const existingSubmissions = JSON.parse(localStorage.getItem('task_submissions') || '[]');
      console.log('[v0] Existing submissions before save:', existingSubmissions);
      
      existingSubmissions.push(submission);
      localStorage.setItem('task_submissions', JSON.stringify(existingSubmissions));
      
      // Verify it was saved
      const verifySubmissions = JSON.parse(localStorage.getItem('task_submissions') || '[]');
      console.log('[v0] Submissions after save:', verifySubmissions);
      console.log('[v0] Total submissions count:', verifySubmissions.length);
      console.log('[v0] Last submission:', verifySubmissions[verifySubmissions.length - 1]);
      console.log('[v0] ===== SUBMISSION SAVED =====');
    }

    toast.success('Task submitted successfully! Awaiting admin approval.');
    setTimeout(() => {
      setSubmitting(false);
      router.push('/earn');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading task...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Tasks
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{task.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4 text-primary" />
                  <span className="font-bold text-primary">{task.reward} π</span>
                  <span className="text-xs">≈ ${(task.reward * 0.62).toFixed(2)} USD</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{task.timeEstimate || '5-10 min'}</span>
                </div>
              </div>
            </div>
            <Badge variant={task.difficulty === 'easy' ? 'default' : task.difficulty === 'medium' ? 'secondary' : 'destructive'}>
              {task.difficulty || 'Easy'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Task Description */}
          <div>
            <h3 className="font-semibold mb-2">Task Description</h3>
            <p className="text-muted-foreground">{task.description}</p>
          </div>

          {/* Task Instructions */}
          {task.instructions && (
            <div>
              <h3 className="font-semibold mb-2">Instructions</h3>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                {task.instructions.map((instruction: string, index: number) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Task Requirements */}
          {task.requirements && (
            <div>
              <h3 className="font-semibold mb-2">Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {task.requirements.map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Submit Your Completion Proof
            </h3>

            <div className="space-y-4">
              {/* Link Submission */}
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  Submission Link (Optional)
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/your-submission"
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Provide a link to your completed work (e.g., social media post, form submission)
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message / Notes (Optional)
                </label>
                <Textarea
                  placeholder="Describe what you did to complete this task..."
                  value={submissionMessage}
                  onChange={(e) => setSubmissionMessage(e.target.value)}
                  rows={4}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Proof (Optional)
                </label>
                <div className="space-y-3">
                  {submissionFile && (
                    <div className="relative w-full max-w-md aspect-video border rounded-lg overflow-hidden">
                      <img
                        src={submissionFile || "/placeholder.svg"}
                        alt="Submission proof"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                    />
                    <Button variant="outline" className="w-full bg-transparent" type="button">
                      <Upload className="h-4 w-4 mr-2" />
                      {submissionFile ? 'Change File' : 'Upload Screenshot/Document'}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a screenshot or document proving task completion
                </p>
              </div>

              {/* Warning */}
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Submission Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Provide clear proof of task completion</li>
                    <li>Submissions are reviewed within 24-48 hours</li>
                    <li>Approved tasks will credit Pi to your account</li>
                    <li>False submissions may result in account suspension</li>
                  </ul>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={submitting || (!submissionLink && !submissionMessage && !submissionFile)}
                className="w-full"
                size="lg"
              >
                {submitting ? 'Submitting...' : 'Submit Task for Review'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
