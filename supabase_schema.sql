-- ==============================================================================
-- NOUB Platform - Hypatia Architecture: Supabase Database Schema
-- Database: PostgreSQL with Supabase Row Level Security (RLS)
-- Organization: NOUB-Platform | Repository: NOUB-Hypatia
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. Projects Table (المشاريع والمستودعات)
-- ==============================================================================
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

-- ==============================================================================
-- 3. Service Providers & Cloud Vault (المزودين واستضافات السحابة)
-- ==============================================================================
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

-- ==============================================================================
-- 4. Contracts & Deliverables (العقود والتسليمات والماليات)
-- ==============================================================================
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

-- ==============================================================================
-- 5. Domains & Mailboxes (النطاقات والبريد المؤسسي)
-- ==============================================================================
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

-- ==============================================================================
-- 6. Project Tasks & Milestones (المهام التشغيلية ومتابعة المطورين)
-- ==============================================================================
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

-- ==============================================================================
-- 7. Chat History (سجل محادثات هيباتيا الذكية)
-- ==============================================================================
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

-- ==============================================================================
-- 8. System Vault (الخزنة السرية للمفاتيح المشفرة)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.system_vault (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    key_name TEXT NOT NULL,
    key_value TEXT NOT NULL,
    service_tag TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. Row Level Security (RLS) - حماية مع تمكين مفتاح الوصول Anon Key والـ Authenticated
-- ==============================================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mashweer_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_vault ENABLE ROW LEVEL SECURITY;

-- 9.1 Projects Policies
DROP POLICY IF EXISTS "Projects Owner Access" ON public.projects;
DROP POLICY IF EXISTS "Projects Access" ON public.projects;
CREATE POLICY "Projects Access" ON public.projects
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- 9.2 Service Providers Policies
DROP POLICY IF EXISTS "Providers Owner Access" ON public.service_providers;
DROP POLICY IF EXISTS "Providers Access" ON public.service_providers;
CREATE POLICY "Providers Access" ON public.service_providers
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- 9.3 Contracts Policies
DROP POLICY IF EXISTS "Contracts Owner Access" ON public.contracts;
DROP POLICY IF EXISTS "Contracts Access" ON public.contracts;
CREATE POLICY "Contracts Access" ON public.contracts
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- 9.4 Mailboxes Policies
DROP POLICY IF EXISTS "Mailboxes Owner Access" ON public.mashweer_emails;
DROP POLICY IF EXISTS "Mailboxes Access" ON public.mashweer_emails;
CREATE POLICY "Mailboxes Access" ON public.mashweer_emails
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- 9.5 Tasks Policies
DROP POLICY IF EXISTS "Tasks Owner Access" ON public.project_tasks;
DROP POLICY IF EXISTS "Tasks Access" ON public.project_tasks;
CREATE POLICY "Tasks Access" ON public.project_tasks
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- 9.6 Chat History Policies
DROP POLICY IF EXISTS "Chat Owner Access" ON public.chat_messages;
DROP POLICY IF EXISTS "Chat Access" ON public.chat_messages;
CREATE POLICY "Chat Access" ON public.chat_messages
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- 9.7 System Vault Policies
DROP POLICY IF EXISTS "Vault Owner Access" ON public.system_vault;
DROP POLICY IF EXISTS "Vault Access" ON public.system_vault;
CREATE POLICY "Vault Access" ON public.system_vault
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- 10. Performance Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_project_id ON public.chat_messages(project_id);
