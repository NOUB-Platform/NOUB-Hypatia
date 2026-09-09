import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Trash2, 
  Sparkles,
  ExternalLink,
  Layers,
  ArrowDown
} from 'lucide-react';
import { ChatMessage, ProjectItem } from '../types';

interface ChatTabProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onClearChat: () => void;
  activeProject: ProjectItem;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onClearChat,
  activeProject,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showModelDetails, setShowModelDetails] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const quickActionChips = [
    `ما هي خطة استلام وفحص تطبيقات مشاوير (فور بي، وكالة WeKaLa، دارو)؟`,
    `كيف أحجز 5 إيميلات رسمية لـ @mashweer.com.eg مجاناً بدون أي اشتراك؟`,
    `اشرحي لي بالتفصيل كيف يعمل الذكاء الاصطناعي هنا وأي نموذج نستخدم؟`,
    `أين توجد ملفات اللوجوهات والأصول لـ ${activeProject.name} على Drive؟`,
    `استعلم واكتب كويري SQL لجداول ${activeProject.name} في Supabase`,
    `افحصي خطوط الربط ومسار الطوارئ (DR)`,
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle Speech-to-Text (Microphone)
  const toggleVoiceInput = () => {
    if (isRecording) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        // ignore
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('المتصفح لا يدعم التسجيل الصوتي المباشر. يمكنك استخدام لوحة المفاتيح.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = (event: any) => {
        setIsRecording(false);
        if (event?.error === 'not-allowed') {
          showToast('يرجى السماح بصلاحية الميكروفون من إعدادات المتصفح أو الكتابة مباشرة.');
        } else if (event?.error !== 'no-speech') {
          showToast('تعذر التقاط الصوت، يمكنك الكتابة في مربع الرسائل.');
        }
      };
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsRecording(false);
      showToast('يمكنك كتابة رسالتك مباشرة في خانة النص.');
    }
  };

  // Text-to-Speech
  const speakText = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }

      window.speechSynthesis.cancel();
      // Remove markdown chars for cleaner speech
      const cleanedText = text
        .replace(/[*#`_~]/g, '')
        .replace(/https?:\/\/\S+/g, 'رابط');

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.05;

      utterance.onstart = () => setSpeakingId(id);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      window.speechSynthesis.speak(utterance);
    } else {
      showToast('المتصفح لا يدعم قراءة النصوص بالصوت.');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const msg = inputText.trim();
    setInputText('');
    await onSendMessage(msg);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-3xl mx-auto bg-[#182640] rounded-3xl border border-slate-700/80 overflow-hidden shadow-2xl relative">
      {/* Toast Notification for in-app alerts */}
      {toastMessage && (
        <div className="absolute top-14 left-4 right-4 z-50 p-2.5 bg-slate-900/95 border border-teal-500/50 text-teal-200 text-xs rounded-2xl shadow-2xl flex items-center justify-between backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white px-2 font-bold">✕</button>
        </div>
      )}

      {/* Chat Sub-Header */}
      <div className="px-4 py-3 bg-[#111b2e] border-b border-slate-700/80 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
            هيباتيا
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">المحادثة مع هيباتيا</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            </div>
            <span className="text-[11px] text-teal-300 font-mono flex items-center gap-1">
              <span className="text-slate-300">المشروع:</span>
              <span className="font-bold underline text-teal-200">{activeProject.name}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* AI Model Badge */}
          <button
            onClick={() => setShowModelDetails(!showModelDetails)}
            className="px-2.5 py-1 rounded-xl bg-teal-950/90 border border-teal-700/80 text-teal-200 text-[10px] font-mono font-bold flex items-center gap-1 hover:bg-teal-900 transition"
            title="انقر لفهم آلية تفكير النموذج وحقن السياق"
          >
            <Sparkles className="w-3 h-3 text-teal-400 animate-spin" />
            <span>Gemini 3.8 Flash</span>
          </button>

          {/* Drive Assets Badge */}
          {activeProject.driveAssets && activeProject.driveAssets.length > 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-[10px] font-mono font-bold hidden sm:inline-block" title="مسارات Google Drive محقونة في السياق">
              Drive ({activeProject.driveAssets.length})
            </span>
          )}

          {/* Reference Chats Badge */}
          {activeProject.referenceChats && activeProject.referenceChats.length > 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-purple-950/80 border border-purple-800/80 text-purple-200 text-[10px] font-mono font-bold hidden sm:inline-block" title="مراجع المحادثات السابقة محقونة">
              AI Refs ({activeProject.referenceChats.length})
            </span>
          )}

          {activeProject.figmaUrl && (
            <a
              href={activeProject.figmaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-200 text-[10px] font-semibold flex items-center gap-1 transition"
            >
              <ExternalLink className="w-3 h-3" />
              <span>فيجما</span>
            </a>
          )}
          <button
            onClick={onClearChat}
            title="مسح المحادثة"
            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Model Transparency Info Modal / Dropdown */}
      {showModelDetails && (
        <div className="p-3.5 bg-[#0f172a] border-b border-teal-700/60 text-xs text-slate-200 animate-in slide-in-from-top-2 duration-150 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-teal-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>كيف تفكر هيباتيا ومصدر الإجابات الهندسية؟</span>
            </span>
            <button
              onClick={() => setShowModelDetails(false)}
              className="text-[10px] text-slate-400 hover:text-slate-200 px-1 py-0.5"
            >
              إغلاق ✕
            </button>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-200">
            • <strong className="text-white">النموذج التقني:</strong> <code className="text-teal-300 bg-[#162238] px-1.5 py-0.5 rounded font-mono">gemini-3.8-flash</code> من Google AI Studio عبر SDK الرسمي.
            <br />
            • <strong className="text-white">تفكير توليدي مباشر:</strong> يتم تحليل طلبك وحقن سياق المشروع النشط وأصول Google Drive وتفاصيل الـ APIs تلقائياً في كل استدعاء لتوفير حلول برمجية فورية تلائم بيئة عملك.
          </p>
        </div>
      )}

      {/* Quick Action Prompts Bar (No Horizontal Scrolling) */}
      <div className="px-4 py-2 bg-[#121c30] border-b border-slate-700/60 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => setShowQuickPrompts(!showQuickPrompts)}
          className="text-xs text-teal-300 font-bold flex items-center gap-1.5 hover:text-teal-200 transition py-0.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>{showQuickPrompts ? 'إخفاء اقتراحات الأوامر ▲' : '💡 أوامر واستفسارات جاهزة ▼'}</span>
        </button>
        <span className="text-[10px] text-slate-400 font-mono">
          {quickActionChips.length} أسئلة مقترحة
        </span>
      </div>

      {showQuickPrompts && (
        <div className="p-3 bg-[#0d1627] border-b border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in shrink-0">
          {quickActionChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onSendMessage(chip);
                setShowQuickPrompts(false);
              }}
              className="p-2.5 text-right rounded-xl bg-[#15233c] border border-slate-700/80 hover:border-teal-400/80 text-xs text-slate-200 hover:text-white transition active:scale-98 shadow-sm flex items-start gap-2"
            >
              <span className="text-teal-400 font-bold shrink-0 mt-0.5">•</span>
              <span className="leading-snug">{chip}</span>
            </button>
          ))}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#131f36]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-300">
                <span className="font-semibold">{isUser ? 'أنت' : 'هيباتيا'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`relative max-w-[88%] sm:max-w-[82%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-medium rounded-br-none shadow-md shadow-teal-950/30'
                    : 'bg-[#1d2c49] border border-slate-700/80 text-slate-100 rounded-bl-none shadow-lg'
                }`}
              >
                {/* Message Content with line breaks */}
                <div className="whitespace-pre-wrap font-sans selection:bg-slate-700">
                  {msg.content}
                </div>

                {/* Audio & Copy Controls for Hypatia replies */}
                {!isUser && (
                  <div className="mt-3 pt-2 border-t border-slate-700/70 flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => speakText(msg.id, msg.content)}
                        className={`p-1.5 rounded-lg hover:bg-slate-700/60 hover:text-white transition flex items-center gap-1 text-[11px] ${
                          speakingId === msg.id ? 'text-teal-300 font-bold' : ''
                        }`}
                        title="استماع صوتي للرد"
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                            <span>إيقاف الصوت</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-teal-300" />
                            <span>قراءة بالصوت</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-700/60 hover:text-white transition flex items-center gap-1 text-[11px]"
                      title="نسخ النص"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-teal-300" />
                          <span className="text-teal-300 font-bold">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-300" />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex flex-col items-start animate-in fade-in">
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-300">
              <span className="font-bold text-teal-300">هيباتيا</span>
              <span>•</span>
              <span className="text-teal-300">جاري المعالجة والتحليل...</span>
            </div>
            <div className="bg-[#1d2c49] border border-slate-700 rounded-2xl rounded-bl-none p-3.5 flex items-center gap-2 shadow-md">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="text-xs text-slate-200 font-medium mr-1">هيباتيا تحلل المعطيات...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Footer */}
      <div className="p-3 bg-[#111b2e] border-t border-slate-700/80 shrink-0">
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-2xl transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-900/50'
                : 'bg-[#182640] text-slate-200 hover:text-white border border-slate-700 hover:border-teal-400/60'
            }`}
            title={isRecording ? 'إيقاف التسجيل الصوتي' : 'تحدث بالصوت'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-teal-300" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isRecording
                ? 'جاري الاستماع لصوتك الآن... تحدث'
                : `اكتب سؤالك أو أمرك لـ ${activeProject.name}...`
            }
            className="flex-1 bg-[#0d1524] border border-slate-700 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition font-sans"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:opacity-40 text-slate-950 font-bold rounded-2xl transition shadow-lg shadow-teal-950/50 active:scale-95 shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
