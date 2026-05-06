"use client";

import React from "react"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users, Wallet, Clock, Upload, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { redirect } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  description: string;
  taskType: string;
  region: string;
  participants: string;
  budget: string;
}

export default function ListTaskPage() {
  const { isAuthenticated, user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);

  // Multiple tasks support
  const [tasks, setTasks] = useState<Task[]>([{
    id: '1',
    title: '',
    description: '',
    taskType: '',
    region: '',
    participants: '',
    budget: ''
  }]);

  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [transactionHash, setTransactionHash] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const adminWallet = 'GDR7XQKP9XWJF8ZMHVQP4KXNR2YMTS3L';

  const PLATFORM_FEE = 100;
  const MIN_BUDGET = 1000;

  const calculateTotals = () => {
    const totalBudget = tasks.reduce((sum, task) => sum + (Number(task.budget) || 0), 0);
    const totalFees = tasks.length * PLATFORM_FEE;
    return {
      totalBudget,
      totalFees,
      grandTotal: totalBudget + totalFees
    };
  };

  const { totalBudget, totalFees, grandTotal } = calculateTotals();

  useEffect(() => {
    if (!showCheckout || paymentSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowCheckout(false);
          toast.error('Payment time expired. Please try again.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showCheckout, paymentSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = () => {
    setTasks([...tasks, {
      id: Date.now().toString(),
      title: '',
      description: '',
      taskType: '',
      region: '',
      participants: '',
      budget: ''
    }]);
  };

  const removeTask = (id: string) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter(task => task.id !== id));
    } else {
      toast.error('At least one task is required');
    }
  };

  const updateTask = (id: string, field: keyof Task, value: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    for (const task of tasks) {
      if (!task.title || !task.description || !task.taskType || !task.region || !task.participants || !task.budget) {
        toast.error('Please fill all fields for each task');
        return;
      }

      if (Number(task.budget) < MIN_BUDGET) {
        toast.error(`Minimum budget per task is ${MIN_BUDGET} Pi`);
        return;
      }

      if (Number(task.participants) < 1) {
        toast.error('At least 1 participant is required per task');
        return;
      }
    }

    setShowCheckout(true);
    setTimeRemaining(30 * 60);
  };

  const handlePaymentSubmit = () => {
    if (!paymentProof) {
      toast.error('Please upload payment proof');
      return;
    }

    if (!paymentConfirmed) {
      toast.error('Please confirm that payment has been made');
      return;
    }

    // Save tasks to admin approval queue
    const reader = new FileReader();
    
    reader.onloadend = () => {
      // Create payment request for task submission
      const paymentRequest = {
        id: `payment_task_${Date.now()}`,
        userId: user?.id || 'unknown',
        username: user?.username || 'Anonymous',
        userEmail: user?.email || '',
        type: 'task',
        amount: grandTotal,
        currency: 'USD', // Admin can configure this
        transactionHash: transactionHash,
        paymentProof: reader.result,
        description: `Task submission for ${tasks.length} task(s) - Total: ${grandTotal}`,
        taskDetails: tasks.map(task => ({
          ...task,
          id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          reward: Number(task.budget),
          category: task.taskType,
          requirements: `${task.participants} participants needed in ${task.region}`,
          publisherId: user?.id || 'unknown',
          publisherName: user?.username || 'Anonymous',
        })),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Save payment request
      const existingPayments = JSON.parse(localStorage.getItem('payment_requests') || '[]');
      existingPayments.push(paymentRequest);
      localStorage.setItem('payment_requests', JSON.stringify(existingPayments));
      localStorage.setItem('beagvs_backup_payment_requests', JSON.stringify(existingPayments));
      
      console.log('[v0] Payment request for tasks created:', paymentRequest);
      
      setPaymentSubmitted(true);
      setTimeout(() => {
        toast.success('Tasks submitted for payment verification! Admin will review within 24 hours.');
        setShowCheckout(false);
        // Reset form
        setTasks([{
          id: '1',
          title: '',
          description: '',
          taskType: '',
          region: '',
          participants: '',
          budget: ''
        }]);
        setPaymentProof(null);
        setTransactionHash('');
        setPaymentConfirmed(false);
        setPaymentSubmitted(false);
      }, 2000);
    };
    
    reader.readAsDataURL(paymentProof);
  };

  if (!isAuthenticated) {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/earn" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Earn Pi
        </Link>
        <h1 className="text-3xl font-bold mb-2">List a Task</h1>
        <p className="text-muted-foreground">
          Create tasks for the community to earn Pi. Minimum budget: {MIN_BUDGET} Pi per task + {PLATFORM_FEE} Pi platform fee per task.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {tasks.map((task, index) => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Task {index + 1}</CardTitle>
                {tasks.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${task.id}`}>Task Title *</Label>
                <Input
                  id={`title-${task.id}`}
                  placeholder="e.g., Follow us on social media"
                  value={task.title}
                  onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${task.id}`}>Description *</Label>
                <Textarea
                  id={`description-${task.id}`}
                  placeholder="Describe what participants need to do..."
                  value={task.description}
                  onChange={(e) => updateTask(task.id, 'description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`taskType-${task.id}`}>Task Type *</Label>
                  <Select value={task.taskType} onValueChange={(value) => updateTask(task.id, 'taskType', value)}>
                    <SelectTrigger id={`taskType-${task.id}`}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="physical">Physical Task</SelectItem>
                      <SelectItem value="event">Event Attendance</SelectItem>
                      <SelectItem value="review">Product Review</SelectItem>
                      <SelectItem value="survey">Survey/Form</SelectItem>
                      <SelectItem value="content">Content Creation</SelectItem>
                      <SelectItem value="testing">App/Product Testing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`region-${task.id}`}>Region *</Label>
                  <Input
                    id={`region-${task.id}`}
                    placeholder="e.g., Global, USA, Europe"
                    value={task.region}
                    onChange={(e) => updateTask(task.id, 'region', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`participants-${task.id}`}>Number of Participants *</Label>
                  <Input
                    id={`participants-${task.id}`}
                    type="number"
                    placeholder="100"
                    value={task.participants}
                    onChange={(e) => updateTask(task.id, 'participants', e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`budget-${task.id}`}>Total Budget (Pi) *</Label>
                  <Input
                    id={`budget-${task.id}`}
                    type="number"
                    placeholder={`Minimum ${MIN_BUDGET}`}
                    value={task.budget}
                    onChange={(e) => updateTask(task.id, 'budget', e.target.value)}
                    min={MIN_BUDGET}
                    required
                  />
                </div>
              </div>

              {task.budget && task.participants && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Per Person Earning</p>
                  <p className="text-2xl font-bold text-primary">
                    {(Number(task.budget) / Number(task.participants)).toFixed(2)} Pi
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addTask}
          className="w-full bg-transparent"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Task
        </Button>

        {/* Summary Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Total Tasks:</span>
              <span className="font-medium">{tasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Budget:</span>
              <span className="font-medium">{totalBudget} Pi</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fees ({tasks.length} × {PLATFORM_FEE} Pi):</span>
              <span className="font-medium">{totalFees} Pi</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-primary">{grandTotal} Pi</span>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full">
          Proceed to Payment
        </Button>
      </form>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Send {grandTotal} Pi to the wallet address below
            </DialogDescription>
          </DialogHeader>
          
          {!paymentSubmitted ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center p-4 bg-destructive/10 text-destructive rounded-lg">
                <Clock className="mr-2 h-5 w-5" />
                <span className="text-lg font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>

              <div className="space-y-2">
                <Label>Payment Amount</Label>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-3xl font-bold text-primary">{grandTotal} Pi</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Admin Wallet Address</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-mono text-sm break-all">{adminWallet}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => {
                    navigator.clipboard.writeText(adminWallet);
                    toast.success('Wallet address copied!');
                  }}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Copy Address
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-proof">Upload Payment Proof *</Label>
                <Input
                  id="payment-proof"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Upload a screenshot or PDF of your transaction
                </p>
              </div>

              {/* Payment Confirmation Checkbox */}
              <div className="flex items-start space-x-2 p-4 border rounded-lg bg-muted/30">
                <input
                  type="checkbox"
                  id="payment-confirmed-checkout"
                  checked={paymentConfirmed}
                  onChange={(e) => setPaymentConfirmed(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 mt-1"
                  required
                />
                <Label htmlFor="payment-confirmed-checkout" className="text-sm font-medium cursor-pointer">
                  I confirm that I have completed the payment of <span className="font-bold text-primary">π {grandTotal.toFixed(2)}</span> to the admin wallet address above.
                </Label>
              </div>

              <Button
                onClick={handlePaymentSubmit}
                disabled={!paymentProof || !paymentConfirmed}
                className="w-full"
              >
                Submit Payment Proof
              </Button>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-500/10 p-3">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Submission Successful!</h3>
                <p className="text-sm text-muted-foreground">
                  Your task submission has been received and is pending admin approval.
                  You will be notified once it's reviewed.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
