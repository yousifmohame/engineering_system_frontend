/**
 * الشاشة 825 - إسناد مهام المعاملات v8.0 ✨
 * ================================================
 * 
 * نظام شامل لإدارة وإسناد مهام المعاملات مع تطبيق معايير v8.0:
 * ✅ حقول الإدخال المحسّنة (InputWithCopy)
 * ✅ مؤشر التفعيل المحسّن (EnhancedSwitch)
 * ✅ السايد بار الموحد للتابات
 * ✅ RTL كامل مع خط Tajawal
 * ✅ تكثيف محسّن للبطاقات الإحصائية
 * 
 * التطوير: أكتوبر 2025 - v8.0
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
  ArrowUp, ArrowDown, Layers, Plus, Snowflake, UserX, Ban, Share2, Home
} from 'lucide-react';

// ✅ استيراد المكونات المحسّنة v8.0 (إلزامي)
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import DateInputWithToday from '../DateInputWithToday';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';

// ===== تكوين التابات مع الترقيم الموحد XXX-YY =====
const TABS_CONFIG: TabConfig[] = [
  { id: '825-01', number: '825-01', title: 'نظرة عامة', icon: Activity },
  { id: '825-02', number: '825-02', title: 'المهام النشطة', icon: PlayCircle },
  { id: '825-03', number: '825-03', title: 'إسناد مهمة جديدة', icon: Send },
  { id: '825-04', number: '825-04', title: 'المهام المكتملة', icon: CheckCircle },
  { id: '825-05', number: '825-05', title: 'المهام المتأخرة', icon: AlertTriangle },
  { id: '825-06', number: '825-06', title: 'المهام المعلقة', icon: PauseCircle },
  { id: '825-07', number: '825-07', title: 'تفاصيل المهام', icon: FileText },
  { id: '825-08', number: '825-08', title: 'تقارير الأداء', icon: BarChart3 },
  { id: '825-09', number: '825-09', title: 'الموظفين', icon: Users },
  { id: '825-10', number: '825-10', title: 'الإشعارات', icon: Bell },
  { id: '825-11', number: '825-11', title: 'السجل', icon: History },
  { id: '825-12', number: '825-12', title: 'الإعدادات', icon: Settings },
];

// ===== حالات المهام =====
const TASK_STATUSES = [
  { value: 'pending', label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'in-progress', label: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-700' },
  { value: 'paused', label: 'معلقة', color: 'bg-orange-100 text-orange-700' },
  { value: 'completed', label: 'مكتملة', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: 'ملغاة', color: 'bg-red-100 text-red-700' },
  { value: 'overdue', label: 'متأخرة', color: 'bg-red-100 text-red-700' },
];

// ===== أولويات المهام =====
const TASK_PRIORITIES = [
  { value: 'low', label: 'منخفضة', color: 'bg-gray-100 text-gray-700' },
  { value: 'medium', label: 'متوسطة', color: 'bg-blue-100 text-blue-700' },
  { value: 'high', label: 'عالية', color: 'bg-orange-100 text-orange-700' },
  { value: 'urgent', label: 'عاجلة', color: 'bg-red-100 text-red-700' },
];

// ===== بيانات الموظفين =====
const EMPLOYEES_DATA = [
  { id: 'EMP-001', code: '817-00123', name: 'أحمد محمد علي', department: 'المعاملات', activeTasks: 5, performance: 95, available: true },
  { id: 'EMP-002', code: '817-00124', name: 'خالد عبدالله السعيد', department: 'المراجعة', activeTasks: 3, performance: 92, available: true },
  { id: 'EMP-003', code: '817-00125', name: 'محمد سعد القحطاني', department: 'الاعتماد', activeTasks: 4, performance: 97, available: true },
  { id: 'EMP-004', code: '817-00126', name: 'سارة أحمد المطيري', department: 'التوثيق', activeTasks: 6, performance: 90, available: false },
  { id: 'EMP-005', code: '817-00127', name: 'فهد عبدالعزيز العتيبي', department: 'المتابعة', activeTasks: 7, performance: 94, available: true },
];

// ===== بيانات المهام =====
const ASSIGNED_TASKS = [
  {
    id: 'TSK-001',
    taskNumber: 'TSK-2025-001',
    transactionCode: '286-2025-00456',
    transactionTitle: 'رخصة بناء سكني - حي العليا',
    assignedTo: 'أحمد محمد علي',
    employeeCode: '817-00123',
    status: 'in-progress',
    priority: 'high',
    progress: 65,
    dueDate: '2025-10-17',
  },
  {
    id: 'TSK-002',
    taskNumber: 'TSK-2025-002',
    transactionCode: '286-2025-00457',
    transactionTitle: 'رخصة بناء تجاري - حي الملقا',
    assignedTo: 'خالد عبدالله السعيد',
    employeeCode: '817-00124',
    status: 'in-progress',
    priority: 'medium',
    progress: 45,
    dueDate: '2025-10-16',
  },
  {
    id: 'TSK-003',
    taskNumber: 'TSK-2025-003',
    transactionCode: '286-2025-00458',
    transactionTitle: 'رخصة ترميم - حي النرجس',
    assignedTo: 'محمد سعد القحطاني',
    employeeCode: '817-00125',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    dueDate: '2025-10-15',
  },
];

const TransactionTasksAssignment_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('825-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  
  // حالات النموذج - إسناد مهمة جديدة
  const [transactionCode, setTransactionCode] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignedEmployee, setAssignedEmployee] = useState('');
  const [taskPriority, setTaskPriority] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  // حالات الإعدادات
  const [autoNotify, setAutoNotify] = useState(true);
  const [requireConfirmation, setRequireConfirmation] = useState(false);
  const [allowReassign, setAllowReassign] = useState(true);

  // دالة عرض محتوى التاب
  const renderTabContent = () => {
    switch (activeTab) {
      case '825-01':
        return renderOverviewTab();
      case '825-02':
        return renderActiveTasksTab();
      case '825-03':
        return renderAssignNewTaskTab();
      case '825-04':
        return renderCompletedTasksTab();
      case '825-05':
        return renderOverdueTasksTab();
      case '825-12':
        return renderSettingsTab();
      default:
        return renderPlaceholderTab();
    }
  };

  // ✅ تاب نظرة عامة - مع البطاقات المكثفة
  const renderOverviewTab = () => {
    const totalTasks = ASSIGNED_TASKS.length;
    const activeTasks = ASSIGNED_TASKS.filter(t => t.status === 'in-progress').length;
    const completedTasks = ASSIGNED_TASKS.filter(t => t.status === 'completed').length;
    const overdueTasks = 0;
    const pendingTasks = ASSIGNED_TASKS.filter(t => t.status === 'pending').length;

    return (
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700' }}>
              نظرة عامة على المهام
            </h2>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              عرض شامل لجميع مهام المعاملات المسندة
            </p>
          </div>
          <Badge className="bg-blue-100 text-blue-700">
            <code style={{ fontFamily: 'Courier New, monospace' }}>TAB-825-01</code>
          </Badge>
        </div>

        {/* ✅ بطاقات إحصائية مكثفة - 8 أعمدة */}
        <div className="stats-grid-8 gap-2">
          {/* إجمالي المهام */}
          <Card className="card-rtl hover:shadow-md transition-all">
            <CardContent className="dense-card-content-sm">
              <div className="stats-content-compact">
                <div className="stats-text-compact">
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    إجمالي المهام
                  </p>
                  <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    {totalTasks}
                  </p>
                </div>
                <ClipboardList className="stats-icon-compact text-[#2563eb]" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 text-[9px] w-full justify-center mt-1">
                جميع المهام
              </Badge>
            </CardContent>
          </Card>

          {/* المهام النشطة */}
          <Card className="card-rtl hover:shadow-md transition-all">
            <CardContent className="dense-card-content-sm">
              <div className="stats-content-compact">
                <div className="stats-text-compact">
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    المهام النشطة
                  </p>
                  <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    {activeTasks}
                  </p>
                </div>
                <PlayCircle className="stats-icon-compact text-[#10b981]" />
              </div>
              <Badge className="bg-green-100 text-green-700 text-[9px] w-full justify-center mt-1">
                قيد التنفيذ
              </Badge>
            </CardContent>
          </Card>

          {/* المكتملة */}
          <Card className="card-rtl hover:shadow-md transition-all">
            <CardContent className="dense-card-content-sm">
              <div className="stats-content-compact">
                <div className="stats-text-compact">
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    المكتملة
                  </p>
                  <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    {completedTasks}
                  </p>
                </div>
                <CheckCircle className="stats-icon-compact text-[#059669]" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 text-[9px] w-full justify-center mt-1">
                مكتملة
              </Badge>
            </CardContent>
          </Card>

          {/* متأخرة */}
          <Card className="card-rtl hover:shadow-md transition-all">
            <CardContent className="dense-card-content-sm">
              <div className="stats-content-compact">
                <div className="stats-text-compact">
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    متأخرة
                  </p>
                  <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    {overdueTasks}
                  </p>
                </div>
                <AlertTriangle className="stats-icon-compact text-[#ef4444]" />
              </div>
              <Badge className="bg-red-100 text-red-700 text-[9px] w-full justify-center mt-1">
                تحتاج متابعة
              </Badge>
            </CardContent>
          </Card>

          {/* قيد الانتظار */}
          <Card className="card-rtl hover:shadow-md transition-all">
            <CardContent className="dense-card-content-sm">
              <div className="stats-content-compact">
                <div className="stats-text-compact">
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    قيد الانتظار
                  </p>
                  <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    {pendingTasks}
                  </p>
                </div>
                <Clock className="stats-icon-compact text-[#f59e0b]" />
              </div>
              <Badge className="bg-yellow-100 text-yellow-700 text-[9px] w-full justify-center mt-1">
                بانتظار البدء
              </Badge>
            </CardContent>
          </Card>

          {/* الموظفين */}
          <Card className="card-rtl hover:shadow-md transition-all">
            <CardContent className="dense-card-content-sm">
              <div className="stats-content-compact">
                <div className="stats-text-compact">
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    الموظفين
                  </p>
                  <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    {EMPLOYEES_DATA.length}
                  </p>
                </div>
                <Users className="stats-icon-compact text-[#8b5cf6]" />
              </div>
              <Badge className="bg-purple-100 text-purple-700 text-[9px] w-full justify-center mt-1">
                نشط
              </Badge>
            </CardContent>
          </Card>

          {/* معدل الإنجاز */}
          <Card className="card-rtl hover:shadow-md transition-all">
            <CardContent className="dense-card-content-sm">
              <div className="stats-content-compact">
                <div className="stats-text-compact">
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    معدل الإنجاز
                  </p>
                  <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    94%
                  </p>
                </div>
                <TrendingUp className="stats-icon-compact text-[#10b981]" />
              </div>
              <Badge className="bg-green-100 text-green-700 text-[9px] w-full justify-center mt-1">
                ممتاز
              </Badge>
            </CardContent>
          </Card>

          {/* متوسط الوقت */}
          <Card className="card-rtl hover:shadow-md transition-all">
            <CardContent className="dense-card-content-sm">
              <div className="stats-content-compact">
                <div className="stats-text-compact">
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    متوسط الوقت
                  </p>
                  <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    6.5 س
                  </p>
                </div>
                <Clock className="stats-icon-compact text-[#06b6d4]" />
              </div>
              <Badge className="bg-cyan-100 text-cyan-700 text-[9px] w-full justify-center mt-1">
                لكل مهمة
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* جدول المهام الأخيرة */}
        <Card className="card-rtl">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>المهام الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="table-rtl dense-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المهمة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسند إليه</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقدم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ASSIGNED_TASKS.map((task) => {
                  const status = TASK_STATUSES.find(s => s.value === task.status);
                  const priority = TASK_PRIORITIES.find(p => p.value === task.priority);
                  
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <code className="text-xs">{task.taskNumber}</code>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <div className="text-xs">
                          <p className="font-medium">{task.transactionTitle}</p>
                          <p className="text-gray-500 text-[10px]">{task.transactionCode}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <div className="text-xs">
                          <p>{task.assignedTo}</p>
                          <p className="text-gray-500 text-[10px]">{task.employeeCode}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={`${status?.color} text-xs`}>
                          {status?.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <Progress value={task.progress} className="h-2 flex-1" />
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {task.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={`${priority?.color} text-xs`}>
                          {priority?.label}
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
  };

  // ✅ تاب إسناد مهمة جديدة - مع حقول محسّنة
  const renderAssignNewTaskTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700' }}>
          إسناد مهمة جديدة
        </h2>
        <Badge className="bg-green-100 text-green-700">
          <code style={{ fontFamily: 'Courier New, monospace' }}>TAB-825-03</code>
        </Badge>
      </div>

      <Card className="card-rtl">
        <CardContent className="p-4 space-y-4">
          {/* ✅ حقول الإدخال المحسّنة */}
          <InputWithCopy
            label="رقم المعاملة"
            id="transaction-code"
            value={transactionCode}
            onChange={(e) => setTransactionCode(e.target.value)}
            placeholder="286-2025-00XXX"
            required
            copyable={true}
            clearable={true}
          />

          <InputWithCopy
            label="عنوان المهمة"
            id="task-title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="أدخل عنوان المهمة"
            required
            copyable={true}
            clearable={true}
          />

          <TextAreaWithCopy
            label="وصف المهمة"
            id="task-description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="أدخل وصف تفصيلي للمهمة"
            rows={4}
            copyable={true}
            clearable={true}
          />

          <SelectWithCopy
            label="الموظف المسند إليه"
            id="assigned-employee"
            value={assignedEmployee}
            onChange={setAssignedEmployee}
            options={EMPLOYEES_DATA.filter(e => e.available).map(emp => ({
              value: emp.id,
              label: `${emp.name} (${emp.code}) - ${emp.department}`
            }))}
            placeholder="اختر الموظف"
            required
            copyable={true}
            clearable={true}
          />

          <div className="grid grid-cols-2 gap-4">
            <SelectWithCopy
              label="الأولوية"
              id="task-priority"
              value={taskPriority}
              onChange={setTaskPriority}
              options={TASK_PRIORITIES.map(p => ({
                value: p.value,
                label: p.label
              }))}
              placeholder="اختر الأولوية"
              required
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="الحالة الأولية"
              id="task-status"
              value={taskStatus}
              onChange={setTaskStatus}
              options={TASK_STATUSES.map(s => ({
                value: s.value,
                label: s.label
              }))}
              placeholder="اختر الحالة"
              required
              copyable={true}
              clearable={true}
            />
          </div>

          <DateInputWithToday
            label="الموعد النهائي"
            value={dueDate}
            onChange={setDueDate}
          />

          <Separator />

          {/* ✅ مؤشرات التفعيل المحسّنة */}
          <div className="space-y-3">
            <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
              خيارات الإسناد
            </h3>

            <EnhancedSwitch
              id="auto-notify"
              checked={autoNotify}
              onCheckedChange={setAutoNotify}
              label="إرسال إشعار تلقائي للموظف"
              description="سيتم إرسال إشعار فوري عند إسناد المهمة"
              size="md"
              variant="default"
            />

            <EnhancedSwitch
              id="require-confirmation"
              checked={requireConfirmation}
              onCheckedChange={setRequireConfirmation}
              label="طلب تأكيد الاستلام"
              description="يجب على الموظف تأكيد استلام المهمة"
              size="md"
              variant="warning"
            />
          </div>

          <Separator />

          {/* أزرار الإجراءات */}
          <div className="flex items-center gap-2 justify-end">
            <Button variant="outline" className="button-rtl">
              <X className="h-4 w-4 ml-2" />
              إلغاء
            </Button>
            <Button className="button-rtl bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4 ml-2" />
              إسناد المهمة
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // تاب المهام النشطة
  const renderActiveTasksTab = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700' }}>
          المهام النشطة
        </h2>
        <Badge className="bg-green-100 text-green-700">
          <code style={{ fontFamily: 'Courier New, monospace' }}>TAB-825-02</code>
        </Badge>
      </div>
      
      <Card className="card-rtl">
        <CardContent className="p-12 text-center">
          <PlayCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            عرض المهام النشطة قيد التنفيذ
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // تاب المهام المكتملة
  const renderCompletedTasksTab = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700' }}>
          المهام المكتملة
        </h2>
        <Badge className="bg-emerald-100 text-emerald-700">
          <code style={{ fontFamily: 'Courier New, monospace' }}>TAB-825-04</code>
        </Badge>
      </div>
      
      <Card className="card-rtl">
        <CardContent className="p-12 text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            عرض المهام المكتملة
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // تاب المهام المتأخرة
  const renderOverdueTasksTab = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700' }}>
          المهام المتأخرة
        </h2>
        <Badge className="bg-red-100 text-red-700">
          <code style={{ fontFamily: 'Courier New, monospace' }}>TAB-825-05</code>
        </Badge>
      </div>
      
      <Card className="card-rtl">
        <CardContent className="p-12 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            عرض المهام المتأخرة التي تحتاج متابعة
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // ✅ تاب الإعدادات - مع مؤشرات محسّنة
  const renderSettingsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700' }}>
          إعدادات إسناد المهام
        </h2>
        <Badge className="bg-gray-100 text-gray-700">
          <code style={{ fontFamily: 'Courier New, monospace' }}>TAB-825-12</code>
        </Badge>
      </div>

      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات النظام</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ✅ مؤشرات التفعيل المحسّنة */}
          <EnhancedSwitch
            id="settings-auto-notify"
            checked={autoNotify}
            onCheckedChange={setAutoNotify}
            label="الإشعارات التلقائية"
            description="إرسال إشعار تلقائي للموظف عند إسناد مهمة جديدة"
            size="md"
            variant="default"
          />

          <Separator />

          <EnhancedSwitch
            id="settings-require-confirmation"
            checked={requireConfirmation}
            onCheckedChange={setRequireConfirmation}
            label="تأكيد الاستلام"
            description="طلب تأكيد من الموظف عند استلام المهمة"
            size="md"
            variant="warning"
          />

          <Separator />

          <EnhancedSwitch
            id="settings-allow-reassign"
            checked={allowReassign}
            onCheckedChange={setAllowReassign}
            label="السماح بإعادة الإسناد"
            description="السماح للمشرف بإعادة إسناد المهام إلى موظف آخر"
            size="md"
            variant="success"
          />

          <Separator />

          <div className="flex items-center gap-2 justify-end pt-4">
            <Button variant="outline" className="button-rtl">
              <X className="h-4 w-4 ml-2" />
              إلغاء
            </Button>
            <Button className="button-rtl bg-blue-600 hover:bg-blue-700">
              <Settings className="h-4 w-4 ml-2" />
              حفظ الإعدادات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // تاب placeholder للتابات الأخرى
  const renderPlaceholderTab = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;
    
    const Icon = tab.icon;
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700' }}>
            {tab.title}
          </h2>
          <Badge className="bg-gray-100 text-gray-700">
            <code style={{ fontFamily: 'Courier New, monospace' }}>{tab.number}</code>
          </Badge>
        </div>
        
        <Card className="card-rtl">
          <CardContent className="p-12 text-center">
            <Icon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              محتوى {tab.title}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ direction: 'rtl' }}>
      <div className="container mx-auto p-4">
        
        {/* Header الشاشة */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700' }}>
              إسناد مهام المعاملات
            </h1>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              نظام شامل لإدارة وإسناد مهام المعاملات للموظفين
            </p>
          </div>
          <Badge className="bg-blue-100 text-blue-700">
            <code style={{ fontFamily: 'Courier New, monospace' }}>SCR-825</code>
          </Badge>
        </div>

        {/* ✅ التخطيط الرئيسي: السايد بار الموحد + المحتوى */}
        <div className="flex" style={{ gap: '4px' }}>
          
          {/* ✅ السايد بار الموحد v1.1 */}
          <UnifiedTabsSidebar
            tabs={TABS_CONFIG}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* ✅ محتوى الشاشة */}
          <div className="flex-1">
            {renderTabContent()}
          </div>

        </div>
      </div>

      {/* CSS للـ Scrollbar */}
      <style>{`
        .tabs-sidebar-unified::-webkit-scrollbar {
          width: 6px;
          display: block !important;
        }
        
        .tabs-sidebar-unified::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .tabs-sidebar-unified::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
          transition: background 0.2s;
        }
        
        .tabs-sidebar-unified::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default TransactionTasksAssignment_v8;

/**
 * ✅ المعايير المطبقة:
 * ===================
 * 
 * 1. ✅ حقول الإدخال المحسّنة (InputWithCopy)
 *    - جميع الحقول تستخدم InputWithCopy
 *    - copyable={true} و clearable={true}
 *    - خلفية ملونة تلقائياً
 *    - تباعد 45px من سهم القائمة
 * 
 * 2. ✅ مؤشر التفعيل المحسّن (EnhancedSwitch)
 *    - جميع المؤشرات تستخدم EnhancedSwitch
 *    - label و description واضحة
 *    - variant مناسب (default, warning, success)
 *    - Badge الحالة ظاهر
 * 
 * 3. ✅ السايد بار الموحد للتابات
 *    - عرض 200px بالضبط
 *    - ارتفاع calc(100vh - 140px)
 *    - position: sticky مع top: 70px
 *    - scrollbar ظاهر (6px)
 *    - ترقيم XXX-YY
 *    - gap-0.5 بين التابات
 * 
 * 4. ✅ التكثيف
 *    - stats-grid-8 للبطاقات الإحصائية
 *    - dense-card-content-sm
 *    - stats-content-compact
 *    - أيقونات صغيرة
 * 
 * 5. ✅ RTL كامل
 *    - direction: rtl
 *    - خط Tajawal
 *    - محاذاة يمين
 */
