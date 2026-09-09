import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Server, 
  Mail, 
  Phone, 
  Calendar, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Clock, 
  CheckSquare, 
  AlertTriangle, 
  Sparkles, 
  Bot, 
  Mic, 
  Building2, 
  Smartphone, 
  Search,
  Filter,
  Layers,
  FileText
} from 'lucide-react';
import { ServiceProviderItem, ProviderCredential, ProviderTask } from '../types';

interface ProvidersVaultTabProps {
  providers: ServiceProviderItem[];
  onAddProvider: (provider: ServiceProviderItem) => void;
  onUpdateProvider: (provider: ServiceProviderItem) => void;
  onDeleteProvider: (id: string) => void;
  onOpenVoiceCommand: () => void;
  onAskHypatia: (prompt: string) => void;
}

export const ProvidersVaultTab: React.FC<ProvidersVaultTabProps> = ({
  providers,
  onAddProvider,
  onUpdateProvider,
  onDeleteProvider,
  onOpenVoiceCommand,
  onAskHypatia,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  // Modals state
  const [isAddProviderModalOpen, setIsAddProviderModalOpen] = useState(false);
  const [activeProviderForTask, setActiveProviderForTask] = useState<string | null>(null);
  const [activeProviderForCred, setActiveProviderForCred] = useState<string | null>(null);

  // New Provider Form
  const [newProvName, setNewProvName] = useState('');
  const [newProvCat, setNewProvCat] = useState<ServiceProviderItem['category']>('دومينات وإيميلات');
  const [newProvWebsite, setNewProvWebsite] = useState('');
  const [newProvContactName, setNewProvContactName] = useState('');
  const [newProvContactRole, setNewProvContactRole] = useState('');
  const [newProvContactPhone, setNewProvContactPhone] = useState('');
  const [newProvContactEmail, setNewProvContactEmail] = useState('');
  const [newProvPlan, setNewProvPlan] = useState('');
  const [newProvRenewalDate, setNewProvRenewalDate] = useState('2027-09-09');
  const [newProvNotes, setNewProvNotes] = useState('');

  // New Credential Form
  const [newCredName, setNewCredName] = useState('');
  const [newCredValue, setNewCredValue] = useState('');
  const [newCredType, setNewCredType] = useState<ProviderCredential['type']>('api_key');
  const [newCredNotes, setNewCredNotes] = useState('');

  // New Task Form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<ProviderTask['priority']>('عاجل');
  const [newTaskContact, setNewTaskContact] = useState('');

  const categories = [
    'الكل',
    'دومينات وإيميلات',
    'استضافة وسيرفرات WE',
    'رسائل و OTP',
    'تطوير برمجيات قيمة تك',
    'بوابات دفع',
    'خرائط وميديا',
    'أخرى'
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleReveal = (id: string) => {
    setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Add Credential to Provider
  const handleAddCredential = (providerId: string) => {
    if (!newCredName.trim() || !newCredValue.trim()) return;

    const targetProvider = providers.find(p => p.id === providerId);
    if (!targetProvider) return;

    const newCred: ProviderCredential = {
      id: `cred-${Date.now()}`,
      keyName: newCredName.trim(),
      keyValue: newCredValue.trim(),
      type: newCredType,
      notes: newCredNotes.trim(),
      isSensitive: newCredType !== 'url'
    };

    const updatedProvider = {
      ...targetProvider,
      credentials: [...targetProvider.credentials, newCred]
    };

    onUpdateProvider(updatedProvider);
    setNewCredName('');
    setNewCredValue('');
    setNewCredNotes('');
    setActiveProviderForCred(null);
  };

  // Add Task to Provider
  const handleAddTask = (providerId: string) => {
    if (!newTaskTitle.trim()) return;

    const targetProvider = providers.find(p => p.id === providerId);
    if (!targetProvider) return;

    const newTask: ProviderTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      dueDate: newTaskDueDate || undefined,
      priority: newTaskPriority,
      status: 'معلقة',
      assignedContact: newTaskContact.trim() || undefined
    };

    const updatedProvider = {
      ...targetProvider,
      tasks: [newTask, ...targetProvider.tasks]
    };

    onUpdateProvider(updatedProvider);
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setNewTaskContact('');
    setActiveProviderForTask(null);
  };

  // Toggle Task Status
  const handleToggleTask = (providerId: string, taskId: string) => {
    const targetProvider = providers.find(p => p.id === providerId);
    if (!targetProvider) return;

    const updatedTasks = targetProvider.tasks.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'مكتملة' ? 'معلقة' : 'مكتملة';
        return { ...t, status: nextStatus as any };
      }
      return t;
    });

    onUpdateProvider({ ...targetProvider, tasks: updatedTasks });
  };

  // Delete Credential
  const handleDeleteCred = (providerId: string, credId: string) => {
    const targetProvider = providers.find(p => p.id === providerId);
    if (!targetProvider) return;

    const updatedCreds = targetProvider.credentials.filter(c => c.id !== credId);
    onUpdateProvider({ ...targetProvider, credentials: updatedCreds });
  };

  // Delete Task
  const handleDeleteTask = (providerId: string, taskId: string) => {
    const targetProvider = providers.find(p => p.id === providerId);
    if (!targetProvider) return;

    const updatedTasks = targetProvider.tasks.filter(t => t.id !== taskId);
    onUpdateProvider({ ...targetProvider, tasks: updatedTasks });
  };

  // Submit New Provider
  const handleCreateProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvName.trim()) return;

    const newProvider: ServiceProviderItem = {
      id: `prov-${Date.now()}`,
      name: newProvName.trim(),
      category: newProvCat,
      website: newProvWebsite.trim() || undefined,
      subscriptionDate: new Date().toISOString().split('T')[0],
      renewalDate: newProvRenewalDate || undefined,
      costOrPlan: newProvPlan.trim() || undefined,
      contactPersons: newProvContactName.trim() ? [{
        name: newProvContactName.trim(),
        role: newProvContactRole.trim() || 'مسؤول الحساب',
        phone: newProvContactPhone.trim() || undefined,
        email: newProvContactEmail.trim() || undefined
      }] : [],
      credentials: [],
      tasks: [],
      notes: newProvNotes.trim() || undefined
    };

    onAddProvider(newProvider);
    setNewProvName('');
    setNewProvWebsite('');
    setNewProvContactName('');
    setNewProvContactRole('');
    setNewProvContactPhone('');
    setNewProvContactEmail('');
    setNewProvPlan('');
    setNewProvNotes('');
    setIsAddProviderModalOpen(false);
  };

  // Calculate days remaining to renewal
  const getDaysRemaining = (renewalDateStr?: string) => {
    if (!renewalDateStr) return null;
    const now = new Date('2026-09-09');
    const renewal = new Date(renewalDateStr);
    const diff = Math.ceil((renewal.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filteredProviders = providers.filter(p => {
    const matchesCat = selectedCategory === 'الكل' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contactPersons.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.notes && p.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const totalCredentials = providers.reduce((acc, p) => acc + p.credentials.length, 0);
  const totalTasks = providers.reduce((acc, p) => acc + p.tasks.length, 0);
  const pendingTasks = providers.reduce((acc, p) => acc + p.tasks.filter(t => t.status !== 'مكتملة').length, 0);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Top Banner & Stats */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#182640] border border-slate-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-950 border border-teal-700 flex items-center justify-center text-teal-300 shrink-0 shadow">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-white">خزنة مزودي الخدمات والاعتمادات (Vault)</h1>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700 font-bold">
                حفظ دائم محلي وموثق
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              المرجع المركزي الشامل لمزودي الخدمات الفعليين، مفاتيح الوصول، تفاصيل السيرفرات، جهات الاتصال (م. محمد الحلو، م. أحمد محرم، م. أحمد غريب، المحامي، قيمة تك)، وتواريخ التجديد.
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenVoiceCommand}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition"
          >
            <Mic className="w-4 h-4" />
            <span>أمر صوتي لهيباتيا</span>
          </button>
          <button
            onClick={() => setIsAddProviderModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-600 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4 text-teal-300" />
            <span>إضافة مزود جديد</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#111b2e] border border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-300 block">إجمالي المزودين</span>
            <span className="text-lg font-black text-white">{providers.length}</span>
          </div>
          <Building2 className="w-5 h-5 text-teal-400" />
        </div>
        <div className="p-3.5 rounded-2xl bg-[#111b2e] border border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-300 block">المفاتيح والاعتمادات</span>
            <span className="text-lg font-black text-cyan-300">{totalCredentials}</span>
          </div>
          <Key className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="p-3.5 rounded-2xl bg-[#111b2e] border border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-300 block">المهام المعلقة للمتابعة</span>
            <span className="text-lg font-black text-amber-300">{pendingTasks}</span>
          </div>
          <CheckSquare className="w-5 h-5 text-amber-400" />
        </div>
        <div className="p-3.5 rounded-2xl bg-[#111b2e] border border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-300 block">تجديد الدومينات القادم</span>
            <span className="text-xs font-black text-emerald-300 font-mono">9/9/2027</span>
          </div>
          <Calendar className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* Search & Category Filter Chips */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="ابحث باسم المزود، جهة الاتصال (مثال: الحلو، محرم، غريب)، أو تفاصيل الخدمة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111b2e] border border-slate-700 rounded-2xl pr-9 pl-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition font-bold ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-slate-950 font-black shadow'
                  : 'bg-[#182640] border border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Providers Cards List */}
      <div className="space-y-4">
        {filteredProviders.map((provider) => {
          const daysLeft = getDaysRemaining(provider.renewalDate);

          return (
            <div
              key={provider.id}
              className="p-4 sm:p-5 rounded-3xl bg-[#182640] border border-slate-700 shadow-xl space-y-4 transition hover:border-slate-600"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2.5 py-0.5 rounded-lg font-bold bg-[#111b2e] text-teal-300 border border-teal-700">
                      {provider.category}
                    </span>
                    <h2 className="text-base font-bold text-white">{provider.name}</h2>
                    {provider.officialBadge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                        {provider.officialBadge}
                      </span>
                    )}
                  </div>

                  {provider.costOrPlan && (
                    <p className="text-xs text-slate-300 flex items-center gap-1.5">
                      <span className="text-slate-400">الخطة / العقد:</span>
                      <span className="text-slate-200 font-semibold">{provider.costOrPlan}</span>
                    </p>
                  )}
                </div>

                {/* Renewal & Website info */}
                <div className="flex items-center gap-2 shrink-0">
                  {provider.renewalDate && (
                    <div className="text-right px-2.5 py-1 rounded-xl bg-[#111b2e] border border-slate-700 text-[11px]">
                      <span className="text-slate-400 block text-[10px]">تاريخ التجديد:</span>
                      <span className="font-mono font-bold text-teal-300">{provider.renewalDate}</span>
                      {daysLeft !== null && daysLeft > 0 && (
                        <span className="text-[9px] text-emerald-400 block font-semibold">
                          (متبقي {daysLeft} يوم)
                        </span>
                      )}
                    </div>
                  )}

                  {provider.website && (
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="زيارة الموقع أو لوحة التحكم"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف مزود الخدمة: ${provider.name}؟`)) {
                        onDeleteProvider(provider.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 transition"
                    title="حذف المزود"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Contact Persons Bar */}
              {provider.contactPersons.length > 0 && (
                <div className="bg-[#111b2e] border border-slate-700 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-teal-300" />
                      <span>جهات الاتصال والمسؤولين المعتمدين:</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {provider.contactPersons.map((contact, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-[#0e1626] border border-slate-700 text-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{contact.name}</span>
                          <span className="text-[10px] text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
                            {contact.role}
                          </span>
                        </div>
                        {contact.notes && (
                          <p className="text-[11px] text-slate-300 mt-1">{contact.notes}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                          {contact.phone && (
                            <span className="font-mono text-slate-200">هاتف: {contact.phone}</span>
                          )}
                          {contact.email && (
                            <span className="font-mono text-slate-200">{contact.email}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Services & Subscriptions Table (e.g. EC Egypt official portal services) */}
              {provider.activeServices && provider.activeServices.length > 0 && (
                <div className="space-y-2 bg-[#0e1626] border border-slate-700/90 rounded-2xl p-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">
                        الخدمات وباقات الاشتراك النشطة المسجلة (Active Services)
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Showing 1 to {provider.activeServices.length} of {provider.activeServices.length} entries
                      </span>
                    </div>

                    <div className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-800">
                      إجمالي الاشتراكات: 3,300.00 ج.م / سنوياً
                    </div>
                  </div>

                  {/* Portal Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                          <th className="py-2 px-2 font-semibold">الخدمة / المنتج (Product/Service)</th>
                          <th className="py-2 px-2 font-semibold">الدومين المرتبط</th>
                          <th className="py-2 px-2 font-semibold">التكلفة (Pricing)</th>
                          <th className="py-2 px-2 font-semibold">تاريخ الاستحقاق (Next Due Date)</th>
                          <th className="py-2 px-2 font-semibold text-center">الحالة (Status)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 text-slate-200">
                        {provider.activeServices.map((svc) => (
                          <tr key={svc.id} className="hover:bg-slate-900/50 transition">
                            <td className="py-2.5 px-2">
                              <div className="flex items-center gap-2">
                                {svc.hasSsl && (
                                  <span className="w-5 h-5 rounded bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0" title="شهادة أمان SSL مفعلة">
                                    <Shield className="w-3 h-3" />
                                  </span>
                                )}
                                <span className="font-bold text-white font-mono">{svc.name}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-2 font-mono text-teal-300 font-semibold">
                              {svc.domainOrResource}
                            </td>
                            <td className="py-2.5 px-2">
                              <span className="font-bold text-slate-100">{svc.price}</span>
                              <span className="text-[10px] text-slate-400 block font-normal">{svc.billingCycle}</span>
                            </td>
                            <td className="py-2.5 px-2 font-mono text-[11px] text-amber-200">
                              {svc.nextDueDate}
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-700 shadow-sm inline-flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                <span>{svc.status}</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Domain Clarification Notice */}
                  <div className="mt-2 p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-[11px] text-teal-200 flex items-start gap-2 leading-relaxed">
                    <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white">تنبيه تدقيق هيباتيا للنطاق الرسمي:</span>{' '}
                      النطاق المحجوز رسمياً في الفاتورة والخدمات لدى المصرية لتكنولوجيا المعلومات هو{' '}
                      <span className="font-mono font-black text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">mashawer.com.eg</span>{' '}
                      (بحرف a)، وموعد تجديد الدومين هو <span className="font-mono font-bold text-white">9 أغسطس 2027</span>، والاستضافة Host1 مع شهادة SSL في <span className="font-mono font-bold text-white">11 أغسطس 2027</span>.
                    </div>
                  </div>
                </div>
              )}

              {/* Dedicated Official Figma Designs Section for Qeema Tech (قيمة تك) */}
              {provider.id === 'provider-qeema-tech' && (
                <div className="space-y-2 bg-[#0e1626] border border-purple-800/60 rounded-2xl p-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-900/50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-950 border border-purple-700 flex items-center justify-center text-purple-300 font-black text-xs">
                        F
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white">
                          روابط تصاميم فيجما الرسمية المعتمدة (Figma Official Designs)
                        </h3>
                        <span className="text-[10px] text-purple-300">
                          روابط ملفات الـ UI/UX المعمارية المعتمدة لمشاريع قيمة تك الثلاثة
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onAskHypatia('مقارنة شاشات فيجما بكود مشاريع قيمة تك (دارو، وكالة، مشاوير 4B) واستخراج الفروقات بدقة')}
                      className="px-2.5 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-700 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                      <span>مقارنة فيجما مع الكود بـ هيباتيا</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                    {/* Daro Figma */}
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-600 transition space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">تطبيق دارو (Daro)</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                            Figma UI
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          تصاميم واجهات الشحن اللوجستي، محطات التوزيع وفحص الباركود.
                        </p>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-slate-900">
                        <a
                          href="https://www.figma.com/design/aR1aanpRzGL7aMoxROGgt5/Daro?node-id=0-1&t=HFGqvAl4RPmlMliu-1"
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-1.5 px-2 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-200 text-center text-xs font-bold flex items-center justify-center gap-1 transition"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>فتح ملف فيجما</span>
                        </a>
                        <button
                          onClick={() => handleCopy('https://www.figma.com/design/aR1aanpRzGL7aMoxROGgt5/Daro?node-id=0-1&t=HFGqvAl4RPmlMliu-1', 'fig-daro')}
                          className="w-full py-1 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-center text-[10px] flex items-center justify-center gap-1 transition"
                        >
                          {copiedId === 'fig-daro' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === 'fig-daro' ? 'تم نسخ الرابط' : 'نسخ رابط فيجما'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Wikala Figma */}
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-600 transition space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">تطبيق وكالة (Wikala)</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                            Figma UI
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          تصاميم بوابات الوكلاء، مكاتب التوصيل، إدارة الأساطيل والعمولات.
                        </p>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-slate-900">
                        <a
                          href="https://www.figma.com/design/oYxkmwZcGae674BRA5ZOen/Wikala?node-id=0-1&t=rbE4CPeGiTAMMin2-1"
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-1.5 px-2 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-200 text-center text-xs font-bold flex items-center justify-center gap-1 transition"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>فتح ملف فيجما</span>
                        </a>
                        <button
                          onClick={() => handleCopy('https://www.figma.com/design/oYxkmwZcGae674BRA5ZOen/Wikala?node-id=0-1&t=rbE4CPeGiTAMMin2-1', 'fig-wikala')}
                          className="w-full py-1 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-center text-[10px] flex items-center justify-center gap-1 transition"
                        >
                          {copiedId === 'fig-wikala' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === 'fig-wikala' ? 'تم نسخ الرابط' : 'نسخ رابط فيجما'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Mashawer - Backlog Figma */}
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-600 transition space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">مشاوير - Backlog (4B)</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                            Figma UI
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          تصاميم رحلات الركاب، الخرائط، التسعير وشاشات الـ Backlog المعتمدة.
                        </p>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-slate-900">
                        <a
                          href="https://www.figma.com/design/ulWwUzLnKThS2cfJWDetX6/%D9%85%D8%B4%D8%A7%D9%88%D9%8A%D8%B1---backlog?node-id=221-63531&t=uCzHJZbEM1gi1Zz8-0"
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-1.5 px-2 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-200 text-center text-xs font-bold flex items-center justify-center gap-1 transition"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>فتح ملف فيجما</span>
                        </a>
                        <button
                          onClick={() => handleCopy('https://www.figma.com/design/ulWwUzLnKThS2cfJWDetX6/%D9%85%D8%B4%D8%A7%D9%88%D9%8A%D8%B1---backlog?node-id=221-63531&t=uCzHJZbEM1gi1Zz8-0', 'fig-mashawer')}
                          className="w-full py-1 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-center text-[10px] flex items-center justify-center gap-1 transition"
                        >
                          {copiedId === 'fig-mashawer' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === 'fig-mashawer' ? 'تم نسخ الرابط' : 'نسخ رابط فيجما'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Credentials & Keys Vault Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Key className="w-4 h-4 text-cyan-400" />
                    <span>خزنة المفاتيح والاعتمادات المسجلة ({provider.credentials.length})</span>
                  </div>

                  <button
                    onClick={() => setActiveProviderForCred(provider.id)}
                    className="text-[11px] px-2.5 py-1 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 transition flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>إضافة مفتاح / اعتماد</span>
                  </button>
                </div>

                {provider.credentials.length === 0 ? (
                  <div className="p-3 rounded-xl bg-[#0e1626] border border-slate-700/80 text-center text-xs text-slate-400">
                    لا توجد مفاتيح مسجلة بعد. اضغط على "إضافة مفتاح / اعتماد" لتخزين API Key، أو رابط لوحة التحكم، أو كلمات السر.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {provider.credentials.map((cred) => {
                      const isRevealed = revealedKeys[cred.id];

                      return (
                        <div
                          key={cred.id}
                          className="p-2.5 rounded-xl bg-[#0e1626] border border-slate-700 hover:border-slate-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-200">{cred.keyName}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                                {cred.type}
                              </span>
                            </div>
                            
                            <div className="font-mono text-xs text-teal-300 break-all bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                              {cred.isSensitive && !isRevealed
                                ? '••••••••••••••••••••••••••••••••'
                                : cred.keyValue}
                            </div>

                            {cred.notes && (
                              <p className="text-[10px] text-slate-400">{cred.notes}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                            {cred.isSensitive && (
                              <button
                                onClick={() => toggleReveal(cred.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                                title={isRevealed ? 'إخفاء' : 'إظهار'}
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            )}

                            <button
                              onClick={() => handleCopy(cred.keyValue, cred.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-teal-950 border border-teal-800 hover:bg-teal-900 text-teal-300 text-xs font-bold transition flex items-center gap-1"
                              title="نسخ للقارئ"
                            >
                              {copiedId === cred.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>تم النسخ</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>نسخ</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleDeleteCred(provider.id, cred.id)}
                              className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900 border border-rose-800/80 text-rose-300 transition"
                              title="حذف المفتاح"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tasks List for this Provider */}
              <div className="space-y-2.5 border-t border-slate-700/80 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                    <span>المهام والمتابعات الخاصة بالمزود ({provider.tasks.length})</span>
                  </div>

                  <button
                    onClick={() => setActiveProviderForTask(provider.id)}
                    className="text-[11px] px-2.5 py-1 rounded-xl bg-amber-950 border border-amber-800 text-amber-300 hover:bg-amber-900 transition flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>إضافة مهمة جديدة</span>
                  </button>
                </div>

                {provider.tasks.length === 0 ? (
                  <div className="p-2.5 rounded-xl bg-[#0e1626] border border-slate-700/80 text-center text-xs text-slate-400">
                    لا توجد مهام مسجلة لهذا المزود. يمكنك تسجيل مهمة (مثل: استلام الإيميلات غداً، متابعة فاتورة، فحص السيرفر).
                  </div>
                ) : (
                  <div className="space-y-2">
                    {provider.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-2.5 rounded-xl border transition flex items-start justify-between gap-2 text-xs ${
                          task.status === 'مكتملة'
                            ? 'bg-[#0e1626]/60 border-slate-800 opacity-60'
                            : 'bg-[#0e1626] border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <button
                            onClick={() => handleToggleTask(provider.id, task.id)}
                            className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                              task.status === 'مكتملة'
                                ? 'bg-emerald-600 border-emerald-500 text-white'
                                : 'border-slate-500 hover:border-teal-400'
                            }`}
                          >
                            {task.status === 'مكتملة' && <Check className="w-3 h-3" />}
                          </button>
                          
                          <div>
                            <span className={`font-semibold ${task.status === 'مكتملة' ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                              {task.title}
                            </span>
                            
                            <div className="flex items-center gap-2.5 mt-1 text-[10px] text-slate-400 flex-wrap">
                              {task.dueDate && (
                                <span className="text-amber-300 font-mono">
                                  الاستحقاق: {task.dueDate}
                                </span>
                              )}
                              {task.assignedContact && (
                                <span className="text-teal-300">
                                  المسؤول: {task.assignedContact}
                                </span>
                              )}
                              <span className={`px-1.5 py-0.2 rounded font-bold ${
                                task.priority === 'عاجل'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                  : 'bg-slate-800 text-slate-300'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteTask(provider.id, task.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition"
                          title="حذف المهمة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Apps & Notes Footer */}
              <div className="border-t border-slate-700/80 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                {provider.linkedApps && provider.linkedApps.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-400 text-[11px]">التطبيقات المرتبطة:</span>
                    {provider.linkedApps.map((app, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-teal-300 font-bold">
                        {app}
                      </span>
                    ))}
                  </div>
                )}

                {provider.notes && (
                  <span className="text-[11px] text-slate-300 italic">
                    ملاحظة: {provider.notes}
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal: Add New Service Provider */}
      {isAddProviderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-[#182640] border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-white">إضافة مزود خدمة جديد للخزنة</h3>
              <button
                onClick={() => setIsAddProviderModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProvider} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-bold">اسم الشركة أو مزود الخدمة *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: المصرية لتكنولوجيا المعلومات أو بوابة دفع"
                  value={newProvName}
                  onChange={(e) => setNewProvName(e.target.value)}
                  className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">التصنيف</label>
                  <select
                    value={newProvCat}
                    onChange={(e) => setNewProvCat(e.target.value as any)}
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="دومينات وإيميلات">دومينات وإيميلات</option>
                    <option value="استضافة وسيرفرات WE">استضافة وسيرفرات WE</option>
                    <option value="رسائل و OTP">رسائل و OTP</option>
                    <option value="تطوير برمجيات قيمة تك">تطوير برمجيات قيمة تك</option>
                    <option value="بوابات دفع">بوابات دفع</option>
                    <option value="خرائط وميديا">خرائط وميديا</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">تاريخ التجديد</label>
                  <input
                    type="date"
                    value={newProvRenewalDate}
                    onChange={(e) => setNewProvRenewalDate(e.target.value)}
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">رابط الموقع أو لوحة التحكم</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newProvWebsite}
                  onChange={(e) => setNewProvWebsite(e.target.value)}
                  className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">الخطة والأسعار</label>
                <input
                  type="text"
                  placeholder="مثال: خطة Zoho Lite لـ 6 إيميلات أو اشتراك سنوي"
                  value={newProvPlan}
                  onChange={(e) => setNewProvPlan(e.target.value)}
                  className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="p-3 bg-[#111b2e] border border-slate-700 rounded-2xl space-y-2">
                <span className="text-[11px] font-bold text-teal-300 block">بيانات جهة الاتصال والمسؤول:</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="الاسم (مثال: المهندس محمد الحلو)"
                    value={newProvContactName}
                    onChange={(e) => setNewProvContactName(e.target.value)}
                    className="bg-[#0e1626] border border-slate-700 rounded-xl px-2.5 py-1.5 text-white placeholder-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="الصفة / المنصب"
                    value={newProvContactRole}
                    onChange={(e) => setNewProvContactRole(e.target.value)}
                    className="bg-[#0e1626] border border-slate-700 rounded-xl px-2.5 py-1.5 text-white placeholder-slate-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="الهاتف"
                    value={newProvContactPhone}
                    onChange={(e) => setNewProvContactPhone(e.target.value)}
                    className="bg-[#0e1626] border border-slate-700 rounded-xl px-2.5 py-1.5 text-white placeholder-slate-400 font-mono"
                  />
                  <input
                    type="email"
                    placeholder="الإيميل"
                    value={newProvContactEmail}
                    onChange={(e) => setNewProvContactEmail(e.target.value)}
                    className="bg-[#0e1626] border border-slate-700 rounded-xl px-2.5 py-1.5 text-white placeholder-slate-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">ملاحظات إضافية</label>
                <textarea
                  rows={2}
                  placeholder="أي معلومات تخص التعاقد أو شروط الخدمة..."
                  value={newProvNotes}
                  onChange={(e) => setNewProvNotes(e.target.value)}
                  className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProviderModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow"
                >
                  حفظ المزود
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Credential to Provider */}
      {activeProviderForCred && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-[#182640] border border-slate-700 rounded-3xl w-full max-w-sm shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white">إضافة مفتاح / اعتماد للخزنة</h3>
              <button onClick={() => setActiveProviderForCred(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-bold">اسم المفتاح أو البند *</label>
                <input
                  type="text"
                  placeholder="مثال: API Key, باسورد لوحة التحكم, Webhook Secret"
                  value={newCredName}
                  onChange={(e) => setNewCredName(e.target.value)}
                  className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">القيمة / المفتاح السري *</label>
                <textarea
                  rows={2}
                  placeholder="الصق المفتاح أو الرابط هنا..."
                  value={newCredValue}
                  onChange={(e) => setNewCredValue(e.target.value)}
                  className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">نوع البند</label>
                  <select
                    value={newCredType}
                    onChange={(e) => setNewCredType(e.target.value as any)}
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="api_key">مفتاح API Key</option>
                    <option value="password">كلمة مرور Password</option>
                    <option value="secret">رمز سري Secret</option>
                    <option value="token">توكن Token</option>
                    <option value="url">رابط Webhook / URL</option>
                    <option value="account_id">معرف حساب Account ID</option>
                    <option value="env_var">متغير بيئة Env Var</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">ملاحظات قصيرة</label>
                  <input
                    type="text"
                    placeholder="مثال: للباك إند فقط"
                    value={newCredNotes}
                    onChange={(e) => setNewCredNotes(e.target.value)}
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setActiveProviderForCred(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-white font-bold"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleAddCredential(activeProviderForCred)}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-black shadow"
                >
                  حفظ في الخزنة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Task to Provider */}
      {activeProviderForTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-[#182640] border border-slate-700 rounded-3xl w-full max-w-sm shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white">إضافة مهمة ومتابعة للمزود</h3>
              <button onClick={() => setActiveProviderForTask(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-bold">عنوان المهمة *</label>
                <input
                  type="text"
                  placeholder="مثال: استلام الـ 6 إيميلات غداً من م. محمد الحلو"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">تاريخ الاستحقاق</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">الأولوية</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="عاجل">عاجل</option>
                    <option value="متوسط">متوسط</option>
                    <option value="عادي">عادي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">المسؤول عن المتابعة</label>
                <input
                  type="text"
                  placeholder="مثال: المهندس محمد الحلو أو المهندس أحمد محرم"
                  value={newTaskContact}
                  onChange={(e) => setNewTaskContact(e.target.value)}
                  className="w-full bg-[#111b2e] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setActiveProviderForTask(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-white font-bold"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleAddTask(activeProviderForTask)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black shadow"
                >
                  تسجيل المهمة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
