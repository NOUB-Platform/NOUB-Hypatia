-- ==============================================================================
-- NOUB Platform - Hypatia Seed Data
-- Run this in Supabase SQL Editor to populate all projects, providers, contracts, & emails
-- ==============================================================================

-- 1. Insert/Update Projects (المشاريع الثمانية الأساسية)
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

-- 2. Insert/Update Service Providers (مزودي الخدمات والخزنة)
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

-- 3. Insert/Update Contracts (العقود والتسليمات المالية)
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

-- 4. Insert/Update Mashweer Employee Emails (إيميلات مشاوير الـ 6)
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

-- 5. Insert Initial Project Tasks (المهام التشغيلية المبدئية)
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
