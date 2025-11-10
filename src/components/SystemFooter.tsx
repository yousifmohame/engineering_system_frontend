import React from 'react';
import { Badge } from './ui/badge';
import { 
  CheckCircle, 
  Shield, 
  Zap, 
  Users, 
  Building, 
  FileText,
  BarChart3,
  Globe,
  Clock,
  Award,
  Wifi,
  MapPin,
  Database,
  HardDrive
} from 'lucide-react';

interface SystemFooterProps {
  systemVersion?: string;
  lastUpdate?: string;
  serverStatus?: string;
  databaseStatus?: string;
  backupStatus?: string;
  variant?: 'minimal' | 'compact' | 'full';
  showFeatures?: boolean;
  className?: string;
}

export default function SystemFooter({ 
  systemVersion = 'v5.0',
  lastUpdate = '23/09/2025',
  serverStatus = 'متصل',
  databaseStatus = 'نشط',
  backupStatus = 'محدث',
  variant = 'compact', 
  showFeatures = false, 
  className = '' 
}: SystemFooterProps) {
  
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('ar-SA', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  const currentTime = new Date().toLocaleTimeString('ar-SA', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  if (variant === 'minimal') {
    return (
      <footer className={`system-footer-minimal ${className}`} dir="rtl">
        <div className="container mx-auto px-6">
          <p style={{ fontFamily: 'Tajawal, sans-serif' }}>
            نظام إدارة الأعمال الهندسية {systemVersion}
            <span className="footer-separator">•</span>
            {currentYear}
          </p>
        </div>
      </footer>
    );
  }

  if (variant === 'compact') {
    // تحديد حالة النظام (Online/Offline)
    const isOnline = serverStatus === 'متصل' || serverStatus === 'نشط';
    
    return (
      <footer 
        className={`system-footer bg-white border-t border-gray-200 shadow-sm ${className}`} 
        style={{ 
          height: '32px', 
          minHeight: '32px', 
          maxHeight: '32px',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40
        }}
        dir="rtl"
      >
        <div className="h-full px-4 flex items-center justify-between" style={{ fontSize: '11px' }}>
          
          {/* القسم الأيمن - حالة النظام (Online/Offline) وقاعدة البيانات */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* حالة النظام - منقولة من الهيدر */}
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-gray-700" style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-1">
              <Database className="h-3 w-3 text-green-600" />
              <span className="text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                قاعدة البيانات: <span className="text-green-600 font-semibold">{databaseStatus}</span>
              </span>
            </div>
          </div>

          {/* القسم الأوسط - اسم النظام والحقوق والإصدار */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            <span className="text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
              نظام إدارة الأعمال الهندسية
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
              جميع الحقوق محفوظة © {currentYear}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
              الإصدار: <span className="text-blue-600 font-semibold">{systemVersion}</span>
            </span>
          </div>

          {/* القسم الأيسر - أيقونات التكاملات */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Shield className="h-3.5 w-3.5 text-green-500" />
            <div className="flex gap-1.5">
              {['WPS', 'قوى', 'GOSI', 'ZATCA'].map((standard, index) => (
                <Badge 
                  key={index} 
                  className="bg-green-100 text-green-700 border-green-200 px-2 py-0.5 hover:bg-green-200 transition-colors cursor-pointer" 
                  style={{ fontSize: '10px', height: '20px', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <CheckCircle className="h-2.5 w-2.5" />
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{standard}</span>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // variant === 'full'
  return (
    <footer className={`system-footer-full footer-animation ${className}`} dir="rtl">
      <div className="container mx-auto px-6">
        
        {/* Header معلومات النظام */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                نظام إدارة الأعمال الهندسية الشامل
              </h3>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                Work Management System v4.0 - المواصفات التنفيذية
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Badge className="footer-version-badge footer-badge">
              <Zap className="h-3 w-3" />
              WMS v4.0
            </Badge>
            
            <Badge className="footer-status-badge footer-badge">
              <CheckCircle className="h-3 w-3" />
              النظام نشط
            </Badge>
            
            <Badge className="footer-dev-badge footer-badge">
              <Shield className="h-3 w-3" />
              مطور محلياً
            </Badge>
            
            <Badge className="footer-badge" style={{ 
              background: 'rgba(168, 85, 247, 0.1)', 
              border: '1px solid rgba(168, 85, 247, 0.2)', 
              color: '#7c3aed' 
            }}>
              <Award className="h-3 w-3" />
              معتمد
            </Badge>
          </div>
        </div>

        {/* ميزات النظام إذا كانت مطلوبة */}
        {showFeatures && (
          <div className="footer-features-grid">
            <div className="footer-feature-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إدارة المعاملات
                </h4>
              </div>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                30 تبويب متخصص لإدارة شاملة للمعاملات الهندسية
              </p>
            </div>

            <div className="footer-feature-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الموارد البشرية
                </h4>
              </div>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                نظام متكامل وفق المعايير السعودية ونظام العمل
              </p>
            </div>

            <div className="footer-feature-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نظام ERP مدمج
                </h4>
              </div>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تخطيط موارد المؤسسة كشاشة داخلية متكاملة
              </p>
            </div>

            <div className="footer-feature-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Globe className="h-4 w-4 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  التكاملات الرقمية
                </h4>
              </div>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                ربط مع منصة قوى وGOSI وWPS والخدمات الحكومية
              </p>
            </div>
          </div>
        )}

        {/* المميزات السريعة */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-center flex-wrap gap-6">
            <div className="footer-feature-item">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span style={{ fontFamily: 'Tajawal, sans-serif' }}>850+ صلاحية مفصلة</span>
            </div>
            
            <div className="footer-feature-item">
              <Shield className="h-4 w-4 text-blue-500" />
              <span style={{ fontFamily: 'Tajawal, sans-serif' }}>أمان متقدم</span>
            </div>
            
            <div className="footer-feature-item">
              <Clock className="h-4 w-4 text-purple-500" />
              <span style={{ fontFamily: 'Tajawal, sans-serif' }}>تتبع زمني شامل</span>
            </div>
            
            <div className="footer-feature-item">
              <FileText className="h-4 w-4 text-orange-500" />
              <span style={{ fontFamily: 'Tajawal, sans-serif' }}>أرشفة رقمية</span>
            </div>
            
            <div className="footer-feature-item">
              <BarChart3 className="h-4 w-4 text-red-500" />
              <span style={{ fontFamily: 'Tajawal, sans-serif' }}>تقارير تفاعلية</span>
            </div>
          </div>
        </div>

        {/* معلومات التذييل النهائية */}
        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="footer-system-info">
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
              © {currentYear} نظام إدارة الأعمال الهندسية الشامل v4.0
            </span>
            <span className="footer-separator">•</span>
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>المواصفات التنفيذية الإصدار v4.0</span>
            <span className="footer-separator">•</span>
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>دعم RTL كامل</span>
            <span className="footer-separator">•</span>
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>خط Tajawal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}