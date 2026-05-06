'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, CheckCircle, Clock, Target, TrendingUp, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';

const SEED_TASKS = [
  {
    id: 'task_seed_1',
    title: 'Complete Your Profile',
    description: 'Fill in your username, bio, and profile picture to earn Pi rewards.',
    category: 'Account',
    reward: 5,
    timeEstimate: '5 mins',
    difficulty: 'Easy',
  },
  {
    id: 'task_seed_2',
    title: 'Make Your First Purchase',
    description: 'Buy any item from the Beagvs marketplace using Pi.',
    category: 'Shopping',
    reward: 10,
    timeEstimate: '10 mins',
    difficulty: 'Easy',
  },
  {
    id: 'task_seed_3',
    title: 'Post in the Community Feed',
    description: 'Share your first post in the Beagvs community feed.',
    category: 'Social',
    reward: 2,
    timeEstimate: '2 mins',
    difficulty: 'Easy',
  },
  {
    id: 'task_seed_4',
    title: 'Refer a Friend',
    description: 'Invite a friend to join Beagvs. Earn Pi when they create an account.',
    category: 'Referral',
    reward: 15,
    timeEstimate: '5 mins',
    difficulty: 'Medium',
  },
  {
    id: 'task_seed_5',
    title: 'List Your First Item',
    description: 'Create a product or service listing on the Beagvs marketplace.',
    category: 'Seller',
    reward: 8,
    timeEstimate: '15 mins',
    difficulty: 'Medium',
  },
  {
    id: 'task_seed_6',
    title: 'Share on Social Media',
    description: 'Share the Beagvs marketplace on Facebook, Twitter, or any platform.',
    category: 'Social',
    reward: 3,
    timeEstimate: '3 mins',
    difficulty: 'Easy',
  },
  {
    id: 'task_seed_7',
    title: 'Write a Product Review',
    description: 'Leave an honest review on any product you have purchased.',
    category: 'Review',
    reward: 4,
    timeEstimate: '10 mins',
    difficulty: 'Easy',
  },
  {
    id: 'task_seed_8',
    title: 'Ship an Item with Pi',
    description: 'Use the Ship with Pi service to send a package and pay with Pi.',
    category: 'Shipping',
    reward: 12,
    timeEstimate: '20 mins',
    difficulty: 'Medium',
  },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: 'bg-green-500/10 text-green-600 border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  Hard: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function EarnPiPage() {
  const auth = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const user = auth?.user || null;
  const isAuthenticated = auth?.isAuthenticated || false;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('earn_tasks');
      let loadedTasks: any[] = [];

      if (stored) {
        const parsed = JSON.parse(stored);
        loadedTasks = Array.isArray(parsed) ? parsed : [];
      }

      if (loadedTasks.length === 0) {
        localStorage.setItem('earn_tasks', JSON.stringify(SEED_TASKS));
        loadedTasks = SEED_TASKS;
      }

      setTasks(loadedTasks);

      if (user) {
        setUserPoints(user.totalPoints || 0);
        const completedKey = `completed_tasks_${user.id}`;
        const completed = JSON.parse(localStorage.getItem(completedKey) || '[]');
        setCompletedIds(completed);
      }
    } catch (error) {
      console.error('[v0] Error loading tasks:', error);
      setTasks(SEED_TASKS);
    }
  }, [user]);

  const handleStartTask = (task: any) => {
    if (!isAuthenticated) {
      auth?.login();
      return;
    }
    toast.info(`Starting task: "${task.title}". Complete the steps and check back!`);
  };

  const completedCount = completedIds.length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Earn Pi</h1>
          <p className="text-muted-foreground">Complete tasks and earn Pi rewards</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">{userPoints} Pi</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{tasks.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">{completedCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold">{pendingCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Potential earnings banner */}
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold">Total potential earnings from all tasks</p>
                  <p className="text-sm text-muted-foreground">Complete all tasks to earn up to</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-primary">
                {tasks.reduce((sum, t) => sum + (t.reward || 0), 0)} Pi
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => {
            const isCompleted = completedIds.includes(task.id);
            return (
              <Card
                key={task.id}
                className={`hover:shadow-lg transition-shadow ${isCompleted ? 'opacity-70' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{task.category}</Badge>
                    <div className="flex items-center gap-1 text-yellow-500 font-bold">
                      <Coins className="h-4 w-4" />
                      {task.reward} Pi
                    </div>
                  </div>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <CardDescription>{task.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>⏱ {task.timeEstimate}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${DIFFICULTY_COLOR[task.difficulty] || ''}`}>
                      {task.difficulty}
                    </span>
                  </div>
                  {isCompleted ? (
                    <Button className="w-full" variant="outline" disabled>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Completed
                    </Button>
                  ) : !isAuthenticated ? (
                    <Button className="w-full" variant="outline" onClick={() => auth?.login()}>
                      <Lock className="h-4 w-4 mr-2" />
                      Sign In to Start
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => handleStartTask(task)}>
                      Start Task
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* List a task CTA */}
        <Card className="mt-10">
          <CardContent className="py-8 text-center space-y-3">
            <Target className="h-10 w-10 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">Want to create tasks for the community?</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              List tasks for Beagvs users to complete and grow your brand presence.
            </p>
            <Link href="/list-task">
              <Button size="lg">List a Task</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
