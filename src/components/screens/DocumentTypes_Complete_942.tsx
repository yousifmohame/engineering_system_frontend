/**
 * الشاشة 942 - أنواع المستندات
 * ===========================================================================
 * 
 * شاشة شاملة لإدارة وتصنيف أنواع المستندات في النظام
 * 
 * المميزات:
 * - تصنيف شامل لجميع أنواع المستندات
 * - ربط بأنظمة الملفات
 * - تحديد الامتدادات المدعومة
 * - إعدادات خاصة لكل نوع
 * - إحصائيات الاستخدام
 * - إدارة الأيقونات والألوان
 * 
 * التابات:
 * 942-01: المستندات الرسمية
 * 942-02: المستندات الهندسية
 * 942-03: مستندات الجهات الخارجية
 * 942-04: المستندات الداخلية
 * 942-05: العقود والاتفاقيات
 * 942-06: المستندات المالية
 * 942-07: المستندات الفنية
 * 942-08: الملفات التصميمية
 * 942-09: المستندات الإدارية
 * 942-10: المستندات القانونية
 * 942-11: سجل أنواع المستندات
 * 942-12: إعدادات التصنيف
 * 
 * @version 1.0
 * @date 2025-10-20
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Switch } from '../ui/switch';
import {
  FileText, Plus, Search, Download, Upload, Edit, Eye, Copy,
  Trash2, CheckCircle, XCircle, Settings, BarChart3, File,
  FileCheck, Shield, Archive, Save, RefreshCw, Filter, Star,
  Folder, Image, Video, Music, FileCode, FileSpreadsheet,
  Paperclip, Award, Building, Users, HardHat, Briefcase,
  FileSignature, FileBox, FileCog, FileImage, FilePlus
} from 'lucide-react';

// ===== واجهات البيانات =====

interface DocumentType {
  id: string;
  typeNumber: string;
  name: string;
  category: string;
  description: string;
  extensions: string[];
  icon: string;
  color: string;
  isActive: boolean;
  requiresApproval: boolean;
  maxFileSize: number;
  allowedFor: string[];
  usageCount: number;
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

const DocumentTypesScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('942-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);

  // تكوين التابات
  const TABS_CONFIG = [
    { id: '942-01', number: '942-01', title: 'المستندات الرسمية', icon: FileCheck, category: 'رسمية' },
    { id: '942-02', number: '942-02', title: 'المستندات الهندسية', icon: FileCog, category: 'هندسية' },
    { id: '942-03', number: '942-03', title: 'مستندات الجهات الخارجية', icon: Building, category: 'خارجية' },
    { id: '942-04', number: '942-04', title: 'المستندات الداخلية', icon: Folder, category: 'داخلية' },
    { id: '942-05', number: '942-05', title: 'العقود والاتفاقيات', icon: FileSignature, category: 'عقود' },
    { id: '942-06', number: '942-06', title: 'المستندات المالية', icon: FileSpreadsheet, category: 'مالية' },
    { id: '942-07', number: '942-07', title: 'المستندات الفنية', icon: FileCode, category: 'فنية' },
    { id: '942-08', number: '942-08', title: 'الملفات التصميمية', icon: FileImage, category: 'تصميمية' },
    { id: '942-09', number: '942-09', title: 'المستندات الإدارية', icon: FileBox, category: 'إدارية' },
    { id: '942-10', number: '942-10', title: 'المستندات القانونية', icon: Shield, category: 'قانونية' },
    { id: '942-11', number: '942-11', title: 'سجل أنواع المستندات', icon: Archive, category: null },
    { id: '942-12', number: '942-12', title: 'إعدادات التصنيف', icon: Settings, category: null },
  ];

  // بيانات تجريبية - أنواع المستندات
  const sampleDocumentTypes: DocumentType[] = useMemo(() => [
    // المستندات الرسمية
    {
      id: 'DT001',
      typeNumber: 'DT-001',
      name: 'اشتراطات رسمية',
      category: 'رسمية',
      description: 'الاشتراطات والمتطلبات الرسمية من الجهات الحكومية',
      extensions: ['.pdf', '.docx', '.jpg', '.png'],
      icon: 'FileCheck',
      color: '#2563eb',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 50,
      allowedFor: ['الملاك', 'المديرون', 'الموظفون'],
      usageCount: 342,
      createdBy: 'أحمد السالم',
      createdDate: '2024-01-10',
      lastModified: '2025-10-15'
    },
    {
      id: 'DT002',
      typeNumber: 'DT-002',
      name: 'مسودة اشتراطات رسمية',
      category: 'رسمية',
      description: 'مسودات الاشتراطات قبل الاعتماد النهائي',
      extensions: ['.pdf', '.docx', '.txt'],
      icon: 'FilePlus',
      color: '#f59e0b',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 30,
      allowedFor: ['المديرون', 'الموظفون'],
      usageCount: 128,
      createdBy: 'فاطمة محمد',
      createdDate: '2024-01-12',
      lastModified: '2025-09-20'
    },
    {
      id: 'DT003',
      typeNumber: 'DT-003',
      name: 'تعميم',
      category: 'رسمية',
      description: 'التعاميم الرسمية من الجهات المختصة',
      extensions: ['.pdf', '.docx'],
      icon: 'FileText',
      color: '#10b981',
      isActive: true,
      requiresApproval: false,
      maxFileSize: 20,
      allowedFor: ['الكل'],
      usageCount: 215,
      createdBy: 'خالد العتيبي',
      createdDate: '2024-01-15',
      lastModified: '2025-10-10'
    },
    {
      id: 'DT004',
      typeNumber: 'DT-004',
      name: 'توجيه',
      category: 'رسمية',
      description: 'التوجيهات الإدارية والفنية',
      extensions: ['.pdf', '.docx', '.txt'],
      icon: 'Award',
      color: '#8b5cf6',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 15,
      allowedFor: ['المديرون', 'الموظفون'],
      usageCount: 187,
      createdBy: 'سارة أحمد',
      createdDate: '2024-02-01',
      lastModified: '2025-10-05'
    },

    // المستندات الهندسية
    {
      id: 'DT010',
      typeNumber: 'DT-010',
      name: 'مخططات AutoCAD',
      category: 'هندسية',
      description: 'المخططات الهندسية بصيغة AutoCAD',
      extensions: ['.dwg', '.dxf', '.dwf'],
      icon: 'FileCog',
      color: '#ef4444',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 100,
      allowedFor: ['المهندسون', 'المديرون'],
      usageCount: 456,
      createdBy: 'مهندس محمد',
      createdDate: '2024-01-05',
      lastModified: '2025-10-18'
    },
    {
      id: 'DT011',
      typeNumber: 'DT-011',
      name: 'مخططات Revit',
      category: 'هندسية',
      description: 'نماذج BIM بصيغة Revit',
      extensions: ['.rvt', '.rfa', '.rte'],
      icon: 'Building',
      color: '#0ea5e9',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 200,
      allowedFor: ['المهندسون', 'المديرون'],
      usageCount: 289,
      createdBy: 'مهندس عبدالله',
      createdDate: '2024-01-08',
      lastModified: '2025-10-12'
    },
    {
      id: 'DT012',
      typeNumber: 'DT-012',
      name: 'ملفات Photoshop',
      category: 'تصميمية',
      description: 'ملفات التصميم والمعالجة بصيغة Photoshop',
      extensions: ['.psd', '.psb'],
      icon: 'FileImage',
      color: '#ec4899',
      isActive: true,
      requiresApproval: false,
      maxFileSize: 150,
      allowedFor: ['المصممون', 'المهندسون'],
      usageCount: 198,
      createdBy: 'مصمم يوسف',
      createdDate: '2024-02-10',
      lastModified: '2025-09-25'
    },

    // مستندات الجهات الخارجية
    {
      id: 'DT020',
      typeNumber: 'DT-020',
      name: 'وثيقة من جهة خارجية',
      category: 'خارجية',
      description: 'المستندات الواردة من الجهات الخارجية',
      extensions: ['.pdf', '.docx', '.xlsx', '.jpg', '.png'],
      icon: 'Building',
      color: '#6366f1',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 50,
      allowedFor: ['الملاك', 'المديرون', 'الموظفون'],
      usageCount: 512,
      createdBy: 'نورة الحربي',
      createdDate: '2024-01-20',
      lastModified: '2025-10-16'
    },
    {
      id: 'DT021',
      typeNumber: 'DT-021',
      name: 'مستند من المالك',
      category: 'خارجية',
      description: 'المستندات والوثائق المقدمة من المالك',
      extensions: ['.pdf', '.docx', '.jpg', '.png'],
      icon: 'Users',
      color: '#14b8a6',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 40,
      allowedFor: ['المديرون', 'الموظفون المعتمدون'],
      usageCount: 387,
      createdBy: 'عمر الزهراني',
      createdDate: '2024-02-05',
      lastModified: '2025-10-14'
    },
    {
      id: 'DT022',
      typeNumber: 'DT-022',
      name: 'ملفات من مكتب هندسي آخر',
      category: 'خارجية',
      description: 'المخططات والملفات من مكاتب هندسية أخرى',
      extensions: ['.dwg', '.pdf', '.rvt', '.zip'],
      icon: 'HardHat',
      color: '#f97316',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 150,
      allowedFor: ['المهندسون', 'المديرون'],
      usageCount: 234,
      createdBy: 'مهندس ماجد',
      createdDate: '2024-02-15',
      lastModified: '2025-10-08'
    },

    // المستندات الداخلية
    {
      id: 'DT030',
      typeNumber: 'DT-030',
      name: 'ملف من مكتبنا',
      category: 'داخلية',
      description: 'الملفات والوثائق المنتجة داخلياً',
      extensions: ['.pdf', '.docx', '.xlsx', '.dwg', '.rvt'],
      icon: 'Folder',
      color: '#22c55e',
      isActive: true,
      requiresApproval: false,
      maxFileSize: 100,
      allowedFor: ['الكل'],
      usageCount: 1245,
      createdBy: 'إدارة النظام',
      createdDate: '2024-01-01',
      lastModified: '2025-10-19'
    },

    // العقود والاتفاقيات
    {
      id: 'DT040',
      typeNumber: 'DT-040',
      name: 'اتفاق',
      category: 'عقود',
      description: 'الاتفاقيات بين الأطراف المختلفة',
      extensions: ['.pdf', '.docx'],
      icon: 'FileSignature',
      color: '#a855f7',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 30,
      allowedFor: ['الملاك', 'المديرون'],
      usageCount: 156,
      createdBy: 'قانوني - أحمد',
      createdDate: '2024-03-01',
      lastModified: '2025-10-11'
    },
    {
      id: 'DT041',
      typeNumber: 'DT-041',
      name: 'عرض سعر',
      category: 'عقود',
      description: 'عروض الأسعار المقدمة للعملاء',
      extensions: ['.pdf', '.docx', '.xlsx'],
      icon: 'FileSpreadsheet',
      color: '#eab308',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 25,
      allowedFor: ['المديرون', 'قسم المبيعات'],
      usageCount: 298,
      createdBy: 'مبيعات - خالد',
      createdDate: '2024-03-10',
      lastModified: '2025-10-17'
    },

    // المستندات الإدارية
    {
      id: 'DT050',
      typeNumber: 'DT-050',
      name: 'سيرة ذاتية',
      category: 'إدارية',
      description: 'السير الذاتية للموظفين والمتقدمين',
      extensions: ['.pdf', '.docx'],
      icon: 'FileBox',
      color: '#84cc16',
      isActive: true,
      requiresApproval: false,
      maxFileSize: 10,
      allowedFor: ['الموارد البشرية', 'المديرون'],
      usageCount: 432,
      createdBy: 'موارد بشرية',
      createdDate: '2024-04-01',
      lastModified: '2025-10-13'
    },
  ], []);

  // الحصول على التاب النشط
  const currentTab = TABS_CONFIG.find(tab => tab.id === activeTab);

  // عرض محتوى التابات
  const renderTabContent = () => {
    // فلترة الأنواع حسب التاب
    const filteredTypes = sampleDocumentTypes.filter(type => {
      if (activeTab === '942-11' || activeTab === '942-12') return true;
      
      const tab = currentTab;
      if (!tab || !tab.category) return false;
      
      return type.category === tab.category;
    });

    // التابات 942-01 إلى 942-10: قوائم أنواع المستندات
    if (activeTab !== '942-11' && activeTab !== '942-12') {
      return (
        <div className="space-y-2">
          {/* رأس الشاشة */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                {currentTab?.title}
              </h3>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                إدارة أنواع {currentTab?.category}
              </p>
            </div>
            <div className="flex gap-1">
              <Button 
                className="dense-button bg-[#10b981] hover:bg-[#059669] text-white"
                onClick={() => setShowCreateDialog(true)}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Plus className="h-3.5 w-3.5 ml-2" />
                نوع جديد
              </Button>
              <Button 
                variant="outline" 
                className="dense-button button-rtl" 
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Download className="h-3.5 w-3.5 ml-2" />
                تصدير
              </Button>
            </div>
          </div>

          {/* إحصائيات سريعة */}
          <div className="stats-grid-6">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي الأنواع
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredTypes.length}
                    </p>
                  </div>
                  <Archive className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      نشطة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredTypes.filter(t => t.isActive).length}
                    </p>
                  </div>
                  <CheckCircle className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fee2e2', '--bg-to': '#fecaca', '--border-color': '#fca5a5' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      معطلة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredTypes.filter(t => !t.isActive).length}
                    </p>
                  </div>
                  <XCircle className="stats-icon-compact text-[#ef4444] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      تتطلب موافقة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredTypes.filter(t => t.requiresApproval).length}
                    </p>
                  </div>
                  <Shield className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي الاستخدام
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredTypes.reduce((sum, t) => sum + t.usageCount, 0)}
                    </p>
                  </div>
                  <BarChart3 className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#f3e8ff', '--bg-to': '#e9d5ff', '--border-color': '#d8b4fe' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      متوسط الاستخدام
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredTypes.length > 0 ? Math.round(filteredTypes.reduce((sum, t) => sum + t.usageCount, 0) / filteredTypes.length) : 0}
                    </p>
                  </div>
                  <Star className="stats-icon-compact text-purple-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* البحث والتصفية */}
          <Card className="bg-blue-50 border-blue-200 card-rtl">
            <CardContent className="p-2">
              <div className="grid grid-cols-3 dense-grid form-rtl">
                <div className="col-span-2 form-group">
                  <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>بحث</Label>
                  <div className="flex gap-1">
                    <Input
                      placeholder="ابحث برقم أو اسم النوع..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="dense-input"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    />
                    <Button className="dense-button bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                      <Search className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="form-group">
                  <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="dense-select" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="الكل">الكل</SelectItem>
                      <SelectItem value="نشط">نشط</SelectItem>
                      <SelectItem value="معطل">معطل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* جدول أنواع المستندات */}
          <Card className="card-rtl">
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الامتدادات</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم الأقصى</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>يتطلب موافقة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاستخدام</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {type.typeNumber}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{type.name}</span>
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: type.color }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap gap-1 justify-end">
                          {type.extensions.slice(0, 3).map((ext, i) => (
                            <Badge key={i} className="bg-gray-100 text-gray-700 text-[10px]">
                              {ext}
                            </Badge>
                          ))}
                          {type.extensions.length > 3 && (
                            <Badge className="bg-gray-200 text-gray-700 text-[10px]">
                              +{type.extensions.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {type.maxFileSize} MB
                      </TableCell>
                      <TableCell className="text-right">
                        {type.requiresApproval ? (
                          <Badge className="bg-yellow-100 text-yellow-700">نعم</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-700">لا</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={type.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {type.isActive ? 'نشط' : 'معطل'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {type.usageCount}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="dense-button"
                            onClick={() => {
                              setSelectedType(type);
                              setShowEditDialog(true);
                            }}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="dense-button">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="dense-button">
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="dense-button">
                            <Trash2 className="h-3.5 w-3.5" />
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
    }

    // تاب 942-11: سجل أنواع المستندات
    if (activeTab === '942-11') {
      // تجميع حسب الفئة
      const groupedByCategory = sampleDocumentTypes.reduce((acc, type) => {
        if (!acc[type.category]) {
          acc[type.category] = [];
        }
        acc[type.category].push(type);
        return acc;
      }, {} as Record<string, DocumentType[]>);

      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                سجل أنواع المستندات
              </h3>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                سجل شامل لجميع أنواع المستندات في النظام
              </p>
            </div>
            <Button variant="outline" className="dense-button button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <RefreshCw className="h-3.5 w-3.5 ml-2" />
              تحديث
            </Button>
          </div>

          {/* إحصائيات شاملة */}
          <div className="stats-grid-8">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      الإجمالي
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleDocumentTypes.length}
                    </p>
                  </div>
                  <Archive className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            {Object.entries(groupedByCategory).slice(0, 7).map(([category, types]) => {
              const colors = {
                'رسمية': { bg: '#d1fae5', border: '#6ee7b7', icon: '#10b981' },
                'هندسية': { bg: '#fee2e2', border: '#fca5a5', icon: '#ef4444' },
                'خارجية': { bg: '#e0e7ff', border: '#a5b4fc', icon: '#6366f1' },
                'داخلية': { bg: '#dcfce7', border: '#86efac', icon: '#22c55e' },
                'عقود': { bg: '#f3e8ff', border: '#d8b4fe', icon: '#a855f7' },
                'تصميمية': { bg: '#fce7f3', border: '#f9a8d4', icon: '#ec4899' },
                'إدارية': { bg: '#ecfccb', border: '#bef264', icon: '#84cc16' },
              };
              const color = colors[category as keyof typeof colors] || { bg: '#f3f4f6', border: '#d1d5db', icon: '#6b7280' };

              return (
                <Card 
                  key={category} 
                  className="stats-card-compact card-rtl" 
                  style={{ 
                    '--bg-from': color.bg, 
                    '--bg-to': color.bg, 
                    '--border-color': color.border 
                  } as React.CSSProperties}
                >
                  <CardContent className="dense-card-content-sm">
                    <div className="stats-content-compact">
                      <div className="stats-text-compact">
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          {category}
                        </p>
                        <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                          {types.length}
                        </p>
                      </div>
                      <FileText className="stats-icon-compact opacity-80" style={{ color: color.icon }} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* جدول شامل */}
          <Card className="card-rtl">
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الامتدادات</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاستخدام</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleDocumentTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {type.typeNumber}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {type.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-gray-100 text-gray-700">
                          {type.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {type.extensions.slice(0, 2).join(', ')}
                        {type.extensions.length > 2 && '...'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={type.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {type.isActive ? 'نشط' : 'معطل'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {type.usageCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      );
    }

    // تاب 942-12: إعدادات التصنيف
    if (activeTab === '942-12') {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                إعدادات التصنيف
              </h3>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                إعدادات عامة لنظام تصنيف المستندات
              </p>
            </div>
            <Button 
              className="dense-button bg-[#10b981] hover:bg-[#059669] text-white"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Save className="h-3.5 w-3.5 ml-2" />
              حفظ التغييرات
            </Button>
          </div>

          <div className="grid grid-cols-2 dense-grid">
            {/* إعدادات التحميل */}
            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إعدادات التحميل
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        التحقق من نوع الملف
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        التأكد من تطابق امتداد الملف مع النوع
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        التحقق من حجم الملف
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        التأكد من عدم تجاوز الحجم الأقصى
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        فحص الفيروسات
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        فحص الملفات عند التحميل
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* إعدادات التصنيف */}
            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إعدادات التصنيف التلقائي
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        التصنيف حسب الامتداد
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        تصنيف تلقائي بناءً على امتداد الملف
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        التصنيف حسب المصدر
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        تصنيف بناءً على مصدر الملف
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        اقتراح التصنيف الذكي
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        استخدام AI لاقتراح التصنيف المناسب
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 rtl-support" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      {/* رأس الشاشة */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
              أنواع المستندات
            </h1>
            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
              إدارة وتصنيف شاملة لأنواع المستندات في النظام
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#2563eb] text-white" style={{ fontFamily: 'Courier New, monospace' }}>
              SCR-942
            </Badge>
            <Badge className="bg-green-100 text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              12 تاب
            </Badge>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex gap-3" style={{ direction: 'rtl' }}>
        {/* السايد بار الرأسي للتابات */}
        <Card className="w-56 card-rtl" style={{ height: 'fit-content' }}>
          <CardContent className="p-2">
            <div className="space-y-1">
              {TABS_CONFIG.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-right p-2 rounded transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#2563eb] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {React.createElement(tab.icon, { className: 'h-4 w-4' })}
                      <span className="text-xs">{tab.title}</span>
                    </div>
                    <span 
                      className="text-[10px] px-1 rounded"
                      style={{ 
                        fontFamily: 'Courier New, monospace',
                        backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'rgba(37,99,235,0.1)'
                      }}
                    >
                      {tab.number}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* منطقة المحتوى */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة إنشاء نوع جديد */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl dialog-rtl" style={{ direction: 'rtl' }}>
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إضافة نوع مستند جديد
            </DialogTitle>
            <DialogDescription className="dialog-description" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              أدخل بيانات نوع المستند الجديد
            </DialogDescription>
          </DialogHeader>

          <div className="form-rtl form-dense space-y-3">
            <div className="grid grid-cols-2 dense-grid">
              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  اسم النوع *
                </Label>
                <Input
                  className="dense-input"
                  placeholder="مثال: وثيقة رسمية"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الفئة *
                </Label>
                <Select>
                  <SelectTrigger className="dense-select" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="رسمية">رسمية</SelectItem>
                    <SelectItem value="هندسية">هندسية</SelectItem>
                    <SelectItem value="خارجية">خارجية</SelectItem>
                    <SelectItem value="داخلية">داخلية</SelectItem>
                    <SelectItem value="عقود">عقود</SelectItem>
                    <SelectItem value="مالية">مالية</SelectItem>
                    <SelectItem value="فنية">فنية</SelectItem>
                    <SelectItem value="تصميمية">تصميمية</SelectItem>
                    <SelectItem value="إدارية">إدارية</SelectItem>
                    <SelectItem value="قانونية">قانونية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الحجم الأقصى (MB) *
                </Label>
                <Input
                  type="number"
                  className="dense-input"
                  placeholder="50"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  اللون *
                </Label>
                <Input
                  type="color"
                  className="dense-input h-10"
                  defaultValue="#2563eb"
                />
              </div>
            </div>

            <div className="form-group">
              <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الوصف
              </Label>
              <Textarea
                className="dense-input"
                rows={3}
                placeholder="وصف مختصر لنوع المستند..."
                style={{ fontFamily: 'Tajawal, sans-serif', height: 'auto', minHeight: '70px' }}
              />
            </div>

            <div className="form-group">
              <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الامتدادات المسموحة *
              </Label>
              <Input
                className="dense-input"
                placeholder=".pdf, .docx, .xlsx"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>

            <div className="grid grid-cols-2 dense-grid">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Switch />
                <Label style={{ fontFamily: 'Tajawal, sans-serif', cursor: 'pointer' }}>
                  يتطلب موافقة
                </Label>
              </div>

              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Switch defaultChecked />
                <Label style={{ fontFamily: 'Tajawal, sans-serif', cursor: 'pointer' }}>
                  نشط
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2" style={{ direction: 'rtl' }}>
            <Button 
              className="dense-button bg-[#10b981] hover:bg-[#059669] text-white"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Save className="h-3.5 w-3.5 ml-2" />
              حفظ
            </Button>
            <Button 
              variant="outline" 
              className="dense-button"
              onClick={() => setShowCreateDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تفاصيل النوع */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl dialog-rtl" style={{ direction: 'rtl' }}>
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تفاصيل نوع المستند
            </DialogTitle>
            <DialogDescription className="dialog-description" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {selectedType?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedType && (
            <div className="space-y-3">
              <Card className="bg-blue-50 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الرقم
                      </p>
                      <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                        {selectedType.typeNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الفئة
                      </p>
                      <Badge className="bg-gray-100 text-gray-700">
                        {selectedType.category}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        عدد الاستخدام
                      </p>
                      <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                        {selectedType.usageCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Card className="card-rtl">
                  <CardHeader className="card-header-dense">
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الامتدادات المدعومة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="dense-card-content">
                    <div className="flex flex-wrap gap-2">
                      {selectedType.extensions.map((ext, i) => (
                        <Badge key={i} className="bg-blue-100 text-blue-700">
                          {ext}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-rtl">
                  <CardHeader className="card-header-dense">
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الصلاحيات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="dense-card-content">
                    <div className="space-y-2">
                      {selectedType.allowedFor.map((role, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="card-rtl">
                <CardHeader className="card-header-dense">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الوصف
                  </CardTitle>
                </CardHeader>
                <CardContent className="dense-card-content">
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4b5563' }}>
                    {selectedType.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="flex gap-2" style={{ direction: 'rtl' }}>
            <Button 
              className="dense-button bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Edit className="h-3.5 w-3.5 ml-2" />
              تحرير
            </Button>
            <Button 
              variant="outline" 
              className="dense-button"
              onClick={() => setShowEditDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentTypesScreen;
