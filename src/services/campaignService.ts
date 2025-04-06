import { supabase } from '@/lib/supabase';
import type { Campaign } from '@/data/campaigns';
import type { Database } from '@/types/supabase';

type SupabaseCampaign = Database['public']['Tables']['campaigns']['Row'];

// Converter to transform Supabase campaign to frontend campaign format
const toFrontendCampaign = (campaign: SupabaseCampaign): Campaign => {
  const endDate = new Date(campaign.end_date);
  const currentDate = new Date();
  const differenceInTime = endDate.getTime() - currentDate.getTime();
  const daysLeft = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  return {
    id: campaign.id,
    title: campaign.title,
    description: campaign.description,
    story: campaign.story,
    category: campaign.category,
    image: campaign.image,
    goal: campaign.goal,
    raised: campaign.raised,
    daysLeft: daysLeft > 0 ? daysLeft : 0,
    backers: 0, // We'll update this with a separate query
    creator: campaign.creator_id,
  };
};

export const fetchCampaigns = async () => {
  try {
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // For each campaign, get the count of backers
    const campaignsWithBackers = await Promise.all(
      campaigns.map(async (campaign) => {
        const { count } = await supabase
          .from('contributions')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id);

        return {
          ...toFrontendCampaign(campaign),
          backers: count || 0,
        };
      })
    );

    return campaignsWithBackers;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

export const fetchCampaignById = async (id: string) => {
  try {
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!campaign) throw new Error('Campaign not found');

    // Get the count of backers
    const { count } = await supabase
      .from('contributions')
      .select('*', { count: 'exact', head: true })
      .eq('campaign_id', id);

    return {
      ...toFrontendCampaign(campaign),
      backers: count || 0,
    };
  } catch (error) {
    console.error(`Error fetching campaign with id ${id}:`, error);
    throw error;
  }
};

export const createCampaign = async (campaignData: Omit<Database['public']['Tables']['campaigns']['Insert'], 'id' | 'raised' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([{ ...campaignData, raised: 0 }])
      .select()
      .single();

    if (error) throw error;
    return toFrontendCampaign(data);
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};

export const updateCampaign = async (id: string, updateData: Database['public']['Tables']['campaigns']['Update']) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toFrontendCampaign(data);
  } catch (error) {
    console.error(`Error updating campaign with id ${id}:`, error);
    throw error;
  }
};

export const deleteCampaign = async (id: string) => {
  try {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting campaign with id ${id}:`, error);
    throw error;
  }
};
