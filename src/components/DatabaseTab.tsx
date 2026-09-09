import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Sparkles, 
  Copy, 
  Check, 
  Terminal, 
  Table, 
  Layers, 
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Lock,
  Cloud,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ProjectItem } from '../types';
import { SUPABASE_MASTER_SQL, SUPABASE_TABLES_SCHEMA } from '../data/supabaseSchema';
import { getSupabaseConfig, testSupabaseConnection, resetSupabaseClient } from '../lib/supabase';

interface DatabaseTabProps {
  activeProject: ProjectItem;
  projects: ProjectItem[];
  onAskEmo: (prompt: string) => void;
}

export const DatabaseTab: React.FC<DatabaseTabProps> = ({
  activeProject,
  projects,
  onAskEmo,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'schema' | 'sync' | 'ai-sql'>('schema');
  const [selectedProjectId, setSelectedProjectId] = useState(activeProject.id);
  const [naturalQuestion, setNaturalQuestion] = useState('استخرج أعلى 10 كباتن تقييماً قاموا بأكثر من 50 رحلة هذا الشهر مع ترتيبهم تنازلياً');
  const [isGeneratingSql, setIsGeneratingSql] = useState(false);
  const [copiedMasterSql, setCopiedMasterSql] = useState(false);
  const [copiedQuerySql, setCopiedQuerySql] = useState(false);
  
  // Supabase Config State
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('hypatia_supabase_url') || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(() => localStorage.getItem('hypatia_supabase_anon_key') || '');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ checked: boolean; success: boolean; message: string } | null>(null);

  const [sqlResult, setSqlResult] = useState<{
    sql: string;
    explanation: string;
    indexRecommendation?: string;
    riskLevel?: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const selectedProj = projects.find((p) => p.id === selectedProjectId) || activeProject;

  const currentPresets = [
    'استخرج سجلات الرحلات الملغاة ومعدل زمن وصول الكابتن (ETA)',
    'احسب إجمالي عمولات الوكلاء المستحقة لشهر مايو حسب كل وكيل',
    'استخرج الشحنات التي تجاوزت 48 ساعة في محطة التوزيع ولم تسلم',
    'احسب إجمالي العمليات الناجحة مقابل الفاشلة اليوم',
  ];

  const handleCopyMasterSql = () => {
    navigator.clipboard.writeText(SUPABASE_MASTER_SQL);
    setCopiedMasterSql(true);
    showToast('تم نسخ كود الـ SQL الماستر كاملاً بنجاح! جاهز للصق في Supabase SQL Editor.');
    setTimeout(() => setCopiedMasterSql(false), 3000);
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('hypatia_supabase_url', supabaseUrl.trim());
    localStorage.setItem('hypatia_supabase_anon_key', supabaseAnonKey.trim());
    resetSupabaseClient();
    showToast('تم حفظ إعدادات Supabase بنجاح!');
    setConnectionStatus(null);
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus(null);
    try {
      const res = await testSupabaseConnection();
      setConnectionStatus({ checked: true, success: res.success, message: res.message });
    } catch (err: any) {
      setConnectionStatus({ checked: true, success: false, message: err.message || 'خطأ غير معروف' });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleGenerateSql = async () => {
    if (!naturalQuestion.trim() || isGeneratingSql) return;
    setIsGeneratingSql(true);
    setSqlResult(null);

    try {
      const res = await fetch('/api/gemini/text-to-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: naturalQuestion,
          tableSchemas: `
- Project: ${selectedProj.name} (${selectedProj.code})
- Tables: ${selectedProj.dbInfo?.tables.join(', ') || 'general_records'}
- Notes: ${selectedProj.dbInfo?.notes || ''}
          `,
        }),
      });

      const data = await res.json();
      if (data.sql) {
        setSqlResult(data);
      } else {
        showToast('لم يتم إرجاع استعلام: ' + (data.error || 'خطأ غير معروف'));
      }
    } catch (err: any) {
      showToast('خطأ أثناء توليد الاستعلام: ' + err.message);
    } finally {
      setIsGeneratingSql(false);
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-slate-900/95 border border-teal-500/60 text-teal-200 text-xs rounded-2xl shadow-2xl flex items-center justify-between animate-in fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white px-2 font-bold">✕</button>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-[#182640] border border-slate-700/80 rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-950 border border-teal-600/60 flex items-center justify-center text-teal-300">
                <Database className="w-5 h-5" />
              </div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                <span>استوديو سوبابيز وقواعد البيانات (Supabase Studio)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-mono font-bold">
                  PostgreSQL + RLS
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              مخطط الجداول السحابية الرسمية، كود SQL المعتمد، وسياسات الحماية (Row Level Security) لضمان خصوصية بياناتك 100%.
            </p>
          </div>

          <button
            onClick={handleCopyMasterSql}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shrink-0 self-start sm:self-auto active:scale-95"
          >
            {copiedMasterSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedMasterSql ? 'تم نسخ الـ SQL!' : 'نسخ كود SQL كامل للسوبابيز'}</span>
          </button>
        </div>

        {/* Sub-Tabs Nav */}
        <div className="flex items-center gap-2 pt-3 text-xs">
          <button
            onClick={() => setActiveSubTab('schema')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'schema'
                ? 'bg-teal-500 text-slate-950'
                : 'text-slate-300 hover:bg-slate-800/80'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>مخطط الجداول السبعة (Schema)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sync')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'sync'
                ? 'bg-teal-500 text-slate-950'
                : 'text-slate-300 hover:bg-slate-800/80'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>الربط السحابي والمزامنة (Live Sync)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ai-sql')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'ai-sql'
                ? 'bg-teal-500 text-slate-950'
                : 'text-slate-300 hover:bg-slate-800/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>توليد استعلامات ذكية (AI SQL)</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Schema & Master SQL */}
      {activeSubTab === 'schema' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Quick Guide Card */}
          <div className="bg-[#101b30] border border-cyan-500/30 rounded-3xl p-4 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-cyan-200 flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>كيف ترفع الجداول إلى سوبابيز خلال 30 ثانية؟</span>
              </h3>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-teal-300 hover:underline flex items-center gap-1"
              >
                <span>فتح لوحة Supabase</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-relaxed text-[11px]">
              <li>اضغط على زر <strong className="text-white">"نسخ كود SQL كامل للسوبابيز"</strong> بالأعلى.</li>
              <li>في لوحة تحكم سوبابيز بمشروعك، اضغط على أيقونة <strong className="text-cyan-300 font-mono">SQL Editor</strong> في القائمة الجانبية اليسرى.</li>
              <li>اضغط على <strong className="text-white">New Query</strong> والصق الكود بالكامل، ثم اضغط على زر <strong className="text-emerald-400 font-bold">Run</strong>.</li>
              <li>سيتم تلقائياً إنشاء الجداول الـ 7 وفهارسها وتفعيل سياسات الأمان الصارمة (RLS) بحيث لا يمكن لأحد سواك الوصول إليها.</li>
            </ol>
          </div>

          {/* Database Tables Grid */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>جداول البيانات السحابية المعتمدة ({SUPABASE_TABLES_SCHEMA.length} جداول)</span>
              <span className="text-[10px] text-teal-400 font-mono">Row Level Security: Enabled</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUPABASE_TABLES_SCHEMA.map((table) => (
                <div
                  key={table.tableName}
                  className="p-4 bg-[#142138] border border-slate-700/90 rounded-2xl space-y-2.5 hover:border-teal-500/60 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {table.tableName}
                      </span>
                      <span className="text-xs text-white font-bold">{table.arabicName}</span>
                    </div>
                    {table.rlsEnabled && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 font-semibold">
                        <Lock className="w-2.5 h-2.5" />
                        <span>محمي RLS</span>
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {table.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold block">أهم الحقول:</span>
                    <div className="flex flex-wrap gap-1">
                      {table.fields.slice(0, 4).map((f) => (
                        <span
                          key={f.name}
                          title={`${f.name} (${f.type}): ${f.purpose}`}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 cursor-help"
                        >
                          {f.name}
                        </span>
                      ))}
                      {table.fields.length > 4 && (
                        <span className="text-[10px] text-slate-400 px-1 py-0.5 font-mono">
                          +{table.fields.length - 4} حقول أخرى
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Live Sync & Connection */}
      {activeSubTab === 'sync' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-[#182640] border border-slate-700/80 rounded-3xl p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Cloud className="w-4 h-4 text-teal-300" />
              <span>إعدادات الربط المباشر مع Supabase Cloud</span>
            </h3>
            <p className="text-xs text-slate-300">
              أدخل مفاتيح مشروعك من Supabase (تجدها في <strong className="text-white">Project Settings &gt; API</strong>) للربط المباشر ومزامنة البيانات.
            </p>

            <form onSubmit={handleSaveSupabaseConfig} className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold block">
                  Project URL:
                </label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xxxxxxxx.supabase.co"
                  dir="ltr"
                  className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-teal-200 font-mono focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold block">
                  Anon / Public API Key:
                </label>
                <input
                  type="password"
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  dir="ltr"
                  className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-teal-200 font-mono focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition"
                >
                  حفظ المفاتيح
                </button>

                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />
                  <span>فحص الاتصال المباشر</span>
                </button>
              </div>
            </form>

            {/* Connection feedback */}
            {connectionStatus && (
              <div
                className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 animate-in fade-in ${
                  connectionStatus.success
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                }`}
              >
                {connectionStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{connectionStatus.message}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: AI SQL Generator */}
      {activeSubTab === 'ai-sql' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Project Selector & Overview Card */}
          <div className="bg-[#182640] border border-slate-700/80 rounded-3xl p-4 text-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-teal-300" />
                  <span>اختر التطبيق المراد استخراج استعلاماته:</span>
                </span>
              </div>

              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-[#10192a] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-400 font-sans"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {selectedProj.dbInfo?.tables.map((table, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-[#10192a] border border-slate-700 text-slate-200 font-mono text-[11px]"
                >
                  {table}
                </span>
              )) || <span className="text-slate-400">لا توجد جداول مسجلة</span>}
            </div>
          </div>

          {/* Text-to-SQL Generator */}
          <div className="bg-[#182640] border border-slate-700/80 rounded-3xl p-5 space-y-4 shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  <span>اطلب من هيباتيا كتابة استعلام SQL بالعربية:</span>
                </label>
                <span className="text-[10px] text-teal-300 font-mono">PostgreSQL</span>
              </div>

              <textarea
                value={naturalQuestion}
                onChange={(e) => setNaturalQuestion(e.target.value)}
                rows={2}
                placeholder="مثال: استخرج الرحلات الملغاة مع اسم الكابتن والسبب..."
                className="w-full bg-[#0e1626] border border-slate-700 rounded-2xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 font-sans"
              />

              {/* Clean non-scrolling grid presets */}
              <div className="pt-2 space-y-1.5">
                <span className="text-[11px] text-teal-300 font-semibold block">اقتراحات سريعة:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {currentPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNaturalQuestion(preset)}
                      className="p-2 text-right rounded-xl bg-[#121c30] border border-slate-700/80 text-[11px] text-slate-200 hover:text-white hover:border-teal-400 transition"
                    >
                      • {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateSql}
              disabled={isGeneratingSql || !naturalQuestion.trim()}
              className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg active:scale-98"
            >
              <Terminal className={`w-4 h-4 ${isGeneratingSql ? 'animate-spin' : ''}`} />
              <span>{isGeneratingSql ? 'جاري توليد الاستعلام مع هيباتيا...' : 'توليد استعلام SQL المحسن مع هيباتيا'}</span>
            </button>
          </div>

          {/* SQL Result Display */}
          {sqlResult && (
            <div className="bg-[#182640] border border-teal-500/40 rounded-3xl p-5 space-y-4 shadow-2xl animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-teal-300" />
                  <h3 className="text-xs font-bold text-white">استعلام SQL الجاهز للتنفيذ</h3>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sqlResult.sql);
                    setCopiedQuerySql(true);
                    setTimeout(() => setCopiedQuerySql(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition"
                >
                  {copiedQuerySql ? <Check className="w-3.5 h-3.5 text-teal-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedQuerySql ? 'تم النسخ!' : 'نسخ الاستعلام'}</span>
                </button>
              </div>

              <div className="p-3.5 bg-[#0e1626] rounded-2xl border border-slate-700 overflow-x-auto text-xs font-mono text-teal-200 leading-relaxed whitespace-pre">
                {sqlResult.sql}
              </div>

              {sqlResult.explanation && (
                <div className="text-xs text-slate-200 leading-relaxed bg-[#111b2e] p-3 rounded-xl border border-slate-700">
                  <span className="font-bold text-teal-300 block mb-1">شرح الاستعلام:</span>
                  {sqlResult.explanation}
                </div>
              )}

              {sqlResult.indexRecommendation && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 leading-relaxed font-mono">
                  ⚡ <span className="font-bold font-sans">توصية الفهرس (Index):</span> {sqlResult.indexRecommendation}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
