/**
 * Error Boundary Component
 * يمنع تعطل التطبيق بالكامل عند حدوث أخطاء
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // إعادة تحميل الصفحة
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6"
          dir="rtl"
        >
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl border-2 border-red-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <AlertCircle className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    عذراً، حدث خطأ غير متوقع
                  </h1>
                  <p className="text-red-100 text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    نعتذر عن هذا الإزعاج، فريقنا يعمل على حل المشكلة
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-6 space-y-6">
              {/* رسالة الخطأ */}
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <AlertCircle className="h-5 w-5" />
                  تفاصيل الخطأ:
                </h3>
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-red-700 font-mono break-all">
                    {this.state.error?.message || 'خطأ غير معروف'}
                  </p>
                </div>
              </div>

              {/* معلومات إضافية */}
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                <h3 className="font-semibold text-orange-800 mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  ما الذي يمكنك فعله؟
                </h3>
                <ul className="space-y-2 text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>انقر على "إعادة المحاولة" لإعادة تحميل الصفحة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>انقر على "العودة للرئيسية" للذهاب إلى الصفحة الرئيسية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>إذا استمرت المشكلة، تواصل مع الدعم الفني</span>
                  </li>
                </ul>
              </div>

              {/* معلومات تقنية (قابلة للطي) */}
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                  <summary className="cursor-pointer font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    معلومات تقنية للمطورين
                  </summary>
                  <div className="bg-white rounded-lg p-4 border border-gray-200 mt-4">
                    <pre className="text-xs text-gray-700 overflow-auto max-h-64 font-mono whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}
            </div>

            {/* Footer - Actions */}
            <div className="px-8 py-6 bg-gray-50 border-t-2 border-gray-200 flex items-center justify-between gap-4">
              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Home className="h-5 w-5" />
                العودة للرئيسية
              </button>
              
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 shadow-lg"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <RefreshCw className="h-5 w-5" />
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;