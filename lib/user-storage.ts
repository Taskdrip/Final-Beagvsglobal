import type { User } from './database-types';

const USERS_STORAGE_KEY = 'beagvs_users';

export const userStorage = {
  // Get all users
  getAllUsers: (): User[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored, (key, value) => {
      if (key === 'createdAt' || key === 'updatedAt') {
        return new Date(value);
      }
      return value;
    }) : [];
  },

  // Get user by email
  getUserByEmail: (email: string): User | null => {
    const users = userStorage.getAllUsers();
    return users.find(u => u.email === email) || null;
  },

  // Get user by username
  getUserByUsername: (username: string): User | null => {
    const users = userStorage.getAllUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
  },

  // Get user by ID
  getUserById: (id: string): User | null => {
    const users = userStorage.getAllUsers();
    return users.find(u => u.id === id) || null;
  },

  // Add new user
  addUser: (user: User): void => {
    const users = userStorage.getAllUsers();
    // Check if user already exists
    const existingIndex = users.findIndex(u => u.email === user.email);
    if (existingIndex >= 0) {
      // Update existing user
      users[existingIndex] = user;
    } else {
      // Add new user
      users.push(user);
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  },

  // Update user
  updateUser: (userId: string, updates: Partial<User>): void => {
    const users = userStorage.getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index >= 0) {
      users[index] = { ...users[index], ...updates, updatedAt: new Date() };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  },

  // Delete user
  deleteUser: (userId: string): void => {
    const users = userStorage.getAllUsers();
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
  },

  // Follow/Unfollow
  followUser: (currentUserId: string, targetUserId: string): void => {
    const users = userStorage.getAllUsers();
    const currentUserIndex = users.findIndex(u => u.id === currentUserId);
    const targetUserIndex = users.findIndex(u => u.id === targetUserId);
    
    if (currentUserIndex >= 0 && targetUserIndex >= 0) {
      // Add to following
      if (!users[currentUserIndex].following.includes(targetUserId)) {
        users[currentUserIndex].following.push(targetUserId);
      }
      // Add to followers
      if (!users[targetUserIndex].followers.includes(currentUserId)) {
        users[targetUserIndex].followers.push(currentUserId);
      }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  },

  unfollowUser: (currentUserId: string, targetUserId: string): void => {
    const users = userStorage.getAllUsers();
    const currentUserIndex = users.findIndex(u => u.id === currentUserId);
    const targetUserIndex = users.findIndex(u => u.id === targetUserId);
    
    if (currentUserIndex >= 0 && targetUserIndex >= 0) {
      // Remove from following
      users[currentUserIndex].following = users[currentUserIndex].following.filter(id => id !== targetUserId);
      // Remove from followers
      users[targetUserIndex].followers = users[targetUserIndex].followers.filter(id => id !== currentUserId);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  },
};
