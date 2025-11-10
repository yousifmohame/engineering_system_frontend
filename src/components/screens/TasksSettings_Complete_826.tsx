/**
 * الشاشة 826 - إعدادات المهام المتقدمة
 * =====================================
 * 
 * شاشة متخصصة للتحكم الكامل في نظام المهام
 * - تحديد جميع أنواع المهام في النظام
 * - تقسيم المهام إلى مجموعات ديناميكية
 * - الربط الذكي حسب معايير متعددة
 * - السماح بوجود نفس المهمة في عدة مجموعات
 * 
 * التابات (8 تبويبات):
 * 826-01: المهام الأساسية
 * 826-02: مجموعات المهام
 * 826-03: المعايير والشروط
 * 826-04: ربط المهام بالمعاملات
 * 826-05: ربط المهام بالمشاريع
 * 826-06: ربط المهام بالعملاء
 * 826-07: القوالب الجاهزة
 * 826-08: التقارير والتحليلات
 * 
 * @version 1.0
 * @date 2025-10-25
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import {
  ClipboardList, FolderTree, Filter, Link2, Building2, Users, FileText, BarChart3,
  Plus, Edit, Trash2, Save, Search, Eye, Settings, CheckCircle, XCircle,
  Tag, Calendar, Clock, AlertCircle, Target, Award, TrendingUp, Activity,
  Layers, GitBranch, Zap, Hash, Shield, Database, Bell, Play, Pause,
  ArrowRight, Copy, Download, Upload, RefreshCw, ChevronRight
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';

// ===== واجهات البيانات =====

interface Task {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  estimatedDuration: number; // بالأيام
  priority: 'عالية' | 'متوسطة' | 'منخفضة';
  requiresApproval: boolean;
  assignToRole?: string;
  dependencies: string[]; // المهام المعتمدة عليها
  outputs: string[]; // المخرجات المتوقعة
  isActive: boolean;
  displayOrder: number;
  createdDate: string;
  groups: string[]; // المجموعات التي تنتمي إليها المهمة
}

interface TaskGroup {
  id: string;
  code: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  criteria: GroupCriteria;
  tasks: string[]; // معرفات المهام
  autoAssign: boolean; // تعيين تلقائي عند تطابق المعايير
  isActive: boolean;
  createdDate: string;
}

interface GroupCriteria {
  transactionTypes?: string[]; // نوع المعاملة
  projectMainClass?: string[]; // التصنيف الرئيسي للمشروع
  projectSubClass?: string[]; // التصنيف الفرعي للمشروع
  clientType?: string[]; // نوع العميل (فرد، شركة، جهة حكومية)
  creationDateRange?: {
    from?: string;
    to?: string;
  };
  numberOfFloors?: {
    min?: number;
    max?: number;
  };
  landArea?: {
    min?: number; // متر مربع
    max?: number;
  };
  confidentialityLevel?: string[]; // 'عادي' | 'سري' | 'سري للغاية'
  clientImportance?: string[]; // 'عادي' | 'مهم' | 'مهم جداً' | 'VIP'
  projectValue?: {
    min?: number; // ريال
    max?: number;
  };
  location?: string[]; // المدن أو المناطق
}

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  groups: TaskGroup[];
  tasks: Task[];
  isDefault: boolean;
  createdBy: string;
  createdDate: string;
}

const TasksSettings_Complete_826: React.FC = () => {
  const [activeTab, setActiveTab] = useState('826-01');

  // البيانات الوهمية للمهام
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      code: 'TSK-001',
      name: 'استلام المستندات الأولية',
      description: 'استلام جميع المستندات الأساسية من العميل (صك الملكية، بطاقة الهوية، مخطط الموقع)',
      category: 'استقبال',
      estimatedDuration: 1,
      priority: 'عالية',
      requiresApproval: false,
      assignToRole: 'موظف الاستقبال',
      dependencies: [],
      outputs: ['قائمة المستندات المستلمة', 'تقرير النقص إن وجد'],
      isActive: true,
      displayOrder: 1,
      createdDate: '2025-01-01',
      groups: ['reception', 'all-projects'],
    },
    {
      id: '2',
      code: 'TSK-002',
      name: 'الزيارة الميدانية الأولية',
      description: 'زيارة الموقع وأخذ الصور والقياسات الأولية ورفع الإحداثيات',
      category: 'مساحة',
      estimatedDuration: 2,
      priority: 'عالية',
      requiresApproval: false,
      assignToRole: 'مهندس مساح',
      dependencies: ['TSK-001'],
      outputs: ['تقرير الزيارة الميدانية', 'صور الموقع', 'الإحداثيات'],
      isActive: true,
      displayOrder: 2,
      createdDate: '2025-01-01',
      groups: ['surveying', 'all-projects', 'residential', 'commercial'],
    },
    {
      id: '3',
      code: 'TSK-003',
      name: 'إعداد الدراسة التمهيدية',
      description: 'إعداد دراسة تمهيدية شاملة تتضمن تحليل الموقع والمتطلبات الأولية',
      category: 'تصميم',
      estimatedDuration: 3,
      priority: 'عالية',
      requiresApproval: true,
      assignToRole: 'مهندس معماري',
      dependencies: ['TSK-002'],
      outputs: ['الدراسة التمهيدية', 'التحليل الفني الأولي'],
      isActive: true,
      displayOrder: 3,
      createdDate: '2025-01-01',
      groups: ['design', 'residential', 'commercial', 'large-projects'],
    },
    {
      id: '4',
      code: 'TSK-004',
      name: 'إعداد المخططات الابتدائية',
      description: 'تصميم المخططات المعمارية الابتدائية (الواجهات، المساقط)',
      category: 'تصميم',
      estimatedDuration: 5,
      priority: 'عالية',
      requiresApproval: true,
      assignToRole: 'مهندس معماري',
      dependencies: ['TSK-003'],
      outputs: ['المخططات الابتدائية', 'الواجهات الأولية'],
      isActive: true,
      displayOrder: 4,
      createdDate: '2025-01-01',
      groups: ['design', 'all-projects'],
    },
    {
      id: '5',
      code: 'TSK-005',
      name: 'المراجعة الإنشائية',
      description: 'مراجعة المخططات من الناحية الإنشائية وإعداد الحسابات الهيكلية',
      category: 'إنشائي',
      estimatedDuration: 4,
      priority: 'عالية',
      requiresApproval: true,
      assignToRole: 'مهندس إنشائي',
      dependencies: ['TSK-004'],
      outputs: ['تقرير المراجعة الإنشائية', 'الحسابات الإنشائية'],
      isActive: true,
      displayOrder: 5,
      createdDate: '2025-01-01',
      groups: ['structural', 'large-projects', 'multi-floor'],
    },
    {
      id: '6',
      code: 'TSK-006',
      name: 'تصميم الأنظمة الكهربائية',
      description: 'تصميم الشبكة الكهربائية واللوحات الكهربائية والإنارة',
      category: 'كهرباء',
      estimatedDuration: 3,
      priority: 'متوسطة',
      requiresApproval: true,
      assignToRole: 'مهندس كهرباء',
      dependencies: ['TSK-004'],
      outputs: ['المخططات الكهربائية', 'جدول الأحمال'],
      isActive: true,
      displayOrder: 6,
      createdDate: '2025-01-01',
      groups: ['mep', 'all-projects'],
    },
    {
      id: '7',
      code: 'TSK-007',
      name: 'تصميم أنظمة السباكة',
      description: 'تصميم شبكات المياه والصرف الصحي',
      category: 'سباكة',
      estimatedDuration: 3,
      priority: 'متوسطة',
      requiresApproval: true,
      assignToRole: 'مهندس ميكانيكا',
      dependencies: ['TSK-004'],
      outputs: ['مخططات السباكة', 'جدول التركيبات الصحية'],
      isActive: true,
      displayOrder: 7,
      createdDate: '2025-01-01',
      groups: ['mep', 'all-projects'],
    },
    {
      id: '8',
      code: 'TSK-008',
      name: 'إعداد المخططات النهائية',
      description: 'دمج جميع المخططات وإعداد النسخة النهائية للتسليم',
      category: 'تصميم',
      estimatedDuration: 3,
      priority: 'عالية',
      requiresApproval: true,
      assignToRole: 'مدير المشروع',
      dependencies: ['TSK-004', 'TSK-005', 'TSK-006', 'TSK-007'],
      outputs: ['المخططات النهائية المعتمدة', 'الكشوف الفنية'],
      isActive: true,
      displayOrder: 8,
      createdDate: '2025-01-01',
      groups: ['final-delivery', 'all-projects'],
    },
  ]);

  // البيانات الوهمية للمجموعات
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([
    {
      id: 'all-projects',
      code: 'GRP-001',
      name: 'جميع المشاريع',
      description: 'مهام أساسية تطبق على جميع أنواع المشاريع',
      color: '#3b82f6',
      icon: 'Layers',
      criteria: {},
      tasks: ['1', '2', '4', '6', '7', '8'],
      autoAssign: true,
      isActive: true,
      createdDate: '2025-01-01',
    },
    {
      id: 'residential',
      code: 'GRP-002',
      name: 'المشاريع السكنية',
      description: 'مهام خاصة بالمشاريع السكنية (فلل، عمائر)',
      color: '#10b981',
      icon: 'Home',
      criteria: {
        transactionTypes: ['سكني'],
        projectMainClass: ['سكني'],
      },
      tasks: ['2', '3', '4'],
      autoAssign: true,
      isActive: true,
      createdDate: '2025-01-01',
    },
    {
      id: 'commercial',
      code: 'GRP-003',
      name: 'المشاريع التجارية',
      description: 'مهام خاصة بالمشاريع التجارية',
      color: '#f59e0b',
      icon: 'Building2',
      criteria: {
        transactionTypes: ['تجاري'],
        projectMainClass: ['تجاري'],
      },
      tasks: ['2', '3'],
      autoAssign: true,
      isActive: true,
      createdDate: '2025-01-01',
    },
    {
      id: 'large-projects',
      code: 'GRP-004',
      name: 'المشاريع الكبيرة',
      description: 'مهام إضافية للمشاريع الكبيرة (أكثر من 500 متر)',
      color: '#8b5cf6',
      icon: 'TrendingUp',
      criteria: {
        landArea: {
          min: 500,
        },
      },
      tasks: ['3', '5'],
      autoAssign: true,
      isActive: true,
      createdDate: '2025-01-01',
    },
    {
      id: 'multi-floor',
      code: 'GRP-005',
      name: 'المباني متعددة الأدوار',
      description: 'مهام خاصة بالمباني من 3 أدوار فأكثر',
      color: '#ec4899',
      icon: 'Layers',
      criteria: {
        numberOfFloors: {
          min: 3,
        },
      },
      tasks: ['5'],
      autoAssign: true,
      isActive: true,
      createdDate: '2025-01-01',
    },
    {
      id: 'vip-clients',
      code: 'GRP-006',
      name: 'عملاء VIP',
      description: 'مهام ومتابعة خاصة لعملاء VIP',
      color: '#dc2626',
      icon: 'Award',
      criteria: {
        clientImportance: ['VIP', 'مهم جداً'],
      },
      tasks: [],
      autoAssign: false,
      isActive: true,
      createdDate: '2025-01-01',
    },
  ]);

  const TABS_CONFIG: TabConfig[] = [
    { id: '826-01', number: '826-01', title: 'المهام الأساسية', icon: ClipboardList },
    { id: '826-02', number: '826-02', title: 'مجموعات المهام', icon: FolderTree },
    { id: '826-03', number: '826-03', title: 'المعايير والشروط', icon: Filter },
    { id: '826-04', number: '826-04', title: 'ربط المهام بالمعاملات', icon: Link2 },
    { id: '826-05', number: '826-05', title: 'ربط المهام بالمشاريع', icon: Building2 },
    { id: '826-06', number: '826-06', title: 'ربط المهام بالعملاء', icon: Users },
    { id: '826-07', number: '826-07', title: 'القوالب الجاهزة', icon: FileText },
    { id: '826-08', number: '826-08', title: 'التقارير والتحليلات', icon: BarChart3 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case '826-01':
        return renderBasicTasksTab();
      case '826-02':
        return renderTaskGroupsTab();
      case '826-03':
        return renderCriteriaTab();
      default:
        return (
          <Card className="card-rtl">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {TABS_CONFIG.find(t => t.id === activeTab)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                محتوى هذا التاب قيد التطوير...
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  // تاب المهام الأساسية
  const renderBasicTasksTab = () => (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي المهام</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1e40af' }}>
                  {tasks.length}
                </p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أولوية عالية</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#991b1b' }}>
                  {tasks.filter(t => t.priority === 'عالية').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تتطلب موافقة</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#92400e' }}>
                  {tasks.filter(t => t.requiresApproval).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-yellow-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مهام نشطة</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#166534' }}>
                  {tasks.filter(t => t.isActive).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>متوسط المدة</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#3730a3' }}>
                  {Math.round(tasks.reduce((sum, t) => sum + t.estimatedDuration, 0) / tasks.length)} يوم
                </p>
              </div>
              <Clock className="h-8 w-8 text-indigo-700 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الجدول */}
      <Card className="card-rtl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قائمة المهام الأساسية
            </CardTitle>
            <Button className="button-rtl">
              <Plus className="h-4 w-4" />
              إضافة مهمة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المهمة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المجموعات</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="text-right">
                        <Badge className="font-mono">{task.code}</Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                        {task.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {task.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-mono" style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af' }}>
                          {task.estimatedDuration} يوم
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          style={{
                            fontFamily: 'Tajawal, sans-serif',
                            background: task.priority === 'عالية' ? '#fee2e2' : task.priority === 'متوسطة' ? '#fef3c7' : '#e0e7ff',
                            color: task.priority === 'عالية' ? '#991b1b' : task.priority === 'متوسطة' ? '#92400e' : '#3730a3',
                            border: `1px solid ${task.priority === 'عالية' ? '#fca5a5' : task.priority === 'متوسطة' ? '#fcd34d' : '#a5b4fc'}`
                          }}
                        >
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-[10px]">
                            {task.groups.length}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {task.isActive ? (
                          <Badge style={{ background: '#dcfce7', color: '#166534' }}>نشط</Badge>
                        ) : (
                          <Badge variant="outline" style={{ color: '#6b7280' }}>غير نشط</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
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

  // تاب مجموعات المهام
  const renderTaskGroupsTab = () => (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي المجموعات</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1e40af' }}>
                  {taskGroups.length}
                </p>
              </div>
              <FolderTree className="h-8 w-8 text-blue-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تعيين تلقائي</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#166534' }}>
                  {taskGroups.filter(g => g.autoAssign).length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-green-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مجموعات نشطة</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#92400e' }}>
                  {taskGroups.filter(g => g.isActive).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-yellow-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>متوسط المهام</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#3730a3' }}>
                  {Math.round(taskGroups.reduce((sum, g) => sum + g.tasks.length, 0) / taskGroups.length)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-indigo-700 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الجدول */}
      <Card className="card-rtl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              مجموعات المهام المعرّفة
            </CardTitle>
            <Button className="button-rtl">
              <Plus className="h-4 w-4" />
              إضافة مجموعة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المجموعة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد المهام</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تعيين تلقائي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اللون</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taskGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="text-right">
                      <Badge className="font-mono">{group.code}</Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      {group.name}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>
                      {group.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono" style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af' }}>
                        {group.tasks.length}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {group.autoAssign ? (
                        <Badge style={{ background: '#dcfce7', color: '#166534' }}>
                          <Zap className="h-3 w-3 ml-1" />
                          تلقائي
                        </Badge>
                      ) : (
                        <Badge variant="outline" style={{ color: '#6b7280' }}>يدوي</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2">
                        <div 
                          style={{ 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '6px', 
                            background: group.color,
                            border: '2px solid rgba(0,0,0,0.1)'
                          }} 
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {group.isActive ? (
                        <Badge style={{ background: '#dcfce7', color: '#166534' }}>نشط</Badge>
                      ) : (
                        <Badge variant="outline" style={{ color: '#6b7280' }}>غير نشط</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
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

  // تاب المعايير والشروط
  const renderCriteriaTab = () => (
    <Card className="card-rtl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
          المعايير والشروط المتاحة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {/* معايير المعاملات */}
          <Card style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '2px solid #bae6fd' }}>
            <CardHeader>
              <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#0c4a6e' }}>
                معايير نوع المعاملة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {['سكني', 'تجاري', 'صناعي', 'زراعي', 'إداري', 'خدمي', 'استثماري', 'سياحي'].map((type, idx) => (
                  <li key={idx} className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    {type}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* معايير المشروع */}
          <Card style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '2px solid #bbf7d0' }}>
            <CardHeader>
              <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#14532d' }}>
                معايير المشروع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  التصنيف الرئيسي
                </li>
                <li className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  التصنيف الفرعي
                </li>
                <li className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  عدد الأدوار (حد أدنى/أقصى)
                </li>
                <li className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  مساحة الأرض (حد أدنى/أقصى)
                </li>
                <li className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  قيمة المشروع (حد أدنى/أقصى)
                </li>
                <li className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  الموقع الجغرافي
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* معايير العميل */}
          <Card style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)', border: '2px solid #fde68a' }}>
            <CardHeader>
              <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#713f12' }}>
                معايير العميل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                  <CheckCircle className="h-4 w-4 text-yellow-600" />
                  نوع العميل (فرد/شركة/حكومي)
                </li>
                <li className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                  <CheckCircle className="h-4 w-4 text-yellow-600" />
                  درجة الأهمية (عادي/مهم/VIP)
                </li>
                <li className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                  <CheckCircle className="h-4 w-4 text-yellow-600" />
                  مستوى السرية
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* معايير زمنية */}
          <Card style={{ background: 'linear-gradient(135deg, #fae8ff 0%, #f5d0fe 100%)', border: '2px solid #f0abfc' }}>
            <CardHeader>
              <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#581c87' }}>
                المعايير الزمنية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  تاريخ إنشاء المعاملة (من - إلى)
                </li>
                <li className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  الفترة الزمنية المتوقعة
                </li>
                <li className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  تاريخ الاستحقاق
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen" style={{ paddingTop: '40px', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      {/* هيدر الشاشة */}
      <div
        style={{
          position: 'sticky',
          top: '0',
          zIndex: 10,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '3px solid transparent',
          borderImage: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%) 1',
          padding: '0',
          marginBottom: '0',
          marginTop: '0',
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div 
          className="flex items-center justify-between"
          style={{
            padding: '14px 20px',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(124, 58, 237, 0.02) 100%)'
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              style={{
                padding: '10px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                border: '2px solid rgba(37, 99, 235, 0.2)'
              }}
            >
              <ClipboardList 
                className="h-6 w-6" 
                style={{ 
                  color: '#2563eb',
                  filter: 'drop-shadow(0 1px 2px rgba(37, 99, 235, 0.3))' 
                }} 
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 
                  style={{ 
                    fontFamily: 'Tajawal, sans-serif', 
                    fontWeight: 700, 
                    fontSize: '20px', 
                    margin: 0,
                    background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em'
                  }}
                >
                  إعدادات المهام المتقدمة
                </h1>
                
                <div
                  style={{
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <span 
                    className="font-mono" 
                    style={{ 
                      fontSize: '13px', 
                      fontWeight: 700,
                      color: '#ffffff',
                      letterSpacing: '0.05em'
                    }}
                  >
                    826
                  </span>
                </div>
              </div>
              
              <p 
                style={{ 
                  fontFamily: 'Tajawal, sans-serif', 
                  fontSize: '13px', 
                  color: '#64748b',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%', 
                  background: '#94a3b8',
                  display: 'inline-block'
                }}></span>
                التحكم الكامل في نظام المهام والمجموعات الذكية
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div 
              style={{
                padding: '6px 14px',
                background: 'rgba(37, 99, 235, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(37, 99, 235, 0.15)'
              }}
            >
              <span 
                style={{ 
                  fontFamily: 'Tajawal, sans-serif', 
                  fontSize: '12px', 
                  color: '#475569',
                  fontWeight: 600
                }}
              >
                {TABS_CONFIG.length} تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        {/* السايد بار */}
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* المحتوى */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', padding: '0 20px 20px 20px' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TasksSettings_Complete_826;
