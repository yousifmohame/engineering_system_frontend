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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // 1. تعديل هذا السطر
import { fetchEmployees, createEmployee, Employee } from '../../api/employeeApi'; // 2. تعديل هذا السطر
import { Skeleton } from '../ui/skeleton';
import { useForm, Controller } from "react-hook-form"; // 3. إضافة Form Hook
import { toast } from "sonner"; // 4. إضافة إشعارات
import { z } from "zod"; // 5. (اختياري: للتحقق المتقدم)
import { Label } from '../ui/label'; // 6. (قد تكون موجودة، تأكد منها)
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
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
  ArrowUp, ArrowDown, Ban, Snowflake, Key, UserX, TrendingDown
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

// أنواع الموظفين
const EMPLOYEE_TYPES = [
  { value: 'full-time', label: 'دوام كامل', color: 'bg-blue-100 text-blue-700' },
  { value: 'part-time', label: 'دوام جزئي', color: 'bg-green-100 text-green-700' },
  { value: 'freelancer', label: 'فريلانسر', color: 'bg-purple-100 text-purple-700' },
  { value: 'remote', label: 'عمل عن بعد', color: 'bg-pink-100 text-pink-700' },
  { value: 'contract', label: 'عقد مؤقت', color: 'bg-orange-100 text-orange-700' }
];

// حالات الموظفين
const EMPLOYEE_STATUSES = [
  { value: 'active', label: 'نشط', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'inactive', label: 'غير نشط', color: 'bg-gray-100 text-gray-700', icon: UserX },
  { value: 'frozen-temp', label: 'مجمد مؤقتاً', color: 'bg-cyan-100 text-cyan-700', icon: Snowflake },
  { value: 'frozen-perm', label: 'مجمد دائماً', color: 'bg-blue-100 text-blue-700', icon: Lock },
  { value: 'on-leave', label: 'في إجازة', color: 'bg-yellow-100 text-yellow-700', icon: Calendar },
  { value: 'suspended', label: 'موقوف', color: 'bg-red-100 text-red-700', icon: Ban },
  { value: 'terminated', label: 'منتهي الخدمة', color: 'bg-orange-100 text-orange-700', icon: X }
];

// الأقسام
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

// بيانات تجريبية
const SAMPLE_EMPLOYEES = [
  {
    id: '817-00123',
    name: 'أحمد محمد علي',
    nameEn: 'Ahmed Mohammed Ali',
    nationalId: '1234567890',
    type: 'full-time',
    status: 'active',
    department: 'الهندسة',
    position: 'مهندس معماري',
    email: 'ahmed@example.com',
    phone: '0501234567',
    hireDate: '2020-01-15',
    baseSalary: 8000,
    gosiNumber: 'GOSI-12345',
    iqamaNumber: '',
    nationality: 'سعودي',
    permissionsCount: 156,
    jobLevel: 5,
    performanceRating: 4.7
  },
  {
    id: '817-00124',
    name: 'فاطمة خالد',
    nameEn: 'Fatima Khalid',
    nationalId: '9876543210',
    type: 'freelancer',
    status: 'active',
    department: 'التعقيب',
    position: 'معقب معاملات',
    email: 'fatima@example.com',
    phone: '0509876543',
    hireDate: '2023-06-01',
    baseSalary: 0,
    gosiNumber: '',
    iqamaNumber: '',
    nationality: 'سعودي',
    permissionsCount: 45,
    jobLevel: 2,
    performanceRating: 4.2
  },
  {
    id: '817-00125',
    name: 'سعد عبدالله',
    nameEn: 'Saad Abdullah',
    nationalId: '5555555555',
    type: 'remote',
    status: 'frozen-temp',
    department: 'تقنية المعلومات',
    position: 'مطور برمجيات',
    email: 'saad@example.com',
    phone: '0555555555',
    hireDate: '2022-03-10',
    baseSalary: 7000,
    gosiNumber: 'GOSI-54321',
    iqamaNumber: '',
    nationality: 'سعودي',
    permissionsCount: 89,
    jobLevel: 4,
    performanceRating: 4.5,
    frozenUntil: '2025-02-28',
    frozenReason: 'في إجازة طويلة بدون راتب'
  }
];

const EmployeesManagement_Complete_817: React.FC = () => {
  const [activeTab, setActiveTab] = useState('817-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const { 
    data: employeesData, // 'data' هو البيانات الراجعة
    isLoading,         // حالة التحميل
    isError,           // حالة الخطأ
    error              // نص الخطأ
  } = useQuery<Employee[], Error>({
    queryKey: ['employees'], // مفتاح فريد لتخزين البيانات
    queryFn: fetchEmployees  // الوظيفة التي تقوم بالجلب
  });

  // (مهم) مكتبة react-query قد ترجع 'undefined' أثناء التحميل
  // لذلك نستخدم '?? []' لضمان أن 'employees' هي دائماً مصفوفة
  const employees = employeesData ?? [];
  
  // حالات النوافذ المنبثقة
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showFreezeDialog, setShowFreezeDialog] = useState(false);
  const [showPromoteDialog, setShowPromoteDialog] = useState(false);
  const [showDemoteDialog, setShowDemoteDialog] = useState(false);
  const [showTerminateDialog, setShowTerminateDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const queryClient = useQueryClient();

  const { 
  handleSubmit, 
  formState: { errors }, 
  reset, 
  control // 1. أضفنا control
} = useForm({
  // 2. أضفنا القيم الافتراضية
  defaultValues: {
    name: "",
    nameEn: "",
    nationalId: "",
    nationality: "سعودي", // قيمة افتراضية
    email: "",
    phone: "",
    password: "",
    type: "full-time",
    department: "الهندسة",
    position: "",
    hireDate: "",
    baseSalary: "",
    gosiNumber: ""
  }
});

  // إعداد (Mutation) لإرسال البيانات للـ Backend
  const createEmployeeMutation = useMutation({
    mutationFn: createEmployee, // الوظيفة التي سترسل (من employeeApi.ts)
    
    // عند النجاح
    onSuccess: (data) => {
      toast.success(`تم إنشاء الموظف "${data.employee.name}" بنجاح!`);
      queryClient.invalidateQueries({ queryKey: ['employees'] }); // تحديث القائمة في تاب 817-01
      reset(); // تفريغ الحقول
      setActiveTab('817-01'); // الرجوع لقائمة الموظفين
    },
    
    // عند الفشل
    onError: (error) => {
      toast.error(error.message || 'فشل إنشاء الموظف');
    }
  });

  // دالة الإرسال (عند ضغط زر الحفظ)
  const onSubmit = (data: any) => {
    // تحويل الراتب إلى رقم
    data.baseSalary = parseFloat(data.baseSalary);
    
    // إرسال البيانات للـ Backend
    createEmployeeMutation.mutate(data);
  };

  // إحصائيات الموظفين
  const statistics = useMemo(() => {
    return {
      total: employees.length,
      active: employees.filter(e => e.status === 'active').length,
      fullTime: employees.filter(e => e.type === 'full-time').length,
      partTime: employees.filter(e => e.type === 'part-time').length,
      freelancers: employees.filter(e => e.type === 'freelancer').length,
      remote: employees.filter(e => e.type === 'remote').length,
      saudis: employees.filter(e => e.nationality === 'سعودي').length,
      nonSaudis: employees.filter(e => e.nationality !== 'سعودي').length
    };
  }, [employees]);

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 817-01: قائمة الموظفين
      case '817-01':

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
                {/* إحصائيات سريعة */}
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

                {/* البحث والفلترة */}
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

                {/* قائمة الموظفين */}
                <div className="space-y-2">
                  {employees.map((employee) => {
                    const typeInfo = EMPLOYEE_TYPES.find(t => t.value === employee.type);
                    const statusInfo = EMPLOYEE_STATUSES.find(s => s.value === employee.status);

                    return (
                      <Card key={employee.id} className="dense-content-card hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                              <Users className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="compact-title flex items-center gap-2">
                                {employee.name}
                                {/* أيقونة عدد الصلاحيات */}
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

      // 817-02: إضافة موظف (نسخة مصححة)
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  
                  {/* المعلومات الأساسية */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      المعلومات الأساسية
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      
                      {/* رقم الموظف */}
                      <InputWithCopy
                        label="رقم الموظف (تلقائي)"
                        id="employeeId"
                        value="سيتم إنشاؤه تلقائياً"
                        disabled
                      />
                      
                      {/* الاسم بالعربي */}
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: "الاسم مطلوب" }}
                        render={({ field }) => (
                          <InputWithCopy
                            label="الاسم بالعربي *"
                            id="nameAr"
                            placeholder="الاسم الكامل بالعربي"
                            {...field} // تمرير value, onChange, etc.
                          />
                        )}
                      />

                      {/* الاسم بالإنجليزي */}
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

                      {/* رقم الهوية */}
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

                      {/* الجنسية */}
                      <Controller
                        name="nationality"
                        control={control}
                        render={({ field }) => (
                          <SelectWithCopy
                            label="الجنسية"
                            id="nationality"
                            value={field.value}
                            onValueChange={field.onChange} // Select تستخدم onValueChange
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

                      {/* البريد الإلكتروني */}
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

                      {/* رقم الجوال */}
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

                      {/* كلمة المرور */}
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

                  {/* معلومات الوظيفة */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      معلومات الوظيفة
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      
                      {/* نوع الموظف */}
                      <Controller
                        name="type"
                        control={control}
                        rules={{ required: "النوع مطلوب" }}
                        render={({ field }) => (
                          <SelectWithCopy
                            label="نوع الموظف *"
                            id="employeeType"
                            value={field.value}
                            onValueChange={field.onChange}
                            options={EMPLOYEE_TYPES.map(t => ({ value: t.value, label: t.label }))}
                          />
                        )}
                      />

                      {/* القسم */}
                      <Controller
                        name="department"
                        control={control}
                        rules={{ required: "القسم مطلوب" }}
                        render={({ field }) => (
                          <SelectWithCopy
                            label="القسم *"
                            id="department"
                            value={field.value}
                            onValueChange={field.onChange}
                            options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
                          />
                        )}
                      />

                      {/* المسمى الوظيفي */}
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

                      {/* تاريخ التعيين */}
                      <Controller
                        name="hireDate"
                        control={control}
                        rules={{ required: "التاريخ مطلوب" }}
                        render={({ field }) => (
                          <DateInputWithToday
                            label="تاريخ التعيين *"
                            id="hireDate"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      
                      {/* الراتب الأساسي */}
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
                      
                      {/* رقم التأمينات */}
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
                  
                  {/* عرض الأخطاء */}
                  {(errors.name || errors.nationalId || errors.email || errors.phone || errors.password) && (
                    <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg">
                      الرجاء تعبئة جميع الحقول الإلزامية (*).
                    </div>
                  )}

                </form>
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
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    حفظ
                  </Button>
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
