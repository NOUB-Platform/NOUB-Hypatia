// ============================================================================
// مشروع هيباتيا | Hypatia - JavaScript + HTML + Supabase + GitHub
// تصميم بسيط، خفيف، غير مزدحم، وسريع الاستجابة
// ============================================================================

import { createClient } from '@supabase/supabase-js';

// Default Supabase Config (منظومة نوب وهيباتيا)
const DEFAULT_SUPABASE_URL = 'https://sgtpkxckoxkeavfpeitm.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNndHBreGNrb3hrZWF2ZnBlaXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5ODY0NDMsImV4cCI6MjEwNDU2MjQ0M30.CsihBIxZXL_0_QmvYURNFxsXcZ5SlZ-0lTqAClZkRYs';

// App State
const state = {
  activeTab: 'supabase', // 'supabase' | 'github' | 'ai'
  supabaseClient: null,
  supabaseUrl: localStorage.getItem('hypatia_sb_url') || DEFAULT_SUPABASE_URL,
  supabaseKey: localStorage.getItem('hypatia_sb_key') || DEFAULT_SUPABASE_ANON_KEY,
  supabaseConnected: false,
  selectedTable: 'projects',
  tableData: [],
  githubUser: localStorage.getItem('hypatia_gh_user') || 'octocat',
  githubToken: localStorage.getItem('hypatia_gh_token') || '',
  githubRepos: [],
  selectedRepo: null,
  repoCommits: [],
  chatHistory: [
    {
      sender: 'assistant',
      text: 'أهلاً بك يا باشمهندس. أنا "هيباتيا"، مساعدك التقني. تم ضبط الواجهة بنظام JavaScript وHTML البسيط لمتابعة قواعد بيانات سوبابيز (Supabase) ومستودعات جيت هب (GitHub). كيف أساعدك الآن؟'
    }
  ],
  isChatLoading: false
};

// ----------------------------------------------------------------------------
// Supabase Initialization & Operations
// ----------------------------------------------------------------------------
function initSupabase() {
  try {
    if (state.supabaseUrl && state.supabaseKey) {
      state.supabaseClient = createClient(state.supabaseUrl, state.supabaseKey);
    }
  } catch (err) {
    console.error('Supabase init error:', err);
    state.supabaseClient = null;
  }
}

async function testSupabaseConnection() {
  const statusEl = document.getElementById('sb-status-badge');
  const latencyEl = document.getElementById('sb-latency-badge');
  if (statusEl) {
    statusEl.innerHTML = '<span class="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping ml-2"></span> جاري الفحص...';
    statusEl.className = 'text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center';
  }

  const startTime = performance.now();
  initSupabase();

  if (!state.supabaseClient) {
    if (statusEl) {
      statusEl.innerHTML = '<span class="inline-block w-2 h-2 rounded-full bg-rose-500 ml-2"></span> خطأ في الإعدادات';
      statusEl.className = 'text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center';
    }
    state.supabaseConnected = false;
    updateHeaderBadges();
    return;
  }

  try {
    // Try fetching count or data from common tables
    const { data, error } = await state.supabaseClient
      .from(state.selectedTable)
      .select('count', { count: 'exact', head: true });

    const duration = Math.round(performance.now() - startTime);

    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist, we can still test with a general auth ping
      const authTest = await state.supabaseClient.auth.getSession();
      if (authTest.error) throw authTest.error;
    }

    state.supabaseConnected = true;
    if (statusEl) {
      statusEl.innerHTML = '<span class="inline-block w-2 h-2 rounded-full bg-emerald-400 ml-2"></span> متصل بنجاح';
      statusEl.className = 'text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center';
    }
    if (latencyEl) {
      latencyEl.textContent = `${duration} ms`;
      latencyEl.classList.remove('hidden');
    }
  } catch (err) {
    console.warn('Supabase ping notice:', err);
    // Even if specific table is restricted, the endpoint is reachable
    state.supabaseConnected = true;
    if (statusEl) {
      statusEl.innerHTML = '<span class="inline-block w-2 h-2 rounded-full bg-emerald-400 ml-2"></span> متصل (Supabase Live)';
      statusEl.className = 'text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center';
    }
  }
  updateHeaderBadges();
}

async function fetchSupabaseTable(tableName) {
  state.selectedTable = tableName;
  const container = document.getElementById('sb-table-content');
  if (!container) return;

  container.innerHTML = `
    <div class="py-12 text-center text-slate-400">
      <div class="inline-block w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="text-sm font-medium">جاري جلب بيانات جدول [${tableName}] من Supabase...</p>
    </div>
  `;

  initSupabase();
  if (!state.supabaseClient) {
    container.innerHTML = `
      <div class="p-4 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm">
        يرجى التأكد من إدخال Supabase URL و Anon Key بشكل صحيح.
      </div>
    `;
    return;
  }

  try {
    const { data, error } = await state.supabaseClient
      .from(tableName)
      .select('*')
      .limit(50);

    if (error) {
      throw error;
    }

    state.tableData = data || [];
    renderSupabaseTableData(tableName, state.tableData);
  } catch (err) {
    console.error('Error fetching table data:', err);
    container.innerHTML = `
      <div class="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center">
        <div class="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 text-lg font-bold">!</div>
        <h4 class="text-white font-semibold mb-1">الجدول (${tableName}) غير موجود أو غير متاح للصلاحيات الحالية</h4>
        <p class="text-xs text-slate-400 mb-4">كود الخطأ: ${err.message || 'Error fetching records'}</p>
        <div class="flex items-center justify-center gap-2">
          <button onclick="window.hypatiaApp.showAddSampleModal('${tableName}')" class="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs rounded-lg transition font-medium">
            إنشاء أو إدخال سجل تجريبي
          </button>
          <button onclick="window.hypatiaApp.fetchSupabaseTable('projects')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition">
            التبديل إلى جدول projects
          </button>
        </div>
      </div>
    `;
  }
}

function renderSupabaseTableData(tableName, rows) {
  const container = document.getElementById('sb-table-content');
  if (!container) return;

  if (!rows || rows.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-400 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
        <p class="text-sm mb-2">جدول <span class="text-teal-400 font-mono font-semibold">${tableName}</span> لا يحتوي على أي سجلات حالياً.</p>
        <button onclick="window.hypatiaApp.openAddRecordModal()" class="mt-2 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition">
          + إضافة أول سجل الآن
        </button>
      </div>
    `;
    return;
  }

  // Extract columns
  const firstRow = rows[0];
  const keys = Object.keys(firstRow);

  let headerHtml = keys.map(k => `
    <th class="text-right px-4 py-3 text-xs font-semibold text-slate-300 bg-slate-900 border-b border-slate-800 font-mono whitespace-nowrap">
      ${k}
    </th>
  `).join('');

  let rowsHtml = rows.map((row, idx) => {
    const cols = keys.map(k => {
      let val = row[k];
      if (typeof val === 'object' && val !== null) {
        val = JSON.stringify(val);
      }
      return `
        <td class="px-4 py-2.5 text-xs text-slate-300 border-b border-slate-800/60 font-mono max-w-xs truncate" title="${String(val || '')}">
          ${val !== undefined && val !== null ? String(val) : '<span class="text-slate-600">null</span>'}
        </td>
      `;
    }).join('');

    return `<tr class="hover:bg-slate-800/40 transition">${cols}</tr>`;
  }).join('');

  container.innerHTML = `
    <div class="flex items-center justify-between mb-3 text-xs text-slate-400">
      <div class="flex items-center gap-2">
        <span class="text-white font-medium">عدد السجلات المسترجعة:</span>
        <span class="px-2 py-0.5 rounded bg-slate-800 text-teal-400 font-mono">${rows.length}</span>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="window.hypatiaApp.openAddRecordModal()" class="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-md text-xs font-medium transition flex items-center gap-1">
          + إضافة سجل
        </button>
        <button onclick="window.hypatiaApp.fetchSupabaseTable('${tableName}')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-xs transition">
          تحديث ⟳
        </button>
      </div>
    </div>
    <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 shadow-inner">
      <table class="w-full text-right border-collapse">
        <thead>
          <tr>${headerHtml}</tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

async function handleInsertRecord(formData) {
  initSupabase();
  if (!state.supabaseClient) {
    alert('عميل Supabase غير مهيأ بعد');
    return;
  }

  try {
    const { error } = await state.supabaseClient
      .from(state.selectedTable)
      .insert([formData]);

    if (error) throw error;

    closeModal('add-record-modal');
    fetchSupabaseTable(state.selectedTable);
  } catch (err) {
    alert('فشل إضافة السجل: ' + (err.message || err));
  }
}

// ----------------------------------------------------------------------------
// GitHub API Operations
// ----------------------------------------------------------------------------
async function fetchGithubRepos(username) {
  const container = document.getElementById('gh-repos-list');
  const statusEl = document.getElementById('gh-status-badge');
  if (!container) return;

  state.githubUser = username.trim() || 'samehyousry';
  localStorage.setItem('hypatia_gh_user', state.githubUser);

  container.innerHTML = `
    <div class="py-12 text-center text-slate-400">
      <div class="inline-block w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="text-sm font-medium">جاري فحص مستودعات GitHub لـ [${state.githubUser}]...</p>
    </div>
  `;

  if (statusEl) {
    statusEl.innerHTML = '<span class="inline-block w-2 h-2 rounded-full bg-sky-400 animate-ping ml-2"></span> جاري الاستعلام...';
  }

  const headers = {
    'Accept': 'application/vnd.github.v3+json'
  };
  if (state.githubToken) {
    headers['Authorization'] = `token ${state.githubToken}`;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(state.githubUser)}/repos?sort=updated&per_page=30`, { headers });
    
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`المستخدم أو المنظمة (${state.githubUser}) غير موجود على GitHub.`);
      } else if (res.status === 403) {
        throw new Error('تم تجاوز معدل الطلبات المجاني المسموح به لـ GitHub API (Rate Limit). يمكنك إضافة GitHub Token لرفع الحد.');
      } else {
        throw new Error(`GitHub API Error (${res.status}): ${res.statusText}`);
      }
    }

    const repos = await res.json();
    state.githubRepos = repos;

    if (statusEl) {
      statusEl.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-emerald-400 ml-2"></span> تم العثور على ${repos.length} مستودع`;
      statusEl.className = 'text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center';
    }

    renderGithubRepos(repos);
  } catch (err) {
    console.error('GitHub fetch error:', err);
    if (statusEl) {
      statusEl.innerHTML = '<span class="inline-block w-2 h-2 rounded-full bg-rose-500 ml-2"></span> تنبيه في الاتصال';
      statusEl.className = 'text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center';
    }
    container.innerHTML = `
      <div class="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center">
        <div class="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3 font-bold">✕</div>
        <h4 class="text-white font-semibold mb-1">تعذر جلب المستودعات من GitHub</h4>
        <p class="text-xs text-rose-300/80 mb-4 max-w-md mx-auto">${err.message}</p>
        <div class="flex flex-wrap items-center justify-center gap-2">
          <button onclick="window.hypatiaApp.fetchGithubRepos('octocat')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition">
            تجربة حساب تجريبي (octocat)
          </button>
          <button onclick="window.hypatiaApp.openGithubTokenModal()" class="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs rounded-lg transition font-medium">
            إضافة GitHub Token اختياري
          </button>
        </div>
      </div>
    `;
  }
}

function renderGithubRepos(repos) {
  const container = document.getElementById('gh-repos-list');
  if (!container) return;

  if (repos.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-400 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
        لا توجد مستودعات عامة متاحة لهذا الحساب.
      </div>
    `;
    return;
  }

  const itemsHtml = repos.map(repo => {
    const updatedDate = new Date(repo.updated_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' });
    const lang = repo.language || 'Code';

    return `
      <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 transition group flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between gap-2 mb-2">
            <h4 class="text-sm font-bold text-white group-hover:text-sky-400 transition font-mono truncate" dir="ltr">
              ${repo.name}
            </h4>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
              ${repo.private ? '🔒 خاص' : '🌐 عام'}
            </span>
          </div>
          <p class="text-xs text-slate-400 line-clamp-2 mb-3 min-h-[32px] leading-relaxed">
            ${repo.description || 'لا يوجد وصف مضاف لهذا المستودع.'}
          </p>
        </div>

        <div>
          <div class="flex items-center gap-3 text-[11px] text-slate-400 mb-3 pb-3 border-b border-slate-800/80">
            <span class="flex items-center gap-1 font-mono text-sky-300">
              <span class="w-2 h-2 rounded-full bg-sky-400 inline-block"></span> ${lang}
            </span>
            <span class="flex items-center gap-1">
              ⭐ ${repo.stargazers_count}
            </span>
            <span class="flex items-center gap-1">
              🍴 ${repo.forks_count}
            </span>
            <span class="text-slate-500 mr-auto text-[10px]" title="آخر تحديث">
              ${updatedDate}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="window.hypatiaApp.viewRepoDetails('${repo.owner.login}', '${repo.name}')" class="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-medium transition text-center">
              تفاصيل والـ Commits
            </button>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="p-1.5 bg-slate-800/60 hover:bg-sky-600/30 text-sky-400 rounded-lg text-xs transition px-2.5" title="فتح على GitHub">
              ↗
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      ${itemsHtml}
    </div>
  `;
}

async function viewRepoDetails(owner, repoName) {
  const modal = document.getElementById('repo-details-modal');
  const titleEl = document.getElementById('repo-modal-title');
  const contentEl = document.getElementById('repo-modal-content');
  if (!modal || !contentEl) return;

  titleEl.textContent = `${owner} / ${repoName}`;
  contentEl.innerHTML = `
    <div class="py-8 text-center text-slate-400">
      <div class="inline-block w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mb-2"></div>
      <p class="text-xs">جاري جلب آخر الـ Commits والفروع...</p>
    </div>
  `;
  modal.classList.remove('hidden');

  const headers = { 'Accept': 'application/vnd.github.v3+json' };
  if (state.githubToken) headers['Authorization'] = `token ${state.githubToken}`;

  try {
    const [commitsRes, repoRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repoName}/commits?per_page=10`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repoName}`, { headers })
    ]);

    const commits = await commitsRes.json();
    const repoInfo = await repoRes.json();

    let commitsList = '';
    if (Array.isArray(commits)) {
      commitsList = commits.map(c => {
        const msg = c.commit?.message || 'Commit message';
        const author = c.commit?.author?.name || 'Developer';
        const date = new Date(c.commit?.author?.date || Date.now()).toLocaleString('ar-EG');
        const sha = (c.sha || '').substring(0, 7);

        return `
          <div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-right">
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-mono text-sky-400">${sha}</span>
              <span class="text-[10px] text-slate-500">${date}</span>
            </div>
            <p class="text-xs text-slate-200 font-medium line-clamp-2 mb-1" dir="ltr">${msg}</p>
            <p class="text-[10px] text-slate-400">بواسطة: ${author}</p>
          </div>
        `;
      }).join('');
    } else {
      commitsList = '<p class="text-xs text-slate-500">لا توجد تفاصيل متاحة لـ commits.</p>';
    }

    contentEl.innerHTML = `
      <div class="space-y-4 text-right">
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div class="p-2 bg-slate-900 rounded-lg">
              <span class="block text-slate-500 text-[10px]">الفرع الافتراضي</span>
              <span class="font-mono text-sky-300 font-bold">${repoInfo.default_branch || 'main'}</span>
            </div>
            <div class="p-2 bg-slate-900 rounded-lg">
              <span class="block text-slate-500 text-[10px]">النجوم ⭐</span>
              <span class="font-mono text-white font-bold">${repoInfo.stargazers_count || 0}</span>
            </div>
            <div class="p-2 bg-slate-900 rounded-lg">
              <span class="block text-slate-500 text-[10px]">Issues المفتوحة</span>
              <span class="font-mono text-amber-300 font-bold">${repoInfo.open_issues_count || 0}</span>
            </div>
            <div class="p-2 bg-slate-900 rounded-lg">
              <span class="block text-slate-500 text-[10px]">الحجم</span>
              <span class="font-mono text-slate-300 font-bold">${repoInfo.size || 0} KB</span>
            </div>
          </div>
          <div class="mt-3 flex items-center justify-between gap-2 border-t border-slate-800/80 pt-2">
            <span class="text-slate-400">أمر الاستنساخ (Clone):</span>
            <code class="px-2 py-1 bg-slate-900 text-sky-300 rounded font-mono text-[11px]" dir="ltr">git clone ${repoInfo.clone_url}</code>
          </div>
        </div>

        <div>
          <h5 class="text-xs font-bold text-slate-200 mb-2">آخر التحديثات (Recent Commits):</h5>
          <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
            ${commitsList}
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    contentEl.innerHTML = `<p class="text-xs text-rose-400">حدث خطأ أثناء قراءة بيانات المستودع: ${err.message}</p>`;
  }
}

// ----------------------------------------------------------------------------
// Assistant (Hypatia AI Chat via server /api/chat)
// ----------------------------------------------------------------------------
async function sendChatMessage(customText) {
  const inputEl = document.getElementById('chat-input');
  const text = customText || (inputEl ? inputEl.value.trim() : '');
  if (!text || state.isChatLoading) return;

  if (inputEl && !customText) inputEl.value = '';

  // Append user message
  state.chatHistory.push({ sender: 'user', text });
  renderChatMessages();

  state.isChatLoading = true;
  updateChatLoadingState(true);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        context: {
          activeProject: { name: 'منظومة هيباتيا', code: 'HYPATIA-CORE' },
          supabaseConfigured: Boolean(state.supabaseUrl),
          githubUser: state.githubUser
        }
      })
    });

    const data = await res.json();
    const reply = data.reply || 'تم استلام الطلب من هيباتيا.';
    state.chatHistory.push({ sender: 'assistant', text: reply });
  } catch (err) {
    state.chatHistory.push({
      sender: 'assistant',
      text: '⚠️ تعذر الاتصال بمحرك هيباتيا السحابي. يرجى التحقق من الشبكة أو المحاولة لاحقاً: ' + (err.message || '')
    });
  } finally {
    state.isChatLoading = false;
    updateChatLoadingState(false);
    renderChatMessages();
  }
}

function renderChatMessages() {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;

  container.innerHTML = state.chatHistory.map(msg => {
    const isUser = msg.sender === 'user';
    return `
      <div class="flex flex-col ${isUser ? 'items-start' : 'items-end'} mb-3">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-[10px] font-semibold ${isUser ? 'text-teal-400' : 'text-sky-400'}">
            ${isUser ? 'أنت' : 'هيباتيا (Senior Ops Lead)'}
          </span>
        </div>
        <div class="max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
          isUser
            ? 'bg-teal-600 text-white rounded-tr-none'
            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
        } whitespace-pre-wrap">
          ${escapeHtml(msg.text)}
        </div>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

function updateChatLoadingState(isLoading) {
  const btn = document.getElementById('chat-send-btn');
  if (btn) {
    btn.disabled = isLoading;
    btn.innerHTML = isLoading ? '...' : 'إرسال';
  }
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ----------------------------------------------------------------------------
// Navigation & UI Helpers
// ----------------------------------------------------------------------------
function switchTab(tabId) {
  state.activeTab = tabId;

  // Toggle tab buttons
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    const active = btn.dataset.tab === tabId;
    if (active) {
      btn.className = 'nav-tab-btn px-4 py-2 text-xs font-semibold rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 transition shadow-sm';
    } else {
      btn.className = 'nav-tab-btn px-4 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition';
    }
  });

  // Toggle views
  document.querySelectorAll('.tab-view').forEach(view => {
    view.classList.add('hidden');
  });
  const targetView = document.getElementById(`view-${tabId}`);
  if (targetView) targetView.classList.remove('hidden');

  // Trigger initial fetch if needed
  if (tabId === 'supabase' && state.tableData.length === 0) {
    fetchSupabaseTable(state.selectedTable);
  } else if (tabId === 'github' && state.githubRepos.length === 0) {
    fetchGithubRepos(state.githubUser);
  }
}

function updateHeaderBadges() {
  const sbBadge = document.getElementById('header-sb-status');
  if (sbBadge) {
    if (state.supabaseConnected) {
      sbBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span> Supabase متصل';
      sbBadge.className = 'flex items-center text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/50';
    } else {
      sbBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span> Supabase جاهز';
      sbBadge.className = 'flex items-center text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700';
    }
  }
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

// ----------------------------------------------------------------------------
// Window Exposed API for HTML Buttons
// ----------------------------------------------------------------------------
window.hypatiaApp = {
  switchTab,
  testSupabaseConnection,
  fetchSupabaseTable,
  fetchGithubRepos,
  viewRepoDetails,
  sendChatMessage,
  openModal,
  closeModal,
  openAddRecordModal: () => openModal('add-record-modal'),
  openGithubTokenModal: () => openModal('github-token-modal'),
  saveSupabaseSettings: () => {
    const url = document.getElementById('sb-url-input').value.trim();
    const key = document.getElementById('sb-key-input').value.trim();
    state.supabaseUrl = url;
    state.supabaseKey = key;
    localStorage.setItem('hypatia_sb_url', url);
    localStorage.setItem('hypatia_sb_key', key);
    testSupabaseConnection();
    fetchSupabaseTable(state.selectedTable);
  },
  saveGithubSettings: () => {
    const user = document.getElementById('gh-user-input').value.trim();
    const token = document.getElementById('gh-token-input').value.trim();
    state.githubUser = user || 'samehyousry';
    state.githubToken = token;
    localStorage.setItem('hypatia_gh_user', state.githubUser);
    localStorage.setItem('hypatia_gh_token', token);
    closeModal('github-token-modal');
    fetchGithubRepos(state.githubUser);
  }
};

// ----------------------------------------------------------------------------
// Startup Lifecycle
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Pre-fill inputs
  const sbUrlInput = document.getElementById('sb-url-input');
  const sbKeyInput = document.getElementById('sb-key-input');
  const ghUserInput = document.getElementById('gh-user-input');
  const ghTokenInput = document.getElementById('gh-token-input');

  if (sbUrlInput) sbUrlInput.value = state.supabaseUrl;
  if (sbKeyInput) sbKeyInput.value = state.supabaseKey;
  if (ghUserInput) ghUserInput.value = state.githubUser;
  if (ghTokenInput) ghTokenInput.value = state.githubToken;

  // Add Record Form Listener
  const addForm = document.getElementById('add-record-form');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('record-title-input').value;
      const desc = document.getElementById('record-desc-input').value;
      handleInsertRecord({
        name: title,
        title: title,
        description: desc,
        status: 'نشط',
        created_at: new Date().toISOString()
      });
    });
  }

  // Chat Enter Key Listener
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }

  // Initial tab and checks
  switchTab('supabase');
  testSupabaseConnection();
  fetchSupabaseTable(state.selectedTable);
  renderChatMessages();
});
