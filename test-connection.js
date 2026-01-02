import { supabase } from '@/lib/supabase-client';

export default async function TestConnection() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error: error.message };
    }
    console.log('Supabase connection successful');
    return { success: true, data };
  } catch (err) {
    console.error('Test failed:', err);
    return { success: false, error: String(err) };
  }
}