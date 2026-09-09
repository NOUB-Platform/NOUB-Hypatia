import React, { useState } from 'react';
import { 
  Mail, 
  Globe, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  Users, 
  Server,
  Zap,
  HelpCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Laptop
} from 'lucide-react';
import { MashweerEmployeeEmail } from '../types';

interface MashweerEmailsTabProps {
  emails: MashweerEmployeeEmail[];
  onAddEmail: (email: MashweerEmployeeEmail) => void;
  onDeleteEmail: (id: string) => void;
  onUpdateEmailStatus: (id: string, status: MashweerEmployeeEmail['status']) => void;
  onAskHypatia: (prompt: string) => void;
}

export const MashweerEmailsTab: React.FC<MashweerEmailsTabProps> = ({
  emails,
  onAddEmail,
  onDeleteEmail,
  onUpdateEmailStatus,
  onAskHypatia,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [allCopied, setAllCopied] = useState(false);
  
  // New Email Form State
  const [employeeName, setEmployeeName] = useState('');
  const [role, setRole] = useState('');
  const [emailUsername, setEmailUsername] = useState('');
  const [provider, setProvider] = useState<MashweerEmployeeEmail['provider']>('Zoho Lite (المصرية لتكنولوجيا المعلومات)');

  const domain = 'mashweer.com.eg';

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAllEmails = () => {
    const emailListText = emails.map(e => `${e.emailAddress} (${e.employeeName})`).join('\n');
    navigator.clipboard.writeText(emailListText);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  const handleCreateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName.trim() || !emailUsername.trim()) return;

    const fullEmail = emailUsername.includes('@')
      ? emailUsername.trim()
      : `${emailUsername.trim().toLowerCase()}@${domain}`;

    const newEmail: MashweerEmployeeEmail = {
      id: `email-${Date.now()}`,
      employeeName: employeeName.trim(),
      role: role.trim() || 'إدارة مشاوير',
      emailAddress: fullEmail,
      status: 'تم الطلب - موعد الاستلام غداً',
      provider: provider,
      createdAt: new Date().toISOString().split('T')[0],
      deliveryDate: '2026-09-10',
      notes: `تم التجهيز للإعداد على مزود ${provider}`,
    };

    onAddEmail(newEmail);
    setEmployeeName('');
    setRole('');
    setEmailUsername('');
    setIsAddModalOpen(false);
  };

  const dnsRecords = [
    { type: 'MX', host: '@', value: 'mx.zoho.com', priority: 10, notes: 'سيرفر الاستقبال الأساسي لـ Zoho' },
    { type: 'MX', host: '@', value: 'mx2.zoho.com', priority: 20, notes: 'سيرفر الاستقبال الثانوي' },
    { type: 'MX', host: '@', value: 'mx3.zoho.com', priority: 50, notes: 'سيرفر الاستقبال الاحتياطي' },
    { type: 'TXT (SPF)', host: '@', value: 'v=spf1 include:zoho.com ~all', priority: '-', notes: 'حماية الإيميلات من السبام وتأكيد الهوية' },
  ];

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Domain Top Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#182640] border border-slate-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-950 border border-teal-700 flex items-center justify-center text-teal-300 shrink-0 shadow">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-white">إدارة نطاق وإيميلات مشاوير الرسمية</h1>
              <span className="text-xs px-3 py-0.5 rounded-full font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700">
                {domain}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>تم الطلب - الاستلام غداً 10/9/2026</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
              تم حجز وتفعيل الـ 6 إيميلات الرسمية على خطة زوهو الأولى (Zoho Lite) عبر المصرية لتكنولوجيا المعلومات بالتعاون مع المهندس محمد الحلو.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={handleCopyAllEmails}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition border border-slate-600"
          >
            {allCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{allCopied ? 'تم نسخ الـ 6 إيميلات' : 'نسخ قائمة الإيميلات'}</span>
          </button>

          <button
            onClick={() =>
              onAskHypatia(
                `أنا طلبت اليوم الـ 6 إيميلات الرسمية: admin, support, info, operation, hr, finance على خطة Zoho Lite عبر المصرية لتكنولوجيا المعلومات وهستلمهم بكرة. اشرحي لي إزاي هربطهم ببرنامج Microsoft Outlook في المقر وإزاي هنتأكد من الـ DNS مع المهندس محمد الحلو.`
              )
            }
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
          >
            <Bot className="w-4 h-4" />
            <span>استشارة هيباتيا لربط Outlook</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة إيميل جديد</span>
          </button>
        </div>
      </div>

      {/* Confirmed Order & Delivery Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-teal-950/80 via-[#182640] to-cyan-950/80 border border-teal-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-lg">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">
                تم اعتماد وحجز الـ 6 إيميلات على الخطة الأولى (Zoho Lite)
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-teal-900 text-teal-200 border border-teal-700">
                المصرية لتكنولوجيا المعلومات
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
              الإيميلات الـ 6 المطلوبة: <strong className="text-teal-300 font-mono">admin, support, info, operation, hr, finance</strong>. موعد الاستلام غداً من <strong className="text-white">المهندس محمد الحلو</strong>، وجاهزة للعمل على متصفح الويب، تطبيقات زوهو موبايل، وبرنامج Microsoft Outlook عبر IMAP/SMTP.
            </p>
          </div>
        </div>

        <a
          href="https://clients.ec.com.eg"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl bg-teal-950 border border-teal-700 text-teal-300 text-[11px] font-bold flex items-center gap-1 hover:bg-teal-900 transition shrink-0"
        >
          <span>لوحة المصرية EC (clients.ec.com.eg)</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Employees Emails Directory */}
      <div className="bg-[#182640] border border-slate-700 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold text-white">
              قائمة الإيميلات الرسمية الـ 6 المحجوزة اليوم ({emails.length}):
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            نطاق: @{domain}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {emails.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-[#111b2e] border border-slate-700 flex flex-col justify-between gap-2.5 hover:border-slate-600 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-white block">{item.employeeName}</span>
                  <span className="text-[11px] text-slate-300 block">{item.role}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-teal-950 text-teal-300 border border-teal-700 font-bold">
                    {item.status}
                  </span>

                  <button
                    onClick={() => onDeleteEmail(item.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition"
                    title="حذف الإيميل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#0e1626] border border-slate-700/80">
                <span className="font-mono text-xs text-teal-300 font-bold truncate">
                  {item.emailAddress}
                </span>

                <button
                  onClick={() => handleCopy(item.emailAddress, item.id)}
                  className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] flex items-center gap-1 shrink-0"
                  title="نسخ الإيميل"
                >
                  {copiedKey === item.id ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === item.id ? 'تم النسخ' : 'نسخ'}</span>
                </button>
              </div>

              {item.notes && (
                <p className="text-[10px] text-slate-300 italic">
                  {item.notes}
                </p>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-700/70 pt-2">
                <span>المزود: {item.provider}</span>
                <span className="font-mono text-teal-300 font-semibold">
                  {item.deliveryDate ? `الاستلام: ${item.deliveryDate}` : item.createdAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Outlook & Exchange Integration Guide */}
      <div className="bg-[#182640] border border-slate-700 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-xl">
        <div className="flex items-center gap-2">
          <Laptop className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white">
            دليل تشغيل الإيميلات على Microsoft Outlook والشبكة الداخلية:
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#111b2e] border border-slate-700 space-y-1.5">
            <span className="font-bold text-white block">1. لا حاجة لسيرفر Exchange داخلي</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              سيرفرات زوهو السحابية تتكفل بالتشغيل على مدار 24 ساعة بنسبة توفر 99.9%، مما يحميك من انقطاع الكهرباء أو الإنترنت داخل المقر ويضمن وصول الإيميلات دائماً.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#111b2e] border border-slate-700 space-y-1.5">
            <span className="font-bold text-white block">2. التوافق التام مع Outlook</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              يمكن ربط كل إيميل ببرنامج Outlook في أجهزة الكمبيوتر داخل المقر بسهولة عبر بروتوكول IMAP (البورت 993) و SMTP (البورت 465/587).
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#111b2e] border border-slate-700 space-y-1.5">
            <span className="font-bold text-white block">3. تطبيقات الموبايل والويب</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              إلى جانب الأوتلوك، يتاح للموظفين تطبيق Zoho Mail الرسمي على أجهزة Android و iOS لمتابعة الإشعارات اللحظية من أي مكان.
            </p>
          </div>
        </div>
      </div>

      {/* DNS Configuration Reference for EC / Mohamed El-Helw */}
      <div className="bg-[#182640] border border-slate-700 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold text-white">
              سجلات الـ DNS المطلوب ضبطها مع المهندس محمد الحلو (Zoho Mail):
            </h2>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700 font-bold">
            جاهزة للتسليم
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-[11px]">
                <th className="pb-2">نوع السجل</th>
                <th className="pb-2">المضيف Host</th>
                <th className="pb-2">القيمة Value</th>
                <th className="pb-2">الأولوية Priority</th>
                <th className="pb-2">الغرض والملاحظة</th>
                <th className="pb-2 text-left">نسخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 font-mono">
              {dnsRecords.map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 font-bold text-teal-300">{r.type}</td>
                  <td className="py-2.5 text-slate-300">{r.host}</td>
                  <td className="py-2.5 text-slate-100 font-bold">{r.value}</td>
                  <td className="py-2.5 text-slate-300">{r.priority}</td>
                  <td className="py-2.5 font-sans text-[11px] text-slate-300">{r.notes}</td>
                  <td className="py-2.5 text-left font-sans">
                    <button
                      onClick={() => handleCopy(r.value, `dns-${i}`)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold"
                    >
                      {copiedKey === `dns-${i}` ? 'تم' : 'نسخ'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Email */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-[#182640] border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-white">إضافة إيميل رسمي جديد</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmail} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-bold">اسم الموظف أو الإدارة *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: إدارة التسويق والعلاقات"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">المسمى الوظيفي / الدور</label>
                <input
                  type="text"
                  placeholder="مثال: Marketing & Growth Manager"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">اسم المستخدم للإيميل (Username) *</label>
                <div className="flex items-center bg-[#111b2e] border border-slate-700 rounded-xl overflow-hidden focus-within:border-teal-500">
                  <span className="px-3 text-teal-300 font-mono text-xs font-bold border-l border-slate-700">
                    @{domain}
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="marketing"
                    value={emailUsername}
                    onChange={(e) => setEmailUsername(e.target.value)}
                    className="w-full bg-transparent px-3 py-2 text-white placeholder-slate-400 focus:outline-none font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">مزود الخدمة</label>
                <select
                  value={provider}
                  onChange={(e: any) => setProvider(e.target.value)}
                  className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Zoho Lite (المصرية لتكنولوجيا المعلومات)">Zoho Lite (المصرية لتكنولوجيا المعلومات)</option>
                  <option value="Zoho Mail Free">Zoho Mail Free (مجاني)</option>
                  <option value="Google Workspace">Google Workspace</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow"
                >
                  حفظ الإيميل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
