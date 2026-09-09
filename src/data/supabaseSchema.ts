export const SUPABASE_MASTER_SQL = `-- ==============================================================================
-- NOUB Platform - Hypatia Architecture: Supabase Database Schema
-- Database: PostgreSQL with Supabase Row Level Security (RLS)
-- Organization: NOUB-Platform | Repository: NOUB-Hypatia
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Projects Table (المشاريع والمستودعات)
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'أخرى',
    status TEXT NOT NULL DEFAULT 'نشط',
    description TEXT,
    repo_url TEXT,
    figma_url TEXT,
    live_url TEXT,
    apk_files JSONB DEFAULT '[]'::jsonb,
    drive_assets JSONB DEFAULT '[]'::jsonb,
    reference_chats JSONB DEFAULT '[]'::jsonb,
    context_hints JSONB DEFAULT '[]'::jsonb,
    db_info JSONB DEFAULT '{"engine": "PostgreSQL", "tables": []}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Service Providers & Cloud Vault (المزودين واستضافات السحابة)
CREATE TABLE IF NOT EXISTS public.service_providers (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'استضافة وخوادم',
    portal_url TEXT,
    username TEXT,
    status TEXT NOT NULL DEFAULT 'نشط',
    notes TEXT,
    cost_or_plan TEXT,
    official_badge TEXT,
    active_services JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Contracts & Deliverables (العقود والتسليمات والماليات)
CREATE TABLE IF NOT EXISTS public.contracts (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    title TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    project_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'قيد التنفيذ',
    total_value TEXT,
    currency TEXT DEFAULT 'EGP',
    payment_terms TEXT,
    deliverables JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Domains & Mailboxes (النطاقات والبريد المؤسسي)
CREATE TABLE IF NOT EXISTS public.mashweer_emails (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    address TEXT NOT NULL UNIQUE,
    role_title TEXT NOT NULL,
    department TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'مجدول للتفعيل',
    webmail_url TEXT DEFAULT 'https://mashawer.com.eg:2096',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Project Tasks & Milestones (المهام التشغيلية ومتابعة المطورين)
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'متوسطة',
    status TEXT NOT NULL DEFAULT 'قيد التنفيذ',
    due_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Chat History (سجل محادثات هيباتيا الذكية)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    project_id TEXT,
    sender TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    action_chips JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. System Vault (الخزنة السرية للمفاتيح المشفرة)
CREATE TABLE IF NOT EXISTS public.system_vault (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    key_name TEXT NOT NULL,
    key_value TEXT NOT NULL,
    service_tag TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Row Level Security (RLS) - حماية أمنية صارمة
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mashweer_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects Owner Access" ON public.projects FOR ALL TO authenticated USING (auth.uid() = user_id OR user_id IS NULL) WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Providers Owner Access" ON public.service_providers FOR ALL TO authenticated USING (auth.uid() = user_id OR user_id IS NULL) WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Contracts Owner Access" ON public.contracts FOR ALL TO authenticated USING (auth.uid() = user_id OR user_id IS NULL) WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Mailboxes Owner Access" ON public.mashweer_emails FOR ALL TO authenticated USING (auth.uid() = user_id OR user_id IS NULL) WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Tasks Owner Access" ON public.project_tasks FOR ALL TO authenticated USING (auth.uid() = user_id OR user_id IS NULL) WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Chat Owner Access" ON public.chat_messages FOR ALL TO authenticated USING (auth.uid() = user_id OR user_id IS NULL) WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Vault Owner Access" ON public.system_vault FOR ALL TO authenticated USING (auth.uid() = user_id OR user_id IS NULL) WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_project_id ON public.chat_messages(project_id);
`;

export interface SchemaTableInfo {
  tableName: string;
  arabicName: string;
  description: string;
  fields: { name: string; type: string; purpose: string }[];
  rlsEnabled: boolean;
}

export const SUPABASE_TABLES_SCHEMA: SchemaTableInfo[] = [
  {
    tableName: 'projects',
    arabicName: 'المشاريع والمستودعات',
    description: 'تخزين بيانات جميع تطبيقات المنظومة (نوب، مشاوير، دارو، وكالة، البورصة) ومستودعاتها وروابط فيجما وأصول درايف.',
    rlsEnabled: true,
    fields: [
      { name: 'id', type: 'TEXT PRIMARY KEY', purpose: 'المعرف الفريد للمشروع (مثل: proj-4b, proj-wekala)' },
      { name: 'user_id', type: 'UUID (auth.users)', purpose: 'معرف المالك الوحيد لحماية البيانات عبر RLS' },
      { name: 'name', type: 'TEXT', purpose: 'اسم التطبيق أو المشروع' },
      { name: 'category', type: 'TEXT', purpose: 'التصنيف (مشاوير، منصة، ألعاب، استثمار)' },
      { name: 'repo_url', type: 'TEXT', purpose: 'رابط مستودع GitHub' },
      { name: 'figma_url', type: 'TEXT', purpose: 'رابط تصميم فيجما المعتمد' },
      { name: 'apk_files', type: 'JSONB', purpose: 'سجل إصدارات وتنزيلات APK' },
      { name: 'drive_assets', type: 'JSONB', purpose: 'روابط ملفات جوجل درايف والملفات المرجعية' },
    ],
  },
  {
    tableName: 'service_providers',
    arabicName: 'خزنة المزودين والاستضافات',
    description: 'تخزين بيانات شركات الاستضافة والبرمجيات (المصرية لتكنولوجيا المعلومات، قيمة تك، جوجل كلاود، تيليجرام).',
    rlsEnabled: true,
    fields: [
      { name: 'id', type: 'TEXT PRIMARY KEY', purpose: 'معرف المزود (مثل: prov-ec-egypt)' },
      { name: 'name', type: 'TEXT', purpose: 'اسم المزود والشركة' },
      { name: 'portal_url', type: 'TEXT', purpose: 'بوابة تسجيل الدخول للعملاء' },
      { name: 'cost_or_plan', type: 'TEXT', purpose: 'تكلفة الاشتراك وتاريخ التجديد السنوي' },
      { name: 'active_services', type: 'JSONB', purpose: 'الخدمات المفعلة (الدومينات، استضافة Host1، SSL)' },
    ],
  },
  {
    tableName: 'contracts',
    arabicName: 'العقود والدفعات المالية',
    description: 'تخزين عقود التطوير (مثل عقد قيمة تك لتطبيقات مشاوير ودارو ووكالة)، الشروط الجزائية، والدفعات المالية.',
    rlsEnabled: true,
    fields: [
      { name: 'id', type: 'TEXT PRIMARY KEY', purpose: 'معرف العقد' },
      { name: 'title', type: 'TEXT', purpose: 'عنوان العقد الرسمي' },
      { name: 'provider_name', type: 'TEXT', purpose: 'اسم الطرف الثاني / المزود' },
      { name: 'total_value', type: 'TEXT', purpose: 'القيمة المالية الإجمالية' },
      { name: 'deliverables', type: 'JSONB', purpose: 'بنود التسليم ومراحل استحقاق الدفعات' },
    ],
  },
  {
    tableName: 'mashweer_emails',
    arabicName: 'حسابات البريد والنطاقات',
    description: 'تخزين إيميلات شركة مشاوير الستة على نطاق mashawer.com.eg مع إعدادات الـ Webmail والـ DNS.',
    rlsEnabled: true,
    fields: [
      { name: 'id', type: 'TEXT PRIMARY KEY', purpose: 'معرف البريد' },
      { name: 'address', type: 'TEXT UNIQUE', purpose: 'عنوان البريد (مثل: admin@mashawer.com.eg)' },
      { name: 'role_title', type: 'TEXT', purpose: 'المسمى الوظيفي والدور' },
      { name: 'department', type: 'TEXT', purpose: 'القسم (الإدارة، الدعم، التشغيل، المالية)' },
      { name: 'status', type: 'TEXT', purpose: 'حالة التفعيل (مفعل، قيد الإنشاء)' },
    ],
  },
  {
    tableName: 'project_tasks',
    arabicName: 'المهام ومتابعة المطورين',
    description: 'تتبع مهام التطوير، إصلاحات الأكواد، وطلبات مراجعة الـ PRs.',
    rlsEnabled: true,
    fields: [
      { name: 'id', type: 'TEXT PRIMARY KEY', purpose: 'معرف المهمة' },
      { name: 'project_id', type: 'TEXT', purpose: 'معرف المشروع التابع له' },
      { name: 'title', type: 'TEXT', purpose: 'عنوان المهمة الفنية' },
      { name: 'status', type: 'TEXT', purpose: 'الحالة (قيد التنفيذ، مكتملة)' },
      { name: 'priority', type: 'TEXT', purpose: 'الأولوية (عاجلة، مرتفعة، متوسطة)' },
    ],
  },
  {
    tableName: 'chat_messages',
    arabicName: 'سجل شات هيباتيا',
    description: 'تخزين الاستشارات البرمجية والقرارات التقنية المتخذة مع هيباتيا.',
    rlsEnabled: true,
    fields: [
      { name: 'id', type: 'TEXT PRIMARY KEY', purpose: 'معرف الرسالة' },
      { name: 'project_id', type: 'TEXT', purpose: 'المشروع المستهدف' },
      { name: 'sender', type: 'TEXT', purpose: 'المرسل (user / assistant)' },
      { name: 'text', type: 'TEXT', purpose: 'نص المحادثة والحلول' },
      { name: 'timestamp', type: 'TEXT', purpose: 'وقت الرسالة' },
    ],
  },
  {
    tableName: 'system_vault',
    arabicName: 'الخزنة السرية للمفاتيح',
    description: 'مفاتيح الربط والـ API Tokens الحساسة المشفرة تحت حماية RLS الصارمة.',
    rlsEnabled: true,
    fields: [
      { name: 'id', type: 'TEXT PRIMARY KEY', purpose: 'معرف المفتاح' },
      { name: 'key_name', type: 'TEXT', purpose: 'اسم الرمز أو الخدمة' },
      { name: 'key_value', type: 'TEXT', purpose: 'القيمة المشفرة' },
    ],
  },
];
