import React, { useState, useEffect } from 'react';
import { MiniAppHeader } from './components/MiniAppHeader';
import { MiniAppBottomBar } from './components/MiniAppBottomBar';
import { ChatTab } from './components/ChatTab';
import { ProjectsTab } from './components/ProjectsTab';
import { ContractsTab } from './components/ContractsTab';
import { MashweerEmailsTab } from './components/MashweerEmailsTab';
import { ProvidersVaultTab } from './components/ProvidersVaultTab';
import { VoiceCommandModal } from './components/VoiceCommandModal';
import { TasksTab } from './components/TasksTab';
import { CodeTab } from './components/CodeTab';
import { DatabaseTab } from './components/DatabaseTab';
import { ToolsTab } from './components/ToolsTab';
import { SettingsTab } from './components/SettingsTab';
import { MoreMenuDrawer } from './components/MoreMenuDrawer';

import { 
  TabType, 
  ChatMessage, 
  ProjectItem, 
  ProjectTask, 
  ApiEndpointItem, 
  ContractDeliverable, 
  MashweerEmployeeEmail,
  ServiceProviderItem 
} from './types';
import { 
  INITIAL_PROJECTS, 
  INITIAL_TASKS, 
  INITIAL_API_ENDPOINTS, 
  INITIAL_CONTRACT_DELIVERABLES, 
  INITIAL_MASHWEER_EMAILS,
  INITIAL_SERVICE_PROVIDERS 
} from './data/initialProjects';
import { fetchAllDataFromSupabase } from './lib/supabase';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('chat');
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Projects State with LocalStorage persistence
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem('hypatia_projects_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge initial projects driveAssets and referenceChats if missing, and sync real Figma links
        return parsed.map((p: ProjectItem) => {
          const init = INITIAL_PROJECTS.find((ip) => ip.id === p.id);
          return {
            ...p,
            figmaUrl: (!p.figmaUrl || p.figmaUrl.includes('sample-')) ? (init?.figmaUrl || p.figmaUrl) : p.figmaUrl,
            driveAssets: p.driveAssets || init?.driveAssets || [],
            referenceChats: p.referenceChats || init?.referenceChats || [],
            contextHints: p.contextHints || init?.contextHints || [],
          };
        });
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('hypatia_active_project_id');
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROJECTS[0]?.id || 'proj-noub-sports';
  });

  // Tasks State with LocalStorage persistence
  const [tasks, setTasks] = useState<ProjectTask[]>(() => {
    try {
      const saved = localStorage.getItem('hypatia_tasks_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TASKS;
  });

  // Contracts & Deliverables State
  const [contracts, setContracts] = useState<ContractDeliverable[]>(() => {
    try {
      const saved = localStorage.getItem('hypatia_contracts_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CONTRACT_DELIVERABLES;
  });

  // Mashweer Employee Emails State
  const [mashweerEmails, setMashweerEmails] = useState<MashweerEmployeeEmail[]>(() => {
    try {
      const saved = localStorage.getItem('hypatia_mashweer_emails');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MASHWEER_EMAILS;
  });

  // API Endpoints State with LocalStorage persistence
  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpointItem[]>(() => {
    try {
      const saved = localStorage.getItem('hypatia_api_endpoints');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_API_ENDPOINTS;
  });

  // Service Providers & Vault State with LocalStorage persistence
  const [serviceProviders, setServiceProviders] = useState<ServiceProviderItem[]>(() => {
    try {
      const saved = localStorage.getItem('hypatia_service_providers');
      if (saved) {
        const parsed: ServiceProviderItem[] = JSON.parse(saved);
        return parsed.map((sp) => {
          const init = INITIAL_SERVICE_PROVIDERS.find((isp) => isp.id === sp.id);
          return {
            ...sp,
            activeServices: sp.activeServices && sp.activeServices.length > 0 ? sp.activeServices : (init?.activeServices || []),
            costOrPlan: init?.costOrPlan || sp.costOrPlan,
            officialBadge: init?.officialBadge || sp.officialBadge,
          };
        });
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SERVICE_PROVIDERS;
  });

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || INITIAL_PROJECTS[0];

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hypatia_service_providers', JSON.stringify(serviceProviders));
    } catch (e) {
      console.error(e);
    }
  }, [serviceProviders]);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hypatia_projects_data', JSON.stringify(projects));
    } catch (e) {
      console.error(e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('hypatia_contracts_data', JSON.stringify(contracts));
    } catch (e) {
      console.error(e);
    }
  }, [contracts]);

  useEffect(() => {
    try {
      localStorage.setItem('hypatia_mashweer_emails', JSON.stringify(mashweerEmails));
    } catch (e) {
      console.error(e);
    }
  }, [mashweerEmails]);

  useEffect(() => {
    try {
      localStorage.setItem('hypatia_active_project_id', activeProjectId);
    } catch (e) {
      console.error(e);
    }
  }, [activeProjectId]);

  useEffect(() => {
    try {
      localStorage.setItem('hypatia_tasks_data', JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('hypatia_api_endpoints', JSON.stringify(apiEndpoints));
    } catch (e) {
      console.error(e);
    }
  }, [apiEndpoints]);

  // Automatic Cloud Sync: Hydrate local state from Supabase if available
  useEffect(() => {
    let isMounted = true;
    fetchAllDataFromSupabase().then((data) => {
      if (!isMounted || !data) return;
      if (data.projects && data.projects.length > 0) {
        setProjects(data.projects);
      }
      if (data.providers && data.providers.length > 0) {
        setServiceProviders(data.providers);
      }
      if (data.contracts && data.contracts.length > 0) {
        setContracts(data.contracts);
      }
      if (data.emails && data.emails.length > 0) {
        setMashweerEmails(data.emails);
      }
      if (data.tasks && data.tasks.length > 0) {
        setTasks(data.tasks);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'hypatia',
      content: `أهلاً بك يا باشمهندس سامح. أنا "هيباتيا" (Hypatia) - مساعدك التقني والبرمجي الشخصي لإدارة مشروعاتك وغرف العمليات.

أنا جاهزة ومستعدة للتنفيذ الفوري معك في:
• كتابة وتعديل وترقية الأكواد وتطوير الدوال (TypeScript / Node.js / React / Python / C++)
• صياغة استعلامات قواعد البيانات المتقدمة لـ Supabase و PostgreSQL مع الفهارس
• فحص خطوط الربط ومسارات الطوارئ (مصر للمقاصة، MIST، مباشر، البورصة المصرية)
• صياغة الإيميلات والخطابات الرسمية المعتمدة لجهات العمل
• متابعة وتطوير مشاريعك (نوب سبورتس، نوب الأساسي، لعبة نوب، فور بي، وباقي الأنظمة)

المشروع النشط حالياً: **${activeProject.name}**. ما الذي تود أن نبدأ بكتابته أو فحصه الآن؟`,
      timestamp: 'الآن',
    },
  ]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Send message to Gemini API via server.ts
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoadingChat(true);

    try {
      // Find relevant project tasks to attach to context
      const projectTasks = tasks.filter((t) => t.projectId === activeProject.id);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
          activeProject: {
            ...activeProject,
            currentTasksCount: projectTasks.length,
            pendingTasks: projectTasks.map((t) => t.title),
          },
          context: {
            registeredEndpoints: apiEndpoints.map((ep) => ({
              name: ep.name,
              service: ep.service,
              ip: ep.urlOrIp,
              status: ep.status,
            })),
          },
        }),
      });

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'hypatia',
        content: data.reply || 'تم استلام طلبك ومعالجته.',
        timestamp: data.timestamp || new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      console.error(err);
      const errorReply: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'hypatia',
        content: 'حدث خطأ أثناء الاتصال: ' + (err.message || 'خطأ غير معروف'),
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleAskHypatiaFromAnywhere = (prompt: string, project?: ProjectItem) => {
    if (project) {
      setActiveProjectId(project.id);
    }
    setCurrentTab('chat');
    handleSendMessage(prompt);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'hypatia',
        content: `تم مسح المحادثة. أنا جاهزة لأي مهمة برمجية أو استفسار لنظام ${activeProject.name}.`,
        timestamp: 'الآن',
      },
    ]);
  };

  // Project Management Actions
  const handleUpdateProject = (updated: ProjectItem) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleAddNewProject = (newProject: ProjectItem) => {
    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
  };

  // Task Management Actions
  const handleAddTask = (newTask: ProjectTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: t.status === 'مكتمل' ? 'قيد الانتظار' : 'مكتمل',
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Contracts Actions
  const handleUpdateContract = (updated: ContractDeliverable) => {
    setContracts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  // Mashweer Employee Emails Actions
  const handleAddEmail = (newEmail: MashweerEmployeeEmail) => {
    setMashweerEmails((prev) => [newEmail, ...prev]);
  };

  const handleDeleteEmail = (id: string) => {
    setMashweerEmails((prev) => prev.filter((e) => e.id !== id));
  };

  const handleUpdateEmailStatus = (id: string, status: MashweerEmployeeEmail['status']) => {
    setMashweerEmails((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  // Service Providers Actions
  const handleAddProvider = (newProvider: ServiceProviderItem) => {
    setServiceProviders((prev) => [newProvider, ...prev]);
  };

  const handleUpdateProvider = (updated: ServiceProviderItem) => {
    setServiceProviders((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProvider = (id: string) => {
    setServiceProviders((prev) => prev.filter((p) => p.id !== id));
  };

  // Voice Command Action Processor
  const handleVoiceAction = (actionType: string, payload: any) => {
    if (actionType === 'navigate_tab') {
      setCurrentTab(payload.tab);
    } else if (actionType === 'compare_figma') {
      setCurrentTab('code');
      handleAskHypatiaFromAnywhere(payload.prompt || 'مقارنة شاشات فيجما بكود المشروع واستخراج الفروقات بدقة', activeProject);
    } else if (actionType === 'review_meeting') {
      handleAskHypatiaFromAnywhere(payload.prompt || 'مراجعة الميتينج واستخراج التعديلات المطلوبة', activeProject);
    } else if (actionType === 'create_task') {
      if (payload.target === 'provider' && payload.providerId) {
        setServiceProviders((prev) =>
          prev.map((p) => {
            if (p.id === payload.providerId) {
              const newTask = {
                id: `task-${Date.now()}`,
                title: payload.title,
                dueDate: '2026-09-10',
                priority: 'عاجل' as const,
                status: 'معلقة' as const,
                assignedContact: payload.contact,
              };
              return { ...p, tasks: [newTask, ...p.tasks] };
            }
            return p;
          })
        );
        setCurrentTab('providers');
      } else {
        const newTask: ProjectTask = {
          id: `task-${Date.now()}`,
          projectId: activeProject.id,
          title: payload.title,
          status: 'قيد الانتظار',
          priority: 'عاجل',
          createdAt: new Date().toISOString().split('T')[0],
        };
        handleAddTask(newTask);
        setCurrentTab('tasks');
      }
    } else if (actionType === 'ask_hypatia') {
      handleAskHypatiaFromAnywhere(payload.prompt, activeProject);
    }
  };

  const pendingTasksCount = tasks.filter((t) => t.status !== 'مكتمل').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-teal-500 selection:text-slate-950 antialiased">
      {/* Telegram Mini App Top Bar (Dark Slate 950) */}
      <MiniAppHeader
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(p) => setActiveProjectId(p.id)}
        onOpenNewProjectModal={() => {
          setCurrentTab('projects');
        }}
        onOpenSettings={() => setCurrentTab('settings')}
        onOpenVoiceCommand={() => setIsVoiceModalOpen(true)}
      />

      {/* Main Mini-App Viewport - 2 Shades Lighter than dark bars (bg-[#0f172a] / slate-900) */}
      <div className="flex-1 w-full bg-[#0f172a] border-y border-slate-800/80 min-h-0">
        <main className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          {currentTab === 'chat' && (
            <ChatTab
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoadingChat}
              onClearChat={handleClearChat}
              activeProject={activeProject}
            />
          )}

          {currentTab === 'providers' && (
            <ProvidersVaultTab
              providers={serviceProviders}
              onAddProvider={handleAddProvider}
              onUpdateProvider={handleUpdateProvider}
              onDeleteProvider={handleDeleteProvider}
              onOpenVoiceCommand={() => setIsVoiceModalOpen(true)}
              onAskHypatia={handleAskHypatiaFromAnywhere}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsTab
              projects={projects}
              activeProject={activeProject}
              onSelectActiveProject={(p) => setActiveProjectId(p.id)}
              onUpdateProject={handleUpdateProject}
              onAddNewProject={handleAddNewProject}
              onNavigateToChatWithPrompt={handleAskHypatiaFromAnywhere}
            />
          )}

          {currentTab === 'contracts' && (
            <ContractsTab
              contracts={contracts}
              onUpdateContract={handleUpdateContract}
              onAskHypatia={handleAskHypatiaFromAnywhere}
              projects={projects}
            />
          )}

          {currentTab === 'mashweer_emails' && (
            <MashweerEmailsTab
              emails={mashweerEmails}
              onAddEmail={handleAddEmail}
              onDeleteEmail={handleDeleteEmail}
              onUpdateEmailStatus={handleUpdateEmailStatus}
              onAskHypatia={handleAskHypatiaFromAnywhere}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksTab
              tasks={tasks}
              projects={projects}
              activeProject={activeProject}
              onAddTask={handleAddTask}
              onToggleTaskStatus={handleToggleTaskStatus}
              onDeleteTask={handleDeleteTask}
              onAskEmo={(prompt) => handleAskHypatiaFromAnywhere(prompt, activeProject)}
            />
          )}

          {currentTab === 'code' && (
            <CodeTab
              activeProject={activeProject}
              projects={projects}
              onAskEmo={(prompt) => handleAskHypatiaFromAnywhere(prompt, activeProject)}
            />
          )}

          {currentTab === 'database' && (
            <DatabaseTab
              activeProject={activeProject}
              projects={projects}
              serviceProviders={serviceProviders}
              contracts={contracts}
              mashweerEmails={mashweerEmails}
              tasks={tasks}
              onAskEmo={(prompt) => handleAskHypatiaFromAnywhere(prompt, activeProject)}
            />
          )}

          {currentTab === 'tools' && (
            <ToolsTab
              apiEndpoints={apiEndpoints}
              onUpdateEndpoints={setApiEndpoints}
              projects={projects}
              onAskHypatia={(prompt) => handleAskHypatiaFromAnywhere(prompt, activeProject)}
            />
          )}

          {currentTab === 'settings' && <SettingsTab projects={projects} onNavigateToTab={setCurrentTab} />}
        </main>
      </div>

      {/* Telegram Mini App Bottom Navigation Bar (5 Items with Center Curved FAB) */}
      <MiniAppBottomBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenMore={() => setIsMoreDrawerOpen(true)}
        isMoreOpen={isMoreDrawerOpen}
        projectsCount={projects.length}
        contractsCount={contracts.length}
      />

      {/* More / Hamburger Menu Drawer */}
      <MoreMenuDrawer
        isOpen={isMoreDrawerOpen}
        onClose={() => setIsMoreDrawerOpen(false)}
        onSelectTab={setCurrentTab}
        currentTab={currentTab}
        activeProject={activeProject}
        onAskHypatia={handleAskHypatiaFromAnywhere}
      />

      {/* Voice Command Modal for Hypatia */}
      <VoiceCommandModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onExecuteCommand={handleVoiceAction}
        activeProjectName={activeProject.name}
      />
    </div>
  );
}
