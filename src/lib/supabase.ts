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

// Sync and upload all application data to Supabase tables
export const syncAllDataToSupabase = async (
  projects: any[],
  providers: any[],
  contracts: any[],
  emails: any[],
  tasks: any[]
): Promise<{ success: boolean; message: string; details: Record<string, number> }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'يرجى إدخال مفاتيح Supabase أولاً.', details: {} };
  }

  const details: Record<string, number> = {
    projects: 0,
    service_providers: 0,
    contracts: 0,
    mashweer_emails: 0,
    project_tasks: 0,
  };

  try {
    // 1. Projects
    if (projects && projects.length > 0) {
      const formattedProjects = projects.map(p => ({
        id: p.id,
        name: p.name,
        code: p.code || p.name,
        category: p.category || 'أخرى',
        status: p.status || 'نشط',
        description: p.description || '',
        repo_url: p.repoUrl || '',
        figma_url: p.figmaUrl || '',
        live_url: p.liveUrl || '',
        apk_files: p.apkFiles || [],
        drive_assets: p.driveAssets || [],
        reference_chats: p.referenceChats || [],
        context_hints: p.contextHints || [],
        db_info: p.dbInfo || {},
        updated_at: new Date().toISOString(),
      }));

      const { error: projErr } = await client.from('projects').upsert(formattedProjects);
      if (projErr) throw new Error(`خطأ في جدول المشاريع: ${projErr.message}`);
      details.projects = formattedProjects.length;
    }

    // 2. Providers
    if (providers && providers.length > 0) {
      const formattedProviders = providers.map(pr => ({
        id: pr.id,
        name: pr.name,
        category: pr.category || 'عام',
        portal_url: pr.portalUrl || '',
        username: pr.username || '',
        status: pr.status || 'نشط',
        notes: pr.notes || '',
        cost_or_plan: pr.costOrPlan || '',
        official_badge: pr.officialBadge || '',
        active_services: pr.activeServices || [],
        updated_at: new Date().toISOString(),
      }));

      const { error: provErr } = await client.from('service_providers').upsert(formattedProviders);
      if (provErr) throw new Error(`خطأ في جدول المزودين: ${provErr.message}`);
      details.service_providers = formattedProviders.length;
    }

    // 3. Contracts
    if (contracts && contracts.length > 0) {
      const formattedContracts = contracts.map(c => ({
        id: c.id,
        title: c.title,
        provider_name: c.providerName || '',
        project_name: c.projectName || '',
        status: c.status || 'قيد التنفيذ',
        total_value: c.totalValue || '',
        currency: c.currency || 'EGP',
        payment_terms: c.paymentTerms || '',
        deliverables: c.deliverables || [],
        updated_at: new Date().toISOString(),
      }));

      const { error: conErr } = await client.from('contracts').upsert(formattedContracts);
      if (conErr) throw new Error(`خطأ في جدول العقود: ${conErr.message}`);
      details.contracts = formattedContracts.length;
    }

    // 4. Mashweer Emails
    if (emails && emails.length > 0) {
      const formattedEmails = emails.map(m => ({
        id: m.id,
        address: m.address,
        role_title: m.roleTitle || '',
        department: m.department || '',
        status: m.status || 'نشط',
        quota: m.quota || '5 GB',
        assigned_to: m.assignedTo || '',
        notes: m.notes || '',
        updated_at: new Date().toISOString(),
      }));

      const { error: mailErr } = await client.from('mashweer_emails').upsert(formattedEmails);
      if (mailErr) throw new Error(`خطأ في جدول الإيميلات: ${mailErr.message}`);
      details.mashweer_emails = formattedEmails.length;
    }

    // 5. Tasks
    if (tasks && tasks.length > 0) {
      const formattedTasks = tasks.map(t => ({
        id: t.id,
        title: t.title,
        project_id: t.projectId || '',
        status: t.status || 'قيد التنفيذ',
        priority: t.priority || 'عادية',
        due_date: t.dueDate || '',
        assigned_to: t.assignedTo || '',
        notes: t.notes || '',
        updated_at: new Date().toISOString(),
      }));

      const { error: taskErr } = await client.from('project_tasks').upsert(formattedTasks);
      if (taskErr) throw new Error(`خطأ في جدول المهام: ${taskErr.message}`);
      details.project_tasks = formattedTasks.length;
    }

    return {
      success: true,
      message: `تمت مزامنة كافة البيانات السحابية بنجاح! (${details.projects} مشاريع، ${details.service_providers} مزودين، ${details.mashweer_emails} إيميلات، ${details.contracts} عقود).`,
      details,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `تعذر إتمام المزامنة: ${err.message}`,
      details,
    };
  }
};
