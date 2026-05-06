'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminPostTaskPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [reward, setReward] = useState('10');
  const [category, setCategory] = useState('Social Media');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !reward) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    const newTask = {
      id: 'task_' + Date.now(),
      title,
      description,
      requirements: requirements || 'Complete the task as described',
      reward: parseFloat(reward),
      category,
      publisherId: user?.id,
      publisherName: user?.username || 'Admin',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      const tasks = JSON.parse(localStorage.getItem('earn_tasks') || '[]');
      tasks.push(newTask);
      localStorage.setItem('earn_tasks', JSON.stringify(tasks));
      console.log('[v0] Posted new task:', newTask);
    }

    toast.success('Task posted successfully!');
    
    setTimeout(() => {
      setSubmitting(false);
      // Reset form
      setTitle('');
      setDescription('');
      setRequirements('');
      setReward('10');
      setCategory('Social Media');
    }, 1000);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Post New Task</h1>
        <p className="text-muted-foreground">Create tasks for users to complete and earn Pi rewards</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>Fill in the details for the new task</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Follow us on Twitter"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what users need to do..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (optional)</Label>
              <Textarea
                id="requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Any specific requirements or instructions..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reward">Reward (Pi) *</Label>
                <Input
                  id="reward"
                  type="number"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  placeholder="10"
                  min="1"
                  step="0.1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Social Media">Social Media</option>
                  <option value="Survey">Survey</option>
                  <option value="Review">Review</option>
                  <option value="Content Creation">Content Creation</option>
                  <option value="Testing">Testing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? 'Posting...' : 'Post Task'}
              </Button>
              <Button type="button" variant="outline" asChild className="bg-transparent">
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
