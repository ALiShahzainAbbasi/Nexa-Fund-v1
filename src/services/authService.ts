
import { supabase } from '@/lib/supabase';

export const signUp = async (email: string, password: string, name: string) => {
  try {
    // First, create the auth user
    const { data: { user, session }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) throw error;
    if (!user) throw new Error('User creation failed');

    // Then, add the user to our users table
    const { error: profileError } = await supabase.from('users').insert([
      {
        id: user.id,
        email: user.email || '',
        name,
        created_at: new Date().toISOString()
      }
    ]);

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // We should try to clean up the auth user, but we'll return success for now
    }

    return { user, session };
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { user, session };
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error during password reset:', error);
    throw error;
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};
