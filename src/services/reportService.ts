
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Report = Database['public']['Tables']['reports']['Row'];

export const createReport = async (reportData: Database['public']['Tables']['reports']['Insert']) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([{ ...reportData, status: 'pending' }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

export const fetchReportsByCampaign = async (campaignId: string) => {
  try {
    const { data: reports, error } = await supabase
      .from('reports')
      .select(`
        *,
        users (id, name, avatar_url)
      `)
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return reports;
  } catch (error) {
    console.error(`Error fetching reports for campaign ${campaignId}:`, error);
    throw error;
  }
};

export const updateReportStatus = async (id: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating report status with id ${id}:`, error);
    throw error;
  }
};
