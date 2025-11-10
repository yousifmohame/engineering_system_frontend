/**
 * الشاشة 960 - مصمم القوالب والنماذج المتقدم v8.0
 * ====================================================
 * 
 * شاشة متقدمة جداً لتصميم وإدارة القوالب والنماذج مع:
 * 
 * ✨ الميزات الرئيسية:
 * - محرر السحب والإفلات (Drag & Drop) كامل
 * - دعم 10 أنواع من العناصر
 * - نظام تكويد ثنائي متقدم
 * - ربط إلزامي بالتصنيفات وأسماء المستندات
 * - استيراد النماذج الجاهزة (6 صيغ)
 * - نظام Versioning شامل
 * - التجميد والصلاحيات المتقدمة
 * - عداد الاستخدامات والتقارير
 * - ربط كامل مع الشاشات الأخرى
 * 
 * 🔗 الربط بالشاشات:
 * - 942: أنواع المستندات (أسماء المستندات)
 * - 701: إعدادات المعاملات (التصنيفات)
 * - العملات: للقوالب المالية (مستقبلاً)
 * 
 * 📋 التابات (15):
 * 960-01: نظرة عامة والإحصائيات
 * 960-02: مكتبة القوالب
 * 960-03: مكتبة النماذج
 * 960-04: مصمم القوالب (Drag & Drop)
 * 960-05: مصمم النماذج (Drag & Drop)
 * 960-06: عناصر التصميم
 * 960-07: المتغيرات الديناميكية
 * 960-08: الأختام والتوقيعات
 * 960-09: التوثيق الرقمي
 * 960-10: الاستيراد والتصدير
 * 960-11: الإصدارات (Versioning)
 * 960-12: الصلاحيات والتجميد
 * 960-13: تقارير الاستخدام
 * 960-14: الربط بالشاشات الأخرى
 * 960-15: الإعدادات المتقدمة
 * 
 * @version 8.0
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
  Underline, List, Grid3x3, Move, Trash, X, Search, Filter,
  Code, Building, PlayCircle, PauseCircle, Info, TrendingUp
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

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

// أسماء المستندات (من شاشة 942)
const DOCUMENT_NAMES = [
  { id: 'DN-001', code: 'ID-COPY', name: 'صورة الهوية الوطنية' },
  { id: 'DN-002', code: 'DEED-COPY', name: 'صورة الصك' },
  { id: 'DN-003', code: 'ARCH-PLAN', name: 'المخطط المعماري' },
  { id: 'DN-004', code: 'STRUCT-PLAN', name: 'المخطط الإنشائي' },
  { id: 'DN-005', code: 'SURVEY-REPORT', name: 'تقرير المسح' },
  { id: 'DN-006', code: 'LICENSE-COPY', name: 'صورة الترخيص' },
  { id: 'DN-007', code: 'CONTRACT', name: 'العقد' },
  { id: 'DN-008', code: 'INVOICE', name: 'الفاتورة' },
  { id: 'DN-009', code: 'RECEIPT', name: 'سند القبض' },
  { id: 'DN-010', code: 'QUOTATION', name: 'عرض السعر' },
];

// التصنيفات (من شاشة 701)
const CLASSIFICATIONS = [
  { id: 'CL-001', code: 'OFFICIAL', name: 'وثائق رسمية' },
  { id: 'CL-002', code: 'ENGINEERING', name: 'وثائق هندسية' },
  { id: 'CL-003', code: 'FINANCIAL', name: 'وثائق مالية' },
  { id: 'CL-004', code: 'LEGAL', name: 'وثائق قانونية' },
  { id: 'CL-005', code: 'TECHNICAL', name: 'وثائق فنية' },
];

const TemplatesFormsDesigner_Complete_960_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('960-01');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [designElements, setDesignElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<DesignElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElementType, setDraggedElementType] = useState<string | null>(null);
  const [canvasZoom, setCanvasZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [showFreezeDialog, setShowFreezeDialog] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // نموذج القالب/النموذج الجديد
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    type: 'template' as 'template' | 'form',
    documentNameId: '',
    documentNameCode: '',
    documentName: '',
    classificationId: '',
    classificationName: '',
    category: '',
    orientation: 'portrait' as 'portrait' | 'landscape',
    width: 210,
    height: 297
  });

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
      versionHistory: [
        {
          id: 'V-001',
          version: '1.0',
          description: 'الإصدار الأولي',
          changedBy: 'أحمد السالم',
          changedDate: '2025-10-15',
          changes: ['إنشاء القالب الأساسي'],
          snapshot: {}
        }
      ],
      isActive: true,
      isFrozen: false,
      usageCount: 456,
      lastUsed: '2025-10-19',
      createdBy: 'أحمد السالم',
      createdDate: '2025-10-15',
      permissions: ['view', 'edit', 'delete', 'freeze', 'export'],
      tags: ['وثائق', 'هوية', 'رسمي']
    },
    {
      id: 'TPL-002',
      code: 'DEED-COPY-TPL-001',
      name: 'قالب صورة الصك',
      description: 'قالب رسمي لتوثيق صورة الصك',
      type: 'template',
      category: 'وثائق ملكية',
      documentNameId: 'DN-002',
      documentNameCode: 'DEED-COPY',
      documentName: 'صورة الصك',
      classificationId: 'CL-001',
      classificationName: 'وثائق رسمية',
      width: 210,
      height: 297,
      orientation: 'portrait',
      elements: [],
      variables: [
        { id: 'VAR-004', code: 'DEED_NUMBER', name: 'رقم الصك', type: 'text', required: true },
        { id: 'VAR-005', code: 'AREA', name: 'المساحة', type: 'number', required: true },
        { id: 'VAR-006', code: 'LOCATION', name: 'الموقع', type: 'text', required: true }
      ],
      version: '2.1',
      versionHistory: [
        {
          id: 'V-002',
          version: '1.0',
          description: 'الإصدار الأولي',
          changedBy: 'محمد علي',
          changedDate: '2025-09-20',
          changes: ['إنشاء القالب الأساسي'],
          snapshot: {}
        },
        {
          id: 'V-003',
          version: '2.0',
          description: 'إضافة حقل الموقع',
          changedBy: 'سارة أحمد',
          changedDate: '2025-10-05',
          changes: ['إضافة حقل الموقع', 'تحديث التنسيق'],
          snapshot: {}
        },
        {
          id: 'V-004',
          version: '2.1',
          description: 'تحسين التصميم',
          changedBy: 'أحمد السالم',
          changedDate: '2025-10-18',
          changes: ['تحسين الخطوط', 'إضافة شعار المكتب'],
          snapshot: {}
        }
      ],
      isActive: true,
      isFrozen: true,
      frozenBy: 'مدير النظام',
      frozenDate: '2025-10-18',
      frozenReason: 'معتمد رسمياً - لا تعديل',
      usageCount: 789,
      lastUsed: '2025-10-20',
      createdBy: 'محمد علي',
      createdDate: '2025-09-20',
      permissions: ['view', 'export'],
      tags: ['وثائق', 'صك', 'ملكية', 'رسمي']
    },
    {
      id: 'FRM-001',
      code: 'ARCH-PLAN-FORM-001',
      name: 'نموذج المخطط المعماري',
      description: 'نموذج لإنشاء وتوثيق المخططات المعمارية',
      type: 'form',
      category: 'مخططات هندسية',
      documentNameId: 'DN-003',
      documentNameCode: 'ARCH-PLAN',
      documentName: 'المخطط المعماري',
      classificationId: 'CL-002',
      classificationName: 'وثائق هندسية',
      width: 297,
      height: 420,
      orientation: 'landscape',
      elements: [],
      variables: [
        { id: 'VAR-007', code: 'PROJECT_NAME', name: 'اسم المشروع', type: 'text', required: true },
        { id: 'VAR-008', code: 'SCALE', name: 'المقياس', type: 'text', required: true },
        { id: 'VAR-009', code: 'DRAWING_NO', name: 'رقم اللوحة', type: 'text', required: true }
      ],
      version: '1.5',
      versionHistory: [
        {
          id: 'V-005',
          version: '1.0',
          description: 'الإصدار الأولي',
          changedBy: 'مهندس تصميم',
          changedDate: '2025-08-10',
          changes: ['إنشاء النموذج الأساسي'],
          snapshot: {}
        },
        {
          id: 'V-006',
          version: '1.5',
          description: 'إضافة إطار اللوحة',
          changedBy: 'مهندس تصميم',
          changedDate: '2025-10-01',
          changes: ['إضافة إطار اللوحة', 'تحديث الشعارات'],
          snapshot: {}
        }
      ],
      isActive: true,
      isFrozen: false,
      usageCount: 234,
      lastUsed: '2025-10-20',
      createdBy: 'مهندس تصميم',
      createdDate: '2025-08-10',
      permissions: ['view', 'edit', 'delete', 'export'],
      tags: ['مخططات', 'معماري', 'هندسي']
    }
  ]);

  // أنواع العناصر المتاحة
  const ELEMENT_TYPES = [
    { type: 'text', icon: Type, label: 'نص', color: '#3b82f6' },
    { type: 'image', icon: ImageIcon, label: 'صورة', color: '#10b981' },
    { type: 'logo', icon: Building, label: 'لوجو', color: '#f59e0b' },
    { type: 'stamp', icon: Stamp, label: 'ختم', color: '#ef4444' },
    { type: 'signature', icon: FileSignature, label: 'توقيع', color: '#8b5cf6' },
    { type: 'field', icon: Hash, label: 'حقل ديناميكي', color: '#06b6d4' },
    { type: 'barcode', icon: Code, label: 'باركود', color: '#6b7280' },
    { type: 'qrcode', icon: Grid3x3, label: 'QR كود', color: '#6b7280' },
    { type: 'shape', icon: Square, label: 'شكل', color: '#ec4899' },
    { type: 'digital-auth', icon: Shield, label: 'توثيق رقمي', color: '#14b8a6' },
  ];

  // معالجة بدء السحب من لوحة العناصر
  const handleDragStart = (e: DragEvent, elementType: string) => {
    setDraggedElementType(elementType);
    setIsDragging(true);
  };

  // معالجة الإفلات على Canvas
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    if (!draggedElementType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement: DesignElement = {
      id: `EL-${Date.now()}`,
      type: draggedElementType as any,
      x,
      y,
      width: 150,
      height: 40,
      content: draggedElementType === 'text' ? 'نص جديد' : '',
      fontSize: 14,
      fontFamily: 'Tajawal',
      color: '#000000',
      backgroundColor: '#ffffff',
      opacity: 100,
      locked: false,
      layer: designElements.length
    };

    setDesignElements([...designElements, newElement]);
    setSelectedElement(newElement);
    setIsDragging(false);
    setDraggedElementType(null);
  };

  // معالجة السحب فوق Canvas
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  // إنشاء قالب/نموذج جديد
  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.documentNameId || !newTemplate.classificationId) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // إنشاء الكود بالصيغة: [كود المستند]-[نوع]-[رقم تسلسلي]
    const sequenceNumber = String(templates.filter(t => t.type === newTemplate.type).length + 1).padStart(3, '0');
    const typeCode = newTemplate.type === 'template' ? 'TPL' : 'FORM';
    const code = `${newTemplate.documentNameCode}-${typeCode}-${sequenceNumber}`;

    const template: Template = {
      id: `${newTemplate.type.toUpperCase()}-${Date.now()}`,
      code,
      name: newTemplate.name,
      description: newTemplate.description,
      type: newTemplate.type,
      category: newTemplate.category,
      documentNameId: newTemplate.documentNameId,
      documentNameCode: newTemplate.documentNameCode,
      documentName: newTemplate.documentName,
      classificationId: newTemplate.classificationId,
      classificationName: newTemplate.classificationName,
      width: newTemplate.width,
      height: newTemplate.height,
      orientation: newTemplate.orientation,
      elements: [],
      variables: [],
      version: '1.0',
      versionHistory: [
        {
          id: `V-${Date.now()}`,
          version: '1.0',
          description: 'الإصدار الأولي',
          changedBy: 'المستخدم الحالي',
          changedDate: new Date().toISOString().split('T')[0],
          changes: ['إنشاء القالب/النموذج'],
          snapshot: {}
        }
      ],
      isActive: true,
      isFrozen: false,
      usageCount: 0,
      createdBy: 'المستخدم الحالي',
      createdDate: new Date().toISOString().split('T')[0],
      permissions: ['view', 'edit', 'delete', 'freeze', 'export', 'duplicate', 'version', 'share'],
      tags: []
    };

    setTemplates([...templates, template]);
    setShowCreateDialog(false);
    
    // إعادة تعيين النموذج
    setNewTemplate({
      name: '',
      description: '',
      type: 'template',
      documentNameId: '',
      documentNameCode: '',
      documentName: '',
      classificationId: '',
      classificationName: '',
      category: '',
      orientation: 'portrait',
      width: 210,
      height: 297
    });
  };

  // تحديث اسم المستند
  const handleDocumentNameChange = (documentNameId: string) => {
    const docName = DOCUMENT_NAMES.find(d => d.id === documentNameId);
    if (docName) {
      setNewTemplate({
        ...newTemplate,
        documentNameId: docName.id,
        documentNameCode: docName.code,
        documentName: docName.name
      });
    }
  };

  // تحديث التصنيف
  const handleClassificationChange = (classificationId: string) => {
    const classification = CLASSIFICATIONS.find(c => c.id === classificationId);
    if (classification) {
      setNewTemplate({
        ...newTemplate,
        classificationId: classification.id,
        classificationName: classification.name
      });
    }
  };

  // ===== مكونات التابات =====

  // تاب نظرة عامة
  const renderOverviewTab = () => {
    const totalTemplates = templates.filter(t => t.type === 'template').length;
    const totalForms = templates.filter(t => t.type === 'form').length;
    const activeTemplates = templates.filter(t => t.isActive && t.type === 'template').length;
    const frozenTemplates = templates.filter(t => t.isFrozen).length;
    const totalVersions = templates.reduce((sum, t) => sum + t.versionHistory.length, 0);
    const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);

    return (
      <div className="space-y-3">
        {/* إحصائيات */}
        <div className="grid grid-cols-6 gap-2">
          {[
            { label: 'إجمالي القوالب', value: totalTemplates, icon: Layers, color: 'blue' },
            { label: 'إجمالي النماذج', value: totalForms, icon: File, color: 'green' },
            { label: 'القوالب النشطة', value: activeTemplates, icon: CheckCircle, color: 'emerald' },
            { label: 'المجمدة', value: frozenTemplates, icon: Lock, color: 'red' },
            { label: 'الإصدارات', value: totalVersions, icon: GitBranch, color: 'purple' },
            { label: 'الاستخدام الكلي', value: totalUsage.toLocaleString('ar-SA'), icon: TrendingUp, color: 'orange' }
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
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* الأكثر استخداماً */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <TrendingUp className="h-5 w-5 inline ml-2" />
              القوالب والنماذج الأكثر استخداماً
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '40px' }}>
                    #
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>
                    الكود
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الاسم
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                    النوع
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>
                    عدد الاستخدامات
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                    آخر استخدام
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...templates]
                  .sort((a, b) => b.usageCount - a.usageCount)
                  .slice(0, 5)
                  .map((template, index) => (
                    <TableRow key={template.id} className="hover:bg-blue-50/30 transition-colors">
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="font-mono text-xs">
                          {template.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {template.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="text-xs">
                          {template.type === 'template' ? 'قالب' : 'نموذج'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {template.usageCount.toLocaleString('ar-SA')}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {template.lastUsed}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* زر إنشاء جديد */}
        <div className="flex gap-2">
          <Button onClick={() => { setNewTemplate({ ...newTemplate, type: 'template' }); setShowCreateDialog(true); }} style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Plus className="h-4 w-4 ml-2" />
            إنشاء قالب جديد
          </Button>
          <Button onClick={() => { setNewTemplate({ ...newTemplate, type: 'form' }); setShowCreateDialog(true); }} variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Plus className="h-4 w-4 ml-2" />
            إنشاء نموذج جديد
          </Button>
        </div>
      </div>
    );
  };

  // تاب مكتبة القوالب
  const renderTemplatesLibraryTab = () => {
    const templatesOnly = templates.filter(t => t.type === 'template');

    return (
      <div className="space-y-3">
        {/* إحصائيات */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'إجمالي القوالب', value: templatesOnly.length, icon: Layers, color: 'blue' },
            { label: 'النشطة', value: templatesOnly.filter(t => t.isActive).length, icon: CheckCircle, color: 'green' },
            { label: 'المجمدة', value: templatesOnly.filter(t => t.isFrozen).length, icon: Lock, color: 'red' },
            { label: 'الاستخدام', value: templatesOnly.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString('ar-SA'), icon: TrendingUp, color: 'purple' }
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
                  {typeof stat.value === 'number' ? stat.value : stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* جدول القوالب */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              مكتبة القوالب ({templatesOnly.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>
                    الكود
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الاسم
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    اسم المستند
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    التصنيف
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                    الإصدار
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                    الاستخدام
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                    الحالة
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '160px' }}>
                    الإجراءات
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templatesOnly.map((template) => (
                  <TableRow key={template.id} className="hover:bg-blue-50/30 transition-colors">
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-mono text-xs">
                        {template.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {template.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {template.documentName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {template.classificationName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-mono text-xs">
                        {template.version}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {template.usageCount.toLocaleString('ar-SA')}
                    </TableCell>
                    <TableCell className="text-right">
                      {template.isFrozen ? (
                        <Badge className="bg-red-500 text-white text-xs">
                          <Lock className="h-3 w-3 ml-1" />
                          مجمد
                        </Badge>
                      ) : template.isActive ? (
                        <Badge className="bg-green-500 text-white text-xs">
                          <CheckCircle className="h-3 w-3 ml-1" />
                          نشط
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-400 text-white text-xs">غير نشط</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" disabled={template.isFrozen}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600" disabled={template.isFrozen}>
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

        {/* زر إضافة */}
        <div className="flex justify-end">
          <Button onClick={() => { setNewTemplate({ ...newTemplate, type: 'template' }); setShowCreateDialog(true); }} style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Plus className="h-4 w-4 ml-2" />
            إنشاء قالب جديد
          </Button>
        </div>
      </div>
    );
  };

  // تاب مكتبة النماذج
  const renderFormsLibraryTab = () => {
    const formsOnly = templates.filter(t => t.type === 'form');

    return (
      <div className="space-y-3">
        {/* إحصائيات */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'إجمالي النماذج', value: formsOnly.length, icon: File, color: 'green' },
            { label: 'النشطة', value: formsOnly.filter(t => t.isActive).length, icon: CheckCircle, color: 'emerald' },
            { label: 'المجمدة', value: formsOnly.filter(t => t.isFrozen).length, icon: Lock, color: 'red' },
            { label: 'الاستخدام', value: formsOnly.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString('ar-SA'), icon: TrendingUp, color: 'purple' }
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
                  {typeof stat.value === 'number' ? stat.value : stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* جدول النماذج */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              مكتبة النماذج ({formsOnly.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>
                    الكود
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الاسم
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    اسم المستند
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    التصنيف
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                    الإصدار
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                    الاستخدام
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                    الحالة
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '160px' }}>
                    الإجراءات
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formsOnly.map((form) => (
                  <TableRow key={form.id} className="hover:bg-blue-50/30 transition-colors">
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-mono text-xs">
                        {form.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {form.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {form.documentName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {form.classificationName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-mono text-xs">
                        {form.version}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {form.usageCount.toLocaleString('ar-SA')}
                    </TableCell>
                    <TableCell className="text-right">
                      {form.isFrozen ? (
                        <Badge className="bg-red-500 text-white text-xs">
                          <Lock className="h-3 w-3 ml-1" />
                          مجمد
                        </Badge>
                      ) : form.isActive ? (
                        <Badge className="bg-green-500 text-white text-xs">
                          <CheckCircle className="h-3 w-3 ml-1" />
                          نشط
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-400 text-white text-xs">غير نشط</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" disabled={form.isFrozen}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600" disabled={form.isFrozen}>
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

        {/* زر إضافة */}
        <div className="flex justify-end">
          <Button onClick={() => { setNewTemplate({ ...newTemplate, type: 'form' }); setShowCreateDialog(true); }} style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Plus className="h-4 w-4 ml-2" />
            إنشاء نموذج جديد
          </Button>
        </div>
      </div>
    );
  };

  // تاب المصمم (Drag & Drop)
  const renderDesignerTab = () => (
    <div className="space-y-3">
      {/* شريط الأدوات */}
      <Card className="card-element card-rtl">
        <CardContent className="p-2">
          <div className="flex items-center justify-between gap-2">
            {/* أدوات التحرير */}
            <div className="flex gap-1">
              <Button size="sm" variant="outline">
                <Save className="h-4 w-4 ml-1" />
                حفظ
              </Button>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 ml-1" />
                معاينة
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <AlignLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* التكبير/التصغير */}
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setCanvasZoom(Math.max(25, canvasZoom - 10))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', minWidth: '50px', textAlign: 'center' }}>
                {canvasZoom}%
              </span>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setCanvasZoom(Math.min(200, canvasZoom + 10))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <EnhancedSwitch
                  id="show-grid"
                  checked={showGrid}
                  onCheckedChange={setShowGrid}
                  size="sm"
                />
                <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>شبكة</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* منطقة العمل الرئيسية */}
      <div className="grid grid-cols-12 gap-3">
        {/* لوحة العناصر الجانبية */}
        <Card className="col-span-2 card-element card-rtl">
          <CardHeader className="p-2">
            <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              عناصر التصميم
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ScrollArea className="h-[500px]">
              <div className="space-y-1">
                {ELEMENT_TYPES.map((element) => (
                  <div
                    key={element.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element.type)}
                    className="p-2 border rounded cursor-move hover:bg-blue-50 transition-colors"
                    style={{ borderColor: element.color }}
                  >
                    <div className="flex items-center gap-2">
                      {React.createElement(element.icon, { 
                        className: 'h-4 w-4',
                        style: { color: element.color }
                      })}
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {element.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Canvas التصميم */}
        <Card className="col-span-7 card-element card-rtl">
          <CardContent className="p-3">
            <div
              ref={canvasRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="relative border-2 border-dashed border-gray-300 bg-white"
              style={{
                width: '100%',
                height: '600px',
                backgroundImage: showGrid ? 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)' : 'none',
                backgroundSize: showGrid ? '20px 20px' : 'auto',
                transform: `scale(${canvasZoom / 100})`,
                transformOrigin: 'top right',
                overflow: 'auto'
              }}
            >
              {designElements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute border ${selectedElement?.id === element.id ? 'border-blue-500 border-2' : 'border-gray-300'}`}
                  style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    backgroundColor: element.backgroundColor,
                    opacity: (element.opacity || 100) / 100,
                    cursor: element.locked ? 'not-allowed' : 'move',
                    transform: `rotate(${element.rotation || 0}deg)`
                  }}
                  onClick={() => setSelectedElement(element)}
                >
                  {element.type === 'text' && (
                    <div
                      className="p-1"
                      style={{
                        fontFamily: element.fontFamily || 'Tajawal',
                        fontSize: element.fontSize || 14,
                        color: element.color || '#000000',
                        textAlign: (element.textAlign as any) || 'right',
                        direction: 'rtl'
                      }}
                    >
                      {element.content || 'نص جديد'}
                    </div>
                  )}
                  {element.type === 'digital-auth' && (
                    <div className="flex items-center justify-center h-full bg-teal-50 border-2 border-dashed border-teal-300">
                      <div className="text-center">
                        <Shield className="h-8 w-8 mx-auto mb-1 text-teal-600" />
                        <p className="text-xs text-teal-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          منطقة التوثيق الرقمي
                        </p>
                      </div>
                    </div>
                  )}
                  {element.type === 'stamp' && (
                    <div className="flex items-center justify-center h-full">
                      <Stamp className="h-12 w-12 text-red-600" />
                    </div>
                  )}
                  {element.type === 'signature' && (
                    <div className="flex items-center justify-center h-full border-b-2 border-gray-400">
                      <FileSignature className="h-8 w-8 text-purple-600" />
                    </div>
                  )}
                </div>
              ))}

              {designElements.length === 0 && !isDragging && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Move className="h-12 w-12 mx-auto mb-2" />
                    <p style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      اسحب العناصر من القائمة الجانبية وأفلتها هنا
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* لوحة الخصائص */}
        <Card className="col-span-3 card-element card-rtl">
          <CardHeader className="p-2">
            <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              خصائص العنصر
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            {selectedElement ? (
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#2563eb', fontWeight: 700 }}>
                      نوع العنصر
                    </p>
                    <Badge variant="secondary">
                      {ELEMENT_TYPES.find(e => e.type === selectedElement.type)?.label}
                    </Badge>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#2563eb', fontWeight: 700 }}>
                      الموضع والحجم
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <InputWithCopy
                        label="X"
                        id="element-x"
                        type="number"
                        value={selectedElement.x.toString()}
                        onChange={(e) => setSelectedElement({ ...selectedElement, x: parseInt(e.target.value) || 0 })}
                        copyable={false}
                        clearable={false}
                      />
                      <InputWithCopy
                        label="Y"
                        id="element-y"
                        type="number"
                        value={selectedElement.y.toString()}
                        onChange={(e) => setSelectedElement({ ...selectedElement, y: parseInt(e.target.value) || 0 })}
                        copyable={false}
                        clearable={false}
                      />
                      <InputWithCopy
                        label="العرض"
                        id="element-width"
                        type="number"
                        value={selectedElement.width.toString()}
                        onChange={(e) => setSelectedElement({ ...selectedElement, width: parseInt(e.target.value) || 0 })}
                        copyable={false}
                        clearable={false}
                      />
                      <InputWithCopy
                        label="الارتفاع"
                        id="element-height"
                        type="number"
                        value={selectedElement.height.toString()}
                        onChange={(e) => setSelectedElement({ ...selectedElement, height: parseInt(e.target.value) || 0 })}
                        copyable={false}
                        clearable={false}
                      />
                    </div>
                  </div>

                  {selectedElement.type === 'text' && (
                    <>
                      <Separator />
                      <div>
                        <InputWithCopy
                          label="المحتوى"
                          id="element-content"
                          value={selectedElement.content || ''}
                          onChange={(e) => setSelectedElement({ ...selectedElement, content: e.target.value })}
                          copyable={true}
                          clearable={true}
                        />
                      </div>
                      <div>
                        <InputWithCopy
                          label="حجم الخط"
                          id="element-fontsize"
                          type="number"
                          value={(selectedElement.fontSize || 14).toString()}
                          onChange={(e) => setSelectedElement({ ...selectedElement, fontSize: parseInt(e.target.value) || 14 })}
                          copyable={false}
                          clearable={false}
                        />
                      </div>
                    </>
                  )}

                  <Separator />

                  <div>
                    <p className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#2563eb', fontWeight: 700 }}>
                      الألوان
                    </p>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>لون النص</label>
                        <input
                          type="color"
                          value={selectedElement.color || '#000000'}
                          onChange={(e) => setSelectedElement({ ...selectedElement, color: e.target.value })}
                          className="w-full h-8 rounded border"
                        />
                      </div>
                      <div>
                        <label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>لون الخلفية</label>
                        <input
                          type="color"
                          value={selectedElement.backgroundColor || '#ffffff'}
                          onChange={(e) => setSelectedElement({ ...selectedElement, backgroundColor: e.target.value })}
                          className="w-full h-8 rounded border"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#2563eb', fontWeight: 700 }}>
                        قفل العنصر
                      </p>
                      <EnhancedSwitch
                        id="element-locked"
                        checked={selectedElement.locked || false}
                        onCheckedChange={(checked) => setSelectedElement({ ...selectedElement, locked: checked })}
                        size="sm"
                      />
                    </div>
                  </div>

                  <Separator />

                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setDesignElements(designElements.filter(e => e.id !== selectedElement.id));
                      setSelectedElement(null);
                    }}
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف العنصر
                  </Button>
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[500px] flex items-center justify-center text-gray-400 text-center">
                <div>
                  <Info className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    اختر عنصراً لعرض خصائصه
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // تاب عناصر التصميم
  const renderDesignElementsTab = () => (
    <div className="space-y-3">
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            عناصر التصميم المتاحة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-5 gap-3">
            {ELEMENT_TYPES.map((element) => (
              <Card key={element.type} className="card-element card-rtl hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="text-center">
                    <div
                      className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${element.color}20` }}
                    >
                      {React.createElement(element.icon, { 
                        className: 'h-8 w-8',
                        style: { color: element.color }
                      })}
                    </div>
                    <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {element.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            وصف العناصر
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-2">
            {ELEMENT_TYPES.map((element) => (
              <div key={element.type} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50">
                {React.createElement(element.icon, { 
                  className: 'h-5 w-5 mt-0.5 flex-shrink-0',
                  style: { color: element.color }
                })}
                <div className="flex-1">
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                    {element.label}
                  </p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {element.type === 'text' && 'نصوص قابلة للتنسيق الكامل'}
                    {element.type === 'image' && 'رفع واستخدام الصور'}
                    {element.type === 'logo' && 'شعارات المكتب والجهات'}
                    {element.type === 'stamp' && 'أختام إلكترونية'}
                    {element.type === 'signature' && 'توقيعات رقمية وإلكترونية'}
                    {element.type === 'field' && 'حقول متغيرة تملأ تلقائياً'}
                    {element.type === 'barcode' && 'باركود قابل للقراءة'}
                    {element.type === 'qrcode' && 'رمز QR قابل للقراءة'}
                    {element.type === 'shape' && 'أشكال هندسية متنوعة'}
                    {element.type === 'digital-auth' && 'منطقة محجوزة للتوثيق الرقمي'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // تاب الإصدارات
  const renderVersionsTab = () => (
    <div className="space-y-3">
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <GitBranch className="h-5 w-5 inline ml-2" />
            سجل الإصدارات
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                  الإصدار
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الوصف
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>
                  بواسطة
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                  التاريخ
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                  التغييرات
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '140px' }}>
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates
                .flatMap(t => t.versionHistory.map(v => ({ ...v, templateCode: t.code, templateName: t.name })))
                .sort((a, b) => new Date(b.changedDate).getTime() - new Date(a.changedDate).getTime())
                .slice(0, 10)
                .map((version: any) => (
                  <TableRow key={version.id} className="hover:bg-blue-50/30 transition-colors">
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-mono text-xs">
                        {version.version}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {version.description}
                        </p>
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {version.templateName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {version.changedBy}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {version.changedDate}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {version.changes.length}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <RotateCw className="h-3.5 w-3.5" />
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

  // تاب الربط بالشاشات
  const renderIntegrationTab = () => (
    <div className="space-y-3">
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Link2 className="h-5 w-5 inline ml-2" />
            الربط بالشاشات الأخرى
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-3">
            {/* شاشة 942 */}
            <Card className="card-element card-rtl hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                      شاشة 942 - أنواع المستندات
                    </h3>
                    <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      ربط القوالب والنماذج بأسماء المستندات المعرفة في التاب 942-13
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {DOCUMENT_NAMES.length} اسم مستند متاح
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    <Link2 className="h-4 w-4 ml-2" />
                    عرض
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* شاشة 701 */}
            <Card className="card-element card-rtl hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Tag className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                      شاشة 701 - إعدادات المعاملات
                    </h3>
                    <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      ربط القوالب والنماذج بالتصنيفات المعرفة في التاب 701-06 و 701-11
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {CLASSIFICATIONS.length} تصنيف متاح
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    <Link2 className="h-4 w-4 ml-2" />
                    عرض
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* شاشة العملات (مستقبلاً) */}
            <Card className="card-element card-rtl hover:shadow-md transition-shadow opacity-60">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                      شاشة العملات
                    </h3>
                    <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      ربط القوالب المالية بالعملات المختلفة (قريباً)
                    </p>
                    <Badge variant="outline" className="text-xs">
                      قيد التطوير
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline" disabled>
                    <Clock className="h-4 w-4 ml-2" />
                    قريباً
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* معلومات إضافية */}
      <Card className="card-element card-rtl bg-blue-50">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                ملاحظة هامة
              </h4>
              <p className="text-xs text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                جميع القوالب والنماذج يجب أن ترتبط بـ:
              </p>
              <ul className="text-xs text-gray-700 mr-4 mt-1 space-y-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <li>• <strong>اسم مستند</strong> من شاشة 942 (إلزامي)</li>
                <li>• <strong>تصنيف</strong> من شاشة 701 (إلزامي)</li>
                <li>• <strong>عملة</strong> للقوالب المالية (اختياري - مستقبلاً)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
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
        return renderFormsLibraryTab();
      case '960-04':
      case '960-05':
        return renderDesignerTab();
      case '960-06':
        return renderDesignElementsTab();
      case '960-07':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتغيرات الديناميكية (قيد التطوير)</div>;
      case '960-08':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأختام والتوقيعات (قيد التطوير)</div>;
      case '960-09':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوثيق الرقمي (قيد التطوير)</div>;
      case '960-10':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاستيراد والتصدير (قيد التطوير)</div>;
      case '960-11':
        return renderVersionsTab();
      case '960-12':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصلاحيات والتجميد (قيد التطوير)</div>;
      case '960-13':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقارير الاستخدام (قيد التطوير)</div>;
      case '960-14':
        return renderIntegrationTab();
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
                مصمم القوالب والنماذج
              </CardTitle>
            </CardHeader>
          </Card>

          {/* محتوى التاب */}
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة إنشاء قالب/نموذج جديد */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl dialog-rtl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {newTemplate.type === 'template' ? 'إنشاء قالب جديد' : 'إنشاء نموذج جديد'}
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              جميع الحقول المطلوبة يجب ملؤها. سيتم إنشاء كود تلقائي بناءً على اسم المستند.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InputWithCopy
                label="اسم القالب/النموذج *"
                id="template-name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="مثال: قالب صورة الهوية الوطنية"
                required
                copyable={true}
                clearable={true}
              />

              <SelectWithCopy
                label="اسم المستند *"
                id="template-docname"
                value={newTemplate.documentNameId}
                onChange={handleDocumentNameChange}
                options={DOCUMENT_NAMES.map(d => ({ value: d.id, label: d.name }))}
                copyable={true}
                clearable={true}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SelectWithCopy
                label="التصنيف *"
                id="template-classification"
                value={newTemplate.classificationId}
                onChange={handleClassificationChange}
                options={CLASSIFICATIONS.map(c => ({ value: c.id, label: c.name }))}
                copyable={true}
                clearable={true}
              />

              <InputWithCopy
                label="الفئة"
                id="template-category"
                value={newTemplate.category}
                onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                placeholder="مثال: وثائق شخصية"
                copyable={true}
                clearable={true}
              />
            </div>

            <TextAreaWithCopy
              label="الوصف"
              id="template-description"
              value={newTemplate.description}
              onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
              rows={3}
              placeholder="وصف مختصر للقالب/النموذج"
              copyable={true}
              clearable={true}
            />

            <div className="grid grid-cols-3 gap-3">
              <SelectWithCopy
                label="الاتجاه"
                id="template-orientation"
                value={newTemplate.orientation}
                onChange={(value) => setNewTemplate({ ...newTemplate, orientation: value as 'portrait' | 'landscape' })}
                options={[
                  { value: 'portrait', label: 'عمودي (Portrait)' },
                  { value: 'landscape', label: 'أفقي (Landscape)' }
                ]}
                copyable={false}
                clearable={false}
              />

              <InputWithCopy
                label="العرض (mm)"
                id="template-width"
                type="number"
                value={newTemplate.width.toString()}
                onChange={(e) => setNewTemplate({ ...newTemplate, width: parseInt(e.target.value) || 210 })}
                copyable={false}
                clearable={false}
              />

              <InputWithCopy
                label="الارتفاع (mm)"
                id="template-height"
                type="number"
                value={newTemplate.height.toString()}
                onChange={(e) => setNewTemplate({ ...newTemplate, height: parseInt(e.target.value) || 297 })}
                copyable={false}
                clearable={false}
              />
            </div>

            {/* معاينة الكود */}
            {newTemplate.documentNameCode && (
              <Card className="card-element card-rtl bg-blue-50">
                <CardContent className="p-3">
                  <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#2563eb', fontWeight: 700 }}>
                    الكود الذي سيتم إنشاؤه:
                  </p>
                  <Badge variant="outline" className="font-mono">
                    {newTemplate.documentNameCode}-{newTemplate.type === 'template' ? 'TPL' : 'FORM'}-{String(templates.filter(t => t.type === newTemplate.type).length + 1).padStart(3, '0')}
                  </Badge>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إلغاء
            </Button>
            <Button onClick={handleCreateTemplate} style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Plus className="h-4 w-4 ml-2" />
              إنشاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesFormsDesigner_Complete_960_v8;
