/**
 * الشاشة 960 - مصمم القوالب والنماذج المتقدم
 * =============================================
 * 
 * شاشة متقدمة لتصميم وإدارة القوالب والنماذج مع:
 * - محرر السحب والإفلات (Drag & Drop)
 * - دعم الفقرات، الصور، اللوجوهات، الشعارات، الأختام، التوقيعات
 * - مناطق محجوزة للتوثيق الرقمي
 * - ربط بالتصنيفات وأسماء المستندات
 * - نظام تكويد ثنائي (حسب المستند + النموذج)
 * - استيراد وتعديل النماذج الجاهزة
 * - نظام التجميد والصلاحيات
 * - تتبع عدد الاستخدامات
 * - نظام Versioning متقدم
 * - ربط مع العملات (مستقبلاً)
 * 
 * التابات:
 * 960-01: نظرة عامة والإحصائيات
 * 960-02: مكتبة القوالب
 * 960-03: مكتبة النماذج
 * 960-04: مصمم القوالب (Drag & Drop)
 * 960-05: مصمم النماذج (Drag & Drop)
 * 960-06: عناصر التصميم
 * 960-07: المتغيرات والحقول الديناميكية
 * 960-08: الأختام والتوقيعات
 * 960-09: التوثيق الرقمي
 * 960-10: الاستيراد والتصدير
 * 960-11: الإصدارات (Versioning)
 * 960-12: الصلاحيات والتجميد
 * 960-13: تقارير الاستخدام
 * 960-14: الربط بالشاشات الأخرى
 * 960-15: الإعدادات المتقدمة
 * 
 * @version 1.0
 * @date 2025-10-20
 */

import React, { useState, useRef, DragEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import {
  Layout, FileText, File, Layers, Edit, Trash2, Save, Copy, Eye,
  Plus, Download, Upload, Lock, Unlock, History, Settings, BarChart3,
  Image as ImageIcon, Type, Hash, AtSign, DollarSign, Calendar,
  CheckSquare, Square, Circle, Star, Triangle, Hexagon, Stamp,
  FileSignature, Shield, Link2, Tag, Folder, FolderTree, Activity,
  AlertCircle, CheckCircle, Clock, Users, Repeat, GitBranch,
  Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCw, Palette,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic,
  Underline, List, Grid3x3, Move, Trash, X, Search, Filter
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { DEFAULT_DOCUMENT_NAMES, type DocumentName } from './DocumentNames_Component_942';

// ===== واجهات البيانات =====

// عنصر التصميم
interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'logo' | 'stamp' | 'signature' | 'field' | 'barcode' | 'qrcode' | 'shape' | 'digital-auth';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  imageUrl?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  rotation?: number;
  opacity?: number;
  locked?: boolean;
  layer?: number;
  properties?: any;
}

// القالب/النموذج
interface Template {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'template' | 'form';
  category: string;
  documentNameId: string;
  documentNameCode: string;
  documentName: string;
  classificationId?: string;
  classificationName?: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  elements: DesignElement[];
  variables: Variable[];
  version: string;
  versionHistory: Version[];
  isActive: boolean;
  isFrozen: boolean;
  frozenBy?: string;
  frozenDate?: string;
  frozenReason?: string;
  usageCount: number;
  lastUsed?: string;
  createdBy: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
  permissions: string[];
  tags: string[];
}

// متغير ديناميكي
interface Variable {
  id: string;
  code: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'boolean' | 'list';
  defaultValue?: any;
  format?: string;
  required: boolean;
  validation?: string;
}

// إصدار
interface Version {
  id: string;
  version: string;
  description: string;
  changedBy: string;
  changedDate: string;
  changes: string[];
  snapshot: any;
}

const TemplatesFormsDesigner_Complete_960: React.FC = () => {
  const [activeTab, setActiveTab] = useState('960-01');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [designElements, setDesignElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<DesignElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElementType, setDraggedElementType] = useState<string | null>(null);
  const [canvasZoom, setCanvasZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  // تكوين التابات
  const TABS_CONFIG = [
    { id: '960-01', number: '960-01', title: 'نظرة عامة', icon: Activity },
    { id: '960-02', number: '960-02', title: 'مكتبة القوالب', icon: Layers },
    { id: '960-03', number: '960-03', title: 'مكتبة النماذج', icon: File },
    { id: '960-04', number: '960-04', title: 'مصمم القوالب', icon: Layout },
    { id: '960-05', number: '960-05', title: 'مصمم النماذج', icon: Edit },
    { id: '960-06', number: '960-06', title: 'عناصر التصميم', icon: Grid3x3 },
    { id: '960-07', number: '960-07', title: 'المتغيرات الديناميكية', icon: Hash },
    { id: '960-08', number: '960-08', title: 'الأختام والتوقيعات', icon: Stamp },
    { id: '960-09', number: '960-09', title: 'التوثيق الرقمي', icon: Shield },
    { id: '960-10', number: '960-10', title: 'الاستيراد والتصدير', icon: Upload },
    { id: '960-11', number: '960-11', title: 'الإصدارات', icon: GitBranch },
    { id: '960-12', number: '960-12', title: 'الصلاحيات والتجميد', icon: Lock },
    { id: '960-13', number: '960-13', title: 'تقارير الاستخدام', icon: BarChart3 },
    { id: '960-14', number: '960-14', title: 'الربط بالشاشات', icon: Link2 },
    { id: '960-15', number: '960-15', title: 'الإعدادات المتقدمة', icon: Settings },
  ];

  // بيانات تجريبية - القوالب
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'TPL-001',
      code: 'ID-COPY-TPL-001',
      name: 'قالب صورة الهوية الوطنية',
      description: 'قالب رسمي لتوثيق صورة الهوية الوطنية',
      type: 'template',
      category: 'وثائق شخصية',
      documentNameId: 'DN-001',
      documentNameCode: 'ID-COPY',
      documentName: 'صورة الهوية الوطنية',
      classificationId: 'CL-001',
      classificationName: 'وثائق رسمية',
      width: 210,
      height: 297,
      orientation: 'portrait',
      elements: [],
      variables: [
        { id: 'VAR-001', code: 'OWNER_NAME', name: 'اسم المالك', type: 'text', required: true },
        { id: 'VAR-002', code: 'ID_NUMBER', name: 'رقم الهوية', type: 'text', required: true },
        { id: 'VAR-003', code: 'ISSUE_DATE', name: 'تاريخ الإصدار', type: 'date', required: true }
      ],
      version: '1.0',
      versionHistory: [],
      isActive: true,
      isFrozen: false,
      usageCount: 456,
      lastUsed: '2025-10-19',
      createdBy: 'أحمد السالم',
      createdDate: '2024-01-15',
      permissions: ['view', 'edit', 'delete'],
      tags: ['هوية', 'وثائق', 'رسمي']
    },
    {
      id: 'TPL-002',
      code: 'ARCH-PLAN-TPL-001',
      name: 'قالب المخطط المعماري',
      description: 'قالب احترافي للمخططات المعمارية',
      type: 'template',
      category: 'مخططات هندسية',
      documentNameId: 'DN-005',
      documentNameCode: 'ARCH-PLAN',
      documentName: 'المخطط المعماري',
      classificationId: 'CL-002',
      classificationName: 'مخططات هندسية',
      width: 297,
      height: 420,
      orientation: 'portrait',
      elements: [],
      variables: [
        { id: 'VAR-004', code: 'PROJECT_NAME', name: 'اسم المشروع', type: 'text', required: true },
        { id: 'VAR-005', code: 'PLOT_NUMBER', name: 'رقم القطعة', type: 'text', required: true },
        { id: 'VAR-006', code: 'TOTAL_AREA', name: 'المساحة الإجمالية', type: 'number', required: true, format: 'm²' }
      ],
      version: '2.1',
      versionHistory: [
        {
          id: 'VER-001',
          version: '2.0',
          description: 'إضافة شعار المكتب',
          changedBy: 'محمد العتيبي',
          changedDate: '2025-05-10',
          changes: ['إضافة لوجو', 'تعديل الهيدر'],
          snapshot: {}
        }
      ],
      isActive: true,
      isFrozen: true,
      frozenBy: 'مدير النظام',
      frozenDate: '2025-10-01',
      frozenReason: 'قالب معتمد من الهيئة',
      usageCount: 892,
      lastUsed: '2025-10-20',
      createdBy: 'خالد الشمري',
      createdDate: '2024-02-20',
      modifiedBy: 'محمد العتيبي',
      modifiedDate: '2025-05-10',
      permissions: ['view'],
      tags: ['معماري', 'مخطط', 'A3']
    }
  ]);

  // بيانات تجريبية - النماذج
  const [forms, setForms] = useState<Template[]>([
    {
      id: 'FRM-001',
      code: 'BUILD-LIC-FRM-001',
      name: 'نموذج طلب ترخيص بناء',
      description: 'نموذج رسمي لطلب ترخيص البناء',
      type: 'form',
      category: 'طلبات',
      documentNameId: 'DN-013',
      documentNameCode: 'LICENSE',
      documentName: 'الترخيص',
      width: 210,
      height: 297,
      orientation: 'portrait',
      elements: [],
      variables: [
        { id: 'VAR-007', code: 'APPLICANT_NAME', name: 'اسم مقدم الطلب', type: 'text', required: true },
        { id: 'VAR-008', code: 'PROJECT_TYPE', name: 'نوع المشروع', type: 'list', required: true },
        { id: 'VAR-009', code: 'BUILDING_AREA', name: 'مساحة البناء', type: 'number', required: true }
      ],
      version: '1.5',
      versionHistory: [],
      isActive: true,
      isFrozen: false,
      usageCount: 1234,
      lastUsed: '2025-10-20',
      createdBy: 'فهد المطيري',
      createdDate: '2024-03-10',
      modifiedBy: 'سعد الدوسري',
      modifiedDate: '2025-08-15',
      permissions: ['view', 'edit', 'delete', 'freeze'],
      tags: ['ترخيص', 'بناء', 'طلب']
    }
  ]);

  // أنواع العناصر المتاحة
  const DESIGN_ELEMENTS = [
    {
      category: 'النصوص',
      items: [
        { type: 'text', icon: Type, label: 'نص ثابت', color: '#3b82f6' },
        { type: 'field', icon: Hash, label: 'حقل متغير', color: '#10b981' }
      ]
    },
    {
      category: 'الوسائط',
      items: [
        { type: 'image', icon: ImageIcon, label: 'صورة', color: '#f59e0b' },
        { type: 'logo', icon: Star, label: 'لوجو', color: '#8b5cf6' }
      ]
    },
    {
      category: 'التوثيق',
      items: [
        { type: 'stamp', icon: Stamp, label: 'ختم', color: '#ef4444' },
        { type: 'signature', icon: FileSignature, label: 'توقيع', color: '#6366f1' },
        { type: 'digital-auth', icon: Shield, label: 'توثيق رقمي', color: '#ec4899' }
      ]
    },
    {
      category: 'الأشكال',
      items: [
        { type: 'shape', icon: Square, label: 'مربع', color: '#6b7280', shape: 'rectangle' },
        { type: 'shape', icon: Circle, label: 'دائرة', color: '#6b7280', shape: 'circle' },
        { type: 'shape', icon: Triangle, label: 'مثلث', color: '#6b7280', shape: 'triangle' }
      ]
    },
    {
      category: 'الباركود',
      items: [
        { type: 'barcode', icon: Hash, label: 'باركود', color: '#14b8a6' },
        { type: 'qrcode', icon: Grid3x3, label: 'QR Code', color: '#14b8a6' }
      ]
    }
  ];

  // ===== وظائف السحب والإفلات =====

  const handleDragStart = (elementType: string) => {
    setDraggedElementType(elementType);
    setIsDragging(true);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (!draggedElementType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement: DesignElement = {
      id: `ELEM-${Date.now()}`,
      type: draggedElementType as any,
      x: x / (canvasZoom / 100),
      y: y / (canvasZoom / 100),
      width: 100,
      height: 40,
      content: draggedElementType === 'text' ? 'نص جديد' : undefined,
      fontSize: 14,
      fontFamily: 'Tajawal',
      textAlign: 'right',
      color: '#000000',
      backgroundColor: 'transparent',
      locked: false,
      layer: designElements.length,
      opacity: 1
    };

    setDesignElements([...designElements, newElement]);
    setSelectedElement(newElement);
    setIsDragging(false);
    setDraggedElementType(null);
  };

  // ===== مكونات التابات =====

  // تاب نظرة عامة
  const renderOverviewTab = () => (
    <div className="space-y-3">
      {/* إحصائيات */}
      <div className="grid grid-cols-6 gap-2">
        {[
          { label: 'إجمالي القوالب', value: templates.filter(t => t.type === 'template').length, icon: Layers, color: 'blue' },
          { label: 'إجمالي النماذج', value: forms.filter(t => t.type === 'form').length, icon: File, color: 'green' },
          { label: 'النشطة', value: [...templates, ...forms].filter(t => t.isActive).length, icon: CheckCircle, color: 'green' },
          { label: 'المجمدة', value: [...templates, ...forms].filter(t => t.isFrozen).length, icon: Lock, color: 'red' },
          { label: 'إجمالي الاستخدام', value: [...templates, ...forms].reduce((sum, t) => sum + t.usageCount, 0), icon: Activity, color: 'purple' },
          { label: 'الإصدارات', value: [...templates, ...forms].reduce((sum, t) => sum + t.versionHistory.length, 0), icon: GitBranch, color: 'orange' }
        ].map((stat, i) => (
          <Card key={i} className="card-element card-rtl">
            <CardContent className="p-2">
              <div className="flex items-center gap-2 mb-1">
                {React.createElement(stat.icon, { 
                  className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` 
                })}
                <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {stat.label}
                </p>
              </div>
              <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {typeof stat.value === 'number' ? stat.value.toLocaleString('ar-SA') : stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* القوالب الأكثر استخداماً */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            القوالب والنماذج الأكثر استخداماً
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  النوع
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الكود
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الاسم
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الفئة
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المستند
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الاستخدام
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  آخر استخدام
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الحالة
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...templates, ...forms]
                .sort((a, b) => b.usageCount - a.usageCount)
                .slice(0, 10)
                .map((item) => (
                  <TableRow key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <TableCell className="text-right">
                      <Badge variant={item.type === 'template' ? 'default' : 'secondary'} className="text-xs">
                        {item.type === 'template' ? 'قالب' : 'نموذج'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-mono text-xs">
                        {item.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {item.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {item.documentNameCode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {item.usageCount.toLocaleString('ar-SA')}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {item.lastUsed}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        {item.isFrozen && (
                          <Badge className="bg-red-500 text-white text-xs">مجمد</Badge>
                        )}
                        {item.isActive ? (
                          <Badge className="bg-green-500 text-white text-xs">نشط</Badge>
                        ) : (
                          <Badge className="bg-gray-400 text-white text-xs">غير نشط</Badge>
                        )}
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

  // تاب مكتبة القوالب
  const renderTemplatesLibraryTab = () => (
    <div className="space-y-3">
      {/* شريط البحث والإضافة */}
      <Card className="card-element card-rtl">
        <CardContent className="p-3">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-2">
              <InputWithCopy
                label="بحث في القوالب"
                id="search-templates"
                placeholder="ابحث بالاسم، الكود، الفئة..."
                copyable={false}
                clearable={true}
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                فلترة حسب الفئة
              </label>
              <select className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <option>جميع الفئات</option>
                <option>وثائق شخصية</option>
                <option>مخططات هندسية</option>
                <option>تقارير</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button className="w-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Plus className="h-4 w-4 ml-2" />
                إنشاء قالب جديد
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* شبكة القوالب */}
      <div className="grid grid-cols-3 gap-3">
        {templates.map((template) => (
          <Card key={template.id} className="card-element card-rtl hover:shadow-md transition-shadow">
            <CardHeader className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs font-mono">
                  {template.code}
                </Badge>
                <div className="flex gap-1">
                  {template.isFrozen && (
                    <Badge className="bg-red-500 text-white text-xs">
                      <Lock className="h-3 w-3" />
                    </Badge>
                  )}
                  {template.isActive ? (
                    <Badge className="bg-green-500 text-white text-xs">نشط</Badge>
                  ) : (
                    <Badge className="bg-gray-400 text-white text-xs">غير نشط</Badge>
                  )}
                </div>
              </div>
              <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px' }}>
                {template.name}
              </h3>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {/* معاينة مصغرة */}
              <div
                className="mb-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
                style={{ height: '120px' }}
              >
                <Layers className="h-12 w-12 text-gray-400" />
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    المستند:
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {template.documentNameCode}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الفئة:
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الاستخدام:
                  </span>
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {template.usageCount.toLocaleString('ar-SA')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الإصدار:
                  </span>
                  <Badge variant="outline" className="text-xs font-mono">
                    v{template.version}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <Button size="sm" variant="outline" className="text-xs">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // تاب مصمم القوالب (Drag & Drop)
  const renderDesignerTab = () => (
    <div className="space-y-3">
      {/* شريط الأدوات */}
      <Card className="card-element card-rtl">
        <CardContent className="p-2">
          <div className="flex items-center justify-between gap-2">
            {/* أدوات التحكم بالعرض */}
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setCanvasZoom(Math.max(25, canvasZoom - 25))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {canvasZoom}%
              </span>
              <Button size="sm" variant="outline" onClick={() => setCanvasZoom(Math.min(200, canvasZoom + 25))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button
                size="sm"
                variant={showGrid ? 'default' : 'outline'}
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid3x3 className="h-4 w-4 ml-1" />
                الشبكة
              </Button>
              
              <Button
                size="sm"
                variant={showRulers ? 'default' : 'outline'}
                onClick={() => setShowRulers(!showRulers)}
              >
                <AlignLeft className="h-4 w-4 ml-1" />
                المساطر
              </Button>
            </div>

            {/* أدوات الحفظ */}
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 ml-1" />
                تصدير
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="h-4 w-4 ml-1" />
                حفظ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-3">
        {/* لوحة العناصر */}
        <div className="col-span-3">
          <Card className="card-element card-rtl">
            <CardHeader className="p-3">
              <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                عناصر التصميم
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {DESIGN_ELEMENTS.map((category, idx) => (
                    <div key={idx}>
                      <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {category.category}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {category.items.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            draggable
                            onDragStart={() => handleDragStart(item.type)}
                            className="p-2 border-2 border-gray-200 rounded-lg cursor-move hover:border-blue-400 hover:bg-blue-50 transition-colors"
                          >
                            <div className="flex flex-col items-center gap-1">
                              {React.createElement(item.icon, {
                                className: 'h-6 w-6',
                                style: { color: item.color }
                              })}
                              <span className="text-xs text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {item.label}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {idx < DESIGN_ELEMENTS.length - 1 && <Separator className="my-3" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* منطقة الرسم (Canvas) */}
        <div className="col-span-6">
          <Card className="card-element card-rtl">
            <CardHeader className="p-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  منطقة التصميم
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  A4 - عمودي
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex items-center justify-center bg-gray-100 p-4 rounded-lg">
                <div
                  ref={canvasRef}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="bg-white shadow-lg relative"
                  style={{
                    width: `${210 * (canvasZoom / 100)}mm`,
                    height: `${297 * (canvasZoom / 100)}mm`,
                    transform: `scale(${canvasZoom / 100})`,
                    transformOrigin: 'top left',
                    backgroundImage: showGrid ? 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)' : 'none',
                    backgroundSize: '10px 10px'
                  }}
                >
                  {/* رسم العناصر */}
                  {designElements.map((element) => (
                    <div
                      key={element.id}
                      onClick={() => setSelectedElement(element)}
                      className={`absolute cursor-move border-2 ${
                        selectedElement?.id === element.id ? 'border-blue-500' : 'border-transparent'
                      } hover:border-blue-300`}
                      style={{
                        left: element.x,
                        top: element.y,
                        width: element.width,
                        height: element.height,
                        backgroundColor: element.backgroundColor,
                        color: element.color,
                        fontSize: element.fontSize,
                        fontFamily: element.fontFamily,
                        textAlign: element.textAlign as any,
                        opacity: element.opacity,
                        transform: `rotate(${element.rotation || 0}deg)`
                      }}
                    >
                      {element.type === 'text' && element.content}
                      {element.type === 'field' && `{${element.content}}`}
                      {element.type === 'stamp' && <Stamp className="h-full w-full text-red-500" />}
                      {element.type === 'signature' && <FileSignature className="h-full w-full text-blue-500" />}
                      {element.type === 'digital-auth' && <Shield className="h-full w-full text-purple-500" />}
                    </div>
                  ))}
                  
                  {/* رسالة عند عدم وجود عناصر */}
                  {designElements.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <Layout className="h-16 w-16 mx-auto mb-2 opacity-50" />
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          اسحب العناصر هنا لبدء التصميم
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* لوحة الخصائص */}
        <div className="col-span-3">
          <Card className="card-element card-rtl">
            <CardHeader className="p-3">
              <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                خصائص العنصر
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              {selectedElement ? (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        نوع العنصر
                      </label>
                      <Badge variant="outline" className="text-xs">
                        {selectedElement.type}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          X
                        </label>
                        <input
                          type="number"
                          value={selectedElement.x}
                          className="w-full px-2 py-1 text-xs border rounded"
                          style={{ fontFamily: 'Tajawal, sans-serif' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          Y
                        </label>
                        <input
                          type="number"
                          value={selectedElement.y}
                          className="w-full px-2 py-1 text-xs border rounded"
                          style={{ fontFamily: 'Tajawal, sans-serif' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          العرض
                        </label>
                        <input
                          type="number"
                          value={selectedElement.width}
                          className="w-full px-2 py-1 text-xs border rounded"
                          style={{ fontFamily: 'Tajawal, sans-serif' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الارتفاع
                        </label>
                        <input
                          type="number"
                          value={selectedElement.height}
                          className="w-full px-2 py-1 text-xs border rounded"
                          style={{ fontFamily: 'Tajawal, sans-serif' }}
                        />
                      </div>
                    </div>

                    {selectedElement.type === 'text' && (
                      <>
                        <Separator />
                        <div>
                          <label className="block text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            النص
                          </label>
                          <textarea
                            value={selectedElement.content}
                            className="w-full px-2 py-1 text-xs border rounded"
                            rows={3}
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            حجم الخط
                          </label>
                          <input
                            type="number"
                            value={selectedElement.fontSize}
                            className="w-full px-2 py-1 text-xs border rounded"
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            اللون
                          </label>
                          <input
                            type="color"
                            value={selectedElement.color}
                            className="w-full h-8 border rounded"
                          />
                        </div>
                      </>
                    )}

                    <Separator />

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        <Copy className="h-3 w-3 ml-1" />
                        نسخ
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs text-red-600">
                        <Trash className="h-3 w-3 ml-1" />
                        حذف
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    اختر عنصراً لعرض خصائصه
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // رند محتوى التاب
  const renderTabContent = () => {
    switch (activeTab) {
      case '960-01':
        return renderOverviewTab();
      case '960-02':
        return renderTemplatesLibraryTab();
      case '960-03':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>مكتبة النماذج (قيد التطوير)</div>;
      case '960-04':
      case '960-05':
        return renderDesignerTab();
      case '960-06':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>عناصر التصميم (قيد التطوير)</div>;
      case '960-07':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتغيرات الديناميكية (قيد التطوير)</div>;
      case '960-08':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأختام والتوقيعات (قيد التطوير)</div>;
      case '960-09':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوثيق الرقمي (قيد التطوير)</div>;
      case '960-10':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاستيراد والتصدير (قيد التطوير)</div>;
      case '960-11':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإصدارات (قيد التطوير)</div>;
      case '960-12':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصلاحيات والتجميد (قيد التطوير)</div>;
      case '960-13':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقارير الاستخدام (قيد التطوير)</div>;
      case '960-14':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الربط بالشاشات (قيد التطوير)</div>;
      case '960-15':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإعدادات المتقدمة (قيد التطوير)</div>;
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="flex" style={{ direction: 'rtl', gap: '1rem', minHeight: 'calc(100vh - 140px)' }}>
      {/* السايد بار الموحد للتابات */}
      <div
        style={{
          width: '200px',
          minWidth: '200px',
          height: 'calc(100vh - 140px)',
          position: 'sticky',
          top: '70px',
          right: 0,
          background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
          borderLeft: '2px solid #e2e8f0',
          borderRadius: '12px 0 0 12px',
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.05)'
        }}
      >
        <ScrollArea 
          className="h-full" 
          style={{
            '--scrollbar-width': '6px'
          } as React.CSSProperties}
        >
          <div className="p-2 space-y-0.5">
            {TABS_CONFIG.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full p-2 rounded-lg transition-all duration-200 text-right
                    flex items-center gap-2
                    ${isActive 
                      ? 'bg-gradient-to-l from-[#3b82f6] to-[#2563eb] text-white border-2 border-[#3b82f6] shadow-md' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-[#eff6ff] hover:shadow-sm'
                    }
                  `}
                  style={{
                    fontFamily: 'Tajawal, sans-serif',
                    fontSize: '12px'
                  }}
                >
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                  <div className="flex-1 text-right">
                    <div>{tab.title}</div>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] mt-0.5 ${isActive ? 'border-white/50 text-white' : ''}`}
                      style={{ fontFamily: 'monospace' }}
                    >
                      {tab.number}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* محتوى الشاشة */}
      <div className="flex-1">
        <div className="space-y-3">
          {/* العنوان */}
          <Card className="card-element card-rtl">
            <CardHeader className="p-3">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Layout className="h-5 w-5 inline ml-2" />
                مصمم القوالب والنماذج المتقدم
              </CardTitle>
            </CardHeader>
          </Card>

          {/* محتوى التاب */}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TemplatesFormsDesigner_Complete_960;
