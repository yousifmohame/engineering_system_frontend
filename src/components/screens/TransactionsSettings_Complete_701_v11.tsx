/**
 * الشاشة 701 - إعدادات المعاملات v11.0 - النظام الشامل المتقدم
 * ================================================================
 * 
 * شاشة شاملة لإدارة جميع إعدادات نظام المعاملات
 * 
 * التابات (22 تاب):
 * 701-01: الإعدادات الأساسية
 * 701-02: إعدادات الترقيم
 * 701-03: المراحل
 * 701-04: حالات المعاملات
 * 701-05: الأولويات
 * 701-06: التصنيفات الرئيسية
 * 701-07: التصنيفات الفرعية
 * 701-08: القوالب
 * 701-09: النماذج والتعهدات
 * 701-10: إعدادات التنبيهات
 * 701-11: الصلاحيات
 * 701-12: الربط بالأنظمة
 * 701-13: السجلات والتدقيق
 * 701-14: النسخ الاحتياطي
 * 701-15: مستوى المعاملة
 * 701-16: إجراءات التحقق
 * 701-17: حاسبة نسب الإنجاز ⭐ جديد
 * 701-18: قائمة التحقق ⭐ جديد
 * 701-19: أنواع المستندات ⭐ جديد
 * 701-20: نماذج المعاملات ⭐ جديد
 * 701-21: إعدادات المهام المسبقة ⭐ جديد
 * 701-22: أنواع المعاملات ⭐ جديد
 * 
 * @version 11.0
 * @date 2025-10-25
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import {
  Settings, Hash, GitBranch, Activity, Zap, Tag, FileText,
  File, Bell, Shield, Folder, FolderTree, Link2, Eye, Database,
  Plus, Edit, Trash2, Save, Search, Filter, BarChart3, Clock,
  CheckCircle, XCircle, AlertCircle, Play, Pause, ArrowRight,
  Layers, FileCheck, ShieldCheck, AlertTriangle, CheckSquare,
  ListChecks, ClipboardCheck, Target, Flag, Star, TrendingUp,
  Workflow, FileSignature, UserCheck, Award, Briefcase, FileWarning,
  Calculator, HelpCircle, Files, FolderEdit, ClipboardList, Building2,
  Percent, Scale, Gauge, ListTodo, FilePlus, Archive, MessageSquare
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import Tab_701_23_GroupClassifications from './Tab_701_23_GroupClassifications';

// ===== واجهات البيانات =====

// حاسبة نسب الإنجاز
interface TabWeight {
  id: string;
  tabCode: string;
  tabName: string;
  weight: number; // الوزن النسبي (0-100)
  isRequired: boolean;
  description: string;
  category: string;
}

// قائمة التحقق
interface ChecklistItem {
  id: string;
  code: string;
  question: string;
  category: string;
  answerType: 'yes_no' | 'text' | 'number' | 'date' | 'file' | 'multiple_choice';
  isRequired: boolean;
  order: number;
  options?: string[]; // للأسئلة متعددة الخيارات
  validationRules?: string;
  linkedToTransactionType?: string[];
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

// أنواع المستندات
interface DocumentType {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  category: 'إلزامي' | 'اختياري' | 'حسب الحاجة';
  description: string;
  acceptedFormats: string[];
  maxSize: number; // MB
  expiryDays: number;
  requiresVerification: boolean;
  linkedToTransactionTypes: string[];
  displayOrder: number;
  isActive: boolean;
  createdDate: string;
}

// نماذج المعاملات
interface TransactionTemplate {
  id: string;
  code: string;
  name: string;
  type: 'تعهد المكتب' | 'تعهد المالك' | 'نموذج مشترك';
  transactionTypes: string[]; // أنواع المعاملات المرتبطة
  classifications: string[]; // التصنيفات المرتبطة
  content: string; // محتوى النموذج (HTML/Text)
  fields: TemplateField[];
  isRequired: boolean;
  version: string;
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

interface TemplateField {
  id: string;
  name: string;
  fieldType: 'text' | 'number' | 'date' | 'dropdown' | 'checkbox' | 'signature';
  isRequired: boolean;
  defaultValue?: string;
  placeholder?: string;
  validationRules?: string;
}

// إعدادات المهام
interface PresetTask {
  id: string;
  code: string;
  name: string;
  description: string;
  group: TaskGroup;
  estimatedDuration: number; // بالأيام
  priority: 'عالية' | 'متوسطة' | 'منخفضة';
  linkedToTransactionType: string[];
  linkedToProjectClassification: string[];
  linkedToClientType: string[];
  requiresApproval: boolean;
  assignToRole?: string;
  isActive: boolean;
  displayOrder: number;
}

interface TaskGroup {
  id: string;
  name: string;
  criteria: {
    transactionType?: string[];
    projectMainClass?: string[];
    projectSubClass?: string[];
    clientType?: string[];
    creationDateRange?: string;
    numberOfFloors?: string;
    landArea?: string;
    confidentialityLevel?: string;
    clientImportance?: string;
  };
}

// أنواع المعاملات
interface TransactionType {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  displayOrder: number;
  createdDate: string;
}

const TransactionsSettings_Complete_701_v11: React.FC = () => {
  const [activeTab, setActiveTab] = useState('701-17');
  
  // حالات حاسبة نسب الإنجاز
  const [tabWeights, setTabWeights] = useState<TabWeight[]>([
    { id: '1', tabCode: '284-01', tabName: 'بيانات أساسية', weight: 5, isRequired: true, description: 'معلومات المعاملة الأساسية', category: 'أساسي' },
    { id: '2', tabCode: '284-02', tabName: 'بيانات العميل', weight: 5, isRequired: true, description: 'معلومات العميل والتواصل', category: 'أساسي' },
    { id: '3', tabCode: '284-03', tabName: 'بيانات الموقع', weight: 4, isRequired: true, description: 'تفاصيل الموقع والإحداثيات', category: 'أساسي' },
    { id: '4', tabCode: '284-04', tabName: 'عرض السعر', weight: 6, isRequired: true, description: 'عرض السعر المبدئي والنهائي', category: 'مالي' },
    { id: '5', tabCode: '284-05', tabName: 'العقد', weight: 7, isRequired: true, description: 'عقد تقديم الخدمة', category: 'مالي' },
    { id: '6', tabCode: '284-06', tabName: 'المدفوعات', weight: 8, isRequired: true, description: 'سجل المدفوعات والدفعات', category: 'مالي' },
    { id: '7', tabCode: '284-07', tabName: 'فريق العمل', weight: 5, isRequired: true, description: 'تعيين الفريق والمسؤوليات', category: 'تنفيذي' },
    { id: '8', tabCode: '284-08', tabName: 'المهام', weight: 6, isRequired: true, description: 'مهام المعاملة والإنجاز', category: 'تنفيذي' },
    { id: '9', tabCode: '284-09', tabName: 'الوثائق المستلمة', weight: 7, isRequired: true, description: 'المستندات المستلمة من العميل', category: 'وثائق' },
    { id: '10', tabCode: '284-10', tabName: 'التحقق', weight: 5, isRequired: false, description: 'التحقق من البيانات', category: 'جودة' },
    { id: '11', tabCode: '284-11', tabName: 'الملاحظات والتعليقات', weight: 3, isRequired: false, description: 'الملاحظات والمراجعات', category: 'إضافي' },
    { id: '12', tabCode: '284-12', tabName: 'المخططات', weight: 7, isRequired: true, description: 'المخططات الهندسية', category: 'فني' },
    { id: '13', tabCode: '284-13', tabName: 'التقارير', weight: 6, isRequired: true, description: 'التقارير الفنية', category: 'فني' },
    { id: '14', tabCode: '284-14', tabName: 'الحسابات', weight: 5, isRequired: true, description: 'الحسابات الهندسية', category: 'فني' },
    { id: '15', tabCode: '284-15', tabName: 'المخرجات', weight: 6, isRequired: true, description: 'المخرجات النهائية', category: 'نهائي' },
    { id: '16', tabCode: '284-16', tabName: 'التسليم', weight: 7, isRequired: true, description: 'عملية التسليم النهائي', category: 'نهائي' },
    { id: '17', tabCode: '284-17', tabName: 'التقييم', weight: 4, isRequired: false, description: 'تقييم العميل والخدمة', category: 'جودة' },
    { id: '18', tabCode: '284-18', tabName: 'الأرشفة', weight: 3, isRequired: true, description: 'أرشفة المعاملة', category: 'نهائي' },
    { id: '19', tabCode: '284-19', tabName: 'السجل', weight: 2, isRequired: true, description: 'سجل العمليات', category: 'إضافي' },
    { id: '20', tabCode: '284-20', tabName: 'الجودة', weight: 4, isRequired: false, description: 'ضمان الجودة', category: 'جودة' },
    { id: '21', tabCode: '284-21', tabName: 'التطوير', weight: 3, isRequired: false, description: 'التطوير والتحسين', category: 'إضافي' },
    { id: '22', tabCode: '284-22', tabName: 'الإغلاق', weight: 2, isRequired: true, description: 'إغلاق المعاملة', category: 'نهائي' },
  ]);

  // حالات قائمة التحقق
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: '1', code: 'CHK-001', question: 'هل تم التحقق من هوية العميل؟', category: 'التحقق من العميل', answerType: 'yes_no', isRequired: true, order: 1, isActive: true, createdDate: '2025-01-15', lastModified: '2025-01-15' },
    { id: '2', code: 'CHK-002', question: 'هل توجد صورة واضحة من صك الملكية؟', category: 'المستندات', answerType: 'yes_no', isRequired: true, order: 2, linkedToTransactionType: ['سكني', 'تجاري'], isActive: true, createdDate: '2025-01-15', lastModified: '2025-01-15' },
    { id: '3', code: 'CHK-003', question: 'هل تم استلام الرسوم الأولية؟', category: 'المالية', answerType: 'yes_no', isRequired: true, order: 3, isActive: true, createdDate: '2025-01-15', lastModified: '2025-01-15' },
    { id: '4', code: 'CHK-004', question: 'ما هي مساحة الأرض بالمتر المربع؟', category: 'البيانات الفنية', answerType: 'number', isRequired: true, order: 4, isActive: true, createdDate: '2025-01-15', lastModified: '2025-01-15' },
    { id: '5', code: 'CHK-005', question: 'هل يوجد رفع مساحي للموقع؟', category: 'البيانات الفنية', answerType: 'yes_no', isRequired: false, order: 5, isActive: true, createdDate: '2025-01-15', lastModified: '2025-01-15' },
    { id: '6', code: 'CHK-006', question: 'ما هو تاريخ الزيارة الميدانية؟', category: 'المواعيد', answerType: 'date', isRequired: false, order: 6, isActive: true, createdDate: '2025-01-15', lastModified: '2025-01-15' },
    { id: '7', code: 'CHK-007', question: 'هل تم رفع صور للموقع؟', category: 'الوثائق', answerType: 'file', isRequired: false, order: 7, isActive: true, createdDate: '2025-01-15', lastModified: '2025-01-15' },
    { id: '8', code: 'CHK-008', question: 'ما هو نوع البناء المطلوب؟', category: 'التفاصيل', answerType: 'multiple_choice', options: ['فيلا', 'عمارة سكنية', 'مبنى تجاري', 'مبنى صناعي', 'أخرى'], isRequired: true, order: 8, isActive: true, createdDate: '2025-01-15', lastModified: '2025-01-15' },
  ]);

  // حالات أنواع المستندات
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([
    { id: '1', code: 'DOC-001', nameAr: 'صك الملكية', nameEn: 'Ownership Deed', category: 'إلزامي', description: 'صك ملكية الأرض الأصلي أو صورة معتمدة', acceptedFormats: ['PDF', 'JPG', 'PNG'], maxSize: 10, expiryDays: 0, requiresVerification: true, linkedToTransactionTypes: ['سكني', 'تجاري', 'صناعي'], displayOrder: 1, isActive: true, createdDate: '2025-01-10' },
    { id: '2', code: 'DOC-002', nameAr: 'بطاقة الهوية', nameEn: 'ID Card', category: 'إلزامي', description: 'بطاقة الهوية الوطنية للمالك', acceptedFormats: ['PDF', 'JPG', 'PNG'], maxSize: 5, expiryDays: 365, requiresVerification: true, linkedToTransactionTypes: ['سكني', 'تجاري', 'صناعي', 'زراعي'], displayOrder: 2, isActive: true, createdDate: '2025-01-10' },
    { id: '3', code: 'DOC-003', nameAr: 'مخطط الموقع', nameEn: 'Site Plan', category: 'إلزامي', description: 'مخطط الموقع المساحي المعتمد', acceptedFormats: ['PDF', 'DWG', 'DXF'], maxSize: 20, expiryDays: 180, requiresVerification: true, linkedToTransactionTypes: ['سكني', 'تجاري', 'صناعي'], displayOrder: 3, isActive: true, createdDate: '2025-01-10' },
    { id: '4', code: 'DOC-004', nameAr: 'كروكي الموقع', nameEn: 'Site Sketch', category: 'اختياري', description: 'كروكي تقريبي لموقع الأرض', acceptedFormats: ['PDF', 'JPG', 'PNG'], maxSize: 5, expiryDays: 0, requiresVerification: false, linkedToTransactionTypes: ['سكني', 'تجاري'], displayOrder: 4, isActive: true, createdDate: '2025-01-10' },
    { id: '5', code: 'DOC-005', nameAr: 'شهادة تخطيط', nameEn: 'Planning Certificate', category: 'حسب الحاجة', description: 'شهادة من أمانة المنطقة بالمخطط المعتمد', acceptedFormats: ['PDF'], maxSize: 10, expiryDays: 90, requiresVerification: true, linkedToTransactionTypes: ['سكني', 'تجاري', 'صناعي'], displayOrder: 5, isActive: true, createdDate: '2025-01-10' },
    { id: '6', code: 'DOC-006', nameAr: 'تقرير فني سابق', nameEn: 'Previous Technical Report', category: 'اختياري', description: 'تقرير فني سابق إن وجد', acceptedFormats: ['PDF', 'DOC', 'DOCX'], maxSize: 15, expiryDays: 0, requiresVerification: false, linkedToTransactionTypes: ['سكني', 'تجاري', 'صناعي'], displayOrder: 6, isActive: true, createdDate: '2025-01-10' },
  ]);

  // حالات نماذج المعاملات
  const [transactionTemplates, setTransactionTemplates] = useState<TransactionTemplate[]>([
    {
      id: '1',
      code: 'TMPL-001',
      name: 'تعهد المكتب الهندسي - سكني',
      type: 'تعهد المكتب',
      transactionTypes: ['سكني'],
      classifications: ['فيلا', 'عمارة سكنية'],
      content: 'يتعهد المكتب الهندسي بتقديم الخدمات الهندسية المطلوبة وفقاً للمواصفات والشروط المتفق عليها...',
      fields: [
        { id: 'f1', name: 'اسم المكتب', fieldType: 'text', isRequired: true, placeholder: 'اسم المكتب الهندسي' },
        { id: 'f2', name: 'رقم الترخيص', fieldType: 'text', isRequired: true, placeholder: 'رقم الترخيص' },
        { id: 'f3', name: 'تاريخ التعهد', fieldType: 'date', isRequired: true },
        { id: 'f4', name: 'توقيع المسؤول', fieldType: 'signature', isRequired: true },
      ],
      isRequired: true,
      version: '1.0',
      isActive: true,
      createdDate: '2025-01-05',
      lastModified: '2025-01-05',
    },
    {
      id: '2',
      code: 'TMPL-002',
      name: 'تعهد المالك - سكني',
      type: 'تعهد المالك',
      transactionTypes: ['سكني', 'تجاري'],
      classifications: ['فيلا', 'عمارة سكنية', 'محل تجاري'],
      content: 'يتعهد المالك بتوفير جميع المستندات والمعلومات المطلوبة والتعاون مع المكتب الهندسي...',
      fields: [
        { id: 'f1', name: 'اسم المالك', fieldType: 'text', isRequired: true },
        { id: 'f2', name: 'رقم الهوية', fieldType: 'text', isRequired: true },
        { id: 'f3', name: 'تاريخ التعهد', fieldType: 'date', isRequired: true },
        { id: 'f4', name: 'التوقيع', fieldType: 'signature', isRequired: true },
      ],
      isRequired: true,
      version: '1.0',
      isActive: true,
      createdDate: '2025-01-05',
      lastModified: '2025-01-05',
    },
  ]);

  // حالات المهام المسبقة
  const [presetTasks, setPresetTasks] = useState<PresetTask[]>([
    {
      id: '1',
      code: 'TASK-001',
      name: 'استلام المستندات الأولية',
      description: 'استلام المستندات الأساسية من العميل (صك، هوية، موقع)',
      group: { id: 'g1', name: 'مهام استقبال', criteria: {} },
      estimatedDuration: 1,
      priority: 'عالية',
      linkedToTransactionType: ['سكني', 'تجاري', 'صناعي'],
      linkedToProjectClassification: [],
      linkedToClientType: [],
      requiresApproval: false,
      assignToRole: 'موظف الاستقبال',
      isActive: true,
      displayOrder: 1,
    },
    {
      id: '2',
      code: 'TASK-002',
      name: 'الزيارة الميدانية الأولية',
      description: 'زيارة الموقع وأخذ الصور والقياسات الأولية',
      group: { id: 'g2', name: 'مهام المساحة', criteria: { transactionType: ['سكني', 'تجاري'] } },
      estimatedDuration: 2,
      priority: 'عالية',
      linkedToTransactionType: ['سكني', 'تجاري', 'صناعي'],
      linkedToProjectClassification: [],
      linkedToClientType: [],
      requiresApproval: false,
      assignToRole: 'مهندس مساح',
      isActive: true,
      displayOrder: 2,
    },
    {
      id: '3',
      code: 'TASK-003',
      name: 'إعداد عرض السعر المبدئي',
      description: 'إعداد عرض السعر الأولي بناءً على البيانات المتوفرة',
      group: { id: 'g3', name: 'مهام مالية', criteria: {} },
      estimatedDuration: 1,
      priority: 'عالية',
      linkedToTransactionType: ['سكني', 'تجاري', 'صناعي', 'زراعي'],
      linkedToProjectClassification: [],
      linkedToClientType: [],
      requiresApproval: true,
      assignToRole: 'مسؤول مالي',
      isActive: true,
      displayOrder: 3,
    },
    {
      id: '4',
      code: 'TASK-004',
      name: 'مراجعة البيانات الفنية',
      description: 'مراجعة جميع البيانات الفنية والتأكد من اكتمالها',
      group: { id: 'g4', name: 'مهام فنية', criteria: {} },
      estimatedDuration: 2,
      priority: 'متوسطة',
      linkedToTransactionType: ['سكني', 'تجاري', 'صناعي'],
      linkedToProjectClassification: [],
      linkedToClientType: [],
      requiresApproval: false,
      assignToRole: 'مهندس فني',
      isActive: true,
      displayOrder: 4,
    },
  ]);

  // حالات أنواع المعاملات
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([
    { id: '1', code: 'TT-001', nameAr: 'سكني', nameEn: 'Residential', description: 'معاملات المشاريع السكنية (فلل، عمائر، شقق)', color: '#3b82f6', icon: 'Home', isActive: true, displayOrder: 1, createdDate: '2025-01-01' },
    { id: '2', code: 'TT-002', nameAr: 'تجاري', nameEn: 'Commercial', description: 'معاملات المشاريع التجارية (محلات، مراكز، أسواق)', color: '#10b981', icon: 'Building2', isActive: true, displayOrder: 2, createdDate: '2025-01-01' },
    { id: '3', code: 'TT-003', nameAr: 'صناعي', nameEn: 'Industrial', description: 'معاملات المشاريع الصناعية (مصانع، مستودعات)', color: '#f59e0b', icon: 'Factory', isActive: true, displayOrder: 3, createdDate: '2025-01-01' },
    { id: '4', code: 'TT-004', nameAr: 'زراعي', nameEn: 'Agricultural', description: 'معاملات المشاريع الزراعية (مزارع، منتجعات)', color: '#22c55e', icon: 'Sprout', isActive: true, displayOrder: 4, createdDate: '2025-01-01' },
    { id: '5', code: 'TT-005', nameAr: 'إداري', nameEn: 'Administrative', description: 'معاملات المباني الإدارية (مكاتب، مقرات)', color: '#8b5cf6', icon: 'Building', isActive: true, displayOrder: 5, createdDate: '2025-01-01' },
    { id: '6', code: 'TT-006', nameAr: 'خدمي', nameEn: 'Service', description: 'معاملات المشاريع الخدمية (مستشفيات، مدارس)', color: '#06b6d4', icon: 'Hospital', isActive: true, displayOrder: 6, createdDate: '2025-01-01' },
    { id: '7', code: 'TT-007', nameAr: 'استثماري', nameEn: 'Investment', description: 'معاملات المشاريع الاستثمارية (أبراج، مجمعات)', color: '#ec4899', icon: 'TrendingUp', isActive: true, displayOrder: 7, createdDate: '2025-01-01' },
    { id: '8', code: 'TT-008', nameAr: 'سياحي', nameEn: 'Tourism', description: 'معاملات المشاريع السياحية (فنادق، منتجعات)', color: '#f97316', icon: 'Palmtree', isActive: true, displayOrder: 8, createdDate: '2025-01-01' },
  ]);

  // نوافذ منبثقة
  const [showAddWeightDialog, setShowAddWeightDialog] = useState(false);
  const [showAddChecklistDialog, setShowAddChecklistDialog] = useState(false);
  const [showAddDocTypeDialog, setShowAddDocTypeDialog] = useState(false);
  const [showAddTemplateDialog, setShowAddTemplateDialog] = useState(false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showAddTransactionTypeDialog, setShowAddTransactionTypeDialog] = useState(false);

  // حساب النسب
  const totalWeight = useMemo(() => {
    return tabWeights.reduce((sum, item) => sum + item.weight, 0);
  }, [tabWeights]);

  const TABS_CONFIG: TabConfig[] = [
    { id: '701-01', number: '701-01', title: 'الإعدادات الأساسية', icon: Settings },
    { id: '701-02', number: '701-02', title: 'إعدادات الترقيم', icon: Hash },
    { id: '701-03', number: '701-03', title: 'المراحل', icon: GitBranch },
    { id: '701-04', number: '701-04', title: 'حالات المعاملات', icon: Activity },
    { id: '701-05', number: '701-05', title: 'الأولويات', icon: Zap },
    { id: '701-06', number: '701-06', title: 'التصنيفات الرئيسية', icon: Folder },
    { id: '701-07', number: '701-07', title: 'التصنيفات الفرعية', icon: FolderTree },
    { id: '701-08', number: '701-08', title: 'القوالب', icon: FileText },
    { id: '701-09', number: '701-09', title: 'النماذج والتعهدات', icon: FileSignature },
    { id: '701-10', number: '701-10', title: 'إعدادات التنبيهات', icon: Bell },
    { id: '701-11', number: '701-11', title: 'الصلاحيات', icon: Shield },
    { id: '701-12', number: '701-12', title: 'الربط بالأنظمة', icon: Link2 },
    { id: '701-13', number: '701-13', title: 'السجلات والتدقيق', icon: Eye },
    { id: '701-14', number: '701-14', title: 'النسخ الاحتياطي', icon: Database },
    { id: '701-15', number: '701-15', title: 'مستوى المعاملة', icon: Layers },
    { id: '701-16', number: '701-16', title: 'إجراءات التحقق', icon: ShieldCheck },
    { id: '701-17', number: '701-17', title: 'حاسبة نسب الإنجاز', icon: Calculator },
    { id: '701-18', number: '701-18', title: 'قائمة التحقق', icon: ListChecks },
    { id: '701-19', number: '701-19', title: 'أنواع المستندات', icon: Files },
    { id: '701-20', number: '701-20', title: 'نماذج المعاملات', icon: FolderEdit },
    { id: '701-21', number: '701-21', title: 'إعدادات المهام المسبقة', icon: ClipboardList },
    { id: '701-22', number: '701-22', title: 'أنواع المعاملات', icon: Building2 },
    { id: '701-23', number: '701-23', title: 'تصنيفات الأقسام', icon: Tag },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case '701-17':
        return renderProgressCalculatorTab();
      case '701-18':
        return renderChecklistTab();
      case '701-19':
        return renderDocumentTypesTab();
      case '701-20':
        return renderTemplatesTab();
      case '701-21':
        return renderPresetTasksTab();
      case '701-22':
        return renderTransactionTypesTab();
      case '701-23':
        return <Tab_701_23_GroupClassifications />;
      default:
        return (
          <Card className="card-rtl">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {TABS_CONFIG.find(t => t.id === activeTab)?.title || 'التاب'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                محتوى هذا التاب سيتم تطويره قريباً...
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  // ===== تاب حاسبة نسب الإنجاز =====
  const renderProgressCalculatorTab = () => (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي التابات</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1e40af' }}>
                  {tabWeights.length}
                </p>
              </div>
              <Layers className="h-8 w-8 text-blue-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي النسب</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#92400e' }}>
                  {totalWeight}%
                </p>
              </div>
              <Percent className="h-8 w-8 text-yellow-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>التابات الإلزامية</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#166534' }}>
                  {tabWeights.filter(t => t.isRequired).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>التابات الاختيارية</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#831843' }}>
                  {tabWeights.filter(t => !t.isRequired).length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-pink-700 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* تحذير إذا كانت النسبة غير 100 */}
      {totalWeight !== 100 && (
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, color: '#991b1b' }}>
                  تنبيه: إجمالي النسب غير مكتمل
                </p>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#7f1d1d' }}>
                  إجمالي النسب الحالي: {totalWeight}% - يجب أن يكون 100% بالضبط
                  {totalWeight < 100 && ` (ينقص ${100 - totalWeight}%)`}
                  {totalWeight > 100 && ` (زيادة ${totalWeight - 100}%)`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* مؤشر التقدم */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
            مؤشر اكتمال النسب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', color: '#6b7280' }}>
                النسبة الحالية
              </span>
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700, color: totalWeight === 100 ? '#166534' : '#991b1b' }}>
                {totalWeight}%
              </span>
            </div>
            <Progress value={totalWeight} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* الجدول */}
      <Card className="card-rtl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              أوزان التابات النسبية
            </CardTitle>
            <Button onClick={() => setShowAddWeightDialog(true)} className="button-rtl">
              <Plus className="h-4 w-4" />
              إضافة تاب
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم التاب</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوزن النسبي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إلزامي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tabWeights
                  .sort((a, b) => a.tabCode.localeCompare(b.tabCode))
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-right">
                        <Badge className="font-mono">{item.tabCode}</Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {item.tabName}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="font-mono" style={{ fontWeight: 600, color: '#1e40af' }}>
                            {item.weight}%
                          </span>
                          <div className="w-24">
                            <Progress value={item.weight} className="h-2" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.isRequired ? (
                          <Badge style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
                            ✓ إلزامي
                          </Badge>
                        ) : (
                          <Badge variant="outline" style={{ color: '#6b7280' }}>
                            اختياري
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>
                        {item.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  // ===== تاب قائمة التحقق =====
  const renderChecklistTab = () => (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الأسئلة</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1e40af' }}>
                  {checklistItems.length}
                </p>
              </div>
              <ListChecks className="h-8 w-8 text-blue-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أسئلة إلزامية</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#166534' }}>
                  {checklistItems.filter(i => i.isRequired).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أسئلة اختيارية</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#92400e' }}>
                  {checklistItems.filter(i => !i.isRequired).length}
                </p>
              </div>
              <HelpCircle className="h-8 w-8 text-yellow-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أسئلة نشطة</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#3730a3' }}>
                  {checklistItems.filter(i => i.isActive).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-indigo-700 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الجدول */}
      <Card className="card-rtl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قائمة أسئلة التحقق
            </CardTitle>
            <Button onClick={() => setShowAddChecklistDialog(true)} className="button-rtl">
              <Plus className="h-4 w-4" />
              إضافة سؤال
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>السؤال</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الإجابة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إلزامي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الترتيب</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checklistItems
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-right">
                        <Badge className="font-mono">{item.code}</Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                        {item.question}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                          {item.answerType === 'yes_no' && 'نعم/لا'}
                          {item.answerType === 'text' && 'نص'}
                          {item.answerType === 'number' && 'رقم'}
                          {item.answerType === 'date' && 'تاريخ'}
                          {item.answerType === 'file' && 'ملف'}
                          {item.answerType === 'multiple_choice' && 'اختيار متعدد'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.isRequired ? (
                          <Badge style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
                            ✓ إلزامي
                          </Badge>
                        ) : (
                          <Badge variant="outline" style={{ color: '#6b7280' }}>
                            اختياري
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.isActive ? (
                          <Badge style={{ background: '#dcfce7', color: '#166534' }}>نشط</Badge>
                        ) : (
                          <Badge variant="outline" style={{ color: '#6b7280' }}>غير نشط</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-mono" style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af' }}>
                          #{item.order}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  // ===== تاب أنواع المستندات =====
  const renderDocumentTypesTab = () => (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الأنواع</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1e40af' }}>
                  {documentTypes.length}
                </p>
              </div>
              <Files className="h-8 w-8 text-blue-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إلزامية</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#991b1b' }}>
                  {documentTypes.filter(d => d.category === 'إلزامي').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>اختيارية</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#92400e' }}>
                  {documentTypes.filter(d => d.category === 'اختياري').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-yellow-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>حسب الحاجة</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#3730a3' }}>
                  {documentTypes.filter(d => d.category === 'حسب الحاجة').length}
                </p>
              </div>
              <HelpCircle className="h-8 w-8 text-indigo-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>نشطة</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#166534' }}>
                  {documentTypes.filter(d => d.isActive).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-700 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الجدول */}
      <Card className="card-rtl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              أنواع المستندات المعتمدة
            </CardTitle>
            <Button onClick={() => setShowAddDocTypeDialog(true)} className="button-rtl">
              <Plus className="h-4 w-4" />
              إضافة نوع مستند
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم بالعربية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم بالإنجليزية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصيغ المقبولة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم الأقصى</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>يتطلب توثيق</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentTypes
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="text-right">
                        <Badge className="font-mono">{doc.code}</Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                        {doc.nameAr}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Arial, sans-serif' }}>
                        {doc.nameEn}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          style={{
                            fontFamily: 'Tajawal, sans-serif',
                            background: doc.category === 'إلزامي' ? '#fee2e2' : doc.category === 'اختياري' ? '#fef3c7' : '#e0e7ff',
                            color: doc.category === 'إلزامي' ? '#991b1b' : doc.category === 'اختياري' ? '#92400e' : '#3730a3',
                            border: `1px solid ${doc.category === 'إلزامي' ? '#fca5a5' : doc.category === 'اختياري' ? '#fcd34d' : '#a5b4fc'}`
                          }}
                        >
                          {doc.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1">
                          {doc.acceptedFormats.map((format, idx) => (
                            <Badge key={idx} variant="outline" className="text-[10px]">
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-mono" style={{ fontSize: '13px', color: '#6b7280' }}>
                          {doc.maxSize} MB
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {doc.requiresVerification ? (
                          <Badge style={{ background: '#dcfce7', color: '#166534' }}>
                            <ShieldCheck className="h-3 w-3 ml-1" />
                            يتطلب
                          </Badge>
                        ) : (
                          <Badge variant="outline" style={{ color: '#6b7280' }}>لا يتطلب</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {doc.isActive ? (
                          <Badge style={{ background: '#dcfce7', color: '#166534' }}>نشط</Badge>
                        ) : (
                          <Badge variant="outline" style={{ color: '#6b7280' }}>غير نشط</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  // ===== تاب نماذج المعاملات =====
  const renderTemplatesTab = () => (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي النماذج</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1e40af' }}>
                  {transactionTemplates.length}
                </p>
              </div>
              <FolderEdit className="h-8 w-8 text-blue-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تعهدات المكتب</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#92400e' }}>
                  {transactionTemplates.filter(t => t.type === 'تعهد المكتب').length}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-yellow-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تعهدات المالك</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#166534' }}>
                  {transactionTemplates.filter(t => t.type === 'تعهد المالك').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>نماذج مشتركة</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#3730a3' }}>
                  {transactionTemplates.filter(t => t.type === 'نموذج مشترك').length}
                </p>
              </div>
              <FileSignature className="h-8 w-8 text-indigo-700 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الجدول */}
      <Card className="card-rtl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              نماذج التعهدات والمعاملات
            </CardTitle>
            <Button onClick={() => setShowAddTemplateDialog(true)} className="button-rtl">
              <Plus className="h-4 w-4" />
              إضافة نموذج
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم النموذج</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>أنواع المعاملات</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الحقول</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإصدار</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إلزامي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="text-right">
                      <Badge className="font-mono">{template.code}</Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      {template.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        style={{
                          fontFamily: 'Tajawal, sans-serif',
                          background: template.type === 'تعهد المكتب' ? '#fef3c7' : template.type === 'تعهد المالك' ? '#dcfce7' : '#e0e7ff',
                          color: template.type === 'تعهد المكتب' ? '#92400e' : template.type === 'تعهد المالك' ? '#166534' : '#3730a3',
                          border: `1px solid ${template.type === 'تعهد المكتب' ? '#fcd34d' : template.type === 'تعهد المالك' ? '#86efac' : '#a5b4fc'}`
                        }}
                      >
                        {template.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 flex-wrap">
                        {template.transactionTypes.slice(0, 2).map((type, idx) => (
                          <Badge key={idx} variant="outline" className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {type}
                          </Badge>
                        ))}
                        {template.transactionTypes.length > 2 && (
                          <Badge variant="outline" className="text-[10px]">
                            +{template.transactionTypes.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono" style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af' }}>
                        {template.fields.length}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-mono text-[11px]">
                        v{template.version}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {template.isRequired ? (
                        <Badge style={{ background: '#dcfce7', color: '#166534' }}>إلزامي</Badge>
                      ) : (
                        <Badge variant="outline" style={{ color: '#6b7280' }}>اختياري</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {template.isActive ? (
                        <Badge style={{ background: '#dcfce7', color: '#166534' }}>نشط</Badge>
                      ) : (
                        <Badge variant="outline" style={{ color: '#6b7280' }}>غير نشط</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  // ===== تاب إعدادات المهام المسبقة =====
  const renderPresetTasksTab = () => (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي المهام</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1e40af' }}>
                  {presetTasks.length}
                </p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أولوية عالية</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#991b1b' }}>
                  {presetTasks.filter(t => t.priority === 'عالية').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أولوية متوسطة</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#92400e' }}>
                  {presetTasks.filter(t => t.priority === 'متوسطة').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مهام نشطة</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#166534' }}>
                  {presetTasks.filter(t => t.isActive).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-700 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الجدول */}
      <Card className="card-rtl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              المهام المسبقة المعدّة
            </CardTitle>
            <Button onClick={() => setShowAddTaskDialog(true)} className="button-rtl">
              <Plus className="h-4 w-4" />
              إضافة مهمة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المهمة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المجموعة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة المتوقعة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>يتطلب موافقة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسند إليه</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {presetTasks
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="text-right">
                        <Badge className="font-mono">{task.code}</Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                        {task.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {task.group.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-mono" style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af' }}>
                          {task.estimatedDuration} يوم
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          style={{
                            fontFamily: 'Tajawal, sans-serif',
                            background: task.priority === 'عالية' ? '#fee2e2' : task.priority === 'متوسطة' ? '#fef3c7' : '#e0e7ff',
                            color: task.priority === 'عالية' ? '#991b1b' : task.priority === 'متوسطة' ? '#92400e' : '#3730a3',
                            border: `1px solid ${task.priority === 'عالية' ? '#fca5a5' : task.priority === 'متوسطة' ? '#fcd34d' : '#a5b4fc'}`
                          }}
                        >
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {task.requiresApproval ? (
                          <Badge style={{ background: '#dcfce7', color: '#166534' }}>
                            <CheckCircle className="h-3 w-3 ml-1" />
                            يتطلب
                          </Badge>
                        ) : (
                          <Badge variant="outline" style={{ color: '#6b7280' }}>لا يتطلب</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>
                        {task.assignToRole || 'غير محدد'}
                      </TableCell>
                      <TableCell className="text-right">
                        {task.isActive ? (
                          <Badge style={{ background: '#dcfce7', color: '#166534' }}>نشط</Badge>
                        ) : (
                          <Badge variant="outline" style={{ color: '#6b7280' }}>غير نشط</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  // ===== تاب أنواع المعاملات =====
  const renderTransactionTypesTab = () => (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الأنواع</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1e40af' }}>
                  {transactionTypes.length}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أنواع نشطة</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#166534' }}>
                  {transactionTypes.filter(t => t.isActive).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أنواع غير نشطة</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#92400e' }}>
                  {transactionTypes.filter(t => !t.isActive).length}
                </p>
              </div>
              <Pause className="h-8 w-8 text-yellow-700 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الجدول */}
      <Card className="card-rtl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              أنواع المعاملات المعتمدة
            </CardTitle>
            <Button onClick={() => setShowAddTransactionTypeDialog(true)} className="button-rtl">
              <Plus className="h-4 w-4" />
              إضافة نوع معاملة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم بالعربية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم بالإنجليزية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اللون</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الترتيب</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الإنشاء</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionTypes
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="text-right">
                        <Badge className="font-mono">{type.code}</Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                        {type.nameAr}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Arial, sans-serif' }}>
                        {type.nameEn}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', maxWidth: '300px' }}>
                        {type.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <div 
                            style={{ 
                              width: '24px', 
                              height: '24px', 
                              borderRadius: '6px', 
                              background: type.color,
                              border: '2px solid rgba(0,0,0,0.1)'
                            }} 
                          />
                          <span className="font-mono text-xs" style={{ color: '#6b7280' }}>
                            {type.color}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-mono" style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af' }}>
                          #{type.displayOrder}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {type.isActive ? (
                          <Badge style={{ background: '#dcfce7', color: '#166534' }}>نشط</Badge>
                        ) : (
                          <Badge variant="outline" style={{ color: '#6b7280' }}>غير نشط</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>
                        {type.createdDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ paddingTop: '40px', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
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
              <Settings 
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
                  إعدادات المعاملات
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
                    701
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
                إدارة شاملة لجميع إعدادات نظام المعاملات
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
                {TABS_CONFIG.length} تبويباً
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        {/* السايد بار */}
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* المحتوى */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', padding: '0 20px 20px 20px' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TransactionsSettings_Complete_701_v11;
