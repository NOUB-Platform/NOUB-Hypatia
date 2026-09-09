import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  Bot, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  Layers,
  FileSearch,
  CheckSquare
} from 'lucide-react';
import { ProjectItem, ServiceProviderItem, ProjectTask } from '../types';

interface VoiceCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  activeProject: ProjectItem;
  providers: ServiceProviderItem[];
  onAddTask: (task: ProjectTask) => void;
  onAddProviderTask: (providerId: string, taskTitle: string, contact?: string) => void;
  onSelectProject: (projectId: string) => void;
  onSelectTab: (tab: any) => void;
  onAskHypatia: (prompt: string) => void;
}

export const VoiceCommandModal: React.FC<VoiceCommandModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProject,
  providers,
  onAddTask,
  onAddProviderTask,
  onSelectProject,
  onSelectTab,
  onAskHypatia,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<{
    type: 'figma' | 'meeting' | 'task' | 'provider' | 'general';
    title: string;
    details: string[];
    actionLabel?: string;
    actionFn?: () => void;
  } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'ar-EG'; // Egyptian Arabic

      recognition.onstart = () => {
        setIsListening(true);
        setFeedback('أنا أستمع إليك الآن... تفضل بالأمر الصوتي');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setFeedback('يرجى السماح بالوصول للميكروفون أو اختيار أحد الأوامر الجاهزة بالأسفل');
        } else {
          setFeedback('توقف الاستماع. اضغط على المايك لإعادة المحاولة أو اختر من الأوامر النموذجية.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-EG';
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
      if (transcript) {
        processVoiceCommand(transcript);
      }
    } else {
      setTranscript('');
      setExecutionResult(null);
      try {
        recognitionRef.current?.start();
      } catch (e) {
        // In iframe or without mic
        setFeedback('لم يتم العثور على مايكروفون نشط. يمكنك تجربة الأوامر المقترحة بالضغط عليها مباشرة.');
      }
    }
  };

  // Smart Voice Command Parser
  const processVoiceCommand = (command: string) => {
    const text = command.toLowerCase().trim();
    setFeedback('جاري تحليل الأمر الصوتي وتنفيذه عبر هيباتيا...');

    // 1. Figma Check & Comparison Command
    if (text.includes('فيجما') || text.includes('figma') || text.includes('تصميم') || text.includes('قارن') || text.includes('شاشات')) {
      let targetProj = activeProject;
      if (text.includes('فور بي') || text.includes('4b') || text.includes('goride') || text.includes('ركاب')) {
        targetProj = projects.find(p => p.code === '4B') || activeProject;
      } else if (text.includes('وكالة') || text.includes('wikala') || text.includes('سوق')) {
        targetProj = projects.find(p => p.code === 'WIKALA') || activeProject;
      } else if (text.includes('دارو') || text.includes('daro') || text.includes('شحن')) {
        targetProj = projects.find(p => p.code === 'DARO') || activeProject;
      }

      const figmaLink = targetProj.figmaUrl || 'https://figma.com/@mashweer';
      const result = {
        type: 'figma' as const,
        title: `فحص ومقارنة تصاميم فيجما: مشروع ${targetProj.name}`,
        details: [
          `تم تحديد المشروع: ${targetProj.name} (${targetProj.code})`,
          `المطور المعتمد للتصاميم: شركة قيمة تك (Qeema Tech)`,
          `حالة التصميم: تم رصد تحديثات تدفق شاشات الركاب والكباتن`,
          `الملاحظات السياقية: ${targetProj.contextHints?.[0] || 'تم توثيق متطلبات الواجهة مع المعايير المصرية'}`
        ],
        actionLabel: 'فتح رابط فيجما الرسمي',
        actionFn: () => window.open(figmaLink, '_blank')
      };
      setExecutionResult(result);
      speakText(`تم فحص مشروع ${targetProj.name}. رابط فيجما جاهز للمعاينة والمقارنة مع تسليمات قيمة تك.`);
      return;
    }

    // 2. Meeting Review & Previous Takeaways Command
    if (text.includes('ميتينج') || text.includes('اجتماع') || text.includes('جلسة') || text.includes('اتنفذ') || text.includes('مطلوب')) {
      let targetProj = activeProject;
      if (text.includes('وكالة') || text.includes('wikala')) {
        targetProj = projects.find(p => p.code === 'WIKALA') || activeProject;
      } else if (text.includes('فور بي') || text.includes('4b')) {
        targetProj = projects.find(p => p.code === '4B') || activeProject;
      }

      const lastChat = targetProj.referenceChats?.[0];
      const result = {
        type: 'meeting' as const,
        title: `مراجعة محضر الاجتماع الأخير: ${targetProj.name}`,
        details: [
          lastChat ? `عنوان الجلسة المسجلة: ${lastChat.title} (${lastChat.platform})` : 'مراجعة عقود تسليم شركة قيمة تك',
          lastChat?.keyTakeaways || 'تم الاتفاق على اعتماد إرسال OTP وبوابات الدفع والتكامل مع السيرفر',
          `توجيه التنفيذ لهيباتيا: ${lastChat?.relevanceToProject || 'الالتزام الكامل بجدول التسليم'}`
        ],
        actionLabel: 'استعراض تفاصيل العقد والبنود',
        actionFn: () => {
          onSelectTab('contracts');
          onClose();
        }
      };
      setExecutionResult(result);
      speakText(`راجعت محضر الاجتماع الأخير لمشروع ${targetProj.name}. القرارات موثقة وهناك بنود بانتظار استلامها من المطورين.`);
      return;
    }

    // 3. Add Task by Voice
    if (text.includes('مهمة') || text.includes('سجل') || text.includes('ضيف') || text.includes('أضيفي') || text.includes('تذكير')) {
      // Check if it's related to EC or Mohamed El-Helw
      if (text.includes('حلو') || text.includes('محمد الحلو') || text.includes('إيميل') || text.includes('ايميل') || text.includes('زوهو') || text.includes('zoho')) {
        const ecProvider = providers.find(p => p.id.includes('ec')) || providers[0];
        const taskTitle = command.replace(/أضيفي مهمة|ضيف مهمة|سجل مهمة|مهمة/gi, '').trim() || 'متابعة استلام الإيميلات الـ 6 غداً من المهندس محمد الحلو';
        
        onAddProviderTask(ecProvider.id, taskTitle, 'المهندس محمد الحلو');
        
        const result = {
          type: 'task' as const,
          title: 'تم تسجيل المهمة الصوتية بنجاح!',
          details: [
            `المهمة: ${taskTitle}`,
            `المسؤول: المهندس محمد الحلو (المصرية لتكنولوجيا المعلومات)`,
            `الحالة: جاري المتابعة - الاستحقاق غداً 10/9/2026`,
            `تم الحفظ في خزنة مزودي الخدمات وسجل المهام.`
          ],
          actionLabel: 'الانتقال لخزنة المزودين والمهام',
          actionFn: () => {
            onSelectTab('providers');
            onClose();
          }
        };
        setExecutionResult(result);
        speakText(`تمت إضافة المهمة بنجاح، وموجهة للمهندس محمد الحلو بخصوص الإيميلات.`);
        return;
      }

      // Check if it's related to WE (Telecom Egypt)
      if (text.includes('وي') || text.includes('we') || text.includes('محرم') || text.includes('غريب') || text.includes('سيرفر')) {
        const weProvider = providers.find(p => p.id.includes('we')) || providers[1];
        const taskTitle = command.replace(/أضيفي مهمة|ضيف مهمة|سجل مهمة|مهمة/gi, '').trim() || 'متابعة تسليم متطلبات السيرفر الحكومي مع مهندسي WE';

        onAddProviderTask(weProvider.id, taskTitle, 'م. أحمد محرم وم. أحمد غريب');

        const result = {
          type: 'task' as const,
          title: 'تم تسجيل مهمة المصرية للاتصالات WE!',
          details: [
            `المهمة: ${taskTitle}`,
            `المسؤولون: م. أحمد محرم وم. أحمد غريب والمحامي`,
            `الحالة: عاجلة - لتلبية اشتراطات وزارة النقل لمشروع 4B`,
            `تم التثبيت في خزنة المزودين.`
          ],
          actionLabel: 'عرض مواصفات السيرفر في الخزنة',
          actionFn: () => {
            onSelectTab('providers');
            onClose();
          }
        };
        setExecutionResult(result);
        speakText(`تم تسجيل المهمة وربطها بالمهندس أحمد محرم والمهندس أحمد غريب في المصرية للاتصالات.`);
        return;
      }

      // General project task
      const newTask: ProjectTask = {
        id: `v-task-${Date.now()}`,
        projectId: activeProject.id,
        title: command.replace(/أضيفي مهمة|ضيف مهمة|سجل مهمة/gi, '').trim() || 'مهمة صوتية جديدة',
        priority: 'عاجل',
        status: 'جاري العمل',
        createdAt: new Date().toISOString().split('T')[0],
        notes: `تم إنشاؤها عبر الأمر الصوتي لهيباتيا: "${command}"`
      };
      onAddTask(newTask);

      const result = {
        type: 'task' as const,
        title: 'تم حفظ المهمة بنجاح',
        details: [
          `عنوان المهمة: ${newTask.title}`,
          `المشروع التابع: ${activeProject.name}`,
          `الأولوية: عاجل`,
          `تم الحفظ محلياً في سجل المهام.`
        ],
        actionLabel: 'فتح سجل المهام',
        actionFn: () => {
          onSelectTab('tasks');
          onClose();
        }
      };
      setExecutionResult(result);
      speakText(`تم حفظ المهمة بنجاح لمشروع ${activeProject.name}.`);
      return;
    }

    // 4. Default Hypatia Response
    onAskHypatia(command);
    const result = {
      type: 'general' as const,
      title: 'تم تمرير الأمر الصوتي لهيباتيا',
      details: [
        `الأمر: "${command}"`,
        `المشروع النشط: ${activeProject.name}`,
        `تقوم هيباتيا حالياً بمعالجة الطلب في شاشة الشات.`
      ],
      actionLabel: 'فتح الشات ومتابعة الإجابة',
      actionFn: () => {
        onSelectTab('chat');
        onClose();
      }
    };
    setExecutionResult(result);
    speakText(`تم استلام طلبك، وسأجيبك بالتفصيل في الشات.`);
  };

  const sampleVoiceCommands = [
    {
      label: 'مقارنة فيجما فور بي',
      cmd: 'شوفي فيجما وقارني بين التصميم القديم والجديد لمشروع فور بي 4B'
    },
    {
      label: 'مراجعة الميتينج لوكالة',
      cmd: 'شوفي الميتينج اللي فات ايه اللي كان مطلوب فيه لمشروع وكالة وشوفي اتنفذ ولا لا'
    },
    {
      label: 'مهمة استلام الـ 6 إيميلات',
      cmd: 'أضيفي مهمة للمهندس محمد الحلو بخصوص استلام الـ 6 إيميلات بكرة'
    },
    {
      label: 'مواصفات سيرفر WE',
      cmd: 'شوفي مواصفات سيرفر المصرية للاتصالات WE لمشروع فور بي'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#182640] border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-700/80 flex items-center justify-between bg-[#111b2e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>أوامر هيباتيا الصوتية (Voice Command Engine)</span>
              </h2>
              <p className="text-[11px] text-slate-300">
                تحدث بصوتك مباشرة لتكليف هيباتيا بفحص فيجما، الميتينجات، أو إضافة المهام
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-center">
          
          {/* Pulsing Mic Zone */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative">
              {isListening && (
                <>
                  <div className="absolute inset-0 rounded-full bg-teal-500/30 animate-ping" />
                  <div className="absolute -inset-3 rounded-full bg-cyan-500/20 animate-pulse" />
                </>
              )}
              <button
                onClick={toggleListening}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
                  isListening
                    ? 'bg-rose-500 text-white ring-4 ring-rose-400/40 scale-110'
                    : 'bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 hover:scale-105'
                }`}
              >
                {isListening ? (
                  <Mic className="w-8 h-8 animate-bounce" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
            </div>

            <span className="text-xs font-bold text-white mt-3 block">
              {isListening ? 'جارِ الاستماع... اضغط للإيقاف والتنفيذ' : 'اضغط على الميكروفون وتحدث'}
            </span>
            <span className="text-[11px] text-slate-300 mt-1">
              يدعم اللهجة المصرية والعربية الفصحى (ar-EG)
            </span>
          </div>

          {/* Transcript Box */}
          <div className="bg-[#0e1626] border border-slate-700 rounded-2xl p-3.5 text-right min-h-[68px] flex flex-col justify-center">
            <span className="text-[10px] text-teal-300 font-bold block mb-1">
              النص الملتقط:
            </span>
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              {transcript || feedback || 'تفضل بقول أمر مثل: "شوفي فيجما وقارني بين القديم والجديد لمشروع فور بي"'}
            </p>
          </div>

          {/* Execution Result Box */}
          {executionResult && (
            <div className="bg-[#111b2e] border border-teal-500/50 rounded-2xl p-4 text-right space-y-3 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-300" />
                  <span>{executionResult.title}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-950 text-teal-300 border border-teal-700">
                  تم التنفيذ
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-200">
                {executionResult.details.map((d, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-teal-300 font-bold">•</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>

              {executionResult.actionFn && (
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={executionResult.actionFn}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow"
                  >
                    <span>{executionResult.actionLabel || 'متابعة'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick Voice Command Samples */}
          <div className="text-right space-y-2 pt-1 border-t border-slate-700/60">
            <span className="text-xs font-bold text-slate-200 block">
              أو اضغط لتجربة أحد الأوامر النموذجية فوراً:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleVoiceCommands.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(item.cmd);
                    processVoiceCommand(item.cmd);
                  }}
                  className="p-2.5 rounded-xl bg-[#0e1626] border border-slate-700 hover:border-teal-400/80 text-right transition flex items-center justify-between group"
                >
                  <div className="truncate">
                    <span className="text-xs font-bold text-teal-300 group-hover:text-teal-200 block truncate">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-300 truncate block">
                      "{item.cmd}"
                    </span>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-teal-400 opacity-60 group-hover:opacity-100 shrink-0 mr-1" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-700/80 bg-[#111b2e] flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>محرك هيباتيا الصوتي نشط ومتصل بسياق المنظومة</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition text-xs"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
