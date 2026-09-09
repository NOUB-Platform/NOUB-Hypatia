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
    user_id UUID,
    address TEXT NOT NULL UNIQUE,
    role_title TEXT NOT NULL,
    department TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'مجدول للتفعيل',
    quota TEXT DEFAULT '5 GB',
    assigned_to TEXT,
    webmail_url TEXT DEFAULT 'https://mashawer.com.eg:2096',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist even if table was created previously
ALTER TABLE public.mashweer_emails ADD COLUMN IF NOT EXISTS quota TEXT DEFAULT '5 GB';
ALTER TABLE public.mashweer_emails ADD COLUMN IF NOT EXISTS assigned_to TEXT;
ALTER TABLE public.mashweer_emails ADD COLUMN IF NOT EXISTS webmail_url TEXT DEFAULT 'https://mashawer.com.eg:2096';
ALTER TABLE public.mashweer_emails ADD COLUMN IF NOT EXISTS notes TEXT;

-- 5. Project Tasks & Milestones (المهام التشغيلية ومتابعة المطورين)
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id TEXT PRIMARY KEY,
    user_id UUID,
    project_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'متوسطة',
    status TEXT NOT NULL DEFAULT 'قيد التنفيذ',
    due_date TEXT,
    assigned_to TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist even if table was created previously
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS assigned_to TEXT;
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS description TEXT;

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

-- 8. Row Level Security (RLS) - حماية مع تمكين مفتاح الوصول Anon Key والـ Authenticated
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mashweer_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_vault ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Projects Access" ON public.projects;
CREATE POLICY "Projects Access" ON public.projects FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Providers Access" ON public.service_providers;
CREATE POLICY "Providers Access" ON public.service_providers FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Contracts Access" ON public.contracts;
CREATE POLICY "Contracts Access" ON public.contracts FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Mailboxes Access" ON public.mashweer_emails;
CREATE POLICY "Mailboxes Access" ON public.mashweer_emails FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Tasks Access" ON public.project_tasks;
CREATE POLICY "Tasks Access" ON public.project_tasks FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Chat Access" ON public.chat_messages;
CREATE POLICY "Chat Access" ON public.chat_messages FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Vault Access" ON public.system_vault;
CREATE POLICY "Vault Access" ON public.system_vault FOR ALL TO public USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_project_id ON public.chat_messages(project_id);
`;

export const SUPABASE_SEED_SQL = `-- ==============================================================================
-- NOUB Platform - Hypatia Initial Data Seed (تعبئة المشاريع والمزودين والإيميلات)
-- Run this in Supabase SQL Editor to instantly populate all tables!
-- ==============================================================================

-- 0. Ensure columns exist even if tables were created with an older schema
ALTER TABLE IF EXISTS public.mashweer_emails ADD COLUMN IF NOT EXISTS quota TEXT DEFAULT '5 GB';
ALTER TABLE IF EXISTS public.mashweer_emails ADD COLUMN IF NOT EXISTS assigned_to TEXT;
ALTER TABLE IF EXISTS public.mashweer_emails ADD COLUMN IF NOT EXISTS webmail_url TEXT DEFAULT 'https://mashawer.com.eg:2096';
ALTER TABLE IF EXISTS public.mashweer_emails ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE IF EXISTS public.project_tasks ADD COLUMN IF NOT EXISTS assigned_to TEXT;
ALTER TABLE IF EXISTS public.project_tasks ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE IF EXISTS public.project_tasks ADD COLUMN IF NOT EXISTS description TEXT;

-- 1. Insert Projects (المشاريع الـ 8 الأساسية)
INSERT INTO public.projects (id, name, code, category, status, description, repo_url, figma_url, live_url, apk_files, drive_assets, reference_chats, context_hints, db_info)
VALUES
(
    'proj-noub-sports',
    'نوب سبورتس (NOUB Sports)',
    'NOUB-SPORTS',
    'نوب NOUB',
    'قيد التطوير',
    'منظومة الأنشطة والمتابعة الرياضية والفروسية والسباحة وإدارة المنافسات وربط البيانات الحية.',
    'github.com/noub-platform/noub-sports-app',
    'https://www.figma.com/design/sports-noub-screens',
    'https://sports.noub.org',
    '[{"id":"apk-noub-s-1","version":"v1.0.0-dev","buildNumber":10,"fileName":"NOUB_Sports_v1.0.0.apk","fileSize":"31.2 MB","uploadedAt":"اليوم","status":"جاهز للاختبار"}]'::jsonb,
    '[{"id":"drive-s-1","name":"شعار نوب سبورتس ومجلد التصاميم","pathOrUrl":"https://drive.google.com/drive/folders/1NOUB_SPORTS_LOGOS_ASSETS_MAIN","type":"logos"}]'::jsonb,
    '[{"id":"chat-1","title":"جلسة التخطيط الرياضي خوارزمية ELO","platform":"Claude","url":"https://claude.ai"}]'::jsonb,
    '["اللوجوهات الأساسية والـ Vector assets في مجلد Drive الخاص بـ NOUB Sports."]'::jsonb,
    '{"engine":"PostgreSQL / Supabase","tables":["athletes","competitions","performance_logs","scores"]}'::jsonb
),
(
    'proj-noub-main',
    'نوب الأساسي (NOUB Main)',
    'NOUB-MAIN',
    'نوب NOUB',
    'قيد التطوير',
    'المنصة الرئيسية الشاملة لمنظومة نوب (NOUB) المتعددة الخدمات، إدارة العضويات والأنشطة الرقمية.',
    'github.com/noub-platform/noub-main-core',
    'https://www.figma.com/design/noub-main-portal',
    'https://noub.org',
    '[]'::jsonb,
    '[{"id":"drive-m-1","name":"مجلد هوية نوب الرئيسية والأصول","pathOrUrl":"https://drive.google.com/drive/folders/1NOUB_MAIN_BRAND_ASSETS","type":"logos"}]'::jsonb,
    '[]'::jsonb,
    '["المركز العصبي لخدمات نوب والتكامل مع الهوية الرقمية."]'::jsonb,
    '{"engine":"PostgreSQL / Supabase","tables":["citizens","memberships","activity_logs","rewards"]}'::jsonb
),
(
    'proj-trading-ops',
    'غرفة عمليات التداول والربط (Trading Ops)',
    'TRADING-OPS',
    'أنظمة مالية وتداول',
    'نشط ومراقب',
    'غرفة العمليات المركزية لمتابعة محفظة التداول، خطوط الربط المباشرة مع البورصة ومصر للمقاصة وشركات الوساطة.',
    'github.com/noub-platform/trading-ops-engine',
    '',
    'https://trading.noub.org',
    '[]'::jsonb,
    '[{"id":"drive-t-1","name":"مستندات اعتمادات الربط المالي والشهادات","pathOrUrl":"https://drive.google.com/drive/folders/1TRADING_CLEARING_CERTS","type":"docs"}]'::jsonb,
    '[]'::jsonb,
    '["خطوط الربط مع MIST ومباشر والشركة المصرية لخدمات التداول."]'::jsonb,
    '{"engine":"TimescaleDB / PostgreSQL","tables":["order_book","executions","audit_logs"]}'::jsonb
),
(
    'proj-mashweer-4b',
    'تطبيق وسائق مشاوير 4B (Mashweer 4B)',
    'MASHWEER-4B',
    'نقل ولوجستيات',
    'تسليم وتطوير متقدم',
    'تطبيق طلب الرحلات وتوصيل الأفراد والشحنات مع واجهات الركاب والسائقين ولوحة الإدارة المشتركة.',
    'github.com/noub-platform/mashweer-rider-driver',
    'https://www.figma.com/design/mashweer-rider-driver-4b',
    'https://mashawer.com.eg',
    '[{"id":"apk-m-1","version":"v2.4.1-rc","buildNumber":24,"fileName":"Mashweer_Driver_4B.apk","fileSize":"42.5 MB","uploadedAt":"2026-09-08","status":"قيد مراجعة التسليم"}]'::jsonb,
    '[{"id":"drive-mash-1","name":"مجلد عقود قيمة تك ومخططات مسارات مشاوير","pathOrUrl":"https://drive.google.com/drive/folders/1MASHWEER_VALUE_TECH_ASSETS","type":"design"}]'::jsonb,
    '[]'::jsonb,
    '["عقد قيمة تك ينص على تسليم تطبيق الراكب والسائق ولوحة التحكم."]'::jsonb,
    '{"engine":"PostgreSQL / PostGIS","tables":["trips","drivers","riders","locations","fares"]}'::jsonb
),
(
    'proj-wekala',
    'تطبيق مزادات وسوق الوكالة (Wekala Auctions)',
    'WEKALA-AUCTION',
    'تجارة ومزادات',
    'قيد المراجعة والاعتماد',
    'منصة وتطبيق مزادات الوكالة للسلع النادرة والتجارة المباشرة مع نظام المزايدة اللحظية وإيداع التأمين.',
    'github.com/noub-platform/wekala-auction-app',
    'https://www.figma.com/design/wekala-auction-screens',
    'https://wekala.com.eg',
    '[{"id":"apk-w-1","version":"v1.2.0","buildNumber":12,"fileName":"Wekala_Auctions_v1.2.apk","fileSize":"28.7 MB","uploadedAt":"2026-09-05","status":"معتمد للاختبار"}]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '["المزايدة اللحظية تتطلب زمن تأخير أقل من 200ms عبر Supabase Realtime."]'::jsonb,
    '{"engine":"PostgreSQL","tables":["auctions","bids","items","wallets"]}'::jsonb
),
(
    'proj-daro',
    'تطبيق عقارات ومجتمعات دارو (Daro Real Estate)',
    'DARO-REALESTATE',
    'عقارات ومجتمعات',
    'مراجعة شاشات وقيمة تك',
    'منصة وتطبيق البحث عن العقارات والمجمعات السكنية وحجز الزيارات والوساطة الموثقة.',
    'github.com/noub-platform/daro-realestate-app',
    'https://www.figma.com/design/daro-screens-valuetech',
    'https://daro.eg',
    '[]'::jsonb,
    '[{"id":"drive-d-1","name":"مجلد تصاميم ومخططات دارو العقارية","pathOrUrl":"https://drive.google.com/drive/folders/1DARO_ASSETS_DESIGNS","type":"design"}]'::jsonb,
    '[]'::jsonb,
    '["جاري مطابقة شاشات فيجما مع شاشات تطبيق دارو المستلمة من قيمة تك."]'::jsonb,
    '{"engine":"PostgreSQL","tables":["properties","compounds","leads","appointments"]}'::jsonb
),
(
    'proj-egypt-ec-hosting',
    'استضافة وخوادم المصرية للاتصالات وتكنولوجيا المعلومات (EC Egypt Hosting)',
    'EC-EGYPT-HOSTING',
    'بنية تحتية واستضافة',
    'نشط ومتصل',
    'الخوادم وحجوزات النطاقات والـ DNS واستضافة إيميلات مشاوير الـ 6 المعتمدة لدى الشركة المصرية.',
    'github.com/noub-platform/infrastructure-dns-config',
    '',
    'https://mashawer.com.eg',
    '[]'::jsonb,
    '[{"id":"drive-ec-1","name":"فواتير وعقود استضافة المصرية EC","pathOrUrl":"https://drive.google.com/drive/folders/1EC_EGYPT_HOSTING_INVOICES","type":"docs"}]'::jsonb,
    '[]'::jsonb,
    '["الاستلام غداً صباحاً للبريد المؤسسي والنطاق الرسمي."]'::jsonb,
    '{"engine":"cPanel / DNS Management","tables":["dns_records","mailboxes","subdomains"]}'::jsonb
),
(
    'proj-hypatia-system',
    'نظام ومساعد هيباتيا المركزي (Hypatia AI Orchestration)',
    'HYPATIA-SYSTEM',
    'أنظمة الذكاء الاصطناعي',
    'نشط ومحدث',
    'الواجهة المركزية الموحدة لإدارة كافة المشاريع، الأكواد، الخوادم، والمستودعات تحت مظلة NOUB Platform.',
    'https://github.com/NOUB-Platform/NOUB-Hypatia',
    'https://www.figma.com/design/hypatia-platform-system',
    'https://noub-platform.github.io/NOUB-Hypatia',
    '[]'::jsonb,
    '[{"id":"drive-h-1","name":"مجلد وثائق هيباتيا ومواصفات النظام","pathOrUrl":"https://drive.google.com/drive/folders/1HYPATIA_CORE_SPECS","type":"docs"}]'::jsonb,
    '[]'::jsonb,
    '["المستودع الرئيسي NOUB-Platform/NOUB-Hypatia متصل ومحدث."]'::jsonb,
    '{"engine":"Supabase / PostgreSQL","tables":["projects","service_providers","contracts","mashweer_emails","project_tasks"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    code = EXCLUDED.code,
    category = EXCLUDED.category,
    status = EXCLUDED.status,
    description = EXCLUDED.description,
    repo_url = EXCLUDED.repo_url,
    figma_url = EXCLUDED.figma_url,
    live_url = EXCLUDED.live_url,
    apk_files = EXCLUDED.apk_files,
    drive_assets = EXCLUDED.drive_assets,
    db_info = EXCLUDED.db_info,
    updated_at = NOW();

-- 2. Insert Service Providers (خزنة المزودين والاستضافات)
INSERT INTO public.service_providers (id, name, category, portal_url, username, status, notes, cost_or_plan, official_badge, active_services)
VALUES
(
    'prov-ec-egypt',
    'الشركة المصرية للاتصالات وتكنولوجيا المعلومات (EC Egypt)',
    'استضافة وخوادم ونطاقات',
    'https://cpanel.mashawer.com.eg:2083',
    'mashawer_admin',
    'نشط (استلام الإيميلات غداً)',
    'الجهة المستضيفة لنطاق مشاوير mashawer.com.eg والـ 6 إيميلات المؤسسية على Zoho Lite / cPanel.',
    'خطة استضافة سنوية + نطاق مؤسسي .com.eg',
    'المزود الوطني المعتمد',
    '["حجز نطاق mashawer.com.eg","استضافة سحابية 50 GB","6 إيميلات مؤسسية","إدارة سجلات DNS والـ MX Records"]'::jsonb
),
(
    'prov-value-tech',
    'شركة قيمة تك للبرمجيات (ValueTech Software)',
    'شركات تطوير وتعهيد برمجي',
    'https://valuetech.com.eg/portal',
    'noub_client',
    'تسليم ومتابعة مستمرة',
    'الشركة المتعاقد معها لتطوير تطبيقات مشاوير 4B ودارو العقارية وتسليم ملفات الـ APK ولوحات التحكم.',
    'عقود تطوير برمجية متزامنة',
    'شريك تطوير خارجي',
    '["تطبيق مشاوير الراكب والسائق","تطبيق دارو للعقارات","لوحات تحكم الإدارة (Admin Dashboards)"]'::jsonb
),
(
    'prov-google-cloud',
    'جوجل كلاود (Google Cloud Platform & Firebase)',
    'بنية تحتية وسحابية',
    'https://console.cloud.google.com',
    'noub.platform@gmail.com',
    'نشط',
    'استضافة مشاريع الـ Backend وخرائط Google Maps API لمشاوير ونوب سبورتس والـ Push Notifications.',
    'Pay As You Go مع حصة مجانية',
    'البنية التحتية العالمية',
    '["Google Maps Routes & Geocoding API","Firebase Cloud Messaging (FCM)","Cloud Storage Buckets"]'::jsonb
),
(
    'prov-telegram-bot',
    'منصة تيليجرام للبوتات (Telegram Bot API)',
    'إشعارات وتنبيهات فورية',
    'https://t.me/BotFather',
    '@NOUB_Hypatia_Bot',
    'جاهز للربط',
    'إرسال إشعارات طوارئ النظام، تقارير رحلات مشاوير، وإشعارات الخوادم مباشرة لهاتف المالك.',
    'مجاني تماماً وغير محدود',
    'قناة طوارئ فورية',
    '["إشعارات Telegram اللحظية","تنبيهات انقطاع الخوادم","تقارير العمليات اليومية"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    portal_url = EXCLUDED.portal_url,
    username = EXCLUDED.username,
    status = EXCLUDED.status,
    notes = EXCLUDED.notes,
    cost_or_plan = EXCLUDED.cost_or_plan,
    official_badge = EXCLUDED.official_badge,
    active_services = EXCLUDED.active_services,
    updated_at = NOW();

-- 3. Insert Contracts (العقود والتسليمات المالية)
INSERT INTO public.contracts (id, title, provider_name, project_name, status, total_value, currency, payment_terms, deliverables)
VALUES
(
    'contract-vt-mashweer',
    'عقد تطوير وشاشات تطبيق مشاوير 4B الكامل (الراكب والسائق)',
    'شركة قيمة تك للبرمجيات',
    'مشاوير 4B (Mashweer 4B)',
    'تسليم المرحلة الثالثة',
    '150,000',
    'EGP',
    'دفعة أولى 30%، دفعة ثانية 40%، دفعة نهائية 30% عند اعتماد الـ APK على المتجر',
    '[{"phase":"المرحلة 1: تصاميم UI/UX فيجما","status":"مكتملة ومعتمدة"},{"phase":"المرحلة 2: الواجهات الأمامية والربط المبدئي","status":"مكتملة"},{"phase":"المرحلة 3: تجربة مسار الرحلات الحية واختبار السائق","status":"قيد الاختبار والاعتماد النهائي"}]'::jsonb
),
(
    'contract-vt-daro',
    'عقد تطوير تطبيق دارو للعقارات والمجتمعات السكنية',
    'شركة قيمة تك للبرمجيات',
    'دارو العقارية (Daro)',
    'مراجعة الشاشات المستلمة',
    '110,000',
    'EGP',
    '3 دفعات مقسمة على مراحل الاعتماد',
    '[{"phase":"المرحلة 1: شاشات البحث وفلترة العقارات","status":"مستلمة للمراجعة"},{"phase":"المرحلة 2: لوحة إدارة الوسطاء والمعاينات","status":"قيد البرمجة"}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    provider_name = EXCLUDED.provider_name,
    project_name = EXCLUDED.project_name,
    status = EXCLUDED.status,
    total_value = EXCLUDED.total_value,
    currency = EXCLUDED.currency,
    payment_terms = EXCLUDED.payment_terms,
    deliverables = EXCLUDED.deliverables,
    updated_at = NOW();

-- 4. Insert Mashweer Employee Emails (إيميلات مشاوير الستة)
INSERT INTO public.mashweer_emails (id, address, role_title, department, status, quota, assigned_to, notes)
VALUES
(
    'mail-ceo',
    'ceo@mashawer.com.eg',
    'الرئيس التنفيذي (CEO)',
    'الإدارة العليا',
    'مجدول للتفعيل غداً',
    '10 GB',
    'الإدارة العامة',
    'البريد الرسمي للمراسلات الاستراتيجية والمصرفية والتعاقدات الرسمية.'
),
(
    'mail-operations',
    'operations@mashawer.com.eg',
    'إدارة العمليات والتشغيل الميداني',
    'العمليات',
    'مجدول للتفعيل غداً',
    '5 GB',
    'فريق متابعة الرحلات والسائقين',
    'متابعة أساطيل السيارات وتراخيص السائقين ومشاكل التشغيل اللحظية.'
),
(
    'mail-support',
    'support@mashawer.com.eg',
    'خدمة العملاء والدعم الفني',
    'خدمة العملاء',
    'مجدول للتفعيل غداً',
    '5 GB',
    'فريق دعم الركاب والعملاء',
    'الرد على شكاوى واستفسارات الركاب عبر التطبيق والموقع.'
),
(
    'mail-finance',
    'finance@mashawer.com.eg',
    'الإدارة المالية والحسابات',
    'المالية والمحاسبة',
    'مجدول للتفعيل غداً',
    '5 GB',
    'المحاسب المالي',
    'تسويات السائقين، فواتير الشركة، والتحويلات البنكية واستقطاعات الرحلات.'
),
(
    'mail-tech',
    'tech@mashawer.com.eg',
    'الإدارة التقنية وهندسة البرمجيات',
    'تكنولوجيا المعلومات',
    'مجدول للتفعيل غداً',
    '5 GB',
    'فريق NOUB التقني وهيباتيا',
    'الربط البرمجي مع خوادم المصرية EC، ومتابعة خوادم مشاوير وتكامل الـ APIs.'
),
(
    'mail-info',
    'info@mashawer.com.eg',
    'الاستفسارات العامة والتوظيف',
    'العلاقات العامة',
    'مجدول للتفعيل غداً',
    '5 GB',
    'الاستقبال العام',
    'استقبال طلبات الشراكة التجارية والتوظيف والمراسلات العامة.'
)
ON CONFLICT (id) DO UPDATE SET
    address = EXCLUDED.address,
    role_title = EXCLUDED.role_title,
    department = EXCLUDED.department,
    status = EXCLUDED.status,
    quota = EXCLUDED.quota,
    assigned_to = EXCLUDED.assigned_to,
    notes = EXCLUDED.notes,
    updated_at = NOW();

-- 5. Insert Tasks (المهام التشغيلية المبدئية)
INSERT INTO public.project_tasks (id, title, project_id, status, priority, due_date, assigned_to, notes)
VALUES
(
    'task-ec-mail-setup',
    'استلام وتأكيد تفعيل إيميلات مشاوير الـ 6 من المصرية للاتصالات EC غداً',
    'proj-egypt-ec-hosting',
    'قيد التنفيذ',
    'عاجلة جداً',
    'غداً صباحاً',
    'فريق التقنية + المصرية EC',
    'فحص لوحة cPanel وإعدادات MX Records والتأكد من استقبال البريد عبر الويب ميل والهواتف.'
),
(
    'task-mashweer-apk-review',
    'فحص واختبار حزمة APK الخاصة بمشاوير 4B المستلمة من قيمة تك ومطابقتها مع فيجما',
    'proj-mashweer-4b',
    'قيد التنفيذ',
    'عالية',
    '2026-09-12',
    'هيباتيا وفريق الجودة',
    'التأكد من دقة واجهات طلب الرحلة ومسار الخريطة وزمن استجابة السائق.'
),
(
    'task-supabase-sync-check',
    'تأكيد تشغيل الجداول ومزامنة بيانات نوب وسوبابيز السحابية',
    'proj-hypatia-system',
    'مكتملة',
    'عادية',
    'اليوم',
    'هيباتيا',
    'تم تجهيز كود الـ Schema والـ Seed لكافة مشاريع نوب بنجاح.'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    project_id = EXCLUDED.project_id,
    status = EXCLUDED.status,
    priority = EXCLUDED.priority,
    due_date = EXCLUDED.due_date,
    assigned_to = EXCLUDED.assigned_to,
    notes = EXCLUDED.notes,
    updated_at = NOW();
`;

export const SUPABASE_ALL_IN_ONE_SQL = SUPABASE_MASTER_SQL + '\\n\\n' + SUPABASE_SEED_SQL;

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
