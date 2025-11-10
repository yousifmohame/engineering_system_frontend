/**
 * ============================================================================
 * الشاشة 777 - إعدادات العقود v3.4 - تحديث شامل
 * ============================================================================
 * 
 * تحديثات v3.4:
 * ✅ التاب 777-02: إضافة أنواع جديدة للعقود
 * ✅ التاب 777-05: نظام قوالب طباعة متطور (scroll + تخصيص شامل)
 * ✅ التاب 777-12: إعدادات الأطراف (تطوير كامل)
 * ✅ التاب 777-13: عدادات التوقيع (جديد)
 * 
 * @version 3.4
 * @date 2025-11-05
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
  ChevronDown, ChevronRight, Calendar, User, Hash, Image, Type, Ruler
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner';
import CodeDisplay from '../CodeDisplay';
import { copyToClipboard } from '../utils/clipboard';

// تكوين التابات - محدث v3.4
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
  { id: '777-13', number: '777-13', title: 'عدادات التوقيع', icon: PenTool }, // جديد v3.4
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
  standardDuration: number;
  minDuration: number;
  maxDuration: number;
  standardFees: number;
  feesType: 'ثابت' | 'متغير حسب المساحة' | 'نسبة من التكلفة' | 'حسب الاتفاق';
  requiresLicense: boolean;
  requiresInsurance: boolean;
  applicableBuildings: string[];
  relatedAuthorities: string[];
  requiredDocuments: string[];
  standardClauses: string[];
  isActive: boolean;
  usageCount: number;
  createdDate: string;
  lastModified: string;
  notes: string;
}

// واجهات جديدة v3.4
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
  headerHeight: number;  // جديد v3.4
  footerHeight: number;  // جديد v3.4
  headerImage?: string;  // جديد v3.4
  footerImage?: string;  // جديد v3.4
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

interface PrintTemplate {
  id: string;
  name: string;
  description: string;
  color: string;
  active: boolean;
  language: string;
  sampleNumber: string;
  settings: PrintTemplateSettings;
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

// واجهة جديدة v3.4: عداد التوقيع
interface SignatureCounter {
  id: string;
  name: string;
  elements: SignatureElement[];
  isActive: boolean;
  order: number;
}

interface SignatureElement {
  id: string;
  type: 'date' | 'employee' | 'jobNumber' | 'text' | 'line';
  label: string;
  value?: string;
  employeeId?: string;
  employeeName?: string;
  employeeJobNumber?: string;
  showJobNumber: boolean;
  order: number;
}

const ContractSettings_Advanced_777_v3_4: React.FC = () => {
  const [activeTab, setActiveTab] = useState('777-01');
  
  // States للتابات المختلفة
  const [showAddTypeDialog, setShowAddTypeDialog] = useState(false);
  const [showTemplatePreviewDialog, setShowTemplatePreviewDialog] = useState(false);
  const [showAddTemplateDialog, setShowAddTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<PrintTemplate | null>(null);
  const [showAddPartyDialog, setShowAddPartyDialog] = useState(false);
  const [showEditPartyDialog, setShowEditPartyDialog] = useState(false);
  const [selectedParty, setSelectedParty] = useState<ContractParty | null>(null);
  const [showAddSignatureDialog, setShowAddSignatureDialog] = useState(false);
  const [showAddElementDialog, setShowAddElementDialog] = useState(false);
  const [selectedSignature, setSelectedSignature] = useState<SignatureCounter | null>(null);
  
  // States جديدة للتاب 777-12
  const [selectedPartyType, setSelectedPartyType] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedApplicantName, setSelectedApplicantName] = useState('');

  // بيانات وهمية - العملاء (من الشاشة 300)
  const mockClients = [
    { id: 'CL-001', code: '300-001', name: 'أحمد محمد العلي', idNumber: '1012345678', phone: '+966501234567', email: 'ahmed.ali@email.com', address: 'الرياض - حي النخيل' },
    { id: 'CL-002', code: '300-002', name: 'خالد سعد الدوسري', idNumber: '1023456789', phone: '+966502345678', email: 'khaled.dosari@email.com', address: 'الرياض - حي الملقا' },
    { id: 'CL-003', code: '300-003', name: 'فاطمة علي الشمري', idNumber: '1034567890', phone: '+966503456789', email: 'fatima.shammari@email.com', address: 'الرياض - حي العليا' },
    { id: 'CL-004', code: '300-004', name: 'محمد عبدالله القحطاني', idNumber: '1045678901', phone: '+966504567890', email: 'mohammed.qahtani@email.com', address: 'الرياض - حي الياسمين' },
    { id: 'CL-005', code: '300-005', name: 'سارة فهد المطيري', idNumber: '1056789012', phone: '+966505678901', email: 'sara.mutairi@email.com', address: 'الرياض - حي الربوة' },
    { id: 'CL-006', code: '300-006', name: 'عبدالرحمن صالح العتيبي', idNumber: '1067890123', phone: '+966506789012', email: 'abdulrahman.otaibi@email.com', address: 'الرياض - حي الورود' },
    { id: 'CL-007', code: '300-007', name: 'منى إبراهيم الغامدي', idNumber: '1078901234', phone: '+966507890123', email: 'mona.ghamdi@email.com', address: 'الرياض - حي النرجس' },
    { id: 'CL-008', code: '300-008', name: 'عبدالعزيز حمد الشهراني', idNumber: '1089012345', phone: '+966508901234', email: 'abdulaziz.shahrani@email.com', address: 'الرياض - حي الصحافة' },
    { id: 'CL-009', code: '300-009', name: 'نورة سليمان الحربي', idNumber: '1090123456', phone: '+966509012345', email: 'noura.harbi@email.com', address: 'الرياض - حي الملك فهد' },
    { id: 'CL-010', code: '300-010', name: 'يوسف ماجد الزهراني', idNumber: '1001234567', phone: '+966500123456', email: 'yousef.zahrani@email.com', address: 'الرياض - حي السليمانية' },
  ];

  // بيانات وهمية - أنواع العقود (25 نوع)
  const [contractTypes, setContractTypes] = useState<ContractType[]>([
    {
      id: 'CT001',
      code: 'RL-RES-01',
      nameAr: 'عقد استخراج رخصة بناء سكني',
      nameEn: 'Residential Building Permit Contract',
      category: 'رخص البناء',
      subCategory: 'سكني',
      description: 'عقد لاستخراج رخصة بناء لمبنى سكني',
      standardDuration: 3,
      minDuration: 2,
      maxDuration: 6,
      standardFees: 15000,
      feesType: 'متغير حسب المساحة',
      requiresLicense: true,
      requiresInsurance: true,
      applicableBuildings: ['فيلا', 'عمارة سكنية', 'دوبلكس'],
      relatedAuthorities: ['أمانة الرياض', 'وزارة الشؤون البلدية'],
      requiredDocuments: ['صك الملكية', 'مخطط معماري', 'مخطط إنشائي'],
      standardClauses: ['التزام المالك', 'التزام المكتب', 'شروط الدفع'],
      isActive: true,
      usageCount: 45,
      createdDate: '2025-01-15',
      lastModified: '2025-11-01',
      notes: 'نوع عقد شائع'
    },
    // يمكن إضافة المزيد من الأنواع...
  ]);

  // بيانات وهمية - قوالب الطباعة
  const [printTemplates, setPrintTemplates] = useState<PrintTemplate[]>([
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
        showPageNumbers: true,
        fontSize: 12,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 15,
        marginRight: 15,
        headerHeight: 80,
        footerHeight: 60,
        includeDigitalAuth: true,
        includeManualAuth: false,
        showContractNumber: true,
        showCreationDate: true,
        showFirstPartyApprovalDate: true,
        showSecondPartyApprovalDate: true,
        showOtherPartiesApprovalDates: false,
        showOwnershipNumber: true,
        showOwnershipDocuments: true
      }
    },
    {
      id: 'TPL-002',
      name: 'قالب مبسط',
      description: 'قالب مبسط بدون تفاصيل زائدة',
      color: '#10b981',
      active: true,
      language: 'العربية',
      sampleNumber: 'CON-2025-002',
      settings: {
        paperSize: 'A4',
        orientation: 'portrait',
        showHeader: false,
        showFooter: true,
        showWatermark: false,
        showPageNumbers: true,
        fontSize: 11,
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 15,
        marginRight: 15,
        headerHeight: 0,
        footerHeight: 40,
        includeDigitalAuth: false,
        includeManualAuth: false,
        showContractNumber: true,
        showCreationDate: false,
        showFirstPartyApprovalDate: false,
        showSecondPartyApprovalDate: false,
        showOtherPartiesApprovalDates: false,
        showOwnershipNumber: false,
        showOwnershipDocuments: false
      }
    }
  ]);

  // بيانات وهمية - الأطراف
  const [contractParties, setContractParties] = useState<ContractParty[]>([
    {
      id: 'PARTY-001',
      partyNumber: 1,
      type: 'مكتبنا',
      name: 'مكتب الاستشارات الهندسية المتطورة',
      idNumber: '1234567890',
      phone: '+966112345678',
      email: 'info@engineeringoffice.sa',
      address: 'الرياض، المملكة العربية السعودية',
      representative: 'المهندس أحمد محمد',
      representativeId: '1023456789',
      isDefault: true,
      createdDate: '2025-01-01',
      lastModified: '2025-01-01'
    }
  ]);

  // بيانات وهمية - عدادات التوقيع (جديد v3.4)
  const [signatureCounters, setSignatureCounters] = useState<SignatureCounter[]>([
    {
      id: 'SIG-001',
      name: 'توقيع قياسي',
      elements: [
        {
          id: 'EL-001',
          type: 'date',
          label: 'التاريخ',
          showJobNumber: false,
          order: 1
        },
        {
          id: 'EL-002',
          type: 'employee',
          label: 'الموظف المعتمد',
          employeeId: 'EMP-001',
          employeeName: 'م. خالد العتيبي',
          employeeJobNumber: 'ENG-2024-045',
          showJobNumber: true,
          order: 2
        },
        {
          id: 'EL-003',
          type: 'line',
          label: 'خط التوقيع',
          showJobNumber: false,
          order: 3
        }
      ],
      isActive: true,
      order: 1
    }
  ]);

  // بيانات وهمية - الموظفين
  const employees = [
    { id: 'EMP-001', name: 'م. خالد العتيبي', jobNumber: 'ENG-2024-045', department: 'الهندسة' },
    { id: 'EMP-002', name: 'م. سارة المطيري', jobNumber: 'ENG-2024-023', department: 'الإشراف' },
    { id: 'EMP-003', name: 'د. محمد الشمري', jobNumber: 'MGR-2024-001', department: 'الإدارة' },
    { id: 'EMP-004', name: 'م. فاطمة القحطاني', jobNumber: 'ENG-2024-067', department: 'التصميم' },
    { id: 'EMP-005', name: 'م. عبدالله الدوسري', jobNumber: 'ENG-2024-089', department: 'الاستشارات' }
  ];

  // بيانات وهمية - البنود المسبقة (777-03)
  const [presetClauses] = useState([
    {
      id: 'PC-001',
      title: 'بند الأتعاب والدفعات',
      category: 'بنود مالية',
      color: '#e0e7ff',
      subClauses: [
        { id: 'PC-001-01', title: 'الدفعة المقدمة 30%', content: 'تُدفع عند توقيع العقد', usageCount: 45 },
        { id: 'PC-001-02', title: 'الدفعة الثانية 40%', content: 'تُدفع عند الاعتماد', usageCount: 42 },
        { id: 'PC-001-03', title: 'الدفعة النهائية 30%', content: 'تُدفع عند التسليم', usageCount: 38 }
      ],
      usageCount: 45
    },
    {
      id: 'PC-002',
      title: 'بند التزامات المكتب',
      category: 'بنود أساسية',
      color: '#dbeafe',
      subClauses: [
        { id: 'PC-002-01', title: 'الالتزام بالمواعيد', content: 'الالتزام بالخطة الزمنية', usageCount: 50 },
        { id: 'PC-002-02', title: 'جودة الأعمال', content: 'حسب المعايير السعودية', usageCount: 48 }
      ],
      usageCount: 50
    },
    {
      id: 'PC-003',
      title: 'بند التزامات المالك',
      category: 'بنود أساسية',
      color: '#dbeafe',
      subClauses: [
        { id: 'PC-003-01', title: 'توفير الوثائق', content: 'صك الملكية والمستندات', usageCount: 47 },
        { id: 'PC-003-02', title: 'السداد في المواعيد', content: 'حسب الجدول المحدد', usageCount: 46 }
      ],
      usageCount: 48
    }
  ]);
  const [expandedClauses, setExpandedClauses] = useState<string[]>([]);
  const [showAddClauseDialog, setShowAddClauseDialog] = useState(false);

  // بيانات وهمية - قوالب البنود (777-09)
  const [clauseTemplates] = useState([
    { id: 'CT-001', title: 'بند الأتعاب المالية', content: 'نص البند الخاص بالأتعاب', category: 'مالي', order: 1, isRequired: true, isEditable: false, lastModified: '2025-01-15', applicableToTypes: ['سكني', 'تجاري'] },
    { id: 'CT-002', title: 'بند التأمين المهني', content: 'نص البند الخاص بالتأمين', category: 'قانوني', order: 2, isRequired: true, isEditable: false, lastModified: '2025-01-10', applicableToTypes: ['سكني', 'تجاري', 'صناعي'] },
    { id: 'CT-003', title: 'بند المواصفات الفنية', content: 'نص البند الخاص بالمواصفات', category: 'فني', order: 3, isRequired: false, isEditable: true, lastModified: '2025-01-12', applicableToTypes: ['سكني'] },
    { id: 'CT-004', title: 'بند إجراءات السلامة', content: 'نص البند الخاص بالسلامة', category: 'إداري', order: 4, isRequired: true, isEditable: false, lastModified: '2025-01-08', applicableToTypes: ['صناعي'] },
    { id: 'CT-005', title: 'بند الضمانات', content: 'نص البند الخاص بالضمانات', category: 'ضمانات', order: 5, isRequired: false, isEditable: true, lastModified: '2025-01-14', applicableToTypes: ['تجاري', 'صناعي'] },
    { id: 'CT-006', title: 'بند الالتزامات التعاقدية', content: 'نص البند الخاص بالالتزامات', category: 'التزامات', order: 6, isRequired: true, isEditable: false, lastModified: '2025-01-11', applicableToTypes: ['سكني', 'تجاري'] }
  ]);

  // بيانات وهمية - أسباب الرفض (777-10)
  const [rejectionReasons] = useState([
    { id: 'REJ-001', code: 'REJ-001', reason: 'مخالفة للأنظمة واللوائح', category: 'قانوني', requiresDetails: true, usageCount: 12 },
    { id: 'REJ-002', code: 'REJ-002', reason: 'عدم اكتمال المستندات المطلوبة', category: 'إداري', requiresDetails: false, usageCount: 28 },
    { id: 'REJ-003', code: 'REJ-003', reason: 'قيمة الأتعاب غير مناسبة', category: 'مالي', requiresDetails: true, usageCount: 8 },
    { id: 'REJ-004', code: 'REJ-004', reason: 'مواصفات فنية غير صحيحة', category: 'فني', requiresDetails: true, usageCount: 15 },
    { id: 'REJ-005', code: 'REJ-005', reason: 'بنود غير واضحة أو متناقضة', category: 'قانوني', requiresDetails: true, usageCount: 19 },
    { id: 'REJ-006', code: 'REJ-006', reason: 'عدم موافقة المالك', category: 'أخرى', requiresDetails: true, usageCount: 6 },
    { id: 'REJ-007', code: 'REJ-007', reason: 'إلغاء المشروع', category: 'أخرى', requiresDetails: false, usageCount: 4 }
  ]);
  const [showAddRejectionDialog, setShowAddRejectionDialog] = useState(false);

  // بيانات وهمية - أسباب التعديل (777-11)
  const [modificationReasons] = useState([
    { id: 'MOD-001', code: 'MOD-001', reason: 'تعديل في بنود العقد', category: 'بنود', requiresApproval: true, allowsAutoResume: false, usageCount: 22 },
    { id: 'MOD-002', code: 'MOD-002', reason: 'تعديل قيمة الأتعاب', category: 'قيمة', requiresApproval: true, allowsAutoResume: false, usageCount: 18 },
    { id: 'MOD-003', code: 'MOD-003', reason: 'تعديل المواصفات الفنية', category: 'مواصفات', requiresApproval: true, allowsAutoResume: false, usageCount: 15 },
    { id: 'MOD-004', code: 'MOD-004', reason: 'تغيير أحد الأطراف', category: 'أطراف', requiresApproval: true, allowsAutoResume: false, usageCount: 7 },
    { id: 'MOD-005', code: 'MOD-005', reason: 'تمديد مدة العقد', category: 'مدة', requiresApproval: true, allowsAutoResume: true, usageCount: 31 },
    { id: 'MOD-006', code: 'MOD-006', reason: 'تصحيح أخطاء كتابية', category: 'أخرى', requiresApproval: false, allowsAutoResume: true, usageCount: 45 },
    { id: 'MOD-007', code: 'MOD-007', reason: 'تحديث معلومات الاتصال', category: 'أخرى', requiresApproval: false, allowsAutoResume: true, usageCount: 52 }
  ]);
  const [showAddModificationDialog, setShowAddModificationDialog] = useState(false);

  // دوال الأحداث
  const handleAddContractType = () => {
    toast.success('تمت إضافة نوع العقد بنجاح');
    setShowAddTypeDialog(false);
  };

  const handleSaveTemplate = () => {
    toast.success('تم حفظ القالب بنجاح');
    setShowAddTemplateDialog(false);
    setSelectedTemplate(null);
  };

  const handleSaveParty = () => {
    toast.success('تم حفظ بيانات الطرف بنجاح');
    setShowAddPartyDialog(false);
    setShowEditPartyDialog(false);
    setSelectedParty(null);
  };

  const handleDeleteParty = (id: string) => {
    setContractParties(prev => prev.filter(p => p.id !== id));
    toast.success('تم حذف الطرف بنجاح');
  };

  const handleSaveSignature = () => {
    toast.success('تم حفظ عداد التوقيع بنجاح');
    setShowAddSignatureDialog(false);
    setSelectedSignature(null);
  };

  const handleAddElement = () => {
    toast.success('تمت إضافة العنصر بنجاح');
    setShowAddElementDialog(false);
  };

  // دوال إضافية للتابات الجديدة
  const handleAddClause = () => {
    toast.success('تم إضافة البند بنجاح');
    setShowAddClauseDialog(false);
  };

  const handleAddRejection = () => {
    toast.success('تم إضافة سبب الرفض بنجاح');
    setShowAddRejectionDialog(false);
  };

  const handleAddModification = () => {
    toast.success('تم إضافة سبب التعديل بنجاح');
    setShowAddModificationDialog(false);
  };

  // عرض محتوى التاب
  const renderTabContent = () => {
    switch (activeTab) {
      case '777-01':
        // نظرة عامة
        return (
          <div className="space-y-3">
            <CodeDisplay code="TAB-777-01" position="top-right" />
            <div className="grid grid-cols-4 gap-3">
              <Card className="card-element card-rtl" style={{ background: '#dbeafe', border: '2px solid #93c5fd' }}>
                <CardContent className="p-3 text-center">
                  <FileSignature className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                  <p className="text-2xl mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                    {contractTypes.length}
                  </p>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    أنواع العقود
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: '#dcfce7', border: '2px solid #86efac' }}>
                <CardContent className="p-3 text-center">
                  <Printer className="h-6 w-6 mx-auto text-green-600 mb-2" />
                  <p className="text-2xl mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {printTemplates.length}
                  </p>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    قوالب الطباعة
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <CardContent className="p-3 text-center">
                  <Users className="h-6 w-6 mx-auto text-amber-600 mb-2" />
                  <p className="text-2xl mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {contractParties.length}
                  </p>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    الأطراف
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: '#f3e8ff', border: '2px solid #d8b4fe' }}>
                <CardContent className="p-3 text-center">
                  <PenTool className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                  <p className="text-2xl mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#7c3aed' }}>
                    {signatureCounters.length}
                  </p>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    عدادات التوقيع
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  التحديثات الأخيرة v3.4
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      التاب 777-02: إضافة أنواع جديدة للعقود
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      التاب 777-05: قوالب طباعة متطورة مع scroll
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      التاب 777-12: إعدادات الأطراف كاملة
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      التاب 777-13: عدادات التوقيع (جديد)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '777-02':
        // أنواع العقود - مع إضافة جديد
        return (
          <div className="space-y-3">
            <CodeDisplay code="TAB-777-02" position="top-right" />
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>أنواع العقود</h2>
              <Button 
                size="sm" 
                className="h-8 text-xs bg-blue-500" 
                onClick={() => setShowAddTypeDialog(true)}
              >
                <Plus className="h-3 w-3 ml-1" />
                إضافة نوع جديد
              </Button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {['الكل', 'رخص البناء', 'الإشراف', 'الاستشارات', 'التصميم', 'التقييم والفحص'].map((cat) => (
                <Card key={cat} className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all">
                  <CardContent className="p-2 text-center">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cat}</p>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#2563eb' }}>
                      {cat === 'الكل' ? contractTypes.length : contractTypes.filter(t => t.category === cat).length}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-3">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم العربي</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأتعاب</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contractTypes.map((type) => (
                      <TableRow key={type.id} className="hover:bg-blue-50">
                        <TableCell className="text-right py-2 text-xs font-mono">{type.code}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {type.nameAr}
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">
                          <Badge className="text-xs bg-blue-500">{type.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs font-mono">
                          {type.standardFees.toLocaleString()} ر.س
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="text-xs" style={{ background: type.isActive ? '#10b981' : '#6b7280' }}>
                            {type.isActive ? 'نشط' : 'معطل'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-600">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* نافذة إضافة نوع جديد */}
            <Dialog open={showAddTypeDialog} onOpenChange={setShowAddTypeDialog}>
              <DialogContent className="max-w-4xl dialog-rtl" style={{ maxHeight: '90vh', overflow: 'hidden' }}>
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">إضافة نوع عقد جديد</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] pr-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <InputWithCopy
                        label="الكود *"
                        id="contract-code"
                        placeholder="مثال: RL-COM-01"
                        copyable={false}
                        clearable={true}
                      />
                      
                      <SelectWithCopy
                        label="الفئة *"
                        id="contract-category"
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
                    </div>

                    <InputWithCopy
                      label="الاسم العربي *"
                      id="name-ar"
                      placeholder="اسم العقد بالعربية"
                      copyable={true}
                      clearable={true}
                    />

                    <InputWithCopy
                      label="الاسم الإنجليزي"
                      id="name-en"
                      placeholder="Contract Name in English"
                      copyable={true}
                      clearable={true}
                    />

                    <TextAreaWithCopy
                      label="الوصف"
                      id="description"
                      rows={3}
                      placeholder="وصف تفصيلي للعقد..."
                      copyable={true}
                      clearable={true}
                    />

                    <div className="grid grid-cols-3 gap-3">
                      <InputWithCopy
                        label="المدة القياسية (أشهر)"
                        id="standard-duration"
                        type="number"
                        placeholder="6"
                        copyable={false}
                        clearable={false}
                      />
                      
                      <InputWithCopy
                        label="الحد الأدنى (أشهر)"
                        id="min-duration"
                        type="number"
                        placeholder="3"
                        copyable={false}
                        clearable={false}
                      />
                      
                      <InputWithCopy
                        label="الحد الأقصى (أشهر)"
                        id="max-duration"
                        type="number"
                        placeholder="12"
                        copyable={false}
                        clearable={false}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <InputWithCopy
                        label="الأتعاب القياسية (ر.س)"
                        id="standard-fees"
                        type="number"
                        placeholder="50000"
                        copyable={false}
                        clearable={false}
                      />
                      
                      <SelectWithCopy
                        label="نوع الأتعاب"
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
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <EnhancedSwitch
                        id="requires-license"
                        label="يتطلب ترخيص مهني"
                        variant="default"
                        size="sm"
                      />
                      
                      <EnhancedSwitch
                        id="requires-insurance"
                        label="يتطلب تأمين مهني"
                        variant="default"
                        size="sm"
                      />
                    </div>

                    <EnhancedSwitch
                      id="is-active"
                      label="تفعيل النوع"
                      description="جعل هذا النوع متاحاً للاستخدام"
                      variant="success"
                      size="md"
                    />
                  </div>
                </ScrollArea>

                <DialogFooter className="flex gap-2 justify-start mt-4">
                  <Button variant="outline" onClick={() => setShowAddTypeDialog(false)}>
                    <X className="h-3 w-3 ml-1" />
                    إلغاء
                  </Button>
                  <Button className="bg-blue-500" onClick={handleAddContractType}>
                    <Save className="h-3 w-3 ml-1" />
                    حفظ النوع
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case '777-05':
        // قوالب الطباعة - محدث v3.4
        return (
          <div className="space-y-3">
            <CodeDisplay code="TAB-777-05" position="top-right" />
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>قوالب طباعة العقود</h2>
              <Button 
                size="sm" 
                className="h-8 text-xs bg-purple-500" 
                onClick={() => setShowAddTemplateDialog(true)}
              >
                <Plus className="h-3 w-3 ml-1" />
                قالب جديد
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {printTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all" 
                  style={{ borderTop: `4px solid ${template.color}` }}
                >
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between mb-1">
                      <Printer className="h-4 w-4" style={{ color: template.color }} />
                      <Badge className="text-[9px]" style={{ background: template.active ? '#10b981' : '#6b7280' }}>
                        {template.active ? 'مفعّل' : 'معطّل'}
                      </Badge>
                    </div>
                    <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      {template.name}
                    </p>
                    <p className="text-[9px] text-gray-500 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {template.description}
                    </p>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-6 text-[10px] flex-1"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowTemplatePreviewDialog(true);
                        }}
                      >
                        معاينة
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowAddTemplateDialog(true);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* نافذة المعاينة - مع scroll محدث */}
            <Dialog open={showTemplatePreviewDialog} onOpenChange={setShowTemplatePreviewDialog}>
              <DialogContent 
                className="max-w-5xl dialog-rtl"
                style={{ 
                  maxHeight: '90vh',
                  overflow: 'hidden'
                }}
              >
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">
                    معاينة القالب: {selectedTemplate?.name}
                  </DialogTitle>
                </DialogHeader>

                <ScrollArea 
                  className="max-h-[65vh]"
                  style={{ 
                    overflowY: 'auto',
                    paddingRight: '10px'
                  }}
                >
                  <div className="space-y-4 pr-2">
                    {/* الصفحة 1 */}
                    <Card className="card-element card-rtl" style={{ 
                      background: '#f9fafb', 
                      border: '2px dashed #d1d5db',
                      padding: `${selectedTemplate?.settings?.marginTop || 20}mm ${selectedTemplate?.settings?.marginRight || 15}mm ${selectedTemplate?.settings?.marginBottom || 20}mm ${selectedTemplate?.settings?.marginLeft || 15}mm`,
                      fontSize: `${selectedTemplate?.settings?.fontSize || 12}px`
                    }}>
                      <CardContent className="p-0">
                        {/* هيدر - مع إمكانية صورة */}
                        {selectedTemplate?.settings?.showHeader && (
                          <div 
                            className="pb-4 border-b-2 border-gray-300 mb-4"
                            style={{ 
                              minHeight: `${selectedTemplate?.settings?.headerHeight || 80}px`,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {selectedTemplate?.settings?.headerImage ? (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                                <Image className="h-8 w-8 text-gray-400" />
                                <span className="text-xs text-gray-500 mr-2">صورة الهيدر</span>
                              </div>
                            ) : (
                              <>
                                <h2 className="text-lg" style={{ fontWeight: 700 }}>
                                  اسم المكتب الهندسي
                                </h2>
                                <p className="text-xs text-gray-600">
                                  الرياض - المملكة العربية السعودية
                                </p>
                              </>
                            )}
                          </div>
                        )}

                        {/* محتوى الصفحة 1 */}
                        <div className="space-y-3">
                          <h1 className="text-center text-xl" style={{ fontWeight: 700 }}>
                            عقد استشارات هندسية
                          </h1>
                          
                          {selectedTemplate?.settings?.showContractNumber && (
                            <p className="text-center">رقم العقد: {selectedTemplate?.sampleNumber}</p>
                          )}
                          
                          {/* الأطراف */}
                          <div className="space-y-2">
                            {contractParties
                              .filter(p => p.isDefault || p.partyNumber <= 2)
                              .map((party) => (
                                <div key={party.id}>
                                  <strong>الطرف {party.partyNumber}:</strong> {party.name}
                                  <br />
                                  <span className="text-sm text-gray-600">
                                    الممثل: {party.representative} - رقم الهوية: {party.representativeId}
                                  </span>
                                </div>
                              ))}
                          </div>

                          {/* بيانات الملكية */}
                          {selectedTemplate?.settings?.showOwnershipNumber && (
                            <div className="mt-4 p-3 bg-blue-50 rounded">
                              <p><strong>رقم الملكية:</strong> OWN-2025-001</p>
                              {selectedTemplate?.settings?.showOwnershipDocuments && (
                                <>
                                  <p><strong>مستندات الملكية:</strong></p>
                                  <ul className="mr-6 text-sm">
                                    <li>صك إلكتروني رقم: 310105040083 - تاريخ: 2024-01-15</li>
                                    <li>وثيقة REGA رقم: REGA-2024-5421 - تاريخ: 2024-02-10</li>
                                  </ul>
                                </>
                              )}
                            </div>
                          )}

                          {/* البنود */}
                          <div className="space-y-2">
                            <h2 className="text-base" style={{ fontWeight: 600 }}>البنود الأساسية:</h2>
                            <ol className="mr-6 space-y-2" style={{ listStyle: 'decimal' }}>
                              <li>يلتزم الطرف الأول بتقديم الخدمات الهندسية المتفق عليها.</li>
                              <li>يلتزم الطرف الثاني بدفع الأتعاب المحددة في هذا العقد.</li>
                              <li>مدة العقد 6 أشهر قابلة للتمديد بموافقة الطرفين.</li>
                            </ol>
                          </div>

                          {/* التوثيق الرقمي */}
                          {selectedTemplate?.settings?.includeDigitalAuth && (
                            <div className="mt-6 p-4 bg-green-50 border-2 border-green-500 rounded">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <strong>التوثيق الرقمي</strong>
                              </div>
                              <div className="text-sm space-y-1">
                                <p>📌 توقيع رقمي موثق</p>
                                <p>📌 رقم الشهادة: DIG-CERT-2025-0142</p>
                                <p>📌 تاريخ التوثيق: 2025-01-15 الساعة 10:30 ص</p>
                              </div>
                            </div>
                          )}

                          {/* التوثيق اليدوي */}
                          {selectedTemplate?.settings?.includeManualAuth && (
                            <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-500 rounded">
                              <div className="flex items-center gap-2 mb-2">
                                <PenTool className="h-5 w-5 text-yellow-600" />
                                <strong>التوثيق اليدوي</strong>
                              </div>
                              <div className="text-sm space-y-1">
                                <p>✍️ توقيع يدوي موثق</p>
                                <p>✍️ مكان التوثيق: كتابة العدل بالرياض</p>
                                <p>✍️ رقم التوثيق: MAN-2025-8974</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* فوتر - مع إمكانية صورة */}
                        {selectedTemplate?.settings?.showFooter && (
                          <div 
                            className="mt-6 pt-4 border-t-2 border-gray-300 text-xs text-gray-600"
                            style={{ 
                              minHeight: `${selectedTemplate?.settings?.footerHeight || 60}px`
                            }}
                          >
                            {selectedTemplate?.settings?.footerImage ? (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                                <Image className="h-6 w-6 text-gray-400" />
                                <span className="text-xs text-gray-500 mr-2">صورة الفوتر</span>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                  {selectedTemplate?.settings?.showCreationDate && (
                                    <p>تاريخ الإنشاء: 2025-01-10</p>
                                  )}
                                  {selectedTemplate?.settings?.showFirstPartyApprovalDate && (
                                    <p>تاريخ اعتماد الطرف الأول: 2025-01-12</p>
                                  )}
                                  {selectedTemplate?.settings?.showSecondPartyApprovalDate && (
                                    <p>تاريخ اعتماد الطرف الثاني: 2025-01-14</p>
                                  )}
                                </div>
                                {selectedTemplate?.settings?.showPageNumbers && (
                                  <p className="font-mono">صفحة 1 من 3</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* الصفحة 2 */}
                    <Card className="card-element card-rtl" style={{ 
                      background: '#f9fafb', 
                      border: '2px dashed #d1d5db',
                      padding: `${selectedTemplate?.settings?.marginTop || 20}mm ${selectedTemplate?.settings?.marginRight || 15}mm ${selectedTemplate?.settings?.marginBottom || 20}mm ${selectedTemplate?.settings?.marginLeft || 15}mm`,
                      fontSize: `${selectedTemplate?.settings?.fontSize || 12}px`
                    }}>
                      <CardContent className="p-0">
                        <h2 className="text-base mb-3" style={{ fontWeight: 600 }}>
                          البنود المالية والإدارية
                        </h2>
                        <ol className="mr-6 space-y-2" start={4} style={{ listStyle: 'decimal' }}>
                          <li>قيمة العقد الإجمالية: 50,000 ريال سعودي.</li>
                          <li>يتم الدفع على ثلاث دفعات.</li>
                          <li>يحق للطرف الأول إيقاف العمل في حالة تأخر الدفع.</li>
                        </ol>

                        {selectedTemplate?.settings?.showFooter && (
                          <div className="mt-6 pt-4 border-t-2 border-gray-300 text-xs text-gray-600">
                            <div className="flex justify-between">
                              <p>تم الإنشاء بواسطة نظام إدارة العقود</p>
                              {selectedTemplate?.settings?.showPageNumbers && (
                                <p className="font-mono">صفحة 2 من 3</p>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* الصفحة 3 - التوقيعات */}
                    <Card className="card-element card-rtl" style={{ 
                      background: '#f9fafb', 
                      border: '2px dashed #d1d5db',
                      padding: `${selectedTemplate?.settings?.marginTop || 20}mm ${selectedTemplate?.settings?.marginRight || 15}mm ${selectedTemplate?.settings?.marginBottom || 20}mm ${selectedTemplate?.settings?.marginLeft || 15}mm`,
                      fontSize: `${selectedTemplate?.settings?.fontSize || 12}px`
                    }}>
                      <CardContent className="p-0">
                        <h2 className="text-base mb-4" style={{ fontWeight: 600 }}>
                          التوقيعات والاعتمادات
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-8">
                          {contractParties
                            .filter(p => p.isDefault || p.partyNumber <= 2)
                            .map((party) => (
                              <div key={party.id} className="text-center">
                                <div className="border-t-2 border-gray-400 pt-4">
                                  <p className="font-semibold mb-2">{party.name}</p>
                                  <p className="text-sm text-gray-600">الطرف {party.partyNumber}</p>
                                  <p className="text-sm mb-3">{party.representative}</p>
                                  <div className="h-16 border-2 border-dashed border-gray-300 rounded mb-2 flex items-center justify-center">
                                    <p className="text-gray-400 text-xs">التوقيع</p>
                                  </div>
                                  <p className="text-xs text-gray-500">التاريخ: ___________</p>
                                </div>
                              </div>
                            ))}
                        </div>

                        {selectedTemplate?.settings?.showFooter && (
                          <div className="mt-6 pt-4 border-t-2 border-gray-300 text-xs text-gray-600">
                            <div className="flex justify-between">
                              <p>نهاية العقد - جميع الحقوق محفوظة</p>
                              {selectedTemplate?.settings?.showPageNumbers && (
                                <p className="font-mono">صفحة 3 من 3</p>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>

                <DialogFooter className="flex gap-2 justify-start mt-4">
                  <Button variant="outline" onClick={() => setShowTemplatePreviewDialog(false)}>
                    <X className="h-3 w-3 ml-1" />
                    إغلاق
                  </Button>
                  <Button className="bg-blue-500">
                    <Printer className="h-3 w-3 ml-1" />
                    طباعة
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-3 w-3 ml-1" />
                    إرسال
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowTemplatePreviewDialog(false);
                    setShowAddTemplateDialog(true);
                  }}>
                    <Edit className="h-3 w-3 ml-1" />
                    تعديل
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* نافذة إضافة/تعديل قالب - محدثة v3.4 */}
            <Dialog open={showAddTemplateDialog} onOpenChange={setShowAddTemplateDialog}>
              <DialogContent className="max-w-4xl dialog-rtl" style={{ maxHeight: '90vh', overflow: 'hidden' }}>
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">
                    {selectedTemplate ? 'تعديل القالب' : 'إضافة قالب جديد'}
                  </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] pr-4">
                  <div className="space-y-4">
                    {/* معلومات أساسية */}
                    <Card className="card-element card-rtl">
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm">معلومات أساسية</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-2 space-y-3">
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
                      </CardContent>
                    </Card>

                    {/* إعدادات الصفحة */}
                    <Card className="card-element card-rtl">
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Type className="h-4 w-4 text-blue-600" />
                          إعدادات الصفحة والخطوط
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-2 space-y-3">
                        <div className="grid grid-cols-4 gap-3">
                          <SelectWithCopy
                            label="حجم الورق"
                            id="paper-size"
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
                            options={[
                              { value: 'portrait', label: 'عمودي' },
                              { value: 'landscape', label: 'أفقي' }
                            ]}
                            copyable={false}
                            clearable={false}
                          />

                          <InputWithCopy
                            label="حجم الخط (10-18)"
                            id="font-size"
                            type="number"
                            placeholder="12"
                            copyable={false}
                            clearable={false}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* الهوامش */}
                    <Card className="card-element card-rtl">
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Ruler className="h-4 w-4 text-purple-600" />
                          الهوامش (بالمليمتر)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-2">
                        <div className="grid grid-cols-4 gap-3">
                          <InputWithCopy
                            label="الهامش العلوي"
                            id="margin-top"
                            type="number"
                            placeholder="20"
                            copyable={false}
                            clearable={false}
                          />
                          <InputWithCopy
                            label="الهامش السفلي"
                            id="margin-bottom"
                            type="number"
                            placeholder="20"
                            copyable={false}
                            clearable={false}
                          />
                          <InputWithCopy
                            label="الهامش الأيمن"
                            id="margin-right"
                            type="number"
                            placeholder="15"
                            copyable={false}
                            clearable={false}
                          />
                          <InputWithCopy
                            label="الهامش الأيسر"
                            id="margin-left"
                            type="number"
                            placeholder="15"
                            copyable={false}
                            clearable={false}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* إعدادات الهيدر والفوتر - جديد v3.4 */}
                    <Card className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Image className="h-4 w-4 text-green-600" />
                          إعدادات الهيدر والفوتر (جديد v3.4)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-2 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <EnhancedSwitch 
                            id="show-header" 
                            label="إظهار الهيدر" 
                            variant="success" 
                            size="sm" 
                          />
                          <EnhancedSwitch 
                            id="show-footer" 
                            label="إظهار الفوتر" 
                            variant="success" 
                            size="sm" 
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <InputWithCopy
                            label="ارتفاع الهيدر (بكسل)"
                            id="header-height"
                            type="number"
                            placeholder="80"
                            copyable={false}
                            clearable={false}
                          />
                          <InputWithCopy
                            label="ارتفاع الفوتر (بكسل)"
                            id="footer-height"
                            type="number"
                            placeholder="60"
                            copyable={false}
                            clearable={false}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            صورة الهيدر (اختياري)
                          </label>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Upload className="h-3 w-3 ml-1" />
                              رفع صورة الهيدر
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            صورة الفوتر (اختياري)
                          </label>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Upload className="h-3 w-3 ml-1" />
                              رفع صورة الفوتر
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* إعدادات العرض */}
                    <Card className="card-element card-rtl">
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm">إعدادات العرض</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-2 space-y-2">
                        <div className="grid grid-cols-2 gap-3">
                          <EnhancedSwitch 
                            id="show-watermark" 
                            label="علامة مائية" 
                            variant="default" 
                            size="sm" 
                          />
                          <EnhancedSwitch 
                            id="show-page-numbers" 
                            label="ترقيم الصفحات (X من Y)" 
                            variant="default" 
                            size="sm" 
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* إعدادات التوثيق */}
                    <Card className="card-element card-rtl" style={{ background: '#eff6ff', border: '2px solid #93c5fd' }}>
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-blue-600" />
                          إعدادات التوثيق
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-2 space-y-2">
                        <EnhancedSwitch 
                          id="include-digital-auth" 
                          label="تضمين التوثيق الرقمي" 
                          description="إضافة بيانات التوقيع الرقمي الموثق"
                          variant="default" 
                          size="sm" 
                        />
                        <EnhancedSwitch 
                          id="include-manual-auth" 
                          label="تضمين التوثيق اليدوي" 
                          description="إضافة بيانات التوقيع اليدوي من كتابة العدل"
                          variant="default" 
                          size="sm" 
                        />
                      </CardContent>
                    </Card>

                    {/* بيانات الفوتر */}
                    <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Info className="h-4 w-4 text-amber-600" />
                          بيانات الفوتر التفصيلية
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-2 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <EnhancedSwitch 
                            id="show-contract-number" 
                            label="رقم العقد" 
                            variant="default" 
                            size="sm" 
                          />
                          <EnhancedSwitch 
                            id="show-creation-date" 
                            label="تاريخ الإنشاء" 
                            variant="default" 
                            size="sm" 
                          />
                          <EnhancedSwitch 
                            id="show-first-party-date" 
                            label="تاريخ اعتماد الطرف الأول" 
                            variant="default" 
                            size="sm" 
                          />
                          <EnhancedSwitch 
                            id="show-second-party-date" 
                            label="تاريخ اعتماد الطرف الثاني" 
                            variant="default" 
                            size="sm" 
                          />
                          <EnhancedSwitch 
                            id="show-other-parties-dates" 
                            label="تواريخ الأطراف الأخرى" 
                            variant="default" 
                            size="sm" 
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* بيانات الملكية */}
                    <Card className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-green-600" />
                          بيانات الملكية
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-2 space-y-2">
                        <EnhancedSwitch 
                          id="show-ownership-number" 
                          label="رقم الملكية لدى المكتب" 
                          description="عرض رقم الملكية الداخلي في العقد"
                          variant="success" 
                          size="sm" 
                        />
                        <EnhancedSwitch 
                          id="show-ownership-documents" 
                          label="مستندات الملكية وتواريخها" 
                          description="عرض أرقام الصكوك ووثائق الملكية مع تواريخها"
                          variant="success" 
                          size="sm" 
                        />
                      </CardContent>
                    </Card>

                    {/* التفعيل */}
                    <EnhancedSwitch 
                      id="template-active" 
                      label="تفعيل القالب" 
                      description="جعل هذا القالب متاحاً للاستخدام في العقود"
                      variant="success" 
                      size="md" 
                    />
                  </div>
                </ScrollArea>

                <DialogFooter className="flex gap-2 justify-start mt-4">
                  <Button variant="outline" onClick={() => {
                    setShowAddTemplateDialog(false);
                    setSelectedTemplate(null);
                  }}>
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

      case '777-03':
        // البنود المسبقة
        return (
          <div className="space-y-3">
            <CodeDisplay code="TAB-777-03" position="top-right" />
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
                          </div>
                          
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                              <Copy className="h-3 w-3" />
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
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '777-04':
        // إعدادات الاعتماد
        return (
          <div className="space-y-3">
            <CodeDisplay code="TAB-777-04" position="top-right" />
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

      case '777-06':
        // إعدادات الإشعارات
        return (
          <div className="space-y-3">
            <CodeDisplay code="TAB-777-06" position="top-right" />
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
            <CodeDisplay code="TAB-777-07" position="top-right" />
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
            <CodeDisplay code="TAB-777-08" position="top-right" />
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
        // اعدادات البنود
        return (
          <div className="space-y-3">
            <CodeDisplay code="TAB-777-09" position="top-right" />
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
          </div>
        );

      case '777-10':
        // اعدادات الرفض
        return (
          <div className="space-y-3">
            <CodeDisplay code="TAB-777-10" position="top-right" />
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
          </div>
        );

      case '777-11':
        // اعدادات التعديل
        return (
          <div className="space-y-3">
            <CodeDisplay code="TAB-777-11" position="top-right" />
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
          </div>
        );

      case '777-12':
        // إعدادات الأطراف - تطوير كامل v3.4
        return (
          <div className="space-y-3">
            <CodeDisplay code="TAB-777-12" position="top-right" />
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إعدادات أطراف العقود
              </h2>
              <Button 
                size="sm" 
                className="h-8 text-xs bg-blue-500" 
                onClick={() => setShowAddPartyDialog(true)}
              >
                <Plus className="h-3 w-3 ml-1" />
                إضافة طرف جديد
              </Button>
            </div>

            {/* بطاقات إحصائية */}
            <div className="grid grid-cols-5 gap-2">
              <Card className="card-element card-rtl" style={{ background: '#dbeafe', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                    {contractParties.length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    إجمالي الأطراف
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: '#dcfce7', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <Building className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {contractParties.filter(p => p.type === 'مكتبنا').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    مكتبنا
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Users className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-xl mb-0" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {contractParties.filter(p => p.type === 'عميل').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    العملاء
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: '#f3e8ff', border: '2px solid #d8b4fe' }}>
                <CardContent className="p-2 text-center">
                  <Briefcase className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                  <p className="text-xl mb-0" style={{ fontFamily: 'Tajawal, sans-serif', color: '#7c3aed' }}>
                    {contractParties.filter(p => p.type === 'جهة خارجية').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    جهات خارجية
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: '#e0f2fe', border: '2px solid #7dd3fc' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-cyan-600 mb-1" />
                  <p className="text-xl mb-0" style={{ fontFamily: 'Tajawal, sans-serif', color: '#0891b2' }}>
                    {contractParties.filter(p => p.isDefault).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    أطراف افتراضية
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* جدول الأطراف */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  قائمة أطراف العقود
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الطرف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الممثل القانوني</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الهاتف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contractParties
                      .sort((a, b) => a.partyNumber - b.partyNumber)
                      .map((party) => (
                        <TableRow key={party.id} className="hover:bg-blue-50">
                          <TableCell className="text-right py-2 text-xs font-mono">
                            الطرف {party.partyNumber}
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs">
                            <Badge 
                              className="text-xs"
                              style={{ 
                                background: party.type === 'مكتبنا' ? '#10b981' : 
                                           party.type === 'عميل' ? '#f59e0b' : 
                                           party.type === 'جهة خارجية' ? '#8b5cf6' : '#6b7280'
                              }}
                            >
                              {party.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <div>
                              <p className="font-semibold">{party.name}</p>
                              <p className="text-[10px] text-gray-500">هوية: {party.idNumber}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <div>
                              <p>{party.representative}</p>
                              <p className="text-[10px] text-gray-500">{party.representativeId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs font-mono">
                            {party.phone}
                          </TableCell>
                          <TableCell className="text-right py-2">
                            {party.isDefault && (
                              <Badge className="text-xs bg-green-500">
                                افتراضي
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex gap-1 justify-end">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  setSelectedParty(party);
                                  setShowEditPartyDialog(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              {!party.isDefault && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-red-600"
                                  onClick={() => handleDeleteParty(party.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* معلومات توضيحية */}
            <Card className="card-element card-rtl" style={{ background: '#eff6ff', border: '2px solid #93c5fd' }}>
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs space-y-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <p className="font-semibold">ملاحظات مهمة:</p>
                    <ul className="mr-4 space-y-1" style={{ listStyle: 'disc' }}>
                      <li>الطرف الأول الافتراضي هو مكتبنا ولا يمكن حذفه</li>
                      <li>يمكن اختيار الطرف الثاني من قائمة العملاء (الشاشة 300)</li>
                      <li>يمكن إضافة أي عدد من الأطراف الإضافية حسب الحاجة</li>
                      <li>جميع الأطراف المضافة ستظهر تلقائياً في قوالب الطباعة</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* نافذة إضافة/تعديل طرف */}
            <Dialog open={showAddPartyDialog || showEditPartyDialog} onOpenChange={(open) => {
              setShowAddPartyDialog(open);
              setShowEditPartyDialog(open);
              if (!open) {
                setSelectedParty(null);
                setSelectedPartyType('');
                setSelectedClientId('');
                setSelectedApplicantName('');
              }
            }}>
              <DialogContent className="max-w-4xl dialog-rtl" style={{ maxHeight: '90vh' }}>
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">
                    {selectedParty ? 'تعديل بيانات الطرف' : 'إضافة طرف جديد'}
                  </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <InputWithCopy
                        label="رقم الطرف *"
                        id="party-number"
                        type="number"
                        placeholder="مثال: 2"
                        copyable={false}
                        clearable={false}
                      />

                      <SelectWithCopy
                        label="نوع الطرف *"
                        id="party-type"
                        value={selectedPartyType}
                        onChange={setSelectedPartyType}
                        options={[
                          { value: 'مكتبنا', label: 'مكتبنا' },
                          { value: 'عميل', label: 'عميل (من الشاشة 300)' },
                          { value: 'جهة خارجية', label: 'جهة خارجية' },
                          { value: 'شريك', label: 'شريك' },
                          { value: 'أخرى', label: 'أخرى' }
                        ]}
                        copyable={false}
                        clearable={false}
                      />
                    </div>

                    {/* إذا كان النوع "عميل" - قائمة العملاء */}
                    {selectedPartyType === 'عميل' ? (
                      <>
                        <SelectWithCopy
                          label="اختر العميل *"
                          id="select-client"
                          value={selectedClientId}
                          onChange={setSelectedClientId}
                          options={mockClients.map(client => ({
                            value: client.id,
                            label: `${client.name} (${client.code})`
                          }))}
                          copyable={false}
                          clearable={true}
                        />

                        {selectedClientId && (
                          <>
                            {/* معلومات العميل المحددة */}
                            <Card className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                              <CardContent className="p-3">
                                <div className="text-xs space-y-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <p className="font-semibold">تم اختيار العميل بنجاح</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <span className="text-gray-600">رقم الهوية: </span>
                                      <span className="font-mono">{mockClients.find(c => c.id === selectedClientId)?.idNumber}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">الهاتف: </span>
                                      <span className="font-mono">{mockClients.find(c => c.id === selectedClientId)?.phone}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">البريد: </span>
                                      <span className="text-[10px]">{mockClients.find(c => c.id === selectedClientId)?.email}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">العنوان: </span>
                                      <span className="text-[10px]">{mockClients.find(c => c.id === selectedClientId)?.address}</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* اختيار اسم مقدم الطلب */}
                            <SelectWithCopy
                              label="اسم مقدم الطلب (اختياري)"
                              id="applicant-name"
                              value={selectedApplicantName}
                              onChange={setSelectedApplicantName}
                              options={[
                                { value: '', label: '-- اختر اسم مقدم الطلب --' },
                                { value: 'same', label: 'نفس العميل' },
                                { value: 'representative', label: 'الممثل القانوني' },
                                { value: 'custom', label: 'شخص آخر (حدد يدوياً)' }
                              ]}
                              copyable={false}
                              clearable={true}
                            />

                            {/* إذا اختار "شخص آخر" */}
                            {selectedApplicantName === 'custom' && (
                              <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                                <CardHeader className="p-2 pb-1">
                                  <CardTitle className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                    بيانات مقدم الطلب
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="p-2 pt-0 space-y-2">
                                  <InputWithCopy
                                    label="الاسم الكامل *"
                                    id="custom-applicant-name"
                                    placeholder="اسم مقدم الطلب"
                                    copyable={true}
                                    clearable={true}
                                  />
                                  <div className="grid grid-cols-2 gap-2">
                                    <InputWithCopy
                                      label="رقم الهوية *"
                                      id="custom-applicant-id"
                                      placeholder="1234567890"
                                      copyable={true}
                                      clearable={true}
                                    />
                                    <InputWithCopy
                                      label="رقم الهاتف *"
                                      id="custom-applicant-phone"
                                      placeholder="+966xxxxxxxxx"
                                      copyable={true}
                                      clearable={true}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* قسم بيانات التفويض */}
                            <Card className="card-element card-rtl" style={{ background: '#eff6ff', border: '2px solid #93c5fd' }}>
                              <CardHeader className="p-2 pb-1">
                                <CardTitle className="text-xs flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  <FileCheck className="h-4 w-4 text-blue-600" />
                                  بيانات التفويض (إن وجد)
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-2 pt-0 space-y-2">
                                <EnhancedSwitch
                                  id="has-authorization"
                                  label="يوجد تفويض رسمي"
                                  description="تفعيل في حالة وجود تفويض رسمي من العميل"
                                  variant="default"
                                  size="sm"
                                />

                                <div className="grid grid-cols-2 gap-2">
                                  <InputWithCopy
                                    label="رقم التفويض"
                                    id="authorization-number"
                                    placeholder="رقم التفويض"
                                    copyable={true}
                                    clearable={true}
                                  />
                                  <InputWithCopy
                                    label="تاريخ الإصدار"
                                    id="authorization-date"
                                    type="date"
                                    copyable={true}
                                    clearable={true}
                                  />
                                </div>

                                <InputWithCopy
                                  label="جهة الإصدار"
                                  id="authorization-issuer"
                                  placeholder="مثال: وزارة العدل - كتابة العدل"
                                  copyable={true}
                                  clearable={true}
                                />

                                <TextAreaWithCopy
                                  label="ملاحظات التفويض"
                                  id="authorization-notes"
                                  rows={2}
                                  placeholder="أي ملاحظات خاصة بالتفويض..."
                                  copyable={true}
                                  clearable={true}
                                />

                                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded border border-amber-200">
                                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>
                                    يُفضل إرفاق صورة من التفويض الرسمي في مستندات العقد
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </>
                        )}
                      </>
                    ) : (
                      /* النموذج العادي لغير العملاء */
                      <>
                        <InputWithCopy
                          label="اسم الطرف *"
                          id="party-name"
                          placeholder="الاسم الكامل للطرف"
                          copyable={true}
                          clearable={true}
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <InputWithCopy
                            label="رقم الهوية / السجل *"
                            id="party-id"
                            placeholder="1234567890"
                            copyable={true}
                            clearable={true}
                          />

                          <InputWithCopy
                            label="رقم الهاتف *"
                            id="party-phone"
                            placeholder="+966xxxxxxxxx"
                            copyable={true}
                            clearable={true}
                          />
                        </div>

                        <InputWithCopy
                          label="البريد الإلكتروني"
                          id="party-email"
                          type="email"
                          placeholder="email@example.com"
                          copyable={true}
                          clearable={true}
                        />

                        <TextAreaWithCopy
                          label="العنوان"
                          id="party-address"
                          rows={2}
                          placeholder="العنوان الكامل..."
                          copyable={true}
                          clearable={true}
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <InputWithCopy
                            label="الممثل القانوني *"
                            id="representative-name"
                            placeholder="اسم الممثل القانوني"
                            copyable={true}
                            clearable={true}
                          />

                          <InputWithCopy
                            label="هوية الممثل *"
                            id="representative-id"
                            placeholder="1234567890"
                            copyable={true}
                            clearable={true}
                          />
                        </div>
                      </>
                    )}

                    <EnhancedSwitch
                      id="party-default"
                      label="جعله طرفاً افتراضياً"
                      description="سيظهر تلقائياً كطرف افتراضي في جميع العقود الجديدة"
                      variant="success"
                      size="sm"
                    />
                  </div>
                </ScrollArea>

                <DialogFooter className="flex gap-2 justify-start">
                  <Button variant="outline" onClick={() => {
                    setShowAddPartyDialog(false);
                    setShowEditPartyDialog(false);
                    setSelectedParty(null);
                    setSelectedPartyType('');
                    setSelectedClientId('');
                    setSelectedApplicantName('');
                  }}>
                    <X className="h-3 w-3 ml-1" />
                    إلغاء
                  </Button>
                  <Button className="bg-blue-500" onClick={handleSaveParty}>
                    <Save className="h-3 w-3 ml-1" />
                    حفظ الطرف
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case '777-13':
        // عدادات التوقيع - جديد v3.4
        return (
          <div className="space-y-3">
            <CodeDisplay code="TAB-777-13" position="top-right" />
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                عدادات التوقيع
              </h2>
              <Button 
                size="sm" 
                className="h-8 text-xs bg-purple-500" 
                onClick={() => setShowAddSignatureDialog(true)}
              >
                <Plus className="h-3 w-3 ml-1" />
                إضافة عداد جديد
              </Button>
            </div>

            <Card className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs space-y-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <p className="font-semibold">ما هو عداد التوقيع؟</p>
                    <p>
                      عداد التوقيع هو مجموعة من العناصر التي تظهر في منطقة التوقيع في العقد، 
                      مثل التاريخ واسم الموظف المعتمد ورقمه الوظيفي وخط التوقيع وغيرها.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* قائمة العدادات */}
            <div className="grid grid-cols-3 gap-3">
              {signatureCounters.map((counter) => (
                <Card 
                  key={counter.id} 
                  className="card-element card-rtl"
                  style={{ 
                    border: counter.isActive ? '2px solid #10b981' : '2px solid #d1d5db'
                  }}
                >
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {counter.name}
                      </CardTitle>
                      <Badge 
                        className="text-xs" 
                        style={{ background: counter.isActive ? '#10b981' : '#6b7280' }}
                      >
                        {counter.isActive ? 'نشط' : 'معطل'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        عدد العناصر: {counter.elements.length}
                      </p>
                      <div className="space-y-1">
                        {counter.elements.map((element) => (
                          <div 
                            key={element.id} 
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs"
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          >
                            {element.type === 'date' && <Calendar className="h-3 w-3 text-blue-600" />}
                            {element.type === 'employee' && <User className="h-3 w-3 text-green-600" />}
                            {element.type === 'jobNumber' && <Hash className="h-3 w-3 text-purple-600" />}
                            {element.type === 'line' && <PenTool className="h-3 w-3 text-gray-600" />}
                            {element.type === 'text' && <Type className="h-3 w-3 text-amber-600" />}
                            <span>{element.label}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-1 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 h-7 text-xs"
                          onClick={() => {
                            setSelectedSignature(counter);
                            setShowAddSignatureDialog(true);
                          }}
                        >
                          <Edit className="h-3 w-3 ml-1" />
                          تعديل
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 w-7 p-0 text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* نافذة إضافة/تعديل عداد */}
            <Dialog open={showAddSignatureDialog} onOpenChange={setShowAddSignatureDialog}>
              <DialogContent className="max-w-4xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">
                    {selectedSignature ? 'تعديل عداد التوقيع' : 'إضافة عداد توقيع جديد'}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <InputWithCopy
                      label="اسم العداد *"
                      id="signature-name"
                      placeholder="مثال: توقيع قياسي"
                      copyable={false}
                      clearable={true}
                    />
                    
                    <EnhancedSwitch
                      id="signature-active"
                      label="تفعيل العداد"
                      variant="success"
                      size="sm"
                    />
                  </div>

                  <Card className="card-element card-rtl">
                    <CardHeader className="p-3 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">عناصر التوقيع</CardTitle>
                        <Button 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => setShowAddElementDialog(true)}
                        >
                          <Plus className="h-3 w-3 ml-1" />
                          إضافة عنصر
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <Table className="table-rtl dense-table">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right text-xs">النوع</TableHead>
                            <TableHead className="text-right text-xs">العنوان</TableHead>
                            <TableHead className="text-right text-xs">القيمة</TableHead>
                            <TableHead className="text-right text-xs">الترتيب</TableHead>
                            <TableHead className="text-right text-xs">الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedSignature?.elements.map((element) => (
                            <TableRow key={element.id}>
                              <TableCell className="text-right text-xs">
                                <Badge className="text-xs">
                                  {element.type === 'date' && 'تاريخ'}
                                  {element.type === 'employee' && 'موظف'}
                                  {element.type === 'jobNumber' && 'رقم وظيفي'}
                                  {element.type === 'line' && 'خط'}
                                  {element.type === 'text' && 'نص'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right text-xs">{element.label}</TableCell>
                              <TableCell className="text-right text-xs">
                                {element.type === 'employee' && element.employeeName}
                                {element.type === 'text' && element.value}
                                {(element.type === 'date' || element.type === 'line' || element.type === 'jobNumber') && '-'}
                              </TableCell>
                              <TableCell className="text-right text-xs">{element.order}</TableCell>
                              <TableCell className="text-right text-xs">
                                <div className="flex gap-1">
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-600">
                                    <Trash2 className="h-3 w-3" />
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

                <DialogFooter className="flex gap-2 justify-start">
                  <Button variant="outline" onClick={() => {
                    setShowAddSignatureDialog(false);
                    setSelectedSignature(null);
                  }}>
                    <X className="h-3 w-3 ml-1" />
                    إلغاء
                  </Button>
                  <Button className="bg-purple-500" onClick={handleSaveSignature}>
                    <Save className="h-3 w-3 ml-1" />
                    حفظ العداد
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* نافذة إضافة عنصر */}
            <Dialog open={showAddElementDialog} onOpenChange={setShowAddElementDialog}>
              <DialogContent className="max-w-2xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">إضافة عنصر جديد</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                  <SelectWithCopy
                    label="نوع العنصر *"
                    id="element-type"
                    options={[
                      { value: 'date', label: 'تاريخ' },
                      { value: 'employee', label: 'موظف معتمد' },
                      { value: 'jobNumber', label: 'رقم وظيفي' },
                      { value: 'text', label: 'نص حر' },
                      { value: 'line', label: 'خط توقيع' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />

                  <InputWithCopy
                    label="عنوان العنصر *"
                    id="element-label"
                    placeholder="مثال: التاريخ"
                    copyable={false}
                    clearable={true}
                  />

                  {/* حقول خاصة بالموظف */}
                  <Card className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                    <CardHeader className="p-3 pb-2">
                      <CardTitle className="text-sm">إعدادات الموظف (للنوع: موظف معتمد)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 space-y-3">
                      <SelectWithCopy
                        label="اختر الموظف"
                        id="employee-select"
                        options={employees.map(emp => ({
                          value: emp.id,
                          label: `${emp.name} - ${emp.jobNumber}`
                        }))}
                        copyable={false}
                        clearable={false}
                      />

                      <EnhancedSwitch
                        id="show-job-number"
                        label="إظهار الرقم الوظيفي في التوقيع"
                        description="عرض الرقم الوظيفي للموظف بجانب اسمه"
                        variant="success"
                        size="sm"
                      />
                    </CardContent>
                  </Card>

                  <InputWithCopy
                    label="الترتيب"
                    id="element-order"
                    type="number"
                    placeholder="1"
                    copyable={false}
                    clearable={false}
                  />
                </div>

                <DialogFooter className="flex gap-2 justify-start">
                  <Button variant="outline" onClick={() => setShowAddElementDialog(false)}>
                    <X className="h-3 w-3 ml-1" />
                    إلغاء
                  </Button>
                  <Button className="bg-green-500" onClick={handleAddElement}>
                    <Save className="h-3 w-3 ml-1" />
                    إضافة العنصر
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
              <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                محتوى التبويب قيد التطوير
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc', fontFamily: 'Tajawal, sans-serif' }}>
      <CodeDisplay code="SCR-777" position="top-right" />
      
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
                  إعدادات العقود v3.4
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
                    777
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
                إدارة شاملة لإعدادات العقود ونماذج الطباعة
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
                13 تبويبات
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
        
        {/* مساحة المحتوى */}
        <div className="flex-1" style={{ 
          minHeight: 'calc(100vh - 220px)',
          paddingRight: '16px',
          paddingLeft: '16px',
          paddingBottom: '16px'
        }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ContractSettings_Advanced_777_v3_4;
