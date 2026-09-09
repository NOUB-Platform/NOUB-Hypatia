export type TabType = 
  | 'chat'
  | 'projects'
  | 'contracts'
  | 'tasks'
  | 'code'
  | 'database'
  | 'tools'
  | 'mashweer_emails'
  | 'providers'
  | 'settings';

export interface ApkItem {
  id: string;
  version: string;
  buildNumber: number;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  notes: string;
  downloadUrl?: string;
  status: 'جاهز للاختبار' | 'تم اعتماده' | 'يحتوي مشاكل' | 'قيد البناء';
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  notes?: string;
  priority: 'عاجل' | 'متوسط' | 'منخفض';
  status: 'قيد الانتظار' | 'جاري العمل' | 'مكتمل';
  createdAt: string;
  dueDate?: string;
}

export interface ApiEndpointItem {
  id: string;
  name: string;
  service: string; // e.g., 'مصر للمقاصة', 'MIST مصر للمعلومات', 'مباشر Mubasher', 'Supabase', 'EGX', 'البنك'
  urlOrIp: string;
  method: 'GET' | 'POST' | 'PUT' | 'SOCKET' | 'FIX' | 'PING';
  apiKeyOrSecret?: string;
  status: 'يعمل بكفاءة' | 'خط احتياطي' | 'معطل / تحت الفحص' | 'تجريبي';
  lastPingMs?: number;
  notes?: string;
}

export interface DriveAssetItem {
  id: string;
  name: string; // e.g., 'شعار نوب سبورتس وملفات الـ SVG', 'مجلد تصاميم الواجهات UI', 'مجلد ملفات الـ APK'
  pathOrUrl: string; // Google Drive folder URL or exact path (e.g. 'Google Drive/NOUB/Assets/Logos')
  type: 'logos' | 'design' | 'apk' | 'docs' | 'source_code' | 'other';
  notes?: string;
  updatedAt?: string;
}

export interface ReferenceChatItem {
  id: string;
  title: string; // e.g., 'محادثة تخطيط محرك الترتيب في نوب سبورتس'
  platform: 'Claude' | 'ChatGPT' | 'Gemini' | 'Perplexity' | 'Other';
  url: string; // Link to the chat or transcript
  keyTakeaways: string; // Key points or decisions discussed
  relevanceToProject: string; // How Hypatia should use this in conversations
  dateAdded: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  code: string;
  category: 'مشاوير' | 'نوب NOUB' | 'مالي وتداول' | 'مستقل' | 'خاص';
  description: string;
  status: 'قيد التطوير' | 'مرحلة الاختبار QA' | 'جاهز للنشر' | 'في الإنتاج';
  figmaUrl?: string;
  repoUrl?: string;
  apkFiles: ApkItem[];
  driveAssets?: DriveAssetItem[];
  referenceChats?: ReferenceChatItem[];
  contextHints?: string[];
  tasksCount?: number;
  dbInfo?: {
    type: string;
    tables: string[];
    notes: string;
  };
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'hypatia' | 'emo' | 'system';
  content: string;
  timestamp: string;
  projectId?: string;
  category?: 'general' | 'task' | 'code' | 'figma' | 'apk' | 'db' | 'ops';
  actions?: { label: string; action: string; payload?: any }[];
  sqlQuery?: string;
  codeSnippet?: string;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  botName?: string;
  botUsername?: string;
  webhookSet: boolean;
  webhookUrl?: string;
  lastMessageReceived?: string;
}

export interface CodeReviewResult {
  summary: string;
  score: number;
  verdict: string;
  upgradedCode?: string;
  securityIssues: string[];
  performanceRisks: string[];
  notes: string;
}

export interface MashweerEmployeeEmail {
  id: string;
  employeeName: string;
  role: string;
  emailAddress: string;
  status: 'تم الطلب - موعد الاستلام غداً' | 'محجوز ومعتمد' | 'مقترح قيد الإنشاء' | 'قيد الإعداد بالـ DNS';
  provider: 'Zoho Lite (المصرية لتكنولوجيا المعلومات)' | 'Zoho Mail Free' | 'Cloudflare Forwarding' | 'Google Workspace';
  createdAt: string;
  deliveryDate?: string;
  notes?: string;
}

export interface ContractDeliverable {
  id: string;
  appName: string; // e.g. 'فور بي (4B)', 'وكالة (WeKaLa)', 'دارو (Daro)'
  appCode: string;
  developerName: string;
  contractStatus: 'جاري العمل' | 'مرحلة فحص الكود والتسليم' | 'تم استلام APK' | 'تم الاعتماد النهائي';
  targetDeliveryDate: string;
  sourceCodeRepo?: string;
  agreedPrice?: string;
  paidAmount?: string;
  remainingAmount?: string;
  checklist: {
    id: string;
    item: string;
    completed: boolean;
    required: boolean;
    category: 'code' | 'apk' | 'figma' | 'keystore' | 'db' | 'docs';
  }[];
  notes: string;
}

export interface ProviderCredential {
  id: string;
  keyName: string; // e.g., 'API Key', 'Access Secret', 'لوحة التحكم', 'رمز التاجر'
  keyValue: string;
  type: 'api_key' | 'password' | 'secret' | 'token' | 'url' | 'env_var' | 'account_id';
  notes?: string;
  isSensitive?: boolean;
}

export interface ProviderTask {
  id: string;
  title: string;
  dueDate?: string;
  status: 'معلقة' | 'جاري المتابعة' | 'مكتملة';
  priority: 'عاجل' | 'متوسط' | 'عادي';
  notes?: string;
  assignedContact?: string;
}

export interface ProviderActiveService {
  id: string;
  name: string; // e.g. 'COM.EG', 'Host1'
  domainOrResource: string; // e.g. 'mashawer.com.eg'
  price: string; // e.g. '1100.00 جنيه مصري'
  billingCycle: string; // e.g. 'Annually'
  nextDueDate: string; // e.g. 'Monday, August 9th, 2027'
  status: 'Active' | 'Pending' | 'Suspended';
  hasSsl?: boolean;
}

export interface ServiceProviderItem {
  id: string;
  name: string; // e.g. 'المصرية لتكنولوجيا المعلومات (EC / eyg.com.eg)'
  category: 'دومينات وإيميلات' | 'استضافة وسيرفرات WE' | 'رسائل و OTP' | 'تطوير برمجيات قيمة تك' | 'بوابات دفع' | 'خرائط وميديا' | 'أخرى';
  website?: string;
  contactPersons: {
    name: string; // e.g. 'المهندس محمد الحلو', 'المهندس أحمد محرم', 'المهندس أحمد غريب', 'المحامي'
    role: string;
    phone?: string;
    email?: string;
    notes?: string;
  }[];
  subscriptionDate?: string; // e.g. '2026-09-09'
  renewalDate?: string; // e.g. '2027-09-09'
  costOrPlan?: string; // e.g. 'Zoho Lite لـ 6 إيميلات + الدومينات'
  activeServices?: ProviderActiveService[];
  credentials: ProviderCredential[];
  tasks: ProviderTask[];
  notes?: string;
  linkedApps?: string[]; // e.g. ['4B', 'Wikala', 'Daro']
  officialBadge?: string;
}



