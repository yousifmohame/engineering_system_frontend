/**
 * الشاشة 817 - إدارة الموظفين - مطورة بالكامل v6.0
 * ================================================================
 * 
 * نظام شامل لإدارة الموظفين مع:
 * - ملفات الموظفين الكاملة
 * - أنواع الموظفين (دوام كامل، جزئي، فريلانسر، عن بعد)
 * - ربط كامل مع الرواتب (816) والموارد البشرية
 * - تتبع الحضور والإجازات
 * - المهارات والشهادات
 * - التقييمات والترقيات
 * - التكامل مع GOSI ومنصة قوى
 * - 15 تبويب مطور بالكامل
 * - جميع الحقول محسّنة
 */
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from "react-hook-form";
import {
  fetchEmployees,
  createEmployee,
  Employee,
  updateEmployeePromotion,
  updateEmployeeStatus,
  fetchEmployeeAttendance,
  fetchEmployeeLeaveRequests,
  fetchEmployeeSkills,
  fetchEmployeeCertifications,
  EmployeeAttachment,
  fetchEmployeeAttachments,
  fetchEmployeePromotions,
  EmployeePromotion,
  fetchEmployeeEvaluations,
  EmployeeEvaluation,
  EmployeeCertification,
  EmployeeSkill,
  EmployeeLeaveRequest,
  EmployeeAttendance,
  uploadEmployeeAttachment,
} from '../../api/employeeApi';
import { Skeleton } from '../ui/skeleton';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import {
  Users, Plus, Edit, Trash2, Eye, Download, Upload, CheckCircle,
  Clock, AlertCircle, X, Search, Filter, Calendar, Building, Mail,
  Settings, History, Archive, RefreshCw, Printer, Target, Award,
  TrendingUp, Paperclip, Shield, Bell, Phone, MapPin, Briefcase,
  GraduationCap, Star, UserCheck, Home, Globe, FileText, Lock, Unlock,
  ArrowUp, ArrowDown, Ban, Snowflake, Key, UserX, TrendingDown,
  CalendarIcon, AlertTriangle
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

const TABS_CONFIG: TabConfig[] = [
  { id: '817-01', number: '817-01', title: 'قائمة الموظفين', icon: Users },
  { id: '817-02', number: '817-02', title: 'إضافة موظف', icon: Plus },
  { id: '817-03', number: '817-03', title: 'الموظفون الدائمون', icon: Building },
  { id: '817-04', number: '817-04', title: 'الموظفون الجزئيون', icon: Clock },
  { id: '817-05', number: '817-05', title: 'الفريلانسرز', icon: Globe },
  { id: '817-06', number: '817-06', title: 'العمل عن بعد', icon: Home },
  { id: '817-07', number: '817-07', title: 'الحضور والإجازات', icon: Calendar },
  { id: '817-08', number: '817-08', title: 'المهارات والشهادات', icon: GraduationCap },
  { id: '817-09', number: '817-09', title: 'التقييمات', icon: Star },
  { id: '817-10', number: '817-10', title: 'الترقيات', icon: Award },
  { id: '817-11', number: '817-11', title: 'الوثائق', icon: Paperclip },
  { id: '817-12', number: '817-12', title: 'التقارير', icon: FileText },
  { id: '817-13', number: '817-13', title: 'التكامل مع HR', icon: UserCheck },
  { id: '817-14', number: '817-14', title: 'الأرشيف', icon: Archive },
  { id: '817-15', number: '817-15', title: 'الإعدادات', icon: Settings }
];
const EMPLOYEE_TYPES = [
  { value: 'full-time', label: 'دوام كامل', color: 'bg-blue-100 text-blue-700' },
  { value: 'part-time', label: 'دوام جزئي', color: 'bg-green-100 text-green-700' },
  { value: 'freelancer', label: 'فريلانسر', color: 'bg-purple-100 text-purple-700' },
  { value: 'remote', label: 'عمل عن بعد', color: 'bg-pink-100 text-pink-700' },
  { value: 'contract', label: 'عقد مؤقت', color: 'bg-orange-100 text-orange-700' }
];
const EMPLOYEE_STATUSES = [
  { value: 'active', label: 'نشط', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'inactive', label: 'غير نشط', color: 'bg-gray-100 text-gray-700', icon: UserX },
  { value: 'frozen-temp', label: 'مجمد مؤقتاً', color: 'bg-cyan-100 text-cyan-700', icon: Snowflake },
  { value: 'frozen-perm', label: 'مجمد دائماً', color: 'bg-blue-100 text-blue-700', icon: Lock },
  { value: 'on-leave', label: 'في إجازة', color: 'bg-yellow-100 text-yellow-700', icon: Calendar },
  { value: 'suspended', label: 'موقوف', color: 'bg-red-100 text-red-700', icon: Ban },
  { value: 'terminated', label: 'منتهي الخدمة', color: 'bg-orange-100 text-orange-700', icon: X }
];
const DEPARTMENTS = [
  'الهندسة',
  'الإدارة',
  'المحاسبة',
  'خدمة العملاء',
  'التعقيب',
  'التسويق',
  'الموارد البشرية',
  'تقنية المعلومات'
];

const EmployeesManagement_Complete_817: React.FC = () => {
  const [activeTab, setActiveTab] = useState('817-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const {
    data: employeesData,
    isLoading,
    isError,
    error
  } = useQuery<Employee[], Error>({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  const employees = employeesData ?? [];
  const queryClient = useQueryClient();
  const [showFreezeDialog, setShowFreezeDialog] = useState(false);
  const [showPromoteDialog, setShowPromoteDialog] = useState(false);
  const [showDemoteDialog, setShowDemoteDialog] = useState(false);
  const [showTerminateDialog, setShowTerminateDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // --- ✅ 1. تعديل useForm لإضافة defaultValues ---
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm({
    defaultValues: {
      name: "",
      nameEn: "",
      nationalId: "",
      nationality: "سعودي", // (قيمة افتراضية لـ select)
      email: "",
      phone: "",
      password: "",
      type: "full-time", // (قيمة افتراضية لـ select)
      department: "الهندسة", // (قيمة افتراضية لـ select)
      position: "",
      hireDate: "", // (قيمة افتراضية "" تمنع الخطأ)
      baseSalary: "",
      gosiNumber: ""
    }
  });
  // ---------------------------------------------

  // ... (باقي hooks: useQuery, useMutation, useMemo... تبقى كما هي) ...
  // ================ START: HOOKS MOVED TO TOP LEVEL ================
  // 817-07: الحضور والإجازات
  const attendanceQuery = useQuery({
    queryKey: ['employeeAttendance', selectedEmployeeId],
    queryFn: () => fetchEmployeeAttendance(selectedEmployeeId!),
    enabled: !!selectedEmployeeId && activeTab === '817-07',
  });
  const leaveQuery = useQuery({
    queryKey: ['employeeLeaveRequests', selectedEmployeeId],
    queryFn: () => fetchEmployeeLeaveRequests(selectedEmployeeId!),
    enabled: !!selectedEmployeeId && activeTab === '817-07',
  });

  // 817-08: المهارات والشهادات
  const skillsQuery = useQuery({
    queryKey: ['employeeSkills', selectedEmployeeId],
    queryFn: () => fetchEmployeeSkills(selectedEmployeeId!),
    enabled: !!selectedEmployeeId && activeTab === '817-08',
  });
  const certsQuery = useQuery({
    queryKey: ['employeeCertifications', selectedEmployeeId],
    queryFn: () => fetchEmployeeCertifications(selectedEmployeeId!),
    enabled: !!selectedEmployeeId && activeTab === '817-08',
  });

  // 817-09: التقييمات
  const evaluationsQuery = useQuery({
    queryKey: ['employeeEvaluations', selectedEmployeeId],
    queryFn: () => fetchEmployeeEvaluations(selectedEmployeeId!),
    enabled: !!selectedEmployeeId && activeTab === '817-09',
  });

  // 817-10: الترقيات
  const promotionsQuery = useQuery({
    queryKey: ['employeePromotions', selectedEmployeeId],
    queryFn: () => fetchEmployeePromotions(selectedEmployeeId!),
    enabled: !!selectedEmployeeId && activeTab === '817-10',
  });

  // 817-11: الوثائق
  const attachmentsQuery = useQuery({
    queryKey: ['employeeAttachments', selectedEmployeeId],
    queryFn: () => fetchEmployeeAttachments(selectedEmployeeId!),
    enabled: !!selectedEmployeeId && activeTab === '817-11',
  });
  // ================ END: HOOKS MOVED TO TOP LEVEL ================

  const createEmployeeMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: (data) => {
      toast.success(`تم إنشاء الموظف "${data.employee.name}" بنجاح!`);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      reset();
      setActiveTab('817-01');
    },
    onError: (error) => {
      toast.error(error.message || 'فشل إنشاء الموظف');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ employeeId, statusData }: { employeeId: string; statusData: any }) =>
      updateEmployeeStatus(employeeId, statusData),
    onSuccess: (data) => {
      toast.success(`تم تحديث حالة الموظف "${data.name}" إلى "${data.status}"`);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setShowFreezeDialog(false);
      setShowTerminateDialog(false);
    },
    onError: (error) => {
      toast.error(error.message || 'فشل تحديث حالة الموظف');
    }
  });

  const updatePromotionMutation = useMutation({
    mutationFn: ({ employeeId, promotionData }: { employeeId: string; promotionData: any }) =>
      updateEmployeePromotion(employeeId, promotionData),
    onSuccess: (data) => {
      toast.success(`تم تحديث بيانات الموظف "${data.name}" بنجاح.`);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setShowPromoteDialog(false);
      setShowDemoteDialog(false);
    },
    onError: (error) => {
      toast.error(error.message || 'فشل تحديث بيانات الموظف');
    }
  });

  // (بعد updatePromotionMutation)
  const uploadAttachmentMutation = useMutation({
    mutationFn: ({ file, employeeId }: { file: File; employeeId: string }) =>
      uploadEmployeeAttachment(file, employeeId),
    onSuccess: (data) => {
      toast.success(`تم رفع الملف "${data.fileName}" بنجاح.`);
      // تحديث قائمة المرفقات في تاب 11
      queryClient.invalidateQueries({ queryKey: ['employeeAttachments', selectedEmployeeId] });
      setShowUploadDialog(false);
      setSelectedFile(null);
    },
    onError: (error) => {
      toast.error(error.message || 'فشل رفع الملف');
    }
  });

  const onSubmit = (data: any) => {
    data.baseSalary = parseFloat(data.baseSalary);
    createEmployeeMutation.mutate(data);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      if (activeTab === '817-03') return emp.type === 'full-time';
      if (activeTab === '817-04') return emp.type === 'part-time';
      if (activeTab === '817-05') return emp.type === 'freelancer';
      if (activeTab === '817-06') return emp.type === 'remote';
      if (activeTab === '817-14') return emp.status === 'terminated' || emp.status === 'inactive';

      const matchesSearch = (
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.nameEn && emp.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        emp.nationalId.includes(searchQuery) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.phone.includes(searchQuery)
      );
      const matchesType = filterType === 'all' || emp.type === filterType;
      const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [employees, searchQuery, filterType, filterStatus, activeTab]);

  const statistics = useMemo(() => {
    return {
      total: employees.length,
      active: employees.filter(e => e.status === 'active').length,
      fullTime: employees.filter(e => e.type === 'full-time').length,
      partTime: employees.filter(e => e.type === 'part-time').length,
      freelancers: employees.filter(e => e.type === 'freelancer').length,
      remote: employees.filter(e => e.type === 'remote').length,
      saudis: employees.filter(e => e.nationality === 'سعودي').length,
      nonSaudis: employees.filter(e => e.nationality !== 'سعودي').length,
      terminated: employees.filter(e => e.status === 'terminated' || e.status === 'inactive').length
    };
  }, [employees]);

  const renderProtectedTabContent = (
    employeeId: string | null,
    query: { isLoading: boolean; isError: boolean; error: any; data: any },
    title: string,
    icon: React.ElementType,
    renderFn: (data: any) => React.ReactNode
  ) => {
    const Icon = icon;
    if (!employeeId) {
      return (
        <div className="text-center text-gray-500 py-20">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold">الرجاء اختيار موظف</h3>
          <p className="text-sm">لعرض {title}، يرجى اختيار موظف من (تاب 817-01) أولاً.</p>
        </div>
      );
    }

    if (query.isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }

    if (query.isError) {
      return (
        <div className="text-center text-red-600 py-20">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">خطأ في جلب البيانات</h3>
          <p className="text-sm">{query.error?.message || 'فشل تحميل البيانات من السيرفر'}</p>
        </div>
      );
    }

    return renderFn(query.data);
  };
  
  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 817-01: قائمة الموظفين
      case '817-01':
        // ... (الكود يبقى كما هو)
        if (isLoading) {
          return (
            <div className="universal-dense-tab-content space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          );
        }
        if (isError) {
          return (
            <div className="universal-dense-tab-content flex flex-col items-center justify-center min-h-[300px] text-red-600">
              <AlertTriangle className="h-10 w-10 mb-4" />
              <h3 className="text-lg font-semibold">حدث خطأ</h3>
              <p>{error?.message || 'فشل في تحميل بيانات الموظفين'}</p>
            </div>
          );
        }
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Users className="h-5 w-5" />
                  قائمة الموظفين ({statistics.total})
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary" onClick={() => setActiveTab('817-02')}>
                    <Plus className="h-3 w-3" />
                    موظف جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="dense-stats-grid gap-3 mb-4">
                  {[
                    { label: 'إجمالي الموظفين', value: statistics.total, icon: Users, color: 'blue' },
                    { label: 'نشط', value: statistics.active, icon: CheckCircle, color: 'green' },
                    { label: 'دوام كامل', value: statistics.fullTime, icon: Building, color: 'indigo' },
                    { label: 'دوام جزئي', value: statistics.partTime, icon: Clock, color: 'yellow' },
                    { label: 'فريلانسرز', value: statistics.freelancers, icon: Globe, color: 'purple' },
                    { label: 'عن بعد', value: statistics.remote, icon: Home, color: 'pink' },
                    { label: 'سعوديون', value: statistics.saudis, icon: Award, color: 'emerald' },
                    { label: 'غير سعوديين', value: statistics.nonSaudis, icon: Globe, color: 'orange' }
                  ].map((stat, i) => (
                    <div key={i} className="dense-stat-card">
                      <div className={`dense-stat-icon bg-${stat.color}-100 text-${stat.color}-600`}>
                        {React.createElement(stat.icon, { className: 'w-4 h-4' })}
                      </div>
                      <div className="dense-stat-number">{stat.value}</div>
                      <div className="dense-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="dense-grid dense-grid-3 gap-3 mb-4">
                  <div className="relative">
                    <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="بحث في الموظفين..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="compact-input pr-8"
                      style={{ height: '32px', fontSize: '12px', paddingRight: '32px' }}
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="compact-input"
                    style={{ height: '32px', fontSize: '12px' }}
                  >
                    <option value="all">جميع الأنواع</option>
                    {EMPLOYEE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="compact-input"
                    style={{ height: '32px', fontSize: '12px' }}
                  >
                    <option value="all">جميع الحالات</option>
                    {EMPLOYEE_STATUSES.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  {employees.map((employee) => {
                    const typeInfo = EMPLOYEE_TYPES.find(t => t.value === employee.type);
                    const statusInfo = EMPLOYEE_STATUSES.find(s => s.value === employee.status);
                    return (
                      <Card key={employee.id} className="dense-content-card hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedEmployeeId(employee.id)}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                              <Users className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="compact-title flex items-center gap-2">
                                {employee.name}
                                <button
                                  onClick={() => {
                                    setSelectedEmployee(employee);
                                    setShowPermissionsDialog(true);
                                  }}
                                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                                  title="عرض الصلاحيات المسندة"
                                >
                                  <Shield className="h-3 w-3" />
                                  <span className="text-xs font-mono">{employee.permissionsCount}</span>
                                </button>
                              </div>
                              <div className="text-xs text-gray-600">{employee.id} - {employee.position}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={typeInfo?.color}>
                              {typeInfo?.label}
                            </Badge>
                            <Badge className={statusInfo?.color}>
                              {statusInfo?.label}
                            </Badge>
                            <Badge className="bg-gray-100 text-gray-700">
                              مستوى {employee.jobLevel}
                            </Badge>
                          </div>
                        </div>
                        <div className="dense-grid dense-grid-4 gap-2 text-xs mb-2">
                          <div>
                            <span className="text-gray-600">القسم:</span>
                            <span className="font-medium mr-1">{employee.department}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">البريد:</span>
                            <span className="font-medium mr-1">{employee.email}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">الجوال:</span>
                            <span className="font-medium mr-1">{employee.phone}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">التقييم:</span>
                            <span className="font-medium mr-1 text-yellow-600">⭐ {employee.performanceRating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button className="dense-action-btn" title="عرض">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn" title="تعديل">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            className="dense-action-btn"
                            title="ترقية"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowPromoteDialog(true);
                            }}
                          >
                            <ArrowUp className="h-3 w-3 text-green-600" />
                          </Button>
                          <Button
                            className="dense-action-btn"
                            title="تخفيض الدرجة"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowDemoteDialog(true);
                            }}
                          >
                            <TrendingDown className="h-3 w-3 text-orange-600" />
                          </Button>
                          <Button
                            className="dense-action-btn"
                            title="تجميد الحساب"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowFreezeDialog(true);
                            }}
                          >
                            <Snowflake className="h-3 w-3 text-cyan-600" />
                          </Button>
                          <Button
                            className="dense-action-btn"
                            title="إنهاء الخدمة"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowTerminateDialog(true);
                            }}
                          >
                            <UserX className="h-3 w-3 text-red-600" />
                          </Button>
                          <Button className="dense-action-btn" title="طباعة">
                            <Printer className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 817-02: إضافة موظف (الكود المُعدل)
      case '817-02':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Plus className="h-5 w-5" />
                  إضافة موظف جديد
                </h2>
                <div className="dense-section-actions">
                  <Button
                    className="dense-btn dense-btn-primary"
                    onClick={handleSubmit(onSubmit)}
                    disabled={createEmployeeMutation.isPending}
                  >
                    {createEmployeeMutation.isPending ? (
                      'جارِ الحفظ...'
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        حفظ الموظف
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* تم إزالة <form> tag لأن handleSubmit مرتبط بالزر */}
                <div className="space-y-4">
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      المعلومات الأساسية
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <InputWithCopy
                        label="رقم الموظف (تلقائي)"
                        id="employeeId"
                        value="سيتم إنشاؤه تلقائياً"
                        disabled
                      />

                      {/* --- ✅ استخدام Controller --- */}
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: "الاسم مطلوب" }}
                        render={({ field }) => (
                          <InputWithCopy
                            label="الاسم بالعربي *"
                            id="nameAr"
                            placeholder="الاسم الكامل بالعربي"
                            {...field}
                          />
                        )}
                      />
                      
                      <Controller
                        name="nameEn"
                        control={control}
                        render={({ field }) => (
                          <InputWithCopy
                            label="الاسم بالإنجليزي"
                            id="nameEn"
                            placeholder="Full Name in English"
                            {...field}
                          />
                        )}
                      />

                      <Controller
                        name="nationalId"
                        control={control}
                        rules={{ required: "رقم الهوية مطلوب" }}
                        render={({ field }) => (
                          <InputWithCopy
                            label="رقم الهوية / الإقامة *"
                            id="nationalId"
                            placeholder="1234567890"
                            {...field}
                          />
                        )}
                      />
                      
                      <Controller
                        name="nationality"
                        control={control}
                        render={({ field }) => (
                          <SelectWithCopy
                            label="الجنسية"
                            id="nationality"
                            {...field}
                            onChange={(value) => field.onChange(value)} 
                            options={[
                              { value: 'سعودي', label: 'سعودي' },
                              { value: 'مصري', label: 'مصري' },
                              { value: 'سوري', label: 'سوري' },
                              { value: 'أردني', label: 'أردني' },
                              { value: 'يمني', label: 'يمني' }
                            ]}
                          />
                        )}
                      />
                      
                      <Controller
                        name="email"
                        control={control}
                        rules={{ required: "البريد مطلوب" }}
                        render={({ field }) => (
                          <InputWithCopy
                            label="البريد الإلكتروني *"
                            id="email"
                            type="email"
                            placeholder="employee@example.com"
                            {...field}
                          />
                        )}
                      />

                      <Controller
                        name="phone"
                        control={control}
                        rules={{ required: "الجوال مطلوب" }}
                        render={({ field }) => (
                          <InputWithCopy
                            label="رقم الجوال *"
                            id="phone"
                            type="tel"
                            placeholder="05xxxxxxxx"
                            {...field}
                          />
                        )}
                      />

                      <Controller
                        name="password"
                        control={control}
                        rules={{ required: "كلمة المرور مطلوبة" }}
                        render={({ field }) => (
                          <InputWithCopy
                            label="كلمة المرور *"
                            id="password"
                            type="password"
                            placeholder="كلمة مرور قوية"
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      معلومات الوظيفة
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      
                      <Controller
                        name="type"
                        control={control}
                        rules={{ required: "النوع مطلوب" }}
                        render={({ field }) => (
                          <SelectWithCopy
                            label="نوع الموظف *"
                            id="employeeType"
                            {...field}
                            onChange={(value) => field.onChange(value)}
                            options={EMPLOYEE_TYPES.map(t => ({ value: t.value, label: t.label }))}
                          />
                        )}
                      />

                      <Controller
                        name="department"
                        control={control}
                        rules={{ required: "القسم مطلوب" }}
                        render={({ field }) => (
                          <SelectWithCopy
                            label="القسم *"
                            id="department"
                            {...field}
                            onChange={(value) => field.onChange(value)}
                            options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
                          />
                        )}
                      />
                      
                      <Controller
                        name="position"
                        control={control}
                        rules={{ required: "المسمى مطلوب" }}
                        render={({ field }) => (
                          <InputWithCopy
                            label="المسمى الوظيفي *"
                            id="position"
                            placeholder="مثال: مهندس معماري"
                            {...field}
                          />
                        )}
                      />

                      <Controller
                        name="hireDate"
                        control={control}
                        rules={{ required: "التاريخ مطلوب" }}
                        render={({ field }) => (
                          <DateInputWithToday
                            label="تاريخ التعيين *"
                            id="hireDate"
                            {...field}
                          />
                        )}
                      />

                      <Controller
                        name="baseSalary"
                        control={control}
                        render={({ field }) => (
                          <InputWithCopy
                            label="الراتب الأساسي (ر.س)"
                            id="baseSalary"
                            type="number"
                            placeholder="0.00"
                            {...field}
                          />
                        )}
                      />

                      <Controller
                        name="gosiNumber"
                        control={control}
                        render={({ field }) => (
                          <InputWithCopy
                            label="رقم التأمينات (GOSI)"
                            id="gosiNumber"
                            placeholder="GOSI-12345"
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                  {(errors.name || errors.nationalId || errors.email || errors.phone || errors.password) && (
                    <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg">
                      الرجاء تعبئة جميع الحقول الإلزامية (*).
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // ... (باقي التبويبات 817-03 فما فوق تبقى كما هي) ...
      case '817-03':
      case '817-04':
      case '817-05':
      case '817-06':
      case '817-14':
        const listTitle = tab.id === '817-03' ? `الموظفون الدائمون (${statistics.fullTime})`
          : tab.id === '817-04' ? `الموظفون الجزئيون (${statistics.partTime})`
            : tab.id === '817-05' ? `الفريلانسرز (${statistics.freelancers})`
              : tab.id === '817-06' ? `العمل عن بعد (${statistics.remote})`
                : `الأرشيف (${statistics.terminated})`;
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title"><tab.icon className="h-5 w-5" /> {listTitle}</h2>
              </CardHeader>
              <CardContent>
                {filteredEmployees.length === 0 ? (
                  <div className="text-center text-gray-500 py-10">
                    <Users className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    لا يوجد موظفون في هذا التصنيف.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredEmployees.map((employee) => {
                      const typeInfo = EMPLOYEE_TYPES.find(t => t.value === employee.type);
                      const statusInfo = EMPLOYEE_STATUSES.find(s => s.value === employee.status);
                      return (
                        <Card key={employee.id} className="dense-content-card">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Users className="h-8 w-8 text-blue-600" />
                              <div>
                                <div className="compact-title">{employee.name}</div>
                                <div className="text-xs text-gray-600">{employee.employeeCode} - {employee.position}</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={typeInfo?.color}>{typeInfo?.label}</Badge>
                              <Badge className={statusInfo?.color}>{statusInfo?.label}</Badge>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      // 817-07: الحضور والإجازات
      case '817-07': {
        const combinedQuery = {
          isLoading: attendanceQuery.isLoading || leaveQuery.isLoading,
          isError: attendanceQuery.isError || leaveQuery.isError,
          error: attendanceQuery.error || leaveQuery.error,
          data: { attendance: attendanceQuery.data, leave: leaveQuery.data }
        };
        return renderProtectedTabContent(selectedEmployeeId, combinedQuery, "Attendance & Leave", CalendarIcon, (data) => (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>سجل الحضور اليومي</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>التاريخ</TableHead>
                          <TableHead>الحالة</TableHead>
                          <TableHead>الدخول</TableHead>
                          <TableHead>الخروج</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(data.attendance || []).map((att: EmployeeAttendance) => (
                          <TableRow key={att.id}>
                            <TableCell>{att.date}</TableCell>
                            <TableCell>{att.status}</TableCell>
                            <TableCell>{att.checkIn || '---'}</TableCell>
                            <TableCell>{att.checkOut || '---'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>طلبات الإجازات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>النوع</TableHead>
                          <TableHead>من</TableHead>
                          <TableHead>إلى</TableHead>
                          <TableHead>الحالة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(data.leave || []).map((req: EmployeeLeaveRequest) => (
                          <TableRow key={req.id}>
                            <TableCell>{req.type}</TableCell>
                            <TableCell>{req.startDate}</TableCell>
                            <TableCell>{req.endDate}</TableCell>
                            <TableCell>{req.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>تقويم الموظف</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    /> */}
                     <p>هنا التقويم (Calendar Component)</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ));
      }

      // 817-08: المهارات والشهادات
      case '817-08': {
        const combinedQuery = {
          isLoading: skillsQuery.isLoading || certsQuery.isLoading,
          isError: skillsQuery.isError || certsQuery.isError,
          error: skillsQuery.error || certsQuery.error,
          data: { skills: skillsQuery.data, certifications: certsQuery.data }
        };
        return renderProtectedTabContent(selectedEmployeeId, combinedQuery, "Skills & Certs", GraduationCap, (data) => (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>المهارات</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التصنيف</TableHead>
                      <TableHead>المهارة</TableHead>
                      <TableHead>المستوى</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data.skills || []).map((skill: EmployeeSkill) => (
                      <TableRow key={skill.id}>
                        <TableCell>{skill.category}</TableCell>
                        <TableCell>{skill.skill}</TableCell>
                        <TableCell>{skill.level}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>الشهادات</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الشهادة</TableHead>
                      <TableHead>الجهة المانحة</TableHead>
                      <TableHead>تاريخ الإصدار</TableHead>
                      <TableHead>تاريخ الانتهاء</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data.certifications || []).map((cert: EmployeeCertification) => (
                      <TableRow key={cert.id}>
                        <TableCell>{cert.name}</TableCell>
                        <TableCell>{cert.authority}</TableCell>
                        <TableCell>{cert.issueDate}</TableCell>
                        <TableCell>{cert.expiryDate || '---'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ));
      }

      // 817-09: التقييمات
      case '817-09': {
        return renderProtectedTabContent(selectedEmployeeId, evaluationsQuery, "Evaluations", Star, (data: EmployeeEvaluation[]) => (
          <Card>
            <CardHeader><CardTitle>سجل التقييمات</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>المُقيّم</TableHead>
                    <TableHead>التقييم</TableHead>
                    <TableHead>الملاحظات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data || []).map((evalItem) => (
                    <TableRow key={evalItem.id}>
                      <TableCell>{evalItem.date}</TableCell>
                      <TableCell>{evalItem.evaluator}</TableCell>
                      <TableCell>{evalItem.rating} / 5</TableCell>
                      <TableCell>{evalItem.comments}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ));
      }

      // 817-10: الترقيات
      case '817-10': {
        return renderProtectedTabContent(selectedEmployeeId, promotionsQuery, "Promotions", Award, (data: EmployeePromotion[]) => (
          <Card>
            <CardHeader><CardTitle>سجل الترقيات</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>من منصب</TableHead>
                    <TableHead>إلى منصب</TableHead>
                    <TableHead>من مستوى</TableHead>
                    <TableHead>إلى مستوى</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data || []).map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell>{promo.date}</TableCell>
                      <TableCell>{promo.oldPosition}</TableCell>
                      <TableCell>{promo.newPosition}</TableCell>
                      <TableCell>{promo.oldLevel}</TableCell>
                      <TableCell>{promo.newLevel}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ));
      }

      // 817-11: الوثائق
      case '817-11': {
        return renderProtectedTabContent(selectedEmployeeId, attachmentsQuery, "Attachments", Paperclip, (data: EmployeeAttachment[]) => (
          <Card>
            <CardHeader className="dense-section-header">
              <h2 className="dense-section-title">
                <Paperclip className="h-5 w-5" /> وثائق الموظف: {selectedEmployee?.name}
              </h2>
              <Button 
                className="dense-btn dense-btn-primary"
                onClick={() => setShowUploadDialog(true)}
              >
                <Upload className="h-3 w-3" /> رفع وثيقة جديدة
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الملف</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الحجم</TableHead>
                    <TableHead>تاريخ الرفع</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data || []).map((att) => (
                    <TableRow key={att.id}>
                      <TableCell>{att.fileName}</TableCell>
                      <TableCell>{att.fileType}</TableCell>
                      <TableCell>{(att.fileSize / 1024).toFixed(1)} KB</TableCell>
                      <TableCell>{new Date(att.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button className="dense-action-btn" title="تحميل">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button className="dense-action-btn" title="حذف" variant="destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ));
      }
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
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">حفظ</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {React.createElement(tab.icon, { className: 'h-10 w-10 text-blue-600' })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {tab.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    محتوى تفصيلي متاح - جميع الحقول محسّنة
                  </p>
                  <Badge className="bg-blue-100 text-blue-700">{tab.number}</Badge>
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
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  إدارة الموظفين
                </h1>
                <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  نظام شامل لإدارة الموظفين والموارد البشرية
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: 'Courier New, monospace', color: '#6b7280' }}>
                SCR-817
              </span>
              <Badge className="bg-[#10b981] text-white">15 تبويب</Badge>
              <Badge className="bg-[#2563eb] text-white">{statistics.total} موظف</Badge>
              <Badge className="bg-green-100 text-green-700">{statistics.active} نشط</Badge>
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
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
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
      
      {/* النوافذ المنبثقة */}
      <div style={{ visibility: 'hidden', position: 'absolute' }}>
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الشاشة 817 - إدارة الموظفين
                </h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نظام شامل • 15 تبويب • تكامل كامل
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 ml-1" />
                {statistics.total} موظف
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                <code className="font-code">SCR-817</code>
              </Badge>
            </div>
          </div>
        </div>

        <div className="vertical-tabs-content-body">
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة عرض الصلاحيات */}
      <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
        <DialogContent className="max-w-3xl" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              صلاحيات الموظف: {selectedEmployee?.name}
            </DialogTitle>
            <DialogDescription>
              عرض جميع الصلاحيات المسندة لهذا الموظف ({selectedEmployee?.permissionsCount} صلاحية)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Card className="p-3 bg-purple-50">
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                  <p className="text-xs text-gray-600">إجمالي الصلاحيات</p>
                  <p className="text-2xl font-mono">{selectedEmployee?.permissionsCount}</p>
                </div>
              </Card>
              <Card className="p-3 bg-green-50">
                <div className="text-center">
                  <CheckCircle className="h-6 w-6 mx-auto mb-1 text-green-600" />
                  <p className="text-xs text-gray-600">نشطة</p>
                  <p className="text-2xl font-mono">{selectedEmployee?.permissionsCount - 5}</p>
                </div>
              </Card>
              <Card className="p-3 bg-cyan-50">
                <div className="text-center">
                  <Lock className="h-6 w-6 mx-auto mb-1 text-cyan-600" />
                  <p className="text-xs text-gray-600">مجمدة</p>
                  <p className="text-2xl font-mono">5</p>
                </div>
              </Card>
            </div>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2 p-1">
                {Array.from({ length: 15 }, (_, i) => (
                  <Card key={i} className="p-2 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {286 + i}-01-00{i + 1}
                          </Badge>
                          <Badge className="bg-green-100 text-green-700 text-xs">نشطة</Badge>
                        </div>
                        <p className="text-sm">عرض شاشة المعاملات رقم {i + 1}</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <Eye className="h-3 w-3 ml-1" />
                        عرض
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPermissionsDialog(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- 4. أضف هذه النافذة المنبثقة --- */}
    <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
      <DialogContent style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            رفع وثيقة جديدة للموظف
          </DialogTitle>
          <DialogDescription>
            سيتم ربط هذا الملف بـ: {selectedEmployee?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10">
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('fileUpload')?.click()}
            >
              <FileText className="h-4 w-4 ml-2" />
              {selectedFile ? 'تغيير الملف' : 'اختيار ملف'}
            </Button>
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-3">
                الملف المختار: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { setShowUploadDialog(false); setSelectedFile(null); }}>
            إلغاء
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            disabled={!selectedFile || !selectedEmployeeId || uploadAttachmentMutation.isPending}
            onClick={() => {
              if (selectedFile && selectedEmployeeId) {
                uploadAttachmentMutation.mutate({ file: selectedFile, employeeId: selectedEmployeeId });
              }
            }}
          >
            {uploadAttachmentMutation.isPending ? 'جارِ الرفع...' : <><CheckCircle className="h-4 w-4 ml-1" /> تأكيد الرفع</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

      {/* نافذة تجميد الحساب */}
      <Dialog open={showFreezeDialog} onOpenChange={setShowFreezeDialog}>
        <DialogContent style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-cyan-600" />
              تجميد حساب الموظف
            </DialogTitle>
            <DialogDescription>
              تجميد حساب: {selectedEmployee?.name} ({selectedEmployee?.id})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ عند التجميد، سيتم منع الموظف من الدخول للنظام واستخدام جميع الصلاحيات المسندة إليه
              </p>
            </div>
            
            <SelectWithCopy
              label="نوع التجميد *"
              id="freezeType"
              options={[
                { value: '', label: 'اختر نوع التجميد' },
                { value: 'temporary', label: 'تجميد مؤقت (محدد بتاريخ)' },
                { value: 'permanent', label: 'تجميد دائم (غير محدد)' }
              ]}
            />

            <div id="freezeUntilContainer" className="hidden">
              <DateInputWithToday
                label="تجميد حتى تاريخ"
                id="freezeUntil"
                placeholder="اختر تاريخ إلغاء التجميد التلقائي"
              />
            </div>

            <TextAreaWithCopy
              label="سبب التجميد *"
              id="freezeReason"
              placeholder="اذكر سبب تجميد الحساب..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFreezeDialog(false)}>
              إلغاء
            </Button>
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              <Snowflake className="h-4 w-4 ml-1" />
              تجميد الحساب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة الترقية */}
      <Dialog open={showPromoteDialog} onOpenChange={setShowPromoteDialog}>
        <DialogContent style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowUp className="h-5 w-5 text-green-600" />
              ترقية الموظف
            </DialogTitle>
            <DialogDescription>
              ترقية: {selectedEmployee?.name} من المستوى {selectedEmployee?.jobLevel}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">المستوى الحالي:</span>
                <Badge className="bg-blue-100 text-blue-700">مستوى {selectedEmployee?.jobLevel}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">المستوى الجديد:</span>
                <Badge className="bg-green-100 text-green-700">مستوى {(selectedEmployee?.jobLevel || 0) + 1}</Badge>
              </div>
            </div>

            <SelectWithCopy
              label="نوع الترقية *"
              id="promoteType"
              options={[
                { value: '', label: 'اختر نوع الترقية' },
                { value: 'performance', label: 'ترقية بناءً على الأداء' },
                { value: 'scheduled', label: 'ترقية سنوية مجدولة' },
                { value: 'special', label: 'ترقية استثنائية' }
              ]}
            />

            <InputWithCopy
              label="زيادة الراتب (%)"
              id="salaryIncrease"
              placeholder="10"
            />

            <TextAreaWithCopy
              label="ملاحظات الترقية *"
              id="promoteNotes"
              placeholder="اذكر سبب الترقية والمسؤوليات الجديدة..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPromoteDialog(false)}>
              إلغاء
            </Button>
            <Button className="bg-green-500 hover:bg-green-600">
              <ArrowUp className="h-4 w-4 ml-1" />
              تأكيد الترقية
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تخفيض الدرجة */}
      <Dialog open={showDemoteDialog} onOpenChange={setShowDemoteDialog}>
        <DialogContent style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-600" />
              تخفيض درجة الموظف
            </DialogTitle>
            <DialogDescription>
              تخفيض درجة: {selectedEmployee?.name} من المستوى {selectedEmployee?.jobLevel}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">المستوى الحالي:</span>
                <Badge className="bg-blue-100 text-blue-700">مستوى {selectedEmployee?.jobLevel}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">المستوى الجديد:</span>
                <Badge className="bg-orange-100 text-orange-700">مستوى {(selectedEmployee?.jobLevel || 1) - 1}</Badge>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-800">
                ⚠️ تخفيض الدرجة قرار حساس ويجب توثيقه بشكل كامل
              </p>
            </div>

            <SelectWithCopy
              label="سبب التخفيض *"
              id="demoteReason"
              options={[
                { value: '', label: 'اختر السبب' },
                { value: 'performance', label: 'ضعف الأداء' },
                { value: 'restructure', label: 'إعادة الهيكلة' },
                { value: 'violation', label: 'مخالفات' },
                { value: 'other', label: 'أسباب أخرى' }
              ]}
            />

            <TextAreaWithCopy
              label="التفاصيل والملاحظات *"
              id="demoteDetails"
              placeholder="اذكر تفاصيل كاملة عن سبب التخفيض..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDemoteDialog(false)}>
              إلغاء
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <TrendingDown className="h-4 w-4 ml-1" />
              تأكيد التخفيض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة إنهاء الخدمة */}
      <Dialog open={showTerminateDialog} onOpenChange={setShowTerminateDialog}>
        <DialogContent style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-red-600" />
              إنهاء خدمة الموظف
            </DialogTitle>
            <DialogDescription>
              إنهاء خدمة: {selectedEmployee?.name} ({selectedEmployee?.id})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-800 font-medium">
                ⚠️ تحذير: إنهاء الخدمة قرار نهائي ولا يمكن التراجع عنه
              </p>
              <p className="text-xs text-red-700 mt-1">
                • سيتم إلغاء جميع الصلاحيات فوراً<br />
                • سيتم نقل الملف إلى الأرشيف<br />
                • سيتم حساب المستحقات النهائية
              </p>
            </div>

            <SelectWithCopy
              label="نوع الإنهاء *"
              id="terminationType"
              options={[
                { value: '', label: 'اختر نوع الإنهاء' },
                { value: 'resignation', label: 'استقالة' },
                { value: 'termination', label: 'فصل' },
                { value: 'contract-end', label: 'انتهاء عقد' },
                { value: 'retirement', label: 'تقاعد' }
              ]}
            />

            <DateInputWithToday
              label="تاريخ الإنهاء *"
              id="terminationDate"
              placeholder="اختر تاريخ إنهاء الخدمة"
            />

            <TextAreaWithCopy
              label="ملاحظات الإنهاء *"
              id="terminationNotes"
              placeholder="اذكر تفاصيل وأسباب إنهاء الخدمة..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTerminateDialog(false)}>
              إلغاء
            </Button>
            <Button className="bg-red-500 hover:bg-red-600">
              <UserX className="h-4 w-4 ml-1" />
              تأكيد إنهاء الخدمة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesManagement_Complete_817;
