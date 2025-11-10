/**
 * التاب 284-48 - مهام التعقيب v1.0 COMPLETE
 * ========================================================
 * 
 * تاب شامل لإدارة مهام التعقيب للمعاملة
 * 
 * المميزات:
 * ✅ تسجيل مهام التعقيب لكل معاملة
 * ✅ تحديد المعقب (من شاشة 937)
 * ✅ تحديد الجهة الحكومية
 * ✅ عدد مرات التعقيب
 * ✅ حالة المهمة (نجاح/فشل/جاري)
 * ✅ الملاحظات والإفادات
 * ✅ ربط بشاشة أتعاب التعقيب (938)
 * 
 * @version 1.0 COMPLETE
 * @date 28 أكتوبر 2025
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import {
  Plus, CheckCircle, XCircle, Clock, MapPin, User, Building2,
  Calendar, AlertCircle, Eye, Edit, Trash2, ExternalLink, FileText
} from 'lucide-react';

interface Tab_284_48_Props {
  transactionId?: string;
}

interface FollowUpTask {
  id: string;
  agentId: string;
  agentName: string;
  agentType: 'individual' | 'entity';
  governmentEntity: string;
  monitoringEntityId: string;        // 🆕 جهة المتابعة
  monitoringEntityName: string;      // 🆕 اسم جهة المتابعة
  executionEntityId: string;         // 🆕 جهة التنفيذ
  executionEntityName: string;       // 🆕 اسم جهة التنفيذ
  taskDescription: string;
  startDate: string;
  targetDate: string;
  completionDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  attempts: number;
  successStatus: 'success' | 'failed' | 'pending';
  fees: number;
  paidAmount: number;
  remainingAmount: number;
  notes: string;
  feedbacks: Feedback[];
}

interface Feedback {
  id: string;
  date: string;
  author: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

const Tab_284_48_FollowUp_Tasks_Complete: React.FC<Tab_284_48_Props> = ({ transactionId = '2510001' }) => {
  // حالة المهام
  const [tasks, setTasks] = useState<FollowUpTask[]>([
    {
      id: 'FUT-001',
      agentId: 'AGT-2025-001',
      agentName: 'محمد بن أحمد السالم',
      agentType: 'individual',
      governmentEntity: 'البلدية',
      monitoringEntityId: 'ENT-001',
      monitoringEntityName: 'أمانة منطقة الرياض',
      executionEntityId: 'ENT-001',
      executionEntityName: 'أمانة منطقة الرياض',
      taskDescription: 'الحصول على موافقة البلدية لرخصة البناء',
      startDate: '2025-10-01',
      targetDate: '2025-10-15',
      completionDate: '2025-10-12',
      status: 'completed',
      attempts: 3,
      successStatus: 'success',
      fees: 5000,
      paidAmount: 3000,
      remainingAmount: 2000,
      notes: 'تمت الموافقة بنجاح بعد تعديل بعض المستندات',
      feedbacks: [
        {
          id: 'FB-001',
          date: '2025-10-01',
          author: 'البلدية',
          content: 'تم استلام الطلب وجاري المراجعة',
          type: 'info'
        },
        {
          id: 'FB-002',
          date: '2025-10-05',
          author: 'البلدية',
          content: 'يوجد ملاحظات على المخطط الإنشائي',
          type: 'warning'
        },
        {
          id: 'FB-003',
          date: '2025-10-12',
          author: 'البلدية',
          content: 'تمت الموافقة النهائية',
          type: 'success'
        }
      ]
    },
    {
      id: 'FUT-002',
      agentId: 'AGT-2025-002',
      agentName: 'مؤسسة التعقيب المتقدم',
      agentType: 'entity',
      governmentEntity: 'الدفاع المدني',
      monitoringEntityId: 'ENT-002',
      monitoringEntityName: 'الدفاع المدني',
      executionEntityId: 'ENT-002',
      executionEntityName: 'الدفاع المدني',
      taskDescription: 'الحصول على شهادة الدفاع المدني',
      startDate: '2025-10-10',
      targetDate: '2025-10-25',
      status: 'in-progress',
      attempts: 2,
      successStatus: 'pending',
      fees: 3000,
      paidAmount: 0,
      remainingAmount: 3000,
      notes: 'جاري المراجعة - في انتظار الرد',
      feedbacks: [
        {
          id: 'FB-004',
          date: '2025-10-10',
          author: 'الدفاع المدني',
          content: 'تم استلام الطلب',
          type: 'info'
        },
        {
          id: 'FB-005',
          date: '2025-10-15',
          author: 'الدفاع المدني',
          content: 'جاري الفحص الميداني',
          type: 'info'
        }
      ]
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<FollowUpTask | null>(null);

  // بيانات النموذج
  const [newTask, setNewTask] = useState({
    agentId: '',
    agentName: '',
    agentType: 'individual' as 'individual' | 'entity',
    governmentEntity: '',
    monitoringEntityId: '',      // 🆕
    monitoringEntityName: '',    // 🆕
    executionEntityId: '',       // 🆕
    executionEntityName: '',     // 🆕
    taskDescription: '',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: '',
    fees: '',
    notes: '',
  });

  // قائمة المعقبين (من شاشة 937)
  const availableAgents = [
    { id: 'AGT-2025-001', name: 'محمد بن أحمد السالم', type: 'individual' },
    { id: 'AGT-2025-002', name: 'مؤسسة التعقيب المتقدم', type: 'entity' },
    { id: 'AGT-2025-003', name: 'خالد بن عبدالله المطيري', type: 'individual' },
    { id: 'AGT-2025-004', name: 'شركة الخدمات الحكومية', type: 'entity' },
  ];

  // قائمة الجهات الحكومية
  const governmentEntities = [
    'البلدية',
    'الدفاع المدني',
    'الأمانة',
    'الكهرباء',
    'المياه',
    'الصرف الصحي',
    'النقل',
    'الزراعة',
    'هيئة الزكاة والدخل',
    'وزارة العمل'
  ];

  // 🆕 قائمة الجهات الخارجية (من شاشة 818)
  const externalEntities = [
    { id: 'ENT-001', name: 'أمانة منطقة الرياض', type: 'government' },
    { id: 'ENT-002', name: 'الدفاع المدني', type: 'government' },
    { id: 'ENT-003', name: 'وزارة العدل - مكتب التوثيق', type: 'government' },
    { id: 'ENT-004', name: 'وزارة العدل - الصكوك', type: 'government' },
    { id: 'ENT-005', name: 'الشركة السعودية للكهرباء', type: 'semi-government' },
    { id: 'ENT-006', name: 'شركة المياه الوطنية', type: 'semi-government' },
    { id: 'ENT-007', name: 'الهيئة العليا لتطوير الرياض', type: 'government' },
    { id: 'ENT-008', name: 'وزارة الشؤون البلدية والقروية', type: 'government' },
    { id: 'ENT-009', name: 'هيئة الزكاة والضريبة والجمارك', type: 'government' },
    { id: 'ENT-010', name: 'وزارة النقل والخدمات اللوجستية', type: 'government' }
  ];

  // حساب الإحصائيات
  const statistics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const failed = tasks.filter(t => t.status === 'failed').length;
    const successful = tasks.filter(t => t.successStatus === 'success').length;
    const successRate = total > 0 ? (successful / total) * 100 : 0;
    const totalFees = tasks.reduce((sum, t) => sum + t.fees, 0);
    const totalPaid = tasks.reduce((sum, t) => sum + t.paidAmount, 0);
    const totalRemaining = tasks.reduce((sum, t) => sum + t.remainingAmount, 0);
    const totalAttempts = tasks.reduce((sum, t) => sum + t.attempts, 0);

    return {
      total,
      completed,
      inProgress,
      failed,
      successful,
      successRate: successRate.toFixed(1),
      totalFees,
      totalPaid,
      totalRemaining,
      totalAttempts,
    };
  }, [tasks]);

  // دالة إضافة مهمة
  const handleAddTask = () => {
    if (!newTask.agentId || !newTask.governmentEntity || !newTask.taskDescription || 
        !newTask.monitoringEntityId || !newTask.executionEntityId) {
      alert('يرجى تعبئة جميع الحقول المطلوبة (المعقب، جهة المتابعة، جهة التنفيذ، الوصف)');
      return;
    }

    const agent = availableAgents.find(a => a.id === newTask.agentId);
    if (!agent) return;

    const task: FollowUpTask = {
      id: `FUT-${String(tasks.length + 1).padStart(3, '0')}`,
      agentId: newTask.agentId,
      agentName: agent.name,
      agentType: agent.type as any,
      governmentEntity: newTask.governmentEntity,
      monitoringEntityId: newTask.monitoringEntityId,
      monitoringEntityName: newTask.monitoringEntityName,
      executionEntityId: newTask.executionEntityId,
      executionEntityName: newTask.executionEntityName,
      taskDescription: newTask.taskDescription,
      startDate: newTask.startDate,
      targetDate: newTask.targetDate,
      status: 'pending',
      attempts: 0,
      successStatus: 'pending',
      fees: parseFloat(newTask.fees) || 0,
      paidAmount: 0,
      remainingAmount: parseFloat(newTask.fees) || 0,
      notes: newTask.notes,
      feedbacks: []
    };

    setTasks([...tasks, task]);
    setNewTask({
      agentId: '',
      agentName: '',
      agentType: 'individual',
      governmentEntity: '',
      taskDescription: '',
      startDate: new Date().toISOString().split('T')[0],
      targetDate: '',
      fees: '',
      notes: '',
    });
    setShowAddDialog(false);
  };

  // ============================================================
  // واجهة التاب الرئيسية
  // ============================================================

  return (
    <div className="space-y-4">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-6 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-3 text-center">
            <FileText className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.total}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المهام</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.successful}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>ناجحة</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
          <CardContent className="p-3 text-center">
            <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.failed}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>فاشلة</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-3 text-center">
            <Clock className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.inProgress}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>جارية</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-3 text-center">
            <AlertCircle className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.totalAttempts}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المحاولات</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', border: '2px solid #d8b4fe' }}>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة النجاح</p>
            <p className="text-lg font-bold text-purple-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.successRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* بطاقة الأتعاب */}
      <Card style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', border: '2px solid #fca5a5' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-8">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الأتعاب</p>
                <p className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {statistics.totalFees.toLocaleString()} ر.س
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</p>
                <p className="text-xl font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {statistics.totalPaid.toLocaleString()} ر.س
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</p>
                <p className="text-xl font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {statistics.totalRemaining.toLocaleString()} ر.س
                </p>
              </div>
            </div>
            <Button onClick={() => alert('فتح شاشة أتعاب التعقيب (938)')}>
              <ExternalLink className="h-4 w-4 ml-2" />
              أتعاب التعقيب (938)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* جدول المهام */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>مهام التعقيب ({tasks.length})</CardTitle>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-3 w-3 ml-1" />
              إضافة مهمة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعقب</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهمة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>جهة المتابعة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>جهة التنفيذ</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المحاولات</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النتيجة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأتعاب</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task, index) => (
                  <TableRow key={task.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                      {task.agentName}
                    </TableCell>
                    <TableCell className="text-right">
                      {task.agentType === 'individual' ? (
                        <Badge style={{ background: '#e0e7ff', color: '#4338ca', fontFamily: 'Tajawal, sans-serif' }}>
                          <User className="h-3 w-3 ml-1" />
                          فرد
                        </Badge>
                      ) : (
                        <Badge style={{ background: '#f3e8ff', color: '#7c3aed', fontFamily: 'Tajawal, sans-serif' }}>
                          <Building2 className="h-3 w-3 ml-1" />
                          كيان
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <MapPin className="h-3 w-3 ml-1" />
                        {task.governmentEntity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                      {task.taskDescription}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge style={{ background: '#eff6ff', color: '#1e40af', fontFamily: 'Tajawal, sans-serif', fontSize: '10px' }}>
                        <Building2 className="h-3 w-3 ml-1" />
                        {task.monitoringEntityName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge style={{ background: '#f0fdf4', color: '#166534', fontFamily: 'Tajawal, sans-serif', fontSize: '10px' }}>
                        <CheckCircle className="h-3 w-3 ml-1" />
                        {task.executionEntityName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{task.attempts}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        style={{
                          background: 
                            task.status === 'completed' ? '#dcfce7' :
                            task.status === 'in-progress' ? '#dbeafe' :
                            task.status === 'failed' ? '#fee2e2' : '#fef3c7',
                          color: 
                            task.status === 'completed' ? '#166534' :
                            task.status === 'in-progress' ? '#1e40af' :
                            task.status === 'failed' ? '#991b1b' : '#854d0e',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        {task.status === 'completed' ? 'مكتمل' :
                         task.status === 'in-progress' ? 'جاري' :
                         task.status === 'failed' ? 'فشل' : 'معلق'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {task.successStatus === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      ) : task.successStatus === 'failed' ? (
                        <XCircle className="h-5 w-5 text-red-600 mx-auto" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-600 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {task.fees.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-green-600 font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {task.paidAmount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-red-600 font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {task.remainingAmount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedTask(task);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* نافذة إضافة مهمة */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة مهمة تعقيب جديدة</DialogTitle>
            <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قم بتحديد المعقب والجهة ووصف المهمة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* المعقب */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعقب</h3>
              <SelectWithCopy
                label="اختر المعقب *"
                id="agent"
                value={newTask.agentId}
                onChange={(value) => {
                  const agent = availableAgents.find(a => a.id === value);
                  setNewTask({ 
                    ...newTask, 
                    agentId: value,
                    agentName: agent?.name || '',
                    agentType: agent?.type as any || 'individual'
                  });
                }}
                options={availableAgents.map(a => ({
                  value: a.id,
                  label: `${a.name} (${a.type === 'individual' ? 'فرد' : 'كيان'})`
                }))}
                copyable={true}
                clearable={true}
              />
            </div>

            {/* 🆕 جهات المتابعة والتنفيذ */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                🏢 جهات المتابعة والتنفيذ (إلزامي)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <SelectWithCopy
                  label="جهة المتابعة * (الجهة التي سيذهب لها المعقب)"
                  id="monitoring-entity"
                  value={newTask.monitoringEntityId}
                  onChange={(value) => {
                    const entity = externalEntities.find(e => e.id === value);
                    setNewTask({ 
                      ...newTask, 
                      monitoringEntityId: value,
                      monitoringEntityName: entity?.name || ''
                    });
                  }}
                  options={externalEntities.map(e => ({
                    value: e.id,
                    label: e.name
                  }))}
                  copyable={true}
                  clearable={true}
                />
                <SelectWithCopy
                  label="جهة التنفيذ * (الجهة التي ستنفذ الطلب)"
                  id="execution-entity"
                  value={newTask.executionEntityId}
                  onChange={(value) => {
                    const entity = externalEntities.find(e => e.id === value);
                    setNewTask({ 
                      ...newTask, 
                      executionEntityId: value,
                      executionEntityName: entity?.name || ''
                    });
                  }}
                  options={externalEntities.map(e => ({
                    value: e.id,
                    label: e.name
                  }))}
                  copyable={true}
                  clearable={true}
                />
              </div>
              <div className="mt-2 p-2 bg-white rounded border-r-4 border-orange-500">
                <p className="text-xs text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  💡 <strong>ملاحظة:</strong> جهة المتابعة هي المكان الذي سيذهب إليه المعقب، 
                  وجهة التنفيذ هي الجهة المفترض أن تنفذ الطلب. يمكن أن تكونا نفس الجهة أو مختلفتين.
                </p>
              </div>
            </div>

            {/* التفاصيل */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل المهمة</h3>
              <div className="grid grid-cols-2 gap-4">
                <SelectWithCopy
                  label="الجهة الحكومية *"
                  id="entity"
                  value={newTask.governmentEntity}
                  onChange={(value) => setNewTask({ ...newTask, governmentEntity: value })}
                  options={governmentEntities.map(e => ({ value: e, label: e }))}
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="الأتعاب (ر.س) *"
                  id="fees"
                  value={newTask.fees}
                  onChange={(e) => setNewTask({ ...newTask, fees: e.target.value })}
                  placeholder="5000"
                  required
                  copyable={true}
                  clearable={true}
                />
              </div>
            </div>

            {/* الوصف */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <TextAreaWithCopy
                label="وصف المهمة *"
                id="description"
                value={newTask.taskDescription}
                onChange={(e) => setNewTask({ ...newTask, taskDescription: e.target.value })}
                rows={3}
                placeholder="وصف تفصيلي للمهمة المطلوبة..."
                required
                copyable={true}
                clearable={true}
              />
            </div>

            {/* التواريخ */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>التواريخ</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputWithCopy
                  label="تاريخ البدء *"
                  id="startDate"
                  type="date"
                  value={newTask.startDate}
                  onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                  required
                  copyable={true}
                  clearable={false}
                />
                <InputWithCopy
                  label="التاريخ المستهدف *"
                  id="targetDate"
                  type="date"
                  value={newTask.targetDate}
                  onChange={(e) => setNewTask({ ...newTask, targetDate: e.target.value })}
                  required
                  copyable={true}
                  clearable={false}
                />
              </div>
            </div>

            {/* ملاحظات */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <TextAreaWithCopy
                label="ملاحظات"
                id="notes"
                value={newTask.notes}
                onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                rows={2}
                placeholder="أي ملاحظات إضافية..."
                copyable={true}
                clearable={true}
              />
            </div>

            {/* الأزرار */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>إلغاء</Button>
              <Button onClick={handleAddTask}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة المهمة
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة التفاصيل */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل مهمة التعقيب</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              {/* معلومات أساسية */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-gray-600">المعقب</p>
                  <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedTask.agentName}</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs text-gray-600">الجهة</p>
                  <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedTask.governmentEntity}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-xs text-gray-600">عدد المحاولات</p>
                  <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedTask.attempts}</p>
                </div>
              </div>

              {/* الإفادات */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الإفادات والملاحظات ({selectedTask.feedbacks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedTask.feedbacks.map(feedback => (
                      <div 
                        key={feedback.id}
                        className="p-3 rounded border-r-4"
                        style={{
                          backgroundColor: 
                            feedback.type === 'success' ? '#dcfce7' :
                            feedback.type === 'error' ? '#fee2e2' :
                            feedback.type === 'warning' ? '#fef3c7' : '#dbeafe',
                          borderColor:
                            feedback.type === 'success' ? '#16a34a' :
                            feedback.type === 'error' ? '#dc2626' :
                            feedback.type === 'warning' ? '#eab308' : '#2563eb'
                        }}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                            {feedback.author}
                          </span>
                          <span className="text-xs text-gray-600">{feedback.date}</span>
                        </div>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                          {feedback.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tab_284_48_FollowUp_Tasks_Complete;
