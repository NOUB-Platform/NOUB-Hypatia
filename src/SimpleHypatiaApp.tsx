import React, { useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase Config (منظومة نوب وهيباتيا)
const DEFAULT_SUPABASE_URL = 'https://sgtpkxckoxkeavfpeitm.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNndHBreGNrb3hrZWF2ZnBlaXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5ODY0NDMsImV4cCI6MjEwNDU2MjQ0M30.CsihBIxZXL_0_QmvYURNFxsXcZ5SlZ-0lTqAClZkRYs';

type Tab = 'supabase' | 'github' | 'ai';

interface RepoItem {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  private: boolean;
  updated_at: string;
  default_branch?: string;
  owner: { login: string };
  clone_url: string;
  size?: number;
  open_issues_count?: number;
}

interface ChatMsg {
  sender: 'user' | 'assistant';
  text: string;
}

export function SimpleHypatiaApp() {
  const [activeTab, setActiveTab] = useState<Tab>('supabase');

  // Supabase State
  const [supabaseUrl, setSupabaseUrl] = useState<string>(() => {
    return localStorage.getItem('hypatia_sb_url') || DEFAULT_SUPABASE_URL;
  });
  const [supabaseKey, setSupabaseKey] = useState<string>(() => {
    return localStorage.getItem('hypatia_sb_key') || DEFAULT_SUPABASE_ANON_KEY;
  });
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);
  const [connectionLatency, setConnectionLatency] = useState<number | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>('projects');
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [tableError, setTableError] = useState<string | null>(null);

  // GitHub State
  const [githubUser, setGithubUser] = useState<string>(() => {
    return localStorage.getItem('hypatia_gh_user') || 'samehyousry';
  });
  const [githubToken, setGithubToken] = useState<string>(() => {
    return localStorage.getItem('hypatia_gh_token') || '';
  });
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState<boolean>(false);
  const [reposError, setReposError] = useState<string | null>(null);
  const [selectedRepoDetails, setSelectedRepoDetails] = useState<any | null>(null);
  const [repoCommits, setRepoCommits] = useState<any[]>([]);
  const [isLoadingCommits, setIsLoadingCommits] = useState<boolean>(false);

  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([
    {
      sender: 'assistant',
      text: 'أهلاً بك يا باشمهندس. أنا "هيباتيا"، مساعدك التقني. تم بناء الواجهة بنظام خفيف ومباشر يركز على استعراض سوبابيز (Supabase) ومستودعات جيت هب (GitHub). كيف أساعدك الآن؟',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isGithubTokenOpen, setIsGithubTokenOpen] = useState<boolean>(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState<boolean>(false);
  const [newRecordTitle, setNewRecordTitle] = useState('');
  const [newRecordDesc, setNewRecordDesc] = useState('');

  // Initialize Supabase client
  useEffect(() => {
    try {
      if (supabaseUrl && supabaseKey) {
        const client = createClient(supabaseUrl, supabaseKey);
        setSupabaseClient(client);
      }
    } catch (err) {
      console.error('Failed to create Supabase client:', err);
    }
  }, [supabaseUrl, supabaseKey]);

  // Test Supabase Connection
  const testSupabase = async (clientInstance?: SupabaseClient) => {
    const client = clientInstance || supabaseClient;
    if (!client) {
      setSupabaseConnected(false);
      return;
    }
    const t0 = performance.now();
    try {
      const { error } = await client.from('projects').select('count', { count: 'exact', head: true });
      const duration = Math.round(performance.now() - t0);
      setConnectionLatency(duration);
      if (error && error.code !== 'PGRST116') {
        const authPing = await client.auth.getSession();
        if (authPing.error) throw authPing.error;
      }
      setSupabaseConnected(true);
    } catch (e) {
      console.warn('Supabase ping notice:', e);
      setSupabaseConnected(true); // reachable
    }
  };

  // Fetch Table Data
  const loadTableData = async (tableName: string, clientInstance?: SupabaseClient) => {
    setSelectedTable(tableName);
    setIsLoadingTable(true);
    setTableError(null);
    const client = clientInstance || supabaseClient;

    if (!client) {
      setIsLoadingTable(false);
      setTableError('يرجى ضبط رابط ومفتاح سوبابيز');
      return;
    }

    try {
      const { data, error } = await client.from(tableName).select('*').limit(50);
      if (error) throw error;
      setTableRows(data || []);
    } catch (err: any) {
      console.error('Table fetch error:', err);
      setTableError(err.message || 'تعذر جلب سجلات الجدول.');
      setTableRows([]);
    } finally {
      setIsLoadingTable(false);
    }
  };

  // Initial trigger for Supabase
  useEffect(() => {
    if (supabaseClient) {
      testSupabase(supabaseClient);
      loadTableData(selectedTable, supabaseClient);
    }
  }, [supabaseClient]);

  // Fetch GitHub Repos
  const loadGithubRepos = async (userToFetch?: string) => {
    const targetUser = (userToFetch || githubUser || 'samehyousry').trim();
    if (!targetUser) return;

    setIsLoadingRepos(true);
    setReposError(null);

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }

    try {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(targetUser)}/repos?sort=updated&per_page=30`,
        { headers }
      );
      if (!res.ok) {
        if (res.status === 404) throw new Error(`المستخدم (${targetUser}) غير موجود على GitHub.`);
        if (res.status === 403) throw new Error('تم تجاوز حد طلبات GitHub المجانية. يرجى إضافة Token.');
        throw new Error(`خطأ في استجابة GitHub (${res.status})`);
      }
      const data: RepoItem[] = await res.json();
      setRepos(data);
    } catch (err: any) {
      setReposError(err.message || 'فشل جلب المستودعات');
      setRepos([]);
    } finally {
      setIsLoadingRepos(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'github' && repos.length === 0) {
      loadGithubRepos();
    }
  }, [activeTab]);

  // View Repo Commits
  const openRepoDetails = async (repo: RepoItem) => {
    setSelectedRepoDetails(repo);
    setIsLoadingCommits(true);
    setRepoCommits([]);

    const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
    if (githubToken) headers['Authorization'] = `token ${githubToken}`;

    try {
      const res = await fetch(
        `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?per_page=10`,
        { headers }
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setRepoCommits(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingCommits(false);
    }
  };

  // Add Record
  const handleAddRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseClient) return;

    try {
      const { error } = await supabaseClient.from(selectedTable).insert([
        {
          name: newRecordTitle,
          title: newRecordTitle,
          description: newRecordDesc,
          status: 'نشط',
          created_at: new Date().toISOString(),
        },
      ]);
      if (error) throw error;

      setIsAddRecordOpen(false);
      setNewRecordTitle('');
      setNewRecordDesc('');
      loadTableData(selectedTable);
    } catch (err: any) {
      alert('خطأ أثناء إضافة السجل: ' + (err.message || err));
    }
  };

  // Send AI Chat
  const handleSendMessage = async (customPrompt?: string) => {
    const text = customPrompt || chatInput.trim();
    if (!text || isChatLoading) return;

    if (!customPrompt) setChatInput('');

    const newHistory: ChatMsg[] = [...chatHistory, { sender: 'user', text }];
    setChatHistory(newHistory);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            activeProject: { name: 'منظومة هيباتيا', code: 'HYPATIA' },
            supabaseConfigured: supabaseConnected,
            githubUser: githubUser,
          },
        }),
      });
      const data = await res.json();
      setChatHistory([
        ...newHistory,
        { sender: 'assistant', text: data.reply || 'تم استلام الاستفسار بنجاح.' },
      ]);
    } catch (err: any) {
      setChatHistory([
        ...newHistory,
        { sender: 'assistant', text: '⚠️ تعذر الاتصال بمحرك الذكاء الاصطناعي: ' + err.message },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white font-bold text-lg">
              ⚡
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                مشروع هيباتيا
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-mono border border-teal-500/20">
                  Hypatia Ops
                </span>
              </h1>
              <p className="text-xs text-slate-400">إدارة سوبابيز (Supabase) ومستودعات جيت هب (GitHub) ببساطة وسرعة</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div
              className={`flex items-center text-[11px] px-2.5 py-1 rounded-full border transition ${
                supabaseConnected
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ml-1.5 ${
                  supabaseConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                }`}
              ></span>
              {supabaseConnected ? 'سوبابيز متصل' : 'جاري الفحص...'}
              {connectionLatency !== null && <span className="font-mono text-[10px] mr-1.5">({connectionLatency}ms)</span>}
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              ⚙️ الإعدادات
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto mt-3 pt-2 border-t border-slate-800/60 flex items-center gap-2">
          <button
            id="btn-tab-supabase"
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === 'supabase'
                ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            🗄️ سوبابيز (Supabase DB)
          </button>
          <button
            id="btn-tab-github"
            onClick={() => setActiveTab('github')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === 'github'
                ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            🐙 جيت هب (GitHub Repos)
          </button>
          <button
            id="btn-tab-ai"
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === 'ai'
                ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            🤖 مساعد هيباتيا الذكي
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 space-y-4">
        {/* ================================================================= */}
        {/* TAB 1: SUPABASE */}
        {/* ================================================================= */}
        {activeTab === 'supabase' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-sm">⚡ قاعدة بيانات Supabase الحية</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {supabaseUrl ? supabaseUrl.replace('https://', '').split('.')[0] : 'غير مهيأ'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="btn-test-sb"
                    onClick={() => testSupabase()}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition font-medium"
                  >
                    إعادة الفحص ⟳
                  </button>
                  <button
                    id="btn-add-record-modal"
                    onClick={() => setIsAddRecordOpen(true)}
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white text-xs rounded-lg transition font-medium"
                  >
                    + إضافة سجل
                  </button>
                </div>
              </div>

              {/* Table Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 font-medium">الجداول المتاحة:</span>
                {['projects', 'project_tasks', 'service_providers', 'contracts', 'employee_emails'].map(
                  (tbl) => (
                    <button
                      key={tbl}
                      id={`btn-table-${tbl}`}
                      onClick={() => loadTableData(tbl)}
                      className={`px-3 py-1 rounded-lg font-mono transition text-xs ${
                        selectedTable === tbl
                          ? 'bg-teal-600 text-white font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {tbl}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Table Records View */}
            <div className="min-h-[250px]">
              {isLoadingTable ? (
                <div className="py-12 text-center text-slate-400">
                  <div className="inline-block w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm">جاري جلب بيانات جدول [{selectedTable}] من Supabase...</p>
                </div>
              ) : tableError ? (
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                    !
                  </div>
                  <h4 className="text-white font-semibold mb-1">تعذر قراءة جدول ({selectedTable})</h4>
                  <p className="text-xs text-slate-400 mb-4">{tableError}</p>
                  <button
                    onClick={() => setIsAddRecordOpen(true)}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs rounded-lg transition font-medium"
                  >
                    + إضافة سجل تجريبي لهذا الجدول
                  </button>
                </div>
              ) : tableRows.length === 0 ? (
                <div className="py-12 text-center text-slate-400 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                  <p className="text-sm mb-2">
                    الجدول <span className="text-teal-400 font-mono font-semibold">{selectedTable}</span> فارغ حالياً.
                  </p>
                  <button
                    onClick={() => setIsAddRecordOpen(true)}
                    className="mt-2 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition"
                  >
                    + إضافة أول سجل الآن
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div>
                      <span>عدد السجلات: </span>
                      <span className="text-teal-400 font-mono font-bold">{tableRows.length}</span>
                    </div>
                    <button
                      onClick={() => loadTableData(selectedTable)}
                      className="text-slate-400 hover:text-slate-200 text-xs"
                    >
                      تحديث ⟳
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90">
                    <table className="w-full text-right border-collapse text-xs">
                      <thead>
                        <tr>
                          {Object.keys(tableRows[0]).map((col) => (
                            <th
                              key={col}
                              className="px-4 py-2.5 font-semibold text-slate-300 bg-slate-950 border-b border-slate-800 font-mono whitespace-nowrap"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40 border-b border-slate-800/60 transition">
                            {Object.keys(tableRows[0]).map((col) => {
                              let val = row[col];
                              if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
                              return (
                                <td
                                  key={col}
                                  className="px-4 py-2 text-slate-300 font-mono max-w-xs truncate"
                                  title={String(val || '')}
                                >
                                  {val !== undefined && val !== null ? (
                                    String(val)
                                  ) : (
                                    <span className="text-slate-600">null</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: GITHUB */}
        {/* ================================================================= */}
        {activeTab === 'github' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sky-400 font-bold text-sm">🐙 مستودعات GitHub</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {repos.length} مستودع
                  </span>
                </div>
                <button
                  onClick={() => setIsGithubTokenOpen(true)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
                >
                  🔑 ضبط التوكن (Token)
                </button>
              </div>

              {/* Search */}
              <div className="flex items-center gap-2">
                <input
                  id="input-gh-user"
                  type="text"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadGithubRepos(githubUser)}
                  placeholder="أدخل اسم المستخدم على GitHub (مثال: samehyousry أو octocat)..."
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                  dir="ltr"
                />
                <button
                  id="btn-fetch-github"
                  onClick={() => loadGithubRepos(githubUser)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition shrink-0"
                >
                  بحث وجلب المستودعات
                </button>
              </div>

              {/* Suggestions */}
              <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                <span>اقتراحات سريعة:</span>
                {['samehyousry', 'octocat', 'supabase', 'facebook'].map((u) => (
                  <button
                    key={u}
                    onClick={() => {
                      setGithubUser(u);
                      loadGithubRepos(u);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[11px]"
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Repos Grid */}
            <div className="min-h-[250px]">
              {isLoadingRepos ? (
                <div className="py-12 text-center text-slate-400">
                  <div className="inline-block w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm">جاري جلب مستودعات [{githubUser}] من GitHub...</p>
                </div>
              ) : reposError ? (
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3 font-bold">
                    ✕
                  </div>
                  <h4 className="text-white font-semibold mb-1">تعذر جلب المستودعات</h4>
                  <p className="text-xs text-rose-300/80 mb-4">{reposError}</p>
                  <button
                    onClick={() => {
                      setGithubUser('octocat');
                      loadGithubRepos('octocat');
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition"
                  >
                    تجربة حساب Demo (octocat)
                  </button>
                </div>
              ) : repos.length === 0 ? (
                <div className="py-12 text-center text-slate-400 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                  لا توجد مستودعات متاحة لهذا المستخدم.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {repos.map((repo) => {
                    const updated = new Date(repo.updated_at).toLocaleDateString('ar-EG', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                    return (
                      <div
                        key={repo.id}
                        className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 transition group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4
                              className="text-sm font-bold text-white group-hover:text-sky-400 transition font-mono truncate"
                              dir="ltr"
                            >
                              {repo.name}
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                              {repo.private ? '🔒 خاص' : '🌐 عام'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2 mb-3 min-h-[32px] leading-relaxed">
                            {repo.description || 'لا يوجد وصف مضاف لهذا المستودع.'}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-3 pb-3 border-b border-slate-800/80">
                            <span className="flex items-center gap-1 font-mono text-sky-300">
                              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block"></span>{' '}
                              {repo.language || 'Code'}
                            </span>
                            <span className="flex items-center gap-1">⭐ {repo.stargazers_count}</span>
                            <span className="flex items-center gap-1">🍴 {repo.forks_count}</span>
                            <span className="text-slate-500 mr-auto text-[10px]">{updated}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openRepoDetails(repo)}
                              className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-medium transition text-center"
                            >
                              تفاصيل والـ Commits
                            </button>
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-slate-800/60 hover:bg-sky-600/30 text-sky-400 rounded-lg text-xs transition px-2.5"
                              title="فتح على GitHub"
                            >
                              ↗
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: HYPATIA AI ASSISTANT */}
        {/* ================================================================= */}
        {activeTab === 'ai' && (
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md flex flex-col h-[560px] overflow-hidden">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse"></div>
                <span className="text-xs font-bold text-white">مساعد هيباتيا التقني (Senior Co-Engineer)</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                مدعوم بمحرك Gemini 3.8 Flash
              </span>
            </div>

            {/* Quick Prompts */}
            <div className="p-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px] whitespace-nowrap">
              <span className="text-slate-500 font-medium shrink-0">أوامر سريعة:</span>
              <button
                onClick={() =>
                  handleSendMessage('اكتب استعلام SQL لإنشاء جداول المشاريع والمهام في Supabase مع الفهارس')
                }
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-teal-300 border border-slate-800 transition"
              >
                استعلام SQL لجداول Supabase
              </button>
              <button
                onClick={() =>
                  handleSendMessage('كيف أقوم بربط GitHub Actions مع Supabase للتوزيع التلقائي؟')
                }
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-800 transition"
              >
                ربط GitHub مع Supabase
              </button>
              <button
                onClick={() =>
                  handleSendMessage('لخص لي معمارية مشروع نوب سبورتس والربط مع الأكاديميات')
                }
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 transition"
              >
                خطة نوب سبورتس
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatHistory.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isUser ? 'items-start' : 'items-end'} mb-3`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold ${isUser ? 'text-teal-400' : 'text-sky-400'}`}>
                        {isUser ? 'أنت' : 'هيباتيا (Senior Ops Lead)'}
                      </span>
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-teal-600 text-white rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                      } whitespace-pre-wrap`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              {isChatLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></div>
                  <span>هيباتيا تفكر وتجهز الإجابة...</span>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                id="input-chat-msg"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="اكتب استفسارك أو طلب الكود لهيباتيا (اضغط Enter للإرسال)..."
                className="flex-1 px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
              <button
                id="btn-send-chat"
                onClick={() => handleSendMessage()}
                disabled={isChatLoading}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition shrink-0 disabled:opacity-50"
              >
                إرسال
              </button>
            </div>
          </div>
        )}
      </main>

      {/* =================================================================== */}
      {/* MODALS */}
      {/* =================================================================== */}

      {/* Supabase Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">إعدادات ربط Supabase</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Supabase Project URL:</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-teal-500"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Supabase Anon Key:</label>
                <textarea
                  rows={3}
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-teal-500"
                  dir="ltr"
                ></textarea>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('hypatia_sb_url', supabaseUrl);
                  localStorage.setItem('hypatia_sb_key', supabaseKey);
                  setIsSettingsOpen(false);
                  testSupabase();
                }}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition"
              >
                حفظ ومزامنة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Token Modal */}
      {isGithubTokenOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">إعدادات GitHub الحساب والتوكن</h3>
              <button onClick={() => setIsGithubTokenOpen(false)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">اسم المستخدم الافتراضي:</label>
                <input
                  type="text"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-sky-500"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  GitHub Personal Access Token (اختياري):
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-sky-500"
                  dir="ltr"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  يحفظ محلياً في متصفحك لرفع حد الاستعلام من GitHub API.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsGithubTokenOpen(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('hypatia_gh_user', githubUser);
                  localStorage.setItem('hypatia_gh_token', githubToken);
                  setIsGithubTokenOpen(false);
                  loadGithubRepos(githubUser);
                }}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {isAddRecordOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">إضافة سجل جديد لجدول [{selectedTable}]</h3>
              <button onClick={() => setIsAddRecordOpen(false)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddRecordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">العنوان / الاسم (Name / Title):</label>
                <input
                  type="text"
                  required
                  value={newRecordTitle}
                  onChange={(e) => setNewRecordTitle(e.target.value)}
                  placeholder="مثال: تطبيق نوب سبورتس v2"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">الوصف أو الملاحظات (Description):</label>
                <textarea
                  rows={3}
                  value={newRecordDesc}
                  onChange={(e) => setNewRecordDesc(e.target.value)}
                  placeholder="أدخل تفاصيل السجل هنا..."
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-teal-500"
                ></textarea>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddRecordOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition"
                >
                  إضافة إلى Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Repo Details Modal */}
      {selectedRepoDetails && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono" dir="ltr">
                {selectedRepoDetails.owner.login} / {selectedRepoDetails.name}
              </h3>
              <button onClick={() => setSelectedRepoDetails(null)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 text-right">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span className="block text-slate-500 text-[10px]">الفرع</span>
                    <span className="font-mono text-sky-300 font-bold">
                      {selectedRepoDetails.default_branch || 'main'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span className="block text-slate-500 text-[10px]">النجوم ⭐</span>
                    <span className="font-mono text-white font-bold">{selectedRepoDetails.stargazers_count}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span className="block text-slate-500 text-[10px]">التفرعات 🍴</span>
                    <span className="font-mono text-amber-300 font-bold">{selectedRepoDetails.forks_count}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span className="block text-slate-500 text-[10px]">اللغة</span>
                    <span className="font-mono text-slate-300 font-bold">
                      {selectedRepoDetails.language || 'Code'}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400">أمر الاستنساخ:</span>
                  <code className="px-2 py-1 bg-slate-900 text-sky-300 rounded font-mono text-[11px]" dir="ltr">
                    git clone {selectedRepoDetails.clone_url}
                  </code>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-200 mb-2">آخر التحديثات (Commits):</h5>
                {isLoadingCommits ? (
                  <p className="text-xs text-slate-500 text-center py-4">جاري التحميل...</p>
                ) : repoCommits.length === 0 ? (
                  <p className="text-xs text-slate-500">لا توجد commits متاحة.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {repoCommits.map((c, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-right">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-mono text-sky-400">{(c.sha || '').substring(0, 7)}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(c.commit?.author?.date || Date.now()).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium line-clamp-2 mb-1" dir="ltr">
                          {c.commit?.message}
                        </p>
                        <p className="text-[10px] text-slate-400">بواسطة: {c.commit?.author?.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedRepoDetails(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
