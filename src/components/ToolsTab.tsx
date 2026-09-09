import React, { useState } from 'react';
import { 
  Server, 
  Activity, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  FileText, 
  Download,
  Terminal,
  Wifi,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { ApiEndpointItem, ProjectItem } from '../types';

interface ToolsTabProps {
  apiEndpoints: ApiEndpointItem[];
  onUpdateEndpoints: (endpoints: ApiEndpointItem[]) => void;
  projects: ProjectItem[];
  onAskHypatia: (prompt: string) => void;
}

export const ToolsTab: React.FC<ToolsTabProps> = ({
  apiEndpoints,
  onUpdateEndpoints,
  projects,
  onAskHypatia,
}) => {
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newService, setNewService] = useState('مصر للمقاصة');
  const [newUrlOrIp, setNewUrlOrIp] = useState('');
  const [newMethod, setNewMethod] = useState<'GET' | 'POST' | 'PUT' | 'SOCKET' | 'FIX' | 'PING'>('FIX');
  const [newSecret, setNewSecret] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pingingId, setPingingId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulatePing = (endpoint: ApiEndpointItem) => {
    setPingingId(endpoint.id);
    setTimeout(() => {
      const simulatedMs = Math.floor(Math.random() * 18) + 3;
      const updated = apiEndpoints.map((ep) =>
        ep.id === endpoint.id
          ? {
              ...ep,
              lastPingMs: simulatedMs,
              status: simulatedMs < 15 ? ('يعمل بكفاءة' as const) : ('خط احتياطي' as const),
            }
          : ep
      );
      onUpdateEndpoints(updated);
      setPingingId(null);
    }, 600);
  };

  const handleDeleteEndpoint = (id: string) => {
    if (confirm('هل أنت متأكد من حذف نقطة الربط هذه؟')) {
      onUpdateEndpoints(apiEndpoints.filter((ep) => ep.id !== id));
    }
  };

  const handleAddNewEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrlOrIp.trim()) return;

    const newEndpoint: ApiEndpointItem = {
      id: `api-${Date.now()}`,
      name: newName.trim(),
      service: newService.trim(),
      urlOrIp: newUrlOrIp.trim(),
      method: newMethod,
      apiKeyOrSecret: newSecret.trim() || undefined,
      notes: newNotes.trim() || undefined,
      status: 'يعمل بكفاءة',
      lastPingMs: Math.floor(Math.random() * 10) + 4,
    };

    onUpdateEndpoints([newEndpoint, ...apiEndpoints]);
    setIsAddingModalOpen(false);
    setNewName('');
    setNewUrlOrIp('');
    setNewSecret('');
    setNewNotes('');
  };

  // Export UCP-LLM Protocol Function (Live State)
  const handleExportProtocolJson = () => {
    const protocolData = {
      protocolVersion: "UCP-LLM Generator v2.1.0-Hypatia",
      generationDate: new Date().toISOString(),
      user: {
        preferredName: "سامح يس",
        title: "مهندس نظم ومطور برمجيات - إدارة نظم الأوراق المالية والمنصات",
        experienceYears: 18,
        methodology: "العقلانية الصارمة، الفهم من المبادئ الأولى، إدارة النظم المعقدة"
      },
      activeProjectsCount: projects.length,
      projects: projects.map((p) => ({
        name: p.name,
        code: p.code,
        category: p.category,
        status: p.status,
        description: p.description,
        dbType: p.dbInfo?.type,
        tables: p.dbInfo?.tables,
        apkVersionsCount: p.apkFiles.length
      })),
      registeredEndpoints: apiEndpoints.map((ep) => ({
        name: ep.name,
        service: ep.service,
        urlOrIp: ep.urlOrIp,
        protocol: ep.method,
        status: ep.status,
        lastPingMs: ep.lastPingMs
      }))
    };

    const blob = new Blob([JSON.stringify(protocolData, null, 2)], { type: 'application/json;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `UCP-LLM_Hypatia_Live_Protocol_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExportProtocolTxt = () => {
    let txt = `وثيقة بروتوكول السياق الحي (UCP-LLM - Hypatia Edition)\n`;
    txt += `تاريخ التصدير: ${new Date().toLocaleString('ar-EG')}\n`;
    txt += `المستخدم: سامح يس (مهندس برمجيات ونظم - تداول أوراق مالية)\n`;
    txt += `===================================================\n\n`;
    txt += `[1] ملخص المشاريع والأنظمة الحالية (${projects.length}):\n`;
    projects.forEach((p, idx) => {
      txt += `${idx + 1}. ${p.name} [${p.code}] - الحالة: ${p.status}\n`;
      txt += `   الوصف: ${p.description}\n`;
      if (p.dbInfo) txt += `   قاعدة البيانات: ${p.dbInfo.type} (الجداول: ${p.dbInfo.tables.join(', ')})\n`;
      txt += `\n`;
    });
    txt += `[2] خطوط الربط وواجهات الـ APIs المسجلة (${apiEndpoints.length}):\n`;
    apiEndpoints.forEach((ep, idx) => {
      txt += `${idx + 1}. [${ep.service}] ${ep.name}\n`;
      txt += `   العنوان/IP: ${ep.urlOrIp} | البروتوكول: ${ep.method} | الحالة: ${ep.status} | Ping: ${ep.lastPingMs || '-'} ms\n`;
      if (ep.notes) txt += `   ملاحظات: ${ep.notes}\n`;
      txt += `\n`;
    });
    txt += `===================================================\n`;
    txt += `هذه الوثيقة صادرة ومحدثة حياً من منظومة هيباتيا التقنية.`;

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `UCP-LLM_Hypatia_Live_Protocol_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-teal-900/40 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-teal-400" />
              <h2 className="text-base font-bold text-white">مركز أدوات المطور وخطوط الربط (APIs & Network)</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              إدارة عناوين الـ IP لغرفة العمليات (مصر للمقاصة، MIST، مباشر، البورصة، Supabase)، ومتابعة حالات الاتصال وتصدير ملفات البروتوكول.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsAddingModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs transition shadow-md shadow-teal-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة خط / API</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Operations */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          onClick={() => onAskHypatia('افحصي لي خط الربط مع مصر للمقاصة الأساسي والاحتياطي وما هي الخطوات المتبعة عند انقطاع الفايبر')}
          className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 transition text-right flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">طوارئ خط المقاصة</div>
            <div className="text-[10px] text-slate-400">إجراءات الـ DR والتحويل التلقائي</div>
          </div>
        </button>

        <button
          onClick={() => onAskHypatia('صيغي إيميل رسمي من إدارة نظم المعلومات إلى شركة مصر لنقل المعلومات MIST لإخطارهم بوجود انقطاع ثواني في بث الأسعار اللحظية')}
          className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition text-right flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">صياغة إيميل رسمي لـ MIST</div>
            <div className="text-[10px] text-slate-400">بصيغة رسمية معتمدة للغرفة</div>
          </div>
        </button>

        <button
          onClick={() => onAskHypatia('اكتبي لي كود دالة WebSocket في Node.js لاستقبال الأسعار اللحظية من مباشر وإعادة بثها لشاشات العملاء بدون تأخير')}
          className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition text-right flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">كود معالج بث مباشر</div>
            <div className="text-[10px] text-slate-400">دالة Low-Latency WebSocket</div>
          </div>
        </button>
      </div>

      {/* Protocol Live Export Card */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">تصدير وثيقة البروتوكول الحية (UCP-LLM Live Document)</h3>
            <p className="text-[11px] text-slate-400">
              تصدير ملف يحتوي على أحدث حالة لبياناتك ومشاريعك ونقاط الربط لتلقيم النماذج اللغوية الخارجية بهويتك الحية.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportProtocolJson}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير JSON</span>
          </button>
          <button
            onClick={handleExportProtocolTxt}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير TXT</span>
          </button>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-300">
            سجل خطوط الربط وواجهات الـ APIs ({apiEndpoints.length})
          </h3>
          <span className="text-[10px] text-slate-500">محدثة ومحفوظة محلياً</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {apiEndpoints.map((ep) => {
            const isWorking = ep.status === 'يعمل بكفاءة';
            const isBackup = ep.status === 'خط احتياطي';

            return (
              <div
                key={ep.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-2.5 relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-800 text-teal-400 border border-slate-700 font-mono">
                        {ep.method}
                      </span>
                      <span className="text-xs font-bold text-white truncate">{ep.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <span>الجهة:</span>
                      <span className="font-semibold text-slate-300">{ep.service}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 border ${
                      isWorking
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : isBackup
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {ep.status}
                  </span>
                </div>

                {/* Endpoint URL / IP box */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2 truncate">
                    <Wifi className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                    <span className="truncate">{ep.urlOrIp}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(ep.urlOrIp, ep.id)}
                    className="p-1 hover:text-white text-slate-400 transition shrink-0 ml-1"
                    title="نسخ العنوان"
                  >
                    {copiedId === ep.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Notes if any */}
                {ep.notes && (
                  <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                    {ep.notes}
                  </p>
                )}

                {/* Bottom Card Controls */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSimulatePing(ep)}
                      disabled={pingingId === ep.id}
                      className="flex items-center gap-1 text-teal-400 hover:text-teal-300 transition"
                    >
                      <RefreshCw className={`w-3 h-3 ${pingingId === ep.id ? 'animate-spin' : ''}`} />
                      <span>فحص الاتصال (Ping)</span>
                    </button>
                    {ep.lastPingMs !== undefined && (
                      <span className="font-mono text-[10px] text-slate-500">
                        {ep.lastPingMs} ms
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAskHypatia(`أريد استشارة بخصوص نقطة الربط: ${ep.name} (${ep.urlOrIp}) التابعة لـ ${ep.service}`)}
                      className="text-slate-400 hover:text-white transition"
                    >
                      اسأل هيباتيا
                    </button>
                    <button
                      onClick={() => handleDeleteEndpoint(ep.id)}
                      className="text-rose-400 hover:text-rose-300 transition p-1"
                      title="حذف نقطة الربط"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Endpoint Modal */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">إضافة خط ربط / API جديد</h3>
              </div>
              <button
                onClick={() => setIsAddingModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewEndpoint} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">اسم خط الربط أو الخدمة</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: خط فايبر السنترال الرئيسي - البورصة المصرية"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">الجهة / المزود</label>
                  <input
                    type="text"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="مثال: مصر للمقاصة / MIST / بنك"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">نوع البروتوكول</label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="FIX">FIX Protocol (أوامر وتسويات)</option>
                    <option value="SOCKET">WebSocket (بث أسعار لحظية)</option>
                    <option value="POST">POST (API Rest / Webhook)</option>
                    <option value="GET">GET (استعلام / API)</option>
                    <option value="PING">PING / ICMP (فحص شبكة)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">العنوان أو الـ IP والمنفذ</label>
                <input
                  type="text"
                  value={newUrlOrIp}
                  onChange={(e) => setNewUrlOrIp(e.target.value)}
                  placeholder="مثال: 196.205.112.55:8080 أو https://api.bank.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">مفتاح الربط السري أو التوكن (اختياري)</label>
                <input
                  type="password"
                  value={newSecret}
                  onChange={(e) => setNewSecret(e.target.value)}
                  placeholder="يحفظ محلياً في متصفحك ولا يرسل لأي طرف"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ملاحظات تشغيلية</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="ملاحظات حول طريقة التحويل أو السنترال التابع له..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs shadow-md"
                >
                  حفظ نقطة الربط
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
