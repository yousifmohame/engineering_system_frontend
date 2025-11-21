import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
} from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  CheckCircle, Users, Paperclip, Calendar as CalendarIcon, DollarSign,
  FileText, Eye, Settings, Plus, Edit2, Trash2, Upload, Download,
  Clock, User, Building, Hash, Flag, Target, Mail, Phone, Loader2,
  FileCheck, Save,
  AlertCircle
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import { ScrollArea } from '../ui/scroll-area';
import { nanoid } from 'nanoid';
import { AssignedStaff } from '@/types/employeeTypes';
import { Attachment } from '../../types/attachmentTypes';
import { 
  getAttachments, 
  uploadAttachment, 
  deleteAttachment 
} from '../../api/attachmentApi';
import { Skeleton } from '../ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { getTransactionById, updateTransactionCosts, updateTransactionStaff, updateTransactionTasks } from '../../api/transactionApi';
import { toast } from 'sonner';

// ... (الواجهات Interfaces تبقى كما هي) ...
export interface CostItem {
  id: string;
  name: string;
  amount: number;
  paid: number;
  remaining: number;
  status: 'pending' | 'partial' | 'paid';
}

export interface CostCategory {
  id: string;
  category: string;
  items: CostItem[];
}

interface Task {
  id: string;
  name: string;
  duration: number;
  assignedToId: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AssignedStaffItem {
  id: string; // local unique id for list rendering
  employeeId: string;
  role: string;
}

interface StaffTabProps {
  transactionId: string;
  employees: Employee[];
  tasks: any[]; // Used for stats calculation
  onChange?: (staff: any[]) => void;
}

interface TasksTabProps {
  transactionId: string;
  templateTasks: any[];
  employees: Employee[];
  onChange: (tasks: Task[]) => void;
}

type TaskFormData = Omit<Task, 'id' | 'status' | 'assignedToId'>;


interface AttachmentsTabProps {
  transactionId: string;
  requiredDocuments: string[];
}

interface CostsTabProps {
  transactionId: string;
}

// --- (نفس مكون TaskEditDialog السابق) ---
const TaskEditDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: TaskFormData) => void; // يتوقع دالة تستلم بيانات المهمة
  task: TaskFormData | null;
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
    // هنا كان الخطأ: تم استدعاء هذا، ولكنك كنت تمرر كائناً بدلاً من دالة
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

// ============================================
// TAB 286-05: المهمات
// ============================================
export const Tab_286_05_Tasks_UltraDense: React.FC<TasksTabProps> = ({
  transactionId,
  templateTasks,
  employees,
  onChange
}) => {
  const queryClient = useQueryClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSaved, setIsSaved] = useState(true);

  // ... (كود useQuery و useEffect كما هو) ...
  const { data: transaction } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransactionById(transactionId),
    enabled: !!transactionId && transactionId !== 'new'
  });

  useEffect(() => {
    if (transaction?.tasks && transaction.tasks.length > 0) {
      const dbTasks = transaction.tasks.map((t: any) => ({
        id: t.id,
        name: t.title,
        duration: 1,
        assignedToId: t.assignedToId,
        priority: (t.priority?.toLowerCase() || 'medium') as any,
        status: (t.status?.toLowerCase() === 'in progress' ? 'in-progress' : t.status?.toLowerCase()) as any || 'pending',
      }));
      setTasks(dbTasks);
    } else if (templateTasks && templateTasks.length > 0 && tasks.length === 0) {
      const newTasks = templateTasks.map((t: any) => ({
        id: nanoid(10),
        name: t.name || 'مهمة',
        duration: t.duration || 1,
        assignedToId: null,
        priority: t.priority || 'medium',
        status: 'pending',
      }));
      setTasks(newTasks);
    }
  }, [transaction, templateTasks]);

  useEffect(() => {
    if(onChange) {
      onChange(tasks);
    }
  }, [tasks, onChange]);

  // هذا Mutation للحفظ في السيرفر (الكل)
  const saveMutation = useMutation({
    mutationFn: (currentTasks: Task[]) => updateTransactionTasks(transactionId, currentTasks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] });
      toast.success('تم حفظ المهام في قاعدة البيانات');
      setIsSaved(true);
    },
    onError: () => toast.error('فشل حفظ المهام')
  });

  // دالة لحفظ المعاملة بالكامل عند الضغط على زر الحفظ العلوي
  const handleManualSave = () => {
    if (transactionId === 'new') {
      toast.warning('يجب حفظ المعاملة أولاً قبل حفظ المهام');
      return;
    }
    saveMutation.mutate(tasks);
  };

  // ✅✅✅ التصحيح هنا: دالة للتعامل مع مخرجات الـ Dialog
  const handleDialogSave = (taskData: TaskFormData) => {
    let updatedTasks: Task[];

    if (editingTask) {
      // تعديل مهمة موجودة
      updatedTasks = tasks.map(t => 
        t.id === editingTask.id 
          ? { ...t, ...taskData } 
          : t
      );
    } else {
      // إضافة مهمة جديدة
      const newTask: Task = {
        id: nanoid(),
        ...taskData,
        status: 'pending',
        assignedToId: null
      };
      updatedTasks = [...tasks, newTask];
    }

    setTasks(updatedTasks);
    setIsSaved(false); // تفعيل زر الحفظ الرئيسي
    setIsTaskDialogOpen(false); // إغلاق النافذة
    setEditingTask(null);
  };

  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    setIsSaved(false);
    onChange(newTasks);
  };

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

  const handleAssignTask = (taskId: string, employeeId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, assignedToId: employeeId } : task
      )
    );
    setIsSaved(false);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذه المهمة نهائياً؟")) return;
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    setIsSaved(false);
    toast.info("تمت إزالة المهمة. اضغط 'حفظ التغييرات' لتأكيد الحذف.");
  };

  const handleOpenEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

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

      <Card style={{ height: 'calc(100% - 70px)' }}>
        <CardContent className="p-2 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <h3 className="text-sm font-bold">قائمة المهمات</h3>
            <div className="flex gap-2">
              <Button size="sm" style={{ height: '24px', fontSize: '11px' }} onClick={() => { setEditingTask(null); setIsTaskDialogOpen(true); }}><Plus className="h-3 w-3 ml-1" /> مهمة جديدة</Button>
              <Button size="sm" variant={isSaved ? "outline" : "default"} className={!isSaved ? "bg-green-600 hover:bg-green-700 text-white" : ""} style={{ height: '24px', fontSize: '11px' }} onClick={handleManualSave} disabled={saveMutation.isPending}>
                 {saveMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin ml-1"/> : <Save className="h-3 w-3 ml-1" />} 
                 {isSaved ? 'تم الحفظ' : 'حفظ التغييرات'}
              </Button>
            </div>
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
                    <TableCell className="text-right text-[10px] py-1">{task.name}</TableCell>
                    <TableCell className="text-right text-[10px] py-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" style={{ color: '#64748b' }} />
                        {task.duration} يوم
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[10px] py-1">
                      <Select
                        value={task.assignedToId || ''}
                        onValueChange={(val) => handleAssignTask(task.id, val)}
                      >
                        <SelectTrigger className="h-6 text-[10px] p-1">
                          <SelectValue placeholder="اختر موظف..." />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((emp: any) => (
                            <SelectItem key={emp.id} value={emp.id} className="text-[10px]">
                              {emp.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right py-1">
                      <Badge style={{ background: getPriorityColor(task.priority), color: '#fff', fontSize: '9px', padding: '2px 6px' }}>
                        {task.priority === 'urgent' ? 'عاجلة' : task.priority === 'high' ? 'عالية' : task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-1">
                      <Badge style={{ background: getStatusColor(task.status), color: '#fff', fontSize: '9px', padding: '2px 6px' }}>
                        {task.status === 'completed' ? 'مكتملة' : task.status === 'in-progress' ? 'جارية' : 'معلقة'}
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

      {/* ✅ تمرير الدالة الصحيحة هنا */}
      <TaskEditDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        onSave={handleDialogSave} 
        task={editingTask ? { name: editingTask.name, duration: editingTask.duration, priority: editingTask.priority } : null}
      />
    </div>
  );
};

// ============================================
// --- مودال إضافة موظف ---
// ============================================


const StaffAddEditDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeId: string, role: string) => void;
  employees: Employee[];
  existingEmployeeIds: string[];
  editingItem: AssignedStaffItem | null;
}> = ({ isOpen, onClose, onSave, employees, existingEmployeeIds, editingItem }) => {
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [assignedRole, setAssignedRole] = useState<string>('');

  // Reset form when dialog opens or item changes
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setSelectedEmployeeId(editingItem.employeeId);
        setAssignedRole(editingItem.role);
      } else {
        setSelectedEmployeeId('');
        setAssignedRole('');
      }
    }
  }, [isOpen, editingItem]);

  const availableEmployees = useMemo(() => {
    // In edit mode, include the current employee so it shows in select
    // In add mode, exclude already assigned employees
    return employees.filter(emp => 
      (editingItem && emp.id === editingItem.employeeId) || 
      !existingEmployeeIds.includes(emp.id)
    );
  }, [employees, existingEmployeeIds, editingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      toast.error('الرجاء اختيار موظف');
      return;
    }
    if (!assignedRole) {
      toast.error('الرجاء إدخال دور الموظف');
      return;
    }
    onSave(selectedEmployeeId, assignedRole);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="card-rtl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'تعديل بيانات الموظف' : 'إضافة موظف إلى المعاملة'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="staff-select">الموظف</Label>
            <Select
              value={selectedEmployeeId}
              onValueChange={setSelectedEmployeeId}
              disabled={!!editingItem} // Disable changing employee in edit mode (usually better to delete and re-add)
            >
              <SelectTrigger id="staff-select">
                <SelectValue placeholder="اختر موظف..." />
              </SelectTrigger>
              <SelectContent>
                {availableEmployees.length > 0 ? (
                  availableEmployees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-xs text-gray-500">لا يوجد موظفين متاحين</div>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="staff-role">الدور في المعاملة</Label>
            <Input
              id="staff-role"
              value={assignedRole}
              onChange={(e) => setAssignedRole(e.target.value)}
              placeholder="مثال: مهندس معماري، مشرف..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
            <Button type="submit">{editingItem ? 'حفظ التعديلات' : 'إضافة'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ============================================
// TAB 286-06: إسناد الموظفين (المصحح)
// ============================================
export const Tab_286_06_StaffAssignment_UltraDense: React.FC<StaffTabProps> = ({
  transactionId,
  employees = [],
  tasks = [],
  onChange
}) => {
  const queryClient = useQueryClient();
  const [staffList, setStaffList] = useState<AssignedStaffItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AssignedStaffItem | null>(null);
  const [isSaved, setIsSaved] = useState(true);

  // 1. Fetch Transaction Data
  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransactionById(transactionId),
    enabled: !!transactionId && transactionId !== 'new'
  });

  // 2. Sync Backend Data to Local State
  useEffect(() => {
    if (transaction?.transactionEmployees) {
      const mappedStaff = transaction.transactionEmployees.map((te: any) => ({
        id: te.id || nanoid(),
        employeeId: te.employeeId,
        role: te.role
      }));
      setStaffList(mappedStaff);
      setIsSaved(true);
    }
  }, [transaction]);

  // Notify parent component if needed
  useEffect(() => {
    if (onChange) onChange(staffList);
  }, [staffList, onChange]);

  // 3. Save Mutation
  const saveMutation = useMutation({
    mutationFn: (currentStaff: AssignedStaffItem[]) => 
      updateTransactionStaff(transactionId, currentStaff.map(s => ({ 
        employeeId: s.employeeId, 
        role: s.role 
      }))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] });
      toast.success('تم حفظ فريق العمل بنجاح');
      setIsSaved(true);
    },
    onError: (error) => {
      toast.error('حدث خطأ أثناء الحفظ');
      console.error(error);
    }
  });

  // 4. Handlers
  const handleManualSave = () => {
    if (transactionId === 'new') {
      toast.warning('يرجى حفظ المعاملة أولاً');
      return;
    }
    saveMutation.mutate(staffList);
  };

  const handleDialogSave = (employeeId: string, role: string) => {
    if (editingItem) {
      // Edit Mode
      setStaffList(prev => prev.map(item => 
        item.id === editingItem.id ? { ...item, role } : item
      ));
    } else {
      // Add Mode
      const newItem: AssignedStaffItem = {
        id: nanoid(),
        employeeId,
        role
      };
      setStaffList(prev => [...prev, newItem]);
    }
    
    setIsSaved(false);
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من إزالة هذا الموظف من الفريق؟')) {
      setStaffList(prev => prev.filter(item => item.id !== id));
      setIsSaved(false);
    }
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: AssignedStaffItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  // 5. Stats Calculation
  const stats = useMemo(() => {
    const totalMembers = staffList.length;
    const assignedTaskCount = tasks.filter(t => t.assignedToId && staffList.some(s => s.employeeId === t.assignedToId)).length;
    // Example logic: Assume 8 hours per day for task duration
    const totalHours = tasks
      .filter(t => t.assignedToId && staffList.some(s => s.employeeId === t.assignedToId))
      .reduce((sum, t) => sum + (t.duration * 8), 0);

    return [
      { label: 'عدد الفريق', value: totalMembers, color: '#3b82f6' },
      { label: 'مهام مسندة', value: assignedTaskCount, color: '#10b981' },
      { label: 'ساعات العمل', value: `${totalHours} س`, color: '#f59e0b' },
      { label: 'متاح للإضافة', value: Math.max(0, employees.length - totalMembers), color: '#8b5cf6' }
    ];
  }, [staffList, tasks, employees]);

  // 6. Render Loading State
  if (isLoading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;
  }

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: 'calc(100vh - 180px)' }}>
      <CodeDisplay code="TAB-286-06-BACKEND" position="top-right" />
      
      {/* Stats Header */}
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

      {/* Main Content */}
      <Card style={{ height: 'calc(100% - 70px)' }}>
        <CardContent className="p-2 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-bold">أعضاء الفريق</h3>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                style={{ height: '24px', fontSize: '11px' }} 
                onClick={openAddDialog}
              >
                <Plus className="h-3 w-3 ml-1" />
                إضافة موظف
              </Button>
              <Button 
                size="sm" 
                variant={isSaved ? "ghost" : "default"}
                className={!isSaved ? "bg-green-600 hover:bg-green-700 text-white" : "text-gray-500"} 
                style={{ height: '24px', fontSize: '11px' }} 
                onClick={handleManualSave}
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin ml-1"/> : <Save className="h-3 w-3 ml-1" />} 
                {isSaved ? 'تم الحفظ' : 'حفظ التغييرات'}
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-grow border rounded-md bg-gray-50/30">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow style={{ height: '28px' }}>
                  <TableHead className="text-right text-[10px] py-1">الاسم</TableHead>
                  <TableHead className="text-right text-[10px] py-1">الدور الوظيفي</TableHead>
                  <TableHead className="text-right text-[10px] py-1">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right text-[10px] py-1">الجوال</TableHead>
                  <TableHead className="text-right text-[10px] py-1">مهام حالية</TableHead>
                  <TableHead className="text-right text-[10px] py-1 w-[80px]">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400 text-xs">
                      لم يتم إسناد أي موظفين لهذه المعاملة بعد
                    </TableCell>
                  </TableRow>
                ) : (
                  staffList.map((staffItem) => {
                    const employee = employees.find(e => e.id === staffItem.employeeId);
                    const empTasks = tasks.filter(t => t.assignedToId === staffItem.employeeId);
                    
                    return (
                      <TableRow key={staffItem.id} style={{ height: '32px' }}>
                        <TableCell className="text-right text-[10px] py-1 font-semibold">
                          {employee?.name || 'غير معروف'}
                        </TableCell>
                        <TableCell className="text-right text-[10px] py-1 text-blue-600">
                          {staffItem.role}
                        </TableCell>
                        <TableCell className="text-right text-[10px] py-1">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Mail className="h-3 w-3" />
                            {employee?.email || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-[10px] py-1">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Phone className="h-3 w-3" />
                            {employee?.phone || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-1">
                          {empTasks.length > 0 ? (
                            <Badge variant="secondary" className="text-[9px] h-[18px] px-1">
                              {empTasks.length} مهام
                            </Badge>
                          ) : (
                            <span className="text-[9px] text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex gap-1">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-6 w-6 hover:text-blue-600 hover:bg-blue-50" 
                              onClick={() => openEditDialog(staffItem)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-6 w-6 hover:text-red-600 hover:bg-red-50" 
                              onClick={() => handleDelete(staffItem.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <StaffAddEditDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleDialogSave}
        employees={employees}
        existingEmployeeIds={staffList.map(s => s.employeeId)}
        editingItem={editingItem}
      />
    </div>
  );
};

// ============================================
// TAB 286-08: المرفقات
// ============================================
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const Tab_286_08_Attachments_UltraDense: React.FC<AttachmentsTabProps> = ({ 
  transactionId,
  requiredDocuments = []
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: attachments, isLoading, isError } = useQuery<Attachment[]>({
    queryKey: ['attachments', transactionId],
    queryFn: () => getAttachments(transactionId),
    enabled: !!transactionId && transactionId !== 'new',
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadAttachment(file, transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments', transactionId] });
    },
    onError: (error: Error) => { alert(`فشل الرفع: ${error.message}`); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments', transactionId] });
      setDeletingId(null);
    },
    onError: (error: Error) => { alert(`فشل الحذف: ${error.message}`); },
  });

  const handleUploadClick = () => { fileInputRef.current?.click(); };
  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) { uploadMutation.mutate(file); }
    if (event.target) { event.target.value = ''; }
  };
  const handleDeleteClick = (id: string) => { setDeletingId(id); };
  const confirmDelete = () => { if (deletingId) { deleteMutation.mutate(deletingId); } };
  
  const stats = useMemo(() => {
    const totalUploaded = attachments?.length || 0;
    const totalRequired = requiredDocuments.length;
    const completionRate = totalRequired > 0 ? Math.min(100, Math.round((totalUploaded / totalRequired) * 100)) : 0;
    
    const totalSizeInBytes = attachments?.reduce((sum, a) => sum + a.fileSize, 0) || 0;
    const totalSize = formatBytes(totalSizeInBytes);

    return [
      { label: 'المستندات المطلوبة', value: totalRequired, color: '#f59e0b' },
      { label: 'تم رفعها', value: totalUploaded, color: '#10b981' },
      { label: 'نسبة الإنجاز', value: `${completionRate}%`, color: '#3b82f6' },
      { label: 'الحجم الكلي', value: totalSize, color: '#8b5cf6' }
    ];
  }, [attachments, requiredDocuments]);

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: 'calc(100vh - 180px)' }}>
      <CodeDisplay code="TAB-286-08-REQ" position="top-right" />
      
      <input type="file" ref={fileInputRef} onChange={handleFileSelected} style={{ display: 'none' }} />
      
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

      <div className="flex gap-2 h-[calc(100%-70px)]">
        
        <Card className="w-1/3 flex flex-col">
          <CardContent className="p-2 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                <FileCheck className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs font-bold text-gray-700">قائمة المطلوبات</h3>
              </div>
              
              <ScrollArea className="flex-1">
                {requiredDocuments.length > 0 ? (
                  <div className="space-y-1">
                    {requiredDocuments.map((docName, idx) => {
                      const isProbablyUploaded = attachments?.some(a => a.fileName.includes(docName));
                      
                      return (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${isProbablyUploaded ? 'bg-green-500' : 'bg-orange-400'}`} />
                            <span className="text-[10px] font-medium text-gray-700">{docName}</span>
                          </div>
                          {isProbablyUploaded && <CheckCircle className="h-3 w-3 text-green-500" />}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-20 text-gray-400">
                    <FileText className="h-8 w-8 mb-1 opacity-20" />
                    <span className="text-[10px]">لا توجد مستندات محددة مسبقاً</span>
                  </div>
                )}
              </ScrollArea>
          </CardContent>
        </Card>

        <Card className="w-2/3 flex flex-col">
          <CardContent className="p-2 h-full flex flex-col">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <h3 className="text-sm font-bold">الملفات المرفوعة</h3>
              <Button 
                size="sm" 
                style={{ height: '24px', padding: '0 8px', fontSize: '11px' }}
                onClick={handleUploadClick}
                disabled={uploadMutation.isPending}
              >
                <Upload className="h-3 w-3 ml-1" />
                {uploadMutation.isPending ? 'جاري...' : 'رفع ملف'}
              </Button>
            </div>
            
            <ScrollArea className="flex-grow">
              {isLoading && <div className="space-y-1 p-2"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></div>}
              
              {!isLoading && attachments?.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <Upload className="h-8 w-8 mb-2 opacity-20" />
                  <span className="text-xs">لم يتم رفع أي ملفات بعد</span>
                </div>
              )}

              <Table className="table-rtl">
                {/* ✅ التصحيح: إزالة التعليقات من داخل TableRow */}
                <TableHeader>
                  <TableRow style={{ height: '28px' }}>
                    <TableHead className="text-right text-[10px] py-1">اسم الملف</TableHead>
                    <TableHead className="text-right text-[10px] py-1">الحجم</TableHead>
                    <TableHead className="text-right text-[10px] py-1">التاريخ</TableHead>
                    <TableHead className="text-right text-[10px] py-1">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attachments?.map((file) => (
                    <TableRow key={file.id} style={{ height: '32px' }}>
                      <TableCell className="text-right text-[10px] py-1 font-semibold">
                        <div className="flex items-center gap-1">
                          <Paperclip className="h-3 w-3" style={{ color: '#64748b' }} />
                          <a href={file.filePath} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-[120px] block">
                            {file.fileName}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-[10px] py-1">
                        {formatBytes(file.fileSize)}
                      </TableCell>
                      <TableCell className="text-right text-[10px] py-1">
                        {new Date(file.createdAt).toLocaleDateString('ar-SA')}
                      </TableCell>
                      <TableCell className="text-right py-1">
                        <div className="flex gap-0.5">
                          <Button size="sm" variant="ghost" style={{ height: '22px', width: '22px', padding: 0 }} asChild>
                            <a href={file.filePath} download={file.fileName}><Download className="h-3 w-3" /></a>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            style={{ height: '22px', width: '22px', padding: 0 }}
                            onClick={() => handleDeleteClick(file.id)}
                            disabled={deleteMutation.isPending && deletingId === file.id}
                          >
                            {deleteMutation.isPending && deletingId === file.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" style={{ color: '#ef4444' }} />
                            )}
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

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent className="card-rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف هذا الملف؟</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive hover:bg-destructive/90"
              onClick={confirmDelete} 
              disabled={deleteMutation.isPending}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// ============================================
// TAB 286-10: التكاليف - مكثف جداً مع تفاصيل شاملة
// ============================================
export const Tab_286_10_Costs_UltraDense: React.FC<CostsTabProps> = ({ transactionId }) => {
  const queryClient = useQueryClient();
  
  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ catId: string, item: CostItem } | null>(null);
  const [formData, setFormData] = useState({ name: '', amount: 0 });
  const [activeTab, setActiveTab] = useState<string>('');

  // 1. جلب البيانات
  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransactionById(transactionId),
    enabled: !!transactionId
  });

  // 2. استخراج التكاليف
  const costs: CostCategory[] = useMemo(() => {
    if (!transaction) return [];
    
    if (transaction.costDetails && Array.isArray(transaction.costDetails)) {
      return transaction.costDetails;
    }
    return [];
  }, [transaction]);

  useEffect(() => {
    if (costs.length > 0 && !activeTab) {
      setActiveTab(costs[0].id);
    }
  }, [costs, activeTab]);

  // 3. Mutation للحفظ
  const saveMutation = useMutation({
    mutationFn: (newCosts: CostCategory[]) => updateTransactionCosts(transactionId, newCosts),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] });
      toast.success('تم الحفظ بنجاح');
      setIsDialogOpen(false);
    },
    onError: () => toast.error('فشل الحفظ')
  });

  // --- Handlers ---
  const handleOpenAdd = (catId: string) => {
    setEditingItem({ catId, item: { id: '', name: '', amount: 0, paid: 0, remaining: 0, status: 'pending' } });
    setFormData({ name: '', amount: 0 });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (catId: string, item: CostItem) => {
    setEditingItem({ catId, item });
    setFormData({ name: item.name, amount: item.amount });
    setIsDialogOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !formData.name) return;

    const updatedCosts = costs.map(cat => {
      if (cat.id !== editingItem.catId) return cat;
      let newItems;
      if (editingItem.item.id) {
        newItems = cat.items.map(i => i.id === editingItem.item.id ? { 
          ...i, name: formData.name, amount: formData.amount, remaining: formData.amount - i.paid 
        } : i);
      } else {
        const newItem: CostItem = {
          id: nanoid(), name: formData.name, amount: formData.amount, paid: 0, remaining: formData.amount, status: 'pending'
        };
        newItems = [...cat.items, newItem];
      }
      return { ...cat, items: newItems };
    });
    saveMutation.mutate(updatedCosts);
  };

  const handleDeleteItem = (catId: string, itemId: string) => {
    if (confirm('حذف هذا البند؟')) {
      const updatedCosts = costs.map(cat => 
        cat.id === catId ? { ...cat, items: cat.items.filter(i => i.id !== itemId) } : cat
      );
      saveMutation.mutate(updatedCosts);
    }
  };

  // --- Calculations & Render ---
  const totalAmount = costs.reduce((sum, c) => sum + c.items.reduce((s, i) => s + (i.amount || 0), 0), 0);
  const totalPaid = costs.reduce((sum, c) => sum + c.items.reduce((s, i) => s + (i.paid || 0), 0), 0);
  const totalRemaining = totalAmount - totalPaid;
  const paidPercentage = totalAmount > 0 ? ((totalPaid / totalAmount) * 100).toFixed(1) : '0';

  if (isLoading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

  if (costs.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed rounded-lg m-4">
        <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
        <p>لا توجد تكاليف مسجلة لهذه المعاملة</p>
        <p className="text-xs mt-1">تأكد من إعداد رسوم القالب في الإعدادات</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: 'calc(100vh - 180px)' }}>
      <CodeDisplay code="TAB-286-10-FIXED" position="top-right" />
      
      <div className="grid grid-cols-4 gap-1 mb-2">
        <Card className="border-blue-100 bg-blue-50/30">
          <CardContent className="p-1 text-center">
            <p className="text-[9px] text-gray-500">الإجمالي</p>
            <p className="text-xs font-bold text-blue-700">{totalAmount.toLocaleString()} ر.س</p>
          </CardContent>
        </Card>
        <Card className="border-green-100 bg-green-50/30">
          <CardContent className="p-1 text-center">
            <p className="text-[9px] text-gray-500">المدفوع</p>
            <p className="text-xs font-bold text-green-700">{totalPaid.toLocaleString()} ر.س</p>
          </CardContent>
        </Card>
        <Card className="border-red-100 bg-red-50/30">
          <CardContent className="p-1 text-center">
            <p className="text-[9px] text-gray-500">المتبقي</p>
            <p className="text-xs font-bold text-red-700">{totalRemaining.toLocaleString()} ر.س</p>
          </CardContent>
        </Card>
        <Card className="border-orange-100 bg-orange-50/30">
          <CardContent className="p-1 text-center">
            <p className="text-[9px] text-gray-500">السداد</p>
            <p className="text-xs font-bold text-orange-600">{paidPercentage}%</p>
          </CardContent>
        </Card>
      </div>

      <Card style={{ height: 'calc(100% - 70px)' }}>
        <CardContent className="p-2 h-full flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-grow">
            <ScrollArea className="w-full mb-2" orientation="horizontal">
               <TabsList className="flex w-max h-8">
                 {costs.map(cat => (
                   <TabsTrigger key={cat.id} value={cat.id} className="text-[10px] px-3">{cat.category}</TabsTrigger>
                 ))}
               </TabsList>
            </ScrollArea>
            
            {costs.map(cat => (
              <TabsContent key={cat.id} value={cat.id} className="mt-0 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-1 px-1">
                   <span className="text-[10px] font-bold text-gray-600">بنود: {cat.category}</span>
                   <Button size="sm" onClick={() => handleOpenAdd(cat.id)} className="h-6 text-[10px] px-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200">
                     <Plus className="h-3 w-3 ml-1" /> بند جديد
                   </Button>
                </div>
                <ScrollArea className="flex-grow bg-gray-50/50 rounded border border-gray-100">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow style={{ height: '28px' }}>
                        <TableHead className="text-right text-[9px]">البند</TableHead>
                        <TableHead className="text-right text-[9px]">المبلغ</TableHead>
                        <TableHead className="text-right text-[9px]">المدفوع</TableHead>
                        <TableHead className="text-right text-[9px]">المتبقي</TableHead>
                        <TableHead className="w-[60px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cat.items.map(item => (
                        <TableRow key={item.id} style={{ height: '32px' }} className="hover:bg-white">
                          <TableCell className="text-right text-[10px] font-medium">{item.name}</TableCell>
                          <TableCell className="text-right text-[10px] font-bold text-blue-700">{item.amount?.toLocaleString()} ر.س</TableCell>
                          <TableCell className="text-right text-[10px] text-green-600">{item.paid?.toLocaleString()} ر.س</TableCell>
                          <TableCell className="text-right text-[10px] text-red-600">{item.remaining?.toLocaleString()} ر.س</TableCell>
                          <TableCell className="text-right flex gap-1 justify-end">
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleOpenEdit(cat.id, item)}><Edit2 className="h-3 w-3 text-gray-500" /></Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDeleteItem(cat.id, item.id)}><Trash2 className="h-3 w-3 text-red-500" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="card-rtl w-[350px]">
          <DialogHeader><DialogTitle>{editingItem?.item.id ? 'تعديل بند' : 'إضافة بند'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSaveItem} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>اسم البند</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <Label>المبلغ (ر.س)</Label>
              <Input type="number" min="0" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} required />
            </div>
            <DialogFooter>
              <Button type="submit" size="sm" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'حفظ التغييرات'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default {
  Tab_286_05_Tasks_UltraDense,
  Tab_286_06_StaffAssignment_UltraDense,
  Tab_286_08_Attachments_UltraDense,
  Tab_286_10_Costs_UltraDense
};