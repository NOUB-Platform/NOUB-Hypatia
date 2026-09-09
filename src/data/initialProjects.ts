import { ProjectItem, ProjectTask, ApiEndpointItem } from '../types';

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-noub-sports',
    name: 'نوب سبورتس (NOUB Sports)',
    code: 'NOUB-SPORTS',
    category: 'نوب NOUB',
    description: 'منظومة الأنشطة والمتابعة الرياضية والفروسية والسباحة وإدارة المنافسات وربط البيانات الحية.',
    status: 'قيد التطوير',
    repoUrl: 'github.com/noub-platform/noub-sports-app',
    notes: 'بناء المنظومة بهندسة معمارية مرنة، دعم المتابعة اللحظية ومؤشرات الأداء.',
    driveAssets: [
      {
        id: 'drive-noub-s-logos',
        name: 'مجلد شعارات نوب سبورتس والملفات المفتوحة (Logos & Brand)',
        pathOrUrl: 'https://drive.google.com/drive/folders/1NOUB_SPORTS_LOGOS_ASSETS_MAIN',
        type: 'logos',
        notes: 'يحتوي على شعار نوب سبورتس بصيغ SVG، PNG عالية الدقة، والأيقونات المخصصة للـ Splash Screen والـ App Icon.',
        updatedAt: '2026-09-08'
      },
      {
        id: 'drive-noub-s-ui',
        name: 'تصاميم واجهات الشاشات والأيقونات (UI Mockups & Assets)',
        pathOrUrl: 'https://drive.google.com/drive/folders/1NOUB_SPORTS_UI_SCREENS',
        type: 'design',
        notes: 'شاشات شجرة البطولات، بطاقات اللاعبين، وجداول النتائج المباشرة.',
        updatedAt: '2026-09-08'
      },
      {
        id: 'drive-noub-s-builds',
        name: 'مجلد حزم الـ Builds وملفات APK و AAB',
        pathOrUrl: 'https://drive.google.com/drive/folders/1NOUB_SPORTS_BUILDS_APK',
        type: 'apk',
        notes: 'كل ملف APK أو Bundle يصدره فريق التطوير يتم رفعه هنا لمراجعته واعتماده.',
        updatedAt: '2026-09-08'
      }
    ],
    referenceChats: [
      {
        id: 'ref-chat-claude-rank',
        title: 'جلسة التخطيط المعماري لمحرك الترتيب والتصنيف (Claude)',
        platform: 'Claude',
        url: 'https://claude.ai/chat/share-noub-sports-ranking-algorithm-spec',
        keyTakeaways: 'تم الاتفاق على خوارزمية الترتيب الرياضي ELO المعدلة، مع معالجة التعادل في النقاط وفرق الأهداف أو التوقيت الزمني بدقة، وفصل جدول الحسابات اللحظية عن التقارير التاريخية لتفادي بطء قاعدة البيانات.',
        relevanceToProject: 'الرجوع إليها عند تعديل دوال احتساب النقاط وتصنيف الفرق واللاعبين دون الحاجة لإعادة نقاش القواعد.',
        dateAdded: '2026-09-07'
      },
      {
        id: 'ref-chat-gpt-live-data',
        title: 'جلسة هندسة الـ WebSockets واستقبال البيانات الحية (ChatGPT)',
        platform: 'ChatGPT',
        url: 'https://chatgpt.com/share/noub-sports-live-websocket-architecture',
        keyTakeaways: 'تصميم قنوات Supabase Realtime مع Fallback على Long Polling عند ضعف إشارة 4G في الملاعب الرياضية المفتوحة.',
        relevanceToProject: 'استخدامها كمرجع لمعالجة انقطاع الاتصال واستئناف المزامنة التلقائية (Reconnection Logic).',
        dateAdded: '2026-09-06'
      }
    ],
    contextHints: [
      'اللوجوهات الأساسية والـ Vector assets موجودة في مجلد Drive الخاص بـ NOUB Sports Logos.',
      'أي دالة لتعديل النقاط تعتمد المعايير الموثقة في محادثة كلود (خوارزمية ELO المعدلة).',
      'فحص الـ APK يتم بمقارنة الميزات مع المخطط المعتمد في مجلد الـ UI التصميمي.'
    ],
    dbInfo: {
      type: 'PostgreSQL / Supabase',
      tables: ['athletes', 'competitions', 'performance_logs', 'scores', 'training_sessions'],
      notes: 'جداول سجلات الأداء مهيأة للتحديث المتزامن والتحليل الإحصائي السريع.'
    },
    apkFiles: [
      {
        id: 'apk-noub-s-1',
        version: 'v1.0.0-dev',
        buildNumber: 10,
        fileName: 'NOUB_Sports_v1.0.0.apk',
        fileSize: '31.2 MB',
        uploadedAt: 'اليوم، 01:10 م',
        notes: 'النسخة التجريبية الأولى لمتابعة جلسات التدريب وتسجيل النتائج.',
        status: 'جاهز للاختبار'
      }
    ]
  },
  {
    id: 'proj-noub-main',
    name: 'نوب الأساسي (NOUB Main)',
    code: 'NOUB-MAIN',
    category: 'نوب NOUB',
    description: 'المنصة الرئيسية الشاملة لمنظومة نوب (NOUB) المتعددة الخدمات، إدارة العضويات والأنشطة الرقمية.',
    status: 'قيد التطوير',
    repoUrl: 'github.com/noub-platform/noub-main-core',
    notes: 'المركز العصبي لخدمات نوب، والتكامل مع الهوية الرقمية للعملاء والمستخدمين.',
    dbInfo: {
      type: 'PostgreSQL / Supabase',
      tables: ['citizens', 'memberships', 'activity_logs', 'rewards', 'access_keys'],
      notes: 'هيكلة منظمة للصلاحيات وإدارة البيانات المركزية.'
    },
    apkFiles: []
  },
  {
    id: 'proj-trading-ops',
    name: 'غرفة عمليات التداول والربط (Trading Ops)',
    code: 'TRADE-OPS',
    category: 'مالي وتداول',
    description: 'نظام إدارة غرف تداول الأوراق المالية، مراقبة خطوط الربط، بث الأسعار، والتكامل مع مصر للمقاصة والبورصة المصرية ومزودي الخدمات.',
    status: 'في الإنتاج',
    repoUrl: 'github.com/noub-platform/trading-room-monitor',
    notes: 'المراقبة الفورية لمسارات الشبكة (Primary & DR)، ومزودي بث الأسعار (MIST ومباشر) وحسابات العملاء.',
    dbInfo: {
      type: 'PostgreSQL / Financial In-Memory',
      tables: ['market_ticks', 'mcdr_settlements', 'leased_lines_status', 'broker_orders', 'audit_logs'],
      notes: 'محسن لسرعة الاستجابة بأقل من 10 ملي ثانية (Ultra-Low Latency).'
    },
    apkFiles: []
  },
  {
    id: 'proj-noub-game',
    name: 'مشروع لعبة نوب (NOUB Game)',
    code: 'NOUB-GAME',
    category: 'نوب NOUB',
    description: 'لعبة تفاعلية ثقافية وذكاء تعتمد على الألغاز وتاريخ الحضارة المصرية القديمة (62 مقبرة في وادي الملوك).',
    status: 'قيد التطوير',
    repoUrl: 'github.com/noub-platform/noub-tomb-puzzles',
    notes: 'تكامل الألغاز الرقمية والمنطقية، مع نظام بطاقات المواطنة وجوائز كنوز مصر.',
    dbInfo: {
      type: 'PostgreSQL',
      tables: ['players', 'kv_gates_progress', 'puzzle_sessions', 'inventory', 'rewards_issued'],
      notes: 'تتبع مراحل المقابر الـ 62 وتوثيق إنجاز كل لاعب.'
    },
    apkFiles: []
  },
  {
    id: 'proj-4b',
    name: 'تطبيق فور بي (4B)',
    code: '4B',
    category: 'مشاوير',
    description: 'تطبيق الركاب وحجز الرحلات الفورية والمجدولة مع تتبع المسار وحساب الـ Surge Pricing.',
    status: 'مرحلة الاختبار QA',
    figmaUrl: 'https://www.figma.com/design/ulWwUzLnKThS2cfJWDetX6/%D9%85%D8%B4%D8%A7%D9%88%D9%8A%D8%B1---backlog?node-id=221-63531&t=uCzHJZbEM1gi1Zz8-0',
    repoUrl: 'github.com/mashweer/4b-passenger-app',
    notes: 'بانتظار اعتماد التحديث الأخير من الـ QA بخصوص تجربة الخرائط والدفع.',
    dbInfo: {
      type: 'PostgreSQL / Supabase',
      tables: ['trips', 'passengers', 'saved_addresses', 'ride_ratings', 'coupons'],
      notes: 'التركيز على سرعة استعلام رحلات الراكب السابقة والتخزين المؤقت للأماكن المفضلة.'
    },
    apkFiles: [
      {
        id: 'apk-4b-1',
        version: 'v1.4.2-beta',
        buildNumber: 142,
        fileName: '4B_Passenger_v1.4.2_release.apk',
        fileSize: '34.8 MB',
        uploadedAt: 'اليوم، 02:15 م',
        notes: 'إصلاح مشكلة حفظ العنوان المفضل وتحديث مكتبة الخرائط وتحسين سلاسة التمرير.',
        status: 'جاهز للاختبار'
      }
    ]
  },
  {
    id: 'proj-wekala',
    name: 'تطبيق وكالة (WeKaLa)',
    code: 'WEKALA',
    category: 'مشاوير',
    description: 'نظام إدارة الوكلاء، مكاتب التوصيل، إدارة أساطيل السيارات والكباتن، والعمولات اليومية لمنظومة مشاوير.',
    status: 'قيد التطوير',
    figmaUrl: 'https://www.figma.com/design/oYxkmwZcGae674BRA5ZOen/Wikala?node-id=0-1&t=rbE4CPeGiTAMMin2-1',
    repoUrl: 'github.com/mashweer/wekala-fleet-management',
    notes: 'يتم حالياً ربط واجهات تسجيل الوكلاء وتفعيل نظام توثيق المركبات والمستندات الرسمية، بانتظار استلام الكود من المطور.',
    driveAssets: [
      {
        id: 'drive-wekala-assets',
        name: 'أصول وشعارات تطبيق وكالة (WeKaLa)',
        pathOrUrl: 'https://drive.google.com/drive/folders/MASHWEER_WEKALA_ASSETS',
        type: 'logos',
        notes: 'اللوجوهات الرسمية لوكالة، الأيقونات الموجهة للوكلاء والشركاء.',
        updatedAt: '2026-09-08'
      }
    ],
    referenceChats: [],
    contextHints: [
      'اسم التطبيق الرسمي وكالة WeKaLa بالـ (ي) بالإنجليزية.',
      'العقد مع المطور الخارجي يتضمن تسليم سورس كود Flutter مع مستودع GitHub وملفات الـ Keystore.'
    ],
    dbInfo: {
      type: 'PostgreSQL / Supabase',
      tables: ['agencies', 'fleet_vehicles', 'agent_commissions', 'captain_assignments', 'documents'],
      notes: 'جدول العمولات يحتاج فهارس مركبة لتسريع تقارير التسوية الأسبوعية.'
    },
    apkFiles: []
  },
  {
    id: 'proj-daro',
    name: 'تطبيق دارو (Daro)',
    code: 'DARO',
    category: 'مشاوير',
    description: 'منصة الشحنات اللوجستية، نقل الطرود والبضائع بين المدن، وإدارة محطات التوزيع والتسليم.',
    status: 'قيد التطوير',
    figmaUrl: 'https://www.figma.com/design/aR1aanpRzGL7aMoxROGgt5/Daro?node-id=0-1&t=HFGqvAl4RPmlMliu-1',
    repoUrl: 'github.com/mashweer/daro-cargo-system',
    notes: 'التركيز على ميزة فحص الباركود (Barcode Scanner) في محطات الاستلام والتسليم.',
    dbInfo: {
      type: 'PostgreSQL / Supabase',
      tables: ['shipments', 'cargo_hubs', 'waybills', 'truck_dispatches', 'tracking_logs'],
      notes: 'سجلات التتبع tracking_logs تحتاج إلى تدوير دوري لتفادي تضخم الحجم.'
    },
    apkFiles: []
  },
  {
    id: 'proj-paycore',
    name: 'بوابة الدفع والفوترة (PayCore)',
    code: 'PAY',
    category: 'مستقل',
    description: 'محرك الربط المالي الموحد مع بوابات الدفع الإلكتروني ومحفظة الرصيد.',
    status: 'في الإنتاج',
    repoUrl: 'github.com/my-org/paycore-gateway',
    notes: 'الاستقرار ممتاز، ويجري تجهيز تحديث شهادة الأمان السنوية وتحديث ردود الـ Webhook.',
    dbInfo: {
      type: 'PostgreSQL',
      tables: ['wallets', 'transactions', 'gateway_logs', 'refunds', 'settlements'],
      notes: 'تأكيد المعاملات يتم بـ Idempotency Keys لمنع تكرار السحب.'
    },
    apkFiles: []
  }
];

export const INITIAL_API_ENDPOINTS: ApiEndpointItem[] = [
  {
    id: 'api-mcdr-primary',
    name: 'خط الربط الأساسي - مصر للمقاصة (MCDR)',
    service: 'مصر للمقاصة',
    urlOrIp: '10.120.45.10',
    method: 'FIX',
    status: 'يعمل بكفاءة',
    lastPingMs: 4,
    notes: 'خط الفايبر الأرضي الأساسي المباشر لعمليات التسوية ونقل ملفات العملاء.'
  },
  {
    id: 'api-mcdr-backup',
    name: 'خط الربط الاحتياطي - مصر للمقاصة (DR)',
    service: 'مصر للمقاصة',
    urlOrIp: '10.120.45.11',
    method: 'FIX',
    status: 'خط احتياطي',
    lastPingMs: 7,
    notes: 'خط الطوارئ والـ Disaster Recovery على راوتر منفصل.'
  },
  {
    id: 'api-mist-feed',
    name: 'خادم بث الأسعار اللحظي - مصر للمعلومات (MIST)',
    service: 'MIST مصر للمعلومات',
    urlOrIp: '196.205.112.55:8080',
    method: 'SOCKET',
    status: 'يعمل بكفاءة',
    lastPingMs: 12,
    notes: 'مزود بيانات أسعار الأسهم اللحظية Tick-by-Tick للبورصة المصرية.'
  },
  {
    id: 'api-mubasher-feed',
    name: 'خادم بث الأسعار والشاشات - مباشر (Mubasher)',
    service: 'مباشر Mubasher',
    urlOrIp: 'feed.mubasher.net:9443',
    method: 'SOCKET',
    status: 'يعمل بكفاءة',
    lastPingMs: 15,
    notes: 'مزود التداول الإقليمي وعمق السوق والشاشات الحية للعملاء.'
  },
  {
    id: 'api-supabase-db',
    name: 'قاعدة بيانات السوبربيز (Supabase Cloud API)',
    service: 'Supabase',
    urlOrIp: 'https://noub-cloud.supabase.co',
    method: 'POST',
    apiKeyOrSecret: 'sb-prod-key-hidden',
    status: 'يعمل بكفاءة',
    lastPingMs: 24,
    notes: 'مستودع البيانات الرئيسي لتطبيقات نوب ومشاريع الويب.'
  },
  {
    id: 'api-egx-gateway',
    name: 'بوابة أوامر البورصة المصرية (EGX OMS Gateway)',
    service: 'EGX',
    urlOrIp: '192.168.100.2:9800',
    method: 'FIX',
    status: 'يعمل بكفاءة',
    lastPingMs: 5,
    notes: 'بروتوكول FIX 4.4 المخصص لإرسال وتعديل وإلغاء أوامر التداول.'
  }
];

export const INITIAL_TASKS: ProjectTask[] = [
  {
    id: 'task-1',
    projectId: 'proj-noub-sports',
    title: 'تصميم هيكل جداول الأنشطة الرياضية في Supabase',
    description: 'إنشاء جداول قياسات الرياضيين، تسجيل أوقات السباحة، وبيانات الفروسية مع الصلاحيات RLS.',
    priority: 'عاجل',
    status: 'جاري العمل',
    createdAt: 'اليوم، 10:00 ص',
    dueDate: 'غداً'
  },
  {
    id: 'task-2',
    projectId: 'proj-trading-ops',
    title: 'فحص خطوط الربط ومسار الطوارئ لمصر للمقاصة (DR)',
    description: 'التأكد من جاهزية التحويل الآلي بين خط الفايبر الأساسي والخط الاحتياطي عند حدوث انقطاع.',
    priority: 'عاجل',
    status: 'جاري العمل',
    createdAt: 'اليوم، 08:30 ص',
    dueDate: 'اليوم'
  },
  {
    id: 'task-3',
    projectId: 'proj-noub-main',
    title: 'صياغة استعلام استخراج نشاط المستخدمين في منصة نوب',
    description: 'تجهيز كويري سريع لتقارير الاستخدام وتوزيع العضويات النشطة.',
    priority: 'متوسط',
    status: 'قيد الانتظار',
    createdAt: 'أمس',
    dueDate: 'نهاية الأسبوع'
  },
  {
    id: 'task-4',
    projectId: 'proj-4b',
    title: 'فحص تجربة الدفع في شاشات فيجما لتطبيق فور بي',
    description: 'التأكد من مطابقة شاشات الفيجما الجديدة مع مكونات واجهة React Native قبل بدء التطوير.',
    priority: 'عاجل',
    status: 'جاري العمل',
    createdAt: 'اليوم، 10:00 ص',
    dueDate: 'غداً'
  }
];

// Initial Contract Deliverables for Mashweer Apps (4B, WeKaLa, Daro)
export const INITIAL_CONTRACT_DELIVERABLES: any[] = [
  {
    id: 'contract-4b',
    appName: 'فور بي (4B) - مشاوير',
    appCode: '4B',
    developerName: 'المطور الخارجي (فريق تطبيقات النقل)',
    contractStatus: 'مرحلة فحص الكود والتسليم',
    targetDeliveryDate: '2026-09-18',
    sourceCodeRepo: 'github.com/mashweer/4b-passenger-app',
    agreedPrice: 'شامل الدفعات التعاقدية',
    paidAmount: 'دفعة المقدم + مرحلة الـ UI',
    remainingAmount: 'دفعة التسليم النهائي بعد الفحص',
    notes: 'تطبيق الركاب الأساسي لمنظومة مشاوير. جاري فحص ملف الـ APK ومطابقته مع الـ Clean Architecture.',
    checklist: [
      { id: 'c4b-1', item: 'تسليم السورس كود كاملاً على GitHub في المنظمة الرسمية', completed: true, required: true, category: 'code' },
      { id: 'c4b-2', item: 'تسليم ملفات الـ Keystore الرسمية وتوقيع الـ Release APK/AAB', completed: false, required: true, category: 'keystore' },
      { id: 'c4b-3', item: 'مطابقة شاشات التطبيق مع تصاميم Figma المعتمدة', completed: true, required: true, category: 'figma' },
      { id: 'c4b-4', item: 'توفير سكربت جداول Supabase / PostgreSQL والـ Migrations', completed: false, required: true, category: 'db' },
      { id: 'c4b-5', item: 'توثيق الـ Readme ودليل بناء التطبيق محلياً (Build Guide)', completed: false, required: true, category: 'docs' },
    ]
  },
  {
    id: 'contract-wekala',
    appName: 'وكالة (WeKaLa) - مشاوير',
    appCode: 'WEKALA',
    developerName: 'المطور الخارجي (فريق تطبيقات النقل)',
    contractStatus: 'جاري العمل',
    targetDeliveryDate: '2026-09-25',
    sourceCodeRepo: 'github.com/mashweer/wekala-fleet-management',
    agreedPrice: 'متفق عليه بالعقد',
    paidAmount: 'دفعة التعاقد الأولى',
    remainingAmount: 'متبقي دفعة الـ Alpha ودفعة التسليم',
    notes: 'تطبيق الوكلاء والشركاء وإدارة مكاتب التوصيل. التأكد من اسم التطبيق بالـ (ي) WeKaLa.',
    checklist: [
      { id: 'cw-1', item: 'تسليم كود تطبيق الوكلاء على مستودع GitHub', completed: false, required: true, category: 'code' },
      { id: 'cw-2', item: 'إصدار أول نسخة تجريبية APK للاختبار الداخلي (Alpha)', completed: false, required: true, category: 'apk' },
      { id: 'cw-3', item: 'ربط نظام توثيق المركبات والمستندات بـ Supabase Storage', completed: false, required: true, category: 'db' },
      { id: 'cw-4', item: 'تسليم مفاتيح وشهادات التوقيع الرقمية للـ Play Store', completed: false, required: true, category: 'keystore' },
    ]
  },
  {
    id: 'contract-daro',
    appName: 'دارو (Daro) - مشاوير',
    appCode: 'DARO',
    developerName: 'المطور الخارجي (فريق تطبيقات النقل)',
    contractStatus: 'جاري العمل',
    targetDeliveryDate: '2026-10-02',
    sourceCodeRepo: 'github.com/mashweer/daro-cargo-system',
    agreedPrice: 'متفق عليه بالعقد',
    paidAmount: 'دفعة البداية',
    remainingAmount: 'متبقي دفعة المعاينة والتسليم النهائي',
    notes: 'تطبيق الشحنات والطرود واللوجستيات بين المدن ومحطات التوزيع.',
    checklist: [
      { id: 'cd-1', item: 'تطوير كود قارئ الباركود (Barcode Scanner) لشحنات الطرود', completed: false, required: true, category: 'code' },
      { id: 'cd-2', item: 'ربط جداول محطات التوزيع ومسارات الشاحنات', completed: false, required: true, category: 'db' },
      { id: 'cd-3', item: 'تسليم نسخة تجريبية APK للمشرفين الميدانيين', completed: false, required: true, category: 'apk' },
      { id: 'cd-4', item: 'تسليم الكود المصدري ووثائق تشغيل الـ Backend', completed: false, required: true, category: 'docs' },
    ]
  }
];

// Initial Employee Emails for mashweer.com.eg - Zoho Lite Plan from المصرية لتكنولوجيا المعلومات
export const INITIAL_MASHWEER_EMAILS: any[] = [
  {
    id: 'email-admin',
    employeeName: 'الإدارة العامة والتحكم بالمنظومة',
    role: 'Administration & System Master',
    emailAddress: 'admin@mashweer.com.eg',
    status: 'تم الطلب - موعد الاستلام غداً',
    provider: 'Zoho Lite (المصرية لتكنولوجيا المعلومات)',
    createdAt: '2026-09-09',
    deliveryDate: '2026-09-10',
    notes: 'تم تقديم طلب الحجز اليوم على أول خطة من زوهو (Zoho Lite) عبر المصرية لتكنولوجيا المعلومات، وموعد الاستلام غداً.'
  },
  {
    id: 'email-support',
    employeeName: 'الدعم الفني وخدمة العملاء',
    role: 'Technical Support & Helpdesk Lead',
    emailAddress: 'support@mashweer.com.eg',
    status: 'تم الطلب - موعد الاستلام غداً',
    provider: 'Zoho Lite (المصرية لتكنولوجيا المعلومات)',
    createdAt: '2026-09-09',
    deliveryDate: '2026-09-10',
    notes: 'استقبال بلاغات ودعم كباتن وركاب 4B ومستخدمي وتجار منصة وكالة ودارو.'
  },
  {
    id: 'email-info',
    employeeName: 'المعلومات والاستفسارات العامة',
    role: 'General Information & Inquiries',
    emailAddress: 'info@mashweer.com.eg',
    status: 'تم الطلب - موعد الاستلام غداً',
    provider: 'Zoho Lite (المصرية لتكنولوجيا المعلومات)',
    createdAt: '2026-09-09',
    deliveryDate: '2026-09-10',
    notes: 'الإيميل العام الموجه للجمهور والشركاء التجاريين والموقع الإلكتروني التعريفي.'
  },
  {
    id: 'email-operation',
    employeeName: 'إدارة العمليات والتشغيل الميداني',
    role: 'Head of Operations & Fleet',
    emailAddress: 'operation@mashweer.com.eg',
    status: 'تم الطلب - موعد الاستلام غداً',
    provider: 'Zoho Lite (المصرية لتكنولوجيا المعلومات)',
    createdAt: '2026-09-09',
    deliveryDate: '2026-09-10',
    notes: 'تشغيل الرحلات الميدانية، متابعة حركة الكباتن في المحافظات، ومسارات شحنات دارو.'
  },
  {
    id: 'email-hr',
    employeeName: 'الموارد البشرية والتوظيف',
    role: 'Human Resources & Talent Lead',
    emailAddress: 'hr@mashweer.com.eg',
    status: 'تم الطلب - موعد الاستلام غداً',
    provider: 'Zoho Lite (المصرية لتكنولوجيا المعلومات)',
    createdAt: '2026-09-09',
    deliveryDate: '2026-09-10',
    notes: 'استقبال طلبات التوظيف ومتابعة عقود موظفي مشاوير ومسؤولي العمليات.'
  },
  {
    id: 'email-finance',
    employeeName: 'الإدارة المالية والحسابات',
    role: 'Finance & Accounts Manager',
    emailAddress: 'finance@mashweer.com.eg',
    status: 'تم الطلب - موعد الاستلام غداً',
    provider: 'Zoho Lite (المصرية لتكنولوجيا المعلومات)',
    createdAt: '2026-09-09',
    deliveryDate: '2026-09-10',
    notes: 'متابعة بوابات الدفع (فوري / Paymob)، الفواتير الرسمية، ومستحقات وعمولات الكباتن.'
  }
];

// Initial Real Service Providers & Credentials Vault
export const INITIAL_SERVICE_PROVIDERS: any[] = [
  {
    id: 'provider-ec-egypt',
    name: 'المصرية لتكنولوجيا المعلومات (EC / eyg.com.eg)',
    category: 'دومينات وإيميلات',
    website: 'https://clients.ec.com.eg',
    officialBadge: 'مزود معتمد رسمي (خدمات نشطة Active)',
    subscriptionDate: '2026-08-09',
    renewalDate: '2027-08-09',
    costOrPlan: 'COM.EG (1100 ج.م) + استضافة Host1 مع SSL (2200 ج.م) = 3300 ج.م سنوياً + إيميلات زوهو',
    activeServices: [
      {
        id: 'svc-ec-com-eg',
        name: 'COM.EG',
        domainOrResource: 'mashawer.com.eg',
        price: '1100.00 جنيه مصري',
        billingCycle: 'Annually (سنوي)',
        nextDueDate: 'Monday, August 9th, 2027',
        status: 'Active',
        hasSsl: false
      },
      {
        id: 'svc-ec-host1',
        name: 'Host1',
        domainOrResource: 'mashawer.com.eg',
        price: '2200.00 جنيه مصري',
        billingCycle: 'Annually (سنوي)',
        nextDueDate: 'Wednesday, August 11th, 2027',
        status: 'Active',
        hasSsl: true
      }
    ],
    contactPersons: [
      {
        name: 'المهندس محمد الحلو',
        role: 'مسؤول الحساب والدعم الفني - المصرية لتكنولوجيا المعلومات',
        phone: '01551553434',
        email: 'info@ec.com.eg',
        notes: 'متابع لحجز الدومينات وتفعيل باقة الـ 6 إيميلات على زوهو وضبط الـ DNS.'
      }
    ],
    credentials: [
      {
        id: 'cred-ec-domain-spelling',
        keyName: 'النطاق المعتمد في الفواتير (Domain Spelling)',
        keyValue: 'mashawer.com.eg',
        type: 'account_id',
        notes: 'تنبيه تدقيق هيباتيا: الدومين المسجل والمحجوز في فاتورة المصرية لتكنولوجيا المعلومات يُكتب mashawer.com.eg بحرف الـ a.',
        isSensitive: false
      },
      {
        id: 'cred-ec-host1-ssl',
        keyName: 'بيانات استضافة Host1 المحجوزة',
        keyValue: 'Host1 Plan - 2200.00 EGP/yr (Active مع شهادة SSL)',
        type: 'env_var',
        notes: 'استضافة الويب الرئيسية لموقع مشاوير التعريفي ولوحات التحكم الإدارية (تجديد 11/8/2027).',
        isSensitive: false
      },
      {
        id: 'cred-ec-1',
        keyName: 'رابط لوحة الكلاينت (Client Area)',
        keyValue: 'https://clients.ec.com.eg/clientarea.php',
        type: 'url',
        notes: 'لوحة التحكم المركزية بالدومينات والفواتير والخدمات المحجوزة.',
        isSensitive: false
      },
      {
        id: 'cred-ec-2',
        keyName: 'سجلات DNS لـ Zoho Mail (MX)',
        keyValue: 'mx.zoho.com (10), mx2.zoho.com (20), mx3.zoho.com (50)',
        type: 'account_id',
        notes: 'سجلات استقبال البريد المعتمدة لربط النطاقات بسيرفرات زوهو.',
        isSensitive: false
      },
      {
        id: 'cred-ec-3',
        keyName: 'سجل حماية البريد SPF',
        keyValue: 'v=spf1 include:zoho.com ~all',
        type: 'account_id',
        notes: 'منع وصول الإيميلات للـ Spam وتأكيد هوية النطاق لدى خوادم الاستقبال.',
        isSensitive: false
      }
    ],
    tasks: [
      {
        id: 'pt-ec-1',
        title: 'استلام الـ 6 إيميلات غداً (10/9/2026) من المهندس محمد الحلو وتفعيل كلمات السر',
        dueDate: '2026-09-10',
        status: 'جاري المتابعة',
        priority: 'عاجل',
        assignedContact: 'المهندس محمد الحلو',
        notes: 'فحص إيميلات admin, support, info, operation, hr, finance والتأكد من فتحها على متصفح الويب وتطبيق زوهو.'
      },
      {
        id: 'pt-ec-2',
        title: 'تأكيد تفعيل بروتوكول IMAP/SMTP لربط الإيميلات ببرنامج Microsoft Outlook داخل المقر',
        dueDate: '2026-09-11',
        status: 'معلقة',
        priority: 'متوسط',
        assignedContact: 'المهندس محمد الحلو'
      },
      {
        id: 'pt-ec-3',
        title: 'تنبيه موعد التجديد السنوي للدومين COM.EG (9 أغسطس 2027)',
        dueDate: '2027-08-09',
        status: 'معلقة',
        priority: 'عادي'
      },
      {
        id: 'pt-ec-4',
        title: 'تنبيه موعد التجديد السنوي للاستضافة Host1 (11 أغسطس 2027)',
        dueDate: '2027-08-11',
        status: 'معلقة',
        priority: 'عادي'
      }
    ],
    linkedApps: ['مشاوير Mashawer', '4B', 'Wikala', 'Daro'],
    notes: 'المزود المعتمد لجميع النطاقات الرسمية وحسابات البريد المؤسسي على زوهو واستضافة Host1.'
  },
  {
    id: 'provider-we-telecom',
    name: 'المصرية للاتصالات (WE - Telecom Egypt)',
    category: 'استضافة وسيرفرات WE',
    website: 'https://te.eg',
    officialBadge: 'استضافة حكومية إلزامية لـ 4B',
    subscriptionDate: '2026-08-15',
    renewalDate: '2027-08-15',
    costOrPlan: 'عقد استضافة IaaS داتا سنتر القرية الذكية / السويس',
    contactPersons: [
      {
        name: 'المهندس أحمد محرم',
        role: 'المصرية للاتصالات - إدارة مبيعات قطاع الأعمال والاستضافة',
        notes: 'متابع ملف التعاقد الحكومي والمواصفات السيرفرية لمشروع 4B.'
      },
      {
        name: 'المهندس أحمد غريب',
        role: 'المصرية للاتصالات - مهندس النظم والشبكات وتجهيز السيرفرات',
        notes: 'المسؤول التقني عن تهيئة بيئة Ubuntu 22.04 و PostgreSQL 16 + PostGIS.'
      },
      {
        name: 'المستشار القانوني / المحامي',
        role: 'محامي الشركة - المتابعة القانونية والتنظيمية مع الوزارة',
        notes: 'متابعة الامتثال لقانون النقل الذكي المصري والترخيص الحكومي لتطبيق 4B.'
      }
    ],
    credentials: [
      {
        id: 'cred-we-1',
        keyName: 'مواصفات السيرفر المعتمدة المطلوب تقديمها (Specs)',
        keyValue: 'Ubuntu 22.04 LTS, Node.js 22 LTS, 4 vCPU / 8 GB RAM / 100 GB SSD',
        type: 'env_var',
        notes: 'المواصفات المشروطة لتشغيل API و Worker وبانل الأدمن.',
        isSensitive: false
      },
      {
        id: 'cred-we-2',
        keyName: 'قاعدة البيانات المطلوبة',
        keyValue: 'PostgreSQL 16 + PostGIS 3.4 Extension + Redis 7 (noeviction)',
        type: 'env_var',
        notes: 'مطلوب إلزامي لتتبع الخرائط وحساب مسارات الرحلات والـ Queues.',
        isSensitive: false
      },
      {
        id: 'cred-we-3',
        keyName: 'منافذ الفايروول المسموحة (Firewall Rules)',
        keyValue: 'Public Inbound: 80, 443 / Private only: 3000, 3001, 5432, 6379',
        type: 'env_var',
        notes: 'حماية أمنية مشددة تمنع كشف قواعد البيانات والـ API داخلياً.',
        isSensitive: false
      }
    ],
    tasks: [
      {
        id: 'pt-we-1',
        title: 'تسليم وثيقة GoRide Server Requirements للمهندس أحمد محرم والمهندس أحمد غريب',
        dueDate: '2026-09-12',
        status: 'جاري المتابعة',
        priority: 'عاجل',
        assignedContact: 'م. أحمد محرم وم. أحمد غريب'
      },
      {
        id: 'pt-we-2',
        title: 'تأكيد تفعيل إضافة PostGIS 3.4 على PostgreSQL 16 داخل داتا سنتر WE',
        dueDate: '2026-09-15',
        status: 'معلقة',
        priority: 'عاجل',
        assignedContact: 'م. أحمد غريب'
      },
      {
        id: 'pt-we-3',
        title: 'مراجعة شروط الترخيص ومذكرة التوافق مع وزارة النقل بالتعاون مع المحامي',
        dueDate: '2026-09-20',
        status: 'جاري المتابعة',
        priority: 'عاجل',
        assignedContact: 'المحامي'
      }
    ],
    linkedApps: ['4B (GoRide)'],
    notes: 'استضافة تطبيق نقل الركاب 4B داخل خوادم WE التزاماً بالقانون المصري لرقابة وزارة النقل.'
  },
  {
    id: 'provider-broadnet',
    name: 'شركة برودنت (BroadNet - broadnetme.com)',
    category: 'رسائل و OTP',
    website: 'https://broadnetme.com',
    officialBadge: 'بوابة الـ SMS ورموز التحقق',
    subscriptionDate: '2026-08-20',
    renewalDate: '2027-08-20',
    costOrPlan: 'حساب A2P SMS للرسائل القصيرة المعتمدة في مصر',
    contactPersons: [
      {
        name: 'فريق مبيعات ودعم برودنت',
        role: 'Technical Account Manager - BroadNet',
        notes: 'متابعة اعتماد الـ Sender ID وتمرير رسائل كود التحقق OTP.'
      }
    ],
    credentials: [
      {
        id: 'cred-bn-1',
        keyName: 'رابط لوحة التحكم',
        keyValue: 'https://broadnetme.com/portal/login',
        type: 'url',
        notes: 'متابعة الرصيد والتقارير وحالة تسليم الرسائل.',
        isSensitive: false
      },
      {
        id: 'cred-bn-2',
        keyName: 'Sender ID المعتمد',
        keyValue: 'GoRide / Mashawer',
        type: 'account_id',
        notes: 'اسم المرسل الأبجدي الظاهر على هواتف العملاء في مصر.',
        isSensitive: false
      },
      {
        id: 'cred-bn-3',
        keyName: 'API Endpoint & Key',
        keyValue: 'https://api.broadnetme.com/v1/sms/send',
        type: 'api_key',
        notes: 'الرابط البرمجي لإرسال الرسائل من الـ Backend.',
        isSensitive: true
      }
    ],
    tasks: [
      {
        id: 'pt-bn-1',
        title: 'تأكيد موافقة مشغلي المحمول (فودافون، أورنج، وي، إي آند) على الـ Sender ID',
        dueDate: '2026-09-14',
        status: 'جاري المتابعة',
        priority: 'عاجل'
      },
      {
        id: 'pt-bn-2',
        title: 'تجربة إرسال رسالة OTP تجريبية إلى أرقام هواتف متعددة وقياس سرعة الوصول',
        dueDate: '2026-09-16',
        status: 'معلقة',
        priority: 'متوسط'
      }
    ],
    linkedApps: ['4B', 'Wikala', 'Daro'],
    notes: 'مزود إرسال الرسائل النصية ورموز الدخول السريعة في مصر والشرق الأوسط.'
  },
  {
    id: 'provider-qeema-tech',
    name: 'شركة قيمة تك (Qeema Tech - شريك التطوير البرمجي)',
    category: 'تطوير برمجيات قيمة تك',
    website: 'https://qeematech.com',
    officialBadge: 'المطور البرمجي الرسمي لـ 4 تطبيقات',
    costOrPlan: 'عقد تطوير وصيانة المنظومة الرقمية والتطبيقات',
    contactPersons: [
      {
        name: 'إدارة المشاريع الهندسية - قيمة تك',
        role: 'Lead Project Manager & Technical Delivery',
        notes: 'متابعة تسليمات الكود، فحص الأخطاء البرمجية، ورفع نسخ الـ APK.'
      }
    ],
    credentials: [
      {
        id: 'cred-qm-figma-mashawer',
        keyName: 'رابط فيجما المعتمد - مشاوير / فور بي (Mashawer - Backlog)',
        keyValue: 'https://www.figma.com/design/ulWwUzLnKThS2cfJWDetX6/%D9%85%D8%B4%D8%A7%D9%88%D9%8A%D8%B1---backlog?node-id=221-63531&t=uCzHJZbEM1gi1Zz8-0',
        type: 'url',
        notes: 'ملف التصاميم والـ Backlog المعتمد لشاشات الركاب والرحلات (node-id: 221-63531).',
        isSensitive: false
      },
      {
        id: 'cred-qm-figma-wikala',
        keyName: 'رابط فيجما المعتمد - تطبيق وكالة (Wikala)',
        keyValue: 'https://www.figma.com/design/oYxkmwZcGae674BRA5ZOen/Wikala?node-id=0-1&t=rbE4CPeGiTAMMin2-1',
        type: 'url',
        notes: 'ملف التصاميم الرسمية لواجهات الوكلاء والشركاء وإدارة الأسطول على فيجما.',
        isSensitive: false
      },
      {
        id: 'cred-qm-figma-daro',
        keyName: 'رابط فيجما المعتمد - تطبيق دارو (Daro)',
        keyValue: 'https://www.figma.com/design/aR1aanpRzGL7aMoxROGgt5/Daro?node-id=0-1&t=HFGqvAl4RPmlMliu-1',
        type: 'url',
        notes: 'ملف التصاميم الرسمية لواجهات الشحن واللوجستيات والمحطات على فيجما.',
        isSensitive: false
      },
      {
        id: 'cred-qm-1',
        keyName: 'تطبيق فور بي (4B) - المستودع ومواصفات السيرفر',
        keyValue: 'github.com/mashweer/goride-backend (NestJS 10 + Next.js 16)',
        type: 'url',
        notes: 'تطبيق نقل الركاب والطرود التابع لرقابة الوزارة والمصرية للاتصالات.',
        isSensitive: false
      },
      {
        id: 'cred-qm-2',
        keyName: 'تطبيق وكالة (Wikala) - المستودع والمعمارية',
        keyValue: 'github.com/mashweer/wikala-platform (Node.js + MongoDB + Redis)',
        type: 'url',
        notes: 'السوق المفتوح للمزادات والمقايضة والوساطة التجارية.',
        isSensitive: false
      },
      {
        id: 'cred-qm-3',
        keyName: 'تطبيق دارو (Daro) - المستودع',
        keyValue: 'github.com/mashweer/daro-cargo-system (Logistics & Intercity Freight)',
        type: 'url',
        notes: 'منصة إدارة الشحنات والطرود واللوجستيات بين المدن المصرية.',
        isSensitive: false
      },
      {
        id: 'cred-qm-4',
        keyName: 'التطبيق الرابع (قيد التخطيط والاحتمالية)',
        keyValue: 'مشروع مستقبلي قادم تحت مظلة مشاوير وقيمة تك',
        type: 'account_id',
        notes: 'مخصص للمرحلة التوسعية القادمة.',
        isSensitive: false
      }
    ],
    tasks: [
      {
        id: 'pt-qm-1',
        title: 'مراجعة ومقارنة تصاميم فيجما الحديثة مع الكود المسلم لتطبيق 4B ووكالة',
        dueDate: '2026-09-13',
        status: 'جاري المتابعة',
        priority: 'عاجل',
        notes: 'يمكن فحصها مباشرة عبر أمر هيباتيا الصوتي.'
      },
      {
        id: 'pt-qm-2',
        title: 'استلام وفحص محضر الاجتماع الأخير للتأكد من تسليم البنود المتفق عليها مع المطورين',
        dueDate: '2026-09-14',
        status: 'معلقة',
        priority: 'عاجل'
      },
      {
        id: 'pt-qm-3',
        title: 'تأكيد تسليم متطلبات النشر والاستضافة الخاصة بخوادم WE',
        dueDate: '2026-09-16',
        status: 'معلقة',
        priority: 'عاجل'
      }
    ],
    linkedApps: ['4B', 'Wikala', 'Daro', 'التطبيق الرابع الاحتمالي'],
    notes: 'الجهة المطورة للمشاريع الأربعة، مع توثيق كافة المتطلبات البرمجية والعقود.'
  },
  {
    id: 'provider-cloudinary',
    name: 'كلاوديناري (Cloudinary Media & Storage)',
    category: 'خرائط وميديا',
    website: 'https://cloudinary.com',
    officialBadge: 'مخزن الوسائط ووثائق التحقق',
    costOrPlan: 'خطة مدفوعة لتخزين وتوصيل الصور والملفات',
    contactPersons: [
      {
        name: 'حساب مشاوير المؤسسي - Cloudinary',
        role: 'Account Owner',
        email: 'admin@mashweer.com.eg'
      }
    ],
    credentials: [
      {
        id: 'cred-cld-1',
        keyName: 'Cloud Name',
        keyValue: 'mashweer-cloud',
        type: 'env_var',
        notes: 'معرّف مساحة التخزين الخاصة بالمنظومة.',
        isSensitive: false
      },
      {
        id: 'cred-cld-2',
        keyName: 'خوارزمية التوقيع (Signature Algorithm)',
        keyValue: 'SHA-256 (إلزامي ليتوافق مع كود الباك إند)',
        type: 'env_var',
        notes: 'يجب ضبطها من إعدادات الحساب لتفادي فشل رفع الملفات.',
        isSensitive: false
      },
      {
        id: 'cred-cld-3',
        keyName: 'CLOUDINARY_API_KEY / SECRET',
        keyValue: 'CLOUDINARY_API_KEY=••••••••••••• / SECRET=•••••••••••••',
        type: 'secret',
        notes: 'مفاتيح التوقيع السري في السيرفر فقط دون كشفها في المتصفح.',
        isSensitive: true
      }
    ],
    tasks: [
      {
        id: 'pt-cld-1',
        title: 'التأكد من تفعيل Authenticated Private Delivery للوثائق الرسمية ورخص القيادة',
        status: 'معلقة',
        priority: 'متوسط'
      }
    ],
    linkedApps: ['4B', 'Wikala', 'Daro'],
    notes: 'المستودع السحابي الحصري لجميع الصور والوثائق وتقارير Excel في النظام.'
  },
  {
    id: 'provider-fawry',
    name: 'شركة فوري للمدفوعات الإلكترونية (Fawry)',
    category: 'بوابات دفع',
    website: 'https://fawry.com',
    officialBadge: 'بوابة الدفع وصرف مستحقات الكباتن',
    costOrPlan: 'عقد تاجر (Merchant Agreement) للدفع والصرف',
    contactPersons: [
      {
        name: 'إدارة الحسابات التجارية - فوري',
        role: 'Merchant Onboarding Manager'
      }
    ],
    credentials: [
      {
        id: 'cred-fw-1',
        keyName: 'Fawry Merchant Code',
        keyValue: 'FAWRY_MERCHANT_CODE_MASHWEER',
        type: 'account_id',
        isSensitive: false
      },
      {
        id: 'cred-fw-2',
        keyName: 'رابط استلام إشعارات الدفع (Webhook)',
        keyValue: 'https://admin.goride.eg/api/v1/webhooks/fawry',
        type: 'url',
        notes: 'رابط عام مشفر بـ HTTPS ويجب عدم تعديل الـ JSON Body الخام.',
        isSensitive: false
      }
    ],
    tasks: [
      {
        id: 'pt-fw-1',
        title: 'استلام مفاتيح بيئة الاختبار Sandbox لتجربة تحصيل الرحلات وصرف مستحقات الكباتن',
        dueDate: '2026-09-18',
        status: 'جاري المتابعة',
        priority: 'عاجل'
      }
    ],
    linkedApps: ['4B'],
    notes: 'بوابة الدفع الرسمية المعتمدة لرحلات نقل الركاب والطرود وصرف مستحقات السائقين.'
  },
  {
    id: 'provider-google-maps',
    name: 'منصة خرائط جوجل (Google Maps Platform)',
    category: 'خرائط وميديا',
    website: 'https://console.cloud.google.com',
    officialBadge: 'خرائط وتوجيه وحساب مسافات',
    costOrPlan: 'حساب فوترة GCP موحد مع رصيد شهري متجدد',
    contactPersons: [
      {
        name: 'حساب GCP المؤسسي',
        role: 'Google Cloud Administrator',
        email: 'admin@mashweer.com.eg'
      }
    ],
    credentials: [
      {
        id: 'cred-gm-1',
        keyName: 'Server Key (مفتاح السيرفر مقيد بـ IP)',
        keyValue: 'GOOGLE_MAPS_API_KEY (سيرفر 4B وسيرفر وكالة)',
        type: 'api_key',
        notes: 'يُستخدم لحساب المسافات وتقدير الأجرة في السيرفر فقط.',
        isSensitive: true
      },
      {
        id: 'cred-gm-2',
        keyName: 'Web Key (مفتاح الويب مقيد بالدومين)',
        keyValue: 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (admin.goride.eg / wikala.app)',
        type: 'api_key',
        notes: 'يُستخدم لعرض الخرائط واختيار العناوين في المتصفح.',
        isSensitive: false
      }
    ],
    tasks: [
      {
        id: 'pt-gm-1',
        title: 'وضع حدود الميزانية (Budget Alert & Quota Caps) لمنع التكاليف غير المحسوبة',
        status: 'معلقة',
        priority: 'عاجل'
      }
    ],
    linkedApps: ['4B', 'Wikala', 'Daro'],
    notes: 'المزود المعتمد لجميع وظائف الخرائط وحساب الكيلومترات في التطبيقات.'
  }
];



