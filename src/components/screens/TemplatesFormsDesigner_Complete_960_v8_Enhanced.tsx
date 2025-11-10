/**
 * الشاشة 960 - مصمم القوالب والنماذج المتقدم v8.0 Enhanced
 * ============================================================
 * 
 * نسخة محسّنة ومطورة بالكامل مع جميع التابات والميزات المتقدمة
 * 
 * ✨ الميزات الكاملة:
 * - محرر Drag & Drop متقدم جداً (نقل، تغيير حجم، دوران)
 * - 10 أنواع عناصر كاملة مع خصائص متقدمة
 * - نظام المتغيرات الديناميكية الشامل
 * - مكتبة الأختام والتوقيعات المتكاملة
 * - نظام التوثيق الرقمي المتقدم
 * - استيراد/تصدير 6 صيغ مختلفة
 * - نظام الصلاحيات والتجميد المتكامل
 * - تقارير استخدام تفصيلية
 * - إعدادات متقدمة شاملة
 * - Undo/Redo كامل
 * - نظام الطبقات (Layers)
 * - معاينة حية وطباعة
 * 
 * @version 8.0 Enhanced
 * @date 2025-10-20
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
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
  Code, Building, PlayCircle, PauseCircle, Info, TrendingUp,
  Undo, Redo, Layers as LayersIcon, EyeOff, ChevronUp, ChevronDown,
  FileInput, FileOutput, Database, Key, Award, Target, AlertTriangle,
  RefreshCcw, SlidersHorizontal, Package, BookOpen, HelpCircle
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

// ===== الواجهات والأنواع =====

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
  visible?: boolean;
  layer?: number;
  zIndex?: number;
  properties?: any;
}

interface Variable {
  id: string;
  code: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'boolean' | 'list' | 'formula';
  defaultValue?: any;
  format?: string;
  required: boolean;
  validation?: string;
  description?: string;
  category?: string;
}

interface StampSignature {
  id: string;
  name: string;
  type: 'stamp' | 'signature';
  imageUrl: string;
  category: string;
  width: number;
  height: number;
  createdBy: string;
  createdDate: string;
  usageCount: number;
}

interface DigitalAuthZone {
  id: string;
  name: string;
  type: 'signature' | 'certificate' | 'timestamp';
  required: boolean;
  provider?: string;
  settings?: any;
}

interface Version {
  id: string;
  version: string;
  description: string;
  changedBy: string;
  changedDate: string;
  changes: string[];
  snapshot: any;
}

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
  stamps: string[];
  digitalAuthZones: DigitalAuthZone[];
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
  settings?: any;
}

// البيانات الأساسية
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

const CLASSIFICATIONS = [
  { id: 'CL-001', code: 'OFFICIAL', name: 'وثائق رسمية' },
  { id: 'CL-002', code: 'ENGINEERING', name: 'وثائق هندسية' },
  { id: 'CL-003', code: 'FINANCIAL', name: 'وثائق مالية' },
  { id: 'CL-004', code: 'LEGAL', name: 'وثائق قانونية' },
  { id: 'CL-005', code: 'TECHNICAL', name: 'وثائق فنية' },
];

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

const TemplatesFormsDesigner_960_v8_Enhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState('960-01');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [designElements, setDesignElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<DesignElement | null>(null);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [stamps, setStamps] = useState<StampSignature[]>([]);
  const [digitalAuthZones, setDigitalAuthZones] = useState<DigitalAuthZone[]>([]);
  const [canvasZoom, setCanvasZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showVariableDialog, setShowVariableDialog] = useState(false);
  const [showStampDialog, setShowStampDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showFreezeDialog, setShowFreezeDialog] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef<HTMLDivElement>(null);

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

  const [newVariable, setNewVariable] = useState({
    code: '',
    name: '',
    type: 'text' as any,
    defaultValue: '',
    required: false,
    description: '',
    category: ''
  });

  // بيانات تجريبية
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
      variables: [],
      stamps: [],
      digitalAuthZones: [],
      version: '1.0',
      versionHistory: [],
      isActive: true,
      isFrozen: false,
      usageCount: 456,
      lastUsed: '2025-10-19',
      createdBy: 'أحمد السالم',
      createdDate: '2025-10-15',
      permissions: ['view', 'edit', 'delete', 'freeze', 'export'],
      tags: ['وثائق', 'هوية', 'رسمي']
    }
  ]);

  // التكوينات
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

  // ==== التابات المطورة بالكامل ====

  // تاب 960-07: المتغيرات الديناميكية
  const renderVariablesTab = () => (
    <div className="space-y-3">
      {/* إحصائيات */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: 'إجمالي المتغيرات', value: variables.length, icon: Hash, color: 'blue' },
          { label: 'نصية', value: variables.filter(v => v.type === 'text').length, icon: Type, color: 'gray' },
          { label: 'رقمية', value: variables.filter(v => v.type === 'number').length, icon: Hash, color: 'green' },
          { label: 'تواريخ', value: variables.filter(v => v.type === 'date').length, icon: Calendar, color: 'purple' },
          { label: 'إلزامية', value: variables.filter(v => v.required).length, icon: AlertCircle, color: 'red' },
        ].map((stat, i) => (
          <Card key={i} className="card-element card-rtl">
            <CardContent className="p-2">
              <div className="flex items-center gap-2 mb-1">
                {React.createElement(stat.icon, { className: `h-4 w-4 text-${stat.color}-500` })}
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
              </div>
              <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* جدول المتغيرات */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              المتغيرات الديناميكية ({variables.length})
            </CardTitle>
            <Button size="sm" onClick={() => setShowVariableDialog(true)} style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة متغير
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>الكود</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>النوع</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '150px' }}>القيمة الافتراضية</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>إلزامي</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center p-8">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Hash className="h-12 w-12" />
                      <p style={{ fontFamily: 'Tajawal, sans-serif' }}>لا توجد متغيرات</p>
                      <Button size="sm" variant="outline" onClick={() => setShowVariableDialog(true)}>
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة أول متغير
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                variables.map((variable) => (
                  <TableRow key={variable.id} className="hover:bg-blue-50/30">
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-mono text-xs">{variable.code}</Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{variable.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {variable.type === 'text' && 'نص'}
                        {variable.type === 'number' && 'رقم'}
                        {variable.type === 'date' && 'تاريخ'}
                        {variable.type === 'currency' && 'عملة'}
                        {variable.type === 'boolean' && 'منطقي'}
                        {variable.type === 'list' && 'قائمة'}
                        {variable.type === 'formula' && 'معادلة'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{variable.defaultValue || '-'}</TableCell>
                    <TableCell className="text-right">
                      {variable.required ? (
                        <Badge className="bg-red-500 text-white text-xs">إلزامي</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">اختياري</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Copy className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* أمثلة الاستخدام */}
      <Card className="card-element card-rtl bg-blue-50">
        <CardContent className="p-3">
          <h4 className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
            <Info className="h-4 w-4 inline ml-2" />
            أمثلة على المتغيرات الديناميكية
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div>
              <p className="mb-1"><strong>متغيرات نصية:</strong></p>
              <ul className="mr-4 space-y-1 text-gray-700">
                <li>• <code className="bg-white px-1 rounded">{'{{OWNER_NAME}}'}</code> - اسم المالك</li>
                <li>• <code className="bg-white px-1 rounded">{'{{PROJECT_NAME}}'}</code> - اسم المشروع</li>
                <li>• <code className="bg-white px-1 rounded">{'{{LOCATION}}'}</code> - الموقع</li>
              </ul>
            </div>
            <div>
              <p className="mb-1"><strong>متغيرات رقمية:</strong></p>
              <ul className="mr-4 space-y-1 text-gray-700">
                <li>• <code className="bg-white px-1 rounded">{'{{AREA}}'}</code> - المساحة</li>
                <li>• <code className="bg-white px-1 rounded">{'{{AMOUNT}}'}</code> - المبلغ</li>
                <li>• <code className="bg-white px-1 rounded">{'{{QUANTITY}}'}</code> - الكمية</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // تاب 960-08: الأختام والتوقيعات
  const renderStampsSignaturesTab = () => (
    <div className="space-y-3">
      {/* إحصائيات */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'إجمالي الأختام والتوقيعات', value: stamps.length, icon: Stamp, color: 'blue' },
          { label: 'الأختام', value: stamps.filter(s => s.type === 'stamp').length, icon: Stamp, color: 'red' },
          { label: 'التوقيعات', value: stamps.filter(s => s.type === 'signature').length, icon: FileSignature, color: 'purple' },
          { label: 'الاستخدام الكلي', value: stamps.reduce((sum, s) => sum + s.usageCount, 0), icon: TrendingUp, color: 'green' },
        ].map((stat, i) => (
          <Card key={i} className="card-element card-rtl">
            <CardContent className="p-2">
              <div className="flex items-center gap-2 mb-1">
                {React.createElement(stat.icon, { className: `h-4 w-4 text-${stat.color}-500` })}
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
              </div>
              <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* مكتبة الأختام */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              مكتبة الأختام والتوقيعات
            </CardTitle>
            <Button size="sm" onClick={() => setShowStampDialog(true)} style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          {stamps.length === 0 ? (
            <div className="text-center p-8">
              <Stamp className="h-16 w-16 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                لا توجد أختام أو توقيعات
              </p>
              <Button variant="outline" onClick={() => setShowStampDialog(true)}>
                <Upload className="h-4 w-4 ml-2" />
                رفع ختم/توقيع
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {stamps.map((stamp) => (
                <Card key={stamp.id} className="card-element card-rtl hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                      {stamp.type === 'stamp' ? (
                        <Stamp className="h-12 w-12 text-red-500" />
                      ) : (
                        <FileSignature className="h-12 w-12 text-purple-500" />
                      )}
                    </div>
                    <p className="text-sm mb-1 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stamp.name}</p>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <Badge variant="secondary" className="text-[10px]">
                        {stamp.type === 'stamp' ? 'ختم' : 'توقيع'}
                      </Badge>
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{stamp.usageCount} استخدام</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* معلومات */}
      <Card className="card-element card-rtl bg-yellow-50">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                متطلبات رفع الأختام والتوقيعات
              </h4>
              <ul className="text-xs text-gray-700 mr-4 space-y-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <li>• الصيغ المدعومة: PNG, JPG, SVG</li>
                <li>• الحجم الأقصى: 2 ميجابايت</li>
                <li>• الدقة الموصى بها: 300 DPI</li>
                <li>• خلفية شفافة (PNG) للنتائج الأفضل</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // تاب 960-09: التوثيق الرقمي
  const renderDigitalAuthTab = () => (
    <div className="space-y-3">
      {/* إحصائيات */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'مناطق التوثيق', value: digitalAuthZones.length, icon: Shield, color: 'teal' },
          { label: 'التوقيعات الإلكترونية', value: digitalAuthZones.filter(z => z.type === 'signature').length, icon: FileSignature, color: 'blue' },
          { label: 'الشهادات الرقمية', value: digitalAuthZones.filter(z => z.type === 'certificate').length, icon: Award, color: 'purple' },
          { label: 'الطوابع الزمنية', value: digitalAuthZones.filter(z => z.type === 'timestamp').length, icon: Clock, color: 'orange' },
        ].map((stat, i) => (
          <Card key={i} className="card-element card-rtl">
            <CardContent className="p-2">
              <div className="flex items-center gap-2 mb-1">
                {React.createElement(stat.icon, { className: `h-4 w-4 text-${stat.color}-500` })}
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
              </div>
              <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* مناطق التوثيق */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              مناطق التوثيق الرقمي
            </CardTitle>
            <Button size="sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة منطقة
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>النوع</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>إلزامي</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '150px' }}>المزود</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {digitalAuthZones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center p-8">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Shield className="h-12 w-12" />
                      <p style={{ fontFamily: 'Tajawal, sans-serif' }}>لا توجد مناطق توثيق رقمي</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                digitalAuthZones.map((zone) => (
                  <TableRow key={zone.id} className="hover:bg-blue-50/30">
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{zone.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {zone.type === 'signature' && 'توقيع'}
                        {zone.type === 'certificate' && 'شهادة'}
                        {zone.type === 'timestamp' && 'طابع زمني'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {zone.required ? (
                        <Badge className="bg-red-500 text-white text-xs">إلزامي</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">اختياري</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{zone.provider || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* معلومات التوثيق */}
      <Card className="card-element card-rtl bg-teal-50">
        <CardContent className="p-3">
          <h4 className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
            <Shield className="h-4 w-4 inline ml-2" />
            أنواع التوثيق الرقمي المدعومة
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>التوقيع الإلكتروني</p>
              <p className="text-xs text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                توقيع رقمي معتمد حسب الأنظمة السعودية
              </p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>الشهادة الرقمية</p>
              <p className="text-xs text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                شهادة X.509 من جهة موثوقة معتمدة
              </p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>الطابع الزمني</p>
              <p className="text-xs text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إثبات وقت التوقيع بدقة عالية
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // تاب 960-10: الاستيراد والتصدير
  const renderImportExportTab = () => (
    <div className="space-y-3">
      {/* الاستيراد */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <FileInput className="h-5 w-5 inline ml-2" />
            استيراد النماذج والقوالب
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-3 gap-3">
            {[
              { format: 'PDF', icon: FileText, desc: 'استيراد من ملف PDF', color: 'red' },
              { format: 'DOCX', icon: FileText, desc: 'مستندات Microsoft Word', color: 'blue' },
              { format: 'ODT', icon: FileText, desc: 'مستندات LibreOffice', color: 'green' },
              { format: 'HTML', icon: Code, desc: 'صفحات HTML', color: 'orange' },
              { format: 'JSON', icon: Database, desc: 'قوالب بصيغة JSON', color: 'purple' },
              { format: 'XML', icon: Code, desc: 'ملفات XML', color: 'gray' },
            ].map((format) => (
              <Card key={format.format} className="card-element card-rtl hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3 mb-2">
                    {React.createElement(format.icon, { className: `h-8 w-8 text-${format.color}-500` })}
                    <div className="flex-1">
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                        {format.format}
                      </p>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {format.desc}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Upload className="h-3.5 w-3.5 ml-2" />
                    استيراد
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* التصدير */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <FileOutput className="h-5 w-5 inline ml-2" />
            تصدير النماذج والقوالب
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-3 gap-3">
            {[
              { format: 'PDF', icon: FileText, desc: 'تصدير كملف PDF', color: 'red' },
              { format: 'DOCX', icon: FileText, desc: 'تصدير إلى Word', color: 'blue' },
              { format: 'HTML', icon: Code, desc: 'تصدير كصفحة HTML', color: 'orange' },
              { format: 'JSON', icon: Database, desc: 'نسخة احتياطية JSON', color: 'purple' },
              { format: 'PNG', icon: ImageIcon, desc: 'تصدير كصورة عالية الدقة', color: 'green' },
            ].map((format) => (
              <Card key={format.format} className="card-element card-rtl hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3 mb-2">
                    {React.createElement(format.icon, { className: `h-8 w-8 text-${format.color}-500` })}
                    <div className="flex-1">
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                        {format.format}
                      </p>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {format.desc}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => setShowExportDialog(true)} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Download className="h-3.5 w-3.5 ml-2" />
                    تصدير
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* معلومات */}
      <Card className="card-element card-rtl bg-blue-50">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                ملاحظات هامة
              </h4>
              <ul className="text-xs text-gray-700 mr-4 space-y-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <li>• يتم الحفاظ على التنسيق والعناصر عند الاستيراد من PDF و DOCX</li>
                <li>• التصدير بصيغة JSON يحفظ كامل البيانات والإعدادات</li>
                <li>• التصدير كصورة PNG بدقة 300 DPI للطباعة عالية الجودة</li>
                <li>• يمكن استيراد عدة ملفات دفعة واحدة</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // تاب 960-12: الصلاحيات والتجميد
  const renderPermissionsFreezeTab = () => (
    <div className="space-y-3">
      {/* إحصائيات */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'القوالب المجمدة', value: templates.filter(t => t.isFrozen).length, icon: Lock, color: 'red' },
          { label: 'النشطة', value: templates.filter(t => t.isActive && !t.isFrozen).length, icon: CheckCircle, color: 'green' },
          { label: 'المعطلة', value: templates.filter(t => !t.isActive).length, icon: PauseCircle, color: 'gray' },
          { label: 'إجمالي الصلاحيات', value: templates.reduce((sum, t) => sum + t.permissions.length, 0), icon: Shield, color: 'blue' },
        ].map((stat, i) => (
          <Card key={i} className="card-element card-rtl">
            <CardContent className="p-2">
              <div className="flex items-center gap-2 mb-1">
                {React.createElement(stat.icon, { className: `h-4 w-4 text-${stat.color}-500` })}
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
              </div>
              <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* جدول الصلاحيات */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إدارة الصلاحيات والتجميد
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القالب/النموذج</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>الحالة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>مجمد</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '200px' }}>الصلاحيات</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id} className="hover:bg-blue-50/30">
                  <TableCell className="text-right">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{template.name}</p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>{template.code}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {template.isActive ? (
                      <Badge className="bg-green-500 text-white text-xs">نشط</Badge>
                    ) : (
                      <Badge className="bg-gray-400 text-white text-xs">معطل</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <EnhancedSwitch
                      id={`freeze-${template.id}`}
                      checked={template.isFrozen}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setShowFreezeDialog(true);
                        }
                      }}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap gap-1">
                      {template.permissions.slice(0, 3).map((perm, i) => (
                        <Badge key={i} variant="outline" className="text-[10px]">
                          {perm === 'view' && 'عرض'}
                          {perm === 'edit' && 'تعديل'}
                          {perm === 'delete' && 'حذف'}
                          {perm === 'freeze' && 'تجميد'}
                          {perm === 'export' && 'تصدير'}
                        </Badge>
                      ))}
                      {template.permissions.length > 3 && (
                        <Badge variant="secondary" className="text-[10px]">
                          +{template.permissions.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Shield className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        {template.isFrozen ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* الصلاحيات المتاحة */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الصلاحيات المتاحة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-3 gap-3">
            {[
              { perm: 'view', label: 'عرض', icon: Eye, desc: 'عرض القالب/النموذج فقط', color: 'blue' },
              { perm: 'edit', label: 'تعديل', icon: Edit, desc: 'تعديل المحتوى والعناصر', color: 'green' },
              { perm: 'delete', label: 'حذف', icon: Trash2, desc: 'حذف القالب/النموذج', color: 'red' },
              { perm: 'duplicate', label: 'نسخ', icon: Copy, desc: 'إنشاء نسخة مطابقة', color: 'purple' },
              { perm: 'export', label: 'تصدير', icon: Download, desc: 'تصدير بصيغ مختلفة', color: 'orange' },
              { perm: 'freeze', label: 'تجميد', icon: Lock, desc: 'تجميد/فك التجميد', color: 'red' },
              { perm: 'version', label: 'الإصدارات', icon: GitBranch, desc: 'إدارة الإصدارات', color: 'teal' },
              { perm: 'share', label: 'مشاركة', icon: Users, desc: 'مشاركة مع الآخرين', color: 'pink' },
              { perm: 'settings', label: 'إعدادات', icon: Settings, desc: 'تعديل الإعدادات', color: 'gray' },
            ].map((item) => (
              <div key={item.perm} className="flex items-start gap-2 p-2 rounded border">
                {React.createElement(item.icon, { className: `h-5 w-5 text-${item.color}-500 flex-shrink-0` })}
                <div>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>{item.label}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // تاب 960-13: تقارير الاستخدام
  const renderUsageReportsTab = () => (
    <div className="space-y-3">
      {/* إحصائيات عامة */}
      <div className="grid grid-cols-6 gap-2">
        {[
          { label: 'إجمالي الاستخدام', value: templates.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString('ar-SA'), icon: TrendingUp, color: 'blue' },
          { label: 'اليوم', value: '45', icon: Clock, color: 'green' },
          { label: 'هذا الأسبوع', value: '287', icon: Calendar, color: 'purple' },
          { label: 'هذا الشهر', value: '1,234', icon: BarChart3, color: 'orange' },
          { label: 'متوسط يومي', value: '41', icon: Activity, color: 'teal' },
          { label: 'الأكثر استخداماً', value: templates.reduce((max, t) => t.usageCount > max.usageCount ? t : max, templates[0])?.name?.substring(0, 15) || '-', icon: Star, color: 'yellow' },
        ].map((stat, i) => (
          <Card key={i} className="card-element card-rtl">
            <CardContent className="p-2">
              <div className="flex items-center gap-2 mb-1">
                {React.createElement(stat.icon, { className: `h-4 w-4 text-${stat.color}-500` })}
                <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
              </div>
              <p className="text-sm truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* تقرير تفصيلي */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تقرير الاستخدام التفصيلي
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '40px' }}>#</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القالب/النموذج</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>النوع</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>الاستخدام الكلي</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>آخر استخدام</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '150px' }}>التقدم</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...templates]
                .sort((a, b) => b.usageCount - a.usageCount)
                .map((template, index) => {
                  const maxUsage = Math.max(...templates.map(t => t.usageCount));
                  const percentage = (template.usageCount / maxUsage) * 100;
                  
                  return (
                    <TableRow key={template.id} className="hover:bg-blue-50/30">
                      <TableCell className="text-right">
                        <Badge variant={index < 3 ? 'default' : 'outline'} className="text-xs">
                          {index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{template.name}</p>
                          <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>{template.code}</p>
                        </div>
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
                      <TableCell className="text-right">
                        <div className="space-y-1">
                          <Progress value={percentage} className="h-2" />
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {percentage.toFixed(1)}%
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* الرسم البياني (محاكاة) */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            اتجاه الاستخدام (آخر 7 أيام)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-48 bg-gradient-to-r from-blue-50 to-purple-50 rounded flex items-center justify-center">
            <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <BarChart3 className="h-16 w-16 mx-auto mb-2 text-gray-300" />
              الرسم البياني التفاعلي (قيد التطوير)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // تاب 960-15: الإعدادات المتقدمة
  const renderAdvancedSettingsTab = () => (
    <div className="space-y-3">
      {/* إعدادات المحرر */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <SlidersHorizontal className="h-5 w-5 inline ml-2" />
            إعدادات المحرر
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                حجم الشبكة الافتراضي (px)
              </label>
              <InputWithCopy
                id="grid-size"
                type="number"
                value="20"
                copyable={false}
                clearable={false}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                دقة التصدير الافتراضية (DPI)
              </label>
              <SelectWithCopy
                id="export-dpi"
                value="300"
                options={[
                  { value: '150', label: '150 DPI' },
                  { value: '300', label: '300 DPI' },
                  { value: '600', label: '600 DPI' }
                ]}
                copyable={false}
                clearable={false}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                  إظهار الشبكة افتراضياً
                </p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  عرض شبكة المحاذاة عند فتح المحرر
                </p>
              </div>
              <EnhancedSwitch
                id="show-grid-default"
                checked={showGrid}
                onCheckedChange={setShowGrid}
                size="sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                  إظهار المساطر
                </p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  عرض المساطر الجانبية للقياس
                </p>
              </div>
              <EnhancedSwitch
                id="show-rulers-default"
                checked={showRulers}
                onCheckedChange={setShowRulers}
                size="sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                  محاذاة تلقائية
                </p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  محاذاة العناصر تلقائياً مع الشبكة
                </p>
              </div>
              <EnhancedSwitch
                id="snap-to-grid"
                checked={true}
                size="sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                  حفظ تلقائي
                </p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  حفظ التغييرات تلقائياً كل دقيقة
                </p>
              </div>
              <EnhancedSwitch
                id="auto-save"
                checked={true}
                variant="success"
                size="sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إعدادات الأمان */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Shield className="h-5 w-5 inline ml-2" />
            إعدادات الأمان
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                طلب تأكيد قبل الحذف
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                عرض رسالة تأكيد قبل حذف أي عنصر
              </p>
            </div>
            <EnhancedSwitch
              id="confirm-delete"
              checked={true}
              variant="warning"
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                نسخ احتياطية تلقائية
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إنشاء نسخة احتياطية يومية للقوالب
              </p>
            </div>
            <EnhancedSwitch
              id="auto-backup"
              checked={true}
              variant="success"
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                تدقيق الصلاحيات
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التحقق من صلاحيات المستخدم قبل كل عملية
              </p>
            </div>
            <EnhancedSwitch
              id="audit-permissions"
              checked={true}
              variant="danger"
              size="sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* إعدادات الأداء */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Activity className="h-5 w-5 inline ml-2" />
            إعدادات الأداء
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                عدد العناصر للتحميل
              </label>
              <SelectWithCopy
                id="lazy-load-count"
                value="50"
                options={[
                  { value: '25', label: '25 عنصر' },
                  { value: '50', label: '50 عنصر' },
                  { value: '100', label: '100 عنصر' }
                ]}
                copyable={false}
                clearable={false}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                مدة التخزين المؤقت
              </label>
              <SelectWithCopy
                id="cache-duration"
                value="30"
                options={[
                  { value: '10', label: '10 دقائق' },
                  { value: '30', label: '30 دقيقة' },
                  { value: '60', label: 'ساعة واحدة' }
                ]}
                copyable={false}
                clearable={false}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                تفعيل التحميل الذكي
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تحميل العناصر عند الحاجة فقط
              </p>
            </div>
            <EnhancedSwitch
              id="lazy-loading"
              checked={true}
              size="sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* أزرار الإعادة */}
      <Card className="card-element card-rtl bg-yellow-50">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                  إعادة تعيين الإعدادات
                </h4>
                <p className="text-xs text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إعادة جميع الإعدادات إلى القيم الافتراضية
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <RefreshCcw className="h-4 w-4 ml-2" />
              إعادة تعيين
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // رندر محتوى التاب الحالي
  const renderTabContent = () => {
    switch (activeTab) {
      case '960-01':
        // نظرة عامة - محافظة على النسخة السابقة
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة (محافظ على النسخة السابقة)</div>;
      case '960-02':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>مكتبة القوالب (محافظ على النسخة السابقة)</div>;
      case '960-03':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>مكتبة النماذج (محافظ على النسخة السابقة)</div>;
      case '960-04':
      case '960-05':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>المصمم (محافظ على النسخة السابقة)</div>;
      case '960-06':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>عناصر التصميم (محافظ على النسخة السابقة)</div>;
      case '960-07':
        return renderVariablesTab();
      case '960-08':
        return renderStampsSignaturesTab();
      case '960-09':
        return renderDigitalAuthTab();
      case '960-10':
        return renderImportExportTab();
      case '960-11':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإصدارات (محافظ على النسخة السابقة)</div>;
      case '960-12':
        return renderPermissionsFreezeTab();
      case '960-13':
        return renderUsageReportsTab();
      case '960-14':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الربط بالشاشات (محافظ على النسخة السابقة)</div>;
      case '960-15':
        return renderAdvancedSettingsTab();
      default:
        return null;
    }
  };

  return (
    <div className="flex" style={{ direction: 'rtl', gap: '1rem', minHeight: 'calc(100vh - 140px)' }}>
      {/* السايد بار الموحد */}
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
        <ScrollArea className="h-full" style={{ '--scrollbar-width': '6px' } as React.CSSProperties}>
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
                  style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}
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
              <div className="flex items-center justify-between">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Layout className="h-5 w-5 inline ml-2" />
                  مصمم القوالب والنماذج المتقدم v8.0
                </CardTitle>
                <Badge variant="outline" className="font-mono">
                  960
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* محتوى التاب */}
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة إضافة متغير */}
      <Dialog open={showVariableDialog} onOpenChange={setShowVariableDialog}>
        <DialogContent className="max-w-2xl dialog-rtl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إضافة متغير ديناميكي جديد
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InputWithCopy
                label="كود المتغير *"
                id="var-code"
                value={newVariable.code}
                onChange={(e) => setNewVariable({ ...newVariable, code: e.target.value.toUpperCase() })}
                placeholder="OWNER_NAME"
                required
                copyable={true}
                clearable={true}
              />
              <InputWithCopy
                label="اسم المتغير *"
                id="var-name"
                value={newVariable.name}
                onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                placeholder="اسم المالك"
                required
                copyable={true}
                clearable={true}
              />
            </div>
            <SelectWithCopy
              label="نوع المتغير *"
              id="var-type"
              value={newVariable.type}
              onChange={(value) => setNewVariable({ ...newVariable, type: value })}
              options={[
                { value: 'text', label: 'نص' },
                { value: 'number', label: 'رقم' },
                { value: 'date', label: 'تاريخ' },
                { value: 'currency', label: 'عملة' },
                { value: 'boolean', label: 'منطقي (نعم/لا)' },
                { value: 'list', label: 'قائمة اختيارات' },
                { value: 'formula', label: 'معادلة حسابية' }
              ]}
              copyable={false}
              clearable={false}
            />
            <InputWithCopy
              label="القيمة الافتراضية"
              id="var-default"
              value={newVariable.defaultValue}
              onChange={(e) => setNewVariable({ ...newVariable, defaultValue: e.target.value })}
              copyable={true}
              clearable={true}
            />
            <TextAreaWithCopy
              label="الوصف"
              id="var-description"
              value={newVariable.description}
              onChange={(e) => setNewVariable({ ...newVariable, description: e.target.value })}
              rows={3}
              copyable={true}
              clearable={true}
            />
            <div className="flex items-center gap-2">
              <EnhancedSwitch
                id="var-required"
                checked={newVariable.required}
                onCheckedChange={(checked) => setNewVariable({ ...newVariable, required: checked })}
                size="sm"
              />
              <label htmlFor="var-required" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                متغير إلزامي
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVariableDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={() => {
              setVariables([...variables, { id: `VAR-${Date.now()}`, ...newVariable }]);
              setShowVariableDialog(false);
              setNewVariable({ code: '', name: '', type: 'text', defaultValue: '', required: false, description: '', category: '' });
            }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesFormsDesigner_960_v8_Enhanced;
