
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type User = Database['public']['Tables']['users']['Row'];

export const getCurrentUser = async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!session) return null;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export const updateUser = async (id: string, updateData: Database['public']['Tables']['users']['Update']) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw error;
  }
};

export const updateUserWalletAddress = async (id: string, walletAddress: string) => {
  return updateUser(id, { wallet_address: walletAddress });
};

export const fetchUserById = async (id: string) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return user;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
};

export const fetchUserCampaigns = async (userId: string) => {
  try {
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return campaigns;
  } catch (error) {
    console.error(`Error fetching campaigns for user ${userId}:`, error);
    throw error;
  }
};
