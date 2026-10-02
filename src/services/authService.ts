import { User } from '@/types';
import { createClient } from '../lib/supabase/client';

const AUTH_STORAGE_KEY = 'documind_auth_user';

const DEMO_USER: User = {
  id: 'usr-demo-001',
  name: 'Demo User',
  email: 'demo@documind.ai',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isDemo: true,
};

type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar?: string;
  };
};

type ProfileRow = {
  user_id: string;
  full_name?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  city?: string | null;
  country?: string | null;
  avatar_url?: string | null;
};

function mapUser(
  supabaseUser: SupabaseUser,
  profile?: ProfileRow | null
): User {
  return {
    id: supabaseUser.id,
    name:
      profile?.full_name ||
      supabaseUser.user_metadata?.name ||
      supabaseUser.email?.split('@')[0] ||
      'User',
    email: supabaseUser.email || '',
    avatar:
      profile?.avatar_url ||
      supabaseUser.user_metadata?.avatar ||
      undefined,
    phone: profile?.phone || undefined,
    dateOfBirth: profile?.date_of_birth || undefined,
    city: profile?.city || undefined,
    country: profile?.country || undefined,
    isDemo: false,
  };
}

async function getProfile(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function ensureProfile(
  supabase: ReturnType<typeof createClient>,
  supabaseUser: SupabaseUser
): Promise<ProfileRow> {
  const existing = await getProfile(supabase, supabaseUser.id);

  if (existing) {
    return existing;
  }

  const profile = {
    user_id: supabaseUser.id,
    full_name:
      supabaseUser.user_metadata?.name ||
      supabaseUser.email?.split('@')[0] ||
      'User',
    avatar_url: supabaseUser.user_metadata?.avatar || null,
  };

  const { data, error } = await supabase
  .from('profiles')
  .upsert(profile, {
    onConflict: 'user_id',
  })
  .select()
  .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();

    if (!error && data.user) {
      const profile = await ensureProfile(supabase, data.user);

      return mapUser(data.user, profile);
    }

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

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Unable to sign in.');
    }

    const profile = await ensureProfile(supabase, data.user);

    return mapUser(data.user, profile);
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
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Unable to create account.');
    }

    const profile = await ensureProfile(supabase, data.user);

    return mapUser(data.user, profile);
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

  async updateProfile(
    updates: Partial<User>
  ): Promise<User> {
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('You must be logged in.');
    }

    const profileUpdates = {
      user_id: user.id,
      full_name: updates.name?.trim() || null,
      phone: updates.phone?.trim() || null,
      date_of_birth: updates.dateOfBirth || null,
      city: updates.city?.trim() || null,
      country: updates.country?.trim() || null,
      avatar_url: updates.avatar || null,
      updated_at: new Date().toISOString(),
    };

    const { data: profile, error: profileError } =
      await supabase
        .from('profiles')
        .upsert(profileUpdates, {
          onConflict: 'user_id',
        })
        .select()
        .single();

    if (profileError) {
      throw new Error(profileError.message);
    }

    const { data: authData, error: authError } =
      await supabase.auth.updateUser({
        data: {
          name: updates.name,
          avatar: updates.avatar,
        },
      });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Unable to update profile.');
    }

    return mapUser(authData.user, profile);
  },
};