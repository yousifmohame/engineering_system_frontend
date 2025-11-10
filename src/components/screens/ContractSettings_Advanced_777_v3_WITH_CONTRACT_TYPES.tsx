/**
 * ============================================================================
 * الشاشة 777 - إعدادات العقود v3.0 - مع تطوير تاب أنواع العقود
 * ============================================================================
 * 
 * تحديثات v3.0:
 * ✅ تطوير شامل للتاب 777-02 (أنواع العقود)
 * ✅ 25+ نوع عقد لشركة استشارات هندسية سعودية
 * ✅ تصنيفات متعددة: رخص بناء، إشراف، استشارات، تصميم
 * ✅ إدارة كاملة: إضافة، تعديل، حذف، تفعيل/إيقاف
 * ✅ ربط بنماذج وشروط مخصصة
 * 
 * @version 3.0
 * @date 2025-11-04
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import {
  FileSignature, Settings, Plus, Edit, Trash2, Eye, Copy,
  CheckCircle, XCircle, Users, Building2, FileText, Shield,
  Printer, Mail, Lock, Download, Upload, Save, RefreshCw,
  AlertCircle, Info, Zap, Code, Layout, Layers, FileCheck,
  ListChecks, Ban, AlertTriangle, Building, HardHat, Briefcase,
  ClipboardCheck, PenTool, Home, Factory, ShoppingBag, Search, X, Package, Activity,
  ChevronDown, ChevronRight
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner';
import CodeDisplay from '../CodeDisplay';
import { copyToClipboard } from '../utils/clipboard';

// تكوين التابات
const TABS_CONFIG: TabConfig[] = [
  { id: '777-01', number: '777-01', title: 'نظرة عامة', icon: Layout },
  { id: '777-02', number: '777-02', title: 'أنواع العقود', icon: FileSignature },
  { id: '777-03', number: '777-03', title: 'البنود المسبقة', icon: Layers },
  { id: '777-04', number: '777-04', title: 'إعدادات الاعتماد', icon: Shield },
  { id: '777-05', number: '777-05', title: 'قوالب الطباعة', icon: Printer },
  { id: '777-06', number: '777-06', title: 'إعدادات الإشعارات', icon: Mail },
  { id: '777-07', number: '777-07', title: 'التوقيع الرقمي', icon: FileCheck },
  { id: '777-08', number: '777-08', title: 'خلفيات الحماية', icon: Lock },
  { id: '777-09', number: '777-09', title: 'اعدادات البنود', icon: ListChecks },
  { id: '777-10', number: '777-10', title: 'اعدادات الرفض', icon: XCircle },
  { id: '777-11', number: '777-11', title: 'اعدادات التعديل', icon: AlertTriangle },
  { id: '777-12', number: '777-12', title: 'إعدادات الأطراف', icon: Users },
];

// الواجهات
interface ContractType {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  category: 'رخص البناء' | 'الإشراف' | 'الاستشارات' | 'التصميم' | 'التقييم والفحص' | 'متنوع';
  subCategory: string;
  description: string;
  standardDuration: number; // بالأشهر
  minDuration: number;
  maxDuration: number;
  standardFees: number; // ر.س
  feesType: 'ثابت' | 'متغير حسب المساحة' | 'نسبة من التكلفة' | 'حسب الاتفاق';
  requiresLicense: boolean; // يتطلب ترخيص مهني
  requiresInsurance: boolean; // يتطلب تأمين مهني
  applicableBuildings: string[]; // أنواع المباني المنطبقة
  relatedAuthorities: string[]; // الجهات المعنية
  requiredDocuments: string[]; // المستندات المطلوبة
  standardClauses: string[]; // البنود القياسية
  isActive: boolean;
  usageCount: number;
  createdDate: string;
  lastModified: string;
  notes: string;
}

interface ContractClauseTemplate {
  id: string;
  title: string;
  content: string;
  category: 'مالي' | 'قانوني' | 'فني' | 'إداري' | 'ضمانات' | 'التزامات';
  isRequired: boolean;
  isEditable: boolean;
  order: number;
  applicableToTypes: string[];
  createdDate: string;
  lastModified: string;
}

interface RejectionReason {
  id: string;
  code: string;
  reason: string;
  category: 'قانوني' | 'مالي' | 'فني' | 'إداري' | 'أخرى';
  requiresDetails: boolean;
  isActive: boolean;
  usageCount: number;
  createdDate: string;
}

interface ModificationReason {
  id: string;
  code: string;
  reason: string;
  category: 'بنود' | 'قيمة' | 'مواصفات' | 'أطراف' | 'مدة' | 'أخرى';
  allowsAutoResume: boolean;
  requiresApproval: boolean;
  isActive: boolean;
  usageCount: number;
  createdDate: string;
}

// واجهات جديدة v3.3
interface PrintTemplateSettings {
  paperSize: string;
  orientation: string;
  showHeader: boolean;
  showFooter: boolean;
  showWatermark: boolean;
  showPageNumbers: boolean;
  fontSize: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  includeDigitalAuth: boolean;
  includeManualAuth: boolean;
  showContractNumber: boolean;
  showCreationDate: boolean;
  showFirstPartyApprovalDate: boolean;
  showSecondPartyApprovalDate: boolean;
  showOtherPartiesApprovalDates: boolean;
  showOwnershipNumber: boolean;
  showOwnershipDocuments: boolean;
}

interface ContractParty {
  id: string;
  partyNumber: number;
  type: 'مكتبنا' | 'عميل' | 'جهة خارجية' | 'شريك' | 'أخرى';
  name: string;
  idNumber: string;
  phone: string;
  email: string;
  address: string;
  representative: string;
  representativeId: string;
  isDefault: boolean;
  createdDate: string;
  lastModified: string;
}

const ContractSettings_Advanced_777_v3: React.FC = () => {
  const [activeTab, setActiveTab] = useState('777-01');
  const [showAddTypeDialog, setShowAddTypeDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<ContractType | null>(null);
  const [showAddClauseDialog, setShowAddClauseDialog] = useState(false);
  const [showAddRejectionDialog, setShowAddRejectionDialog] = useState(false);
  const [showAddModificationDialog, setShowAddModificationDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('الكل');
  
  // States للبنود المسبقة (777-03)
  const [expandedClauses, setExpandedClauses] = useState<string[]>([]);
  const [showClauseViewDialog, setShowClauseViewDialog] = useState(false);
  const [showUsageDialog, setShowUsageDialog] = useState(false);
  const [selectedClauseView, setSelectedClauseView] = useState<any>(null);
  const [selectedClauseUsage, setSelectedClauseUsage] = useState<any>(null);
  
  // States لقوالب الطباعة (777-05)
  const [showTemplatePreviewDialog, setShowTemplatePreviewDialog] = useState(false);
  const [showAddTemplateDialog, setShowAddTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  
  // States جديدة للأطراف (777-12)
  const [showAddPartyDialog, setShowAddPartyDialog] = useState(false);
  const [showEditPartyDialog, setShowEditPartyDialog] = useState(false);
  const [selectedParty, setSelectedParty] = useState<ContractParty | null>(null);
  const [contractParties, setContractParties] = useState<ContractParty[]>([]);

  // بيانات وهمية - أنواع العقود (25+ نوع)
  const [contractTypes, setContractTypes] = useState<ContractType[]>([
    // فئة: رخص البناء (7 أنواع)
    {
      id: 'CT001',
      code: 'RL-RES-01',
      nameAr: 'عقد استخراج رخصة بناء سكني',
      nameEn: 'Residential Building Permit Contract',
      category: 'رخص البناء',
      subCategory: 'سكني',
      description: 'عقد للحصول على رخصة بناء للمشاريع السكنية من البلديات',
      standardDuration: 3,
      minDuration: 2,
      maxDuration: 6,
      standardFees: 25000,
      feesType: 'متغير حسب المساحة',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['فيلا', 'عمارة سكنية', 'مجمع سكني', 'دوبلكس'],
      relatedAuthorities: ['البلدية', 'الدفاع المدني', 'شركة الكهرباء'],
      requiredDocuments: ['صك الملكية', 'المخططات المعمارية', 'الإنشائية', 'الكهروميكانيكية', 'شهادة المساح'],
      standardClauses: ['CL001', 'CL002', 'CL003', 'CL005', 'CL009'],
      isActive: true,
      usageCount: 156,
      createdDate: '2024-01-15',
      lastModified: '2025-10-20',
      notes: 'يشمل جميع أنواع المباني السكنية'
    },
    {
      id: 'CT002',
      code: 'RL-COM-01',
      nameAr: 'عقد استخراج رخصة بناء تجاري',
      nameEn: 'Commercial Building Permit Contract',
      category: 'رخص البناء',
      subCategory: 'تجاري',
      description: 'عقد للحصول على رخصة بناء للمشاريع التجارية',
      standardDuration: 4,
      minDuration: 3,
      maxDuration: 8,
      standardFees: 45000,
      feesType: 'متغير حسب المساحة',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['مركز تجاري', 'مول', 'معرض', 'محلات'],
      relatedAuthorities: ['البلدية', 'الدفاع المدني', 'الغرفة التجارية'],
      requiredDocuments: ['صك الملكية', 'المخططات الشاملة', 'دراسة السلامة', 'الترخيص التجاري'],
      standardClauses: ['CL001', 'CL002', 'CL003', 'CL004', 'CL005', 'CL009'],
      isActive: true,
      usageCount: 89,
      createdDate: '2024-01-15',
      lastModified: '2025-09-15',
      notes: 'يتطلب اشتراطات سلامة إضافية'
    },
    {
      id: 'CT003',
      code: 'RL-IND-01',
      nameAr: 'عقد استخراج رخصة بناء صناعي',
      nameEn: 'Industrial Building Permit Contract',
      category: 'رخص البناء',
      subCategory: 'صناعي',
      description: 'عقد للحصول على رخصة بناء للمنشآت الصناعية',
      standardDuration: 5,
      minDuration: 4,
      maxDuration: 10,
      standardFees: 65000,
      feesType: 'متغير حسب المساحة',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['مصنع', 'ورشة', 'مستودع', 'مخزن'],
      relatedAuthorities: ['البلدية', 'الدفاع المدني', 'الهيئة الملكية', 'وزارة الصناعة'],
      requiredDocuments: ['صك الملكية', 'المخططات', 'دراسة الأثر البيئي', 'الترخيص الصناعي'],
      standardClauses: ['CL001', 'CL002', 'CL003', 'CL004', 'CL005', 'CL008', 'CL009'],
      isActive: true,
      usageCount: 34,
      createdDate: '2024-02-01',
      lastModified: '2025-08-10',
      notes: 'يشمل دراسات بيئية إضافية'
    },
    {
      id: 'CT004',
      code: 'RL-MOS-01',
      nameAr: 'عقد استخراج رخصة بناء مسجد',
      nameEn: 'Mosque Building Permit Contract',
      category: 'رخص البناء',
      subCategory: 'ديني',
      description: 'عقد للحصول على رخصة بناء للمساجد والمنشآت الدينية',
      standardDuration: 3,
      minDuration: 2,
      maxDuration: 5,
      standardFees: 30000,
      feesType: 'ثابت',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['مسجد', 'جامع', 'مصلى'],
      relatedAuthorities: ['البلدية', 'وزارة الشؤون الإسلامية', 'الدفاع المدني'],
      requiredDocuments: ['صك الملكية أو الوقف', 'المخططات', 'موافقة الأوقاف'],
      standardClauses: ['CL001', 'CL002', 'CL003', 'CL005', 'CL009'],
      isActive: true,
      usageCount: 67,
      createdDate: '2024-01-20',
      lastModified: '2025-10-05',
      notes: 'اشتراطات خاصة من وزارة الشؤون الإسلامية'
    },
    {
      id: 'CT005',
      code: 'RL-EDU-01',
      nameAr: 'عقد استخراج رخصة بناء تعليمي',
      nameEn: 'Educational Building Permit Contract',
      category: 'رخص البناء',
      subCategory: 'تعليمي',
      description: 'عقد للحصول على رخصة بناء للمنشآت التعليمية',
      standardDuration: 4,
      minDuration: 3,
      maxDuration: 7,
      standardFees: 40000,
      feesType: 'متغير حسب المساحة',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['مدرسة', 'روضة', 'معهد', 'جامعة'],
      relatedAuthorities: ['البلدية', 'وزارة التعليم', 'الدفاع المدني'],
      requiredDocuments: ['صك الملكية', 'المخططات', 'الترخيص التعليمي', 'دراسة السلامة'],
      standardClauses: ['CL001', 'CL002', 'CL003', 'CL005', 'CL009'],
      isActive: true,
      usageCount: 45,
      createdDate: '2024-02-10',
      lastModified: '2025-09-20',
      notes: 'يشمل اشتراطات السلامة للطلاب'
    },
    {
      id: 'CT006',
      code: 'RL-MED-01',
      nameAr: 'عقد استخراج رخصة بناء صحي',
      nameEn: 'Healthcare Building Permit Contract',
      category: 'رخص البناء',
      subCategory: 'صحي',
      description: 'عقد للحصول على رخصة بناء للمنشآت الصحية',
      standardDuration: 5,
      minDuration: 4,
      maxDuration: 9,
      standardFees: 55000,
      feesType: 'متغير حسب المساحة',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['مستشفى', 'عيادة', 'مركز صحي', 'مختبر'],
      relatedAuthorities: ['البلدية', 'وزارة الصحة', 'الدفاع المدني', 'الهيئة الصحية'],
      requiredDocuments: ['صك الملكية', 'المخططات الطبية', 'الترخيص الصحي', 'دراسة النفايات الطبية'],
      standardClauses: ['CL001', 'CL002', 'CL003', 'CL004', 'CL005', 'CL009'],
      isActive: true,
      usageCount: 28,
      createdDate: '2024-02-20',
      lastModified: '2025-08-25',
      notes: 'اشتراطات صحية صارمة'
    },
    {
      id: 'CT007',
      code: 'RL-HOS-01',
      nameAr: 'عقد استخراج رخصة بناء فندقي وسياحي',
      nameEn: 'Hospitality Building Permit Contract',
      category: 'رخص البناء',
      subCategory: 'فندقي',
      description: 'عقد للحصول على رخصة بناء للفنادق والمنشآت السياحية',
      standardDuration: 6,
      minDuration: 4,
      maxDuration: 10,
      standardFees: 75000,
      feesType: 'متغير حسب المساحة',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['فندق', 'منتجع', 'شاليه', 'استراحة'],
      relatedAuthorities: ['البلدية', 'الهيئة العامة للسياحة', 'الدفاع المدني'],
      requiredDocuments: ['صك الملكية', 'المخططات', 'الترخيص السياحي', 'دراسة بيئية'],
      standardClauses: ['CL001', 'CL002', 'CL003', 'CL004', 'CL005', 'CL009'],
      isActive: true,
      usageCount: 21,
      createdDate: '2024-03-01',
      lastModified: '2025-07-30',
      notes: 'يتطلب موافقات سياحية'
    },

    // فئة: الإشراف (6 أنواع)
    {
      id: 'CT008',
      code: 'SUP-RES-01',
      nameAr: 'عقد إشراف على تنفيذ مشروع سكني',
      nameEn: 'Residential Project Supervision Contract',
      category: 'الإشراف',
      subCategory: 'سكني',
      description: 'عقد الإشراف الهندسي الكامل على تنفيذ المشاريع السكنية',
      standardDuration: 12,
      minDuration: 6,
      maxDuration: 24,
      standardFees: 80000,
      feesType: 'نسبة من التكلفة',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['فيلا', 'عمارة سكنية', 'مجمع سكني'],
      relatedAuthorities: ['البلدية', 'المقاول', 'المالك'],
      requiredDocuments: ['رخصة البناء', 'المخططات المعتمدة', 'عقد المقاول', 'جدول الأعمال'],
      standardClauses: ['CL001', 'CL002', 'CL006', 'CL007', 'CL009'],
      isActive: true,
      usageCount: 198,
      createdDate: '2024-01-10',
      lastModified: '2025-10-15',
      notes: 'يشمل زيارات دورية وتقارير شهرية'
    },
    {
      id: 'CT009',
      code: 'SUP-COM-01',
      nameAr: 'عقد إشراف على تنفيذ مشروع تجاري',
      nameEn: 'Commercial Project Supervision Contract',
      category: 'الإشراف',
      subCategory: 'تجاري',
      description: 'عقد الإشراف الهندسي على تنفيذ المشاريع التجارية',
      standardDuration: 15,
      minDuration: 8,
      maxDuration: 30,
      standardFees: 120000,
      feesType: 'نسبة من التكلفة',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['مركز تجاري', 'مول', 'معرض'],
      relatedAuthorities: ['البلدية', 'المقاول', 'الدفاع المدني'],
      requiredDocuments: ['رخصة البناء', 'المخططات', 'عقد المقاول', 'خطة السلامة'],
      standardClauses: ['CL001', 'CL002', 'CL004', 'CL006', 'CL007', 'CL009'],
      isActive: true,
      usageCount: 76,
      createdDate: '2024-01-15',
      lastModified: '2025-09-10',
      notes: 'متابعة يومية للمشاريع الكبيرة'
    },
    {
      id: 'CT010',
      code: 'SUP-IND-01',
      nameAr: 'عقد إشراف على تنفيذ مشروع صناعي',
      nameEn: 'Industrial Project Supervision Contract',
      category: 'الإشراف',
      subCategory: 'صناعي',
      description: 'عقد الإشراف الهندسي على تنفيذ المنشآت الصناعية',
      standardDuration: 18,
      minDuration: 10,
      maxDuration: 36,
      standardFees: 150000,
      feesType: 'نسبة من التكلفة',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['مصنع', 'ورشة', 'مستودع'],
      relatedAuthorities: ['البلدية', 'المقاول', 'وزارة الصناعة'],
      requiredDocuments: ['رخصة البناء', 'المخططات الصناعية', 'دراسة الأثر البيئي'],
      standardClauses: ['CL001', 'CL002', 'CL004', 'CL006', 'CL007', 'CL008', 'CL009'],
      isActive: true,
      usageCount: 32,
      createdDate: '2024-02-01',
      lastModified: '2025-08-05',
      notes: 'يشمل فحص المعدات الصناعية'
    },
    {
      id: 'CT011',
      code: 'SUP-PART-01',
      nameAr: 'عقد إشراف جزئي على مرحلة محددة',
      nameEn: 'Partial Phase Supervision Contract',
      category: 'الإشراف',
      subCategory: 'جزئي',
      description: 'عقد إشراف على مرحلة محددة من المشروع (عظم، تشطيب، إلخ)',
      standardDuration: 4,
      minDuration: 2,
      maxDuration: 8,
      standardFees: 35000,
      feesType: 'ثابت',
      requiresLicense: true,
      requiresInsurance: false,
      applicableBuildings: ['جميع الأنواع'],
      relatedAuthorities: ['البلدية', 'المقاول'],
      requiredDocuments: ['رخصة البناء', 'المخططات المعتمدة'],
      standardClauses: ['CL001', 'CL002', 'CL006', 'CL007'],
      isActive: true,
      usageCount: 143,
      createdDate: '2024-03-01',
      lastModified: '2025-10-01',
      notes: 'مخصص لمرحلة واحدة فقط'
    },
    {
      id: 'CT012',
      code: 'SUP-FIN-01',
      nameAr: 'عقد الإشراف النهائي واستلام المشروع',
      nameEn: 'Final Supervision & Project Handover Contract',
      category: 'الإشراف',
      subCategory: 'استلام نهائي',
      description: 'عقد إشراف على المرحلة النهائية واستلام المشروع من المقاول',
      standardDuration: 2,
      minDuration: 1,
      maxDuration: 4,
      standardFees: 20000,
      feesType: 'ثابت',
      requiresLicense: true,
      requiresInsurance: false,
      applicableBuildings: ['جميع الأنواع'],
      relatedAuthorities: ['البلدية', 'المقاول', 'المالك'],
      requiredDocuments: ['رخصة البناء', 'شهادة الإنجاز', 'المخططات النهائية'],
      standardClauses: ['CL001', 'CL002', 'CL009'],
      isActive: true,
      usageCount: 89,
      createdDate: '2024-03-15',
      lastModified: '2025-09-25',
      notes: 'يشمل قائمة النواقص والضمانات'
    },
    {
      id: 'CT013',
      code: 'SUP-REM-01',
      nameAr: 'عقد الإشراف عن بُعد (استشاري)',
      nameEn: 'Remote Supervision (Consultancy) Contract',
      category: 'الإشراف',
      subCategory: 'عن بُعد',
      description: 'عقد إشراف استشاري عن بُعد بزيارات محددة',
      standardDuration: 6,
      minDuration: 3,
      maxDuration: 12,
      standardFees: 25000,
      feesType: 'حسب الاتفاق',
      requiresLicense: true,
      requiresInsurance: false,
      applicableBuildings: ['مشاريع صغيرة', 'فلل', 'ملاحق'],
      relatedAuthorities: ['المقاول', 'المالك'],
      requiredDocuments: ['رخصة البناء', 'المخططات'],
      standardClauses: ['CL001', 'CL002', 'CL007'],
      isActive: true,
      usageCount: 67,
      createdDate: '2024-04-01',
      lastModified: '2025-08-20',
      notes: 'زيارات أسبوعية أو حسب الاتفاق'
    },

    // فئة: الاستشارات (5 أنواع)
    {
      id: 'CT014',
      code: 'CON-GEN-01',
      nameAr: 'عقد استشارات هندسية عامة',
      nameEn: 'General Engineering Consultancy Contract',
      category: 'الاستشارات',
      subCategory: 'عامة',
      description: 'عقد تقديم استشارات هندسية شاملة للمشاريع',
      standardDuration: 3,
      minDuration: 1,
      maxDuration: 12,
      standardFees: 30000,
      feesType: 'حسب الاتفاق',
      requiresLicense: true,
      requiresInsurance: false,
      applicableBuildings: ['جميع الأنواع'],
      relatedAuthorities: ['العميل'],
      requiredDocuments: ['طلب الاستشارة', 'المستندات ذات الصلة'],
      standardClauses: ['CL001', 'CL002', 'CL010'],
      isActive: true,
      usageCount: 234,
      createdDate: '2024-01-05',
      lastModified: '2025-10-10',
      notes: 'يشمل دراسات جدوى ومراجعات'
    },
    {
      id: 'CT015',
      code: 'CON-STR-01',
      nameAr: 'عقد استشارات إنشائية متخصصة',
      nameEn: 'Structural Consultancy Contract',
      category: 'الاستشارات',
      subCategory: 'إنشائية',
      description: 'عقد استشارات متخصصة في التصميم والحلول الإنشائية',
      standardDuration: 2,
      minDuration: 1,
      maxDuration: 6,
      standardFees: 40000,
      feesType: 'حسب الاتفاق',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['مباني عالية', 'منشآت خاصة', 'جسور'],
      relatedAuthorities: ['العميل', 'مكتب التصميم'],
      requiredDocuments: ['المخططات الأولية', 'دراسة التربة'],
      standardClauses: ['CL001', 'CL002', 'CL005', 'CL009', 'CL010'],
      isActive: true,
      usageCount: 78,
      createdDate: '2024-02-15',
      lastModified: '2025-09-05',
      notes: 'للحلول الإنشائية المعقدة'
    },
    {
      id: 'CT016',
      code: 'CON-MEP-01',
      nameAr: 'عقد استشارات كهروميكانيكية',
      nameEn: 'MEP Consultancy Contract',
      category: 'الاستشارات',
      subCategory: 'كهروميكانيكية',
      description: 'عقد استشارات متخصصة في الأنظمة الكهربائية والميكانيكية',
      standardDuration: 3,
      minDuration: 1,
      maxDuration: 8,
      standardFees: 35000,
      feesType: 'حسب الاتفاق',
      requiresLicense: true,
      requiresInsurance: false,
      applicableBuildings: ['مباني تجارية', 'مستشفيات', 'فنادق'],
      relatedAuthorities: ['العميل', 'شركة الكهرباء'],
      requiredDocuments: ['المخططات المعمارية', 'متطلبات الأحمال'],
      standardClauses: ['CL001', 'CL002', 'CL010'],
      isActive: true,
      usageCount: 56,
      createdDate: '2024-03-01',
      lastModified: '2025-08-15',
      notes: 'يشمل HVAC والكهرباء والسباكة'
    },
    {
      id: 'CT017',
      code: 'CON-ENV-01',
      nameAr: 'عقد استشارات بيئية واستدامة',
      nameEn: 'Environmental & Sustainability Consultancy Contract',
      category: 'الاستشارات',
      subCategory: 'بيئية',
      description: 'عقد دراسات الأثر البيئي والاستدامة والمباني الخضراء',
      standardDuration: 4,
      minDuration: 2,
      maxDuration: 10,
      standardFees: 50000,
      feesType: 'حسب الاتفاق',
      requiresLicense: true,
      requiresInsurance: false,
      applicableBuildings: ['مشاريع كبيرة', 'مصانع', 'منشآت سياحية'],
      relatedAuthorities: ['الهيئة العامة للبيئة', 'البلدية'],
      requiredDocuments: ['طبيعة المشروع', 'الموقع', 'الدراسات الأولية'],
      standardClauses: ['CL001', 'CL002', 'CL010'],
      isActive: true,
      usageCount: 42,
      createdDate: '2024-04-01',
      lastModified: '2025-07-20',
      notes: 'للحصول على شهادات LEED أو Mostadam'
    },
    {
      id: 'CT018',
      code: 'CON-LEG-01',
      nameAr: 'عقد استشارات قانونية هندسية',
      nameEn: 'Engineering Legal Consultancy Contract',
      category: 'الاستشارات',
      subCategory: 'قانونية',
      description: 'عقد استشارات قانونية في النزاعات الهندسية والعقود',
      standardDuration: 3,
      minDuration: 1,
      maxDuration: 12,
      standardFees: 60000,
      feesType: 'حسب الاتفاق',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['جميع الأنواع'],
      relatedAuthorities: ['المحاكم', 'لجان التحكيم'],
      requiredDocuments: ['العقود', 'المستندات القانونية', 'المخططات'],
      standardClauses: ['CL001', 'CL002', 'CL003', 'CL004', 'CL010'],
      isActive: true,
      usageCount: 34,
      createdDate: '2024-05-01',
      lastModified: '2025-06-30',
      notes: 'خبرة قانونية وهندسية مجتمعة'
    },

    // فئة: التصميم (4 أنواع)
    {
      id: 'CT019',
      code: 'DES-ARC-01',
      nameAr: 'عقد تصميم معماري شامل',
      nameEn: 'Comprehensive Architectural Design Contract',
      category: 'التصميم',
      subCategory: 'معماري',
      description: 'عقد تصميم معماري كامل من المخططات الأولية حتى التنفيذية',
      standardDuration: 4,
      minDuration: 2,
      maxDuration: 10,
      standardFees: 70000,
      feesType: 'متغير حسب المساحة',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['جميع الأنواع'],
      relatedAuthorities: ['البلدية', 'العميل'],
      requiredDocuments: ['صك الملكية', 'شهادة المساح', 'متطلبات العميل'],
      standardClauses: ['CL001', 'CL002', 'CL005', 'CL009', 'CL010'],
      isActive: true,
      usageCount: 178,
      createdDate: '2024-01-10',
      lastModified: '2025-10-05',
      notes: 'يشمل جميع مراحل التصميم'
    },
    {
      id: 'CT020',
      code: 'DES-STR-01',
      nameAr: 'عقد تصميم إنشائي',
      nameEn: 'Structural Design Contract',
      category: 'التصميم',
      subCategory: 'إنشائي',
      description: 'عقد تصميم إنشائي كامل للمباني والمنشآت',
      standardDuration: 3,
      minDuration: 2,
      maxDuration: 8,
      standardFees: 50000,
      feesType: 'متغير حسب المساحة',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['جميع الأنواع'],
      relatedAuthorities: ['البلدية', 'مكتب التصميم المعماري'],
      requiredDocuments: ['المخططات المعمارية', 'دراسة التربة', 'الأحمال'],
      standardClauses: ['CL001', 'CL002', 'CL005', 'CL009', 'CL010'],
      isActive: true,
      usageCount: 145,
      createdDate: '2024-01-15',
      lastModified: '2025-09-20',
      notes: 'حسابات دقيقة وفق الكود السعودي'
    },
    {
      id: 'CT021',
      code: 'DES-MEP-01',
      nameAr: 'عقد تصميم كهروميكانيكي',
      nameEn: 'MEP Design Contract',
      category: 'التصميم',
      subCategory: 'كهروميكانيكي',
      description: 'عقد تصميم الأنظمة الكهربائية والميكانيكية والسباكة',
      standardDuration: 3,
      minDuration: 2,
      maxDuration: 7,
      standardFees: 45000,
      feesType: 'متغير حسب المساحة',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['جميع الأنواع'],
      relatedAuthorities: ['البلدية', 'شركة الكهرباء', 'الدفاع المدني'],
      requiredDocuments: ['المخططات المعمارية', 'الأحمال المتوقعة'],
      standardClauses: ['CL001', 'CL002', 'CL005', 'CL009', 'CL010'],
      isActive: true,
      usageCount: 123,
      createdDate: '2024-02-01',
      lastModified: '2025-08-30',
      notes: 'يشمل الكهرباء والتكييف والسباكة'
    },
    {
      id: 'CT022',
      code: 'DES-INT-01',
      nameAr: 'عقد تصميم داخلي وديكور',
      nameEn: 'Interior Design Contract',
      category: 'التصميم',
      subCategory: 'داخلي',
      description: 'عقد التصميم الداخلي والديكور للمباني',
      standardDuration: 2,
      minDuration: 1,
      maxDuration: 6,
      standardFees: 35000,
      feesType: 'حسب الاتفاق',
      requiresLicense: false,
      requiresInsurance: false,
      applicableBuildings: ['جميع الأنواع'],
      relatedAuthorities: ['العميل'],
      requiredDocuments: ['المخططات المعمارية', 'متطلبات العميل'],
      standardClauses: ['CL001', 'CL002', 'CL010'],
      isActive: true,
      usageCount: 98,
      createdDate: '2024-03-01',
      lastModified: '2025-07-15',
      notes: 'يشمل اختيار المواد والإضاءة'
    },

    // فئة: التقييم والفحص (3 أنواع)
    {
      id: 'CT023',
      code: 'INS-GEN-01',
      nameAr: 'عقد فحص واستلام مبنى قائم',
      nameEn: 'Existing Building Inspection Contract',
      category: 'التقييم والفحص',
      subCategory: 'فحص المباني',
      description: 'عقد فحص شامل لمبنى قائم وتقييم حالته',
      standardDuration: 1,
      minDuration: 1,
      maxDuration: 2,
      standardFees: 15000,
      feesType: 'ثابت',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['جميع الأنواع'],
      relatedAuthorities: ['العميل'],
      requiredDocuments: ['صك الملكية', 'إمكانية الدخول للمبنى'],
      standardClauses: ['CL001', 'CL002', 'CL009'],
      isActive: true,
      usageCount: 187,
      createdDate: '2024-02-10',
      lastModified: '2025-09-15',
      notes: 'يشمل تقرير مفصل عن العيوب'
    },
    {
      id: 'CT024',
      code: 'INS-VAL-01',
      nameAr: 'عقد تقييم عقاري هندسي',
      nameEn: 'Engineering Property Valuation Contract',
      category: 'التقييم والفحص',
      subCategory: 'تقييم عقاري',
      description: 'عقد تقييم القيمة الهندسية والسوقية للعقار',
      standardDuration: 1,
      minDuration: 1,
      maxDuration: 2,
      standardFees: 12000,
      feesType: 'ثابت',
      requiresLicense: true,
      requiresInsurance: false,
      applicableBuildings: ['جميع الأنواع'],
      relatedAuthorities: ['العميل', 'البنوك'],
      requiredDocuments: ['صك الملكية', 'المخططات إن وجدت'],
      standardClauses: ['CL001', 'CL002', 'CL010'],
      isActive: true,
      usageCount: 143,
      createdDate: '2024-03-15',
      lastModified: '2025-08-10',
      notes: 'للبيع أو الشراء أو التمويل'
    },
    {
      id: 'CT025',
      code: 'INS-SAF-01',
      nameAr: 'عقد تقييم السلامة الإنشائية',
      nameEn: 'Structural Safety Assessment Contract',
      category: 'التقييم والفحص',
      subCategory: 'سلامة إنشائية',
      description: 'عقد فحص وتقييم السلامة الإنشائية للمباني',
      standardDuration: 2,
      minDuration: 1,
      maxDuration: 4,
      standardFees: 25000,
      feesType: 'حسب الاتفاق',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['مباني قديمة', 'مباني متضررة'],
      relatedAuthorities: ['البلدية', 'الدفاع المدني'],
      requiredDocuments: ['صك الملكية', 'المخططات القديمة إن وجدت'],
      standardClauses: ['CL001', 'CL002', 'CL004', 'CL009'],
      isActive: true,
      usageCount: 67,
      createdDate: '2024-04-01',
      lastModified: '2025-07-05',
      notes: 'يشمل اختبارات معملية إن لزم'
    }
  ]);

  // بيانات وهمية - قوالب البنود (من v2.0)
  const [clauseTemplates, setClauseTemplates] = useState<ContractClauseTemplate[]>([
    {
      id: 'CL001',
      title: 'بند الأتعاب والدفعات',
      content: 'يتم سداد الأتعاب على دفعات: 30% دفعة مقدمة، 40% عند منتصف المدة، 30% عند الإنجاز والتسليم النهائي.',
      category: 'مالي',
      isRequired: true,
      isEditable: true,
      order: 1,
      applicableToTypes: ['جميع الأنواع'],
      createdDate: '2024-01-10',
      lastModified: '2025-08-20'
    },
    {
      id: 'CL002',
      title: 'بند مدة العقد',
      content: 'مدة العقد [XX] شهراً ميلادياً تبدأ من تاريخ التوقيع، قابلة للتمديد بموافقة الطرفين خطياً.',
      category: 'إداري',
      isRequired: true,
      isEditable: true,
      order: 2,
      applicableToTypes: ['جميع الأنواع'],
      createdDate: '2024-01-10',
      lastModified: '2025-08-15'
    },
    {
      id: 'CL003',
      title: 'بند الاختصاص القضائي',
      content: 'تخضع جميع النزاعات الناشئة عن هذا العقد للقوانين واللوائح المعمول بها في المملكة العربية السعودية.',
      category: 'قانوني',
      isRequired: true,
      isEditable: false,
      order: 3,
      applicableToTypes: ['جميع الأنواع'],
      createdDate: '2024-01-10',
      lastModified: '2025-07-01'
    },
    {
      id: 'CL004',
      title: 'بند التحكيم',
      content: 'في حال نشوء أي نزاع، يتم اللجوء إلى التحكيم وفقاً لنظام التحكيم السعودي.',
      category: 'قانوني',
      isRequired: false,
      isEditable: true,
      order: 4,
      applicableToTypes: ['عقود كبيرة', 'تجاري', 'صناعي'],
      createdDate: '2024-01-15',
      lastModified: '2025-06-15'
    },
    {
      id: 'CL005',
      title: 'بند التسليم والمواصفات',
      content: 'يلتزم المكتب بتسليم جميع المخططات والدراسات وفق المواصفات المتفق عليها وفي المواعيد المحددة.',
      category: 'فني',
      isRequired: true,
      isEditable: true,
      order: 5,
      applicableToTypes: ['تصميم', 'استشارات'],
      createdDate: '2024-01-20',
      lastModified: '2025-09-01'
    },
    {
      id: 'CL006',
      title: 'بند الإشراف والزيارات',
      content: 'يقوم المكتب بالإشراف الدوري على الموقع بمعدل [XX] زيارة أسبوعياً، وإعداد تقارير مفصلة.',
      category: 'فني',
      isRequired: true,
      isEditable: true,
      order: 6,
      applicableToTypes: ['إشراف'],
      createdDate: '2024-01-25',
      lastModified: '2025-08-10'
    },
    {
      id: 'CL007',
      title: 'بند التزامات المالك',
      content: 'يلتزم المالك بتوفير جميع الوثائق المطلوبة وتسهيل دخول المكتب للموقع.',
      category: 'إداري',
      isRequired: true,
      isEditable: true,
      order: 7,
      applicableToTypes: ['جميع الأنواع'],
      createdDate: '2024-02-01',
      lastModified: '2025-07-20'
    },
    {
      id: 'CL008',
      title: 'بند المسؤولية البيئية',
      content: 'يلتزم المكتب بمراعاة جميع الاشتراطات البيئية وتقديم الدراسات المطلوبة.',
      category: 'التزامات',
      isRequired: false,
      isEditable: true,
      order: 8,
      applicableToTypes: ['صناعي', 'بيئي'],
      createdDate: '2024-02-05',
      lastModified: '2025-06-30'
    },
    {
      id: 'CL009',
      title: 'بند الضمان',
      content: 'يضمن المكتب سلامة التصميم/الإشراف لمدة [XX] سنة من تاريخ التسليم النهائي.',
      category: 'ضمانات',
      isRequired: true,
      isEditable: true,
      order: 9,
      applicableToTypes: ['تصميم', 'إشراف'],
      createdDate: '2024-02-10',
      lastModified: '2025-09-10'
    },
    {
      id: 'CL010',
      title: 'بند السرية',
      content: 'يلتزم الطرفان بالحفاظ على سرية جميع المعلومات والوثائق المتعلقة بالمشروع.',
      category: 'التزامات',
      isRequired: true,
      isEditable: false,
      order: 10,
      applicableToTypes: ['جميع الأنواع'],
      createdDate: '2024-02-15',
      lastModified: '2025-08-05'
    }
  ]);

  // بيانات وهمية - أسباب الرفض (من v2.0)
  const [rejectionReasons] = useState<RejectionReason[]>([
    {
      id: 'RR001',
      code: 'REJ-001',
      reason: 'عدم استيفاء الوثائق المطلوبة',
      category: 'إداري',
      requiresDetails: true,
      isActive: true,
      usageCount: 45,
      createdDate: '2025-01-10'
    },
    {
      id: 'RR002',
      code: 'REJ-002',
      reason: 'مخالفة للاشتراطات البلدية',
      category: 'قانوني',
      requiresDetails: true,
      isActive: true,
      usageCount: 32,
      createdDate: '2025-01-15'
    },
    {
      id: 'RR003',
      code: 'REJ-003',
      reason: 'عدم الالتزام بالمواصفات الفنية',
      category: 'فني',
      requiresDetails: true,
      isActive: true,
      usageCount: 28,
      createdDate: '2025-01-20'
    },
    {
      id: 'RR004',
      code: 'REJ-004',
      reason: 'عدم دفع الأتعاب المستحقة',
      category: 'مالي',
      requiresDetails: false,
      isActive: true,
      usageCount: 15,
      createdDate: '2025-01-25'
    },
    {
      id: 'RR005',
      code: 'REJ-005',
      reason: 'طلب العميل',
      category: 'أخرى',
      requiresDetails: true,
      isActive: true,
      usageCount: 67,
      createdDate: '2025-02-01'
    },
    {
      id: 'RR006',
      code: 'REJ-006',
      reason: 'عدم توفر الترخيص المهني المطلوب',
      category: 'قانوني',
      requiresDetails: false,
      isActive: true,
      usageCount: 8,
      createdDate: '2025-02-10'
    },
    {
      id: 'RR007',
      code: 'REJ-007',
      reason: 'مخالفة الكود السعودي للبناء',
      category: 'فني',
      requiresDetails: true,
      isActive: true,
      usageCount: 12,
      createdDate: '2025-03-01'
    }
  ]);

  // بيانات وهمية - أسباب التعديل (من v2.0)
  const [modificationReasons] = useState<ModificationReason[]>([
    {
      id: 'MR001',
      code: 'MOD-001',
      reason: 'تعديل في بنود العقد بناءً على طلب العميل',
      category: 'بنود',
      allowsAutoResume: false,
      requiresApproval: true,
      isActive: true,
      usageCount: 34,
      createdDate: '2025-01-05'
    },
    {
      id: 'MR002',
      code: 'MOD-002',
      reason: 'تعديل قيمة العقد بسبب تغيير النطاق',
      category: 'قيمة',
      allowsAutoResume: false,
      requiresApproval: true,
      isActive: true,
      usageCount: 28,
      createdDate: '2025-01-10'
    },
    {
      id: 'MR003',
      code: 'MOD-003',
      reason: 'تعديل المواصفات الفنية للمشروع',
      category: 'مواصفات',
      allowsAutoResume: false,
      requiresApproval: true,
      isActive: true,
      usageCount: 45,
      createdDate: '2025-01-15'
    },
    {
      id: 'MR004',
      code: 'MOD-004',
      reason: 'تغيير أحد أطراف العقد',
      category: 'أطراف',
      allowsAutoResume: false,
      requiresApproval: true,
      isActive: true,
      usageCount: 12,
      createdDate: '2025-01-20'
    },
    {
      id: 'MR005',
      code: 'MOD-005',
      reason: 'تمديد مدة العقد',
      category: 'مدة',
      allowsAutoResume: true,
      requiresApproval: true,
      isActive: true,
      usageCount: 67,
      createdDate: '2025-02-01'
    },
    {
      id: 'MR006',
      code: 'MOD-006',
      reason: 'تصحيح أخطاء كتابية في العقد',
      category: 'أخرى',
      allowsAutoResume: true,
      requiresApproval: false,
      isActive: true,
      usageCount: 12,
      createdDate: '2025-02-10'
    },
    {
      id: 'MR007',
      code: 'MOD-007',
      reason: 'تحديث بيانات الاتصال لأحد الأطراف',
      category: 'أخرى',
      allowsAutoResume: true,
      requiresApproval: false,
      isActive: true,
      usageCount: 5,
      createdDate: '2025-03-01'
    }
  ]);

  // بيانات البنود المسبقة (777-03)
  const [presetClauses] = useState([
    {
      id: 'CL-001',
      title: 'بند الأتعاب والمستحقات',
      category: 'بنود مالية',
      color: '#f59e0b',
      content: 'يتعهد الطرف الثاني (المالك) بدفع أتعاب الطرف الأول (المكتب) وفقاً للمبلغ المحدد في هذا العقد، على أن يتم الدفع على دفعات حسب مراحل العمل المتفق عليها.',
      usageCount: 156,
      subClauses: [
        { id: 'CL-001-01', title: 'قيمة الأتعاب الإجمالية', content: 'يحدد المبلغ الإجمالي للأتعاب بمبلغ [...] ريال سعودي', usageCount: 156 },
        { id: 'CL-001-02', title: 'الدفعة المقدمة', content: 'تدفع دفعة مقدمة بنسبة [...]% من إجمالي الأتعاب', usageCount: 148 },
        { id: 'CL-001-03', title: 'دفعات مراحل العمل', content: 'توزع باقي الأتعاب على مراحل العمل المحددة', usageCount: 142 },
        { id: 'CL-001-04', title: 'طريقة الدفع', content: 'يتم الدفع بواسطة [شيك/تحويل بنكي/نقداً]', usageCount: 139 },
        { id: 'CL-001-05', title: 'التأخر في السداد', content: 'في حالة التأخر عن السداد يحق للمكتب إيقاف العمل', usageCount: 125 }
      ]
    },
    {
      id: 'CL-002',
      title: 'بند مدة العقد',
      category: 'بنود أساسية',
      color: '#2563eb',
      content: 'تبدأ مدة هذا العقد من تاريخ توقيعه ولمدة [...] أشهر قابلة للتمديد بموافقة الطرفين.',
      usageCount: 145,
      subClauses: [
        { id: 'CL-002-01', title: 'تاريخ البدء', content: 'يبدأ العقد من تاريخ التوقيع أو من تاريخ محدد', usageCount: 145 },
        { id: 'CL-002-02', title: 'تاريخ الانتهاء', content: 'ينتهي العقد بعد [...] شهر من تاريخ البدء', usageCount: 142 },
        { id: 'CL-002-03', title: 'التمديد', content: 'يمكن تمديد العقد بموافقة خطية من الطرفين', usageCount: 98 },
        { id: 'CL-002-04', title: 'الإنهاء المبكر', content: 'شروط وإجراءات الإنهاء المبكر للعقد', usageCount: 87 }
      ]
    },
    {
      id: 'CL-003',
      title: 'بند التزامات الطرفين',
      category: 'بنود أساسية',
      color: '#2563eb',
      content: 'يلتزم كل طرف بتنفيذ الالتزامات المحددة في هذا العقد بكل أمانة وإخلاص.',
      usageCount: 132,
      subClauses: [
        { id: 'CL-003-01', title: 'التزامات المكتب', content: 'تنفيذ العمل بالجودة المطلوبة والمدة المحددة', usageCount: 132 },
        { id: 'CL-003-02', title: 'التزامات المالك', content: 'توفير البيانات والمستندات والدفع في المواعيد', usageCount: 128 },
        { id: 'CL-003-03', title: 'السرية', content: 'الحفاظ على سرية المعلومات المتبادلة', usageCount: 115 },
        { id: 'CL-003-04', title: 'التعاون', content: 'التعاون التام بين الطرفين لإنجاح العمل', usageCount: 108 }
      ]
    },
    {
      id: 'CL-004',
      title: 'بند إنهاء العقد',
      category: 'بنود قانونية',
      color: '#7c3aed',
      content: 'يجوز لأي من الطرفين إنهاء هذا العقد في حالات محددة ووفقاً لإجراءات معينة.',
      usageCount: 118,
      subClauses: [
        { id: 'CL-004-01', title: 'الإنهاء بالتراضي', content: 'يمكن إنهاء العقد باتفاق الطرفين', usageCount: 118 },
        { id: 'CL-004-02', title: 'الإنهاء للإخلال', content: 'إنهاء العقد في حالة إخلال أحد الطرفين', usageCount: 95 },
        { id: 'CL-004-03', title: 'فترة الإشعار', content: 'يجب الإشعار قبل [...] يوم من الإنهاء', usageCount: 88 },
        { id: 'CL-004-04', title: 'التعويضات', content: 'حقوق التعويض في حالة الإنهاء غير المبرر', usageCount: 76 }
      ]
    },
    {
      id: 'CL-005',
      title: 'بند فض المنازعات',
      category: 'بنود قانونية',
      color: '#7c3aed',
      content: 'في حالة نشوء أي خلاف حول تفسير أو تنفيذ هذا العقد، يتم حله ودياً أو عن طريق التحكيم.',
      usageCount: 105,
      subClauses: [
        { id: 'CL-005-01', title: 'الحل الودي', content: 'محاولة الحل الودي خلال [...] يوم', usageCount: 105 },
        { id: 'CL-005-02', title: 'التحكيم', content: 'اللجوء للتحكيم وفقاً لنظام التحكيم السعودي', usageCount: 82 },
        { id: 'CL-005-03', title: 'الجهة المختصة', content: 'تحديد المحكمة أو مركز التحكيم المختص', usageCount: 78 },
        { id: 'CL-005-04', title: 'تكاليف التحكيم', content: 'يتحمل الطرف المخطئ تكاليف التحكيم', usageCount: 65 }
      ]
    },
    {
      id: 'CL-006',
      title: 'بند نطاق العمل',
      category: 'بنود فنية',
      color: '#be185d',
      content: 'يشمل نطاق عمل المكتب جميع الخدمات الهندسية المحددة في هذا العقد.',
      usageCount: 98,
      subClauses: [
        { id: 'CL-006-01', title: 'الدراسات الأولية', content: 'إجراء الدراسات والمعاينات اللازمة', usageCount: 98 },
        { id: 'CL-006-02', title: 'التصاميم', content: 'إعداد التصاميم المعمارية والإنشائية', usageCount: 95 },
        { id: 'CL-006-03', title: 'المتابعة', content: 'متابعة إجراءات الترخيص والاعتمادات', usageCount: 88 },
        { id: 'CL-006-04', title: 'الإشراف', content: 'الإشراف على التنفيذ (إذا تم الاتفاق عليه)', usageCount: 67 }
      ]
    },
    {
      id: 'CL-007',
      title: 'بند المسؤولية المهنية',
      category: 'بنود فنية',
      color: '#be185d',
      content: 'يتحمل المكتب المسؤولية المهنية الكاملة عن جودة ودقة الأعمال المقدمة.',
      usageCount: 92,
      subClauses: [
        { id: 'CL-007-01', title: 'الالتزام بالأنظمة', content: 'الالتزام بجميع الأنظمة واللوائح السارية', usageCount: 92 },
        { id: 'CL-007-02', title: 'التأمين المهني', content: 'وجود تأمين مهني ساري المفعول', usageCount: 85 },
        { id: 'CL-007-03', title: 'ضمان الجودة', content: 'ضمان جودة الأعمال المقدمة', usageCount: 79 },
        { id: 'CL-007-04', title: 'الأخطاء المهنية', content: 'مسؤولية تصحيح الأخطاء المهنية', usageCount: 71 }
      ]
    },
    {
      id: 'CL-008',
      title: 'بند التعديلات والإضافات',
      category: 'بنود اختيارية',
      color: '#15803d',
      content: 'أي تعديلات أو إضافات على نطاق العمل يجب أن تتم بموافقة خطية مسبقة.',
      usageCount: 76,
      subClauses: [
        { id: 'CL-008-01', title: 'طلب التعديل', content: 'تقديم طلب التعديل بشكل خطي', usageCount: 76 },
        { id: 'CL-008-02', title: 'تقييم التكلفة', content: 'تقييم تكلفة ووقت التعديل المطلوب', usageCount: 68 },
        { id: 'CL-008-03', title: 'الموافقة', content: 'الموافقة الخطية من الطرفين على التعديل', usageCount: 64 },
        { id: 'CL-008-04', title: 'تحديث العقد', content: 'تحديث العقد بملحق رسمي', usageCount: 58 }
      ]
    },
    {
      id: 'CL-009',
      title: 'بند القوة القاهرة',
      category: 'بنود قانونية',
      color: '#7c3aed',
      content: 'لا يتحمل أي من الطرفين المسؤولية عن التأخير الناتج عن القوة القاهرة.',
      usageCount: 64,
      subClauses: [
        { id: 'CL-009-01', title: 'تعريف القوة القاهرة', content: 'الكوارث الطبيعية والحروب والأوبئة', usageCount: 64 },
        { id: 'CL-009-02', title: 'الإشعار', content: 'إشعار الطرف الآخر فوراً عند حدوث القوة القاهرة', usageCount: 58 },
        { id: 'CL-009-03', title: 'التعليق', content: 'تعليق الالتزامات لحين زوال القوة القاهرة', usageCount: 52 },
        { id: 'CL-009-04', title: 'الإنهاء', content: 'حق إنهاء العقد إذا استمرت القوة القاهرة', usageCount: 45 }
      ]
    },
    {
      id: 'CL-010',
      title: 'بند حقوق الملكية الفكرية',
      category: 'بنود خاصة',
      color: '#b45309',
      content: 'جميع التصاميم والدراسات المقدمة هي ملك للمالك بعد سداد كامل الأتعاب.',
      usageCount: 58,
      subClauses: [
        { id: 'CL-010-01', title: 'ملكية التصاميم', content: 'تنتقل ملكية التصاميم للمالك بعد السداد الكامل', usageCount: 58 },
        { id: 'CL-010-02', title: 'حقوق النشر', content: 'يحتفظ المكتب بحق نشر الأعمال للدعاية', usageCount: 48 },
        { id: 'CL-010-03', title: 'الاستخدام', content: 'استخدام التصاميم للمشروع المحدد فقط', usageCount: 42 },
        { id: 'CL-010-04', title: 'المنع', content: 'عدم نسخ أو توزيع التصاميم بدون إذن', usageCount: 38 }
      ]
    }
  ]);

  // بيانات قوالب الطباعة (777-05)
  const [printTemplates] = useState([
    {
      id: 'TPL-001',
      name: 'قالب رسمي',
      description: 'قالب رسمي بتصميم احترافي مع شعار المكتب',
      color: '#2563eb',
      active: true,
      language: 'العربية',
      sampleNumber: 'CON-2025-001',
      settings: {
        paperSize: 'A4',
        orientation: 'portrait',
        showHeader: true,
        showFooter: true,
        showWatermark: false,
        showPageNumbers: true
      }
    },
    {
      id: 'TPL-002',
      name: 'قالب مبسط',
      description: 'قالب مبسط بدون شعار أو تفاصيل زائدة',
      color: '#10b981',
      active: true,
      language: 'العربية',
      sampleNumber: 'CON-2025-002',
      settings: {
        paperSize: 'A4',
        orientation: 'portrait',
        showHeader: false,
        showFooter: false,
        showWatermark: false,
        showPageNumbers: true
      }
    },
    {
      id: 'TPL-003',
      name: 'قالب تفصيلي',
      description: 'قالب شامل مع جميع التفاصيل والبنود',
      color: '#f59e0b',
      active: true,
      language: 'العربية',
      sampleNumber: 'CON-2025-003',
      settings: {
        paperSize: 'A4',
        orientation: 'portrait',
        showHeader: true,
        showFooter: true,
        showWatermark: true,
        showPageNumbers: true
      }
    },
    {
      id: 'TPL-004',
      name: 'قالب إنجليزي',
      description: 'English professional template',
      color: '#8b5cf6',
      active: false,
      language: 'English',
      sampleNumber: 'CON-2025-004',
      settings: {
        paperSize: 'A4',
        orientation: 'portrait',
        showHeader: true,
        showFooter: true,
        showWatermark: false,
        showPageNumbers: true
      }
    }
  ]);

  // دوال الأحداث
  const handleAddContractType = () => {
    toast.success('تمت إضافة نوع العقد بنجاح');
    setShowAddTypeDialog(false);
  };

  const handleToggleType = (id: string) => {
    setContractTypes(prev => prev.map(type => 
      type.id === id ? { ...type, isActive: !type.isActive } : type
    ));
    toast.success('تم تحديث حالة النوع');
  };

  const handleViewDetails = (type: ContractType) => {
    setSelectedType(type);
    setShowDetailsDialog(true);
  };

  const handleViewDraft = (type: ContractType) => {
    setSelectedType(type);
    setShowDraftDialog(true);
  };

  const handlePrintDraft = () => {
    toast.success('جارٍ طباعة مسودة العقد...');
    window.print();
  };

  const handleSendDraft = () => {
    toast.success('تم إرسال مسودة العقد بنجاح');
  };

  const handleAddClause = () => {
    toast.success('تمت إضافة البند بنجاح');
    setShowAddClauseDialog(false);
  };

  const handleAddRejection = () => {
    toast.success('تمت إضافة سبب الرفض بنجاح');
    setShowAddRejectionDialog(false);
  };

  const handleAddModification = () => {
    toast.success('تمت إضافة سبب التعديل بنجاح');
    setShowAddModificationDialog(false);
  };

  // دوال البنود المسبقة (777-03)
  const handleViewClause = (clause: any) => {
    setSelectedClauseView(clause);
    setShowClauseViewDialog(true);
  };

  const handleCopyClause = async (clause: any) => {
    if (!clause) return;
    let text = `${clause.title}\n\n${clause.content}`;
    if (clause.subClauses && clause.subClauses.length > 0) {
      text += '\n\nالبنود الفرعية:\n';
      clause.subClauses.forEach((sub: any, idx: number) => {
        text += `\n${idx + 1}. ${sub.title}`;
        if (sub.content) text += `\n   ${sub.content}`;
      });
    }
    const success = await copyToClipboard(text);
    if (success) {
      toast.success('تم نسخ البند بنجاح');
    } else {
      toast.error('فشل نسخ البند');
    }
  };

  const handlePrintClause = (clause: any) => {
    toast.success('جارٍ طباعة البند...');
    window.print();
  };

  const handleCopyClauseText = () => {
    toast.success('تم نسخ نص البند');
  };

  const handlePrintClauseText = () => {
    toast.success('جارٍ طباعة البند...');
  };

  const handleAddSubClause = (parentId: string) => {
    toast.success('فتح نافذة إضافة بند فرعي');
  };

  const handleViewUsage = (clauseId: string, clauseTitle: string) => {
    // بيانات وهمية للعقود المستخدم فيها البند
    const mockContracts = [
      { contractNumber: 'CON-2025-001', ownerName: 'أحمد محمد العلي', contractType: 'عقد استشارات هندسية', date: '2025-01-15' },
      { contractNumber: 'CON-2025-008', ownerName: 'فاطمة عبدالله السالم', contractType: 'عقد إشراف', date: '2025-01-22' },
      { contractNumber: 'CON-2025-015', ownerName: 'خالد سعد المطيري', contractType: 'عقد تصميم', date: '2025-02-03' },
      { contractNumber: 'CON-2025-023', ownerName: 'نورة حسن القحطاني', contractType: 'عقد رخصة بناء', date: '2025-02-18' },
      { contractNumber: 'CON-2025-031', ownerName: 'عبدالرحمن علي الشهري', contractType: 'عقد استشارات', date: '2025-03-05' },
      { contractNumber: 'CON-2025-042', ownerName: 'سارة محمد الدوسري', contractType: 'عقد إشراف كامل', date: '2025-03-14' },
      { contractNumber: 'CON-2025-056', ownerName: 'عمر فهد الغامدي', contractType: 'عقد تصميم وإشراف', date: '2025-03-28' }
    ];

    setSelectedClauseUsage({
      id: clauseId,
      title: clauseTitle,
      contracts: mockContracts
    });
    setShowUsageDialog(true);
  };

  const handleViewContract = (contractNumber: string) => {
    toast.success(`فتح العقد: ${contractNumber}`);
    // يمكن هنا فتح شاشة العقود (814) مع العقد المحدد
  };

  // دوال قوالب الطباعة (777-05)
  const handlePreviewTemplate = (template: any) => {
    setSelectedTemplate(template);
    setShowTemplatePreviewDialog(true);
  };

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    setShowAddTemplateDialog(true);
  };

  const handlePrintTemplate = (template: any) => {
    if (!template) return;
    toast.success(`جارٍ طباعة القالب: ${template.name}`);
    window.print();
  };

  const handleSendTemplate = (template: any) => {
    if (!template) return;
    toast.success(`جارٍ إرسال القالب: ${template.name}`);
  };

  const handleSaveTemplate = () => {
    toast.success('تم حفظ القالب بنجاح');
    setShowAddTemplateDialog(false);
    setSelectedTemplate(null);
  };

  // فلترة أنواع العقود
  const filteredTypes = contractTypes.filter(type => {
    const matchesSearch = searchTerm === '' || 
      type.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'الكل' || type.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case '777-01':
        // نظرة عامة
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة على إعدادات العقود</h2>
            </div>

            <div className="grid grid-cols-6 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <FileSignature className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{contractTypes.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أنواع العقود</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {contractTypes.filter(t => t.isActive).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أنواع نشطة</p>
                </CardContent>
              </Card>
              
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <ListChecks className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>{clauseTemplates.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>قوالب البنود</p>
                </CardContent>
              </Card>
              
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>{rejectionReasons.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أسباب الرفض</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <AlertTriangle className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>{modificationReasons.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أسباب التعديل</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <Activity className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>
                    {contractTypes.reduce((sum, t) => sum + t.usageCount, 0)}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الاستخدام</p>
                </CardContent>
              </Card>
            </div>

            {/* توزيع أنواع العقود حسب الفئة */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>توزيع أنواع العقود حسب الفئة</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="grid grid-cols-6 gap-2">
                  {['رخص البناء', 'الإشراف', 'الاستشارات', 'التصميم', 'التقييم والفحص', 'متنوع'].map((cat) => (
                    <Card key={cat} className="card-element card-rtl" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
                      <CardContent className="p-2 text-center">
                        <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                          {contractTypes.filter(t => t.category === cat).length}
                        </p>
                        <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{cat}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '777-02':
        // أنواع العقود (التاب المطور) 🎯
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إدارة أنواع العقود ({filteredTypes.length} من {contractTypes.length})
              </h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500" onClick={() => setShowAddTypeDialog(true)}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة نوع جديد
              </Button>
            </div>

            {/* البحث والفلترة */}
            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-6">
                    <div className="relative">
                      <Search className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="بحث بالاسم أو الكود..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="enhanced-input-field pr-8 h-8 text-xs"
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                      />
                    </div>
                  </div>
                  <div className="col-span-3">
                    <SelectWithCopy
                      label=""
                      id="filter-category"
                      value={filterCategory}
                      onChange={setFilterCategory}
                      options={[
                        { value: 'الكل', label: 'جميع الفئات' },
                        { value: 'رخص البناء', label: 'رخص البناء' },
                        { value: 'الإشراف', label: 'الإشراف' },
                        { value: 'الاستشارات', label: 'الاستشارات' },
                        { value: 'التصميم', label: 'التصميم' },
                        { value: 'التقييم والفحص', label: 'التقييم والفحص' },
                        { value: 'متنوع', label: 'متنوع' }
                      ]}
                      copyable={false}
                      clearable={false}
                    />
                  </div>
                  <div className="col-span-3 flex gap-1">
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                      <RefreshCw className="h-3 w-3 ml-1" />
                      تحديث
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                      <Download className="h-3 w-3 ml-1" />
                      تصدير
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-1.5">
              {['رخص البناء', 'الإشراف', 'الاستشارات', 'التصميم', 'التقييم والفحص', 'متنوع'].map((cat, idx) => {
                const count = contractTypes.filter(t => t.category === cat).length;
                const colors = [
                  { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af', icon: Building2 },
                  { bg: '#dcfce7', border: '#86efac', text: '#15803d', icon: HardHat },
                  { bg: '#fef3c7', border: '#fcd34d', text: '#b45309', icon: Briefcase },
                  { bg: '#e0e7ff', border: '#a5b4fc', text: '#4f46e5', icon: PenTool },
                  { bg: '#fce7f3', border: '#f9a8d4', text: '#be185d', icon: ClipboardCheck },
                  { bg: '#f3e8ff', border: '#d8b4fe', text: '#7c3aed', icon: Package }
                ];
                const { bg, border, text, icon: Icon } = colors[idx];
                
                return (
                  <Card key={cat} className="card-element card-rtl" style={{ background: bg, border: `1.5px solid ${border}` }}>
                    <CardContent className="p-1 text-center">
                      <Icon className="h-3 w-3 mx-auto mb-0" style={{ color: text }} />
                      <p className="text-sm mb-0" style={{ fontFamily: 'Tajawal, sans-serif', color: text, lineHeight: '1.2' }}>{count}</p>
                      <p className="text-[9px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280', lineHeight: '1.2' }}>{cat}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* جدول أنواع العقود */}
            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <ScrollArea className="h-[calc(100vh-400px)]">
                  <Table className="table-rtl dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم العربي</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة الفرعية</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة القياسية</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأتعاب</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاستخدام</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTypes.map((type) => (
                        <TableRow key={type.id} className="hover:bg-blue-50">
                          <TableCell className="text-right py-1 text-xs font-mono">{type.code}</TableCell>
                          <TableCell className="text-right py-1 text-xs max-w-xs truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {type.nameAr}
                          </TableCell>
                          <TableCell className="text-right py-1">
                            <Badge className="text-xs bg-blue-500 text-white">{type.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {type.subCategory}
                          </TableCell>
                          <TableCell className="text-right py-1 text-xs font-mono">{type.standardDuration} شهر</TableCell>
                          <TableCell className="text-right py-1 text-xs font-mono">{type.standardFees.toLocaleString()} ر.س</TableCell>
                          <TableCell className="text-right py-1">
                            <div className="flex items-center justify-end gap-1">
                              <EnhancedSwitch
                                id={`type-${type.id}`}
                                checked={type.isActive}
                                onCheckedChange={() => handleToggleType(type.id)}
                                size="sm"
                                variant={type.isActive ? 'success' : 'default'}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-1">
                            <Badge className="text-xs bg-purple-500 text-white font-mono">{type.usageCount}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-1">
                            <div className="flex gap-1 justify-end">
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleViewDetails(type)}>
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleViewDraft(type)}>
                                <FileText className="h-3 w-3 text-blue-600" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

            {/* نافذة تفاصيل نوع العقد */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
              <DialogContent className="max-w-4xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">تفاصيل نوع العقد: {selectedType?.nameAr}</DialogTitle>
                  <DialogDescription className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الكود: {selectedType?.code} | {selectedType?.nameEn}
                  </DialogDescription>
                </DialogHeader>
                
                {selectedType && (
                  <div className="space-y-3">
                    {/* معلومات أساسية */}
                    <div className="grid grid-cols-3 gap-2">
                      <Card className="card-element card-rtl" style={{ background: '#dbeafe', border: '2px solid #93c5fd' }}>
                        <CardContent className="p-2 text-center">
                          <p className="text-xs text-gray-600 mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</p>
                          <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{selectedType.category}</p>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedType.subCategory}</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="card-element card-rtl" style={{ background: '#dcfce7', border: '2px solid #86efac' }}>
                        <CardContent className="p-2 text-center">
                          <p className="text-xs text-gray-600 mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة القياسية</p>
                          <p className="text-lg font-mono" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>{selectedType.standardDuration} شهر</p>
                          <p className="text-xs font-mono text-gray-600">({selectedType.minDuration}-{selectedType.maxDuration} شهر)</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                        <CardContent className="p-2 text-center">
                          <p className="text-xs text-gray-600 mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأتعاب القياسية</p>
                          <p className="text-lg font-mono" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                            {selectedType.standardFees.toLocaleString()} ر.س
                          </p>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedType.feesType}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* الوصف */}
                    <Card className="card-element card-rtl">
                      <CardContent className="p-2">
                        <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>الوصف:</p>
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedType.description}</p>
                      </CardContent>
                    </Card>

                    {/* المتطلبات */}
                    <div className="grid grid-cols-2 gap-2">
                      <Card className="card-element card-rtl">
                        <CardHeader className="p-2 pb-1">
                          <CardTitle className="text-xs flex items-center gap-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <Shield className="h-3 w-3" />
                            المتطلبات
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 pt-0">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {selectedType.requiresLicense ? (
                                <Badge className="text-xs bg-green-500 text-white">✓ يتطلب ترخيص مهني</Badge>
                              ) : (
                                <Badge className="text-xs bg-gray-400 text-white">لا يتطلب ترخيص</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {selectedType.requiresInsurance ? (
                                <Badge className="text-xs bg-green-500 text-white">✓ يتطلب تأمين مهني</Badge>
                              ) : (
                                <Badge className="text-xs bg-gray-400 text-white">لا يتطلب تأمين</Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="card-element card-rtl">
                        <CardHeader className="p-2 pb-1">
                          <CardTitle className="text-xs flex items-center gap-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <Activity className="h-3 w-3" />
                            الإحصائيات
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 pt-0">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-blue-50 p-1.5 rounded text-center">
                              <p className="text-lg font-mono" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                                {selectedType.usageCount}
                              </p>
                              <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>عدد الاستخدام</p>
                            </div>
                            <div className="bg-green-50 p-1.5 rounded text-center">
                              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                                {selectedType.isActive ? 'نشط' : 'غير نشط'}
                              </p>
                              <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>الحالة</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* أنواع المباني المنطبقة */}
                    <Card className="card-element card-rtl">
                      <CardHeader className="p-2 pb-1">
                        <CardTitle className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>أنواع المباني المنطبقة</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2 pt-0">
                        <div className="flex flex-wrap gap-1">
                          {selectedType.applicableBuildings.map((building, idx) => (
                            <Badge key={idx} className="text-xs bg-blue-100 text-blue-700 border border-blue-300">
                              {building}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* الجهات المعنية */}
                    <Card className="card-element card-rtl">
                      <CardHeader className="p-2 pb-1">
                        <CardTitle className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهات المعنية</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2 pt-0">
                        <div className="flex flex-wrap gap-1">
                          {selectedType.relatedAuthorities.map((auth, idx) => (
                            <Badge key={idx} className="text-xs bg-purple-100 text-purple-700 border border-purple-300">
                              {auth}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* المستندات المطلوبة */}
                    <Card className="card-element card-rtl">
                      <CardHeader className="p-2 pb-1">
                        <CardTitle className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستندات المطلوبة</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2 pt-0">
                        <div className="grid grid-cols-2 gap-1">
                          {selectedType.requiredDocuments.map((doc, idx) => (
                            <div key={idx} className="flex items-center gap-1 bg-gray-50 p-1.5 rounded">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{doc}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* الملاحظات */}
                    {selectedType.notes && (
                      <Card className="card-element card-rtl" style={{ background: '#eff6ff', border: '2px solid #93c5fd' }}>
                        <CardContent className="p-2">
                          <p className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                            <Info className="h-3 w-3 inline ml-1" />
                            ملاحظات:
                          </p>
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedType.notes}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                <DialogFooter className="flex gap-2 justify-start">
                  <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                    <X className="h-3 w-3 ml-1" />
                    إغلاق
                  </Button>
                  <Button className="bg-blue-500">
                    <Edit className="h-3 w-3 ml-1" />
                    تعديل
                  </Button>
                  <Button variant="outline">
                    <Printer className="h-3 w-3 ml-1" />
                    طباعة
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* نافذة المسودة */}
            <Dialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
              <DialogContent className="max-w-5xl dialog-rtl" style={{ maxHeight: '90vh', overflow: 'auto' }}>
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    مسودة العقد: {selectedType?.nameAr}
                  </DialogTitle>
                  <DialogDescription className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الكود: {selectedType?.code} | معاينة المسودة القياسية للعقد
                  </DialogDescription>
                </DialogHeader>
                
                {selectedType && (
                  <div className="space-y-4">
                    {/* هيدر المسودة */}
                    <div className="text-center border-b-2 border-gray-300 pb-4">
                      <h1 className="text-2xl mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                        {selectedType.nameAr}
                      </h1>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {selectedType.nameEn}
                      </p>
                      <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
                        <span>الكود: {selectedType.code}</span>
                        <span>•</span>
                        <span>الفئة: {selectedType.category}</span>
                        <span>•</span>
                        <span>النوع: {selectedType.subCategory}</span>
                      </div>
                    </div>

                    {/* معلومات العقد الأساسية */}
                    <Card className="card-element card-rtl">
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          أولاً: معلومات العقد
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 space-y-2">
                        <div className="grid grid-cols-2 gap-3 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <div>
                            <span className="text-gray-600">نوع العقد: </span>
                            <span className="font-semibold">{selectedType.nameAr}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">الفئة: </span>
                            <span className="font-semibold">{selectedType.category} - {selectedType.subCategory}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">المدة القياسية: </span>
                            <span className="font-semibold">{selectedType.standardDuration} شهر</span>
                            <span className="text-gray-500 mr-1">(من {selectedType.minDuration} إلى {selectedType.maxDuration} شهر)</span>
                          </div>
                          <div>
                            <span className="text-gray-600">الأتعاب القياسية: </span>
                            <span className="font-semibold">{selectedType.standardFees.toLocaleString()} ر.س</span>
                            <span className="text-gray-500 mr-1">({selectedType.feesType})</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-gray-600 text-xs mb-1">وصف العقد:</p>
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedType.description}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* الأطراف */}
                    <Card className="card-element card-rtl">
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          ثانياً: أطراف العقد
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 space-y-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <div>
                          <p className="font-semibold mb-1">الطرف الأول (المكتب الاستشاري):</p>
                          <p className="text-gray-600 mr-3">اسم المكتب: [يتم التعبئة تلقائياً من معلومات المكتب]</p>
                          <p className="text-gray-600 mr-3">السجل التجاري: [رقم السجل التجاري]</p>
                          <p className="text-gray-600 mr-3">رقم الترخيص المهني: [رقم الترخيص]</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">الطرف الثاني (العميل/المالك):</p>
                          <p className="text-gray-600 mr-3">الاسم: [يتم التعبئة من بيانات العميل]</p>
                          <p className="text-gray-600 mr-3">رقم الهوية/السجل: [رقم الهوية الوطنية أو السجل التجاري]</p>
                          <p className="text-gray-600 mr-3">العنوان: [عنوان العميل]</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* نطاق العمل والمتطلبات */}
                    <Card className="card-element card-rtl">
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          ثالثاً: نطاق العمل والمتطلبات
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 space-y-3 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <div>
                          <p className="font-semibold mb-1">أنواع المباني المشمولة:</p>
                          <ul className="mr-5 list-disc space-y-0.5 text-gray-600">
                            {selectedType.applicableBuildings.map((building, idx) => (
                              <li key={idx}>{building}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">الجهات المعنية:</p>
                          <ul className="mr-5 list-disc space-y-0.5 text-gray-600">
                            {selectedType.relatedAuthorities.map((auth, idx) => (
                              <li key={idx}>{auth}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">المستندات المطلوبة:</p>
                          <ul className="mr-5 list-disc space-y-0.5 text-gray-600">
                            {selectedType.requiredDocuments.map((doc, idx) => (
                              <li key={idx}>{doc}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">المتطلبات المهنية:</p>
                          <div className="flex gap-3 mr-3">
                            <Badge className={`text-xs ${selectedType.requiresLicense ? 'bg-green-500' : 'bg-gray-400'}`}>
                              {selectedType.requiresLicense ? '✓' : '✗'} ترخيص مهني
                            </Badge>
                            <Badge className={`text-xs ${selectedType.requiresInsurance ? 'bg-green-500' : 'bg-gray-400'}`}>
                              {selectedType.requiresInsurance ? '✓' : '✗'} تأمين مهني
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* الشروط والبنود */}
                    <Card className="card-element card-rtl">
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          رابعاً: الشروط والبنود
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 space-y-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <p className="text-gray-600 mb-2">البنود القياسية المطبقة على هذا النوع من العقود:</p>
                        <div className="space-y-2">
                          {selectedType.standardClauses.map((clauseId, idx) => (
                            <div key={idx} className="p-2 bg-gray-50 rounded border border-gray-200">
                              <p className="font-semibold mb-1">البند {idx + 1}: [{clauseId}]</p>
                              <p className="text-gray-600 mr-3">نص البند سيتم جلبه تلقائياً من إعدادات البنود القياسية...</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* التوقيعات */}
                    <Card className="card-element card-rtl">
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          خامساً: التوقيعات
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="grid grid-cols-2 gap-6 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <div className="text-center border border-gray-300 rounded p-4">
                            <p className="font-semibold mb-4">الطرف الأول (المكتب)</p>
                            <div className="h-16 border-b border-gray-400 mb-2"></div>
                            <p className="text-gray-600">التوقيع والتاريخ</p>
                          </div>
                          <div className="text-center border border-gray-300 rounded p-4">
                            <p className="font-semibold mb-4">الطرف الثاني (العميل)</p>
                            <div className="h-16 border-b border-gray-400 mb-2"></div>
                            <p className="text-gray-600">التوقيع والتاريخ</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* ملاحظات */}
                    {selectedType.notes && (
                      <Card className="card-element card-rtl" style={{ background: '#fffbeb', border: '2px solid #fcd34d' }}>
                        <CardContent className="p-3 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <p className="font-semibold mb-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            ملاحظات هامة:
                          </p>
                          <p className="text-gray-700 mr-4">{selectedType.notes}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                <DialogFooter className="flex gap-2 justify-start mt-4 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowDraftDialog(false)}>
                    <X className="h-4 w-4 ml-1" />
                    إغلاق
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handlePrintDraft}>
                    <Printer className="h-4 w-4 ml-1" />
                    طباعة المسودة
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleSendDraft}>
                    <Mail className="h-4 w-4 ml-1" />
                    إرسال المسودة
                  </Button>
                  <Button variant="outline" className="bg-purple-50 hover:bg-purple-100 border-purple-300">
                    <Download className="h-4 w-4 ml-1" />
                    تنزيل PDF
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* نافذة إضافة نوع جديد */}
            <Dialog open={showAddTypeDialog} onOpenChange={setShowAddTypeDialog}>
              <DialogContent className="max-w-3xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">إضافة نوع عقد جديد</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <InputWithCopy
                      label="الكود *"
                      id="type-code"
                      placeholder="مثال: CON-GEN-02"
                      copyable={false}
                      clearable={true}
                    />

                    <SelectWithCopy
                      label="الفئة *"
                      id="type-category"
                      options={[
                        { value: 'رخص البناء', label: 'رخص البناء' },
                        { value: 'الإشراف', label: 'الإشراف' },
                        { value: 'الاستشارات', label: 'الاستشارات' },
                        { value: 'التصميم', label: 'التصميم' },
                        { value: 'التقييم والفحص', label: 'التقييم والفحص' },
                        { value: 'متنوع', label: 'متنوع' }
                      ]}
                      copyable={false}
                      clearable={false}
                    />

                    <InputWithCopy
                      label="الاسم العربي *"
                      id="type-name-ar"
                      placeholder="عقد..."
                      copyable={false}
                      clearable={true}
                    />

                    <InputWithCopy
                      label="الاسم الإنجليزي *"
                      id="type-name-en"
                      placeholder="Contract..."
                      copyable={false}
                      clearable={true}
                    />

                    <InputWithCopy
                      label="الفئة الفرعية *"
                      id="type-sub"
                      placeholder="مثال: سكني"
                      copyable={false}
                      clearable={true}
                    />

                    <SelectWithCopy
                      label="نوع الأتعاب *"
                      id="fees-type"
                      options={[
                        { value: 'ثابت', label: 'ثابت' },
                        { value: 'متغير حسب المساحة', label: 'متغير حسب المساحة' },
                        { value: 'نسبة من التكلفة', label: 'نسبة من التكلفة' },
                        { value: 'حسب الاتفاق', label: 'حسب الاتفاق' }
                      ]}
                      copyable={false}
                      clearable={false}
                    />

                    <InputWithCopy
                      label="المدة القياسية (شهر) *"
                      id="duration"
                      placeholder="6"
                      copyable={false}
                      clearable={true}
                    />

                    <InputWithCopy
                      label="الأتعاب القياسية (ر.س) *"
                      id="fees"
                      placeholder="30000"
                      copyable={false}
                      clearable={true}
                    />
                  </div>

                  <TextAreaWithCopy
                    label="الوصف *"
                    id="description"
                    rows={2}
                    placeholder="وصف تفصيلي للخدمة..."
                    copyable={false}
                    clearable={true}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <EnhancedSwitch
                        id="requires-license"
                        label="يتطلب ترخيص مهني"
                        description="الزامي للتنفيذ"
                        variant="default"
                      />
                      <EnhancedSwitch
                        id="requires-insurance"
                        label="يتطلب تأمين مهني"
                        description="حماية إضافية"
                        variant="success"
                      />
                    </div>
                    
                    <EnhancedSwitch
                      id="is-active"
                      label="تفعيل النوع فوراً"
                      description="متاح للاستخدام"
                      variant="success"
                    />
                  </div>
                </div>

                <DialogFooter className="flex gap-2 justify-start">
                  <Button variant="outline" onClick={() => setShowAddTypeDialog(false)}>
                    <X className="h-3 w-3 ml-1" />
                    إلغاء
                  </Button>
                  <Button className="bg-blue-500" onClick={handleAddContractType}>
                    <Save className="h-3 w-3 ml-1" />
                    حفظ نوع العقد
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case '777-03':
        // البنود المسبقة - نظام شجري متطور
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>البنود القياسية المسبقة</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500" onClick={() => setShowAddClauseDialog(true)}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة بند قياسي
              </Button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {['بنود أساسية', 'بنود اختيارية', 'بنود خاصة', 'بنود مالية', 'بنود فنية', 'بنود قانونية'].map((cat, idx) => {
                const colors = [
                  { bg: '#dbeafe', text: '#1e40af' },
                  { bg: '#dcfce7', text: '#15803d' },
                  { bg: '#fef3c7', text: '#b45309' },
                  { bg: '#e0e7ff', text: '#4f46e5' },
                  { bg: '#fce7f3', text: '#be185d' },
                  { bg: '#f3e8ff', text: '#7c3aed' }
                ];
                const count = presetClauses.filter(c => c.category === cat).length;
                return (
                  <Card key={cat} className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all" style={{ background: colors[idx].bg }}>
                    <CardContent className="p-1.5 text-center">
                      <p className="text-lg mb-0" style={{ fontFamily: 'Tajawal, sans-serif', color: colors[idx].text }}>
                        {count}
                      </p>
                      <p className="text-[9px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{cat}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-3">
                <p className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  البنود المسبقة التي يمكن إضافتها للعقود بشكل تلقائي:
                </p>
                <div className="space-y-2">
                  {presetClauses.map((clause) => (
                    <div key={clause.id}>
                      {/* البند الرئيسي */}
                      <div className="p-3 rounded border" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', border: '2px solid #e2e8f0' }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3 flex-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                setExpandedClauses(prev => 
                                  prev.includes(clause.id) 
                                    ? prev.filter(id => id !== clause.id)
                                    : [...prev, clause.id]
                                );
                              }}
                            >
                              {expandedClauses.includes(clause.id) ? (
                                <ChevronDown className="h-4 w-4 text-blue-600" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-blue-600" />
                              )}
                            </Button>
                            
                            <Layers className="h-5 w-5 text-blue-600" />
                            
                            <div className="flex-1">
                              <p className="text-sm mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                                {clause.title}
                              </p>
                              <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {clause.subClauses.length} بنود فرعية
                              </p>
                            </div>
                            
                            <Badge className="text-xs" style={{ background: clause.color }}>
                              {clause.category}
                            </Badge>
                            
                            {/* عداد الاستخدام */}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2"
                              onClick={() => handleViewUsage(clause.id, clause.title)}
                            >
                              <Activity className="h-3 w-3 ml-1" />
                              <span className="font-mono text-xs">{clause.usageCount}</span>
                            </Button>
                          </div>
                          
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleViewClause(clause)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleCopyClause(clause)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handlePrintClause(clause)}>
                              <Printer className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 bg-green-50 hover:bg-green-100">
                              <Mail className="h-3 w-3 text-green-600" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* البنود الفرعية */}
                        {expandedClauses.includes(clause.id) && (
                          <div className="mr-10 mt-3 space-y-2">
                            {clause.subClauses.map((sub) => (
                              <div key={sub.id} className="p-2 rounded bg-white border border-gray-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 flex-1">
                                    <div className="h-1 w-1 rounded-full bg-blue-600"></div>
                                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                      {sub.title}
                                    </p>
                                  </div>
                                  
                                  {/* عداد استخدام البند الفرعي */}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2"
                                    onClick={() => handleViewUsage(sub.id, sub.title)}
                                  >
                                    <span className="font-mono text-xs text-gray-600">{sub.usageCount}</span>
                                  </Button>
                                  
                                  <div className="flex gap-1">
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                      <Plus className="h-3 w-3 text-blue-600" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {sub.content && (
                                  <p className="text-xs text-gray-600 mt-1 mr-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                    {sub.content}
                                  </p>
                                )}
                              </div>
                            ))}
                            
                            {/* زر إضافة بند فرعي */}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs w-full"
                              onClick={() => handleAddSubClause(clause.id)}
                            >
                              <Plus className="h-3 w-3 ml-1" />
                              إضافة بند فرعي
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* نافذة إضافة بند قياسي */}
            <Dialog open={showAddClauseDialog} onOpenChange={setShowAddClauseDialog}>
              <DialogContent className="max-w-4xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">إضافة بند قياسي جديد</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <InputWithCopy
                      label="عنوان البند *"
                      id="clause-title"
                      placeholder="مثال: بند الأتعاب والمستحقات"
                      copyable={false}
                      clearable={true}
                    />
                    
                    <SelectWithCopy
                      label="التصنيف *"
                      id="clause-category"
                      options={[
                        { value: 'بنود أساسية', label: 'بنود أساسية' },
                        { value: 'بنود اختيارية', label: 'بنود اختيارية' },
                        { value: 'بنود خاصة', label: 'بنود خاصة' },
                        { value: 'بنود مالية', label: 'بنود مالية' },
                        { value: 'بنود فنية', label: 'بنود فنية' },
                        { value: 'بنود قانونية', label: 'بنود قانونية' }
                      ]}
                      copyable={false}
                      clearable={false}
                    />
                  </div>
                  
                  <TextAreaWithCopy
                    label="محتوى البند *"
                    id="clause-content"
                    rows={5}
                    placeholder="أدخل النص الكامل للبند القياسي..."
                    copyable={true}
                    clearable={true}
                  />
                  
                  <TextAreaWithCopy
                    label="ملاحظات"
                    id="clause-notes"
                    rows={3}
                    placeholder="ملاحظات إضافية حول البند (اختياري)"
                    copyable={true}
                    clearable={true}
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <EnhancedSwitch
                      id="clause-required"
                      label="بند إلزامي"
                      description="يجب تضمينه في جميع العقود"
                      variant="danger"
                    />
                    
                    <EnhancedSwitch
                      id="clause-editable"
                      label="قابل للتعديل"
                      description="يمكن تعديل نصه في العقد"
                      variant="success"
                    />
                  </div>
                </div>
                
                <DialogFooter className="flex gap-2 justify-start">
                  <Button variant="outline" onClick={() => setShowAddClauseDialog(false)}>
                    <X className="h-3 w-3 ml-1" />
                    إلغاء
                  </Button>
                  <Button className="bg-blue-500" onClick={handleAddClause}>
                    <Save className="h-3 w-3 ml-1" />
                    حفظ البند
                  </Button>
                  <Button variant="outline" onClick={handleCopyClauseText}>
                    <Copy className="h-3 w-3 ml-1" />
                    نسخ
                  </Button>
                  <Button variant="outline" onClick={handlePrintClauseText}>
                    <Printer className="h-3 w-3 ml-1" />
                    طباعة
                  </Button>
                  <Button variant="outline" className="bg-green-50">
                    <Mail className="h-3 w-3 ml-1" />
                    إرسال
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* نافذة عرض البند */}
            <Dialog open={showClauseViewDialog} onOpenChange={setShowClauseViewDialog}>
              <DialogContent className="max-w-3xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">
                    {selectedClauseView?.title}
                  </DialogTitle>
                  <DialogDescription className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {selectedClauseView?.category}
                  </DialogDescription>
                </DialogHeader>
                
                {selectedClauseView && (
                  <div className="space-y-3">
                    <Card className="card-element card-rtl">
                      <CardContent className="p-3">
                        <p className="text-xs mb-1 text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نص البند:</p>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', lineHeight: '1.8' }}>
                          {selectedClauseView.content}
                        </p>
                      </CardContent>
                    </Card>
                    
                    {selectedClauseView.subClauses.length > 0 && (
                      <Card className="card-element card-rtl">
                        <CardHeader className="p-3 pb-2">
                          <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            البنود الفرعية ({selectedClauseView.subClauses.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <div className="space-y-2">
                            {selectedClauseView.subClauses.map((sub, idx) => (
                              <div key={sub.id} className="p-2 bg-gray-50 rounded">
                                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                                  {idx + 1}. {sub.title}
                                </p>
                                {sub.content && (
                                  <p className="text-xs text-gray-600 mr-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                    {sub.content}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
                
                <DialogFooter className="flex gap-2 justify-start">
                  <Button variant="outline" onClick={() => setShowClauseViewDialog(false)}>
                    <X className="h-3 w-3 ml-1" />
                    إغلاق
                  </Button>
                  <Button variant="outline" onClick={() => handleCopyClause(selectedClauseView)}>
                    <Copy className="h-3 w-3 ml-1" />
                    نسخ
                  </Button>
                  <Button variant="outline" onClick={() => handlePrintClause(selectedClauseView)}>
                    <Printer className="h-3 w-3 ml-1" />
                    طباعة
                  </Button>
                  <Button variant="outline" className="bg-green-50">
                    <Mail className="h-3 w-3 ml-1" />
                    إرسال
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* نافذة عرض الاستخدام */}
            <Dialog open={showUsageDialog} onOpenChange={setShowUsageDialog}>
              <DialogContent className="max-w-4xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">
                    سجل استخدام البند: {selectedClauseUsage?.title}
                  </DialogTitle>
                  <DialogDescription className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    العقود التي تم استخدام هذا البند فيها ({selectedClauseUsage?.contracts?.length || 0} عقد)
                  </DialogDescription>
                </DialogHeader>
                
                {selectedClauseUsage && selectedClauseUsage.contracts && (
                  <Card className="card-element card-rtl">
                    <CardContent className="p-3">
                      <Table className="table-rtl dense-table">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العقد</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المالك</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع العقد</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراء</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedClauseUsage.contracts.map((contract, idx) => (
                            <TableRow key={idx} className="hover:bg-blue-50">
                              <TableCell className="text-right py-2 text-xs">{idx + 1}</TableCell>
                              <TableCell className="text-right py-2 text-xs font-mono">{contract.contractNumber}</TableCell>
                              <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {contract.ownerName}
                              </TableCell>
                              <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {contract.contractType}
                              </TableCell>
                              <TableCell className="text-right py-2 text-xs font-mono">{contract.date}</TableCell>
                              <TableCell className="text-right py-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                  onClick={() => handleViewContract(contract.contractNumber)}
                                >
                                  استعراض
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
                
                <DialogFooter className="flex gap-2 justify-start">
                  <Button variant="outline" onClick={() => setShowUsageDialog(false)}>
                    <X className="h-3 w-3 ml-1" />
                    إغلاق
                  </Button>
                  <Button variant="outline">
                    <Download className="h-3 w-3 ml-1" />
                    تصدير
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case '777-04':
        // إعدادات الاعتماد
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات اعتماد العقود</h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Card className="card-element card-rtl" style={{ background: '#dbeafe', border: '2px solid #93c5fd' }}>
                <CardContent className="p-3">
                  <Shield className="h-5 w-5 text-blue-600 mb-2" />
                  <p className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>مستويات الاعتماد</p>
                  <EnhancedSwitch id="multi-level" label="اعتماد متعدد المستويات" variant="default" size="sm" />
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: '#dcfce7', border: '2px solid #86efac' }}>
                <CardContent className="p-3">
                  <Users className="h-5 w-5 text-green-600 mb-2" />
                  <p className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعتمدون</p>
                  <EnhancedSwitch id="auto-assign" label="تعيين تلقائي حسب المبلغ" variant="success" size="sm" />
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <CardContent className="p-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mb-2" />
                  <p className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التنبيهات</p>
                  <EnhancedSwitch id="notify-delay" label="تنبيه عند التأخر" variant="warning" size="sm" />
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>قواعد الاعتماد</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>نطاق المبلغ</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستوى</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعتمد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { range: 'أقل من 50,000', level: 'الأول', approver: 'مدير المشاريع', duration: '24 ساعة' },
                      { range: '50,000 - 100,000', level: 'الثاني', approver: 'المدير التنفيذي', duration: '48 ساعة' },
                      { range: 'أكثر من 100,000', level: 'الثالث', approver: 'مجلس الإدارة', duration: '72 ساعة' }
                    ].map((rule, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-right py-2 text-xs font-mono">{rule.range} ر.س</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{rule.level}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{rule.approver}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{rule.duration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '777-05':
        // قوالب الطباعة - نظام متطور
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>قوالب طباعة العقود</h2>
              <Button size="sm" className="h-8 text-xs bg-purple-500" onClick={() => setShowAddTemplateDialog(true)}>
                <Plus className="h-3 w-3 ml-1" />
                قالب جديد
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {printTemplates.map((template, idx) => {
                return (
                  <Card key={template.id} className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all" style={{ borderTop: `4px solid ${template.color}` }}>
                    <CardContent className="p-2">
                      <div className="flex items-center justify-between mb-1">
                        <Printer className="h-4 w-4" style={{ color: template.color }} />
                        <Badge className="text-[9px]" style={{ background: template.active ? '#10b981' : '#6b7280' }}>
                          {template.active ? 'مفعّل' : 'معطّل'}
                        </Badge>
                      </div>
                      <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>{template.name}</p>
                      <p className="text-[9px] text-gray-500 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>{template.description}</p>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-6 text-[10px] flex-1"
                          onClick={() => handlePreviewTemplate(template)}
                        >
                          معاينة
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleEditTemplate(template)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الطباعة العامة</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <SelectWithCopy
                    label="حجم الورق"
                    id="paper-size"
                    value="A4"
                    onChange={() => {}}
                    options={[
                      { value: 'A4', label: 'A4' },
                      { value: 'A3', label: 'A3' },
                      { value: 'Letter', label: 'Letter' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />

                  <SelectWithCopy
                    label="الاتجاه"
                    id="orientation"
                    value="portrait"
                    onChange={() => {}}
                    options={[
                      { value: 'portrait', label: 'عمودي' },
                      { value: 'landscape', label: 'أفقي' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />
                </div>

                <div className="space-y-2">
                  <EnhancedSwitch id="header" label="إظهار الهيدر" variant="default" size="sm" />
                  <EnhancedSwitch id="footer" label="إظهار الفوتر" variant="default" size="sm" />
                  <EnhancedSwitch id="watermark" label="علامة مائية" variant="default" size="sm" />
                  <EnhancedSwitch id="page-numbers" label="ترقيم الصفحات" variant="default" size="sm" />
                </div>
              </CardContent>
            </Card>

            {/* نافذة معاينة القالب */}
            <Dialog open={showTemplatePreviewDialog} onOpenChange={setShowTemplatePreviewDialog}>
              <DialogContent className="max-w-5xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">
                    معاينة القالب: {selectedTemplate?.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {selectedTemplate?.description}
                  </DialogDescription>
                </DialogHeader>

                {selectedTemplate && (
                  <div className="space-y-3">
                    {/* معاينة مصغرة للقالب */}
                    <Card className="card-element card-rtl" style={{ background: '#f9fafb', border: '2px dashed #d1d5db' }}>
                      <CardContent className="p-6">
                        <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {/* هيدر القالب */}
                          {selectedTemplate.settings.showHeader && (
                            <div className="text-center pb-4 border-b-2 border-gray-300">
                              <h2 className="text-lg" style={{ fontWeight: 700 }}>اسم المكتب الهندسي</h2>
                              <p className="text-xs text-gray-600">الرياض - المملكة العربية السعودية</p>
                              <p className="text-xs text-gray-600">info@office.com | +966 11 234 5678</p>
                            </div>
                          )}

                          {/* عنوان العقد */}
                          <div className="text-center py-4">
                            <h1 className="text-xl" style={{ fontWeight: 700, color: selectedTemplate.color }}>عقد استشارات هندسية</h1>
                            <p className="text-sm text-gray-600 mt-2">رقم العقد: {selectedTemplate.sampleNumber}</p>
                            <p className="text-sm text-gray-600">التاريخ: {new Date().toLocaleDateString('ar-SA')}</p>
                          </div>

                          {/* محتوى نموذجي */}
                          <div className="space-y-3 text-sm" style={{ lineHeight: '1.8' }}>
                            <p><strong>الطرف الأول (المكتب):</strong> المكتب الهندسي الاستشاري</p>
                            <p><strong>الطرف الثاني (المالك):</strong> السيد/ أحمد محمد العلي</p>
                            <p><strong>الموضوع:</strong> استشارات هندسية لمشروع سكني</p>
                            <p><strong>القيمة:</strong> 50,000 ريال سعودي</p>
                            
                            <div className="pt-3">
                              <p className="mb-2"><strong>البنود الأساسية:</strong></p>
                              <ul className="mr-6 space-y-1" style={{ listStyle: 'decimal' }}>
                                <li>يلتزم الطرف الأول بتقديم الخدمات الهندسية المتفق عليها</li>
                                <li>يلتزم الطرف الثاني بدفع الأتعاب المحددة في هذا العقد</li>
                                <li>مدة العقد 6 أشهر قابلة للتمديد بموافقة الطرفين</li>
                              </ul>
                            </div>
                          </div>

                          {/* التوقيعات */}
                          <div className="grid grid-cols-2 gap-8 pt-6">
                            <div className="text-center">
                              <div className="border-t-2 border-gray-400 pt-2">
                                <p className="text-sm">الطرف الأول (المكتب)</p>
                                <p className="text-xs text-gray-600">الاسم والتوقيع</p>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="border-t-2 border-gray-400 pt-2">
                                <p className="text-sm">الطرف الثاني (المالك)</p>
                                <p className="text-xs text-gray-600">الاسم والتوقيع</p>
                              </div>
                            </div>
                          </div>

                          {/* فوتر القالب */}
                          {selectedTemplate.settings.showFooter && (
                            <div className="text-center pt-4 border-t-2 border-gray-300 mt-6">
                              <p className="text-xs text-gray-600">
                                {selectedTemplate.settings.showPageNumbers && 'صفحة 1 من 1 | '}
                                تم الإنشاء بواسطة نظام إدارة العقود
                              </p>
                            </div>
                          )}

                          {/* علامة مائية */}
                          {selectedTemplate.settings.showWatermark && (
                            <div 
                              className="absolute inset-0 flex items-center justify-center pointer-events-none"
                              style={{ 
                                opacity: 0.1, 
                                transform: 'rotate(-45deg)',
                                fontSize: '48px',
                                fontWeight: 700,
                                color: selectedTemplate.color
                              }}
                            >
                              نسخة تجريبية
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* إعدادات القالب */}
                    <Card className="card-element card-rtl">
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات القالب</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="grid grid-cols-3 gap-3 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <div className="p-2 bg-gray-50 rounded">
                            <p className="text-gray-600 mb-1">حجم الورق</p>
                            <p className="font-mono">{selectedTemplate.settings.paperSize}</p>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <p className="text-gray-600 mb-1">الاتجاه</p>
                            <p>{selectedTemplate.settings.orientation === 'portrait' ? 'عمودي' : 'أفقي'}</p>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <p className="text-gray-600 mb-1">اللغة</p>
                            <p>{selectedTemplate.language}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <DialogFooter className="flex gap-2 justify-start">
                  <Button variant="outline" onClick={() => setShowTemplatePreviewDialog(false)}>
                    <X className="h-3 w-3 ml-1" />
                    إغلاق
                  </Button>
                  <Button className="bg-blue-500" onClick={() => handlePrintTemplate(selectedTemplate)}>
                    <Printer className="h-3 w-3 ml-1" />
                    طباعة
                  </Button>
                  <Button variant="outline" onClick={() => handleSendTemplate(selectedTemplate)}>
                    <Mail className="h-3 w-3 ml-1" />
                    إرسال
                  </Button>
                  <Button variant="outline" onClick={() => handleEditTemplate(selectedTemplate)}>
                    <Edit className="h-3 w-3 ml-1" />
                    تعديل
                  </Button>
                  <Button variant="outline">
                    <Download className="h-3 w-3 ml-1" />
                    تصدير PDF
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* نافذة إضافة/تعديل قالب */}
            <Dialog open={showAddTemplateDialog} onOpenChange={setShowAddTemplateDialog}>
              <DialogContent className="max-w-3xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">
                    {selectedTemplate ? 'تعديل القالب' : 'إضافة قالب جديد'}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <InputWithCopy
                      label="اسم القالب *"
                      id="template-name"
                      placeholder="مثال: قالب رسمي"
                      copyable={false}
                      clearable={true}
                    />
                    
                    <SelectWithCopy
                      label="اللغة *"
                      id="template-language"
                      options={[
                        { value: 'العربية', label: 'العربية' },
                        { value: 'English', label: 'English' },
                        { value: 'ثنائي اللغة', label: 'ثنائي اللغة' }
                      ]}
                      copyable={false}
                      clearable={false}
                    />
                  </div>

                  <TextAreaWithCopy
                    label="الوصف"
                    id="template-description"
                    rows={2}
                    placeholder="وصف مختصر للقالب..."
                    copyable={true}
                    clearable={true}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <SelectWithCopy
                      label="حجم الورق"
                      id="template-paper-size"
                      options={[
                        { value: 'A4', label: 'A4' },
                        { value: 'A3', label: 'A3' },
                        { value: 'Letter', label: 'Letter' }
                      ]}
                      copyable={false}
                      clearable={false}
                    />

                    <SelectWithCopy
                      label="الاتجاه"
                      id="template-orientation"
                      options={[
                        { value: 'portrait', label: 'عمودي' },
                        { value: 'landscape', label: 'أفقي' }
                      ]}
                      copyable={false}
                      clearable={false}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <EnhancedSwitch id="template-header" label="إظهار الهيدر" variant="default" size="sm" />
                      <EnhancedSwitch id="template-footer" label="إظهار الفوتر" variant="default" size="sm" />
                    </div>
                    <div className="space-y-2">
                      <EnhancedSwitch id="template-watermark" label="علامة مائية" variant="default" size="sm" />
                      <EnhancedSwitch id="template-page-numbers" label="ترقيم الصفحات" variant="default" size="sm" />
                    </div>
                  </div>

                  <EnhancedSwitch 
                    id="template-active" 
                    label="تفعيل القالب" 
                    description="جعل هذا القالب متاحاً للاستخدام"
                    variant="success" 
                    size="sm" 
                  />
                </div>

                <DialogFooter className="flex gap-2 justify-start">
                  <Button variant="outline" onClick={() => setShowAddTemplateDialog(false)}>
                    <X className="h-3 w-3 ml-1" />
                    إلغاء
                  </Button>
                  <Button className="bg-purple-500" onClick={handleSaveTemplate}>
                    <Save className="h-3 w-3 ml-1" />
                    حفظ القالب
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case '777-06':
        // إعدادات الإشعارات
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات إشعارات العقود</h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Card className="card-element card-rtl" style={{ background: '#dbeafe' }}>
                <CardContent className="p-3">
                  <Mail className="h-5 w-5 text-blue-600 mb-2" />
                  <p className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>إشعارات البريد</p>
                  <EnhancedSwitch id="email-notify" label="تفعيل الإشعارات" variant="default" size="sm" />
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: '#dcfce7' }}>
                <CardContent className="p-3">
                  <Activity className="h-5 w-5 text-green-600 mb-2" />
                  <p className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>إشعارات SMS</p>
                  <EnhancedSwitch id="sms-notify" label="تفعيل الإشعارات" variant="success" size="sm" />
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: '#fef3c7' }}>
                <CardContent className="p-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mb-2" />
                  <p className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>تنبيهات النظام</p>
                  <EnhancedSwitch id="system-notify" label="تفعيل التنبيهات" variant="warning" size="sm" />
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>أنواع الإشعارات</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {[
                    { title: 'عقد جديد', desc: 'إشعار عند إنشاء عقد جديد', enabled: true },
                    { title: 'انتظار اعتماد', desc: 'إشعار للمعتمدين', enabled: true },
                    { title: 'اعتماد العقد', desc: 'إشعار عند الاعتماد', enabled: true },
                    { title: 'رفض العقد', desc: 'إشعار عند الرفض', enabled: true },
                    { title: 'قرب انتهاء العقد', desc: 'قبل 30 يوم من الانتهاء', enabled: false },
                    { title: 'تجديد العقد', desc: 'تذكير بالتجديد', enabled: false }
                  ].map((notif, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{notif.title}</p>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{notif.desc}</p>
                      </div>
                      <EnhancedSwitch id={`notif-${idx}`} checked={notif.enabled} size="sm" variant={notif.enabled ? 'success' : 'default'} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '777-07':
        // التوقيع الرقمي
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات التوقيع الرقمي</h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}>
                <CardContent className="p-3">
                  <FileCheck className="h-5 w-5 text-blue-600 mb-2" />
                  <p className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوقيع الإلكتروني</p>
                  <EnhancedSwitch id="e-sign" label="تفعيل التوقيع الرقمي" variant="default" size="sm" />
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' }}>
                <CardContent className="p-3">
                  <Shield className="h-5 w-5 text-green-600 mb-2" />
                  <p className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>شهادة رقمية</p>
                  <EnhancedSwitch id="cert" label="استخدام شهادة SSL" variant="success" size="sm" />
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
                <CardContent className="p-3">
                  <Lock className="h-5 w-5 text-amber-600 mb-2" />
                  <p className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التشفير</p>
                  <EnhancedSwitch id="encrypt" label="تشفير التوقيعات" variant="warning" size="sm" />
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>موفرو خدمة التوقيع</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {[
                    { name: 'ثقة (THIQAH)', status: 'مفعّل', icon: '🇸🇦' },
                    { name: 'DocuSign', status: 'غير مفعّل', icon: '🌐' },
                    { name: 'Adobe Sign', status: 'غير مفعّل', icon: '📄' }
                  ].map((provider, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{provider.icon}</span>
                        <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{provider.name}</span>
                      </div>
                      <Badge className={`text-xs ${provider.status === 'مفعّل' ? 'bg-green-500' : 'bg-gray-400'} text-white`}>
                        {provider.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-element card-rtl" style={{ background: '#eff6ff', border: '2px solid #93c5fd' }}>
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                      التوقيع الرقمي معتمد قانونياً في المملكة العربية السعودية
                    </p>
                    <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      استخدم موفري الخدمة المعتمدين من هيئة الحكومة الرقمية
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '777-08':
        // خلفيات الحماية
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الحماية والأمان</h2>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { title: 'تشفير', icon: Lock, color: '#2563eb', value: 'AES-256' },
                { title: 'نسخ احتياطي', icon: Download, color: '#10b981', value: 'يومي' },
                { title: 'صلاحيات', icon: Shield, color: '#f59e0b', value: 'متقدمة' },
                { title: 'سجل', icon: Activity, color: '#8b5cf6', value: 'مفعّل' }
              ].map((item, idx) => (
                <Card key={idx} className="card-element card-rtl">
                  <CardContent className="p-2 text-center">
                    <item.icon className="h-4 w-4 mx-auto mb-1" style={{ color: item.color }} />
                    <p className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.title}</p>
                    <Badge className="text-[10px]" style={{ background: item.color }}>{item.value}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الأمان</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2">
                <EnhancedSwitch 
                  id="encrypt-contracts" 
                  label="تشفير ملفات العقود" 
                  description="تشفير AES-256 bit"
                  variant="default" 
                />
                <EnhancedSwitch 
                  id="backup-auto" 
                  label="نسخ احتياطي تلقائي" 
                  description="نسخة يومية من قاعدة البيانات"
                  variant="success" 
                />
                <EnhancedSwitch 
                  id="audit-log" 
                  label="سجل المراجعة" 
                  description="تسجيل جميع التعديلات"
                  variant="warning" 
                />
                <EnhancedSwitch 
                  id="two-factor" 
                  label="توثيق ثنائي" 
                  description="مطلوب لإجراءات حساسة"
                  variant="danger" 
                />
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>صلاحيات الوصول</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الدور</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>عرض</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تعديل</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>حذف</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { role: 'المدير العام', view: true, edit: true, delete: true },
                      { role: 'مدير العقود', view: true, edit: true, delete: false },
                      { role: 'موظف العقود', view: true, edit: false, delete: false },
                      { role: 'مراجع', view: true, edit: false, delete: false }
                    ].map((perm, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{perm.role}</TableCell>
                        <TableCell className="text-right py-2">{perm.view ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}</TableCell>
                        <TableCell className="text-right py-2">{perm.edit ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}</TableCell>
                        <TableCell className="text-right py-2">{perm.delete ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '777-09':
        // اعدادات البنود (من v2.0)
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>قوالب البنود ({clauseTemplates.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-green-500" onClick={() => setShowAddClauseDialog(true)}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة بند جديد
              </Button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {['مالي', 'قانوني', 'فني', 'إداري', 'ضمانات', 'التزامات'].map((category) => (
                <Card key={category} className="card-element card-rtl" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
                  <CardContent className="p-2 text-center">
                    <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                      {clauseTemplates.filter(c => c.category === category).length}
                    </p>
                    <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-2">
              {clauseTemplates.map((clause) => (
                <Card key={clause.id} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{clause.title}</h3>
                          <Badge className={`text-xs ${clause.isRequired ? 'bg-red-500' : 'bg-blue-500'} text-white`}>
                            {clause.isRequired ? 'إلزامي' : 'اختياري'}
                          </Badge>
                          <Badge className="text-xs bg-gray-500 text-white">{clause.category}</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>{clause.content}</p>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الترتيب: </span>
                            <span className="font-mono">{clause.order}</span>
                          </div>
                          <div>
                            <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قابل للتعديل: </span>
                            <Badge className={`text-xs ${clause.isEditable ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
                              {clause.isEditable ? 'نعم' : 'لا'}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر تعديل: </span>
                            <span className="font-mono">{clause.lastModified}</span>
                          </div>
                        </div>

                        <div className="mt-2 bg-blue-50 p-2 rounded">
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                            <strong>ينطبق على:</strong> {clause.applicableToTypes.join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 mr-3">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* نافذة إضافة بند */}
            <Dialog open={showAddClauseDialog} onOpenChange={setShowAddClauseDialog}>
              <DialogContent className="max-w-3xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">إضافة بند جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <InputWithCopy
                    label="عنوان البند *"
                    id="clause-title"
                    placeholder="مثال: بند الأتعاب والدفعات"
                    copyable={false}
                    clearable={true}
                  />
                  
                  <TextAreaWithCopy
                    label="محتوى البند *"
                    id="clause-content"
                    rows={4}
                    placeholder="النص الكامل للبند..."
                    copyable={false}
                    clearable={true}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <SelectWithCopy
                      label="التصنيف *"
                      id="clause-category"
                      options={[
                        { value: 'مالي', label: 'مالي' },
                        { value: 'قانوني', label: 'قانوني' },
                        { value: 'فني', label: 'فني' },
                        { value: 'إداري', label: 'إداري' },
                        { value: 'ضمانات', label: 'ضمانات' },
                        { value: 'التزامات', label: 'التزامات' }
                      ]}
                      copyable={false}
                      clearable={false}
                    />

                    <InputWithCopy
                      label="الترتيب *"
                      id="clause-order"
                      placeholder="1"
                      copyable={false}
                      clearable={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <EnhancedSwitch
                      id="clause-required"
                      label="بند إلزامي"
                      description="يجب تضمينه في جميع العقود"
                      variant="danger"
                    />
                    <EnhancedSwitch
                      id="clause-editable"
                      label="قابل للتعديل"
                      description="يمكن تعديله عند إنشاء العقد"
                      variant="success"
                    />
                  </div>
                </div>
                <DialogFooter className="flex gap-2 justify-start">
                  <Button variant="outline" onClick={() => setShowAddClauseDialog(false)}>
                    <X className="h-3 w-3 ml-1" />
                    إلغاء
                  </Button>
                  <Button className="bg-green-500" onClick={handleAddClause}>
                    <Save className="h-3 w-3 ml-1" />
                    حفظ البند
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case '777-10':
        // اعدادات الرفض (من v2.0)
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>أسباب رفض العقود ({rejectionReasons.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-red-500" onClick={() => setShowAddRejectionDialog(true)}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة سبب جديد
              </Button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {['قانوني', 'مالي', 'فني', 'إداري', 'أخرى'].map((category) => (
                <Card key={category} className="card-element card-rtl" style={{ background: '#fef2f2', border: '2px solid #fca5a5' }}>
                  <CardContent className="p-2 text-center">
                    <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>
                      {rejectionReasons.filter(r => r.category === category).length}
                    </p>
                    <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <div className="space-y-1">
                  {rejectionReasons.map((reason) => (
                    <div 
                      key={reason.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-red-50"
                      style={{ border: '1px solid #fef2f2' }}
                    >
                      <div className="bg-red-500 text-white rounded px-2 py-1 text-xs font-mono">
                        {reason.code}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{reason.reason}</p>
                      </div>
                      <Badge className="text-xs bg-gray-500 text-white">{reason.category}</Badge>
                      {reason.requiresDetails && (
                        <Badge className="text-xs bg-amber-500 text-white">يحتاج تفاصيل</Badge>
                      )}
                      <Badge className="text-xs bg-blue-500 text-white font-mono">
                        {reason.usageCount} استخدام
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* نافذة إضافة سبب رفض */}
            <Dialog open={showAddRejectionDialog} onOpenChange={setShowAddRejectionDialog}>
              <DialogContent className="max-w-2xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">إضافة سبب رفض جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <InputWithCopy
                    label="رمز السبب *"
                    id="rejection-code"
                    placeholder="REJ-008"
                    copyable={false}
                    clearable={true}
                  />
                  
                  <TextAreaWithCopy
                    label="سبب الرفض *"
                    id="rejection-reason"
                    rows={3}
                    placeholder="أدخل سبب رفض العقد..."
                    copyable={false}
                    clearable={true}
                  />

                  <SelectWithCopy
                    label="التصنيف *"
                    id="rejection-category"
                    options={[
                      { value: 'قانوني', label: 'مخالفة قانونية' },
                      { value: 'مالي', label: 'مشكلة مالية' },
                      { value: 'فني', label: 'مشكلة فنية' },
                      { value: 'إداري', label: 'مشكلة إدارية' },
                      { value: 'أخرى', label: 'أخرى' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />

                  <EnhancedSwitch
                    id="requires-details"
                    label="يحتاج تفاصيل إضافية"
                    description="عند اختيار هذا السبب، يُطلب إدخال تفاصيل"
                    variant="warning"
                  />
                </div>
                <DialogFooter className="flex gap-2 justify-start">
                  <Button variant="outline" onClick={() => setShowAddRejectionDialog(false)}>
                    <X className="h-3 w-3 ml-1" />
                    إلغاء
                  </Button>
                  <Button className="bg-red-500" onClick={handleAddRejection}>
                    <Save className="h-3 w-3 ml-1" />
                    حفظ السبب
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case '777-11':
        // اعدادات التعديل (من v2.0)
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>أسباب إيقاف العقد للتعديل ({modificationReasons.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-amber-500" onClick={() => setShowAddModificationDialog(true)}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة سبب جديد
              </Button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {['بنود', 'قيمة', 'مواصفات', 'أطراف', 'مدة', 'أخرى'].map((category) => (
                <Card key={category} className="card-element card-rtl" style={{ background: '#fffbeb', border: '2px solid #fcd34d' }}>
                  <CardContent className="p-2 text-center">
                    <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                      {modificationReasons.filter(m => m.category === category).length}
                    </p>
                    <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <div className="space-y-1">
                  {modificationReasons.map((reason) => (
                    <div 
                      key={reason.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-amber-50"
                      style={{ border: '1px solid #fef3c7' }}
                    >
                      <div className="bg-amber-500 text-white rounded px-2 py-1 text-xs font-mono">
                        {reason.code}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{reason.reason}</p>
                      </div>
                      <Badge className="text-xs bg-gray-500 text-white">{reason.category}</Badge>
                      {reason.requiresApproval && (
                        <Badge className="text-xs bg-red-500 text-white">يحتاج اعتماد</Badge>
                      )}
                      {reason.allowsAutoResume && (
                        <Badge className="text-xs bg-green-500 text-white">استئناف تلقائي</Badge>
                      )}
                      <Badge className="text-xs bg-blue-500 text-white font-mono">
                        {reason.usageCount} استخدام
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* نافذة إضافة سبب تعديل */}
            <Dialog open={showAddModificationDialog} onOpenChange={setShowAddModificationDialog}>
              <DialogContent className="max-w-2xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">إضافة سبب تعديل جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <InputWithCopy
                    label="رمز السبب *"
                    id="modification-code"
                    placeholder="MOD-008"
                    copyable={false}
                    clearable={true}
                  />
                  
                  <TextAreaWithCopy
                    label="سبب التعديل *"
                    id="modification-reason"
                    rows={3}
                    placeholder="أدخل سبب إيقاف العقد للتعديل..."
                    copyable={false}
                    clearable={true}
                  />

                  <SelectWithCopy
                    label="التصنيف *"
                    id="modification-category"
                    options={[
                      { value: 'بنود', label: 'تعديل في البنود' },
                      { value: 'قيمة', label: 'تعديل القيمة' },
                      { value: 'مواصفات', label: 'تعديل المواصفات' },
                      { value: 'أطراف', label: 'تغيير الأطراف' },
                      { value: 'مدة', label: 'تعديل المدة' },
                      { value: 'أخرى', label: 'أخرى' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />

                  <div className="space-y-2">
                    <EnhancedSwitch
                      id="requires-approval"
                      label="يحتاج إعادة اعتماد"
                      description="بعد التعديل، يجب إعادة اعتماد العقد"
                      variant="danger"
                    />
                    <EnhancedSwitch
                      id="auto-resume"
                      label="استئناف تلقائي"
                      description="العقد يُستأنف تلقائياً بعد التعديل"
                      variant="success"
                    />
                  </div>
                </div>
                <DialogFooter className="flex gap-2 justify-start">
                  <Button variant="outline" onClick={() => setShowAddModificationDialog(false)}>
                    <X className="h-3 w-3 ml-1" />
                    إلغاء
                  </Button>
                  <Button className="bg-amber-500" onClick={handleAddModification}>
                    <Save className="h-3 w-3 ml-1" />
                    حفظ السبب
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>محتوى التبويب قيد التطوير</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
      <UnifiedTabsSidebar
        tabs={TABS_CONFIG}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ContractSettings_Advanced_777_v3;