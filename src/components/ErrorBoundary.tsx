import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React error in Hypatia app:', error, errorInfo);
  }

  private handleResetCache = () => {
    try {
      localStorage.removeItem('hypatia_projects_data');
      localStorage.removeItem('hypatia_active_project_id');
      localStorage.removeItem('hypatia_tasks_data');
      localStorage.removeItem('hypatia_contracts_data');
      localStorage.removeItem('hypatia_mashweer_emails');
      localStorage.removeItem('hypatia_service_providers');
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-['Cairo',sans-serif]" dir="rtl">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-white">حدث استثناء أثناء تحميل الواجهة</h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              واجه التطبيق خطأ غير متوقع في الذاكرة المؤقتة. يمكنك إعادة التحميل أو إعادة تعيين الذاكرة المحلية لاستعادة البيانات السليمة تلقائياً.
            </p>
            {this.state.error?.message && (
              <div className="text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 text-rose-400 font-mono text-left max-h-24 overflow-y-auto" dir="ltr">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-semibold transition"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة تحميل الصفحة
              </button>
              <button
                onClick={this.handleResetCache}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                مسح الكاش والمزامنة
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
