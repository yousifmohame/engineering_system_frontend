/**
 * جميع تابات الشاشة 286 - نسخة مكثفة جداً Ultra Dense
 * =========================================================
 * * التكثيف الفائق v2.0 - جميع التابات:
 * - استغلال 95%+ من المساحة
 * - لا حاجة للتمرير
 * - جداول مكثفة
 * - بطاقات صغيرة جداً
 * - نوافذ منبثقة للتفاصيل
 * - grid layouts متقدمة
 * * --- تحديث v2.1 (TAB 286-05) ---
 * - تاب المهام أصبح ديناميكياً بالكامل.
 * - يستقبل المهام من القالب عبر props.
 * - يتيح إسناد الموظفين عبر قائمة منسدلة.
 * - يتيح إضافة/تعديل/حذف المهام عبر مودال.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'; // <-- إضافة
import { Input } from '../ui/input'; // <-- إضافة
import { Label } from '../ui/label'; // <-- إضافة
import {
  CheckCircle, Users, Paperclip, Calendar as CalendarIcon, DollarSign,
  FileText, Eye, Settings, Plus, Edit2, Trash2, Upload, Download,
  Clock, User, Building, Hash, Flag, Target, Mail, Phone, Loader2
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import { ScrollArea } from '../ui/scroll-area'; // <-- إضافة ScrollArea
import { nanoid } from 'nanoid'; // (أو استخدم crypto.randomUUID)

// ============================================
// واجهات (Interfaces) جديدة للمهام
// ============================================

// واجهة للمهمة (مبسطة)
interface Task {
  id: string; // ID فريد
  name: string;
  duration: number;
  assignedToId: string | null; // ID الموظف المسند إليه
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
}

// واجهة للموظف (مبسطة)
interface Employee {
  id: string;
  name: string;
}

// واجهة لخصائص (Props) التاب
interface TasksTabProps {
  templateTasks: any[]; // المهام القادمة من القالب (JSON)
  employees: Employee[]; // قائمة الموظفين
  onChange: (tasks: Task[]) => void; // دالة لإرجاع المهام المحدثة
}

// واجهة لنموذج المهمة (Add/Edit)
type TaskFormData = Omit<Task, 'id' | 'status' | 'assignedToId'>;


// ============================================
// TAB 286-05: المهمات - (نسخة ديناميكية جديدة v2.1)
// ============================================

// مودال (Dialog) لإضافة/تعديل مهمة
const TaskEditDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: TaskFormData) => void;
  task: TaskFormData | null; // null للإضافة, وبيانات للتعديل
}> = ({ isOpen, onClose, onSave, task }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    duration: 1,
    priority: 'medium',
    ...task,
  });

  useEffect(() => {
    setFormData({
      name: '',
      duration: 1,
      priority: 'medium',
      ...task,
    });
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('الرجاء إدخال اسم المهمة');
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="card-rtl">
        <DialogHeader>
          <DialogTitle>{task ? 'تعديل مهمة' : 'إضافة مهمة جديدة'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="task-name">اسم المهمة</Label>
            <Input
              id="task-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="task-duration">المدة (أيام)</Label>
              <Input
                id="task-duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <Label htmlFor="task-priority">الأولوية</Label>
              <Select
                value={formData.priority}
                onValueChange={(val: Task['priority']) => setFormData({ ...formData, priority: val })}
              >
                <SelectTrigger id="task-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">منخفضة</SelectItem>
                  <SelectItem value="medium">متوسطة</SelectItem>
                  <SelectItem value="high">عالية</SelectItem>
                  <SelectItem value="urgent">عاجلة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
            <Button type="submit">حفظ</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const Tab_286_05_Tasks_UltraDense: React.FC<TasksTabProps> = ({
  templateTasks,
  employees,
  onChange
}) => {
  // الحالة الداخلية للمهام
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // حالات المودال
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // 1. مزامنة المهام عند تغيير القالب
  useEffect(() => {
    const newTasks: Task[] = (templateTasks || []).map((t: any) => ({
      id: nanoid(10), // ID فريد للمهمة
      name: t.name || 'مهمة بدون اسم',
      duration: t.duration || 1,
      assignedToId: null, // يبدأ غير مسند
      priority: t.priority || 'medium',
      status: 'pending', // يبدأ معلق
    }));
    setTasks(newTasks);
  }, [templateTasks]);

  // 2. إبلاغ الشاشة الرئيسية عند أي تغيير في المهام
  useEffect(() => {
    if(onChange) {
      onChange(tasks);
    }
  }, [tasks, onChange]);

  // 3. دوال الألوان (كما هي)
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#6b7280';
      case 'medium': return '#3b82f6';
      case 'high': return '#f59e0b';
      case 'urgent': return '#ef4444';
      default: return '#6b7280';
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#3b82f6';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // 4. دوال معالجة المهام (Handlers)
  const handleAssignTask = (taskId: string, employeeId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, assignedToId: employeeId } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleOpenAddTask = () => {
    setEditingTask(null);
    setIsTaskDialogOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleSaveTask = (taskData: TaskFormData) => {
    if (editingTask) {
      // تعديل
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === editingTask.id ? { ...task, ...taskData } : task
        )
      );
    } else {
      // إضافة
      const newTask: Task = {
        ...taskData,
        id: nanoid(10),
        assignedToId: null,
        status: 'pending',
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
    }
    setIsTaskDialogOpen(false);
    setEditingTask(null);
  };

  // 5. حساب الإحصائيات (أصبح ديناميكياً)
  const stats = [
    { label: 'إجمالي المهام', value: tasks.length, color: '#3b82f6' },
    { label: 'مكتملة', value: tasks.filter(t => t.status === 'completed').length, color: '#10b981' },
    { label: 'مسندة', value: tasks.filter(t => !!t.assignedToId).length, color: '#f59e0b' },
    { label: 'قيد الانتظار', value: tasks.filter(t => t.status === 'pending').length, color: '#6b7280' },
    { label: 'المدة الكلية', value: `${tasks.reduce((sum, t) => sum + t.duration, 0)} يوم`, color: '#8b5cf6' },
    { label: 'عاجلة', value: tasks.filter(t => t.priority === 'urgent').length, color: '#ef4444' }
  ];

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: 'calc(100vh - 180px)' }}>
      <CodeDisplay code="TAB-286-05-DYN" position="top-right" />
      
      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-6 gap-1 mb-2">
        {stats.map((stat, index) => (
          <Card key={index} style={{ border: `1px solid ${stat.color}40` }}>
            <CardContent className="p-1 text-center">
              <p className="text-[9px] text-gray-500">{stat.label}</p>
              <p className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* جدول المهمات المكثف */}
      <Card style={{ height: 'calc(100% - 70px)' }}>
        <CardContent className="p-2 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <h3 className="text-sm font-bold">قائمة المهمات التفصيلية</h3>
            <Button size="sm" style={{ height: '24px', padding: '0 8px', fontSize: '11px' }} onClick={handleOpenAddTask}>
              <Plus className="h-3 w-3 ml-1" />
              مهمة جديدة
            </Button>
          </div>
          
          <ScrollArea className="flex-grow">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow style={{ height: '28px' }}>
                  <TableHead className="text-right text-[10px] py-1">اسم المهمة</TableHead>
                  <TableHead className="text-right text-[10px] py-1" style={{ width: '70px' }}>المدة</TableHead>
                  <TableHead className="text-right text-[10px] py-1" style={{ width: '150px' }}>المسؤول</TableHead>
                  <TableHead className="text-right text-[10px] py-1" style={{ width: '80px' }}>الأولوية</TableHead>
                  <TableHead className="text-right text-[10px] py-1" style={{ width: '90px' }}>الحالة</TableHead>
                  <TableHead className="text-right text-[10px] py-1" style={{ width: '80px' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task, index) => (
                  <TableRow key={task.id} style={{ height: '32px' }}>
                    <TableCell className="text-right text-[10px] py-1">
                      {task.name}
                    </TableCell>
                    <TableCell className="text-right text-[10px] py-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" style={{ color: '#64748b' }} />
                        {task.duration} يوم
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[10px] py-1">
                      {/* --- ✅ قائمة منسدلة لإسناد الموظفين --- */}
                      <Select
                        value={task.assignedToId || ''}
                        onValueChange={(val) => handleAssignTask(task.id, val)}
                      >
                        <SelectTrigger className="h-6 text-[10px] p-1">
                          <SelectValue placeholder="اختر موظف..." />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id} className="text-[10px]">
                              {emp.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right py-1">
                      <Badge style={{
                        background: getPriorityColor(task.priority),
                        color: '#ffffff',
                        fontSize: '9px',
                        padding: '2px 6px',
                        height: '18px'
                      }}>
                        {task.priority === 'urgent' ? 'عاجلة' : 
                         task.priority === 'high' ? 'عالية' :
                         task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-1">
                      {/* (يمكن جعل الحالة قابلة للتعديل بنفس طريقة الإسناد) */}
                      <Badge style={{
                        background: getStatusColor(task.status),
                        color: '#ffffff',
                        fontSize: '9px',
                        padding: '2px 6px',
                        height: '18px'
                      }}>
                        {task.status === 'completed' ? 'مكتملة' :
                         task.status === 'in-progress' ? 'جارية' : 'معلقة'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-1">
                      <div className="flex gap-0.5">
                        <Button size="sm" variant="ghost" style={{ height: '22px', width: '22px', padding: 0 }} onClick={() => handleOpenEditTask(task)}>
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" style={{ height: '22px', width: '22px', padding: 0 }} onClick={() => handleDeleteTask(task.id)}>
                          <Trash2 className="h-3 w-3" style={{ color: '#ef4444' }} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* --- ✅ مودال إضافة/تعديل المهام --- */}
      <TaskEditDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        onSave={handleSaveTask}
        task={editingTask ? { name: editingTask.name, duration: editingTask.duration, priority: editingTask.priority } : null}
      />
    </div>
  );
};

// ============================================
// TAB 286-06: إسناد الموظفين - مكثف جداً
// ============================================
export const Tab_286_06_StaffAssignment_UltraDense: React.FC = () => {
  // ( ... الكود الخاص بهذا التاب يبقى كما هو ... )
  const teamMembers = [
    { id: '1', name: 'المهندس أحمد العلي', role: 'مدير المشروع', email: 'ahmed@office.sa', phone: '0501234567', tasks: 5, hours: 120 },
    { id: '2', name: 'المهندسة فاطمة محمد', role: 'مهندس معماري', email: 'fatima@office.sa', phone: '0507654321', tasks: 3, hours: 90 },
    { id: '3', name: 'المهندس خالد السعيد', role: 'مهندس إنشائي', email: 'khaled@office.sa', phone: '0509876543', tasks: 2, hours: 60 },
    { id: '4', name: 'المهندسة نورة الحسن', role: 'مهندس MEP', email: 'noura@office.sa', phone: '0503456789', tasks: 4, hours: 100 },
    { id: '5', name: 'المساح علي أحمد', role: 'مساح', email: 'ali@office.sa', phone: '0508765432', tasks: 2, hours: 40 },
    { id: '6', name: 'المحامي عبدالله محمد', role: 'محامي', email: 'abdullah@office.sa', phone: '0502345678', tasks: 1, hours: 20 }
  ];

  const stats = [
    { label: 'عدد الفريق', value: teamMembers.length, color: '#3b82f6' },
    { label: 'إجمالي المهام', value: teamMembers.reduce((sum, m) => sum + m.tasks, 0), color: '#10b981' },
    { label: 'إجمالي الساعات', value: teamMembers.reduce((sum, m) => sum + m.hours, 0), color: '#f59e0b' },
    { label: 'متوسط المهام', value: (teamMembers.reduce((sum, m) => sum + m.tasks, 0) / teamMembers.length).toFixed(1), color: '#8b5cf6' }
  ];

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: 'calc(100vh - 180px)' }}>
      <CodeDisplay code="TAB-286-06-DENSE" position="top-right" />
      
      <div className="grid grid-cols-4 gap-1 mb-2">
        {stats.map((stat, index) => (
          <Card key={index} style={{ border: `1px solid ${stat.color}40` }}>
            <CardContent className="p-1 text-center">
              <p className="text-[9px] text-gray-500">{stat.label}</p>
              <p className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card style={{ height: 'calc(100% - 70px)' }}>
        <CardContent className="p-2 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <h3 className="text-sm font-bold">فريق العمل</h3>
            <Button size="sm" style={{ height: '24px', padding: '0 8px', fontSize: '11px' }}>
              <Plus className="h-3 w-3 ml-1" />
              إضافة موظف
            </Button>
          </div>
          
          <ScrollArea className="flex-grow">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow style={{ height: '28px' }}>
                  <TableHead className="text-right text-[10px] py-1">الاسم</TableHead>
                  <TableHead className="text-right text-[10px] py-1">الدور</TableHead>
                  <TableHead className="text-right text-[10px] py-1">البريد</TableHead>
                  <TableHead className="text-right text-[10px] py-1">الجوال</TableHead>
                  <TableHead className="text-right text-[10px] py-1">المهام</TableHead>
                  <TableHead className="text-right text-[10px] py-1">الساعات</TableHead>
                  <TableHead className="text-right text-[10px] py-1">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id} style={{ height: '32px' }}>
                    <TableCell className="text-right text-[10px] py-1 font-semibold">{member.name}</TableCell>
                    <TableCell className="text-right text-[10px] py-1">{member.role}</TableCell>
                    <TableCell className="text-right text-[10px] py-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" style={{ color: '#64748b' }} />
                        {member.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[10px] py-1">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" style={{ color: '#64748b' }} />
                        {member.phone}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-1">
                      <Badge style={{ fontSize: '9px', padding: '2px 6px' }}>{member.tasks}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-[10px] py-1">{member.hours}ساعة</TableCell>
                    <TableCell className="text-right py-1">
                      <div className="flex gap-0.5">
                        <Button size="sm" variant="ghost" style={{ height: '22px', width: '22px', padding: 0 }}>
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" style={{ height: '22px', width: '22px', padding: 0 }}>
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};


// ============================================
// TAB 286-08: المرفقات - مكثف جداً
// ============================================
export const Tab_286_08_Attachments_UltraDense: React.FC = () => {
  // ( ... الكود الخاص بهذا التاب يبقى كما هو ... )
  const attachments = [
    { id: '1', name: 'صورة الصك.pdf', type: 'PDF', size: '2.3 MB', date: '2025-10-26', category: 'مستندات', status: 'مراجع' },
    { id: '2', name: 'خريطة الموقع.jpg', type: 'صورة', size: '1.8 MB', date: '2025-10-26', category: 'خرائط', status: 'معتمد' },
    { id: '3', name: 'الهوية الpdf', type: 'PDF', size: '850 KB', date: '2025-10-25', category: 'هويات', status: 'معتمد' },
    { id: '4', name: 'المخططات.dwg', type: 'CAD', size: '5.2 MB', date: '2025-10-24', category: 'مخططات', status: 'قيد المراجعة' },
    { id: '5', name: 'التقرير الجيوتقني.pdf', type: 'PDF', size: '3.1 MB', date: '2025-10-23', category: 'تقارير', status: 'معتمد' },
    { id: '6', name: 'موافقة البلدية.pdf', type: 'PDF', size: '1.2 MB', date: '2025-10-22', category: 'موافقات', status: 'معتمد' }
  ];

  const stats = [
    { label: 'إجمالي الملفات', value: attachments.length, color: '#3b82f6' },
    { label: 'معتمدة', value: attachments.filter(a => a.status === 'معتمد').length, color: '#10b981' },
    { label: 'قيد المراجعة', value: attachments.filter(a => a.status === 'قيد المراجعة').length, color: '#f59e0b' },
    { label: 'الحجم الكلي', value: '14.6 MB', color: '#8b5cf6' }
  ];

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: 'calc(100vh - 180px)' }}>
      <CodeDisplay code="TAB-286-08-DENSE" position="top-right" />
      
      <div className="grid grid-cols-4 gap-1 mb-2">
        {stats.map((stat, index) => (
          <Card key={index} style={{ border: `1px solid ${stat.color}40` }}>
            <CardContent className="p-1 text-center">
              <p className="text-[9px] text-gray-500">{stat.label}</p>
              <p className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card style={{ height: 'calc(100% - 70px)' }}>
        <CardContent className="p-2 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <h3 className="text-sm font-bold">المرفقات والمستندات</h3>
            <Button size="sm" style={{ height: '24px', padding: '0 8px', fontSize: '11px' }}>
              <Upload className="h-3 w-3 ml-1" />
              رفع ملف
            </Button>
          </div>
          
          <ScrollArea className="flex-grow">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow style={{ height: '28px' }}>
                  <TableHead className="text-right text-[10px] py-1">اسم الملف</TableHead>
                  <TableHead className="text-right text-[10px] py-1">النوع</TableHead>
                  <TableHead className="text-right text-[10px] py-1">التصنيف</TableHead>
                  <TableHead className="text-right text-[10px] py-1">الحجم</TableHead>
                  <TableHead className="text-right text-[10px] py-1">التاريخ</TableHead>
                  <TableHead className="text-right text-[10px] py-1">الحالة</TableHead>
                  <TableHead className="text-right text-[10px] py-1">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attachments.map((file) => (
                  <TableRow key={file.id} style={{ height: '32px' }}>
                    <TableCell className="text-right text-[10px] py-1 font-semibold">
                      <div className="flex items-center gap-1">
                        <Paperclip className="h-3 w-3" style={{ color: '#64748b' }} />
                        {file.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-1">
                      <Badge variant="outline" style={{ fontSize: '9px', padding: '2px 6px' }}>{file.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-[10px] py-1">{file.category}</TableCell>
                    <TableCell className="text-right text-[10px] py-1">{file.size}</TableCell>
                    <TableCell className="text-right text-[10px] py-1">{file.date}</TableCell>
                    <TableCell className="text-right py-1">
                      <Badge style={{
                        background: file.status === 'معتمد' ? '#10b981' : file.status === 'قيد المراجعة' ? '#f59e0b' : '#6b7280',
                        color: '#ffffff',
                        fontSize: '9px',
                        padding: '2px 6px'
                      }}>
                        {file.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-1">
                      <div className="flex gap-0.5">
                        <Button size="sm" variant="ghost" style={{ height: '22px', width: '22px', padding: 0 }}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" style={{ height: '22px', width: '22px', padding: 0 }}>
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" style={{ height: '22px', width: '22px', padding: 0 }}>
                          <Trash2 className="h-3 w-3" style={{ color: '#ef4444' }} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// TAB 286-10: التكاليف - مكثف جداً مع تفاصيل شاملة
// ============================================
export const Tab_286_10_Costs_UltraDense: React.FC = () => {
  // ( ... الكود الخاص بهذا التاب يبقى كما هو ... )
  const costBreakdown = [
    { category: 'رسوم الجهات الحكومية', items: [
      { name: 'رسوم البلدية', amount: 5000, paid: 5000, remaining: 0, status: 'مدفوع' },
      { name: 'رسوم الدفاع المدني', amount: 2000, paid: 0, remaining: 2000, status: 'معلق' },
      { name: 'رسوم الترخيص', amount: 3000, paid: 3000, remaining: 0, status: 'مدفوع' }
    ]},
    { category: 'أتعاب المكتب', items: [
      { name: 'أتعاب التصميم', amount: 15000, paid: 10000, remaining: 5000, status: 'جزئي' },
      { name: 'أتعاب الإشراف', amount: 25000, paid: 0, remaining: 25000, status: 'معلق' },
      { name: 'أتعاب الاستشارات', amount: 5000, paid: 5000, remaining: 0, status: 'مدفوع' }
    ]},
    { category: 'مصاريف إضافية', items: [
      { name: 'مصاريف السفر', amount: 2000, paid: 1500, remaining: 500, status: 'جزئي' },
      { name: 'مصاريف الطباعة', amount: 500, paid: 500, remaining: 0, status: 'مدفوع' },
      { name: 'مصاريف متنوعة', amount: 1000, paid: 0, remaining: 1000, status: 'معلق' }
    ]}
  ];

  const totalAmount = costBreakdown.reduce((sum, cat) => 
    sum + cat.items.reduce((s, item) => s + item.amount, 0), 0);
  const totalPaid = costBreakdown.reduce((sum, cat) => 
    sum + cat.items.reduce((s, item) => s + item.paid, 0), 0);
  const totalRemaining = totalAmount - totalPaid;
  const paidPercentage = ((totalPaid / totalAmount) * 100).toFixed(1);

  const stats = [
    { label: 'الإجمالي', value: `${totalAmount.toLocaleString()} ر.س`, color: '#3b82f6' },
    { label: 'المدفوع', value: `${totalPaid.toLocaleString()} ر.س`, color: '#10b981' },
    { label: 'المتبقي', value: `${totalRemaining.toLocaleString()} ر.س`, color: '#ef4444' },
    { label: 'نسبة السداد', value: `${paidPercentage}%`, color: '#f59e0b' },
    { label: 'عدد البنود', value: costBreakdown.reduce((sum, cat) => sum + cat.items.length, 0), color: '#8b5cf6' }
  ];

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: 'calc(100vh - 180px)' }}>
      <CodeDisplay code="TAB-286-10-DENSE" position="top-right" />
      
      <div className="grid grid-cols-5 gap-1 mb-2">
        {stats.map((stat, index) => (
          <Card key={index} style={{ border: `1px solid ${stat.color}40` }}>
            <CardContent className="p-1 text-center">
              <p className="text-[9px] text-gray-500">{stat.label}</p>
              <p className="text-xs font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card style={{ height: 'calc(100% - 70px)' }}>
        <CardContent className="p-2 h-full flex flex-col">
          <Tabs defaultValue="cat-0" className="w-full flex flex-col flex-grow">
            <TabsList className="grid w-full grid-cols-3 mb-2 flex-shrink-0" style={{ height: '28px' }}>
              {costBreakdown.map((cat, index) => (
                <TabsTrigger key={index} value={`cat-${index}`} style={{ fontSize: '10px', padding: '4px 8px' }}>
                  {cat.category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <ScrollArea className="flex-grow">
              {costBreakdown.map((cat, catIndex) => (
                <TabsContent key={catIndex} value={`cat-${catIndex}`} className="mt-0">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow style={{ height: '28px' }}>
                        <TableHead className="text-right text-[10px] py-1">البند</TableHead>
                        <TableHead className="text-right text-[10px] py-1">المبلغ الكلي</TableHead>
                        <TableHead className="text-right text-[10px] py-1">المدفوع</TableHead>
                        <TableHead className="text-right text-[10px] py-1">المتبقي</TableHead>
                        <TableHead className="text-right text-[10px] py-1">النسبة</TableHead>
                        <TableHead className="text-right text-[10px] py-1">الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cat.items.map((item, index) => (
                        <TableRow key={index} style={{ height: '32px' }}>
                          <TableCell className="text-right text-[10px] py-1 font-semibold">{item.name}</TableCell>
                          <TableCell className="text-right text-[10px] py-1">{item.amount.toLocaleString()} ر.س</TableCell>
                          <TableCell className="text-right text-[10px] py-1" style={{ color: '#10b981' }}>
                            {item.paid.toLocaleString()} ر.س
                          </TableCell>
                          <TableCell className="text-right text-[10px] py-1" style={{ color: '#ef4444' }}>
                            {item.remaining.toLocaleString()} ر.س
                          </TableCell>
                          <TableCell className="text-right text-[10px] py-1">
                            {item.amount > 0 ? ((item.paid / item.amount) * 100).toFixed(0) : 0}%
                          </TableCell>
                          <TableCell className="text-right py-1">
                            <Badge style={{
                              background: item.status === 'مدفوع' ? '#10b981' : 
                                          item.status === 'جزئي' ? '#f59e0b' : '#6b7280',
                              color: '#ffffff',
                              fontSize: '9px',
                              padding: '2px 6px'
                            }}>
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow style={{ height: '32px', background: '#f8fafc' }}>
                        <TableCell className="text-right text-[10px] py-1 font-bold">المجموع الفرعي</TableCell>
                        <TableCell className="text-right text-[10px] py-1 font-bold">
                          {cat.items.reduce((s, i) => s + i.amount, 0).toLocaleString()} ر.س
                        </TableCell>
                        <TableCell className="text-right text-[10px] py-1 font-bold" style={{ color: '#10b981' }}>
                          {cat.items.reduce((s, i) => s + i.paid, 0).toLocaleString()} ر.س
                        </TableCell>
                        <TableCell className="text-right text-[10px] py-1 font-bold" style={{ color: '#ef4444' }}>
                          {cat.items.reduce((s, i) => s + i.remaining, 0).toLocaleString()} ر.س
                        </TableCell>
                        <TableCell className="text-right text-[10px] py-1 font-bold">
                          {
                            (() => {
                              const total = cat.items.reduce((s, i) => s + i.amount, 0);
                              const paid = cat.items.reduce((s, i) => s + i.paid, 0);
                              return total > 0 ? ((paid / total) * 100).toFixed(1) : 0;
                            })()
                          }%
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
              ))}
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// --- ملاحظة ---
// الـ export سيبقى كما هو ليناسب طريقة الاستيراد في الشاشة الرئيسية
export default {
  Tab_286_05_Tasks_UltraDense,
  Tab_286_06_StaffAssignment_UltraDense,
  Tab_286_08_Attachments_UltraDense,
  Tab_286_10_Costs_UltraDense
};