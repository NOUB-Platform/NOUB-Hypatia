import React, { useState } from 'react';
import { 
  ChevronDown, 
  Plus, 
  Check, 
  Settings, 
  Mic
} from 'lucide-react';
import { ProjectItem } from '../types';

interface MiniAppHeaderProps {
  projects: ProjectItem[];
  activeProject: ProjectItem;
  onSelectProject: (project: ProjectItem) => void;
  onOpenNewProjectModal: () => void;
  onOpenSettings: () => void;
  onOpenVoiceCommand?: () => void;
}

export const MiniAppHeader: React.FC<MiniAppHeaderProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onOpenNewProjectModal,
  onOpenSettings,
  onOpenVoiceCommand,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 py-2.5 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left / Start: Hypatia Avatar & Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md shadow-teal-950/40">
              هيباتيا
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-teal-400 border-2 border-slate-900 animate-pulse"></span>
          </div>
          <div className="hidden xs:block text-right">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-wide">هيباتيا</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-500/15 text-teal-300 font-mono">متصل</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[110px] sm:max-w-[140px]">
              مساعدك التقني والنظامي
            </p>
          </div>
        </div>

        {/* Center: Project Switcher Pill Dropdown */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700/80 hover:border-emerald-500/60 transition shadow-inner text-right"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
              <div className="truncate">
                <span className="text-xs font-bold text-slate-100 block truncate">
                  {activeProject.name}
                </span>
                <span className="text-[10px] text-slate-400 block truncate font-mono">
                  {activeProject.category} • {activeProject.status}
                </span>
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''} shrink-0`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 left-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto">
              <div className="text-[10px] font-bold text-slate-400 px-2 py-1 flex items-center justify-between border-b border-slate-800 mb-1">
                <span>اختر التطبيق النشط ({projects.length})</span>
                <span>المشاريع</span>
              </div>

              <div className="space-y-1">
                {projects.map((p) => {
                  const isSelected = p.id === activeProject.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProject(p);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-right transition ${
                        isSelected 
                          ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300' 
                          : 'hover:bg-slate-800/80 text-slate-200'
                      }`}
                    >
                      <div className="truncate pr-1">
                        <div className="text-xs font-semibold flex items-center gap-1.5 truncate">
                          <span>{p.name}</span>
                          {p.category === 'مشاوير' && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                              مشاوير
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {p.status} • {p.apkFiles.length > 0 ? `${p.apkFiles.length} APK` : 'لا يوجد APK'}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Add New Project Button */}
              <div className="pt-2 mt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenNewProjectModal();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ إضافة تطبيق / مشروع جديد</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right / End: Clean, uncluttered actions */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenVoiceCommand && (
            <button
              onClick={onOpenVoiceCommand}
              title="أمر صوتي لهيباتيا (Voice Command)"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">أمر صوتي</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            title="الإعدادات والربط السحابي"
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
