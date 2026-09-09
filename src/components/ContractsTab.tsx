import React, { useState } from 'react';
import { 
  FileCheck2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Code2, 
  KeyRound, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  Bot, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  DollarSign,
  Layers,
  FolderGit2
} from 'lucide-react';
import { ContractDeliverable, ProjectItem } from '../types';

interface ContractsTabProps {
  contracts: ContractDeliverable[];
  onUpdateContract: (updated: ContractDeliverable) => void;
  onAskHypatia: (prompt: string) => void;
  projects: ProjectItem[];
}

export const ContractsTab: React.FC<ContractsTabProps> = ({
  contracts,
  onUpdateContract,
  onAskHypatia,
  projects,
}) => {
  const [selectedContractId, setSelectedContractId] = useState<string>(contracts[0]?.id || 'contract-4b');
  const [showAddChecklistModal, setShowAddChecklistModal] = useState(false);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newChecklistCategory, setNewChecklistCategory] = useState<'code' | 'apk' | 'figma' | 'keystore' | 'db' | 'docs'>('code');

  const activeContract = contracts.find((c) => c.id === selectedContractId) || contracts[0];

  const handleToggleChecklist = (itemIndex: number) => {
    if (!activeContract) return;
    const updatedChecklist = activeContract.checklist.map((item, idx) => {
      if (idx === itemIndex) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    onUpdateContract({
      ...activeContract,
      checklist: updatedChecklist,
    });
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim() || !activeContract) return;

    const newItem = {
      id: `item-${Date.now()}`,
      item: newChecklistText.trim(),
      completed: false,
      required: true,
      category: newChecklistCategory,
    };

    onUpdateContract({
      ...activeContract,
      checklist: [...activeContract.checklist, newItem],
    });

    setNewChecklistText('');
    setShowAddChecklistModal(false);
  };

  const totalChecklist = activeContract?.checklist?.length || 0;
  const completedChecklist = activeContract?.checklist?.filter((i) => i.completed).length || 0;
  const completionPercent = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-950 border border-teal-800/80 flex items-center justify-center text-teal-400 shrink-0 shadow">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>متابعة العقود وتسليمات التطبيقات</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-900/60 text-teal-300 font-mono font-bold">
                مشاوير 4B • WeKaLa • Daro
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              متابعة بنود التسليم الفني للكود، ملفات الـ Keystore الرسمية، وتوافق الـ API للتطبيقات الثلاثة المستلمة من المطور الخارجي.
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            onAskHypatia(
              `أنا في مرحلة استلام تطبيقات مشاوير الثلاثة (فور بي 4B، وكالة WeKaLa بالـ ي، ودارو Daro) من المطور الخارجي. قدمي لي قائمة تحقق دقيقة (Acceptance Criteria & Code Audit) لفحص السورس كود وملفات الـ Keystore والأمان قبل صرف الدفعة النهائية.`
            )
          }
          className="px-3.5 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-teal-950/50 shrink-0"
        >
          <Bot className="w-4 h-4" />
          <span>استشارة هيباتيا في بنود التسليم</span>
        </button>
      </div>

      {/* Contract App Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {contracts.map((c) => {
          const isSelected = c.id === selectedContractId;
          const completed = c.checklist.filter((i) => i.completed).length;
          const total = c.checklist.length;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <button
              key={c.id}
              onClick={() => setSelectedContractId(c.id)}
              className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2.5 ${
                isSelected
                  ? 'bg-slate-800/95 border-teal-500 shadow-lg shadow-teal-950/30'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm text-white">{c.appName}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                    c.contractStatus === 'تم الاعتماد النهائي'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {c.contractStatus}
                </span>
              </div>

              <div className="w-full">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>نسبة استيفاء البنود:</span>
                  <span className="font-mono font-bold text-teal-300">{pct}% ({completed}/{total})</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5 w-full">
                <span className="flex items-center gap-1 font-mono text-slate-300">
                  <Calendar className="w-3 h-3 text-teal-400" />
                  <span>التسليم: {c.targetDeliveryDate}</span>
                </span>
                <span className="font-mono text-slate-500 text-[10px]">{c.appCode}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Contract Details */}
      {activeContract && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
          
          {/* Header & Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-white">{activeContract.appName}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 font-mono">
                  {activeContract.appCode}
                </span>
                <span className="text-xs text-slate-400">
                  (المطور: {activeContract.developerName})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {activeContract.notes}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onAskHypatia(
                    `افحصي عقد تسليم تطبيق ${activeContract.appName}، البنود المتبقية هي: ${activeContract.checklist
                      .filter((i) => !i.completed)
                      .map((i) => i.item)
                      .join('، ')}. ما هي الأسئلة الفنية التي يجب أن أطرحها على المطور الآن؟`
                  )
                }
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>فحص البنود مع هيباتيا</span>
              </button>

              <button
                onClick={() => setShowAddChecklistModal(true)}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة بند فحص</span>
              </button>
            </div>
          </div>

          {/* Financial & Timeline Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>الموعد الزمني للتسليم:</span>
              </span>
              <span className="text-xs font-bold text-white font-mono">{activeContract.targetDeliveryDate}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>المستودع (Repo):</span>
              </span>
              <span className="text-xs font-mono text-cyan-300 truncate block">
                {activeContract.sourceCodeRepo || 'بانتظار إضافة الرابط'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>حالة الدفعات المالية:</span>
              </span>
              <span className="text-xs font-bold text-amber-300">
                {activeContract.paidAmount || 'دفعة المقدم'}
              </span>
            </div>
          </div>

          {/* Deliverables Checklist */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>قائمة فحص شروط الاستلام والتسليم الفني ({completedChecklist}/{totalChecklist}):</span>
              </span>
              <span className="text-[11px] font-mono text-teal-400 font-bold">
                {completionPercent}% مكتمل
              </span>
            </div>

            <div className="space-y-2">
              {activeContract.checklist.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(idx)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    item.completed
                      ? 'bg-teal-950/30 border-teal-800/80 text-teal-200'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      className={`w-5 h-5 rounded-lg flex items-center justify-center transition shrink-0 ${
                        item.completed
                          ? 'bg-teal-500 text-slate-950'
                          : 'bg-slate-900 border border-slate-700 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <span className={`text-xs ${item.completed ? 'line-through text-slate-400' : 'font-medium'}`}>
                      {item.item}
                    </span>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Modal: Add Checklist Item */}
      {showAddChecklistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleAddChecklistItem}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl"
          >
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-teal-400" />
              <span>إضافة شرط تسليم جديد لتطبيق {activeContract.appName}</span>
            </h3>

            <div>
              <label className="block text-xs text-slate-400 mb-1">وصف البند / الشرط:</label>
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                placeholder="مثال: تسليم شهادة SHA-256 و Keystore للـ Google Play Console"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">التصنيف:</label>
              <select
                value={newChecklistCategory}
                onChange={(e: any) => setNewChecklistCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="code">سورس كود (GitHub)</option>
                <option value="keystore">مفاتيح التوقيع و Keystore</option>
                <option value="apk">حزم APK / AAB</option>
                <option value="db">قواعد بيانات Supabase</option>
                <option value="figma">تصاميم Figma</option>
                <option value="docs">توثيق وتعليمات التشغيل</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddChecklistModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded-xl text-xs font-bold"
              >
                إضافة البند
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
