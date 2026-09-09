import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  Layers, 
  Sparkles,
  Calendar,
  Filter
} from 'lucide-react';
import { ProjectTask, ProjectItem } from '../types';

interface TasksTabProps {
  tasks: ProjectTask[];
  projects: ProjectItem[];
  activeProject: ProjectItem;
  onAddTask: (task: ProjectTask) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAskEmo: (prompt: string) => void;
}

export const TasksTab: React.FC<TasksTabProps> = ({
  tasks,
  projects,
  activeProject,
  onAddTask,
  onToggleTaskStatus,
  onDeleteTask,
  onAskEmo,
}) => {
  const [filter, setFilter] = useState<'all' | 'active_project' | 'urgent' | 'completed'>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskProjectId, setTaskProjectId] = useState(activeProject.id);
  const [taskPriority, setTaskPriority] = useState<'عاجل' | 'متوسط' | 'منخفض'>('عاجل');
  const [taskDueDate, setTaskDueDate] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask: ProjectTask = {
      id: `task-${Date.now()}`,
      projectId: taskProjectId,
      title: taskTitle.trim(),
      description: taskDescription.trim() || undefined,
      priority: taskPriority,
      status: 'قيد الانتظار',
      createdAt: 'اليوم',
      dueDate: taskDueDate.trim() || 'قريباً',
    };

    onAddTask(newTask);
    setTaskTitle('');
    setTaskDescription('');
    setTaskDueDate('');
    setIsAddingTask(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active_project') return t.projectId === activeProject.id;
    if (filter === 'urgent') return t.priority === 'عاجل' && t.status !== 'مكتمل';
    if (filter === 'completed') return t.status === 'مكتمل';
    return true;
  });

  const getProjectName = (projId: string) => {
    const p = projects.find((x) => x.id === projId);
    return p ? p.name : 'تطبيق غير محدد';
  };

  return (
    <div className="space-y-4 pb-16 max-w-3xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div>
          <h1 className="text-base font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-400" />
            <span>إضافة ومتابعة المهام ({tasks.length})</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            توزيع ومتابعة المهام البرمجية والفحص لكل تطبيق
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-950/40 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isAddingTask ? 'إغلاق النموذج' : 'إضافة مهمة جديدة'}</span>
          </button>
        </div>
      </div>

      {/* Add Task Collapsible Form */}
      {isAddingTask && (
        <form
          onSubmit={handleCreateTask}
          className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-emerald-400">نموذج إضافة مهمة جديدة:</span>
            <span className="text-[10px] text-slate-400">ستسجل فوراً في قائمة المتابعة</span>
          </div>

          <div>
            <label className="block text-[11px] text-slate-300 mb-1">عنوان المهمة:</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="مثال: فحص شاشات الدفع في تطبيق فور بي والتأكد من دعم Apple Pay"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">التطبيق التابع له:</label>
              <select
                value={taskProjectId}
                onChange={(e) => setTaskProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 mb-1">الأولوية:</label>
              <select
                value={taskPriority}
                onChange={(e: any) => setTaskPriority(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="عاجل">🔴 عاجل</option>
                <option value="متوسط">🟡 متوسط</option>
                <option value="منخفض">🟢 منخفض</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 mb-1">الموعد المستهدف:</label>
              <input
                type="text"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                placeholder="مثلاً: اليوم 6 مساءً أو غداً"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-300 mb-1">تفاصيل إضافية أو ملاحظات:</label>
            <input
              type="text"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="ملاحظات تفصيلية للمهمة..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md"
            >
              حفظ المهمة
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs & AI Helper */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800 text-xs shrink-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-xl transition ${
              filter === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الكل ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('active_project')}
            className={`px-3 py-1 rounded-xl transition ${
              filter === 'active_project'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {activeProject.name}
          </button>
          <button
            onClick={() => setFilter('urgent')}
            className={`px-3 py-1 rounded-xl transition ${
              filter === 'urgent'
                ? 'bg-rose-500 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            العاجلة فقط
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-xl transition ${
              filter === 'completed'
                ? 'bg-slate-700 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            المكتملة
          </button>
        </div>

        <button
          onClick={() =>
            onAskEmo(
              `حلل لي قائمة المهام الحالية واقترح خطة تنفيذ لأول 3 مهام حرجة يجب الانتهاء منها اليوم.`
            )
          }
          className="px-3 py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>ترتيب الأولويات مع إيمو</span>
        </button>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-10 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 text-xs text-slate-500">
          لا توجد مهام تطابق هذا الفلتر حالياً. اضغط "إضافة مهمة جديدة" للبدء.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'مكتمل';

            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition flex items-start justify-between gap-3 ${
                  isCompleted
                    ? 'bg-slate-950/50 border-slate-800/60 opacity-60'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => onToggleTaskStatus(task.id)}
                    className={`mt-0.5 p-1 rounded-lg transition ${
                      isCompleted
                        ? 'bg-emerald-500 text-slate-950'
                        : 'border border-slate-700 hover:border-emerald-400 text-transparent hover:text-slate-500'
                    }`}
                    title={isCompleted ? 'إعادة إلى قيد العمل' : 'تحديد كمكتمل'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-bold leading-snug ${
                          isCompleted ? 'line-through text-slate-500' : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 font-medium">
                        {getProjectName(task.projectId)}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                          task.priority === 'عاجل'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>أضيف: {task.createdAt}</span>
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-amber-400/90 font-medium">
                          <Calendar className="w-3 h-3" />
                          <span>التسليم: {task.dueDate}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="حذف المهمة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
