/**
 * الشاشة 880 - تصنيفات المشاريع - نظام شامل ومتكامل v1.0
 * ================================================================
 * 
 * نظام متكامل لإدارة تصنيفات المشاريع:
 * - إضافة وتعديل وحذف تصنيفات المشاريع
 * - ترقيم موحد لكل تصنيف (CLS-XXX)
 * - تحديد متطلبات خاصة لكل تصنيف
 * - ربط تلقائي مع شاشة المعاملات (286/700)
 * - ظهور المتطلبات تلقائياً عند اختيار التصنيف
 * - أنواع التصنيفات: سكني، تجاري، صناعي، مختلط، خاص
 * - إعدادات متقدمة لكل تصنيف
 * 
 * التكامل مع الأنظمة الأخرى:
 * - المعاملات (286/700) - ظهور المتطلبات تلقائياً
 * - المشاريع (871) - تصنيف المشاريع
 * - العقود (814) - ربط التصنيفات بالعقود
 * - الوثائق (901) - المستندات المطلوبة
 * 
 * أمثلة التصنيفات:
 * - سكني (CLS-001): فيلا، شقة، دوبلكس، قصر
 * - سكني تجاري (CLS-002): فيلا بمحلات، مبنى سكني تجاري
 * - سكني مكتبي (CLS-003): فيلا بمكاتب، مبنى سكني إداري
 * - تجاري (CLS-004): محلات، مولات، أسواق
 * - صناعي (CLS-005): مصانع، مستودعات، ورش
 * - مختلط (CLS-006): تجاري سكني صناعي
 * - خاص (CLS-007): مساجد، مدارس، مستشفيات
 * 
 * التطوير: ديسمبر 2025 - v1.0
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
  Layers, Plus, Edit, Trash2, Eye, Download, Upload, CheckCircle,
  Clock, AlertCircle, X, Search, Filter, Calendar, Building,
  Settings, History, Archive, RefreshCw, Printer, Target, Award,
  TrendingUp, Paperclip, Bell, FileText, Shield, Activity, BarChart3,
  Copy, Save, Send, Home, Building2, Factory, ShoppingBag, School,
  Hospital, Briefcase, Users, Tag, List, CheckSquare, ClipboardList,
  FolderOpen, Zap, Star, Flag, Info, AlertTriangle, Key, Grid3x3
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

// ===== تكوين التابات - 15 تبويب شامل =====
const TABS_CONFIG = [
  { id: '880-01', number: '880-01', title: 'نظرة عامة', icon: Activity },
  { id: '880-02', number: '880-02', title: 'جميع التصنيفات', icon: Layers },
  { id: '880-03', number: '880-03', title: 'إضافة تصنيف', icon: Plus },
  { id: '880-04', number: '880-04', title: 'التصنيفات السكنية', icon: Home },
  { id: '880-05', number: '880-05', title: 'التصنيفات التجارية', icon: ShoppingBag },
  { id: '880-06', number: '880-06', title: 'التصنيفات الصناعية', icon: Factory },
  { id: '880-07', number: '880-07', title: 'التصنيفات المختلطة', icon: Grid3x3 },
  { id: '880-08', number: '880-08', title: 'التصنيفات الخاصة', icon: School },
  { id: '880-09', number: '880-09', title: 'متطلبات التصنيفات', icon: ClipboardList },
  { id: '880-10', number: '880-10', title: 'الربط مع المعاملات', icon: FileText },
  { id: '880-11', number: '880-11', title: 'الربط مع المشاريع', icon: Building2 },
  { id: '880-12', number: '880-12', title: 'التقارير', icon: BarChart3 },
  { id: '880-13', number: '880-13', title: 'الإحصائيات', icon: TrendingUp },
  { id: '880-14', number: '880-14', title: 'الأرشيف', icon: Archive },
  { id: '880-15', number: '880-15', title: 'الإعدادات', icon: Settings },
];

// ===== الفئات الرئيسية للتصنيفات =====
const MAIN_CATEGORIES = [
  { 
    value: 'residential', 
    label: 'سكني', 
    color: 'bg-blue-100 text-blue-700', 
    icon: Home,
    description: 'مشاريع سكنية بحتة'
  },
  { 
    value: 'commercial', 
    label: 'تجاري', 
    color: 'bg-green-100 text-green-700', 
    icon: ShoppingBag,
    description: 'مشاريع تجارية'
  },
  { 
    value: 'industrial', 
    label: 'صناعي', 
    color: 'bg-orange-100 text-orange-700', 
    icon: Factory,
    description: 'مشاريع صناعية'
  },
  { 
    value: 'mixed', 
    label: 'مختلط', 
    color: 'bg-purple-100 text-purple-700', 
    icon: Grid3x3,
    description: 'مشاريع متعددة الاستخدامات'
  },
  { 
    value: 'special', 
    label: 'خاص', 
    color: 'bg-cyan-100 text-cyan-700', 
    icon: School,
    description: 'مشاريع خاصة (تعليمية، صحية، دينية)'
  },
];

// ===== حالات التصنيفات =====
const CLASSIFICATION_STATUSES = [
  { value: 'active', label: 'نشط', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'inactive', label: 'معطل', color: 'bg-gray-100 text-gray-700', icon: X },
  { value: 'pending', label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  { value: 'archived', label: 'مؤرشف', color: 'bg-gray-100 text-gray-700', icon: Archive },
];

// ===== بيانات تجريبية للتصنيفات =====
const SAMPLE_CLASSIFICATIONS = [
  {
    id: 'CLS-001',
    code: 'CLS-001',
    nameAr: 'فيلا سكنية',
    nameEn: 'Residential Villa',
    category: 'residential',
    description: 'فيلا سكنية مستقلة بمساحة أرض وبناء محددة',
    status: 'active',
    requirements: [
      { id: 'REQ-001', name: 'صك الملكية', type: 'document', mandatory: true },
      { id: 'REQ-002', name: 'المخططات المعمارية', type: 'document', mandatory: true },
      { id: 'REQ-003', name: 'دراسة التربة', type: 'document', mandatory: false },
      { id: 'REQ-004', name: 'موافقة البلدية', type: 'approval', mandatory: true },
      { id: 'REQ-005', name: 'رخصة البناء', type: 'license', mandatory: true },
    ],
    usageCount: 45,
    projectsCount: 23,
    transactionsCount: 67,
    createdDate: '2024-01-15',
    createdBy: 'مدير النظام',
    lastModified: '2025-01-10',
    modifiedBy: 'أحمد محمد',
    autoApply: true,
    allowCustomRequirements: true,
    icon: 'Home',
  },
  {
    id: 'CLS-002',
    code: 'CLS-002',
    nameAr: 'سكني تجاري',
    nameEn: 'Residential Commercial',
    category: 'mixed',
    description: 'مبنى سكني مع محلات تجارية في الدور الأرضي',
    status: 'active',
    requirements: [
      { id: 'REQ-006', name: 'صك الملكية', type: 'document', mandatory: true },
      { id: 'REQ-007', name: 'المخططات المعمارية', type: 'document', mandatory: true },
      { id: 'REQ-008', name: 'دراسة حركة المرور', type: 'document', mandatory: true },
      { id: 'REQ-009', name: 'موافقة البلدية', type: 'approval', mandatory: true },
      { id: 'REQ-010', name: 'رخصة البناء', type: 'license', mandatory: true },
      { id: 'REQ-011', name: 'موافقة الدفاع المدني', type: 'approval', mandatory: true },
      { id: 'REQ-012', name: 'دراسة السلامة', type: 'document', mandatory: false },
    ],
    usageCount: 28,
    projectsCount: 15,
    transactionsCount: 42,
    createdDate: '2024-01-20',
    createdBy: 'مدير النظام',
    lastModified: '2025-01-12',
    modifiedBy: 'سارة علي',
    autoApply: true,
    allowCustomRequirements: true,
    icon: 'Building',
  },
  {
    id: 'CLS-003',
    code: 'CLS-003',
    nameAr: 'سكني مكتبي',
    nameEn: 'Residential Office',
    category: 'mixed',
    description: 'مبنى سكني مع مكاتب إدارية',
    status: 'active',
    requirements: [
      { id: 'REQ-013', name: 'صك الملكية', type: 'document', mandatory: true },
      { id: 'REQ-014', name: 'المخططات المعمارية', type: 'document', mandatory: true },
      { id: 'REQ-015', name: 'دراسة المواقف', type: 'document', mandatory: true },
      { id: 'REQ-016', name: 'موافقة البلدية', type: 'approval', mandatory: true },
      { id: 'REQ-017', name: 'رخصة البناء', type: 'license', mandatory: true },
    ],
    usageCount: 18,
    projectsCount: 12,
    transactionsCount: 30,
    createdDate: '2024-02-01',
    createdBy: 'مدير النظام',
    lastModified: '2025-01-08',
    modifiedBy: 'خالد محمد',
    autoApply: true,
    allowCustomRequirements: true,
    icon: 'Briefcase',
  },
  {
    id: 'CLS-004',
    code: 'CLS-004',
    nameAr: 'مجمع تجاري',
    nameEn: 'Commercial Complex',
    category: 'commercial',
    description: 'مجمع تجاري أو مول تجاري',
    status: 'active',
    requirements: [
      { id: 'REQ-018', name: 'صك الملكية', type: 'document', mandatory: true },
      { id: 'REQ-019', name: 'المخططات المعمارية', type: 'document', mandatory: true },
      { id: 'REQ-020', name: 'دراسة حركة المرور', type: 'document', mandatory: true },
      { id: 'REQ-021', name: 'دراسة المواقف', type: 'document', mandatory: true },
      { id: 'REQ-022', name: 'موافقة البلدية', type: 'approval', mandatory: true },
      { id: 'REQ-023', name: 'رخصة البناء', type: 'license', mandatory: true },
      { id: 'REQ-024', name: 'موافقة الدفاع المدني', type: 'approval', mandatory: true },
      { id: 'REQ-025', name: 'دراسة السلامة', type: 'document', mandatory: true },
      { id: 'REQ-026', name: 'تقرير البيئة', type: 'document', mandatory: false },
    ],
    usageCount: 12,
    projectsCount: 8,
    transactionsCount: 20,
    createdDate: '2024-02-15',
    createdBy: 'مدير النظام',
    lastModified: '2025-01-05',
    modifiedBy: 'نورة أحمد',
    autoApply: true,
    allowCustomRequirements: true,
    icon: 'ShoppingBag',
  },
  {
    id: 'CLS-005',
    code: 'CLS-005',
    nameAr: 'مصنع صناعي',
    nameEn: 'Industrial Factory',
    category: 'industrial',
    description: 'مصنع صناعي أو منشأة إنتاجية',
    status: 'active',
    requirements: [
      { id: 'REQ-027', name: 'صك الملكية', type: 'document', mandatory: true },
      { id: 'REQ-028', name: 'المخططات الهندسية', type: 'document', mandatory: true },
      { id: 'REQ-029', name: 'دراسة التأثير البيئي', type: 'document', mandatory: true },
      { id: 'REQ-030', name: 'موافقة وزارة الصناعة', type: 'approval', mandatory: true },
      { id: 'REQ-031', name: 'رخصة البناء الصناعي', type: 'license', mandatory: true },
      { id: 'REQ-032', name: 'موافقة الدفاع المدني', type: 'approval', mandatory: true },
      { id: 'REQ-033', name: 'دراسة السلامة الصناعية', type: 'document', mandatory: true },
      { id: 'REQ-034', name: 'تقرير الصرف الصحي', type: 'document', mandatory: true },
    ],
    usageCount: 8,
    projectsCount: 5,
    transactionsCount: 13,
    createdDate: '2024-03-01',
    createdBy: 'مدير النظام',
    lastModified: '2025-01-03',
    modifiedBy: 'فاطمة خالد',
    autoApply: true,
    allowCustomRequirements: true,
    icon: 'Factory',
  },
];

// ===== أنواع المتطلبات =====
const REQUIREMENT_TYPES = [
  { value: 'document', label: 'وثيقة', color: 'bg-blue-100 text-blue-700', icon: FileText },
  { value: 'approval', label: 'موافقة', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'license', label: 'رخصة', color: 'bg-purple-100 text-purple-700', icon: Shield },
  { value: 'certificate', label: 'شهادة', color: 'bg-orange-100 text-orange-700', icon: Award },
  { value: 'report', label: 'تقرير', color: 'bg-cyan-100 text-cyan-700', icon: BarChart3 },
];

const ProjectClassifications_Complete_880: React.FC = () => {
  const [activeTab, setActiveTab] = useState('880-01');
  const [classifications, setClassifications] = useState(SAMPLE_CLASSIFICATIONS);
  const [selectedClassification, setSelectedClassification] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // إحصائيات
  const stats = useMemo(() => ({
    total: classifications.length,
    active: classifications.filter(c => c.status === 'active').length,
    residential: classifications.filter(c => c.category === 'residential').length,
    commercial: classifications.filter(c => c.category === 'commercial').length,
    industrial: classifications.filter(c => c.category === 'industrial').length,
    mixed: classifications.filter(c => c.category === 'mixed').length,
    special: classifications.filter(c => c.category === 'special').length,
    totalUsage: classifications.reduce((sum, c) => sum + c.usageCount, 0),
    totalProjects: classifications.reduce((sum, c) => sum + c.projectsCount, 0),
    totalTransactions: classifications.reduce((sum, c) => sum + c.transactionsCount, 0),
  }), [classifications]);

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 880-01: نظرة عامة
      case '880-01':
        return (
          <div className="universal-dense-tab-content">
            {/* إحصائيات رئيسية */}
            <div className="dense-stats-grid mb-4">
              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-blue-100 text-blue-600">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.total}</div>
                <div className="dense-stat-label">إجمالي التصنيفات</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-green-100 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.active}</div>
                <div className="dense-stat-label">تصنيفات نشطة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-purple-100 text-purple-600">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.totalProjects}</div>
                <div className="dense-stat-label">مشاريع مرتبطة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-orange-100 text-orange-600">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.totalTransactions}</div>
                <div className="dense-stat-label">معاملات مرتبطة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-cyan-100 text-cyan-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.totalUsage}</div>
                <div className="dense-stat-label">إجمالي الاستخدام</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-red-100 text-red-600">
                  <Grid3x3 className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.mixed}</div>
                <div className="dense-stat-label">تصنيفات مختلطة</div>
              </Card>
            </div>

            <Separator className="my-4" />

            {/* التوزيع حسب الفئة */}
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Grid3x3 className="h-4 w-4" />
                  توزيع التصنيفات حسب الفئة
                </h2>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-5 gap-2">
                  {MAIN_CATEGORIES.map((category) => {
                    const count = stats[category.value as keyof typeof stats] as number;
                    const CategoryIcon = category.icon;
                    const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                    
                    return (
                      <div key={category.value} className="dense-content-card p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center`}>
                            <CategoryIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium">{category.label}</div>
                            <div className="text-xs text-gray-600">{count} تصنيف</div>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2 mb-1" />
                        <div className="text-xs text-gray-500 text-center">{percentage.toFixed(1)}%</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* التصنيفات الأكثر استخداماً */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Star className="h-4 w-4" />
                  التصنيفات الأكثر استخداماً
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {classifications
                    .sort((a, b) => b.usageCount - a.usageCount)
                    .slice(0, 5)
                    .map((classification) => {
                      const categoryInfo = MAIN_CATEGORIES.find(c => c.value === classification.category);
                      const statusInfo = CLASSIFICATION_STATUSES.find(s => s.value === classification.status);
                      
                      return (
                        <div key={classification.id} className="dense-content-card p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="text-xs bg-gray-100 text-gray-700 font-mono">
                                  {classification.code}
                                </Badge>
                                <Badge className={categoryInfo?.color}>
                                  {categoryInfo?.label}
                                </Badge>
                                <Badge className={statusInfo?.color}>
                                  {statusInfo?.label}
                                </Badge>
                              </div>
                              <div className="text-xs font-medium mb-1">{classification.nameAr}</div>
                              <div className="text-xs text-gray-600 mb-2">{classification.description}</div>
                              <div className="dense-grid dense-grid-3 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-600">الاستخدام:</span>
                                  <span className="font-medium mr-1">{classification.usageCount}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">المشاريع:</span>
                                  <span className="font-medium mr-1">{classification.projectsCount}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">المتطلبات:</span>
                                  <span className="font-medium mr-1">{classification.requirements.length}</span>
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
                              <ClipboardList className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn">
                              <Copy className="h-3 w-3" />
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

      // 880-02: جميع التصنيفات
      case '880-02':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Layers className="h-4 w-4" />
                  جميع تصنيفات المشاريع ({stats.total})
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
                      <TableHead className="text-right">الرمز</TableHead>
                      <TableHead className="text-right">اسم التصنيف</TableHead>
                      <TableHead className="text-right">الفئة</TableHead>
                      <TableHead className="text-right">المتطلبات</TableHead>
                      <TableHead className="text-right">الاستخدام</TableHead>
                      <TableHead className="text-right">المشاريع</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classifications.map((classification) => {
                      const categoryInfo = MAIN_CATEGORIES.find(c => c.value === classification.category);
                      const statusInfo = CLASSIFICATION_STATUSES.find(s => s.value === classification.status);
                      
                      return (
                        <TableRow key={classification.id}>
                          <TableCell className="text-right">
                            <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                              {classification.code}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-xs font-medium">{classification.nameAr}</div>
                            <div className="text-xs text-gray-500">{classification.nameEn}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={categoryInfo?.color}>
                              {categoryInfo?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              {classification.requirements.length}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {classification.usageCount}
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {classification.projectsCount}
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
                                <ClipboardList className="h-3 w-3" />
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

      // 880-03: إضافة تصنيف جديد
      case '880-03':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Plus className="h-4 w-4" />
                  إضافة تصنيف مشروع جديد
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
                      معلومات التصنيف الأساسية
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <InputWithCopy
                        label="رمز التصنيف"
                        id="classCode"
                        placeholder="CLS-006"
                      />

                      <SelectWithCopy
                        label="الفئة الرئيسية"
                        id="mainCategory"
                        options={[
                          { value: '', label: 'اختر الفئة' },
                          ...MAIN_CATEGORIES.map(c => ({ value: c.value, label: c.label }))
                        ]}
                      />

                      <InputWithCopy
                        label="اسم التصنيف (بالعربية)"
                        id="nameAr"
                        placeholder="مثال: فيلا سكنية"
                      />

                      <InputWithCopy
                        label="اسم التصنيف (بالإنجليزية)"
                        id="nameEn"
                        placeholder="Example: Residential Villa"
                      />

                      <div className="col-span-2">
                        <TextAreaWithCopy
                          label="وصف التصنيف"
                          id="description"
                          placeholder="وصف تفصيلي للتصنيف..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* متطلبات التصنيف */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      متطلبات التصنيف
                    </h3>
                    
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 mb-3">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <div className="text-xs text-blue-800">
                          <strong>المتطلبات التلقائية:</strong>
                          <p className="mt-2">
                            المتطلبات المحددة هنا ستظهر تلقائياً في شاشة المعاملات (286/700) عند 
                            اختيار هذا التصنيف. يمكن تحديد المتطلبات الإلزامية والاختيارية.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {/* نموذج إضافة متطلب */}
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Plus className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-medium">إضافة متطلب جديد</span>
                        </div>
                        
                        <div className="dense-grid dense-grid-3 gap-2 mb-2">
                          <InputWithCopy
                            label="اسم المتطلب"
                            id="reqName"
                            placeholder="مثال: صك الملكية"
                          />

                          <SelectWithCopy
                            label="نوع المتطلب"
                            id="reqType"
                            options={[
                              { value: '', label: 'اختر النوع' },
                              ...REQUIREMENT_TYPES.map(t => ({ value: t.value, label: t.label }))
                            ]}
                          />

                          <div className="flex items-center justify-between p-2 bg-white rounded border">
                            <span className="text-xs">إلزامي</span>
                            <Switch />
                          </div>
                        </div>

                        <Button className="dense-btn dense-btn-primary w-full">
                          <Plus className="h-3 w-3" />
                          إضافة المتطلب
                        </Button>
                      </div>

                      {/* قائمة المتطلبات المضافة */}
                      <div className="p-3 bg-white rounded-lg border">
                        <div className="text-xs font-medium mb-2">المتطلبات المضافة (0)</div>
                        <div className="text-xs text-gray-500 text-center py-4">
                          لم يتم إضافة متطلبات بعد
                        </div>
                      </div>
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
                          <div className="text-xs font-medium">تطبيق تلقائي للمتطلبات</div>
                          <div className="text-xs text-gray-600">
                            تطبيق المتطلبات تلقائياً عند اختيار التصنيف في المعاملات
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-xs font-medium">السماح بمتطلبات إضافية</div>
                          <div className="text-xs text-gray-600">
                            السماح بإضافة متطلبات إضافية عند استخدام التصنيف
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-xs font-medium">تصنيف نشط</div>
                          <div className="text-xs text-gray-600">
                            هل التصنيف متاح للاستخدام في النظام؟
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div className="text-xs text-green-800">
                        <strong>ملاحظة هامة:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>بعد حفظ التصنيف، سيظهر في قوائم المعاملات والمشاريع</li>
                          <li>المتطلبات المحددة ستظهر تلقائياً عند اختيار التصنيف</li>
                          <li>يمكن تعديل المتطلبات في أي وقت من تاب "متطلبات التصنيفات"</li>
                          <li>التصنيف قابل للنسخ لإنشاء تصنيفات مشابهة بسرعة</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 880-04: التصنيفات السكنية
      case '880-04':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Home className="h-4 w-4" />
                  التصنيفات السكنية ({classifications.filter(c => c.category === 'residential').length})
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  تصنيف سكني
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {classifications.filter(c => c.category === 'residential').map((classification) => {
                    const statusInfo = CLASSIFICATION_STATUSES.find(s => s.value === classification.status);
                    
                    return (
                      <div key={classification.id} className="dense-content-card p-3 border-r-4 border-blue-500">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {classification.code}
                          </Badge>
                          <Badge className={statusInfo?.color}>
                            {statusInfo?.label}
                          </Badge>
                        </div>
                        <div className="text-xs font-medium mb-2">{classification.nameAr}</div>
                        <div className="dense-grid dense-grid-3 gap-2 text-xs mb-2">
                          <div>
                            <span className="text-gray-600">الاستخدام:</span>
                            <span className="font-medium mr-1">{classification.usageCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">المشاريع:</span>
                            <span className="font-medium mr-1">{classification.projectsCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">المتطلبات:</span>
                            <span className="font-medium mr-1">{classification.requirements.length}</span>
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
                            <ClipboardList className="h-3 w-3" />
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

      // 880-05: التصنيفات التجارية
      case '880-05':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <ShoppingBag className="h-4 w-4" />
                  التصنيفات التجارية ({classifications.filter(c => c.category === 'commercial').length})
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  تصنيف تجاري
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {classifications.filter(c => c.category === 'commercial').map((classification) => {
                    const statusInfo = CLASSIFICATION_STATUSES.find(s => s.value === classification.status);
                    
                    return (
                      <div key={classification.id} className="dense-content-card p-3 border-r-4 border-green-500">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {classification.code}
                          </Badge>
                          <Badge className={statusInfo?.color}>
                            {statusInfo?.label}
                          </Badge>
                        </div>
                        <div className="text-xs font-medium mb-2">{classification.nameAr}</div>
                        <div className="dense-grid dense-grid-3 gap-2 text-xs mb-2">
                          <div>
                            <span className="text-gray-600">الاستخدام:</span>
                            <span className="font-medium mr-1">{classification.usageCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">المشاريع:</span>
                            <span className="font-medium mr-1">{classification.projectsCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">المتطلبات:</span>
                            <span className="font-medium mr-1">{classification.requirements.length}</span>
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
                            <ClipboardList className="h-3 w-3" />
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

      // 880-06: التصنيفات الصناعية
      case '880-06':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Factory className="h-4 w-4" />
                  التصنيفات الصناعية ({classifications.filter(c => c.category === 'industrial').length})
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  تصنيف صناعي
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {classifications.filter(c => c.category === 'industrial').map((classification) => {
                    const statusInfo = CLASSIFICATION_STATUSES.find(s => s.value === classification.status);
                    
                    return (
                      <div key={classification.id} className="dense-content-card p-3 border-r-4 border-orange-500">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {classification.code}
                          </Badge>
                          <Badge className={statusInfo?.color}>
                            {statusInfo?.label}
                          </Badge>
                        </div>
                        <div className="text-xs font-medium mb-2">{classification.nameAr}</div>
                        <div className="dense-grid dense-grid-3 gap-2 text-xs mb-2">
                          <div>
                            <span className="text-gray-600">الاستخدام:</span>
                            <span className="font-medium mr-1">{classification.usageCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">المشاريع:</span>
                            <span className="font-medium mr-1">{classification.projectsCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">المتطلبات:</span>
                            <span className="font-medium mr-1">{classification.requirements.length}</span>
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
                            <ClipboardList className="h-3 w-3" />
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

      // 880-07: التصنيفات المختلطة
      case '880-07':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Grid3x3 className="h-4 w-4" />
                  التصنيفات المختلطة ({classifications.filter(c => c.category === 'mixed').length})
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  تصنيف مختلط
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {classifications.filter(c => c.category === 'mixed').map((classification) => {
                    const statusInfo = CLASSIFICATION_STATUSES.find(s => s.value === classification.status);
                    
                    return (
                      <div key={classification.id} className="dense-content-card p-3 border-r-4 border-purple-500">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {classification.code}
                          </Badge>
                          <Badge className={statusInfo?.color}>
                            {statusInfo?.label}
                          </Badge>
                        </div>
                        <div className="text-xs font-medium mb-2">{classification.nameAr}</div>
                        <div className="dense-grid dense-grid-3 gap-2 text-xs mb-2">
                          <div>
                            <span className="text-gray-600">الاستخدام:</span>
                            <span className="font-medium mr-1">{classification.usageCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">المشاريع:</span>
                            <span className="font-medium mr-1">{classification.projectsCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">المتطلبات:</span>
                            <span className="font-medium mr-1">{classification.requirements.length}</span>
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
                            <ClipboardList className="h-3 w-3" />
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

      // 880-08: التصنيفات الخاصة
      case '880-08':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <School className="h-4 w-4" />
                  التصنيفات الخاصة ({classifications.filter(c => c.category === 'special').length})
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  تصنيف خاص
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 text-center">
                  <School className="h-12 w-12 text-cyan-600 mx-auto mb-2" />
                  <p className="text-xs text-cyan-800 mb-2">
                    التصنيفات الخاصة تشمل: مساجد، مدارس، مستشفيات، حدائق عامة
                  </p>
                  <Button className="dense-btn dense-btn-primary">
                    <Plus className="h-3 w-3" />
                    إضافة تصنيف خاص
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 880-09: متطلبات التصنيفات
      case '880-09':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <ClipboardList className="h-4 w-4" />
                  إدارة متطلبات التصنيفات
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  متطلب جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {classifications.map((classification) => (
                    <div key={classification.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {classification.code}
                          </Badge>
                          <span className="text-xs font-medium">{classification.nameAr}</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                          {classification.requirements.length} متطلب
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        {classification.requirements.map((req) => {
                          const reqType = REQUIREMENT_TYPES.find(t => t.value === req.type);
                          const ReqIcon = reqType?.icon || FileText;
                          
                          return (
                            <div key={req.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border text-xs hover:bg-blue-50 hover:border-blue-300 transition-all">
                              <div className="flex items-center gap-2 flex-1">
                                <div className={`w-6 h-6 rounded ${reqType?.color} flex items-center justify-center`}>
                                  <ReqIcon className="h-3 w-3" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">{req.name}</div>
                                  <div className="text-gray-600">
                                    {req.mandatory ? (
                                      <Badge className="bg-red-100 text-red-700 text-xs">إلزامي</Badge>
                                    ) : (
                                      <Badge className="bg-gray-100 text-gray-700 text-xs">اختياري</Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button className="dense-action-btn h-6 w-6">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button className="dense-action-btn h-6 w-6">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 880-10: الربط مع المعاملات
      case '880-10':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FileText className="h-4 w-4" />
                  الربط مع شاشة المعاملات (286/700)
                </h2>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="text-xs text-blue-800">
                      <strong>آلية الربط التلقائي:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>عند اختيار تصنيف في شاشة المعاملات، تظهر المتطلبات تلقائياً</li>
                        <li>المتطلبات الإلزامية تكون مطلوبة قبل حفظ المعاملة</li>
                        <li>المتطلبات الاختيارية يمكن تجاوزها</li>
                        <li>يمكن للمستخدم إضافة متطلبات إضافية حسب الحاجة</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {classifications.map((classification) => (
                    <div key={classification.id} className="dense-content-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {classification.code}
                          </Badge>
                          <span className="text-xs font-medium">{classification.nameAr}</span>
                        </div>
                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                          <FileText className="h-3 w-3 ml-1" />
                          {classification.transactionsCount} معاملة
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-2">
                        <strong>المتطلبات التلقائية:</strong> {classification.requirements.length} متطلب
                        ({classification.requirements.filter(r => r.mandatory).length} إلزامي)
                      </div>
                      
                      <div className="flex items-center gap-1 pt-2 border-t">
                        <Button className="dense-btn dense-btn-primary">
                          <Eye className="h-3 w-3" />
                          عرض المتطلبات
                        </Button>
                        <Button className="dense-action-btn">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 880-11: الربط مع المشاريع
      case '880-11':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Building2 className="h-4 w-4" />
                  الربط مع شاشة المشاريع (871)
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {classifications.map((classification) => (
                    <div key={classification.id} className="dense-content-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {classification.code}
                          </Badge>
                          <span className="text-xs font-medium">{classification.nameAr}</span>
                        </div>
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          <Building2 className="h-3 w-3 ml-1" />
                          {classification.projectsCount} مشروع
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 pt-2 border-t">
                        <Button className="dense-btn dense-btn-primary">
                          <Eye className="h-3 w-3" />
                          عرض المشاريع
                        </Button>
                        <Button className="dense-action-btn">
                          <BarChart3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 880-12: التقارير
      case '880-12':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <BarChart3 className="h-4 w-4" />
                  تقارير تصنيفات المشاريع
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Download className="h-3 w-3" />
                  تصدير
                </Button>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-3">
                  {[
                    { name: 'تقرير التصنيفات حسب الفئة', icon: Grid3x3, count: stats.total },
                    { name: 'تقرير الاستخدام والشعبية', icon: TrendingUp, count: stats.totalUsage },
                    { name: 'تقرير المشاريع المرتبطة', icon: Building2, count: stats.totalProjects },
                    { name: 'تقرير المتطلبات', icon: ClipboardList, count: 'شامل' },
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

      // 880-13: الإحصائيات
      case '880-13':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <TrendingUp className="h-4 w-4" />
                  إحصائيات تفصيلية للتصنيفات
                </h2>
                <Button className="dense-btn dense-btn-secondary">
                  <Download className="h-3 w-3" />
                  تصدير
                </Button>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-3 gap-3 mb-4">
                  <div className="dense-content-card p-3">
                    <div className="text-xs text-gray-600 mb-1">معدل الاستخدام</div>
                    <div className="text-lg font-bold text-blue-700">
                      {stats.total > 0 ? (stats.totalUsage / stats.total).toFixed(1) : 0}
                    </div>
                    <div className="text-xs text-gray-500">لكل تصنيف</div>
                  </div>

                  <div className="dense-content-card p-3">
                    <div className="text-xs text-gray-600 mb-1">معدل المشاريع</div>
                    <div className="text-lg font-bold text-green-700">
                      {stats.total > 0 ? (stats.totalProjects / stats.total).toFixed(1) : 0}
                    </div>
                    <div className="text-xs text-gray-500">لكل تصنيف</div>
                  </div>

                  <div className="dense-content-card p-3">
                    <div className="text-xs text-gray-600 mb-1">التصنيف الأكثر استخداماً</div>
                    <div className="text-xs font-bold text-purple-700">
                      {classifications.sort((a, b) => b.usageCount - a.usageCount)[0]?.nameAr}
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 text-xs mt-1">
                      {classifications.sort((a, b) => b.usageCount - a.usageCount)[0]?.usageCount} استخدام
                    </Badge>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* رسم بياني للاستخدام */}
                <div className="space-y-2">
                  {classifications
                    .sort((a, b) => b.usageCount - a.usageCount)
                    .map((classification) => {
                      const percentage = stats.totalUsage > 0 
                        ? (classification.usageCount / stats.totalUsage) * 100 
                        : 0;
                      
                      return (
                        <div key={classification.id} className="p-2 bg-gray-50 rounded border">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                                {classification.code}
                              </Badge>
                              <span className="text-xs">{classification.nameAr}</span>
                            </div>
                            <span className="text-xs font-medium">{classification.usageCount}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                          <div className="text-xs text-gray-500 text-left mt-1">{percentage.toFixed(1)}%</div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 880-14: الأرشيف
      case '880-14':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Archive className="h-4 w-4" />
                  التصنيفات المؤرشفة
                </h2>
                <Button className="dense-btn dense-btn-secondary">
                  <RefreshCw className="h-3 w-3" />
                  استعادة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <Archive className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">لا توجد تصنيفات مؤرشفة حالياً</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 880-15: الإعدادات
      case '880-15':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Settings className="h-4 w-4" />
                  إعدادات نظام التصنيفات
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
                      <div className="text-xs font-medium">تطبيق المتطلبات تلقائياً</div>
                      <div className="text-xs text-gray-600">
                        تطبيق متطلبات التصنيف تلقائياً في المعاملات والمشاريع
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium">السماح بمتطلبات إضافية</div>
                      <div className="text-xs text-gray-600">
                        السماح للمستخدمين بإضافة متطلبات إضافية للتصنيف
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium">التحقق من المتطلبات الإلزامية</div>
                      <div className="text-xs text-gray-600">
                        منع حفظ المعاملة إذا لم تستوفِ المتطلبات الإلزامية
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium">إشعارات المتطلبات الناقصة</div>
                      <div className="text-xs text-gray-600">
                        إرسال إشعارات عند وجود متطلبات ناقصة
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator className="my-3" />

                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      إعدادات الترقيم
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <InputWithCopy
                        label="بادئة رمز التصنيف"
                        id="codePrefix"
                        placeholder="CLS"
                        defaultValue="CLS"
                      />

                      <InputWithCopy
                        label="رقم التصنيف التالي"
                        id="nextNumber"
                        type="number"
                        placeholder="006"
                        defaultValue="006"
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
    <div className="screen-with-vertical-tabs-layout">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                تصنيفات المشاريع
              </h2>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                15 تبويب • الشاشة 880
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-1 mt-2">
            <Badge className="text-xs bg-blue-100 text-blue-800">
              <Layers className="w-2 h-2 ml-1" />
              {stats.total} تصنيف
            </Badge>
            <Badge className="text-xs bg-green-100 text-green-800">
              <CheckCircle className="w-2 h-2 ml-1" />
              {stats.active} نشط
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
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                  الشاشة 880 - تصنيفات المشاريع
                </h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نظام شامل • ربط تلقائي • متطلبات ذكية • 15 تبويب
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-700 text-xs">
                <Layers className="h-3 w-3 ml-1" />
                {stats.total} تصنيف
              </Badge>
              <Badge className="bg-purple-100 text-purple-700 text-xs">
                <Building2 className="h-3 w-3 ml-1" />
                {stats.totalProjects} مشروع
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 text-xs">
                <code className="font-code">SCR-880</code>
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

export default ProjectClassifications_Complete_880;
