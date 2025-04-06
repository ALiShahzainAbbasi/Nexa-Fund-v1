
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Contribution = Database['public']['Tables']['contributions']['Row'];

export const createContribution = async (contributionData: Database['public']['Tables']['contributions']['Insert']) => {
  try {
    // First, insert the contribution
    const { data: contribution, error } = await supabase
      .from('contributions')
      .insert([contributionData])
      .select()
      .single();

    if (error) throw error;

    // Then, update the campaign's raised amount
    const { error: updateError } = await supabase.rpc('increment_campaign_raised', {
      campaign_id_param: contributionData.campaign_id,
      amount_param: contributionData.amount
    });

    if (updateError) {
      console.error('Error updating campaign raised amount:', updateError);
      // If we can't update the campaign, we should still return the contribution
    }

    return contribution;
  } catch (error) {
    console.error('Error creating contribution:', error);
    throw error;
  }
};

export const fetchContributionsByCampaign = async (campaignId: string) => {
  try {
    const { data: contributions, error } = await supabase
      .from('contributions')
      .select(`
        *,
        users (id, name, avatar_url)
      `)
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return contributions;
  } catch (error) {
    console.error(`Error fetching contributions for campaign ${campaignId}:`, error);
    throw error;
  }
};

export const fetchContributionsByUser = async (userId: string) => {
  try {
    const { data: contributions, error } = await supabase
      .from('contributions')
      .select(`
        *,
        campaigns (id, title, image)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return contributions;
  } catch (error) {
    console.error(`Error fetching contributions for user ${userId}:`, error);
    throw error;
  }
};
