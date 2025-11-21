import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Clock, 
  User,
  Users,
  Building2,
  MapPin,
  X,
  LogOut,
  Loader2,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '../api/employeeApi';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface SystemHeaderProps {
  officeName?: string;
  logoUrl?: string;
  onNavigateToHome?: () => void;
}

// Types
interface Employee {
  id: string;
  name: string;
  position: string;
  status: 'active' | 'inactive';
  department?: string;
}

interface OnlineUser {
  id: string;
  name: string;
  jobTitle: string;
  status: string;
  avatar: string;
  lastActivity: string;
  sessionDuration: string;
  location: string;
}

export default function SystemHeader({
  officeName = "مكتب الهندسة المتكامل",
  onNavigateToHome,
}: SystemHeaderProps) {
  const { user, logout } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [sessionStartTime] = useState(new Date());
  const [sessionDuration, setSessionDuration] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showOnlineUsersModal, setShowOnlineUsersModal] = useState(false);

  // Fetch employees
  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery<Employee[]>({
    queryKey: ['activeEmployees'],
    queryFn: getEmployees,
    refetchInterval: 30000,
    staleTime: 10000,
    cacheTime: 60000,
    retry: 2,
  });

  // Process online users
  const onlineUsers: OnlineUser[] = employees
    .filter(emp => emp.status === 'active')
    .map(emp => ({
      id: emp.id,
      name: emp.name,
      jobTitle: emp.position,
      status: 'نشط',
      avatar: emp.name.charAt(0).toUpperCase(),
      lastActivity: 'الآن',
      sessionDuration: 'متصل',
      location: emp.department || 'الفرع الرئيسي'
    }));

  // Format numbers to Arabic
  const toArabicNumbers = (num: number | string): string => {
    const arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().replace(/\d/g, (digit) => arabicNums[parseInt(digit)]);
  };

  // Get Hijri date using Intl API (more accurate)
  const getHijriDate = (date: Date): string => {
    try {
      return new Intl.DateTimeFormat('ar-SA', {
        calendar: 'islamic',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch {
      // Fallback
      const hijriEpoch = new Date('622-07-16');
      const diffDays = Math.floor((date.getTime() - hijriEpoch.getTime()) / (1000 * 60 * 60 * 24));
      const hijriYear = Math.floor(diffDays / 354.367) + 1;
      const remainingDays = diffDays % 354.367;
      const hijriMonth = Math.floor(remainingDays / 29.5) + 1;
      const hijriDay = Math.floor(remainingDays % 29.5) + 1;
      return `${toArabicNumbers(hijriYear)}/${toArabicNumbers(hijriMonth.toString().padStart(2, '0'))}/${toArabicNumbers(hijriDay.toString().padStart(2, '0'))}هـ`;
    }
  };

  // Update time and session duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
      
      const now = new Date();
      const diff = now.getTime() - sessionStartTime.getTime();
      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      setSessionDuration({
        hours,
        minutes,
        seconds
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStartTime]);

  return (
    <header 
      className="bg-gradient-to-l from-gray-50 sticky top-0 z-50 via-blue-50 to-indigo-50 border-b border-blue-200 shadow-sm"
      style={{ 
        minHeight: '60px',
        padding: '2px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Tajawal, sans-serif',
      }}
      dir="rtl"
    >
      {/* Left: Logo & Office Info */}
      <div className="flex items-center gap-3 flex-shrink-0" style={{ minWidth: '25%' }}>
        <button
          onClick={onNavigateToHome}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
          aria-label="الصفحة الرئيسية"
        >
          <Building2 className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex flex-col">
          <span 
            className="font-bold text-gray-800 text-sm leading-tight"
            title={officeName}
          >
            {officeName}
          </span>
          <span 
            className="text-gray-600 text-xs leading-tight"
          >
            نظام إدارة شامل v5.0
          </span>
        </div>
      </div>

      {/* Center: Date & Time */}
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-blue-100 flex-shrink-0">
        <Clock className="w-4 h-4 text-blue-700" />
        <div className="text-center">
          <span className="text-blue-800 font-medium text-xs leading-tight">
            {getHijriDate(currentDateTime)}
          </span>
          <br />
          <span className="text-gray-700 text-xs leading-tight">
            {format(currentDateTime, 'dd/MM/yyyy', { locale: ar })}
          </span>
        </div>
      </div>

      {/* Right: User, Session, Online Users */}
      <div className="flex items-center gap-3 flex-shrink-0" style={{ minWidth: '35%' }}>
        
        {/* User Info */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-blue-100">
          <User className="w-4 h-4 text-blue-700" />
          <div className="text-right">
            <span className="font-semibold text-blue-800 text-xs leading-tight" title={user?.name}>
              {user?.name || 'زائر'}
            </span>
            <br />
            <Badge 
              variant="outline" 
              className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] px-1.5 py-0.5"
            >
              {user?.position || 'مستخدم'}
            </Badge>
          </div>
        </div>

        {/* Session Timer */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg px-3 py-2 shadow-sm border border-green-200">
          <Clock className="w-4 h-4 text-green-700" />
          <div className="text-center">
            <span className="text-gray-600 text-[10px] leading-tight">مدة الجلسة</span>
            <br />
            <span className="text-green-800 font-mono font-bold text-xs leading-tight">
              {toArabicNumbers(sessionDuration.hours.toString().padStart(2, '0'))}:
              {toArabicNumbers(sessionDuration.minutes.toString().padStart(2, '0'))}:
              {toArabicNumbers(sessionDuration.seconds.toString().padStart(2, '0'))}
            </span>
          </div>
        </div>

        {/* Online Users Button */}
        <Dialog open={showOnlineUsersModal} onOpenChange={setShowOnlineUsersModal}>
          <DialogTrigger asChild>
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg px-3 py-2 shadow-sm border border-purple-200 hover:shadow-md transition-all duration-200"
              aria-label="المستخدمون النشطون"
            >
              <Users className="w-4 h-4 text-purple-700" />
              <div className="text-center">
                <span className="text-gray-600 text-[10px] leading-tight">نشطون</span>
                <br />
                <span className="text-purple-800 font-bold text-xs leading-tight">
                  {isLoadingEmployees ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    toArabicNumbers(onlineUsers.length)
                  )}
                </span>
              </div>
            </button>
          </DialogTrigger>

          {/* Modal Content */}
          <DialogContent className="max-w-3xl dialog-rtl" dir="rtl">
                <DialogHeader className="dialog-header">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="dialog-title flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Users className="h-5 w-5 text-purple-600" />
                      المستخدمين المتصلين حالياً ({toArabicNumbers(onlineUsers.length)})
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
                
                <div className="space-y-3 max-h-[60vh] overflow-y-auto px-1">
                  {isLoadingEmployees ? (
                    <div className="flex justify-center py-8">
                       <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    </div>
                  ) : onlineUsers.map((user) => (
                    <div 
                      key={user.id}
                      className={`p-4 border rounded-lg transition-all duration-200 ${user.isCurrentUser ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' : 'bg-gradient-to-r from-white to-purple-50 hover:shadow-md'}`}
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
                              {user.name} {user.isCurrentUser && <span className="text-[10px] text-blue-600">(أنت)</span>}
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
                  
                  {!isLoadingEmployees && onlineUsers.length === 0 && (
                    <div className="text-center text-gray-500 py-8">لا يوجد مستخدمين نشطين حالياً</div>
                  )}
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

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg px-3 py-2 transition-colors duration-200 text-xs font-medium"
          aria-label="تسجيل الخروج"
        >
          <LogOut className="w-4 h-4" />
          تسجيل خروج
        </button>
      </div>
    </header>
  );
}