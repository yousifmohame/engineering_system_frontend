/**
 * التاب 286-05 - المهمات - شامل ومكثف
 * ========================================
 * 
 * المميزات:
 * - قائمة المهمات الافتراضية حسب نوع المعاملة
 * - إضافة/تعديل/حذف المهمات
 * - تعيين المسؤولين والأولويات
 * - تحديد المدة والتبعيات
 * - ترتيب المهمات (drag & drop)
 * - حفظ في localStorage
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import {
  CheckCircle, Plus, Edit2, Trash2, Save, X, ChevronUp, ChevronDown,
  Clock, User, Flag, Link, AlertCircle, Users, Calendar
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';

interface Task {
  id: string;
  name: string;
  duration: number;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  order: number;
  dependencies: string[];
  notes: string;
  autoAssign: boolean;
}

interface Props {
  transactionType?: string;
  onTasksChange?: (tasks: Task[]) => void;
  readOnly?: boolean;
}

const Tab_286_05_Tasks_Complete: React.FC<Props> = ({ 
  transactionType,
  onTasksChange,
  readOnly = false 
}) => {
  // المهمات الافتراضية حسب نوع المعاملة
  const getDefaultTasks = (type: string): Task[] => {
    const defaultTasksByType: Record<string, Task[]> = {
      'building_permit': [
        { id: 't1', name: 'استقبال الطلب ومراجعة المستندات', duration: 1, assignedTo: '', priority: 'high', order: 1, dependencies: [], notes: '', autoAssign: true },
        { id: 't2', name: 'فحص الموقع والمعاينة الميدانية', duration: 3, assignedTo: '', priority: 'high', order: 2, dependencies: ['t1'], notes: '', autoAssign: true },
        { id: 't3', name: 'مراجعة المخططات المعمارية', duration: 5, assignedTo: '', priority: 'high', order: 3, dependencies: ['t2'], notes: '', autoAssign: true },
        { id: 't4', name: 'مراجعة المخططات الإنشائية', duration: 4, assignedTo: '', priority: 'high', order: 4, dependencies: ['t3'], notes: '', autoAssign: true },
        { id: 't5', name: 'الحصول على موافقة الدفاع المدني', duration: 7, assignedTo: '', priority: 'high', order: 5, dependencies: ['t4'], notes: '', autoAssign: false },
        { id: 't6', name: 'الحصول على موافقة البلدية', duration: 5, assignedTo: '', priority: 'high', order: 6, dependencies: ['t5'], notes: '', autoAssign: false },
        { id: 't7', name: 'إصدار الترخيص النهائي', duration: 2, assignedTo: '', priority: 'urgent', order: 7, dependencies: ['t6'], notes: '', autoAssign: true },
      ],
      'subdivision': [
        { id: 't1', name: 'استلام الطلب ومراجعة الصك', duration: 1, assignedTo: '', priority: 'high', order: 1, dependencies: [], notes: '', autoAssign: true },
        { id: 't2', name: 'الكشف الميداني على الأرض', duration: 2, assignedTo: '', priority: 'high', order: 2, dependencies: ['t1'], notes: '', autoAssign: true },
        { id: 't3', name: 'إعداد المخطط التقسيمي', duration: 5, assignedTo: '', priority: 'high', order: 3, dependencies: ['t2'], notes: '', autoAssign: true },
        { id: 't4', name: 'مراجعة المخطط مع البلدية', duration: 7, assignedTo: '', priority: 'medium', order: 4, dependencies: ['t3'], notes: '', autoAssign: false },
        { id: 't5', name: 'الحصول على موافقة البلدية', duration: 7, assignedTo: '', priority: 'high', order: 5, dependencies: ['t4'], notes: '', autoAssign: false },
        { id: 't6', name: 'إعداد الصكوك الجديدة', duration: 3, assignedTo: '', priority: 'high', order: 6, dependencies: ['t5'], notes: '', autoAssign: true },
      ],
      'default': [
        { id: 't1', name: 'استقبال الطلب', duration: 1, assignedTo: '', priority: 'high', order: 1, dependencies: [], notes: '', autoAssign: true },
        { id: 't2', name: 'مراجعة المستندات', duration: 2, assignedTo: '', priority: 'medium', order: 2, dependencies: ['t1'], notes: '', autoAssign: true },
        { id: 't3', name: 'إعداد الدراسات', duration: 5, assignedTo: '', priority: 'medium', order: 3, dependencies: ['t2'], notes: '', autoAssign: true },
        { id: 't4', name: 'التسليم النهائي', duration: 1, assignedTo: '', priority: 'high', order: 4, dependencies: ['t3'], notes: '', autoAssign: true },
      ]
    };

    return defaultTasksByType[type] || defaultTasksByType['default'];
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [newTask, setNewTask] = useState<Task>({
    id: '',
    name: '',
    duration: 1,
    assignedTo: '',
    priority: 'medium',
    order: 0,
    dependencies: [],
    notes: '',
    autoAssign: true
  });

  // الموظفون المتاحون
  const availableEmployees = [
    { value: 'emp1', label: 'المهندس أحمد العلي' },
    { value: 'emp2', label: 'المهندسة فاطمة محمد' },
    { value: 'emp3', label: 'المهندس خالد السعيد' },
    { value: 'emp4', label: 'المهندسة نورة الحسن' },
    { value: 'emp5', label: 'المساح علي أحمد' },
    { value: 'emp6', label: 'المحامي عبدالله محمد' }
  ];

  // تحميل المهمات الافتراضية عند اختيار نوع المعاملة
  useEffect(() => {
    if (transactionType && tasks.length === 0) {
      const defaultTasks = getDefaultTasks(transactionType);
      setTasks(defaultTasks);
      setHasUnsavedChanges(true);
    }
  }, [transactionType]);

  // الحفظ
  const handleSave = () => {
    localStorage.setItem('transaction_tasks_new', JSON.stringify(tasks));
    setHasUnsavedChanges(false);
    if (onTasksChange) {
      onTasksChange(tasks);
    }
    alert('✅ تم حفظ المهمات بنجاح!');
  };

  // إضافة مهمة
  const handleAddTask = () => {
    if (!newTask.name) {
      alert('⚠️ الرجاء إدخال اسم المهمة');
      return;
    }

    const task: Task = {
      ...newTask,
      id: `t${Date.now()}`,
      order: tasks.length + 1
    };

    setTasks([...tasks, task]);
    setNewTask({
      id: '',
      name: '',
      duration: 1,
      assignedTo: '',
      priority: 'medium',
      order: 0,
      dependencies: [],
      notes: '',
      autoAssign: true
    });
    setShowAddDialog(false);
    setHasUnsavedChanges(true);
  };

  // حذف مهمة
  const handleDeleteTask = (taskId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      // إعادة ترقيم المهمات
      const reorderedTasks = updatedTasks.map((t, index) => ({ ...t, order: index + 1 }));
      setTasks(reorderedTasks);
      setHasUnsavedChanges(true);
    }
  };

  // تحريك مهمة للأعلى
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newTasks = [...tasks];
    [newTasks[index], newTasks[index - 1]] = [newTasks[index - 1], newTasks[index]];
    // إعادة ترقيم
    const reorderedTasks = newTasks.map((t, i) => ({ ...t, order: i + 1 }));
    setTasks(reorderedTasks);
    setHasUnsavedChanges(true);
  };

  // تحريك مهمة للأسفل
  const handleMoveDown = (index: number) => {
    if (index === tasks.length - 1) return;
    const newTasks = [...tasks];
    [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
    // إعادة ترقيم
    const reorderedTasks = newTasks.map((t, i) => ({ ...t, order: i + 1 }));
    setTasks(reorderedTasks);
    setHasUnsavedChanges(true);
  };

  // ألوان الأولويات
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return { bg: '#f3f4f6', text: '#6b7280', label: 'منخفضة' };
      case 'medium': return { bg: '#dbeafe', text: '#2563eb', label: 'متوسطة' };
      case 'high': return { bg: '#fef3c7', text: '#f59e0b', label: 'عالية' };
      case 'urgent': return { bg: '#fee2e2', text: '#ef4444', label: 'عاجلة' };
      default: return { bg: '#f3f4f6', text: '#6b7280', label: priority };
    }
  };

  const totalDuration = tasks.reduce((sum, task) => sum + task.duration, 0);

  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-05" position="top-right" />
      
      {/* الهيدر */}
      <Card className="card-rtl" style={{ 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        border: '2px solid #0ea5e9'
      }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{
                padding: '10px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)'
              }}>
                <CheckCircle className="h-6 w-6" style={{ color: '#ffffff' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0c4a6e', margin: 0 }}>
                  المهمات
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  قائمة المهمات المطلوبة لإنجاز المعاملة
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                padding: '6px 12px',
                fontSize: '12px'
              }}>
                {tasks.length} مهمة
              </Badge>
              
              <Badge style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                padding: '6px 12px',
                fontSize: '12px'
              }}>
                {totalDuration} يوم
              </Badge>
              
              {!readOnly && (
                <>
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: '#ffffff'
                    }}
                  >
                    <Plus className="h-4 w-4 ml-1" />
                    إضافة مهمة
                  </Button>
                  <Button
                    onClick={handleSave}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff'
                    }}
                  >
                    <Save className="h-4 w-4 ml-1" />
                    حفظ
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ScrollArea style={{ height: 'calc(100vh - 280px)' }}>
        <div className="space-y-4 pl-4">
          
          {/* جدول المهمات */}
          <Card className="card-rtl">
            <CardContent className="p-4">
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '50px' }}>
                      #
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      اسم المهمة
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                      المدة (يوم)
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '150px' }}>
                      المسؤول
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>
                      الأولوية
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                      التبعيات
                    </TableHead>
                    {!readOnly && (
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '150px' }}>
                        إجراءات
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={readOnly ? 6 : 7} className="text-center py-8">
                        <p style={{ fontSize: '14px', color: '#64748b' }}>
                          لا توجد مهمات بعد. اضغط "إضافة مهمة" لإضافة مهمة جديدة
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    tasks.map((task, index) => {
                      const priorityColor = getPriorityColor(task.priority);
                      const assignedEmployee = availableEmployees.find(e => e.value === task.assignedTo);
                      
                      return (
                        <TableRow key={task.id}>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                            {task.order}
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {task.name}
                            {task.notes && (
                              <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0' }}>
                                {task.notes}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" style={{ color: '#64748b' }} />
                              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                                {task.duration}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                            {assignedEmployee ? (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" style={{ color: '#3b82f6' }} />
                                {assignedEmployee.label}
                              </div>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>غير محدد</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge style={{
                              background: priorityColor.bg,
                              color: priorityColor.text,
                              fontSize: '11px',
                              padding: '4px 8px'
                            }}>
                              <Flag className="h-3 w-3 inline ml-1" />
                              {priorityColor.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {task.dependencies.length > 0 ? (
                              <Badge variant="outline" style={{ fontSize: '10px', padding: '2px 6px' }}>
                                <Link className="h-3 w-3 inline ml-1" />
                                {task.dependencies.length}
                              </Badge>
                            ) : (
                              <span style={{ fontSize: '11px', color: '#94a3b8' }}>-</span>
                            )}
                          </TableCell>
                          {!readOnly && (
                            <TableCell className="text-right">
                              <div className="flex items-center gap-1 justify-end">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleMoveUp(index)}
                                  disabled={index === 0}
                                  style={{ padding: '4px' }}
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleMoveDown(index)}
                                  disabled={index === tasks.length - 1}
                                  style={{ padding: '4px' }}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteTask(task.id)}
                                  style={{ padding: '4px' }}
                                >
                                  <Trash2 className="h-4 w-4" style={{ color: '#ef4444' }} />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>
      </ScrollArea>

      {/* نافذة إضافة مهمة */}
      {showAddDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Card style={{ 
            width: '600px',
            maxHeight: '80vh',
            fontFamily: 'Tajawal, sans-serif',
            direction: 'rtl'
          }}>
            <CardHeader style={{ borderBottom: '2px solid #e5e7eb' }}>
              <CardTitle style={{ fontSize: '18px' }}>
                <Plus className="h-5 w-5 inline ml-2" />
                إضافة مهمة جديدة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <InputWithCopy
                label="اسم المهمة *"
                id="taskName"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                required
                copyable={false}
                clearable
              />
              
              <div className="grid grid-cols-2 gap-3">
                <InputWithCopy
                  label="المدة (أيام) *"
                  id="taskDuration"
                  type="number"
                  value={newTask.duration.toString()}
                  onChange={(e) => setNewTask({ ...newTask, duration: parseInt(e.target.value) || 1 })}
                  required
                  copyable={false}
                  clearable={false}
                />
                
                <SelectWithCopy
                  label="الأولوية *"
                  id="taskPriority"
                  value={newTask.priority}
                  onChange={(value) => setNewTask({ ...newTask, priority: value as Task['priority'] })}
                  options={[
                    { value: 'low', label: 'منخفضة' },
                    { value: 'medium', label: 'متوسطة' },
                    { value: 'high', label: 'عالية' },
                    { value: 'urgent', label: 'عاجلة' }
                  ]}
                  copyable={false}
                  clearable={false}
                />
              </div>

              <SelectWithCopy
                label="المسؤول"
                id="taskAssignedTo"
                value={newTask.assignedTo}
                onChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                options={availableEmployees}
                copyable={false}
                clearable
              />

              <TextAreaWithCopy
                label="ملاحظات"
                id="taskNotes"
                value={newTask.notes}
                onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                rows={2}
                copyable={false}
                clearable
              />

              <EnhancedSwitch
                id="taskAutoAssign"
                checked={newTask.autoAssign}
                onCheckedChange={(checked) => setNewTask({ ...newTask, autoAssign: checked })}
                label="تعيين تلقائي"
                description="تعيين المهمة تلقائياً للموظف المسؤول"
                size="md"
                variant="default"
              />

              <div className="flex gap-2 pt-3">
                <Button
                  onClick={handleAddTask}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    flex: 1
                  }}
                >
                  <CheckCircle className="h-4 w-4 ml-1" />
                  إضافة
                </Button>
                <Button
                  onClick={() => setShowAddDialog(false)}
                  variant="outline"
                  style={{ flex: 1 }}
                >
                  <X className="h-4 w-4 ml-1" />
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* تحذير التغييرات غير المحفوظة */}
      {hasUnsavedChanges && !readOnly && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
          zIndex: 999,
          fontFamily: 'Tajawal, sans-serif',
          fontSize: '14px',
          fontWeight: 600
        }}>
          ⚠️ يوجد تغييرات غير محفوظة
        </div>
      )}
    </div>
  );
};

export default Tab_286_05_Tasks_Complete;
