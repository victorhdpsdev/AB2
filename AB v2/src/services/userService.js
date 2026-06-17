import { supabase } from './supabaseClient.js';

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, email, created_at')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserStats(userId) {
  const { data, error } = await supabase
    .from('user_stats')
    .select('user_id, xp, total_xp, level, streak, created_at')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserSettings(userId) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('user_id, theme, created_at')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
