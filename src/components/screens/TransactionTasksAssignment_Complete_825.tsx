/**
 * الشاشة 825 - إسناد مهام المعاملات - نظام متكامل v1.0
 * ================================================================
 * 
 * نظام شامل لإدارة وإسناد مهام المعاملات:
 * - استعراض جميع المهام المسندة مع تفاصيلها الدقيقة
 * - تتبع مقدار التقدم لكل مهمة بشكل تفاعلي
 * - إسناد مهام جديدة للموظفين
 * - نظام إشعارات تلقائي شامل
 * - تقارير الأداء والإنتاجية
 * - إدارة الأولويات والمواعيد النهائية
 * - سجل التدقيق الكامل
 * 
 * التطوير: أكتوبر 2025 - v1.0
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import {
  Send, Eye, Edit, Trash2, Download, Upload, CheckCircle, Clock, AlertCircle,
  X, Search, Filter, Calendar, Users, Building, Settings, History, RefreshCw,
  Printer, Target, Award, TrendingUp, Bell, User, UserCheck, Activity, BarChart3,
  FileText, List, ClipboardList, CheckSquare, XSquare, AlertTriangle, Info,
  PlayCircle, PauseCircle, StopCircle, Flag, Star, MessageSquare, Paperclip,
  ArrowUp, ArrowDown, Layers, Plus, Snowflake, UserX, Ban, Share2
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

// ===== تكوين التابات =====
const TABS_CONFIG = [
  { id: '825-01', number: '825-01', title: 'نظرة عامة', icon: Activity },
  { id: '825-02', number: '825-02', title: 'المهام النشطة', icon: PlayCircle },
  { id: '825-03', number: '825-03', title: 'إسناد مهمة جديدة', icon: Send },
  { id: '825-04', number: '825-04', title: 'المهام المكتملة', icon: CheckCircle },
  { id: '825-05', number: '825-05', title: 'المهام المتأخرة', icon: AlertTriangle },
  { id: '825-06', number: '825-06', title: 'المهام المعلقة', icon: PauseCircle },
  { id: '825-07', number: '825-07', title: 'تفاصيل المهام', icon: FileText },
  { id: '825-08', number: '825-08', title: 'تقارير الأداء', icon: BarChart3 },
  { id: '825-09', number: '825-09', title: 'الموظفين والتكليف', icon: Users },
  { id: '825-10', number: '825-10', title: 'الإشعارات', icon: Bell },
  { id: '825-11', number: '825-11', title: 'سجل التدقيق', icon: History },
  { id: '825-12', number: '825-12', title: 'الإعدادات', icon: Settings },
];

// ===== حالات المهام =====
const TASK_STATUSES = [
  { value: 'pending', label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  { value: 'not-received', label: 'غير مستلمة', color: 'bg-amber-100 text-amber-700', icon: Bell },
  { value: 'in-progress', label: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-700', icon: PlayCircle },
  { value: 'paused', label: 'معلقة', color: 'bg-orange-100 text-orange-700', icon: PauseCircle },
  { value: 'frozen', label: 'مجمدة', color: 'bg-cyan-100 text-cyan-700', icon: PauseCircle },
  { value: 'completed', label: 'مكتملة', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'cancelled', label: 'ملغاة', color: 'bg-red-100 text-red-700', icon: XSquare },
  { value: 'overdue', label: 'متأخرة', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
];

// ===== أولويات المهام =====
const TASK_PRIORITIES = [
  { value: 'low', label: 'منخفضة', color: 'bg-gray-100 text-gray-700', icon: ArrowDown },
  { value: 'medium', label: 'متوسطة', color: 'bg-blue-100 text-blue-700', icon: Flag },
  { value: 'high', label: 'عالية', color: 'bg-orange-100 text-orange-700', icon: ArrowUp },
  { value: 'urgent', label: 'عاجلة', color: 'bg-red-100 text-red-700', icon: AlertCircle },
];

// ===== أنواع المهام =====
const TASK_TYPES = [
  { value: 'data-entry', label: 'إدخال بيانات', icon: FileText },
  { value: 'review', label: 'مراجعة', icon: Eye },
  { value: 'approval', label: 'اعتماد', icon: CheckCircle },
  { value: 'documentation', label: 'توثيق', icon: FileText },
  { value: 'calculation', label: 'حسابات', icon: BarChart3 },
  { value: 'communication', label: 'تواصل', icon: MessageSquare },
  { value: 'follow-up', label: 'متابعة', icon: Target },
  { value: 'inspection', label: 'معاينة', icon: Eye },
];

// ===== بيانات الموظفين =====
const EMPLOYEES_DATA = [
  { id: 'EMP-001', code: '817-00123', name: 'أحمد محمد علي', department: 'المعاملات', position: 'مسؤول معاملات', activeTasks: 5, completedTasks: 127, performance: 95, available: true },
  { id: 'EMP-002', code: '817-00124', name: 'خالد عبدالله السعيد', department: 'المراجعة', position: 'مراجع رئيسي', activeTasks: 3, completedTasks: 98, performance: 92, available: true },
  { id: 'EMP-003', code: '817-00125', name: 'محمد سعد القحطاني', department: 'الاعتماد', position: 'معتمد معاملات', activeTasks: 4, completedTasks: 156, performance: 97, available: true },
  { id: 'EMP-004', code: '817-00126', name: 'سارة أحمد المطيري', department: 'التوثيق', position: 'موثقة معاملات', activeTasks: 6, completedTasks: 89, performance: 90, available: false },
  { id: 'EMP-005', code: '817-00127', name: 'فهد عبدالعزيز العتيبي', department: 'المتابعة', position: 'مسؤول متابعة', activeTasks: 7, completedTasks: 134, performance: 94, available: true },
  { id: 'EMP-006', code: '817-00128', name: 'نورة محمد الدوسري', department: 'المعاملات', position: 'مسؤولة معاملات', activeTasks: 4, completedTasks: 112, performance: 93, available: true },
  { id: 'EMP-007', code: '817-00129', name: 'عبدالله فيصل الشمري', department: 'المراجعة', position: 'مراجع', activeTasks: 5, completedTasks: 78, performance: 88, available: true },
  { id: 'EMP-008', code: '817-00130', name: 'منى خالد الحربي', department: 'الاعتماد', position: 'معتمدة', activeTasks: 3, completedTasks: 145, performance: 96, available: true },
];

// ===== بيانات المهام المسندة =====
const ASSIGNED_TASKS = [
  {
    id: 'TSK-001',
    taskNumber: 'TSK-2025-001',
    transactionCode: '286-2025-00456',
    transactionTitle: 'رخصة بناء سكني - حي العليا',
    taskType: 'data-entry',
    description: 'إدخال بيانات المالك وتفاصيل العقار',
    assignedTo: 'أحمد محمد علي',
    employeeCode: '817-00123',
    assignedBy: 'مدير المعاملات',
    assignedDate: '2025-10-15 09:00',
    startDate: '2025-10-15',
    dueDate: '2025-10-17',
    status: 'in-progress',
    priority: 'high',
    progress: 65,
    estimatedHours: 8,
    actualHours: 5.5,
    notes: 'المهمة تسير بشكل جيد، تم إدخال 65% من البيانات',
    attachments: 3,
    comments: 5,
  },
  {
    id: 'TSK-002',
    taskNumber: 'TSK-2025-002',
    transactionCode: '286-2025-00457',
    transactionTitle: 'رخصة بناء تجاري - حي الملقا',
    taskType: 'review',
    description: 'مراجعة المستندات والوثائق المرفقة',
    assignedTo: 'خالد عبدالله السعيد',
    employeeCode: '817-00124',
    assignedBy: 'مدير المراجعة',
    assignedDate: '2025-10-15 10:30',
    startDate: '2025-10-15',
    dueDate: '2025-10-16',
    status: 'in-progress',
    priority: 'medium',
    progress: 45,
    estimatedHours: 6,
    actualHours: 3,
    notes: 'هناك بعض المستندات الناقصة',
    attachments: 7,
    comments: 3,
  },
  {
    id: 'TSK-003',
    taskNumber: 'TSK-2025-003',
    transactionCode: '286-2025-00458',
    transactionTitle: 'رخصة ترميم - حي النرجس',
    taskType: 'approval',
    description: 'اعتماد المعاملة بعد استكمال المتطلبات',
    assignedTo: 'محمد سعد القحطاني',
    employeeCode: '817-00125',
    assignedBy: 'المدير التنفيذي',
    assignedDate: '2025-10-14 14:00',
    startDate: '2025-10-14',
    dueDate: '2025-10-16',
    status: 'pending',
    priority: 'high',
    progress: 0,
    estimatedHours: 4,
    actualHours: 0,
    notes: 'في انتظار استكمال المراجعة',
    attachments: 2,
    comments: 1,
  },
  {
    id: 'TSK-004',
    taskNumber: 'TSK-2025-004',
    transactionCode: '286-2025-00455',
    transactionTitle: 'فسح بناء - حي الياسمين',
    taskType: 'documentation',
    description: 'توثيق المعاملة وحفظ المستندات',
    assignedTo: 'سارة أحمد المطيري',
    employeeCode: '817-00126',
    assignedBy: 'مدير التوثيق',
    assignedDate: '2025-10-13 11:00',
    startDate: '2025-10-13',
    dueDate: '2025-10-14',
    status: 'overdue',
    priority: 'urgent',
    progress: 30,
    estimatedHours: 3,
    actualHours: 2,
    notes: 'المهمة متأخرة - يجب الإسراع',
    attachments: 4,
    comments: 8,
  },
  {
    id: 'TSK-005',
    taskNumber: 'TSK-2025-005',
    transactionCode: '286-2025-00454',
    transactionTitle: 'رخصة توسعة - حي الروضة',
    taskType: 'calculation',
    description: 'حساب الرسوم والمساحات',
    assignedTo: 'فهد عبدالعزيز العتيبي',
    employeeCode: '817-00127',
    assignedBy: 'مدير المالية',
    assignedDate: '2025-10-12 08:30',
    startDate: '2025-10-12',
    dueDate: '2025-10-13',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    estimatedHours: 5,
    actualHours: 4.5,
    notes: 'تم إكمال المهمة بنجاح',
    attachments: 2,
    comments: 4,
  },
  {
    id: 'TSK-006',
    taskNumber: 'TSK-2025-006',
    transactionCode: '286-2025-00459',
    transactionTitle: 'رخصة هدم - حي الورود',
    taskType: 'follow-up',
    description: 'متابعة المعاملة مع الجهات الخارجية',
    assignedTo: 'نورة محمد الدوسري',
    employeeCode: '817-00128',
    assignedBy: 'مدير المعاملات',
    assignedDate: '2025-10-15 13:00',
    startDate: '2025-10-15',
    dueDate: '2025-10-18',
    status: 'in-progress',
    priority: 'medium',
    progress: 25,
    estimatedHours: 10,
    actualHours: 2.5,
    notes: 'جاري التواصل مع البلدية',
    attachments: 1,
    comments: 2,
  },
  {
    id: 'TSK-007',
    taskNumber: 'TSK-2025-007',
    transactionCode: '286-2025-00460',
    transactionTitle: 'رخصة بناء سكني - حي السليمانية',
    taskType: 'inspection',
    description: 'معاينة الموقع وتوثيق الحالة',
    assignedTo: 'عبدالله فيصل الشمري',
    employeeCode: '817-00129',
    assignedBy: 'مدير المعاينات',
    assignedDate: '2025-10-14 15:00',
    startDate: '2025-10-15',
    dueDate: '2025-10-16',
    status: 'pending',
    priority: 'high',
    progress: 0,
    estimatedHours: 6,
    actualHours: 0,
    notes: 'المعاينة مجدولة ليوم غد',
    attachments: 0,
    comments: 1,
  },
  {
    id: 'TSK-008',
    taskNumber: 'TSK-2025-008',
    transactionCode: '286-2025-00453',
    transactionTitle: 'شهادة إتمام بناء - حي الغدير',
    taskType: 'approval',
    description: 'اعتماد شهادة الإتمام',
    assignedTo: 'منى خالد الحربي',
    employeeCode: '817-00130',
    assignedBy: 'المدير التنفيذي',
    assignedDate: '2025-10-11 10:00',
    startDate: '2025-10-11',
    dueDate: '2025-10-12',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    estimatedHours: 3,
    actualHours: 2.5,
    notes: 'تم الاعتماد بنجاح',
    attachments: 5,
    comments: 3,
  },
  {
    id: 'TSK-009',
    taskNumber: 'TSK-2025-009',
    transactionCode: '286-2025-00461',
    transactionTitle: 'رخصة بناء تجاري - حي العقيق',
    taskType: 'data-entry',
    description: 'إدخال بيانات المشروع التجاري',
    assignedTo: 'عمر سعيد الزهراني',
    employeeCode: '817-00131',
    assignedBy: 'مدير المعاملات',
    assignedDate: '2025-10-16 08:00',
    startDate: '2025-10-16',
    dueDate: '2025-10-20',
    status: 'not-received',
    priority: 'high',
    progress: 0,
    estimatedHours: 12,
    actualHours: 0,
    notes: 'لم يستلم الموظف المهمة بعد',
    attachments: 0,
    comments: 0,
    notificationsSent: 3,
    lastNotification: '2025-10-18 09:00',
  },
  {
    id: 'TSK-010',
    taskNumber: 'TSK-2025-010',
    transactionCode: '286-2025-00462',
    transactionTitle: 'رخصة ترميم - حي المروج',
    taskType: 'review',
    description: 'مراجعة وثائق الترميم',
    assignedTo: 'ريم أحمد القرني',
    employeeCode: '817-00132',
    assignedBy: 'مدير المراجعة',
    assignedDate: '2025-10-14 14:00',
    startDate: '2025-10-14',
    dueDate: '2025-10-18',
    status: 'not-received',
    priority: 'medium',
    progress: 0,
    estimatedHours: 8,
    actualHours: 0,
    notes: 'في انتظار استلام الموظف',
    attachments: 2,
    comments: 1,
    notificationsSent: 2,
    lastNotification: '2025-10-17 10:30',
  },
  {
    id: 'TSK-011',
    taskNumber: 'TSK-2025-011',
    transactionCode: '286-2025-00463',
    transactionTitle: 'رخصة إضافة دور - حي النخيل',
    taskType: 'calculation',
    description: 'حساب الرسوم والتصاريح',
    assignedTo: 'طارق محمد الشهري',
    employeeCode: '817-00133',
    assignedBy: 'مدير المالية',
    assignedDate: '2025-10-10 11:00',
    startDate: '2025-10-10',
    dueDate: '2025-10-25',
    status: 'frozen',
    frozenType: 'temporary',
    frozenDate: '2025-10-12 15:00',
    frozenUntil: '2025-10-22',
    frozenBy: 'مدير المشاريع',
    frozenReason: 'في انتظار مستندات إضافية من العميل',
    priority: 'medium',
    progress: 15,
    estimatedHours: 6,
    actualHours: 1,
    notes: 'المهمة مجمدة مؤقتاً',
    attachments: 3,
    comments: 4,
  },
  {
    id: 'TSK-012',
    taskNumber: 'TSK-2025-012',
    transactionCode: '286-2025-00464',
    transactionTitle: 'رخصة بناء سكني - حي الربيع',
    taskType: 'inspection',
    description: 'معاينة الموقع وتوثيق الحالة',
    assignedTo: 'وليد عبدالله المالكي',
    employeeCode: '817-00134',
    assignedBy: 'مدير المعاينات',
    assignedDate: '2025-10-08 09:30',
    startDate: '2025-10-08',
    dueDate: null,
    status: 'frozen',
    frozenType: 'indefinite',
    frozenDate: '2025-10-09 13:00',
    frozenUntil: null,
    frozenBy: 'المدير التنفيذي',
    frozenReason: 'تعليق من جهة حكومية - في انتظار إشعار بالاستئناف',
    priority: 'low',
    progress: 5,
    estimatedHours: 10,
    actualHours: 0.5,
    notes: 'مجمدة لحين رفع التعليق الحكوم��',
    attachments: 1,
    comments: 6,
  },
];

const TransactionTasksAssignment_Complete_825: React.FC = () => {
  const [activeTab, setActiveTab] = useState('825-01');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showFreezeDialog, setShowFreezeDialog] = useState(false);

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 825-01: نظرة عامة
      case '825-01':
        const totalTasks = ASSIGNED_TASKS.length;
        const activeTasks = ASSIGNED_TASKS.filter(t => t.status === 'in-progress').length;
        const completedTasks = ASSIGNED_TASKS.filter(t => t.status === 'completed').length;
        const overdueTasks = ASSIGNED_TASKS.filter(t => t.status === 'overdue').length;
        const pendingTasks = ASSIGNED_TASKS.filter(t => t.status === 'pending').length;
        const frozenTasksCount = ASSIGNED_TASKS.filter(t => t.status === 'frozen').length;
        const notReceivedTasks = ASSIGNED_TASKS.filter(t => t.status === 'not-received').length;
        const avgProgress = ASSIGNED_TASKS.reduce((sum, t) => sum + t.progress, 0) / totalTasks;

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة على المهام</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <RefreshCw className="h-3 w-3 ml-1" />
                  تحديث
                </Button>
                <Button size="sm" className="h-8 text-xs bg-green-500">
                  <Download className="h-3 w-3 ml-1" />
                  تصدير
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-8 gap-2">
              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المهام</p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>{totalTasks}</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 w-full justify-center">
                    جميع المهام
                  </Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                      <PlayCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهام النشطة</p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>{activeTasks}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5 w-full justify-center">
                    قيد التنفيذ
                  </Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المكتملة</p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>{completedTasks}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 w-full justify-center">
                    مكتملة
                  </Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متأخرة</p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>{overdueTasks}</p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-800 text-xs px-2 py-0.5 w-full justify-center">
                    تحتاج متابعة
                  </Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد الانتظار</p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>{pendingTasks}</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 w-full justify-center">
                    معلقة
                  </Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center">
                      <Snowflake className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مجمدة</p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>{frozenTasksCount}</p>
                    </div>
                  </div>
                  <Badge className="bg-cyan-100 text-cyan-800 text-xs px-2 py-0.5 w-full justify-center">
                    مُوقفة مؤقتاً
                  </Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>غير مستلمة</p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>{notReceivedTasks}</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 w-full justify-center">
                    بانتظار الاستلام
                  </Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط التقدم</p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>{avgProgress.toFixed(0)}%</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 w-full justify-center">
                    الإنجاز
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* رسم بياني للمهام */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <BarChart3 className="h-4 w-4" />
                  توزيع المهام حسب الحالة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-3">
                  {TASK_STATUSES.map((status) => {
                    const count = ASSIGNED_TASKS.filter(t => t.status === status.value).length;
                    const percentage = (count / totalTasks) * 100;
                    return (
                      <div key={status.value}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Badge className={status.color}>{status.label}</Badge>
                            <span className="text-xs text-gray-600">{count} مهمة</span>
                          </div>
                          <span className="text-xs font-medium">{percentage.toFixed(0)}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* المهام الأخيرة */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <List className="h-4 w-4" />
                  آخر المهام المسندة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="p-3 space-y-2">
                    {ASSIGNED_TASKS.slice(0, 6).map((task) => (
                      <Card key={task.id} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer border-r-4" style={{ borderRightColor: task.status === 'in-progress' ? '#10b981' : task.status === 'overdue' ? '#ef4444' : '#6b7280' }}>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                                  {task.taskNumber}
                                </Badge>
                                <Badge className={TASK_STATUSES.find(s => s.value === task.status)?.color}>
                                  {TASK_STATUSES.find(s => s.value === task.status)?.label}
                                </Badge>
                                <Badge className={TASK_PRIORITIES.find(p => p.value === task.priority)?.color}>
                                  {TASK_PRIORITIES.find(p => p.value === task.priority)?.label}
                                </Badge>
                              </div>
                              <h4 className="text-sm font-medium mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {task.transactionTitle}
                              </h4>
                              <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-600">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {task.assignedTo}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {task.dueDate}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">التقدم</span>
                              <span className="font-medium">{task.progress}%</span>
                            </div>
                            <Progress value={task.progress} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* المهام المجمدة */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2 bg-gradient-to-r from-cyan-50 to-blue-50">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Snowflake className="h-4 w-4 text-cyan-600" />
                  المهام المجمدة ({frozenTasksCount})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-64">
                  <div className="p-3 space-y-2">
                    {ASSIGNED_TASKS.filter(t => t.status === 'frozen').map((task) => (
                      <Card key={task.id} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer border-r-4 border-cyan-500">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                                  {task.taskNumber}
                                </Badge>
                                <Badge className="bg-cyan-100 text-cyan-700">
                                  {task.frozenType === 'temporary' ? 'مجمدة مؤقتاً' : 'مجمدة لأجل غير مسمى'}
                                </Badge>
                              </div>
                              <h4 className="text-sm font-medium mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {task.transactionTitle}
                              </h4>
                              <div className="bg-cyan-50 rounded p-2 text-xs mb-2">
                                <p className="text-cyan-900 font-medium mb-1">سبب التجميد:</p>
                                <p className="text-cyan-800">{task.frozenReason}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-600">تاريخ التجميد: </span>
                                  <span className="font-medium">{task.frozenDate}</span>
                                </div>
                                {task.frozenUntil && (
                                  <div>
                                    <span className="text-gray-600">إلى: </span>
                                    <span className="font-medium">{task.frozenUntil}</span>
                                  </div>
                                )}
                                <div>
                                  <span className="text-gray-600">بواسطة: </span>
                                  <span className="font-medium">{task.frozenBy}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">التقدم: </span>
                                  <Badge className="bg-blue-100 text-blue-700">{task.progress}%</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* المهام غير المستلمة */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2 bg-gradient-to-r from-amber-50 to-yellow-50">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Bell className="h-4 w-4 text-amber-600" />
                  المهام غير المستلمة ({notReceivedTasks})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-64">
                  <div className="p-3 space-y-2">
                    {ASSIGNED_TASKS.filter(t => t.status === 'not-received').map((task) => (
                      <Card key={task.id} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer border-r-4 border-amber-500">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                                  {task.taskNumber}
                                </Badge>
                                <Badge className="bg-amber-100 text-amber-700">
                                  غير مستلمة
                                </Badge>
                                <Badge className={TASK_PRIORITIES.find(p => p.value === task.priority)?.color}>
                                  {TASK_PRIORITIES.find(p => p.value === task.priority)?.label}
                                </Badge>
                              </div>
                              <h4 className="text-sm font-medium mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {task.transactionTitle}
                              </h4>
                              <div className="bg-amber-50 rounded p-2 text-xs mb-2">
                                <p className="text-amber-800">{task.notes}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-600">الموظف: </span>
                                  <span className="font-medium">{task.assignedTo}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">تاريخ الإسناد: </span>
                                  <span className="font-medium">{task.assignedDate}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">الإشعارات المرسلة: </span>
                                  <Badge className="bg-red-100 text-red-700">{task.notificationsSent}</Badge>
                                </div>
                                <div>
                                  <span className="text-gray-600">آخر إشعار: </span>
                                  <span className="font-medium">{task.lastNotification}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      // 825-02: المهام النشطة
      case '825-02':
        const activeTasksList = ASSIGNED_TASKS.filter(t => t.status === 'in-progress');
        
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهام النشطة</h2>
              <div className="flex gap-2">
                <InputWithCopy
                  label=""
                  id="searchActive"
                  placeholder="بحث في المهام..."
                  icon={<Search className="h-4 w-4" />}
                />
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Filter className="h-3 w-3 ml-1" />
                  تصفية
                </Button>
                <Button size="sm" className="h-8 text-xs bg-green-500">
                  <Download className="h-3 w-3 ml-1" />
                  تصدير
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {activeTasksList.map((task) => (
                <Card key={task.id} className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer border-t-4 border-green-500">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {task.taskNumber}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            {task.transactionCode}
                          </Badge>
                        </div>
                        <h3 className="text-sm font-medium mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {task.transactionTitle}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                      </div>
                      <Badge className={TASK_PRIORITIES.find(p => p.value === task.priority)?.color}>
                        {TASK_PRIORITIES.find(p => p.value === task.priority)?.label}
                      </Badge>
                    </div>

                    <Separator className="my-2" />

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">الموظف المكلف</p>
                        <div className="flex items-center gap-1 mt-1">
                          <User className="h-3 w-3 text-blue-500" />
                          <span className="text-xs font-medium">{task.assignedTo}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">نوع المهمة</p>
                        <Badge className="bg-purple-100 text-purple-700 text-xs mt-1">
                          {TASK_TYPES.find(t => t.value === task.taskType)?.label}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">تاريخ البدء</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3 text-green-500" />
                          <span className="text-xs">{task.startDate}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">تاريخ الاستحقاق</p>
                        <div className="flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3 text-orange-500" />
                          <span className="text-xs">{task.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">نسبة الإنجاز</span>
                        <span className="font-medium text-green-600">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2.5" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                      <div className="bg-blue-50 rounded p-2 text-center">
                        <p className="text-gray-600">الوقت المقدر</p>
                        <p className="font-medium text-blue-600">{task.estimatedHours} ساعة</p>
                      </div>
                      <div className="bg-green-50 rounded p-2 text-center">
                        <p className="text-gray-600">الوقت الفعلي</p>
                        <p className="font-medium text-green-600">{task.actualHours} ساعة</p>
                      </div>
                      <div className="bg-purple-50 rounded p-2 text-center">
                        <p className="text-gray-600">المتبقي</p>
                        <p className="font-medium text-purple-600">{(task.estimatedHours - task.actualHours).toFixed(1)} ساعة</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Paperclip className="h-3 w-3" />
                        {task.attachments} مرفقات
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {task.comments} تعليقات
                      </span>
                    </div>

                    {task.notes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
                        <p className="text-xs text-yellow-800">{task.notes}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <Button 
                          className="flex-1 h-7 text-xs" 
                          variant="outline"
                          onClick={() => {
                            setSelectedTask(task);
                            // فتح معاينة التفاصيل
                          }}
                        >
                          <Eye className="h-3 w-3 ml-1" />
                          عرض
                        </Button>
                        <Button className="flex-1 h-7 text-xs" variant="outline">
                          <Edit className="h-3 w-3 ml-1" />
                          تحديث
                        </Button>
                        <Button 
                          className="flex-1 h-7 text-xs bg-green-500 text-white hover:bg-green-600"
                          onClick={() => {
                            setSelectedTask(task);
                            setShowCompleteDialog(true);
                          }}
                        >
                          <CheckCircle className="h-3 w-3 ml-1" />
                          إكمال
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          className="flex-1 h-7 text-xs bg-cyan-500 text-white hover:bg-cyan-600"
                          onClick={() => {
                            setSelectedTask(task);
                            setShowFreezeDialog(true);
                          }}
                        >
                          <Snowflake className="h-3 w-3 ml-1" />
                          تجميد
                        </Button>
                        <Button 
                          className="flex-1 h-7 text-xs bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() => {
                            setSelectedTask(task);
                            setShowTransferDialog(true);
                          }}
                        >
                          <Share2 className="h-3 w-3 ml-1" />
                          تحويل
                        </Button>
                        <Button 
                          className="flex-1 h-7 text-xs bg-red-500 text-white hover:bg-red-600"
                          onClick={() => {
                            setSelectedTask(task);
                            setShowCancelDialog(true);
                          }}
                        >
                          <Ban className="h-3 w-3 ml-1" />
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      // 825-03: إسناد مهمة جديدة
      case '825-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إسناد مهمة جديدة</h2>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Info className="h-4 w-4 text-blue-600" />
                  معلومات المهمة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <InputWithCopy
                    label="رقم المعاملة *"
                    id="transCode"
                    placeholder="286-2025-XXXXX"
                  />
                  <InputWithCopy
                    label="عنوان المعاملة *"
                    id="transTitle"
                    placeholder="أدخل عنوان المعاملة"
                  />
                  <SelectWithCopy
                    label="نوع المهمة *"
                    id="taskType"
                    options={[
                      { value: '', label: 'اختر نوع المهمة' },
                      ...TASK_TYPES.map(t => ({ value: t.value, label: t.label }))
                    ]}
                  />
                </div>

                <TextAreaWithCopy
                  label="وصف المهمة *"
                  id="taskDesc"
                  placeholder="اكتب وصف تفصيلي للمهمة المطلوب إنجازها..."
                  rows={3}
                />
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <User className="h-4 w-4 text-green-600" />
                  اختيار الموظف المكلف
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="mb-3">
                  <InputWithCopy
                    label="بحث في الموظفين"
                    id="searchEmp"
                    placeholder="ابحث بالاسم أو الكود أو القسم..."
                    icon={<Search className="h-4 w-4" />}
                  />
                </div>

                <ScrollArea className="h-64">
                  <div className="grid grid-cols-2 gap-2">
                    {EMPLOYEES_DATA.map((emp) => (
                      <Card key={emp.id} className={`card-element card-rtl hover:shadow-md transition-all cursor-pointer border-2 ${emp.available ? 'border-green-200 hover:border-green-400' : 'border-gray-200 opacity-60'}`}>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-10 h-10 rounded-lg ${emp.available ? 'bg-green-500' : 'bg-gray-400'} flex items-center justify-center`}>
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {emp.name}
                              </p>
                              <Badge className="bg-gray-100 text-gray-700 font-mono text-xs mt-0.5">
                                {emp.code}
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                            <div>
                              <p className="text-gray-600">القسم</p>
                              <p className="font-medium">{emp.department}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">المنصب</p>
                              <p className="font-medium">{emp.position}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                            <div className="bg-blue-50 rounded p-1.5 text-center">
                              <p className="text-gray-600">نشطة</p>
                              <p className="font-medium text-blue-600">{emp.activeTasks}</p>
                            </div>
                            <div className="bg-green-50 rounded p-1.5 text-center">
                              <p className="text-gray-600">مكتملة</p>
                              <p className="font-medium text-green-600">{emp.completedTasks}</p>
                            </div>
                            <div className="bg-purple-50 rounded p-1.5 text-center">
                              <p className="text-gray-600">الأداء</p>
                              <p className="font-medium text-purple-600">{emp.performance}%</p>
                            </div>
                          </div>
                          <Badge className={emp.available ? 'bg-green-100 text-green-700 w-full justify-center' : 'bg-gray-100 text-gray-700 w-full justify-center'}>
                            {emp.available ? 'متاح' : 'غير متاح'}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Settings className="h-4 w-4 text-orange-600" />
                  تفاصيل وإعدادات المهمة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <DateInputWithToday
                    label="تاريخ البدء *"
                    id="startDate"
                  />
                  <DateInputWithToday
                    label="تاريخ الاستحقاق *"
                    id="dueDate"
                  />
                  <SelectWithCopy
                    label="الأولوية *"
                    id="priority"
                    options={[
                      { value: '', label: 'اختر الأولوية' },
                      ...TASK_PRIORITIES.map(p => ({ value: p.value, label: p.label }))
                    ]}
                  />
                  <InputWithCopy
                    label="الوقت المقدر (ساعات)"
                    id="estHours"
                    placeholder="8"
                  />
                </div>

                <TextAreaWithCopy
                  label="ملاحظات إضافية"
                  id="notes"
                  placeholder="أي ملاحظات أو تعليمات خاصة بالمهمة..."
                  rows={2}
                />
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Bell className="h-4 w-4 text-cyan-600" />
                  خيارات الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-blue-900">إشعار النظام</p>
                      <p className="text-xs text-blue-700">إشعار فوري عبر النظام</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-green-900">بريد إلكتروني</p>
                      <p className="text-xs text-green-700">إرسال تفاصيل المهمة</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-purple-50 rounded border border-purple-200">
                    <input type="checkbox" className="w-4 h-4" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-purple-900">رسالة نصية (SMS)</p>
                      <p className="text-xs text-purple-700">تنبيه على الجوال</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-orange-50 rounded border border-orange-200">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-orange-900">إشعار المدير</p>
                      <p className="text-xs text-orange-700">إخطار المدير المباشر</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between pt-3 border-t">
              <Button variant="outline" className="h-9">
                <X className="h-4 w-4 ml-1" />
                إلغاء
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="h-9">
                  <Eye className="h-4 w-4 ml-1" />
                  معاينة
                </Button>
                <Button className="h-9 bg-blue-500">
                  <Send className="h-4 w-4 ml-1" />
                  إسناد المهمة
                </Button>
              </div>
            </div>
          </div>
        );

      // 825-04: المهام المكتملة
      case '825-04':
        const completedTasksList = ASSIGNED_TASKS.filter(t => t.status === 'completed');
        
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهام المكتملة</h2>
              <div className="flex gap-2">
                <InputWithCopy
                  label=""
                  id="searchCompleted"
                  placeholder="بحث في المهام المكتملة..."
                  icon={<Search className="h-4 w-4" />}
                />
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Filter className="h-3 w-3 ml-1" />
                  تصفية
                </Button>
                <Button size="sm" className="h-8 text-xs bg-green-500">
                  <Download className="h-3 w-3 ml-1" />
                  تصدير
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <Card className="card-element card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">إجمالي المكتملة</p>
                      <p className="text-xl">{completedTasksList.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">في الوقت المحدد</p>
                      <p className="text-xl">{completedTasksList.length - 1}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">متوسط التقييم</p>
                      <p className="text-xl">4.7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">نسبة الإنجاز</p>
                      <p className="text-xl">95%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {completedTasksList.map((task) => (
                <Card key={task.id} className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer border-t-4 border-green-500">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {task.taskNumber}
                          </Badge>
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3 ml-1" />
                            مكتملة
                          </Badge>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>

                        <h4 className="text-sm font-medium mb-2">{task.transactionTitle}</h4>
                        <p className="text-xs text-gray-600 mb-2">{task.description}</p>

                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                          <div className="bg-blue-50 rounded p-2">
                            <p className="text-gray-600 mb-1">الموظف المنفذ</p>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3 text-blue-500" />
                              <span className="font-medium">{task.assignedTo}</span>
                            </div>
                          </div>
                          <div className="bg-green-50 rounded p-2">
                            <p className="text-gray-600 mb-1">تاريخ الإكمال</p>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="font-medium">{task.dueDate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded p-2 mb-2">
                          <p className="text-xs text-green-800">{task.notes}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-1 text-xs">
                          <div className="text-center p-1 bg-gray-50 rounded">
                            <p className="text-gray-600">الوقت المقدر</p>
                            <p className="font-medium">{task.estimatedHours}س</p>
                          </div>
                          <div className="text-center p-1 bg-gray-50 rounded">
                            <p className="text-gray-600">الوقت الفعلي</p>
                            <p className="font-medium">{task.actualHours}س</p>
                          </div>
                          <div className="text-center p-1 bg-green-50 rounded">
                            <p className="text-gray-600">الكفاءة</p>
                            <p className="font-medium text-green-600">
                              {((task.estimatedHours / task.actualHours) * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button className="flex-1 h-7 text-xs" variant="outline">
                        <Eye className="h-3 w-3 ml-1" />
                        عرض
                      </Button>
                      <Button className="flex-1 h-7 text-xs" variant="outline">
                        <Printer className="h-3 w-3 ml-1" />
                        طباعة
                      </Button>
                      <Button className="flex-1 h-7 text-xs bg-blue-500 text-white">
                        <Download className="h-3 w-3 ml-1" />
                        تقرير
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      // 825-05: المهام المتأخرة
      case '825-05':
        const overdueTasksList = ASSIGNED_TASKS.filter(t => t.status === 'overdue');
        
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهام المتأخرة</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs bg-red-50 text-red-700">
                  <AlertTriangle className="h-3 w-3 ml-1" />
                  {overdueTasksList.length} مهمة متأخرة
                </Button>
                <Button size="sm" className="h-8 text-xs bg-green-500">
                  <Send className="h-3 w-3 ml-1" />
                  إرسال تنبيه جماعي
                </Button>
              </div>
            </div>

            {/* إحصائيات التأخير */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              <Card className="card-element card-rtl bg-red-50 border-red-200">
                <CardContent className="p-3 text-center">
                  <AlertTriangle className="h-6 w-6 mx-auto mb-1 text-red-600" />
                  <p className="text-xs text-gray-600">مهام متأخرة</p>
                  <p className="text-2xl text-red-600">{overdueTasksList.length}</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Clock className="h-6 w-6 mx-auto mb-1 text-orange-600" />
                  <p className="text-xs text-gray-600">أيام تأخير</p>
                  <p className="text-2xl">3.5</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Users className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                  <p className="text-xs text-gray-600">موظفين متأخرين</p>
                  <p className="text-2xl">2</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Target className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                  <p className="text-xs text-gray-600">نسبة التقدم</p>
                  <p className="text-2xl">45%</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-1 text-green-600" />
                  <p className="text-xs text-gray-600">قيد المعالجة</p>
                  <p className="text-2xl">{overdueTasksList.filter(t => t.progress > 0).length}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              {overdueTasksList.map((task) => {
                const daysOverdue = 3; // حساب أيام التأخير
                
                return (
                  <Card key={task.id} className="card-element card-rtl border-r-4 border-red-500">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                              {task.taskNumber}
                            </Badge>
                            <Badge className="bg-red-100 text-red-700">
                              <AlertTriangle className="h-3 w-3 ml-1" />
                              متأخرة {daysOverdue} أيام
                            </Badge>
                            <Badge className={TASK_PRIORITIES.find(p => p.value === task.priority)?.color}>
                              {TASK_PRIORITIES.find(p => p.value === task.priority)?.label}
                            </Badge>
                          </div>

                          <h4 className="text-sm font-medium mb-1">{task.transactionTitle}</h4>
                          <p className="text-xs text-gray-600 mb-2">{task.description}</p>

                          <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                            <div>
                              <p className="text-gray-600">الموظف:</p>
                              <p className="font-medium">{task.assignedTo}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">تاريخ الاستحقاق:</p>
                              <p className="font-medium text-red-600">{task.dueDate}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">التقدم:</p>
                              <Progress value={task.progress} className="h-2 mt-1" />
                            </div>
                            <div>
                              <p className="text-gray-600">الإشعارات المرسلة:</p>
                              <Badge className="bg-orange-100 text-orange-700">5 إشعارات</Badge>
                            </div>
                          </div>

                          <div className="bg-red-50 border border-red-200 rounded p-2">
                            <p className="text-xs text-red-800 font-medium">⚠️ {task.notes}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 mr-2">
                          <Button className="h-7 text-xs bg-green-500">
                            <Send className="h-3 w-3 ml-1" />
                            تنبيه
                          </Button>
                          <Button className="h-7 text-xs bg-blue-500">
                            <Share2 className="h-3 w-3 ml-1" />
                            تحويل
                          </Button>
                          <Button className="h-7 text-xs" variant="outline">
                            <Eye className="h-3 w-3 ml-1" />
                            عرض
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      // 825-06: المهام المعلقة
      case '825-06':
        const pausedTasks = ASSIGNED_TASKS.filter(t => t.status === 'paused');
        const frozenTasks = ASSIGNED_TASKS.filter(t => t.status === 'frozen');
        
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهام المعلقة والمجمدة</h2>
              <div className="flex gap-2">
                <Badge className="bg-orange-100 text-orange-700">
                  {pausedTasks.length} معلقة
                </Badge>
                <Badge className="bg-cyan-100 text-cyan-700">
                  {frozenTasks.length} مجمدة
                </Badge>
                <Button size="sm" className="h-8 text-xs bg-green-500">
                  <PlayCircle className="h-3 w-3 ml-1" />
                  استئناف المحددة
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Filter className="h-3 w-3 ml-1" />
                  تصفية
                </Button>
              </div>
            </div>

            {/* إحصائيات المهام المعلقة */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-3 text-center">
                  <PauseCircle className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                  <p className="text-xs text-gray-700">معلقة</p>
                  <p className="text-2xl font-mono text-orange-700">{pausedTasks.length}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
                <CardContent className="p-3 text-center">
                  <Snowflake className="h-5 w-5 mx-auto mb-1 text-cyan-600" />
                  <p className="text-xs text-gray-700">مجمدة</p>
                  <p className="text-2xl font-mono text-cyan-700">{frozenTasks.length}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardContent className="p-3 text-center">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
                  <p className="text-xs text-gray-700">متوسط المدة</p>
                  <p className="text-2xl font-mono text-yellow-700">5</p>
                  <p className="text-xs text-yellow-600">أيام</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-3 text-center">
                  <AlertCircle className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                  <p className="text-xs text-gray-700">تحتاج متابعة</p>
                  <p className="text-2xl font-mono text-purple-700">{Math.floor(pausedTasks.length / 2)}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {pausedTasks.map((task, index) => {
                const pauseDays = Math.floor(Math.random() * 10) + 1;
                const pauseReasons = [
                  'في انتظار موافقة الجهات الخارجية',
                  'نقص في المستندات المطلوبة',
                  'تعليق بناءً على طلب العميل',
                  'في انتظار استكمال إجراءات سابقة',
                  'تأجيل مؤقت لإعادة التقييم'
                ];
                
                return (
                  <Card key={task.id} className="card-element card-rtl border-t-4 border-orange-500 hover:shadow-lg transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                              {task.taskNumber}
                            </Badge>
                            <Badge className="bg-orange-100 text-orange-700">
                              <PauseCircle className="h-3 w-3 ml-1" />
                              معلقة
                            </Badge>
                            <Badge className={TASK_PRIORITIES.find(p => p.value === task.priority)?.color}>
                              {TASK_PRIORITIES.find(p => p.value === task.priority)?.label}
                            </Badge>
                          </div>

                          <h4 className="text-sm font-medium mb-1">{task.transactionTitle}</h4>
                          <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                          
                          <div className="bg-orange-50 border border-orange-200 rounded p-2 mb-2">
                            <p className="text-xs text-orange-900 font-medium mb-1">📋 سبب التعليق:</p>
                            <p className="text-xs text-orange-800">{pauseReasons[index % pauseReasons.length]}</p>
                          </div>

                          <div className="space-y-2 mb-2">
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-600">التقدم قبل التعليق</span>
                                <span className="font-medium">{task.progress}%</span>
                              </div>
                              <Progress value={task.progress} className="h-2" />
                            </div>

                            <div className="grid grid-cols-4 gap-1.5 text-xs">
                              <div className="bg-gray-50 rounded p-1.5 text-center border border-gray-200">
                                <p className="text-gray-600">معلقة منذ</p>
                                <p className="font-mono text-gray-900">{pauseDays}</p>
                                <p className="text-gray-500">يوم</p>
                              </div>
                              <div className="bg-blue-50 rounded p-1.5 text-center border border-blue-200">
                                <p className="text-gray-600">الموظف</p>
                                <p className="font-medium text-blue-700 text-xs">{task.assignedTo.split(' ')[0]}</p>
                              </div>
                              <div className="bg-purple-50 rounded p-1.5 text-center border border-purple-200">
                                <p className="text-gray-600">الأولوية</p>
                                <p className="font-medium text-xs">{TASK_PRIORITIES.find(p => p.value === task.priority)?.label.split(' ')[0]}</p>
                              </div>
                              <div className="bg-green-50 rounded p-1.5 text-center border border-green-200">
                                <p className="text-gray-600">الإشعارات</p>
                                <p className="font-mono text-green-700">{Math.floor(Math.random() * 5) + 1}</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                            <div className="flex items-start gap-2">
                              <Info className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-xs text-yellow-900 font-medium">آخر تحديث:</p>
                                <p className="text-xs text-yellow-800">منذ {pauseDays} أيام بواسطة {task.assignedTo.split(' ')[0]}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t">
                        <div className="flex items-center gap-1">
                          <Button className="flex-1 h-7 text-xs bg-green-500 text-white hover:bg-green-600">
                            <PlayCircle className="h-3 w-3 ml-1" />
                            استئناف
                          </Button>
                          <Button className="flex-1 h-7 text-xs bg-blue-500 text-white hover:bg-blue-600">
                            <Send className="h-3 w-3 ml-1" />
                            تنبيه
                          </Button>
                          <Button className="flex-1 h-7 text-xs" variant="outline">
                            <Edit className="h-3 w-3 ml-1" />
                            تعديل
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button className="flex-1 h-7 text-xs" variant="outline">
                            <Eye className="h-3 w-3 ml-1" />
                            عرض
                          </Button>
                          <Button className="flex-1 h-7 text-xs bg-cyan-500 text-white hover:bg-cyan-600">
                            <Snowflake className="h-3 w-3 ml-1" />
                            تجميد
                          </Button>
                          <Button className="flex-1 h-7 text-xs bg-red-500 text-white hover:bg-red-600">
                            <Ban className="h-3 w-3 ml-1" />
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      // 825-07: تفاصيل المهام
      case '825-07':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل المهام الشاملة</h2>
              <div className="flex gap-2">
                <InputWithCopy
                  label=""
                  id="searchTaskDetails"
                  placeholder="بحث في رقم المهمة أو رقم المعاملة..."
                  icon={<Search className="h-4 w-4" />}
                />
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Filter className="h-3 w-3 ml-1" />
                  تصفية متقدمة
                </Button>
                <Button size="sm" className="h-8 text-xs bg-purple-500">
                  <Download className="h-3 w-3 ml-1" />
                  تصدير الكل
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-2 mb-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-3 text-center">
                  <List className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <p className="text-xs text-gray-700">إجمالي المهام</p>
                  <p className="text-2xl font-mono text-blue-700">{ASSIGNED_TASKS.length}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-3 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-600" />
                  <p className="text-xs text-gray-700">مكتملة</p>
                  <p className="text-2xl font-mono text-green-700">
                    {ASSIGNED_TASKS.filter(t => t.status === 'completed').length}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-3 text-center">
                  <PlayCircle className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <p className="text-xs text-gray-700">قيد التنفيذ</p>
                  <p className="text-2xl font-mono text-blue-700">
                    {ASSIGNED_TASKS.filter(t => t.status === 'in-progress').length}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-3 text-center">
                  <PauseCircle className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                  <p className="text-xs text-gray-700">معلقة</p>
                  <p className="text-2xl font-mono text-orange-700">
                    {ASSIGNED_TASKS.filter(t => t.status === 'paused').length}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardContent className="p-3 text-center">
                  <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-red-600" />
                  <p className="text-xs text-gray-700">متأخرة</p>
                  <p className="text-2xl font-mono text-red-700">
                    {ASSIGNED_TASKS.filter(t => t.status === 'overdue').length}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardContent className="p-3 text-center">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
                  <p className="text-xs text-gray-700">في الانتظار</p>
                  <p className="text-2xl font-mono text-yellow-700">
                    {ASSIGNED_TASKS.filter(t => t.status === 'pending').length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* جدول تفاصيل المهام */}
            <Card className="card-element card-rtl">
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-340px)]">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-right font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          رقم المهمة
                        </TableHead>
                        <TableHead className="text-right font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          عنوان المهمة
                        </TableHead>
                        <TableHead className="text-right font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الموظف المكلف
                        </TableHead>
                        <TableHead className="text-right font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الحالة
                        </TableHead>
                        <TableHead className="text-right font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الأولوية
                        </TableHead>
                        <TableHead className="text-right font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          التقدم
                        </TableHead>
                        <TableHead className="text-right font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          تاريخ البدء
                        </TableHead>
                        <TableHead className="text-right font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الاستحقاق
                        </TableHead>
                        <TableHead className="text-right font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الإجراءات
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ASSIGNED_TASKS.map((task) => {
                        const statusInfo = TASK_STATUSES.find(s => s.value === task.status);
                        const priorityInfo = TASK_PRIORITIES.find(p => p.value === task.priority);
                        
                        return (
                          <TableRow key={task.id} className="hover:bg-gray-50">
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                                {task.taskNumber}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <div>
                                <p className="text-sm font-medium">{task.transactionTitle}</p>
                                <p className="text-xs text-gray-600">{task.description}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                                  <User className="h-3 w-3 text-blue-600" />
                                </div>
                                <span className="text-xs">{task.assignedTo}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <Badge className={statusInfo?.color}>
                                {statusInfo?.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <Badge className={priorityInfo?.color}>
                                {priorityInfo?.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <div className="flex items-center gap-2">
                                <Progress value={task.progress} className="h-2 flex-1" />
                                <span className="text-xs font-mono">{task.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {task.startDate}
                            </TableCell>
                            <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <span className={task.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                                {task.dueDate}
                              </span>
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      // 825-08: تقارير الأداء
      case '825-08':
        const performanceStats = {
          totalTasks: ASSIGNED_TASKS.length,
          completed: ASSIGNED_TASKS.filter(t => t.status === 'completed').length,
          inProgress: ASSIGNED_TASKS.filter(t => t.status === 'in-progress').length,
          overdue: ASSIGNED_TASKS.filter(t => t.status === 'overdue').length,
          avgCompletionTime: 3.2,
          successRate: 92.5,
        };
        
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقارير الأداء والإنتاجية</h2>
              <div className="flex gap-2">
                <SelectWithCopy
                  label=""
                  id="reportPeriod"
                  options={[
                    { value: 'today', label: 'اليوم' },
                    { value: 'week', label: 'هذا الأسبوع' },
                    { value: 'month', label: 'هذا الشهر' },
                    { value: 'quarter', label: 'هذا الربع' },
                    { value: 'year', label: 'هذا العام' },
                    { value: 'custom', label: 'فترة مخصصة' },
                  ]}
                />
                <Button size="sm" className="h-8 text-xs bg-green-500">
                  <Download className="h-3 w-3 ml-1" />
                  تصدير التقرير
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Printer className="h-3 w-3 ml-1" />
                  طباعة
                </Button>
              </div>
            </div>

            {/* مؤشرات الأداء الرئيسية */}
            <div className="grid grid-cols-4 gap-3">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Target className="h-6 w-6" />
                    <TrendingUp className="h-4 w-4 text-blue-200" />
                  </div>
                  <p className="text-xs text-blue-100 mb-1">إجمالي المهام</p>
                  <p className="text-3xl font-mono mb-1">{performanceStats.totalTasks}</p>
                  <p className="text-xs text-blue-200">+15% عن الشهر الماضي</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <CheckCircle className="h-6 w-6" />
                    <TrendingUp className="h-4 w-4 text-green-200" />
                  </div>
                  <p className="text-xs text-green-100 mb-1">معدل الإنجاز</p>
                  <p className="text-3xl font-mono mb-1">{performanceStats.successRate}%</p>
                  <p className="text-xs text-green-200">ممتاز جداً</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Clock className="h-6 w-6" />
                    <TrendingUp className="h-4 w-4 text-purple-200" />
                  </div>
                  <p className="text-xs text-purple-100 mb-1">متوسط وقت الإنجاز</p>
                  <p className="text-3xl font-mono mb-1">{performanceStats.avgCompletionTime}</p>
                  <p className="text-xs text-purple-200">أيام</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Activity className="h-6 w-6" />
                    <TrendingUp className="h-4 w-4 text-orange-200" />
                  </div>
                  <p className="text-xs text-orange-100 mb-1">متوسط الإنتاجية</p>
                  <p className="text-3xl font-mono mb-1">94%</p>
                  <p className="text-xs text-orange-200">+8% تحسن</p>
                </CardContent>
              </Card>
            </div>

            {/* تقارير تفصيلية */}
            <div className="grid grid-cols-2 gap-3">
              {/* تقرير الأداء حسب الموظف */}
              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2 bg-blue-50 border-b">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Award className="h-4 w-4 text-blue-600" />
                    أداء الموظفين
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <ScrollArea className="h-80">
                    <div className="space-y-2">
                      {EMPLOYEES_DATA.map((emp, index) => (
                        <Card key={emp.id} className={`p-2 ${index < 3 ? 'border-r-4 border-green-500' : ''}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {index < 3 && <Star className="h-4 w-4 text-yellow-500" />}
                              <div>
                                <p className="text-xs font-medium">{emp.name}</p>
                                <p className="text-xs text-gray-600">{emp.department}</p>
                              </div>
                            </div>
                            <Badge className="bg-purple-100 text-purple-700">
                              #{index + 1}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                            <div className="bg-blue-50 rounded p-1.5 text-center">
                              <p className="text-gray-600">نشطة</p>
                              <p className="font-mono text-blue-600">{emp.activeTasks}</p>
                            </div>
                            <div className="bg-green-50 rounded p-1.5 text-center">
                              <p className="text-gray-600">مكتملة</p>
                              <p className="font-mono text-green-600">{emp.completedTasks}</p>
                            </div>
                            <div className="bg-purple-50 rounded p-1.5 text-center">
                              <p className="text-gray-600">الأداء</p>
                              <p className="font-mono text-purple-600">{emp.performance}%</p>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-gray-600">معدل الأداء</span>
                              <span className="font-mono">{emp.performance}%</span>
                            </div>
                            <Progress value={emp.performance} className="h-2" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* تقرير الأداء حسب نوع المهمة */}
              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2 bg-purple-50 border-b">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                    تحليل أنواع المهام
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <ScrollArea className="h-80">
                    <div className="space-y-2">
                      {TASK_TYPES.map((type, index) => {
                        const count = Math.floor(Math.random() * 20) + 5;
                        const avgTime = (Math.random() * 5 + 1).toFixed(1);
                        const successRate = Math.floor(Math.random() * 15) + 85;
                        
                        return (
                          <Card key={type.value} className="p-3 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <type.icon className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{type.label}</p>
                                <p className="text-xs text-gray-600">{count} مهمة</p>
                              </div>
                              <Badge className="bg-gray-100 text-gray-700 font-mono">
                                {successRate}%
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                              <div className="bg-green-50 rounded p-1.5 text-center">
                                <p className="text-gray-600">منجزة</p>
                                <p className="font-mono text-green-600">{Math.floor(count * successRate / 100)}</p>
                              </div>
                              <div className="bg-blue-50 rounded p-1.5 text-center">
                                <p className="text-gray-600">نشطة</p>
                                <p className="font-mono text-blue-600">{Math.floor(count * (100 - successRate) / 100)}</p>
                              </div>
                              <div className="bg-purple-50 rounded p-1.5 text-center">
                                <p className="text-gray-600">متوسط الوقت</p>
                                <p className="font-mono text-purple-600">{avgTime}د</p>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-600">معدل النجاح</span>
                                <span className="font-mono">{successRate}%</span>
                              </div>
                              <Progress value={successRate} className="h-2" />
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* تقارير إضافية */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Calendar className="h-4 w-4 text-green-600" />
                    توزيع المهام حسب الوقت
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span>اليوم</span>
                      <Badge className="bg-blue-100 text-blue-700 font-mono">8</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span>هذا الأسبوع</span>
                      <Badge className="bg-green-100 text-green-700 font-mono">42</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                      <span>هذا الشهر</span>
                      <Badge className="bg-purple-100 text-purple-700 font-mono">186</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                      <span>هذا الربع</span>
                      <Badge className="bg-orange-100 text-orange-700 font-mono">534</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    المهام المتأخرة - تحليل
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                      <span>تأخير 1-3 أيام</span>
                      <Badge className="bg-red-100 text-red-700 font-mono">5</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-orange-50 rounded border border-orange-200">
                      <span>تأخير 4-7 أيام</span>
                      <Badge className="bg-orange-100 text-orange-700 font-mono">2</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
                      <span>تأخير أكثر من أسبوع</span>
                      <Badge className="bg-yellow-100 text-yellow-700 font-mono">1</Badge>
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-center">
                      <p className="text-gray-600 mb-1">متوسط التأخير</p>
                      <p className="text-lg font-mono text-gray-900">3.2 يوم</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    الاتجاهات والتوقعات
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-green-50 rounded border border-green-200">
                      <p className="text-green-900 font-medium mb-1">✓ معدل الإنجاز</p>
                      <p className="text-green-700">+12% تحسن خلال الشهر</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-blue-900 font-medium mb-1">📈 الإنتاجية</p>
                      <p className="text-blue-700">زيادة مستمرة +8%</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded border border-purple-200">
                      <p className="text-purple-900 font-medium mb-1">⏱️ الوقت المتوقع</p>
                      <p className="text-purple-700">تحسن -15% في المدة</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      // 825-09: الموظفين والتكليف
      case '825-09':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إدارة الموظفين والتكليفات</h2>
              <div className="flex gap-2">
                <InputWithCopy
                  label=""
                  id="searchEmployees"
                  placeholder="بحث في الموظفين..."
                  icon={<Search className="h-4 w-4" />}
                />
                <SelectWithCopy
                  label=""
                  id="filterDept"
                  options={[
                    { value: 'all', label: 'جميع الأقسام' },
                    { value: 'transactions', label: 'المعاملات' },
                    { value: 'review', label: 'المراجعة' },
                    { value: 'approval', label: 'الاعتماد' },
                    { value: 'documentation', label: 'التوثيق' },
                  ]}
                />
                <Button size="sm" className="h-8 text-xs bg-blue-500">
                  <Plus className="h-3 w-3 ml-1" />
                  إسناد جديد
                </Button>
              </div>
            </div>

            {/* إحصائيات الموظفين */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-3 text-center">
                  <Users className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <p className="text-xs text-gray-700">إجمالي الموظفين</p>
                  <p className="text-2xl font-mono text-blue-700">{EMPLOYEES_DATA.length}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-3 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-600" />
                  <p className="text-xs text-gray-700">متاحون</p>
                  <p className="text-2xl font-mono text-green-700">
                    {EMPLOYEES_DATA.filter(e => e.available).length}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-3 text-center">
                  <AlertCircle className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                  <p className="text-xs text-gray-700">مشغولون</p>
                  <p className="text-2xl font-mono text-orange-700">
                    {EMPLOYEES_DATA.filter(e => !e.available).length}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-3 text-center">
                  <Activity className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                  <p className="text-xs text-gray-700">متوسط المهام</p>
                  <p className="text-2xl font-mono text-purple-700">
                    {(EMPLOYEES_DATA.reduce((a, b) => a + b.activeTasks, 0) / EMPLOYEES_DATA.length).toFixed(1)}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
                <CardContent className="p-3 text-center">
                  <Award className="h-5 w-5 mx-auto mb-1 text-cyan-600" />
                  <p className="text-xs text-gray-700">متوسط الأداء</p>
                  <p className="text-2xl font-mono text-cyan-700">
                    {(EMPLOYEES_DATA.reduce((a, b) => a + b.performance, 0) / EMPLOYEES_DATA.length).toFixed(0)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* بطاقات الموظفين */}
            <div className="grid grid-cols-2 gap-3">
              {EMPLOYEES_DATA.map((emp) => (
                <Card 
                  key={emp.id} 
                  className={`card-element card-rtl hover:shadow-lg transition-all ${emp.available ? 'border-r-4 border-green-500' : 'border-r-4 border-orange-500'}`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${emp.available ? 'bg-gradient-to-br from-green-400 to-green-500' : 'bg-gradient-to-br from-orange-400 to-orange-500'} flex items-center justify-center shadow-md`}>
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{emp.name}</h4>
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs mt-1">
                            {emp.code}
                          </Badge>
                        </div>
                      </div>
                      <Badge className={emp.available ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                        {emp.available ? '● متاح' : '● مشغول'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-600 mb-0.5">القسم</p>
                        <p className="text-xs font-medium">{emp.department}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-600 mb-0.5">المنصب</p>
                        <p className="text-xs font-medium">{emp.position}</p>
                      </div>
                    </div>

                    {/* إحصائيات المهام */}
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="bg-blue-50 rounded p-2 text-center border border-blue-200">
                        <p className="text-xs text-gray-600 mb-1">نشطة</p>
                        <p className="text-lg font-mono text-blue-600">{emp.activeTasks}</p>
                      </div>
                      <div className="bg-green-50 rounded p-2 text-center border border-green-200">
                        <p className="text-xs text-gray-600 mb-1">مكتملة</p>
                        <p className="text-lg font-mono text-green-600">{emp.completedTasks}</p>
                      </div>
                      <div className="bg-purple-50 rounded p-2 text-center border border-purple-200">
                        <p className="text-xs text-gray-600 mb-1">الأداء</p>
                        <p className="text-lg font-mono text-purple-600">{emp.performance}%</p>
                      </div>
                      <div className="bg-orange-50 rounded p-2 text-center border border-orange-200">
                        <p className="text-xs text-gray-600 mb-1">معدل</p>
                        <p className="text-lg font-mono text-orange-600">
                          {(emp.completedTasks / (emp.activeTasks + emp.completedTasks) * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    {/* مؤشر الأداء */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">معدل الأداء الإجمالي</span>
                        <span className="font-mono text-sm">{emp.performance}%</span>
                      </div>
                      <Progress value={emp.performance} className="h-2.5" />
                    </div>

                    {/* المهام الحالية */}
                    <div className="bg-gray-50 rounded p-2 mb-3">
                      <p className="text-xs text-gray-600 mb-2 font-medium">المهام الحالية ({emp.activeTasks}):</p>
                      <div className="space-y-1">
                        {Array.from({ length: Math.min(emp.activeTasks, 3) }, (_, i) => (
                          <div key={i} className="flex items-center justify-between text-xs bg-white rounded p-1.5">
                            <span className="text-gray-700">مهمة معاملة #{286 + i}</span>
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              {Math.floor(Math.random() * 40) + 60}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* أزرار الإجراءات */}
                    <div className="grid grid-cols-3 gap-1.5">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <Eye className="h-3 w-3 ml-1" />
                        عرض
                      </Button>
                      <Button 
                        size="sm" 
                        className={`h-7 text-xs ${emp.available ? 'bg-blue-500' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={!emp.available}
                      >
                        <Send className="h-3 w-3 ml-1" />
                        إسناد
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <BarChart3 className="h-3 w-3 ml-1" />
                        تقرير
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* جدول ملخص التكليفات */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Layers className="h-4 w-4 text-blue-600" />
                  ملخص التكليفات حسب الموظف
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-right font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الموظف
                      </TableHead>
                      <TableHead className="text-right font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        القسم
                      </TableHead>
                      <TableHead className="text-right font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        المهام النشطة
                      </TableHead>
                      <TableHead className="text-right font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        المهام المكتملة
                      </TableHead>
                      <TableHead className="text-right font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        معدل الإنجاز
                      </TableHead>
                      <TableHead className="text-right font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الأداء
                      </TableHead>
                      <TableHead className="text-right font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الحالة
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {EMPLOYEES_DATA.map((emp) => {
                      const completionRate = (emp.completedTasks / (emp.activeTasks + emp.completedTasks) * 100).toFixed(0);
                      
                      return (
                        <TableRow key={emp.id} className="hover:bg-gray-50">
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg ${emp.available ? 'bg-green-100' : 'bg-orange-100'} flex items-center justify-center`}>
                                <User className={`h-4 w-4 ${emp.available ? 'text-green-600' : 'text-orange-600'}`} />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{emp.name}</p>
                                <p className="text-xs text-gray-600 font-mono">{emp.code}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {emp.department}
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <Badge className="bg-blue-100 text-blue-700 font-mono">
                              {emp.activeTasks}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <Badge className="bg-green-100 text-green-700 font-mono">
                              {emp.completedTasks}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <div className="flex items-center gap-2">
                              <Progress value={Number(completionRate)} className="h-2 flex-1" />
                              <span className="text-xs font-mono">{completionRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <Badge className={
                              emp.performance >= 95 ? 'bg-green-100 text-green-700' :
                              emp.performance >= 90 ? 'bg-blue-100 text-blue-700' :
                              emp.performance >= 85 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-orange-100 text-orange-700'
                            }>
                              {emp.performance}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <Badge className={emp.available ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                              {emp.available ? 'متاح' : 'مشغول'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              محتوى التاب قيد التطوير
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      {/* Sidebar للتابات */}
      <div className="w-48 bg-white border-l border-gray-200 flex-shrink-0">
        <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm text-white">إسناد مهام المعاملات</h2>
              <p className="text-xs text-blue-100">شاشة 825</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-2 space-y-0.5">
            {TABS_CONFIG.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-right px-2 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="text-xs truncate">{tab.title}</span>
                  </div>
                  <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                    {tab.number}
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* محتوى التاب */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة إتمام المهمة */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="max-w-2xl" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              إتمام المهمة من المشرف
            </DialogTitle>
            <DialogDescription>
              إتمام المهمة بشكل إشرافي مع توثيق السبب
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2">{selectedTask.transactionTitle}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">رقم المهمة: </span>
                    <span className="font-medium">{selectedTask.taskNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">الموظف: </span>
                    <span className="font-medium">{selectedTask.assignedTo}</span>
                  </div>
                </div>
              </div>

              <TextAreaWithCopy
                label="سبب الإتمام الإشرافي *"
                id="completeReason"
                placeholder="اكتب سبب إتمام المهمة من قبل المشرف..."
                rows={3}
              />

              <div className="grid grid-cols-2 gap-3">
                <SelectWithCopy
                  label="حالة الإتمام"
                  id="completeStatus"
                  options={[
                    { value: 'fully-completed', label: 'مكتملة بالكامل' },
                    { value: 'partially-completed', label: 'مكتملة جزئياً' },
                    { value: 'completed-with-notes', label: 'مكتملة مع ملاحظات' },
                  ]}
                />

                <InputWithCopy
                  label="نسبة الإنجاز"
                  id="completionPercentage"
                  placeholder="100"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <div className="flex-1">
                  <p className="text-xs font-medium text-green-900">إشعار الموظف</p>
                  <p className="text-xs text-green-700">إرسال إشعار للموظف بإتمام المهمة</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            <Button className="bg-green-500 hover:bg-green-600">
              <CheckCircle className="h-4 w-4 ml-1" />
              إتمام المهمة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة إلغاء المهمة */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-2xl" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-600" />
              إلغاء المهمة
            </DialogTitle>
            <DialogDescription>
              إلغاء المهمة بشكل نهائي مع توثيق السبب
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h4 className="text-sm font-medium">تحذير: هذا الإجراء لا يمكن التراجع عنه</h4>
                </div>
                <h4 className="text-sm font-medium mb-2">{selectedTask.transactionTitle}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">رقم المهمة: </span>
                    <span className="font-medium">{selectedTask.taskNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">الموظف: </span>
                    <span className="font-medium">{selectedTask.assignedTo}</span>
                  </div>
                </div>
              </div>

              <SelectWithCopy
                label="سبب الإلغاء *"
                id="cancelReason"
                options={[
                  { value: '', label: 'اختر سبب الإلغاء' },
                  { value: 'client-request', label: 'طلب العميل' },
                  { value: 'duplicate', label: 'مهمة مكررة' },
                  { value: 'incorrect-assignment', label: 'إسناد خاطئ' },
                  { value: 'transaction-cancelled', label: 'إلغاء المعاملة الأساسية' },
                  { value: 'other', label: 'سبب آخر' },
                ]}
              />

              <TextAreaWithCopy
                label="تفاصيل الإلغاء *"
                id="cancelDetails"
                placeholder="اكتب تفاصيل سبب الإلغاء..."
                rows={3}
              />

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-900">إشعار الموظف والمسؤولين</p>
                  <p className="text-xs text-blue-700">إرسال إشعار بإلغاء المهمة</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              رجوع
            </Button>
            <Button className="bg-red-500 hover:bg-red-600">
              <Ban className="h-4 w-4 ml-1" />
              تأكيد الإلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تحويل المهمة */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent className="max-w-3xl" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              تحويل المهمة إلى موظف آخر
            </DialogTitle>
            <DialogDescription>
              تحويل المهمة لموظف آخر لاستكمالها
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2">{selectedTask.transactionTitle}</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">رقم المهمة: </span>
                    <span className="font-medium">{selectedTask.taskNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">الموظف الحالي: </span>
                    <span className="font-medium">{selectedTask.assignedTo}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">التقدم الحالي: </span>
                    <Badge className="bg-blue-100 text-blue-700">{selectedTask.progress}%</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SelectWithCopy
                  label="اختر الموظف الجديد *"
                  id="newEmployee"
                  options={[
                    { value: '', label: 'اختر الموظف' },
                    ...EMPLOYEES_DATA.filter(e => e.available).map(emp => ({
                      value: emp.id,
                      label: `${emp.name} - ${emp.department} (${emp.activeTasks} مهام)`
                    }))
                  ]}
                />

                <SelectWithCopy
                  label="نوع التحويل"
                  id="transferType"
                  options={[
                    { value: 'full', label: 'تحويل كامل' },
                    { value: 'continuation', label: 'استكمال (الاحتفاظ بالتقدم)' },
                    { value: 'restart', label: 'بداية جديدة (إعادة التقدم)' },
                  ]}
                />
              </div>

              <TextAreaWithCopy
                label="سبب التحويل *"
                id="transferReason"
                placeholder="اكتب سبب تحويل المهمة..."
                rows={2}
              />

              <TextAreaWithCopy
                label="ملاحظات للموظف الجديد"
                id="transferNotes"
                placeholder="أي ملاحظات أو تعليمات للموظف الجديد..."
                rows={2}
              />

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-green-900">إشعار الموظف الجديد</p>
                    <p className="text-xs text-green-700">إرسال تفاصيل المهمة</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-blue-900">إشعار الموظف السابق</p>
                    <p className="text-xs text-blue-700">إخطاره بالتحويل</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowTransferDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Share2 className="h-4 w-4 ml-1" />
              تحويل المهمة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تجميد المهمة */}
      <Dialog open={showFreezeDialog} onOpenChange={setShowFreezeDialog}>
        <DialogContent className="max-w-2xl" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-cyan-600" />
              تجميد المهمة
            </DialogTitle>
            <DialogDescription>
              تجميد المهمة لفترة محددة أو غير محددة
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2">{selectedTask.transactionTitle}</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">رقم المهمة: </span>
                    <span className="font-medium">{selectedTask.taskNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">الموظف: </span>
                    <span className="font-medium">{selectedTask.assignedTo}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">التقدم: </span>
                    <Badge className="bg-blue-100 text-blue-700">{selectedTask.progress}%</Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">نوع التجميد</label>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-cyan-500 bg-cyan-50">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="freezeType" value="temporary" defaultChecked className="w-4 h-4" />
                        <div>
                          <p className="text-sm font-medium text-cyan-900">تجميد مؤقت</p>
                          <p className="text-xs text-cyan-700">لفترة زمنية محددة</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-purple-500">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="freezeType" value="indefinite" className="w-4 h-4" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">تجميد غير محدد</p>
                          <p className="text-xs text-gray-600">لحين إشعار آخر</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3" id="freezePeriodSection">
                <DateInputWithToday
                  label="تاريخ التجميد"
                  id="freezeStartDate"
                />

                <DateInputWithToday
                  label="تاريخ إلغاء التجميد (للمؤقت)"
                  id="freezeEndDate"
                />
              </div>

              <SelectWithCopy
                label="سبب التجميد *"
                id="freezeReasonSelect"
                options={[
                  { value: '', label: 'اختر سبب التجميد' },
                  { value: 'missing-docs', label: 'في انتظار مستندات ناقصة' },
                  { value: 'client-delay', label: 'تأخير من العميل' },
                  { value: 'external-approval', label: 'في انتظار موافقة جهة خارجية' },
                  { value: 'technical-issue', label: 'مشكلة تقنية' },
                  { value: 'government-hold', label: 'تعليق حكومي' },
                  { value: 'other', label: 'سبب آخر' },
                ]}
              />

              <TextAreaWithCopy
                label="تفاصيل التجميد *"
                id="freezeDetails"
                placeholder="اكتب تفاصيل سبب التجميد..."
                rows={3}
              />

              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <div className="flex-1">
                  <p className="text-xs font-medium text-orange-900">إشعار الموظف والمسؤولين</p>
                  <p className="text-xs text-orange-700">إرسال إشعار بتجميد المهمة</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFreezeDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              <Snowflake className="h-4 w-4 ml-1" />
              تجميد المهمة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionTasksAssignment_Complete_825;
