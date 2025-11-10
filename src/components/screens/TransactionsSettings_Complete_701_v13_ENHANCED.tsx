/**
 * الشاشة 701 - إعدادات المعاملات v13.0 - التحسينات الشاملة 🎯
 * ================================================================================
 * 
 * ✅ تحديثات v13.0:
 * - تطوير التاب 701-22 (أنواع المعاملات) بشكل شامل
 * - نظام الأنواع الرئيسية والفرعية
 * - ربط كل نوع بمجموعة تابات معينة
 * - تقسيم سايد بار التابات إلى مجموعتين (الإعدادات + جميع الأقسام)
 * 
 * @version 13.0 ENHANCED
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

// ============================================================
// واجهات البيانات المحسّنة
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
  requiredTabs: string[]; // التابات المطلوبة لهذا النوع
  optionalTabs: string[]; // التابات الاختيارية
  estimatedDuration: number; // بالأيام
  fees: number;
  requiredDocuments: string[];
  workflow: string[];
  isActive: boolean;
  createdDate: string;
  usageCount: number;
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
// تكوين التابات - مع التصنيفات
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
// البيانات الوهمية - أنواع المعاملات
// ============================================================

const INITIAL_MAIN_TYPES: MainTransactionType[] = [
  {
    id: 'MT-001',
    code: 'LICENSE',
    nameAr: 'معاملات رخص بناء',
    nameEn: 'Building License Transactions',
    icon: 'building',
    color: '#2563eb',
    description: 'جميع أنواع معاملات رخص البناء والتراخيص العقارية',
    subTypes: [],
    isActive: true,
    createdDate: '2025-01-01',
    lastModified: '2025-11-08'
  },
  {
    id: 'MT-002',
    code: 'DEED',
    nameAr: 'وثائق ملكية (صكوك)',
    nameEn: 'Ownership Documents (Deeds)',
    icon: 'file-text',
    color: '#10b981',
    description: 'جميع أنواع معاملات الصكوك ووثائق الملكية',
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
    nameAr: 'إصدار رخصة بناء',
    nameEn: 'New Building License',
    mainTypeId: 'MT-001',
    requiredTabs: ['284-01', '284-03', '284-05', '284-06', '284-08', '284-11', '284-13', '284-40', '284-41', '284-42', '284-47'],
    optionalTabs: ['284-09', '284-10', '284-27', '284-28'],
    estimatedDuration: 30,
    fees: 15000,
    requiredDocuments: ['صك الملكية', 'المخطط المعتمد', 'الهوية الوطنية'],
    workflow: ['استقبال', 'مراجعة', 'تصميم', 'اعتماد', 'إصدار'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 45
  },
  {
    id: 'ST-002',
    code: 'LICENSE-CORRECTION',
    nameAr: 'رخصة تصحيح وضع مبني قائم',
    nameEn: 'Existing Building Correction License',
    mainTypeId: 'MT-001',
    requiredTabs: ['284-01', '284-03', '284-05', '284-08', '284-35', '284-36', '284-45', '284-46', '284-47'],
    optionalTabs: ['284-09', '284-32', '284-37'],
    estimatedDuration: 45,
    fees: 20000,
    requiredDocuments: ['صك الملكية', 'صور المبنى القائم', 'مخطط الوضع الحالي'],
    workflow: ['استقبال', 'معاينة', 'مراجعة', 'اعتماد', 'إصدار'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 28
  },
  {
    id: 'ST-003',
    code: 'LICENSE-MODIFY-ONLY',
    nameAr: 'تعديل فقط لمكونات رخصة بناء',
    nameEn: 'Building License Components Modification Only',
    mainTypeId: 'MT-001',
    requiredTabs: ['284-01', '284-03', '284-08', '284-42', '284-43', '284-44'],
    optionalTabs: ['284-06', '284-27'],
    estimatedDuration: 15,
    fees: 8000,
    requiredDocuments: ['رخصة البناء القديمة', 'المخططات المعدلة'],
    workflow: ['استقبال', 'مراجعة التعديلات', 'اعتماد', 'إصدار'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 33
  },
  {
    id: 'ST-004',
    code: 'LICENSE-RENEW-ONLY',
    nameAr: 'تجديد فقط لرخصة البناء',
    nameEn: 'Building License Renewal Only',
    mainTypeId: 'MT-001',
    requiredTabs: ['284-01', '284-03', '284-08', '284-13'],
    optionalTabs: ['284-27'],
    estimatedDuration: 7,
    fees: 5000,
    requiredDocuments: ['رخصة البناء المنتهية', 'صك الملكية'],
    workflow: ['استقبال', 'مراجعة', 'اعتماد', 'إصدار'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 52
  },
  {
    id: 'ST-005',
    code: 'LICENSE-MODIFY-RENEW',
    nameAr: 'تعديل + تجديد',
    nameEn: 'Modification + Renewal',
    mainTypeId: 'MT-001',
    requiredTabs: ['284-01', '284-03', '284-08', '284-13', '284-42', '284-43', '284-44'],
    optionalTabs: ['284-27', '284-28'],
    estimatedDuration: 20,
    fees: 12000,
    requiredDocuments: ['رخصة البناء القديمة', 'المخططات المعدلة', 'صك الملكية'],
    workflow: ['استقبال', 'مراجعة التعديلات', 'اعتماد', 'إصدار'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 19
  },
  {
    id: 'ST-006',
    code: 'LICENSE-CORRECT-DATA',
    nameAr: 'تصحيح بيانات رخصة بناء',
    nameEn: 'Building License Data Correction',
    mainTypeId: 'MT-001',
    requiredTabs: ['284-01', '284-03', '284-08'],
    optionalTabs: ['284-09'],
    estimatedDuration: 5,
    fees: 3000,
    requiredDocuments: ['رخصة البناء', 'المستندات المثبتة للبيانات الصحيحة'],
    workflow: ['استقبال', 'مراجعة', 'اعتماد', 'إصدار'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 15
  },
  {
    id: 'ST-007',
    code: 'LICENSE-REPLACEMENT',
    nameAr: 'بدل فاقد رخصة بناء',
    nameEn: 'Building License Replacement',
    mainTypeId: 'MT-001',
    requiredTabs: ['284-01', '284-03', '284-08'],
    optionalTabs: [],
    estimatedDuration: 3,
    fees: 2000,
    requiredDocuments: ['بلاغ فقدان', 'صورة الهوية'],
    workflow: ['استقبال', 'مراجعة', 'إصدار'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 8
  },
  {
    id: 'ST-008',
    code: 'LICENSE-RENOVATION-DEED',
    nameAr: 'رخصة ترميم بصك فقط',
    nameEn: 'Renovation License (Deed Only)',
    mainTypeId: 'MT-001',
    requiredTabs: ['284-01', '284-03', '284-08', '284-35', '284-36', '284-45'],
    optionalTabs: ['284-42'],
    estimatedDuration: 20,
    fees: 10000,
    requiredDocuments: ['صك الملكية', 'تقرير المعاينة', 'صور المبنى'],
    workflow: ['استقبال', 'معاينة', 'مراجعة', 'اعتماد', 'إصدار'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 12
  },
  {
    id: 'ST-009',
    code: 'LICENSE-RENOVATION-LICENSE',
    nameAr: 'رخصة ترميم برخصة بناء',
    nameEn: 'Renovation License (With Building License)',
    mainTypeId: 'MT-001',
    requiredTabs: ['284-01', '284-03', '284-08', '284-35', '284-36', '284-43', '284-45'],
    optionalTabs: ['284-42'],
    estimatedDuration: 15,
    fees: 8000,
    requiredDocuments: ['رخصة البناء', 'تقرير المعاينة', 'صور المبنى'],
    workflow: ['استقبال', 'معاينة', 'مراجعة', 'اعتماد', 'إصدار'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 10
  },
  
  // وثائق ملكية (صكوك)
  {
    id: 'ST-010',
    code: 'DEED-UPDATE',
    nameAr: 'تحديث صك',
    nameEn: 'Deed Update',
    mainTypeId: 'MT-002',
    requiredTabs: ['284-01', '284-03', '284-08', '284-46', '284-47'],
    optionalTabs: ['284-09'],
    estimatedDuration: 10,
    fees: 5000,
    requiredDocuments: ['الصك القديم', 'وثائق التحديث المطلوبة'],
    workflow: ['استقبال', 'مراجعة', 'إعداد الوثائق', 'اعتماد', 'إصدار'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 22
  },
  {
    id: 'ST-011',
    code: 'DEED-SURVEY-REG',
    nameAr: 'تسجيل عيني',
    nameEn: 'Survey Registration',
    mainTypeId: 'MT-002',
    requiredTabs: ['284-01', '284-03', '284-08', '284-35', '284-46', '284-47'],
    optionalTabs: ['284-09', '284-36'],
    estimatedDuration: 30,
    fees: 12000,
    requiredDocuments: ['وثيقة الملكية', 'رفع مساحي', 'الموافقات المطلوبة'],
    workflow: ['استقبال', 'رفع مساحي', 'مراجعة', 'اعتماد', 'تسجيل'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 18
  },
  {
    id: 'ST-012',
    code: 'DEED-MODIFY',
    nameAr: 'تعديل صك',
    nameEn: 'Deed Modification',
    mainTypeId: 'MT-002',
    requiredTabs: ['284-01', '284-03', '284-08', '284-46'],
    optionalTabs: ['284-32'],
    estimatedDuration: 15,
    fees: 6000,
    requiredDocuments: ['الصك', 'المستندات المثبتة للتعديل'],
    workflow: ['استقبال', 'مراجعة', 'إعداد التعديلات', 'اعتماد', 'إصدار'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 14
  },
  {
    id: 'ST-013',
    code: 'DEED-CORRECT-DATA',
    nameAr: 'تصحيح بيانات صك',
    nameEn: 'Deed Data Correction',
    mainTypeId: 'MT-002',
    requiredTabs: ['284-01', '284-03', '284-08'],
    optionalTabs: [],
    estimatedDuration: 7,
    fees: 3000,
    requiredDocuments: ['الصك', 'المستندات المثبتة للبيانات الصحيحة'],
    workflow: ['استقبال', 'مراجعة', 'تصحيح', 'اعتماد', 'إصدار'],
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 11
  }
];

// ============================================================
// المكون الرئيسي
// ============================================================

export default function TransactionsSettings_Complete_701_v13() {
  const [activeTab, setActiveTab] = useState('701-01');
  const [sidebarSection, setSidebarSection] = useState<'settings' | 'all-sections'>('settings');
  
  // بيانات أنواع المعاملات
  const [mainTypes, setMainTypes] = useState<MainTransactionType[]>(INITIAL_MAIN_TYPES);
  const [subTypes, setSubTypes] = useState<SubTransactionType[]>(INITIAL_SUB_TYPES);
  
  // حالات النوافذ المنبثقة
  const [showAddMainTypeDialog, setShowAddMainTypeDialog] = useState(false);
  const [showAddSubTypeDialog, setShowAddSubTypeDialog] = useState(false);
  const [showEditSubTypeDialog, setShowEditSubTypeDialog] = useState(false);
  const [selectedMainType, setSelectedMainType] = useState<string>('');
  const [selectedSubType, setSelectedSubType] = useState<SubTransactionType | null>(null);
  const [selectedTabsForType, setSelectedTabsForType] = useState<string[]>([]);
  const [optionalTabsForType, setOptionalTabsForType] = useState<string[]>([]);
  
  // نموذج إضافة نوع رئيسي
  const [newMainType, setNewMainType] = useState({
    code: '',
    nameAr: '',
    nameEn: '',
    description: '',
    icon: 'building',
    color: '#2563eb'
  });
  
  // نموذج إضافة نوع فرعي
  const [newSubType, setNewSubType] = useState({
    code: '',
    nameAr: '',
    nameEn: '',
    mainTypeId: '',
    estimatedDuration: 30,
    fees: 0,
    requiredDocuments: [''],
    workflow: ['استقبال', 'مراجعة', 'اعتماد', 'إصدار']
  });
  
  // ============================================================
  // السايد بار المخصص مع مجموعتين
  // ============================================================
  
  const CustomSidebar = () => (
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
        <div className="p-2 space-y-4">
          {/* مجموعة الإعدادات */}
          <div>
            <div
              className="px-3 py-2 mb-2 rounded-lg cursor-pointer"
              style={{
                background: sidebarSection === 'settings' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}
              onClick={() => setSidebarSection('settings')}
            >
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 'bold', color: '#92400e' }}>
                  الإعدادات
                </span>
                <Badge style={{ background: '#f59e0b', color: '#fff', fontSize: '10px' }}>
                  {SETTINGS_TABS.length}
                </Badge>
              </div>
            </div>
            
            {sidebarSection === 'settings' && (
              <div className="space-y-0.5">
                {SETTINGS_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="w-full text-right transition-all duration-200"
                      style={{
                        padding: '8px 12px',
                        background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                        border: isActive ? '2px solid #dc2626' : '1px solid rgba(245, 158, 11, 0.2)',
                        borderRadius: '8px',
                        boxShadow: isActive ? '0 2px 8px rgba(220, 38, 38, 0.2)' : 'none',
                        transform: isActive ? 'scale(1.03)' : 'scale(1)',
                        cursor: 'pointer'
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <Icon className="h-4 w-4" style={{ color: isActive ? '#dc2626' : '#1e40af' }} />
                          <span
                            style={{
                              fontFamily: 'Tajawal, sans-serif',
                              fontSize: '12px',
                              color: isActive ? '#dc2626' : '#1e3a8a',
                              fontWeight: isActive ? 'bold' : '600'
                            }}
                          >
                            {tab.title}
                          </span>
                        </div>
                        <Badge
                          style={{
                            background: isActive ? 'rgba(220, 38, 38, 0.1)' : 'rgba(30, 64, 175, 0.1)',
                            color: isActive ? '#dc2626' : '#1e40af',
                            border: `1px solid ${isActive ? '#dc2626' : '#1e40af'}`,
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            padding: '2px 6px'
                          }}
                        >
                          {tab.number}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* مجموعة جميع الأقسام (تابات 284) */}
          <div>
            <div
              className="px-3 py-2 mb-2 rounded-lg cursor-pointer"
              style={{
                background: sidebarSection === 'all-sections' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}
              onClick={() => setSidebarSection('all-sections')}
            >
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 'bold', color: '#92400e' }}>
                  جميع الأقسام
                </span>
                <Badge style={{ background: '#3b82f6', color: '#fff', fontSize: '10px' }}>
                  {ALL_284_TABS.length}
                </Badge>
              </div>
            </div>
            
            {sidebarSection === 'all-sections' && (
              <div className="space-y-0.5">
                {ALL_284_TABS.map((tab) => {
                  const Icon = tab.icon;
                  
                  return (
                    <div
                      key={tab.id}
                      className="w-full text-right"
                      style={{
                        padding: '6px 10px',
                        background: 'rgba(255, 255, 255, 0.3)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        borderRadius: '6px'
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <Icon className="h-3.5 w-3.5" style={{ color: '#1e40af' }} />
                          <span
                            style={{
                              fontFamily: 'Tajawal, sans-serif',
                              fontSize: '11px',
                              color: '#1e3a8a',
                              fontWeight: '600'
                            }}
                          >
                            {tab.title}
                          </span>
                        </div>
                        <Badge
                          style={{
                            background: 'rgba(30, 64, 175, 0.1)',
                            color: '#1e40af',
                            border: '1px solid #1e40af',
                            fontSize: '9px',
                            fontFamily: 'monospace',
                            padding: '1px 4px'
                          }}
                        >
                          {tab.number}
                        </Badge>
                      </div>
                      {tab.category && (
                        <div className="mt-1">
                          <Badge
                            style={{
                              background: '#f3f4f6',
                              color: '#6b7280',
                              fontSize: '8px',
                              padding: '1px 4px'
                            }}
                          >
                            {tab.category}
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
  
  // ============================================================
  // رندر التاب 701-22 - أنواع المعاملات
  // ============================================================
  
  const renderTab22_TransactionTypes = () => {
    // حساب عدد الأنواع الفرعية لكل نوع رئيسي
    const getSubTypesCount = (mainTypeId: string) => {
      return subTypes.filter(st => st.mainTypeId === mainTypeId && st.isActive).length;
    };
    
    return (
      <div className="space-y-4">
        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-4 gap-3">
          <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div style={{ padding: '8px', background: '#3b82f6', borderRadius: '8px' }}>
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    الأنواع الرئيسية
                  </p>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold', color: '#1f2937' }}>
                    {mainTypes.filter(mt => mt.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #6ee7b7' }}>
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div style={{ padding: '8px', background: '#10b981', borderRadius: '8px' }}>
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    الأنواع الفرعية
                  </p>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold', color: '#1f2937' }}>
                    {subTypes.filter(st => st.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div style={{ padding: '8px', background: '#f59e0b', borderRadius: '8px' }}>
                  <FileCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    إجمالي الاستخدامات
                  </p>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold', color: '#1f2937' }}>
                    {subTypes.reduce((sum, st) => sum + st.usageCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div style={{ padding: '8px', background: '#6366f1', borderRadius: '8px' }}>
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    متوسط المدة
                  </p>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold', color: '#1f2937' }}>
                    {Math.round(subTypes.reduce((sum, st) => sum + st.estimatedDuration, 0) / subTypes.length)} يوم
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* زر إضافة نوع رئيسي */}
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => setShowAddMainTypeDialog(true)}
            style={{ background: '#2563eb', color: '#fff' }}
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة نوع رئيسي
          </Button>
        </div>
        
        {/* عرض الأنواع الرئيسية والفرعية */}
        <div className="space-y-4">
          {mainTypes.map((mainType) => (
            <Card key={mainType.id} style={{ border: `2px solid ${mainType.color}` }}>
              <CardHeader className="pb-3" style={{ background: `${mainType.color}15` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div style={{ padding: '10px', background: mainType.color, borderRadius: '10px' }}>
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '18px', color: '#1f2937' }}>
                        {mainType.nameAr}
                      </CardTitle>
                      <CardDescription style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                        {mainType.nameEn} • {mainType.code}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge style={{ background: mainType.color, color: '#fff' }}>
                      {getSubTypesCount(mainType.id)} نوع فرعي
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedMainType(mainType.id);
                        setShowAddSubTypeDialog(true);
                      }}
                      style={{ background: mainType.color, color: '#fff' }}
                    >
                      <Plus className="h-3 w-3 ml-1" />
                      إضافة نوع فرعي
                    </Button>
                  </div>
                </div>
                <p className="text-sm mt-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  {mainType.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-3">
                <div className="space-y-2">
                  {subTypes
                    .filter(st => st.mainTypeId === mainType.id)
                    .map((subType) => (
                      <div
                        key={subType.id}
                        className="p-3 rounded-lg border"
                        style={{ background: '#f9fafb', borderColor: '#e5e7eb' }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>
                                {subType.nameAr}
                              </h4>
                              <Badge variant="outline" style={{ fontSize: '10px' }}>
                                {subType.code}
                              </Badge>
                              <Badge style={{ background: '#10b981', color: '#fff', fontSize: '10px' }}>
                                {subType.usageCount} استخدام
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-gray-500" />
                                <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                                  {subType.estimatedDuration} يوم
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3 text-gray-500" />
                                <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                                  {subType.fees.toLocaleString()} ر.س
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileCheck className="h-3 w-3 text-gray-500" />
                                <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                                  {subType.requiredTabs.length} تاب إلزامي
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {subType.requiredTabs.slice(0, 5).map((tabId) => {
                                const tab = ALL_284_TABS.find(t => t.id === tabId);
                                return tab ? (
                                  <Badge
                                    key={tabId}
                                    style={{
                                      background: '#dbeafe',
                                      color: '#1e40af',
                                      fontSize: '9px',
                                      padding: '2px 6px'
                                    }}
                                  >
                                    {tab.number}
                                  </Badge>
                                ) : null;
                              })}
                              {subType.requiredTabs.length > 5 && (
                                <Badge
                                  style={{
                                    background: '#f3f4f6',
                                    color: '#6b7280',
                                    fontSize: '9px'
                                  }}
                                >
                                  +{subType.requiredTabs.length - 5}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedSubType(subType);
                                setSelectedTabsForType(subType.requiredTabs);
                                setOptionalTabsForType(subType.optionalTabs);
                                setShowEditSubTypeDialog(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <EnhancedSwitch
                              id={`subtype-${subType.id}`}
                              checked={subType.isActive}
                              onCheckedChange={(checked) => {
                                setSubTypes(prev => prev.map(st =>
                                  st.id === subType.id ? { ...st, isActive: checked } : st
                                ));
                              }}
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* نافذة تعديل النوع الفرعي */}
        <Dialog open={showEditSubTypeDialog} onOpenChange={setShowEditSubTypeDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تعديل النوع الفرعي: {selectedSubType?.nameAr}
              </DialogTitle>
              <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تحديد التابات الإلزامية والاختيارية لهذا النوع من المعاملات
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* التابات الإلزامية */}
              <div>
                <h3 className="mb-3" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold', fontSize: '14px' }}>
                  التابات الإلزامية ({selectedTabsForType.length})
                </h3>
                <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-auto p-2 border rounded-lg">
                  {ALL_284_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = selectedTabsForType.includes(tab.id);
                    
                    return (
                      <div
                        key={tab.id}
                        className="flex items-center gap-2 p-2 rounded border"
                        style={{
                          background: isSelected ? '#dbeafe' : '#fff',
                          borderColor: isSelected ? '#3b82f6' : '#e5e7eb'
                        }}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTabsForType(prev => [...prev, tab.id]);
                            } else {
                              setSelectedTabsForType(prev => prev.filter(id => id !== tab.id));
                            }
                          }}
                        />
                        <Icon className="h-3 w-3" style={{ color: '#3b82f6' }} />
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {tab.number} - {tab.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* التابات الاختيارية */}
              <div>
                <h3 className="mb-3" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold', fontSize: '14px' }}>
                  التابات الاختيارية ({optionalTabsForType.length})
                </h3>
                <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-auto p-2 border rounded-lg">
                  {ALL_284_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = optionalTabsForType.includes(tab.id);
                    
                    return (
                      <div
                        key={tab.id}
                        className="flex items-center gap-2 p-2 rounded border"
                        style={{
                          background: isSelected ? '#fef3c7' : '#fff',
                          borderColor: isSelected ? '#f59e0b' : '#e5e7eb'
                        }}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setOptionalTabsForType(prev => [...prev, tab.id]);
                            } else {
                              setOptionalTabsForType(prev => prev.filter(id => id !== tab.id));
                            }
                          }}
                        />
                        <Icon className="h-3 w-3" style={{ color: '#f59e0b' }} />
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {tab.number} - {tab.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
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
  };
  
  // ============================================================
  // رندر محتوى التاب
  // ============================================================
  
  const renderTabContent = () => {
    if (activeTab === '701-22') {
      return renderTab22_TransactionTypes();
    }
    
    return (
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {SETTINGS_TABS.find(t => t.id === activeTab)?.title || 'التاب'}
          </CardTitle>
          <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
            هذا التاب قيد التطوير في الإصدار الحالي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Settings className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
              محتوى هذا التاب سيتم تطويره في التحديثات القادمة
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // ============================================================
  // الواجهة الرئيسية
  // ============================================================
  
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
                إدارة شاملة لجميع إعدادات المعاملات والأنواع
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
                {SETTINGS_TABS.length} تبويبات
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
}
