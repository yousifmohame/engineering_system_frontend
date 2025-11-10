/**
 * الشاشة 902 - إدارة الصلاحيات - تطوير تفصيلي شامل v2.0
 * ================================================================
 * 
 * نظام متكامل لإدارة صلاحيات النظام (2500+ صلاحية):
 * - عرض جميع الصلاحيات في النظام
 * - تصنيف الصلاحيات إلى مجموعات قابلة للتعديل
 * - إسناد صلاحيات منفردة أو مجمعة
 * - إسناد للأدوار الوظيفية (افتراضي)
 * - إسناد لموظفين محددين (بغض النظر عن أدوارهم)
 * - نظام ترقيم موحد للصلاحيات (XXX-YY-ZZZ)
 * - ربط مع شاشة الأدوار الوظيفية (903)
 * - ربط مع شاشة الموظفين (817)
 * - سجل تدقيق شامل للتغييرات
 * - تقارير تفصيلية للصلاحيات
 * 
 * جميع التابات الـ 15 مُطورة بالكامل
 * 
 * التطوير: ديسمبر 2025 - v2.0
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import {
  Shield, Plus, Edit, Trash2, Eye, Download, Upload, CheckCircle,
  Clock, AlertCircle, X, Search, Filter, Calendar, Users, Building,
  Settings, History, Archive, RefreshCw, Printer, Target, Award,
  TrendingUp, Paperclip, Bell, User, UserCheck, Activity, BarChart3,
  FolderOpen, Layers, Lock, Unlock, Key, ShieldCheck, ShieldAlert,
  AlertTriangle, Info, CheckSquare, XSquare, Copy, Save, Send,
  FileText, Monitor, Grid3x3, List, Layout, Command, Flag, Star, Snowflake,
  Timer
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

// مكون العداد التنازلي للصلاحيات المجمدة
const FreezeCountdown: React.FC<{ frozenUntil: string }> = ({ frozenUntil }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(frozenUntil).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [frozenUntil]);

  const isExpiringSoon = timeLeft.days === 0 && timeLeft.hours < 24;

  return (
    <div className={`flex items-center gap-2 p-2 rounded ${isExpiringSoon ? 'bg-red-50 border border-red-200' : 'bg-cyan-50 border border-cyan-200'}`}>
      <Timer className={`h-4 w-4 ${isExpiringSoon ? 'text-red-600' : 'text-cyan-600'}`} />
      <div className="flex gap-1 text-xs font-mono">
        {timeLeft.days > 0 && (
          <div className={`px-2 py-1 rounded ${isExpiringSoon ? 'bg-red-100 text-red-700' : 'bg-cyan-100 text-cyan-700'}`}>
            {timeLeft.days} <span className="text-xs">يوم</span>
          </div>
        )}
        <div className={`px-2 py-1 rounded ${isExpiringSoon ? 'bg-red-100 text-red-700' : 'bg-cyan-100 text-cyan-700'}`}>
          {String(timeLeft.hours).padStart(2, '0')} <span className="text-xs">س</span>
        </div>
        <div className={`px-2 py-1 rounded ${isExpiringSoon ? 'bg-red-100 text-red-700' : 'bg-cyan-100 text-cyan-700'}`}>
          {String(timeLeft.minutes).padStart(2, '0')} <span className="text-xs">د</span>
        </div>
        <div className={`px-2 py-1 rounded ${isExpiringSoon ? 'bg-red-100 text-red-700' : 'bg-cyan-100 text-cyan-700'}`}>
          {String(timeLeft.seconds).padStart(2, '0')} <span className="text-xs">ث</span>
        </div>
      </div>
    </div>
  );
};

// ===== تكوين التابات - 17 تبويب شامل =====
const TABS_CONFIG: TabConfig[] = [
  { id: '902-01', number: '902-01', title: 'نظرة عامة', icon: Activity },
  { id: '902-02', number: '902-02', title: 'جميع الصلاحيات', icon: List },
  { id: '902-03', number: '902-03', title: 'صلاحيات الشاشات', icon: Monitor },
  { id: '902-04', number: '902-04', title: 'صلاحيات التابات', icon: Layout },
  { id: '902-05', number: '902-05', title: 'صلاحيات الحقول', icon: Grid3x3 },
  { id: '902-06', number: '902-06', title: 'صلاحيات الإجراءات', icon: Command },
  { id: '902-07', number: '902-07', title: 'المجموعات', icon: FolderOpen },
  { id: '902-08', number: '902-08', title: 'إسناد للأدوار', icon: UserCheck },
  { id: '902-09', number: '902-09', title: 'إسناد للموظفين', icon: Users },
  { id: '902-10', number: '902-10', title: 'إسناد الصلاحيات', icon: Send },
  { id: '902-11', number: '902-11', title: 'الإسناد المؤقت', icon: Clock },
  { id: '902-12', number: '902-12', title: 'سجل التدقيق', icon: History },
  { id: '902-13', number: '902-13', title: 'التقارير', icon: BarChart3 },
  { id: '902-14', number: '902-14', title: 'الإشعارات', icon: Bell },
  { id: '902-15', number: '902-15', title: 'الأمان', icon: ShieldCheck },
  { id: '902-16', number: '902-16', title: 'الأرشيف', icon: Archive },
  { id: '902-17', number: '902-17', title: 'الإعدادات', icon: Settings },
];

// ===== مستويات الصلاحيات =====
const PERMISSION_LEVELS = [
  { value: 'screen', label: 'صلاحية شاشة', color: 'bg-blue-100 text-blue-700', icon: Monitor },
  { value: 'tab', label: 'صلاحية تاب', color: 'bg-purple-100 text-purple-700', icon: Layout },
  { value: 'field', label: 'صلاحية حقل', color: 'bg-green-100 text-green-700', icon: Grid3x3 },
  { value: 'action', label: 'صلاحية إجراء', color: 'bg-orange-100 text-orange-700', icon: Command },
];

// ===== أنواع الإجراءات =====
const ACTION_TYPES = [
  { value: 'view', label: 'عرض', color: 'bg-blue-100 text-blue-700', icon: Eye },
  { value: 'create', label: 'إضافة', color: 'bg-green-100 text-green-700', icon: Plus },
  { value: 'edit', label: 'تعديل', color: 'bg-yellow-100 text-yellow-700', icon: Edit },
  { value: 'delete', label: 'حذف', color: 'bg-red-100 text-red-700', icon: Trash2 },
  { value: 'print', label: 'طباعة', color: 'bg-purple-100 text-purple-700', icon: Printer },
  { value: 'export', label: 'تصدير', color: 'bg-cyan-100 text-cyan-700', icon: Download },
];

// ===== حالات الصلاحيات =====
const PERMISSION_STATUSES = [
  { value: 'active', label: 'نشطة', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'inactive', label: 'معطلة', color: 'bg-gray-100 text-gray-700', icon: XSquare },
  { value: 'frozen', label: 'مجمدة', color: 'bg-cyan-100 text-cyan-700', icon: Lock },
  { value: 'restricted', label: 'مقيدة', color: 'bg-red-100 text-red-700', icon: Lock },
  { value: 'pending', label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
];

// ===== مجموعات الصلاحيات =====
const PERMISSION_GROUPS = [
  { id: 'GRP-001', name: 'إدارة المعاملات', screens: ['286', '700', '701'], permissions: 450, color: 'blue' },
  { id: 'GRP-002', name: 'إدارة العملاء', screens: ['123', '194', '300'], permissions: 220, color: 'green' },
  { id: 'GRP-003', name: 'الموارد البشرية', screens: ['817', '816', '823', '842'], permissions: 380, color: 'purple' },
  { id: 'GRP-004', name: 'المالية والحسابات', screens: ['222', '850', '815'], permissions: 290, color: 'emerald' },
  { id: 'GRP-005', name: 'المشاريع والعقود', screens: ['814', '871', '927'], permissions: 340, color: 'orange' },
  { id: 'GRP-006', name: 'التقارير والطباعة', screens: ['831', '832', '833'], permissions: 180, color: 'cyan' },
  { id: 'GRP-007', name: 'الإعدادات والنظام', screens: ['901', '902', '903', '925', '990', '999'], permissions: 420, color: 'pink' },
];

// ===== الشاشات في النظام =====
const SYSTEM_SCREENS = [
  { id: '100', name: 'لوحة التحكم', permissions: 15, category: 'dashboard' },
  { id: '286', name: 'إدارة المعاملات', permissions: 45, category: 'transactions' },
  { id: '817', name: 'إدارة الموظفين', permissions: 38, category: 'hr' },
  { id: '816', name: 'الرواتب والأتعاب', permissions: 32, category: 'finance' },
  { id: '814', name: 'إدارة العقود', permissions: 28, category: 'contracts' },
  { id: '815', name: 'عروض الأسعار', permissions: 25, category: 'finance' },
  { id: '822', name: 'إدارة المساحين', permissions: 22, category: 'engineering' },
  { id: '823', name: 'عقود الموظفين', permissions: 30, category: 'hr' },
  { id: '902', name: 'إدارة الصلاحيات', permissions: 40, category: 'settings' },
  { id: '903', name: 'الأدوار الوظيفية', permissions: 35, category: 'hr' },
];

// ===== بيانات تجريبية للصلاحيات =====
const SAMPLE_PERMISSIONS = [
  {
    id: 'PERM-286-01-001',
    code: '286-01-001',
    name: 'عرض شاشة المعاملات',
    description: 'صلاحية الدخول إلى شاشة إدارة المعاملات الرئيسية',
    level: 'screen',
    screenId: '286',
    screenName: 'إدارة المعاملات',
    tabId: null,
    tabName: null,
    actionType: 'view',
    status: 'frozen',
    frozenType: 'temporary',
    frozenDate: '2025-01-15',
    frozenUntil: '2025-02-15',
    frozenBy: 'مدير النظام',
    frozenReason: 'صيانة طارئة على قاعدة البيانات',
    assignedToRoles: ['ROLE-001', 'ROLE-002'],
    assignedToEmployees: [],
    createdDate: '2024-01-01',
    lastModified: '2025-01-10',
    modifiedBy: 'مدير النظام',
  },
  {
    id: 'PERM-286-05-003',
    code: '286-05-003',
    name: 'تعديل معلومات العميل',
    description: 'صلاحية تعديل بيانات العميل في تاب معلومات العميل',
    level: 'field',
    screenId: '286',
    screenName: 'إدارة المعاملات',
    tabId: '286-05',
    tabName: 'معلومات العميل',
    actionType: 'edit',
    status: 'active',
    assignedToRoles: ['ROLE-001'],
    assignedToEmployees: ['817-00123'],
    createdDate: '2024-01-01',
    lastModified: '2025-01-15',
    modifiedBy: 'مدير HR',
  },
  {
    id: 'PERM-817-01-001',
    code: '817-01-001',
    name: 'عرض شاشة الموظفين',
    description: 'صلاحية الدخول إلى شاشة إدارة الموظفين',
    level: 'screen',
    screenId: '817',
    screenName: 'إدارة الموظفين',
    tabId: null,
    tabName: null,
    actionType: 'view',
    status: 'active',
    assignedToRoles: ['ROLE-001', 'ROLE-003'],
    assignedToEmployees: [],
    createdDate: '2024-01-01',
    lastModified: '2025-01-12',
    modifiedBy: 'مدير النظام',
  },
  {
    id: 'PERM-817-03-015',
    code: '817-03-015',
    name: 'حذف موظف',
    description: 'صلاحية حذف سجل موظف من النظام',
    level: 'action',
    screenId: '817',
    screenName: 'إدارة الموظفين',
    tabId: '817-03',
    tabName: 'إدارة الموظفين',
    actionType: 'delete',
    status: 'restricted',
    assignedToRoles: ['ROLE-001'],
    assignedToEmployees: [],
    createdDate: '2024-01-01',
    lastModified: '2025-01-08',
    modifiedBy: 'مدير الأمان',
  },
  {
    id: 'PERM-814-01-001',
    code: '814-01-001',
    name: 'عرض شاشة العقود',
    description: 'صلاحية الدخول إلى شاشة إدارة العقود',
    level: 'screen',
    screenId: '814',
    screenName: 'إدارة العقود',
    tabId: null,
    tabName: null,
    actionType: 'view',
    status: 'active',
    assignedToRoles: ['ROLE-001', 'ROLE-002', 'ROLE-005'],
    assignedToEmployees: [],
    createdDate: '2024-01-05',
    lastModified: '2025-01-11',
    modifiedBy: 'مدير العقود',
  },
  {
    id: 'PERM-817-03-016',
    code: '817-03-016',
    name: 'حذف موظف (بيانات)',
    description: 'صلاحية حذف سجل موظف من النظام - إدارة البيانات',
    level: 'action',
    screenId: '817',
    screenName: 'إدارة الموظفين',
    tabId: '817-03',
    tabName: 'إدارة البيانات',
    actionType: 'delete',
    status: 'frozen',
    frozenType: 'permanent',
    frozenDate: '2025-01-10',
    frozenUntil: null,
    frozenBy: 'مدير الأمان',
    frozenReason: 'صلاحية خطيرة - تجميد دائم لحين مراجعة سياسة الأمان',
    assignedToRoles: ['ROLE-001'],
    assignedToEmployees: [],
    createdDate: '2024-01-01',
    lastModified: '2025-01-10',
    modifiedBy: 'مدير الأمان',
  },
  {
    id: 'PERM-222-05-008',
    code: '222-05-008',
    name: 'تعديل الحسابات المالية',
    description: 'صلاحية تعديل الحسابات في النظام المالي',
    level: 'field',
    screenId: '222',
    screenName: 'المحاسبة العامة',
    tabId: '222-05',
    tabName: 'الحسابات',
    actionType: 'edit',
    status: 'frozen',
    frozenType: 'temporary',
    frozenDate: '2025-01-12',
    frozenUntil: '2025-01-31',
    frozenBy: 'المدير المالي',
    frozenReason: 'إجراء مراجعة مالية ربع سنوية',
    assignedToRoles: ['ROLE-001', 'ROLE-004'],
    assignedToEmployees: ['817-00124'],
    createdDate: '2024-01-01',
    lastModified: '2025-01-12',
    modifiedBy: 'المدير المالي',
  },
];

// ===== سجل التدقيق =====
const AUDIT_LOG = [
  {
    id: 'AUD-001',
    action: 'إسناد صلاحية',
    permissionCode: '286-05-003',
    permissionName: 'تعديل معلومات العميل',
    target: 'موظف: أحمد محمد علي (817-00123)',
    performedBy: 'مدير HR',
    timestamp: '2025-01-15 14:30:22',
    details: 'إسناد صلاحية خاصة للموظف لمدة شهر',
  },
  {
    id: 'AUD-002',
    action: 'تعديل صلاحية',
    permissionCode: '817-03-015',
    permissionName: 'حذف موظف',
    target: 'الصلاحية نفسها',
    performedBy: 'مدير الأمان',
    timestamp: '2025-01-08 10:15:45',
    details: 'تغيير الحالة من نشطة إلى مقيدة',
  },
];

// ===== بيانات الموظفين للإسناد =====
const EMPLOYEES_FOR_ASSIGNMENT = [
  { id: 'EMP-001', code: '817-00123', name: 'أحمد محمد علي', department: 'الموارد البشرية', position: 'مدير موارد بشرية', email: 'ahmed@company.sa', phone: '0501234567', currentPermissions: 245 },
  { id: 'EMP-002', code: '817-00124', name: 'خالد عبدالله السعيد', department: 'المالية', position: 'محاسب رئيسي', email: 'khaled@company.sa', phone: '0501234568', currentPermissions: 187 },
  { id: 'EMP-003', code: '817-00125', name: 'محمد سعد القحطاني', department: 'المشاريع', position: 'مهندس مشاريع', email: 'mohammed@company.sa', phone: '0501234569', currentPermissions: 198 },
  { id: 'EMP-004', code: '817-00126', name: 'سارة أحمد المطيري', department: 'العلاقات العامة', position: 'مسؤولة علاقات', email: 'sarah@company.sa', phone: '0501234570', currentPermissions: 134 },
  { id: 'EMP-005', code: '817-00127', name: 'فهد عبدالعزيز العتيبي', department: 'تقنية المعلومات', position: 'مطور رئيسي', email: 'fahd@company.sa', phone: '0501234571', currentPermissions: 312 },
  { id: 'EMP-006', code: '817-00128', name: 'نورة محمد الدوسري', department: 'خدمة العملاء', position: 'مديرة خدمة عملاء', email: 'noura@company.sa', phone: '0501234572', currentPermissions: 156 },
  { id: 'EMP-007', code: '817-00129', name: 'عبدالله فيصل الشمري', department: 'المشتريات', position: 'مدير مشتريات', email: 'abdullah@company.sa', phone: '0501234573', currentPermissions: 178 },
  { id: 'EMP-008', code: '817-00130', name: 'منى خالد الحربي', department: 'التسويق', position: 'أخصائية تسويق', email: 'mona@company.sa', phone: '0501234574', currentPermissions: 145 },
];

// ===== سجل الصلاحيات المسندة =====
const ASSIGNED_PERMISSIONS_HISTORY = [
  { id: 'ASG-001', employee: 'أحمد محمد علي', employeeCode: '817-00123', permissionsCount: 15, type: 'منفردة', assignedBy: 'مدير النظام', assignedDate: '2025-01-15 14:30', startDate: '2025-01-15', endDate: '2025-02-15', status: 'نشط', reason: 'مهام مؤقتة لمشروع خاص', notified: true },
  { id: 'ASG-002', employee: 'خالد عبدالله السعيد', employeeCode: '817-00124', permissionsCount: 8, type: 'مجموعة', assignedBy: 'مدير الموارد البشرية', assignedDate: '2025-01-14 10:15', startDate: '2025-01-14', endDate: null, status: 'نشط', reason: 'ترقية إلى منصب محاسب رئيسي', notified: true },
  { id: 'ASG-003', employee: 'محمد سعد القحطاني', employeeCode: '817-00125', permissionsCount: 22, type: 'منفردة', assignedBy: 'مدير المشاريع', assignedDate: '2025-01-13 16:45', startDate: '2025-01-13', endDate: '2025-03-13', status: 'نشط', reason: 'الإشراف على مشروع البرج الجديد', notified: true },
  { id: 'ASG-004', employee: 'سارة أحمد المطيري', employeeCode: '817-00126', permissionsCount: 12, type: 'مجموعة', assignedBy: 'مدير العلاقات العامة', assignedDate: '2025-01-12 09:30', startDate: '2025-01-12', endDate: null, status: 'نشط', reason: 'تحديث صلاحيات الدور الوظيفي', notified: true },
  { id: 'ASG-005', employee: 'فهد عبدالعزيز العتيبي', employeeCode: '817-00127', permissionsCount: 45, type: 'منفردة', assignedBy: 'مدير تقنية المعلومات', assignedDate: '2025-01-11 11:00', startDate: '2025-01-11', endDate: '2025-06-11', status: 'نشط', reason: 'تطوير وصيانة النظام', notified: true },
  { id: 'ASG-006', employee: 'نورة محمد الدوسري', employeeCode: '817-00128', permissionsCount: 18, type: 'مجموعة', assignedBy: 'مدير خدمة العملاء', assignedDate: '2025-01-10 14:20', startDate: '2025-01-10', endDate: '2025-04-10', status: 'نشط', reason: 'حملة خدمة عملاء موسمية', notified: true },
  { id: 'ASG-007', employee: 'عبدالله فيصل الشمري', employeeCode: '817-00129', permissionsCount: 10, type: 'منفردة', assignedBy: 'المدير المالي', assignedDate: '2025-01-09 08:45', startDate: '2025-01-09', endDate: null, status: 'منتهي', reason: 'صلاحيات مشتريات مؤقتة', notified: true },
  { id: 'ASG-008', employee: 'منى خالد الحربي', employeeCode: '817-00130', permissionsCount: 14, type: 'مجموعة', assignedBy: 'مدير التسويق', assignedDate: '2025-01-08 15:30', startDate: '2025-01-08', endDate: '2025-07-08', status: 'نشط', reason: 'حملة تسويقية جديدة', notified: true },
];

// ===== الفترات الزمنية المحددة مسبقاً =====
const PREDEFINED_PERIODS = [
  { value: '1-week', label: 'أسبوع واحد (7 أيام)', days: 7, icon: Clock },
  { value: '2-weeks', label: 'أسبوعين (14 يوم)', days: 14, icon: Clock },
  { value: '1-month', label: 'شهر واحد (30 يوم)', days: 30, icon: Calendar },
  { value: '2-months', label: 'شهرين (60 يوم)', days: 60, icon: Calendar },
  { value: '3-months', label: '3 أشهر (90 يوم)', days: 90, icon: Calendar },
  { value: '6-months', label: '6 أشهر (180 يوم)', days: 180, icon: Calendar },
  { value: '1-year', label: 'سنة واحدة (365 يوم)', days: 365, icon: Calendar },
  { value: 'custom', label: 'فترة مخصصة', days: 0, icon: Settings },
];

// ===== الإسنادات المؤقتة النشطة =====
const TEMPORARY_ASSIGNMENTS = [
  {
    id: 'TMP-001',
    assignmentNumber: 'TMP-2025-001',
    assignmentType: 'صلاحيات',
    targetType: 'موظف',
    targetName: 'أحمد محمد علي',
    targetCode: '817-00123',
    itemsCount: 15,
    itemsList: ['286-01-001', '286-02-003', '817-01-001', '814-03-015', '700-05-022'],
    period: '3 أشهر',
    startDate: '2025-01-15',
    endDate: '2025-04-15',
    daysRemaining: 90,
    status: 'نشط',
    autoRenew: false,
    renewCount: 0,
    assignedBy: 'مدير النظام',
    assignedDate: '2025-01-15 09:30',
    reason: 'الإشراف على مشروع تطوير النظام الجديد',
    notifyBefore: 7,
    lastNotified: null,
  },
  {
    id: 'TMP-002',
    assignmentNumber: 'TMP-2025-002',
    assignmentType: 'دور وظيفي',
    targetType: 'موظف',
    targetName: 'خالد عبدالله السعيد',
    targetCode: '817-00124',
    itemsCount: 1,
    itemsList: ['مدير مالي مؤقت'],
    period: '1 شهر',
    startDate: '2025-01-10',
    endDate: '2025-02-10',
    daysRemaining: 26,
    status: 'نشط',
    autoRenew: true,
    renewCount: 2,
    assignedBy: 'المدير التنفيذي',
    assignedDate: '2025-01-10 11:00',
    reason: 'غياب المدير المالي الأساسي',
    notifyBefore: 3,
    lastNotified: null,
  },
  {
    id: 'TMP-003',
    assignmentNumber: 'TMP-2025-003',
    assignmentType: 'صلاحيات',
    targetType: 'موظف',
    targetName: 'محمد سعد القحطاني',
    targetCode: '817-00125',
    itemsCount: 8,
    itemsList: ['814-01-001', '814-02-005', '815-03-012', '816-01-003'],
    period: '2 أسبوع',
    startDate: '2025-01-12',
    endDate: '2025-01-26',
    daysRemaining: 11,
    status: 'قريب الانتهاء',
    autoRenew: false,
    renewCount: 0,
    assignedBy: 'مدير المشاريع',
    assignedDate: '2025-01-12 14:20',
    reason: 'مهام مراجعة عقود خاصة',
    notifyBefore: 5,
    lastNotified: '2025-01-13 10:00',
  },
  {
    id: 'TMP-004',
    assignmentNumber: 'TMP-2025-004',
    assignmentType: 'دور وظيفي',
    targetType: 'موظف',
    targetName: 'سارة أحمد المطيري',
    targetCode: '817-00126',
    itemsCount: 1,
    itemsList: ['مسؤول علاقات عامة كبير'],
    period: '6 أشهر',
    startDate: '2024-11-01',
    endDate: '2025-05-01',
    daysRemaining: 106,
    status: 'نشط',
    autoRenew: true,
    renewCount: 0,
    assignedBy: 'مدير الموارد البشرية',
    assignedDate: '2024-11-01 08:00',
    reason: 'ترقية تجريبية',
    notifyBefore: 14,
    lastNotified: null,
  },
  {
    id: 'TMP-005',
    assignmentNumber: 'TMP-2025-005',
    assignmentType: 'صلاحيات',
    targetType: 'موظف',
    targetName: 'فهد عبدالعزيز العتيبي',
    targetCode: '817-00127',
    itemsCount: 25,
    itemsList: ['999-01-001', '990-02-003', '902-05-015', '903-01-002'],
    period: '1 سنة',
    startDate: '2024-10-01',
    endDate: '2025-10-01',
    daysRemaining: 256,
    status: 'نشط',
    autoRenew: false,
    renewCount: 0,
    assignedBy: 'مدير تقنية المعلومات',
    assignedDate: '2024-10-01 10:30',
    reason: 'صلاحيات النظام المتقدمة للتطوير',
    notifyBefore: 30,
    lastNotified: null,
  },
  {
    id: 'TMP-006',
    assignmentNumber: 'TMP-2025-006',
    assignmentType: 'صلاحيات',
    targetType: 'موظف',
    targetName: 'نورة محمد الدوسري',
    targetCode: '817-00128',
    itemsCount: 12,
    itemsList: ['300-01-001', '194-02-005', '123-03-008'],
    period: 'فترة مخصصة',
    startDate: '2025-01-05',
    endDate: '2025-01-20',
    daysRemaining: 5,
    status: 'قريب الانتهاء',
    autoRenew: false,
    renewCount: 0,
    assignedBy: 'مدير خدمة العملاء',
    assignedDate: '2025-01-05 13:15',
    reason: 'حملة خدمة عملاء موسمية',
    notifyBefore: 3,
    lastNotified: '2025-01-14 09:00',
  },
  {
    id: 'TMP-007',
    assignmentNumber: 'TMP-2025-007',
    assignmentType: 'دور وظيفي',
    targetType: 'موظف',
    targetName: 'عبدالله فيصل الشمري',
    targetCode: '817-00129',
    itemsCount: 1,
    itemsList: ['مراجع معاملات أول'],
    period: '2 شهر',
    startDate: '2024-12-01',
    endDate: '2025-02-01',
    daysRemaining: 17,
    status: 'نشط',
    autoRenew: true,
    renewCount: 1,
    assignedBy: 'مدير المراجعة',
    assignedDate: '2024-12-01 09:00',
    reason: 'تغطية الموظف المجاز',
    notifyBefore: 7,
    lastNotified: '2025-01-08 10:30',
  },
  {
    id: 'TMP-008',
    assignmentNumber: 'TMP-2025-008',
    assignmentType: 'صلاحيات',
    targetType: 'موظف',
    targetName: 'منى خالد الحربي',
    targetCode: '817-00130',
    itemsCount: 18,
    itemsList: ['890-01-001', '890-02-003', '890-03-005', '890-04-012'],
    period: '3 أشهر',
    startDate: '2025-01-01',
    endDate: '2025-04-01',
    daysRemaining: 76,
    status: 'نشط',
    autoRenew: false,
    renewCount: 0,
    assignedBy: 'مدير التسويق',
    assignedDate: '2025-01-01 10:00',
    reason: 'حملة تسويقية ربع سنوية',
    notifyBefore: 10,
    lastNotified: null,
  },
];

// ===== الأدوار الوظيفية المتاحة =====
const JOB_ROLES_LIST = [
  { id: 'ROLE-001', code: 'ROLE-001', name: 'مدير النظام', permissions: 2567, category: 'إداري', color: 'red' },
  { id: 'ROLE-002', code: 'ROLE-002', name: 'مدير معاملات', permissions: 450, category: 'معاملات', color: 'blue' },
  { id: 'ROLE-003', code: 'ROLE-003', name: 'مراجع معاملات', permissions: 280, category: 'معاملات', color: 'green' },
  { id: 'ROLE-004', code: 'ROLE-004', name: 'محاسب', permissions: 320, category: 'مالي', color: 'emerald' },
  { id: 'ROLE-005', code: 'ROLE-005', name: 'مسؤول موارد بشرية', permissions: 380, category: 'موارد بشرية', color: 'purple' },
  { id: 'ROLE-006', code: 'ROLE-006', name: 'مهندس مشاريع', permissions: 340, category: 'مشاريع', color: 'orange' },
  { id: 'ROLE-007', code: 'ROLE-007', name: 'مسؤول خدمة عملاء', permissions: 180, category: 'عملاء', color: 'cyan' },
  { id: 'ROLE-008', code: 'ROLE-008', name: 'موظف إدخال بيانات', permissions: 120, category: 'عام', color: 'gray' },
];

const PermissionsManagement_Complete_902: React.FC = () => {
  const [activeTab, setActiveTab] = useState('902-01');
  const [permissions, setPermissions] = useState(SAMPLE_PERMISSIONS);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPermission, setSelectedPermission] = useState<any>(null);
  const [showFreezeDialog, setShowFreezeDialog] = useState(false);

  // إحصائيات
  const stats = {
    total: 2567,
    screen: 110,
    tab: 520,
    field: 1237,
    action: 700,
    active: 2450,
    inactive: 117,
    frozen: 3,
    assignedToRoles: 2100,
    assignedToEmployees: 467,
    groups: PERMISSION_GROUPS.length,
  };

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 902-01: نظرة عامة
      case '902-01':
        return (
          <div className="universal-dense-tab-content">
            {/* إحصائيات رئيسية */}
            <div className="dense-stats-grid mb-4">
              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-blue-100 text-blue-600">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.total}</div>
                <div className="dense-stat-label">إجمالي الصلاحيات</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-purple-100 text-purple-600">
                  <Monitor className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.screen}</div>
                <div className="dense-stat-label">صلاحيات الشاشات</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-indigo-100 text-indigo-600">
                  <Layout className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.tab}</div>
                <div className="dense-stat-label">صلاحيات التابات</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-green-100 text-green-600">
                  <Grid3x3 className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.field}</div>
                <div className="dense-stat-label">صلاحيات الحقول</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-orange-100 text-orange-600">
                  <Command className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.action}</div>
                <div className="dense-stat-label">صلاحيات الإجراءات</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-emerald-100 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.active}</div>
                <div className="dense-stat-label">صلاحيات نشطة</div>
              </Card>
            </div>

            <Separator className="my-4" />

            {/* التوزيع حسب المستوى */}
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Layers className="h-4 w-4" />
                  توزيع الصلاحيات حسب المستوى
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {PERMISSION_LEVELS.map((level) => {
                    const count = stats[level.value as keyof typeof stats] as number;
                    const percentage = (count / stats.total) * 100;
                    const LevelIcon = level.icon;
                    
                    return (
                      <div key={level.value} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg ${level.color} flex items-center justify-center`}>
                              <LevelIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-xs font-medium">{level.label}</div>
                              <div className="text-xs text-gray-600">{count} صلاحية</div>
                            </div>
                          </div>
                          <Badge className={level.color}>
                            {percentage.toFixed(1)}%
                          </Badge>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* المجموعات الرئيسية */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FolderOpen className="h-4 w-4" />
                  مجموعات الصلاحيات ({stats.groups})
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  مجموعة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-2">
                  {PERMISSION_GROUPS.map((group) => (
                    <div key={group.id} className="dense-content-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg bg-${group.color}-100 flex items-center justify-center`}>
                            <FolderOpen className={`h-4 w-4 text-${group.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium">{group.name}</div>
                            <div className="text-xs text-gray-600">{group.id}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2">
                        <Badge className={`bg-${group.color}-100 text-${group.color}-700 text-xs`}>
                          {group.permissions} صلاحية
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-700 text-xs">
                          {group.screens.length} شاشة
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 pt-2 border-t">
                        <Button className="dense-action-btn">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button className="dense-action-btn">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button className="dense-action-btn">
                          <Users className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 902-02: جميع الصلاحيات
      case '902-02':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <List className="h-4 w-4" />
                  جميع الصلاحيات ({stats.total})
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-secondary">
                    <Search className="h-3 w-3" />
                    بحث
                  </Button>
                  <Button className="dense-btn dense-btn-secondary">
                    <Filter className="h-3 w-3" />
                    تصفية
                  </Button>
                  <Button className="dense-btn dense-btn-primary">
                    <Plus className="h-3 w-3" />
                    جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800">
                        يحتوي النظام على {stats.total} صلاحية موزعة على {stats.screen} شاشة
                      </span>
                    </div>
                    <Button className="dense-btn dense-btn-secondary">
                      <Download className="h-3 w-3" />
                      تصدير
                    </Button>
                  </div>
                </div>
                
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">
                        <input type="checkbox" className="w-4 h-4" />
                      </TableHead>
                      <TableHead className="text-right">الكود</TableHead>
                      <TableHead className="text-right">اسم الصلاحية</TableHead>
                      <TableHead className="text-right">المستوى</TableHead>
                      <TableHead className="text-right">الشاشة</TableHead>
                      <TableHead className="text-right">الإجراء</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((perm) => {
                      const levelInfo = PERMISSION_LEVELS.find(l => l.value === perm.level);
                      const statusInfo = PERMISSION_STATUSES.find(s => s.value === perm.status);
                      const actionInfo = ACTION_TYPES.find(a => a.value === perm.actionType);
                      
                      return (
                        <TableRow key={perm.id}>
                          <TableCell className="text-right">
                            <input type="checkbox" className="w-4 h-4" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                              {perm.code}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs font-medium">
                            {perm.name}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={levelInfo?.color}>
                              {levelInfo?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {perm.screenName}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={actionInfo?.color}>
                              {actionInfo?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={statusInfo?.color}>
                              {statusInfo?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Button className="dense-action-btn" title="عرض التفاصيل">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button className="dense-action-btn" title="تعديل">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                className="dense-action-btn" 
                                title={perm.status === 'frozen' ? 'إلغاء التجميد' : 'تجميد الصلاحية'}
                                onClick={() => {
                                  setSelectedPermission(perm);
                                  setShowFreezeDialog(true);
                                }}
                              >
                                <Lock className="h-3 w-3" />
                              </Button>
                              <Button className="dense-action-btn" title="إسناد">
                                <UserCheck className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* الصلاحيات المجمدة */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-cyan-600" />
                    الصلاحيات المجمدة ({stats.frozen})
                  </h3>
                  <div className="space-y-2">
                    {permissions.filter(p => p.status === 'frozen').map((perm) => (
                      <Card key={perm.id} className="dense-content-card border-r-4 border-cyan-500">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                                  {perm.code}
                                </Badge>
                                <Badge className="bg-cyan-100 text-cyan-700">
                                  {perm.frozenType === 'temporary' ? 'مجمدة مؤقتاً' : 'مجمدة دائماً'}
                                </Badge>
                                <Badge className={PERMISSION_LEVELS.find(l => l.value === perm.level)?.color}>
                                  {PERMISSION_LEVELS.find(l => l.value === perm.level)?.label}
                                </Badge>
                              </div>
                              <h4 className="text-sm font-medium mb-1">{perm.name}</h4>
                              <p className="text-xs text-gray-600 mb-2">{perm.screenName}</p>
                              <div className="bg-cyan-50 rounded p-2 mb-2">
                                <p className="text-xs text-cyan-900 font-medium mb-1">سبب التجميد:</p>
                                <p className="text-xs text-cyan-800">{perm.frozenReason}</p>
                              </div>
                              
                              {/* العداد التنازلي */}
                              {perm.frozenType === 'temporary' && perm.frozenUntil && (
                                <div className="mb-2">
                                  <p className="text-xs text-gray-600 mb-1">⏰ الوقت المتبقي لإلغاء التجميد التلقائي:</p>
                                  <FreezeCountdown frozenUntil={perm.frozenUntil} />
                                </div>
                              )}
                              
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-600">تاريخ التجميد: </span>
                                  <span className="font-medium">{perm.frozenDate}</span>
                                </div>
                                {perm.frozenUntil && (
                                  <div>
                                    <span className="text-gray-600">إلى: </span>
                                    <span className="font-medium">{perm.frozenUntil}</span>
                                  </div>
                                )}
                                <div>
                                  <span className="text-gray-600">بواسطة: </span>
                                  <span className="font-medium">{perm.frozenBy}</span>
                                </div>
                              </div>
                            </div>
                            <Button 
                              className="dense-btn dense-btn-secondary mr-2"
                              onClick={() => {
                                setSelectedPermission(perm);
                                setShowFreezeDialog(true);
                              }}
                            >
                              <Unlock className="h-3 w-3" />
                              إلغاء
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 902-03: صلاحيات الشاشات
      case '902-03':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Monitor className="h-4 w-4" />
                  صلاحيات الشاشات ({stats.screen} شاشة)
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  إضافة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-3 gap-2">
                  {SYSTEM_SCREENS.map((screen) => {
                    const hasPermission = permissions.some(p => p.screenId === screen.id);
                    
                    return (
                      <div key={screen.id} className="dense-content-card p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-blue-100 text-blue-700 font-mono text-xs">
                            {screen.id}
                          </Badge>
                          {hasPermission ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XSquare className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div className="text-xs font-medium mb-1">{screen.name}</div>
                        <div className="text-xs text-gray-600 mb-2">{screen.permissions} صلاحية</div>
                        <div className="flex items-center gap-1">
                          <Button className="dense-action-btn">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn" title="إسناد">
                            <UserCheck className="h-3 w-3" />
                          </Button>
                          <Button 
                            className="dense-action-btn" 
                            title="تجميد"
                            onClick={() => {
                              setSelectedPermission({
                                code: screen.id + '-01-001',
                                name: 'عرض شاشة ' + screen.name,
                                level: 'screen',
                                screenName: screen.name,
                                status: 'active'
                              });
                              setShowFreezeDialog(true);
                            }}
                          >
                            <Lock className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn" title="تعديل">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* الصلاحيات المجمدة */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-cyan-600" />
                    صلاحيات الشاشات المجمدة ({permissions.filter(p => p.status === 'frozen' && p.level === 'screen').length})
                  </h3>
                  <div className="space-y-2">
                    {permissions.filter(p => p.status === 'frozen' && p.level === 'screen').map((perm) => (
                      <Card key={perm.id} className="dense-content-card border-r-4 border-cyan-500">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">{perm.code}</Badge>
                                <Badge className="bg-cyan-100 text-cyan-700">
                                  {perm.frozenType === 'temporary' ? 'مؤقتاً' : 'دائماً'}
                                </Badge>
                              </div>
                              <h4 className="text-sm font-medium">{perm.name}</h4>
                            </div>
                            <Button className="dense-btn dense-btn-secondary" onClick={() => { setSelectedPermission(perm); setShowFreezeDialog(true); }}>
                              <Unlock className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 902-04: صلاحيات التابات
      case '902-04':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Layout className="h-4 w-4" />
                  صلاحيات التابات ({stats.tab} تاب)
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  إضافة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 mb-3">
                  <div className="flex items-start gap-2 text-xs text-purple-800">
                    <Info className="h-4 w-4 flex-shrink-0" />
                    <div>
                      <strong>صلاحيات التابات:</strong> تحكم في إمكانية عرض تاب محدد داخل شاشة.
                      مثال: صلاحية 286-05-001 تتحكم في عرض تاب "معلومات العميل" في شاشة المعاملات.
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {['286', '817', '814', '815'].map((screenId) => {
                    const screen = SYSTEM_SCREENS.find(s => s.id === screenId);
                    const tabCount = Math.floor(Math.random() * 15) + 10;
                    
                    return (
                      <div key={screenId} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-700 font-mono text-xs">
                              {screenId}
                            </Badge>
                            <span className="text-xs font-medium">{screen?.name}</span>
                          </div>
                          <Badge className="bg-purple-100 text-purple-700 text-xs">
                            {tabCount} تاب
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-1">
                          {Array.from({ length: tabCount }).map((_, i) => {
                            const tabNumber = String(i + 1).padStart(2, '0');
                            const permCode = `${screenId}-${tabNumber}-001`;
                            
                            return (
                              <div 
                                key={i} 
                                className="p-2 bg-gray-50 rounded border text-xs text-center hover:bg-purple-50 hover:border-purple-300 cursor-pointer transition-all"
                                onClick={() => {
                                  setSelectedPermission({
                                    code: permCode,
                                    name: `صلاحية تاب ${tabNumber}`,
                                    level: 'tab',
                                    screenName: screen?.name || '',
                                    status: 'active'
                                  });
                                  setShowFreezeDialog(true);
                                }}
                              >
                                <div className="font-mono text-xs mb-1">{permCode}</div>
                                <CheckCircle className="h-3 w-3 mx-auto text-green-600" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* الصلاحيات المجمدة */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-cyan-600" />
                    صلاحيات التابات المجمدة ({permissions.filter(p => p.status === 'frozen' && p.level === 'tab').length})
                  </h3>
                  <div className="space-y-2">
                    {permissions.filter(p => p.status === 'frozen' && p.level === 'tab').map((perm) => (
                      <Card key={perm.id} className="dense-content-card border-r-4 border-cyan-500">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">{perm.code}</Badge>
                                <Badge className="bg-cyan-100 text-cyan-700">
                                  {perm.frozenType === 'temporary' ? 'مؤقتاً' : 'دائماً'}
                                </Badge>
                              </div>
                              <h4 className="text-sm font-medium">{perm.name}</h4>
                            </div>
                            <Button className="dense-btn dense-btn-secondary" onClick={() => { setSelectedPermission(perm); setShowFreezeDialog(true); }}>
                              <Unlock className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 902-05: صلاحيات الحقول
      case '902-05':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Grid3x3 className="h-4 w-4" />
                  صلاحيات الحقول ({stats.field} حقل)
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  إضافة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200 mb-3">
                  <div className="flex items-start gap-2 text-xs text-green-800">
                    <Info className="h-4 w-4 flex-shrink-0" />
                    <div>
                      <strong>صلاحيات الحقول:</strong> أدق مستوى من التحكم، تتحكم في إمكانية عرض أو تعديل حقل محدد.
                      تُستخدم للتحكم في البيانات الحساسة مثل الرواتب والبيانات الشخصية.
                    </div>
                  </div>
                </div>
                
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الكود</TableHead>
                      <TableHead className="text-right">اسم الحقل</TableHead>
                      <TableHead className="text-right">الشاشة/التاب</TableHead>
                      <TableHead className="text-right">نوع الإجراء</TableHead>
                      <TableHead className="text-right">المُسند إلى</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.filter(p => p.level === 'field').map((perm) => (
                      <TableRow key={perm.id}>
                        <TableCell className="text-right">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {perm.code}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs font-medium">
                          {perm.name}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {perm.screenName} / {perm.tabName}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={ACTION_TYPES.find(a => a.value === perm.actionType)?.color}>
                            {ACTION_TYPES.find(a => a.value === perm.actionType)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {perm.assignedToRoles.length} دور، {perm.assignedToEmployees.length} موظف
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button className="dense-action-btn" title="عرض">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button 
                              className="dense-action-btn" 
                              title="تجميد"
                              onClick={() => {
                                setSelectedPermission(perm);
                                setShowFreezeDialog(true);
                              }}
                            >
                              <Lock className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn" title="تعديل">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // 902-06: صلاحيات الإجراءات
      case '902-06':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Command className="h-4 w-4" />
                  صلاحيات الإجراءات ({stats.action} إجراء)
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  إضافة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-3 gap-2 mb-4">
                  {ACTION_TYPES.map((action) => {
                    const ActionIcon = action.icon;
                    const count = Math.floor(stats.action / ACTION_TYPES.length);
                    
                    return (
                      <div key={action.value} className="dense-content-card p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                            <ActionIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium">{action.label}</div>
                            <div className="text-xs text-gray-600">{count} صلاحية</div>
                          </div>
                        </div>
                        <Button className="dense-btn dense-btn-secondary w-full">
                          <Eye className="h-3 w-3" />
                          عرض الكل
                        </Button>
                      </div>
                    );
                  })}
                </div>
                
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">نوع الإجراء</TableHead>
                      <TableHead className="text-right">عدد الصلاحيات</TableHead>
                      <TableHead className="text-right">نشطة</TableHead>
                      <TableHead className="text-right">مقيدة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ACTION_TYPES.map((action) => {
                      const total = Math.floor(stats.action / ACTION_TYPES.length);
                      const active = Math.floor(total * 0.9);
                      const restricted = total - active;
                      
                      return (
                        <TableRow key={action.value}>
                          <TableCell className="text-right">
                            <Badge className={action.color}>
                              {action.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs font-medium">
                            {total}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              {active}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-red-100 text-red-700 text-xs">
                              {restricted}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Button className="dense-action-btn">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button className="dense-action-btn">
                                <Settings className="h-3 w-3" />
                              </Button>
                            </div>
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

      // 902-07: المجموعات
      case '902-07':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Plus className="h-4 w-4" />
                  إنشاء مجموعة جديدة
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Save className="h-3 w-3" />
                  حفظ
                </Button>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-3">
                  <InputWithCopy
                    label="اسم المجموعة"
                    id="groupName"
                    placeholder="مثال: إدارة المعاملات"
                  />
                  
                  <InputWithCopy
                    label="معرّف المجموعة"
                    id="groupId"
                    placeholder="GRP-008"
                  />
                  
                  <div className="col-span-2">
                    <TextAreaWithCopy
                      label="وصف المجموعة"
                      id="groupDescription"
                      placeholder="وصف تفصيلي للمجموعة..."
                      rows={2}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="compact-text text-gray-700 mb-1 block" style={{ fontWeight: 700, color: '#2563eb' }}>
                      الشاشات المشمولة
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {SYSTEM_SCREENS.slice(0, 10).map((screen) => (
                        <div key={screen.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded border hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all">
                          <input type="checkbox" id={`screen-${screen.id}`} className="w-4 h-4" />
                          <label htmlFor={`screen-${screen.id}`} className="text-xs font-mono cursor-pointer">{screen.id}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* المجموعات الموجودة */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FolderOpen className="h-4 w-4" />
                  المجموعات الموجودة ({PERMISSION_GROUPS.length})
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {PERMISSION_GROUPS.map((group) => (
                    <div key={group.id} className="dense-content-card p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="text-xs bg-gray-100 text-gray-700 font-mono">
                              {group.id}
                            </Badge>
                            <Badge className={`bg-${group.color}-100 text-${group.color}-700 text-xs`}>
                              {group.permissions} صلاحية
                            </Badge>
                          </div>
                          <div className="text-xs font-medium mb-2">{group.name}</div>
                          <div className="flex items-center gap-1 flex-wrap">
                            {group.screens.map((screen) => (
                              <Badge key={screen} className="text-xs bg-blue-50 text-blue-700 font-mono">
                                {screen}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mr-3">
                          <Button className="dense-action-btn">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 902-08: إسناد للأدوار
      case '902-08':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <UserCheck className="h-4 w-4" />
                  إسناد صلاحيات للأدوار الوظيفية
                </h2>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="text-xs text-blue-800">
                      <strong>إسناد الصلاحيات للأدوار:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>يمكن إسناد صلاحية واحدة أو مجموعة صلاحيات لدور وظيفي</li>
                        <li>الصلاحيات المُسندة للدور تنطبق تلقائياً على جميع الموظفين فيه</li>
                        <li>يمكن عرض وإدارة الأدوار من شاشة الأدوار الوظيفية (903)</li>
                        <li>الموظفون الذين لهم الدور سيظهرون في قائمة إسناد المهام</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="dense-grid dense-grid-2 gap-3">
                  <SelectWithCopy
                    label="الدور الوظيفي"
                    id="roleId"
                    options={[
                      { value: '', label: 'اختر الدور الوظيفي' },
                      { value: 'ROLE-001', label: 'مدير النظام' },
                      { value: 'ROLE-002', label: 'مدير المعاملات' },
                      { value: 'ROLE-003', label: 'موظف موارد بشرية' },
                      { value: 'ROLE-004', label: 'محاسب' },
                    ]}
                  />

                  <SelectWithCopy
                    label="مجموعة الصلاحيات"
                    id="permissionGroup"
                    options={[
                      { value: '', label: 'اختر المجموعة' },
                      ...PERMISSION_GROUPS.map(g => ({ value: g.id, label: g.name }))
                    ]}
                  />
                </div>

                <div className="mt-3">
                  <label className="compact-text text-gray-700 mb-2 block" style={{ fontWeight: 700, color: '#2563eb' }}>
                    أو اختر صلاحيات محددة
                  </label>
                  <div className="max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-lg border">
                    <div className="space-y-1">
                      {permissions.slice(0, 15).map((perm) => (
                        <div key={perm.id} className="flex items-center gap-2 p-2 bg-white rounded border hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all">
                          <input type="checkbox" id={`perm-${perm.id}`} className="w-4 h-4" />
                          <label htmlFor={`perm-${perm.id}`} className="text-xs flex-1 cursor-pointer">
                            {perm.name}
                          </label>
                          <Badge className="text-xs bg-gray-100 text-gray-700 font-mono">
                            {perm.code}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button className="dense-btn dense-btn-primary">
                    <Send className="h-3 w-3" />
                    إسناد الصلاحيات
                  </Button>
                  <Button className="dense-btn dense-btn-secondary">
                    <Copy className="h-3 w-3" />
                    نسخ من دور آخر
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* الأدوار وصلاحياتها */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Users className="h-4 w-4" />
                  الأدوار الوظيفية وصلاحياتها
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { id: 'ROLE-001', name: 'مدير النظام', perms: 2567, employees: 2, level: 'تنفيذي' },
                    { id: 'ROLE-002', name: 'مدير المعاملات', perms: 450, employees: 5, level: 'أول' },
                    { id: 'ROLE-003', name: 'موظف موارد بشرية', perms: 380, employees: 3, level: 'متوسط' },
                    { id: 'ROLE-004', name: 'محاسب', perms: 290, employees: 4, level: 'متوسط' },
                  ].map((role) => (
                    <div key={role.id} className="dense-content-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-xs font-medium">{role.name}</div>
                            <div className="text-xs text-gray-600">{role.id} • {role.level}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            {role.perms} صلاحية
                          </Badge>
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            {role.employees} موظف
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 pt-2 border-t">
                        <Button className="dense-btn dense-btn-primary">
                          <Eye className="h-3 w-3" />
                          الصلاحيات
                        </Button>
                        <Button className="dense-action-btn">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button className="dense-action-btn">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 902-09: إسناد للموظفين
      case '902-09':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Users className="h-4 w-4" />
                  إسناد صلاحيات لموظفين محددين
                </h2>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="text-xs text-green-800">
                      <strong>إسناد صلاحيات خاصة للموظفين:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>يمكن إسناد صلاحيات إضافية لموظف محدد بغض النظر عن دوره</li>
                        <li>الصلاحيات الخاصة لا تؤثر على صلاحيات الدور الوظيفي</li>
                        <li>مفيد لإعطاء صلاحيات مؤقتة أو استثنائية</li>
                        <li>يتم تتبع جميع الإسنادات في سجل التدقيق</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="dense-grid dense-grid-2 gap-3">
                  <SelectWithCopy
                    label="الموظف"
                    id="employeeId"
                    options={[
                      { value: '', label: 'اختر الموظف' },
                      { value: '817-00123', label: 'أحمد محمد علي - 817-00123' },
                      { value: '817-00124', label: 'فاطمة خالد - 817-00124' },
                      { value: '817-00125', label: 'سعد عبدالله - 817-00125' },
                    ]}
                  />

                  <SelectWithCopy
                    label="نوع الإسناد"
                    id="assignmentType"
                    options={[
                      { value: 'additional', label: 'إضافية (فوق صلاحيات الدور)' },
                      { value: 'override', label: 'استبدال (تحل محل صلاحيات الدور)' },
                      { value: 'temporary', label: 'مؤقتة (لفترة محددة)' },
                    ]}
                  />

                  <DateInputWithToday
                    label="تاريخ البداية"
                    id="startDate"
                  />

                  <DateInputWithToday
                    label="تاريخ الانتهاء (للمؤقتة)"
                    id="endDate"
                  />
                </div>

                <div className="mt-3">
                  <label className="compact-text text-gray-700 mb-2 block" style={{ fontWeight: 700, color: '#2563eb' }}>
                    الصلاحيات المراد إسنادها
                  </label>
                  <div className="max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-lg border">
                    <div className="space-y-1">
                      {permissions.map((perm) => (
                        <div key={perm.id} className="flex items-center gap-2 p-2 bg-white rounded border hover:bg-green-50 hover:border-green-300 cursor-pointer transition-all">
                          <input type="checkbox" id={`emp-perm-${perm.id}`} className="w-4 h-4" />
                          <label htmlFor={`emp-perm-${perm.id}`} className="text-xs flex-1 cursor-pointer">
                            {perm.name}
                          </label>
                          <Badge className="text-xs bg-gray-100 text-gray-700 font-mono">
                            {perm.code}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button className="dense-btn dense-btn-primary">
                    <Send className="h-3 w-3" />
                    إسناد الصلاحيات
                  </Button>
                  <Button className="dense-btn dense-btn-secondary">
                    <Bell className="h-3 w-3" />
                    إسناد وإشعار
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* الموظفون بصلاحيات خاصة */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Flag className="h-4 w-4" />
                  موظفون لديهم صلاحيات خاصة ({stats.assignedToEmployees})
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { id: '817-00123', name: 'أحمد محمد علي', role: 'مهندس معماري', extraPerms: 15, type: 'إضافية' },
                    { id: '817-00124', name: 'فاطمة خالد', role: 'مهندسة مدنية', extraPerms: 8, type: 'مؤقتة' },
                    { id: '817-00125', name: 'سعد عبدالله', role: 'محاسب', extraPerms: 5, type: 'إضافية' },
                  ].map((emp) => (
                    <div key={emp.id} className="dense-content-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-medium">{emp.name}</div>
                            <div className="text-xs text-gray-600">{emp.role}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge className="bg-orange-100 text-orange-700 text-xs">
                            +{emp.extraPerms} صلاحية
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            {emp.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 pt-2 border-t">
                        <Button className="dense-btn dense-btn-primary">
                          <Eye className="h-3 w-3" />
                          الصلاحيات
                        </Button>
                        <Button className="dense-action-btn">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button className="dense-action-btn">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 902-10: إسناد الصلاحيات
      case '902-10':
        return (
          <div className="universal-dense-tab-content">
            {/* نموذج إسناد صلاحيات جديدة */}
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Send className="h-4 w-4" />
                  إسناد صلاحيات جديدة
                </h2>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="text-xs text-blue-800">
                      <strong>إسناد صلاحيات مباشر للموظفين:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>يمكنك إسناد صلاحيات منفردة أو مجموعة كاملة لأي موظف بدون طلب منه</li>
                        <li>الموظف سيتلقى إشعار تلقائي بالصلاحيات المسندة إليه</li>
                        <li>يمكن تحديد فترة زمنية للصلاحيات (اختياري)</li>
                        <li>يُسجل جميع الإسنادات في سجل التدقيق مع التفاصيل الكاملة</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* بيانات الموظف */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    بيانات الموظف
                  </h3>
                  <div className="dense-grid dense-grid-3 gap-3">
                    <SelectWithCopy
                      label="اختر الموظف *"
                      id="assignEmployee"
                      options={[
                        { value: '', label: 'اختر الموظف' },
                        ...EMPLOYEES_FOR_ASSIGNMENT.map(emp => ({
                          value: emp.id,
                          label: `${emp.name} - ${emp.code} (${emp.department})`
                        }))
                      ]}
                    />

                    <InputWithCopy
                      label="القسم"
                      id="employeeDept"
                      placeholder="سيتم ملؤه تلقائياً"
                      readOnly
                    />

                    <InputWithCopy
                      label="المنصب"
                      id="employeePos"
                      placeholder="سيتم ملؤه تلقائياً"
                      readOnly
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                {/* نوع الإسناد */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    نوع الصلاحيات المراد إسنادها
                  </h3>
                  
                  <div className="dense-grid dense-grid-2 gap-3 mb-3">
                    <Card className="dense-content-card p-3 cursor-pointer hover:shadow-md transition-shadow border-2 border-blue-500 bg-blue-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                          <CheckSquare className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-blue-900">صلاحيات منفردة</div>
                          <div className="text-xs text-blue-700">اختر صلاحيات محددة من القائمة</div>
                        </div>
                      </div>
                    </Card>

                    <Card className="dense-content-card p-3 cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-purple-500">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                          <FolderOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">مجموعة صلاحيات</div>
                          <div className="text-xs text-gray-600">اختر مجموعة كاملة من الصلاحيات</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* اختيار الصلاحيات المنفردة */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <List className="h-4 w-4 text-green-600" />
                    اختيار الصلاحيات المنفردة
                  </h3>
                  
                  <div className="mb-3 flex gap-2">
                    <InputWithCopy
                      label="بحث في الصلاحيات"
                      id="searchPerms"
                      placeholder="ابحث بالكود أو الاسم أو الشاشة..."
                      icon={<Search className="h-4 w-4" />}
                    />
                    <SelectWithCopy
                      label="تصفية حسب النوع"
                      id="filterPermType"
                      options={[
                        { value: 'all', label: 'جميع الأنواع' },
                        { value: 'screen', label: 'صلاحيات الشاشات' },
                        { value: 'tab', label: 'صلاحيات التابات' },
                        { value: 'field', label: 'صلاحيات الحقول' },
                        { value: 'action', label: 'صلاحيات الإجراءات' },
                      ]}
                    />
                  </div>

                  <ScrollArea className="h-64 rounded-lg border">
                    <div className="p-2 space-y-1">
                      {SAMPLE_PERMISSIONS.slice(0, 15).map((perm) => (
                        <div key={perm.id} className="dense-content-card p-2 hover:bg-blue-50 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" className="w-4 h-4" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                                  {perm.code}
                                </Badge>
                                <Badge className={PERMISSION_LEVELS.find(l => l.value === perm.level)?.color}>
                                  {PERMISSION_LEVELS.find(l => l.value === perm.level)?.label}
                                </Badge>
                              </div>
                              <div className="text-xs font-medium">{perm.name}</div>
                              <div className="text-xs text-gray-600">{perm.screenName} - {perm.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-gray-600">تم اختيار: <strong>0</strong> صلاحية</span>
                    <div className="flex gap-2">
                      <Button className="dense-btn dense-btn-outline">
                        <CheckSquare className="h-3 w-3" />
                        تحديد الكل
                      </Button>
                      <Button className="dense-btn dense-btn-outline">
                        <XSquare className="h-3 w-3" />
                        إلغاء التحديد
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* أو اختيار مجموعة */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-purple-600" />
                    أو اختر مجموعة صلاحيات جاهزة
                  </h3>
                  
                  <div className="dense-grid dense-grid-2 gap-2">
                    {PERMISSION_GROUPS.map((group) => (
                      <Card key={group.id} className="dense-content-card p-3 cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-purple-500">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                                {group.id}
                              </Badge>
                              <Badge className={`bg-${group.color}-100 text-${group.color}-700`}>
                                {group.permissions} صلاحية
                              </Badge>
                            </div>
                            <div className="text-xs font-medium mb-1">{group.name}</div>
                            <div className="text-xs text-gray-600">
                              الشاشات: {group.screens.join(', ')}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* تفاصيل الإسناد */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-orange-600" />
                    تفاصيل الإسناد
                  </h3>
                  
                  <div className="dense-grid dense-grid-3 gap-3 mb-3">
                    <DateInputWithToday
                      label="تاريخ البدء *"
                      id="assignStartDate"
                    />

                    <DateInputWithToday
                      label="تاريخ الانتهاء (اختياري)"
                      id="assignEndDate"
                    />

                    <SelectWithCopy
                      label="الأولوية"
                      id="assignPriority"
                      options={[
                        { value: 'normal', label: 'عادية' },
                        { value: 'high', label: 'عالية' },
                        { value: 'urgent', label: 'عاجلة' },
                      ]}
                    />
                  </div>

                  <TextAreaWithCopy
                    label="سبب الإسناد *"
                    id="assignReason"
                    placeholder="اكتب سبب إسناد هذه الصلاحيات للموظف..."
                    rows={3}
                  />
                </div>

                <Separator className="my-4" />

                {/* خيارات الإشعار */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Bell className="h-4 w-4 text-cyan-600" />
                    خيارات الإشعار
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                      <input type="checkbox" className="w-4 h-4" defaultChecked />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-cyan-900">إرسال إشعار للموظف</div>
                        <div className="text-xs text-cyan-700">سيتلقى الموظف إشعاراً فورياً عبر النظام</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <input type="checkbox" className="w-4 h-4" defaultChecked />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-green-900">إرسال بريد إلكتروني</div>
                        <div className="text-xs text-green-700">إرسال ملخص الصلاحيات إلى بريد الموظف</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <input type="checkbox" className="w-4 h-4" />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-purple-900">إرسال رسالة نصية (SMS)</div>
                        <div className="text-xs text-purple-700">إرسال تنبيه نصي على رقم جوال الموظف</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <input type="checkbox" className="w-4 h-4" defaultChecked />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-orange-900">إشعار المدير المباشر</div>
                        <div className="text-xs text-orange-700">إخطار المدير المباشر للموظف بالتغييرات</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex gap-2">
                    <Button className="dense-btn dense-btn-outline">
                      <X className="h-3 w-3" />
                      إلغاء
                    </Button>
                    <Button className="dense-btn dense-btn-outline">
                      <Eye className="h-3 w-3" />
                      معاينة
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button className="dense-btn dense-btn-outline">
                      <Save className="h-3 w-3" />
                      حفظ كمسودة
                    </Button>
                    <Button className="dense-btn dense-btn-success">
                      <Send className="h-3 w-3" />
                      إسناد الصلاحيات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* سجل الصلاحيات المسندة */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <History className="h-4 w-4" />
                  سجل الصلاحيات المسندة
                </h2>
                <div className="flex gap-2">
                  <Button className="dense-btn dense-btn-outline">
                    <Filter className="h-3 w-3" />
                    تصفية
                  </Button>
                  <Button className="dense-btn dense-btn-outline">
                    <Download className="h-3 w-3" />
                    تصدير
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3 flex gap-2">
                  <InputWithCopy
                    label="بحث في السجل"
                    id="searchHistory"
                    placeholder="ابحث بالموظف أو الكود أو السبب..."
                    icon={<Search className="h-4 w-4" />}
                  />
                  <SelectWithCopy
                    label="الحالة"
                    id="filterStatus"
                    options={[
                      { value: 'all', label: 'جميع الحالات' },
                      { value: 'active', label: 'نشط' },
                      { value: 'expired', label: 'منتهي' },
                      { value: 'revoked', label: 'ملغي' },
                    ]}
                  />
                </div>

                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الموظف</TableHead>
                      <TableHead className="text-right">عدد الصلاحيات</TableHead>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">المُسند بواسطة</TableHead>
                      <TableHead className="text-right">تاريخ الإسناد</TableHead>
                      <TableHead className="text-right">الفترة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإشعار</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ASSIGNED_PERMISSIONS_HISTORY.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="text-right">
                          <div className="text-xs font-medium">{record.employee}</div>
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs mt-1">
                            {record.employeeCode}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-blue-100 text-blue-700 font-medium">
                            {record.permissionsCount} صلاحية
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={record.type === 'منفردة' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}>
                            {record.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs">{record.assignedBy}</TableCell>
                        <TableCell className="text-right text-xs">
                          <div className="flex items-center gap-1 justify-end">
                            <Calendar className="h-3 w-3 text-gray-500" />
                            {record.assignedDate}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          <div>{record.startDate}</div>
                          {record.endDate && <div className="text-gray-600">إلى {record.endDate}</div>}
                          {!record.endDate && <div className="text-gray-600">دائم</div>}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            record.status === 'نشط' ? 'bg-green-100 text-green-700' :
                            record.status === 'منتهي' ? 'bg-gray-100 text-gray-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {record.notified ? (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3" />
                              تم الإشعار
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-700">
                              <Clock className="h-3 w-3" />
                              معلق
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button className="dense-action-btn" title="عرض التفاصيل">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn" title="تعديل">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn" title="حذف">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // 902-11: الإسناد المؤقت
      case '902-11':
        return (
          <div className="universal-dense-tab-content">
            {/* معلومات إرشادية */}
            <Card className="dense-section mb-4">
              <CardContent className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <div className="text-xs text-purple-900">
                    <strong>الإسناد المؤقت للصلاحيات والأدوار الوظيفية:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>إسناد صلاحيات أو أدوار وظيفية كاملة لفترة زمنية محددة</li>
                      <li>اختيار فترات محددة مسبقاً (أسبوع، شهر، 3 أشهر، 6 أشهر، سنة) أو تحديد فترة مخصصة</li>
                      <li>نظام إشعارات تلقائي قبل انتهاء الفترة</li>
                      <li>إمكانية التجديد التلقائي للإسنادات</li>
                      <li>إلغاء تلقائي للصلاحيات عند انتهاء الفترة</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* نموذج إسناد مؤقت جديد */}
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Send className="h-4 w-4" />
                  إسناد مؤقت جديد
                </h2>
              </CardHeader>
              <CardContent>
                {/* نوع الإسناد */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    نوع الإسناد المؤقت
                  </h3>
                  
                  <div className="dense-grid dense-grid-2 gap-3">
                    <Card className="dense-content-card p-3 cursor-pointer hover:shadow-md transition-shadow border-2 border-blue-500 bg-blue-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                          <CheckSquare className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-blue-900">صلاحيات مؤقتة</div>
                          <div className="text-xs text-blue-700">إسناد صلاحيات محددة لفترة زمنية</div>
                        </div>
                      </div>
                    </Card>

                    <Card className="dense-content-card p-3 cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-purple-500">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">دور وظيفي مؤقت</div>
                          <div className="text-xs text-gray-600">إسناد دور وظيفي كامل لفترة محددة</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* بيانات المستهدف */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    بيانات الموظف المستهدف
                  </h3>
                  
                  <div className="dense-grid dense-grid-3 gap-3">
                    <SelectWithCopy
                      label="اختر الموظف *"
                      id="tempEmployee"
                      options={[
                        { value: '', label: 'اختر الموظف' },
                        ...EMPLOYEES_FOR_ASSIGNMENT.map(emp => ({
                          value: emp.id,
                          label: `${emp.name} - ${emp.code}`
                        }))
                      ]}
                    />

                    <InputWithCopy
                      label="القسم الحالي"
                      id="tempDept"
                      placeholder="سيتم ملؤه تلقائياً"
                      readOnly
                    />

                    <InputWithCopy
                      label="الدور الوظيفي الحالي"
                      id="tempRole"
                      placeholder="سيتم ملؤه تلقائياً"
                      readOnly
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                {/* اختيار الصلاحيات أو الدور */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <List className="h-4 w-4 text-orange-600" />
                    اختيار الصلاحيات أو الدور الوظيفي
                  </h3>

                  {/* خيار 1: اختيار صلاحيات */}
                  <div className="mb-3">
                    <label className="text-xs text-gray-700 mb-2 block font-medium">الصلاحيات المؤقتة</label>
                    <ScrollArea className="h-48 rounded-lg border bg-gray-50">
                      <div className="p-2 space-y-1">
                        {SAMPLE_PERMISSIONS.slice(0, 10).map((perm) => (
                          <div key={perm.id} className="flex items-center gap-2 p-2 bg-white rounded border hover:bg-blue-50 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                                  {perm.code}
                                </Badge>
                                <span className="text-xs font-medium">{perm.name}</span>
                              </div>
                              <span className="text-xs text-gray-600">{perm.screenName}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* خيار 2: اختيار دور وظيفي */}
                  <div>
                    <label className="text-xs text-gray-700 mb-2 block font-medium">أو اختر دور وظيفي مؤقت</label>
                    <div className="grid grid-cols-2 gap-2">
                      {JOB_ROLES_LIST.map((role) => (
                        <Card key={role.id} className="dense-content-card p-2 cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-purple-500">
                          <div className="flex items-center gap-2">
                            <input type="radio" name="tempRole" className="w-4 h-4" />
                            <div className="flex-1">
                              <div className="text-xs font-medium">{role.name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                                  {role.code}
                                </Badge>
                                <Badge className={`bg-${role.color}-100 text-${role.color}-700 text-xs`}>
                                  {role.permissions} صلاحية
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* الفترة الزمنية */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-cyan-600" />
                    الفترة الزمنية للإسناد المؤقت
                  </h3>

                  {/* فترات محددة مسبقاً */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {PREDEFINED_PERIODS.map((period) => {
                      const Icon = period.icon;
                      return (
                        <Card 
                          key={period.value}
                          className={`dense-content-card p-3 cursor-pointer hover:shadow-md transition-shadow border-2 ${
                            period.value === '1-month' ? 'border-cyan-500 bg-cyan-50' : 'border-transparent hover:border-cyan-300'
                          }`}
                        >
                          <div className="text-center">
                            <Icon className="h-5 w-5 mx-auto mb-2 text-cyan-600" />
                            <div className="text-xs font-medium mb-1">{period.label}</div>
                            {period.days > 0 && (
                              <Badge className="bg-cyan-100 text-cyan-700 text-xs">
                                {period.days} يوم
                              </Badge>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>

                  {/* تواريخ مخصصة */}
                  <div className="grid grid-cols-2 gap-3">
                    <DateInputWithToday
                      label="تاريخ البدء *"
                      id="tempStartDate"
                    />

                    <DateInputWithToday
                      label="تاريخ الانتهاء *"
                      id="tempEndDate"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                {/* إعدادات إضافية */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-purple-600" />
                    إعدادات إضافية
                  </h3>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Switch defaultChecked />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-green-900">التجديد التلقائي</p>
                        <p className="text-xs text-green-700">تجديد الإسناد تلقائياً عند الانتهاء</p>
                      </div>
                    </div>

                    <SelectWithCopy
                      label="عدد مرات التجديد"
                      id="renewCount"
                      options={[
                        { value: '0', label: 'بدون تجديد' },
                        { value: '1', label: 'مرة واحدة' },
                        { value: '2', label: 'مرتين' },
                        { value: '3', label: '3 مرات' },
                        { value: 'unlimited', label: 'غير محدود' },
                      ]}
                    />

                    <SelectWithCopy
                      label="إشعار قبل الانتهاء بـ"
                      id="notifyBefore"
                      options={[
                        { value: '1', label: 'يوم واحد' },
                        { value: '3', label: '3 أيام' },
                        { value: '7', label: 'أسبوع' },
                        { value: '14', label: 'أسبوعين' },
                        { value: '30', label: 'شهر' },
                      ]}
                    />

                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Switch defaultChecked />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-blue-900">إشعار الموظف</p>
                        <p className="text-xs text-blue-700">إشعار الموظف بالإسناد المؤقت</p>
                      </div>
                    </div>
                  </div>

                  <TextAreaWithCopy
                    label="سبب الإسناد المؤقت *"
                    id="tempReason"
                    placeholder="اكتب سبب الإسناد المؤقت..."
                    rows={2}
                  />
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="outline" className="h-9">
                    <X className="h-4 w-4 ml-1" />
                    إلغاء
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" className="h-9">
                      <Eye className="h-4 w-4 ml-1" />
                      معاينة
                    </Button>
                    <Button className="h-9 bg-purple-500">
                      <Send className="h-4 w-4 ml-1" />
                      إسناد مؤقت
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* الإسنادات المؤقتة النشطة */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Clock className="h-4 w-4" />
                  الإسنادات المؤقتة النشطة ({TEMPORARY_ASSIGNMENTS.length})
                </h2>
                <div className="flex gap-2">
                  <Button className="dense-btn dense-btn-outline">
                    <Filter className="h-3 w-3" />
                    تصفية
                  </Button>
                  <Button className="dense-btn dense-btn-outline">
                    <RefreshCw className="h-3 w-3" />
                    تحديث
                  </Button>
                  <Button className="dense-btn dense-btn-outline">
                    <Download className="h-3 w-3" />
                    تصدير
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3 flex gap-2">
                  <InputWithCopy
                    label="بحث في الإسنادات"
                    id="searchTemp"
                    placeholder="ابحث بالموظف أو الرقم..."
                    icon={<Search className="h-4 w-4" />}
                  />
                  <SelectWithCopy
                    label="الحالة"
                    id="filterTempStatus"
                    options={[
                      { value: 'all', label: 'جميع الحالات' },
                      { value: 'active', label: 'نشط' },
                      { value: 'expiring', label: 'قريب الانتهاء' },
                      { value: 'expired', label: 'منتهي' },
                    ]}
                  />
                  <SelectWithCopy
                    label="النوع"
                    id="filterTempType"
                    options={[
                      { value: 'all', label: 'جميع الأنواع' },
                      { value: 'permissions', label: 'صلاحيات' },
                      { value: 'role', label: 'دور وظيفي' },
                    ]}
                  />
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {TEMPORARY_ASSIGNMENTS.map((assignment) => (
                      <Card 
                        key={assignment.id} 
                        className={`dense-content-card hover:shadow-md transition-all cursor-pointer border-r-4 ${
                          assignment.status === 'نشط' ? 'border-green-500' :
                          assignment.status === 'قريب الانتهاء' ? 'border-orange-500' :
                          'border-gray-400'
                        }`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                                  {assignment.assignmentNumber}
                                </Badge>
                                <Badge className={
                                  assignment.assignmentType === 'صلاحيات' 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : 'bg-purple-100 text-purple-700'
                                }>
                                  {assignment.assignmentType}
                                </Badge>
                                <Badge className={
                                  assignment.status === 'نشط' ? 'bg-green-100 text-green-700' :
                                  assignment.status === 'قريب الانتهاء' ? 'bg-orange-100 text-orange-700' :
                                  'bg-gray-100 text-gray-700'
                                }>
                                  {assignment.status}
                                </Badge>
                                {assignment.autoRenew && (
                                  <Badge className="bg-cyan-100 text-cyan-700">
                                    <RefreshCw className="h-3 w-3 ml-1" />
                                    تجديد تلقائي
                                  </Badge>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-2">
                                <div>
                                  <span className="text-gray-600">الموظف: </span>
                                  <span className="font-medium">{assignment.targetName}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">الكود: </span>
                                  <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                                    {assignment.targetCode}
                                  </Badge>
                                </div>
                                <div>
                                  <span className="text-gray-600">عدد العناصر: </span>
                                  <span className="font-medium text-blue-600">{assignment.itemsCount}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">الفترة: </span>
                                  <span className="font-medium">{assignment.period}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">البدء: </span>
                                  <span className="font-medium">{assignment.startDate}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">الانتهاء: </span>
                                  <span className="font-medium">{assignment.endDate}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">الأيام المتبقية: </span>
                                  <Badge className={
                                    assignment.daysRemaining > 30 ? 'bg-green-100 text-green-700' :
                                    assignment.daysRemaining > 7 ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }>
                                    {assignment.daysRemaining} يوم
                                  </Badge>
                                </div>
                                <div>
                                  <span className="text-gray-600">مرات التجديد: </span>
                                  <span className="font-medium">{assignment.renewCount}</span>
                                </div>
                              </div>

                              <div className="bg-gray-50 rounded p-2 text-xs mb-2">
                                <span className="text-gray-600">السبب: </span>
                                <span className="text-gray-800">{assignment.reason}</span>
                              </div>

                              <div className="text-xs text-gray-600">
                                <span>المُسند بواسطة: </span>
                                <span className="font-medium">{assignment.assignedBy}</span>
                                <span className="mr-2">في {assignment.assignedDate}</span>
                              </div>
                            </div>
                          </div>

                          {/* شريط التقدم للوقت المتبقي */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-gray-600">الوقت المنقضي</span>
                              <span className="font-medium">
                                {((1 - assignment.daysRemaining / 
                                  (PREDEFINED_PERIODS.find(p => p.label.includes(assignment.period.split(' ')[0]))?.days || 90)) * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Progress 
                              value={(1 - assignment.daysRemaining / 
                                (PREDEFINED_PERIODS.find(p => p.label.includes(assignment.period.split(' ')[0]))?.days || 90)) * 100} 
                              className="h-2"
                            />
                          </div>

                          {/* الإجراءات */}
                          <div className="flex items-center gap-1 pt-2 border-t">
                            <Button className="dense-action-btn flex-1" title="عرض التفاصيل">
                              <Eye className="h-3 w-3" />
                              عرض
                            </Button>
                            <Button className="dense-action-btn flex-1" title="تمديد الفترة">
                              <Clock className="h-3 w-3" />
                              تمديد
                            </Button>
                            <Button className="dense-action-btn flex-1" title="تجديد">
                              <RefreshCw className="h-3 w-3" />
                              تجديد
                            </Button>
                            <Button className="dense-action-btn flex-1" title="إنهاء مبكر">
                              <XSquare className="h-3 w-3" />
                              إنهاء
                            </Button>
                            <Button className="dense-action-btn flex-1" title="حذف">
                              <Trash2 className="h-3 w-3" />
                              حذف
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

      // 902-12: سجل التدقيق
      case '902-12':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <History className="h-4 w-4" />
                  سجل التدقيق الشامل
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-secondary">
                    <Filter className="h-3 w-3" />
                    تصفية
                  </Button>
                  <Button className="dense-btn dense-btn-secondary">
                    <Download className="h-3 w-3" />
                    تصدير
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {AUDIT_LOG.map((log) => (
                    <div key={log.id} className="dense-content-card p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              {log.action}
                            </Badge>
                            <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                              {log.permissionCode}
                            </Badge>
                          </div>
                          <div className="text-xs font-medium mb-1">{log.permissionName}</div>
                          <div className="text-xs text-gray-600 mb-1">
                            <strong>الهدف:</strong> {log.target}
                          </div>
                          <div className="text-xs text-gray-600">
                            <strong>التفاصيل:</strong> {log.details}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t text-xs text-gray-500">
                        <span>
                          <User className="h-3 w-3 inline ml-1" />
                          {log.performedBy}
                        </span>
                        <span>
                          <Clock className="h-3 w-3 inline ml-1" />
                          {log.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 902-13: التقارير
      case '902-13':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <BarChart3 className="h-4 w-4" />
                  تقارير الصلاحيات التفصيلية
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Download className="h-3 w-3" />
                  تصدير
                </Button>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-3">
                  {[
                    { name: 'تقرير الصلاحيات حسب الدور', icon: UserCheck, count: '12 تقرير' },
                    { name: 'تقرير الصلاحيات حسب الموظف', icon: User, count: '25 تقرير' },
                    { name: 'تقرير الصلاحيات حسب الشاشة', icon: Monitor, count: '110 تقرير' },
                    { name: 'تقرير الصلاحيات غير المستخدمة', icon: AlertTriangle, count: '45 صلاحية' },
                    { name: 'تقرير الصلاحيات المكررة', icon: Copy, count: '8 حالات' },
                    { name: 'تقرير التغييرات الأخيرة', icon: History, count: '150 تغيير' },
                  ].map((report, i) => {
                    const ReportIcon = report.icon;
                    
                    return (
                      <div key={i} className="dense-content-card p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <ReportIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium mb-1">{report.name}</div>
                            <div className="text-xs text-gray-600">{report.count}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 pt-2 border-t">
                          <Button className="dense-btn dense-btn-primary">
                            <Eye className="h-3 w-3" />
                            عرض
                          </Button>
                          <Button className="dense-action-btn">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Printer className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 902-14: الإشعارات
      case '902-14':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Bell className="h-4 w-4" />
                  إشعارات الصلاحيات
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  إشعار جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { type: 'success', message: 'تم إسناد 15 صلاحية للموظف أحمد محمد علي', time: 'منذ 5 دقائق' },
                    { type: 'warning', message: 'محاولة وصول غير مصرح بها من الموظف سعد عبدالله', time: 'منذ 10 دقائق' },
                    { type: 'info', message: 'تم تحديث مجموعة صلاحيات "إدارة المعاملات"', time: 'منذ 15 دقيقة' },
                    { type: 'error', message: 'فشل في إسناد صلاحية - الدور غير موجود', time: 'منذ 20 دقيقة' },
                  ].map((notif, i) => (
                    <div key={i} className={`dense-content-card p-3 border-r-4 ${
                      notif.type === 'success' ? 'border-green-500 bg-green-50' :
                      notif.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                      notif.type === 'error' ? 'border-red-500 bg-red-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <div className="text-xs font-medium mb-1">{notif.message}</div>
                          <div className="text-xs text-gray-600">
                            <Clock className="h-3 w-3 inline ml-1" />
                            {notif.time}
                          </div>
                        </div>
                        <Button className="dense-action-btn">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 902-15: الأمان
      case '902-15':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <ShieldCheck className="h-4 w-4" />
                  إعدادات الأمان والحماية
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Save className="h-3 w-3" />
                  حفظ
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium">تفعيل سجل التدقيق الشامل</div>
                      <div className="text-xs text-gray-600">تسجيل جميع التغييرات على الصلاحيات</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium">إرسال إشعارات عند تغيير الصلاحيات</div>
                      <div className="text-xs text-gray-600">إشعار الموظفين عند إضافة/إزالة صلاحيات</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium">مراجعة دورية للصلاحيات</div>
                      <div className="text-xs text-gray-600">مراجعة شهرية لجميع الصلاحيات المُسندة</div>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium">تقييد الصلاحيات الحساسة</div>
                      <div className="text-xs text-gray-600">طلب موافقة إضافية للصلاحيات الحرجة</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* محاولات الوصول المرفوضة */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <ShieldAlert className="h-4 w-4" />
                  محاولات الوصول المرفوضة
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { user: 'سعد عبدالله', permission: '817-03-015 - حذف موظف', time: 'منذ ساعة' },
                    { user: 'فاطمة خالد', permission: '222-01-001 - عرض الحسابات', time: 'منذ ساعتين' },
                  ].map((attempt, i) => (
                    <div key={i} className="dense-content-card p-3 border-r-4 border-red-500 bg-red-50">
                      <div className="text-xs font-medium mb-1">
                        <ShieldAlert className="h-3 w-3 inline ml-1 text-red-600" />
                        محاولة وصول مرفوضة
                      </div>
                      <div className="text-xs text-gray-700 mb-1">
                        <strong>الموظف:</strong> {attempt.user}
                      </div>
                      <div className="text-xs text-gray-700 mb-1">
                        <strong>الصلاحية:</strong> {attempt.permission}
                      </div>
                      <div className="text-xs text-gray-600">
                        <Clock className="h-3 w-3 inline ml-1" />
                        {attempt.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 902-16: الأرشيف
      case '902-16':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Archive className="h-4 w-4" />
                  الصلاحيات المؤرشفة
                </h2>
                <Button className="dense-btn dense-btn-secondary">
                  <RefreshCw className="h-3 w-3" />
                  استعادة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <Archive className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">لا توجد صلاحيات مؤرشفة حالياً</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 902-17: الإعدادات
      case '902-17':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Settings className="h-4 w-4" />
                  إعدادات نظام الصلاحيات
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Save className="h-3 w-3" />
                  حفظ
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      إعدادات عامة
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-xs font-medium">تفعيل نظام الصلاحيات المتقدم</div>
                          <div className="text-xs text-gray-600">تفعيل جميع مستويات الصلاحيات (شاشة، تاب، حقل، إجراء)</div>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-xs font-medium">الوراثة التلقائية للصلاحيات</div>
                          <div className="text-xs text-gray-600">عند إعطاء صلاحية شاشة، منح جميع صلاحيات التابات تلقائياً</div>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-xs font-medium">صلاحيات مؤقتة تلقائية</div>
                          <div className="text-xs text-gray-600">إزالة الصلاحيات المؤقتة تلقائياً بعد انتهاء المدة</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      إعدادات الأمان
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <SelectWithCopy
                        label="مستوى الأمان الافتراضي"
                        id="defaultSecurity"
                        options={[
                          { value: 'low', label: 'منخفض' },
                          { value: 'medium', label: 'متوسط' },
                          { value: 'high', label: 'عالي' },
                          { value: 'critical', label: 'حرج' },
                        ]}
                      />

                      <InputWithCopy
                        label="مدة انتهاء الصلاحيات المؤقتة (أيام)"
                        id="tempDuration"
                        type="number"
                        placeholder="30"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // باقي التابات
      default:
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <div className="flex items-center gap-2">
                  {React.createElement(tab.icon, { className: 'h-5 w-5 text-blue-600' })}
                  <h2 className="dense-section-title">{tab.title}</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {React.createElement(tab.icon, { className: 'h-8 w-8 text-blue-600' })}
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {tab.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    محتوى تفصيلي متاح
                  </p>
                  <Badge className="bg-blue-100 text-blue-700 text-xs">{tab.number}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 rtl-support" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      {/* رأس الشاشة */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-[#2563eb] rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  إدارة الصلاحيات
                </h1>
                <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  نظام شامل لإدارة صلاحيات المستخدمين والأدوار
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: 'Courier New, monospace', color: '#6b7280' }}>
                SCR-902
              </span>
              <Badge className="bg-[#10b981] text-white">17 تبويب</Badge>
              <Badge className="bg-[#2563eb] text-white">{stats.total} صلاحية</Badge>
              <Badge className="bg-green-100 text-green-700">{stats.active} نشطة</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <RefreshCw className="h-4 w-4 ml-2" />
              تحديث
            </Button>
            <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Settings className="h-4 w-4 ml-2" />
              إعدادات
            </Button>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي: السايد بار + المحتوى */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        {/* السايد بار الموحد */}
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* محتوى الشاشة */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
          <Card className="flex-1 flex flex-col min-h-0 card-rtl">
            <ScrollArea className="flex-1">
              <CardContent className="p-6">
                {renderTabContent()}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      </div>



      {/* نافذة تجميد الصلاحية */}
      <Dialog open={showFreezeDialog} onOpenChange={setShowFreezeDialog}>
        <DialogContent className="max-w-2xl" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-cyan-600" />
              {selectedPermission?.status === 'frozen' ? 'إلغاء تجميد الصلاحية' : 'تجميد الصلاحية'}
            </DialogTitle>
            <DialogDescription>
              {selectedPermission?.status === 'frozen' 
                ? 'إعادة تفعيل الصلاحية للاستخدام' 
                : 'تجميد الصلاحية ومنع استخدامها من جميع الموظفين (عدا الأدمن)'}
            </DialogDescription>
          </DialogHeader>

          {selectedPermission && (
            <div className="space-y-4">
              <div className={`border rounded-lg p-3 ${selectedPermission.status === 'frozen' ? 'bg-cyan-50 border-cyan-200' : 'bg-blue-50 border-blue-200'}`}>
                <h4 className="text-sm font-medium mb-2">{selectedPermission.name}</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">الكود: </span>
                    <span className="font-medium font-mono">{selectedPermission.code}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">المستوى: </span>
                    <span className="font-medium">{PERMISSION_LEVELS.find(l => l.value === selectedPermission.level)?.label}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">الشاشة: </span>
                    <span className="font-medium">{selectedPermission.screenName}</span>
                  </div>
                </div>
              </div>

              {selectedPermission.status === 'frozen' ? (
                // نموذج إلغاء التجميد
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium text-green-900">هل تريد إلغاء تجميد هذه الصلاحية؟</p>
                    </div>
                    <p className="text-xs text-green-800">
                      سيتم السماح باستخدام الصلاحية لجميع من تم إسنادها إليهم
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                    <p className="text-xs text-amber-900 font-medium mb-1">معلومات التجميد الحالي:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">النوع: </span>
                        <Badge className="bg-cyan-100 text-cyan-700">
                          {selectedPermission.frozenType === 'temporary' ? 'مؤقت' : 'دائم'}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">تاريخ التجميد: </span>
                        <span className="font-medium">{selectedPermission.frozenDate}</span>
                      </div>
                      {selectedPermission.frozenUntil && (
                        <div>
                          <span className="text-gray-600">حتى: </span>
                          <span className="font-medium">{selectedPermission.frozenUntil}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">بواسطة: </span>
                        <span className="font-medium">{selectedPermission.frozenBy}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-gray-600">السبب: </span>
                      <span className="text-amber-900">{selectedPermission.frozenReason}</span>
                    </div>
                  </div>

                  <TextAreaWithCopy
                    label="سبب إلغاء التجميد"
                    id="unfreezeReason"
                    placeholder="اكتب سبب إلغاء تجميد الصلاحية..."
                    rows={2}
                  />
                </div>
              ) : (
                // نموذج التجميد
                <div className="space-y-3">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <p className="text-sm font-medium text-orange-900">تحذير هام</p>
                    </div>
                    <ul className="list-disc list-inside text-xs text-orange-800 space-y-1">
                      <li>سيتم منع استخدام هذه الصلاحية من جميع الموظفين</li>
                      <li>جميع من تم إسناد هذه الصلاحية إليهم سيفقدونها مؤقتاً</li>
                      <li>مدير النظام (الأدمن) فقط يمكنه استخدامها</li>
                      <li>سيتم تسجيل هذا الإجراء في سجل التدقيق</li>
                    </ul>
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
                            <input type="radio" name="freezeType" value="permanent" className="w-4 h-4" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">تجميد دائم</p>
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
                      { value: 'security-audit', label: 'مراجعة أمنية' },
                      { value: 'system-maintenance', label: 'صيانة النظام' },
                      { value: 'policy-change', label: 'تغيير في السياسات' },
                      { value: 'data-migration', label: 'ترحيل بيانات' },
                      { value: 'financial-audit', label: 'مراجعة مالية' },
                      { value: 'security-breach', label: 'خرق أمني' },
                      { value: 'dangerous-permission', label: 'صلاحية خطيرة' },
                      { value: 'other', label: 'سبب آخر' },
                    ]}
                  />

                  <TextAreaWithCopy
                    label="تفاصيل سبب التجميد *"
                    id="freezeDetails"
                    placeholder="اكتب تفاصيل سبب تجميد الصلاحية..."
                    rows={3}
                  />

                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-blue-900">إشعار المتأثرين</p>
                      <p className="text-xs text-blue-700">إرسال إشعار لجميع من لديهم هذه الصلاحية</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFreezeDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            {selectedPermission?.status === 'frozen' ? (
              <Button className="bg-green-500 hover:bg-green-600">
                <Unlock className="h-4 w-4 ml-1" />
                إلغاء التجميد
              </Button>
            ) : (
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                <Lock className="h-4 w-4 ml-1" />
                تجميد الصلاحية
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PermissionsManagement_Complete_902;
