import { User } from '@/types';
import { createClient } from '../lib/supabase/client';

const AUTH_STORAGE_KEY = 'documind_auth_user';

const DEMO_USER: User = {
  id: 'usr-demo-001',
  name: 'Alex Developer',
  email: 'alex.developer@example.com',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'Senior Product Engineer',
  isDemo: true,
};

function mapSupabaseUser(supabaseUser: {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar?: string;
    role?: string;
  };
}): User {
  return {
    id: supabaseUser.id,
    name:
      supabaseUser.user_metadata?.name ||
      supabaseUser.email?.split('@')[0] ||
      'User',
    email: supabaseUser.email || '',
    avatar:
      supabaseUser.user_metadata?.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: supabaseUser.user_metadata?.role || 'Member',
    isDemo: false,
  };
}

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();

    if (!error && data.user) {
      return mapSupabaseUser(data.user);
    }

    // Keep demo login working
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);

        if (stored) {
          const parsed = JSON.parse(stored);

          if (parsed?.isDemo) {
            return parsed;
          }
        }
      } catch {
        // Ignore invalid local storage
      }
    }

    return null;
  },

  async login(email: string, password?: string): Promise<User> {
    if (!password) {
      throw new Error('Password is required.');
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Unable to sign in.');
    }

    return mapSupabaseUser(data.user);
  },

  async signup(
    name: string,
    email: string,
    password?: string
  ): Promise<User> {
    if (!password) {
      throw new Error('Password is required.');
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'Member',
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Unable to create account.');
    }

    return mapSupabaseUser(data.user);
  },

  async loginDemo(): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(DEMO_USER)
      );
    }

    return DEMO_USER;
  },

  async logout(): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const supabase = createClient();

    const { data, error } = await supabase.auth.updateUser({
      data: {
        name: updates.name,
        avatar: updates.avatar,
        role: updates.role,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Unable to update profile.');
    }

    return mapSupabaseUser(data.user);
  },
};