/**
 * الشاشة 903 - إدارة الأدوار الوظيفية - v10.0 WITH PERMISSIONS SYSTEM
 * (الإصدار الديناميكي الكامل - لا يعتمد على أي بيانات تجريبية)
 * * هذا الملف هو الحاوية الرئيسية (Container) الذي:
 * 1. يجلب جميع البيانات المطلوبة باستخدام react-query.
 * 2. يدير الحالة المركزية (مثل `selectedRoleId`).
 * 3. يعرض التبويب المناسب بناءً على `activeTab`.
 * 4. يمرر البيانات والدوال (props) إلى التبويبات الفرعية.
 */
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import {
  UserCheck, Users, Shield, Settings, Activity, BarChart3,
  Plus, Edit, Eye, Download, Layers, History, Archive,
  ArrowRightLeft, ClipboardCheck, CheckSquare, Bell,
  FileText, X, Check, ChevronRight, UserPlus,
  ChevronDown, ChevronUp, AlertCircle, Loader2, Search, UserMinus,
  ShieldCheck
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner';
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';
// --- استيراد دوال الـ API ---
import * as roleApi from '../../api/roleApi';
import * as permApi from '../../api/permissionApi';
import * as empApi from '../../api/employeeApi';
import * as dashApi from '../../api/dashboardApi';
// --- استيراد الواجهات (Interfaces) ---
import { JobRole, RoleChange, AssignmentList, Notification, RoleDetails } from '../../api/roleApi';
import { Permission, PermissionGroup } from '../../api/permissionApi';
import { Employee } from '../../api/employeeApi';
import { RoleDashboardStats } from '../../api/dashboardApi';
// --- استيراد مكونات التبويبات الفرعية ---
// (تأكد من أن هذه الملفات موجودة في المسار الصحيح)
import RolePermissionsTab from './tabs/RolePermissionsTab'; 
import PermissionCreationTab from './tabs/PermissionCreationTab';

// --- قائمة التبويبات (مع التبويب 16) ---
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
  { id: '903-16', number: '903-16', title: 'إنشاء صلاحيات', icon: ShieldCheck },
];

const JobRoles_Complete_903_v10: React.FC = () => {
  const [activeTab, setActiveTab] = useState('903-01');
  const queryClient = useQueryClient();
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  // States للإعدادات
  const [autoAssign, setAutoAssign] = useState(false);
  const [notifyOnChange, setNotifyOnChange] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [enableHierarchy, setEnableHierarchy] = useState(true);

  // States للنوافذ المنبثقة
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // States لنظام الصلاحيات (في نموذج الإنشاء)
  const [permissionMode, setPermissionMode] = useState<'groups' | 'individual'>('groups');
  const [selectedPermissionGroups, setSelectedPermissionGroups] = useState<string[]>([]);
  const [selectedIndividualPermissions, setSelectedIndividualPermissions] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['عرض']);

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
    fromRole: '', // سيتم جلبه من الموظف
    toRole: '',
    effectiveDate: '',
    reason: ''
  });

  // ==================== جلب البيانات (Data Fetching) ====================

  // (903-01) جلب إحصائيات النظرة العامة
  const { data: overviewStats, isLoading: isLoadingStats } = useQuery<RoleDashboardStats>({
    queryKey: ['roleDashboardStats'], 
    queryFn: dashApi.fetchRoleDashboardStats
  });

  // (903-02) جلب جميع الأدوار
  const { data: roles, isLoading: isLoadingRoles } = useQuery<JobRole[]>({
    queryKey: ['roles'], 
    queryFn: roleApi.fetchRoles
  });

  // (903-03 / 903-04) جلب جميع الموظفين (للاختيار)
  const { data: employees, isLoading: isLoadingEmployees } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: empApi.fetchEmployees
  });

  // (903-03 / 903-06 / 903-16) جلب مجموعات الصلاحيات
  const { data: permissionGroups, isLoading: isLoadingPermGroups } = useQuery<PermissionGroup[]>({
    queryKey: ['permissionGroups'],
    queryFn: permApi.fetchPermissionGroups
  });

  // (903-03 / 903-06 / 903-16) جلب الصلاحيات المنفردة
  const { data: individualPermissions, isLoading: isLoadingIndivPerms } = useQuery<Permission[]>({
    queryKey: ['individualPermissions'],
    queryFn: permApi.fetchIndividualPermissions
  });

  // (903-10) جلب سجل التغييرات
  const { data: roleChanges, isLoading: isLoadingRoleChanges } = useQuery<RoleChange[]>({
    queryKey: ['roleChanges'],
    queryFn: roleApi.fetchRoleChanges,
    enabled: activeTab === '903-10' // جلب فقط عند فتح التاب
  });

  // (903-12) جلب قوائم الإسناد
  const { data: assignmentLists, isLoading: isLoadingAssignLists } = useQuery<AssignmentList[]>({
    queryKey: ['assignmentLists'],
    queryFn: roleApi.fetchAssignmentLists,
    enabled: activeTab === '903-12' // جلب فقط عند فتح التاب
  });

  // (903-13) جلب الإشعارات
  const { data: notifications, isLoading: isLoadingNotifications } = useQuery<Notification[]>({
    queryKey: ['roleNotifications'],
    queryFn: roleApi.fetchRoleNotifications,
    enabled: activeTab === '903-13' // جلب فقط عند فتح التاب
  });

  // (Tabs 06-14) جلب تفاصيل الدور المحدد
  const { data: selectedRoleDetails, isLoading: isLoadingRoleDetails } = useQuery<RoleDetails>({
    queryKey: ['roleDetails', selectedRoleId], // مفتاح الكاش يعتمد على ID الدور
    queryFn: () => roleApi.fetchRoleById(selectedRoleId!),
    enabled: !!selectedRoleId, // لا تقم بالطلب إلا إذا كان هناك ID محدد
    onError: () => {
      toast.error('فشل جلب تفاصيل الدور');
      setSelectedRoleId(null); // إلغاء التحديد عند الخطأ
    }
  });

  // ==================== عمليات الحفظ (Mutations) ====================

  // (903-03) إنشاء دور جديد
  const createRoleMutation = useMutation({
    mutationFn: roleApi.createRole,
    onSuccess: (newRoleData) => {
      toast.success(`تم إنشاء الدور "${newRoleData.name}" بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['roles'] }); // تحديث قائمة الأدوار
      queryClient.invalidateQueries({ queryKey: ['roleDashboardStats'] }); // تحديث الإحصائيات
      setShowRoleDialog(false);
      setNewRole({
        code: '', name: '', nameEn: '', department: '', level: '3',
        description: '', responsibilities: '', requirements: ''
      });
      setSelectedPermissionGroups([]);
      setSelectedIndividualPermissions([]);
    },
    onError: (error: any) => {
      toast.error(`فشل إنشاء الدور: ${error.message || 'خطأ غير معروف'}`);
    }
  });

  // (903-04) تعيين موظف
  const assignEmployeeMutation = useMutation({
    mutationFn: roleApi.assignEmployeeToRole,
    onSuccess: () => {
      toast.success('تم تعيين الموظف في الدور بنجاح');
      queryClient.invalidateQueries({ queryKey: ['employees'] }); // تحديث قائمة الموظفين
      queryClient.invalidateQueries({ queryKey: ['roles'] }); // تحديث عدد الموظفين في الدور
      setShowAssignDialog(false);
      setAssignment({ employeeId: '', roleId: '', startDate: '', notes: '' });
    },
    onError: (error: any) => {
      toast.error(`فشل التعيين: ${error.message || 'خطأ غير معروف'}`);
    }
  });

  // (903-05) نقل موظف
  const transferEmployeeMutation = useMutation({
    mutationFn: roleApi.transferEmployeeRole,
    onSuccess: () => {
      toast.success('تم إرسال طلب النقل للاعتماد');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['roleChanges'] }); // تحديث سجل التغييرات
      setShowTransferDialog(false);
      setTransfer({ employeeId: '', fromRole: '', toRole: '', effectiveDate: '', reason: '' });
    },
    onError: (error: any) => {
      toast.error(`فشل النقل: ${error.message || 'خطأ غير معروف'}`);
    }
  });

  // (903-06) تحديث صلاحيات الدور
  const updatePermissionsMutation = useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string, permissionIds: string[] }) => 
      roleApi.updateRolePermissions(roleId, permissionIds),
    onSuccess: () => {
      toast.success('تم تحديث الصلاحيات بنجاح');
      queryClient.invalidateQueries({ queryKey: ['roleDetails', selectedRoleId] });
    },
    onError: () => {
      toast.error('فشل تحديث الصلاحيات');
    }
  });

  // ==================== دوال المساعدة ====================

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

  // دوال نظام الصلاحيات (لنموذج الإنشاء)
  const getTotalSelectedPermissions = () => {
    let total = 0;
    if (permissionMode === 'groups') {
      selectedPermissionGroups.forEach(groupId => {
        const group = (permissionGroups || []).find(g => g.id === groupId);
        if (group) total += group.permissionsCount;
      });
    } else {
      total = selectedIndividualPermissions.length;
    }
    return total;
  };

  const togglePermissionGroup = (groupId: string) => {
    setSelectedPermissionGroups(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const toggleIndividualPermission = (permissionId: string) => {
    setSelectedIndividualPermissions(prev =>
      prev.includes(permissionId) ? prev.filter(id => id !== permissionId) : [...prev, permissionId]
    );
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const permissionsByCategory = useMemo(() => {
    if (!individualPermissions) return [];
    const categoriesMap: Record<string, Permission[]> = {};
    individualPermissions.forEach(perm => {
      const category = perm.category || 'غير مصنف';
      if (!categoriesMap[category]) {
        categoriesMap[category] = [];
      }
      categoriesMap[category].push(perm);
    });
    return Object.entries(categoriesMap).map(([category, permissions]) => ({
      category,
      permissions
    }));
  }, [individualPermissions]);

  // ==================== دوال الإجراءات (Handlers) ====================

  const handleCreateRole = () => {
    if (!newRole.code || !newRole.name) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (permissionMode === 'groups' && selectedPermissionGroups.length === 0) {
      toast.error('يرجى اختيار مجموعة صلاحيات واحدة على الأقل');
      return;
    }
    if (permissionMode === 'individual' && selectedIndividualPermissions.length === 0) {
      toast.error('يرجى اختيار صلاحية واحدة على الأقل');
      return;
    }

    const roleDataPayload = {
      ...newRole,
      level: parseInt(newRole.level, 10),
      responsibilities: newRole.responsibilities.split('\n').filter(Boolean),
      requirements: newRole.requirements.split('\n').filter(Boolean),
      permissionsConfig: {
        mode: permissionMode,
        groups: selectedPermissionGroups,
        individual: selectedIndividualPermissions,
      }
    };

    createRoleMutation.mutate(roleDataPayload);
  };

  const handleAssignEmployee = () => {
    if (!assignment.employeeId || !assignment.roleId) {
      toast.error('يرجى اختيار الموظف والدور');
      return;
    }
    assignEmployeeMutation.mutate(assignment);
  };

  const handleTransferEmployee = () => {
    if (!transfer.employeeId || !transfer.toRole) {
      toast.error('يرجى إكمال جميع البيانات المطلوبة');
      return;
    }
    const emp = (employees || []).find(e => e.id === transfer.employeeId);
    const transferPayload = {
      ...transfer,
      fromRole: emp?.currentRole || 'غير محدد',
    };
    transferEmployeeMutation.mutate(transferPayload);
  };

  const handleViewDetails = () => {
    if(selectedRoleId) {
        // البيانات موجودة في selectedRoleDetails
        setShowDetailsDialog(true);
    }
  };

  const handleSavePermissions = (newPermissionIds: string[]) => {
    if (!selectedRoleId) return;
    updatePermissionsMutation.mutate({ roleId: selectedRoleId, permissionIds: newPermissionIds });
  };

  // ==================== عرض المحتوى (Render) ====================

  const renderLoading = (message: string = 'جاري تحميل البيانات...') => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <Loader2 className="h-12 w-12 mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{message}</p>
      </div>
    </div>
  );

  const RoleDataPlaceholder: React.FC<{ tabId: string; role?: RoleDetails; data?: any; isLoading?: boolean }> = ({ tabId, role, data, isLoading }) => {
    if (isLoading) return renderLoading();
    let content = (
      <pre className="text-xs" dir="ltr" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {JSON.stringify(role || data || { message: "لا توجد بيانات لعرضها" }, null, 2)}
      </pre>
    );
    const currentTab = TABS_CONFIG.find(t => t.id === tabId);

    // تخصيص العرض للتبويبات
    switch(tabId) {
      case '903-08': // التسلسل الوظيفي
        content = (
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>الدور الأب (المدير المباشر)</CardTitle></CardHeader>
              <CardContent>
                {role?.parentRole ? (
                  <p>{role.parentRole.nameAr} (Code: {role.parentRole.code})</p>
                ) : (
                  <p className="text-gray-500">لا يوجد دور أب (هذا هو الدور الأعلى)</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>الأدوار الفرعية (المرؤوسين)</CardTitle></CardHeader>
              <CardContent>
                {role?.childRoles && role.childRoles.length > 0 ? (
                  <ul className="list-disc pr-5">
                    {role.childRoles.map(child => (
                      <li key={child.id}>{child.nameAr} (Code: {child.code})</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">لا يوجد أدوار فرعية لهذا الدور</p>
                )}
              </CardContent>
            </Card>
          </div>
        );
        break;
      case '903-10': // سجل التغييرات
        content = (
          <Table>
            <TableHeader><TableRow><TableHead>موظف</TableHead><TableHead>من دور</TableHead><TableHead>إلى دور</TableHead><TableHead>تاريخ</TableHead><TableHead>الحالة</TableHead></TableRow></TableHeader>
            <TableBody>
              {(roleChanges || []).length === 0 ? (
                 <TableRow><TableCell colSpan={5} className="text-center">لا يوجد سجلات</TableCell></TableRow>
              ) : (roleChanges || []).map(chg => (
                <TableRow key={chg.id}>
                  <TableCell>{chg.employeeName}</TableCell>
                  <TableCell>{chg.oldRole}</TableCell>
                  <TableCell>{chg.newRole}</TableCell>
                  <TableCell>{new Date(chg.changeDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getChangeStatusBadge(chg.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
        break;
      case '903-12': // قوائم الإسناد
        content = (
          <Table>
            <TableHeader><TableRow><TableHead>اسم القائمة</TableHead><TableHead>الوصف</TableHead><TableHead>عدد الأدوار</TableHead><TableHead>عدد الموظفين</TableHead></TableRow></TableHeader>
            <TableBody>
            {(assignmentLists || []).length === 0 ? (
                 <TableRow><TableCell colSpan={4} className="text-center">لا يوجد قوائم</TableCell></TableRow>
              ) : (assignmentLists || []).map(list => (
                <TableRow key={list.id}>
                  <TableCell>{list.name}</TableCell>
                  <TableCell>{list.description}</TableCell>
                  <TableCell>{list.rolesCount}</TableCell>
                  <TableCell>{list.employeesCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
        break;
      case '903-13': // الإشعارات
        content = (
           <div className="space-y-2">
            {(notifications || []).length === 0 ? (
                 <p className="text-center text-gray-500 py-4">لا توجد إشعارات</p>
              ) : (notifications || []).map(notif => (
              <div key={notif.id} className={`p-3 border rounded-lg flex items-start gap-3 ${notif.isRead ? 'bg-gray-50' : 'bg-blue-50'}`}>
                <div className="pt-1">{getNotificationIcon(notif.type)}</div>
                <div className="flex-1">
                  <p className={`text-sm ${!notif.isRead && 'font-bold'}`}>{notif.title}</p>
                  <p className="text-xs text-gray-600">{notif.message}</p>
                </div>
                <div className="text-xs text-gray-500">{new Date(notif.date).toLocaleString()}</div>
              </div>
            ))}
           </div>
        );
        break;
      // (أضف باقي التابات هنا)
    }

    return (
      <div className="space-y-3">
        <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          {currentTab?.icon && React.createElement(currentTab.icon, { className: 'inline-block h-5 w-5 mr-2' })}
          {currentTab?.title}
        </h2>
        {/* رسالة توضيحية للتبويبات غير المكتملة */}
        {['903-05', '903-07', '903-11', '903-14'].includes(tabId) && (
            <p className="text-sm text-gray-600 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                هذا عرض أولي للبيانات الخاصة بالدور المحدد: <strong>{role?.nameAr || ''}</strong>.
                <br/>
                المحتوى المعروض هو بيانات JSON مؤقتة.
            </p>
        )}
        <Card className="card-element card-rtl">
          <CardContent className="p-4">
            {content}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTabContent = () => {
    // --- فحص إذا كان يجب عرض رسالة "الرجاء اختيار دور" ---
    const requiresRole = !['903-01', '903-02', '903-03', '903-04', '903-15', '903-16'].includes(activeTab);

    if (requiresRole && !selectedRoleId) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <UserCheck className="h-16 w-16 mx-auto text-blue-400 mb-4" />
            <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              الرجاء اختيار دور
            </p>
            <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              اختر دوراً من تبويب "جميع الأدوار" (903-02) لعرض تفاصيله هنا.
            </p>
          </div>
        </div>
      );
    }

    // --- فحص إذا كانت التفاصيل قيد التحميل ---
    if (requiresRole && isLoadingRoleDetails) {
      return renderLoading('جاري تحميل تفاصيل الدور...');
    }

    switch (activeTab) {
      case '903-01':
        if (isLoadingStats) return renderLoading('جاري تحميل الإحصائيات...');
        if (!overviewStats) return <p>لم يتم العثور على بيانات.</p>;
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
                  <p className="text-2xl text-blue-600 mb-1">{overviewStats.totalRoles}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الأدوار</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Users className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <p className="text-2xl text-green-600 mb-1">{overviewStats.totalEmployees}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظفون المعينون</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Shield className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                  <p className="text-2xl text-purple-600 mb-1">{overviewStats.totalPermissions.toLocaleString()}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الصلاحيات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Layers className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                  <p className="text-2xl text-orange-600 mb-1">{overviewStats.totalLevels}</p>
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
                  {overviewStats.distribution.map(dist => (
                    <div key={dist.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{dist.name}</span>
                        <span className="text-xs font-mono">{dist.value}%</span>
                      </div>
                      <Progress value={dist.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '903-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>جميع الأدوار الوظيفية</h2>
              <div className="flex gap-2">
                {roles && <Badge variant="outline" className="text-xs">{roles.length} دور</Badge>}
                <Button size="sm" className="h-8 text-xs bg-green-500" onClick={() => setShowRoleDialog(true)}>
                  <Plus className="h-3 w-3 ml-1" />إنشاء دور جديد
                </Button>
              </div>
            </div>
            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <ScrollArea className="h-[500px]">
                  {isLoadingRoles ? (
                    <div className="space-y-2 p-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
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
                        {(roles || []).map((role) => (
                          <TableRow 
                            key={role.id} 
                            className={`hover:bg-blue-50 transition-colors cursor-pointer ${
                              selectedRoleId === role.id ? 'bg-blue-100' : ''
                            }`}
                            onClick={() => setSelectedRoleId(role.id)}
                          >
                            <TableCell className="text-right py-2 text-xs font-mono">{role.code}</TableCell>
                            <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.name}</TableCell>
                            <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.department}</TableCell>
                            <TableCell className="text-right py-2 text-xs">{role.level}</TableCell>
                            <TableCell className="text-right py-2 text-xs">{role.employeesCount || (role as any)._count?.employees || 0}</TableCell>
                            <TableCell className="text-right py-2 text-xs">{role.permissions || (role as any)._count?.permissions || 0}</TableCell>
                            <TableCell className="text-right py-2">{getStatusBadge(role.status)}</TableCell>
                            <TableCell className="text-right py-2">
                              <div className="flex gap-1 justify-end">
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}>
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
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case '903-03':
        const isLoadingForm = isLoadingPermGroups || isLoadingIndivPerms;
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إنشاء دور وظيفي جديد</h2>
              <Button 
                size="sm" 
                className="h-8 text-xs bg-green-500" 
                onClick={handleCreateRole}
                disabled={createRoleMutation.isLoading || isLoadingForm}
              >
                {createRoleMutation.isLoading ? (
                  <Loader2 className="h-3 w-3 ml-1 animate-spin" />
                ) : (
                  <Check className="h-3 w-3 ml-1" />
                )}
                حفظ الدور
              </Button>
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
                  />
                  <InputWithCopy
                    label="اسم الدور بالعربية *"
                    id="role-name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                    placeholder="مثال: مدير عام"
                    required
                  />
                  <InputWithCopy
                    label="اسم الدور بالإنجليزية"
                    id="role-name-en"
                    value={newRole.nameEn}
                    onChange={(e) => setNewRole({...newRole, nameEn: e.target.value})}
                    placeholder="Ex: General Manager"
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
                      { value: 'التسويق', label: 'التسويق' },
                      { value: 'الملكية والشراكة', label: 'الملكية والشراكة' }
                    ]}
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
                />
                <TextAreaWithCopy
                  label="المسؤوليات (واحدة في كل سطر)"
                  id="role-responsibilities"
                  value={newRole.responsibilities}
                  onChange={(e) => setNewRole({...newRole, responsibilities: e.target.value})}
                  rows={4}
                  placeholder="اتخاذ القرارات الاستراتيجية&#10;الإشراف على جميع الأقسام&#10;وضع الخطط طويلة المدى"
                />
                <TextAreaWithCopy
                  label="المتطلبات (واحدة في كل سطر)"
                  id="role-requirements"
                  value={newRole.requirements}
                  onChange={(e) => setNewRole({...newRole, requirements: e.target.value})}
                  rows={4}
                  placeholder="خبرة 15+ سنة&#10;شهادة ماجستير في الإدارة&#10;مهارات قيادية عالية"
                />
              </CardContent>
            </Card>
            <Card className="card-element card-rtl border-2 border-purple-200 bg-purple-50">
              <CardHeader className="p-2 pb-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Shield className="h-4 w-4" />
                    تحديد الصلاحيات *
                  </CardTitle>
                  <Badge className="bg-purple-600 text-white">
                    {getTotalSelectedPermissions()} صلاحية
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={permissionMode === 'groups' ? 'default' : 'outline'}
                    className="flex-1 h-8 text-xs"
                    onClick={() => setPermissionMode('groups')}
                  >
                    <Layers className="h-3 w-3 ml-1" />
                    مجموعات صلاحيات
                  </Button>
                  <Button
                    size="sm"
                    variant={permissionMode === 'individual' ? 'default' : 'outline'}
                    className="flex-1 h-8 text-xs"
                    onClick={() => setPermissionMode('individual')}
                  >
                    <CheckSquare className="h-3 w-3 ml-1" />
                    صلاحيات منفردة
                  </Button>
                </div>
                {isLoadingForm ? renderLoading('جاري تحميل الصلاحيات...') : (
                  <>
                    {permissionMode === 'groups' && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          اختر مجموعة أو أكثر من المجموعات التالية:
                        </p>
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-2">
                            {(permissionGroups || []).map((group) => (
                              <div
                                key={group.id}
                                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                  selectedPermissionGroups.includes(group.id)
                                    ? 'bg-purple-100 border-purple-400'
                                    : 'bg-white border-gray-200 hover:border-purple-300'
                                }`}
                                onClick={() => togglePermissionGroup(group.id)}
                              >
                                <div className="flex items-start gap-2">
                                  <Checkbox 
                                    checked={selectedPermissionGroups.includes(group.id)}
                                    className="mt-0.5"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{group.name}</p>
                                      <Badge variant="outline" className="text-xs">{group.permissionsCount} صلاحية</Badge>
                                    </div>
                                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                      {group.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                    {permissionMode === 'individual' && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          اختر الصلاحيات المطلوبة من القائمة:
                        </p>
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-2">
                            {permissionsByCategory.map(({ category, permissions }) => (
                              <div key={category} className="border rounded-lg overflow-hidden">
                                <div
                                  className="p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center justify-between"
                                  onClick={() => toggleCategory(category)}
                                >
                                  <div className="flex items-center gap-2">
                                    {expandedCategories.includes(category) ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                    <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{category}</p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {permissions.filter(p => selectedIndividualPermissions.includes(p.id)).length} / {permissions.length}
                                  </Badge>
                                </div>
                                {expandedCategories.includes(category) && (
                                  <div className="p-2 bg-white space-y-1">
                                    {permissions.map((perm) => (
                                      <div
                                        key={perm.id}
                                        className={`p-2 border rounded cursor-pointer transition-all ${
                                          selectedIndividualPermissions.includes(perm.id)
                                            ? 'bg-blue-50 border-blue-300'
                                            : 'hover:bg-gray-50'
                                        }`}
                                        onClick={() => toggleIndividualPermission(perm.id)}
                                      >
                                        <div className="flex items-start gap-2">
                                          <Checkbox 
                                            checked={selectedIndividualPermissions.includes(perm.id)}
                                            className="mt-0.5"
                                          />
                                          <div className="flex-1">
                                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{perm.name}</p>
                                            <p className="text-[10px] text-gray-500 font-mono">{perm.code}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </>
                )}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      إجمالي الصلاحيات المختارة:
                    </p>
                    <Badge className="bg-blue-600 text-white text-sm px-3 py-1">
                      {getTotalSelectedPermissions()} صلاحية
                    </Badge>
                  </div>
                  {permissionMode === 'groups' && selectedPermissionGroups.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedPermissionGroups.map(groupId => {
                        const group = (permissionGroups || []).find(g => g.id === groupId);
                        return group ? (
                          <Badge key={groupId} variant="outline" className="text-xs">
                            {group.name} ({group.permissionsCount})
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="outline" className="h-8 text-xs">
                <X className="h-3 w-3 ml-1" />إلغاء
              </Button>
              <Button 
                size="sm" 
                className="h-8 text-xs bg-green-500" 
                onClick={handleCreateRole}
                disabled={createRoleMutation.isLoading || isLoadingForm}
              >
                {createRoleMutation.isLoading ? (
                  <Loader2 className="h-3 w-3 ml-1 animate-spin" />
                ) : (
                  <Check className="h-3 w-3 ml-1" />
                )}
                حفظ الدور
              </Button>
            </div>
          </div>
        );

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
                  {isLoadingEmployees ? (
                     <div className="space-y-2 p-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
                    <Table className="table-rtl dense-table">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>كود</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الموظف</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الدور الحالي</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القسم</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانضمام</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(employees || []).map((emp) => (
                          <TableRow key={emp.id} className="hover:bg-blue-50 transition-colors">
                            <TableCell className="text-right py-2 text-xs font-mono">{emp.code}</TableCell>
                            <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.name}</TableCell>
                            <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.currentRole}</TableCell>
                            <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.department}</TableCell>
                            <TableCell className="text-right py-2 text-xs font-mono">{new Date(emp.joinDate).toLocaleDateString('ar-EG')}</TableCell>
                            <TableCell className="text-right py-2">
                              <div className="flex gap-1 justify-end">
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => {
                                  setTransfer(prev => ({...prev, employeeId: emp.id, fromRole: emp.currentRole}));
                                  setShowTransferDialog(true);
                                }}>
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
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case '903-05':
        return <RoleDataPlaceholder tabId={activeTab} role={selectedRoleDetails} />;

      case '903-06':
        if (!selectedRoleDetails || isLoadingIndivPerms) return renderLoading('جاري تحميل الصلاحيات...');
        const assignedIds = selectedRoleDetails.permissions.map(p => p.id);
        return (
          <RolePermissionsTab
            key={selectedRoleId} 
            allPermissions={individualPermissions || []}
            assignedPermissionIds={assignedIds}
            onSave={handleSavePermissions}
            isLoading={isLoadingIndivPerms}
            isSaving={updatePermissionsMutation.isLoading}
            roleName={selectedRoleDetails.name} // (استخدم الاسم العربي)
          />
        );

      case '903-07':
        return <RoleDataPlaceholder tabId={activeTab} role={selectedRoleDetails} />;

      case '903-08':
        return <RoleDataPlaceholder tabId={activeTab} role={selectedRoleDetails} />;

      case '903-09':
        if (!selectedRoleDetails) return renderLoading('جاري تحميل الموظفين...');
        const assignedEmployees = selectedRoleDetails.employees;
        return (
          <div className="space-y-3">
            <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              الموظفون المعينون في دور: <strong>{selectedRoleDetails.name}</strong>
            </h2>
            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <ScrollArea className="h-[500px]">
                  <Table className="table-rtl dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الكود</TableHead>
                        <TableHead className="text-right">الاسم</TableHead>
                        <TableHead className="text-right">المنصب</TableHead>
                        <TableHead className="text-right">البريد الإلكتروني</TableHead>
                        <TableHead className="text-right">إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignedEmployees.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            لا يوجد موظفون معينون في هذا الدور حالياً.
                          </TableCell>
                        </TableRow>
                      ) : (
                        assignedEmployees.map((emp: any) => (
                          <TableRow key={emp.id} className="hover:bg-blue-50">
                            <TableCell className="font-mono">{emp.employeeCode}</TableCell>
                            <TableCell>{emp.name}</TableCell>
                            <TableCell>{emp.position}</TableCell>
                            <TableCell className="font-mono">{emp.email}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500">
                                <UserMinus className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case '903-10':
        return <RoleDataPlaceholder tabId={activeTab} data={roleChanges} isLoading={isLoadingRoleChanges} />;

      case '903-11':
        return <RoleDataPlaceholder tabId={activeTab} role={selectedRoleDetails} />;

      case '903-12':
         return <RoleDataPlaceholder tabId={activeTab} data={assignmentLists} isLoading={isLoadingAssignLists} />;

      case '903-13':
        return <RoleDataPlaceholder tabId={activeTab} data={notifications} isLoading={isLoadingNotifications} />;

      case '903-14':
        return <RoleDataPlaceholder tabId={activeTab} role={selectedRoleDetails} />;

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

      case '903-16':
        return <PermissionCreationTab />;

      default:
        return <RoleDataPlaceholder tabId={activeTab} />;
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
                16 تبويباً
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
          </DialogHeader>
          {isLoadingRoleDetails ? renderLoading() : selectedRoleDetails && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الدور</p>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRoleDetails.name}</p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRoleDetails.nameEn}</p>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</p>
                  <p className="text-sm font-mono">{selectedRoleDetails.code}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>القسم</p>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRoleDetails.department}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستوى الوظيفي</p>
                  <p className="text-sm">{selectedRoleDetails.level}</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</p>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRoleDetails.description}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسؤوليات</p>
                <ul className="text-sm space-y-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {(selectedRoleDetails.responsibilities || []).map((resp: string, idx: number) => (
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
                  {(selectedRoleDetails.requirements || []).map((req: string, idx: number) => (
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
              options={(employees || []).map(e => ({ value: e.id, label: `${e.name} - ${e.code}` }))}
              placeholder={isLoadingEmployees ? 'جاري تحميل الموظفين...' : 'اختر موظفاً'}
              disabled={isLoadingEmployees}
            />
            <SelectWithCopy
              label="الدور *"
              id="assign-role"
              value={assignment.roleId}
              onChange={(value) => setAssignment({...assignment, roleId: value})}
              options={(roles || []).map(r => ({ value: r.id, label: `${r.name} - ${r.department}` }))}
              placeholder={isLoadingRoles ? 'جاري تحميل الأدوار...' : 'اختر دوراً'}
              disabled={isLoadingRoles}
            />
            <InputWithCopy
              label="تاريخ البدء"
              id="assign-start-date"
              type="date"
              value={assignment.startDate}
              onChange={(e) => setAssignment({...assignment, startDate: e.target.value})}
            />
            <TextAreaWithCopy
              label="ملاحظات"
              id="assign-notes"
              value={assignment.notes}
              onChange={(e) => setAssignment({...assignment, notes: e.target.value})}
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <Button size="sm" variant="outline" onClick={() => setShowAssignDialog(false)}>
              <X className="h-3 w-3 ml-1" />إلغاء
            </Button>
            <Button 
              size="sm" 
              className="bg-blue-500" 
              onClick={handleAssignEmployee}
              disabled={assignEmployeeMutation.isLoading}
            >
              {assignEmployeeMutation.isLoading ? <Loader2 className="h-3 w-3 ml-1 animate-spin" /> : <Check className="h-3 w-3 ml-1" />}
              تعيين
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
              onChange={(value) => {
                const emp = (employees || []).find(e => e.id === value);
                setTransfer({...transfer, employeeId: value, fromRole: emp?.currentRole || ''})
              }}
              options={(employees || []).map(e => ({ value: e.id, label: `${e.name} - ${e.currentRole}` }))}
              placeholder={isLoadingEmployees ? 'جاري تحميل الموظفين...' : 'اختر موظفاً'}
              disabled={isLoadingEmployees}
            />
            <SelectWithCopy
              label="الدور الجديد *"
              id="transfer-to-role"
              value={transfer.toRole}
              onChange={(value) => setTransfer({...transfer, toRole: value})}
              options={(roles || []).map(r => ({ value: r.id, label: `${r.name} - ${r.department}` }))}
              placeholder={isLoadingRoles ? 'جاري تحميل الأدوار...' : 'اختر الدور الجديد'}
              disabled={isLoadingRoles}
            />
            <InputWithCopy
              label="تاريخ السريان"
              id="transfer-effective-date"
              type="date"
              value={transfer.effectiveDate}
              onChange={(e) => setTransfer({...transfer, effectiveDate: e.target.value})}
            />
            <TextAreaWithCopy
              label="سبب النقل *"
              id="transfer-reason"
              value={transfer.reason}
              onChange={(e) => setTransfer({...transfer, reason: e.target.value})}
              rows={3}
              placeholder="اذكر سبب نقل الموظف لهذا الدور..."
            />
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <Button size="sm" variant="outline" onClick={() => setShowTransferDialog(false)}>
              <X className="h-3 w-3 ml-1" />إلغاء
            </Button>
            <Button 
              size="sm" 
              className="bg-purple-500" 
              onClick={handleTransferEmployee}
              disabled={transferEmployeeMutation.isLoading}
            >
              {transferEmployeeMutation.isLoading ? <Loader2 className="h-3 w-3 ml-1 animate-spin" /> : <ArrowRightLeft className="h-3 w-3 ml-1" />}
              تقديم طلب النقل
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobRoles_Complete_903_v10;
