import React, { useState } from 'react';
import { 
  Smartphone, 
  ExternalLink, 
  Plus, 
  FileCode2, 
  MessageSquare, 
  Layers, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download,
  Filter,
  Trash2,
  FolderGit2,
  Bot,
  MessageSquareQuote,
  Lightbulb,
  FolderOpen
} from 'lucide-react';
import { ProjectItem, ApkItem } from '../types';
import { ProjectKnowledgeSettingsModal } from './ProjectKnowledgeSettingsModal';

interface ProjectsTabProps {
  projects: ProjectItem[];
  activeProject: ProjectItem;
  onSelectActiveProject: (project: ProjectItem) => void;
  onUpdateProject: (updated: ProjectItem) => void;
  onAddNewProject: (newProject: ProjectItem) => void;
  onNavigateToChatWithPrompt: (prompt: string, project: ProjectItem) => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  activeProject,
  onSelectActiveProject,
  onUpdateProject,
  onAddNewProject,
  onNavigateToChatWithPrompt,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'نوب NOUB' | 'مشاوير' | 'مالي وتداول' | 'مستقل' | 'خاص'>('all');
  
  // Modals state
  const [editingFigmaProject, setEditingFigmaProject] = useState<ProjectItem | null>(null);
  const [newFigmaUrl, setNewFigmaUrl] = useState('');

  const [addingApkProject, setAddingApkProject] = useState<ProjectItem | null>(null);
  const [newApkVersion, setNewApkVersion] = useState('');
  const [newApkBuild, setNewApkBuild] = useState('');
  const [newApkFileName, setNewApkFileName] = useState('');
  const [newApkFileSize, setNewApkFileSize] = useState('');
  const [newApkNotes, setNewApkNotes] = useState('');

  // Knowledge & Drive Settings Modal
  const [knowledgeProject, setKnowledgeProject] = useState<ProjectItem | null>(null);

  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjCode, setNewProjCode] = useState('');
  const [newProjCat, setNewProjCat] = useState<'نوب NOUB' | 'مشاوير' | 'مالي وتداول' | 'مستقل' | 'خاص'>('نوب NOUB');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjFigma, setNewProjFigma] = useState('');

  const filteredProjects = projects.filter((p) => {
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  });

  // Save Figma Link
  const handleSaveFigma = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFigmaProject) return;
    const updated: ProjectItem = {
      ...editingFigmaProject,
      figmaUrl: newFigmaUrl.trim(),
    };
    onUpdateProject(updated);
    setEditingFigmaProject(null);
  };

  // Add APK File
  const handleSaveApk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingApkProject || !newApkVersion) return;

    const newApk: ApkItem = {
      id: `apk-${Date.now()}`,
      version: newApkVersion.trim(),
      buildNumber: Number(newApkBuild) || 1,
      fileName: newApkFileName.trim() || `${addingApkProject.code}_${newApkVersion}.apk`,
      fileSize: newApkFileSize.trim() || '35 MB',
      uploadedAt: 'اليوم',
      notes: newApkNotes.trim() || 'تم استلام النسخة للفحص',
      status: 'جاهز للاختبار',
    };

    const updated: ProjectItem = {
      ...addingApkProject,
      apkFiles: [newApk, ...addingApkProject.apkFiles],
    };

    onUpdateProject(updated);
    setAddingApkProject(null);
    setNewApkVersion('');
    setNewApkBuild('');
    setNewApkFileName('');
    setNewApkFileSize('');
    setNewApkNotes('');
  };

  // Create New Project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: newProjName.trim(),
      code: newProjCode.trim().toUpperCase() || 'APP',
      category: newProjCat,
      description: newProjDesc.trim() || 'تطبيق جديد قيد المتابعة والتطوير',
      status: 'قيد التطوير',
      figmaUrl: newProjFigma.trim() || undefined,
      apkFiles: [],
      notes: 'تم إنشاء المشروع حديثاً.',
    };

    onAddNewProject(newProject);
    setIsAddProjectModalOpen(false);
    setNewProjName('');
    setNewProjCode('');
    setNewProjDesc('');
    setNewProjFigma('');
  };

  return (
    <div className="space-y-5 pb-16 max-w-4xl mx-auto">
      {/* Top Bar: Title & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#182640] p-4 rounded-3xl border border-slate-700/80 shadow-xl">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-teal-300" />
            <span>تطبيقاتي ومشاريعي ({projects.length})</span>
          </h1>
          <p className="text-xs text-slate-200 mt-0.5">
            متابعة حالة كل تطبيق، روابط الفيجما، ملفات الـ APK، والمهام مع هيباتيا
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#10192a] p-1 rounded-2xl border border-slate-700 text-xs flex-wrap">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-xl transition font-medium ${
                filterCategory === 'all'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              الكل ({projects.length})
            </button>
            <button
              onClick={() => setFilterCategory('نوب NOUB')}
              className={`px-3 py-1 rounded-xl transition font-medium ${
                filterCategory === 'نوب NOUB'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              منظومة نوب NOUB
            </button>
            <button
              onClick={() => setFilterCategory('مالي وتداول')}
              className={`px-3 py-1 rounded-xl transition font-medium ${
                filterCategory === 'مالي وتداول'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              تداول وغرف عمليات
            </button>
            <button
              onClick={() => setFilterCategory('مشاوير')}
              className={`px-3 py-1 rounded-xl transition font-medium ${
                filterCategory === 'مشاوير'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              منصات النقل (4B، وكالة، دارو)
            </button>
          </div>

          <button
            onClick={() => setIsAddProjectModalOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-teal-950/40 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مشروع جديد</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((p) => {
          const isActive = p.id === activeProject.id;

          return (
            <div
              key={p.id}
              className={`rounded-3xl p-5 transition-all border shadow-lg ${
                isActive
                  ? 'bg-[#1c2d4a] border-teal-500/90 ring-1 ring-teal-500/40'
                  : 'bg-[#182640] border-slate-700/80 hover:border-slate-600'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-white">{p.name}</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-[#10192a] text-teal-300 border border-slate-700">
                      {p.code}
                    </span>
                    {p.category === 'مشاوير' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700/80 font-bold">
                        منصة مشاوير
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-200 mt-1.5 leading-relaxed line-clamp-2">
                    {p.description}
                  </p>
                </div>

                <button
                  onClick={() => onSelectActiveProject(p)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition shrink-0 ${
                    isActive
                      ? 'bg-teal-400 text-slate-950'
                      : 'bg-[#10192a] text-slate-200 border border-slate-700 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {isActive ? 'التطبيق النشط' : 'تحديد كنطاق عمل'}
                </button>
              </div>

              {/* Status & Details */}
              <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  <span className="font-medium">{p.status}</span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  {p.apkFiles.length} ملفات APK مسجلة
                </div>
              </div>

              {/* Figma Link Section */}
              <div className="mt-3 p-3 rounded-2xl bg-[#10192a] border border-slate-700/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <div className="p-1.5 rounded-lg bg-purple-950/70 text-purple-300">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] text-slate-300 block">رابط فيجما (Figma):</span>
                    {p.figmaUrl ? (
                      <a
                        href={p.figmaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-300 hover:text-purple-200 hover:underline truncate block"
                      >
                        {p.figmaUrl}
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">لم يتم إدخال رابط بعد</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEditingFigmaProject(p);
                    setNewFigmaUrl(p.figmaUrl || '');
                  }}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs shrink-0"
                  title="تعديل رابط فيجما"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* APK Files Section */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-teal-300" />
                    <span>ملفات الـ APK المسجلة:</span>
                  </span>
                  <button
                    onClick={() => setAddingApkProject(p)}
                    className="text-[11px] text-teal-300 hover:text-teal-200 flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>تسجيل APK وصلك</span>
                  </button>
                </div>

                {p.apkFiles.length === 0 ? (
                  <div className="text-center py-2.5 bg-[#10192a]/60 rounded-xl border border-dashed border-slate-700 text-[11px] text-slate-400">
                    لا يوجد ملفات APK مسجلة بعد لهذا التطبيق
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {p.apkFiles.slice(0, 2).map((apk) => (
                      <div
                        key={apk.id}
                        className="p-2.5 bg-[#10192a] rounded-xl border border-slate-700 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-200 flex items-center gap-2">
                            <span className="font-mono text-teal-300">{apk.version}</span>
                            <span className="text-[10px] text-slate-300 font-mono">({apk.fileSize})</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-200">
                              {apk.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">{apk.notes}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{apk.uploadedAt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Google Drive & Reference Chats Knowledge Section */}
              <div className="mt-3 p-3 rounded-2xl bg-[#10192a] border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                    <FolderGit2 className="w-3.5 h-3.5 text-teal-300" />
                    <span>سياق المعرفة ومسارات Drive:</span>
                  </div>
                  <button
                    onClick={() => setKnowledgeProject(p)}
                    className="px-2.5 py-1 bg-teal-950/80 hover:bg-teal-900 border border-teal-700/80 text-teal-300 rounded-xl text-[11px] font-bold transition flex items-center gap-1"
                  >
                    <FolderOpen className="w-3 h-3" />
                    <span>إدارة المسارات والمراجع</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-[#182640] border border-slate-700 flex items-center justify-between">
                    <span className="text-slate-300">مسارات Drive:</span>
                    <span className="font-mono font-bold text-teal-300">
                      {p.driveAssets?.length || 0} مجلدات
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#182640] border border-slate-700 flex items-center justify-between">
                    <span className="text-slate-300">محادثات AI سابقة:</span>
                    <span className="font-mono font-bold text-purple-300">
                      {p.referenceChats?.length || 0} جلسات
                    </span>
                  </div>
                </div>

                {/* Previews if available */}
                {p.driveAssets && p.driveAssets.length > 0 && (
                  <div className="text-[10px] text-slate-200 font-mono bg-[#182640] p-1.5 rounded-lg border border-slate-700 truncate">
                    <span className="text-teal-300 font-bold">Drive: </span>
                    {p.driveAssets[0].name}
                  </div>
                )}
                {p.referenceChats && p.referenceChats.length > 0 && (
                  <div className="text-[10px] text-slate-200 bg-[#182640] p-1.5 rounded-lg border border-slate-700 truncate">
                    <span className="text-purple-300 font-bold">جلسة {p.referenceChats[0].platform}: </span>
                    {p.referenceChats[0].title}
                  </div>
                )}
              </div>

              {/* Action: Ask Hypatia */}
              <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between">
                <button
                  onClick={() =>
                    onNavigateToChatWithPrompt(
                      `ما هي آخر حالة لتطبيق ${p.name}؟ راجعي مسارات الـ Drive ومراجع المحادثات السابقة الموثقة واقترحي الخطوة الهندسية التالية.`,
                      p
                    )
                  }
                  className="w-full py-2 rounded-xl bg-[#10192a] hover:bg-slate-800 border border-slate-700 hover:border-teal-500/50 text-xs font-semibold text-slate-200 hover:text-teal-300 transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-teal-300" />
                  <span>اسأل هيباتيا عن هذا المشروع</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Edit Figma Link */}
      {editingFigmaProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-[#182640] border border-slate-700 rounded-3xl w-full max-w-md p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-2">
              تعديل رابط الفيجما لـ {editingFigmaProject.name}
            </h3>
            <p className="text-xs text-slate-200 mb-4">
              الصق رابط ملف أو مشروع الفيجما الرسمي للرجوع إليه بسرعة ومشاركته مع هيباتيا.
            </p>
            <form onSubmit={handleSaveFigma} className="space-y-4">
              <input
                type="url"
                value={newFigmaUrl}
                onChange={(e) => setNewFigmaUrl(e.target.value)}
                placeholder="https://www.figma.com/design/..."
                className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 font-mono"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFigmaProject(null)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 rounded-xl text-xs font-bold"
                >
                  حفظ الرابط
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add APK Record */}
      {addingApkProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-[#182640] border border-slate-700 rounded-3xl w-full max-w-md p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-1">
              تسجيل ملف APK جديد لـ {addingApkProject.name}
            </h3>
            <p className="text-xs text-slate-200 mb-4">
              سجل تفاصيل النسخة التي وصلتك من المطورين أو فريق الـ QA لمتابعتها مع هيباتيا.
            </p>
            <form onSubmit={handleSaveApk} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-200 mb-1">رقم الإصدار (Version):</label>
                <input
                  type="text"
                  value={newApkVersion}
                  onChange={(e) => setNewApkVersion(e.target.value)}
                  placeholder="مثلاً: v1.5.0-beta"
                  required
                  className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-200 mb-1">رقم البناء (Build #):</label>
                  <input
                    type="number"
                    value={newApkBuild}
                    onChange={(e) => setNewApkBuild(e.target.value)}
                    placeholder="150"
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-200 mb-1">حجم الملف:</label>
                  <input
                    type="text"
                    value={newApkFileSize}
                    onChange={(e) => setNewApkFileSize(e.target.value)}
                    placeholder="36 MB"
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-200 mb-1">ملاحظات النسخة أو الفحص:</label>
                <textarea
                  value={newApkNotes}
                  onChange={(e) => setNewApkNotes(e.target.value)}
                  placeholder="مثال: تم إصلاح شاشة الخريطة، وجاري اختبار شاشة الدفع..."
                  rows={3}
                  className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddingApkProject(null)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 rounded-xl text-xs font-bold"
                >
                  تسجيل الـ APK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create New Project */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-[#182640] border border-slate-700 rounded-3xl w-full max-w-md p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-1">إضافة تطبيق أو مشروع جديد</h3>
            <p className="text-xs text-slate-200 mb-4">
              أدخل بيانات مشروعك التاسع أو الجديد لإدارته ومتابعته مع هيباتيا.
            </p>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-200 mb-1">اسم التطبيق / المشروع:</label>
                <input
                  type="text"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="مثلاً: تطبيق كابتن الشحنات"
                  required
                  className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-200 mb-1">رمز المشروع (Code):</label>
                  <input
                    type="text"
                    value={newProjCode}
                    onChange={(e) => setNewProjCode(e.target.value)}
                    placeholder="CARGO"
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-200 mb-1">التصنيف:</label>
                  <select
                    value={newProjCat}
                    onChange={(e: any) => setNewProjCat(e.target.value)}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                  >
                    <option value="مشاوير">منصة مشاوير</option>
                    <option value="مستقل">مشروع مستقل</option>
                    <option value="خاص">مشروع خاص</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-200 mb-1">وصف التطبيق:</label>
                <textarea
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="اكتب وظيفة التطبيق وأهدافه..."
                  rows={2}
                  className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-200 mb-1">رابط فيجما (اختياري):</label>
                <input
                  type="url"
                  value={newProjFigma}
                  onChange={(e) => setNewProjFigma(e.target.value)}
                  placeholder="https://www.figma.com/..."
                  className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 font-mono"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProjectModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 rounded-xl text-xs font-bold"
                >
                  إضافة المشروع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal: Knowledge & Drive Assets Settings */}
      {knowledgeProject && (
        <ProjectKnowledgeSettingsModal
          project={knowledgeProject}
          isOpen={!!knowledgeProject}
          onClose={() => setKnowledgeProject(null)}
          onUpdateProject={(updated) => {
            onUpdateProject(updated);
            setKnowledgeProject(updated);
          }}
          onAskHypatia={(prompt) => {
            setKnowledgeProject(null);
            onNavigateToChatWithPrompt(prompt, knowledgeProject);
          }}
        />
      )}
    </div>
  );
};
