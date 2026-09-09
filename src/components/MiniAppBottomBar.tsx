import React from 'react';
import { 
  Bot, 
  Smartphone, 
  FileCheck2, 
  Code2, 
  Menu,
  Sparkles
} from 'lucide-react';
import { TabType } from '../types';

interface MiniAppBottomBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenMore: () => void;
  isMoreOpen?: boolean;
  projectsCount?: number;
  contractsCount?: number;
}

export const MiniAppBottomBar: React.FC<MiniAppBottomBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenMore,
  isMoreOpen = false,
  projectsCount = 8,
  contractsCount = 3,
}) => {
  const isMoreTab = ['database', 'tools', 'mashweer_emails', 'tasks', 'settings'].includes(currentTab);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 shadow-2xl safe-area-pb">
      <div className="max-w-md sm:max-w-lg mx-auto flex items-center justify-between px-2 py-1.5 relative">
        
        {/* 1. Projects Tab */}
        <button
          onClick={() => onSelectTab('projects')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            currentTab === 'projects'
              ? 'text-teal-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Smartphone className={`w-5 h-5 transition-transform ${currentTab === 'projects' ? 'stroke-[2.5px] scale-110' : 'stroke-[1.8px]'}`} />
            {projectsCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.1 rounded-full bg-slate-800 border border-slate-700 text-teal-300 font-mono font-bold text-[9px] min-w-[14px] text-center">
                {projectsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 whitespace-nowrap">المشاريع</span>
          {currentTab === 'projects' && (
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-0.5"></span>
          )}
        </button>

        {/* 2. Contracts & Deliverables Tab */}
        <button
          onClick={() => onSelectTab('contracts')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            currentTab === 'contracts'
              ? 'text-teal-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <FileCheck2 className={`w-5 h-5 transition-transform ${currentTab === 'contracts' ? 'stroke-[2.5px] scale-110' : 'stroke-[1.8px]'}`} />
            <span className="absolute -top-1 -right-2 px-1 py-0.1 rounded-full bg-teal-950 border border-teal-800 text-teal-300 font-mono font-bold text-[9px] min-w-[14px] text-center">
              {contractsCount}
            </span>
          </div>
          <span className="text-[10px] mt-1 whitespace-nowrap">العقود</span>
          {currentTab === 'contracts' && (
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-0.5"></span>
          )}
        </button>

        {/* 3. CENTER BUTTON: Sculpted Curved Circular Chat FAB */}
        <div className="flex-1 flex flex-col items-center justify-center relative -top-3.5 z-20">
          <button
            onClick={() => onSelectTab('chat')}
            aria-label="العودة للشات الذكي مع هيباتيا"
            className={`w-14 h-14 rounded-full p-0.5 transition-all transform active:scale-95 shadow-xl ${
              currentTab === 'chat'
                ? 'bg-gradient-to-tr from-teal-400 via-cyan-300 to-teal-500 ring-4 ring-teal-500/30 scale-105'
                : 'bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-500 hover:scale-105'
            }`}
          >
            <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-teal-400 relative overflow-hidden group">
              {/* Radial glow highlight */}
              <div className="absolute inset-0 bg-gradient-to-b from-teal-500/20 to-transparent opacity-60"></div>
              
              <Bot className={`w-6 h-6 z-10 transition-transform ${currentTab === 'chat' ? 'text-teal-300 scale-110' : 'text-teal-400'}`} />
              <span className="text-[9px] font-black z-10 text-teal-300 -mt-0.5 font-sans">
                هيباتيا
              </span>
            </div>
          </button>
          <span className={`text-[10px] mt-1 font-bold whitespace-nowrap ${currentTab === 'chat' ? 'text-teal-300' : 'text-slate-400'}`}>
            الشات
          </span>
        </div>

        {/* 4. Code & Architecture Tab */}
        <button
          onClick={() => onSelectTab('code')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            currentTab === 'code'
              ? 'text-teal-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Code2 className={`w-5 h-5 transition-transform ${currentTab === 'code' ? 'stroke-[2.5px] scale-110' : 'stroke-[1.8px]'}`} />
          </div>
          <span className="text-[10px] mt-1 whitespace-nowrap">الأكواد</span>
          {currentTab === 'code' && (
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-0.5"></span>
          )}
        </button>

        {/* 5. More Menu / Hamburger Tab */}
        <button
          onClick={onOpenMore}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            isMoreOpen || isMoreTab
              ? 'text-teal-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Menu className={`w-5 h-5 transition-transform ${isMoreOpen || isMoreTab ? 'stroke-[2.5px] scale-110 text-teal-400' : 'stroke-[1.8px]'}`} />
            {isMoreTab && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            )}
          </div>
          <span className="text-[10px] mt-1 whitespace-nowrap">المزيد ☰</span>
          {(isMoreOpen || isMoreTab) && (
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-0.5"></span>
          )}
        </button>

      </div>
    </nav>
  );
};
