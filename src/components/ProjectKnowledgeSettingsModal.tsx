import React, { useState } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Plus, 
  Trash2, 
  FolderPlus, 
  MessageSquareQuote, 
  Lightbulb, 
  Sparkles,
  Link,
  Bot,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Copy,
  Check
} from 'lucide-react';
import { ProjectItem, DriveAssetItem, ReferenceChatItem } from '../types';

interface ProjectKnowledgeSettingsModalProps {
  project: ProjectItem;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProject: (updated: ProjectItem) => void;
  onAskHypatia: (prompt: string) => void;
}

export const ProjectKnowledgeSettingsModal: React.FC<ProjectKnowledgeSettingsModalProps> = ({
  project,
  isOpen,
  onClose,
  onUpdateProject,
  onAskHypatia,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'drive' | 'chats' | 'hints'>('drive');

  // State for adding a new Drive Asset
  const [newDriveName, setNewDriveName] = useState('');
  const [newDrivePath, setNewDrivePath] = useState('');
  const [newDriveType, setNewDriveType] = useState<DriveAssetItem['type']>('logos');
  const [newDriveNotes, setNewDriveNotes] = useState('');

  // State for adding a Reference Chat
  const [newChatTitle, setNewChatTitle] = useState('');
  const [newChatPlatform, setNewChatPlatform] = useState<ReferenceChatItem['platform']>('Claude');
  const [newChatUrl, setNewChatUrl] = useState('');
  const [newChatTakeaways, setNewChatTakeaways] = useState('');
  const [newChatRelevance, setNewChatRelevance] = useState('');

  // State for adding a Context Hint
  const [newHintText, setNewHintText] = useState('');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1. Add Drive Asset
  const handleAddDriveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriveName.trim() || !newDrivePath.trim()) return;

    const newAsset: DriveAssetItem = {
      id: `drive-${Date.now()}`,
      name: newDriveName.trim(),
      pathOrUrl: newDrivePath.trim(),
      type: newDriveType,
      notes: newDriveNotes.trim(),
      updatedAt: new Date().toISOString().split('T')[0],
    };

    const currentAssets = project.driveAssets || [];
    onUpdateProject({
      ...project,
      driveAssets: [newAsset, ...currentAssets],
    });

    setNewDriveName('');
    setNewDrivePath('');
    setNewDriveNotes('');
  };

  // Delete Drive Asset
  const handleDeleteDriveAsset = (assetId: string) => {
    const currentAssets = project.driveAssets || [];
    onUpdateProject({
      ...project,
      driveAssets: currentAssets.filter((a) => a.id !== assetId),
    });
  };

  // 2. Add Reference Chat
  const handleAddReferenceChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatTitle.trim() || !newChatUrl.trim()) return;

    const newChat: ReferenceChatItem = {
      id: `ref-chat-${Date.now()}`,
      title: newChatTitle.trim(),
      platform: newChatPlatform,
      url: newChatUrl.trim(),
      keyTakeaways: newChatTakeaways.trim() || 'لا توجد ملاحظات تفصيلية مسجلة.',
      relevanceToProject: newChatRelevance.trim() || 'مرجع فني واستشاري لنظام المشروع.',
      dateAdded: new Date().toISOString().split('T')[0],
    };

    const currentChats = project.referenceChats || [];
    onUpdateProject({
      ...project,
      referenceChats: [newChat, ...currentChats],
    });

    setNewChatTitle('');
    setNewChatUrl('');
    setNewChatTakeaways('');
    setNewChatRelevance('');
  };

  // Delete Reference Chat
  const handleDeleteReferenceChat = (chatId: string) => {
    const currentChats = project.referenceChats || [];
    onUpdateProject({
      ...project,
      referenceChats: currentChats.filter((c) => c.id !== chatId),
    });
  };

  // 3. Add Context Hint
  const handleAddHint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHintText.trim()) return;

    const currentHints = project.contextHints || [];
    onUpdateProject({
      ...project,
      contextHints: [...currentHints, newHintText.trim()],
    });

    setNewHintText('');
  };

  // Delete Context Hint
  const handleDeleteHint = (index: number) => {
    const currentHints = project.contextHints || [];
    onUpdateProject({
      ...project,
      contextHints: currentHints.filter((_, idx) => idx !== index),
    });
  };

  const driveAssets = project.driveAssets || [];
  const referenceChats = project.referenceChats || [];
  const contextHints = project.contextHints || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#182640] border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-700/80 flex items-start justify-between gap-3 bg-[#111b2e]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-teal-300" />
                <span>إعدادات المسارات ومراجع المعرفة: {project.name}</span>
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-[#182640] border border-slate-700 text-teal-300">
                {project.code}
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1">
              حدد مسارات Google Drive للملفات واللوجوهات، وسجل روابط محادثاتك السابقة (Claude / ChatGPT) ليقرأها النموذج تلقائياً بدون تكرار الشرح.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex border-b border-slate-700/80 bg-[#10192a] px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveSubTab('drive')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeSubTab === 'drive'
                ? 'border-teal-400 text-teal-300 font-bold'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>مسارات Google Drive والأصول ({driveAssets.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('chats')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeSubTab === 'chats'
                ? 'border-teal-400 text-teal-300 font-bold'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>روابط المحادثات السابقة ومراجع AI ({referenceChats.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('hints')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeSubTab === 'hints'
                ? 'border-teal-400 text-teal-300 font-bold'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>ملاحظات سياقية دائمة ({contextHints.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          
          {/* 1. GOOGLE DRIVE ASSETS SUB-TAB */}
          {activeSubTab === 'drive' && (
            <div className="space-y-4">
              <div className="bg-[#111b2e] p-3.5 rounded-2xl border border-slate-700 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5">
                <FolderPlus className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block mb-0.5">توجيه هيباتيا لمسارات Drive الدقيقة:</span>
                  ضع هنا روابط مجلدات Google Drive للوجوهات، تصاميم الواجهات، أو ملفات الـ APK. في كل محادثة، ستعرف هيباتيا مكان كل ملف بدقة بدون أن تسألك.
                </div>
              </div>

              {/* Form: Add Drive Asset */}
              <form onSubmit={handleAddDriveAsset} className="bg-[#111b2e] p-4 rounded-2xl border border-slate-700 space-y-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-teal-300" />
                  <span>إضافة مسار أو مجلد جديد على Google Drive</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-200 mb-1">اسم المجلد / الأصل:</label>
                    <input
                      type="text"
                      value={newDriveName}
                      onChange={(e) => setNewDriveName(e.target.value)}
                      placeholder="مثلاً: مجلد اللوجوهات والشعارات المفتوحة SVG"
                      required
                      className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-200 mb-1">نوع المحتوى:</label>
                    <select
                      value={newDriveType}
                      onChange={(e: any) => setNewDriveType(e.target.value)}
                      className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                    >
                      <option value="logos">شعارات وأيقونات (Logos)</option>
                      <option value="design">تصاميم وشاشات (UI/Design)</option>
                      <option value="apk">حزم وملفات APK</option>
                      <option value="docs">وثائق ومواصفات (Docs)</option>
                      <option value="source_code">كود مصدري (Code)</option>
                      <option value="other">أخرى (Other)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-200 mb-1">رابط Google Drive أو المسار الدقيق:</label>
                  <input
                    type="text"
                    value={newDrivePath}
                    onChange={(e) => setNewDrivePath(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/... أو NOUB/Assets/Logos"
                    required
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-200 mb-1">ملاحظات توضيحية لما بداخل المجلد (لهيباتيا):</label>
                  <input
                    type="text"
                    value={newDriveNotes}
                    onChange={(e) => setNewDriveNotes(e.target.value)}
                    placeholder="مثال: يحتوي على اللوجو الأبيض والأسود والملف المصدري Illustrator"
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>حفظ مسار المجلد</span>
                  </button>
                </div>
              </form>

              {/* List of Registered Drive Folders */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-200 block">
                  المسارات الموثقة حالياً ({driveAssets.length}):
                </span>

                {driveAssets.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-[#111b2e]/60 border border-dashed border-slate-700 text-center text-xs text-slate-400">
                    لم تقم بإضافة مسارات Google Drive لهذا المشروع بعد.
                  </div>
                ) : (
                  driveAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-3.5 bg-[#111b2e] rounded-2xl border border-slate-700 flex flex-col gap-2 hover:border-slate-600 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-teal-950 text-teal-300 border border-teal-700/80 font-bold uppercase">
                            {asset.type}
                          </span>
                          <span className="text-xs font-bold text-white">{asset.name}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleCopy(asset.pathOrUrl, asset.id)}
                            className="p-1 rounded-lg bg-slate-800 text-slate-200 hover:text-white text-[10px] flex items-center gap-1"
                            title="نسخ المسار"
                          >
                            {copiedId === asset.id ? <Check className="w-3 h-3 text-teal-300" /> : <Copy className="w-3 h-3" />}
                          </button>
                          {asset.pathOrUrl.startsWith('http') && (
                            <a
                              href={asset.pathOrUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
                              title="فتح الرابط"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteDriveAsset(asset.id)}
                            className="p-1 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-950"
                            title="حذف المسار"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="font-mono text-[11px] text-teal-300 bg-[#0e1626] px-2.5 py-1.5 rounded-xl border border-slate-700 truncate">
                        {asset.pathOrUrl}
                      </div>

                      {asset.notes && (
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          <span className="text-teal-300 font-semibold">المحتوى: </span>
                          {asset.notes}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 2. REFERENCE CHATS & EXTERNAL THREADS SUB-TAB */}
          {activeSubTab === 'chats' && (
            <div className="space-y-4">
              <div className="bg-[#111b2e] p-3.5 rounded-2xl border border-slate-700 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5">
                <Bot className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block mb-0.5">تكامل المحادثات السابقة (Claude / ChatGPT / Perplexity):</span>
                  عندما تناقش فكرة مع كلود أو شات جي بي تي وتصل لقرارات، ضع رابط المحادثة وخلاصتها هنا. هيباتيا ستعتمد تلك القرارات تلقائياً في سياق المشروع دون الحاجة لإعادة الشرح أو نسخ النص كل مرة.
                </div>
              </div>

              {/* Form: Add Reference Chat */}
              <form onSubmit={handleAddReferenceChat} className="bg-[#111b2e] p-4 rounded-2xl border border-slate-700 space-y-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-purple-300" />
                  <span>توثيق جلسة / محادثة سابقة</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-200 mb-1">عنوان الجلسة / موضوعها:</label>
                    <input
                      type="text"
                      value={newChatTitle}
                      onChange={(e) => setNewChatTitle(e.target.value)}
                      placeholder="مثال: جلسة هيكلة خوارزمية الترتيب والـ WebSockets"
                      required
                      className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-200 mb-1">منصة الذكاء الاصطناعي:</label>
                    <select
                      value={newChatPlatform}
                      onChange={(e: any) => setNewChatPlatform(e.target.value)}
                      className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="Claude">Claude (Anthropic)</option>
                      <option value="ChatGPT">ChatGPT (OpenAI)</option>
                      <option value="Gemini">Google Gemini</option>
                      <option value="Perplexity">Perplexity AI</option>
                      <option value="Other">منصة أخرى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-200 mb-1">رابط المشاركة للمحادثة (Share URL):</label>
                  <input
                    type="url"
                    value={newChatUrl}
                    onChange={(e) => setNewChatUrl(e.target.value)}
                    placeholder="https://claude.ai/chat/share-... أو https://chatgpt.com/share/..."
                    required
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-200 mb-1">القرارات والنقاط المتفق عليها (Key Takeaways):</label>
                  <textarea
                    value={newChatTakeaways}
                    onChange={(e) => setNewChatTakeaways(e.target.value)}
                    placeholder="ما الذي استقريت عليه في تلك المحادثة؟ (مثال: تم الاتفاق على استخدام Redis للتخزين المؤقت وحساب الفوارق بالثواني، وفصل الإحصائيات عن جدول المستخدمين)"
                    rows={2}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-200 mb-1">كيف تستفيد هيباتيا من هذه المحادثة؟ (Relevance):</label>
                  <input
                    type="text"
                    value={newChatRelevance}
                    onChange={(e) => setNewChatRelevance(e.target.value)}
                    placeholder="مثال: اعتمدي هذه القواعد عند كتابة دوال الـ Backend دون فتح نقاش جديد."
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>حفظ مرجع المحادثة</span>
                  </button>
                </div>
              </form>

              {/* List of Registered Reference Chats */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-200 block">
                  المحادثات والجلسات المعتمدة ({referenceChats.length}):
                </span>

                {referenceChats.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-[#111b2e]/60 border border-dashed border-slate-700 text-center text-xs text-slate-400">
                    لم تقم بربط أي محادثات سابقة بعد. يمكنك إضافة روابط محادثاتك من Claude أو ChatGPT هنا.
                  </div>
                ) : (
                  referenceChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="p-3.5 bg-[#111b2e] rounded-2xl border border-slate-700 flex flex-col gap-2 hover:border-slate-600 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-950 text-purple-300 border border-purple-700/80">
                            {chat.platform}
                          </span>
                          <span className="text-xs font-bold text-white">{chat.title}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <a
                            href={chat.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
                            title="فتح المحادثة"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            onClick={() =>
                              onAskHypatia(
                                `بناءً على محادثتنا السابقة في ${chat.platform} بعنوان "${chat.title}"، لخصي لي كيفية تطبيق النقاط المتفق عليها في مشروع ${project.name}.`
                              )
                            }
                            className="p-1 rounded-lg bg-slate-800 text-teal-300 hover:bg-teal-950 text-[10px] flex items-center gap-1 font-bold"
                            title="ناقشي هذه الجلسة مع هيباتيا"
                          >
                            <Bot className="w-3 h-3" />
                            <span>استشارة</span>
                          </button>
                          <button
                            onClick={() => handleDeleteReferenceChat(chat.id)}
                            className="p-1 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-950"
                            title="حذف"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-200 bg-[#0e1626] p-2 rounded-xl border border-slate-700 leading-relaxed">
                        <span className="font-bold text-teal-300 block mb-0.5">القرارات المتفق عليها:</span>
                        {chat.keyTakeaways}
                      </div>

                      {chat.relevanceToProject && (
                        <div className="text-[10px] text-slate-300">
                          <span className="text-slate-400 font-semibold">توجيه التنفيذ: </span>
                          {chat.relevanceToProject}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 3. PERMANENT CONTEXT HINTS SUB-TAB */}
          {activeSubTab === 'hints' && (
            <div className="space-y-4">
              <div className="bg-[#111b2e] p-3.5 rounded-2xl border border-slate-700 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block mb-0.5">ملاحظات وقواعد عمل دائمة (Context Hints):</span>
                  أي قاعدة هندسية أو ملاحظة تريد من هيباتيا أن تتذكرها دائماً عند الحديث عن مشروع {project.name} دون أن تضطر لإعادة كتابتها في كل مرة.
                </div>
              </div>

              {/* Form: Add Hint */}
              <form onSubmit={handleAddHint} className="flex gap-2">
                <input
                  type="text"
                  value={newHintText}
                  onChange={(e) => setNewHintText(e.target.value)}
                  placeholder="مثال: قاعدة نوب الرياضية تعتمد نقاط ELO، واللوجوهات كلها موجودة في مجلد Drive المخصص."
                  className="flex-1 bg-[#0e1626] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition shrink-0"
                >
                  إضافة ملاحظة
                </button>
              </form>

              {/* Hints List */}
              <div className="space-y-2">
                {contextHints.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-[#111b2e]/60 border border-dashed border-slate-700 text-center text-xs text-slate-400">
                    لا توجد ملاحظات دائمة مسجلة بعد لهذا المشروع.
                  </div>
                ) : (
                  contextHints.map((hint, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#111b2e] rounded-xl border border-slate-700 flex items-center justify-between gap-2 text-xs text-slate-200"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-amber-300 mt-0.5">•</span>
                        <span>{hint}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteHint(idx)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-700/80 bg-[#111b2e] flex items-center justify-between text-xs">
          <div className="text-slate-200 text-[11px] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
            <span>يتم حقن هذه المسارات والروابط تلقائياً في سياق هيباتيا في كل محادثة.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
