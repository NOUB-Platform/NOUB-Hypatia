import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from localStorage (if configured via UI) or fallback to env vars
export const getSupabaseConfig = () => {
  const localUrl = localStorage.getItem('hypatia_supabase_url');
  const localKey = localStorage.getItem('hypatia_supabase_anon_key');

  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const url = localUrl || envUrl || '';
  const anonKey = localKey || envKey || '';

  return { url, anonKey, isConfigured: Boolean(url && anonKey) };
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!clientInstance) {
    try {
      clientInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return clientInstance;
};

export const resetSupabaseClient = () => {
  clientInstance = null;
};

// Check connection to Supabase
export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'مفاتيح Supabase غير مدخلة بعد (URL و Anon Key).' };
  }

  try {
    const { error } = await client.from('projects').select('id').limit(1);
    if (error) {
      // If table does not exist, schema hasn't been created yet
      if (error.code === '42P01') {
        return { 
          success: true, 
          message: 'تم الاتصال بسوبابيز بنجاح! لم يتم إنشاء الجداول بعد؛ يرجى تشغيل كود الـ SQL في Supabase SQL Editor.' 
        };
      }
      return { success: false, message: `استجابة سوبابيز: ${error.message}` };
    }
    return { success: true, message: 'الاتصال متصل وسليم تماماً مع جداول سوبابيز!' };
  } catch (err: any) {
    return { success: false, message: `تعذر الاتصال: ${err.message}` };
  }
};
