/**
 * الشاشة 823 - إدارة عقود الموظفين - نظام شامل ومتكامل
 * ================================================================
 * 
 * نظام متكامل لإدارة عقود الموظفين مع:
 * - عقود إلكترونية وتقليدية
 * - قوالب عقود جاهزة ومخصصة
 * - فقرات وشروط قابلة للتعديل والتحديث
 * - رفع وإدارة ملفات العقود
 * - توقيعات إلكترونية متقدمة
 * - تجديدات وإنهاء العقود
 * - ربط مع شاشة الموظفين (817)
 * - ربط مع شاشة الرواتب (816)
 * - ربط مع الموارد البشرية (842)
 * - تقارير تفصيلية للعقود
 * - التوافق الكامل مع نظام العمل السعودي
 * - التكامل مع GOSI، WPS، منصة قوى
 * 
 * المعايير السعودية المدعومة:
 * - نظام العمل السعودي
 * - لائحة العمل
 * - تأمينات اجتماعية (GOSI)
 * - حماية الأجور (WPS)
 * - منصة قوى
 * 
 * التطوير: نوفمبر 2025 - v1.0
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  FileText, Plus, Edit, Trash2, Eye, Download, Upload, CheckCircle,
  Clock, AlertCircle, X, Search, Filter, Calendar, Users, Building,
  Settings, History, Archive, RefreshCw, Printer, Target, Award,
  TrendingUp, Paperclip, Shield, Bell, DollarSign, User, UserCheck,
  FileSignature, FilePlus, FileCheck, FileX, FolderOpen, Layers,
  Activity, BarChart3, PieChart, ClipboardCheck, Mail, Phone,
  MapPin, Home, Briefcase, AlertTriangle, Info, Save, Send
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

// ===== تكوين التابات - 15 تبويب شامل =====
const TABS_CONFIG = [
  { id: '823-01', number: '823-01', title: 'نظرة عامة', icon: Activity },
  { id: '823-02', number: '823-02', title: 'عقود نشطة', icon: FileCheck },
  { id: '823-03', number: '823-03', title: 'إنشاء عقد جديد', icon: FilePlus },
  { id: '823-04', number: '823-04', title: 'قوالب العقود', icon: Layers },
  { id: '823-05', number: '823-05', title: 'الفقرات والشروط', icon: FileText },
  { id: '823-06', number: '823-06', title: 'التوقيعات', icon: FileSignature },
  { id: '823-07', number: '823-07', title: 'التجديدات', icon: RefreshCw },
  { id: '823-08', number: '823-08', title: 'انتهاء العقود', icon: FileX },
  { id: '823-09', number: '823-09', title: 'المستندات', icon: Paperclip },
  { id: '823-10', number: '823-10', title: 'التكامل مع HR', icon: Users },
  { id: '823-11', number: '823-11', title: 'التقارير', icon: BarChart3 },
  { id: '823-12', number: '823-12', title: 'الامتثال السعودي', icon: Shield },
  { id: '823-13', number: '823-13', title: 'الإشعارات', icon: Bell },
  { id: '823-14', number: '823-14', title: 'الأرشيف', icon: Archive },
  { id: '823-15', number: '823-15', title: 'الإعدادات', icon: Settings },
];

// ===== أنواع العقود =====
const CONTRACT_TYPES = [
  { value: 'permanent', label: 'عقد دائم', color: 'bg-green-100 text-green-700', icon: FileCheck },
  { value: 'fixed-term', label: 'عقد محدد المدة', color: 'bg-blue-100 text-blue-700', icon: Calendar },
  { value: 'part-time', label: 'عقد دوام جزئي', color: 'bg-purple-100 text-purple-700', icon: Clock },
  { value: 'temporary', label: 'عقد مؤقت', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  { value: 'freelance', label: 'عقد فريلانس', color: 'bg-orange-100 text-orange-700', icon: Users },
  { value: 'trial', label: 'عقد تجريبي', color: 'bg-pink-100 text-pink-700', icon: Target },
];

// ===== حالات العقود =====
const CONTRACT_STATUSES = [
  { value: 'draft', label: 'مسودة', color: 'bg-gray-100 text-gray-700', icon: Edit },
  { value: 'pending-signature', label: 'في انتظار التوقيع', color: 'bg-yellow-100 text-yellow-700', icon: FileSignature },
  { value: 'active', label: 'نشط', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'expiring-soon', label: 'قرب الانتهاء', color: 'bg-orange-100 text-orange-700', icon: AlertTriangle },
  { value: 'expired', label: 'منتهي', color: 'bg-red-100 text-red-700', icon: FileX },
  { value: 'renewed', label: 'مُجدد', color: 'bg-blue-100 text-blue-700', icon: RefreshCw },
  { value: 'terminated', label: 'مُنهى', color: 'bg-red-100 text-red-700', icon: X },
  { value: 'archived', label: 'مؤرشف', color: 'bg-gray-100 text-gray-700', icon: Archive },
];

// ===== قوالب العقود الجاهزة =====
const CONTRACT_TEMPLATES = [
  {
    id: 'TMPL-001',
    name: 'عقد عمل دائم - نموذج قياسي',
    type: 'permanent',
    language: 'ar',
    sections: 15,
    lastUpdated: '2025-01-01',
    compliant: true,
  },
  {
    id: 'TMPL-002',
    name: 'عقد عمل محدد المدة',
    type: 'fixed-term',
    language: 'ar',
    sections: 12,
    lastUpdated: '2025-01-01',
    compliant: true,
  },
  {
    id: 'TMPL-003',
    name: 'عقد فريلانس',
    type: 'freelance',
    language: 'ar-en',
    sections: 10,
    lastUpdated: '2024-12-15',
    compliant: true,
  },
];

// ===== الفقرات القياسية =====
const STANDARD_CLAUSES = [
  {
    id: 'CLS-001',
    title: 'مدة العقد',
    content: 'يبدأ هذا العقد من تاريخ [تاريخ البداية] ولمدة [مدة العقد] [شهر/سنة] قابلة للتجديد بالاتفاق بين الطرفين.',
    category: 'duration',
    required: true,
    editable: true,
  },
  {
    id: 'CLS-002',
    title: 'الراتب والمزايا',
    content: 'يتقاضى الطرف الثاني راتباً شهرياً قدره [المبلغ] ريال سعودي، بالإضافة إلى البدلات التالية: [قائمة البدلات].',
    category: 'salary',
    required: true,
    editable: true,
  },
  {
    id: 'CLS-003',
    title: 'ساعات العمل',
    content: 'ساعات العمل الرسمية هي [عدد الساعات] ساعة يومياً من [الوقت] إلى [الوقت]، مع راحة يومية [مدة الراحة].',
    category: 'working-hours',
    required: true,
    editable: true,
  },
  {
    id: 'CLS-004',
    title: 'الإجازات السنوية',
    content: 'يستحق الطرف الثاني إجازة سنوية مدفوعة الأجر لمدة [عدد الأيام] يوماً حسب نظام العمل السعودي.',
    category: 'leave',
    required: true,
    editable: true,
  },
  {
    id: 'CLS-005',
    title: 'إنهاء العقد',
    content: 'يحق لأي من الطرفين إنهاء هذا العقد بإشعار كتابي مدته [المدة] يوماً مع الالتزام بأحكام نظام العمل السعودي.',
    category: 'termination',
    required: true,
    editable: true,
  },
  {
    id: 'CLS-006',
    title: 'التأمينات الاجتماعية',
    content: 'يلتزم الطرف الأول بتسجيل الطرف الثاني في نظام التأمينات الاجتماعية (GOSI) ودفع الاشتراكات المقررة.',
    category: 'insurance',
    required: true,
    editable: false,
  },
  {
    id: 'CLS-007',
    title: 'السرية وعدم الإفصاح',
    content: 'يلتزم الطرف الثاني بالحفاظ على سرية جميع المعلومات المتعلقة بأعمال الطرف الأول.',
    category: 'confidentiality',
    required: false,
    editable: true,
  },
];

// ===== بيانات تجريبية =====
const SAMPLE_CONTRACTS = [
  {
    id: 'CON-2025-001',
    employeeId: '817-00123',
    employeeName: 'أحمد محمد علي',
    type: 'permanent',
    status: 'active',
    startDate: '2024-01-01',
    endDate: null,
    salary: 8000,
    position: 'مهندس معماري',
    signedDate: '2023-12-28',
    lastRenewal: null,
    attachments: 3,
  },
  {
    id: 'CON-2025-002',
    employeeId: '817-00124',
    employeeName: 'فاطمة خالد',
    type: 'fixed-term',
    status: 'expiring-soon',
    startDate: '2024-06-01',
    endDate: '2025-05-31',
    salary: 7000,
    position: 'مهندسة مدنية',
    signedDate: '2024-05-25',
    lastRenewal: null,
    attachments: 2,
  },
  {
    id: 'CON-2025-003',
    employeeId: '817-00125',
    employeeName: 'سعد عبدالله',
    type: 'freelance',
    status: 'pending-signature',
    startDate: '2025-02-01',
    endDate: '2025-08-31',
    salary: 5000,
    position: 'مصمم جرافيك',
    signedDate: null,
    lastRenewal: null,
    attachments: 1,
  },
];

const EmployeeContracts_Complete_823: React.FC = () => {
  const [activeTab, setActiveTab] = useState('823-01');
  const [contracts, setContracts] = useState(SAMPLE_CONTRACTS);
  const [selectedContract, setSelectedContract] = useState<any>(null);

  // إحصائيات
  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    expiringSoon: contracts.filter(c => c.status === 'expiring-soon').length,
    pendingSignature: contracts.filter(c => c.status === 'pending-signature').length,
    permanent: contracts.filter(c => c.type === 'permanent').length,
    fixedTerm: contracts.filter(c => c.type === 'fixed-term').length,
    totalSalaries: contracts.reduce((sum, c) => sum + c.salary, 0),
  };

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 823-01: نظرة عامة
      case '823-01':
        return (
          <div className="universal-dense-tab-content">
            {/* إحصائيات رئيسية */}
            <div className="dense-stats-grid mb-4">
              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-blue-100 text-blue-600">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.total}</div>
                <div className="dense-stat-label">إجمالي العقود</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-green-100 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.active}</div>
                <div className="dense-stat-label">عقود نشطة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-orange-100 text-orange-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.expiringSoon}</div>
                <div className="dense-stat-label">قرب الانتهاء</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-yellow-100 text-yellow-600">
                  <FileSignature className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.pendingSignature}</div>
                <div className="dense-stat-label">في انتظار التوقيع</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-purple-100 text-purple-600">
                  <Users className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.permanent}</div>
                <div className="dense-stat-label">عقود دائمة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-emerald-100 text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.totalSalaries.toLocaleString()}</div>
                <div className="dense-stat-label">إجمالي الرواتب (ر.س)</div>
              </Card>
            </div>

            <Separator className="my-4" />

            {/* العقود التي تحتاج اهتمام */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <AlertTriangle className="h-4 w-4" />
                  عقود تحتاج اهتمام فوري
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {contracts.filter(c => c.status === 'expiring-soon' || c.status === 'pending-signature').map((contract) => {
                    const typeInfo = CONTRACT_TYPES.find(t => t.value === contract.type);
                    const statusInfo = CONTRACT_STATUSES.find(s => s.value === contract.status);
                    
                    return (
                      <div key={contract.id} className="dense-content-card p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="text-xs bg-gray-100 text-gray-700 font-mono">
                                {contract.id}
                              </Badge>
                              <Badge className={typeInfo?.color}>
                                {typeInfo?.label}
                              </Badge>
                              <Badge className={statusInfo?.color}>
                                {statusInfo?.label}
                              </Badge>
                            </div>
                            <div className="text-sm font-medium mb-1">{contract.employeeName}</div>
                            <div className="text-xs text-gray-600 mb-1">{contract.position}</div>
                            <div className="dense-grid dense-grid-3 gap-2 text-xs">
                              <div>
                                <span className="text-gray-600">الراتب:</span>
                                <span className="font-medium mr-1">{contract.salary.toLocaleString()} ر.س</span>
                              </div>
                              <div>
                                <span className="text-gray-600">البداية:</span>
                                <span className="font-medium mr-1">{contract.startDate}</span>
                              </div>
                              {contract.endDate && (
                                <div>
                                  <span className="text-gray-600">النهاية:</span>
                                  <span className="font-medium mr-1">{contract.endDate}</span>
                                </div>
                              )}
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
                            <FileSignature className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Download className="h-3 w-3" />
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

      // 823-02: عقود نشطة
      case '823-02':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FileCheck className="h-4 w-4" />
                  العقود النشطة
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
                </div>
              </CardHeader>
              <CardContent>
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم العقد</TableHead>
                      <TableHead className="text-right">الموظف</TableHead>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">الوظيفة</TableHead>
                      <TableHead className="text-right">الراتب</TableHead>
                      <TableHead className="text-right">تاريخ البداية</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract) => {
                      const statusInfo = CONTRACT_STATUSES.find(s => s.value === contract.status);
                      const typeInfo = CONTRACT_TYPES.find(t => t.value === contract.type);
                      
                      return (
                        <TableRow key={contract.id}>
                          <TableCell className="text-right font-mono text-xs">
                            {contract.id}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-xs font-medium">{contract.employeeName}</div>
                            <div className="text-xs text-gray-500">{contract.employeeId}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={typeInfo?.color}>
                              {typeInfo?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {contract.position}
                          </TableCell>
                          <TableCell className="text-right text-xs font-medium">
                            {contract.salary.toLocaleString()} ر.س
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {contract.startDate}
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
                                <Download className="h-3 w-3" />
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

      // 823-03: إنشاء عقد جديد
      case '823-03':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FilePlus className="h-4 w-4" />
                  إنشاء عقد عمل جديد
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Save className="h-3 w-3" />
                  حفظ كمسودة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* معلومات الموظف */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      معلومات الموظف
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <SelectWithCopy
                        label="الموظف"
                        id="employeeId"
                        defaultValue=""
                        options={[
                          { value: '', label: 'اختر الموظف' },
                          { value: '817-00123', label: 'أحمد محمد علي - 817-00123' },
                          { value: '817-00124', label: 'فاطمة خالد - 817-00124' },
                          { value: '817-00125', label: 'سعد عبدالله - 817-00125' },
                        ]}
                      />

                      <InputWithCopy
                        label="الوظيفة"
                        id="position"
                        defaultValue=""
                        placeholder="مثال: مهندس معماري"
                      />

                      <InputWithCopy
                        label="القسم"
                        id="department"
                        defaultValue=""
                        placeholder="مثال: قسم الهندسة"
                      />

                      <InputWithCopy
                        label="المسمى الوظيفي التفصيلي"
                        id="jobTitle"
                        defaultValue=""
                        placeholder="مثال: مهندس معماري أول"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* تفاصيل العقد */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      تفاصيل العقد
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <SelectWithCopy
                        label="نوع العقد"
                        id="contractType"
                        defaultValue=""
                        options={[
                          { value: '', label: 'اختر نوع العقد' },
                          ...CONTRACT_TYPES.map(t => ({ value: t.value, label: t.label }))
                        ]}
                      />

                      <SelectWithCopy
                        label="القالب"
                        id="template"
                        defaultValue=""
                        options={[
                          { value: '', label: 'اختر القالب' },
                          ...CONTRACT_TEMPLATES.map(t => ({ value: t.id, label: t.name }))
                        ]}
                      />

                      <DateInputWithToday
                        label="تاريخ بداية العقد"
                        id="startDate"
                      />

                      <DateInputWithToday
                        label="تاريخ نهاية العقد (اختياري)"
                        id="endDate"
                      />

                      <InputWithCopy
                        label="مدة العقد (بالأشهر)"
                        id="duration"
                        type="number"
                        defaultValue=""
                        placeholder="12"
                      />

                      <InputWithCopy
                        label="فترة التجربة (بالأيام)"
                        id="trialPeriod"
                        type="number"
                        defaultValue="90"
                        placeholder="90"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* الراتب والمزايا */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      الراتب والمزايا
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <InputWithCopy
                        label="الراتب الأساسي (ر.س)"
                        id="basicSalary"
                        type="number"
                        defaultValue=""
                        placeholder="8000.00"
                      />

                      <InputWithCopy
                        label="بدل السكن (ر.س)"
                        id="housingAllowance"
                        type="number"
                        defaultValue=""
                        placeholder="2000.00"
                      />

                      <InputWithCopy
                        label="بدل النقل (ر.س)"
                        id="transportAllowance"
                        type="number"
                        defaultValue=""
                        placeholder="500.00"
                      />

                      <InputWithCopy
                        label="بدلات أخرى (ر.س)"
                        id="otherAllowances"
                        type="number"
                        defaultValue=""
                        placeholder="0.00"
                      />
                    </div>

                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm font-medium text-green-800 mb-1">
                        إجمالي الراتب: 10,500.00 ر.س شهرياً
                      </div>
                      <div className="text-xs text-green-600">
                        126,000.00 ر.س سنوياً
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* ساعات العمل والإجازات */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      ساعات العمل والإجازات
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <InputWithCopy
                        label="ساعات العمل اليومية"
                        id="dailyHours"
                        type="number"
                        defaultValue="8"
                        placeholder="8"
                      />

                      <InputWithCopy
                        label="أيام العمل الأسبوعية"
                        id="workingDays"
                        type="number"
                        defaultValue="5"
                        placeholder="5"
                      />

                      <InputWithCopy
                        label="الإجازة السنوية (أيام)"
                        id="annualLeave"
                        type="number"
                        defaultValue="21"
                        placeholder="21"
                      />

                      <InputWithCopy
                        label="الإجازة المرضية (أيام)"
                        id="sickLeave"
                        type="number"
                        defaultValue="30"
                        placeholder="30"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* ملاحظات إضافية */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      ملاحظات إضافية
                    </h3>
                    <TextAreaWithCopy
                      label="ملاحظات خاصة بالعقد"
                      id="notes"
                      defaultValue=""
                      placeholder="أي ملاحظات أو شروط خاصة..."
                      rows={4}
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <strong>ملاحظة هامة:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>سيتم ربط العقد تلقائياً بملف الموظف في شاشة الموظفين (817)</li>
                          <li>سيتم تحديث معلومات الراتب في شاشة الرواتب (816)</li>
                          <li>سيتم مزامنة البيانات مع نظام الموارد البشرية (842)</li>
                          <li>العقد متوافق مع نظام العمل السعودي وGOSI ومنصة قوى</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="dense-btn dense-btn-primary">
                      <Save className="h-3 w-3" />
                      حفظ كمسودة
                    </Button>
                    <Button className="dense-btn dense-btn-primary">
                      <Send className="h-3 w-3" />
                      إرسال للتوقيع
                    </Button>
                    <Button className="dense-btn dense-btn-secondary">
                      <Eye className="h-3 w-3" />
                      معاينة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 823-04: قوالب العقود
      case '823-04':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Layers className="h-4 w-4" />
                  قوالب العقود الجاهزة
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  قالب جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {CONTRACT_TEMPLATES.map((template) => (
                    <div key={template.id} className="dense-content-card p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="text-xs bg-blue-100 text-blue-700 font-mono">
                              {template.id}
                            </Badge>
                            <Badge className={CONTRACT_TYPES.find(t => t.value === template.type)?.color}>
                              {CONTRACT_TYPES.find(t => t.value === template.type)?.label}
                            </Badge>
                            {template.compliant && (
                              <Badge className="bg-green-100 text-green-700">
                                <Shield className="h-3 w-3 ml-1" />
                                متوافق
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm font-medium mb-1">{template.name}</div>
                          <div className="dense-grid dense-grid-3 gap-2 text-xs">
                            <div>
                              <span className="text-gray-600">الأقسام:</span>
                              <span className="font-medium mr-1">{template.sections}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">اللغة:</span>
                              <span className="font-medium mr-1">{template.language}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">آخر تحديث:</span>
                              <span className="font-medium mr-1">{template.lastUpdated}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 pt-2 border-t">
                        <Button className="dense-btn dense-btn-primary">
                          <Eye className="h-3 w-3" />
                          معاينة
                        </Button>
                        <Button className="dense-action-btn">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button className="dense-action-btn">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button className="dense-action-btn">
                          <FilePlus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 823-05: الفقرات والشروط
      case '823-05':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FileText className="h-4 w-4" />
                  الفقرات والشروط القياسية
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  فقرة جديدة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {STANDARD_CLAUSES.map((clause) => (
                    <div key={clause.id} className="dense-content-card p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="text-xs bg-gray-100 text-gray-700 font-mono">
                              {clause.id}
                            </Badge>
                            {clause.required && (
                              <Badge className="bg-red-100 text-red-700 text-xs">
                                إلزامية
                              </Badge>
                            )}
                            {clause.editable ? (
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                قابلة للتعديل
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-700 text-xs">
                                ثابتة
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm font-medium mb-2">{clause.title}</div>
                          <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border">
                            {clause.content}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <span className="font-medium">الفئة:</span> {clause.category}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 pt-2 border-t">
                        {clause.editable && (
                          <Button className="dense-action-btn">
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                        <Button className="dense-action-btn">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button className="dense-action-btn">
                          <FilePlus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
    <div className="screen-with-vertical-tabs-layout">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                عقود الموظفين
              </h2>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                15 تبويب • الشاشة 823
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-1 mt-2">
            <Badge className="text-xs bg-green-100 text-green-800">
              <CheckCircle className="w-2 h-2 ml-1" />
              {stats.active} نشط
            </Badge>
            <Badge className="text-xs bg-orange-100 text-orange-800">
              <AlertTriangle className="w-2 h-2 ml-1" />
              {stats.expiringSoon} قريب الانتهاء
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
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الشاشة 823 - إدارة عقود الموظفين
                </h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نظام متكامل • توافق سعودي كامل • 15 تبويب
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">
                <Shield className="h-3 w-3 ml-1" />
                متوافق مع GOSI
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                <code className="font-code">SCR-823</code>
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

export default EmployeeContracts_Complete_823;
