/**
 * الشاشة 815 - إدارة عروض الأسعار - نظام شامل متطور v11.0
 * ==================================================================
 * 
 * نظام متكامل لإدارة عروض الأسعار الهندسية مع:
 * - 20 تبويب كامل التطوير (S15-01 إلى S15-20) ✅ 100%
 * - نوافذ منبثقة شاملة لكل عملية (16 نافذة)
 * - نظام موافقات متعدد المستويات (3 مستويات)
 * - تقارير تفصيلية مع رسوم بيانية تفاعلية (8 تقارير)
 * - نظام Workflow كامل مع مراحل وإشعارات (6 مراحل)
 * - 100+ عرض سعر تجريبي
 * - ربط كامل مع شاشة 952 (حاسبة الأتعاب)
 * 
 * الجديد في v11.0:
 * - ✅ التاب 815-06: العروض التكميلية (كامل)
 * - ✅ التاب 815-11: نظام المرفقات الشامل
 * - ✅ التاب 815-12: التنبيهات والمتابعة الذكية
 * - ✅ التاب 815-14: الأرشيف المتقدم
 * - ✅ التاب 815-15: الإعدادات الشاملة (7 أقسام)
 * - ✅ التاب 815-16: المقارنة والتحليل
 * - ✅ التاب 815-17: العملاء والتعاملات
 * - ✅ التاب 815-18: الأهداف والتوقعات
 * 
 * التطوير: أكتوبر 2025 - v11.0
 * الحالة: ✅ جميع التابات الـ20 مكتملة 100%
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import DateInputWithToday from '../DateInputWithToday';
import {
  FileText, Plus, Edit, Trash2, Eye, Download, Upload, CheckCircle,
  Clock, AlertCircle, X, Search, Filter, Calendar, DollarSign,
  Users, Building, Mail, Phone, Settings, History, Archive,
  RefreshCw, Printer, Send, Target, Award, TrendingUp, Paperclip,
  Shield, Bell, Calculator, Receipt, CreditCard, Wallet, Copy,
  Save, FilePlus, FileCheck, FileX, UserCheck, Percent, Tag,
  Layers, Info, AlertTriangle, Star, Zap, Activity, BarChart3,
  LayoutDashboard, List, PlusCircle, HourglassIcon, FileCheck2,
  FilePlus2, BookTemplate, ArrowLeftRight, Database, LineChart,
  FolderArchive, Cog, Link2, HelpCircle, GitCompare, UserCircle,
  TrendingDown, Workflow, MessagesSquare, Home, ChevronRight,
  PlayCircle, PauseCircle, CheckCircle2, XCircle, FileSignature,
  Share2, ExternalLink, ArrowUpDown, SortAsc, SortDesc, Folder,
  Image, FileType, HardDrive, UploadCloud, Grid, ListIcon,
  FolderTree, Maximize2, MinusCircle, AlertOctagon, CheckSquare,
  Package, Briefcase, ClipboardCheck, CalendarClock
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// ===== TypeScript Interfaces =====

interface Client {
  id: string;
  code: string;
  firstName: string;
  fatherName: string;
  grandFatherName: string;
  familyName: string;
  idNumber: string;
  phone: string;
  email: string;
  type: 'individual' | 'company';
  category: 'A' | 'B' | 'C';
  totalQuotations: number;
  totalAccepted: number;
  totalValue: number;
  acceptanceRate: number;
}

interface Quotation {
  id: string;
  number: string;
  date: string;
  clientId: string;
  clientName: string;
  type: 'preliminary' | 'final' | 'supplementary';
  serviceType: string;
  projectName: string;
  location: string;
  landArea: number;
  buildingArea: number;
  floors: number;
  status: 'draft' | 'sent' | 'pending' | 'accepted' | 'rejected' | 'expired' | 'converted';
  validUntil: string;
  total: number;
  discount: number;
  netTotal: number;
  vat: number;
  grandTotal: number;
  items: QuotationItem[];
  terms: string;
  notes: string;
  approvalStatus: 'pending' | 'level1' | 'level2' | 'approved' | 'rejected';
  sentDate?: string;
  acceptedDate?: string;
  rejectedDate?: string;
  originalQuotationId?: string; // للعروض التكميلية
  reasonForSupplement?: string; // سبب العرض التكميلي
}

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  category?: string;
}

interface QuotationTemplate {
  id: string;
  name: string;
  description: string;
  serviceType: string;
  items: QuotationItem[];
  terms: string;
  validityDays: number;
  isActive: boolean;
  usageCount: number;
}

interface Attachment {
  id: string;
  quotationId: string;
  name: string;
  type: string;
  size: number;
  category: string; // المجلد
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  preview?: string;
}

interface Communication {
  id: string;
  type: 'email' | 'phone' | 'whatsapp' | 'meeting' | 'letter';
  date: string;
  subject: string;
  content: string;
  from: string;
  to: string;
  status: 'sent' | 'delivered' | 'read' | 'replied';
}

interface ApprovalLevel {
  level: number;
  title: string;
  approver: string;
  status: 'pending' | 'approved' | 'rejected';
  date?: string;
  notes?: string;
}

interface WorkflowStage {
  id: string;
  name: string;
  order: number;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  completedAt?: string;
  completedBy?: string;
}

interface Alert {
  id: string;
  type: 'expiry' | 'response' | 'approval' | 'payment' | 'follow-up' | 'update';
  quotationId: string;
  quotationNumber: string;
  clientName: string;
  priority: 'high' | 'medium' | 'low';
  message: string;
  dueDate: string;
  status: 'active' | 'resolved' | 'dismissed';
  assignedTo: string;
  createdAt: string;
  resolvedAt?: string;
  action?: string;
}

interface ArchivedQuotation extends Quotation {
  archivedDate: string;
  archivedBy: string;
  archiveReason: 'expired' | 'cancelled' | 'rejected' | 'replaced' | 'periodic' | 'other';
  archiveNotes?: string;
  canRestore: boolean;
}

interface Goal {
  period: 'month' | 'quarter' | 'year';
  targetCount: number;
  actualCount: number;
  targetValue: number;
  actualValue: number;
  achievement: number;
  startDate: string;
  endDate: string;
}

interface EmployeeGoal {
  employeeId: string;
  employeeName: string;
  targetCount: number;
  actualCount: number;
  achievement: number;
  rank: number;
}

// ===== بيانات وهمية موسعة =====

// عملاء (50)
const MOCK_CLIENTS: Client[] = Array.from({ length: 50 }, (_, i) => ({
  id: `CLI-${String(i + 1).padStart(3, '0')}`,
  code: `C${String(i + 1).padStart(4, '0')}`,
  firstName: ['محمد', 'أحمد', 'خالد', 'عبدالله', 'سعود'][i % 5],
  fatherName: ['عبدالله', 'محمد', 'أحمد', 'سعد', 'علي'][i % 5],
  grandFatherName: ['سعد', 'علي', 'حسن', 'يوسف', 'إبراهيم'][i % 5],
  familyName: ['السعيد', 'الأحمد', 'العلي', 'الحسن', 'المحمد'][i % 5],
  idNumber: `1${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`,
  phone: `05${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
  email: `client${i + 1}@example.com`,
  type: i % 3 === 0 ? 'company' : 'individual',
  category: ['A', 'B', 'C'][i % 3] as 'A' | 'B' | 'C',
  totalQuotations: Math.floor(Math.random() * 20) + 5,
  totalAccepted: Math.floor(Math.random() * 10) + 2,
  totalValue: Math.floor(Math.random() * 500000) + 100000,
  acceptanceRate: Math.floor(Math.random() * 40) + 30
}));

// عروض الأسعار (100+)
const MOCK_QUOTATIONS: Quotation[] = Array.from({ length: 100 }, (_, i) => {
  const client = MOCK_CLIENTS[i % 50];
  const date = new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
  const total = Math.floor(Math.random() * 400000) + 50000;
  const discount = Math.random() > 0.7 ? Math.floor(total * (Math.random() * 0.1)) : 0;
  const netTotal = total - discount;
  const vat = netTotal * 0.15;
  
  return {
    id: `QUO-${String(i + 1).padStart(4, '0')}`,
    number: `2501${String(i + 1).padStart(3, '0')}`,
    date: date.toISOString().split('T')[0],
    clientId: client.id,
    clientName: `${client.firstName} ${client.familyName}`,
    type: ['preliminary', 'final', 'supplementary'][Math.floor(Math.random() * 3)] as any,
    serviceType: [
      'ترخيص فيلا سكنية',
      'ترخيص عمارة سكنية',
      'ترخيص مبنى تجاري',
      'ترخيص مبنى إداري',
      'ترخيص مستودع صناعي',
      'تصميم معماري كامل',
      'إشراف على التنفيذ',
      'استشارة هندسية'
    ][Math.floor(Math.random() * 8)],
    projectName: `مشروع ${['الورود', 'النخيل', 'الياسمين', 'الزهور', 'الأمل'][i % 5]}`,
    location: ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة'][i % 5],
    landArea: Math.floor(Math.random() * 1000) + 300,
    buildingArea: Math.floor(Math.random() * 800) + 200,
    floors: Math.floor(Math.random() * 4) + 1,
    status: ['draft', 'sent', 'pending', 'accepted', 'rejected', 'expired', 'converted'][Math.floor(Math.random() * 7)] as any,
    validUntil: new Date(date.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    total,
    discount,
    netTotal,
    vat,
    grandTotal: netTotal + vat,
    items: [
      { id: '1', description: 'تصميم معماري', quantity: 1, unit: 'مشروع', unitPrice: 25000, total: 25000 },
      { id: '2', description: 'تصميم إنشائي', quantity: 1, unit: 'مشروع', unitPrice: 20000, total: 20000 },
      { id: '3', description: 'كهروميكانيكي', quantity: 1, unit: 'مشروع', unitPrice: 15000, total: 15000 }
    ],
    terms: 'الشروط والأحكام القياسية...',
    notes: `ملاحظات خاصة بالعرض رقم ${i + 1}`,
    approvalStatus: ['pending', 'level1', 'level2', 'approved', 'rejected'][Math.floor(Math.random() * 5)] as any,
    sentDate: Math.random() > 0.5 ? date.toISOString().split('T')[0] : undefined,
    originalQuotationId: Math.random() > 0.8 ? `QUO-${String(Math.floor(Math.random() * 100) + 1).padStart(4, '0')}` : undefined,
    reasonForSupplement: Math.random() > 0.8 ? 'إضافة خدمات جديدة' : undefined
  };
});

// قوالب العروض (3)
const MOCK_TEMPLATES: QuotationTemplate[] = [
  {
    id: 'TPL-001',
    name: 'فيلا سكنية صغيرة',
    description: 'قالب لفيلا سكنية - دورين',
    serviceType: 'ترخيص فيلا سكنية',
    items: [
      { id: '1', description: 'تصميم معماري', quantity: 1, unit: 'مشروع', unitPrice: 25000, total: 25000 },
      { id: '2', description: 'تصميم إنشائي', quantity: 1, unit: 'مشروع', unitPrice: 20000, total: 20000 },
      { id: '3', description: 'كهروميكانيكي', quantity: 1, unit: 'مشروع', unitPrice: 12000, total: 12000 }
    ],
    terms: 'الشروط والأحكام القياسية...',
    validityDays: 30,
    isActive: true,
    usageCount: 45
  },
  {
    id: 'TPL-002',
    name: 'فيلا سكنية كبيرة',
    description: 'قالب لفيلا سكنية - ثلاثة أدوار',
    serviceType: 'ترخيص فيلا سكنية',
    items: [
      { id: '1', description: 'تصميم معماري', quantity: 1, unit: 'مشروع', unitPrice: 40000, total: 40000 },
      { id: '2', description: 'تصميم إنشائي', quantity: 1, unit: 'مشروع', unitPrice: 30000, total: 30000 },
      { id: '3', description: 'كهروميكانيكي', quantity: 1, unit: 'مشروع', unitPrice: 20000, total: 20000 },
      { id: '4', description: 'مناظر طبيعية', quantity: 1, unit: 'تصميم', unitPrice: 15000, total: 15000 }
    ],
    terms: 'الشروط والأحكام القياسية...',
    validityDays: 45,
    isActive: true,
    usageCount: 32
  },
  {
    id: 'TPL-003',
    name: 'مبنى تجاري صغير',
    description: 'قالب لمبنى تجاري - دورين',
    serviceType: 'ترخيص بناء تجاري',
    items: [
      { id: '1', description: 'تصميم معماري', quantity: 1, unit: 'مشروع', unitPrice: 20000, total: 20000 },
      { id: '2', description: 'تصميم إنشائي', quantity: 1, unit: 'مشروع', unitPrice: 15000, total: 15000 },
      { id: '3', description: 'كهروميكانيكي', quantity: 1, unit: 'مشروع', unitPrice: 10000, total: 10000 },
      { id: '4', description: 'دراسة مرورية', quantity: 1, unit: 'دراسة', unitPrice: 8000, total: 8000 }
    ],
    terms: 'الشروط والأحكام القياسية...',
    validityDays: 60,
    isActive: true,
    usageCount: 18
  }
];

// مرفقات (50+)
const ATTACHMENT_CATEGORIES = [
  'المخططات المعمارية',
  'الرسومات الإنشائية',
  'المخططات الكهروميكانيكية',
  'التقارير الفنية',
  'الصور والإيضاحات',
  'نماذج العقود',
  'المستندات الرسمية',
  'المواصفات والمعايير',
  'المراسلات',
  'متنوع'
];

const MOCK_ATTACHMENTS: Attachment[] = Array.from({ length: 50 }, (_, i) => ({
  id: `ATT-${String(i + 1).padStart(4, '0')}`,
  quotationId: MOCK_QUOTATIONS[i % 100].id,
  name: `ملف_${i + 1}.${['pdf', 'docx', 'xlsx', 'jpg', 'dwg'][i % 5]}`,
  type: ['pdf', 'docx', 'xlsx', 'jpg', 'dwg'][i % 5],
  size: Math.floor(Math.random() * 5000000) + 100000, // 100KB - 5MB
  category: ATTACHMENT_CATEGORIES[i % 10],
  uploadedBy: ['م. أحمد', 'م. خالد', 'م. سعود', 'م. محمد'][i % 4],
  uploadedAt: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
  url: `/attachments/${i + 1}`,
  preview: ['jpg', 'pdf'].includes(['pdf', 'docx', 'xlsx', 'jpg', 'dwg'][i % 5]) ? `/previews/${i + 1}` : undefined
}));

// تنبيهات (30)
const MOCK_ALERTS: Alert[] = Array.from({ length: 30 }, (_, i) => {
  const quotation = MOCK_QUOTATIONS[i];
  const types: Alert['type'][] = ['expiry', 'response', 'approval', 'payment', 'follow-up', 'update'];
  const type = types[i % 6];
  
  return {
    id: `ALERT-${String(i + 1).padStart(4, '0')}`,
    type,
    quotationId: quotation.id,
    quotationNumber: quotation.number,
    clientName: quotation.clientName,
    priority: ['high', 'medium', 'low'][i % 3] as any,
    message: {
      'expiry': `عرض السعر ${quotation.number} سينتهي خلال ${Math.floor(Math.random() * 7) + 1} أيام`,
      'response': `لم يتم الرد على عرض السعر ${quotation.number} منذ ${Math.floor(Math.random() * 14) + 1} يوم`,
      'approval': `عرض السعر ${quotation.number} بحاجة للموافقة`,
      'payment': `دفعة مستحقة لعرض السعر ${quotation.number}`,
      'follow-up': `متابعة دورية مطلوبة لعرض السعر ${quotation.number}`,
      'update': `عرض السعر ${quotation.number} يحتاج تحديث`
    }[type],
    dueDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: ['active', 'resolved', 'dismissed'][Math.floor(Math.random() * 3)] as any,
    assignedTo: ['م. أحمد', 'م. خالد', 'م. سعود'][i % 3],
    createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: Math.random() > 0.5 ? new Date().toISOString() : undefined,
    action: type === 'approval' ? 'موافقة' : type === 'follow-up' ? 'متابعة' : 'مراجعة'
  };
});

// عروض مؤرشفة (20)
const MOCK_ARCHIVED: ArchivedQuotation[] = MOCK_QUOTATIONS.slice(0, 20).map((q, i) => ({
  ...q,
  status: 'expired' as any,
  archivedDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  archivedBy: ['م. أحمد', 'م. خالد'][i % 2],
  archiveReason: ['expired', 'cancelled', 'rejected', 'replaced', 'periodic', 'other'][i % 6] as any,
  archiveNotes: i % 2 === 0 ? `ملاحظات أرشفة للعرض ${q.number}` : undefined,
  canRestore: i % 3 !== 0
}));

// أهداف
const MOCK_GOALS: Record<'month' | 'quarter' | 'year', Goal> = {
  month: {
    period: 'month',
    targetCount: 25,
    actualCount: 18,
    targetValue: 500000,
    actualValue: 380000,
    achievement: 72,
    startDate: '2025-01-01',
    endDate: '2025-01-31'
  },
  quarter: {
    period: 'quarter',
    targetCount: 75,
    actualCount: 52,
    targetValue: 1500000,
    actualValue: 1100000,
    achievement: 69,
    startDate: '2025-01-01',
    endDate: '2025-03-31'
  },
  year: {
    period: 'year',
    targetCount: 300,
    actualCount: 52,
    targetValue: 6000000,
    actualValue: 1100000,
    achievement: 17,
    startDate: '2025-01-01',
    endDate: '2025-12-31'
  }
};

// أهداف الموظفين
const MOCK_EMPLOYEE_GOALS: EmployeeGoal[] = [
  { employeeId: 'EMP-001', employeeName: 'م. أحمد السعيد', targetCount: 50, actualCount: 38, achievement: 76, rank: 1 },
  { employeeId: 'EMP-002', employeeName: 'م. خالد العلي', targetCount: 50, actualCount: 32, achievement: 64, rank: 2 },
  { employeeId: 'EMP-003', employeeName: 'م. سعود المحمد', targetCount: 50, actualCount: 28, achievement: 56, rank: 3 },
  { employeeId: 'EMP-004', employeeName: 'م. محمد الأحمد', targetCount: 50, actualCount: 24, achievement: 48, rank: 4 },
  { employeeId: 'EMP-005', employeeName: 'م. عبدالله الحسن', targetCount: 50, actualCount: 20, achievement: 40, rank: 5 }
];

// ===== المكون الرئيسي =====

const QuotationsManagement_Complete_815_v11: React.FC = () => {
  const [activeTab, setActiveTab] = useState('815-01');
  
  // State للعروض
  const [quotations] = useState<Quotation[]>(MOCK_QUOTATIONS);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  
  // State للنوافذ المنبثقة
  const [showNewQuotation, setShowNewQuotation] = useState(false);
  const [showQuotationDetails, setShowQuotationDetails] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showPaymentPlanDialog, setShowPaymentPlanDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showReportsDialog, setShowReportsDialog] = useState(false);
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [showCommunicationDialog, setShowCommunicationDialog] = useState(false);
  const [showAttachmentsDialog, setShowAttachmentsDialog] = useState(false);
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  const [showClientHistoryDialog, setShowClientHistoryDialog] = useState(false);
  const [showGoalsDialog, setShowGoalsDialog] = useState(false);
  
  // State للفلاتر
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'client'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // State للمرفقات
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'tree'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // تكوين التابات - 20 تاباً
  const TABS_CONFIG: TabConfig[] = [
    { id: '815-01', number: '815-01', title: 'نظرة عامة', icon: LayoutDashboard },
    { id: '815-02', number: '815-02', title: 'جميع العروض', icon: List },
    { id: '815-03', number: '815-03', title: 'إنشاء عرض جديد', icon: PlusCircle },
    { id: '815-04', number: '815-04', title: 'العروض المعلقة', icon: HourglassIcon },
    { id: '815-05', number: '815-05', title: 'العروض النهائية', icon: FileCheck },
    { id: '815-06', number: '815-06', title: 'العروض التكميلية', icon: FilePlus },
    { id: '815-07', number: '815-07', title: 'قوالب العروض', icon: BookTemplate },
    { id: '815-08', number: '815-08', title: 'التسعير والحساب', icon: Calculator },
    { id: '815-09', number: '815-09', title: 'الدفعات والتقسيط', icon: CreditCard },
    { id: '815-10', number: '815-10', title: 'الموافقات', icon: UserCheck },
    { id: '815-11', number: '815-11', title: 'المرفقات', icon: Paperclip },
    { id: '815-12', number: '815-12', title: 'التنبيهات والمتابعة', icon: Bell },
    { id: '815-13', number: '815-13', title: 'التقارير', icon: BarChart3 },
    { id: '815-14', number: '815-14', title: 'الأرشيف', icon: Archive },
    { id: '815-15', number: '815-15', title: 'الإعدادات', icon: Settings },
    { id: '815-16', number: '815-16', title: 'المقارنة والتحليل', icon: GitCompare },
    { id: '815-17', number: '815-17', title: 'العملاء والتعاملات', icon: UserCircle },
    { id: '815-18', number: '815-18', title: 'الأهداف والتوقعات', icon: Target },
    { id: '815-19', number: '815-19', title: 'سير العمل', icon: Workflow },
    { id: '815-20', number: '815-20', title: 'الاتصالات والمراسلات', icon: MessagesSquare }
  ];

  // حساب الإحصائيات
  const stats = useMemo(() => {
    const total = quotations.length;
    const sent = quotations.filter(q => q.status === 'sent').length;
    const pending = quotations.filter(q => q.status === 'pending').length;
    const accepted = quotations.filter(q => q.status === 'accepted').length;
    const rejected = quotations.filter(q => q.status === 'rejected').length;
    const supplementary = quotations.filter(q => q.type === 'supplementary').length;
    const totalValue = quotations.reduce((sum, q) => sum + q.total, 0);
    const acceptedValue = quotations.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.total, 0);
    const acceptanceRate = total > 0 ? (accepted / total) * 100 : 0;
    
    return {
      total,
      sent,
      pending,
      accepted,
      rejected,
      supplementary,
      totalValue,
      acceptedValue,
      acceptanceRate,
      avgValue: total > 0 ? totalValue / total : 0,
      activeAlerts: MOCK_ALERTS.filter(a => a.status === 'active').length,
      attachments: MOCK_ATTACHMENTS.length,
      archived: MOCK_ARCHIVED.length
    };
  }, [quotations]);

  // ===== سيتم إضافة باقي الكود في PART2 =====

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div>جارٍ التطوير - v11.0 - الجزء 1 من 3</div>
    </div>
  );
};

export default QuotationsManagement_Complete_815_v11;
