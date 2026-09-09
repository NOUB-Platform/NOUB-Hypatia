import React from 'react';
import { 
  X, 
  Database, 
  Server, 
  Mail, 
  SlidersHorizontal, 
  CheckSquare, 
  Lock, 
  Bot, 
  Sparkles, 
  ExternalLink,
  ChevronLeft,
  Cpu,
  ShieldAlert,
  Shield,
  Key,
  Github,
  FileCheck2,
  Code2
} from 'lucide-react';
import { TabType, ProjectItem } from '../types';

interface MoreMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: TabType) => void;
  currentTab: TabType;
  activeProject: ProjectItem;
  onAskHypatia: (prompt: string) => void;
}

export const MoreMenuDrawer: React.FC<MoreMenuDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  currentTab,
  activeProject,
  onAskHypatia,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    {
      id: 'contracts' as TabType,
      title: 'العقود والتسليمات (Contracts)',
      description: 'عقود قيمة تك ومراحل التطوير والدفعات المالية والشروط الجزائية',
      icon: FileCheck2,
      badge: 'جدول العقود',
      color: 'text-teal-400 bg-teal-950 border-teal-800/80',
    },
    {
      id: 'mashweer_emails' as TabType,
      title: 'إيميلات ونطاق مشاوير (mashawer.com.eg)',
      description: 'الـ 6 إيميلات المحجوزة عبر المصرية EC (الاستلام غداً)',
      icon: Mail,
      badge: '6 إيميلات',
      color: 'text-cyan-400 bg-cyan-950 border-cyan-800/80',
    },
    {
      id: 'code' as TabType,
      title: 'مستودعات الأكواد و GitHub',
      description: 'مستودع هيباتيا الرسمي NOUB-Hypatia وريبو التطبيقات التابعة',
      icon: Code2,
      badge: 'GitHub Repos',
      color: 'text-indigo-400 bg-indigo-950 border-indigo-800/80',
    },
    {
      id: 'tasks' as TabType,
      title: 'سجل المهام التقنية والتنفيذية',
      description: 'متابعة قائمة المهام العاجلة ومراحل التطوير والأوامر الصوتية',
      icon: CheckSquare,
      badge: 'Tasks',
      color: 'text-amber-400 bg-amber-950 border-amber-800/80',
    },
    {
      id: 'tools' as TabType,
      title: 'الشبكات ومسارات الطوارئ (APIs & DR)',
      description: 'فحص خطوط الربط (مصر للمقاصة، MIST، مباشر، البورصة)',
      icon: Server,
      badge: 'Latency Monitor',
      color: 'text-blue-400 bg-blue-950 border-blue-800/80',
    },
    {
      id: 'settings' as TabType,
      title: 'إعدادات النظام والنموذج ومفاتيح الـ AI',
      description: 'تخصيص نموذج الذكاء الاصطناعي ومفاتيح التشغيل',
      icon: SlidersHorizontal,
      badge: 'Gemini 3.8',
      color: 'text-purple-400 bg-purple-950 border-purple-800/80',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
      
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 font-black text-xs">
              ☰
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">قائمة المزيد والأدوات المتقدمة</h2>
              <p className="text-[11px] text-slate-400">
                الوصول السريع لكافة وحدات النظام وقواعد البيانات وإعدادات النطاق
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body Items */}
        <div className="p-3 sm:p-4 space-y-2 overflow-y-auto flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-right ${
                  isActive
                    ? 'bg-slate-800 border-teal-500 shadow-md'
                    : 'bg-slate-950/70 border-slate-800/90 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.title}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-300">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                  </div>
                </div>

                <ChevronLeft className="w-4 h-4 text-slate-500 shrink-0" />
              </button>
            );
          })}

          {/* Hypatia AI Advisor Card */}
          <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-950 to-purple-950/40 border border-teal-900/50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <Cpu className="w-4 h-4 text-teal-400" />
              <div>
                <span className="font-bold text-white block">المشروع النشط: {activeProject.name}</span>
                <span className="text-[10px] text-slate-400">النموذج: Google Gemini 2.5 Flash</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onSelectTab('chat');
              }}
              className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>فتح الشات</span>
            </button>
          </div>

          {/* GitHub Repository Quick Link */}
          <a
            href="https://github.com/NOUB-Platform/NOUB-Hypatia"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-slate-950 border border-cyan-800/60 hover:border-cyan-500 transition flex items-center justify-between gap-2 group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-cyan-700 flex items-center justify-center text-cyan-300">
                <Github className="w-4 h-4" />
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition flex items-center gap-1.5">
                  <span>مستودع هيباتيا على GitHub</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                    NOUB-Hypatia
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  github.com/NOUB-Platform/NOUB-Hypatia
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-cyan-400 shrink-0" />
          </a>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>هيباتيا • مساعد العمليات والتطوير الشخصي</span>
          <span className="font-mono text-teal-400 font-bold">mashweer.com.eg</span>
        </div>

      </div>
    </div>
  );
};
