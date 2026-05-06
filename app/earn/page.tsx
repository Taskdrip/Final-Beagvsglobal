'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';

export default function EarnPiPage() {
  const auth = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  
  const user = auth?.user || null;
  const isAuthenticated = auth?.isAuthenticated || false;

  useEffect(() => {
    // Load tasks from localStorage
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('earn_tasks');
        if (stored) {
          const parsedTasks = JSON.parse(stored);
          setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
        }
        
        // Load user points
        if (user) {
          setUserPoints(user.totalPoints || 0);
        }
      }
    } catch (error) {
      console.error('[v0] Error loading tasks:', error);
      setTasks([]);
    }
  }, [user]);

  const allTasks = tasks;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Earn Pi</h1>
          <p className="text-muted-foreground">Complete tasks and earn Pi rewards</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
                <span className="text-2xl font-bold">{allTasks.length}</span>
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
                <span className="text-2xl font-bold">0</span>
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
                <span className="text-2xl font-bold">0</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Grid */}
        {allTasks.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Tasks Available Yet</h3>
              <p className="text-muted-foreground mb-4">
                Tasks will appear here once approved by admin. Check back soon!
              </p>
              <Link href="/list-task">
                <Button>Submit a Task Request</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow">
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
                  <span>⏱️ {task.timeEstimate}</span>
                  <Badge variant="outline">{task.difficulty}</Badge>
                </div>
                <Button 
                  className="w-full" 
                  asChild
                >
                  <Link href={`/earn/${task.id}`}>
                    View Task Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
