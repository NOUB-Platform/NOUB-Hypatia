/**
 * هيباتيا | Hypatia - المساعد التقني والنظامي
 * ملف الجافاسكريبت الرئيسي (script.js)
 * يحتوي على الـ 10 مشاريع الأصلية، نظام التعديل الديناميكي المرن، التعرف الصوتي، وتصدير مذكرات الـ AI
 */

// ==============================================================================
// 1. البيانات الـ 10 الأصلية المعتمدة لمنظومة نوب ومشاوير
// ==============================================================================
const OFFICIAL_10_PROJECTS = [
  {
    id: 'proj-4b',
    number: '#001',
    name: 'فور بي (4B App)',
    nameEn: '4B Passenger & Fleet',
    category: 'قيد التجربة',
    icon: '🚗',
    iconBg: '#451a03',
    iconColor: '#f59e0b',
    uiType: 'figma', // figma, code, both, none
    hasEmails: true,
    emailsList: ['admin@4b-app.com', 'support@4b-app.com', 'team@4b-app.com', 'operations@4b-app.com'],
    hasWebsite: true,
    websiteUrl: 'https://mashawer.com.eg',
    apkStatus: 'تم الاستلام - قيد التجربة الميدانية',
    apkLink: 'https://drive.google.com/drive/folders/MASHWEER_4B_BUILDS_APK',
    dashboardStatus: 'تم الاستلام - قابل للتجربة وتدقيق البيانات',
    dashboardLink: 'https://dashboard.mashawer.com.eg',
    figmaProgress: 95,
    figmaLink: 'https://www.figma.com/design/ulWwUzLnKThS2cfJWDetX6/%D9%85%D8%B4%D8%A7%D9%88%D9%8A%D8%B1---backlog?node-id=221-63531',
    githubLink: 'https://github.com/mashweer/4b-passenger-app',
    driveLink: 'https://drive.google.com/drive/folders/1MASHWEER_VALUE_TECH_ASSETS',
    nextMeeting: 'السبت القادم - 5:00 مساءً',
    meetingLink: 'https://meet.google.com/mashweer-4b-sync',
    openRequests: [
      'مراجعة إشعارات الدفع والخصومات التلقائية',
      'فحص سرعة استجابة الخرائط وتتبع الكابتن المباشر'
    ],
    voiceNotes: 'النسخة التجريبية تعمل بشكل جيد على هواتف أندرويد الحديثة، نركز على استقرار الاتصال اللحظي مع السيرفر.',
    notes: 'التطبيق مستلم منه الـ APK والداش بورد ويجري اختبارهما معاً لمطابقة تدفق البيانات من التطبيق إلى لوحة العمليات.'
  },
  {
    id: 'proj-wekala',
    number: '#002',
    name: 'وكالة (WeKaLa)',
    nameEn: 'Wekala Fleet & Agency',
    category: 'موبايل',
    icon: '🏢',
    iconBg: '#172554',
    iconColor: '#38bdf8',
    uiType: 'figma',
    hasEmails: true,
    emailsList: ['contact@wekala.com', 'dev@wekala.com', 'partner@wekala.com'],
    hasWebsite: false,
    websiteUrl: '',
    apkStatus: 'تم الاستلام - واجهات فقط',
    apkLink: 'https://drive.google.com/drive/folders/MASHWEER_WEKALA_ASSETS',
    dashboardStatus: 'لم نستلم الداش بورد بعد',
    dashboardLink: '',
    figmaProgress: 80,
    figmaLink: 'https://www.figma.com/design/oYxkmwZcGae674BRA5ZOen/Wikala?node-id=0-1',
    githubLink: 'https://github.com/mashweer/wekala-fleet-management',
    driveLink: 'https://drive.google.com/drive/folders/MASHWEER_WEKALA_ASSETS',
    nextMeeting: 'الأحد القادم - 6:30 مساءً',
    meetingLink: 'https://meet.google.com/wekala-review',
    openRequests: [
      'استلام الداش بورد لتقييم إدارة مكاتب الوكلاء والعمولات',
      'تعديل خط القائمة الجانبية في شاشات تسجيل الوكيل',
      'ربط خرائط فروع الوكلاء ومحطات التوزيع'
    ],
    voiceNotes: 'ضرورة الضغط على الفريق الخارجي لتسليم الداش بورد قبل ميتنج الأحد القادم.',
    notes: 'استلمنا الـ APK لتقييم التصميم، لكن لا يمكن تقييم مسار البيانات والأرباح حتى استلام لوحة التحكم (Dashboard).'
  },
  {
    id: 'proj-daro',
    number: '#003',
    name: 'دارو (Daro Cargo)',
    nameEn: 'Daro Cargo & Shipping',
    category: 'موبايل',
    icon: '📦',
    iconBg: '#042f2e',
    iconColor: '#2dd4bf',
    uiType: 'figma',
    hasEmails: true,
    emailsList: ['cargo@mashawer.com.eg', 'operations@daro.com'],
    hasWebsite: false,
    websiteUrl: '',
    apkStatus: 'لم يتم الاستلام - قيد التطوير',
    apkLink: '',
    dashboardStatus: 'لم نستلم الداش بورد بعد',
    dashboardLink: '',
    figmaProgress: 70,
    figmaLink: 'https://www.figma.com/design/aR1aanpRzGL7aMoxROGgt5/Daro?node-id=0-1',
    githubLink: 'https://github.com/mashweer/daro-cargo-system',
    driveLink: '',
    nextMeeting: 'الإثنين القادم - 4:30 عصراً',
    meetingLink: '',
    openRequests: [
      'فحص سرعة قراءة الباركود للطرود عند استلام الشحنة',
      'تجهيز بوليصة الشحن الرقمية وإرسال رسالة SMS للعميل'
    ],
    voiceNotes: 'التركيز على قارئ الباركود ومحطات الشحن السريع.',
    notes: 'مشروع الشحن اللوجستي بين المدن والمحافظات، يعتمد على محطات التوزيع ومسح باركود الشحنات.'
  },
  {
    id: 'proj-noub-sports',
    number: '#004',
    name: 'نوب سبورتس (NOUB Sports)',
    nameEn: 'NOUB Sports Academies',
    category: 'قيد التجربة',
    icon: '⚽',
    iconBg: '#3b0764',
    iconColor: '#e879f9',
    uiType: 'both',
    hasEmails: true,
    emailsList: ['noub.platform@gmail.com', 'sports@noub.com', 'academies@noub.com'],
    hasWebsite: true,
    websiteUrl: 'https://sports.noub.org',
    apkStatus: 'تم الاستلام - قيد التجربة الميدانية',
    apkLink: 'https://drive.google.com/drive/folders/1NOUB_SPORTS_BUILDS_APK',
    dashboardStatus: 'تم الاستلام - مكتمل وفي الإنتاج',
    dashboardLink: 'https://sports.noub.org',
    figmaProgress: 95,
    figmaLink: 'https://www.figma.com/design/sports-noub-screens',
    githubLink: 'https://github.com/noub-platform/noub-sports-app',
    driveLink: 'https://drive.google.com/drive/folders/1NOUB_SPORTS_LOGOS_ASSETS_MAIN',
    nextMeeting: 'الثلاثاء - 5:00 مساءً',
    meetingLink: 'https://meet.google.com/noub-sports-sync',
    openRequests: [
      'جدولة مواعيد البطولات وتقسيم المجموعات',
      'تقرير الحضور والغياب الأسبوعي للسباحة والفروسية'
    ],
    voiceNotes: 'تم اختبار نظام النقاط ELO مع أكاديمية التنس وظهر استقرار ممتاز.',
    notes: 'المنظومة الرياضية الشاملة لإدارة الأكاديميات، حساب نقاط الرياضيين، والربط اللحظي مع الجداول.'
  },
  {
    id: 'proj-noub-main',
    number: '#005',
    name: 'نوب الأساسي (NOUB Main)',
    nameEn: 'NOUB Core Platform',
    category: 'ويب',
    icon: '🏛️',
    iconBg: '#451a03',
    iconColor: '#fbbf24',
    uiType: 'code',
    hasEmails: true,
    emailsList: ['info@noub.org', 'admin@noub.org', 'citizens@noub.org'],
    hasWebsite: true,
    websiteUrl: 'https://noub.org',
    apkStatus: 'لا يتطلب تطبيق موبايل (منصة ويب PWA)',
    apkLink: '',
    dashboardStatus: 'تم الاستلام - مكتمل وفي الإنتاج',
    dashboardLink: 'https://noub.org',
    figmaProgress: 100,
    figmaLink: 'https://www.figma.com/design/noub-main-portal',
    githubLink: 'https://github.com/noub-platform/noub-main-core',
    driveLink: 'https://drive.google.com/drive/folders/1NOUB_MAIN_BRAND_ASSETS',
    nextMeeting: 'الأربعاء - 6:00 مساءً',
    meetingLink: '',
    openRequests: ['تحديث صفحة الرؤية والشهادات الرقمية للمواطنين'],
    voiceNotes: 'تم ربط خدمة التحقق من العضويات الرقمية بنجاح.',
    notes: 'المركز العصبي العام لمنظومة نوب وإدارة الهوية الرقمية الموحدة لجميع المشاريع.'
  },
  {
    id: 'proj-trading-ops',
    number: '#006',
    name: 'غرفة التداول (Trading Ops)',
    nameEn: 'Financial Trading Room & FIX',
    category: 'خاص',
    icon: '📈',
    iconBg: '#052e16',
    iconColor: '#4ade80',
    uiType: 'code',
    hasEmails: true,
    emailsList: ['trading@noub.org', 'mcdr-liaison@noub.org'],
    hasWebsite: true,
    websiteUrl: 'https://trading.noub.org',
    apkStatus: 'شاشات وأنظمة مكتبية خاصة (غرفة العمليات)',
    apkLink: '',
    dashboardStatus: 'تم الاستلام - مكتمل وفي الإنتاج',
    dashboardLink: 'https://trading.noub.org',
    figmaProgress: 100,
    figmaLink: '',
    githubLink: 'https://github.com/noub-platform/trading-ops-engine',
    driveLink: 'https://drive.google.com/drive/folders/1TRADING_CLEARING_CERTS',
    nextMeeting: 'الخميس - 10:00 صباحاً (قبل جلسة البورصة)',
    meetingLink: '',
    openRequests: ['مراجعة كفاءة خط الفايبر الاحتياطي (DR) مع مصر للمقاصة'],
    voiceNotes: 'معدل التأخير في البث اللحظي للأسعار أقل من 12 مللي ثانية، حالة ممتازة.',
    notes: 'مراقبة خطوط الربط المؤجرة اللحظية مع MIST ومباشر وبورصة الأوراق المالية والتحقق من زمن التأخير.'
  },
  {
    id: 'proj-noub-game',
    number: '#007',
    name: 'لعبة نوب (NOUB Game)',
    nameEn: 'Tomb Puzzles of Egypt',
    category: 'موبايل',
    icon: '🏺',
    iconBg: '#2e1065',
    iconColor: '#a78bfa',
    uiType: 'figma',
    hasEmails: false,
    emailsList: [],
    hasWebsite: false,
    websiteUrl: '',
    apkStatus: 'تم الاستلام - قيد التجربة الميدانية',
    apkLink: '',
    dashboardStatus: 'لم نستلم الداش بورد بعد',
    dashboardLink: '',
    figmaProgress: 85,
    figmaLink: '',
    githubLink: 'https://github.com/noub-platform/noub-tomb-puzzles',
    driveLink: '',
    nextMeeting: 'السبت - 7:00 مساءً',
    meetingLink: '',
    openRequests: [
      'اعتماد المؤثرات الصوتية للأبواب والمفاتيح الحجرية',
      'تأكيد استجابة الألغاز المنطقية في وضع الأوفلاين'
    ],
    voiceNotes: 'المرحلة الأولى تم الانتهاء من تصميم المقابر الـ 5 بالكامل.',
    notes: 'لعبة الألغاز الثقافية المصرية القديمة، 62 مقبرة في وادي الملوك مع جوائز بطاقات كنوز نوب.'
  },
  {
    id: 'proj-hypatia-ops',
    number: '#008',
    name: 'هيباتيا (Hypatia Ops)',
    nameEn: 'Senior Tech & Ops Engine',
    category: 'مكتمل',
    icon: '⚡',
    iconBg: '#0f172a',
    iconColor: '#38bdf8',
    uiType: 'code',
    hasEmails: true,
    emailsList: ['hypatia@noub.org'],
    hasWebsite: true,
    websiteUrl: 'https://hypatia.noub.org',
    apkStatus: 'نظام ويب وتطبيق لحظي متجاوب مع الهواتف',
    apkLink: '',
    dashboardStatus: 'تم الاستلام - مكتمل وفي الإنتاج',
    dashboardLink: 'https://hypatia.noub.org',
    figmaProgress: 100,
    figmaLink: '',
    githubLink: 'https://github.com/noub-platform/NOUB-Hypatia',
    driveLink: '',
    nextMeeting: 'متاح للعمل على مدار الساعة 24/7',
    meetingLink: '',
    openRequests: [],
    voiceNotes: 'النظام جاهز لتوليد البرومبتات والمذكرات بضغطة زر واحدة.',
    notes: 'المحرك الذي تستخدمه الآن لتلخيص موقف كل مشروع، وتوليد مذكرات التوجيه لأي نموذج ذكاء اصطناعي.'
  },
  {
    id: 'proj-paycore',
    number: '#009',
    name: 'بوابة الدفع (PayCore)',
    nameEn: 'Payment & Wallet Core',
    category: 'ويب',
    icon: '💳',
    iconBg: '#164e63',
    iconColor: '#22d3ee',
    uiType: 'code',
    hasEmails: true,
    emailsList: ['pay@noub.org', 'finance@noub.org'],
    hasWebsite: true,
    websiteUrl: 'https://pay.noub.org',
    apkStatus: 'حزمة SDK مدمجة في التطبيقات الأخرى',
    apkLink: '',
    dashboardStatus: 'تم الاستلام - مكتمل وفي الإنتاج',
    dashboardLink: 'https://pay.noub.org',
    figmaProgress: 100,
    figmaLink: '',
    githubLink: 'https://github.com/noub-platform/paycore-gateway',
    driveLink: '',
    nextMeeting: 'الأحد القادم - 11:00 صباحاً',
    meetingLink: '',
    openRequests: ['تجديد شهادات Webhook لمزود الدفع البنكي'],
    voiceNotes: 'نسبة نجاح العمليات عبر البطاقات ومحافظ المحمول تجاوزت 99.2%.',
    notes: 'محرك الربط المالي وبوابات الدفع والمحافظ الرقمية المشتركة لمشاريع المنظومة.'
  },
  {
    id: 'proj-academy-pro',
    number: '#010',
    name: 'أكاديمي برو (Academy Pro)',
    nameEn: 'Coaching & Athlete Metrics',
    category: 'موبايل',
    icon: '🏆',
    iconBg: '#4c0519',
    iconColor: '#fb7185',
    uiType: 'figma',
    hasEmails: true,
    emailsList: ['coaching@academypro.com'],
    hasWebsite: false,
    websiteUrl: '',
    apkStatus: 'لم يتم الاستلام - في انتظار رفع النسخة الأولى',
    apkLink: '',
    dashboardStatus: 'تم الاستلام - قابل للتجربة وتدقيق البيانات',
    dashboardLink: '',
    figmaProgress: 75,
    figmaLink: '',
    githubLink: '',
    driveLink: '',
    nextMeeting: 'الأربعاء - 5:00 مساءً',
    meetingLink: '',
    openRequests: ['تحديث شارات الإنجازات والجوائز الرقمية للأبطال'],
    voiceNotes: 'جاري تسجيل أول 100 لاعب كعينة تجريبية لاختبار تقييم المهارات.',
    notes: 'تطبيق قياس أداء ولياقة اللاعبين الصاعدين في الأكاديميات وربطه بملفات المتابعة الفنية.'
  }
];

// ==============================================================================
// 2. حالة التطبيق (State)
// ==============================================================================
let projects = [];
let activeCategory = 'الكل';
let searchQuery = '';
let currentProjectId = null;
let isEditMode = false;
let recognition = null;
let isRecordingVoice = false;

// تهيئة البيانات من التخزين المحلي أو من القائمة الأصلية
function initProjects() {
  try {
    const saved = localStorage.getItem('hypatia_vanilla_projects_v1');
    if (saved) {
      projects = JSON.parse(saved);
    } else {
      projects = [...OFFICIAL_10_PROJECTS];
    }
  } catch (e) {
    projects = [...OFFICIAL_10_PROJECTS];
  }
}

function saveProjects() {
  try {
    localStorage.setItem('hypatia_vanilla_projects_v1', JSON.stringify(projects));
  } catch (e) {
    console.error('Error saving projects:', e);
  }
}

// ==============================================================================
// 3. عرض شاشة الشبكة (Grid View)
// ==============================================================================
function renderGridView() {
  const content = document.getElementById('view-content');
  if (!content) return;

  const filtered = projects.filter(p => {
    const matchesCat = (activeCategory === 'الكل' || p.category === activeCategory);
    const matchesSearch = (!searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return matchesCat && matchesSearch;
  });

  let cardsHtml = '';
  filtered.forEach(p => {
    // تحديد لون شارة الـ APK
    let apkBadgeClass = 'status-neutral';
    if (p.apkStatus && p.apkStatus.includes('تم الاستلام')) {
      apkBadgeClass = 'status-received';
    } else if (p.apkStatus && p.apkStatus.includes('لم يتم الاستلام')) {
      apkBadgeClass = 'status-waiting';
    } else if (p.apkStatus && p.apkStatus.includes('قيد التجربة')) {
      apkBadgeClass = 'status-testing';
    }

    // تحديد لون شارة الداش بورد
    let dashBadgeClass = 'status-neutral';
    if (p.dashboardStatus && p.dashboardStatus.includes('تم الاستلام')) {
      dashBadgeClass = 'status-received';
    } else if (p.dashboardStatus && p.dashboardStatus.includes('لم نستلم')) {
      dashBadgeClass = 'status-waiting';
    }

    cardsHtml += `
      <div class="project-card" onclick="openProjectDetails('${p.id}')">
        <span class="card-number-badge">${p.number}</span>
        <div class="card-icon-circle" style="background: ${p.iconBg || '#1e293b'}; color: ${p.iconColor || '#fbbf24'}; border: 1px solid ${p.iconColor || '#fbbf24'}40;">
          ${p.icon || '📱'}
        </div>
        <div class="card-title">${p.name}</div>
        <div class="card-title-en">${p.nameEn || ''}</div>
        
        <div class="card-status-pill ${apkBadgeClass}" title="${p.apkStatus || ''}">
          📱 ${p.apkStatus || 'حالة APK'}
        </div>
        
        <div class="card-status-pill ${dashBadgeClass}" title="${p.dashboardStatus || ''}">
          💻 ${p.dashboardStatus || 'الداش بورد'}
        </div>

        <div class="card-footer-stats">
          <span>🎨 ${p.figmaProgress || 0}%</span>
          <span>📧 ${p.hasEmails ? (p.emailsList ? p.emailsList.length : 0) : 0} إيميل</span>
          <span>⚠️ ${p.openRequests ? p.openRequests.length : 0} طلبات</span>
        </div>
      </div>
    `;
  });

  content.innerHTML = `
    <!-- Tabs -->
    <div class="filter-tabs">
      ${['الكل', 'قيد التجربة', 'موبايل', 'ويب', 'مكتمل', 'خاص'].map(cat => `
        <button class="tab-pill ${activeCategory === cat ? 'active' : ''}" onclick="setCategoryFilter('${cat}')">${cat}</button>
      `).join('')}
    </div>

    <!-- Search -->
    <div class="search-container">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" class="search-input" placeholder="ابحث باسم المشروع أو الكود (#001)..." value="${searchQuery}" oninput="handleSearch(this.value)" />
      </div>
    </div>

    <!-- Grid -->
    <div class="projects-grid">
      ${cardsHtml.length > 0 ? cardsHtml : '<div style="grid-column: span 2; text-align: center; padding: 40px; color: #64748b;">لا توجد مشاريع تطابق البحث الحالي</div>'}
    </div>
  `;
}

function setCategoryFilter(cat) {
  activeCategory = cat;
  renderGridView();
}

function handleSearch(val) {
  searchQuery = val;
  renderGridView();
}

// ==============================================================================
// 4. عرض شاشة تفاصيل المشروع (Detail View)
// ==============================================================================
function openProjectDetails(id) {
  currentProjectId = id;
  isEditMode = false;
  const project = projects.find(p => p.id === id);
  if (!project) return;

  const content = document.getElementById('view-content');
  if (!content) return;

  window.scrollTo({ top: 0, behavior: 'smooth' });

  content.innerHTML = `
    <div class="detail-view">
      <!-- Navigation -->
      <div class="detail-nav">
        <button class="back-btn" onclick="backToGrid()">
          ← رجوع للمشاريع
        </button>
        <div style="display: flex; gap: 8px;">
          <button class="back-btn" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border-color: rgba(245, 158, 11, 0.3);" onclick="openEditView('${project.id}')">
            ✏️ تعديل المشروع
          </button>
        </div>
      </div>

      <!-- Main Header Card -->
      <div class="detail-header-card">
        <div class="detail-icon-circle" style="background: ${project.iconBg || '#1e293b'}; color: ${project.iconColor || '#fbbf24'}; border: 2px solid ${project.iconColor || '#fbbf24'}60;">
          ${project.icon || '📱'}
        </div>
        <div class="detail-title">${project.name}</div>
        <div class="detail-subtitle">${project.nameEn || ''} • كود ${project.number}</div>
        <div style="display: inline-block; margin-top: 8px; font-size: 11px; background: rgba(255,255,255,0.06); padding: 3px 12px; border-radius: 9999px;">
          تصنيف: ${project.category}
        </div>
      </div>

      <!-- Quick AI Action Banner -->
      <div class="ai-export-card">
        <div style="font-size: 13px; font-weight: 700; color: #fbbf24; display: flex; align-items: center; gap: 6px;">
          مذكرة المشروع للذكاء الاصطناعي
        </div>
        <div style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
          نسخ تقرير حالة المشروع والتحديثات الصوتية والروابط ولصقها في أي شات ذكاء اصطناعي.
        </div>
        <button class="ai-export-btn" onclick="copyAiBrief('${project.id}')">
          📋 نسخ المذكرة للـ AI
        </button>
      </div>

      <!-- Project Status & Delivery Section -->
      <div class="section-box">
        <div class="section-box-title">
          <span>📦 حالة التسليمات والتشغيل</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">حالة تطبيق الهاتف (APK)</span>
          <span class="info-value" style="color: #38bdf8;">${project.apkStatus || 'غير محدد'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">لوحة التحكم (Dashboard)</span>
          <span class="info-value" style="color: #34d399;">${project.dashboardStatus || 'غير محدد'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">منهجية الواجهات (UI/UX)</span>
          <span class="info-value">
            ${project.uiType === 'figma' ? '🎨 مصمم عبر فيجما' : 
              project.uiType === 'code' ? '💻 تصميم مباشر بالأكواد' : 
              project.uiType === 'both' ? '🎨💻 فيجما + كود مباشر' : 'بدون واجهات خاصة'}
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">نسبة اكتمال التصميم</span>
          <span class="info-value">${project.figmaProgress || 0}%</span>
        </div>
      </div>

      <!-- Communications & Emails Section -->
      <div class="section-box">
        <div class="section-box-title">
          <span>📧 قنوات التواصل والموقع</span>
        </div>
        <div class="info-row">
          <span class="info-label">الموقع الإلكتروني</span>
          <span class="info-value">
            ${project.hasWebsite && project.websiteUrl ? `<a href="${project.websiteUrl}" target="_blank" style="color: #38bdf8; text-decoration: underline;">فتح الموقع الرسمي ↗</a>` : 'لا يوجد موقع حالياً'}
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">الإيميلات الرسمية المعتمدة</span>
          <span class="info-value">
            ${project.hasEmails && project.emailsList && project.emailsList.length > 0 ? `${project.emailsList.length} إيميلات` : 'لا توجد إيميلات مفعلة'}
          </span>
        </div>
        ${project.hasEmails && project.emailsList && project.emailsList.length > 0 ? `
          <div style="background: rgba(0,0,0,0.25); border-radius: 8px; padding: 8px 10px; font-size: 11px; font-family: var(--font-mono); color: #cbd5e1; display: flex; flex-direction: column; gap: 4px;">
            ${project.emailsList.map(em => `<span>• ${em}</span>`).join('')}
          </div>
        ` : ''}
        <div class="info-row">
          <span class="info-label">الميتنج والاجتماع القادم</span>
          <span class="info-value">${project.nextMeeting || 'غير محدد'}</span>
        </div>
      </div>

      <!-- Links Grid -->
      <div class="section-box">
        <div class="section-box-title">
          <span>🔗 الروابط والمستندات المباشرة</span>
        </div>
        <div class="links-grid">
          <a href="${project.dashboardLink || '#'}" target="_blank" class="link-action-btn ${!project.dashboardLink ? 'disabled' : ''}">
            💻 الداش بورد
          </a>
          <a href="${project.apkLink || '#'}" target="_blank" class="link-action-btn ${!project.apkLink ? 'disabled' : ''}">
            📱 ملف الـ APK
          </a>
          <a href="${project.figmaLink || '#'}" target="_blank" class="link-action-btn ${!project.figmaLink ? 'disabled' : ''}">
            🎨 ملف Figma
          </a>
          <a href="${project.githubLink || '#'}" target="_blank" class="link-action-btn ${!project.githubLink ? 'disabled' : ''}">
            🐙 GitHub
          </a>
          <a href="${project.driveLink || '#'}" target="_blank" class="link-action-btn ${!project.driveLink ? 'disabled' : ''}">
            📁 Google Drive
          </a>
          <a href="${project.meetingLink || '#'}" target="_blank" class="link-action-btn ${!project.meetingLink ? 'disabled' : ''}">
            🎥 رابط الميتنج
          </a>
        </div>
      </div>

      <!-- Voice Notes & Recent Updates -->
      <div class="section-box">
        <div class="section-box-title">
          <span>🎙️ التحديثات والرسائل الصوتية</span>
        </div>
        <div style="font-size: 13px; color: #e2e8f0; line-height: 1.6; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 10px; border-right: 3px solid #f59e0b;">
          ${project.voiceNotes || 'لا توجد ملاحظات صوتية مسجلة بعد. يمكنك إضافة ملاحظة صوتية من شاشة التعديل.'}
        </div>
      </div>

      <!-- Notes & Operational Summary -->
      <div class="section-box">
        <div class="section-box-title">
          <span>📝 الموقف الفعلي والملخص</span>
        </div>
        <div style="font-size: 13px; color: #cbd5e1; line-height: 1.6;">
          ${project.notes || 'لا توجد ملاحظات تفصيلية مسجلة.'}
        </div>
      </div>
    </div>
  `;
}

function backToGrid() {
  currentProjectId = null;
  isEditMode = false;
  renderGridView();
}

// ==============================================================================
// 5. شاشة التعديل الديناميكي المرن مع التعرف الصوتي (Dynamic Flexible Form)
// ==============================================================================
function openEditView(id) {
  isEditMode = true;
  const project = projects.find(p => p.id === id);
  if (!project) return;

  const content = document.getElementById('view-content');
  if (!content) return;

  window.scrollTo({ top: 0, behavior: 'smooth' });

  content.innerHTML = `
    <div class="edit-form">
      <div class="detail-nav">
        <button class="back-btn" onclick="openProjectDetails('${project.id}')">
          ← إلغاء ورجوع
        </button>
        <span style="font-size: 14px; font-weight: 700; color: #fbbf24;">تعديل: ${project.name}</span>
      </div>

      <!-- Project Main Info -->
      <div class="form-group">
        <label class="form-label">اسم المشروع باللغة العربية</label>
        <input type="text" id="edit-name" class="form-input" value="${project.name}" />
      </div>

      <div class="form-group">
        <label class="form-label">الاسم بالإنجليزية</label>
        <input type="text" id="edit-name-en" class="form-input" value="${project.nameEn || ''}" />
      </div>

      <div class="form-group">
        <label class="form-label">تصنيف المنظومة</label>
        <select id="edit-category" class="form-select">
          <option value="قيد التجربة" ${project.category === 'قيد التجربة' ? 'selected' : ''}>قيد التجربة</option>
          <option value="موبايل" ${project.category === 'موبايل' ? 'selected' : ''}>موبايل</option>
          <option value="ويب" ${project.category === 'ويب' ? 'selected' : ''}>ويب</option>
          <option value="مكتمل" ${project.category === 'مكتمل' ? 'selected' : ''}>مكتمل</option>
          <option value="خاص" ${project.category === 'خاص' ? 'selected' : ''}>خاص</option>
        </select>
      </div>

      <!-- Dropdown 1: APK Status -->
      <div class="form-group">
        <label class="form-label">📱 حالة تطبيق الهاتف (APK)</label>
        <select id="edit-apk-status" class="form-select" onchange="toggleApkLinkVisibility()">
          <option value="تم الاستلام - قيد التجربة الميدانية" ${project.apkStatus && project.apkStatus.includes('التجربة الميدانية') ? 'selected' : ''}>✅ تم الاستلام - قيد التجربة الميدانية</option>
          <option value="تم الاستلام - واجهات فقط" ${project.apkStatus && project.apkStatus.includes('واجهات') ? 'selected' : ''}>📱 تم الاستلام - تقييم واجهات فقط</option>
          <option value="لم يتم الاستلام - قيد التطوير" ${project.apkStatus && project.apkStatus.includes('لم يتم') ? 'selected' : ''}>⏳ لم يتم الاستلام - قيد التطوير</option>
          <option value="في انتظار رفع نسخة التجربة" ${project.apkStatus && project.apkStatus.includes('في انتظار') ? 'selected' : ''}>⚠️ في انتظار رفع نسخة الاختبار</option>
          <option value="لا يتطلب تطبيق موبايل (منصة ويب)" ${project.apkStatus && project.apkStatus.includes('لا يتطلب') ? 'selected' : ''}>🌐 لا يتطلب تطبيق موبايل (منصة ويب)</option>
        </select>
      </div>

      <div id="apk-link-container" class="form-group conditional-fields" style="display: ${project.apkStatus && !project.apkStatus.includes('لا يتطلب') ? 'flex' : 'none'};">
        <label class="form-label">🔗 رابط تحميل أو مجلد الـ APK</label>
        <input type="text" id="edit-apk-link" class="form-input" placeholder="https://drive.google.com/..." value="${project.apkLink || ''}" />
      </div>

      <!-- Dropdown 2: Dashboard Status -->
      <div class="form-group">
        <label class="form-label">💻 حالة لوحة التحكم (Dashboard)</label>
        <select id="edit-dashboard-status" class="form-select" onchange="toggleDashboardLinkVisibility()">
          <option value="تم الاستلام - قابل للتجربة وتدقيق البيانات" ${project.dashboardStatus && project.dashboardStatus.includes('قابل للتجربة') ? 'selected' : ''}>✅ تم الاستلام - قابل للتجربة وتدقيق البيانات</option>
          <option value="تم الاستلام - مكتمل وفي الإنتاج" ${project.dashboardStatus && project.dashboardStatus.includes('مكتمل') ? 'selected' : ''}>🚀 تم الاستلام - مكتمل وفي الإنتاج</option>
          <option value="لم نستلم الداش بورد بعد" ${project.dashboardStatus && project.dashboardStatus.includes('لم نستلم') ? 'selected' : ''}>⏳ لم نستلم الداش بورد بعد</option>
          <option value="لوحة العمليات قيد التصميم الهندسي" ${project.dashboardStatus && project.dashboardStatus.includes('التصميم الهندسي') ? 'selected' : ''}>📐 لوحة العمليات قيد التصميم الهندسي</option>
        </select>
      </div>

      <div id="dashboard-link-container" class="form-group conditional-fields" style="display: ${project.dashboardStatus && project.dashboardStatus.includes('تم الاستلام') ? 'flex' : 'none'};">
        <label class="form-label">🔗 رابط لوحة التحكم (Dashboard Link)</label>
        <input type="text" id="edit-dashboard-link" class="form-input" placeholder="https://dashboard..." value="${project.dashboardLink || ''}" />
      </div>

      <!-- Flexible UI/UX Options: Figma vs Code -->
      <div class="form-group">
        <label class="form-label">🎨 تصميم الواجهات (UI/UX)</label>
        <select id="edit-ui-type" class="form-select" onchange="toggleFigmaFieldsVisibility()">
          <option value="figma" ${project.uiType === 'figma' ? 'selected' : ''}>🎨 مصمم بملف فيجما (Figma)</option>
          <option value="code" ${project.uiType === 'code' ? 'selected' : ''}>💻 تصميم بالأكواد مباشرة (بدون فيجما)</option>
          <option value="both" ${project.uiType === 'both' ? 'selected' : ''}>🎨💻 فيجما + أكواد مباشرة</option>
          <option value="none" ${project.uiType === 'none' ? 'selected' : ''}>⚙️ نظام تشغيلي / بدون واجهات مستخدم</option>
        </select>
      </div>

      <div id="figma-fields-container" class="form-group conditional-fields" style="display: ${(project.uiType === 'figma' || project.uiType === 'both') ? 'flex' : 'none'};">
        <label class="form-label">رابط ملف فيجما (Figma Link)</label>
        <input type="text" id="edit-figma-link" class="form-input" placeholder="https://figma.com/..." value="${project.figmaLink || ''}" />
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
          <label class="form-label" style="margin: 0;">نسبة الإنجاز: <span id="figma-val">${project.figmaProgress || 0}%</span></label>
          <input type="range" id="edit-figma-progress" min="0" max="100" value="${project.figmaProgress || 0}" style="width: 50%;" oninput="document.getElementById('figma-val').innerText = this.value + '%'" />
        </div>
      </div>

      <!-- Flexible Emails: Yes/No -->
      <div class="form-group">
        <label class="form-label">📧 هل توجد إيميلات رسمية للمشروع؟</label>
        <select id="edit-has-emails" class="form-select" onchange="toggleEmailsVisibility()">
          <option value="yes" ${project.hasEmails ? 'selected' : ''}>نعم، توجد إيميلات رسمية</option>
          <option value="no" ${!project.hasEmails ? 'selected' : ''}>لا، لا توجد إيميلات حالياً</option>
        </select>
      </div>

      <div id="emails-container" class="form-group conditional-fields" style="display: ${project.hasEmails ? 'flex' : 'none'};">
        <label class="form-label">قائمة الإيميلات (مفصولة بفواصل)</label>
        <input type="text" id="edit-emails-list" class="form-input" placeholder="admin@domain.com, info@domain.com" value="${(project.emailsList || []).join(', ')}" />
      </div>

      <!-- Flexible Website: Yes/No -->
      <div class="form-group">
        <label class="form-label">🌐 هل يوجد موقع إلكتروني للمشروع؟</label>
        <select id="edit-has-website" class="form-select" onchange="toggleWebsiteVisibility()">
          <option value="yes" ${project.hasWebsite ? 'selected' : ''}>نعم، يوجد موقع إلكتروني</option>
          <option value="no" ${!project.hasWebsite ? 'selected' : ''}>لا، لا يوجد موقع رسمي</option>
        </select>
      </div>

      <div id="website-container" class="form-group conditional-fields" style="display: ${project.hasWebsite ? 'flex' : 'none'};">
        <label class="form-label">رابط الموقع الرسمي</label>
        <input type="text" id="edit-website-url" class="form-input" placeholder="https://..." value="${project.websiteUrl || ''}" />
      </div>

      <!-- Other Links -->
      <div class="form-group">
        <label class="form-label">مستودع GitHub</label>
        <input type="text" id="edit-github-link" class="form-input" placeholder="https://github.com/..." value="${project.githubLink || ''}" />
      </div>

      <div class="form-group">
        <label class="form-label">مجلد Google Drive للأصول</label>
        <input type="text" id="edit-drive-link" class="form-input" placeholder="https://drive.google.com/..." value="${project.driveLink || ''}" />
      </div>

      <div class="form-group">
        <label class="form-label">الميتنج والاجتماع القادم</label>
        <input type="text" id="edit-next-meeting" class="form-input" placeholder="مثال: الأحد القادم - 5:00 مساءً" value="${project.nextMeeting || ''}" />
      </div>

      <div class="form-group">
        <label class="form-label">رابط الميتنج (Google Meet / Zoom)</label>
        <input type="text" id="edit-meeting-link" class="form-input" placeholder="https://meet.google.com/..." value="${project.meetingLink || ''}" />
      </div>

      <!-- Voice Input for Updates & Voice Notes -->
      <div class="form-group">
        <div class="form-label">
          <span>🎙️ التحديثات والرسائل الصوتية</span>
          <button type="button" id="voice-record-btn" class="voice-btn" onclick="toggleVoiceInput('edit-voice-notes')">
            🎤 إملاء بالصوت
          </button>
        </div>
        <textarea id="edit-voice-notes" class="form-textarea" placeholder="اضغط على زر (إملاء بالصوت) أو اكتب هنا التحديثات والرسائل السريعة...">${project.voiceNotes || ''}</textarea>
      </div>

      <!-- Notes with Voice option -->
      <div class="form-group">
        <div class="form-label">
          <span>📝 الموقف الفعلي والملخص</span>
          <button type="button" class="voice-btn" onclick="toggleVoiceInput('edit-notes')">
            🎤 إملاء بالصوت
          </button>
        </div>
        <textarea id="edit-notes" class="form-textarea" placeholder="الموقف التشغيلي التفصيلي...">${project.notes || ''}</textarea>
      </div>

      <!-- Save & Action Buttons -->
      <div style="display: flex; gap: 10px; margin-top: 10px;">
        <button type="button" class="ai-export-btn" style="flex: 1;" onclick="saveProjectChanges('${project.id}')">
          💾 حفظ التغييرات
        </button>
        <button type="button" class="back-btn" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border-color: rgba(239, 68, 68, 0.3);" onclick="deleteProjectItem('${project.id}')">
          🗑️ حذف
        </button>
      </div>
    </div>
  `;
}

// Toggle Visibility Helpers
function toggleApkLinkVisibility() {
  const status = document.getElementById('edit-apk-status').value;
  const container = document.getElementById('apk-link-container');
  if (container) {
    container.style.display = status.includes('لا يتطلب') ? 'none' : 'flex';
  }
}

function toggleDashboardLinkVisibility() {
  const status = document.getElementById('edit-dashboard-status').value;
  const container = document.getElementById('dashboard-link-container');
  if (container) {
    container.style.display = status.includes('تم الاستلام') ? 'flex' : 'none';
  }
}

function toggleFigmaFieldsVisibility() {
  const uiType = document.getElementById('edit-ui-type').value;
  const container = document.getElementById('figma-fields-container');
  if (container) {
    container.style.display = (uiType === 'figma' || uiType === 'both') ? 'flex' : 'none';
  }
}

function toggleEmailsVisibility() {
  const hasEmails = document.getElementById('edit-has-emails').value;
  const container = document.getElementById('emails-container');
  if (container) {
    container.style.display = hasEmails === 'yes' ? 'flex' : 'none';
  }
}

function toggleWebsiteVisibility() {
  const hasWeb = document.getElementById('edit-has-website').value;
  const container = document.getElementById('website-container');
  if (container) {
    container.style.display = hasWeb === 'yes' ? 'flex' : 'none';
  }
}

// حفظ التعديلات
function saveProjectChanges(id) {
  const p = projects.find(item => item.id === id);
  if (!p) return;

  p.name = document.getElementById('edit-name').value.trim() || p.name;
  p.nameEn = document.getElementById('edit-name-en').value.trim();
  p.category = document.getElementById('edit-category').value;
  p.apkStatus = document.getElementById('edit-apk-status').value;
  p.apkLink = document.getElementById('edit-apk-link') ? document.getElementById('edit-apk-link').value.trim() : '';
  p.dashboardStatus = document.getElementById('edit-dashboard-status').value;
  p.dashboardLink = document.getElementById('edit-dashboard-link') ? document.getElementById('edit-dashboard-link').value.trim() : '';
  p.uiType = document.getElementById('edit-ui-type').value;
  
  if (p.uiType === 'figma' || p.uiType === 'both') {
    p.figmaLink = document.getElementById('edit-figma-link') ? document.getElementById('edit-figma-link').value.trim() : '';
    p.figmaProgress = parseInt(document.getElementById('edit-figma-progress').value) || 0;
  } else {
    p.figmaLink = '';
  }

  p.hasEmails = document.getElementById('edit-has-emails').value === 'yes';
  if (p.hasEmails) {
    const rawEmails = document.getElementById('edit-emails-list').value;
    p.emailsList = rawEmails.split(',').map(e => e.trim()).filter(Boolean);
  } else {
    p.emailsList = [];
  }

  p.hasWebsite = document.getElementById('edit-has-website').value === 'yes';
  p.websiteUrl = p.hasWebsite && document.getElementById('edit-website-url') ? document.getElementById('edit-website-url').value.trim() : '';

  p.githubLink = document.getElementById('edit-github-link').value.trim();
  p.driveLink = document.getElementById('edit-drive-link').value.trim();
  p.nextMeeting = document.getElementById('edit-next-meeting').value.trim();
  p.meetingLink = document.getElementById('edit-meeting-link').value.trim();
  p.voiceNotes = document.getElementById('edit-voice-notes').value.trim();
  p.notes = document.getElementById('edit-notes').value.trim();

  saveProjects();
  showToast('تم حفظ التعديلات بنجاح! 🚀');
  openProjectDetails(id);
}

function deleteProjectItem(id) {
  projects = projects.filter(p => p.id !== id);
  saveProjects();
  showToast('تم حذف المشروع من القائمة بنجاح');
  backToGrid();
}

// ==============================================================================
// 6. ميزة التعرف الصوتي المدمجة (Web Speech API)
// ==============================================================================
function toggleVoiceInput(targetTextareaId) {
  const targetEl = document.getElementById(targetTextareaId);
  const recordBtn = document.getElementById('voice-record-btn');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast('متصفحك لا يدعم التسجيل الصوتي المباشر، يمكنك الكتابة يدوياً');
    return;
  }

  if (isRecordingVoice) {
    if (recognition) recognition.stop();
    isRecordingVoice = false;
    if (recordBtn) {
      recordBtn.classList.remove('recording');
      recordBtn.innerHTML = '🎤 إملاء بالصوت';
    }
    showToast('تم إيقاف التسجيل الصوتي');
    return;
  }

  try {
    recognition = new SpeechRecognition();
    recognition.lang = 'ar-EG'; // التعرف الصوتي باللغة العربية
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      isRecordingVoice = true;
      if (recordBtn) {
        recordBtn.classList.add('recording');
        recordBtn.innerHTML = '⏹️ جارٍ التسجيل...';
      }
      showToast('جارٍ الاستماع بالصوت... تحدث الآن');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript && targetEl) {
        targetEl.value = (targetEl.value ? targetEl.value + ' ' : '') + finalTranscript.trim();
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      isRecordingVoice = false;
      if (recordBtn) {
        recordBtn.classList.remove('recording');
        recordBtn.innerHTML = '🎤 إملاء بالصوت';
      }
      showToast('تعذر التقاط الصوت، تأكد من تفعيل إذن الميكروفون');
    };

    recognition.onend = () => {
      isRecordingVoice = false;
      if (recordBtn) {
        recordBtn.classList.remove('recording');
        recordBtn.innerHTML = '🎤 إملاء بالصوت';
      }
    };

    recognition.start();
  } catch (err) {
    console.error(err);
    showToast('خطأ في تشغيل الميكروفون');
  }
}

// ==============================================================================
// 7. تصدير مذكرة الذكاء الاصطناعي الشاملة (AI Brief with Voice & Updates)
// ==============================================================================
function generateAiBrief(p) {
  return `مذكرة مشروع: ${p.name} (${p.number})
============================================================
التاريخ: ${new Date().toLocaleDateString('ar-EG')}

1. البيانات الأساسية:
- الاسم: ${p.name} (${p.nameEn || ''})
- التصنيف: ${p.category}
- الواجهات: ${p.uiType === 'figma' ? 'فيجما' : p.uiType === 'code' ? 'أكواد مباشرة' : 'مشترك'} ${p.figmaProgress ? `(${p.figmaProgress}%)` : ''}

2. حالة التسليم:
- تطبيق الهاتف (APK): ${p.apkStatus || 'غير محدد'}
- لوحة التحكم (Dashboard): ${p.dashboardStatus || 'غير محدد'}
- الإيميلات: ${p.hasEmails && p.emailsList ? p.emailsList.join(', ') : 'لا توجد'}
- الموقع: ${p.hasWebsite && p.websiteUrl ? p.websiteUrl : 'لا يوجد'}
- الميتنج القادم: ${p.nextMeeting || 'غير مجدول'} ${p.meetingLink ? `[${p.meetingLink}]` : ''}

3. التحديثات والملاحظات الصوتية:
${p.voiceNotes ? `  * "${p.voiceNotes}"` : '  * لا توجد تحديثات جديدة.'}

4. الطلبات المعلقة (${p.openRequests ? p.openRequests.length : 0}):
${p.openRequests && p.openRequests.length > 0 ? p.openRequests.map((r, i) => `  ${i + 1}. ${r}`).join('\n') : '  لا توجد طلبات معلقة.'}

5. الروابط:
- الداش بورد: ${p.dashboardLink || 'غير متوفر'}
- الـ APK: ${p.apkLink || 'غير متوفر'}
- فيجما: ${p.figmaLink || 'غير متوفر'}
- GitHub: ${p.githubLink || 'غير متوفر'}
- Drive: ${p.driveLink || 'غير متوفر'}

6. ملاحظات إضافية:
${p.notes || 'لا توجد.'}`;
}

function copyAiBrief(id) {
  const p = projects.find(item => item.id === id);
  if (!p) return;

  const brief = generateAiBrief(p);
  copyToClipboard(brief, 'تم نسخ مذكرة المشروع والتحديثات الصوتية بنجاح! جاهزة للصق في أي شات 📋');
}

function copyToClipboard(text, successMsg) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  } catch {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    showToast(successMsg);
  } catch {
    showToast('يرجى نسخ النص يدوياً');
  }
}

function showToast(msg) {
  const existing = document.querySelector('.toast-msg');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `<span>✨</span><span>${msg}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// استرجاع المشاريع الـ 10 الأصلية
function resetAllProjectsToOfficial() {
  projects = [...OFFICIAL_10_PROJECTS];
  saveProjects();
  showToast('تم استعادة الـ 10 مشاريع الأصلية المعتمدة بالترتيب!');
  if (currentProjectId) {
    openProjectDetails(currentProjectId);
  } else {
    renderGridView();
  }
}

// ==============================================================================
// 8. Google Drive Integration (NOUB_IDLE sync & management)
// ==============================================================================
window.currentDriveAccessToken = null;

function handleDriveSyncClick() {
  const modal = document.getElementById('drive-modal');
  if (modal) modal.style.display = 'flex';

  // Check if we already have access token or need login
  const authSection = document.getElementById('drive-auth-section');
  if (!window.currentDriveAccessToken) {
    if (authSection) authSection.style.display = 'block';
  } else {
    if (authSection) authSection.style.display = 'none';
  }
}

function closeDriveModal() {
  const modal = document.getElementById('drive-modal');
  if (modal) modal.style.display = 'none';
}

async function loginWithGoogleForDrive() {
  if (window.googleDriveAuth && window.googleDriveAuth.signIn) {
    showToast('جارٍ فتح تسجيل الدخول بحساب Google...');
    await window.googleDriveAuth.signIn();
  } else {
    showToast('محرك تسجيل الدخول قيد التحميل، انتظر ثوانٍ وجرب ثانية');
  }
}

window.onDriveTokenReceived = (token) => {
  window.currentDriveAccessToken = token;
  const authSection = document.getElementById('drive-auth-section');
  if (authSection) authSection.style.display = 'none';
  const btnText = document.getElementById('drive-btn-text');
  if (btnText) btnText.innerText = 'NOUB_IDLE متصل ✅';
  showToast('تم ربط حساب Google Drive بنجاح! جاهز للمزامنة');
  runDriveSync();
};

async function runDriveSync() {
  if (!window.currentDriveAccessToken) {
    showToast('يرجى تسجيل الدخول بحساب Google أولاً للمزامنة');
    const authSection = document.getElementById('drive-auth-section');
    if (authSection) authSection.style.display = 'block';
    return;
  }

  const syncBtn = document.getElementById('sync-now-action-btn');
  if (syncBtn) {
    syncBtn.innerText = '⏳ جاري المزامنة مع Google Drive...';
    syncBtn.disabled = true;
  }

  showToast('جاري إنشاء وتحديث مستودع NOUB_IDLE والمجلدات على Drive...');

  try {
    const res = await fetch('/api/drive/setup-noub-idle', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${window.currentDriveAccessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();
    if (res.ok && data.success) {
      showToast('تم تحديث مجلد NOUB_IDLE وجميع الملفات بنجاح! 🚀');
      const linkContainer = document.getElementById('drive-link-container');
      const folderLink = document.getElementById('drive-master-folder-link');
      if (linkContainer && folderLink && data.masterFolder && data.masterFolder.link) {
        folderLink.href = data.masterFolder.link;
        linkContainer.style.display = 'block';
      }
    } else {
      showToast('خطأ أثناء المزامنة: ' + (data.error || ''));
    }
  } catch (err) {
    console.error('Drive sync failed:', err);
    showToast('حدث خطأ في الاتصال بالسيرفر للمزامنة');
  } finally {
    if (syncBtn) {
      syncBtn.innerText = '⚡ تحديث ومزامنة الملفات والمشاريع الآن';
      syncBtn.disabled = false;
    }
  }
}

// عرض كود SQL النظيف
function showSqlModal() {
  const modal = document.getElementById('sql-modal');
  if (modal) modal.style.display = 'flex';
}

function closeSqlModal() {
  const modal = document.getElementById('sql-modal');
  if (modal) modal.style.display = 'none';
}

function copySqlCode() {
  const codeEl = document.getElementById('sql-code-text');
  if (codeEl) {
    copyToClipboard(codeEl.innerText, 'تم نسخ كود الـ SQL النظيف بنجاح لـ Supabase! 🚀');
  }
}

// تشغيل التطبيق عند التحميل
document.addEventListener('DOMContentLoaded', () => {
  initProjects();
  renderGridView();
});
