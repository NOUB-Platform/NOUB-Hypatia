// ==============================================================================
// قائمة المشاريع الـ 10 الحقيقية لمنظومة نوب وهيباتيا ومشاوير
// مرتبة بالتسلسل المعتمد: 4B (#001)، وكالة (#002)، دارو (#003)، نوب سبورتس (#004)...
// ==============================================================================

export interface ProjectCard {
  id: string;
  number: string; // #001, #002, ...
  name: string;
  nameEn: string;
  category: 'قيد التجربة' | 'موبايل' | 'ويب' | 'مكتمل' | 'خاص';
  badgeColor: string; // Gradient class for circle outer ring
  circleBgColor: string; // Distinct lighter/rich inner background
  icon: string;
  apkStatus: string;
  dashboardStatus: string;
  figmaProgress: number;
  emailsCount: number;
  emailsList?: string[];
  openRequestsCount: number;
  openRequests?: string[];
  nextMeeting: string;
  meetingLink?: string;
  apkLink?: string;
  figmaLink?: string;
  dashboardLink?: string;
  githubLink?: string;
  driveLink?: string;
  notes: string;
  updatedAt?: string;
}

export const OFFICIAL_10_PROJECTS: ProjectCard[] = [
  {
    id: 'proj-4b',
    number: '#001',
    name: 'فور بي (4B App)',
    nameEn: '4B Passenger & Fleet',
    category: 'قيد التجربة',
    badgeColor: 'from-amber-400 via-orange-500 to-rose-600',
    circleBgColor: 'bg-gradient-to-tr from-amber-950/90 to-amber-900/60 text-amber-300 border-amber-500/40',
    icon: '🚗',
    apkStatus: 'استلمنا الـ APK التجريبي للتشغيل والتجربة الميدانية',
    dashboardStatus: 'استلمنا الداش بورد لاختبار العمليات وإدخال وتدقيق البيانات',
    figmaProgress: 95,
    emailsCount: 6,
    emailsList: [
      'admin@4b-app.com',
      'support@4b-app.com',
      'team@4b-app.com',
      'operations@4b-app.com',
      'ceo@4b-app.com',
      'billing@4b-app.com'
    ],
    openRequestsCount: 2,
    openRequests: [
      'مراجعة إشعارات الدفع والخصومات التلقائية',
      'فحص سرعة استجابة الخرائط وتتبع الكابتن المباشر'
    ],
    nextMeeting: 'السبت القادم - 5:00 مساءً',
    meetingLink: 'https://meet.google.com/mashweer-4b-sync',
    apkLink: 'https://drive.google.com/drive/folders/MASHWEER_4B_BUILDS_APK',
    figmaLink: 'https://www.figma.com/design/ulWwUzLnKThS2cfJWDetX6/%D9%85%D8%B4%D8%A7%D9%88%D9%8A%D8%B1---backlog?node-id=221-63531',
    dashboardLink: 'https://dashboard.mashawer.com.eg',
    githubLink: 'https://github.com/mashweer/4b-passenger-app',
    driveLink: 'https://drive.google.com/drive/folders/1MASHWEER_VALUE_TECH_ASSETS',
    notes: 'التطبيق مستلم منه الـ APK والداش بورد ويجري اختبارهما معاً لمطابقة تدفق البيانات من التطبيق إلى لوحة العمليات.'
  },
  {
    id: 'proj-wekala',
    number: '#002',
    name: 'وكالة (WeKaLa)',
    nameEn: 'Wekala Fleet & Agency',
    category: 'موبايل',
    badgeColor: 'from-blue-500 via-indigo-500 to-cyan-400',
    circleBgColor: 'bg-gradient-to-tr from-blue-950/90 to-indigo-900/60 text-sky-300 border-sky-500/40',
    icon: '🏢',
    apkStatus: 'استلمنا الـ APK لتقييم واجهات التصميم فقط على الهاتف',
    dashboardStatus: 'لم نستلم الداش بورد بعد (قيد التطوير من الفريق الخارجي)',
    figmaProgress: 80,
    emailsCount: 4,
    emailsList: [
      'contact@wekala.com',
      'info@wekala.com',
      'dev@wekala.com',
      'partner@wekala.com'
    ],
    openRequestsCount: 4,
    openRequests: [
      'استلام الداش بورد لتقييم إدارة مكاتب الوكلاء والعمولات',
      'تعديل خط القائمة الجانبية في شاشات تسجيل الوكيل',
      'ربط خرائط فروع الوكلاء ومحطات التوزيع',
      'فحص صلاحيات مستخدمي مكاتب الوكالة'
    ],
    nextMeeting: 'الأحد القادم - 6:30 مساءً',
    meetingLink: 'https://meet.google.com/wekala-review',
    apkLink: 'https://drive.google.com/drive/folders/MASHWEER_WEKALA_ASSETS',
    figmaLink: 'https://www.figma.com/design/oYxkmwZcGae674BRA5ZOen/Wikala?node-id=0-1',
    dashboardLink: '',
    githubLink: 'https://github.com/mashweer/wekala-fleet-management',
    driveLink: 'https://drive.google.com/drive/folders/MASHWEER_WEKALA_ASSETS',
    notes: 'استلمنا الـ APK لتقييم التصميم، لكن لا يمكن تقييم مسار البيانات والأرباح حتى استلام لوحة التحكم (Dashboard).'
  },
  {
    id: 'proj-daro',
    number: '#003',
    name: 'دارو (Daro Cargo)',
    nameEn: 'Daro Cargo & Shipping',
    category: 'موبايل',
    badgeColor: 'from-emerald-400 via-teal-500 to-cyan-600',
    circleBgColor: 'bg-gradient-to-tr from-teal-950/90 to-emerald-900/60 text-emerald-300 border-emerald-500/40',
    icon: '📦',
    apkStatus: 'في انتظار رفع نسخة الـ APK الخاصة بقارئ الباركود ومحطات الشحن',
    dashboardStatus: 'لوحة توزيع محطات الشحن قيد التصميم الهندسي',
    figmaProgress: 70,
    emailsCount: 3,
    emailsList: [
      'cargo@mashawer.com.eg',
      'operations@daro.com',
      'support@daro.com'
    ],
    openRequestsCount: 3,
    openRequests: [
      'فحص سرعة قراءة الباركود للطرود عند استلام الشحنة',
      'تجهيز بوليصة الشحن الرقمية وإرسال رسالة SMS للعميل',
      'متابعة أسطول شاحنات النقل بين المدن'
    ],
    nextMeeting: 'الإثنين القادم - 4:30 عصراً',
    meetingLink: '',
    apkLink: '',
    figmaLink: 'https://www.figma.com/design/aR1aanpRzGL7aMoxROGgt5/Daro?node-id=0-1',
    dashboardLink: '',
    githubLink: 'https://github.com/mashweer/daro-cargo-system',
    driveLink: '',
    notes: 'مشروع الشحن اللوجستي بين المدن والمحافظات، يعتمد على محطات التوزيع ومسح باركود الشحنات.'
  },
  {
    id: 'proj-noub-sports',
    number: '#004',
    name: 'نوب سبورتس (NOUB Sports)',
    nameEn: 'NOUB Sports Academies',
    category: 'قيد التجربة',
    badgeColor: 'from-purple-500 via-pink-500 to-rose-500',
    circleBgColor: 'bg-gradient-to-tr from-purple-950/90 to-pink-900/60 text-pink-300 border-pink-500/40',
    icon: '⚽',
    apkStatus: 'نسخة v1.0.0-dev مستلمة وتجري تجربتها مع 3 أكاديميات',
    dashboardStatus: 'لوحة الإدارة مكتملة ومتصلة بقاعدة بيانات Supabase الحية',
    figmaProgress: 95,
    emailsCount: 8,
    emailsList: [
      'noub.platform@gmail.com',
      'sports@noub.com',
      'academies@noub.com',
      'coaches@noub.com',
      'events@noub.com'
    ],
    openRequestsCount: 3,
    openRequests: [
      'جدولة مواعيد البطولات وتقسيم المجموعات',
      'تقرير الحضور والغياب الأسبوعي للسباحة والفروسية',
      'ربط محرك الترتيب الرياضي ELO المعدل'
    ],
    nextMeeting: 'الثلاثاء - 5:00 مساءً',
    meetingLink: 'https://meet.google.com/noub-sports-sync',
    apkLink: 'https://drive.google.com/drive/folders/1NOUB_SPORTS_BUILDS_APK',
    figmaLink: 'https://www.figma.com/design/sports-noub-screens',
    dashboardLink: 'https://sports.noub.org',
    githubLink: 'https://github.com/noub-platform/noub-sports-app',
    driveLink: 'https://drive.google.com/drive/folders/1NOUB_SPORTS_LOGOS_ASSETS_MAIN',
    notes: 'المنظومة الرياضية الشاملة لإدارة الأكاديميات، حساب نقاط الرياضيين، والربط اللحظي مع الجداول.'
  },
  {
    id: 'proj-noub-main',
    number: '#005',
    name: 'نوب الأساسي (NOUB Main)',
    nameEn: 'NOUB Core Platform',
    category: 'ويب',
    badgeColor: 'from-amber-400 via-yellow-500 to-orange-500',
    circleBgColor: 'bg-gradient-to-tr from-yellow-950/90 to-amber-900/60 text-yellow-300 border-yellow-500/40',
    icon: '🏛️',
    apkStatus: 'منصة ويب مركزية شاملة (PWA متجاوب لكافة الأجهزة)',
    dashboardStatus: 'لوحة إدارة المواطنة والعضويات الرقمية جاهزة ومستقرة',
    figmaProgress: 100,
    emailsCount: 5,
    emailsList: [
      'info@noub.org',
      'admin@noub.org',
      'citizens@noub.org',
      'press@noub.org'
    ],
    openRequestsCount: 1,
    openRequests: [
      'تحديث صفحة الرؤية والشهادات الرقمية للمواطنين'
    ],
    nextMeeting: 'الأربعاء - 6:00 مساءً',
    meetingLink: '',
    apkLink: '',
    figmaLink: 'https://www.figma.com/design/noub-main-portal',
    dashboardLink: 'https://noub.org',
    githubLink: 'https://github.com/noub-platform/noub-main-core',
    driveLink: 'https://drive.google.com/drive/folders/1NOUB_MAIN_BRAND_ASSETS',
    notes: 'المركز العصبي العام لمنظومة نوب وإدارة الهوية الرقمية الموحدة لجميع المشاريع.'
  },
  {
    id: 'proj-trading-ops',
    number: '#006',
    name: 'غرفة التداول (Trading Ops)',
    nameEn: 'Financial Trading Room & FIX',
    category: 'خاص',
    badgeColor: 'from-emerald-500 via-green-500 to-teal-400',
    circleBgColor: 'bg-gradient-to-tr from-green-950/90 to-emerald-900/60 text-green-300 border-green-500/40',
    icon: '📈',
    apkStatus: 'نظام داخلي على شاشات غرفة العمليات وأجهزة المتداولين',
    dashboardStatus: 'لوحة مراقبة خطوط الربط ومصر للمقاصة وبث الأسعار تعمل في الإنتاج',
    figmaProgress: 100,
    emailsCount: 6,
    emailsList: [
      'trading@noub.org',
      'mcdr-liaison@noub.org',
      'risk@noub.org',
      'ops@noub.org'
    ],
    openRequestsCount: 1,
    openRequests: [
      'مراجعة كفاءة خط الفايبر الاحتياطي (DR) مع مصر للمقاصة'
    ],
    nextMeeting: 'الخميس - 10:00 صباحاً (قبل جلسة البورصة)',
    meetingLink: '',
    apkLink: '',
    figmaLink: '',
    dashboardLink: 'https://trading.noub.org',
    githubLink: 'https://github.com/noub-platform/trading-ops-engine',
    driveLink: 'https://drive.google.com/drive/folders/1TRADING_CLEARING_CERTS',
    notes: 'مراقبة خطوط الربط المؤجرة اللحظية مع MIST ومباشر وبورصة الأوراق المالية والتحقق من زمن التأخير.'
  },
  {
    id: 'proj-noub-game',
    number: '#007',
    name: 'لعبة نوب (NOUB Game)',
    nameEn: 'Tomb Puzzles of Egypt',
    category: 'موبايل',
    badgeColor: 'from-violet-500 via-purple-600 to-indigo-600',
    circleBgColor: 'bg-gradient-to-tr from-violet-950/90 to-purple-900/60 text-purple-300 border-purple-500/40',
    icon: '🏺',
    apkStatus: 'بناء النسخة التجريبية للمقابر الخمس الأولى (KV62)',
    dashboardStatus: 'لوحة إدارة الألغاز وحفظ تقدم اللاعبين قيد الاختبار',
    figmaProgress: 85,
    emailsCount: 2,
    emailsList: ['game@noub.org', 'creators@noub.org'],
    openRequestsCount: 2,
    openRequests: [
      'اعتماد المؤثرات الصوتية للأبواب والمفاتيح الحجرية',
      'تأكيد استجابة الألغاز المنطقية في وضع الأوفلاين'
    ],
    nextMeeting: 'السبت - 7:00 مساءً',
    meetingLink: '',
    apkLink: '',
    figmaLink: '',
    dashboardLink: '',
    githubLink: 'https://github.com/noub-platform/noub-tomb-puzzles',
    driveLink: '',
    notes: 'لعبة الألغاز الثقافية المصرية القديمة، 62 مقبرة في وادي الملوك مع جوائز بطاقات كنوز نوب.'
  },
  {
    id: 'proj-hypatia-ops',
    number: '#008',
    name: 'هيباتيا (Hypatia Ops)',
    nameEn: 'Senior Tech & Ops Engine',
    category: 'مكتمل',
    badgeColor: 'from-amber-400 via-teal-400 to-emerald-400',
    circleBgColor: 'bg-gradient-to-tr from-teal-950/90 to-slate-900 text-teal-300 border-teal-500/40',
    icon: '⚡',
    apkStatus: 'واجهة البطاقات والمذكرات السريعة (مكتملة ومتاحة لك)',
    dashboardStatus: 'تعمل لحظياً مع إمكانية تصدير ونسخ المذكرات بنقرة واحدة',
    figmaProgress: 100,
    emailsCount: 2,
    emailsList: ['hypatia@noub.org'],
    openRequestsCount: 0,
    openRequests: [],
    nextMeeting: 'جاهز للمساعدة وإعداد المذكرات فورياً 24/7',
    meetingLink: '',
    apkLink: '',
    figmaLink: '',
    dashboardLink: 'https://hypatia.noub.org',
    githubLink: 'https://github.com/noub-platform/NOUB-Hypatia',
    driveLink: '',
    notes: 'المحرك الذي تستخدمه الآن لتلخيص موقف كل مشروع، وتوليد مذكرات التوجيه لأي نموذج ذكاء اصطناعي.'
  },
  {
    id: 'proj-paycore',
    number: '#009',
    name: 'بوابة الدفع (PayCore)',
    nameEn: 'Payment & Wallet Core',
    category: 'ويب',
    badgeColor: 'from-teal-400 via-cyan-500 to-blue-600',
    circleBgColor: 'bg-gradient-to-tr from-cyan-950/90 to-blue-900/60 text-cyan-300 border-cyan-500/40',
    icon: '💳',
    apkStatus: 'حزمة SDK للدفع الإلكتروني مدمجة في فور بي ونوب سبورتس',
    dashboardStatus: 'لوحة متابعة العمليات المالية والمحافظ والحركات اليومية نشطة',
    figmaProgress: 100,
    emailsCount: 4,
    emailsList: ['pay@noub.org', 'finance@noub.org', 'disputes@noub.org'],
    openRequestsCount: 1,
    openRequests: [
      'تجديد شهادات Webhook لمزود الدفع البنكي'
    ],
    nextMeeting: 'الأحد القادم - 11:00 صباحاً',
    meetingLink: '',
    apkLink: '',
    figmaLink: '',
    dashboardLink: 'https://pay.noub.org',
    githubLink: 'https://github.com/noub-platform/paycore-gateway',
    driveLink: '',
    notes: 'محرك الربط المالي وبوابات الدفع والمحافظ الرقمية المشتركة لمشاريع المنظومة.'
  },
  {
    id: 'proj-academy-pro',
    number: '#010',
    name: 'أكاديمي برو (Academy Pro)',
    nameEn: 'Coaching & Athlete Metrics',
    category: 'موبايل',
    badgeColor: 'from-rose-500 via-orange-500 to-amber-500',
    circleBgColor: 'bg-gradient-to-tr from-rose-950/90 to-orange-900/60 text-rose-300 border-rose-500/40',
    icon: '🏆',
    apkStatus: 'في انتظار رفع أول APK تجريبي للمدربين على متجر الاختبار الداخلي',
    dashboardStatus: 'جاهزة لإدخال تقييمات واختبارات اللياقة وسجل القياسات',
    figmaProgress: 75,
    emailsCount: 3,
    emailsList: ['coaching@academypro.com', 'scouts@academypro.com'],
    openRequestsCount: 2,
    openRequests: [
      'تحديث شارات الإنجازات والجوائز الرقمية للأبطال',
      'تحديد صلاحيات مساعد المدرب مقابل المدير الفني'
    ],
    nextMeeting: 'الأربعاء - 5:00 مساءً',
    meetingLink: '',
    apkLink: '',
    figmaLink: '',
    dashboardLink: '',
    githubLink: '',
    driveLink: '',
    notes: 'تطبيق قياس أداء ولياقة اللاعبين الصاعدين في الأكاديميات وربطه بملفات المتابعة الفنية.'
  }
];

export const SUPABASE_CLEAN_REBUILD_SQL = `-- ==============================================================================
-- مشروع هيباتيا ونوب: إعادة بناء قاعدة البيانات بصيغة نظيفة ومباشرة
-- الجداول الـ 10 الحقيقية للمشاريع، بدون RLS معقد في البداية لتسهيل التجربة
-- ==============================================================================

-- 1. جدول المشاريع والبطاقات (Projects Cards)
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL,
    name TEXT NOT NULL,
    name_en TEXT,
    category TEXT NOT NULL DEFAULT 'موبايل',
    badge_color TEXT DEFAULT 'from-amber-400 to-rose-500',
    icon TEXT DEFAULT '📱',
    apk_status TEXT,
    dashboard_status TEXT,
    figma_progress INTEGER DEFAULT 0,
    emails_count INTEGER DEFAULT 0,
    emails_list JSONB DEFAULT '[]'::jsonb,
    open_requests_count INTEGER DEFAULT 0,
    open_requests JSONB DEFAULT '[]'::jsonb,
    next_meeting TEXT,
    meeting_link TEXT,
    apk_link TEXT,
    figma_link TEXT,
    dashboard_link TEXT,
    github_link TEXT,
    drive_link TEXT,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- تعطيل RLS مؤقتاً لتسهيل التجربة كما طلبت
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- 2. جدول الملاحظات والطلبات السريعة (Project Requests)
CREATE TABLE IF NOT EXISTS public.project_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    request_text TEXT NOT NULL,
    status TEXT DEFAULT 'معلق',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.project_requests DISABLE ROW LEVEL SECURITY;

-- 3. جدول اجتماعات ومواعيد المشاريع (Project Meetings)
CREATE TABLE IF NOT EXISTS public.project_meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    meeting_time TEXT NOT NULL,
    meeting_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.project_meetings DISABLE ROW LEVEL SECURITY;

-- مسح الجداول القديمة وإدخال البيانات الـ 10 الحقيقية النظيفة
TRUNCATE TABLE public.projects CASCADE;

INSERT INTO public.projects (
  id, number, name, name_en, category, badge_color, icon, apk_status, dashboard_status,
  figma_progress, emails_count, emails_list, open_requests_count, open_requests,
  next_meeting, meeting_link, apk_link, figma_link, dashboard_link, github_link, drive_link, notes
) VALUES
(
  'proj-4b', '#001', 'فور بي (4B App)', '4B Passenger & Fleet', 'قيد التجربة',
  'from-amber-400 via-orange-500 to-rose-600', '🚗',
  'استلمنا الـ APK التجريبي للتشغيل والتجربة الميدانية',
  'استلمنا الداش بورد لاختبار العمليات وإدخال وتدقيق البيانات',
  95, 6, '["admin@4b-app.com","support@4b-app.com","team@4b-app.com","operations@4b-app.com","ceo@4b-app.com","billing@4b-app.com"]'::jsonb,
  2, '["مراجعة إشعارات الدفع والخصومات التلقائية","فحص سرعة استجابة الخرائط وتتبع الكابتن المباشر"]'::jsonb,
  'السبت القادم - 5:00 مساءً', 'https://meet.google.com/mashweer-4b-sync',
  'https://drive.google.com/drive/folders/MASHWEER_4B_BUILDS_APK',
  'https://www.figma.com/design/ulWwUzLnKThS2cfJWDetX6/%D9%85%D8%B4%D8%A7%D9%88%D9%8A%D8%B1---backlog?node-id=221-63531',
  'https://dashboard.mashawer.com.eg', 'https://github.com/mashweer/4b-passenger-app',
  'https://drive.google.com/drive/folders/1MASHWEER_VALUE_TECH_ASSETS',
  'التطبيق مستلم منه الـ APK والداش بورد ويجري اختبارهما معاً لمطابقة تدفق البيانات من التطبيق إلى لوحة العمليات.'
),
(
  'proj-wekala', '#002', 'وكالة (WeKaLa)', 'Wekala Fleet & Agency', 'موبايل',
  'from-blue-500 via-indigo-500 to-cyan-400', '🏢',
  'استلمنا الـ APK لتقييم واجهات التصميم فقط على الهاتف',
  'لم نستلم الداش بورد بعد (قيد التطوير من الفريق الخارجي)',
  80, 4, '["contact@wekala.com","info@wekala.com","dev@wekala.com","partner@wekala.com"]'::jsonb,
  4, '["استلام الداش بورد لتقييم إدارة مكاتب الوكلاء والعمولات","تعديل خط القائمة الجانبية في شاشات تسجيل الوكيل","ربط خرائط فروع الوكلاء ومحطات التوزيع","فحص صلاحيات مستخدمي مكاتب الوكالة"]'::jsonb,
  'الأحد القادم - 6:30 مساءً', 'https://meet.google.com/wekala-review',
  'https://drive.google.com/drive/folders/MASHWEER_WEKALA_ASSETS',
  'https://www.figma.com/design/oYxkmwZcGae674BRA5ZOen/Wikala?node-id=0-1',
  '', 'https://github.com/mashweer/wekala-fleet-management',
  'https://drive.google.com/drive/folders/MASHWEER_WEKALA_ASSETS',
  'استلمنا الـ APK لتقييم التصميم، لكن لا يمكن تقييم مسار البيانات والأرباح حتى استلام لوحة التحكم (Dashboard).'
),
(
  'proj-daro', '#003', 'دارو (Daro Cargo)', 'Daro Cargo & Shipping', 'موبايل',
  'from-emerald-400 via-teal-500 to-cyan-600', '📦',
  'في انتظار رفع نسخة الـ APK الخاصة بقارئ الباركود ومحطات الشحن',
  'لوحة توزيع محطات الشحن قيد التصميم الهندسي',
  70, 3, '["cargo@mashawer.com.eg","operations@daro.com","support@daro.com"]'::jsonb,
  3, '["فحص سرعة قراءة الباركود للطرود عند استلام الشحنة","تجهيز بوليصة الشحن الرقمية وإرسال رسالة SMS للعميل","متابعة أسطول شاحنات النقل بين المدن"]'::jsonb,
  'الإثنين القادم - 4:30 عصراً', '', '',
  'https://www.figma.com/design/aR1aanpRzGL7aMoxROGgt5/Daro?node-id=0-1',
  '', 'https://github.com/mashweer/daro-cargo-system', '',
  'مشروع الشحن اللوجستي بين المدن والمحافظات، يعتمد على محطات التوزيع ومسح باركود الشحنات.'
),
(
  'proj-noub-sports', '#004', 'نوب سبورتس (NOUB Sports)', 'NOUB Sports Academies', 'قيد التجربة',
  'from-purple-500 via-pink-500 to-rose-500', '⚽',
  'نسخة v1.0.0-dev مستلمة وتجري تجربتها مع 3 أكاديميات',
  'لوحة الإدارة مكتملة ومتصلة بقاعدة بيانات Supabase الحية',
  95, 8, '["noub.platform@gmail.com","sports@noub.com","academies@noub.com","coaches@noub.com","events@noub.com"]'::jsonb,
  3, '["جدولة مواعيد البطولات وتقسيم المجموعات","تقرير الحضور والغياب الأسبوعي للسباحة والفروسية","ربط محرك الترتيب الرياضي ELO المعدل"]'::jsonb,
  'الثلاثاء - 5:00 مساءً', 'https://meet.google.com/noub-sports-sync',
  'https://drive.google.com/drive/folders/1NOUB_SPORTS_BUILDS_APK',
  'https://www.figma.com/design/sports-noub-screens',
  'https://sports.noub.org', 'https://github.com/noub-platform/noub-sports-app',
  'https://drive.google.com/drive/folders/1NOUB_SPORTS_LOGOS_ASSETS_MAIN',
  'المنظومة الرياضية الشاملة لإدارة الأكاديميات، حساب نقاط الرياضيين، والربط اللحظي مع الجداول.'
),
(
  'proj-noub-main', '#005', 'نوب الأساسي (NOUB Main)', 'NOUB Core Platform', 'ويب',
  'from-amber-400 via-yellow-500 to-orange-500', '🏛️',
  'منصة ويب مركزية شاملة (PWA متجاوب لكافة الأجهزة)',
  'لوحة إدارة المواطنة والعضويات الرقمية جاهزة ومستقرة',
  100, 5, '["info@noub.org","admin@noub.org","citizens@noub.org","press@noub.org"]'::jsonb,
  1, '["تحديث صفحة الرؤية والشهادات الرقمية للمواطنين"]'::jsonb,
  'الأربعاء - 6:00 مساءً', '', '',
  'https://www.figma.com/design/noub-main-portal',
  'https://noub.org', 'https://github.com/noub-platform/noub-main-core',
  'https://drive.google.com/drive/folders/1NOUB_MAIN_BRAND_ASSETS',
  'المركز العصبي العام لمنظومة نوب وإدارة الهوية الرقمية الموحدة لجميع المشاريع.'
),
(
  'proj-trading-ops', '#006', 'غرفة التداول (Trading Ops)', 'Financial Trading Room & FIX', 'خاص',
  'from-emerald-500 via-green-500 to-teal-400', '📈',
  'نظام داخلي على شاشات غرفة العمليات وأجهزة المتداولين',
  'لوحة مراقبة خطوط الربط ومصر للمقاصة وبث الأسعار تعمل في الإنتاج',
  100, 6, '["trading@noub.org","mcdr-liaison@noub.org","risk@noub.org","ops@noub.org"]'::jsonb,
  1, '["مراجعة كفاءة خط الفايبر الاحتياطي (DR) مع مصر للمقاصة"]'::jsonb,
  'الخميس - 10:00 صباحاً (قبل جلسة البورصة)', '', '', '',
  'https://trading.noub.org', 'https://github.com/noub-platform/trading-ops-engine',
  'https://drive.google.com/drive/folders/1TRADING_CLEARING_CERTS',
  'مراقبة خطوط الربط المؤجرة اللحظية مع MIST ومباشر وبورصة الأوراق المالية والتحقق من زمن التأخير.'
),
(
  'proj-noub-game', '#007', 'لعبة نوب (NOUB Game)', 'Tomb Puzzles of Egypt', 'موبايل',
  'from-violet-500 via-purple-600 to-indigo-600', '🏺',
  'بناء النسخة التجريبية للمقابر الخمس الأولى (KV62)',
  'لوحة إدارة الألغاز وحفظ تقدم اللاعبين قيد الاختبار',
  85, 2, '["game@noub.org","creators@noub.org"]'::jsonb,
  2, '["اعتماد المؤثرات الصوتية للأبواب والمفاتيح الحجرية","تأكيد استجابة الألغاز المنطقية في وضع الأوفلاين"]'::jsonb,
  'السبت - 7:00 مساءً', '', '', '', '',
  'https://github.com/noub-platform/noub-tomb-puzzles', '',
  'لعبة الألغاز الثقافية المصرية القديمة، 62 مقبرة في وادي الملوك مع جوائز بطاقات كنوز نوب.'
),
(
  'proj-hypatia-ops', '#008', 'هيباتيا (Hypatia Ops)', 'Senior Tech & Ops Engine', 'مكتمل',
  'from-amber-400 via-teal-400 to-emerald-400', '⚡',
  'واجهة البطاقات والمذكرات السريعة (مكتملة ومتاحة لك)',
  'تعمل لحظياً مع إمكانية تصدير ونسخ المذكرات بنقرة واحدة',
  100, 2, '["hypatia@noub.org"]'::jsonb,
  0, '[]'::jsonb,
  'جاهز للمساعدة وإعداد المذكرات فورياً 24/7', '', '', '',
  'https://hypatia.noub.org', 'https://github.com/noub-platform/NOUB-Hypatia', '',
  'المحرك الذي تستخدمه الآن لتلخيص موقف كل مشروع، وتوليد مذكرات التوجيه لأي نموذج ذكاء اصطناعي.'
),
(
  'proj-paycore', '#009', 'بوابة الدفع (PayCore)', 'Payment & Wallet Core', 'ويب',
  'from-teal-400 via-cyan-500 to-blue-600', '💳',
  'حزمة SDK للدفع الإلكتروني مدمجة في فور بي ونوب سبورتس',
  'لوحة متابعة العمليات المالية والمحافظ والحركات اليومية نشطة',
  100, 4, '["pay@noub.org","finance@noub.org","disputes@noub.org"]'::jsonb,
  1, '["تجديد شهادات Webhook لمزود الدفع البنكي"]'::jsonb,
  'الأحد القادم - 11:00 صباحاً', '', '', '',
  'https://pay.noub.org', 'https://github.com/noub-platform/paycore-gateway', '',
  'محرك الربط المالي وبوابات الدفع والمحافظ الرقمية المشتركة لمشاريع المنظومة.'
),
(
  'proj-academy-pro', '#010', 'أكاديمي برو (Academy Pro)', 'Coaching & Athlete Metrics', 'موبايل',
  'from-rose-500 via-orange-500 to-amber-500', '🏆',
  'في انتظار رفع أول APK تجريبي للمدربين على متجر الاختبار الداخلي',
  'جاهزة لإدخال تقييمات واختبارات اللياقة وسجل القياسات',
  75, 3, '["coaching@academypro.com","scouts@academypro.com"]'::jsonb,
  2, '["تحديث شارات الإنجازات والجوائز الرقمية للأبطال","تحديد صلاحيات مساعد المدرب مقابل المدير الفني"]'::jsonb,
  'الأربعاء - 5:00 مساءً', '', '', '', '', '', '',
  'تطبيق قياس أداء ولياقة اللاعبين الصاعدين في الأكاديميات وربطه بملفات المتابعة الفنية.'
);
`;
