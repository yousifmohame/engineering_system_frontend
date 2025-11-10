/**
 * الشاشة 903 - إدارة الأدوار الوظيفية - تطوير تفصيلي شامل v2.0
 * ================================================================
 * 
 * نظام متكامل لإدارة الأدوار الوظيفية - جميع التابات الـ 15 مُطورة
 * 
 * التطوير: ديسمبر 2025 - v2.0
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  UserCheck, Plus, Edit, Trash2, Eye, Download, Upload, CheckCircle,
  Clock, AlertCircle, X, Search, Filter, Calendar, Users, Building,
  Settings, History, Archive, RefreshCw, Printer, Target, Award,
  TrendingUp, Paperclip, Bell, User, Shield, Activity, BarChart3,
  FolderOpen, Layers, Move, ArrowRightLeft, Copy, Save, Send,
  FileText, Briefcase, Star, Flag, Info, AlertTriangle, Key,
  ClipboardCheck, CheckSquare, Mail, Phone
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

// ===== تكوين التابات - 15 تبويب شامل =====
const TABS_CONFIG = [
  { id: '903-01', number: '903-01', title: 'نظرة عامة', icon: Activity },
  { id: '903-02', number: '903-02', title: 'جميع الأدوار', icon: UserCheck },
  { id: '903-03', number: '903-03', title: 'إنشاء دور جديد', icon: Plus },
  { id: '903-04', number: '903-04', title: 'تعيين الموظفين', icon: Users },
  { id: '903-05', number: '903-05', title: 'نقل بين الأدوار', icon: ArrowRightLeft },
  { id: '903-06', number: '903-06', title: 'الصلاحيات الافتراضية', icon: Shield },
  { id: '903-07', number: '903-07', title: 'خصائص الأدوار', icon: Settings },
  { id: '903-08', number: '903-08', title: 'التسلسل الوظيفي', icon: Layers },
  { id: '903-09', number: '903-09', title: 'الموظفون والأدوار', icon: ClipboardCheck },
  { id: '903-10', number: '903-10', title: 'سجل التغييرات', icon: History },
  { id: '903-11', number: '903-11', title: 'التقارير', icon: BarChart3 },
  { id: '903-12', number: '903-12', title: 'قوائم الإسناد', icon: CheckSquare },
  { id: '903-13', number: '903-13', title: 'الإشعارات', icon: Bell },
  { id: '903-14', number: '903-14', title: 'الأرشيف', icon: Archive },
  { id: '903-15', number: '903-15', title: 'الإعدادات', icon: Settings },
];

// ===== المستويات الوظيفية =====
const JOB_LEVELS = [
  { value: 'executive', label: 'تنفيذي', color: 'bg-red-100 text-red-700', icon: Star },
  { value: 'senior', label: 'أول', color: 'bg-purple-100 text-purple-700', icon: Award },
  { value: 'mid', label: 'متوسط', color: 'bg-blue-100 text-blue-700', icon: Target },
  { value: 'junior', label: 'مبتدئ', color: 'bg-green-100 text-green-700', icon: User },
];

// ===== حالات الأدوار =====
const ROLE_STATUSES = [
  { value: 'active', label: 'نشط', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'inactive', label: 'معطل', color: 'bg-gray-100 text-gray-700', icon: X },
  { value: 'pending', label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  { value: 'archived', label: 'مؤرشف', color: 'bg-gray-100 text-gray-700', icon: Archive },
];

// ===== الأقسام =====
const DEPARTMENTS = [
  { value: 'management', label: 'الإدارة', icon: Building, color: 'blue' },
  { value: 'engineering', label: 'الهندسة', icon: Briefcase, color: 'purple' },
  { value: 'hr', label: 'الموارد البشرية', icon: Users, color: 'green' },
  { value: 'finance', label: 'المالية', icon: BarChart3, color: 'emerald' },
  { value: 'it', label: 'تقنية المعلومات', icon: Settings, color: 'cyan' },
  { value: 'operations', label: 'العمليات', icon: Activity, color: 'orange' },
];

// ===== بيانات تجريبية للأدوار =====
const SAMPLE_ROLES = [
  {
    id: 'ROLE-001',
    code: 'ADMIN',
    nameAr: 'مدير النظام',
    nameEn: 'System Administrator',
    description: 'إدارة كاملة للنظام بجميع الصلاحيات',
    responsibilities: 'إدارة المستخدمين، الصلاحيات، الإعدادات، النسخ الاحتياطي، الأمان',
    level: 'executive',
    department: 'it',
    permissions: 2567,
    employees: 2,
    employeesList: [
      { id: '817-00101', name: 'محمد أحمد السعيد', joinDate: '2024-01-01' },
      { id: '817-00102', name: 'علي خالد العمري', joinDate: '2024-02-15' },
    ],
    status: 'active',
    canAssignTasks: true,
    allowMultiple: true,
    allowMultiRole: true,
    createdDate: '2024-01-01',
    lastModified: '2025-01-15',
    modifiedBy: 'مدير النظام',
    parentRole: null,
    order: 1,
  },
  {
    id: 'ROLE-002',
    code: 'TRANS_MGR',
    nameAr: 'مدير المعاملات',
    nameEn: 'Transactions Manager',
    description: 'إدارة ومتابعة جميع المعاملات والعملاء',
    responsibilities: 'إدارة المعاملات، متابعة العملاء، الموافقات، التقارير',
    level: 'senior',
    department: 'operations',
    permissions: 450,
    employees: 5,
    employeesList: [
      { id: '817-00103', name: 'أحمد محمد علي', joinDate: '2024-01-10' },
      { id: '817-00104', name: 'فاطمة خالد', joinDate: '2024-02-01' },
      { id: '817-00105', name: 'سعد عبدالله', joinDate: '2024-03-15' },
      { id: '817-00106', name: 'نورة أحمد', joinDate: '2024-04-01' },
      { id: '817-00107', name: 'خالد محمد', joinDate: '2024-05-10' },
    ],
    status: 'active',
    canAssignTasks: true,
    allowMultiple: true,
    allowMultiRole: true,
    createdDate: '2024-01-01',
    lastModified: '2025-01-10',
    modifiedBy: 'مدير الموارد البشرية',
    parentRole: 'ROLE-001',
    order: 2,
  },
  {
    id: 'ROLE-003',
    code: 'HR_SPEC',
    nameAr: 'موظف موارد بشرية',
    nameEn: 'HR Specialist',
    description: 'إدارة شؤون الموظفين والعقود والرواتب',
    responsibilities: 'إدارة الموظفين، العقود، الرواتب، الحضور، التدريب',
    level: 'mid',
    department: 'hr',
    permissions: 380,
    employees: 3,
    employeesList: [
      { id: '817-00108', name: 'سارة علي', joinDate: '2024-01-15' },
      { id: '817-00109', name: 'ليلى محمد', joinDate: '2024-02-20' },
      { id: '817-00110', name: 'منى سعد', joinDate: '2024-03-01' },
    ],
    status: 'active',
    canAssignTasks: true,
    allowMultiple: true,
    allowMultiRole: true,
    createdDate: '2024-01-01',
    lastModified: '2025-01-12',
    modifiedBy: 'مدير الموارد البشرية',
    parentRole: 'ROLE-001',
    order: 3,
  },
];

// ===== سجل التغييرات =====
const CHANGE_LOG = [
  {
    id: 'CHG-001',
    action: 'تعيين موظف',
    roleId: 'ROLE-002',
    roleName: 'مدير المعاملات',
    employeeId: '817-00107',
    employeeName: 'خالد محمد',
    details: 'تم تعيين الموظف للدور بنجاح',
    performedBy: 'مدير الموارد البشرية',
    timestamp: '2025-01-15 14:30:22',
  },
  {
    id: 'CHG-002',
    action: 'تعديل صلاحيات',
    roleId: 'ROLE-003',
    roleName: 'موظف موارد بشرية',
    details: 'إضافة 15 صلاحية جديدة للدور',
    performedBy: 'مدير النظام',
    timestamp: '2025-01-12 10:15:45',
  },
];

const JobRoles_Complete_903: React.FC = () => {
  const [activeTab, setActiveTab] = useState('903-01');
  const [roles, setRoles] = useState(SAMPLE_ROLES);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  // إحصائيات
  const stats = useMemo(() => ({
    total: roles.length,
    active: roles.filter(r => r.status === 'active').length,
    totalEmployees: roles.reduce((sum, r) => sum + r.employees, 0),
    canAssign: roles.filter(r => r.canAssignTasks).length,
    executive: roles.filter(r => r.level === 'executive').length,
    senior: roles.filter(r => r.level === 'senior').length,
    mid: roles.filter(r => r.level === 'mid').length,
    junior: roles.filter(r => r.level === 'junior').length,
  }), [roles]);

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 903-01: نظرة عامة
      case '903-01':
        return (
          <div className="universal-dense-tab-content">
            {/* إحصائيات رئيسية */}
            <div className="dense-stats-grid mb-4">
              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-blue-100 text-blue-600">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.total}</div>
                <div className="dense-stat-label">إجمالي الأدوار</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-green-100 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.active}</div>
                <div className="dense-stat-label">أدوار نشطة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-purple-100 text-purple-600">
                  <Users className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.totalEmployees}</div>
                <div className="dense-stat-label">موظفون مسكنون</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-orange-100 text-orange-600">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.canAssign}</div>
                <div className="dense-stat-label">في قوائم الإسناد</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-red-100 text-red-600">
                  <Star className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.executive}</div>
                <div className="dense-stat-label">تنفيذي</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-cyan-100 text-cyan-600">
                  <Award className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.senior}</div>
                <div className="dense-stat-label">أول</div>
              </Card>
            </div>

            <Separator className="my-4" />

            {/* التوزيع حسب القسم */}
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Building className="h-4 w-4" />
                  توزيع الأدوار حسب القسم
                </h2>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-3 gap-2">
                  {DEPARTMENTS.map((dept) => {
                    const deptRoles = roles.filter(r => r.department === dept.value);
                    const deptEmployees = deptRoles.reduce((sum, r) => sum + r.employees, 0);
                    const DeptIcon = dept.icon;
                    
                    return (
                      <div key={dept.value} className="dense-content-card p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-lg bg-${dept.color}-100 flex items-center justify-center`}>
                            <DeptIcon className={`h-4 w-4 text-${dept.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium">{dept.label}</div>
                            <div className="text-xs text-gray-600">{deptRoles.length} دور</div>
                          </div>
                        </div>
                        <Badge className={`bg-${dept.color}-100 text-${dept.color}-700 text-xs`}>
                          {deptEmployees} موظف
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* الأدوار النشطة */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <CheckCircle className="h-4 w-4" />
                  الأدوار النشطة ({stats.active})
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  دور جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {roles.filter(r => r.status === 'active').map((role) => {
                    const levelInfo = JOB_LEVELS.find(l => l.value === role.level);
                    const deptInfo = DEPARTMENTS.find(d => d.value === role.department);
                    
                    return (
                      <div key={role.id} className="dense-content-card p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="text-xs bg-gray-100 text-gray-700 font-mono">
                                {role.id}
                              </Badge>
                              <Badge className={levelInfo?.color}>
                                {levelInfo?.label}
                              </Badge>
                              {role.canAssignTasks && (
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  <CheckSquare className="h-3 w-3 ml-1" />
                                  في الإسناد
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs font-medium mb-1">{role.nameAr}</div>
                            <div className="text-xs text-gray-600 mb-2">{role.description}</div>
                            <div className="dense-grid dense-grid-3 gap-2 text-xs">
                              <div>
                                <span className="text-gray-600">القسم:</span>
                                <span className="font-medium mr-1">{deptInfo?.label}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">الموظفون:</span>
                                <span className="font-medium mr-1">{role.employees}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">الصلاحيات:</span>
                                <span className="font-medium mr-1">{role.permissions}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 pt-2 border-t">
                          <Button className="dense-btn dense-btn-primary">
                            <Eye className="h-3 w-3" />
                            عرض
                          </Button>
                          <Button className="dense-action-btn">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Users className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Shield className="h-3 w-3" />
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

      // 903-02: جميع الأدوار
      case '903-02':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <UserCheck className="h-4 w-4" />
                  جميع الأدوار الوظيفية ({stats.total})
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
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المعرّف</TableHead>
                      <TableHead className="text-right">اسم الدور</TableHead>
                      <TableHead className="text-right">المستوى</TableHead>
                      <TableHead className="text-right">القسم</TableHead>
                      <TableHead className="text-right">الموظفون</TableHead>
                      <TableHead className="text-right">الصلاحيات</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => {
                      const levelInfo = JOB_LEVELS.find(l => l.value === role.level);
                      const statusInfo = ROLE_STATUSES.find(s => s.value === role.status);
                      const deptInfo = DEPARTMENTS.find(d => d.value === role.department);
                      
                      return (
                        <TableRow key={role.id}>
                          <TableCell className="text-right">
                            <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                              {role.id}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-xs font-medium">{role.nameAr}</div>
                            <div className="text-xs text-gray-500">{role.nameEn}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={levelInfo?.color}>
                              {levelInfo?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {deptInfo?.label}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-purple-100 text-purple-700 text-xs">
                              {role.employees}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              {role.permissions}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={statusInfo?.color}>
                              {statusInfo?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1 justify-end">
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

      // 903-03: إنشاء دور جديد
      case '903-03':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Plus className="h-4 w-4" />
                  إنشاء دور وظيفي جديد
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Save className="h-3 w-3" />
                  حفظ
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* معلومات أساسية */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      معلومات أساسية
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <InputWithCopy
                        label="معرّف الدور"
                        id="roleId"
                        placeholder="ROLE-006"
                      />

                      <InputWithCopy
                        label="رمز الدور (بالإنجليزية)"
                        id="roleCode"
                        placeholder="PROJECT_MGR"
                      />

                      <InputWithCopy
                        label="اسم الدور (بالعربية)"
                        id="roleNameAr"
                        placeholder="مدير مشاريع"
                      />

                      <InputWithCopy
                        label="اسم الدور (بالإنجليزية)"
                        id="roleNameEn"
                        placeholder="Project Manager"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* التصنيف */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      التصنيف والتسلسل
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <SelectWithCopy
                        label="المستوى الوظيفي"
                        id="jobLevel"
                        options={[
                          { value: '', label: 'اختر المستوى' },
                          ...JOB_LEVELS.map(l => ({ value: l.value, label: l.label }))
                        ]}
                      />

                      <SelectWithCopy
                        label="القسم/الإدارة"
                        id="department"
                        options={[
                          { value: '', label: 'اختر القسم' },
                          ...DEPARTMENTS.map(d => ({ value: d.value, label: d.label }))
                        ]}
                      />

                      <SelectWithCopy
                        label="الدور الأعلى (إن وجد)"
                        id="parentRole"
                        options={[
                          { value: '', label: 'لا يوجد' },
                          ...roles.map(r => ({ value: r.id, label: r.nameAr }))
                        ]}
                      />

                      <InputWithCopy
                        label="الترتيب"
                        id="order"
                        type="number"
                        placeholder="1"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* الوصف والمسؤوليات */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      الوصف والمسؤوليات
                    </h3>
                    <div className="space-y-3">
                      <TextAreaWithCopy
                        label="وصف الدور"
                        id="roleDescription"
                        placeholder="وصف تفصيلي للدور الوظيفي..."
                        rows={3}
                      />

                      <TextAreaWithCopy
                        label="المسؤوليات الرئيسية"
                        id="responsibilities"
                        placeholder="• المسؤولية الأولى&#10;• المسؤولية الثانية&#10;• المسؤولية الثالثة"
                        rows={4}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* الإعدادات */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      الإعدادات والخصائص
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-xs font-medium">الظهور في قوائم إسناد المهام</div>
                          <div className="text-xs text-gray-600">
                            عند التفعيل، سيظهر الموظفون في هذا الدور عند إسناد المهام
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-xs font-medium">السماح بتعيين موظفين متعددين</div>
                          <div className="text-xs text-gray-600">
                            هل يمكن تعيين أكثر من موظف واحد لهذا الدور؟
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-xs font-medium">السماح بالأدوار المتعددة</div>
                          <div className="text-xs text-gray-600">
                            هل يمكن للموظف في هذا الدور شغل أدوار أخرى؟
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-xs font-medium">دور نشط</div>
                          <div className="text-xs text-gray-600">
                            هل الدور متاح للاستخدام حالياً؟
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* الصلاحيات الافتراضية */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      الصلاحيات الافتراضية
                    </h3>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-3">
                      <div className="flex items-start gap-2 text-xs text-blue-800">
                        <Info className="h-4 w-4 flex-shrink-0" />
                        <span>
                          الصلاحيات المحددة هنا ستُطبق تلقائياً على جميع الموظفين المعينين لهذا الدور.
                          يمكن تعديل الصلاحيات من شاشة الصلاحيات (902).
                        </span>
                      </div>
                    </div>

                    <Button className="dense-btn dense-btn-secondary w-full">
                      <Shield className="h-3 w-3" />
                      اختيار الصلاحيات من شاشة الصلاحيات (902)
                    </Button>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div className="text-xs text-blue-800">
                        <strong>ملاحظة هامة:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>بعد إنشاء الدور، يمكنك تعيين موظفين من تاب "تعيين الموظفين"</li>
                          <li>الصلاحيات الافتراضية تُطبق على جميع الموظفين في الدور</li>
                          <li>يمكن إعطاء صلاحيات إضافية لموظف محدد من شاشة الصلاحيات</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 903-04: تعيين الموظفين
      case '903-04':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Users className="h-4 w-4" />
                  تعيين موظفين للأدوار
                </h2>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="text-xs text-green-800">
                      <strong>تعيين الموظفين للأدوار:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>يمكن تعيين موظف واحد أو أكثر لنفس الدور</li>
                        <li>يمكن للموظف الواحد شغل عدة أدوار في نفس الوقت</li>
                        <li>عند التعيين، تُطبق الصلاحيات الافتراضية للدور تلقائياً</li>
                        <li>يظهر الموظفون في قوائم إسناد المهام حسب أدوارهم</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="dense-grid dense-grid-2 gap-3">
                  <SelectWithCopy
                    label="الدور الوظيفي"
                    id="roleSelect"
                    options={[
                      { value: '', label: 'اختر الدور' },
                      ...roles.map(r => ({ value: r.id, label: r.nameAr }))
                    ]}
                  />

                  <SelectWithCopy
                    label="الموظف"
                    id="employeeSelect"
                    options={[
                      { value: '', label: 'اختر الموظف' },
                      { value: '817-00123', label: 'أحمد محمد علي - 817-00123' },
                      { value: '817-00124', label: 'فاطمة خالد - 817-00124' },
                      { value: '817-00125', label: 'سعد عبدالله - 817-00125' },
                    ]}
                  />

                  <DateInputWithToday
                    label="تاريخ البداية"
                    id="startDate"
                  />

                  <DateInputWithToday
                    label="تاريخ الانتهاء (اختياري)"
                    id="endDate"
                  />
                </div>

                <div className="mt-3 flex gap-2">
                  <Button className="dense-btn dense-btn-primary">
                    <Send className="h-3 w-3" />
                    تعيين الموظف
                  </Button>
                  <Button className="dense-btn dense-btn-secondary">
                    <Users className="h-3 w-3" />
                    تعيين متعدد
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* الموظفون المعينون */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <ClipboardCheck className="h-4 w-4" />
                  الموظفون المعينون للأدوار
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roles.map((role) => (
                    <div key={role.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700 font-mono text-xs">
                            {role.id}
                          </Badge>
                          <span className="text-xs font-medium">{role.nameAr}</span>
                        </div>
                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                          {role.employees} موظف
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        {role.employeesList.map((emp) => (
                          <div key={emp.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border text-xs hover:bg-blue-50 hover:border-blue-300 transition-all">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs">
                                {emp.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium">{emp.name}</div>
                                <div className="text-gray-600 font-mono">{emp.id}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">منذ {emp.joinDate}</span>
                              <Button className="dense-action-btn h-6 w-6">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 903-05: نقل بين الأدوار
      case '903-05':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <ArrowRightLeft className="h-4 w-4" />
                  نقل موظفين بين الأدوار
                </h2>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <div className="text-xs text-purple-800">
                      <strong>نقل الموظفين بين الأدوار:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>يمكن نقل موظف من دور إلى دور آخر مع الاحتفاظ بالصلاحيات</li>
                        <li>يمكن إضافة دور جديد للموظف دون إزالة الدور الحالي</li>
                        <li>عند النقل، تُحدّث الصلاحيات تلقائياً حسب الدور الجديد</li>
                        <li>يتم تسجيل جميع عمليات النقل في سجل التغييرات</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="dense-grid dense-grid-2 gap-3">
                  <SelectWithCopy
                    label="الموظف"
                    id="employeeToMove"
                    options={[
                      { value: '', label: 'اختر الموظف' },
                      { value: '817-00123', label: 'أحمد محمد علي - 817-00123' },
                      { value: '817-00124', label: 'فاطمة خالد - 817-00124' },
                    ]}
                  />

                  <SelectWithCopy
                    label="الدور الحالي"
                    id="currentRole"
                    options={[
                      { value: '', label: 'اختر الدور الحالي' },
                      ...roles.map(r => ({ value: r.id, label: r.nameAr }))
                    ]}
                  />

                  <SelectWithCopy
                    label="الدور الجديد"
                    id="newRole"
                    options={[
                      { value: '', label: 'اختر الدور الجديد' },
                      ...roles.map(r => ({ value: r.id, label: r.nameAr }))
                    ]}
                  />

                  <SelectWithCopy
                    label="نوع العملية"
                    id="moveType"
                    options={[
                      { value: 'replace', label: 'استبدال (إزالة الدور القديم)' },
                      { value: 'add', label: 'إضافة (الاحتفاظ بالدور القديم)' },
                    ]}
                  />

                  <DateInputWithToday
                    label="تاريخ التنفيذ"
                    id="moveDate"
                  />

                  <div className="col-span-2">
                    <TextAreaWithCopy
                      label="سبب النقل (اختياري)"
                      id="moveReason"
                      placeholder="السبب أو الملاحظات..."
                      rows={2}
                    />
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button className="dense-btn dense-btn-primary">
                    <ArrowRightLeft className="h-3 w-3" />
                    تنفيذ النقل
                  </Button>
                  <Button className="dense-btn dense-btn-secondary">
                    <Bell className="h-3 w-3" />
                    نقل وإشعار
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 903-06: الصلاحيات الافتراضية
      case '903-06':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Shield className="h-4 w-4" />
                  إدارة الصلاحيات الافتراضية للأدوار
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Shield className="h-3 w-3" />
                  تحديث
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <div key={role.id} className="dense-content-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {role.id}
                          </Badge>
                          <span className="text-xs font-medium">{role.nameAr}</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                          {role.permissions} صلاحية
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 pt-2 border-t">
                        <Button className="dense-btn dense-btn-primary">
                          <Eye className="h-3 w-3" />
                          عرض الصلاحيات
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

      // 903-07: خصائص الأدوار
      case '903-07':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Settings className="h-4 w-4" />
                  تعديل خصائص الأدوار
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {roles.map((role) => {
                    const levelInfo = JOB_LEVELS.find(l => l.value === role.level);
                    const deptInfo = DEPARTMENTS.find(d => d.value === role.department);
                    
                    return (
                      <div key={role.id} className="dense-content-card p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="text-xs bg-gray-100 text-gray-700 font-mono">
                                {role.id}
                              </Badge>
                              <Badge className={levelInfo?.color}>
                                {levelInfo?.label}
                              </Badge>
                            </div>
                            <div className="text-xs font-medium mb-1">{role.nameAr}</div>
                            <div className="dense-grid dense-grid-3 gap-2 text-xs">
                              <div>
                                <span className="text-gray-600">القسم:</span>
                                <span className="font-medium mr-1">{deptInfo?.label}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">الموظفون:</span>
                                <span className="font-medium mr-1">{role.employees}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">الصلاحيات:</span>
                                <span className="font-medium mr-1">{role.permissions}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 pt-2 border-t">
                          <Button className="dense-btn dense-btn-primary">
                            <Edit className="h-3 w-3" />
                            ت��ديل
                          </Button>
                          <Button className="dense-action-btn">
                            <Settings className="h-3 w-3" />
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

      // 903-08: التسلسل الوظيفي
      case '903-08':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Layers className="h-4 w-4" />
                  التسلسل الوظيفي والهيكل التنظيمي
                </h2>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 mb-4">
                  <div className="text-center">
                    <Layers className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <h3 className="text-sm font-medium text-blue-800 mb-1">الهيكل التنظيمي</h3>
                    <p className="text-xs text-blue-600">عرض التسلسل الوظيفي والعلاقات بين الأدوار</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {roles.filter(r => !r.parentRole).map((role) => (
                    <div key={role.id} className="border-r-4 border-blue-500 bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-700 font-mono text-xs">
                          {role.id}
                        </Badge>
                        <span className="text-xs font-medium">{role.nameAr}</span>
                      </div>
                      
                      {/* الأدوار التابعة */}
                      <div className="mr-6 mt-2 space-y-1">
                        {roles.filter(r => r.parentRole === role.id).map((childRole) => (
                          <div key={childRole.id} className="border-r-2 border-purple-400 bg-purple-50 rounded p-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-purple-100 text-purple-700 font-mono text-xs">
                                {childRole.id}
                              </Badge>
                              <span className="text-xs">{childRole.nameAr}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 903-09: الموظفون والأدوار
      case '903-09':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <ClipboardCheck className="h-4 w-4" />
                  علاقات الموظفين بالأدوار
                </h2>
                <Button className="dense-btn dense-btn-secondary">
                  <Download className="h-3 w-3" />
                  تصدير
                </Button>
              </CardHeader>
              <CardContent>
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الموظف</TableHead>
                      <TableHead className="text-right">الأدوار</TableHead>
                      <TableHead className="text-right">الصلاحيات</TableHead>
                      <TableHead className="text-right">تاريخ التعيين</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.flatMap(role => 
                      role.employeesList.map(emp => ({
                        ...emp,
                        role: role,
                      }))
                    ).map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-right">
                          <div className="text-xs font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{item.id}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            {item.role.nameAr}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-purple-100 text-purple-700 text-xs">
                            {item.role.permissions}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {item.joinDate}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button className="dense-action-btn">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn">
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

      // 903-10: سجل التغييرات
      case '903-10':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <History className="h-4 w-4" />
                  سجل التغييرات الشامل
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
                  {CHANGE_LOG.map((log) => (
                    <div key={log.id} className="dense-content-card p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              {log.action}
                            </Badge>
                            <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                              {log.roleId}
                            </Badge>
                          </div>
                          <div className="text-xs font-medium mb-1">{log.roleName}</div>
                          {log.employeeName && (
                            <div className="text-xs text-gray-600 mb-1">
                              <strong>الموظف:</strong> {log.employeeName} ({log.employeeId})
                            </div>
                          )}
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

      // 903-11: التقارير
      case '903-11':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <BarChart3 className="h-4 w-4" />
                  تقارير الأدوار الوظيفية
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Download className="h-3 w-3" />
                  تصدير
                </Button>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-3">
                  {[
                    { name: 'تقرير الأدوار والموظفين', icon: Users, count: `${stats.total} دور` },
                    { name: 'تقرير التسلسل الوظيفي', icon: Layers, count: 'هيكل كامل' },
                    { name: 'تقرير توزيع الموظفين', icon: Building, count: `${stats.totalEmployees} موظف` },
                    { name: 'تقرير الأدوار الفارغة', icon: AlertTriangle, count: '0 دور' },
                    { name: 'تقرير الموظفين بدون أدوار', icon: User, count: '0 موظف' },
                    { name: 'تقرير التغييرات الأخيرة', icon: History, count: `${CHANGE_LOG.length} تغيير` },
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

      // 903-12: قوائم الإسناد
      case '903-12':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <CheckSquare className="h-4 w-4" />
                  إعدادات قوائم الإسناد
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Save className="h-3 w-3" />
                  حفظ
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="text-xs text-green-800">
                      <strong>قوائم إسناد المهام:</strong>
                      <p className="mt-2">
                        الأدوار التي يتم تفعيل خيار "الظهور في قوائم الإسناد" لها سيظهر موظفوها 
                        في القوائم عند إسناد المهام والمعاملات والمشاريع.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {role.id}
                          </Badge>
                          <span className="text-xs font-medium">{role.nameAr}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {role.employees} موظف سيظهرون في قوائم الإسناد
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={role.canAssignTasks} />
                        {role.canAssignTasks && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 903-13: الإشعارات
      case '903-13':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Bell className="h-4 w-4" />
                  إشعارات الأدوار والتعيينات
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  إشعار جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { type: 'success', message: 'تم تعيين خالد محمد لدور مدير المعاملات بنجاح', time: 'منذ 5 دقائق' },
                    { type: 'info', message: 'تم تحديث صلاحيات دور موظف الموارد البشرية', time: 'منذ 15 دقيقة' },
                    { type: 'warning', message: 'دور "محاسب" لا يحتوي على موظفين', time: 'منذ ساعة' },
                  ].map((notif, i) => (
                    <div key={i} className={`dense-content-card p-3 border-r-4 ${
                      notif.type === 'success' ? 'border-green-500 bg-green-50' :
                      notif.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
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

      // 903-14: الأرشيف
      case '903-14':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Archive className="h-4 w-4" />
                  الأدوار المؤرشفة
                </h2>
                <Button className="dense-btn dense-btn-secondary">
                  <RefreshCw className="h-3 w-3" />
                  استعادة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <Archive className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">لا توجد أدوار مؤرشفة حالياً</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 903-15: الإعدادات
      case '903-15':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Settings className="h-4 w-4" />
                  إعدادات نظام الأدوار
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
                      <div className="text-xs font-medium">السماح بالأدوار المتعددة افتراضياً</div>
                      <div className="text-xs text-gray-600">السماح للموظف بشغل عدة أدوار</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium">إرسال إشعارات عند التعيين</div>
                      <div className="text-xs text-gray-600">إشعار الموظفين عند تعيينهم لأدوار جديدة</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium">مراجعة دورية للأدوار</div>
                      <div className="text-xs text-gray-600">مراجعة ربع سنوية لجميع الأدوار والتعيينات</div>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium">تطبيق الصلاحيات تلقائياً</div>
                      <div className="text-xs text-gray-600">تطبيق صلاحيات الدور على الموظف فوراً</div>
                    </div>
                    <Switch defaultChecked />
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
    <div className="screen-with-vertical-tabs-layout">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                الأدوار الوظيفية
              </h2>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                15 تبويب • الشاشة 903
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-1 mt-2">
            <Badge className="text-xs bg-blue-100 text-blue-800">
              <UserCheck className="w-2 h-2 ml-1" />
              {stats.total} دور
            </Badge>
            <Badge className="text-xs bg-purple-100 text-purple-800">
              <Users className="w-2 h-2 ml-1" />
              {stats.totalEmployees}
            </Badge>
          </div>
        </div>

        <ScrollArea className="vertical-tabs-sidebar-body">
          {TABS_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`vertical-tab-item-condensed ${activeTab === tab.id ? 'active' : ''}`}
            >
              <div className="flex items-center gap-2 flex-1">
                {React.createElement(tab.icon, { className: 'h-4 w-4 flex-shrink-0' })}
                <span className="vertical-tab-title-condensed">{tab.title}</span>
              </div>
              <span className={`vertical-tab-number-condensed ${activeTab === tab.id ? 'active' : ''}`}>
                {tab.number}
              </span>
            </button>
          ))}
        </ScrollArea>

        <div className="vertical-tabs-sidebar-footer">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {TABS_CONFIG.findIndex(tab => tab.id === activeTab) + 1} من {TABS_CONFIG.length}
            </span>
            <Button className="dense-btn dense-btn-secondary">
              <RefreshCw className="h-3 w-3" />
              تحديث
            </Button>
          </div>
        </div>
      </div>

      {/* مساحة المحتوى */}
      <div className="vertical-tabs-content-area">
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                  الشاشة 903 - إدارة الأدوار الوظيفية
                </h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نظام شامل • ربط بالصلاحيات والموظفين • 15 تبويب
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-700 text-xs">
                <UserCheck className="h-3 w-3 ml-1" />
                {stats.total} دور
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 text-xs">
                <code className="font-code">SCR-903</code>
              </Badge>
            </div>
          </div>
        </div>

        <div className="vertical-tabs-content-body">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default JobRoles_Complete_903;
