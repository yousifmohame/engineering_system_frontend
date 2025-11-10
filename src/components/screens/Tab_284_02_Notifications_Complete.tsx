/**
 * التاب 284-02 - الإشعارات والتنبيهات الشاملة
 * ============================================
 * 
 * نظام شامل لإدارة ومراقبة جميع التنبيهات والإشعارات المتعلقة بالمعاملة
 * 
 * أنواع التنبيهات:
 * 1. المستندات الناقصة أو منتهية الصلاحية
 * 2. تأخير السداد من العميل للمكتب
 * 3. مستحقات متأخرة للجهات
 * 4. اقتراب موعد انتهاء الفواتير
 * 5. المهام المتأخرة أو القريبة من الموعد
 * 6. طلبات الجهات التي تتطلب رداً عاجلاً
 * 
 * الميزات:
 * - ترميز لوني حسب الأهمية (أحمر، أصفر، أخضر)
 * - عداد تنازلي بالأيام والساعات
 * - تحديد كـ "تم الاطلاع" أو "تم المعالجة"
 * - سجل تاريخي
 * - فلترة وتصنيف متقدمة
 * - إشعارات فورية
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Bell, AlertTriangle, Clock, CheckCircle, Eye, EyeOff, Archive,
  FileText, CreditCard, DollarSign, Calendar, Send, TrendingUp,
  Filter, Search, X, RefreshCw, Download, Printer, Settings,
  AlertCircle, Info, ChevronRight, Play, Pause, Ban, Check,
  FileX, FileWarning, LucideIcon, Target, Users, Building
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';

// ==================== الواجهات ====================

interface Notification {
  id: string;
  type: 'document' | 'payment_delay' | 'entity_dues' | 'invoice_expiry' | 'task_delay' | 'entity_request';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'viewed' | 'processed' | 'archived';
  createdAt: string;
  dueDate?: string;
  remainingDays?: number;
  remainingHours?: number;
  relatedEntity?: string;
  relatedDocument?: string;
  relatedAmount?: number;
  actionRequired: boolean;
  viewedAt?: string;
  viewedBy?: string;
  processedAt?: string;
  processedBy?: string;
  notes?: string;
}

// ==================== البيانات الوهمية ====================

const MOCK_NOTIFICATIONS: Notification[] = [
  // المستندات الناقصة أو منتهية الصلاحية
  {
    id: 'NOT-001',
    type: 'document',
    title: 'صلاحية الصك تنتهي قريباً',
    description: 'صك الملكية للعقار سينتهي صلاحيته خلال 5 أيام',
    severity: 'critical',
    status: 'new',
    createdAt: '2025-10-25 09:30',
    dueDate: '2025-10-30',
    remainingDays: 5,
    remainingHours: 120,
    relatedDocument: 'صك الملكية رقم 450123789',
    actionRequired: true
  },
  {
    id: 'NOT-002',
    type: 'document',
    title: 'مستند هوية المالك ناقص',
    description: 'لم يتم رفع صورة من هوية المالك حتى الآن',
    severity: 'high',
    status: 'new',
    createdAt: '2025-10-24 14:20',
    dueDate: '2025-10-27',
    remainingDays: 2,
    remainingHours: 48,
    relatedDocument: 'هوية المالك',
    actionRequired: true
  },
  {
    id: 'NOT-003',
    type: 'document',
    title: 'انتهت صلاحية رخصة البناء',
    description: 'رخصة البناء للمشروع انتهت منذ 3 أيام',
    severity: 'critical',
    status: 'viewed',
    createdAt: '2025-10-22 10:15',
    dueDate: '2025-10-22',
    remainingDays: -3,
    remainingHours: -72,
    relatedDocument: 'رخصة البناء رقم 789456',
    actionRequired: true,
    viewedAt: '2025-10-23 08:00',
    viewedBy: 'م. أحمد العلي'
  },

  // تأخير السداد من العميل للمكتب
  {
    id: 'NOT-004',
    type: 'payment_delay',
    title: 'تأخر سداد الدفعة الثانية',
    description: 'الدفعة الثانية بقيمة 50,000 ريال متأخرة منذ 7 أيام',
    severity: 'high',
    status: 'new',
    createdAt: '2025-10-24 11:00',
    dueDate: '2025-10-18',
    remainingDays: -7,
    remainingHours: -168,
    relatedEntity: 'المالك: عبدالله السعيد',
    relatedAmount: 50000,
    actionRequired: true
  },
  {
    id: 'NOT-005',
    type: 'payment_delay',
    title: 'اقتراب موعد الدفعة الثالثة',
    description: 'الدفعة الثالثة بقيمة 30,000 ريال مستحقة خلال 3 أيام',
    severity: 'medium',
    status: 'new',
    createdAt: '2025-10-25 08:15',
    dueDate: '2025-10-28',
    remainingDays: 3,
    remainingHours: 72,
    relatedEntity: 'المالك: عبدالله السعيد',
    relatedAmount: 30000,
    actionRequired: false
  },

  // مستحقات متأخرة للجهات
  {
    id: 'NOT-006',
    type: 'entity_dues',
    title: 'رسوم البلدية متأخرة',
    description: 'رسوم البلدية بقيمة 15,000 ريال متأخرة منذ 10 أيام',
    severity: 'critical',
    status: 'processed',
    createdAt: '2025-10-15 13:45',
    dueDate: '2025-10-15',
    remainingDays: -10,
    remainingHours: -240,
    relatedEntity: 'البلدية',
    relatedAmount: 15000,
    actionRequired: false,
    processedAt: '2025-10-24 10:30',
    processedBy: 'م. سعد الحربي',
    notes: 'تم السداد بالكامل'
  },
  {
    id: 'NOT-007',
    type: 'entity_dues',
    title: 'رسوم الدفاع المدني قريبة',
    description: 'رسوم الدفاع المدني بقيمة 8,500 ريال مستحقة خلال 5 أيام',
    severity: 'medium',
    status: 'viewed',
    createdAt: '2025-10-23 09:20',
    dueDate: '2025-10-30',
    remainingDays: 5,
    remainingHours: 120,
    relatedEntity: 'الدفاع المدني',
    relatedAmount: 8500,
    actionRequired: true,
    viewedAt: '2025-10-24 07:15',
    viewedBy: 'م. خالد المطيري'
  },

  // اقتراب موعد انتهاء الفواتير
  {
    id: 'NOT-008',
    type: 'invoice_expiry',
    title: 'فاتورة الكهرباء تنتهي خلال يومين',
    description: 'فاتورة الكهرباء للمشروع تنتهي خلال 48 ساعة',
    severity: 'high',
    status: 'new',
    createdAt: '2025-10-25 07:00',
    dueDate: '2025-10-27',
    remainingDays: 2,
    remainingHours: 48,
    relatedEntity: 'شركة الكهرباء',
    relatedAmount: 5200,
    actionRequired: true
  },
  {
    id: 'NOT-009',
    type: 'invoice_expiry',
    title: 'فاتورة المياه تنتهي اليوم',
    description: 'فاتورة المياه تنتهي في نهاية اليوم',
    severity: 'critical',
    status: 'new',
    createdAt: '2025-10-25 06:30',
    dueDate: '2025-10-25',
    remainingDays: 0,
    remainingHours: 8,
    relatedEntity: 'شركة المياه',
    relatedAmount: 3800,
    actionRequired: true
  },

  // المهام المتأخرة أو القريبة من الموعد
  {
    id: 'NOT-010',
    type: 'task_delay',
    title: 'مهمة التصميم متأخرة',
    description: 'مهمة إعداد التصميم الإنشائي متأخرة 4 أيام',
    severity: 'high',
    status: 'new',
    createdAt: '2025-10-21 16:00',
    dueDate: '2025-10-21',
    remainingDays: -4,
    remainingHours: -96,
    relatedEntity: 'م. محمد الأحمد (مهندس التصميم)',
    actionRequired: true
  },
  {
    id: 'NOT-011',
    type: 'task_delay',
    title: 'مهمة المعاينة اليوم',
    description: 'معاينة الموقع مجدولة اليوم الساعة 2 ظهراً',
    severity: 'medium',
    status: 'viewed',
    createdAt: '2025-10-25 08:00',
    dueDate: '2025-10-25',
    remainingDays: 0,
    remainingHours: 4,
    relatedEntity: 'م. فيصل القحطاني (مهندس موقع)',
    actionRequired: false,
    viewedAt: '2025-10-25 08:30',
    viewedBy: 'م. أحمد العلي'
  },

  // طلبات الجهات التي تتطلب رداً عاجلاً
  {
    id: 'NOT-012',
    type: 'entity_request',
    title: 'طلب عاجل من البلدية',
    description: 'البلدية تطلب تعديل المخططات خلال 24 ساعة',
    severity: 'critical',
    status: 'new',
    createdAt: '2025-10-25 10:00',
    dueDate: '2025-10-26',
    remainingDays: 1,
    remainingHours: 24,
    relatedEntity: 'البلدية - قسم التراخيص',
    actionRequired: true
  },
  {
    id: 'NOT-013',
    type: 'entity_request',
    title: 'استفسار من الدفاع المدني',
    description: 'استفسار حول مخارج الطوارئ يحتاج رد خلال 48 ساعة',
    severity: 'high',
    status: 'viewed',
    createdAt: '2025-10-24 14:30',
    dueDate: '2025-10-26',
    remainingDays: 1,
    remainingHours: 34,
    relatedEntity: 'الدفاع المدني',
    actionRequired: true,
    viewedAt: '2025-10-25 09:00',
    viewedBy: 'م. سعد الحربي'
  },
  {
    id: 'NOT-014',
    type: 'entity_request',
    title: 'طلب مستندات إضافية من الأمانة',
    description: 'الأمانة تطلب مستندات ملكية إضافية',
    severity: 'medium',
    status: 'archived',
    createdAt: '2025-10-20 11:15',
    dueDate: '2025-10-23',
    remainingDays: -2,
    remainingHours: -48,
    relatedEntity: 'الأمانة',
    actionRequired: false,
    processedAt: '2025-10-22 15:00',
    processedBy: 'م. خالد المطيري',
    notes: 'تم إرسال المستندات بالكامل'
  }
];

// ==================== المكون ====================

const Tab_284_02_Notifications_Complete: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeView, setActiveView] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // نوافذ منبثقة
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [processNotes, setProcessNotes] = useState('');

  // دالة الحصول على اللون حسب الأهمية
  const getSeverityConfig = (severity: string) => {
    const configs: Record<string, { color: string; bgColor: string; label: string; icon: LucideIcon }> = {
      'critical': { 
        color: '#dc2626', 
        bgColor: 'rgba(220, 38, 38, 0.1)', 
        label: 'حرج', 
        icon: AlertCircle 
      },
      'high': { 
        color: '#ea580c', 
        bgColor: 'rgba(234, 88, 12, 0.1)', 
        label: 'عالي', 
        icon: AlertTriangle 
      },
      'medium': { 
        color: '#f59e0b', 
        bgColor: 'rgba(245, 158, 11, 0.1)', 
        label: 'متوسط', 
        icon: Info 
      },
      'low': { 
        color: '#10b981', 
        bgColor: 'rgba(16, 185, 129, 0.1)', 
        label: 'منخفض', 
        icon: CheckCircle 
      }
    };
    return configs[severity] || configs['medium'];
  };

  // دالة الحصول على نوع التنبيه
  const getTypeConfig = (type: string) => {
    const configs: Record<string, { label: string; icon: LucideIcon; color: string }> = {
      'document': { label: 'مستندات', icon: FileText, color: '#3b82f6' },
      'payment_delay': { label: 'تأخر سداد', icon: CreditCard, color: '#dc2626' },
      'entity_dues': { label: 'مستحقات جهات', icon: Building, color: '#7c3aed' },
      'invoice_expiry': { label: 'فواتير', icon: FileWarning, color: '#f59e0b' },
      'task_delay': { label: 'مهام', icon: Target, color: '#06b6d4' },
      'entity_request': { label: 'طلبات جهات', icon: Send, color: '#ec4899' }
    };
    return configs[type] || configs['document'];
  };

  // دالة الحصول على حالة التنبيه
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; icon: LucideIcon }> = {
      'new': { label: 'جديد', color: '#3b82f6', icon: Bell },
      'viewed': { label: 'تم الاطلاع', color: '#f59e0b', icon: Eye },
      'processed': { label: 'تم المعالجة', color: '#10b981', icon: CheckCircle },
      'archived': { label: 'مؤرشف', color: '#6b7280', icon: Archive }
    };
    return configs[status] || configs['new'];
  };

  // دالة حساب الوقت المتبقي
  const getRemainingTimeText = (days?: number, hours?: number) => {
    if (days === undefined || hours === undefined) return '';
    
    if (days < 0) {
      return `متأخر ${Math.abs(days)} يوم`;
    } else if (days === 0) {
      if (hours < 0) {
        return `متأخر ${Math.abs(hours)} ساعة`;
      } else {
        return `متبقي ${hours} ساعة`;
      }
    } else {
      return `متبقي ${days} يوم`;
    }
  };

  // تصفية التنبيهات
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      // البحث
      const matchesSearch = searchTerm === '' || 
        notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.description.toLowerCase().includes(searchTerm.toLowerCase());

      // تصفية الأهمية
      const matchesSeverity = severityFilter === '' || notif.severity === severityFilter;

      // تصفية النوع
      const matchesType = typeFilter === '' || notif.type === typeFilter;

      // تصفية الحالة
      const matchesStatus = statusFilter === '' || notif.status === statusFilter;

      // العرض النشط
      let matchesView = true;
      if (activeView === 'new') matchesView = notif.status === 'new';
      else if (activeView === 'viewed') matchesView = notif.status === 'viewed';
      else if (activeView === 'processed') matchesView = notif.status === 'processed';
      else if (activeView === 'critical') matchesView = notif.severity === 'critical';
      else if (activeView === 'actionRequired') matchesView = notif.actionRequired;

      return matchesSearch && matchesSeverity && matchesType && matchesStatus && matchesView;
    });
  }, [notifications, searchTerm, severityFilter, typeFilter, statusFilter, activeView]);

  // إحصائيات
  const stats = useMemo(() => {
    return {
      total: notifications.length,
      new: notifications.filter(n => n.status === 'new').length,
      viewed: notifications.filter(n => n.status === 'viewed').length,
      processed: notifications.filter(n => n.status === 'processed').length,
      critical: notifications.filter(n => n.severity === 'critical').length,
      actionRequired: notifications.filter(n => n.actionRequired && n.status !== 'processed').length
    };
  }, [notifications]);

  // دوال الإجراءات
  const markAsViewed = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id && n.status === 'new' 
        ? { ...n, status: 'viewed' as const, viewedAt: new Date().toISOString(), viewedBy: 'م. أحمد العلي' }
        : n
    ));
  };

  const markAsProcessed = (id: string, notes: string) => {
    setNotifications(notifications.map(n => 
      n.id === id && n.status !== 'processed'
        ? { ...n, status: 'processed' as const, processedAt: new Date().toISOString(), processedBy: 'م. أحمد العلي', notes }
        : n
    ));
    setShowProcessDialog(false);
    setProcessNotes('');
  };

  const archiveNotification = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, status: 'archived' as const } : n
    ));
  };

  const handleViewDetails = (notif: Notification) => {
    setSelectedNotification(notif);
    setShowDetailsDialog(true);
    if (notif.status === 'new') {
      markAsViewed(notif.id);
    }
  };

  const handleProcess = (notif: Notification) => {
    setSelectedNotification(notif);
    setShowProcessDialog(true);
  };

  return (
    <div className="space-y-4">
      <CodeDisplay code="TAB-284-02" position="top-right" />

      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-6 gap-2">
        <Card 
          className="cursor-pointer transition-all hover:shadow-md"
          style={{ 
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            border: activeView === 'all' ? '2px solid #2563eb' : '1px solid #93c5fd'
          }}
          onClick={() => setActiveView('all')}
        >
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  إجمالي التنبيهات
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>
                  {stats.total}
                </p>
              </div>
              <Bell className="h-5 w-5 text-blue-600 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-md"
          style={{ 
            background: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)',
            border: activeView === 'new' ? '2px solid #3b82f6' : '1px solid #60a5fa'
          }}
          onClick={() => setActiveView('new')}
        >
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  جديدة
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>
                  {stats.new}
                </p>
              </div>
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-md"
          style={{ 
            background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
            border: activeView === 'viewed' ? '2px solid #f59e0b' : '1px solid #fb923c'
          }}
          onClick={() => setActiveView('viewed')}
        >
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  تم الاطلاع
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>
                  {stats.viewed}
                </p>
              </div>
              <Eye className="h-5 w-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-md"
          style={{ 
            background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
            border: activeView === 'processed' ? '2px solid #10b981' : '1px solid #6ee7b7'
          }}
          onClick={() => setActiveView('processed')}
        >
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  تم المعالجة
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>
                  {stats.processed}
                </p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-md"
          style={{ 
            background: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)',
            border: activeView === 'critical' ? '2px solid #dc2626' : '1px solid #f87171'
          }}
          onClick={() => setActiveView('critical')}
        >
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  حرجة
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>
                  {stats.critical}
                </p>
              </div>
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-md"
          style={{ 
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: activeView === 'actionRequired' ? '2px solid #f59e0b' : '1px solid #fcd34d'
          }}
          onClick={() => setActiveView('actionRequired')}
        >
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  تتطلب إجراء
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>
                  {stats.actionRequired}
                </p>
              </div>
              <Target className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* شريط البحث والفلترة */}
      <Card className="card-rtl">
        <CardContent className="p-3">
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-2">
              <InputWithCopy
                id="search-notifications"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث في التنبيهات..."
                copyable={false}
                clearable={true}
              />
            </div>

            <SelectWithCopy
              id="severity-filter"
              value={severityFilter}
              onChange={setSeverityFilter}
              options={[
                { value: '', label: 'كل الأهميات' },
                { value: 'critical', label: 'حرج' },
                { value: 'high', label: 'عالي' },
                { value: 'medium', label: 'متوسط' },
                { value: 'low', label: 'منخفض' }
              ]}
              copyable={false}
              clearable={true}
            />

            <SelectWithCopy
              id="type-filter"
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { value: '', label: 'كل الأنواع' },
                { value: 'document', label: 'مستندات' },
                { value: 'payment_delay', label: 'تأخر سداد' },
                { value: 'entity_dues', label: 'مستحقات جهات' },
                { value: 'invoice_expiry', label: 'فواتير' },
                { value: 'task_delay', label: 'مهام' },
                { value: 'entity_request', label: 'طلبات جهات' }
              ]}
              copyable={false}
              clearable={true}
            />

            <SelectWithCopy
              id="status-filter"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: '', label: 'كل الحالات' },
                { value: 'new', label: 'جديد' },
                { value: 'viewed', label: 'تم الاطلاع' },
                { value: 'processed', label: 'تم المعالجة' },
                { value: 'archived', label: 'مؤرشف' }
              ]}
              copyable={false}
              clearable={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* قائمة التنبيهات */}
      <Card className="card-rtl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              التنبيهات ({filteredNotifications.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <RefreshCw className="h-3 w-3 ml-1" />
                تحديث
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-3 w-3 ml-1" />
                تصدير
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea style={{ height: 'calc(100vh - 480px)' }}>
            <div className="space-y-2">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    لا توجد تنبيهات حالياً
                  </p>
                </div>
              ) : (
                filteredNotifications.map(notif => {
                  const severityConfig = getSeverityConfig(notif.severity);
                  const typeConfig = getTypeConfig(notif.type);
                  const statusConfig = getStatusConfig(notif.status);
                  const SeverityIcon = severityConfig.icon;
                  const TypeIcon = typeConfig.icon;

                  return (
                    <div
                      key={notif.id}
                      className="p-3 rounded-lg cursor-pointer transition-all hover:shadow-md"
                      style={{
                        background: notif.status === 'new' ? '#fef3c7' : '#f8fafc',
                        border: `2px solid ${severityConfig.color}40`,
                        borderRight: `4px solid ${severityConfig.color}`
                      }}
                      onClick={() => handleViewDetails(notif)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* الأيقونة والمحتوى */}
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className="p-2 rounded-lg"
                            style={{
                              background: severityConfig.bgColor,
                              border: `1px solid ${severityConfig.color}40`
                            }}
                          >
                            <SeverityIcon className="h-5 w-5" style={{ color: severityConfig.color }} />
                          </div>

                          <div className="flex-1">
                            {/* العنوان */}
                            <div className="flex items-center gap-2 mb-1">
                              <h4
                                style={{
                                  fontFamily: 'Tajawal, sans-serif',
                                  fontWeight: 700,
                                  fontSize: '13px',
                                  color: '#1f2937'
                                }}
                              >
                                {notif.title}
                              </h4>
                              {notif.actionRequired && (
                                <Badge
                                  style={{
                                    background: '#fef3c7',
                                    color: '#f59e0b',
                                    border: '1px solid #fcd34d',
                                    fontSize: '9px',
                                    padding: '2px 6px'
                                  }}
                                >
                                  <Target className="h-2.5 w-2.5 ml-0.5" />
                                  إجراء مطلوب
                                </Badge>
                              )}
                            </div>

                            {/* الوصف */}
                            <p
                              className="text-xs mb-2"
                              style={{
                                fontFamily: 'Tajawal, sans-serif',
                                color: '#6b7280'
                              }}
                            >
                              {notif.description}
                            </p>

                            {/* التفاصيل الإضافية */}
                            <div className="flex flex-wrap gap-2 text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <Badge variant="outline" style={{ fontSize: '10px' }}>
                                <TypeIcon className="h-3 w-3 ml-1" style={{ color: typeConfig.color }} />
                                {typeConfig.label}
                              </Badge>

                              {notif.relatedEntity && (
                                <Badge variant="outline" style={{ fontSize: '10px' }}>
                                  <Building className="h-3 w-3 ml-1" />
                                  {notif.relatedEntity}
                                </Badge>
                              )}

                              {notif.relatedAmount && (
                                <Badge variant="outline" style={{ fontSize: '10px' }}>
                                  <DollarSign className="h-3 w-3 ml-1" />
                                  {notif.relatedAmount.toLocaleString('ar-SA')} ريال
                                </Badge>
                              )}

                              <Badge variant="outline" style={{ fontSize: '10px' }}>
                                <Clock className="h-3 w-3 ml-1" />
                                {notif.createdAt}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* الوقت المتبقي والإجراءات */}
                        <div className="flex flex-col items-end gap-2">
                          {/* العداد التنازلي */}
                          {notif.remainingDays !== undefined && (
                            <div
                              className="px-3 py-1.5 rounded-lg text-center"
                              style={{
                                background: notif.remainingDays! < 0
                                  ? 'linear-gradient(135deg, #fecaca 0%, #dc2626 100%)'
                                  : notif.remainingDays! <= 2
                                  ? 'linear-gradient(135deg, #fed7aa 0%, #f59e0b 100%)'
                                  : 'linear-gradient(135deg, #d1fae5 0%, #10b981 100%)',
                                minWidth: '100px'
                              }}
                            >
                              <div
                                className="font-mono"
                                style={{
                                  fontSize: '16px',
                                  fontWeight: 700,
                                  color: '#fff'
                                }}
                              >
                                {notif.remainingDays! < 0 ? '!' : ''}{Math.abs(notif.remainingDays!)}
                              </div>
                              <div
                                style={{
                                  fontSize: '9px',
                                  color: '#fff',
                                  fontFamily: 'Tajawal, sans-serif',
                                  marginTop: '2px'
                                }}
                              >
                                {getRemainingTimeText(notif.remainingDays, notif.remainingHours)}
                              </div>
                            </div>
                          )}

                          {/* الحالة */}
                          <Badge
                            style={{
                              background: `${statusConfig.color}15`,
                              color: statusConfig.color,
                              border: `1px solid ${statusConfig.color}40`,
                              fontSize: '10px'
                            }}
                          >
                            {statusConfig.label}
                          </Badge>

                          {/* أزرار الإجراءات */}
                          <div className="flex gap-1">
                            {notif.status !== 'processed' && notif.status !== 'archived' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleProcess(notif);
                                }}
                                style={{
                                  height: '24px',
                                  padding: '0 8px',
                                  fontSize: '10px'
                                }}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}

                            {notif.status !== 'archived' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  archiveNotification(notif.id);
                                }}
                                style={{
                                  height: '24px',
                                  padding: '0 8px',
                                  fontSize: '10px'
                                }}
                              >
                                <Archive className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* نافذة التفاصيل */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '18px' }}>
              تفاصيل التنبيه
            </DialogTitle>
          </DialogHeader>

          {selectedNotification && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">العنوان</p>
                  <p className="text-sm" style={{ fontWeight: 600 }}>{selectedNotification.title}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">الأهمية</p>
                  <Badge style={{
                    background: getSeverityConfig(selectedNotification.severity).bgColor,
                    color: getSeverityConfig(selectedNotification.severity).color,
                    border: `1px solid ${getSeverityConfig(selectedNotification.severity).color}40`
                  }}>
                    {getSeverityConfig(selectedNotification.severity).label}
                  </Badge>
                </div>

                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">الوصف</p>
                  <p className="text-sm">{selectedNotification.description}</p>
                </div>

                {selectedNotification.relatedEntity && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">الجهة المعنية</p>
                    <p className="text-sm">{selectedNotification.relatedEntity}</p>
                  </div>
                )}

                {selectedNotification.relatedAmount && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">المبلغ</p>
                    <p className="text-sm" style={{ fontWeight: 600 }}>
                      {selectedNotification.relatedAmount.toLocaleString('ar-SA')} ريال
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 mb-1">تاريخ الإنشاء</p>
                  <p className="text-sm">{selectedNotification.createdAt}</p>
                </div>

                {selectedNotification.dueDate && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">تاريخ الاستحقاق</p>
                    <p className="text-sm">{selectedNotification.dueDate}</p>
                  </div>
                )}

                {selectedNotification.viewedAt && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">تاريخ الاطلاع</p>
                      <p className="text-sm">{selectedNotification.viewedAt}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">من قبل</p>
                      <p className="text-sm">{selectedNotification.viewedBy}</p>
                    </div>
                  </>
                )}

                {selectedNotification.processedAt && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">تاريخ المعالجة</p>
                      <p className="text-sm">{selectedNotification.processedAt}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">من قبل</p>
                      <p className="text-sm">{selectedNotification.processedBy}</p>
                    </div>
                  </>
                )}

                {selectedNotification.notes && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">ملاحظات المعالجة</p>
                    <p className="text-sm">{selectedNotification.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إغلاق
            </Button>
            {selectedNotification && selectedNotification.status !== 'processed' && (
              <Button onClick={() => {
                setShowDetailsDialog(false);
                handleProcess(selectedNotification);
              }}>
                <CheckCircle className="h-4 w-4 ml-1" />
                معالجة التنبيه
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة المعالجة */}
      <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <DialogContent style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '18px' }}>
              معالجة التنبيه
            </DialogTitle>
            <DialogDescription>
              قم بإضافة ملاحظات حول كيفية معالجة هذا التنبيه
            </DialogDescription>
          </DialogHeader>

          {selectedNotification && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
                <p className="text-sm" style={{ fontWeight: 600, marginBottom: '4px' }}>
                  {selectedNotification.title}
                </p>
                <p className="text-xs text-gray-600">
                  {selectedNotification.description}
                </p>
              </div>

              <div>
                <label className="text-sm" style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  ملاحظات المعالجة *
                </label>
                <textarea
                  className="w-full p-3 rounded-lg border-2 border-gray-200"
                  style={{ fontFamily: 'Tajawal, sans-serif', minHeight: '100px' }}
                  value={processNotes}
                  onChange={(e) => setProcessNotes(e.target.value)}
                  placeholder="اكتب تفاصيل المعالجة..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowProcessDialog(false);
              setProcessNotes('');
            }}>
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            <Button
              onClick={() => {
                if (selectedNotification && processNotes.trim()) {
                  markAsProcessed(selectedNotification.id, processNotes);
                }
              }}
              disabled={!processNotes.trim()}
            >
              <CheckCircle className="h-4 w-4 ml-1" />
              تأكيد المعالجة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tab_284_02_Notifications_Complete;
