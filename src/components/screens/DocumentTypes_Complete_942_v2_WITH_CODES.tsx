/**
 * الشاشة 942 - أنواع المستندات v2.0 WITH DUAL CODES
 * ===========================================================================
 * 
 * شاشة شاملة لإدارة وتصنيف أنواع المستندات مع نظام ترقيم مزدوج
 * 
 * المميزات الجديدة v2.0:
 * - رقم كودي في النظام (System Code) - DOC-XXX
 * - رقم كودي حسب الجهات الرسمية (Official Code) - حسب التصنيف الرسمي
 * - نظام ترقيم متقدم لكل فئة
 * - ربط بمعايير الجهات الحكومية السعودية
 * 
 * @version 2.0
 * @date يناير 2025
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import {
  FileText, Plus, Search, Download, Edit, Eye, Copy,
  Trash2, CheckCircle, XCircle, Settings, BarChart3,
  FileCheck, Shield, Archive, RefreshCw,
  Folder, FileCode, FileSpreadsheet,
  Building, HardHat, FileSignature, FileBox, FileCog, 
  FileImage, FilePlus, X, Check
} from 'lucide-react';
import { toast } from 'sonner';

// ===== واجهات البيانات =====

interface DocumentType {
  id: string;
  systemCode: string;        // 🆕 الرقم الكودي في النظام (DOC-XXX)
  officialCode: string;       // 🆕 الرقم الكودي حسب الجهات الرسمية
  name: string;
  nameEn: string;             // 🆕 الاسم بالإنجليزية
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
  officialEntity?: string;    // 🆕 الجهة الرسمية المصدرة للكود
  notes?: string;
}

const TABS_CONFIG: TabConfig[] = [
  { id: '942-01', number: '942-01', title: 'المستندات الرسمية', icon: FileCheck },
  { id: '942-02', number: '942-02', title: 'المستندات الهندسية', icon: FileCog },
  { id: '942-03', number: '942-03', title: 'مستندات الجهات الخارجية', icon: Building },
  { id: '942-04', number: '942-04', title: 'المستندات الداخلية', icon: Folder },
  { id: '942-05', number: '942-05', title: 'العقود والاتفاقيات', icon: FileSignature },
  { id: '942-06', number: '942-06', title: 'المستندات المالية', icon: FileSpreadsheet },
  { id: '942-07', number: '942-07', title: 'المستندات الفنية', icon: FileCode },
  { id: '942-08', number: '942-08', title: 'الملفات التصميمية', icon: FileImage },
  { id: '942-09', number: '942-09', title: 'المستندات الإدارية', icon: FileBox },
  { id: '942-10', number: '942-10', title: 'المستندات القانونية', icon: Shield },
  { id: '942-11', number: '942-11', title: 'سجل أنواع المستندات', icon: Archive },
  { id: '942-12', number: '942-12', title: 'إعدادات التصنيف', icon: Settings },
];

const DocumentTypes_v2: React.FC = () => {
  const [activeTab, setActiveTab] = useState('942-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  
  // النموذج الجديد
  const [newDocType, setNewDocType] = useState({
    systemCode: '',
    officialCode: '',
    name: '',
    nameEn: '',
    category: '',
    description: '',
    extensions: '',
    maxFileSize: '50',
    requiresApproval: true,
    officialEntity: ''
  });

  // بيانات تجريبية - أنواع المستندات مع الأكواد المزدوجة
  const sampleDocumentTypes: DocumentType[] = useMemo(() => [
    // المستندات الرسمية
    {
      id: 'DT001',
      systemCode: 'DOC-RSM-001',
      officialCode: 'MOM-RSM-2024-001',
      name: 'اشتراطات رسمية',
      nameEn: 'Official Requirements',
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
      lastModified: '2025-10-15',
      officialEntity: 'وزارة الشؤون البلدية',
      notes: 'يجب الموافقة قبل الرفع'
    },
    {
      id: 'DT002',
      systemCode: 'DOC-RSM-002',
      officialCode: 'MOM-DFT-2024-002',
      name: 'مسودة اشتراطات رسمية',
      nameEn: 'Draft Official Requirements',
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
      lastModified: '2025-09-20',
      officialEntity: 'وزارة الشؤون البلدية',
      notes: ''
    },
    {
      id: 'DT003',
      systemCode: 'DOC-RSM-003',
      officialCode: 'MOM-CIR-2024-015',
      name: 'تعميم',
      nameEn: 'Circular',
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
      lastModified: '2025-10-10',
      officialEntity: 'أمانة منطقة الرياض',
      notes: 'للتعميم على جميع الموظفين'
    },
    {
      id: 'DT004',
      systemCode: 'DOC-RSM-004',
      officialCode: 'MOM-DIR-2024-008',
      name: 'توجيه',
      nameEn: 'Directive',
      category: 'رسمية',
      description: 'التوجيهات الإدارية والفنية',
      extensions: ['.pdf', '.docx', '.txt'],
      icon: 'FileText',
      color: '#8b5cf6',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 15,
      allowedFor: ['المديرون', 'الموظفون'],
      usageCount: 187,
      createdBy: 'سارة أحمد',
      createdDate: '2024-02-01',
      lastModified: '2025-10-05',
      officialEntity: 'الهيئة السعودية للمهندسين',
      notes: ''
    },

    // المستندات الهندسية
    {
      id: 'DT010',
      systemCode: 'DOC-ENG-001',
      officialCode: 'SEC-DWG-2024-001',
      name: 'مخططات AutoCAD',
      nameEn: 'AutoCAD Drawings',
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
      lastModified: '2025-10-18',
      officialEntity: 'الهيئة السعودية للمهندسين',
      notes: 'يجب توقيع المهندس المختص'
    },
    {
      id: 'DT011',
      systemCode: 'DOC-ENG-002',
      officialCode: 'SEC-BIM-2024-002',
      name: 'مخططات Revit',
      nameEn: 'Revit Models',
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
      lastModified: '2025-10-12',
      officialEntity: 'الهيئة السعودية للمهندسين',
      notes: 'نماذج BIM متقدمة'
    },
    {
      id: 'DT012',
      systemCode: 'DOC-ENG-003',
      officialCode: 'SEC-STR-2024-015',
      name: 'حسابات إنشائية',
      nameEn: 'Structural Calculations',
      category: 'هندسية',
      description: 'الحسابات والتحليلات الإنشائية',
      extensions: ['.pdf', '.xlsx', '.doc'],
      icon: 'FileSpreadsheet',
      color: '#06b6d4',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 50,
      allowedFor: ['المهندسون الإنشائيون', 'المديرون'],
      usageCount: 178,
      createdBy: 'مهندس خالد',
      createdDate: '2024-02-15',
      lastModified: '2025-10-09',
      officialEntity: 'الهيئة السعودية للمهندسين',
      notes: 'يجب ختم المهندس الإنشائي'
    },

    // مستندات الجهات الخارجية
    {
      id: 'DT020',
      systemCode: 'DOC-EXT-001',
      officialCode: 'MOM-EXT-2024-100',
      name: 'وثيقة من جهة خارجية',
      nameEn: 'External Entity Document',
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
      lastModified: '2025-10-16',
      officialEntity: 'جهات حكومية متعددة',
      notes: ''
    },
    {
      id: 'DT021',
      systemCode: 'DOC-EXT-002',
      officialCode: 'OWN-DOC-2024-050',
      name: 'مستند من المالك',
      nameEn: 'Owner Document',
      category: 'خارجية',
      description: 'المستندات والوثائق المقدمة من المالك',
      extensions: ['.pdf', '.docx', '.jpg', '.png'],
      icon: 'FileText',
      color: '#14b8a6',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 40,
      allowedFor: ['المديرون', 'الموظفون المعتمدون'],
      usageCount: 387,
      createdBy: 'عمر الزهراني',
      createdDate: '2024-02-05',
      lastModified: '2025-10-14',
      officialEntity: 'المالك',
      notes: ''
    },
    {
      id: 'DT022',
      systemCode: 'DOC-EXT-003',
      officialCode: 'EXT-ENG-2024-025',
      name: 'ملفات من مكتب هندسي آخر',
      nameEn: 'External Engineering Office Files',
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
      lastModified: '2025-10-08',
      officialEntity: 'مكاتب هندسية خارجية',
      notes: ''
    },

    // المستندات الداخلية
    {
      id: 'DT030',
      systemCode: 'DOC-INT-001',
      officialCode: 'OFF-INT-2024-001',
      name: 'ملف من مكتبنا',
      nameEn: 'Internal Office File',
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
      lastModified: '2025-10-19',
      officialEntity: 'المكتب الهندسي',
      notes: ''
    },
    {
      id: 'DT031',
      systemCode: 'DOC-INT-002',
      officialCode: 'OFF-RPT-2024-005',
      name: 'تقرير داخلي',
      nameEn: 'Internal Report',
      category: 'داخلية',
      description: 'التقارير الداخلية والدورية',
      extensions: ['.pdf', '.docx', '.xlsx'],
      icon: 'FileText',
      color: '#84cc16',
      isActive: true,
      requiresApproval: false,
      maxFileSize: 30,
      allowedFor: ['الكل'],
      usageCount: 567,
      createdBy: 'قسم التقارير',
      createdDate: '2024-03-10',
      lastModified: '2025-10-17',
      officialEntity: 'المكتب الهندسي',
      notes: ''
    },

    // العقود والاتفاقيات
    {
      id: 'DT040',
      systemCode: 'DOC-CNT-001',
      officialCode: 'MOJ-AGR-2024-100',
      name: 'اتفاق',
      nameEn: 'Agreement',
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
      lastModified: '2025-10-11',
      officialEntity: 'وزارة العدل',
      notes: ''
    },
    {
      id: 'DT041',
      systemCode: 'DOC-CNT-002',
      officialCode: 'OFF-QUT-2024-250',
      name: 'عرض سعر',
      nameEn: 'Quotation',
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
      lastModified: '2025-10-17',
      officialEntity: 'المكتب الهندسي',
      notes: ''
    },
    {
      id: 'DT042',
      systemCode: 'DOC-CNT-003',
      officialCode: 'MOJ-CNT-2024-350',
      name: 'عقد',
      nameEn: 'Contract',
      category: 'عقود',
      description: 'العقود الرسمية المعتمدة',
      extensions: ['.pdf', '.docx'],
      icon: 'FileCheck',
      color: '#10b981',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 40,
      allowedFor: ['المديرون'],
      usageCount: 445,
      createdBy: 'قانوني - أحمد',
      createdDate: '2024-03-15',
      lastModified: '2025-10-15',
      officialEntity: 'وزارة العدل',
      notes: 'يتطلب توقيع جميع الأطراف'
    },

    // المستندات المالية
    {
      id: 'DT050',
      systemCode: 'DOC-FIN-001',
      officialCode: 'MOF-INV-2024-1000',
      name: 'فاتورة',
      nameEn: 'Invoice',
      category: 'مالية',
      description: 'الفواتير المالية والضريبية',
      extensions: ['.pdf', '.xlsx'],
      icon: 'FileSpreadsheet',
      color: '#f59e0b',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 20,
      allowedFor: ['المحاسبون', 'المديرون'],
      usageCount: 1890,
      createdBy: 'محاسب - عبدالله',
      createdDate: '2024-01-05',
      lastModified: '2025-10-18',
      officialEntity: 'هيئة الزكاة والضريبة والجمارك',
      notes: 'متوافق مع متطلبات الفاتورة الإلكترونية'
    },
    {
      id: 'DT051',
      systemCode: 'DOC-FIN-002',
      officialCode: 'MOF-RCP-2024-2500',
      name: 'سند قبض',
      nameEn: 'Receipt Voucher',
      category: 'مالية',
      description: 'سندات القبض والتحصيل',
      extensions: ['.pdf', '.docx'],
      icon: 'FileCheck',
      color: '#10b981',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 15,
      allowedFor: ['المحاسبون', 'المديرون'],
      usageCount: 2340,
      createdBy: 'محاسب - نورة',
      createdDate: '2024-01-08',
      lastModified: '2025-10-16',
      officialEntity: 'هيئة الزكاة والضريبة والجمارك',
      notes: ''
    },
    {
      id: 'DT052',
      systemCode: 'DOC-FIN-003',
      officialCode: 'MOF-PAY-2024-1800',
      name: 'سند صرف',
      nameEn: 'Payment Voucher',
      category: 'مالية',
      description: 'سندات الصرف والمدفوعات',
      extensions: ['.pdf', '.docx'],
      icon: 'FileSignature',
      color: '#ef4444',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 15,
      allowedFor: ['المحاسبون', 'المديرون'],
      usageCount: 1670,
      createdBy: 'محاسب - فهد',
      createdDate: '2024-01-10',
      lastModified: '2025-10-14',
      officialEntity: 'هيئة الزكاة والضريبة والجمارك',
      notes: ''
    },

    // المستندات الفنية
    {
      id: 'DT060',
      systemCode: 'DOC-TEC-001',
      officialCode: 'SEC-TEC-2024-050',
      name: 'تقرير فني',
      nameEn: 'Technical Report',
      category: 'فنية',
      description: 'التقارير الفنية والاستشارية',
      extensions: ['.pdf', '.docx'],
      icon: 'FileCode',
      color: '#8b5cf6',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 40,
      allowedFor: ['المهندسون', 'المديرون'],
      usageCount: 678,
      createdBy: 'مهندس سعود',
      createdDate: '2024-02-20',
      lastModified: '2025-10-12',
      officialEntity: 'الهيئة السعودية للمهندسين',
      notes: ''
    },

    // الملفات التصميمية
    {
      id: 'DT070',
      systemCode: 'DOC-DSN-001',
      officialCode: 'OFF-DSN-2024-100',
      name: 'ملفات Photoshop',
      nameEn: 'Photoshop Files',
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
      lastModified: '2025-09-25',
      officialEntity: 'المكتب الهندسي',
      notes: ''
    },
    {
      id: 'DT071',
      systemCode: 'DOC-DSN-002',
      officialCode: 'OFF-DSN-2024-150',
      name: 'ملفات Illustrator',
      nameEn: 'Illustrator Files',
      category: 'تصميمية',
      description: 'ملفات التصميم الإحترافي',
      extensions: ['.ai', '.eps'],
      icon: 'FileImage',
      color: '#f97316',
      isActive: true,
      requiresApproval: false,
      maxFileSize: 100,
      allowedFor: ['المصممون'],
      usageCount: 145,
      createdBy: 'مصمم محمد',
      createdDate: '2024-03-05',
      lastModified: '2025-10-08',
      officialEntity: 'المكتب الهندسي',
      notes: ''
    },

    // المستندات الإدارية
    {
      id: 'DT080',
      systemCode: 'DOC-ADM-001',
      officialCode: 'HR-CV-2024-100',
      name: 'سيرة ذاتية',
      nameEn: 'Resume / CV',
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
      lastModified: '2025-10-13',
      officialEntity: 'قسم الموارد البشرية',
      notes: ''
    },
    {
      id: 'DT081',
      systemCode: 'DOC-ADM-002',
      officialCode: 'HR-LTR-2024-200',
      name: 'خطاب رسمي',
      nameEn: 'Official Letter',
      category: 'إدارية',
      description: 'الخطابات الرسمية الصادرة والواردة',
      extensions: ['.pdf', '.docx'],
      icon: 'FileText',
      color: '#2563eb',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 20,
      allowedFor: ['المديرون', 'الموظفون'],
      usageCount: 890,
      createdBy: 'إدارة المكتب',
      createdDate: '2024-04-05',
      lastModified: '2025-10-15',
      officialEntity: 'المكتب الهندسي',
      notes: ''
    },

    // المستندات القانونية
    {
      id: 'DT090',
      systemCode: 'DOC-LEG-001',
      officialCode: 'MOJ-LEG-2024-050',
      name: 'وثيقة قانونية',
      nameEn: 'Legal Document',
      category: 'قانونية',
      description: 'الوثائق القانونية والرسمية',
      extensions: ['.pdf', '.docx'],
      icon: 'Shield',
      color: '#dc2626',
      isActive: true,
      requiresApproval: true,
      maxFileSize: 50,
      allowedFor: ['المديرون', 'القانونيون'],
      usageCount: 234,
      createdBy: 'قانوني - أحمد',
      createdDate: '2024-04-10',
      lastModified: '2025-10-10',
      officialEntity: 'وزارة العدل',
      notes: 'يتطلب ختم محامٍ مرخص'
    }
  ], []);

  // الحصول على التاب النشط
  const currentTab = TABS_CONFIG.find(tab => tab.id === activeTab);
  
  // فلترة الأنواع
  const getFilteredTypes = () => {
    let filtered = sampleDocumentTypes;
    
    // فلترة حسب التاب
    if (activeTab !== '942-11' && activeTab !== '942-12') {
      const categoryMap: Record<string, string> = {
        '942-01': 'رسمية',
        '942-02': 'هندسية',
        '942-03': 'خارجية',
        '942-04': 'داخلية',
        '942-05': 'عقود',
        '942-06': 'مالية',
        '942-07': 'فنية',
        '942-08': 'تصميمية',
        '942-09': 'إدارية',
        '942-10': 'قانونية'
      };
      
      const category = categoryMap[activeTab];
      if (category) {
        filtered = filtered.filter(t => t.category === category);
      }
    }
    
    // فلترة حسب الحالة
    if (filterStatus === 'نشط') {
      filtered = filtered.filter(t => t.isActive);
    } else if (filterStatus === 'معطل') {
      filtered = filtered.filter(t => !t.isActive);
    }
    
    // فلترة حسب البحث
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.name.includes(searchQuery) || 
        t.systemCode.includes(searchQuery) || 
        t.officialCode.includes(searchQuery)
      );
    }
    
    return filtered;
  };
  
  const filteredTypes = getFilteredTypes();
  
  // دوال الإجراءات
  const handleCreateDocType = () => {
    if (!newDocType.systemCode || !newDocType.name || !newDocType.category) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    toast.success(`تم إنشاء نوع المستند "${newDocType.name}" بنجاح`);
    setShowCreateDialog(false);
    setNewDocType({
      systemCode: '', officialCode: '', name: '', nameEn: '',
      category: '', description: '', extensions: '', maxFileSize: '50',
      requiresApproval: true, officialEntity: ''
    });
  };
  
  const handleViewDetails = (docType: DocumentType) => {
    setSelectedType(docType);
    setShowDetailsDialog(true);
  };

  const renderTabContent = () => {
    // التابات 942-01 إلى 942-10: قوائم أنواع المستندات
    if (activeTab !== '942-11' && activeTab !== '942-12') {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {currentTab?.title}
            </h2>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">{filteredTypes.length} نوع</Badge>
              <Button size="sm" className="h-8 text-xs bg-green-500" onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-3 w-3 ml-1" />نوع جديد
              </Button>
            </div>
          </div>

          {/* إحصائيات */}
          <div className="grid grid-cols-6 gap-2">
            <Card className="card-element card-rtl">
              <CardContent className="p-3 text-center">
                <Archive className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                <p className="text-2xl text-blue-600 mb-1">{filteredTypes.length}</p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الأنواع</p>
              </CardContent>
            </Card>
            <Card className="card-element card-rtl">
              <CardContent className="p-3 text-center">
                <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-1" />
                <p className="text-2xl text-green-600 mb-1">{filteredTypes.filter(t => t.isActive).length}</p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نشطة</p>
              </CardContent>
            </Card>
            <Card className="card-element card-rtl">
              <CardContent className="p-3 text-center">
                <XCircle className="h-6 w-6 mx-auto text-red-600 mb-1" />
                <p className="text-2xl text-red-600 mb-1">{filteredTypes.filter(t => !t.isActive).length}</p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معطلة</p>
              </CardContent>
            </Card>
            <Card className="card-element card-rtl">
              <CardContent className="p-3 text-center">
                <Shield className="h-6 w-6 mx-auto text-yellow-600 mb-1" />
                <p className="text-2xl text-yellow-600 mb-1">{filteredTypes.filter(t => t.requiresApproval).length}</p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تتطلب موافقة</p>
              </CardContent>
            </Card>
            <Card className="card-element card-rtl">
              <CardContent className="p-3 text-center">
                <BarChart3 className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                <p className="text-2xl text-purple-600 mb-1">{filteredTypes.reduce((sum, t) => sum + t.usageCount, 0)}</p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الاستخدام</p>
              </CardContent>
            </Card>
            <Card className="card-element card-rtl">
              <CardContent className="p-3 text-center">
                <FileText className="h-6 w-6 mx-auto text-indigo-600 mb-1" />
                <p className="text-2xl text-indigo-600 mb-1">
                  {filteredTypes.length > 0 ? Math.round(filteredTypes.reduce((sum, t) => sum + t.usageCount, 0) / filteredTypes.length) : 0}
                </p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط الاستخدام</p>
              </CardContent>
            </Card>
          </div>

          {/* جدول أنواع المستندات */}
          <Card className="card-element card-rtl">
            <CardContent className="p-2">
              <ScrollArea className="h-[480px]">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>كود النظام</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود الرسمي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الامتدادات</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة الرسمية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاستخدام</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTypes.map((type) => (
                      <TableRow key={type.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs font-mono">
                          <Badge variant="outline" className="bg-blue-50">{type.systemCode}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs font-mono">
                          <Badge variant="outline" className="bg-green-50">{type.officialCode}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">
                          <div className="flex items-center gap-2 justify-end">
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{type.name}</span>
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex flex-wrap gap-1 justify-end">
                            {type.extensions.slice(0, 2).map((ext, i) => (
                              <Badge key={i} className="text-[10px] bg-gray-100 text-gray-700">
                                {ext}
                              </Badge>
                            ))}
                            {type.extensions.length > 2 && (
                              <Badge className="text-[10px] bg-gray-200">
                                +{type.extensions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {type.officialEntity}
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className={type.isActive ? 'text-xs bg-green-100 text-green-700' : 'text-xs bg-red-100 text-red-700'}>
                            {type.isActive ? 'نشط' : 'معطل'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs font-mono">
                          {type.usageCount}
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleViewDetails(type)}>
                              <Eye className="h-3 w-3" />
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
        </div>
      );
    }

    // التاب 942-11: سجل أنواع المستندات
    if (activeTab === '942-11') {
      const groupedByCategory = sampleDocumentTypes.reduce((acc, type) => {
        if (!acc[type.category]) {
          acc[type.category] = [];
        }
        acc[type.category].push(type);
        return acc;
      }, {} as Record<string, DocumentType[]>);

      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل أنواع المستندات</h2>
            <Button size="sm" className="h-8 text-xs bg-blue-500">
              <RefreshCw className="h-3 w-3 ml-1" />تحديث
            </Button>
          </div>

          {/* إحصائيات شاملة */}
          <div className="grid grid-cols-4 gap-2">
            <Card className="card-element card-rtl">
              <CardContent className="p-3 text-center">
                <FileText className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                <p className="text-2xl text-blue-600 mb-1">{sampleDocumentTypes.length}</p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الأنواع</p>
              </CardContent>
            </Card>
            <Card className="card-element card-rtl">
              <CardContent className="p-3 text-center">
                <Folder className="h-6 w-6 mx-auto text-green-600 mb-1" />
                <p className="text-2xl text-green-600 mb-1">{Object.keys(groupedByCategory).length}</p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئات</p>
              </CardContent>
            </Card>
            <Card className="card-element card-rtl">
              <CardContent className="p-3 text-center">
                <CheckCircle className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                <p className="text-2xl text-purple-600 mb-1">{sampleDocumentTypes.filter(t => t.isActive).length}</p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>أنواع نشطة</p>
              </CardContent>
            </Card>
            <Card className="card-element card-rtl">
              <CardContent className="p-3 text-center">
                <BarChart3 className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                <p className="text-2xl text-orange-600 mb-1">
                  {sampleDocumentTypes.reduce((sum, t) => sum + t.usageCount, 0)}
                </p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الاستخدام</p>
              </CardContent>
            </Card>
          </div>

          {/* عرض حسب الفئة */}
          <ScrollArea className="h-[450px]">
            <div className="space-y-3">
              {Object.entries(groupedByCategory).map(([category, types]) => (
                <Card key={category} className="card-element card-rtl border-2">
                  <CardHeader className="p-2 pb-1">
                    <CardTitle className="text-sm flex items-center justify-between" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <span>{category}</span>
                      <Badge variant="outline">{types.length} نوع</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 pt-0">
                    <div className="space-y-2">
                      {types.map((type) => (
                        <div key={type.id} className="p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }} />
                                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{type.name}</p>
                              </div>
                              <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>{type.nameEn}</p>
                            </div>
                            <div className="flex gap-1">
                              {type.isActive ? (
                                <Badge className="text-xs bg-green-100 text-green-700">نشط</Badge>
                              ) : (
                                <Badge className="text-xs bg-red-100 text-red-700">معطل</Badge>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2 bg-blue-50 rounded">
                              <p className="text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>كود النظام</p>
                              <p className="font-mono">{type.systemCode}</p>
                            </div>
                            <div className="p-2 bg-green-50 rounded">
                              <p className="text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود الرسمي</p>
                              <p className="font-mono">{type.officialCode}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      );
    }

    // التاب 942-12: الإعدادات
    if (activeTab === '942-12') {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات التصنيف</h2>
            <Button size="sm" className="h-8 text-xs bg-blue-500">
              <Check className="h-3 w-3 ml-1" />حفظ التغييرات
            </Button>
          </div>

          <Card className="card-element card-rtl">
            <CardHeader className="p-2 pb-1">
              <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Settings className="h-4 w-4" />
                نظام الترقيم
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0 space-y-2">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <strong>كود النظام (System Code):</strong>
                </p>
                <p className="text-xs text-gray-700 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  يتم توليده تلقائياً حسب الفئة:
                </p>
                <ul className="text-xs space-y-1 mr-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <li>• <span className="font-mono">DOC-RSM-XXX</span> - المستندات الرسمية</li>
                  <li>• <span className="font-mono">DOC-ENG-XXX</span> - المستندات الهندسية</li>
                  <li>• <span className="font-mono">DOC-EXT-XXX</span> - مستندات خارجية</li>
                  <li>• <span className="font-mono">DOC-INT-XXX</span> - مستندات داخلية</li>
                  <li>• <span className="font-mono">DOC-CNT-XXX</span> - العقود</li>
                  <li>• <span className="font-mono">DOC-FIN-XXX</span> - المستندات المالية</li>
                </ul>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <strong>الكود الرسمي (Official Code):</strong>
                </p>
                <p className="text-xs text-gray-700 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  يتبع معايير الجهات الحكومية السعودية:
                </p>
                <ul className="text-xs space-y-1 mr-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <li>• <span className="font-mono">MOM-XXX-YYYY-NNN</span> - وزارة الشؤون البلدية</li>
                  <li>• <span className="font-mono">SEC-XXX-YYYY-NNN</span> - الهيئة السعودية للمهندسين</li>
                  <li>• <span className="font-mono">MOF-XXX-YYYY-NNN</span> - هيئة الزكاة والضريبة</li>
                  <li>• <span className="font-mono">MOJ-XXX-YYYY-NNN</span> - وزارة العدل</li>
                  <li>• <span className="font-mono">OFF-XXX-YYYY-NNN</span> - المكتب الهندسي</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>محتوى التبويب قيد التطوير</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-942" position="top-right" />
      
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
              <FileText 
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
                  أنواع المستندات
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
                    942
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
                إدارة وتصنيف أنواع المستندات مع نظام ترقيم مزدوج
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
                12 تبويباً
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* السايد بار والمحتوى */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', paddingLeft: '16px', paddingRight: '16px' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة إنشاء نوع جديد */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">إضافة نوع مستند جديد</DialogTitle>
            <DialogDescription className="dialog-description">
              املأ البيانات التالية لإضافة نوع مستند جديد للنظام
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InputWithCopy
                label="كود النظام (System Code) *"
                id="system-code"
                value={newDocType.systemCode}
                onChange={(e) => setNewDocType({...newDocType, systemCode: e.target.value})}
                placeholder="مثال: DOC-RSM-005"
                required
                copyable={true}
                clearable={true}
              />
              
              <InputWithCopy
                label="الكود الرسمي (Official Code) *"
                id="official-code"
                value={newDocType.officialCode}
                onChange={(e) => setNewDocType({...newDocType, officialCode: e.target.value})}
                placeholder="مثال: MOM-RSM-2025-010"
                required
                copyable={true}
                clearable={true}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <InputWithCopy
                label="اسم النوع بالعربية *"
                id="doc-name"
                value={newDocType.name}
                onChange={(e) => setNewDocType({...newDocType, name: e.target.value})}
                placeholder="مثال: اشتراطات رسمية"
                required
                copyable={true}
                clearable={true}
              />
              
              <InputWithCopy
                label="اسم النوع بالإنجليزية"
                id="doc-name-en"
                value={newDocType.nameEn}
                onChange={(e) => setNewDocType({...newDocType, nameEn: e.target.value})}
                placeholder="Ex: Official Requirements"
                copyable={true}
                clearable={true}
              />
            </div>
            
            <SelectWithCopy
              label="الفئة *"
              id="doc-category"
              value={newDocType.category}
              onChange={(value) => setNewDocType({...newDocType, category: value})}
              options={[
                { value: 'رسمية', label: 'المستندات الرسمية' },
                { value: 'هندسية', label: 'المستندات الهندسية' },
                { value: 'خارجية', label: 'مستندات الجهات الخارجية' },
                { value: 'داخلية', label: 'المستندات الداخلية' },
                { value: 'عقود', label: 'العقود والاتفاقيات' },
                { value: 'مالية', label: 'المستندات المالية' },
                { value: 'فنية', label: 'المستندات الفنية' },
                { value: 'تصميمية', label: 'الملفات التصميمية' },
                { value: 'إدارية', label: 'المستندات الإدارية' },
                { value: 'قانونية', label: 'المستندات القانونية' }
              ]}
              copyable={true}
              clearable={true}
            />
            
            <InputWithCopy
              label="الجهة الرسمية المصدرة للكود"
              id="official-entity"
              value={newDocType.officialEntity}
              onChange={(e) => setNewDocType({...newDocType, officialEntity: e.target.value})}
              placeholder="مثال: وزارة الشؤون البلدية"
              copyable={true}
              clearable={true}
            />
            
            <TextAreaWithCopy
              label="الوصف"
              id="doc-description"
              value={newDocType.description}
              onChange={(e) => setNewDocType({...newDocType, description: e.target.value})}
              rows={3}
              placeholder="وصف تفصيلي لنوع المستند..."
              copyable={true}
              clearable={true}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <InputWithCopy
                label="الامتدادات المدعومة"
                id="doc-extensions"
                value={newDocType.extensions}
                onChange={(e) => setNewDocType({...newDocType, extensions: e.target.value})}
                placeholder=".pdf, .docx, .xlsx"
                copyable={true}
                clearable={true}
              />
              
              <InputWithCopy
                label="الحجم الأقصى (MB)"
                id="doc-max-size"
                type="number"
                value={newDocType.maxFileSize}
                onChange={(e) => setNewDocType({...newDocType, maxFileSize: e.target.value})}
                placeholder="50"
                copyable={true}
                clearable={false}
              />
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <EnhancedSwitch
                id="requires-approval"
                label="يتطلب موافقة"
                description="هل يحتاج هذا النوع لموافقة قبل الاستخدام؟"
                checked={newDocType.requiresApproval}
                onCheckedChange={(checked) => setNewDocType({...newDocType, requiresApproval: checked})}
                size="sm"
                variant="warning"
              />
            </div>
          </div>
          
          <div className="flex gap-2 justify-end mt-4">
            <Button size="sm" variant="outline" onClick={() => setShowCreateDialog(false)}>
              <X className="h-3 w-3 ml-1" />إلغاء
            </Button>
            <Button size="sm" className="bg-green-500" onClick={handleCreateDocType}>
              <Check className="h-3 w-3 ml-1" />حفظ النوع
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة تفاصيل النوع */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">تفاصيل نوع المستند</DialogTitle>
          </DialogHeader>
          
          {selectedType && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>كود النظام</p>
                  <p className="text-sm font-mono">{selectedType.systemCode}</p>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود الرسمي</p>
                  <p className="text-sm font-mono">{selectedType.officialCode}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-purple-50 rounded">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم بالعربية</p>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedType.name}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم بالإنجليزية</p>
                  <p className="text-sm">{selectedType.nameEn}</p>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة الرسمية</p>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedType.officialEntity}</p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</p>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedType.description}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-green-50 rounded text-center">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاستخدام</p>
                  <p className="text-lg font-mono">{selectedType.usageCount}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم الأقصى</p>
                  <p className="text-lg font-mono">{selectedType.maxFileSize} MB</p>
                </div>
                <div className="p-3 bg-purple-50 rounded text-center">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الامتدادات</p>
                  <p className="text-lg">{selectedType.extensions.length}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentTypes_v2;
