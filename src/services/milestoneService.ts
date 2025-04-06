
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Milestone = Database['public']['Tables']['milestones']['Row'];

export const fetchMilestonesByCampaign = async (campaignId: string) => {
  try {
    const { data: milestones, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('target_date', { ascending: true });

    if (error) throw error;
    return milestones;
  } catch (error) {
    console.error(`Error fetching milestones for campaign ${campaignId}:`, error);
    throw error;
  }
};

export const createMilestone = async (milestoneData: Database['public']['Tables']['milestones']['Insert']) => {
  try {
    const { data, error } = await supabase
      .from('milestones')
      .insert([milestoneData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }
};

export const updateMilestone = async (id: string, updateData: Database['public']['Tables']['milestones']['Update']) => {
  try {
    const { data, error } = await supabase
      .from('milestones')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating milestone with id ${id}:`, error);
    throw error;
  }
};

export const deleteMilestone = async (id: string) => {
  try {
    const { error } = await supabase
      .from('milestones')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting milestone with id ${id}:`, error);
    throw error;
  }
};
