'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Radio } from 'lucide-react';
import { PiNetworkIntegration } from '@/lib/pi-network-integration';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [firesideConnections, setFiresideConnections] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    // Load Fireside connections
    let connections = PiNetworkIntegration.getFiresideConnections();
    
    // If no connections, populate with existing users from the system
    if (connections.length === 0) {
      if (typeof window !== 'undefined') {
        const allUsers = JSON.parse(localStorage.getItem('beagvs_users') || '[]');
        
        // Create Fireside connections from actual users
        allUsers.forEach((user: any) => {
          if (user.id !== auth?.user?.id) { // Don't include current user
            PiNetworkIntegration.connectToFireside(user.id, user.username);
          }
        });
        
        connections = PiNetworkIntegration.getFiresideConnections();
      }
    }
    
    setFiresideConnections(connections);
    console.log('[v0] Loaded Fireside connections:', connections.length);
  }, [auth]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a Pi username to search');
      return;
    }

    setIsSearching(true);
    console.log('[v0] Searching for Pi username:', searchQuery);

    // Search by Pi username
    const results = PiNetworkIntegration.searchByPiUsername(searchQuery);
    setSearchResults(results);
    setIsSearching(false);

    if (results.length === 0) {
      toast.info('No users found with that Pi username');
    } else {
      toast.success(`Found ${results.length} user(s)`);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Discover Pi Users</h1>
          <p className="text-muted-foreground">
            Find and connect with users across the Pi Network ecosystem
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Pi username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Search users by their Pi Network username or Beagvs username
            </p>
          </CardContent>
        </Card>

        {/* Pi Fireside Connections */}
        {firesideConnections.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Pi Fireside</h2>
              <Badge variant="secondary">{firesideConnections.length} online</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {firesideConnections.map((connection) => (
                <Card key={connection.uid} className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${connection.username}`} />
                        <AvatarFallback>{connection.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{connection.username}</h3>
                          <div className={`h-2 w-2 rounded-full ${
                            connection.status === 'online' ? 'bg-green-500' :
                            connection.status === 'away' ? 'bg-yellow-500' :
                            'bg-gray-400'
                          }`} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {connection.status === 'online' ? 'Online now' : `Last seen ${new Date(connection.lastSeen).toLocaleDateString()}`}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/profile/${connection.username}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5" />
              <h2 className="text-2xl font-bold">Search Results</h2>
              <Badge>{searchResults.length} found</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {searchResults.map((user) => (
                <Card key={user.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={user.avatar || user.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                        />
                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{user.username}</h3>
                        {user.piUsername && user.piUsername !== user.username && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                            </svg>
                            {user.piUsername}
                          </p>
                        )}
                        {user.bio && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {user.bio}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/profile/${user.username}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {searchResults.length === 0 && !isSearching && searchQuery && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground">
                Try searching with a different Pi username
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        {!searchQuery && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">About Pi Network Integration</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Your Beagvs account is synced with your Pi Network username</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Search and discover other Pi users in the ecosystem</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Connect via Pi Fireside for real-time interactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>All usernames are unique and tied to your Pi identity</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
