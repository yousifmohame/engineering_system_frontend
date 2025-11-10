/**
 * الشاشة 820 - إدارة المواعيد - مطورة بالكامل v6.0 - جميع التابات
 * ================================================================
 * 
 * نظام شامل لإدارة جميع أنواع المواعيد - جميع الـ 15 تبويب مطورة بالكامل
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import {
  Calendar, Plus, Edit, Trash2, Eye, Download, Upload, CheckCircle,
  Clock, AlertCircle, X, Search, Filter, Bell, Users, Building,
  Settings, History, Archive, RefreshCw, Printer, Target, Award,
  TrendingUp, Paperclip, Shield, Mail, Phone, DollarSign, FileText,
  CalendarDays, AlarmClock, BellRing, Timer, Repeat, User, Briefcase,
  ChevronLeft, ChevronRight, Globe
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

const TABS_CONFIG = [
  { id: '820-01', number: '820-01', title: 'نظرة عامة', icon: Calendar },
  { id: '820-02', number: '820-02', title: 'التقويم الشامل', icon: CalendarDays },
  { id: '820-03', number: '820-03', title: 'مواعيد الملاك', icon: Users },
  { id: '820-04', number: '820-04', title: 'ديدلاين المعاملات', icon: Target },
  { id: '820-05', number: '820-05', title: 'الجهات الخارجية', icon: Building },
  { id: '820-06', number: '820-06', title: 'مواعيد التحصيل', icon: DollarSign },
  { id: '820-07', number: '820-07', title: 'مواعيد الرواتب', icon: Briefcase },
  { id: '820-08', number: '820-08', title: 'إنشاء موعد', icon: Plus },
  { id: '820-09', number: '820-09', title: 'التنبيهات المتقدمة', icon: BellRing },
  { id: '820-10', number: '820-10', title: 'التذكيرات', icon: AlarmClock },
  { id: '820-11', number: '820-11', title: 'التقارير', icon: FileText },
  { id: '820-12', number: '820-12', title: 'الإحصائيات', icon: TrendingUp },
  { id: '820-13', number: '820-13', title: 'الأرشيف', icon: Archive },
  { id: '820-14', number: '820-14', title: 'المزامنة', icon: RefreshCw },
  { id: '820-15', number: '820-15', title: 'الإعدادات', icon: Settings }
];

// أنواع المواعيد
const APPOINTMENT_TYPES = [
  { value: 'owners-meeting', label: 'اجتماع مع الملاك', color: 'bg-blue-100 text-blue-700', icon: Users },
  { value: 'transaction-deadline', label: 'ديدلاين معاملة', color: 'bg-red-100 text-red-700', icon: Target },
  { value: 'external-entity', label: 'موعد جهة خارجية', color: 'bg-purple-100 text-purple-700', icon: Building },
  { value: 'collection', label: 'موعد تحصيل', color: 'bg-green-100 text-green-700', icon: DollarSign },
  { value: 'payroll', label: 'موعد دفع راتب', color: 'bg-yellow-100 text-yellow-700', icon: Briefcase },
  { value: 'general', label: 'موعد عام', color: 'bg-gray-100 text-gray-700', icon: Calendar }
];

// حالات المواعيد
const APPOINTMENT_STATUSES = [
  { value: 'scheduled', label: 'مجدول', color: 'bg-blue-100 text-blue-700' },
  { value: 'confirmed', label: 'مؤكد', color: 'bg-green-100 text-green-700' },
  { value: 'in-progress', label: 'جاري', color: 'bg-purple-100 text-purple-700' },
  { value: 'completed', label: 'مكتمل', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'cancelled', label: 'ملغي', color: 'bg-red-100 text-red-700' },
  { value: 'postponed', label: 'مؤجل', color: 'bg-orange-100 text-orange-700' },
  { value: 'missed', label: 'فائت', color: 'bg-gray-100 text-gray-700' }
];

// أولويات المواعيد
const PRIORITIES = [
  { value: 'low', label: 'منخفضة', color: 'bg-gray-100 text-gray-700' },
  { value: 'medium', label: 'متوسطة', color: 'bg-blue-100 text-blue-700' },
  { value: 'high', label: 'عالية', color: 'bg-orange-100 text-orange-700' },
  { value: 'urgent', label: 'عاجل', color: 'bg-red-100 text-red-700' }
];

// أنواع التنبيهات
const ALERT_TYPES = [
  { value: '15min', label: 'قبل 15 دقيقة' },
  { value: '30min', label: 'قبل 30 دقيقة' },
  { value: '1hour', label: 'قبل ساعة' },
  { value: '2hours', label: 'قبل ساعتين' },
  { value: '1day', label: 'قبل يوم' },
  { value: '2days', label: 'قبل يومين' },
  { value: '1week', label: 'قبل أسبوع' },
  { value: '2weeks', label: 'قبل أسبوعين' },
  { value: '1month', label: 'قبل شهر' }
];

// قنوات التنبيه
const NOTIFICATION_CHANNELS = [
  { value: 'system', label: 'نظام داخلي', icon: Bell },
  { value: 'email', label: 'بريد إلكتروني', icon: Mail },
  { value: 'sms', label: 'رسالة نصية', icon: Phone },
  { value: 'whatsapp', label: 'واتساب', icon: Phone }
];

// تكرار المواعيد
const RECURRENCE_TYPES = [
  { value: 'none', label: 'لا يتكرر' },
  { value: 'daily', label: 'يومي' },
  { value: 'weekly', label: 'أسبوعي' },
  { value: 'biweekly', label: 'كل أسبوعين' },
  { value: 'monthly', label: 'شهري' },
  { value: 'quarterly', label: 'ربع سنوي' },
  { value: 'annually', label: 'سنوي' }
];

// مواعيد تجريبية موسعة
const SAMPLE_APPOINTMENTS = [
  {
    id: 'APT-2025-001',
    type: 'owners-meeting',
    title: 'اجتماع مع مالك المشروع - معاملة 286-00245',
    description: 'مناقشة تصميم المبنى السكني',
    datetime: '2025-01-20T10:00:00',
    duration: 60,
    location: 'مكتب المشروع',
    status: 'scheduled',
    priority: 'high',
    relatedTransaction: '286-00245',
    relatedClient: '360-00123',
    assignedTo: '817-00123',
    alerts: ['1day', '2hours', '30min'],
    notificationChannels: ['system', 'email', 'sms'],
    recurrence: 'none',
    attendees: ['أحمد محمد علي', 'المهندس سعيد'],
    createdDate: '2025-01-10'
  },
  {
    id: 'APT-2025-002',
    type: 'transaction-deadline',
    title: 'موعد نهائي لتسليم المعاملة 286-00246',
    description: 'آخر موعد لتقديم وثائق الإفراز',
    datetime: '2025-01-25T14:00:00',
    duration: 0,
    location: 'البلدية',
    status: 'confirmed',
    priority: 'urgent',
    relatedTransaction: '286-00246',
    relatedEntity: 'ENT-GOV-001',
    assignedTo: '817-00124',
    alerts: ['1week', '2days', '1day', '2hours'],
    notificationChannels: ['system', 'email', 'sms', 'whatsapp'],
    recurrence: 'none',
    createdDate: '2025-01-05'
  },
  {
    id: 'APT-2025-003',
    type: 'collection',
    title: 'تحصيل دفعة من العميل فاطمة خالد',
    description: 'الدفعة الثانية - 50,000 ر.س',
    datetime: '2025-01-18T09:00:00',
    duration: 30,
    location: 'المكتب',
    status: 'scheduled',
    priority: 'high',
    relatedClient: '360-00124',
    relatedTransaction: '286-00246',
    assignedTo: '817-00125',
    alerts: ['2days', '1day', '2hours'],
    notificationChannels: ['system', 'email'],
    recurrence: 'none',
    amount: 50000,
    createdDate: '2025-01-08'
  },
  {
    id: 'APT-2025-004',
    type: 'payroll',
    title: 'موعد صرف رواتب الموظفين - يناير 2025',
    description: 'صرف رواتب شهر يناير',
    datetime: '2025-01-30T12:00:00',
    duration: 120,
    location: 'قسم المحاسبة',
    status: 'scheduled',
    priority: 'urgent',
    assignedTo: '817-00123',
    alerts: ['1week', '2days', '1day'],
    notificationChannels: ['system', 'email'],
    recurrence: 'monthly',
    createdDate: '2025-01-01'
  },
  {
    id: 'APT-2025-005',
    type: 'external-entity',
    title: 'موعد بلدية قطاع شمال الرياض',
    description: 'مراجعة طلب ترخيص بناء',
    datetime: '2025-01-22T11:00:00',
    duration: 90,
    location: 'بلدية قطاع الشمال',
    status: 'confirmed',
    priority: 'high',
    relatedTransaction: '286-00245',
    relatedEntity: 'SEC-RYD-N',
    assignedTo: '817-00124',
    alerts: ['2days', '1day', '2hours', '30min'],
    notificationChannels: ['system', 'email', 'sms'],
    recurrence: 'none',
    createdDate: '2025-01-12'
  },
  // مزيد من المواعيد
  {
    id: 'APT-2025-006',
    type: 'owners-meeting',
    title: 'اجتماع استشاري مع المالك سعد',
    description: 'مراجعة خطط التوسعة',
    datetime: '2025-01-23T14:30:00',
    duration: 45,
    location: 'مكتب العميل',
    status: 'scheduled',
    priority: 'medium',
    relatedClient: '360-00125',
    assignedTo: '817-00123',
    alerts: ['1day', '2hours'],
    notificationChannels: ['system', 'email'],
    recurrence: 'none',
    createdDate: '2025-01-13'
  },
  {
    id: 'APT-2025-007',
    type: 'collection',
    title: 'تحصيل الدفعة الأولى - عميل أحمد',
    description: 'دفعة أولى 30,000 ر.س',
    datetime: '2025-01-19T10:30:00',
    duration: 20,
    location: 'المكتب',
    status: 'scheduled',
    priority: 'high',
    relatedClient: '360-00123',
    assignedTo: '817-00125',
    alerts: ['1day', '2hours'],
    notificationChannels: ['system', 'sms'],
    recurrence: 'none',
    amount: 30000,
    createdDate: '2025-01-09'
  }
];

const AppointmentsManagement_Complete_820: React.FC = () => {
  const [activeTab, setActiveTab] = useState('820-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [appointments, setAppointments] = useState(SAMPLE_APPOINTMENTS);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // إحصائيات المواعيد
  const statistics = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return {
      total: appointments.length,
      today: appointments.filter(a => {
        const aptDate = new Date(a.datetime);
        return aptDate >= today && aptDate < tomorrow;
      }).length,
      upcoming: appointments.filter(a => {
        const aptDate = new Date(a.datetime);
        return aptDate >= now;
      }).length,
      overdue: appointments.filter(a => {
        const aptDate = new Date(a.datetime);
        return aptDate < now && a.status !== 'completed';
      }).length,
      scheduled: appointments.filter(a => a.status === 'scheduled').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      urgent: appointments.filter(a => a.priority === 'urgent').length,
      owners: appointments.filter(a => a.type === 'owners-meeting').length,
      deadlines: appointments.filter(a => a.type === 'transaction-deadline').length,
      collections: appointments.filter(a => a.type === 'collection').length,
      payroll: appointments.filter(a => a.type === 'payroll').length,
      external: appointments.filter(a => a.type === 'external-entity').length
    };
  }, [appointments]);

  // تنسيق التاريخ والوقت
  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('ar-SA'),
      time: date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      dayName: date.toLocaleDateString('ar-SA', { weekday: 'long' })
    };
  };

  // توليد أيام الشهر للتقويم
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    
    const days = [];
    
    // أيام الشهر السابق
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    // أيام الشهر الحالي
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const dayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.datetime);
        return aptDate.getFullYear() === year &&
               aptDate.getMonth() === month &&
               aptDate.getDate() === i;
      });
      
      days.push({
        day: i,
        isCurrentMonth: true,
        date: dayDate,
        appointments: dayAppointments,
        isToday: dayDate.toDateString() === new Date().toDateString()
      });
    }
    
    return days;
  };

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 820-01: نظرة عامة
      case '820-01':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Calendar className="h-5 w-5" />
                  نظرة عامة على المواعيد
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary" onClick={() => setActiveTab('820-08')}>
                    <Plus className="h-3 w-3" />
                    موعد جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* إحصائيات سريعة */}
                <div className="dense-stats-grid gap-3 mb-4">
                  {[
                    { label: 'إجمالي المواعيد', value: statistics.total, icon: Calendar, color: 'blue' },
                    { label: 'اليوم', value: statistics.today, icon: CalendarDays, color: 'indigo' },
                    { label: 'قادمة', value: statistics.upcoming, icon: Clock, color: 'green' },
                    { label: 'متأخرة', value: statistics.overdue, icon: AlertCircle, color: 'red' },
                    { label: 'عاجل', value: statistics.urgent, icon: BellRing, color: 'orange' },
                    { label: 'مع الملاك', value: statistics.owners, icon: Users, color: 'purple' },
                    { label: 'ديدلاين', value: statistics.deadlines, icon: Target, color: 'pink' },
                    { label: 'تحصيل', value: statistics.collections, icon: DollarSign, color: 'emerald' },
                    { label: 'رواتب', value: statistics.payroll, icon: Briefcase, color: 'cyan' },
                    { label: 'جهات خارجية', value: statistics.external, icon: Building, color: 'violet' }
                  ].map((stat, i) => (
                    <div key={i} className="dense-stat-card">
                      <div className={`dense-stat-icon bg-${stat.color}-100 text-${stat.color}-600`}>
                        {React.createElement(stat.icon, { className: 'w-4 h-4' })}
                      </div>
                      <div className="dense-stat-number">{stat.value}</div>
                      <div className="dense-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <Separator className="my-3" />

                {/* مواعيد اليوم */}
                <div>
                  <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                    مواعيد اليوم ({statistics.today})
                  </h3>
                  {statistics.today === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">لا توجد مواعيد اليوم</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {appointments.filter(a => {
                        const now = new Date();
                        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        const tomorrow = new Date(today);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const aptDate = new Date(a.datetime);
                        return aptDate >= today && aptDate < tomorrow;
                      }).map((appointment) => {
                        const typeInfo = APPOINTMENT_TYPES.find(t => t.value === appointment.type);
                        const statusInfo = APPOINTMENT_STATUSES.find(s => s.value === appointment.status);
                        const priorityInfo = PRIORITIES.find(p => p.value === appointment.priority);
                        const formatted = formatDateTime(appointment.datetime);

                        return (
                          <Card key={appointment.id} className="dense-content-card hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${typeInfo?.color} flex items-center justify-center font-bold`}>
                                  {typeInfo && React.createElement(typeInfo.icon, { className: 'h-5 w-5' })}
                                </div>
                                <div>
                                  <div className="compact-title">{appointment.title}</div>
                                  <div className="text-xs text-gray-600">{appointment.id}</div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Badge className={typeInfo?.color}>
                                  {typeInfo?.label}
                                </Badge>
                                <Badge className={statusInfo?.color}>
                                  {statusInfo?.label}
                                </Badge>
                                <Badge className={priorityInfo?.color}>
                                  {priorityInfo?.label}
                                </Badge>
                              </div>
                            </div>

                            <div className="dense-grid dense-grid-4 gap-2 text-xs mb-2">
                              <div>
                                <span className="text-gray-600">الوقت:</span>
                                <span className="font-medium mr-1">{formatted.time}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">المدة:</span>
                                <span className="font-medium mr-1">{appointment.duration} دقيقة</span>
                              </div>
                              <div>
                                <span className="text-gray-600">الموقع:</span>
                                <span className="font-medium mr-1">{appointment.location}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">المسؤول:</span>
                                <span className="font-medium mr-1">{appointment.assignedTo}</span>
                              </div>
                            </div>

                            {appointment.description && (
                              <div className="text-xs text-gray-700 mb-2 p-2 bg-gray-50 rounded">
                                {appointment.description}
                              </div>
                            )}

                            <div className="flex items-center gap-1">
                              <Button className="dense-action-btn">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button className="dense-action-btn">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button className="dense-action-btn">
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 820-02: التقويم الشامل
      case '820-02':
        const calendarDays = generateCalendarDays();
        const monthName = currentMonth.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
        
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <CalendarDays className="h-5 w-5" />
                  التقويم الشامل - {monthName}
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-action-btn" onClick={() => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentMonth(newDate);
                  }}>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                  <Button className="dense-action-btn" onClick={() => setCurrentMonth(new Date())}>
                    اليوم
                  </Button>
                  <Button className="dense-action-btn" onClick={() => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentMonth(newDate);
                  }}>
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* أسماء الأيام */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day) => (
                    <div key={day} className="text-center p-2 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {day}
                    </div>
                  ))}
                </div>

                {/* أيام الشهر */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`
                        min-h-[80px] p-1 border rounded
                        ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                        ${day.isToday ? 'border-blue-500 border-2' : 'border-gray-200'}
                        hover:shadow-md transition-shadow cursor-pointer
                      `}
                    >
                      {day.day && (
                        <>
                          <div className={`text-xs font-medium mb-1 ${day.isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                            {day.day}
                          </div>
                          {day.appointments && day.appointments.length > 0 && (
                            <div className="space-y-1">
                              {day.appointments.slice(0, 2).map((apt) => {
                                const typeInfo = APPOINTMENT_TYPES.find(t => t.value === apt.type);
                                const time = formatDateTime(apt.datetime).time;
                                return (
                                  <div
                                    key={apt.id}
                                    className={`text-xs p-1 rounded truncate ${typeInfo?.color}`}
                                    title={apt.title}
                                  >
                                    {time} {apt.title.substring(0, 15)}...
                                  </div>
                                );
                              })}
                              {day.appointments.length > 2 && (
                                <div className="text-xs text-gray-600 text-center">
                                  +{day.appointments.length - 2} أخرى
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <Separator className="my-3" />

                {/* قائمة مواعيد الشهر */}
                <div>
                  <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                    مواعيد الشهر ({appointments.filter(a => {
                      const aptDate = new Date(a.datetime);
                      return aptDate.getMonth() === currentMonth.getMonth() &&
                             aptDate.getFullYear() === currentMonth.getFullYear();
                    }).length})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {appointments
                      .filter(a => {
                        const aptDate = new Date(a.datetime);
                        return aptDate.getMonth() === currentMonth.getMonth() &&
                               aptDate.getFullYear() === currentMonth.getFullYear();
                      })
                      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
                      .map((appointment) => {
                        const typeInfo = APPOINTMENT_TYPES.find(t => t.value === appointment.type);
                        const formatted = formatDateTime(appointment.datetime);
                        return (
                          <div key={appointment.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100">
                            <div className={`w-2 h-2 rounded-full ${typeInfo?.color.replace('text', 'bg')}`} />
                            <div className="text-xs flex-1">
                              <span className="font-medium">{formatted.date}</span>
                              <span className="mx-1">-</span>
                              <span>{formatted.time}</span>
                              <span className="mx-1">|</span>
                              <span className="text-gray-600">{appointment.title}</span>
                            </div>
                            <Badge className={typeInfo?.color}>
                              {typeInfo?.label}
                            </Badge>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 820-03: مواعيد الملاك
      case '820-03':
        const ownersAppointments = appointments.filter(a => a.type === 'owners-meeting');
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Users className="h-5 w-5" />
                  مواعيد الملاك ({ownersAppointments.length})
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary" onClick={() => setActiveTab('820-08')}>
                    <Plus className="h-3 w-3" />
                    موعد جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ownersAppointments.map((appointment) => {
                    const statusInfo = APPOINTMENT_STATUSES.find(s => s.value === appointment.status);
                    const priorityInfo = PRIORITIES.find(p => p.value === appointment.priority);
                    const formatted = formatDateTime(appointment.datetime);

                    return (
                      <Card key={appointment.id} className="dense-content-card">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <div>
                              <div className="compact-text font-medium">{appointment.title}</div>
                              <div className="text-xs text-gray-500">{formatted.dayName} - {formatted.date}</div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Badge className={statusInfo?.color}>
                              {statusInfo?.label}
                            </Badge>
                            <Badge className={priorityInfo?.color}>
                              {priorityInfo?.label}
                            </Badge>
                          </div>
                        </div>

                        <div className="dense-grid dense-grid-3 gap-2 text-xs mb-2">
                          <div>
                            <span className="text-gray-600">الوقت:</span>
                            <span className="font-medium mr-1">{formatted.time}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">المدة:</span>
                            <span className="font-medium mr-1">{appointment.duration} دقيقة</span>
                          </div>
                          <div>
                            <span className="text-gray-600">الموقع:</span>
                            <span className="font-medium mr-1">{appointment.location}</span>
                          </div>
                        </div>

                        {appointment.description && (
                          <div className="text-xs p-2 bg-blue-50 rounded mb-2">
                            {appointment.description}
                          </div>
                        )}

                        {appointment.attendees && (
                          <div className="text-xs mb-2">
                            <span className="text-gray-600">الحضور:</span>
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {appointment.attendees.map((attendee, i) => (
                                <Badge key={i} className="bg-purple-100 text-purple-700 text-xs">
                                  {attendee}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <Button className="dense-action-btn">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Printer className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 820-04: ديدلاين المعاملات
      case '820-04':
        const deadlineAppointments = appointments.filter(a => a.type === 'transaction-deadline');
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Target className="h-5 w-5" />
                  ديدلاين المعاملات ({deadlineAppointments.length})
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary" onClick={() => setActiveTab('820-08')}>
                    <Plus className="h-3 w-3" />
                    موعد نهائي جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {deadlineAppointments.sort((a, b) => {
                    const dateA = new Date(a.datetime).getTime();
                    const dateB = new Date(b.datetime).getTime();
                    return dateA - dateB;
                  }).map((appointment) => {
                    const statusInfo = APPOINTMENT_STATUSES.find(s => s.value === appointment.status);
                    const priorityInfo = PRIORITIES.find(p => p.value === appointment.priority);
                    const formatted = formatDateTime(appointment.datetime);
                    const now = new Date();
                    const deadline = new Date(appointment.datetime);
                    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                    return (
                      <Card key={appointment.id} className={`dense-content-card ${daysLeft < 0 ? 'border-red-500 border-2' : daysLeft <= 2 ? 'border-orange-500 border-2' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Target className={`h-4 w-4 ${daysLeft < 0 ? 'text-red-600' : daysLeft <= 2 ? 'text-orange-600' : 'text-blue-600'}`} />
                            <div>
                              <div className="compact-text font-medium">{appointment.title}</div>
                              <div className="text-xs text-gray-500">
                                {daysLeft < 0 ? (
                                  <span className="text-red-600 font-medium">متأخر بـ {Math.abs(daysLeft)} يوم</span>
                                ) : daysLeft === 0 ? (
                                  <span className="text-orange-600 font-medium">اليوم!</span>
                                ) : (
                                  <span className={daysLeft <= 2 ? 'text-orange-600 font-medium' : ''}>متبقي {daysLeft} يوم</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Badge className={statusInfo?.color}>
                              {statusInfo?.label}
                            </Badge>
                            <Badge className={priorityInfo?.color}>
                              {priorityInfo?.label}
                            </Badge>
                          </div>
                        </div>

                        <div className="dense-grid dense-grid-3 gap-2 text-xs mb-2">
                          <div>
                            <span className="text-gray-600">التاريخ:</span>
                            <span className="font-medium mr-1">{formatted.date}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">الوقت:</span>
                            <span className="font-medium mr-1">{formatted.time}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">المعاملة:</span>
                            <span className="font-medium mr-1">{appointment.relatedTransaction}</span>
                          </div>
                        </div>

                        {appointment.description && (
                          <div className={`text-xs p-2 rounded mb-2 ${daysLeft < 0 ? 'bg-red-50' : daysLeft <= 2 ? 'bg-orange-50' : 'bg-blue-50'}`}>
                            {appointment.description}
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <Button className="dense-action-btn">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Edit className="h-3 w-3" />
                          </Button>
                          {appointment.status !== 'completed' && (
                            <Button className="dense-btn dense-btn-primary">
                              <CheckCircle className="h-3 w-3" />
                              إكمال
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 820-05: الجهات الخارجية
      case '820-05':
        const externalAppointments = appointments.filter(a => a.type === 'external-entity');
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Building className="h-5 w-5" />
                  مواعيد الجهات الخارجية ({externalAppointments.length})
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary" onClick={() => setActiveTab('820-08')}>
                    <Plus className="h-3 w-3" />
                    موعد جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {externalAppointments.map((appointment) => {
                    const statusInfo = APPOINTMENT_STATUSES.find(s => s.value === appointment.status);
                    const priorityInfo = PRIORITIES.find(p => p.value === appointment.priority);
                    const formatted = formatDateTime(appointment.datetime);

                    return (
                      <Card key={appointment.id} className="dense-content-card">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-purple-600" />
                            <div>
                              <div className="compact-text font-medium">{appointment.title}</div>
                              <div className="text-xs text-gray-500">{formatted.dayName} - {formatted.date}</div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Badge className={statusInfo?.color}>
                              {statusInfo?.label}
                            </Badge>
                            <Badge className={priorityInfo?.color}>
                              {priorityInfo?.label}
                            </Badge>
                          </div>
                        </div>

                        <div className="dense-grid dense-grid-4 gap-2 text-xs mb-2">
                          <div>
                            <span className="text-gray-600">الوقت:</span>
                            <span className="font-medium mr-1">{formatted.time}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">المدة:</span>
                            <span className="font-medium mr-1">{appointment.duration} دقيقة</span>
                          </div>
                          <div>
                            <span className="text-gray-600">الموقع:</span>
                            <span className="font-medium mr-1">{appointment.location}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">الجهة:</span>
                            <span className="font-medium mr-1">{appointment.relatedEntity}</span>
                          </div>
                        </div>

                        {appointment.description && (
                          <div className="text-xs p-2 bg-purple-50 rounded mb-2">
                            {appointment.description}
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <Button className="dense-action-btn">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Printer className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 820-06: مواعيد التحصيل
      case '820-06':
        const collectionAppointments = appointments.filter(a => a.type === 'collection');
        const totalExpectedCollection = collectionAppointments.reduce((sum, apt) => sum + (apt.amount || 0), 0);
        const upcomingCollections = collectionAppointments.filter(a => new Date(a.datetime) >= new Date());
        
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <DollarSign className="h-5 w-5" />
                  مواعيد التحصيل ({collectionAppointments.length})
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary" onClick={() => setActiveTab('820-08')}>
                    <Plus className="h-3 w-3" />
                    موعد تحصيل جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* إحصائيات التحصيل */}
                <div className="dense-grid dense-grid-3 gap-3 mb-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xs text-gray-600 mb-1">إجمالي المتوقع</div>
                    <div className="text-lg font-bold text-green-600">{totalExpectedCollection.toLocaleString()} ر.س</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">المواعيد القادمة</div>
                    <div className="text-lg font-bold text-blue-600">{upcomingCollections.length}</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-xs text-gray-600 mb-1">قيمة القادمة</div>
                    <div className="text-lg font-bold text-orange-600">
                      {upcomingCollections.reduce((sum, apt) => sum + (apt.amount || 0), 0).toLocaleString()} ر.س
                    </div>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="space-y-2">
                  {collectionAppointments.sort((a, b) => {
                    const dateA = new Date(a.datetime).getTime();
                    const dateB = new Date(b.datetime).getTime();
                    return dateA - dateB;
                  }).map((appointment) => {
                    const statusInfo = APPOINTMENT_STATUSES.find(s => s.value === appointment.status);
                    const priorityInfo = PRIORITIES.find(p => p.value === appointment.priority);
                    const formatted = formatDateTime(appointment.datetime);
                    const isPast = new Date(appointment.datetime) < new Date();

                    return (
                      <Card key={appointment.id} className={`dense-content-card ${isPast && appointment.status !== 'completed' ? 'border-red-300 border-2' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className={`h-4 w-4 ${isPast && appointment.status !== 'completed' ? 'text-red-600' : 'text-green-600'}`} />
                            <div>
                              <div className="compact-text font-medium">{appointment.title}</div>
                              <div className="text-xs text-gray-500">{formatted.dayName} - {formatted.date}</div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Badge className="bg-green-100 text-green-700">
                              {appointment.amount?.toLocaleString()} ر.س
                            </Badge>
                            <Badge className={statusInfo?.color}>
                              {statusInfo?.label}
                            </Badge>
                          </div>
                        </div>

                        <div className="dense-grid dense-grid-3 gap-2 text-xs mb-2">
                          <div>
                            <span className="text-gray-600">الوقت:</span>
                            <span className="font-medium mr-1">{formatted.time}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">العميل:</span>
                            <span className="font-medium mr-1">{appointment.relatedClient}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">المعاملة:</span>
                            <span className="font-medium mr-1">{appointment.relatedTransaction}</span>
                          </div>
                        </div>

                        {appointment.description && (
                          <div className="text-xs p-2 bg-green-50 rounded mb-2">
                            {appointment.description}
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <Button className="dense-action-btn">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Edit className="h-3 w-3" />
                          </Button>
                          {appointment.status !== 'completed' && (
                            <Button className="dense-btn dense-btn-primary">
                              <CheckCircle className="h-3 w-3" />
                              تأكيد التحصيل
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 820-07: مواعيد الرواتب
      case '820-07':
        const payrollAppointments = appointments.filter(a => a.type === 'payroll');
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Briefcase className="h-5 w-5" />
                  مواعيد صرف الرواتب ({payrollAppointments.length})
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary" onClick={() => setActiveTab('820-08')}>
                    <Plus className="h-3 w-3" />
                    موعد راتب جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-yellow-600" />
                    <div className="text-xs text-yellow-800">
                      جدول صرف الرواتب - يتكرر شهرياً في نفس التاريخ
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {payrollAppointments.sort((a, b) => {
                    const dateA = new Date(a.datetime).getTime();
                    const dateB = new Date(b.datetime).getTime();
                    return dateA - dateB;
                  }).map((appointment) => {
                    const statusInfo = APPOINTMENT_STATUSES.find(s => s.value === appointment.status);
                    const priorityInfo = PRIORITIES.find(p => p.value === appointment.priority);
                    const formatted = formatDateTime(appointment.datetime);
                    const recurrenceInfo = RECURRENCE_TYPES.find(r => r.value === appointment.recurrence);

                    return (
                      <Card key={appointment.id} className="dense-content-card">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-yellow-600" />
                            <div>
                              <div className="compact-text font-medium">{appointment.title}</div>
                              <div className="text-xs text-gray-500">{formatted.dayName} - {formatted.date}</div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Badge className="bg-yellow-100 text-yellow-700">
                              <Repeat className="h-3 w-3 ml-1" />
                              {recurrenceInfo?.label}
                            </Badge>
                            <Badge className={statusInfo?.color}>
                              {statusInfo?.label}
                            </Badge>
                            <Badge className={priorityInfo?.color}>
                              {priorityInfo?.label}
                            </Badge>
                          </div>
                        </div>

                        <div className="dense-grid dense-grid-3 gap-2 text-xs mb-2">
                          <div>
                            <span className="text-gray-600">الوقت:</span>
                            <span className="font-medium mr-1">{formatted.time}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">المدة:</span>
                            <span className="font-medium mr-1">{appointment.duration} دقيقة</span>
                          </div>
                          <div>
                            <span className="text-gray-600">الموقع:</span>
                            <span className="font-medium mr-1">{appointment.location}</span>
                          </div>
                        </div>

                        {appointment.description && (
                          <div className="text-xs p-2 bg-yellow-50 rounded mb-2">
                            {appointment.description}
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <Button className="dense-action-btn">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Printer className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 820-08: إنشاء موعد (كما هو)
      case '820-08':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Plus className="h-5 w-5" />
                  إنشاء موعد جديد
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <CheckCircle className="h-3 w-3" />
                    حفظ الموعد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      معلومات أساسية
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <InputWithCopy
                        label="رقم الموعد (تلقائي)"
                        id="appointmentId"
                        value="APT-2025-008"
                        onChange={() => {}}
                        disabled
                      />

                      <SelectWithCopy
                        label="نوع الموعد"
                        id="appointmentType"
                        value=""
                        onChange={() => {}}
                        options={[
                          { value: '', label: 'اختر نوع الموعد' },
                          ...APPOINTMENT_TYPES.map(t => ({ value: t.value, label: t.label }))
                        ]}
                      />

                      <InputWithCopy
                        label="عنوان الموعد"
                        id="title"
                        value=""
                        onChange={() => {}}
                        placeholder="مثال: اجتماع مع مالك المشروع"
                      />

                      <SelectWithCopy
                        label="الأولوية"
                        id="priority"
                        value=""
                        onChange={() => {}}
                        options={[
                          { value: '', label: 'اختر الأولوية' },
                          ...PRIORITIES.map(p => ({ value: p.value, label: p.label }))
                        ]}
                      />

                      <DateInputWithToday
                        label="تاريخ الموعد"
                        id="appointmentDate"
                        value=""
                        onChange={() => {}}
                      />

                      <InputWithCopy
                        label="الوقت"
                        id="appointmentTime"
                        type="time"
                        value=""
                        onChange={() => {}}
                      />

                      <InputWithCopy
                        label="المدة (بالدقائق)"
                        id="duration"
                        type="number"
                        value=""
                        onChange={() => {}}
                        placeholder="60"
                      />

                      <InputWithCopy
                        label="الموقع"
                        id="location"
                        value=""
                        onChange={() => {}}
                        placeholder="مثال: مكتب المشروع"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      الربط بالنظام
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <SelectWithCopy
                        label="ربط بمعاملة (اختياري)"
                        id="relatedTransaction"
                        value=""
                        onChange={() => {}}
                        options={[
                          { value: '', label: 'لا يوجد' },
                          { value: '286-00245', label: 'ترخيص بناء - 286-00245' },
                          { value: '286-00246', label: 'إفراز - 286-00246' },
                          { value: '286-00247', label: 'تعديل صك - 286-00247' }
                        ]}
                      />

                      <SelectWithCopy
                        label="ربط بعميل (اختياري)"
                        id="relatedClient"
                        value=""
                        onChange={() => {}}
                        options={[
                          { value: '', label: 'لا يوجد' },
                          { value: '360-00123', label: 'أحمد محمد علي - 360-00123' },
                          { value: '360-00124', label: 'فاطمة خالد - 360-00124' },
                          { value: '360-00125', label: 'سعد عبدالله - 360-00125' }
                        ]}
                      />

                      <SelectWithCopy
                        label="ربط بجهة خارجية (اختياري)"
                        id="relatedEntity"
                        value=""
                        onChange={() => {}}
                        options={[
                          { value: '', label: 'لا يوجد' },
                          { value: 'SEC-RYD-N', label: 'قطاع شمال الرياض' },
                          { value: 'SEC-RYD-S', label: 'قطاع جنوب الرياض' },
                          { value: 'ENT-GOV-001', label: 'وزارة الشؤون البلدية' }
                        ]}
                      />

                      <SelectWithCopy
                        label="المسؤول عن الموعد"
                        id="assignedTo"
                        value=""
                        onChange={() => {}}
                        options={[
                          { value: '', label: 'اختر الموظف' },
                          { value: '817-00123', label: 'أحمد محمد علي - 817-00123' },
                          { value: '817-00124', label: 'فاطمة خالد - 817-00124' },
                          { value: '817-00125', label: 'سعد عبدالله - 817-00125' }
                        ]}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      نظام التنبيهات المتقدم
                    </h3>
                    
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-3">
                      <h4 className="text-xs font-medium text-blue-800 mb-2">متى تريد التنبيه؟</h4>
                      <div className="space-y-2">
                        {ALERT_TYPES.map((alert) => (
                          <div key={alert.value} className="flex items-center gap-2 p-2 bg-white rounded border border-blue-100">
                            <input type="checkbox" id={`alert-${alert.value}`} className="w-4 h-4" />
                            <label htmlFor={`alert-${alert.value}`} className="text-xs flex-1 cursor-pointer">
                              {alert.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="text-xs font-medium text-purple-800 mb-2">قنوات التنبيه</h4>
                      <div className="dense-grid dense-grid-2 gap-2">
                        {NOTIFICATION_CHANNELS.map((channel) => (
                          <div key={channel.value} className="flex items-center gap-2 p-2 bg-white rounded border border-purple-100">
                            <input type="checkbox" id={`channel-${channel.value}`} className="w-4 h-4" defaultChecked />
                            <label htmlFor={`channel-${channel.value}`} className="text-xs flex-1 cursor-pointer flex items-center gap-2">
                              {React.createElement(channel.icon, { className: 'h-3 w-3' })}
                              {channel.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      التكرار
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <SelectWithCopy
                        label="نوع التكرار"
                        id="recurrence"
                        value=""
                        onChange={() => {}}
                        options={[
                          ...RECURRENCE_TYPES.map(r => ({ value: r.value, label: r.label }))
                        ]}
                      />

                      <DateInputWithToday
                        label="ينتهي التكرار في (اختياري)"
                        id="recurrenceEndDate"
                        value=""
                        onChange={() => {}}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      تفاصيل إضافية
                    </h3>
                    <TextAreaWithCopy
                      label="الوصف"
                      id="description"
                      value=""
                      onChange={() => {}}
                      placeholder="اذكر تفاصيل الموعد..."
                      rows={3}
                    />

                    <TextAreaWithCopy
                      label="الحضور (كل اسم في سطر)"
                      id="attendees"
                      value=""
                      onChange={() => {}}
                      placeholder="أسماء الحضور..."
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 820-09: التنبيهات المتقدمة (كما هي)
      case '820-09':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <BellRing className="h-5 w-5" />
                  نظام التنبيهات المتقدم
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Settings className="h-3 w-3" />
                    إعدادات التنبيهات
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* إحصائيات التنبيهات */}
                  <div className="dense-grid dense-grid-4 gap-3">
                    {[
                      { label: 'تنبيهات نشطة', value: '24', icon: Bell, color: 'blue' },
                      { label: 'تم الإرسال اليوم', value: '8', icon: CheckCircle, color: 'green' },
                      { label: 'مجدولة', value: '16', icon: Clock, color: 'yellow' },
                      { label: 'فشل الإرسال', value: '1', icon: AlertCircle, color: 'red' }
                    ].map((stat, i) => (
                      <div key={i} className="dense-stat-card">
                        <div className={`dense-stat-icon bg-${stat.color}-100 text-${stat.color}-600`}>
                          {React.createElement(stat.icon, { className: 'w-4 h-4' })}
                        </div>
                        <div className="dense-stat-number">{stat.value}</div>
                        <div className="dense-stat-label">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* إعدادات التنبيه الافتراضية */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      إعدادات التنبيه الافتراضية
                    </h3>
                    
                    {APPOINTMENT_TYPES.map((type) => (
                      <Card key={type.value} className="dense-content-card mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          {React.createElement(type.icon, { className: 'h-4 w-4 text-blue-600' })}
                          <span className="compact-title">{type.label}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-xs text-gray-600 mb-1">التنبيهات المفعّلة:</div>
                          <div className="flex flex-wrap gap-1">
                            {['1week', '2days', '1day', '2hours', '30min'].slice(0, type.value === 'transaction-deadline' ? 5 : 3).map((alert) => (
                              <Badge key={alert} className="bg-blue-100 text-blue-700 text-xs">
                                {ALERT_TYPES.find(a => a.value === alert)?.label}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="text-xs text-gray-600 mt-2 mb-1">القنوات:</div>
                          <div className="flex flex-wrap gap-1">
                            {NOTIFICATION_CHANNELS.map((channel) => (
                              <Badge key={channel.value} className="bg-purple-100 text-purple-700 text-xs">
                                {channel.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Separator />

                  {/* قائمة التنبيهات القادمة */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      التنبيهات المجدولة (التالية 24 ساعة)
                    </h3>
                    <div className="space-y-2">
                      {[
                        { time: '09:00', title: 'تذكير: اجتماع مع مالك المشروع', type: 'قبل 30 دقيقة', status: 'pending' },
                        { time: '10:30', title: 'تذكير: موعد البلدية', type: 'قبل 2 ساعة', status: 'pending' },
                        { time: '14:00', title: 'تذكير: موعد تحصيل', type: 'قبل يوم', status: 'pending' }
                      ].map((alert, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 bg-blue-50 rounded border border-blue-200">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <div className="flex-1">
                            <div className="compact-text font-medium">{alert.title}</div>
                            <div className="text-xs text-gray-600">{alert.type} - {alert.time}</div>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-700">
                            مجدول
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 820-10: التذكيرات
      case '820-10':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <AlarmClock className="h-5 w-5" />
                  التذكيرات والمنبهات
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Plus className="h-3 w-3" />
                    تذكير جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* إحصائيات */}
                  <div className="dense-grid dense-grid-3 gap-3">
                    {[
                      { label: 'تذكيرات اليوم', value: '5', icon: AlarmClock, color: 'blue' },
                      { label: 'نشطة', value: '12', icon: Bell, color: 'green' },
                      { label: 'محذوفة', value: '3', icon: X, color: 'red' }
                    ].map((stat, i) => (
                      <div key={i} className="dense-stat-card">
                        <div className={`dense-stat-icon bg-${stat.color}-100 text-${stat.color}-600`}>
                          {React.createElement(stat.icon, { className: 'w-4 h-4' })}
                        </div>
                        <div className="dense-stat-number">{stat.value}</div>
                        <div className="dense-stat-label">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* قائمة التذكيرات */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      التذكيرات النشطة
                    </h3>
                    <div className="space-y-2">
                      {appointments.slice(0, 5).map((apt) => {
                        const formatted = formatDateTime(apt.datetime);
                        return (
                          <div key={apt.id} className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                            <AlarmClock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="compact-text font-medium">{apt.title}</div>
                              <div className="text-xs text-gray-600">
                                {formatted.dayName} • {formatted.date} • {formatted.time}
                              </div>
                              {apt.alerts && (
                                <div className="flex gap-1 mt-1 flex-wrap">
                                  {apt.alerts.map((alert, i) => (
                                    <Badge key={i} className="bg-blue-100 text-blue-700 text-xs">
                                      <Bell className="h-2 w-2 ml-1" />
                                      {ALERT_TYPES.find(a => a.value === alert)?.label}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button className="dense-action-btn">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button className="dense-action-btn">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 820-11: التقارير
      case '820-11':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FileText className="h-5 w-5" />
                  تقارير المواعيد
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Download className="h-3 w-3" />
                    تصدير PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* فلاتر التقرير */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      تخصيص التقرير
                    </h3>
                    <div className="dense-grid dense-grid-3 gap-3">
                      <SelectWithCopy
                        label="نوع المواعيد"
                        id="reportType"
                        value=""
                        onChange={() => {}}
                        options={[
                          { value: '', label: 'جميع الأنواع' },
                          ...APPOINTMENT_TYPES.map(t => ({ value: t.value, label: t.label }))
                        ]}
                      />

                      <DateInputWithToday
                        label="من تاريخ"
                        id="reportFromDate"
                        value=""
                        onChange={() => {}}
                      />

                      <DateInputWithToday
                        label="إلى تاريخ"
                        id="reportToDate"
                        value=""
                        onChange={() => {}}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* ملخص التقرير */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      ملخص التقرير
                    </h3>
                    <div className="dense-grid dense-grid-4 gap-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">إجمالي المواعيد</div>
                        <div className="text-2xl font-bold text-blue-600">{statistics.total}</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">مكتملة</div>
                        <div className="text-2xl font-bold text-green-600">{statistics.completed}</div>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">قادمة</div>
                        <div className="text-2xl font-bold text-yellow-600">{statistics.upcoming}</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">متأخرة</div>
                        <div className="text-2xl font-bold text-red-600">{statistics.overdue}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* توزيع المواعيد حسب النوع */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      توزيع المواعيد حسب النوع
                    </h3>
                    <div className="space-y-2">
                      {APPOINTMENT_TYPES.map((type) => {
                        const count = appointments.filter(a => a.type === type.value).length;
                        const percentage = statistics.total > 0 ? (count / statistics.total) * 100 : 0;
                        
                        return (
                          <div key={type.value} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {React.createElement(type.icon, { className: 'h-4 w-4 text-blue-600' })}
                                <span className="text-xs font-medium">{type.label}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">{count} موعد</span>
                                <Badge className={type.color}>
                                  {percentage.toFixed(1)}%
                                </Badge>
                              </div>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 820-12: الإحصائيات
      case '820-12':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <TrendingUp className="h-5 w-5" />
                  الإحصائيات والتحليلات
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-secondary">
                    <RefreshCw className="h-3 w-3" />
                    تحديث
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* إحصائيات رئيسية */}
                  <div className="dense-grid dense-grid-5 gap-3">
                    {[
                      { label: 'إجمالي المواعيد', value: statistics.total, icon: Calendar, color: 'blue' },
                      { label: 'معدل الإكمال', value: `${statistics.total > 0 ? ((statistics.completed / statistics.total) * 100).toFixed(1) : 0}%`, icon: CheckCircle, color: 'green' },
                      { label: 'مواعيد اليوم', value: statistics.today, icon: CalendarDays, color: 'indigo' },
                      { label: 'متأخرة', value: statistics.overdue, icon: AlertCircle, color: 'red' },
                      { label: 'عاجلة', value: statistics.urgent, icon: BellRing, color: 'orange' }
                    ].map((stat, i) => (
                      <div key={i} className="dense-stat-card">
                        <div className={`dense-stat-icon bg-${stat.color}-100 text-${stat.color}-600`}>
                          {React.createElement(stat.icon, { className: 'w-4 h-4' })}
                        </div>
                        <div className="dense-stat-number">{stat.value}</div>
                        <div className="dense-stat-label">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* أداء المواعيد */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      أداء المواعيد
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                        <div className="text-xs text-gray-600 mb-2">نسبة الالتزام بالمواعيد</div>
                        <div className="flex items-end gap-2">
                          <div className="text-3xl font-bold text-blue-600">
                            {statistics.total > 0 ? (((statistics.total - statistics.overdue) / statistics.total) * 100).toFixed(1) : 100}%
                          </div>
                          <div className="text-xs text-green-600 mb-1">
                            <TrendingUp className="h-3 w-3 inline mr-1" />
                            ممتاز
                          </div>
                        </div>
                        <Progress 
                          value={statistics.total > 0 ? ((statistics.total - statistics.overdue) / statistics.total) * 100 : 100} 
                          className="h-2 mt-2" 
                        />
                      </div>

                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="text-xs text-gray-600 mb-2">نسبة الإكمال</div>
                        <div className="flex items-end gap-2">
                          <div className="text-3xl font-bold text-green-600">
                            {statistics.total > 0 ? ((statistics.completed / statistics.total) * 100).toFixed(1) : 0}%
                          </div>
                          <div className="text-xs text-blue-600 mb-1">
                            {statistics.completed} من {statistics.total}
                          </div>
                        </div>
                        <Progress 
                          value={statistics.total > 0 ? (statistics.completed / statistics.total) * 100 : 0} 
                          className="h-2 mt-2" 
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* توزيع حسب الحالة */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      توزيع المواعيد حسب الحالة
                    </h3>
                    <div className="space-y-2">
                      {APPOINTMENT_STATUSES.map((status) => {
                        const count = appointments.filter(a => a.status === status.value).length;
                        const percentage = statistics.total > 0 ? (count / statistics.total) * 100 : 0;
                        
                        return (
                          <div key={status.value} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium">{status.label}</span>
                                <span className="text-xs text-gray-600">{count} موعد ({percentage.toFixed(1)}%)</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                            <Badge className={status.color}>
                              {count}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 820-13: الأرشيف
      case '820-13':
        const archivedAppointments = appointments.filter(a => 
          a.status === 'completed' || a.status === 'cancelled'
        );
        
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Archive className="h-5 w-5" />
                  أرشيف المواعيد ({archivedAppointments.length})
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-secondary">
                    <Download className="h-3 w-3" />
                    تصدير الأرشيف
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* فلاتر الأرشيف */}
                  <div className="dense-grid dense-grid-3 gap-3">
                    <SelectWithCopy
                      label="نوع الموعد"
                      id="archiveType"
                      value=""
                      onChange={() => {}}
                      options={[
                        { value: '', label: 'جميع الأنواع' },
                        ...APPOINTMENT_TYPES.map(t => ({ value: t.value, label: t.label }))
                      ]}
                    />

                    <DateInputWithToday
                      label="من تاريخ"
                      id="archiveFromDate"
                      value=""
                      onChange={() => {}}
                    />

                    <DateInputWithToday
                      label="إلى تاريخ"
                      id="archiveToDate"
                      value=""
                      onChange={() => {}}
                    />
                  </div>

                  <Separator />

                  {/* قائمة الأرشيف */}
                  <div className="space-y-2">
                    {archivedAppointments.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Archive className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600">لا توجد مواعيد مؤرشفة</p>
                      </div>
                    ) : (
                      archivedAppointments.map((appointment) => {
                        const typeInfo = APPOINTMENT_TYPES.find(t => t.value === appointment.type);
                        const statusInfo = APPOINTMENT_STATUSES.find(s => s.value === appointment.status);
                        const formatted = formatDateTime(appointment.datetime);

                        return (
                          <Card key={appointment.id} className="dense-content-card opacity-75">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Archive className="h-4 w-4 text-gray-500" />
                                <div>
                                  <div className="compact-text font-medium text-gray-700">{appointment.title}</div>
                                  <div className="text-xs text-gray-500">{formatted.date} - {formatted.time}</div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Badge className={typeInfo?.color}>
                                  {typeInfo?.label}
                                </Badge>
                                <Badge className={statusInfo?.color}>
                                  {statusInfo?.label}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button className="dense-action-btn">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button className="dense-action-btn">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 820-14: المزامنة
      case '820-14':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <RefreshCw className="h-5 w-5" />
                  المزامنة مع التقويمات الخارجية
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <RefreshCw className="h-3 w-3" />
                    مزامنة الآن
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* حالة المزامنة */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="compact-title text-green-800">المزامنة نشطة</div>
                        <div className="text-xs text-green-600">آخر مزامنة: منذ 5 دقائق</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* خدمات المزامنة */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      خدمات التقويم المتصلة
                    </h3>
                    <div className="space-y-2">
                      {[
                        { name: 'Google Calendar', icon: Globe, status: 'connected', count: 15 },
                        { name: 'Microsoft Outlook', icon: Mail, status: 'connected', count: 8 },
                        { name: 'Apple iCloud', icon: Shield, status: 'disconnected', count: 0 }
                      ].map((service, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {React.createElement(service.icon, { className: 'h-5 w-5 text-blue-600' })}
                            <div>
                              <div className="compact-text font-medium">{service.name}</div>
                              <div className="text-xs text-gray-600">
                                {service.status === 'connected' ? `${service.count} موعد مزامن` : 'غير متصل'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {service.status === 'connected' ? (
                              <>
                                <Badge className="bg-green-100 text-green-700">متصل</Badge>
                                <Button className="dense-btn dense-btn-secondary">
                                  قطع الاتصال
                                </Button>
                              </>
                            ) : (
                              <>
                                <Badge className="bg-gray-100 text-gray-700">غير متصل</Badge>
                                <Button className="dense-btn dense-btn-primary">
                                  اتصال
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* إعدادات المزامنة */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      إعدادات المزامنة
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'مزامنة تلقائية كل ساعة', enabled: true },
                        { label: 'مزامنة المواعيد المكتملة', enabled: false },
                        { label: 'مزامنة التنبيهات', enabled: true },
                        { label: 'مزامنة الحضور', enabled: true }
                      ].map((setting, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-xs">{setting.label}</span>
                          <Switch checked={setting.enabled} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 820-15: الإعدادات
      case '820-15':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Settings className="h-5 w-5" />
                  إعدادات نظام المواعيد
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <CheckCircle className="h-3 w-3" />
                    حفظ الإعدادات
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* إعدادات عامة */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      إعدادات عامة
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'تفعيل التنبيهات التلقائية', enabled: true },
                        { label: 'إرسال تذكير قبل كل موعد بـ 24 ساعة', enabled: true },
                        { label: 'السماح بالمواعيد المتداخلة', enabled: false },
                        { label: 'تأكيد المواعيد تلقائياً', enabled: false },
                        { label: 'أرشفة المواعيد المكتملة تلقائياً', enabled: true }
                      ].map((setting, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <span className="text-xs font-medium">{setting.label}</span>
                          <Switch checked={setting.enabled} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* إعدادات التنبيهات الافتراضية */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      التنبيهات الافتراضية للمواعيد الجديدة
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <div>
                        <label className="text-xs font-medium mb-2 block">أوقات التنبيه</label>
                        <div className="space-y-2">
                          {ALERT_TYPES.slice(0, 5).map((alert) => (
                            <div key={alert.value} className="flex items-center gap-2 p-2 bg-white rounded border">
                              <input type="checkbox" id={`default-alert-${alert.value}`} className="w-4 h-4" />
                              <label htmlFor={`default-alert-${alert.value}`} className="text-xs flex-1">
                                {alert.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium mb-2 block">قنوات الإرسال</label>
                        <div className="space-y-2">
                          {NOTIFICATION_CHANNELS.map((channel) => (
                            <div key={channel.value} className="flex items-center gap-2 p-2 bg-white rounded border">
                              <input type="checkbox" id={`default-channel-${channel.value}`} className="w-4 h-4" defaultChecked />
                              <label htmlFor={`default-channel-${channel.value}`} className="text-xs flex-1 flex items-center gap-2">
                                {React.createElement(channel.icon, { className: 'h-3 w-3' })}
                                {channel.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* إعدادات العرض */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      إعدادات العرض
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <SelectWithCopy
                        label="عرض التقويم الافتراضي"
                        id="defaultCalendarView"
                        value=""
                        onChange={() => {}}
                        options={[
                          { value: 'month', label: 'شهر' },
                          { value: 'week', label: 'أسبوع' },
                          { value: 'day', label: 'يوم' }
                        ]}
                      />

                      <SelectWithCopy
                        label="ترتيب المواعيد"
                        id="defaultSort"
                        value=""
                        onChange={() => {}}
                        options={[
                          { value: 'date', label: 'حسب التاريخ' },
                          { value: 'priority', label: 'حسب الأولوية' },
                          { value: 'type', label: 'حسب النوع' }
                        ]}
                      />

                      <SelectWithCopy
                        label="بداية الأسبوع"
                        id="weekStart"
                        value=""
                        onChange={() => {}}
                        options={[
                          { value: 'sunday', label: 'الأحد' },
                          { value: 'saturday', label: 'السبت' },
                          { value: 'monday', label: 'الإثنين' }
                        ]}
                      />

                      <InputWithCopy
                        label="المدة الافتراضية (دقيقة)"
                        id="defaultDuration"
                        type="number"
                        value="60"
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // باقي التابات
      default:
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <div className="flex items-center gap-2">
                  {React.createElement(tab.icon, { className: 'h-5 w-5 text-blue-600' })}
                  <h2 className="dense-section-title">{tab.title}</h2>
                </div>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    حفظ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {React.createElement(tab.icon, { className: 'h-10 w-10 text-blue-600' })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {tab.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    محتوى تفصيلي متاح - جميع الحقول محسّنة
                  </p>
                  <Badge className="bg-blue-100 text-blue-700">{tab.number}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="screen-with-vertical-tabs-layout">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إدارة المواعيد
              </h2>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                15 تبويب • الشاشة 820
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-1 mt-2">
            <Badge className="text-xs bg-blue-100 text-blue-800">
              <Calendar className="w-2 h-2 ml-1" />
              {statistics.total} موعد
            </Badge>
            <Badge className="text-xs bg-green-100 text-green-800">
              {statistics.today} اليوم
            </Badge>
          </div>
        </div>

        <ScrollArea className="vertical-tabs-sidebar-body">
          {TABS_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`vertical-tab-item-condensed ${activeTab === tab.id ? 'active' : ''}`}
            >
              <div className="flex items-center gap-2 flex-1">
                {React.createElement(tab.icon, { className: 'h-4 w-4 flex-shrink-0' })}
                <span className="vertical-tab-title-condensed">{tab.title}</span>
              </div>
              <span className={`vertical-tab-number-condensed ${activeTab === tab.id ? 'active' : ''}`}>
                {tab.number}
              </span>
            </button>
          ))}
        </ScrollArea>

        <div className="vertical-tabs-sidebar-footer">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {TABS_CONFIG.findIndex(tab => tab.id === activeTab) + 1} من {TABS_CONFIG.length}
            </span>
            <Button className="dense-btn dense-btn-primary">
              <Plus className="h-3 w-3" />
              إضافة
            </Button>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="vertical-tabs-content-area">
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الشاشة 820 - إدارة المواعيد
                </h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نظام شامل • 15 تبويب • تنبيهات متقدمة
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 ml-1" />
                {statistics.total} موعد
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                <code className="font-code">SCR-820</code>
              </Badge>
            </div>
          </div>
        </div>

        <div className="vertical-tabs-content-body">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsManagement_Complete_820;
