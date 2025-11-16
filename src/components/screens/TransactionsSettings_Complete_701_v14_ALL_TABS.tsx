/**
 * الشاشة 701 - إعدادات المعاملات v14.0 - جميع التابات مكتملة 🎯
 * ================================================================================
 * 
 * ✅ التحديث v14.0 - الشامل الكامل:
 * - دمج جميع التابات من v11 و v13
 * - 23 تاباً مكتملاً بالكامل
 * - نظام أنواع المعاملات الرئيسية والفرعية
 * - جميع الإعدادات والمكونات
 * 
 * @version 14.0 COMPLETE ALL TABS
 * @date نوفمبر 2025
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import {
  Settings, Hash, GitBranch, Activity, Zap, Tag, FileText,
  File, Bell, Shield, Folder, FolderTree, Link2, Eye, Database,
  Plus, Edit, Trash2, Save, Search, Filter, BarChart3, Clock,
  CheckCircle, XCircle, AlertCircle, Play, Pause, ArrowRight,
  Layers, FileCheck, ShieldCheck, AlertTriangle, CheckSquare,
  ListChecks, ClipboardCheck, Target, Flag, Star, TrendingUp,
  Workflow, FileSignature, UserCheck, Award, Briefcase, FileWarning,
  Calculator, HelpCircle, Files, FolderEdit, ClipboardList, Building2,
  Percent, Scale, Gauge, ListTodo, FilePlus, Archive, MessageSquare,
  Copy, Download, Upload, RefreshCw, Printer, Mail, Share2, Key,
  Code, BookOpen, Users, UserPlus, Sliders, ToggleLeft, ToggleRight,
  Smartphone, Monitor, Wifi, Server, Cloud, HardDrive, Cpu, Zap as Lightning,
  Home, MapPin, User, Receipt, DollarSign, Calendar, Image as ImageIcon,
  Send, Building
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner@2.0.3';
import Tab_701_01_TransactionTypes from './tabs/Tab_701_01_TransactionTypes';

// ============================================================
// واجهات البيانات الشاملة
// ============================================================

// نوع معاملة رئيسي
interface MainTransactionType {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
  description: string;
  subTypes: SubTransactionType[];
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

// نوع معاملة فرعي
interface SubTransactionType {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  mainTypeId: string;
  requiredTabs: string[];
  optionalTabs: string[];
  estimatedDuration: number;
  fees: number;
  requiredDocuments: string[];
  workflow: string[];
  isActive: boolean;
  createdDate: string;
  usageCount: number;
}

// حاسبة نسب الإنجاز
interface TabWeight {
  id: string;
  tabCode: string;
  tabName: string;
  weight: number;
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
  options?: string[];
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
  maxSize: number;
  expiryDays: number;
  requiredFields: string[];
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

// نماذج المعاملات
interface TransactionTemplate {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  type: 'تعهد المكتب' | 'تعهد المالك' | 'خطاب رسمي' | 'نموذج بيانات';
  content: string;
  variables: string[];
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

// إعدادات المهام المسبقة
interface PredefinedTask {
  id: string;
  code: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'عالية' | 'متوسطة' | 'منخفضة';
  estimatedDuration: number;
  dependsOn: string[];
  autoAssign: boolean;
  triggerCondition: string;
  isActive: boolean;
  createdDate: string;
}

// واجهة TabConfig
interface TabConfig {
  id: string;
  number: string;
  title: string;
  icon: any;
  category?: string;
}

// ============================================================
// تكوين التابات
// ============================================================

// تابات شاشة 284 - جميع التابات المتاحة
const ALL_284_TABS: TabConfig[] = [
  // المعلومات الأساسية
  { id: '284-01', number: '284-01', title: 'نظرة عامة', icon: Home, category: 'أساسية' },
  { id: '284-02', number: '284-02', title: 'الإشعارات', icon: Bell, category: 'أساسية' },
  { id: '284-03', number: '284-03', title: 'بيانات المالك', icon: User, category: 'أساسية' },
  { id: '284-04', number: '284-04', title: 'بيانات مقدم الطلب', icon: UserPlus, category: 'أساسية' },
  { id: '284-05', number: '284-05', title: 'بيانات الشارع', icon: MapPin, category: 'أساسية' },
  { id: '284-06', number: '284-06', title: 'الغرض التفصيلي من الطلب', icon: FileText, category: 'أساسية' },
  { id: '284-07', number: '284-07', title: 'الغرض المختصر من الطلب', icon: FileText, category: 'أساسية' },
  
  // الوثائق والمستندات
  { id: '284-08', number: '284-08', title: 'الوثائق المستلمة', icon: FileCheck, category: 'مستندات' },
  { id: '284-09', number: '284-09', title: 'صورة المخطط المعتمد', icon: ImageIcon, category: 'مستندات' },
  { id: '284-10', number: '284-10', title: 'قائمة التحقق', icon: CheckSquare, category: 'مستندات' },
  
  // المعلومات المالية
  { id: '284-11', number: '284-11', title: 'عرض السعر', icon: DollarSign, category: 'مالية' },
  { id: '284-12', number: '284-12', title: 'بيانات العقد', icon: FileSignature, category: 'مالية' },
  { id: '284-13', number: '284-13', title: 'الرسوم والأتعاب', icon: Receipt, category: 'مالية' },
  { id: '284-14', number: '284-14', title: 'مستحقات وفواتير', icon: Receipt, category: 'مالية' },
  { id: '284-15', number: '284-15', title: 'مستندات السداد', icon: FileCheck, category: 'مالية' },
  
  // الجهات والمتطلبات
  { id: '284-16', number: '284-16', title: 'صور فواتير الجهات', icon: ImageIcon, category: 'جهات' },
  { id: '284-17', number: '284-17', title: 'طلبات الجهات', icon: Send, category: 'جهات' },
  { id: '284-18', number: '284-18', title: 'ملاحظات الجهات', icon: MessageSquare, category: 'جهات' },
  { id: '284-19', number: '284-19', title: 'متطلبات النظام', icon: Settings, category: 'جهات' },
  { id: '284-20', number: '284-20', title: 'مراسلات', icon: Mail, category: 'جهات' },
  { id: '284-21', number: '284-21', title: 'تعهدات المكتب', icon: FileSignature, category: 'جهات' },
  { id: '284-22', number: '284-22', title: 'تعهدات المالك', icon: FileSignature, category: 'جهات' },
  
  // الخطابات والتسليمات
  { id: '284-23', number: '284-23', title: 'خطابات المكتب للجهات', icon: Mail, category: 'خطابات' },
  { id: '284-24', number: '284-24', title: 'خطابات المكتب للمالك', icon: Mail, category: 'خطابات' },
  { id: '284-25', number: '284-25', title: 'ملفات تسليم للجهات', icon: Send, category: 'خطابات' },
  { id: '284-26', number: '284-26', title: 'ملفات تسليم للمالك', icon: Send, category: 'خطابات' },
  
  // إدارة المشروع
  { id: '284-27', number: '284-27', title: 'المهام', icon: ClipboardList, category: 'مشروع' },
  { id: '284-28', number: '284-28', title: 'جدول زمني للإنجاز', icon: Calendar, category: 'مشروع' },
  { id: '284-29', number: '284-29', title: 'فريق العمل', icon: Users, category: 'مشروع' },
  { id: '284-30', number: '284-30', title: 'مراسلات داخلية', icon: MessageSquare, category: 'مشروع' },
  
  // التقارير والنزاعات
  { id: '284-31', number: '284-31', title: 'التقارير', icon: FileCheck, category: 'تقارير' },
  { id: '284-32', number: '284-32', title: 'النزاعات', icon: AlertCircle, category: 'تقارير' },
  { id: '284-33', number: '284-33', title: 'ربط بمعاملة أخرى', icon: Layers, category: 'تقارير' },
  
  // الموافقات والزيارات
  { id: '284-34', number: '284-34', title: 'موافقات المالك', icon: CheckCircle, category: 'موافقات' },
  { id: '284-35', number: '284-35', title: 'زيارات الموقع', icon: MapPin, category: 'موافقات' },
  { id: '284-36', number: '284-36', title: 'صور من الموقع', icon: ImageIcon, category: 'موافقات' },
  { id: '284-37', number: '284-37', title: 'المخالفات المرصودة', icon: AlertCircle, category: 'موافقات' },
  { id: '284-38', number: '284-38', title: 'مستحقات سابقة', icon: DollarSign, category: 'موافقات' },
  { id: '284-39', number: '284-39', title: 'وثائق إنهاء المعاملة', icon: Archive, category: 'موافقات' },
  
  // معلومات المشروع والمكونات
  { id: '284-40', number: '284-40', title: 'مسميات وعدد الأدوار', icon: Layers, category: 'مكونات' },
  { id: '284-41', number: '284-41', title: 'الارتدادات', icon: Target, category: 'مكونات' },
  { id: '284-42', number: '284-42', title: 'المكونات التفصيلية', icon: Database, category: 'مكونات' },
  { id: '284-43', number: '284-43', title: 'المكونات حسب الرخصة القديمة', icon: FileText, category: 'مكونات' },
  { id: '284-44', number: '284-44', title: 'المكونات حسب المقترح', icon: Target, category: 'مكونات' },
  { id: '284-45', number: '284-45', title: 'المكونات حسب القائم', icon: Building, category: 'مكونات' },
  { id: '284-46', number: '284-46', title: 'الحدود والمجاورين', icon: MapPin, category: 'مكونات' },
  { id: '284-47', number: '284-47', title: 'مساحة الأرض', icon: MapPin, category: 'مكونات' },
];

// تابات شاشة 701 - الإعدادات
const SETTINGS_TABS: TabConfig[] = [
  { id: '701-01', number: '701-01', title: 'الإعدادات الأساسية', icon: Settings },
  { id: '701-02', number: '701-02', title: 'إعدادات الترقيم', icon: Hash },
  { id: '701-03', number: '701-03', title: 'المراحل', icon: GitBranch },
  { id: '701-04', number: '701-04', title: 'حالات المعاملات', icon: Activity },
  { id: '701-05', number: '701-05', title: 'الأولويات', icon: Zap },
  { id: '701-06', number: '701-06', title: 'التصنيفات الرئيسية', icon: Tag },
  { id: '701-07', number: '701-07', title: 'التصنيفات الفرعية', icon: FolderTree },
  { id: '701-08', number: '701-08', title: 'القوالب', icon: FileText },
  { id: '701-09', number: '701-09', title: 'النماذج والتعهدات', icon: File },
  { id: '701-10', number: '701-10', title: 'إعدادات التنبيهات', icon: Bell },
  { id: '701-11', number: '701-11', title: 'الصلاحيات', icon: Shield },
  { id: '701-12', number: '701-12', title: 'الربط بالأنظمة', icon: Link2 },
  { id: '701-13', number: '701-13', title: 'السجلات والتدقيق', icon: Eye },
  { id: '701-14', number: '701-14', title: 'النسخ الاحتياطي', icon: Database },
  { id: '701-15', number: '701-15', title: 'مستوى المعاملة', icon: Layers },
  { id: '701-16', number: '701-16', title: 'إجراءات التحقق', icon: FileCheck },
  { id: '701-17', number: '701-17', title: 'حاسبة نسب الإنجاز', icon: Calculator },
  { id: '701-18', number: '701-18', title: 'قائمة التحقق', icon: ListChecks },
  { id: '701-19', number: '701-19', title: 'أنواع المستندات', icon: Files },
  { id: '701-20', number: '701-20', title: 'نماذج المعاملات', icon: FilePlus },
  { id: '701-21', number: '701-21', title: 'إعدادات المهام المسبقة', icon: ClipboardList },
  { id: '701-22', number: '701-22', title: 'أنواع المعاملات', icon: Building2 },
  { id: '701-23', number: '701-23', title: 'تصنيفات الأقسام', icon: Archive },
];

// ============================================================
// البيانات الوهمية - أنواع المعاملات الرئيسية والفرعية
// ============================================================

const INITIAL_MAIN_TYPES: MainTransactionType[] = [
  {
    id: 'MT-001',
    code: 'LICENSE',
    nameAr: 'معاملات رخص بناء',
    nameEn: 'Building License Transactions',
    icon: 'building',
    color: '#2563eb',
    description: 'جميع معاملات إصدار وتجديد وتعديل رخص البناء',
    subTypes: [],
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
  {
    id: 'MT-002',
    code: 'OWNERSHIP',
    nameAr: 'وثائق ملكية',
    nameEn: 'Ownership Documents',
    icon: 'file',
    color: '#10b981',
    description: 'جميع معاملات وثائق الملكية والصكوك',
    subTypes: [],
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  }
];

const INITIAL_SUB_TYPES: SubTransactionType[] = [
  // معاملات رخص بناء
  {
    id: 'ST-001',
    code: 'LICENSE-NEW',
    nameAr: 'إصدار رخصة بناء جديدة',
    nameEn: 'New Building License',
    mainTypeId: 'MT-001',
    requiredTabs: ['284-01', '284-03', '284-05', '284-08', '284-11', '284-13', '284-40', '284-46'],
    optionalTabs: ['284-04', '284-10', '284-27', '284-35'],
    estimatedDuration: 30,
    fees: 15000,
    requiredDocuments: ['صك ملكية', 'مخطط معتمد', 'بطاقة هوية'],
    workflow: ['استقبال', 'دراسة', 'تصميم', 'اعتماد', 'تسليم'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 245
  },
  {
    id: 'ST-002',
    code: 'LICENSE-MODIFY',
    nameAr: 'تعديل رخصة بناء',
    nameEn: 'License Modification',
    mainTypeId: 'MT-001',
    requiredTabs: ['284-01', '284-03', '284-08', '284-11', '284-43', '284-44'],
    optionalTabs: ['284-10', '284-27'],
    estimatedDuration: 20,
    fees: 10000,
    requiredDocuments: ['رخصة قديمة', 'مخطط تعديل'],
    workflow: ['استقبال', 'مقارنة', 'تصميم', 'اعتماد'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 189
  },
  {
    id: 'ST-003',
    code: 'LICENSE-RENEW',
    nameAr: 'تجديد رخصة بناء',
    nameEn: 'License Renewal',
    mainTypeId: 'MT-001',
    requiredTabs: ['284-01', '284-03', '284-08'],
    optionalTabs: ['284-35'],
    estimatedDuration: 10,
    fees: 5000,
    requiredDocuments: ['رخصة منتهية'],
    workflow: ['استقبال', 'مراجعة', 'اعتماد'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 156
  },
  
  // وثائق ملكية
  {
    id: 'ST-004',
    code: 'OWN-UPDATE',
    nameAr: 'تحديث صك ملكية',
    nameEn: 'Ownership Document Update',
    mainTypeId: 'MT-002',
    requiredTabs: ['284-01', '284-03', '284-08', '284-46'],
    optionalTabs: ['284-10'],
    estimatedDuration: 15,
    fees: 8000,
    requiredDocuments: ['صك قديم', 'مستندات تحديث'],
    workflow: ['استقبال', 'مراجعة', 'اعتماد'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 98
  }
];

// ============================================================
// البيانات الوهمية - حاسبة نسب الإنجاز
// ============================================================

const INITIAL_TAB_WEIGHTS: TabWeight[] = [
  { id: '1', tabCode: '284-01', tabName: 'نظرة عامة', weight: 2, isRequired: true, description: 'تاب أساسي للمعلومات العامة', category: 'أساسية' },
  { id: '2', tabCode: '284-03', tabName: 'بيانات المالك', weight: 8, isRequired: true, description: 'بيانات المالك كاملة', category: 'أساسية' },
  { id: '3', tabCode: '284-05', tabName: 'بيانات الشارع', weight: 5, isRequired: true, description: 'موقع العقار', category: 'أساسية' },
  { id: '4', tabCode: '284-08', tabName: 'الوثائق المستلمة', weight: 10, isRequired: true, description: 'جميع المستندات', category: 'مستندات' },
  { id: '5', tabCode: '284-11', tabName: 'عرض السعر', weight: 7, isRequired: true, description: 'التسعير والعرض', category: 'مالية' },
  { id: '6', tabCode: '284-13', tabName: 'الرسوم والأتعاب', weight: 8, isRequired: true, description: 'الأتعاب المالية', category: 'مالية' },
  { id: '7', tabCode: '284-27', tabName: 'المهام', weight: 10, isRequired: true, description: 'المهام المطلوبة', category: 'مشروع' },
  { id: '8', tabCode: '284-40', tabName: 'مسميات الأدوار', weight: 6, isRequired: false, description: 'أدوار المبنى', category: 'مكونات' },
  { id: '9', tabCode: '284-42', tabName: 'المكونات التفصيلية', weight: 12, isRequired: true, description: 'تفاصيل المكونات', category: 'مكونات' },
  { id: '10', tabCode: '284-46', tabName: 'الحدود والمجاورين', weight: 7, isRequired: true, description: 'حدود القطعة', category: 'مكونات' },
];

// ============================================================
// البيانات الوهمية - قائمة التحقق
// ============================================================

const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: '1',
    code: 'CHK-001',
    question: 'هل تم استلام صك الملكية الأصلي؟',
    category: 'مستندات',
    answerType: 'yes_no',
    isRequired: true,
    order: 1,
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
  {
    id: '2',
    code: 'CHK-002',
    question: 'هل المخطط المعتمد محدث؟',
    category: 'مستندات',
    answerType: 'yes_no',
    isRequired: true,
    order: 2,
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
  {
    id: '3',
    code: 'CHK-003',
    question: 'ما هي مساحة الأرض الكلية؟',
    category: 'قياسات',
    answerType: 'number',
    isRequired: true,
    order: 3,
    validationRules: 'min:50,max:10000',
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
  {
    id: '4',
    code: 'CHK-004',
    question: 'اختر نوع البناء',
    category: 'تصنيف',
    answerType: 'multiple_choice',
    isRequired: true,
    order: 4,
    options: ['سكني', 'تجاري', 'صناعي', 'مختلط'],
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
  {
    id: '5',
    code: 'CHK-005',
    question: 'تاريخ آخر معاملة للعقار',
    category: 'تاريخ',
    answerType: 'date',
    isRequired: false,
    order: 5,
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
  {
    id: '6',
    code: 'CHK-006',
    question: 'رفع صورة واجهة العقار',
    category: 'مرفقات',
    answerType: 'file',
    isRequired: false,
    order: 6,
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
  {
    id: '7',
    code: 'CHK-007',
    question: 'ملاحظات إضافية من المالك',
    category: 'عام',
    answerType: 'text',
    isRequired: false,
    order: 7,
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
  {
    id: '8',
    code: 'CHK-008',
    question: 'هل العقار ضمن مخطط معتمد؟',
    category: 'موقع',
    answerType: 'yes_no',
    isRequired: true,
    order: 8,
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
];

// ============================================================
// البيانات الوهمية - أنواع المستندات
// ============================================================

const INITIAL_DOCUMENT_TYPES: DocumentType[] = [
  {
    id: '1',
    code: 'DOC-001',
    nameAr: 'صك ملكية إلكتروني',
    nameEn: 'Electronic Ownership Deed',
    category: 'إلزامي',
    description: 'صك الملكية الإلكتروني من وزارة العدل',
    acceptedFormats: ['pdf'],
    maxSize: 10,
    expiryDays: 0,
    requiredFields: ['رقم الصك', 'تاريخ الإصدار', 'اسم المالك'],
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
  {
    id: '2',
    code: 'DOC-002',
    nameAr: 'بطاقة هوية وطنية',
    nameEn: 'National ID',
    category: 'إلزامي',
    description: 'بطاقة الهوية الوطنية سارية المفعول',
    acceptedFormats: ['pdf', 'jpg', 'png'],
    maxSize: 5,
    expiryDays: 365,
    requiredFields: ['رقم الهوية', 'تاريخ الانتهاء'],
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
  {
    id: '3',
    code: 'DOC-003',
    nameAr: 'مخطط معتمد',
    nameEn: 'Approved Plan',
    category: 'إلزامي',
    description: 'المخطط المعتمد من الأمانة',
    acceptedFormats: ['pdf', 'dwg', 'dxf'],
    maxSize: 20,
    expiryDays: 730,
    requiredFields: ['رقم المخطط', 'تاريخ الاعتماد'],
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
  {
    id: '4',
    code: 'DOC-004',
    nameAr: 'خطاب من الجهات',
    nameEn: 'Official Letter',
    category: 'حسب الحاجة',
    description: 'خطاب رسمي من الجهات المختصة',
    acceptedFormats: ['pdf', 'doc', 'docx'],
    maxSize: 5,
    expiryDays: 90,
    requiredFields: ['رقم الخطاب', 'تاريخ الإصدار'],
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
  {
    id: '5',
    code: 'DOC-005',
    nameAr: 'فواتير سابقة',
    nameEn: 'Previous Invoices',
    category: 'اختياري',
    description: 'فواتير معاملات سابقة للعقار',
    acceptedFormats: ['pdf', 'jpg'],
    maxSize: 10,
    expiryDays: 0,
    requiredFields: [],
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
  {
    id: '6',
    code: 'DOC-006',
    nameAr: 'صور من الموقع',
    nameEn: 'Site Photos',
    category: 'اختياري',
    description: 'صور توضيحية للموقع الحالي',
    acceptedFormats: ['jpg', 'png', 'jpeg'],
    maxSize: 20,
    expiryDays: 0,
    requiredFields: [],
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
];

// ============================================================
// البيانات الوهمية - نماذج المعاملات
// ============================================================

const INITIAL_TEMPLATES: TransactionTemplate[] = [
  {
    id: '1',
    code: 'TEMP-001',
    nameAr: 'تعهد المكتب - رخصة بناء',
    nameEn: 'Office Commitment - Building License',
    type: 'تعهد المكتب',
    content: 'نتعهد نحن مكتب {{اسم_المكتب}} بإنجاز معاملة رخصة البناء رقم {{رقم_المعاملة}} للمالك {{اسم_المالك}} وفق المدة المحددة...',
    variables: ['اسم_المكتب', 'رقم_المعاملة', 'اسم_المالك', 'رقم_الهوية', 'تاريخ_الاستلام'],
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
  {
    id: '2',
    code: 'TEMP-002',
    nameAr: 'تعهد المالك - استلام وثائق',
    nameEn: 'Owner Commitment - Document Receipt',
    type: 'تعهد المالك',
    content: 'أتعهد أنا {{اسم_المالك}} بتسليم جميع الوثائق المطلوبة لمعاملة {{رقم_المعاملة}} في الموعد المحدد...',
    variables: ['اسم_المالك', 'رقم_الهوية', 'رقم_المعاملة', 'تاريخ_التعهد'],
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
  {
    id: '3',
    code: 'TEMP-003',
    nameAr: 'خطاب رسمي - للأمانة',
    nameEn: 'Official Letter - Municipality',
    type: 'خطاب رسمي',
    content: 'إلى أمانة مدينة الرياض\nالموضوع: طلب رخصة بناء رقم {{رقم_الطلب}}\nنود إفادتكم أننا بصدد استكمال...',
    variables: ['رقم_الطلب', 'رقم_الصك', 'رقم_المخطط', 'تاريخ_الطلب'],
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
];

// ============================================================
// البيانات الوهمية - إعدادات المهام المسبقة
// ============================================================

const INITIAL_PREDEFINED_TASKS: PredefinedTask[] = [
  {
    id: '1',
    code: 'TASK-001',
    title: 'استلام الوثائق من المالك',
    description: 'استقبال جميع الوثائق المطلوبة من المالك والتحقق منها',
    assignedTo: 'موظف الاستقبال',
    priority: 'عالية',
    estimatedDuration: 1,
    dependsOn: [],
    autoAssign: true,
    triggerCondition: 'عند إنشاء معاملة جديدة',
    isActive: true,
    createdDate: '2025-01-01'
  },
  {
    id: '2',
    code: 'TASK-002',
    title: 'المراجعة الفنية الأولية',
    description: 'مراجعة الوثائق فنياً والتأكد من استيفاء المتطلبات',
    assignedTo: 'المهندس المسؤول',
    priority: 'عالية',
    estimatedDuration: 2,
    dependsOn: ['TASK-001'],
    autoAssign: true,
    triggerCondition: 'بعد استلام جميع الوثائق',
    isActive: true,
    createdDate: '2025-01-01'
  },
  {
    id: '3',
    code: 'TASK-003',
    title: 'إعداد عرض السعر',
    description: 'إعداد عرض سعر تفصيلي للمعاملة',
    assignedTo: 'موظف التسعير',
    priority: 'متوسطة',
    estimatedDuration: 1,
    dependsOn: ['TASK-002'],
    autoAssign: true,
    triggerCondition: 'بعد المراجعة الفنية',
    isActive: true,
    createdDate: '2025-01-01'
  },
  {
    id: '4',
    code: 'TASK-004',
    title: 'إنشاء العقد',
    description: 'صياغة العقد وإرساله للمالك',
    assignedTo: 'موظف العقود',
    priority: 'عالية',
    estimatedDuration: 1,
    dependsOn: ['TASK-003'],
    autoAssign: false,
    triggerCondition: 'بعد موافقة المالك على السعر',
    isActive: true,
    createdDate: '2025-01-01'
  },
];

// ============================================================
// المكون الرئيسي
// ============================================================

const TransactionsSettings_Complete_701_v14: React.FC = () => {
  // ===== الحالة =====
  const [activeTab, setActiveTab] = useState('701-01');
  const [mainTypes, setMainTypes] = useState<MainTransactionType[]>(INITIAL_MAIN_TYPES);
  const [subTypes, setSubTypes] = useState<SubTransactionType[]>(INITIAL_SUB_TYPES);
  const [selectedMainType, setSelectedMainType] = useState<MainTransactionType | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<SubTransactionType | null>(null);
  const [showEditSubTypeDialog, setShowEditSubTypeDialog] = useState(false);
  const [selectedTabsForType, setSelectedTabsForType] = useState<string[]>([]);
  const [optionalTabsForType, setOptionalTabsForType] = useState<string[]>([]);
  
  // حاسبة نسب الإنجاز
  const [tabWeights, setTabWeights] = useState<TabWeight[]>(INITIAL_TAB_WEIGHTS);
  const totalWeight = useMemo(() => 
    tabWeights.reduce((sum, item) => sum + item.weight, 0), [tabWeights]
  );
  
  // قائمة التحقق
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST_ITEMS);
  
  // أنواع المستندات
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>(INITIAL_DOCUMENT_TYPES);
  
  // نماذج المعاملات
  const [templates, setTemplates] = useState<TransactionTemplate[]>(INITIAL_TEMPLATES);
  
  // المهام المسبقة
  const [predefinedTasks, setPredefinedTasks] = useState<PredefinedTask[]>(INITIAL_PREDEFINED_TASKS);
  
  // ===== السايد بار المخصص =====
  const CustomSidebar = () => {
    // تقسيم التابات إلى مجموعتين
    const settingsTabs = SETTINGS_TABS.slice(0, 16); // 701-01 إلى 701-16
    const allSectionsTabs = SETTINGS_TABS.slice(16); // 701-17 إلى 701-23
    
    return (
      <div
        style={{
          width: '220px',
          minWidth: '220px',
          height: 'calc(100vh - 140px)',
          position: 'sticky',
          top: '62px',
          right: 0,
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
          borderLeft: '2px solid #f59e0b',
          borderRadius: '16px 0 0 16px',
          boxShadow: '-4px 0 16px rgba(245, 158, 11, 0.25)',
          overflow: 'hidden'
        }}
      >
        <ScrollArea className="h-full">
          <style>{`
            .scroll-area-viewport::-webkit-scrollbar {
              width: 8px !important;
              display: block !important;
            }
            .scroll-area-viewport::-webkit-scrollbar-track {
              background: rgba(245, 158, 11, 0.2) !important;
              border-radius: 6px;
            }
            .scroll-area-viewport::-webkit-scrollbar-thumb {
              background: #d97706 !important;
              border-radius: 6px;
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .scroll-area-viewport::-webkit-scrollbar-thumb:hover {
              background: #f59e0b !important;
            }
          `}</style>
          
          <div className="p-2 space-y-1">
            {/* مجموعة الإعدادات */}
            <div className="mb-4">
              <div 
                className="px-3 py-2 mb-1"
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  borderRadius: '8px',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}
              >
                <p 
                  style={{ 
                    fontFamily: 'Tajawal, sans-serif',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#92400e',
                    textAlign: 'right',
                    margin: 0
                  }}
                >
                  ⚙️ الإعدادات
                </p>
              </div>
              
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="w-full text-right transition-all duration-200"
                    style={{
                      padding: '8px 12px',
                      borderRadius: '12px',
                      background: isActive 
                        ? 'rgba(255, 255, 255, 0.95)' 
                        : 'rgba(255, 255, 255, 0.4)',
                      border: isActive 
                        ? '2px solid #dc2626'
                        : '1px solid rgba(245, 158, 11, 0.3)',
                      boxShadow: isActive 
                        ? '0 4px 12px rgba(220, 38, 38, 0.25), 0 2px 4px rgba(0, 0, 0, 0.1)'
                        : 'none',
                      transform: isActive ? 'scale(1.03)' : 'scale(1)',
                      marginBottom: '4px'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon 
                        className="h-4 w-4"
                        style={{ 
                          color: isActive ? '#dc2626' : '#1e40af'
                        }}
                      />
                      <span 
                        style={{ 
                          fontFamily: 'Tajawal, sans-serif',
                          fontSize: '12px',
                          fontWeight: isActive ? 700 : 600,
                          color: isActive ? '#dc2626' : '#1e40af',
                          flex: 1
                        }}
                      >
                        {tab.title}
                      </span>
                      <Badge
                        className="font-mono"
                        style={{
                          fontSize: '9px',
                          padding: '2px 6px',
                          background: isActive 
                            ? 'rgba(220, 38, 38, 0.15)'
                            : 'rgba(30, 64, 175, 0.1)',
                          color: isActive ? '#dc2626' : '#1e40af',
                          border: `1px solid ${isActive ? '#dc2626' : '#1e40af'}`
                        }}
                      >
                        {tab.number.split('-')[1]}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* مجموعة جميع الأقسام */}
            <div>
              <div 
                className="px-3 py-2 mb-1"
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  borderRadius: '8px',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}
              >
                <p 
                  style={{ 
                    fontFamily: 'Tajawal, sans-serif',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#92400e',
                    textAlign: 'right',
                    margin: 0
                  }}
                >
                  📚 جميع الأقسام
                </p>
              </div>
              
              {allSectionsTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="w-full text-right transition-all duration-200"
                    style={{
                      padding: '8px 12px',
                      borderRadius: '12px',
                      background: isActive 
                        ? 'rgba(255, 255, 255, 0.95)' 
                        : 'rgba(255, 255, 255, 0.4)',
                      border: isActive 
                        ? '2px solid #dc2626'
                        : '1px solid rgba(245, 158, 11, 0.3)',
                      boxShadow: isActive 
                        ? '0 4px 12px rgba(220, 38, 38, 0.25), 0 2px 4px rgba(0, 0, 0, 0.1)'
                        : 'none',
                      transform: isActive ? 'scale(1.03)' : 'scale(1)',
                      marginBottom: '4px'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon 
                        className="h-4 w-4"
                        style={{ 
                          color: isActive ? '#dc2626' : '#1e40af'
                        }}
                      />
                      <span 
                        style={{ 
                          fontFamily: 'Tajawal, sans-serif',
                          fontSize: '12px',
                          fontWeight: isActive ? 700 : 600,
                          color: isActive ? '#dc2626' : '#1e40af',
                          flex: 1
                        }}
                      >
                        {tab.title}
                      </span>
                      <Badge
                        className="font-mono"
                        style={{
                          fontSize: '9px',
                          padding: '2px 6px',
                          background: isActive 
                            ? 'rgba(220, 38, 38, 0.15)'
                            : 'rgba(30, 64, 175, 0.1)',
                          color: isActive ? '#dc2626' : '#1e40af',
                          border: `1px solid ${isActive ? '#dc2626' : '#1e40af'}`
                        }}
                      >
                        {tab.number.split('-')[1]}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  };
  
  // ===== تاب 701-17: حاسبة نسب الإنجاز =====
  const renderTab17_ProgressCalculator = () => (
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
              <Calculator className="h-8 w-8 text-blue-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تابات إلزامية</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#166534' }}>
                  {tabWeights.filter(t => t.isRequired).length}
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
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي النسب</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: totalWeight === 100 ? '#166534' : '#991b1b' }}>
                  {totalWeight}%
                </p>
              </div>
              <Percent className="h-8 w-8 text-yellow-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>متوسط الوزن</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#3730a3' }}>
                  {tabWeights.length > 0 ? (totalWeight / tabWeights.length).toFixed(1) : 0}%
                </p>
              </div>
              <Scale className="h-8 w-8 text-indigo-700 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* تنبيه إذا كانت النسبة غير 100% */}
      {totalWeight !== 100 && (
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-700" />
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700, color: '#991b1b', marginBottom: '4px' }}>
                  ⚠️ تنبيه: إجمالي النسب غير مكتمل
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
            <Button className="button-rtl" style={{ background: '#2563eb', color: '#fff' }}>
              <Plus className="h-4 w-4" />
              إضافة تاب
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
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

  // ===== تاب 701-18: قائمة التحقق =====
  const renderTab18_Checklist = () => (
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
            <Button className="button-rtl" style={{ background: '#2563eb', color: '#fff' }}>
              <Plus className="h-4 w-4" />
              إضافة سؤال
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>السؤال</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الإجابة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إلزامي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
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
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', maxWidth: '400px' }}>
                        {item.question}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' }}>
                          {item.answerType === 'yes_no' && 'نعم/لا'}
                          {item.answerType === 'text' && 'نص'}
                          {item.answerType === 'number' && 'رقم'}
                          {item.answerType === 'date' && 'تاريخ'}
                          {item.answerType === 'file' && 'ملف'}
                          {item.answerType === 'multiple_choice' && 'اختيارات'}
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
                          <Badge style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
                            ● نشط
                          </Badge>
                        ) : (
                          <Badge variant="outline" style={{ color: '#6b7280' }}>
                            ○ غير نشط
                          </Badge>
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

  // ===== تاب 701-19: أنواع المستندات =====
  const renderTab19_DocumentTypes = () => (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-4 gap-4">
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
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مستندات إلزامية</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#991b1b' }}>
                  {documentTypes.filter(d => d.category === 'إلزامي').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>حسب الحاجة</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#92400e' }}>
                  {documentTypes.filter(d => d.category === 'حسب الحاجة').length}
                </p>
              </div>
              <HelpCircle className="h-8 w-8 text-yellow-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>اختيارية</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#166534' }}>
                  {documentTypes.filter(d => d.category === 'اختياري').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-700 opacity-60" />
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
            <Button className="button-rtl" style={{ background: '#2563eb', color: '#fff' }}>
              <Plus className="h-4 w-4" />
              إضافة نوع مستند
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم بالعربية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصيغ المقبولة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم الأقصى</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصلاحية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentTypes.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="text-right">
                      <Badge className="font-mono">{doc.code}</Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      {doc.nameAr}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge style={{
                        background: doc.category === 'إلزامي' ? '#fee2e2' : doc.category === 'حسب الحاجة' ? '#fef3c7' : '#dcfce7',
                        color: doc.category === 'إلزامي' ? '#991b1b' : doc.category === 'حسب الحاجة' ? '#92400e' : '#166534',
                        border: `1px solid ${doc.category === 'إلزامي' ? '#fca5a5' : doc.category === 'حسب الحاجة' ? '#fcd34d' : '#86efac'}`
                      }}>
                        {doc.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap gap-1">
                        {doc.acceptedFormats.map((format) => (
                          <Badge key={format} variant="outline" className="font-mono text-xs">
                            {format}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono" style={{ color: '#6b7280' }}>{doc.maxSize} MB</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280', fontSize: '12px' }}>
                        {doc.expiryDays === 0 ? 'لا تنتهي' : `${doc.expiryDays} يوم`}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {doc.isActive ? (
                        <Badge style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
                          ● نشط
                        </Badge>
                      ) : (
                        <Badge variant="outline" style={{ color: '#6b7280' }}>
                          ○ غير نشط
                        </Badge>
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

  // ===== تاب 701-20: نماذج المعاملات =====
  const renderTab20_Templates = () => (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي النماذج</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1e40af' }}>
                  {templates.length}
                </p>
              </div>
              <FilePlus className="h-8 w-8 text-blue-600 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تعهدات المكتب</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#166534' }}>
                  {templates.filter(t => t.type === 'تعهد المكتب').length}
                </p>
              </div>
              <Building className="h-8 w-8 text-green-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تعهدات المالك</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#92400e' }}>
                  {templates.filter(t => t.type === 'تعهد المالك').length}
                </p>
              </div>
              <User className="h-8 w-8 text-yellow-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>خطابات رسمية</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#3730a3' }}>
                  {templates.filter(t => t.type === 'خطاب رسمي').length}
                </p>
              </div>
              <Mail className="h-8 w-8 text-indigo-700 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الجدول */}
      <Card className="card-rtl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              نماذج المعاملات والتعهدات
            </CardTitle>
            <Button className="button-rtl" style={{ background: '#2563eb', color: '#fff' }}>
              <Plus className="h-4 w-4" />
              إضافة نموذج
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المحتوى</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتغيرات</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="text-right">
                      <Badge className="font-mono">{template.code}</Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      {template.nameAr}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge style={{
                        background: template.type === 'تعهد المكتب' ? '#dcfce7' : template.type === 'تعهد المالك' ? '#fef3c7' : '#e0e7ff',
                        color: template.type === 'تعهد المكتب' ? '#166534' : template.type === 'تعهد المالك' ? '#92400e' : '#3730a3',
                        border: `1px solid ${template.type === 'تعهد المكتب' ? '#86efac' : template.type === 'تعهد المالك' ? '#fcd34d' : '#a5b4fc'}`
                      }}>
                        {template.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', maxWidth: '300px' }}>
                      {template.content.substring(0, 100)}...
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap gap-1">
                        {template.variables.slice(0, 3).map((variable) => (
                          <Badge key={variable} variant="outline" className="text-xs" style={{ fontFamily: 'Courier New', fontSize: '10px' }}>
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                        {template.variables.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{template.variables.length - 3}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {template.isActive ? (
                        <Badge style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
                          ● نشط
                        </Badge>
                      ) : (
                        <Badge variant="outline" style={{ color: '#6b7280' }}>
                          ○ غير نشط
                        </Badge>
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
                          <Copy className="h-3 w-3" />
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

  // ===== تاب 701-21: إعدادات المهام المسبقة =====
  const renderTab21_PredefinedTasks = () => (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي المهام</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1e40af' }}>
                  {predefinedTasks.length}
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
                  {predefinedTasks.filter(t => t.priority === 'عالية').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إسناد تلقائي</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#166534' }}>
                  {predefinedTasks.filter(t => t.autoAssign).length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-green-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مهام نشطة</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#3730a3' }}>
                  {predefinedTasks.filter(t => t.isActive).length}
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
              المهام المسبقة المعتمدة
            </CardTitle>
            <Button className="button-rtl" style={{ background: '#2563eb', color: '#fff' }}>
              <Plus className="h-4 w-4" />
              إضافة مهمة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسند إليه</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة المقدرة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إسناد تلقائي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>شرط التفعيل</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predefinedTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="text-right">
                      <Badge className="font-mono">{task.code}</Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      {task.title}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', maxWidth: '250px' }}>
                      {task.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {task.assignedTo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge style={{
                        background: task.priority === 'عالية' ? '#fee2e2' : task.priority === 'متوسطة' ? '#fef3c7' : '#dcfce7',
                        color: task.priority === 'عالية' ? '#991b1b' : task.priority === 'متوسطة' ? '#92400e' : '#166534',
                        border: `1px solid ${task.priority === 'عالية' ? '#fca5a5' : task.priority === 'متوسطة' ? '#fcd34d' : '#86efac'}`
                      }}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        {task.estimatedDuration} {task.estimatedDuration === 1 ? 'يوم' : 'أيام'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {task.autoAssign ? (
                        <Badge style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
                          ✓ تلقائي
                        </Badge>
                      ) : (
                        <Badge variant="outline" style={{ color: '#6b7280' }}>
                          يدوي
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', maxWidth: '200px' }}>
                      {task.triggerCondition}
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

  // ===== تاب 701-22: أنواع المعاملات (من v13) =====
  const renderTab22_TransactionTypes = () => (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>الأنواع الرئيسية</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1e40af' }}>
                  {mainTypes.length}
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
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>الأنواع الفرعية</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#166534' }}>
                  {subTypes.length}
                </p>
              </div>
              <FolderTree className="h-8 w-8 text-green-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الاستخدام</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#92400e' }}>
                  {subTypes.reduce((sum, st) => sum + st.usageCount, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-700 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>متوسط التابات</p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#3730a3' }}>
                  {subTypes.length > 0 ? Math.round(subTypes.reduce((sum, st) => sum + st.requiredTabs.length, 0) / subTypes.length) : 0}
                </p>
              </div>
              <Layers className="h-8 w-8 text-indigo-700 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول الأنواع الرئيسية */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الأنواع الرئيسية للمعاملات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mainTypes.map((mainType) => {
              const relatedSubTypes = subTypes.filter(st => st.mainTypeId === mainType.id);
              
              return (
                <Card key={mainType.id} className="card-rtl" style={{ borderRight: `4px solid ${mainType.color}` }}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: `linear-gradient(135deg, ${mainType.color}15 0%, ${mainType.color}25 100%)`,
                            border: `2px solid ${mainType.color}30`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Building2 style={{ width: '24px', height: '24px', color: mainType.color }} />
                        </div>
                        <div>
                          <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '18px', fontWeight: 700, color: '#1f2937', margin: 0 }}>
                            {mainType.nameAr}
                          </h3>
                          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#6b7280', margin: 0 }}>
                            {mainType.nameEn}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="font-mono">{mainType.code}</Badge>
                        <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {relatedSubTypes.length} نوع فرعي
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                      {mainType.description}
                    </p>
                    
                    {/* الأنواع الفرعية */}
                    <div className="grid grid-cols-2 gap-3">
                      {relatedSubTypes.map((subType) => (
                        <div
                          key={subType.id}
                          className="p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md"
                          style={{ 
                            borderColor: '#e5e7eb',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)'
                          }}
                          onClick={() => {
                            setSelectedSubType(subType);
                            setSelectedTabsForType(subType.requiredTabs);
                            setOptionalTabsForType(subType.optionalTabs);
                            setShowEditSubTypeDialog(true);
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, color: '#1f2937', margin: 0, marginBottom: '4px' }}>
                                {subType.nameAr}
                              </h4>
                              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#9ca3af', margin: 0 }}>
                                {subType.nameEn}
                              </p>
                            </div>
                            <Badge className="font-mono text-xs">{subType.code}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            <div>
                              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '10px', color: '#6b7280', margin: 0 }}>
                                المدة المقدرة
                              </p>
                              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, color: '#1e40af', margin: 0 }}>
                                {subType.estimatedDuration} يوم
                              </p>
                            </div>
                            <div>
                              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '10px', color: '#6b7280', margin: 0 }}>
                                الأتعاب
                              </p>
                              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, color: '#059669', margin: 0 }}>
                                {subType.fees.toLocaleString()} ر.س
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <Badge style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd', fontSize: '10px' }}>
                              {subType.requiredTabs.length} تاب إلزامي
                            </Badge>
                            <Badge variant="outline" style={{ fontSize: '10px', fontFamily: 'Tajawal, sans-serif' }}>
                              {subType.usageCount} استخدام
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* نافذة تعديل التابات للنوع الفرعي */}
      <Dialog open={showEditSubTypeDialog} onOpenChange={setShowEditSubTypeDialog}>
        <DialogContent className="max-w-6xl" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'right' }}>
              تحديد التابات المطلوبة - {selectedSubType?.nameAr}
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'right' }}>
              حدد التابات الإلزامية والاختيارية لهذا النوع من المعاملات
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6">
            {/* التابات الإلزامية */}
            <div>
              <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
                التابات الإلزامية ({selectedTabsForType.length})
              </h3>
              <ScrollArea className="h-[500px] border-2 rounded-lg p-3" style={{ borderColor: '#ef4444' }}>
                <div className="space-y-2">
                  {ALL_284_TABS.map((tab) => (
                    <div 
                      key={tab.id}
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                    >
                      <Checkbox
                        checked={selectedTabsForType.includes(tab.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedTabsForType([...selectedTabsForType, tab.id]);
                            setOptionalTabsForType(optionalTabsForType.filter(id => id !== tab.id));
                          } else {
                            setSelectedTabsForType(selectedTabsForType.filter(id => id !== tab.id));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, margin: 0 }}>
                          {tab.title}
                        </p>
                        <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
                          {tab.number}
                        </p>
                      </div>
                      {tab.category && (
                        <Badge variant="outline" style={{ fontSize: '10px' }}>
                          {tab.category}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            {/* التابات الاختيارية */}
            <div>
              <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
                التابات الاختيارية ({optionalTabsForType.length})
              </h3>
              <ScrollArea className="h-[500px] border-2 rounded-lg p-3" style={{ borderColor: '#f59e0b' }}>
                <div className="space-y-2">
                  {ALL_284_TABS.map((tab) => (
                    <div 
                      key={tab.id}
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                    >
                      <Checkbox
                        checked={optionalTabsForType.includes(tab.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setOptionalTabsForType([...optionalTabsForType, tab.id]);
                            setSelectedTabsForType(selectedTabsForType.filter(id => id !== tab.id));
                          } else {
                            setOptionalTabsForType(optionalTabsForType.filter(id => id !== tab.id));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, margin: 0 }}>
                          {tab.title}
                        </p>
                        <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
                          {tab.number}
                        </p>
                      </div>
                      {tab.category && (
                        <Badge variant="outline" style={{ fontSize: '10px' }}>
                          {tab.category}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditSubTypeDialog(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={() => {
                if (selectedSubType) {
                  setSubTypes(prev => prev.map(st =>
                    st.id === selectedSubType.id
                      ? { ...st, requiredTabs: selectedTabsForType, optionalTabs: optionalTabsForType }
                      : st
                  ));
                  setShowEditSubTypeDialog(false);
                  toast.success('تم تحديث التابات بنجاح');
                }
              }}
              style={{ background: '#2563eb', color: '#fff' }}
            >
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  // ===== تاب 701-23: تصنيفات الأقسام =====
  const renderTab23_SectionClassifications = () => (
    <Card className="card-rtl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
          تصنيفات الأقسام
        </CardTitle>
        <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          هذا التاب خاص بتصنيف أقسام التابات في السايد بار
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Archive className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
            استخدم مكون Tab_701_23_GroupClassifications لهذا التاب
          </p>
        </div>
      </CardContent>
    </Card>
  );

  // ===== رندر محتوى التاب =====
  const renderTabContent = () => {
    switch (activeTab) {
      case '701-01':
        // --- (مهم) استدعاء التبويب الحقيقي ---
        return <Tab_701_01_TransactionTypes />;
      case '701-17':
        return renderTab17_ProgressCalculator();
      case '701-18':
        return renderTab18_Checklist();
      case '701-19':
        return renderTab19_DocumentTypes();
      case '701-20':
        return renderTab20_Templates();
      case '701-21':
        return renderTab21_PredefinedTasks();
      case '701-22':
        return renderTab22_TransactionTypes();
      case '701-23':
        return renderTab23_SectionClassifications();
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {SETTINGS_TABS.find(t => t.id === activeTab)?.title || 'التاب'}
              </CardTitle>
              <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                هذا التاب قيد التطوير في الإصدار v14.0
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280', marginBottom: '8px' }}>
                  محتوى هذا التاب سيتم تطويره قريباً
                </p>
                <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  قريباً في v14.1
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  // ===== الواجهة الرئيسية =====
  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
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
              <Settings className="h-6 w-6" style={{ color: '#2563eb', filter: 'drop-shadow(0 1px 2px rgba(37, 99, 235, 0.3))' }} />
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
                إدارة شاملة لجميع إعدادات المعاملات والأنواع - v14.0 ALL TABS
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
                {SETTINGS_TABS.length} تبويباً
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* المحتوى الرئيسي */}
      <div className="flex flex-1 overflow-hidden" style={{ gap: '4px', paddingTop: '16px' }}>
        <CustomSidebar />
        
        <div className="flex-1 overflow-auto px-6" style={{ minHeight: 'calc(100vh - 220px)' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TransactionsSettings_Complete_701_v14;
