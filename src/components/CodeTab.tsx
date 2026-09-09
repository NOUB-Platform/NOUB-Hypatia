import React, { useState } from 'react';
import { 
  Code2, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  GitPullRequest, 
  ShieldAlert, 
  Terminal, 
  ArrowRight,
  Zap,
  Play,
  ExternalLink,
  Layers,
  Github,
  GitBranch,
  GitFork
} from 'lucide-react';
import { ProjectItem } from '../types';

interface CodeTabProps {
  activeProject: ProjectItem;
  projects: ProjectItem[];
  onAskEmo: (prompt: string) => void;
}

export const CodeTab: React.FC<CodeTabProps> = ({
  activeProject,
  projects,
  onAskEmo,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'upgrade' | 'repos' | 'figma'>('upgrade');
  const [selectedProjectId, setSelectedProjectId] = useState(activeProject.id);
  const [selectedLanguage, setSelectedLanguage] = useState('TypeScript / React');
  const [userCode, setUserCode] = useState(`// مثال كود لحساب قيمة الرحلة مع الـ Surge في مشاوير
function calculateTripFare(baseFare, distanceKm, surgeMultiplier, couponDiscount) {
  let total = baseFare + (distanceKm * 2.5);
  if (surgeMultiplier > 1) {
    total = total * surgeMultiplier;
  }
  if (couponDiscount) {
    total = total - couponDiscount;
  }
  return total;
}`);
  const [upgradeGoal, setUpgradeGoal] = useState('إضافة Types كاملة، حماية من الأرقام السالبة، ومعالجة أخطاء الـ NaN');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [upgradeResult, setUpgradeResult] = useState<{
    upgradedCode: string;
    changes: string[];
    tip: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const goalPresets = [
    'تسريع الأداء وتفادي إعادة الرندر غير الضروري',
    'إضافة Types كاملة وحماية من القيم غير المعرفة (Null Safety)',
    'إصلاح مشكلة تسريب الذاكرة (Memory Leak) في الخلفية',
    'تحسين كتابة الدوال بمعايير Clean Code و SOLID',
  ];

  const handleUpgradeCode = async () => {
    if (!userCode.trim() || isUpgrading) return;
    setIsUpgrading(true);
    setUpgradeResult(null);

    const targetProj = projects.find((p) => p.id === selectedProjectId);

    try {
      const res = await fetch('/api/gemini/upgrade-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: userCode,
          goal: upgradeGoal,
          language: selectedLanguage,
          project: targetProj?.name || activeProject.name,
        }),
      });

      const data = await res.json();
      if (data.upgradedCode) {
        setUpgradeResult(data);
      } else {
        showToast('لم يتم إرجاع كود: ' + (data.error || 'خطأ غير معروف'));
      }
    } catch (err: any) {
      showToast('خطأ أثناء ترقية الكود: ' + err.message);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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

      {/* Top Header Card */}
      <div className="bg-[#182640] border border-slate-700/80 rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div>
          <h1 className="text-base font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-teal-300" />
            <span>متابعة وترقية الأكواد البرمجية</span>
          </h1>
          <p className="text-xs text-slate-200 mt-0.5">
            فحص وتحسين جودة الأكواد وإصلاح الأخطاء وتحديث المعايير الهندسية
          </p>
        </div>

        {/* Sub-tabs selector */}
        <div className="flex items-center gap-1 bg-[#10192a] p-1 rounded-2xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveSubTab('upgrade')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeSubTab === 'upgrade'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            ترقية وتعديل كود
          </button>
          <button
            onClick={() => setActiveSubTab('repos')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeSubTab === 'repos'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            متابعة المستودعات والـ PRs
          </button>
          <button
            onClick={() => setActiveSubTab('figma')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
              activeSubTab === 'figma'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 font-bold'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <span>شاشات فيجما (Figma)</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Code Upgrade Studio */}
      {activeSubTab === 'upgrade' && (
        <div className="space-y-4">
          <div className="bg-[#182640] border border-slate-700/80 rounded-3xl p-5 space-y-4 shadow-xl">
            {/* Project & Language selector bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-200 mb-1 font-semibold">اختر التطبيق المعني:</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-[#10192a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400 font-sans"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-200 mb-1 font-semibold">لغة البرمجة / الإطار:</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-[#10192a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400 font-mono"
                >
                  <option value="TypeScript / React">TypeScript / React</option>
                  <option value="React Native">React Native / Mobile</option>
                  <option value="Node.js / Express">Node.js / Express Backend</option>
                  <option value="SQL / PostgreSQL">SQL / PostgreSQL Functions</option>
                  <option value="Dart / Flutter">Dart / Flutter</option>
                  <option value="Python / FastAPI">Python / FastAPI</option>
                </select>
              </div>
            </div>

            {/* Target Goal & Quick presets */}
            <div>
              <label className="block text-[11px] text-slate-200 mb-1 font-semibold">المطلوب إنجازه بالكود:</label>
              <input
                type="text"
                value={upgradeGoal}
                onChange={(e) => setUpgradeGoal(e.target.value)}
                placeholder="اكتب ما تريد تحسينه أو إصلاحه في هذا الكود..."
                className="w-full bg-[#10192a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
              />

              {/* Goal Presets */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar pb-1">
                <span className="text-[10px] text-teal-300 font-bold shrink-0">اقتراحات سريعة:</span>
                {goalPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setUpgradeGoal(preset)}
                    className="px-2.5 py-1 rounded-xl bg-[#121c30] border border-slate-700 text-[10px] text-slate-200 hover:text-white hover:border-teal-400 whitespace-nowrap transition"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Code Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] text-slate-200 font-semibold">الكود الأصلي (ضع الكود هنا):</label>
                <span className="text-[10px] text-teal-300 font-mono">{userCode.length} حرف</span>
              </div>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={7}
                placeholder="الصق الكود هنا..."
                className="w-full bg-[#0e1626] border border-slate-700 rounded-2xl p-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-teal-400 leading-relaxed"
              />
            </div>

            {/* Action Upgrade Button */}
            <button
              onClick={handleUpgradeCode}
              disabled={isUpgrading || !userCode.trim()}
              className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-teal-950/50 active:scale-98"
            >
              <Zap className={`w-4 h-4 ${isUpgrading ? 'animate-spin' : 'fill-current'}`} />
              <span>{isUpgrading ? 'جاري فحص وترقية الكود مع هيباتيا...' : '🚀 ترقية وتعديل الكود مع هيباتيا الآن'}</span>
            </button>
          </div>

          {/* Upgraded Code Result View */}
          {upgradeResult && (
            <div className="bg-[#182640] border border-teal-500/40 rounded-3xl p-5 space-y-4 shadow-2xl animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  <h3 className="text-xs font-bold text-white">الكود المُرقى والجاهز للإنتاج</h3>
                </div>

                <button
                  onClick={() => handleCopy(upgradeResult.upgradedCode)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-teal-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'تم النسخ!' : 'نسخ الكود'}</span>
                </button>
              </div>

              {/* Code block */}
              <div className="p-3.5 bg-[#0e1626] rounded-2xl border border-slate-700 overflow-x-auto text-xs font-mono text-teal-200 leading-relaxed whitespace-pre selection:bg-teal-900 selection:text-white">
                {upgradeResult.upgradedCode}
              </div>

              {/* Changes Summary */}
              {upgradeResult.changes && upgradeResult.changes.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-200">أبرز التحسينات التي تمت:</span>
                  <div className="space-y-1">
                    {upgradeResult.changes.map((ch, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0"></span>
                        <span>{ch}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tip */}
              {upgradeResult.tip && (
                <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/30 text-xs text-teal-200 leading-relaxed">
                  💡 <span className="font-bold">نصيحة هيباتيا:</span> {upgradeResult.tip}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 2: GitHub & PRs */}
      {activeSubTab === 'repos' && (
        <div className="space-y-4">
          {/* Core Hypatia Repository Card */}
          <div className="bg-gradient-to-br from-[#121f38] via-[#162744] to-[#0d1726] border border-cyan-500/40 rounded-3xl p-5 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3.5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-md">
                  <Github className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white tracking-wide">
                      NOUB-Platform / NOUB-Hypatia
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 font-mono font-bold">
                      Core Platform Repo
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    المستودع المصدري الرسمي لمنصة هيباتيا ومساعد العمليات التقنية
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/NOUB-Platform/NOUB-Hypatia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-cyan-950/40"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>فتح على GitHub</span>
                </a>
              </div>
            </div>

            {/* Git Remote & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-[#0b1322] rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold">رابط الاستنساخ (Git Clone URL):</span>
                  <button
                    onClick={() => handleCopy('git clone https://github.com/NOUB-Platform/NOUB-Hypatia.git')}
                    className="text-[10px] text-cyan-300 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>نسخ الأمر</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-teal-200 bg-slate-950 p-2 rounded-xl border border-slate-800 select-all overflow-x-auto">
                  git clone https://github.com/NOUB-Platform/NOUB-Hypatia.git
                </div>
              </div>

              <div className="p-3 bg-[#0b1322] rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold">أمر المزامنة والدفع (Git Push):</span>
                  <button
                    onClick={() => handleCopy('git push -u origin main')}
                    className="text-[10px] text-cyan-300 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>نسخ الأمر</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-amber-200 bg-slate-950 p-2 rounded-xl border border-slate-800 select-all overflow-x-auto">
                  git push -u origin main
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-3 text-slate-300 text-[11px]">
                <span className="flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                  <span>الفرع الافتراضي: <strong className="font-mono text-white">main</strong></span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>الربط البعيد: <strong className="font-mono text-emerald-300">origin</strong></span>
                </span>
              </div>

              <button
                onClick={() =>
                  onAskEmo(
                    'قم بعمل فحص شامل ومراجعة لبنية الكود في منصة هيباتيا ومستودع NOUB-Hypatia واقتراح أهم التحسينات المعمارية.'
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>فحص كود هيباتيا الشامل</span>
              </button>
            </div>
          </div>

          {/* Other Projects Repos */}
          <div className="bg-[#182640] border border-slate-700/80 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-teal-300" />
              <span>مستودعات التطبيقات والمشاريع التابعة</span>
            </h3>
            <p className="text-xs text-slate-300">
              روابط المستودعات البرمجية لكل تطبيق مع إمكانية فحص ومراجعة الكود مباشرة مع هيباتيا.
            </p>

            <div className="space-y-2 pt-2">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-[#111b2e] rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-100">{p.name}</div>
                    <div className="text-[11px] text-teal-300/80 font-mono mt-0.5">
                      {p.repoUrl || 'لم يحدد رابط GitHub بعد'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {p.repoUrl && (
                      <button
                        onClick={() => handleCopy(`https://${p.repoUrl}`)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] flex items-center gap-1"
                        title="نسخ رابط المستودع"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() =>
                        onAskEmo(
                          `ما هي أفضل الممارسات المعمارية ومكتبات التحديث المقترحة لمستودع ${p.name}؟`
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-[#1a2b47] hover:bg-slate-700 text-teal-200 hover:text-white text-xs transition border border-slate-700 font-semibold"
                    >
                      فحص مع هيباتيا
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Figma Design Audit & Links */}
      {activeSubTab === 'figma' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-[#182640] border border-slate-700/80 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-950 border border-purple-700 flex items-center justify-center text-purple-300 font-black text-xs">
                    F
                  </div>
                  <span>ملفات تصاميم فيجما الرسمية (UI/UX) ومقارنتها بالكود</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  روابط تصاميم فيجما المعتمدة لشركة قيمة تك لمشاريع: دارو، وكالة، ومشاوير 4B مع أداة مطابقة الشاشات البرمجية.
                </p>
              </div>

              <button
                onClick={() =>
                  onAskEmo(
                    'قم بعمل فحص معماري شامل ومقارنة بين شاشات وتصاميم فيجما المستلمة لمشاريع قيمة تك (دارو، وكالة، مشاوير) وبين متطلبات الكود، وحدد الشاشات الناقصة والـ Edge Cases.'
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shrink-0 self-start sm:self-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>فحص شامل للتصاميم بـ هيباتيا</span>
              </button>
            </div>

            {/* Figma Projects Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Daro */}
              <div className="p-4 bg-[#111b2e] rounded-2xl border border-slate-700 hover:border-purple-500 transition space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">تطبيق دارو (Daro)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                      Figma v1.0
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    منظومة الشحن اللوجستي، فحص بوالص الشحن، وإدارة مستودعات الاستلام.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <a
                    href="https://www.figma.com/design/aR1aanpRzGL7aMoxROGgt5/Daro?node-id=0-1&t=HFGqvAl4RPmlMliu-1"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>فتح تصميم فيجما</span>
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy('https://www.figma.com/design/aR1aanpRzGL7aMoxROGgt5/Daro?node-id=0-1&t=HFGqvAl4RPmlMliu-1')}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center justify-center gap-1 transition border border-slate-800"
                    >
                      <Copy className="w-3 h-3" />
                      <span>نسخ الرابط</span>
                    </button>
                    <button
                      onClick={() =>
                        onAskEmo(
                          'ما هي المتطلبات البرمجية والشاشات الواجب توفرها في تطبيق دارو بناءً على ملف فيجما الرسمي والمستودع؟'
                        )
                      }
                      className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs flex items-center justify-center gap-1 transition border border-slate-800 font-bold"
                    >
                      <span>تدقيق الكود</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Wikala */}
              <div className="p-4 bg-[#111b2e] rounded-2xl border border-slate-700 hover:border-purple-500 transition space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">تطبيق وكالة (Wikala)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                      Figma v1.0
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    بوابة الوكلاء والتجار، تتبع العمولات، إدارة السائقين والمناطق الجغرافية.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <a
                    href="https://www.figma.com/design/oYxkmwZcGae674BRA5ZOen/Wikala?node-id=0-1&t=rbE4CPeGiTAMMin2-1"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>فتح تصميم فيجما</span>
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy('https://www.figma.com/design/oYxkmwZcGae674BRA5ZOen/Wikala?node-id=0-1&t=rbE4CPeGiTAMMin2-1')}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center justify-center gap-1 transition border border-slate-800"
                    >
                      <Copy className="w-3 h-3" />
                      <span>نسخ الرابط</span>
                    </button>
                    <button
                      onClick={() =>
                        onAskEmo(
                          'ما هي تدفقات الشاشات وبوابات الدفع والعمولات في فيجما تطبيق وكالة وكيف نربطها مع API؟'
                        )
                      }
                      className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs flex items-center justify-center gap-1 transition border border-slate-800 font-bold"
                    >
                      <span>تدقيق الكود</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mashawer 4B */}
              <div className="p-4 bg-[#111b2e] rounded-2xl border border-slate-700 hover:border-purple-500 transition space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">مشاوير - Backlog (4B)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                      Figma UI/UX
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    منظومة حجز الرحلات الذكية وتطبيق السائق والراكب مع شاشات الـ Backlog.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <a
                    href="https://www.figma.com/design/ulWwUzLnKThS2cfJWDetX6/%D9%85%D8%B4%D8%A7%D9%88%D9%8A%D8%B1---backlog?node-id=221-63531&t=uCzHJZbEM1gi1Zz8-0"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>فتح تصميم فيجما</span>
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy('https://www.figma.com/design/ulWwUzLnKThS2cfJWDetX6/%D9%85%D8%B4%D8%A7%D9%88%D9%8A%D8%B1---backlog?node-id=221-63531&t=uCzHJZbEM1gi1Zz8-0')}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center justify-center gap-1 transition border border-slate-800"
                    >
                      <Copy className="w-3 h-3" />
                      <span>نسخ الرابط</span>
                    </button>
                    <button
                      onClick={() =>
                        onAskEmo(
                          'حلل شاشات مشاوير فور بي في فيجما وراجع مدى التزامها باشتراطات وزارة النقل المصرية وتتبع الـ GPS في السيرفرات.'
                        )
                      }
                      className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs flex items-center justify-center gap-1 transition border border-slate-800 font-bold"
                    >
                      <span>تدقيق الكود</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
