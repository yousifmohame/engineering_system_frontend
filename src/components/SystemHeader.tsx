import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Activity, 
  Clock, 
  Wifi,
  User,
  Users,
  Monitor,
  Building2,
  Shield,
  CheckCircle,
  Globe,
  Brain,
  History,
  Calendar,
  MapPin,
  Smartphone,
  Chrome,
  ExternalLink,
  X,
  ChevronRight,
  Home,
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  Bell,
  FileText,
  AlertCircle,
  Settings,
  LogIn
} from 'lucide-react';

interface SystemHeaderProps {
  officeName?: string;
  logoUrl?: string;
  currentUser?: string;
  userJobTitle?: string;
  userFirstName?: string;
  userLastName?: string;
  userIP?: string;
  systemVersion?: string;
  lastLoginTime?: string;
  onNavigateToHome?: () => void;
  navigationHistory?: any[];
  futureHistory?: any[];
  currentPath?: any[];
  activeScreen?: string;
  unreadNotificationsCount?: number;
  onNavigateBack?: () => void;
  onNavigateForward?: () => void;
  onShowAdvancedSearch?: () => void;
  onShowNotifications?: () => void;
  onShowSystemInfo?: () => void;
  onShowTransactionInfo?: () => void;
  onShowTaskInfo?: () => void;
  onShowUrgentInfo?: () => void;
}

export default function SystemHeader({
  officeName = "مكتب الهندسة المتكامل",
  logoUrl = "/logo.png",
  currentUser = "المهندس أحمد العلي",
  userJobTitle = "المهندس",
  userFirstName = "أحمد",
  userLastName = "العلي",
  userIP = "192.168.1.100",
  systemVersion = "v5.0",
  lastLoginTime = "14:30 - 23/09/2025",
  onNavigateToHome,
  navigationHistory = [],
  futureHistory = [],
  currentPath = [],
  activeScreen = '',
  unreadNotificationsCount = 13,
  onNavigateBack,
  onNavigateForward,
  onShowAdvancedSearch,
  onShowNotifications,
  onShowSystemInfo,
  onShowTransactionInfo,
  onShowTaskInfo,
  onShowUrgentInfo
}: SystemHeaderProps) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [sessionStartTime] = useState(new Date()); // وقت بداية الجلسة
  const [sessionDuration, setSessionDuration] = useState({ hours: 0, minutes: 0, seconds: 0 }); // عداد الجلسة
  const [systemUptime, setSystemUptime] = useState(99.9);
  const [serverStatus, setServerStatus] = useState({
    cpu: 12,
    ram: 28,
    disk: 5,
    network: 'متصل'
  });
  const [showLoginHistoryModal, setShowLoginHistoryModal] = useState(false);
  const [showOnlineUsersModal, setShowOnlineUsersModal] = useState(false);

  // بيانات المستخدمين المتصلين حالياً
  const onlineUsers = [
    {
      id: 1,
      name: 'أحمد العلي',
      jobTitle: 'المهندس',
      status: 'نشط',
      avatar: 'A',
      lastActivity: 'الآن',
      sessionDuration: '3س 45د',
      location: 'الرياض'
    },
    {
      id: 2,
      name: 'محمد السعيد',
      jobTitle: 'مدير المشاريع',
      status: 'نشط',
      avatar: 'M',
      lastActivity: 'منذ 2 د',
      sessionDuration: '1س 20د',
      location: 'جدة'
    },
    {
      id: 3,
      name: 'فاطمة الأحمد',
      jobTitle: 'محاسب',
      status: 'نشط',
      avatar: 'F',
      lastActivity: 'منذ 5 د',
      sessionDuration: '45د',
      location: 'الدمام'
    },
    {
      id: 4,
      name: 'خالد المطيري',
      jobTitle: 'مهندس تصميم',
      status: 'مشغول',
      avatar: 'K',
      lastActivity: 'منذ 1 د',
      sessionDuration: '2س 10د',
      location: 'الرياض'
    },
    {
      id: 5,
      name: 'نورة العتيبي',
      jobTitle: 'سكرتارية',
      status: 'نشط',
      avatar: 'N',
      lastActivity: 'منذ 3 د',
      sessionDuration: '4س 30د',
      location: 'الرياض'
    }
  ];

  // بيانات سجل تسجيل الدخول - آخر 5 مرات
  const loginHistory = [
    {
      id: 1,
      datetime: '2025-09-23 14:30:25',
      duration: '3س 45د',
      ipAddress: '192.168.1.100',
      location: 'الرياض، السعودية',
      browser: 'Chrome 118.0',
      device: 'Windows 11 Pro',
      status: 'نشط حالياً',
      statusColor: 'green',
      loginMethod: 'كلمة مرور',
      sessionId: 'SES-20250923-001'
    },
    {
      id: 2,
      datetime: '2025-09-22 09:15:12',
      duration: '8س 20د',
      ipAddress: '192.168.1.100',
      location: 'الرياض، السعودية',
      browser: 'Chrome 118.0',
      device: 'Windows 11 Pro',
      status: 'تم تسجيل الخروج',
      statusColor: 'gray',
      loginMethod: 'كلمة مرور',
      sessionId: 'SES-20250922-001'
    },
    {
      id: 3,
      datetime: '2025-09-21 13:42:08',
      duration: '4س 15د',
      ipAddress: '192.168.1.102',
      location: 'الرياض، السعودية',
      browser: 'Firefox 118.0',
      device: 'Android 14',
      status: 'تم تسجيل الخروج',
      statusColor: 'gray',
      loginMethod: 'كلمة مرور',
      sessionId: 'SES-20250921-001'
    },
    {
      id: 4,
      datetime: '2025-09-20 10:30:45',
      duration: '7س 30د',
      ipAddress: '192.168.1.100',
      location: 'الرياض، السعودية',
      browser: 'Chrome 117.0',
      device: 'Windows 11 Pro',
      status: 'تم تسجيل الخروج',
      statusColor: 'gray',
      loginMethod: 'مصادقة ثنائية',
      sessionId: 'SES-20250920-001'
    },
    {
      id: 5,
      datetime: '2025-09-19 08:45:18',
      duration: '9س 10د',
      ipAddress: '192.168.1.100',
      location: 'الرياض، السعودية',
      browser: 'Chrome 117.0',
      device: 'Windows 11 Pro',
      status: 'تم تسجيل الخروج',
      statusColor: 'gray',
      loginMethod: 'كلمة مرور',
      sessionId: 'SES-20250919-001'
    }
  ];

  // وظيفة لفتح شاشة ملف الموظف - تاب تاريخ تسجيل الدخول
  const handleViewFullHistory = () => {
    setShowLoginHistoryModal(false);
    // هنا يمكن إضافة منطق التنقل إلى شاشة ملف الموظف
    alert('سيتم التنقل إلى شاشة ملف الموظف - تبويب تاريخ تسجيل الدخول');
  };

  // وظيفة لتحويل التاريخ إلى تنسيق عربي
  const formatArabicDateTime = (dateString) => {
    const date = new Date(dateString);
    const toArabicNumbers = (num) => {
      const arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return num.toString().replace(/\d/g, (digit) => arabicNums[parseInt(digit)]);
    };

    const day = toArabicNumbers(date.getDate().toString().padStart(2, '0'));
    const month = toArabicNumbers((date.getMonth() + 1).toString().padStart(2, '0'));
    const year = toArabicNumbers(date.getFullYear());
    const hours = toArabicNumbers(date.getHours().toString().padStart(2, '0'));
    const minutes = toArabicNumbers(date.getMinutes().toString().padStart(2, '0'));

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  // تحديث الوقت وعداد الجلسة كل ثانية
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
      
      // حساب مدة الجلسة
      const now = new Date();
      const diff = now.getTime() - sessionStartTime.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      
      setSessionDuration({
        hours: hours,
        minutes: minutes % 60,
        seconds: seconds % 60
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStartTime]);

  // تحديث إحصائيات الخادم كل 30 ثانية
  useEffect(() => {
    const statsTimer = setInterval(() => {
      setServerStatus(prev => ({
        cpu: Math.floor(Math.random() * 20) + 5, // 5-25%
        ram: Math.floor(Math.random() * 15) + 20, // 20-35%  
        disk: Math.floor(Math.random() * 10) + 2, // 2-12%
        network: 'متصل'
      }));
      setSystemUptime(prev => Math.min(99.9, prev + 0.01));
    }, 30000);

    return () => clearInterval(statsTimer);
  }, []);

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  const getStatusColor = (value: number, thresholds: { warning: number; danger: number }) => {
    if (value >= thresholds.danger) return 'text-red-500';
    if (value >= thresholds.warning) return 'text-yellow-500';
    return 'text-green-500';
  };

  // دالة لتحويل الأرقام إلى العربية
  const toArabicNumbers = (num: number | string) => {
    const arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().replace(/\d/g, (digit) => arabicNums[parseInt(digit)]);
  };

  return (
    <header 
      className="bg-gradient-to-l from-gray-50 via-blue-50 to-indigo-50 border-b-2 border-blue-200 shadow-md"
      style={{ 
        height: '40px', 
        minHeight: '40px', 
        maxHeight: '40px', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '2px 12px',
        gap: '0'
      }}
      dir="rtl"
    >
      {/* السطر الوحيد: المعلومات الأساسية - 36px */}
      <div className="flex items-center justify-between" style={{ 
        height: '36px', 
        minHeight: '36px', 
        maxHeight: '36px',
        flex: '0 0 36px',
        gap: '12px'
      }}>
          {/* القسم الأيمن - اللوجو واسم المكتب والنظام */}
          <div className="flex items-center flex-shrink-0" style={{ gap: '8px', minWidth: 0, maxWidth: '28%' }}>
            <div style={{
              width: '30px',
              height: '30px',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.25)',
              flexShrink: 0,
              cursor: 'pointer'
            }}
            onClick={onNavigateToHome}
            title="الصفحة الرئيسية"
            >
              <Building2 style={{ width: '16px', height: '16px', color: '#ffffff' }} />
            </div>
            <div className="flex flex-col justify-center min-w-0" style={{ gap: '0' }}>
              <span className="truncate" style={{ 
                fontFamily: 'Tajawal, sans-serif', 
                fontWeight: 700, 
                color: '#1f2937', 
                fontSize: '10.5px',
                lineHeight: '13px'
              }} title={officeName}>
                {officeName}
              </span>
              <span className="text-gray-600 truncate" style={{ 
                fontFamily: 'Tajawal, sans-serif', 
                fontSize: '8.5px',
                lineHeight: '11px'
              }}>
                نظام إدارة شامل {systemVersion}
              </span>
            </div>
          </div>

          {/* القسم الأوسط - التاريخ الهجري والميلادي */}
          <div className="flex items-center bg-white/80 rounded-lg shadow-sm border border-blue-200 flex-shrink-0" style={{ 
            padding: '3px 10px',
            gap: '6px',
            height: '30px'
          }}>
            <Clock style={{ width: '13px', height: '13px', color: '#2563eb', flexShrink: 0 }} />
            <div className="flex flex-col items-center justify-center" style={{ fontFamily: 'Tajawal, sans-serif', gap: '0' }}>
              <div className="text-blue-700 whitespace-nowrap" style={{ fontWeight: 600, fontSize: '8.5px', lineHeight: '10px' }}>
                {(() => {
                  // تحويل التاريخ الميلادي إلى هجري (تقريبي)
                  const toHijri = (gregorianDate) => {
                    const hijriEpoch = new Date('622-07-16');
                    const diffTime = gregorianDate.getTime() - hijriEpoch.getTime();
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    const hijriYears = Math.floor(diffDays / 354.367);
                    const remainingDays = diffDays % 354.367;
                    const hijriMonth = Math.floor(remainingDays / 29.5) + 1;
                    const hijriDay = Math.floor(remainingDays % 29.5) + 1;
                    
                    return {
                      day: Math.max(1, Math.min(30, hijriDay)),
                      month: Math.max(1, Math.min(12, hijriMonth)),
                      year: 1 + hijriYears
                    };
                  };

                  const now = new Date();
                  const hijri = toHijri(now);
                  return `${toArabicNumbers(hijri.year)}/${toArabicNumbers(hijri.month.toString().padStart(2, '0'))}/${toArabicNumbers(hijri.day.toString().padStart(2, '0'))}هـ`;
                })()}
              </div>
              <div className="text-gray-700 whitespace-nowrap" style={{ fontSize: '8.5px', lineHeight: '10px' }}>
                {toArabicNumbers(currentDateTime.getFullYear())}/
                {toArabicNumbers((currentDateTime.getMonth() + 1).toString().padStart(2, '0'))}/
                {toArabicNumbers(currentDateTime.getDate().toString().padStart(2, '0'))}م
              </div>
            </div>
          </div>

          {/* القسم الأيسر - معلومات المستخدم وعداد الجلسة والمستخدمين النشطين */}
          <div className="flex items-center flex-shrink-0" style={{ gap: '6px', minWidth: 0, maxWidth: '42%' }}>
            {/* معلومات المستخدم */}
            <div className="flex items-center bg-white/80 rounded-lg shadow-sm border border-blue-200 min-w-0" style={{ 
              padding: '3px 8px',
              gap: '5px',
              height: '30px'
            }}>
              <User style={{ width: '13px', height: '13px', color: '#2563eb', flexShrink: 0 }} />
              <div className="flex flex-col justify-center min-w-0" style={{ gap: '0' }}>
                <div className="flex items-center min-w-0" style={{ gap: '4px' }}>
                  <span className="bg-blue-100 text-blue-800 rounded flex-shrink-0" style={{ 
                    fontFamily: 'Tajawal, sans-serif', 
                    fontWeight: 600, 
                    padding: '1px 3px', 
                    fontSize: '7.5px',
                    lineHeight: '9px'
                  }}>
                    {userJobTitle}
                  </span>
                  <span className="text-blue-700 truncate" style={{ 
                    fontFamily: 'Tajawal, sans-serif', 
                    fontWeight: 700, 
                    fontSize: '9.5px',
                    lineHeight: '11px'
                  }} title={`${userFirstName} ${userLastName}`}>
                    {userFirstName} {userLastName}
                  </span>
                </div>
                <span className="text-gray-600 truncate" style={{ 
                  fontFamily: 'Tajawal, sans-serif', 
                  fontSize: '7px',
                  lineHeight: '8px'
                }}>
                  آخر دخول: {lastLoginTime}
                </span>
              </div>
            </div>

            {/* عداد الجلسة */}
            <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-300 flex-shrink-0" style={{ 
              padding: '3px 7px',
              gap: '5px',
              height: '30px'
            }}>
              <Clock style={{ width: '13px', height: '13px', color: '#059669', flexShrink: 0 }} />
              <div className="flex flex-col items-center justify-center" style={{ gap: '0' }}>
                <span className="text-gray-600 whitespace-nowrap" style={{ 
                  fontFamily: 'Tajawal, sans-serif', 
                  fontSize: '6.5px',
                  lineHeight: '8px'
                }}>
                  مدة الجلسة
                </span>
                <span className="text-green-700 font-mono whitespace-nowrap" style={{ 
                  fontWeight: 700, 
                  fontSize: '9.5px',
                  lineHeight: '11px'
                }}>
                  {toArabicNumbers(sessionDuration.hours)}س {toArabicNumbers(sessionDuration.minutes)}د
                </span>
              </div>
            </div>

            {/* المستخدمين المتصلين حالياً */}
            <Dialog open={showOnlineUsersModal} onOpenChange={setShowOnlineUsersModal}>
              <DialogTrigger asChild>
                <div className="flex items-center bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg shadow-sm border border-purple-300 cursor-pointer hover:shadow-md transition-all duration-200 flex-shrink-0" style={{ 
                  padding: '3px 7px',
                  gap: '5px',
                  height: '30px'
                }}>
                  <Users style={{ width: '13px', height: '13px', color: '#7c3aed', flexShrink: 0 }} />
                  <div className="flex flex-col items-center justify-center" style={{ gap: '0' }}>
                    <span className="text-gray-600 whitespace-nowrap" style={{ 
                      fontFamily: 'Tajawal, sans-serif', 
                      fontSize: '6.5px',
                      lineHeight: '8px'
                    }}>
                      نشطين
                    </span>
                    <span className="text-purple-700 whitespace-nowrap" style={{ 
                      fontFamily: 'Tajawal, sans-serif', 
                      fontWeight: 700, 
                      fontSize: '9.5px',
                      lineHeight: '11px'
                    }}>
                      {toArabicNumbers(onlineUsers.length)}
                    </span>
                  </div>
                </div>
              </DialogTrigger>
              
              {/* نافذة المستخدمين المتصلين */}
              <DialogContent className="max-w-3xl dialog-rtl" dir="rtl">
                <DialogHeader className="dialog-header">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="dialog-title flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Users className="h-5 w-5 text-purple-600" />
                      المستخدمين المتصلين حالياً ({onlineUsers.length})
                    </DialogTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowOnlineUsersModal(false)}
                      className="button-rtl h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogHeader>
                
                <div className="space-y-3">
                  {onlineUsers.map((user) => (
                    <div 
                      key={user.id}
                      className="p-4 border rounded-lg bg-gradient-to-r from-white to-purple-50 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: '18px' }}>
                          {user.avatar}
                        </div>
                        
                        {/* معلومات المستخدم */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1f2937' }}>
                              {user.name}
                            </span>
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                              {user.jobTitle}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${user.status === 'نشط' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                              {user.status}
                            </span>
                            <span>•</span>
                            <span>{user.lastActivity}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {user.sessionDuration}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {user.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setShowOnlineUsersModal(false)}
                    className="button-rtl"
                  >
                    إغلاق
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
    </header>
  );
}
