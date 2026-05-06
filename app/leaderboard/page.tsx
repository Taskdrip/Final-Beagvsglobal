'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Medal } from 'lucide-react';

export default function LeaderboardPage() {
  const [topUsers, setTopUsers] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('beagvs_users');
        if (stored) {
          const users = JSON.parse(stored);
          // Sort by totalPoints
          const sorted = users
            .filter((u: any) => u.totalPoints && u.totalPoints > 0)
            .sort((a: any, b: any) => (b.totalPoints || 0) - (a.totalPoints || 0))
            .slice(0, 100)
            .map((user: any, index: number) => ({
              ...user,
              rank: index + 1
            }));
          setTopUsers(sorted);
        }
      } catch (e) {
        console.error('Error loading leaderboard:', e);
      }
    }
  }, []);

  const getBadgeIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Award className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-600" />;
    return null;
  };

  const getBadgeColor = (rank: number) => {
    if (rank === 1) return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
    if (rank === 2) return 'border-gray-300 bg-gray-50 dark:bg-gray-950/20';
    if (rank === 3) return 'border-orange-600 bg-orange-50 dark:bg-orange-950/20';
    return '';
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Leaderboard</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Top 100 users earning points through platform activity. Earn rewards, airdrops, giveaways, and special access!
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to Earn Points</CardTitle>
            <CardDescription>Complete activities to climb the leaderboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Badge variant="secondary">+3</Badge>
                <div>
                  <p className="font-medium">Account Creation</p>
                  <p className="text-sm text-muted-foreground">Join Beagvs community</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary">+2</Badge>
                <div>
                  <p className="font-medium">Profile Completion</p>
                  <p className="text-sm text-muted-foreground">Complete your profile</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary">+10</Badge>
                <div>
                  <p className="font-medium">Buy Products/Services</p>
                  <p className="text-sm text-muted-foreground">Make purchases on platform</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary">+10</Badge>
                <div>
                  <p className="font-medium">Sell Products/Services</p>
                  <p className="text-sm text-muted-foreground">Complete sales on platform</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary">+3</Badge>
                <div>
                  <p className="font-medium">Popular Content</p>
                  <p className="text-sm text-muted-foreground">Posts/comments with 10+ likes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary">More</Badge>
                <div>
                  <p className="font-medium">Community Engagement</p>
                  <p className="text-sm text-muted-foreground">Active participation earns points</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {topUsers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No users with points yet. Be the first to earn!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {topUsers.map((user) => (
              <Card key={user.id} className={`${getBadgeColor(user.rank)}`}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 min-w-[60px]">
                      <span className="text-lg font-bold text-muted-foreground">#{user.rank}</span>
                      {getBadgeIcon(user.rank)}
                    </div>
                    
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.profilePicture || "/placeholder.svg"} />
                      <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <Link href={`/profile/${user.username}`} className="font-medium text-sm hover:underline truncate block">
                        {user.username}
                      </Link>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold">{user.totalPoints || 0}</div>
                      <p className="text-xs text-muted-foreground">pts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
