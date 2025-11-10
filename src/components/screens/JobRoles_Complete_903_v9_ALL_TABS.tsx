/**
 * الشاشة 903 - إدارة الأدوار الوظيفية - v9.0 ALL TABS COMPLETE
 * جميع التابات الـ 15 مكتملة بالكامل ✅
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import {
  UserCheck, Users, Shield, Settings, Activity, BarChart3,
  Plus, Edit, Eye, Download, Layers, History, Archive,
  ArrowRightLeft, ClipboardCheck, CheckSquare, Bell, Trash2,
  Copy, FileText, Calendar, Clock, TrendingUp, AlertCircle,
  Search, Filter, X, Check, ChevronRight, UserPlus, UserMinus
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner';

const TABS_CONFIG: TabConfig[] = [
  { id: '903-01', number: '903-01', title: 'نظرة عامة', icon: Activity },
  { id: '903-02', number: '903-02', title: 'جميع الأدوار', icon: UserCheck },
  { id: '903-03', number: '903-03', title: 'إنشاء دور', icon: Plus },
  { id: '903-04', number: '903-04', title: 'تعيين الموظفين', icon: Users },
  { id: '903-05', number: '903-05', title: 'نقل بين الأدوار', icon: ArrowRightLeft },
  { id: '903-06', number: '903-06', title: 'الصلاحيات', icon: Shield },
  { id: '903-07', number: '903-07', title: 'خصائص الأدوار', icon: Settings },
  { id: '903-08', number: '903-08', title: 'التسلسل الوظيفي', icon: Layers },
  { id: '903-09', number: '903-09', title: 'الموظفون', icon: ClipboardCheck },
  { id: '903-10', number: '903-10', title: 'سجل التغييرات', icon: History },
  { id: '903-11', number: '903-11', title: 'التقارير', icon: BarChart3 },
  { id: '903-12', number: '903-12', title: 'قوائم الإسناد', icon: CheckSquare },
  { id: '903-13', number: '903-13', title: 'الإشعارات', icon: Bell },
  { id: '903-14', number: '903-14', title: 'الأرشيف', icon: Archive },
  { id: '903-15', number: '903-15', title: 'الإعدادات', icon: Settings },
];

// ==================== الواجهات ====================

interface JobRole {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  department: string;
  level: number;
  employeesCount: number;
  status: 'active' | 'inactive' | 'archived';
  permissions: number;
  createdDate: string;
  createdBy: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  isArchived: boolean;
}

interface Employee {
  id: string;
  code: string;
  name: string;
  currentRole: string;
  department: string;
  joinDate: string;
  email: string;
  phone: string;
}

interface RoleChange {
  id: string;
  employeeName: string;
  oldRole: string;
  newRole: string;
  changeDate: string;
  changedBy: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'role_change' | 'permission_update' | 'employee_assigned' | 'role_created';
  date: string;
  isRead: boolean;
  relatedRole: string;
}

interface AssignmentList {
  id: string;
  name: string;
  description: string;
  rolesCount: number;
  employeesCount: number;
  createdDate: string;
  isActive: boolean;
}

// ==================== البيانات الوهمية ====================

const MOCK_ROLES: JobRole[] = [
  {
    id: 'ROLE-001', code: 'MGR-GEN', name: 'مدير عام', nameEn: 'General Manager',
    department: 'الإدارة', level: 1, employeesCount: 3, status: 'active',
    permissions: 2450, createdDate: '2024-01-15', createdBy: 'أحمد السعيد',
    description: 'مسؤول عن الإدارة العامة وتوجيه جميع الأقسام',
    responsibilities: ['اتخاذ القرارات الاستراتيجية', 'الإشراف على جميع الأقسام', 'وضع الخطط طويلة المدى'],
    requirements: ['خبرة 15+ سنة', 'شهادة ماجستير في الإدارة', 'مهارات قيادية عالية'],
    isArchived: false
  },
  {
    id: 'ROLE-002', code: 'MGR-PRJ', name: 'مدير مشاريع', nameEn: 'Project Manager',
    department: 'المشاريع', level: 2, employeesCount: 8, status: 'active',
    permissions: 1850, createdDate: '2024-02-10', createdBy: 'محمد العتيبي',
    description: 'إدارة المشاريع الهندسية من البداية للنهاية',
    responsibilities: ['إدارة فرق العمل', 'متابعة الجداول الزمنية', 'التواصل مع العملاء'],
    requirements: ['خبرة 10+ سنوات', 'PMP أو ما يعادلها', 'مهارات تنظيمية قوية'],
    isArchived: false
  },
  {
    id: 'ROLE-003', code: 'ENG-ARC', name: 'مهندس معماري', nameEn: 'Architect',
    department: 'الهندسة', level: 3, employeesCount: 15, status: 'active',
    permissions: 1200, createdDate: '2024-03-05', createdBy: 'سارة الأحمد',
    description: 'تصميم المباني والمخططات المعمارية',
    responsibilities: ['إعداد التصاميم المعمارية', 'مراجعة المخططات', 'التنسيق مع الفرق الهندسية'],
    requirements: ['بكالوريوس عمارة', 'عضوية الهيئة السعودية للمهندسين', 'خبرة 5+ سنوات'],
    isArchived: false
  },
  {
    id: 'ROLE-004', code: 'ENG-STR', name: 'مهندس إنشائي', nameEn: 'Structural Engineer',
    department: 'الهندسة', level: 3, employeesCount: 12, status: 'active',
    permissions: 1150, createdDate: '2024-03-20', createdBy: 'خالد المطيري',
    description: 'تصميم الهياكل الإنشائية والحسابات الإنشائية',
    responsibilities: ['الحسابات الإنشائية', 'مراجعة المخططات الإنشائية', 'الإشراف على التنفيذ'],
    requirements: ['بكالوريوس هندسة مدنية', 'خبرة 5+ سنوات', 'إتقان البرامج الإنشائية'],
    isArchived: false
  },
  {
    id: 'ROLE-005', code: 'ENG-MEP', name: 'مهندس كهروميكانيك', nameEn: 'MEP Engineer',
    department: 'الهندسة', level: 3, employeesCount: 10, status: 'active',
    permissions: 1100, createdDate: '2024-04-01', createdBy: 'فهد الشمري',
    description: 'تصميم أنظمة الكهرباء والميكانيكا والسباكة',
    responsibilities: ['تصميم الأنظمة الكهربائية', 'تصميم أنظمة التكييف', 'تصميم أنظمة السباكة'],
    requirements: ['بكالوريوس هندسة كهربائية أو ميكانيكية', 'خبرة 4+ سنوات', 'معرفة بالأكواد السعودية'],
    isArchived: false
  },
  {
    id: 'ROLE-006', code: 'ACC-MGR', name: 'مدير مالي', nameEn: 'Finance Manager',
    department: 'المالية', level: 2, employeesCount: 5, status: 'active',
    permissions: 1650, createdDate: '2024-04-15', createdBy: 'نورة القحطاني',
    description: 'إدارة العمليات المالية والمحاسبية',
    responsibilities: ['إعداد التقارير المالية', 'إدارة الميزانيات', 'مراجعة القيود المحاسبية'],
    requirements: ['بكالوريوس محاسبة', 'CPA أو CMA', 'خبرة 8+ سنوات'],
    isArchived: false
  },
  {
    id: 'ROLE-007', code: 'ACC-ACC', name: 'محاسب', nameEn: 'Accountant',
    department: 'المالية', level: 4, employeesCount: 7, status: 'active',
    permissions: 850, createdDate: '2024-05-01', createdBy: 'عبدالله الزهراني',
    description: 'القيام بالعمليات المحاسبية اليومية',
    responsibilities: ['تسجيل القيود', 'إعداد التقارير الشهرية', 'متابعة الحسابات'],
    requirements: ['بكالوريوس محاسبة', 'خبرة 3+ سنوات', 'إتقان برامج المحاسبة'],
    isArchived: false
  },
  {
    id: 'ROLE-008', code: 'HR-MGR', name: 'مدير موارد بشرية', nameEn: 'HR Manager',
    department: 'الموارد البشرية', level: 2, employeesCount: 4, status: 'active',
    permissions: 1550, createdDate: '2024-05-15', createdBy: 'ريم العنزي',
    description: 'إدارة شؤون الموظفين والتوظيف',
    responsibilities: ['إدارة التوظيف', 'إدارة الرواتب', 'تطوير السياسات'],
    requirements: ['بكالوريوس موارد بشرية', 'SHRM أو CIPD', 'خبرة 7+ سنوات'],
    isArchived: false
  },
  {
    id: 'ROLE-009', code: 'IT-MGR', name: 'مدير تقنية المعلومات', nameEn: 'IT Manager',
    department: 'تقنية المعلومات', level: 2, employeesCount: 6, status: 'active',
    permissions: 1750, createdDate: '2024-06-01', createdBy: 'عمر الدوسري',
    description: 'إدارة البنية التحتية التقنية والأنظمة',
    responsibilities: ['إدارة الأنظمة', 'الأمن السيبراني', 'الدعم الفني'],
    requirements: ['بكالوريوس حاسب آلي', 'شهادات تقنية', 'خبرة 8+ سنوات'],
    isArchived: false
  },
  {
    id: 'ROLE-010', code: 'MKT-MGR', name: 'مدير تسويق', nameEn: 'Marketing Manager',
    department: 'التسويق', level: 2, employeesCount: 5, status: 'active',
    permissions: 1450, createdDate: '2024-06-15', createdBy: 'لينا السلمي',
    description: 'إدارة الأنشطة التسويقية والعلاقات العامة',
    responsibilities: ['وضع الخطط التسويقية', 'إدارة الحملات', 'تحليل السوق'],
    requirements: ['بكالوريوس تسويق', 'خبرة 6+ سنوات', 'مهارات تواصل ممتازة'],
    isArchived: false
  }
];

const MOCK_EMPLOYEES: Employee[] = [
  { id: 'EMP-001', code: 'E001', name: 'أحمد محمد السعيد', currentRole: 'مدير عام', department: 'الإدارة', joinDate: '2020-01-15', email: 'ahmed.s@company.com', phone: '0501234567' },
  { id: 'EMP-002', code: 'E002', name: 'محمد علي العتيبي', currentRole: 'مدير مشاريع', department: 'المشاريع', joinDate: '2020-03-10', email: 'mohammed.a@company.com', phone: '0501234568' },
  { id: 'EMP-003', code: 'E003', name: 'سارة خالد الأحمد', currentRole: 'مهندس معماري', department: 'الهندسة', joinDate: '2021-02-01', email: 'sara.k@company.com', phone: '0501234569' },
  { id: 'EMP-004', code: 'E004', name: 'خالد فهد المطيري', currentRole: 'مهندس إنشائي', department: 'الهندسة', joinDate: '2021-04-15', email: 'khaled.f@company.com', phone: '0501234570' },
  { id: 'EMP-005', code: 'E005', name: 'فهد عبدالله الشمري', currentRole: 'مهندس كهروميكانيك', department: 'الهندسة', joinDate: '2021-06-01', email: 'fahad.a@company.com', phone: '0501234571' },
  { id: 'EMP-006', code: 'E006', name: 'نورة سعد القحطاني', currentRole: 'مدير مالي', department: 'المالية', joinDate: '2020-07-10', email: 'noura.s@company.com', phone: '0501234572' },
  { id: 'EMP-007', code: 'E007', name: 'عبدالله أحمد الزهراني', currentRole: 'محاسب', department: 'المالية', joinDate: '2022-01-05', email: 'abdullah.a@company.com', phone: '0501234573' },
  { id: 'EMP-008', code: 'E008', name: 'ريم محمد العنزي', currentRole: 'مدير موارد بشرية', department: 'الموارد البشرية', joinDate: '2020-09-01', email: 'reem.m@company.com', phone: '0501234574' },
  { id: 'EMP-009', code: 'E009', name: 'عمر خالد الدوسري', currentRole: 'مدير تقنية المعلومات', department: 'تقنية المعلومات', joinDate: '2021-01-15', email: 'omar.k@company.com', phone: '0501234575' },
  { id: 'EMP-010', code: 'E010', name: 'لينا أحمد السلمي', currentRole: 'مدير تسويق', department: 'التسويق', joinDate: '2021-03-20', email: 'lina.a@company.com', phone: '0501234576' }
];

const MOCK_ROLE_CHANGES: RoleChange[] = [
  { id: 'CHG-001', employeeName: 'أحمد محمد السعيد', oldRole: 'مدير مشاريع', newRole: 'مدير عام', changeDate: '2025-01-05', changedBy: 'محمد العتيبي', reason: 'ترقية لتولي مسؤوليات أكبر', status: 'approved' },
  { id: 'CHG-002', employeeName: 'سارة خالد الأحمد', oldRole: 'مهندس تصميم', newRole: 'مهندس معماري', changeDate: '2025-01-10', changedBy: 'أحمد السعيد', reason: 'استكمال المتطلبات المهنية', status: 'approved' },
  { id: 'CHG-003', employeeName: 'خالد فهد المطيري', oldRole: 'مهندس تصميم', newRole: 'مهندس إنشائي', changeDate: '2025-01-15', changedBy: 'محمد العتيبي', reason: 'تخصص في المجال الإنشائي', status: 'pending' },
  { id: 'CHG-004', employeeName: 'فهد عبدالله الشمري', oldRole: 'مهندس كهرباء', newRole: 'مهندس كهروميكانيك', changeDate: '2025-01-20', changedBy: 'أحمد السعيد', reason: 'توسع في التخصص', status: 'pending' },
  { id: 'CHG-005', employeeName: 'نورة سعد القحطاني', oldRole: 'محاسب رئيسي', newRole: 'مدير مالي', changeDate: '2024-12-15', changedBy: 'أحمد السعيد', reason: 'ترقية لتولي الإدارة المالية', status: 'approved' }
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'NOT-001', title: 'دور جديد تم إنشاؤه', message: 'تم إنشاء دور "مهندس جودة" بنجاح', type: 'role_created', date: '2025-01-25 10:30', isRead: false, relatedRole: 'مهندس جودة' },
  { id: 'NOT-002', title: 'تحديث صلاحيات', message: 'تم تحديث صلاحيات دور "مدير مشاريع"', type: 'permission_update', date: '2025-01-24 14:20', isRead: false, relatedRole: 'مدير مشاريع' },
  { id: 'NOT-003', title: 'موظف جديد تم تعيينه', message: 'تم تعيين "علي أحمد" في دور "مهندس معماري"', type: 'employee_assigned', date: '2025-01-23 09:15', isRead: true, relatedRole: 'مهندس معماري' },
  { id: 'NOT-004', title: 'تغيير دور موظف', message: 'تم نقل "خالد المطيري" من "مهندس تصميم" إلى "مهندس إنشائي"', type: 'role_change', date: '2025-01-22 11:45', isRead: true, relatedRole: 'مهندس إنشائي' },
  { id: 'NOT-005', title: 'دور جديد تم إنشاؤه', message: 'تم إنشاء دور "مدير مبيعات" بنجاح', type: 'role_created', date: '2025-01-21 16:00', isRead: true, relatedRole: 'مدير مبيعات' }
];

const MOCK_ASSIGNMENT_LISTS: AssignmentList[] = [
  { id: 'LIST-001', name: 'قائمة المناصب الإدارية', description: 'جميع المناصب الإدارية العليا', rolesCount: 5, employeesCount: 25, createdDate: '2024-01-15', isActive: true },
  { id: 'LIST-002', name: 'قائمة المهندسين', description: 'جميع التخصصات الهندسية', rolesCount: 8, employeesCount: 62, createdDate: '2024-02-10', isActive: true },
  { id: 'LIST-003', name: 'قائمة الموظفين الماليين', description: 'المحاسبة والمالية', rolesCount: 4, employeesCount: 18, createdDate: '2024-03-05', isActive: true },
  { id: 'LIST-004', name: 'قائمة الدعم الإداري', description: 'موظفو الدعم والخدمات', rolesCount: 6, employeesCount: 28, createdDate: '2024-04-20', isActive: true },
  { id: 'LIST-005', name: 'قائمة القيادات', description: 'المدراء ورؤساء الأقسام', rolesCount: 10, employeesCount: 35, createdDate: '2024-05-15', isActive: false }
];

const JobRoles_Complete_903_v9: React.FC = () => {
  const [activeTab, setActiveTab] = useState('903-01');
  
  // States للإعدادات
  const [autoAssign, setAutoAssign] = useState(false);
  const [notifyOnChange, setNotifyOnChange] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [enableHierarchy, setEnableHierarchy] = useState(true);
  
  // States للنوافذ المنبثقة
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  
  // States للنماذج
  const [newRole, setNewRole] = useState({
    code: '',
    name: '',
    nameEn: '',
    department: '',
    level: '3',
    description: '',
    responsibilities: '',
    requirements: ''
  });
  
  const [assignment, setAssignment] = useState({
    employeeId: '',
    roleId: '',
    startDate: '',
    notes: ''
  });
  
  const [transfer, setTransfer] = useState({
    employeeId: '',
    fromRole: '',
    toRole: '',
    effectiveDate: '',
    reason: ''
  });
  
  // دوال المساعدة
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="text-xs px-1.5 py-0 h-5 bg-green-500 text-white">نشط</Badge>;
      case 'inactive':
        return <Badge className="text-xs px-1.5 py-0 h-5 bg-gray-500 text-white">غير نشط</Badge>;
      case 'archived':
        return <Badge className="text-xs px-1.5 py-0 h-5 bg-orange-500 text-white">مؤرشف</Badge>;
      default:
        return <Badge className="text-xs px-1.5 py-0 h-5 bg-gray-400 text-white">غير معروف</Badge>;
    }
  };
  
  const getChangeStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="text-xs px-1.5 py-0 h-5 bg-green-500 text-white">معتمد</Badge>;
      case 'pending':
        return <Badge className="text-xs px-1.5 py-0 h-5 bg-yellow-500 text-white">قيد الاعتماد</Badge>;
      case 'rejected':
        return <Badge className="text-xs px-1.5 py-0 h-5 bg-red-500 text-white">مرفوض</Badge>;
      default:
        return <Badge className="text-xs px-1.5 py-0 h-5 bg-gray-400 text-white">غير معروف</Badge>;
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'role_created': return <Plus className="h-4 w-4 text-blue-600" />;
      case 'permission_update': return <Shield className="h-4 w-4 text-purple-600" />;
      case 'employee_assigned': return <UserPlus className="h-4 w-4 text-green-600" />;
      case 'role_change': return <ArrowRightLeft className="h-4 w-4 text-orange-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };
  
  // دوال الإجراءات
  const handleCreateRole = () => {
    if (!newRole.code || !newRole.name) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    toast.success(`تم إنشاء الدور "${newRole.name}" بنجاح`);
    setShowRoleDialog(false);
    // Reset form
    setNewRole({
      code: '', name: '', nameEn: '', department: '', level: '3',
      description: '', responsibilities: '', requirements: ''
    });
  };
  
  const handleAssignEmployee = () => {
    if (!assignment.employeeId || !assignment.roleId) {
      toast.error('يرجى اختيار الموظف والدور');
      return;
    }
    toast.success('تم تعيين الموظف في الدور بنجاح');
    setShowAssignDialog(false);
    setAssignment({ employeeId: '', roleId: '', startDate: '', notes: '' });
  };
  
  const handleTransferEmployee = () => {
    if (!transfer.employeeId || !transfer.toRole) {
      toast.error('يرجى إكمال جميع البيانات المطلوبة');
      return;
    }
    toast.success('تم إرسال طلب النقل للاعتماد');
    setShowTransferDialog(false);
    setTransfer({ employeeId: '', fromRole: '', toRole: '', effectiveDate: '', reason: '' });
  };
  
  const handleViewDetails = (role: JobRole) => {
    setSelectedRole(role);
    setShowDetailsDialog(true);
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      // ==================== 903-01: نظرة عامة ====================
      case '903-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة على الأدوار</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />تصدير
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <UserCheck className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-2xl text-blue-600 mb-1">{MOCK_ROLES.length}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الأدوار</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Users className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <p className="text-2xl text-green-600 mb-1">{MOCK_EMPLOYEES.length}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظفون المعينون</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Shield className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                  <p className="text-2xl text-purple-600 mb-1">2,450</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الصلاحيات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Layers className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                  <p className="text-2xl text-orange-600 mb-1">5</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستويات الوظيفية</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <BarChart3 className="h-4 w-4" />
                  توزيع الأدوار حسب الأقسام
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإدارة</span>
                      <span className="text-xs font-mono">10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشاريع</span>
                      <span className="text-xs font-mono">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الهندسة</span>
                      <span className="text-xs font-mono">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المالية</span>
                      <span className="text-xs font-mono">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>أخرى</span>
                      <span className="text-xs font-mono">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // ==================== 903-02: جميع الأدوار ====================
      case '903-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>جميع الأدوار الوظيفية</h2>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">{MOCK_ROLES.length} دور</Badge>
                <Button size="sm" className="h-8 text-xs bg-green-500" onClick={() => setShowRoleDialog(true)}>
                  <Plus className="h-3 w-3 ml-1" />إنشاء دور جديد
                </Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <ScrollArea className="h-[500px]">
                  <Table className="table-rtl dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الدور</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القسم</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستوى</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظفون</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصلاحيات</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_ROLES.map((role) => (
                        <TableRow key={role.id} className="hover:bg-blue-50 transition-colors">
                          <TableCell className="text-right py-2 text-xs font-mono">{role.code}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.name}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.department}</TableCell>
                          <TableCell className="text-right py-2 text-xs">{role.level}</TableCell>
                          <TableCell className="text-right py-2 text-xs">{role.employeesCount}</TableCell>
                          <TableCell className="text-right py-2 text-xs">{role.permissions}</TableCell>
                          <TableCell className="text-right py-2">{getStatusBadge(role.status)}</TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex gap-1 justify-end">
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleViewDetails(role)}>
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <Edit className="h-3 w-3" />
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

      // ==================== 903-03: إنشاء دور ====================
      case '903-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إنشاء دور وظيفي جديد</h2>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Plus className="h-4 w-4" />
                  معلومات الدور الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <InputWithCopy
                    label="كود الدور *"
                    id="role-code"
                    value={newRole.code}
                    onChange={(e) => setNewRole({...newRole, code: e.target.value})}
                    placeholder="مثال: MGR-GEN"
                    required
                    copyable={true}
                    clearable={true}
                  />
                  
                  <InputWithCopy
                    label="اسم الدور بالعربية *"
                    id="role-name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                    placeholder="مثال: مدير عام"
                    required
                    copyable={true}
                    clearable={true}
                  />
                  
                  <InputWithCopy
                    label="اسم الدور بالإنجليزية"
                    id="role-name-en"
                    value={newRole.nameEn}
                    onChange={(e) => setNewRole({...newRole, nameEn: e.target.value})}
                    placeholder="Ex: General Manager"
                    copyable={true}
                    clearable={true}
                  />
                  
                  <SelectWithCopy
                    label="القسم *"
                    id="role-department"
                    value={newRole.department}
                    onChange={(value) => setNewRole({...newRole, department: value})}
                    options={[
                      { value: 'الإدارة', label: 'الإدارة' },
                      { value: 'المشاريع', label: 'المشاريع' },
                      { value: 'الهندسة', label: 'الهندسة' },
                      { value: 'المالية', label: 'المالية' },
                      { value: 'الموارد البشرية', label: 'الموارد البشرية' },
                      { value: 'تقنية المعلومات', label: 'تقنية المعلومات' },
                      { value: 'التسويق', label: 'التسويق' }
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  
                  <SelectWithCopy
                    label="المستوى الوظيفي *"
                    id="role-level"
                    value={newRole.level}
                    onChange={(value) => setNewRole({...newRole, level: value})}
                    options={[
                      { value: '1', label: 'المستوى 1 - إدارة عليا' },
                      { value: '2', label: 'المستوى 2 - إدارة وسطى' },
                      { value: '3', label: 'المستوى 3 - إدارة تنفيذية' },
                      { value: '4', label: 'المستوى 4 - موظف تنفيذي' },
                      { value: '5', label: 'المستوى 5 - موظف مبتدئ' }
                    ]}
                    copyable={true}
                    clearable={false}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileText className="h-4 w-4" />
                  الوصف والمسؤوليات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <TextAreaWithCopy
                  label="وصف الدور"
                  id="role-description"
                  value={newRole.description}
                  onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                  rows={3}
                  placeholder="وصف تفصيلي للدور الوظيفي..."
                  copyable={true}
                  clearable={true}
                />
                
                <TextAreaWithCopy
                  label="المسؤوليات (واحدة في كل سطر)"
                  id="role-responsibilities"
                  value={newRole.responsibilities}
                  onChange={(e) => setNewRole({...newRole, responsibilities: e.target.value})}
                  rows={4}
                  placeholder="اتخاذ القرارات الاستراتيجية&#10;الإشراف على جميع الأقسام&#10;وضع الخطط طويلة المدى"
                  copyable={true}
                  clearable={true}
                />
                
                <TextAreaWithCopy
                  label="المتطلبات (واحدة في كل سطر)"
                  id="role-requirements"
                  value={newRole.requirements}
                  onChange={(e) => setNewRole({...newRole, requirements: e.target.value})}
                  rows={4}
                  placeholder="خبرة 15+ سنة&#10;شهادة ماجستير في الإدارة&#10;مهارات قيادية عالية"
                  copyable={true}
                  clearable={true}
                />
              </CardContent>
            </Card>

            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="outline" className="h-8 text-xs">
                <X className="h-3 w-3 ml-1" />إلغاء
              </Button>
              <Button size="sm" className="h-8 text-xs bg-green-500" onClick={handleCreateRole}>
                <Check className="h-3 w-3 ml-1" />حفظ الدور
              </Button>
            </div>
          </div>
        );

      // ==================== 903-04: تعيين الموظفين ====================
      case '903-04':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>تعيين الموظفين في الأدوار</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500" onClick={() => setShowAssignDialog(true)}>
                <UserPlus className="h-3 w-3 ml-1" />تعيين موظف
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <ScrollArea className="h-[500px]">
                  <Table className="table-rtl dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>كود</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الموظف</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الدور الحالي</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القسم</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانضمام</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البريد</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_EMPLOYEES.map((emp) => (
                        <TableRow key={emp.id} className="hover:bg-blue-50 transition-colors">
                          <TableCell className="text-right py-2 text-xs font-mono">{emp.code}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.name}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.currentRole}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.department}</TableCell>
                          <TableCell className="text-right py-2 text-xs font-mono">{emp.joinDate}</TableCell>
                          <TableCell className="text-right py-2 text-xs font-mono">{emp.email}</TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex gap-1 justify-end">
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <ArrowRightLeft className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

      // ==================== 903-05: نقل بين الأدوار ====================
      case '903-05':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نقل الموظفين بين الأدوار</h2>
              <Button size="sm" className="h-8 text-xs bg-purple-500" onClick={() => setShowTransferDialog(true)}>
                <ArrowRightLeft className="h-3 w-3 ml-1" />طلب نقل جديد
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <ScrollArea className="h-[500px]">
                  <Table className="table-rtl dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظف</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الدور السابق</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الدور الجديد</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>السبب</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>بواسطة</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_ROLE_CHANGES.map((change) => (
                        <TableRow key={change.id} className="hover:bg-purple-50 transition-colors">
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{change.employeeName}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{change.oldRole}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{change.newRole}</TableCell>
                          <TableCell className="text-right py-2 text-xs font-mono">{change.changeDate}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{change.reason}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{change.changedBy}</TableCell>
                          <TableCell className="text-right py-2">{getChangeStatusBadge(change.status)}</TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex gap-1 justify-end">
                              {change.status === 'pending' && (
                                <>
                                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-green-600">
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-red-600">
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

      // ==================== 903-06: الصلاحيات ====================
      case '903-06':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إدارة صلاحيات الأدوار</h2>
              <Button size="sm" className="h-8 text-xs bg-purple-500" onClick={() => setShowPermissionsDialog(true)}>
                <Shield className="h-3 w-3 ml-1" />تعديل الصلاحيات
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Shield className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                  <p className="text-2xl text-purple-600 mb-1">2,450</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الصلاحيات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <CheckSquare className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <p className="text-2xl text-green-600 mb-1">1,820</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصلاحيات المفعلة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <UserCheck className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-2xl text-blue-600 mb-1">{MOCK_ROLES.length}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأدوار التي لها صلاحيات</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Shield className="h-4 w-4" />
                  الصلاحيات حسب الأدوار
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {MOCK_ROLES.slice(0, 7).map((role) => (
                      <div key={role.id} className="p-2 border rounded-lg hover:bg-purple-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.name}</p>
                            <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.department}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">{role.permissions} صلاحية</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={(role.permissions / 2450) * 100} className="h-2" />
                          <span className="text-xs font-mono">{Math.round((role.permissions / 2450) * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      // ==================== 903-07: خصائص الأدوار ====================
      case '903-07':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>خصائص ومواصفات الأدوار</h2>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {MOCK_ROLES.slice(0, 5).map((role) => (
                      <Card key={role.id} className="border-2">
                        <CardHeader className="p-2 pb-1">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <UserCheck className="h-4 w-4" />
                              {role.name}
                            </CardTitle>
                            {getStatusBadge(role.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="p-2 pt-0 space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2 bg-blue-50 rounded">
                              <p className="text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</p>
                              <p className="font-mono">{role.code}</p>
                            </div>
                            <div className="p-2 bg-green-50 rounded">
                              <p className="text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>القسم</p>
                              <p style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.department}</p>
                            </div>
                            <div className="p-2 bg-purple-50 rounded">
                              <p className="text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستوى</p>
                              <p>{role.level}</p>
                            </div>
                            <div className="p-2 bg-orange-50 rounded">
                              <p className="text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظفون</p>
                              <p>{role.employeesCount}</p>
                            </div>
                          </div>
                          
                          <div className="p-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</p>
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.description}</p>
                          </div>
                          
                          <div className="p-2 bg-blue-50 rounded">
                            <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسؤوليات</p>
                            <ul className="text-xs space-y-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {role.responsibilities.map((resp, idx) => (
                                <li key={idx} className="flex items-start gap-1">
                                  <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                  {resp}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="p-2 bg-green-50 rounded">
                            <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتطلبات</p>
                            <ul className="text-xs space-y-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {role.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-1">
                                  <Check className="h-3 w-3 mt-0.5 flex-shrink-0 text-green-600" />
                                  {req}
                                </li>
                              ))}
                            </ul>
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

      // ==================== 903-08: التسلسل الوظيفي ====================
      case '903-08':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الهيكل التنظيمي والتسلسل الوظيفي</h2>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Layers className="h-4 w-4" />
                  المستويات الوظيفية (5 مستويات)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {/* المستوى 1 */}
                    <div className="border-2 border-blue-500 rounded-lg p-3 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-500 text-white">المستوى 1</Badge>
                        <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإدارة العليا</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {MOCK_ROLES.filter(r => r.level === 1).map((role) => (
                          <div key={role.id} className="p-2 bg-white border rounded flex items-center justify-between">
                            <div>
                              <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.name}</p>
                              <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.department}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">{role.employeesCount} موظف</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* المستوى 2 */}
                    <div className="border-2 border-green-500 rounded-lg p-3 bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-500 text-white">المستوى 2</Badge>
                        <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإدارة الوسطى</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {MOCK_ROLES.filter(r => r.level === 2).map((role) => (
                          <div key={role.id} className="p-2 bg-white border rounded">
                            <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.name}</p>
                            <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.department}</p>
                            <Badge variant="outline" className="text-xs mt-1">{role.employeesCount} موظف</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* المستوى 3 */}
                    <div className="border-2 border-purple-500 rounded-lg p-3 bg-purple-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-purple-500 text-white">المستوى 3</Badge>
                        <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإدارة التنفيذية</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {MOCK_ROLES.filter(r => r.level === 3).map((role) => (
                          <div key={role.id} className="p-2 bg-white border rounded">
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.name}</p>
                            <p className="text-[10px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.department}</p>
                            <Badge variant="outline" className="text-[10px] mt-1">{role.employeesCount}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* المستوى 4 */}
                    <div className="border-2 border-orange-500 rounded-lg p-3 bg-orange-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-orange-500 text-white">المستوى 4</Badge>
                        <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>موظف تنفيذي</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {MOCK_ROLES.filter(r => r.level === 4).map((role) => (
                          <div key={role.id} className="p-2 bg-white border rounded text-center">
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.name}</p>
                            <Badge variant="outline" className="text-[10px] mt-1">{role.employeesCount}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      // ==================== 903-09: الموظفون ====================
      case '903-09':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة جميع الموظفين وأدوارهم</h2>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">{MOCK_EMPLOYEES.length} موظف</Badge>
                <Button size="sm" className="h-8 text-xs bg-blue-500">
                  <Download className="h-3 w-3 ml-1" />تصدير القائمة
                </Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <ScrollArea className="h-[500px]">
                  <Table className="table-rtl dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الموظف</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الدور</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القسم</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانضمام</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البريد الإلكتروني</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الهاتف</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_EMPLOYEES.map((emp) => (
                        <TableRow key={emp.id} className="hover:bg-blue-50 transition-colors">
                          <TableCell className="text-right py-2 text-xs font-mono">{emp.code}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.name}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.currentRole}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.department}</TableCell>
                          <TableCell className="text-right py-2 text-xs font-mono">{emp.joinDate}</TableCell>
                          <TableCell className="text-right py-2 text-xs font-mono">{emp.email}</TableCell>
                          <TableCell className="text-right py-2 text-xs font-mono" dir="ltr">{emp.phone}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      // ==================== 903-10: سجل التغييرات ====================
      case '903-10':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل التغييرات والتعديلات</h2>
              <Button size="sm" className="h-8 text-xs bg-gray-500">
                <Download className="h-3 w-3 ml-1" />تصدير السجل
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {MOCK_ROLE_CHANGES.map((change) => (
                      <div key={change.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <ArrowRightLeft className="h-4 w-4 text-purple-600" />
                              <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                نقل الموظف: <span className="font-semibold">{change.employeeName}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                              <span style={{ fontFamily: 'Tajawal, sans-serif' }}>من: {change.oldRole}</span>
                              <ChevronRight className="h-3 w-3" />
                              <span style={{ fontFamily: 'Tajawal, sans-serif' }}>إلى: {change.newRole}</span>
                            </div>
                            <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              السبب: {change.reason}
                            </p>
                          </div>
                          {getChangeStatusBadge(change.status)}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className="font-mono">{change.changeDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <UserCheck className="h-3 w-3" />
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>بواسطة: {change.changedBy}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      // ==================== 903-11: التقارير ====================
      case '903-11':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقارير والإحصائيات</h2>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <FileText className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-2xl text-blue-600 mb-1">12</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير متاح</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Download className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <p className="text-2xl text-green-600 mb-1">45</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تصدير هذا الشهر</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <TrendingUp className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                  <p className="text-2xl text-purple-600 mb-1">28%</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>زيادة عن الشهر السابق</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <BarChart3 className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                  <p className="text-2xl text-orange-600 mb-1">5</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقارير مجدولة</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <BarChart3 className="h-4 w-4" />
                  التقارير المتاحة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'تقرير الأدوار الشامل', desc: 'جميع الأدوار مع التفاصيل الكاملة', icon: FileText, color: 'blue' },
                      { name: 'تقرير الموظفين حسب الأدوار', desc: 'عدد الموظفين في كل دور', icon: Users, color: 'green' },
                      { name: 'تقرير الصلاحيات', desc: 'الصلاحيات المفعلة لكل دور', icon: Shield, color: 'purple' },
                      { name: 'تقرير التسلسل الوظيفي', desc: 'الهيكل التنظيمي الكامل', icon: Layers, color: 'orange' },
                      { name: 'تقرير التغييرات', desc: 'سجل النقل والتعديلات', icon: History, color: 'red' },
                      { name: 'تقرير الأقسام', desc: 'الأدوار موزعة حسب الأقسام', icon: BarChart3, color: 'indigo' }
                    ].map((report, idx) => (
                      <Card key={idx} className="border hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-3">
                          <div className={`flex items-center gap-2 mb-2`}>
                            <div className={`p-2 rounded bg-${report.color}-100`}>
                              <report.icon className={`h-5 w-5 text-${report.color}-600`} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{report.name}</p>
                              <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>{report.desc}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" className="h-7 text-xs flex-1 bg-blue-500">
                              <Eye className="h-3 w-3 ml-1" />عرض
                            </Button>
                            <Button size="sm" className="h-7 text-xs flex-1 bg-green-500">
                              <Download className="h-3 w-3 ml-1" />تصدير
                            </Button>
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

      // ==================== 903-12: قوائم الإسناد ====================
      case '903-12':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>قوائم الإسناد والتعيين</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Plus className="h-3 w-3 ml-1" />قائمة جديدة
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {MOCK_ASSIGNMENT_LISTS.map((list) => (
                      <Card key={list.id} className="border-2 hover:shadow-lg transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckSquare className="h-4 w-4 text-blue-600" />
                                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{list.name}</p>
                              </div>
                              <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>{list.description}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <EnhancedSwitch
                                id={`list-${list.id}`}
                                checked={list.isActive}
                                onCheckedChange={() => {}}
                                size="sm"
                                variant={list.isActive ? 'success' : 'default'}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            <div className="p-2 bg-blue-50 rounded text-center">
                              <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأدوار</p>
                              <p className="text-lg text-blue-600">{list.rolesCount}</p>
                            </div>
                            <div className="p-2 bg-green-50 rounded text-center">
                              <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظفون</p>
                              <p className="text-lg text-green-600">{list.employeesCount}</p>
                            </div>
                            <div className="p-2 bg-purple-50 rounded text-center">
                              <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</p>
                              <p className="text-xs font-mono">{list.createdDate}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="h-7 text-xs flex-1">
                              <Eye className="h-3 w-3 ml-1" />عرض
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs flex-1">
                              <Edit className="h-3 w-3 ml-1" />تعديل
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs flex-1">
                              <Copy className="h-3 w-3 ml-1" />نسخ
                            </Button>
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

      // ==================== 903-13: الإشعارات ====================
      case '903-13':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإشعارات والتنبيهات</h2>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs bg-red-100 text-red-700">
                  {MOCK_NOTIFICATIONS.filter(n => !n.isRead).length} غير مقروء
                </Badge>
                <Button size="sm" className="h-8 text-xs bg-blue-500">
                  <Check className="h-3 w-3 ml-1" />تحديد الكل كمقروء
                </Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {MOCK_NOTIFICATIONS.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${!notif.isRead ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded ${!notif.isRead ? 'bg-white' : 'bg-gray-100'}`}>
                            {getNotificationIcon(notif.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className={`text-sm ${!notif.isRead ? 'font-semibold' : ''}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {notif.title}
                              </p>
                              {!notif.isRead && (
                                <Badge className="text-xs bg-red-500 text-white">جديد</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {notif.message}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span className="font-mono">{notif.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <UserCheck className="h-3 w-3" />
                                <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{notif.relatedRole}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      // ==================== 903-14: الأرشيف ====================
      case '903-14':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأدوار المؤرشفة</h2>
              <Badge variant="outline" className="text-xs">0 دور مؤرشف</Badge>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <div className="flex flex-col items-center justify-center h-[500px]">
                  <Archive className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-lg text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    لا توجد أدوار مؤرشفة
                  </p>
                  <p className="text-sm text-gray-500 text-center max-w-md" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    يمكنك أرشفة الأدوار غير المستخدمة أو القديمة للاحتفاظ بها دون ظهورها في القوائم النشطة
                  </p>
                  <Button size="sm" className="h-8 text-xs bg-gray-500 mt-4">
                    <Archive className="h-3 w-3 ml-1" />عرض جميع الأدوار
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // ==================== 903-15: الإعدادات ====================
      case '903-15':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الأدوار والصلاحيات</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Check className="h-3 w-3 ml-1" />حفظ التغييرات
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Settings className="h-4 w-4" />
                  إعدادات عامة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="auto-assign"
                  label="التعيين التلقائي"
                  description="تعيين دور افتراضي للموظفين الجدد عند إنشاء حساباتهم"
                  checked={autoAssign}
                  onCheckedChange={setAutoAssign}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="notify-change"
                  label="التنبيه عند التغيير"
                  description="إرسال تنبيه للموظف وللإدارة عند تغيير دوره الوظيفي"
                  checked={notifyOnChange}
                  onCheckedChange={setNotifyOnChange}
                  size="sm"
                  variant="success"
                />
                
                <EnhancedSwitch
                  id="require-approval"
                  label="مطالبة بالاعتماد"
                  description="تتطلب جميع التغييرات اعتماد من الإدارة قبل التنفيذ"
                  checked={requireApproval}
                  onCheckedChange={setRequireApproval}
                  size="sm"
                  variant="warning"
                />
                
                <EnhancedSwitch
                  id="enable-hierarchy"
                  label="تفعيل التسلسل الهرمي"
                  description="تمكين نظام التسلسل الوظيفي بين الأدوار والمستويات"
                  checked={enableHierarchy}
                  onCheckedChange={setEnableHierarchy}
                  size="sm"
                  variant="default"
                />
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <AlertCircle className="h-4 w-4" />
                  إعدادات الأمان
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <strong>تنبيه:</strong> تغيير إعدادات الأمان قد يؤثر على صلاحيات جميع الموظفين
                  </p>
                  <p className="text-xs text-yellow-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    يُنصح بمراجعة التغييرات مع فريق تقنية المعلومات قبل التطبيق
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <UserCheck className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>محتوى التبويب قيد التطوير</p>
              <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التاب: {activeTab}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-903" position="top-right" />
      
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
              <UserCheck 
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
                  إدارة الأدوار الوظيفية
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
                    903
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
                إدارة شاملة للأدوار الوظيفية والصلاحيات
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
                15 تبويباً
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* السايد بار والمحتوى */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', paddingLeft: '16px', paddingRight: '16px' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة تفاصيل الدور */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">تفاصيل الدور الوظيفي</DialogTitle>
            <DialogDescription className="dialog-description">
              معلومات كاملة عن الدور ومتطلباته ومسؤولياته
            </DialogDescription>
          </DialogHeader>
          
          {selectedRole && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الدور</p>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRole.name}</p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRole.nameEn}</p>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</p>
                  <p className="text-sm font-mono">{selectedRole.code}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>القسم</p>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRole.department}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستوى الوظيفي</p>
                  <p className="text-sm">{selectedRole.level}</p>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</p>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRole.description}</p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسؤوليات</p>
                <ul className="text-sm space-y-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {selectedRole.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-3 bg-green-50 rounded">
                <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتطلبات</p>
                <ul className="text-sm space-y-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {selectedRole.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* نافذة تعيين موظف */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-2xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">تعيين موظف في دور</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            <SelectWithCopy
              label="الموظف *"
              id="assign-employee"
              value={assignment.employeeId}
              onChange={(value) => setAssignment({...assignment, employeeId: value})}
              options={MOCK_EMPLOYEES.map(e => ({ value: e.id, label: `${e.name} - ${e.code}` }))}
              copyable={true}
              clearable={true}
            />
            
            <SelectWithCopy
              label="الدور *"
              id="assign-role"
              value={assignment.roleId}
              onChange={(value) => setAssignment({...assignment, roleId: value})}
              options={MOCK_ROLES.map(r => ({ value: r.id, label: `${r.name} - ${r.department}` }))}
              copyable={true}
              clearable={true}
            />
            
            <InputWithCopy
              label="تاريخ البدء"
              id="assign-start-date"
              type="date"
              value={assignment.startDate}
              onChange={(e) => setAssignment({...assignment, startDate: e.target.value})}
              copyable={true}
              clearable={true}
            />
            
            <TextAreaWithCopy
              label="ملاحظات"
              id="assign-notes"
              value={assignment.notes}
              onChange={(e) => setAssignment({...assignment, notes: e.target.value})}
              rows={3}
              copyable={true}
              clearable={true}
            />
          </div>
          
          <div className="flex gap-2 justify-end mt-4">
            <Button size="sm" variant="outline" onClick={() => setShowAssignDialog(false)}>
              <X className="h-3 w-3 ml-1" />إلغاء
            </Button>
            <Button size="sm" className="bg-blue-500" onClick={handleAssignEmployee}>
              <Check className="h-3 w-3 ml-1" />تعيين
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة نقل موظف */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent className="max-w-2xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">نقل موظف بين الأدوار</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            <SelectWithCopy
              label="الموظف *"
              id="transfer-employee"
              value={transfer.employeeId}
              onChange={(value) => setTransfer({...transfer, employeeId: value})}
              options={MOCK_EMPLOYEES.map(e => ({ value: e.id, label: `${e.name} - ${e.currentRole}` }))}
              copyable={true}
              clearable={true}
            />
            
            <SelectWithCopy
              label="الدور الجديد *"
              id="transfer-to-role"
              value={transfer.toRole}
              onChange={(value) => setTransfer({...transfer, toRole: value})}
              options={MOCK_ROLES.map(r => ({ value: r.id, label: `${r.name} - ${r.department}` }))}
              copyable={true}
              clearable={true}
            />
            
            <InputWithCopy
              label="تاريخ السريان"
              id="transfer-effective-date"
              type="date"
              value={transfer.effectiveDate}
              onChange={(e) => setTransfer({...transfer, effectiveDate: e.target.value})}
              copyable={true}
              clearable={true}
            />
            
            <TextAreaWithCopy
              label="سبب النقل *"
              id="transfer-reason"
              value={transfer.reason}
              onChange={(e) => setTransfer({...transfer, reason: e.target.value})}
              rows={3}
              placeholder="اذكر سبب نقل الموظف لهذا الدور..."
              copyable={true}
              clearable={true}
            />
          </div>
          
          <div className="flex gap-2 justify-end mt-4">
            <Button size="sm" variant="outline" onClick={() => setShowTransferDialog(false)}>
              <X className="h-3 w-3 ml-1" />إلغاء
            </Button>
            <Button size="sm" className="bg-purple-500" onClick={handleTransferEmployee}>
              <ArrowRightLeft className="h-3 w-3 ml-1" />تقديم طلب النقل
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobRoles_Complete_903_v9;
