import React, { useState, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  Send, 
  CheckCircle2, 
  Key, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  Smartphone,
  ExternalLink,
  MessageSquare,
  Github,
  GitBranch,
  Copy,
  Check,
  Database,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { ProjectItem, TabType } from '../types';
import { getSupabaseConfig, testSupabaseConnection, resetSupabaseClient } from '../lib/supabase';

interface SettingsTabProps {
  projects: ProjectItem[];
  onNavigateToTab?: (tab: TabType) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ projects, onNavigateToTab }) => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSettingWebhook, setIsSettingWebhook] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Supabase State
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseFeedback, setSupabaseFeedback] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const config = getSupabaseConfig();
    if (config.url) setSupabaseUrl(config.url);
    if (config.anonKey) setSupabaseAnonKey(config.anonKey);
  }, []);

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('hypatia_supabase_url', supabaseUrl.trim());
    localStorage.setItem('hypatia_supabase_anon_key', supabaseAnonKey.trim());
    resetSupabaseClient();
    setSupabaseFeedback({ success: true, message: 'تم حفظ إعدادات Supabase بنجاح في المتصفح!' });
  };

  const handleTestSupabase = async () => {
    setIsTestingSupabase(true);
    setSupabaseFeedback(null);
    try {
      const res = await testSupabaseConnection();
      setSupabaseFeedback({ success: res.success, message: res.message });
    } catch (err: any) {
      setSupabaseFeedback({ success: false, message: err.message || 'فشل الاتصال بـ Supabase' });
    } finally {
      setIsTestingSupabase(false);
    }
  };

  // Live test input
  const [testMessageText, setTestMessageText] = useState('هيباتيا، ما هي حالة خطوط الربط مع مصر للمقاصة ومشروع نوب سبورتس؟');
  const [testReply, setTestReply] = useState<string | null>(null);
  const [isTestingSimulation, setIsTestingSimulation] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('hypatia_telegram_token', botToken);
    localStorage.setItem('hypatia_telegram_chat_id', chatId);
    setStatusMessage({ text: 'تم حفظ مفاتيح التيليجرام بنجاح في المتصفح.', type: 'success' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleActivateWebhook = async () => {
    if (!botToken.trim()) {
      setStatusMessage({ text: 'يرجى إدخال التوكن أولاً (Bot Token)', type: 'error' });
      return;
    }

    setIsSettingWebhook(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/telegram/set-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: botToken }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatusMessage({
          text: `تم تفعيل الـ Webhook بنجاح مع سيرفر التيليجرام! الرابط: ${data.webhookUrl}`,
          type: 'success',
        });
      } else {
        setStatusMessage({
          text: `فشل التفعيل: ${data.description || data.error || 'خطأ غير معروف'}`,
          type: 'error',
        });
      }
    } catch (e: any) {
      setStatusMessage({ text: 'خطأ في الاتصال: ' + e.message, type: 'error' });
    } finally {
      setIsSettingWebhook(false);
    }
  };

  const handleSendTestTelegram = async () => {
    if (!botToken.trim() || !chatId.trim()) {
      setStatusMessage({ text: 'يرجى إدخال التوكن و Chat ID معاً لتجربة الإرسال الحقيقي', type: 'error' });
      return;
    }

    setIsSendingTest(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: botToken,
          chatId,
          text: '👋 مرحباً بك! أنا إيمو (Emo) - تم ربط البوت بنجاح لمتابعة تطبيقاتك ومشاريعك.',
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatusMessage({ text: 'تم إرسال رسالة التحقق بنجاح إلى حسابك على التيليجرام! تفقد المحادثة.', type: 'success' });
      } else {
        setStatusMessage({ text: `فشل الإرسال: ${data.description || 'تأكد من بدء المحادثة مع البوت بالضغط على Start'}`, type: 'error' });
      }
    } catch (e: any) {
      setStatusMessage({ text: 'خطأ في الإرسال: ' + e.message, type: 'error' });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSimulateWebhook = async () => {
    if (!testMessageText.trim() || isTestingSimulation) return;
    setIsTestingSimulation(true);
    setTestReply(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testMessageText,
          history: [],
          activeProject: projects[0],
        }),
      });
      const data = await res.json();
      setTestReply(data.reply || 'تم استلام الرسالة.');
    } catch (e: any) {
      setTestReply('خطأ: ' + e.message);
    } finally {
      setIsTestingSimulation(false);
    }
  };

  return (
    <div className="space-y-4 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 flex items-center justify-between shadow-xl">
        <div>
          <h1 className="text-base font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <span>إعدادات إيمو والربط مع تيليجرام</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            ربط البوت الشخصي في تيليجرام واستقبال الرسائل والتنبيهات
          </p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-2xl text-xs flex items-center gap-2 border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-950/40 text-rose-300 border-rose-500/40'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Telegram Setup Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Key className="w-4 h-4 text-emerald-400" />
          <span>مفاتيح البوت الخاص بك على تيليجرام (@BotFather):</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          بإمكانك وضع توكن البوت الذي تنشئه من @BotFather و Chat ID الخاص بك. لا تحتاج لأي استضافة خارجية، السيرفر الحالي مربوط مباشرة بالـ Webhook للرد عليك تلقائياً.
        </p>

        <form onSubmit={handleSaveKeys} className="space-y-3">
          <div>
            <label className="block text-[11px] text-slate-300 mb-1">توكن البوت (Telegram Bot Token):</label>
            <input
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="مثال: 7123456789:AAFxz_SAMPLE_TOKEN..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-300 mb-1">الـ Chat ID الخاص بك:</label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="مثال: 123456789 (يمكنك الحصول عليه من بوت @userinfobot)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
            >
              حفظ في التخزين
            </button>

            <button
              type="button"
              onClick={handleActivateWebhook}
              disabled={isSettingWebhook}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isSettingWebhook ? 'جاري التفعيل...' : 'تفعيل الـ Webhook مع التيليجرام'}</span>
            </button>

            <button
              type="button"
              onClick={handleSendTestTelegram}
              disabled={isSendingTest}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSendingTest ? 'جاري الإرسال...' : 'إرسال رسالة تجريبية لحسابك'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Simulator Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-teal-400" />
          <span>محاكي إرسال رسالة تيليجرام واختبار رد هيباتيا:</span>
        </h3>
        <p className="text-xs text-slate-400">
          يمكنك تجربة إرسال رسالة كأنها وردت من التيليجرام لرؤية كيفية صياغة هيباتيا للرد العملي.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={testMessageText}
            onChange={(e) => setTestMessageText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
          />
          <button
            onClick={handleSimulateWebhook}
            disabled={isTestingSimulation}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl transition"
          >
            {isTestingSimulation ? 'جاري المعالجة...' : 'إرسال واختبار'}
          </button>
        </div>

        {testReply && (
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
            <span className="font-bold text-teal-400 block mb-1">رد هيباتيا في التيليجرام:</span>
            {testReply}
          </div>
        )}
      </div>

      {/* Supabase Cloud Connection Card */}
      <div className="bg-slate-900/70 border border-teal-500/40 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-950 border border-teal-500/50 flex items-center justify-center text-teal-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <span>ربط سوبابيز وقواعد البيانات (Supabase Database Cloud)</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-mono font-bold">
                  PostgreSQL
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                قاعدة البيانات السحابية المركزية لتخزين ومزامنة كافة المشاريع والمزودين والعقود والإيميلات.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold flex items-center gap-1.5 transition border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>لوحة Supabase</span>
            </a>

            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('database')}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Database className="w-3.5 h-3.5" />
                <span>فتح استوديو سوبابيز</span>
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSaveSupabase} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 font-semibold block">
                Project URL (رابط المشروع من سوبابيز):
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xxxxxxxxxxxxxx.supabase.co"
                dir="ltr"
                className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-teal-200 font-mono focus:outline-none focus:border-teal-400"
              />
              <span className="text-[10px] text-slate-400 block">
                تجد الرابط في Supabase &gt; Project Settings &gt; Data API &gt; URL
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 font-semibold block">
                Anon / Public Key (المفتاح العام):
              </label>
              <input
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                dir="ltr"
                className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-teal-200 font-mono focus:outline-none focus:border-teal-400"
              />
              <span className="text-[10px] text-slate-400 block">
                تجد المفتاح في Supabase &gt; Project Settings &gt; Data API &gt; anon / public
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition"
            >
              حفظ المفاتيح في المتصفح
            </button>

            <button
              type="button"
              onClick={handleTestSupabase}
              disabled={isTestingSupabase}
              className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingSupabase ? 'animate-spin' : ''}`} />
              <span>فحص الاتصال المباشر</span>
            </button>
          </div>

          {supabaseFeedback && (
            <div
              className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 animate-in fade-in ${
                supabaseFeedback.success
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              {supabaseFeedback.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{supabaseFeedback.message}</span>
            </div>
          )}
        </form>
      </div>

      {/* GitHub Repository Card */}
      <div className="bg-slate-900/70 border border-cyan-500/40 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <span>مستودع الكود المصدري الرسمي (GitHub Repository)</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
                  NOUB-Hypatia
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                منظمة نوب (NOUB-Platform) • الفرع النشط: <span className="font-mono text-cyan-300">main</span>
              </p>
            </div>
          </div>

          <a
            href="https://github.com/NOUB-Platform/NOUB-Hypatia"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>عرض على GitHub</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold text-[11px]">Git Remote URL:</span>
              <button
                onClick={() => handleCopy('https://github.com/NOUB-Platform/NOUB-Hypatia.git', 'git-url')}
                className="text-[10px] text-cyan-400 hover:text-white flex items-center gap-1 font-sans"
              >
                {copiedKey === 'git-url' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'git-url' ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
            <div className="font-mono text-teal-300 break-all select-all text-[11px]">
              https://github.com/NOUB-Platform/NOUB-Hypatia.git
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold text-[11px]">أمر الاستنساخ (Clone):</span>
              <button
                onClick={() => handleCopy('git clone https://github.com/NOUB-Platform/NOUB-Hypatia.git', 'git-clone')}
                className="text-[10px] text-cyan-400 hover:text-white flex items-center gap-1 font-sans"
              >
                {copiedKey === 'git-clone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'git-clone' ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
            <div className="font-mono text-amber-200 break-all select-all text-[11px]">
              git clone https://github.com/NOUB-Platform/NOUB-Hypatia.git
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            تم ربط المستودع محلياً بنجاح كـ <strong className="font-mono text-white">origin</strong> مع تهيئة الفرع <strong className="font-mono text-white">main</strong> وتجهيز أول Commit لكامل ملفات المنظومة.
          </span>
        </div>
      </div>

      {/* Overview stats */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-4 text-xs text-slate-400 flex items-center justify-between">
        <span>عدد التطبيقات النشطة في النظام:</span>
        <span className="font-bold text-white font-mono">{projects.length} تطبيقات</span>
      </div>
    </div>
  );
};
