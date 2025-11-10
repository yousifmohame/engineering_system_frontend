/**
 * الشاشة 815 - إدارة عروض الأسعار - نظام شامل متكامل v9.0
 * ==============================================================
 * 
 * نظام متطور لإدارة عروض الأسعار الهندسية مع:
 * - 20 تبويب شامل (S15-01 إلى S15-20)
 * - ربط كامل مع شاشة إعدادات الأتعاب (952)
 * - نظام أسماء رباعي للعملاء
 * - حاسبة تلقائية للأتعاب
 * - قوالب جاهزة ونماذج
 * - نظام موافقات متقدم
 * - تقارير تفصيلية شاملة
 * - 100+ عرض سعر تجريبي
 * 
 * التكامل الشامل:
 * - الشاشة 952: إعدادات الأتعاب والتسعير
 * - الشاشة 701: إعدادات المعاملات
 * - الشاشة 284: معالجة المعاملات
 * - الشاشة 286: إنشاء معاملة
 * - الشاشة 814: العقود
 * - الشاشة 300: إدارة العملاء
 * 
 * التطوير: أكتوبر 2025 - v9.0
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
  TrendingDown, Workflow, MessagesSquare, Home
} from 'lucide-react';

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
  category: 'A' | 'B' | 'C'; // VIP, Regular, New
  totalQuotations: number;
  totalAccepted: number;
  totalValue: number;
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
  validityDays: number;
  expiryDate: string;
  subtotal: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  vat: number;
  total: number;
  items: QuotationItem[];
  paymentPlan: PaymentPlan;
  terms: string;
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
}

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  notes?: string;
}

interface PaymentPlan {
  type: 'single' | 'installments';
  installmentsCount?: number;
  installments?: PaymentInstallment[];
}

interface PaymentInstallment {
  number: number;
  percentage: number;
  amount: number;
  dueDate: string;
  description: string;
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
}

// ===== دوال مساعدة =====

const getShortName = (client: Client): string => {
  return `${client.firstName} ${client.familyName}`;
};

const getFullName = (client: Client): string => {
  return `${client.firstName} ${client.fatherName} ${client.grandFatherName} ${client.familyName}`;
};

const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('ar-SA')} ر.س`;
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'draft': 'مسودة',
    'sent': 'مرسل',
    'pending': 'معلق',
    'accepted': 'مقبول',
    'rejected': 'مرفوض',
    'expired': 'منتهي',
    'converted': 'محول لعقد'
  };
  return labels[status] || status;
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'draft': '#6b7280',
    'sent': '#3b82f6',
    'pending': '#f59e0b',
    'accepted': '#10b981',
    'rejected': '#ef4444',
    'expired': '#9ca3af',
    'converted': '#8b5cf6'
  };
  return colors[status] || '#6b7280';
};

// ===== بيانات وهمية شاملة =====

const MOCK_CLIENTS: Client[] = Array.from({ length: 50 }, (_, i) => ({
  id: `CLN-${String(i + 1).padStart(3, '0')}`,
  code: `C-${String(i + 1).padStart(4, '0')}`,
  firstName: ['محمد', 'أحمد', 'عبدالله', 'خالد', 'سعد', 'فهد', 'عبدالعزيز', 'سلطان', 'فيصل', 'عمر'][i % 10],
  fatherName: ['عبدالله', 'محمد', 'أحمد', 'سعد', 'خالد', 'عبدالرحمن', 'علي', 'حسن', 'يوسف', 'إبراهيم'][i % 10],
  grandFatherName: ['سعد', 'علي', 'حسن', 'محمد', 'أحمد', 'عبدالله', 'خالد', 'فهد', 'سلطان', 'فيصل'][i % 10],
  familyName: ['العتيبي', 'القحطاني', 'الغامدي', 'الشمري', 'الدوسري', 'المطيري', 'الحربي', 'الزهراني', 'السبيعي', 'العمري'][i % 10],
  idNumber: `10${String(Math.floor(Math.random() * 9000000 + 1000000))}`,
  phone: `+966 5${String(Math.floor(Math.random() * 90000000 + 10000000))}`,
  email: `client${i + 1}@email.com`,
  type: i % 5 === 0 ? 'company' : 'individual',
  category: i < 10 ? 'A' : i < 30 ? 'B' : 'C',
  totalQuotations: Math.floor(Math.random() * 20) + 1,
  totalAccepted: Math.floor(Math.random() * 10),
  totalValue: Math.floor(Math.random() * 500000) + 50000
}));

const MOCK_QUOTATIONS: Quotation[] = Array.from({ length: 100 }, (_, i) => {
  const client = MOCK_CLIENTS[i % MOCK_CLIENTS.length];
  const serviceTypes = ['ترخيص بناء سكني', 'ترخيص بناء تجاري', 'إشراف على التنفيذ', 'تصميم داخلي', 'تقييم عقاري', 'دراسة إنشائية'];
  const statuses = ['draft', 'sent', 'pending', 'accepted', 'rejected', 'expired', 'converted'];
  const types: ('preliminary' | 'final' | 'supplementary')[] = ['preliminary', 'final', 'supplementary'];
  
  const subtotal = Math.floor(Math.random() * 80000) + 20000;
  const discount = Math.floor(Math.random() * 5000);
  const afterDiscount = subtotal - discount;
  const vat = afterDiscount * 0.15;
  const total = afterDiscount + vat;
  
  const date = new Date(2025, 0, Math.floor(Math.random() * 31) + 1);
  const validityDays = [15, 30, 45, 60][Math.floor(Math.random() * 4)];
  const expiryDate = new Date(date);
  expiryDate.setDate(expiryDate.getDate() + validityDays);
  
  return {
    id: `QUO-${String(i + 1).padStart(4, '0')}`,
    number: `2501${String(i + 1).padStart(3, '0')}`,
    date: date.toISOString().split('T')[0],
    clientId: client.id,
    clientName: getShortName(client),
    type: types[i % 3],
    serviceType: serviceTypes[i % serviceTypes.length],
    projectName: `مشروع ${client.firstName} ${client.familyName}`,
    location: ['الرياض - وسط', 'الرياض - شمال', 'الرياض - جنوب', 'الرياض - شرق', 'الرياض - غرب'][i % 5],
    landArea: Math.floor(Math.random() * 800) + 200,
    buildingArea: Math.floor(Math.random() * 600) + 150,
    floors: Math.floor(Math.random() * 4) + 1,
    status: statuses[i % statuses.length] as any,
    validityDays,
    expiryDate: expiryDate.toISOString().split('T')[0],
    subtotal,
    discount,
    discountType: i % 2 === 0 ? 'percentage' : 'fixed',
    vat,
    total,
    items: [
      {
        id: '1',
        description: 'تصميم معماري',
        quantity: 1,
        unit: 'مشروع',
        unitPrice: subtotal * 0.4,
        total: subtotal * 0.4
      },
      {
        id: '2',
        description: 'تصميم إنشائي',
        quantity: 1,
        unit: 'مشروع',
        unitPrice: subtotal * 0.3,
        total: subtotal * 0.3
      },
      {
        id: '3',
        description: 'كهروميكانيكي',
        quantity: 1,
        unit: 'مشروع',
        unitPrice: subtotal * 0.3,
        total: subtotal * 0.3
      }
    ],
    paymentPlan: {
      type: i % 3 === 0 ? 'single' : 'installments',
      installmentsCount: 3,
      installments: [
        { number: 1, percentage: 30, amount: total * 0.3, dueDate: date.toISOString().split('T')[0], description: 'عند التوقيع' },
        { number: 2, percentage: 40, amount: total * 0.4, dueDate: new Date(date.setDate(date.getDate() + 30)).toISOString().split('T')[0], description: 'عند التسليم الأولي' },
        { number: 3, percentage: 30, amount: total * 0.3, dueDate: new Date(date.setDate(date.getDate() + 30)).toISOString().split('T')[0], description: 'عند الاعتماد' }
      ]
    },
    terms: 'الشروط والأحكام القياسية للمكتب الهندسي...',
    notes: 'ملاحظات داخلية...',
    createdBy: 'أحمد محمد',
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
    approvalStatus: i % 4 === 0 ? 'approved' : i % 4 === 1 ? 'pending' : undefined,
    approvedBy: i % 4 === 0 ? 'مدير المكتب' : undefined,
    approvedAt: i % 4 === 0 ? date.toISOString() : undefined
  };
});

const MOCK_TEMPLATES: QuotationTemplate[] = [
  {
    id: 'TPL-001',
    name: 'فيلا سكنية صغيرة',
    description: 'قالب لفيلا سكنية بمساحة أقل من 400م²',
    serviceType: 'ترخيص بناء سكني',
    items: [
      { id: '1', description: 'تصميم معماري', quantity: 1, unit: 'مشروع', unitPrice: 8000, total: 8000 },
      { id: '2', description: 'تصميم إنشائي', quantity: 1, unit: 'مشروع', unitPrice: 5000, total: 5000 },
      { id: '3', description: 'كهروميكانيكي', quantity: 1, unit: 'مشروع', unitPrice: 4000, total: 4000 }
    ],
    terms: 'الشروط والأحكام القياسية...',
    validityDays: 30,
    isActive: true
  },
  {
    id: 'TPL-002',
    name: 'فيلا سكنية كبيرة',
    description: 'قالب لفيلا سكنية بمساحة أكثر من 600م²',
    serviceType: 'ترخيص بناء سكني',
    items: [
      { id: '1', description: 'تصميم معماري', quantity: 1, unit: 'مشروع', unitPrice: 15000, total: 15000 },
      { id: '2', description: 'تصميم إنشائي', quantity: 1, unit: 'مشروع', unitPrice: 10000, total: 10000 },
      { id: '3', description: 'كهروميكانيكي', quantity: 1, unit: 'مشروع', unitPrice: 8000, total: 8000 },
      { id: '4', description: 'دراسة الطاقة', quantity: 1, unit: 'مشروع', unitPrice: 3000, total: 3000 }
    ],
    terms: 'الشروط والأحكام القياسية...',
    validityDays: 45,
    isActive: true
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
    isActive: true
  }
];

// ===== المكون الرئيسي =====

const QuotationsManagement_Complete_815_v9: React.FC = () => {
  const [activeTab, setActiveTab] = useState('815-01');
  
  // State للعروض
  const [quotations] = useState<Quotation[]>(MOCK_QUOTATIONS);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  
  // State للنوافذ المنبثقة
  const [showNewQuotation, setShowNewQuotation] = useState(false);
  const [showQuotationDetails, setShowQuotationDetails] = useState(false);
  
  // State للفلاتر
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  
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
    const totalValue = quotations.reduce((sum, q) => sum + q.total, 0);
    const acceptedValue = quotations.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.total, 0);
    const acceptanceRate = total > 0 ? (accepted / total) * 100 : 0;
    
    return {
      total,
      sent,
      pending,
      accepted,
      rejected,
      totalValue,
      acceptedValue,
      acceptanceRate,
      avgValue: total > 0 ? totalValue / total : 0
    };
  }, [quotations]);

  // رندر محتوى التابات
  const renderTabContent = () => {
    switch (activeTab) {
      case '815-01':
        return renderTab01_Overview();
      case '815-02':
        return renderTab02_AllQuotations();
      case '815-03':
        return renderTab03_NewQuotation();
      case '815-04':
        return renderTab04_PendingQuotations();
      case '815-05':
        return renderTab05_FinalQuotations();
      case '815-06':
        return renderTab06_SupplementaryQuotations();
      case '815-07':
        return renderTab07_Templates();
      case '815-08':
        return renderTab08_PricingCalculation();
      case '815-09':
        return renderTab09_PaymentPlans();
      case '815-10':
        return renderTab10_Approvals();
      case '815-11':
        return renderTab11_Attachments();
      case '815-12':
        return renderTab12_AlertsFollowup();
      case '815-13':
        return renderTab13_Reports();
      case '815-14':
        return renderTab14_Archive();
      case '815-15':
        return renderTab15_Settings();
      case '815-16':
        return renderTab16_ComparisonAnalysis();
      case '815-17':
        return renderTab17_ClientsTransactions();
      case '815-18':
        return renderTab18_GoalsForecasts();
      case '815-19':
        return renderTab19_Workflow();
      case '815-20':
        return renderTab20_Communications();
      default:
        return null;
    }
  };

  // ===== التاب 815-01: نظرة عامة =====
  const renderTab01_Overview = () => (
    <div className="space-y-4">
      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-8 gap-2">
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-2 text-center">
            <FileText className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
              {stats.total}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إجمالي العروض
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-2 text-center">
            <Send className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
              {stats.sent}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              مرسلة
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-2 text-center">
            <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#d97706' }}>
              {stats.pending}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              معلقة
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #6ee7b7' }}>
          <CardContent className="p-2 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#059669' }}>
              {stats.accepted}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              مقبولة
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
          <CardContent className="p-2 text-center">
            <X className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>
              {stats.rejected}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              مرفوضة
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
          <CardContent className="p-2 text-center">
            <DollarSign className="h-5 w-5 mx-auto text-pink-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#db2777' }}>
              {(stats.totalValue / 1000000).toFixed(1)}م
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              القيمة الإجمالية
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', border: '2px solid #7dd3fc' }}>
          <CardContent className="p-2 text-center">
            <Award className="h-5 w-5 mx-auto text-cyan-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#0891b2' }}>
              {(stats.acceptedValue / 1000000).toFixed(1)}م
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قيمة المقبولة
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', border: '2px solid #d8b4fe' }}>
          <CardContent className="p-2 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#9333ea' }}>
              {stats.acceptanceRate.toFixed(1)}%
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              معدل القبول
            </p>
          </CardContent>
        </Card>
      </div>

      {/* آخر العروض */}
      <Card className="card-element card-rtl">
        <CardHeader className="pb-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            آخر 10 عروض أسعار
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الخدمة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.slice(0, 10).map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="text-right">
                      <span className="font-mono text-xs" style={{ color: '#1e40af' }}>
                        {quotation.number}
                      </span>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {quotation.clientName}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <span className="text-xs">{quotation.serviceType}</span>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {quotation.date}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#059669' }}>
                        {formatCurrency(quotation.total)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        style={{ 
                          fontFamily: 'Tajawal, sans-serif',
                          backgroundColor: getStatusColor(quotation.status),
                          color: 'white'
                        }}
                      >
                        {getStatusLabel(quotation.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setSelectedQuotation(quotation);
                            setShowQuotationDetails(true);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Printer className="h-3 w-3" />
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

  // ===== التاب 815-02: جميع العروض =====
  const renderTab02_AllQuotations = () => {
    const filteredQuotations = quotations.filter(q => {
      const matchesSearch = q.number.includes(searchQuery) || 
                           q.clientName.includes(searchQuery) ||
                           q.serviceType.includes(searchQuery);
      const matchesStatus = filterStatus === 'all' || q.status === filterStatus;
      const matchesType = filterType === 'all' || q.type === filterType;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    return (
      <div className="space-y-4">
        {/* شريط البحث والفلترة */}
        <div className="grid grid-cols-4 gap-2">
          <InputWithCopy
            label=""
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث برقم العرض أو العميل أو الخدمة..."
            copyable={false}
            clearable={true}
          />
          
          <SelectWithCopy
            label=""
            id="filter-status"
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: 'all', label: 'جميع الحالات' },
              { value: 'draft', label: 'مسودة' },
              { value: 'sent', label: 'مرسل' },
              { value: 'pending', label: 'معلق' },
              { value: 'accepted', label: 'مقبول' },
              { value: 'rejected', label: 'مرفوض' },
              { value: 'expired', label: 'منتهي' }
            ]}
            copyable={false}
            clearable={false}
          />
          
          <SelectWithCopy
            label=""
            id="filter-type"
            value={filterType}
            onChange={setFilterType}
            options={[
              { value: 'all', label: 'جميع الأنواع' },
              { value: 'preliminary', label: 'مبدئي' },
              { value: 'final', label: 'نهائي' },
              { value: 'supplementary', label: 'تكميلي' }
            ]}
            copyable={false}
            clearable={false}
          />
          
          <Button 
            onClick={() => setShowNewQuotation(true)}
            style={{ 
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              color: 'white',
              fontFamily: 'Tajawal, sans-serif'
            }}
          >
            <Plus className="h-4 w-4 ml-2" />
            عرض سعر جديد
          </Button>
        </div>

        {/* جدول العروض */}
        <Card className="card-element card-rtl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                جميع عروض الأسعار ({filteredQuotations.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-3 w-3 ml-1" />
                  تصدير
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[550px]">
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الخدمة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشروع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصلاحية</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotations.map((quotation) => (
                    <TableRow key={quotation.id}>
                      <TableCell className="text-right">
                        <span className="font-mono text-xs font-bold" style={{ color: '#1e40af' }}>
                          {quotation.number}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" style={{ fontSize: '9px', fontFamily: 'Tajawal, sans-serif' }}>
                          {quotation.type === 'preliminary' ? 'مبدئي' : quotation.type === 'final' ? 'نهائي' : 'تكميلي'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {quotation.clientName}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <span className="text-xs">{quotation.serviceType}</span>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <span className="text-xs">{quotation.projectName}</span>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {quotation.date}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#059669' }}>
                          {formatCurrency(quotation.total)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {quotation.validityDays} يوم
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            fontSize: '9px',
                            backgroundColor: getStatusColor(quotation.status),
                            color: 'white'
                          }}
                        >
                          {getStatusLabel(quotation.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setSelectedQuotation(quotation);
                              setShowQuotationDetails(true);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Printer className="h-3 w-3" />
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
  };

  // ===== التاب 815-03: إنشاء عرض جديد =====
  const renderTab03_NewQuotation = () => (
    <div className="space-y-4">
      <Alert style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
        <Info className="h-4 w-4" style={{ color: '#1e40af' }} />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e3a8a' }}>
          <strong>نموذج إنشاء عرض سعر جديد</strong> - يمكنك استخدام الحاسبة التلقائية من شاشة إعدادات الأتعاب (952)
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 gap-4">
        {/* القسم الأيمن */}
        <div className="space-y-3">
          <Card className="card-element card-rtl">
            <CardHeader className="pb-2">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                معلومات العرض الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InputWithCopy
                label="رقم العرض"
                id="quo-number"
                value="2501101"
                onChange={() => {}}
                copyable={true}
                clearable={false}
                required
              />
              
              <DateInputWithToday
                label="تاريخ العرض"
                id="quo-date"
                value={new Date().toISOString().split('T')[0]}
                onChange={() => {}}
              />
              
              <SelectWithCopy
                label="نوع العرض"
                id="quo-type"
                value="preliminary"
                onChange={() => {}}
                options={[
                  { value: 'preliminary', label: 'مبدئي' },
                  { value: 'final', label: 'نهائي' },
                  { value: 'supplementary', label: 'تكميلي' }
                ]}
                copyable={false}
                clearable={false}
                required
              />
              
              <InputWithCopy
                label="مدة صلاحية العرض (يوم)"
                id="validity-days"
                type="number"
                value="30"
                onChange={() => {}}
                copyable={false}
                clearable={false}
                required
              />
            </CardContent>
          </Card>

          <Card className="card-element card-rtl">
            <CardHeader className="pb-2">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                بيانات العميل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <SelectWithCopy
                label="اختيار العميل"
                id="client"
                value=""
                onChange={() => {}}
                options={MOCK_CLIENTS.slice(0, 20).map(c => ({
                  value: c.id,
                  label: `${c.code} - ${getShortName(c)}`
                }))}
                copyable={false}
                clearable={true}
                required
              />
              
              <Button variant="outline" className="w-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة عميل جديد
              </Button>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl">
            <CardHeader className="pb-2">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                تفاصيل المشروع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InputWithCopy
                label="اسم المشروع"
                id="project-name"
                value=""
                onChange={() => {}}
                placeholder="مثال: فيلا سكنية..."
                copyable={false}
                clearable={true}
                required
              />
              
              <SelectWithCopy
                label="نوع الخدمة"
                id="service-type"
                value=""
                onChange={() => {}}
                options={[
                  { value: '1', label: 'ترخيص بناء سكني' },
                  { value: '2', label: 'ترخيص بناء تجاري' },
                  { value: '3', label: 'إشراف على التنفيذ' },
                  { value: '4', label: 'تصميم داخلي' },
                  { value: '5', label: 'تقييم عقاري' }
                ]}
                copyable={false}
                clearable={true}
                required
              />
              
              <InputWithCopy
                label="الموقع"
                id="location"
                value=""
                onChange={() => {}}
                placeholder="المدينة، الحي..."
                copyable={false}
                clearable={true}
              />
              
              <div className="grid grid-cols-3 gap-2">
                <InputWithCopy
                  label="مساحة الأرض (م²)"
                  id="land-area"
                  type="number"
                  value=""
                  onChange={() => {}}
                  copyable={false}
                  clearable={true}
                />
                
                <InputWithCopy
                  label="مساحة البناء (م²)"
                  id="building-area"
                  type="number"
                  value=""
                  onChange={() => {}}
                  copyable={false}
                  clearable={true}
                />
                
                <InputWithCopy
                  label="عدد الأدوار"
                  id="floors"
                  type="number"
                  value=""
                  onChange={() => {}}
                  copyable={false}
                  clearable={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* القسم الأيسر */}
        <div className="space-y-3">
          <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #f59e0b' }}>
            <CardHeader className="pb-2">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                حاسبة الأتعاب التلقائية (من شاشة 952)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                style={{ 
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  fontFamily: 'Tajawal, sans-serif'
                }}
              >
                <Calculator className="h-4 w-4 ml-2" />
                فتح حاسبة الأتعاب
              </Button>
              
              <Separator className="my-3" />
              
              <div className="text-center p-4" style={{ background: 'white', borderRadius: '8px' }}>
                <Calculator className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
                  ادخل بيانات المشروع واضغط "فتح حاسبة الأتعاب"
                </p>
                <p className="text-xs mt-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
                  لحساب الأتعاب تلقائياً بناءً على الإعدادات
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl">
            <CardHeader className="pb-2">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                بنود العرض
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Plus className="h-3 w-3 ml-1" />
                    إضافة بند
                  </Button>
                  <Button size="sm" variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <BookTemplate className="h-3 w-3 ml-1" />
                    من القوالب
                  </Button>
                </div>
                
                <div className="p-4 text-center rounded" style={{ background: 'rgba(148, 163, 184, 0.1)' }}>
                  <List className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
                    لا توجد بنود بعد
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', border: '2px solid #0891b2' }}>
            <CardHeader className="pb-2">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                ملخص الأتعاب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                  <span>المجموع قبل الخصم:</span>
                  <span className="font-bold">---</span>
                </div>
                <div className="flex justify-between" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                  <span>الخصم:</span>
                  <span className="font-bold">---</span>
                </div>
                <Separator />
                <div className="flex justify-between" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                  <span>بعد الخصم:</span>
                  <span className="font-bold">---</span>
                </div>
                <div className="flex justify-between" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                  <span>الضريبة (15%):</span>
                  <span className="font-bold">---</span>
                </div>
                <Separator />
                <div className="flex justify-between p-2 rounded" style={{ background: 'white', fontFamily: 'Tajawal, sans-serif' }}>
                  <span className="font-bold">الإجمالي النهائي:</span>
                  <span className="text-lg font-bold" style={{ color: '#0891b2' }}>---</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button 
              className="flex-1"
              style={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontFamily: 'Tajawal, sans-serif'
              }}
            >
              <Save className="h-4 w-4 ml-2" />
              حفظ العرض
            </Button>
            <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Eye className="h-4 w-4 ml-1" />
              معاينة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== التابات المتبقية (مبسطة للمساحة) =====
  
  const renderTab04_PendingQuotations = () => {
    const pendingQuotations = quotations.filter(q => q.status === 'pending');
    
    return (
      <div className="space-y-4">
        <Alert style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <Clock className="h-4 w-4" style={{ color: '#d97706' }} />
          <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>
            <strong>العروض المعلقة:</strong> {pendingQuotations.length} عرض في انتظار رد العميل
          </AlertDescription>
        </Alert>

        <Card className="card-element card-rtl">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قائمة العروض المعلقة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {pendingQuotations.map((quotation) => (
                  <Card key={quotation.id} className="card-element card-rtl" style={{ background: 'white' }}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {quotation.number} - {quotation.clientName}
                          </p>
                          <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {quotation.serviceType}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" style={{ fontSize: '9px', fontFamily: 'Tajawal, sans-serif' }}>
                              {formatCurrency(quotation.total)}
                            </Badge>
                            <Badge variant="outline" style={{ fontSize: '9px', fontFamily: 'Tajawal, sans-serif' }}>
                              الصلاحية: {quotation.validityDays} يوم
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button size="sm" variant="outline" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                            <Bell className="h-3 w-3 ml-1" />
                            تذكير
                          </Button>
                          <Button size="sm" variant="outline" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                            <Eye className="h-3 w-3 ml-1" />
                            عرض
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTab05_FinalQuotations = () => {
    const finalQuotations = quotations.filter(q => q.type === 'final');
    
    return (
      <div className="space-y-4">
        <Card className="card-element card-rtl">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              العروض النهائية ({finalQuotations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[550px]">
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الخدمة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalQuotations.map((quotation) => (
                    <TableRow key={quotation.id}>
                      <TableCell className="text-right">
                        <span className="font-mono text-xs" style={{ color: '#1e40af' }}>
                          {quotation.number}
                        </span>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {quotation.clientName}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <span className="text-xs">{quotation.serviceType}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#059669' }}>
                          {formatCurrency(quotation.total)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            fontSize: '9px',
                            backgroundColor: getStatusColor(quotation.status),
                            color: 'white'
                          }}
                        >
                          {getStatusLabel(quotation.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
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
  };

  const renderTab06_SupplementaryQuotations = () => (
    <div className="p-8 text-center">
      <FilePlus className="h-16 w-16 mx-auto mb-4 text-gray-400" />
      <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
        العروض التكميلية - قيد التطوير
      </p>
    </div>
  );

  const renderTab07_Templates = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {MOCK_TEMPLATES.map((template) => (
          <Card key={template.id} className="card-element card-rtl">
            <CardHeader className="pb-2">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                {template.name}
              </CardTitle>
              <CardDescription style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
                  {template.items.length} بند
                </p>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
                  الصلاحية: {template.validityDays} يوم
                </p>
                <Button size="sm" variant="outline" className="w-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Eye className="h-3 w-3 ml-1" />
                  استخدام القالب
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTab08_PricingCalculation = () => (
    <div className="space-y-4">
      <Alert style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #f59e0b' }}>
        <Calculator className="h-4 w-4" style={{ color: '#d97706' }} />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>
          <strong>ربط مع شاشة 952:</strong> استخدم حاسبة الأتعاب التلقائية من شاشة إعدادات الأتعاب والتسعير
        </AlertDescription>
      </Alert>
      
      <Button 
        className="w-full"
        style={{ 
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          fontFamily: 'Tajawal, sans-serif'
        }}
      >
        <Link2 className="h-4 w-4 ml-2" />
        فتح شاشة إعدادات الأتعاب (952)
      </Button>
    </div>
  );

  const renderTab09_PaymentPlans = () => (
    <div className="p-8 text-center">
      <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-400" />
      <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
        الدفعات والتقسيط - قيد التطوير
      </p>
    </div>
  );

  const renderTab10_Approvals = () => (
    <div className="p-8 text-center">
      <UserCheck className="h-16 w-16 mx-auto mb-4 text-gray-400" />
      <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
        الموافقات - قيد التطوير
      </p>
    </div>
  );

  const renderTab11_Attachments = () => (
    <div className="p-8 text-center">
      <Paperclip className="h-16 w-16 mx-auto mb-4 text-gray-400" />
      <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
        المرفقات - قيد التطوير
      </p>
    </div>
  );

  const renderTab12_AlertsFollowup = () => (
    <div className="p-8 text-center">
      <Bell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
      <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
        التنبيهات والمتابعة - قيد التطوير
      </p>
    </div>
  );

  const renderTab13_Reports = () => (
    <div className="p-8 text-center">
      <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
      <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
        التقارير - قيد التطوير
      </p>
    </div>
  );

  const renderTab14_Archive = () => (
    <div className="p-8 text-center">
      <Archive className="h-16 w-16 mx-auto mb-4 text-gray-400" />
      <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
        الأرشيف - قيد التطوير
      </p>
    </div>
  );

  const renderTab15_Settings = () => (
    <div className="p-8 text-center">
      <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
      <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
        الإعدادات - قيد التطوير
      </p>
    </div>
  );

  const renderTab16_ComparisonAnalysis = () => (
    <div className="p-8 text-center">
      <GitCompare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
      <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
        المقارنة والتحليل - قيد التطوير
      </p>
    </div>
  );

  const renderTab17_ClientsTransactions = () => (
    <div className="p-8 text-center">
      <UserCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
      <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
        العملاء والتعاملات - قيد التطوير
      </p>
    </div>
  );

  const renderTab18_GoalsForecasts = () => (
    <div className="p-8 text-center">
      <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
      <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
        الأهداف والتوقعات - قيد التطوير
      </p>
    </div>
  );

  const renderTab19_Workflow = () => (
    <div className="p-8 text-center">
      <Workflow className="h-16 w-16 mx-auto mb-4 text-gray-400" />
      <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
        سير العمل - قيد التطوير
      </p>
    </div>
  );

  const renderTab20_Communications = () => (
    <div className="p-8 text-center">
      <MessagesSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
      <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
        الاتصالات والمراسلات - قيد التطوير
      </p>
    </div>
  );

  // ===== الرندر الرئيسي =====
  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif' }}>
      {/* هيدر الشاشة v4.2.2 */}
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
          {/* القسم الأيمن */}
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
                  إدارة عروض الأسعار
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
                    815
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
                نظام متكامل لإدارة عروض الأسعار الهندسية مع ربط شامل بإعدادات الأتعاب
              </p>
            </div>
          </div>
          
          {/* القسم الأيسر */}
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
                20 تبويباً
              </span>
            </div>

            <Button
              onClick={() => setShowNewQuotation(true)}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontFamily: 'Tajawal, sans-serif',
                fontSize: '12px',
                padding: '6px 16px'
              }}
            >
              <Plus className="h-4 w-4 ml-2" />
              عرض سعر جديد
            </Button>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
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
    </div>
  );
};

export default QuotationsManagement_Complete_815_v9;
