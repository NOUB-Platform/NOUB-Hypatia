import React, { useState } from 'react';
import { 
  Database, 
  Sparkles, 
  Copy, 
  Check, 
  Play, 
  Terminal, 
  Table, 
  Layers, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { ProjectItem } from '../types';

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
  const [selectedProjectId, setSelectedProjectId] = useState(activeProject.id);
  const [naturalQuestion, setNaturalQuestion] = useState('استخرج أعلى 10 كباتن تقييماً قاموا بأكثر من 50 رحلة هذا الشهر مع ترتيبهم تنازلياً');
  const [isGeneratingSql, setIsGeneratingSql] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
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

  const quickSqlPrompts: Record<string, string[]> = {
    'proj-4b': [
      'استخرج أوقات الذروة والمناطق ذات أعلى معدل Surge خلال الأسبوع',
      'احسب متوسط زمن وصول الكابتن (ETA) لكل حي بالرياض',
      'ابحث عن الرحلات الملغاة من طرف الراكب بعد مرور 5 دقائق',
    ],
    'proj-wekala': [
      'احسب إجمالي عمولات الوكلاء المستحقة لشهر مايو حسب كل وكيل',
      'استعلم عن الكباتن المسجلين تحت وكالة معينة ولم يقوموا بأي رحلة منذ أسبوع',
    ],
    'proj-daro': [
      'استخرج الشحنات التي تجاوزت 48 ساعة في محطة التوزيع ولم تسلم',
      'احسب الوزن الإجمالي للشحنات المنقولة بين الرياض وجدة هذا الأسبوع',
    ],
  };

  const currentPresets = quickSqlPrompts[selectedProj.id] || [
    'استخرج سجلات العمليات الأكثر استهلاكاً لزمن الاستجابة',
    'احسب إجمالي العمليات الناجحة مقابل الفاشلة اليوم',
  ];

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

  const handleCopy = (sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-4 pb-16 max-w-4xl mx-auto relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-slate-900/95 border border-teal-500/60 text-teal-200 text-xs rounded-2xl shadow-2xl flex items-center justify-between">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white px-2 font-bold">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#182640] border border-slate-700/80 rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div>
          <h1 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-300" />
            <span>متابعة قواعد البيانات واستعلامات SQL</span>
          </h1>
          <p className="text-xs text-slate-200 mt-0.5">
            توليد وفحص استعلامات PostgreSQL وتوصيات الفهارس لكل تطبيق مع هيباتيا
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-200 font-semibold">التطبيق:</span>
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
      </div>

      {/* Database Overview Card */}
      <div className="bg-[#182640] border border-slate-700/80 rounded-3xl p-4 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Table className="w-4 h-4 text-teal-300" />
            <span>الجداول المسجلة لـ {selectedProj.name}:</span>
          </span>
          <span className="text-[11px] text-teal-300 font-mono font-bold">
            {selectedProj.dbInfo?.type || 'PostgreSQL'}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedProj.dbInfo?.tables.map((table, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-xl bg-[#10192a] border border-slate-700 text-slate-200 font-mono text-[11px]"
            >
              {table}
            </span>
          )) || <span className="text-slate-400">لا توجد جداول مسجلة</span>}
        </div>

        {selectedProj.dbInfo?.notes && (
          <p className="text-[11px] text-slate-200 pt-1 border-t border-slate-700/80">
            📌 <span className="text-teal-300 font-semibold">ملاحظات معمارية:</span> {selectedProj.dbInfo.notes}
          </p>
        )}
      </div>

      {/* Text-to-SQL Generator */}
      <div className="bg-[#182640] border border-slate-700/80 rounded-3xl p-5 space-y-4 shadow-xl">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>اطلب من هيباتيا كتابة استعلام SQL بالعربية:</span>
            </label>
            <span className="text-[10px] text-teal-300 font-mono">PostgreSQL نقي ومحسن</span>
          </div>

          <textarea
            value={naturalQuestion}
            onChange={(e) => setNaturalQuestion(e.target.value)}
            rows={2}
            placeholder="مثال: استخرج الرحلات الملغاة مع اسم الكابتن والسبب..."
            className="w-full bg-[#0e1626] border border-slate-700 rounded-2xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 font-sans"
          />

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[10px] text-teal-300 font-bold shrink-0">أفكار استعلامات:</span>
            {currentPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setNaturalQuestion(preset)}
                className="px-2.5 py-1 rounded-xl bg-[#121c30] border border-slate-700 text-[10px] text-slate-200 hover:text-white hover:border-teal-400 whitespace-nowrap transition"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerateSql}
          disabled={isGeneratingSql || !naturalQuestion.trim()}
          className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-teal-950/50 active:scale-98"
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
              onClick={() => handleCopy(sqlResult.sql)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-teal-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'تم النسخ!' : 'نسخ الاستعلام'}</span>
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
  );
};
