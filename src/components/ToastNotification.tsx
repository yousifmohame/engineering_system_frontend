import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info, Bell } from 'lucide-react';

interface ToastNotificationProps {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
}

// ToastNotification Component حسب مواصفات Figma Maker AI Commands v5.0
const ToastNotification: React.FC<ToastNotificationProps> = ({
  id,
  message,
  type,
  duration = 5000,
  onRemove,
  position = 'center'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Show animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto remove after duration (default:5000ms)
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(id);
    }, 300);
  };

  const getIcon = () => {
    // Icon Placeholder width:24px height:24px
    const iconClasses = "h-6 w-6";
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClasses} text-white`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClasses} text-white`} />;
      case 'error':
        return <AlertCircle className={`${iconClasses} text-white`} />;
      case 'info':
      default:
        return <Info className={`${iconClasses} text-white`} />;
    }
  };

  const getBorderLeftColor = () => {
    // Variants: "info", "success", "warning", "error" with border-left color codes
    switch (type) {
      case 'success':
        return '#10b981'; // Success Green
      case 'warning':
        return '#f59e0b'; // Warning Yellow
      case 'error':
        return '#ef4444'; // Error Red
      case 'info':
      default:
        return '#2563eb'; // Primary Blue
    }
  };

  return (
    <div
      className={`
        toast-notification
        ${isVisible ? 'toast-visible' : 'toast-hidden'}
        ${isRemoving ? 'toast-removing' : ''}
        transform transition-all duration-300 ease-in-out
      `}
      style={{
        // Component "ToastNotification" width:320px height:auto padding:12px background:#323232 cornerRadius:4px layout:hstack spacing:12px
        width: '320px',
        minHeight: 'auto',
        padding: '12px',
        backgroundColor: '#323232', // background:#323232 حسب المواصفات
        borderRadius: '4px', // cornerRadius:4px
        borderLeft: `4px solid ${getBorderLeftColor()}`,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        marginBottom: '8px'
      }}
      dir="rtl"
    >
      {/* layout:hstack spacing:12px */}
      <div className="flex items-center gap-3" style={{ gap: '12px' }}>
        {/* Icon Placeholder width:24px height:24px */}
        <div className="flex-shrink-0" style={{ width: '24px', height: '24px' }}>
          {getIcon()}
        </div>

        {/* Text "{{message}}" font:Inter Regular size:14 color:#FFFFFF flex:1 */}
        <div className="flex-1 min-w-0">
          <p 
            style={{ 
              fontFamily: 'Tajawal, sans-serif', // استخدام Tajawal بدلاً من Inter
              fontSize: '14px',
              color: '#FFFFFF', // color:#FFFFFF حسب المواصفات
              fontWeight: '400',
              lineHeight: '1.4',
              margin: 0
            }}
          >
            {message}
          </p>
        </div>

        {/* Button "✕" width:24px height:24px onClick:HideSelf */}
        <button
          onClick={handleRemove}
          style={{
            width: '24px',
            height: '24px',
            background: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '2px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="إغلاق الإشعار"
        >
          ✕
        </button>
      </div>

      {/* شريط التقدم للمدة */}
      {duration > 0 && (
        <div 
          className="mt-2 w-full rounded-full h-1 overflow-hidden"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <div 
            className="h-full transition-all ease-linear"
            style={{
              backgroundColor: getBorderLeftColor(),
              animation: `toast-progress ${duration}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  );
};

// مكون حاوي الإشعارات المنبثقة - وفقاً لمواصفات Figma Maker AI Commands v5.0
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
  }>;
  onRemoveToast: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
  position = 'center'
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'center':
      default:
        // x:center y:calc(100vh - 120px) width:360px حسب المواصفات
        return 'left-1/2 transform -translate-x-1/2';
    }
  };

  const getPositionStyles = () => {
    if (position === 'center') {
      return {
        bottom: '120px', // y:calc(100vh - 120px)
        width: '360px',   // width:360px حسب المواصفات
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto' as const
      };
    }
    return {
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto' as const
    };
  };

  if (toasts.length === 0) return null;

  return (
    <div 
      className={`fixed z-50 pointer-events-none ${getPositionClasses()}`}
      style={getPositionStyles()}
    >
      {/* MainFrame ToastContainer حسب المواصفات */}
      <div 
        className="flex flex-col items-center space-y-2 pointer-events-auto"
        style={{
          padding: '0', // padding:0
          background: 'transparent', // background:transparent
          alignItems: 'center', // align:center
          gap: '8px' // spacing:8px
        }}
      >
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onRemove={onRemoveToast}
            position={position}
          />
        ))}
      </div>
    </div>
  );
};

// Hook لإدارة الإشعارات المنبثقة
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
  }>>([]);

  const addToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration: number = 5000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  const showSuccess = (message: string, duration?: number) => addToast(message, 'success', duration);
  const showError = (message: string, duration?: number) => addToast(message, 'error', duration);
  const showWarning = (message: string, duration?: number) => addToast(message, 'warning', duration);
  const showInfo = (message: string, duration?: number) => addToast(message, 'info', duration);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default ToastNotification;