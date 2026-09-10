import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  ProjectItem, 
  ServiceProviderItem, 
  ContractDeliverable, 
  MashweerEmployeeEmail, 
  ProjectTask 
} from '../types';

// Fallback credentials for NOUB Hypatia Platform Supabase project
const DEFAULT_SUPABASE_URL = 'https://sgtpkxckoxkeavfpeitm.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNndHBreGNrb3hrZWF2ZnBlaXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5ODY0NDMsImV4cCI6MjEwNDU2MjQ0M30.CsihBIxZXL_0_QmvYURNFxsXcZ5SlZ-0lTqAClZkRYs';

// Retrieve credentials from localStorage (if configured via UI) or fallback to env vars / defaults
export const getSupabaseConfig = () => {
  const localUrl = localStorage.getItem('hypatia_supabase_url');
  const localKey = localStorage.getItem('hypatia_supabase_anon_key');

  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const url = localUrl || envUrl || DEFAULT_SUPABASE_URL;
  const anonKey = localKey || envKey || DEFAULT_SUPABASE_ANON_KEY;

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
  projects: ProjectItem[],
  providers: ServiceProviderItem[],
  contracts: ContractDeliverable[],
  emails: MashweerEmployeeEmail[],
  tasks: ProjectTask[]
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
        website: pr.website || '',
        contact_persons: pr.contactPersons || [],
        subscription_date: pr.subscriptionDate || '',
        renewal_date: pr.renewalDate || '',
        cost_or_plan: pr.costOrPlan || '',
        official_badge: pr.officialBadge || '',
        active_services: pr.activeServices || [],
        credentials: pr.credentials || [],
        tasks: pr.tasks || [],
        linked_apps: pr.linkedApps || [],
        notes: pr.notes || '',
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
        app_name: c.appName || '',
        app_code: c.appCode || '',
        developer_name: c.developerName || '',
        contract_status: c.contractStatus || 'جاري العمل',
        target_delivery_date: c.targetDeliveryDate || '',
        source_code_repo: c.sourceCodeRepo || '',
        agreed_price: c.agreedPrice || '',
        paid_amount: c.paidAmount || '',
        remaining_amount: c.remainingAmount || '',
        checklist: c.checklist || [],
        notes: c.notes || '',
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
        employee_name: m.employeeName || '',
        role: m.role || '',
        email_address: m.emailAddress || '',
        status: m.status || 'تم الطلب - موعد الاستلام غداً',
        provider: m.provider || 'Zoho Lite (المصرية لتكنولوجيا المعلومات)',
        created_at: m.createdAt || new Date().toISOString().split('T')[0],
        delivery_date: m.deliveryDate || '',
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
        project_id: t.projectId || '',
        title: t.title,
        description: t.description || '',
        notes: t.notes || '',
        priority: t.priority || 'عاجل',
        status: t.status || 'قيد الانتظار',
        created_at: t.createdAt || new Date().toISOString().split('T')[0],
        due_date: t.dueDate || '',
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

// Fetch all application data from Supabase
export const fetchAllDataFromSupabase = async (): Promise<{
  projects: ProjectItem[] | null;
  providers: ServiceProviderItem[] | null;
  contracts: ContractDeliverable[] | null;
  emails: MashweerEmployeeEmail[] | null;
  tasks: ProjectTask[] | null;
} | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const [projRes, provRes, conRes, mailRes, taskRes] = await Promise.all([
      client.from('projects').select('*').order('created_at', { ascending: true }),
      client.from('service_providers').select('*').order('created_at', { ascending: true }),
      client.from('contracts').select('*').order('created_at', { ascending: true }),
      client.from('mashweer_emails').select('*').order('created_at', { ascending: true }),
      client.from('project_tasks').select('*').order('created_at', { ascending: true }),
    ]);

    const projects: ProjectItem[] | null = projRes.data && projRes.data.length > 0 ? projRes.data.map((p: any) => ({
      id: p.id,
      name: p.name,
      code: p.code,
      category: p.category,
      status: p.status,
      description: p.description,
      repoUrl: p.repo_url,
      figmaUrl: p.figma_url,
      apkFiles: p.apk_files || [],
      driveAssets: p.drive_assets || [],
      referenceChats: p.reference_chats || [],
      contextHints: p.context_hints || [],
      dbInfo: p.db_info || {},
      notes: p.notes,
    })) : null;

    const providers: ServiceProviderItem[] | null = provRes.data && provRes.data.length > 0 ? provRes.data.map((pr: any) => ({
      id: pr.id,
      name: pr.name,
      category: pr.category,
      website: pr.website || '',
      contactPersons: pr.contact_persons || [],
      subscriptionDate: pr.subscription_date || '',
      renewalDate: pr.renewal_date || '',
      costOrPlan: pr.cost_or_plan || '',
      officialBadge: pr.official_badge || '',
      activeServices: pr.active_services || [],
      credentials: pr.credentials || [],
      tasks: pr.tasks || [],
      linkedApps: pr.linked_apps || [],
      notes: pr.notes || '',
    })) : null;

    const contracts: ContractDeliverable[] | null = conRes.data && conRes.data.length > 0 ? conRes.data.map((c: any) => ({
      id: c.id,
      appName: c.app_name || c.appName || '',
      appCode: c.app_code || c.appCode || '',
      developerName: c.developer_name || c.developerName || '',
      contractStatus: c.contract_status || c.contractStatus || 'جاري العمل',
      targetDeliveryDate: c.target_delivery_date || c.targetDeliveryDate || '',
      sourceCodeRepo: c.source_code_repo || c.sourceCodeRepo || '',
      agreedPrice: c.agreed_price || c.agreedPrice || '',
      paidAmount: c.paid_amount || c.paidAmount || '',
      remainingAmount: c.remaining_amount || c.remainingAmount || '',
      checklist: c.checklist || [],
      notes: c.notes || '',
    })) : null;

    const emails: MashweerEmployeeEmail[] | null = mailRes.data && mailRes.data.length > 0 ? mailRes.data.map((m: any) => ({
      id: m.id,
      employeeName: m.employee_name || m.employeeName || '',
      role: m.role || '',
      emailAddress: m.email_address || m.emailAddress || '',
      status: m.status || 'تم الطلب - موعد الاستلام غداً',
      provider: m.provider || 'Zoho Lite (المصرية لتكنولوجيا المعلومات)',
      createdAt: m.created_at || m.createdAt || new Date().toISOString().split('T')[0],
      deliveryDate: m.delivery_date || m.deliveryDate || '',
      notes: m.notes || '',
    })) : null;

    const tasks: ProjectTask[] | null = taskRes.data && taskRes.data.length > 0 ? taskRes.data.map((t: any) => ({
      id: t.id,
      projectId: t.project_id || t.projectId || '',
      title: t.title,
      description: t.description || '',
      notes: t.notes || '',
      priority: t.priority || 'عاجل',
      status: t.status || 'قيد الانتظار',
      createdAt: t.created_at || t.createdAt || new Date().toISOString().split('T')[0],
      dueDate: t.due_date || t.dueDate || '',
    })) : null;

    return { projects, providers, contracts, emails, tasks };
  } catch (err) {
    console.error('Failed to fetch from Supabase:', err);
    return null;
  }
};

