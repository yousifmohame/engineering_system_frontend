/**
 * الشاشة 999 - مهامي الشخصية v8.0
 * ====================================
 * 
 * شاشة شاملة لعرض المهام الشخصية للموظف:
 * - المهام تحت المعالجة (الأهم)
 * - المهام غير المستلمة
 * - المهام السابقة
 * - جميع حالات المهام
 * - فلترة وبحث متقدم
 * - إحصائيات تفصيلية
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  CheckCircle, Clock, AlertCircle, XCircle, User, Calendar, FileText,
  Search, Filter, Download, RefreshCw, Eye, Edit, Trash2, Send,
  TrendingUp, Target, Award, Activity, Bell, Mail, ChevronRight,
  PlayCircle, PauseCircle, StopCircle, Archive, Star, Flag, MessageSquare,
  Paperclip, Users, MapPin, BarChart3, PieChart, ClipboardCheck
} from 'lucide-react';

// أنواع حالات المهام
type TaskStatus = 'unassigned' | 'processing' | 'completed' | 'cancelled' | 'overdue' | 'pending';

interface Task {
  id: string;
  taskNumber: string;
  title: string;
  description: string;
  transactionId: string;
  transactionNumber: string;
  assignedBy: string;
  assignedDate: string;
  dueDate: string;
  receivedDate?: string;
  completedDate?: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  category: string;
  notes?: string;
  attachments?: number;
  comments?: number;
  // بيانات الأتعاب
  fees?: {
    total: number;           // إجمالي الأتعاب
    paid: number;            // المبلغ المدفوع
    paymentStatus: 'paid' | 'partial' | 'unpaid';  // حالة الدفع
    paymentPercentage: number;  // نسبة الدفع
  };
}

// بيانات تجريبية للمهام
const SAMPLE_TASKS: Task[] = [
  {
    id: 'TSK-001',
    taskNumber: 'TSK-2025-001',
    title: 'مراجعة مخططات المشروع السكني',
    description: 'مراجعة شاملة للمخططات الهندسية والتأكد من مطابقتها للمواصفات',
    transactionId: 'TXN-2025-156',
    transactionNumber: '2025/156',
    assignedBy: 'م. أحمد السعيد',
    assignedDate: '2025-01-15',
    dueDate: '2025-01-25',
    receivedDate: '2025-01-16',
    status: 'processing',
    priority: 'high',
    progress: 65,
    category: 'مراجعة فنية',
    attachments: 5,
    comments: 3,
    fees: {
      total: 15000,
      paid: 10000,
      paymentStatus: 'partial',
      paymentPercentage: 67
    }
  },
  {
    id: 'TSK-002',
    taskNumber: 'TSK-2025-002',
    title: 'إعداد تقرير الموقع',
    description: 'إعداد تقرير تفصيلي عن حالة الموقع',
    transactionId: 'TXN-2025-157',
    transactionNumber: '2025/157',
    assignedBy: 'م. خالد العمري',
    assignedDate: '2025-01-18',
    dueDate: '2025-01-22',
    status: 'unassigned',
    priority: 'urgent',
    progress: 0,
    category: 'تقارير',
    attachments: 2,
    fees: {
      total: 8000,
      paid: 0,
      paymentStatus: 'unpaid',
      paymentPercentage: 0
    }
  },
  {
    id: 'TSK-003',
    taskNumber: 'TSK-2025-003',
    title: 'موافقة على تعديلات المخطط',
    description: 'مراجعة والموافقة على التعديلات المقترحة',
    transactionId: 'TXN-2025-155',
    transactionNumber: '2025/155',
    assignedBy: 'م. فهد الدوسري',
    assignedDate: '2025-01-17',
    dueDate: '2025-01-20',
    receivedDate: '2025-01-17',
    status: 'processing',
    priority: 'medium',
    progress: 40,
    category: 'موافقات',
    comments: 5,
    fees: {
      total: 12000,
      paid: 4800,
      paymentStatus: 'partial',
      paymentPercentage: 40
    }
  },
  {
    id: 'TSK-004',
    taskNumber: 'TSK-2025-004',
    title: 'استلام المستندات الأصلية',
    description: 'استلام ومراجعة المستندات الأصلية من العميل',
    transactionId: 'TXN-2025-158',
    transactionNumber: '2025/158',
    assignedBy: 'م. سعود القحطاني',
    assignedDate: '2025-01-14',
    dueDate: '2025-01-18',
    status: 'overdue',
    priority: 'urgent',
    progress: 30,
    category: 'مستندات',
    attachments: 1,
    fees: {
      total: 20000,
      paid: 5000,
      paymentStatus: 'partial',
      paymentPercentage: 25
    }
  },
  {
    id: 'TSK-005',
    taskNumber: 'TSK-2025-005',
    title: 'مراجعة الحسابات المالية',
    description: 'التحقق من الحسابات والفواتير',
    transactionId: 'TXN-2025-150',
    transactionNumber: '2025/150',
    assignedBy: 'م. عبدالله الزهراني',
    assignedDate: '2025-01-10',
    dueDate: '2025-01-15',
    receivedDate: '2025-01-11',
    completedDate: '2025-01-14',
    status: 'completed',
    priority: 'low',
    progress: 100,
    category: 'مالية',
    fees: {
      total: 10000,
      paid: 10000,
      paymentStatus: 'paid',
      paymentPercentage: 100
    }
  }
];

const MyTasks_Complete_999: React.FC = () => {
  const [activeTab, setActiveTab] = useState('processing');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);

  // إحصائيات المهام
  const statistics = useMemo(() => {
    // حساب إجمالي الأتعاب
    const totalFees = SAMPLE_TASKS.reduce((sum, task) => sum + (task.fees?.total || 0), 0);
    const paidFees = SAMPLE_TASKS.reduce((sum, task) => sum + (task.fees?.paid || 0), 0);
    const unpaidFees = totalFees - paidFees;
    const paidPercentage = totalFees > 0 ? Math.round((paidFees / totalFees) * 100) : 0;

    return {
      processing: SAMPLE_TASKS.filter(t => t.status === 'processing').length,
      unassigned: SAMPLE_TASKS.filter(t => t.status === 'unassigned').length,
      completed: SAMPLE_TASKS.filter(t => t.status === 'completed').length,
      overdue: SAMPLE_TASKS.filter(t => t.status === 'overdue').length,
      total: SAMPLE_TASKS.length,
      highPriority: SAMPLE_TASKS.filter(t => t.priority === 'high' || t.priority === 'urgent').length,
      // إحصائيات الأتعاب
      totalFees,
      paidFees,
      unpaidFees,
      paidPercentage
    };
  }, []);

  // فلترة المهام حسب التاب
  const filteredTasks = useMemo(() => {
    let tasks = SAMPLE_TASKS;

    // فلتر حسب التاب
    if (activeTab !== 'all') {
      tasks = tasks.filter(t => t.status === activeTab);
    }

    // فلتر حسب البحث
    if (searchQuery) {
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.taskNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // فلتر حسب الأولوية
    if (filterPriority !== 'all') {
      tasks = tasks.filter(t => t.priority === filterPriority);
    }

    // فلتر حسب الفئة
    if (filterCategory !== 'all') {
      tasks = tasks.filter(t => t.category === filterCategory);
    }

    return tasks;
  }, [activeTab, searchQuery, filterPriority, filterCategory]);

  // ألوان الحالات
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'unassigned': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'cancelled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'processing': return 'قيد المعالجة';
      case 'unassigned': return 'غير مستلمة';
      case 'completed': return 'مكتملة';
      case 'overdue': return 'متأخرة';
      case 'cancelled': return 'ملغاة';
      default: return 'معلقة';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل جداً';
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return 'عادية';
    }
  };

  // دالة لعرض حالة الدفع
  const getPaymentStatusColor = (status: 'paid' | 'partial' | 'unpaid') => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'partial': return 'bg-yellow-100 text-yellow-700';
      case 'unpaid': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusText = (status: 'paid' | 'partial' | 'unpaid') => {
    switch (status) {
      case 'paid': return 'مسددة';
      case 'partial': return 'مسددة جزئياً';
      case 'unpaid': return 'غير مسددة';
      default: return 'غير محدد';
    }
  };

  // تنسيق المبلغ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-amber-50" style={{ direction: 'rtl' }}>
      <div className="container mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ClipboardCheck className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700' }}>
                مهامي الشخصية
              </h1>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إدارة ومتابعة المهام الموكلة إليك
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-orange-100 text-orange-700">
              <code>SCR-999</code>
            </Badge>
            <Badge className="bg-green-100 text-green-700">
              مهام شخصية
            </Badge>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-6 gap-4">
          {[
            { label: 'تحت المعالجة', value: statistics.processing, icon: PlayCircle, color: '#2563eb', tab: 'processing' },
            { label: 'غير مستلمة', value: statistics.unassigned, icon: Bell, color: '#f59e0b', tab: 'unassigned' },
            { label: 'متأخرة', value: statistics.overdue, icon: AlertCircle, color: '#ef4444', tab: 'overdue' },
            { label: 'مكتملة', value: statistics.completed, icon: CheckCircle, color: '#10b981', tab: 'completed' },
            { label: 'عالية الأولوية', value: statistics.highPriority, icon: Flag, color: '#f97316', tab: 'all' },
            { label: 'إجمالي المهام', value: statistics.total, icon: Target, color: '#8b5cf6', tab: 'all' }
          ].map((stat, i) => (
            <Card 
              key={i} 
              className="card-rtl hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setActiveTab(stat.tab)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div style={{ color: stat.color }}>
                    {React.createElement(stat.icon, { className: 'h-6 w-6' })}
                  </div>
                  <span className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: stat.color }}>
                    {stat.value}
                  </span>
                </div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* إحصائيات الأتعاب */}
        <Card className="card-rtl bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: '#1e40af' }}>
                  ملخص الأتعاب
                </h3>
              </div>
              <Badge className="bg-blue-600 text-white">
                نسبة التحصيل: {statistics.paidPercentage}%
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إجمالي الأتعاب
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: '#1e40af' }}>
                  {formatCurrency(statistics.totalFees)}
                </p>
              </div>

              <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المحصّل
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: '#15803d' }}>
                  {formatCurrency(statistics.paidFees)}
                </p>
              </div>

              <div className="text-center p-3 bg-white rounded-lg border border-orange-100">
                <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المتبقي
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: '#c2410c' }}>
                  {formatCurrency(statistics.unpaidFees)}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <Progress value={statistics.paidPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* شريط الأدوات */}
        <Card className="card-rtl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن مهمة..."
                  className="pr-10 text-sm"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40 text-sm">
                  <SelectValue placeholder="الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأولويات</SelectItem>
                  <SelectItem value="urgent">عاجل جداً</SelectItem>
                  <SelectItem value="high">عالية</SelectItem>
                  <SelectItem value="medium">متوسطة</SelectItem>
                  <SelectItem value="low">منخفضة</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40 text-sm">
                  <SelectValue placeholder="الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفئات</SelectItem>
                  <SelectItem value="مراجعة فنية">مراجعة فنية</SelectItem>
                  <SelectItem value="تقارير">تقارير</SelectItem>
                  <SelectItem value="موافقات">موافقات</SelectItem>
                  <SelectItem value="مستندات">مستندات</SelectItem>
                  <SelectItem value="مالية">مالية</SelectItem>
                </SelectContent>
              </Select>

              <Button size="sm" variant="outline">
                <RefreshCw className="h-4 w-4 ml-1" />
                تحديث
              </Button>

              <Button size="sm">
                <Download className="h-4 w-4 ml-1" />
                تصدير
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* التابات */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm">
            <TabsTrigger value="processing" className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <PlayCircle className="h-4 w-4 ml-1" />
              قيد المعالجة ({statistics.processing})
            </TabsTrigger>
            <TabsTrigger value="unassigned" className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Bell className="h-4 w-4 ml-1" />
              غير مستلمة ({statistics.unassigned})
            </TabsTrigger>
            <TabsTrigger value="overdue" className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <AlertCircle className="h-4 w-4 ml-1" />
              متأخرة ({statistics.overdue})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <CheckCircle className="h-4 w-4 ml-1" />
              مكتملة ({statistics.completed})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <XCircle className="h-4 w-4 ml-1" />
              ملغاة
            </TabsTrigger>
            <TabsTrigger value="all" className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Target className="h-4 w-4 ml-1" />
              الكل ({statistics.total})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card className="card-rtl">
              <CardContent className="p-0">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-orange-50 to-amber-50">
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المهمة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأتعاب</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقدم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ التسليم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id} className="hover:bg-orange-50 transition-colors">
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                          {task.taskNumber}
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              {task.attachments > 0 && (
                                <span className="flex items-center gap-1">
                                  <Paperclip className="h-3 w-3" />
                                  {task.attachments}
                                </span>
                              )}
                              {task.comments > 0 && (
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {task.comments}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                          {task.transactionNumber}
                        </TableCell>
                        <TableCell className="text-right">
                          {task.fees ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                                  {formatCurrency(task.fees.total)}
                                </span>
                              </div>
                              <div className="flex items-center justify-end gap-2">
                                <Badge className={`${getPaymentStatusColor(task.fees.paymentStatus)} text-[10px] px-1.5 py-0`}>
                                  {getPaymentStatusText(task.fees.paymentStatus)}
                                </Badge>
                              </div>
                              {task.fees.paymentStatus !== 'unpaid' && (
                                <div className="flex items-center gap-1.5">
                                  <Progress value={task.fees.paymentPercentage} className="h-1.5 flex-1" />
                                  <span className="text-[10px] text-gray-600" style={{ fontFamily: 'Courier New, monospace' }}>
                                    {task.fees.paymentPercentage}%
                                  </span>
                                </div>
                              )}
                              <div className="text-[10px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                مدفوع: {formatCurrency(task.fees.paid)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              لا توجد أتعاب
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityText(task.priority)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={getStatusColor(task.status)}>
                            {getStatusText(task.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2">
                            <Progress value={task.progress} className="h-2 w-20" />
                            <span className="text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                              {task.progress}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                          {task.dueDate}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                setSelectedTask(task);
                                setShowTaskDialog(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            {task.status === 'unassigned' && (
                              <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                                <CheckCircle className="h-3 w-3 ml-1" />
                                استلام
                              </Button>
                            )}
                            {task.status === 'processing' && (
                              <Button size="sm" className="h-7 px-2 text-xs bg-green-600">
                                <Send className="h-3 w-3 ml-1" />
                                إنهاء
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* رسالة عدم وجود مهام */}
        {filteredTasks.length === 0 && (
          <Card className="card-rtl">
            <CardContent className="p-12 text-center">
              <ClipboardCheck className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-base mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                لا توجد مهام
              </h3>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                لم يتم العثور على مهام في هذه الفئة
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* نافذة تفاصيل المهمة */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="max-w-3xl" style={{ direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تفاصيل المهمة
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              عرض شامل لجميع معلومات المهمة والأتعاب
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    رقم المهمة
                  </Label>
                  <p className="text-sm" style={{ fontFamily: 'Courier New, monospace' }}>
                    {selectedTask.taskNumber}
                  </p>
                </div>
                <div>
                  <Label className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    رقم المعاملة
                  </Label>
                  <p className="text-sm" style={{ fontFamily: 'Courier New, monospace' }}>
                    {selectedTask.transactionNumber}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  العنوان
                </Label>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                  {selectedTask.title}
                </p>
              </div>

              <div>
                <Label className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الوصف
                </Label>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {selectedTask.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الحالة
                  </Label>
                  <Badge className={getStatusColor(selectedTask.status)}>
                    {getStatusText(selectedTask.status)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الأولوية
                  </Label>
                  <Badge className={getPriorityColor(selectedTask.priority)}>
                    {getPriorityText(selectedTask.priority)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    التقدم
                  </Label>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedTask.progress} className="h-2" />
                    <span className="text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                      {selectedTask.progress}%
                    </span>
                  </div>
                </div>
              </div>

              {/* معلومات الأتعاب */}
              {selectedTask.fees && (
                <>
                  <Separator />
                  
                  <div>
                    <Label className="text-sm mb-3 flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                      <BarChart3 className="h-4 w-4" />
                      معلومات الأتعاب
                    </Label>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="card-rtl bg-blue-50 border-blue-200">
                        <CardContent className="p-3">
                          <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            إجمالي الأتعاب
                          </p>
                          <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: '#1e40af' }}>
                            {formatCurrency(selectedTask.fees.total)}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="card-rtl bg-green-50 border-green-200">
                        <CardContent className="p-3">
                          <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            المبلغ المدفوع
                          </p>
                          <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: '#15803d' }}>
                            {formatCurrency(selectedTask.fees.paid)}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="card-rtl bg-orange-50 border-orange-200">
                        <CardContent className="p-3">
                          <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            المبلغ المتبقي
                          </p>
                          <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: '#c2410c' }}>
                            {formatCurrency(selectedTask.fees.total - selectedTask.fees.paid)}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="card-rtl bg-purple-50 border-purple-200">
                        <CardContent className="p-3">
                          <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            حالة الدفع
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge className={getPaymentStatusColor(selectedTask.fees.paymentStatus)}>
                              {getPaymentStatusText(selectedTask.fees.paymentStatus)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* شريط التقدم للدفع */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          نسبة الدفع
                        </Label>
                        <span className="text-sm" style={{ fontFamily: 'Courier New, monospace', fontWeight: '700' }}>
                          {selectedTask.fees.paymentPercentage}%
                        </span>
                      </div>
                      <Progress 
                        value={selectedTask.fees.paymentPercentage} 
                        className="h-3"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
              إغلاق
            </Button>
            {selectedTask?.status === 'unassigned' && (
              <Button>
                <CheckCircle className="h-4 w-4 ml-1" />
                استلام المهمة
              </Button>
            )}
            {selectedTask?.status === 'processing' && (
              <Button className="bg-green-600">
                <Send className="h-4 w-4 ml-1" />
                إنهاء المهمة
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyTasks_Complete_999;
