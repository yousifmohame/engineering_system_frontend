/**
 * الشاشة 999 - مهامي الشخصية v8.1 - محسّنة ومكثفة
 * ====================================================
 * 
 * نسخة محسّنة ومكثفة مع:
 * - تكثيف المحتوى واستغلال المساحة
 * - تصغير أحجام البطاقات
 * - تصغير منطقة البحث
 * - قائمة منسدلة لاختيار المهام
 * - تحسينات عامة في الأداء والواجهة
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  CheckCircle, Clock, AlertCircle, XCircle, User, Calendar, FileText,
  Search, Filter, Download, RefreshCw, Eye, Edit,
  TrendingUp, Target, Activity, Bell, ChevronRight,
  PlayCircle, Archive, Star, Flag, MessageSquare,
  Paperclip, BarChart3, ClipboardCheck, DollarSign, Zap
} from 'lucide-react';
import { InputWithCopy } from '../InputWithCopy';

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
  fees?: {
    total: number;
    paid: number;
    paymentStatus: 'paid' | 'partial' | 'unpaid';
    paymentPercentage: number;
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
  },
  {
    id: 'TSK-006',
    taskNumber: 'TSK-2025-006',
    title: 'إعداد جدول الكميات',
    description: 'إعداد جدول كميات تفصيلي للمشروع',
    transactionId: 'TXN-2025-159',
    transactionNumber: '2025/159',
    assignedBy: 'م. محمد الغامدي',
    assignedDate: '2025-01-19',
    dueDate: '2025-01-26',
    receivedDate: '2025-01-19',
    status: 'processing',
    priority: 'high',
    progress: 20,
    category: 'فنية',
    attachments: 3,
    comments: 2,
    fees: {
      total: 18000,
      paid: 9000,
      paymentStatus: 'partial',
      paymentPercentage: 50
    }
  }
];

const MyTasks_Complete_999_Enhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState('processing');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [showTaskDialog, setShowTaskDialog] = useState(false);

  // إحصائيات المهام
  const statistics = useMemo(() => {
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
      totalFees,
      paidFees,
      unpaidFees,
      paidPercentage
    };
  }, []);

  // فلترة المهام
  const filteredTasks = useMemo(() => {
    let tasks = SAMPLE_TASKS;

    if (activeTab !== 'all') {
      tasks = tasks.filter(t => t.status === activeTab);
    }

    if (searchQuery) {
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.taskNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterPriority !== 'all') {
      tasks = tasks.filter(t => t.priority === filterPriority);
    }

    if (filterCategory !== 'all') {
      tasks = tasks.filter(t => t.category === filterCategory);
    }

    return tasks;
  }, [activeTab, searchQuery, filterPriority, filterCategory]);

  // دالة لعرض المهمة المحددة من القائمة المنسدلة
  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    const task = SAMPLE_TASKS.find(t => t.taskNumber === taskId);
    if (task) {
      setSelectedTask(task);
      setShowTaskDialog(true);
    }
  };

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
      case 'urgent': return 'عاجل';
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return 'عادية';
    }
  };

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
      case 'partial': return 'جزئي';
      case 'unpaid': return 'غير مسددة';
      default: return 'غير محدد';
    }
  };

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
      <div className="container mx-auto p-4 space-y-4">
        
        {/* Header - مكثف */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
              <ClipboardCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700' }}>
                مهامي الشخصية
              </h1>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إدارة ومتابعة المهام الموكلة إليك
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-orange-100 text-orange-700 text-xs">
              <code>SCR-999</code>
            </Badge>
          </div>
        </div>

        {/* إحصائيات سريعة - مكثفة */}
        <div className="grid grid-cols-8 gap-2">
          {[
            { label: 'تحت المعالجة', value: statistics.processing, icon: PlayCircle, color: '#2563eb', tab: 'processing' },
            { label: 'غير مستلمة', value: statistics.unassigned, icon: Bell, color: '#f59e0b', tab: 'unassigned' },
            { label: 'متأخرة', value: statistics.overdue, icon: AlertCircle, color: '#ef4444', tab: 'overdue' },
            { label: 'مكتملة', value: statistics.completed, icon: CheckCircle, color: '#10b981', tab: 'completed' },
            { label: 'عالية الأولوية', value: statistics.highPriority, icon: Flag, color: '#f97316', tab: 'all' },
            { label: 'إجمالي المهام', value: statistics.total, icon: Target, color: '#8b5cf6', tab: 'all' },
            { label: 'إجمالي الأتعاب', value: `${statistics.totalFees / 1000}K`, icon: DollarSign, color: '#06b6d4', tab: 'all' },
            { label: 'نسبة التحصيل', value: `${statistics.paidPercentage}%`, icon: TrendingUp, color: '#10b981', tab: 'all' }
          ].map((stat, i) => (
            <Card 
              key={i} 
              className="card-rtl hover:shadow-md transition-all cursor-pointer border-l-4"
              style={{ borderLeftColor: stat.color }}
              onClick={() => setActiveTab(stat.tab)}
            >
              <CardContent className="p-2">
                <div className="flex flex-col items-center text-center gap-1">
                  <div style={{ color: stat.color }}>
                    {React.createElement(stat.icon, { className: 'h-4 w-4' })}
                  </div>
                  <span className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: stat.color }}>
                    {stat.value}
                  </span>
                  <p className="text-[10px] text-gray-600 leading-tight" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* شريط الأدوات - مكثف */}
        <Card className="card-rtl">
          <CardContent className="p-2">
            <div className="grid grid-cols-12 gap-2 items-center">
              {/* البحث - أصغر */}
              <div className="col-span-3">
                <div className="relative">
                  <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                  <InputWithCopy
                    label=""
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث..."
                    className="pr-8 text-xs h-8"
                    copyable={false}
                    clearable={true}
                  />
                </div>
              </div>

              {/* اختيار مهمة من القائمة - جديد */}
              <div className="col-span-3">
                <Select value={selectedTaskId} onValueChange={handleTaskSelect}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="اختر مهمة..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SAMPLE_TASKS.map((task) => (
                      <SelectItem key={task.id} value={task.taskNumber} className="text-xs">
                        {task.taskNumber} - {task.title.substring(0, 30)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* فلاتر - أصغر */}
              <div className="col-span-2">
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأولويات</SelectItem>
                    <SelectItem value="urgent">عاجل</SelectItem>
                    <SelectItem value="high">عالية</SelectItem>
                    <SelectItem value="medium">متوسطة</SelectItem>
                    <SelectItem value="low">منخفضة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="h-8 text-xs">
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
              </div>

              {/* أزرار - أصغر */}
              <div className="col-span-2 flex gap-1">
                <Button size="sm" variant="outline" className="h-8 text-xs flex-1">
                  <RefreshCw className="h-3 w-3 ml-1" />
                  تحديث
                </Button>
                <Button size="sm" className="h-8 text-xs flex-1">
                  <Download className="h-3 w-3 ml-1" />
                  تصدير
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* الجدول - مكثف */}
        <Card className="card-rtl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-orange-50 to-amber-50">
                    <TableHead className="text-right text-[10px] p-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهمة</TableHead>
                    <TableHead className="text-right text-[10px] p-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                    <TableHead className="text-right text-[10px] p-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</TableHead>
                    <TableHead className="text-right text-[10px] p-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأتعاب</TableHead>
                    <TableHead className="text-right text-[10px] p-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right text-[10px] p-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقدم</TableHead>
                    <TableHead className="text-right text-[10px] p-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموعد</TableHead>
                    <TableHead className="text-right text-[10px] p-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center p-8">
                        <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          لا توجد مهام تطابق معايير البحث
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id} className="hover:bg-orange-50 transition-colors">
                        <TableCell className="text-right p-2">
                          <div className="flex flex-col gap-0.5">
                            <code className="text-[10px] text-blue-600" style={{ fontFamily: 'Courier New, monospace' }}>
                              {task.taskNumber}
                            </code>
                            <Badge className={`${getPriorityColor(task.priority)} text-[9px] px-1 py-0`}>
                              {getPriorityText(task.priority)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right p-2">
                          <div className="flex flex-col gap-0.5">
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {task.title}
                            </p>
                            <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {task.category}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right p-2">
                          <code className="text-[10px] text-purple-600" style={{ fontFamily: 'Courier New, monospace' }}>
                            {task.transactionNumber}
                          </code>
                        </TableCell>
                        <TableCell className="text-right p-2">
                          {task.fees && (
                            <div className="flex flex-col gap-0.5">
                              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                                {formatCurrency(task.fees.total)}
                              </p>
                              <div className="flex items-center gap-1">
                                <Badge className={`${getPaymentStatusColor(task.fees.paymentStatus)} text-[9px] px-1 py-0`}>
                                  {task.fees.paymentPercentage}%
                                </Badge>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right p-2">
                          <Badge className={`${getStatusColor(task.status)} text-[9px] px-1 py-0`}>
                            {getStatusText(task.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right p-2">
                          <div className="flex flex-col gap-1">
                            <Progress value={task.progress} className="h-1.5 w-16" />
                            <span className="text-[9px] text-gray-600">{task.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right p-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-[10px] text-gray-600">{task.dueDate}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right p-2">
                          <div className="flex items-center gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                setSelectedTask(task);
                                setShowTaskDialog(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* ملخص سريع */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="card-rtl bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-blue-600 mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي الأتعاب
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: '#1e40af' }}>
                    {formatCurrency(statistics.totalFees)}
                  </p>
                </div>
                <DollarSign className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-rtl bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-green-600 mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    المحصّل
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: '#15803d' }}>
                    {formatCurrency(statistics.paidFees)}
                  </p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-rtl bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-orange-600 mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    المتبقي
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: '#c2410c' }}>
                    {formatCurrency(statistics.unpaidFees)}
                  </p>
                </div>
                <AlertCircle className="h-6 w-6 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog تفاصيل المهمة */}
      {selectedTask && (
        <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
          <DialogContent className="max-w-2xl" style={{ direction: 'rtl' }}>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'right' }}>
                تفاصيل المهمة: {selectedTask.taskNumber}
              </DialogTitle>
              <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'right' }}>
                {selectedTask.title}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600">رقم المعاملة</Label>
                  <p className="text-sm">{selectedTask.transactionNumber}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">الحالة</Label>
                  <Badge className={`${getStatusColor(selectedTask.status)} text-xs`}>
                    {getStatusText(selectedTask.status)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">الأولوية</Label>
                  <Badge className={`${getPriorityColor(selectedTask.priority)} text-xs`}>
                    {getPriorityText(selectedTask.priority)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">التقدم</Label>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedTask.progress} className="h-2 flex-1" />
                    <span className="text-xs">{selectedTask.progress}%</span>
                  </div>
                </div>
              </div>

              {selectedTask.fees && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-xs mb-2" style={{ fontWeight: '700' }}>معلومات الأتعاب</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">الإجمالي:</span>
                      <p style={{ fontWeight: '600' }}>{formatCurrency(selectedTask.fees.total)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">المدفوع:</span>
                      <p style={{ fontWeight: '600', color: '#15803d' }}>{formatCurrency(selectedTask.fees.paid)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">المتبقي:</span>
                      <p style={{ fontWeight: '600', color: '#c2410c' }}>
                        {formatCurrency(selectedTask.fees.total - selectedTask.fees.paid)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-xs text-gray-600">الوصف</Label>
                <p className="text-sm text-gray-700">{selectedTask.description}</p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setShowTaskDialog(false)} variant="outline" size="sm">
                إغلاق
              </Button>
              <Button size="sm">
                <Edit className="h-3 w-3 ml-1" />
                تعديل
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MyTasks_Complete_999_Enhanced;
