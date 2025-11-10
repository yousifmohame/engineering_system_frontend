/**
 * الشاشة 875 - معاملات الإشراف على الإنشاء
 * ========================================================
 * 
 * نظام شامل لإدارة معاملات الإشراف على رخص البناء
 * 
 * المميزات:
 * ✅ معالجة وتسجيل جميع إجراءات معاملات الإشراف
 * ✅ ربط معاملة الإشراف بمعاملة سابقة (رخصة البناء)
 * ✅ تسجيل مراحل الإنشاء ورفعها للجهات
 * ✅ تعهدات المالك الشاملة
 * ✅ تعهدات المكتب الشاملة
 * ✅ خط زمني لنسبة إنجاز المشروع
 * ✅ إمكانية التوقف في أي مرحلة
 * ✅ نقل الإشراف لجهة خارجية
 * ✅ تجهيز مرفقات التنازل
 * 
 * @version 1.0
 * @date 30 أكتوبر 2025
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Progress } from '../ui/progress';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import {
  HardHat, FileText, Plus, Eye, Edit, Download, Settings, TrendingUp,
  Clock, CheckCircle, XCircle, AlertCircle, Users, Building2, Calendar,
  Pause, Play, ArrowRightLeft, FileCheck, Upload, Printer, Search,
  Filter, RefreshCw, Save, X, Trash2, Link2, MapPin, Phone, Mail,
  User, Briefcase, Target, Activity, Layers, Shield, FileSignature,
  ClipboardCheck, AlertTriangle, TrendingDown, CircleDashed
} from 'lucide-react';

// ============================================================
// تكوين التابات
// ============================================================

const TABS_CONFIG: TabConfig[] = [
  { id: '875-01', number: '875-01', title: 'نظرة عامة', icon: TrendingUp },
  { id: '875-02', number: '875-02', title: 'قائمة المعاملات', icon: FileText },
  { id: '875-03', number: '875-03', title: 'إضافة معاملة', icon: Plus },
  { id: '875-04', number: '875-04', title: 'مراحل الإنشاء', icon: Layers },
  { id: '875-05', number: '875-05', title: 'تعهدات المالك', icon: FileSignature },
  { id: '875-06', number: '875-06', title: 'تعهدات المكتب', icon: Shield },
  { id: '875-07', number: '875-07', title: 'الخط الزمني', icon: Activity },
  { id: '875-08', number: '875-08', title: 'التوقف والاستئناف', icon: Pause },
  { id: '875-09', number: '875-09', title: 'نقل الإشراف', icon: ArrowRightLeft },
  { id: '875-10', number: '875-10', title: 'مرفقات التنازل', icon: FileCheck },
  { id: '875-11', number: '875-11', title: 'التقارير', icon: Download },
  { id: '875-12', number: '875-12', title: 'الإعدادات', icon: Settings },
  { id: '875-13', number: '875-13', title: 'عروض الأسعار', icon: Briefcase },
  { id: '875-14', number: '875-14', title: 'عقود الإشراف', icon: FileSignature },
];

// ============================================================
// الواجهات (Interfaces)
// ============================================================

interface SupervisionTransaction {
  id: string;
  code: string;
  linkedTransactionId: string;
  linkedTransactionCode: string;
  licenseNumber: string;
  projectName: string;
  ownerName: string;
  location: string;
  area: number;
  floors: number;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  supervisor: string;
  supervisorPhone: string;
  status: 'active' | 'paused' | 'completed' | 'transferred' | 'cancelled';
  pauseReason?: string;
  pauseDate?: string;
  overallProgress: number;
  currentStage: string;
  stagesCompleted: number;
  totalStages: number;
  ownerCommitments: OwnerCommitment[];
  officeCommitments: OfficeCommitment[];
  constructionStages: ConstructionStage[];
  timeline: TimelineEvent[];
  transferInfo?: TransferInfo;
  notes: string;
  createdBy: string;
  createdDate: string;
}

interface ConstructionStage {
  id: string;
  name: string;
  description: string;
  sequence: number;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  startDate?: string;
  endDate?: string;
  expectedDuration: number;
  actualDuration?: number;
  inspector: string;
  inspectionDate?: string;
  inspectionResult?: 'approved' | 'rejected' | 'needs-correction';
  inspectionNotes?: string;
  submittedToAuthority: boolean;
  submissionDate?: string;
  authorityResponse?: string;
  attachments: StageAttachment[];
}

interface StageAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
}

interface OwnerCommitment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'fulfilled' | 'overdue';
  fulfilledDate?: string;
  evidence?: string;
  notes?: string;
}

interface OfficeCommitment {
  id: string;
  title: string;
  description: string;
  responsiblePerson: string;
  dueDate: string;
  status: 'pending' | 'fulfilled' | 'overdue';
  fulfilledDate?: string;
  notes?: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  type: 'stage-start' | 'stage-complete' | 'inspection' | 'pause' | 'resume' | 'transfer' | 'note';
  title: string;
  description: string;
  progress: number;
  user: string;
}

interface TransferInfo {
  transferDate: string;
  transferredTo: string;
  transferredToCompany: string;
  transferReason: string;
  approvedBy: string;
  approvalDate: string;
  transferDocuments: TransferDocument[];
}

interface TransferDocument {
  id: string;
  name: string;
  type: string;
  required: boolean;
  uploaded: boolean;
  uploadDate?: string;
  filePath?: string;
}

// واجهات جديدة لرخص البناء والمعاملات

interface BuildingLicense {
  id: string;
  licenseNumber: string;
  transactionCode: string;
  projectName: string;
  ownerName: string;
  location: string;
  area: number;
  floors: number;
  type: 'سكني' | 'تجاري' | 'صناعي' | 'إداري';
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'cancelled';
}

interface Transaction {
  id: string;
  code: string;
  type: 'عادية' | 'بسيطة';
  projectName: string;
  ownerName: string;
  status: string;
  createdDate: string;
}

interface SupervisionQuotation {
  id: string;
  quotationCode: string;
  supervisionTransactionId: string;
  supervisionTransactionCode: string;
  projectName: string;
  ownerName: string;
  totalAmount: number;
  currency: 'SAR';
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdBy: string;
  createdDate: string;
  items: QuotationItem[];
}

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

interface SupervisionContract {
  id: string;
  contractCode: string;
  supervisionTransactionId: string;
  supervisionTransactionCode: string;
  quotationId?: string;
  projectName: string;
  ownerName: string;
  contractAmount: number;
  currency: 'SAR';
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'suspended' | 'completed' | 'cancelled';
  signedBy: string;
  signedDate?: string;
  terms: string[];
  attachments: ContractAttachment[];
  createdBy: string;
  createdDate: string;
}

interface ContractAttachment {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  uploadedBy: string;
}

// ============================================================
// بيانات تجريبية
// ============================================================

const MOCK_SUPERVISION_TRANSACTIONS: SupervisionTransaction[] = [
  {
    id: 'SUP-001',
    code: '2510001',
    linkedTransactionId: 'TRX-2024-001',
    linkedTransactionCode: '2409001',
    licenseNumber: 'LIC-2024-12345',
    projectName: 'فيلا سكنية - دورين',
    ownerName: 'محمد بن أحمد العتيبي',
    location: 'حي النرجس، الرياض',
    area: 600,
    floors: 2,
    startDate: '2025-01-15',
    expectedEndDate: '2025-07-15',
    supervisor: 'م. خالد السالم',
    supervisorPhone: '0501234567',
    status: 'active',
    overallProgress: 35,
    currentStage: 'الهيكل الإنشائي',
    stagesCompleted: 3,
    totalStages: 10,
    ownerCommitments: [],
    officeCommitments: [],
    constructionStages: [],
    timeline: [],
    notes: '',
    createdBy: 'أحمد المطيري',
    createdDate: '2025-01-15'
  },
  {
    id: 'SUP-002',
    code: '2510002',
    linkedTransactionId: 'TRX-2024-002',
    linkedTransactionCode: '2409002',
    licenseNumber: 'LIC-2024-12346',
    projectName: 'عمارة سكنية - 4 أدوار',
    ownerName: 'عبدالله بن سعد القحطاني',
    location: 'حي الملقا، الرياض',
    area: 1200,
    floors: 4,
    startDate: '2025-01-10',
    expectedEndDate: '2025-10-10',
    supervisor: 'م. فهد الدوسري',
    supervisorPhone: '0509876543',
    status: 'paused',
    pauseReason: 'توقف مؤقت بطلب المالك لظروف مالية',
    pauseDate: '2025-03-15',
    overallProgress: 20,
    currentStage: 'الأساسات',
    stagesCompleted: 2,
    totalStages: 12,
    ownerCommitments: [],
    officeCommitments: [],
    constructionStages: [],
    timeline: [],
    notes: '',
    createdBy: 'أحمد المطيري',
    createdDate: '2025-01-10'
  },
  {
    id: 'SUP-003',
    code: '2510003',
    linkedTransactionId: 'TRX-2024-003',
    linkedTransactionCode: '2409003',
    licenseNumber: 'LIC-2024-12347',
    projectName: 'فيلا سكنية - 3 أدوار',
    ownerName: 'سعد بن عبدالرحمن الغامدي',
    location: 'حي العليا، الرياض',
    area: 800,
    floors: 3,
    startDate: '2024-10-01',
    expectedEndDate: '2025-04-01',
    actualEndDate: '2025-03-28',
    supervisor: 'م. خالد السالم',
    supervisorPhone: '0501234567',
    status: 'completed',
    overallProgress: 100,
    currentStage: 'مكتمل',
    stagesCompleted: 10,
    totalStages: 10,
    ownerCommitments: [],
    officeCommitments: [],
    constructionStages: [],
    timeline: [],
    notes: '',
    createdBy: 'أحمد المطيري',
    createdDate: '2024-10-01'
  }
];

const CONSTRUCTION_STAGES_TEMPLATE = [
  { name: 'أعمال الحفر والتسوية', duration: 7, sequence: 1 },
  { name: 'الأساسات', duration: 14, sequence: 2 },
  { name: 'الهيكل الإنشائي - الأرضي', duration: 21, sequence: 3 },
  { name: 'الهيكل الإنشائي - الأول', duration: 21, sequence: 4 },
  { name: 'أعمال الكهرباء والسباكة', duration: 14, sequence: 5 },
  { name: 'أعمال البناء والمحارة', duration: 21, sequence: 6 },
  { name: 'أعمال الواجهات', duration: 14, sequence: 7 },
  { name: 'أعمال الأرضيات والتشطيبات', duration: 21, sequence: 8 },
  { name: 'أعمال الدهانات والنجارة', duration: 14, sequence: 9 },
  { name: 'التشطيبات النهائية والتسليم', duration: 7, sequence: 10 }
];

const OWNER_COMMITMENTS_TEMPLATE = [
  'توفير المخططات المعتمدة من البلدية',
  'توفير رخصة البناء السارية',
  'توفير صك الملكية أو عقد الإيجار',
  'الالتزام بالمواصفات المعتمدة',
  'عدم إجراء أي تعديلات بدون موافقة',
  'توفير العمالة المؤهلة',
  'الالتزام بشروط السلامة',
  'السماح للمشرف بالدخول للموقع',
  'تسديد المستحقات في مواعيدها',
  'إبلاغ المكتب عن أي تغييرات'
];

const OFFICE_COMMITMENTS_TEMPLATE = [
  'زيارة الموقع بشكل دوري',
  'إعداد التقارير الفنية',
  'رفع التقارير للجهات المختصة',
  'الإشراف على جميع مراحل البناء',
  'التأكد من مطابقة الأعمال للمخططات',
  'معاينة المواد المستخدمة',
  'التوثيق بالصور والفيديو',
  'حفظ جميع المستندات',
  'التنسيق مع المقاول',
  'إصدار شهادة الإكمال'
];

const TRANSFER_DOCUMENTS_TEMPLATE = [
  { name: 'طلب نقل الإشراف', type: 'application', required: true },
  { name: 'موافقة المالك الخطية', type: 'approval', required: true },
  { name: 'ترخيص الجهة المستلمة', type: 'license', required: true },
  { name: 'تقرير حالة المشروع', type: 'report', required: true },
  { name: 'صور للمشروع', type: 'photos', required: true },
  { name: 'المخططات المعتمدة', type: 'plans', required: false },
  { name: 'التقارير السابقة', type: 'previous-reports', required: false }
];

// بيانات وهمية جديدة - رخص البناء

const MOCK_BUILDING_LICENSES: BuildingLicense[] = [
  {
    id: 'LIC-001',
    licenseNumber: 'LIC-2024-12345',
    transactionCode: '2409001',
    projectName: 'فيلا سكنية - دورين',
    ownerName: 'محمد بن أحمد العتيبي',
    location: 'حي النرجس، الرياض',
    area: 600,
    floors: 2,
    type: 'سكني',
    issueDate: '2024-09-15',
    expiryDate: '2025-09-15',
    status: 'valid'
  },
  {
    id: 'LIC-002',
    licenseNumber: 'LIC-2024-12346',
    transactionCode: '2409002',
    projectName: 'عمارة سكنية - 4 أدوار',
    ownerName: 'عبدالله بن سعد القحطاني',
    location: 'حي الملقا، الرياض',
    area: 1200,
    floors: 4,
    type: 'سكني',
    issueDate: '2024-09-10',
    expiryDate: '2025-09-10',
    status: 'valid'
  },
  {
    id: 'LIC-003',
    licenseNumber: 'LIC-2024-12347',
    transactionCode: '2409003',
    projectName: 'فيلا سكنية - 3 أدوار',
    ownerName: 'فيصل بن عبدالعزيز الشمري',
    location: 'حي الياسمين، الرياض',
    area: 800,
    floors: 3,
    type: 'سكني',
    issueDate: '2024-09-05',
    expiryDate: '2025-09-05',
    status: 'valid'
  },
  {
    id: 'LIC-004',
    licenseNumber: 'LIC-2024-12348',
    transactionCode: '2409004',
    projectName: 'مبنى تجاري - 6 أدوار',
    ownerName: 'ناصر بن محمد الحربي',
    location: 'حي العليا، الرياض',
    area: 2000,
    floors: 6,
    type: 'تجاري',
    issueDate: '2024-08-20',
    expiryDate: '2025-08-20',
    status: 'valid'
  },
  {
    id: 'LIC-005',
    licenseNumber: 'LIC-2024-12349',
    transactionCode: '2409005',
    projectName: 'مستودع صناعي',
    ownerName: 'سعد بن عبدالله الغامدي',
    location: 'المنطقة الصناعية الثانية',
    area: 3000,
    floors: 1,
    type: 'صناعي',
    issueDate: '2024-08-15',
    expiryDate: '2025-08-15',
    status: 'valid'
  }
];

// بيانات وهمية - المعاملات (عادية وبسيطة)

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TRX-001', code: '2409001', type: 'عادية', projectName: 'فيلا سكنية - دورين', ownerName: 'محمد بن أحمد العتيبي', status: 'مكتملة', createdDate: '2024-09-15' },
  { id: 'TRX-002', code: '2409002', type: 'عادية', projectName: 'عمارة سكنية - 4 أدوار', ownerName: 'عبدالله بن سعد القحطاني', status: 'نشطة', createdDate: '2024-09-10' },
  { id: 'TRX-003', code: '2409003', type: 'عادية', projectName: 'فيلا سكنية - 3 أدوار', ownerName: 'فيصل بن عبدالعزيز الشمري', status: 'مكتملة', createdDate: '2024-09-05' },
  { id: 'TRX-004', code: '2409004', type: 'عادية', projectName: 'مبنى تجاري - 6 أدوار', ownerName: 'ناصر بن محمد الحربي', status: 'نشطة', createdDate: '2024-08-20' },
  { id: 'TRX-005', code: '2409005', type: 'عادية', projectName: 'مستودع صناعي', ownerName: 'سعد بن عبدالله الغامدي', status: 'نشطة', createdDate: '2024-08-15' },
  { id: 'STRX-001', code: '2410001', type: 'بسيطة', projectName: 'استعلام عن صك', ownerName: 'خالد السالم', status: 'مكتملة', createdDate: '2024-10-01' },
  { id: 'STRX-002', code: '2410002', type: 'بسيطة', projectName: 'مراجعة مخطط', ownerName: 'فهد الدوسري', status: 'مكتملة', createdDate: '2024-10-05' },
  { id: 'STRX-003', code: '2410003', type: 'بسيطة', projectName: 'استشارة هندسية', ownerName: 'عمر الزهراني', status: 'نشطة', createdDate: '2024-10-10' }
];

// بيانات وهمية - عروض الأسعار

const MOCK_QUOTATIONS: SupervisionQuotation[] = [
  {
    id: 'QUOT-001',
    quotationCode: 'Q-2025-001',
    supervisionTransactionId: 'SUP-001',
    supervisionTransactionCode: '2510001',
    projectName: 'فيلا سكنية - دورين',
    ownerName: 'محمد بن أحمد العتيبي',
    totalAmount: 45000,
    currency: 'SAR',
    validUntil: '2025-02-15',
    status: 'accepted',
    createdBy: 'أحمد المطيري',
    createdDate: '2025-01-10',
    items: [
      { id: '1', description: 'إشراف على الأساسات', quantity: 1, unit: 'مرحلة', unitPrice: 5000, totalPrice: 5000 },
      { id: '2', description: 'إشراف على الهيكل الإنشائي', quantity: 2, unit: 'مرحلة', unitPrice: 8000, totalPrice: 16000 },
      { id: '3', description: 'إشراف على أعمال الكهرباء والسباكة', quantity: 1, unit: 'مرحلة', unitPrice: 6000, totalPrice: 6000 },
      { id: '4', description: 'إشراف على أعمال التشطيبات', quantity: 1, unit: 'مرحلة', unitPrice: 10000, totalPrice: 10000 },
      { id: '5', description: 'تقارير دورية وتوثيق', quantity: 6, unit: 'شهر', unitPrice: 1333, totalPrice: 8000 }
    ]
  },
  {
    id: 'QUOT-002',
    quotationCode: 'Q-2025-002',
    supervisionTransactionId: 'SUP-002',
    supervisionTransactionCode: '2510002',
    projectName: 'عمارة سكنية - 4 أدوار',
    ownerName: 'عبدالله بن سعد القحطاني',
    totalAmount: 85000,
    currency: 'SAR',
    validUntil: '2025-02-10',
    status: 'accepted',
    createdBy: 'أحمد المطيري',
    createdDate: '2025-01-05',
    items: [
      { id: '1', description: 'إشراف شامل على جميع المراحل', quantity: 1, unit: 'مشروع', unitPrice: 75000, totalPrice: 75000 },
      { id: '2', description: 'تقارير فنية شهرية', quantity: 9, unit: 'شهر', unitPrice: 1111, totalPrice: 10000 }
    ]
  },
  {
    id: 'QUOT-003',
    quotationCode: 'Q-2025-003',
    supervisionTransactionId: 'SUP-003',
    supervisionTransactionCode: '2510003',
    projectName: 'فيلا سكنية - 3 أدوار',
    ownerName: 'فيصل بن عبدالعزيز الشمري',
    totalAmount: 62000,
    currency: 'SAR',
    validUntil: '2025-02-05',
    status: 'sent',
    createdBy: 'أحمد المطيري',
    createdDate: '2025-01-01',
    items: [
      { id: '1', description: 'إشراف كامل على المشروع', quantity: 1, unit: 'مشروع', unitPrice: 55000, totalPrice: 55000 },
      { id: '2', description: 'تقارير وتوثيق', quantity: 7, unit: 'شهر', unitPrice: 1000, totalPrice: 7000 }
    ]
  }
];

// بيانات وهمية - عقود الإشراف

const MOCK_CONTRACTS: SupervisionContract[] = [
  {
    id: 'CONT-001',
    contractCode: 'C-2025-001',
    supervisionTransactionId: 'SUP-001',
    supervisionTransactionCode: '2510001',
    quotationId: 'QUOT-001',
    projectName: 'فيلا سكنية - دورين',
    ownerName: 'محمد بن أحمد العتيبي',
    contractAmount: 45000,
    currency: 'SAR',
    startDate: '2025-01-15',
    endDate: '2025-07-15',
    status: 'active',
    signedBy: 'محمد بن أحمد العتيبي',
    signedDate: '2025-01-15',
    terms: [
      'يلتزم المكتب بالإشراف الدوري على جميع مراحل البناء',
      'يتم الدفع على دفعات حسب مراحل الإنجاز',
      'يحق للمالك طلب تقارير دورية كل أسبوعين',
      'يلتزم المكتب بالحضور الفوري عند الطلب',
      'أي تعديلات على المخططات تتطلب موافقة كتابية'
    ],
    attachments: [
      { id: '1', name: 'نسخة من رخصة البناء.pdf', type: 'pdf', uploadDate: '2025-01-15', uploadedBy: 'أحمد المطيري' },
      { id: '2', name: 'المخططات المعتمدة.pdf', type: 'pdf', uploadDate: '2025-01-15', uploadedBy: 'أحمد المطيري' }
    ],
    createdBy: 'أحمد المطيري',
    createdDate: '2025-01-15'
  },
  {
    id: 'CONT-002',
    contractCode: 'C-2025-002',
    supervisionTransactionId: 'SUP-002',
    supervisionTransactionCode: '2510002',
    quotationId: 'QUOT-002',
    projectName: 'عمارة سكنية - 4 أدوار',
    ownerName: 'عبدالله بن سعد القحطاني',
    contractAmount: 85000,
    currency: 'SAR',
    startDate: '2025-01-10',
    endDate: '2025-10-10',
    status: 'suspended',
    signedBy: 'عبدالله بن سعد القحطاني',
    signedDate: '2025-01-10',
    terms: [
      'إشراف شامل على جميع المراحل',
      'تقارير شهرية تفصيلية',
      'الالتزام بمعايير الجودة والسلامة',
      'توثيق بالصور والفيديو لجميع المراحل',
      'إصدار شهادة الإكمال عند الانتهاء'
    ],
    attachments: [
      { id: '1', name: 'عقد الإشراف.pdf', type: 'pdf', uploadDate: '2025-01-10', uploadedBy: 'أحمد المطيري' }
    ],
    createdBy: 'أحمد المطيري',
    createdDate: '2025-01-10'
  }
];

// ============================================================
// المكون الرئيسي
// ============================================================

const SupervisionTransactions_Complete_875: React.FC = () => {
  const [activeTab, setActiveTab] = useState('875-01');
  const [supervisionTransactions] = useState<SupervisionTransaction[]>(MOCK_SUPERVISION_TRANSACTIONS);
  const [selectedTransaction, setSelectedTransaction] = useState<SupervisionTransaction | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // إحصائيات
  const statistics = useMemo(() => ({
    total: supervisionTransactions.length,
    active: supervisionTransactions.filter(t => t.status === 'active').length,
    paused: supervisionTransactions.filter(t => t.status === 'paused').length,
    completed: supervisionTransactions.filter(t => t.status === 'completed').length,
    transferred: supervisionTransactions.filter(t => t.status === 'transferred').length,
    cancelled: supervisionTransactions.filter(t => t.status === 'cancelled').length,
    avgProgress: Math.round(
      supervisionTransactions.reduce((sum, t) => sum + t.overallProgress, 0) / 
      supervisionTransactions.length
    ),
    totalArea: supervisionTransactions.reduce((sum, t) => sum + t.area, 0)
  }), [supervisionTransactions]);

  // تصفية المعاملات
  const filteredTransactions = useMemo(() => {
    return supervisionTransactions.filter(transaction => {
      const statusMatch = filterStatus === 'all' || transaction.status === filterStatus;
      const searchMatch = searchTerm === '' ||
        transaction.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [supervisionTransactions, filterStatus, searchTerm]);

  // دالة الحالة
  const getStatusInfo = (status: string) => {
    const statuses: Record<string, { label: string; color: string; icon: any }> = {
      'active': { label: 'نشط', color: '#10b981', icon: CheckCircle },
      'paused': { label: 'متوقف', color: '#f59e0b', icon: Pause },
      'completed': { label: 'مكتمل', color: '#2563eb', icon: CheckCircle },
      'transferred': { label: 'منقول', color: '#8b5cf6', icon: ArrowRightLeft },
      'cancelled': { label: 'ملغي', color: '#ef4444', icon: XCircle }
    };
    return statuses[status] || statuses.active;
  };

  // ============================================================
  // التاب 875-01: نظرة عامة
  // ============================================================

  const renderTab01_Overview = () => (
    <div className="space-y-4">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-8 gap-3">
        <Card className="card-element card-rtl" style={{ 
          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          border: '2px solid #93c5fd'
        }}>
          <CardContent className="p-3 text-center">
            <FileText className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.total}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إجمالي المعاملات
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ 
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
          border: '2px solid #6ee7b7'
        }}>
          <CardContent className="p-3 text-center">
            <Activity className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.active}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              معاملات نشطة
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ 
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '2px solid #fcd34d'
        }}>
          <CardContent className="p-3 text-center">
            <Pause className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
            <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.paused}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              معاملات متوقفة
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ 
          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          border: '2px solid #60a5fa'
        }}>
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.completed}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              معاملات مكتملة
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ 
          background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
          border: '2px solid #a5b4fc'
        }}>
          <CardContent className="p-3 text-center">
            <ArrowRightLeft className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
            <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.transferred}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              معاملات منقولة
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ 
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          border: '2px solid #fca5a5'
        }}>
          <CardContent className="p-3 text-center">
            <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.cancelled}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              معاملات ملغاة
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ 
          background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
          border: '2px solid #f9a8d4'
        }}>
          <CardContent className="p-3 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-pink-600 mb-1" />
            <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.avgProgress}%
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              متوسط الإنجاز
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ 
          background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
          border: '2px solid #d8b4fe'
        }}>
          <CardContent className="p-3 text-center">
            <Building2 className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.totalArea.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إجمالي المساحة (م²)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* المعاملات الأخيرة */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            آخر المعاملات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشروع</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المالك</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشرف</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإنجاز</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supervisionTransactions.slice(0, 5).map((transaction) => {
                const statusInfo = getStatusInfo(transaction.status);
                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      {transaction.code}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {transaction.projectName}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {transaction.ownerName}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {transaction.supervisor}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2">
                        <Progress value={transaction.overallProgress} className="flex-1" />
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {transaction.overallProgress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge style={{ background: statusInfo.color }}>
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="h-3 w-3 ml-1" />
                          عرض
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 875-02: قائمة المعاملات
  // ============================================================

  const renderTab02_List = () => (
    <div className="space-y-4">
      {/* شريط التصفية */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-5">
              <InputWithCopy
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث برقم المعاملة، المشروع، المالك، أو الرخصة..."
                copyable={false}
                clearable={true}
              />
            </div>
            <div className="col-span-2">
              <SelectWithCopy
                id="status-filter"
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: 'all', label: 'جميع الحالات' },
                  { value: 'active', label: 'نشط' },
                  { value: 'paused', label: 'متوقف' },
                  { value: 'completed', label: 'مكتمل' },
                  { value: 'transferred', label: 'منقول' },
                  { value: 'cancelled', label: 'ملغي' }
                ]}
                copyable={false}
                clearable={false}
              />
            </div>
            <div className="col-span-2">
              <Button className="w-full" variant="outline">
                <Filter className="h-4 w-4 ml-1" />
                تصفية متقدمة
              </Button>
            </div>
            <div className="col-span-3 flex gap-2">
              <Button className="flex-1" variant="outline">
                <Download className="h-4 w-4 ml-1" />
                تصدير
              </Button>
              <Button className="flex-1">
                <RefreshCw className="h-4 w-4 ml-1" />
                تحديث
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* جدول المعاملات */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea style={{ height: 'calc(100vh - 380px)' }}>
            <Table className="table-rtl">
              <TableHeader style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 10 }}>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشروع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المالك</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشرف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرحلة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإنجاز</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => {
                  const statusInfo = getStatusInfo(transaction.status);
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                        {transaction.code}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {transaction.projectName}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {transaction.ownerName}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {transaction.location}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {transaction.area} م²
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {transaction.supervisor}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {transaction.currentStage}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <Progress value={transaction.overallProgress} className="flex-1" />
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {transaction.overallProgress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge style={{ background: statusInfo.color }}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="h-3 w-3 ml-1" />
                            عرض
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 ml-1" />
                            تعديل
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 875-03: إضافة معاملة
  // ============================================================

  const renderTab03_Add = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إضافة معاملة إشراف جديدة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* معلومات الربط - محسّن */}
            <Card style={{ border: '2px solid #3b82f6' }}>
              <CardHeader className="pb-3">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  <Link2 className="h-5 w-5 inline ml-2" />
                  ربط المعاملة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* اختيار نوع الربط */}
                <div className="grid grid-cols-2 gap-4">
                  {/* ربط بمعاملة */}
                  <div>
                    <SelectWithCopy
                      label="ربط بمعاملة (عادية/بسيطة)"
                      id="linked-transaction-select"
                      options={[
                        { value: '', label: 'اختر المعاملة' },
                        ...MOCK_TRANSACTIONS.map(t => ({
                          value: t.id,
                          label: `${t.code} - ${t.projectName} (${t.type})`
                        }))
                      ]}
                      copyable={false}
                      clearable={true}
                    />
                  </div>

                  {/* ربط برخصة بناء */}
                  <div>
                    <SelectWithCopy
                      label="ربط برخصة بناء"
                      id="building-license-select"
                      options={[
                        { value: '', label: 'اختر رخصة البناء' },
                        ...MOCK_BUILDING_LICENSES.map(lic => ({
                          value: lic.id,
                          label: `${lic.licenseNumber} - ${lic.projectName}`
                        }))
                      ]}
                      copyable={false}
                      clearable={true}
                    />
                  </div>
                </div>

                {/* حقل بحث برقم الرخصة */}
                <div className="grid grid-cols-1 gap-2">
                  <InputWithCopy
                    label="أو ابحث برقم الرخصة"
                    id="license-search"
                    placeholder="مثال: LIC-2024-12345"
                    copyable={true}
                    clearable={true}
                  />
                  <Button variant="outline" className="w-full">
                    <Search className="h-4 w-4 ml-1" />
                    بحث متقدم عن رخصة البناء
                  </Button>
                </div>

                {/* معلومات عن الربط */}
                <div 
                  className="p-3 rounded-lg" 
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                    border: '1px dashed #3b82f6'
                  }}
                >
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                    💡 <strong>ملاحظة:</strong> يمكنك ربط معاملة الإشراف بمعاملة سابقة (عادية أو بسيطة) أو برخصة بناء مباشرة. سيتم سحب جميع البيانات تلقائياً عند الاختيار.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* معلومات المشروع */}
            <Card style={{ border: '2px solid #10b981' }}>
              <CardHeader className="pb-3">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  معلومات المشروع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <InputWithCopy
                    label="اسم المشروع"
                    id="project-name"
                    placeholder="مثال: فيلا سكنية - دورين"
                    required={true}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="اسم المالك"
                    id="owner-name"
                    placeholder="الاسم الكامل"
                    required={true}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="الموقع"
                    id="location"
                    placeholder="الحي، المدينة"
                    required={true}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="المساحة (م²)"
                    id="area"
                    placeholder="600"
                    type="number"
                    required={true}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="عدد الأدوار"
                    id="floors"
                    placeholder="2"
                    type="number"
                    required={true}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تاريخ بدء الإشراف"
                    id="start-date"
                    type="date"
                    required={true}
                    copyable={false}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تاريخ الانتهاء المتوقع"
                    id="expected-end-date"
                    type="date"
                    required={true}
                    copyable={false}
                    clearable={true}
                  />
                </div>
              </CardContent>
            </Card>

            {/* معلومات المشرف */}
            <Card style={{ border: '2px solid #f59e0b' }}>
              <CardHeader className="pb-3">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  معلومات المشرف
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <SelectWithCopy
                    label="المشرف"
                    id="supervisor"
                    options={[
                      { value: 'supervisor1', label: 'م. خالد السالم' },
                      { value: 'supervisor2', label: 'م. فهد الدوسري' },
                      { value: 'supervisor3', label: 'م. سعد القحطاني' }
                    ]}
                    required={true}
                    copyable={false}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="رقم الجوال"
                    id="supervisor-phone"
                    placeholder="05XXXXXXXX"
                    required={true}
                    copyable={true}
                    clearable={true}
                  />
                </div>
              </CardContent>
            </Card>

            {/* ملاحظات */}
            <Card style={{ border: '2px solid #8b5cf6' }}>
              <CardHeader className="pb-3">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  ملاحظات إضافية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TextAreaWithCopy
                  label=""
                  id="notes"
                  rows={4}
                  placeholder="أضف أي ملاحظات إضافية..."
                  copyable={true}
                  clearable={true}
                />
              </CardContent>
            </Card>

            {/* أزرار الحفظ */}
            <div className="flex gap-2 justify-end">
              <Button style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                <Save className="h-4 w-4 ml-1" />
                حفظ المعاملة
              </Button>
              <Button variant="outline">
                <X className="h-4 w-4 ml-1" />
                إلغاء
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 875-04: مراحل الإنشاء
  // ============================================================

  const renderTab04_Stages = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              مراحل الإنشاء
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 ml-1" />
              إضافة مرحلة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {CONSTRUCTION_STAGES_TEMPLATE.map((stage, index) => (
              <Card key={index} style={{ border: '2px solid #e5e7eb' }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full" 
                        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                        <span className="text-white font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {stage.sequence}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {stage.name}
                        </p>
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          المدة المتوقعة: {stage.duration} يوم
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">لم تبدأ</Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3 ml-1" />
                          بدء
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 ml-1" />
                          تعديل
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 875-05: تعهدات المالك
  // ============================================================

  const renderTab05_OwnerCommitments = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تعهدات المالك
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 ml-1" />
              إضافة تعهد
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {OWNER_COMMITMENTS_TEMPLATE.map((commitment, index) => (
              <Card key={index} style={{ 
                border: '2px solid #e5e7eb',
                background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)'
              }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <FileSignature className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {commitment}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">قيد الانتظار</Badge>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-3 w-3 ml-1" />
                        تأكيد
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 875-06: تعهدات المكتب
  // ============================================================

  const renderTab06_OfficeCommitments = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تعهدات المكتب
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 ml-1" />
              إضافة تعهد
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {OFFICE_COMMITMENTS_TEMPLATE.map((commitment, index) => (
              <Card key={index} style={{ 
                border: '2px solid #e5e7eb',
                background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)'
              }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {commitment}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">قيد الانتظار</Badge>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-3 w-3 ml-1" />
                        تأكيد
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 875-07: الخط الزمني
  // ============================================================

  const renderTab07_Timeline = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الخط الزمني للمشروع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                نسبة الإنجاز الكلية
              </span>
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                35%
              </span>
            </div>
            <Progress value={35} />
          </div>

          <div className="relative">
            {/* خط زمني عمودي */}
            <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            <div className="space-y-6">
              {[
                { date: '2025-01-15', title: 'بدء الإشراف', desc: 'بدء أعمال الإشراف على المشروع', progress: 0, color: '#3b82f6' },
                { date: '2025-01-20', title: 'إكمال الحفر', desc: 'اكتملت أعمال الحفر والتسوية', progress: 10, color: '#10b981' },
                { date: '2025-02-05', title: 'إكمال الأساسات', desc: 'اكتملت أعمال الأساسات', progress: 20, color: '#10b981' },
                { date: '2025-03-01', title: 'جاري العمل', desc: 'جاري العمل في الهيكل الإنشائي - الأرضي', progress: 35, color: '#f59e0b' }
              ].map((event, index) => (
                <div key={index} className="relative flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10"
                    style={{ background: event.color }}>
                    {event.progress === 0 ? (
                      <Clock className="h-5 w-5 text-white" />
                    ) : event.progress < 100 ? (
                      <Activity className="h-5 w-5 text-white" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <Card className="flex-1" style={{ border: `2px solid ${event.color}` }}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {event.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {event.desc}
                          </p>
                          <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {event.date}
                          </p>
                        </div>
                        <Badge style={{ background: event.color }}>
                          {event.progress}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 875-08: التوقف والاستئناف
  // ============================================================

  const renderTab08_PauseResume = () => (
    <div className="space-y-4">
      <Card style={{ border: '2px solid #f59e0b', background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <AlertTriangle className="h-6 w-6 inline ml-2" />
            إدارة التوقف والاستئناف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  <Pause className="h-5 w-5 inline ml-2" />
                  إيقاف مؤقت
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <SelectWithCopy
                  label="سبب التوقف"
                  id="pause-reason"
                  options={[
                    { value: 'financial', label: 'ظروف مالية' },
                    { value: 'weather', label: 'ظروف جوية' },
                    { value: 'materials', label: 'نقص مواد' },
                    { value: 'permits', label: 'انتظار تصاريح' },
                    { value: 'owner-request', label: 'طلب المالك' },
                    { value: 'other', label: 'أخرى' }
                  ]}
                  required={true}
                  copyable={false}
                  clearable={true}
                />
                <TextAreaWithCopy
                  label="تفاصيل السبب"
                  id="pause-details"
                  rows={3}
                  placeholder="اشرح سبب التوقف بالتفصيل..."
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="تاريخ التوقف"
                  id="pause-date"
                  type="date"
                  required={true}
                  copyable={false}
                  clearable={true}
                />
                <Button className="w-full" style={{ background: '#f59e0b' }}>
                  <Pause className="h-4 w-4 ml-1" />
                  تأكيد التوقف
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  <Play className="h-5 w-5 inline ml-2" />
                  استئناف العمل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>
                    <AlertCircle className="h-4 w-4 inline ml-1" />
                    المشروع متوقف منذ: 15 يوم
                  </p>
                </div>
                <TextAreaWithCopy
                  label="ملاحظات الاستئناف"
                  id="resume-notes"
                  rows={3}
                  placeholder="أضف أي ملاحظات..."
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="تاريخ الاستئناف"
                  id="resume-date"
                  type="date"
                  required={true}
                  copyable={false}
                  clearable={true}
                />
                <Button className="w-full" style={{ background: '#10b981' }}>
                  <Play className="h-4 w-4 ml-1" />
                  استئناف العمل
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 875-09: نقل الإشراف
  // ============================================================

  const renderTab09_Transfer = () => (
    <div className="space-y-4">
      <Card style={{ border: '2px solid #8b5cf6', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <ArrowRightLeft className="h-6 w-6 inline ml-2" />
            نقل الإشراف لجهة خارجية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                معلومات الجهة المستلمة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <InputWithCopy
                  label="اسم الجهة/المكتب"
                  id="transfer-company"
                  placeholder="اسم المكتب الهندسي"
                  required={true}
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="رقم الترخيص"
                  id="transfer-license"
                  placeholder="رقم الترخيص"
                  required={true}
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="المسؤول"
                  id="transfer-responsible"
                  placeholder="اسم المسؤول"
                  required={true}
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="رقم الجوال"
                  id="transfer-phone"
                  placeholder="05XXXXXXXX"
                  required={true}
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="البريد الإلكتروني"
                  id="transfer-email"
                  type="email"
                  placeholder="email@example.com"
                  copyable={true}
                  clearable={true}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                تفاصيل النقل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <SelectWithCopy
                label="سبب النقل"
                id="transfer-reason"
                options={[
                  { value: 'conflict', label: 'تضارب مصالح' },
                  { value: 'capacity', label: 'عدم القدرة على الاستمرار' },
                  { value: 'owner-request', label: 'طلب المالك' },
                  { value: 'specialization', label: 'الحاجة لتخصص معين' },
                  { value: 'other', label: 'أخرى' }
                ]}
                required={true}
                copyable={false}
                clearable={true}
              />
              <TextAreaWithCopy
                label="تفاصيل السبب"
                id="transfer-details"
                rows={3}
                placeholder="اشرح سبب نقل الإشراف..."
                required={true}
                copyable={true}
                clearable={true}
              />
              <div className="grid grid-cols-2 gap-4">
                <InputWithCopy
                  label="تاريخ النقل"
                  id="transfer-date"
                  type="date"
                  required={true}
                  copyable={false}
                  clearable={true}
                />
                <InputWithCopy
                  label="المعتمد"
                  id="transfer-approved-by"
                  placeholder="اسم المعتمد"
                  required={true}
                  copyable={true}
                  clearable={true}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 justify-end">
            <Button style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
              <ArrowRightLeft className="h-4 w-4 ml-1" />
              تأكيد النقل
            </Button>
            <Button variant="outline">
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 875-10: مرفقات التنازل
  // ============================================================

  const renderTab10_TransferAttachments = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            مرفقات التنازل عن الإشراف
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {TRANSFER_DOCUMENTS_TEMPLATE.map((doc, index) => (
              <Card key={index} style={{ 
                border: doc.required ? '2px solid #ef4444' : '2px solid #e5e7eb',
                background: doc.uploaded ? '#f0fdf4' : '#ffffff'
              }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <FileCheck className={`h-5 w-5 ${doc.uploaded ? 'text-green-600' : 'text-gray-400'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {doc.name}
                          </p>
                          {doc.required && (
                            <Badge variant="outline" style={{ background: '#fee2e2', color: '#991b1b' }}>
                              إلزامي
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          النوع: {doc.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {doc.uploaded ? (
                        <>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 ml-1" />
                            عرض
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3 ml-1" />
                            حذف
                          </Button>
                        </>
                      ) : (
                        <Button size="sm">
                          <Upload className="h-3 w-3 ml-1" />
                          رفع
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg" style={{ background: '#dbeafe', border: '2px solid #60a5fa' }}>
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                  ملاحظات مهمة:
                </p>
                <ul className="text-xs space-y-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e3a8a' }}>
                  <li>• المستندات المطلوبة إلزامية لإتمام عملية النقل</li>
                  <li>• يجب أن تكون جميع المستندات واضحة وقابلة للقراءة</li>
                  <li>• الحد الأقصى لحجم الملف: 10 ميجابايت</li>
                  <li>• الصيغ المقبولة: PDF, JPG, PNG</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 875-11: التقارير
  // ============================================================

  const renderTab11_Reports = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="p-6 text-center">
            <Printer className="h-12 w-12 mx-auto text-blue-600 mb-3" />
            <p className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تقرير شامل
            </p>
            <p className="text-xs text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تقرير كامل بجميع معاملات الإشراف
            </p>
            <Button className="w-full">
              <Download className="h-4 w-4 ml-1" />
              طباعة
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="p-6 text-center">
            <Activity className="h-12 w-12 mx-auto text-green-600 mb-3" />
            <p className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تقرير الإنجاز
            </p>
            <p className="text-xs text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تقرير نسب الإنجاز للمشاريع
            </p>
            <Button className="w-full">
              <Download className="h-4 w-4 ml-1" />
              طباعة
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="p-6 text-center">
            <Pause className="h-12 w-12 mx-auto text-yellow-600 mb-3" />
            <p className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              المشاريع المتوقفة
            </p>
            <p className="text-xs text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تقرير المشاريع المتوقفة مع الأسباب
            </p>
            <Button className="w-full">
              <Download className="h-4 w-4 ml-1" />
              طباعة
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="p-6 text-center">
            <ArrowRightLeft className="h-12 w-12 mx-auto text-purple-600 mb-3" />
            <p className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              المشاريع المنقولة
            </p>
            <p className="text-xs text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تقرير المشاريع المنقولة
            </p>
            <Button className="w-full">
              <Download className="h-4 w-4 ml-1" />
              طباعة
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="p-6 text-center">
            <FileSignature className="h-12 w-12 mx-auto text-orange-600 mb-3" />
            <p className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تقرير التعهدات
            </p>
            <p className="text-xs text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تقرير تعهدات المالك والمكتب
            </p>
            <Button className="w-full">
              <Download className="h-4 w-4 ml-1" />
              طباعة
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="p-6 text-center">
            <Layers className="h-12 w-12 mx-auto text-teal-600 mb-3" />
            <p className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تقرير المراحل
            </p>
            <p className="text-xs text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تقرير مراحل الإنشاء المكتملة
            </p>
            <Button className="w-full">
              <Download className="h-4 w-4 ml-1" />
              طباعة
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // ============================================================
  // التاب 875-12: الإعدادات
  // ============================================================

  const renderTab12_Settings = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إعدادات معاملات الإشراف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <EnhancedSwitch
              id="auto-notifications"
              label="تنبيهات تلقائية"
              description="إرسال تنبيهات عند اكتمال كل مرحلة"
              checked={true}
              variant="success"
            />
            <EnhancedSwitch
              id="require-photos"
              label="إلزامية الصور"
              description="يجب رفع صور لكل مرحلة"
              checked={true}
              variant="warning"
            />
            <EnhancedSwitch
              id="auto-reports"
              label="تقارير دورية"
              description="إنشاء تقارير دورية تلقائياً"
              checked={false}
              variant="default"
            />
            <EnhancedSwitch
              id="require-inspection"
              label="المعاينة الإلزامية"
              description="معاينة إلزامية لكل مرحلة"
              checked={true}
              variant="danger"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إعدادات التنبيهات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <EnhancedSwitch
            id="notify-stage-complete"
            label="تنبيه إكمال المرحلة"
            description="إشعار عند إكمال أي مرحلة"
            checked={true}
            variant="success"
          />
          <EnhancedSwitch
            id="notify-pause"
            label="تنبيه التوقف"
            description="إشعار عند توقف المشروع"
            checked={true}
            variant="warning"
          />
          <EnhancedSwitch
            id="notify-transfer"
            label="تنبيه النقل"
            description="إشعار عند نقل الإشراف"
            checked={true}
            variant="default"
          />
          <EnhancedSwitch
            id="notify-overdue"
            label="تنبيه التأخير"
            description="إشعار عند تأخر أي مرحلة"
            checked={true}
            variant="danger"
          />
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button>
          <Save className="h-4 w-4 ml-1" />
          حفظ الإعدادات
        </Button>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 ml-1" />
          استعادة الافتراضي
        </Button>
      </div>
    </div>
  );

  // ============================================================
  // التاب 875-13: عروض الأسعار
  // ============================================================

  const renderTab13_Quotations = () => (
    <div className="space-y-4">
      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-5 gap-3">
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #3b82f6' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>إجمالي العروض</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1e3a8a' }}>
                  {MOCK_QUOTATIONS.length}
                </p>
              </div>
              <Briefcase className="h-5 w-5" style={{ color: '#3b82f6' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #10b981' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#065f46' }}>مقبولة</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#064e3b' }}>
                  {MOCK_QUOTATIONS.filter(q => q.status === 'accepted').length}
                </p>
              </div>
              <CheckCircle className="h-5 w-5" style={{ color: '#10b981' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #f59e0b' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>مرسلة</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#78350f' }}>
                  {MOCK_QUOTATIONS.filter(q => q.status === 'sent').length}
                </p>
              </div>
              <Mail className="h-5 w-5" style={{ color: '#f59e0b' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #6366f1' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#3730a3' }}>مسودات</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#312e81' }}>
                  {MOCK_QUOTATIONS.filter(q => q.status === 'draft').length}
                </p>
              </div>
              <Edit className="h-5 w-5" style={{ color: '#6366f1' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #ec4899' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#831843' }}>إجمالي القيمة</p>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#831843' }}>
                  {MOCK_QUOTATIONS.reduce((sum, q) => sum + q.totalAmount, 0).toLocaleString()} ر.س
                </p>
              </div>
              <Briefcase className="h-5 w-5" style={{ color: '#ec4899' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول عروض الأسعار */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              عروض الأسعار للإشراف على الإنشاء
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 ml-1" />
              عرض سعر جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea style={{ height: 'calc(100vh - 420px)' }}>
            <Table className="table-rtl">
              <TableHeader style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 10 }}>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العرض</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>معاملة الإشراف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشروع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المالك</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الإجمالية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>صالح حتى</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_QUOTATIONS.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      {quotation.quotationCode}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {quotation.supervisionTransactionCode}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {quotation.projectName}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {quotation.ownerName}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, color: '#059669' }}>
                      {quotation.totalAmount.toLocaleString()} {quotation.currency}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {quotation.validUntil}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge style={{ 
                        background: quotation.status === 'accepted' ? '#10b981' : 
                                   quotation.status === 'sent' ? '#f59e0b' : 
                                   quotation.status === 'draft' ? '#6366f1' : '#ef4444'
                      }}>
                        {quotation.status === 'accepted' ? 'مقبول' : 
                         quotation.status === 'sent' ? 'مرسل' : 
                         quotation.status === 'draft' ? 'مسودة' : 
                         quotation.status === 'rejected' ? 'مرفوض' : 'منتهي'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 ml-1" />
                          عرض
                        </Button>
                        <Button size="sm" variant="outline">
                          <Printer className="h-3 w-3 ml-1" />
                          طباعة
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

  // ============================================================
  // التاب 875-14: عقود الإشراف
  // ============================================================

  const renderTab14_Contracts = () => (
    <div className="space-y-4">
      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-5 gap-3">
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #3b82f6' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>إجمالي العقود</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1e3a8a' }}>
                  {MOCK_CONTRACTS.length}
                </p>
              </div>
              <FileSignature className="h-5 w-5" style={{ color: '#3b82f6' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #10b981' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#065f46' }}>نشطة</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#064e3b' }}>
                  {MOCK_CONTRACTS.filter(c => c.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-5 w-5" style={{ color: '#10b981' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #f59e0b' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>معلقة</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#78350f' }}>
                  {MOCK_CONTRACTS.filter(c => c.status === 'suspended').length}
                </p>
              </div>
              <Pause className="h-5 w-5" style={{ color: '#f59e0b' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #6366f1' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#3730a3' }}>مكتملة</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#312e81' }}>
                  {MOCK_CONTRACTS.filter(c => c.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-5 w-5" style={{ color: '#6366f1' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #ec4899' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#831843' }}>إجمالي القيمة</p>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#831843' }}>
                  {MOCK_CONTRACTS.reduce((sum, c) => sum + c.contractAmount, 0).toLocaleString()} ر.س
                </p>
              </div>
              <Briefcase className="h-5 w-5" style={{ color: '#ec4899' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول عقود الإشراف */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              عقود الإشراف على الإنشاء
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 ml-1" />
              عقد جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea style={{ height: 'calc(100vh - 420px)' }}>
            <Table className="table-rtl">
              <TableHeader style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 10 }}>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العقد</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>معاملة الإشراف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشروع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المالك</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيمة العقد</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ البدء</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانتهاء</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_CONTRACTS.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      {contract.contractCode}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {contract.supervisionTransactionCode}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {contract.projectName}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {contract.ownerName}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, color: '#059669' }}>
                      {contract.contractAmount.toLocaleString()} {contract.currency}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {contract.startDate}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {contract.endDate}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge style={{ 
                        background: contract.status === 'active' ? '#10b981' : 
                                   contract.status === 'suspended' ? '#f59e0b' : 
                                   contract.status === 'completed' ? '#6366f1' : 
                                   contract.status === 'draft' ? '#94a3b8' : '#ef4444'
                      }}>
                        {contract.status === 'active' ? 'نشط' : 
                         contract.status === 'suspended' ? 'معلق' : 
                         contract.status === 'completed' ? 'مكتمل' : 
                         contract.status === 'draft' ? 'مسودة' : 'ملغي'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 ml-1" />
                          عرض
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 ml-1" />
                          تحميل
                        </Button>
                        <Button size="sm" variant="outline">
                          <Printer className="h-3 w-3 ml-1" />
                          طباعة
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

      {/* ملاحظة */}
      <Card style={{ border: '2px dashed #3b82f6', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%)' }}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#3b82f6' }} />
            <div>
              <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, color: '#1e40af' }}>
                ملاحظة مهمة
              </p>
              <p className="text-xs mt-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af', lineHeight: '1.6' }}>
                سيتم ربط عقود الإشراف بشاشة إدارة العقود (الشاشة 814) عند تطويرها بشكل كامل. حالياً يتم عرض البيانات الأساسية للعقود المرتبطة بمعاملات الإشراف فقط.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // عرض التاب الحالي
  // ============================================================

  const renderTabContent = () => {
    switch (activeTab) {
      case '875-01': return renderTab01_Overview();
      case '875-02': return renderTab02_List();
      case '875-03': return renderTab03_Add();
      case '875-04': return renderTab04_Stages();
      case '875-05': return renderTab05_OwnerCommitments();
      case '875-06': return renderTab06_OfficeCommitments();
      case '875-07': return renderTab07_Timeline();
      case '875-08': return renderTab08_PauseResume();
      case '875-09': return renderTab09_Transfer();
      case '875-10': return renderTab10_TransferAttachments();
      case '875-11': return renderTab11_Reports();
      case '875-12': return renderTab12_Settings();
      case '875-13': return renderTab13_Quotations();
      case '875-14': return renderTab14_Contracts();
      default: return renderTab01_Overview();
    }
  };

  // ============================================================
  // الواجهة الرئيسية
  // ============================================================

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
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
              <HardHat
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
                  معاملات الإشراف على الإنشاء
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
                    875
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
                <span
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#94a3b8',
                    display: 'inline-block'
                  }}
                ></span>
                إدارة شاملة للإشراف على رخص البناء مع التتبع الكامل
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
                14 تبويباً
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        {/* السايد بار الموحد */}
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* مساحة العمل */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', padding: '0 16px' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SupervisionTransactions_Complete_875;
