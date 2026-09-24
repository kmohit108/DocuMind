import { User } from '@/types';

const AUTH_STORAGE_KEY = 'documind_auth_user';

const DEMO_USER: User = {
  id: 'usr-demo-001',
  name: 'Alex Developer',
  email: 'alex.developer@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'Senior Product Engineer',
  isDemo: true,
};

export const authService = {
  /**
   * Retrieves the current authenticated user from storage or demo session
   */
  async getCurrentUser(): Promise<User | null> {
    if (typeof window === 'undefined') return DEMO_USER;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Default to demo user for seamless out-of-the-box exploration
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USER));
      return DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  },

  /**
   * Demo or production-ready login abstraction
   */
  async login(email: string, _password?: string): Promise<User> {
    await new Promise((r) => setTimeout(r, 600)); // Simulate realistic network latency
    const user: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Demo User',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Member',
      isDemo: true,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  },

  /**
   * Demo signup
   */
  async signup(name: string, email: string, _password?: string): Promise<User> {
    await new Promise((r) => setTimeout(r, 700));
    const user: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Member',
      isDemo: true,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  },

  /**
   * One-click demo login
   */
  async loginDemo(): Promise<User> {
    await new Promise((r) => setTimeout(r, 400));
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USER));
    }
    return DEMO_USER;
  },

  /**
   * Logs out user and clears local session
   */
  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },

  /**
   * Updates user profile
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const current = (await this.getCurrentUser()) || DEMO_USER;
    const updated: User = { ...current, ...updates };
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  },
};
