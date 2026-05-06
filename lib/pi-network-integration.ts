/**
 * Pi Network Integration Utility
 * Syncs Beagvs users with Pi Network ecosystem
 * Enables cross-platform user discovery and Fireside integration
 */

export interface PiUser {
  uid: string;
  username: string;
  accessToken?: string;
}

export interface PiFiresideConnection {
  uid: string;
  username: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: string;
}

export class PiNetworkIntegration {
  private static readonly PI_STORAGE_KEY = 'pi_network_user';
  private static readonly FIRESIDE_KEY = 'pi_fireside_connections';
  
  /**
   * Sync Pi Network username with Beagvs account
   */
  static syncPiUsername(beagvsUserId: string, piUsername: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Store Pi username mapping
      const mapping = this.getPiUsernameMappings();
      mapping[beagvsUserId] = piUsername;
      localStorage.setItem('pi_username_mappings', JSON.stringify(mapping));
      
      console.log('[v0] Pi Network - Username synced:', { beagvsUserId, piUsername });
    } catch (error) {
      console.error('[v0] Pi Network - Sync error:', error);
    }
  }
  
  /**
   * Get Pi username for a Beagvs user
   */
  static getPiUsername(beagvsUserId: string): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const mapping = this.getPiUsernameMappings();
      return mapping[beagvsUserId] || null;
    } catch (error) {
      console.error('[v0] Pi Network - Get username error:', error);
      return null;
    }
  }
  
  /**
   * Search users by Pi username
   */
  static searchByPiUsername(query: string): any[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const users = JSON.parse(localStorage.getItem('beagvs_users') || '[]');
      const mappings = this.getPiUsernameMappings();
      
      const results = users.filter((user: any) => {
        const piUsername = mappings[user.id];
        return piUsername?.toLowerCase().includes(query.toLowerCase()) ||
               user.username?.toLowerCase().includes(query.toLowerCase());
      });
      
      return results.map((user: any) => ({
        ...user,
        piUsername: mappings[user.id] || user.username
      }));
    } catch (error) {
      console.error('[v0] Pi Network - Search error:', error);
      return [];
    }
  }
  
  /**
   * Get all Pi username mappings
   */
  private static getPiUsernameMappings(): Record<string, string> {
    try {
      const stored = localStorage.getItem('pi_username_mappings');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }
  
  /**
   * Connect to Pi Fireside
   * Simulates integration with Pi Network's Fireside feature
   */
  static connectToFireside(userId: string, username: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const connections = this.getFiresideConnections();
      
      const connection: PiFiresideConnection = {
        uid: userId,
        username: username,
        status: 'online',
        lastSeen: new Date().toISOString(),
      };
      
      connections.push(connection);
      localStorage.setItem(this.FIRESIDE_KEY, JSON.stringify(connections));
      
      console.log('[v0] Pi Fireside - Connected:', username);
    } catch (error) {
      console.error('[v0] Pi Fireside - Connection error:', error);
    }
  }
  
  /**
   * Get Fireside connections
   */
  static getFiresideConnections(): PiFiresideConnection[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.FIRESIDE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  
  /**
   * Disconnect from Fireside
   */
  static disconnectFromFireside(userId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      let connections = this.getFiresideConnections();
      connections = connections.map(conn => 
        conn.uid === userId 
          ? { ...conn, status: 'offline' as const, lastSeen: new Date().toISOString() }
          : conn
      );
      localStorage.setItem(this.FIRESIDE_KEY, JSON.stringify(connections));
      
      console.log('[v0] Pi Fireside - Disconnected:', userId);
    } catch (error) {
      console.error('[v0] Pi Fireside - Disconnect error:', error);
    }
  }
  
  /**
   * Import Pi Network user to Beagvs
   */
  static importPiUser(piUser: PiUser): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.PI_STORAGE_KEY, JSON.stringify(piUser));
      
      // Auto-sync username
      const beagvsUsers = JSON.parse(localStorage.getItem('beagvs_users') || '[]');
      const existingUser = beagvsUsers.find((u: any) => u.piUserId === piUser.uid);
      
      if (existingUser) {
        this.syncPiUsername(existingUser.id, piUser.username);
      }
      
      console.log('[v0] Pi Network - User imported:', piUser.username);
    } catch (error) {
      console.error('[v0] Pi Network - Import error:', error);
    }
  }
  
  /**
   * Get stored Pi user
   */
  static getPiUser(): PiUser | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(this.PI_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
