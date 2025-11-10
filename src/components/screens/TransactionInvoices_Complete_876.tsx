import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  FileText, Receipt, DollarSign, Calendar, AlertTriangle,
  CheckCircle, XCircle, Clock, Upload, Download, Eye,
  Filter, Search, Plus, Edit, Trash2, TrendingUp,
  Users, Building, FileCheck, Bell, Settings,
  CreditCard, Banknote, Wallet, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { toast } from 'sonner';

// ===============================================
// الواجهات TypeScript
// ===============================================

type PaymentStatus = 'paid' | 'partial' | 'unpaid';
type PaymentMethod = 'cash' | 'bank-transfer' | 'check' | 'credit-card' | 'sadad' | 'mada';
type InvoiceStatus = 'active' | 'cancelled' | 'expired';
type InvoiceType = 'transaction' | 'manual-internal' | 'manual-external';

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  invoiceStatus: InvoiceStatus;
  type: InvoiceType;
  
  // ربط بالمعاملة
  transactionId?: string;
  transactionNumber?: string;
  transactionType?: string;
  
  // معلومات المالك
  ownerId: string;
  ownerName: string;
  ownerIdNumber: string;
  
  // معلومات الرخصة
  licenseNumber?: string;
  licenseType?: string;
  
  // تفاصيل السداد
  paymentMethod?: PaymentMethod;
  paymentDate?: string;
  paymentReference?: string;
  paymentProofImage?: string;
  paidBy?: string;
  
  // ملاحظات
  description: string;
  notes?: string;
  
  // التواريخ
  createdDate: string;
  createdBy: string;
  lastModified: string;
  cancelledDate?: string;
  cancelledBy?: string;
  cancelReason?: string;
}

interface PaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  reference: string;
  proofImage?: string;
  paidBy: string;
  notes?: string;
  recordedBy: string;
  recordedDate: string;
}

interface InvoiceAlert {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  type: 'due-soon' | 'overdue' | 'expired';
  daysRemaining: number;
  amount: number;
  ownerName: string;
  priority: 'high' | 'medium' | 'low';
  sentDate?: string;
  isRead: boolean;
}

// ===============================================
// بيانات وهمية شاملة
// ===============================================

const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-001',
    invoiceNumber: '2025-001',
    invoiceDate: '2025-01-05',
    dueDate: '2025-02-05',
    amount: 15000,
    paidAmount: 15000,
    remainingAmount: 0,
    paymentStatus: 'paid',
    invoiceStatus: 'active',
    type: 'transaction',
    transactionId: 'TRX-2501001',
    transactionNumber: '2501001',
    transactionType: 'سكني',
    ownerId: 'OWN-001',
    ownerName: 'أحمد محمد العتيبي',
    ownerIdNumber: '1023456789',
    licenseNumber: 'BLD-2025-001',
    licenseType: 'رخصة بناء',
    paymentMethod: 'bank-transfer',
    paymentDate: '2025-01-20',
    paymentReference: 'TRF-20250120-001',
    paymentProofImage: 'proof-001.pdf',
    paidBy: 'أحمد محمد العتيبي',
    description: 'رسوم رخصة بناء - فيلا سكنية',
    notes: 'تم السداد بالكامل',
    createdDate: '2025-01-05',
    createdBy: 'موظف المحاسبة',
    lastModified: '2025-01-20'
  },
  {
    id: 'INV-002',
    invoiceNumber: '2025-002',
    invoiceDate: '2025-01-10',
    dueDate: '2025-02-10',
    amount: 25000,
    paidAmount: 15000,
    remainingAmount: 10000,
    paymentStatus: 'partial',
    invoiceStatus: 'active',
    type: 'transaction',
    transactionId: 'TRX-2501002',
    transactionNumber: '2501002',
    transactionType: 'تجاري',
    ownerId: 'OWN-002',
    ownerName: 'فاطمة علي السليمان',
    ownerIdNumber: '1034567890',
    licenseNumber: 'BLD-2025-002',
    licenseType: 'رخصة بناء',
    paymentMethod: 'check',
    paymentDate: '2025-01-15',
    paymentReference: 'CHK-001234',
    paymentProofImage: 'proof-002.pdf',
    paidBy: 'فاطمة علي السليمان',
    description: 'رسوم رخصة بناء - مبنى تجاري',
    notes: 'دفعة أولى - المتبقي 10,000 ريال',
    createdDate: '2025-01-10',
    createdBy: 'موظف المحاسبة',
    lastModified: '2025-01-15'
  },
  {
    id: 'INV-003',
    invoiceNumber: '2025-003',
    invoiceDate: '2025-01-15',
    dueDate: '2025-02-15',
    amount: 12000,
    paidAmount: 0,
    remainingAmount: 12000,
    paymentStatus: 'unpaid',
    invoiceStatus: 'active',
    type: 'transaction',
    transactionId: 'TRX-2501003',
    transactionNumber: '2501003',
    transactionType: 'سكني',
    ownerId: 'OWN-003',
    ownerName: 'خالد عبدالله المطيري',
    ownerIdNumber: '1045678901',
    licenseNumber: 'BLD-2025-003',
    licenseType: 'رخصة تعديل',
    description: 'رسوم رخصة تعديل - إضافة دور',
    notes: 'في انتظار السداد',
    createdDate: '2025-01-15',
    createdBy: 'موظف المحاسبة',
    lastModified: '2025-01-15'
  },
  {
    id: 'INV-004',
    invoiceNumber: '2025-004',
    invoiceDate: '2024-12-20',
    dueDate: '2025-01-05',
    amount: 8000,
    paidAmount: 0,
    remainingAmount: 8000,
    paymentStatus: 'unpaid',
    invoiceStatus: 'expired',
    type: 'manual-internal',
    ownerId: 'OWN-004',
    ownerName: 'سارة محمد الدوسري',
    ownerIdNumber: '1056789012',
    description: 'رسوم استشارة هندسية',
    notes: 'منتهية - تجاوزت مدة الصلاحية',
    createdDate: '2024-12-20',
    createdBy: 'موظف المحاسبة',
    lastModified: '2025-01-06'
  },
  {
    id: 'INV-005',
    invoiceNumber: '2025-005',
    invoiceDate: '2025-01-08',
    dueDate: '2025-02-08',
    amount: 18000,
    paidAmount: 0,
    remainingAmount: 18000,
    paymentStatus: 'unpaid',
    invoiceStatus: 'cancelled',
    type: 'transaction',
    transactionId: 'TRX-2501004',
    transactionNumber: '2501004',
    transactionType: 'صناعي',
    ownerId: 'OWN-005',
    ownerName: 'عبدالرحمن سعد القحطاني',
    ownerIdNumber: '1067890123',
    licenseNumber: 'BLD-2025-004',
    licenseType: 'رخصة بناء',
    description: 'رسوم رخصة بناء - مستودع',
    notes: 'ملغاة بناءً على طلب العميل',
    cancelledDate: '2025-01-12',
    cancelledBy: 'مدير المحاسبة',
    cancelReason: 'إلغاء المعاملة من قبل العميل',
    createdDate: '2025-01-08',
    createdBy: 'موظف المحاسبة',
    lastModified: '2025-01-12'
  },
  {
    id: 'INV-006',
    invoiceNumber: '2025-006',
    invoiceDate: '2025-01-12',
    dueDate: '2025-02-12',
    amount: 22000,
    paidAmount: 22000,
    remainingAmount: 0,
    paymentStatus: 'paid',
    invoiceStatus: 'active',
    type: 'manual-external',
    ownerId: 'OWN-006',
    ownerName: 'منى خالد الشهري',
    ownerIdNumber: '1078901234',
    paymentMethod: 'sadad',
    paymentDate: '2025-01-18',
    paymentReference: 'SADAD-2025-001',
    paymentProofImage: 'proof-006.pdf',
    paidBy: 'منى خالد الشهري',
    description: 'رسوم معاملة خارجية - تعديل صك',
    notes: 'معاملة خارجية مع وزارة العدل',
    createdDate: '2025-01-12',
    createdBy: 'موظف المحاسبة',
    lastModified: '2025-01-18'
  }
];

const MOCK_PAYMENT_RECORDS: PaymentRecord[] = [
  {
    id: 'PAY-001',
    invoiceId: 'INV-001',
    amount: 15000,
    paymentDate: '2025-01-20',
    paymentMethod: 'bank-transfer',
    reference: 'TRF-20250120-001',
    proofImage: 'proof-001.pdf',
    paidBy: 'أحمد محمد العتيبي',
    notes: 'سداد كامل',
    recordedBy: 'موظف المحاسبة',
    recordedDate: '2025-01-20'
  },
  {
    id: 'PAY-002',
    invoiceId: 'INV-002',
    amount: 15000,
    paymentDate: '2025-01-15',
    paymentMethod: 'check',
    reference: 'CHK-001234',
    proofImage: 'proof-002.pdf',
    paidBy: 'فاطمة علي السليمان',
    notes: 'دفعة أولى',
    recordedBy: 'موظف المحاسبة',
    recordedDate: '2025-01-15'
  }
];

const MOCK_ALERTS: InvoiceAlert[] = [
  {
    id: 'ALT-001',
    invoiceId: 'INV-003',
    invoiceNumber: '2025-003',
    type: 'due-soon',
    daysRemaining: 5,
    amount: 12000,
    ownerName: 'خالد عبدالله المطيري',
    priority: 'high',
    sentDate: '2025-01-20',
    isRead: false
  },
  {
    id: 'ALT-002',
    invoiceId: 'INV-004',
    invoiceNumber: '2025-004',
    type: 'overdue',
    daysRemaining: -15,
    amount: 8000,
    ownerName: 'سارة محمد الدوسري',
    priority: 'high',
    sentDate: '2025-01-06',
    isRead: true
  }
];

// ===============================================
// المكون الرئيسي
// ===============================================

const TransactionInvoices_Complete_876: React.FC = () => {
  const [activeTab, setActiveTab] = useState('876-01');
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');

  // نموذج إضافة فاتورة
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    amount: '',
    type: 'transaction' as InvoiceType,
    transactionNumber: '',
    ownerName: '',
    ownerIdNumber: '',
    licenseNumber: '',
    description: '',
    notes: ''
  });

  // نموذج تسجيل سداد
  const [paymentFormData, setPaymentFormData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash' as PaymentMethod,
    reference: '',
    paidBy: '',
    notes: '',
    proofImage: null as File | null
  });

  // ===============================================
  // حسابات الإحصائيات
  // ===============================================

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.paymentStatus === 'paid').length;
  const unpaidInvoices = invoices.filter(inv => inv.paymentStatus === 'unpaid').length;
  const partialInvoices = invoices.filter(inv => inv.paymentStatus === 'partial').length;
  const expiredInvoices = invoices.filter(inv => inv.invoiceStatus === 'expired').length;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidTotal = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const remainingTotal = invoices.reduce((sum, inv) => sum + inv.remainingAmount, 0);
  const collectionRate = totalAmount > 0 ? (paidTotal / totalAmount) * 100 : 0;

  // ===============================================
  // الدوال
  // ===============================================

  const handleAddInvoice = () => {
    toast.success('تم إضافة الفاتورة بنجاح');
    setShowAddDialog(false);
    setFormData({
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      amount: '',
      type: 'transaction',
      transactionNumber: '',
      ownerName: '',
      ownerIdNumber: '',
      licenseNumber: '',
      description: '',
      notes: ''
    });
  };

  const handleRecordPayment = () => {
    toast.success('تم تسجيل السداد بنجاح');
    setShowPaymentDialog(false);
    setPaymentFormData({
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      reference: '',
      paidBy: '',
      notes: '',
      proofImage: null
    });
  };

  const handleCancelInvoice = (invoice: Invoice) => {
    toast.success(`تم إلغاء الفاتورة ${invoice.invoiceNumber}`);
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsDialog(true);
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      'paid': { label: 'مسددة', color: 'bg-green-100 text-green-800 border-green-300' },
      'partial': { label: 'مسددة جزئياً', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      'unpaid': { label: 'غير مسددة', color: 'bg-red-100 text-red-800 border-red-300' }
    };
    const config = statusConfig[status];
    return <Badge className={`${config.color} border`} style={{ fontFamily: 'Tajawal, sans-serif' }}>{config.label}</Badge>;
  };

  const getInvoiceStatusBadge = (status: InvoiceStatus) => {
    const statusConfig = {
      'active': { label: 'سارية', color: 'bg-blue-100 text-blue-800 border-blue-300' },
      'cancelled': { label: 'ملغاة', color: 'bg-gray-100 text-gray-800 border-gray-300' },
      'expired': { label: 'منتهية', color: 'bg-red-100 text-red-800 border-red-300' }
    };
    const config = statusConfig[status];
    return <Badge className={`${config.color} border`} style={{ fontFamily: 'Tajawal, sans-serif' }}>{config.label}</Badge>;
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    const methods = {
      'cash': 'نقدي',
      'bank-transfer': 'تحويل بنكي',
      'check': 'شيك',
      'credit-card': 'بطاقة ائتمان',
      'sadad': 'سداد',
      'mada': 'مدى'
    };
    return methods[method] || method;
  };

  // ===============================================
  // التابات
  // ===============================================

  const TABS_CONFIG: TabConfig[] = [
    { id: '876-01', number: '876-01', title: 'نظرة عامة', icon: TrendingUp },
    { id: '876-02', number: '876-02', title: 'قائمة الفواتير', icon: FileText },
    { id: '876-03', number: '876-03', title: 'حسب المعاملة', icon: Receipt },
    { id: '876-04', number: '876-04', title: 'حسب المالك', icon: Users },
    { id: '876-05', number: '876-05', title: 'حسب الرخصة', icon: Building },
    { id: '876-06', number: '876-06', title: 'إضافة فاتورة', icon: Plus },
    { id: '876-07', number: '876-07', title: 'الفواتير المسددة', icon: CheckCircle },
    { id: '876-08', number: '876-08', title: 'الفواتير المعلقة', icon: Clock },
    { id: '876-09', number: '876-09', title: 'الفواتير الملغاة', icon: XCircle },
    { id: '876-10', number: '876-10', title: 'التنبيهات', icon: Bell },
    { id: '876-11', number: '876-11', title: 'التقارير', icon: FileCheck },
    { id: '876-12', number: '876-12', title: 'الإعدادات', icon: Settings }
  ];

  // ===============================================
  // عرض التابات
  // ===============================================

  const renderTabContent = () => {
    switch (activeTab) {
      case '876-01':
        return renderOverviewTab();
      case '876-02':
        return renderInvoicesListTab();
      case '876-03':
        return renderByTransactionTab();
      case '876-04':
        return renderByOwnerTab();
      case '876-05':
        return renderByLicenseTab();
      case '876-06':
        return renderAddInvoiceTab();
      case '876-07':
        return renderPaidInvoicesTab();
      case '876-08':
        return renderPendingInvoicesTab();
      case '876-09':
        return renderCancelledInvoicesTab();
      case '876-10':
        return renderAlertsTab();
      case '876-11':
        return renderReportsTab();
      case '876-12':
        return renderSettingsTab();
      default:
        return <div>تاب غير معروف</div>;
    }
  };

  // ===============================================
  // التاب 876-01: نظرة عامة
  // ===============================================

  const renderOverviewTab = () => (
    <div className="space-y-4">
      {/* البطاقات الإحصائية */}
      <div className="stats-grid-8">
        {/* إجمالي الفواتير */}
        <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as any}>
          <CardContent className="dense-card-content-sm">
            <div className="stats-content-compact">
              <div className="stats-text-compact">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الفواتير</p>
                <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>{totalInvoices}</p>
              </div>
              <FileText className="stats-icon-compact text-[#2563eb] opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* مسددة */}
        <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as any}>
          <CardContent className="dense-card-content-sm">
            <div className="stats-content-compact">
              <div className="stats-text-compact">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مسددة</p>
                <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>{paidInvoices}</p>
              </div>
              <CheckCircle className="stats-icon-compact text-[#10b981] opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* غير مسددة */}
        <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fee2e2', '--bg-to': '#fecaca', '--border-color': '#fca5a5' } as any}>
          <CardContent className="dense-card-content-sm">
            <div className="stats-content-compact">
              <div className="stats-text-compact">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>غير مسددة</p>
                <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>{unpaidInvoices}</p>
              </div>
              <XCircle className="stats-icon-compact text-[#ef4444] opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* مسددة جزئياً */}
        <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as any}>
          <CardContent className="dense-card-content-sm">
            <div className="stats-content-compact">
              <div className="stats-text-compact">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>جزئياً</p>
                <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>{partialInvoices}</p>
              </div>
              <Clock className="stats-icon-compact text-[#f59e0b] opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* منتهية */}
        <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#f3e8ff', '--bg-to': '#e9d5ff', '--border-color': '#d8b4fe' } as any}>
          <CardContent className="dense-card-content-sm">
            <div className="stats-content-compact">
              <div className="stats-text-compact">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>منتهية</p>
                <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>{expiredInvoices}</p>
              </div>
              <AlertTriangle className="stats-icon-compact text-[#8b5cf6] opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* إجمالي المبالغ */}
        <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as any}>
          <CardContent className="dense-card-content-sm">
            <div className="stats-content-compact">
              <div className="stats-text-compact">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي المبالغ</p>
                <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>{totalAmount.toLocaleString()} ر.س</p>
              </div>
              <DollarSign className="stats-icon-compact text-[#2563eb] opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* المحصّل */}
        <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as any}>
          <CardContent className="dense-card-content-sm">
            <div className="stats-content-compact">
              <div className="stats-text-compact">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>المحصّل</p>
                <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>{paidTotal.toLocaleString()} ر.س</p>
              </div>
              <ArrowDownRight className="stats-icon-compact text-[#10b981] opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* المتبقي */}
        <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as any}>
          <CardContent className="dense-card-content-sm">
            <div className="stats-content-compact">
              <div className="stats-text-compact">
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>المتبقي</p>
                <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>{remainingTotal.toLocaleString()} ر.س</p>
              </div>
              <ArrowUpRight className="stats-icon-compact text-[#f59e0b] opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* نسبة التحصيل */}
      <Card className="card-rtl">
        <CardHeader className="dense-card-content">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>نسبة التحصيل</CardTitle>
        </CardHeader>
        <CardContent className="dense-card-content">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>المحصّل من الإجمالي</span>
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 'bold', color: collectionRate >= 70 ? '#10b981' : '#f59e0b' }}>
                {collectionRate.toFixed(1)}%
              </span>
            </div>
            <Progress value={collectionRate} className="h-3" />
            <div className="grid grid-cols-2 gap-3 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>محصّل: {paidTotal.toLocaleString()} ر.س</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>متبقي: {remainingTotal.toLocaleString()} ر.س</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* آخر الفواتير */}
      <Card className="card-rtl">
        <CardHeader className="dense-card-content">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>آخر الفواتير</CardTitle>
        </CardHeader>
        <CardContent className="dense-card-content">
          <Table className="table-rtl dense-table">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الفاتورة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المالك</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.slice(0, 5).map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.invoiceNumber}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.invoiceDate}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.ownerName}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.amount.toLocaleString()} ر.س</TableCell>
                  <TableCell className="text-right">{getStatusBadge(invoice.paymentStatus)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // ===============================================
  // التاب 876-02: قائمة الفواتير
  // ===============================================

  const renderInvoicesListTab = () => {
    const filteredInvoices = invoices.filter(invoice => {
      const matchesSearch = invoice.invoiceNumber.includes(searchTerm) || 
                           invoice.ownerName.includes(searchTerm) ||
                           (invoice.transactionNumber && invoice.transactionNumber.includes(searchTerm));
      const matchesStatus = filterStatus === 'all' || invoice.invoiceStatus === filterStatus;
      const matchesPayment = filterPayment === 'all' || invoice.paymentStatus === filterPayment;
      return matchesSearch && matchesStatus && matchesPayment;
    });

    return (
      <div className="space-y-4">
        {/* أدوات البحث والفلترة */}
        <Card className="card-rtl">
          <CardContent className="dense-card-content">
            <div className="grid grid-cols-4 gap-3">
              <InputWithCopy
                label="بحث"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="رقم الفاتورة، المالك، أو المعاملة"
                copyable={false}
                clearable={true}
              />
              <SelectWithCopy
                label="حالة الفاتورة"
                id="filter-status"
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: 'all', label: 'الكل' },
                  { value: 'active', label: 'سارية' },
                  { value: 'cancelled', label: 'ملغاة' },
                  { value: 'expired', label: 'منتهية' }
                ]}
                copyable={false}
                clearable={false}
              />
              <SelectWithCopy
                label="حالة السداد"
                id="filter-payment"
                value={filterPayment}
                onChange={setFilterPayment}
                options={[
                  { value: 'all', label: 'الكل' },
                  { value: 'paid', label: 'مسددة' },
                  { value: 'partial', label: 'جزئياً' },
                  { value: 'unpaid', label: 'غير مسددة' }
                ]}
                copyable={false}
                clearable={false}
              />
              <div className="flex items-end">
                <Button onClick={() => setShowAddDialog(true)} className="w-full">
                  <Plus className="h-4 w-4 ml-1" />
                  إضافة فاتورة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* جدول الفواتير */}
        <Card className="card-rtl">
          <CardHeader className="dense-card-content">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
              جميع الفواتير ({filteredInvoices.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="dense-card-content">
            <ScrollArea className="h-[500px]">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الفاتورة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاستحقاق</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المالك</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>حالة السداد</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>حالة الفاتورة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="text-right font-mono" style={{ fontFamily: 'Courier New, monospace' }}>{invoice.invoiceNumber}</TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.invoiceDate}</TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.dueDate}</TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.ownerName}</TableCell>
                      <TableCell className="text-right font-mono" style={{ fontFamily: 'Courier New, monospace' }}>{invoice.transactionNumber || '-'}</TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.amount.toLocaleString()} ر.س</TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.paidAmount.toLocaleString()} ر.س</TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.remainingAmount.toLocaleString()} ر.س</TableCell>
                      <TableCell className="text-right">{getStatusBadge(invoice.paymentStatus)}</TableCell>
                      <TableCell className="text-right">{getInvoiceStatusBadge(invoice.invoiceStatus)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="outline" onClick={() => handleViewDetails(invoice)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          {invoice.paymentStatus !== 'paid' && invoice.invoiceStatus === 'active' && (
                            <Button size="sm" variant="outline" onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowPaymentDialog(true);
                            }}>
                              <Wallet className="h-3 w-3" />
                            </Button>
                          )}
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

  // ===============================================
  // التابات الأخرى (عرض مبسط)
  // ===============================================

  const renderByTransactionTab = () => (
    <Card className="card-rtl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الفواتير حسب المعاملة</CardTitle>
        <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>عرض وتجميع الفواتير حسب رقم المعاملة</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>محتوى التاب قيد التطوير - سيتم عرض الفواتير مجمعة حسب المعاملة</p>
      </CardContent>
    </Card>
  );

  const renderByOwnerTab = () => (
    <Card className="card-rtl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الفواتير حسب المالك</CardTitle>
        <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>عرض وتجميع الفواتير حسب اسم المالك</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>محتوى التاب قيد التطوير - سيتم عرض الفواتير مجمعة حسب المالك</p>
      </CardContent>
    </Card>
  );

  const renderByLicenseTab = () => (
    <Card className="card-rtl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الفواتير حسب الرخصة</CardTitle>
        <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>عرض وتجميع الفواتير حسب رقم الرخصة</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>محتوى التاب قيد التطوير - سيتم عرض الفواتير مجمعة حسب الرخصة</p>
      </CardContent>
    </Card>
  );

  const renderAddInvoiceTab = () => (
    <Card className="card-rtl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة فاتورة جديدة</CardTitle>
        <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>إنشاء فاتورة جديدة مرتبطة بمعاملة أو يدوية</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SelectWithCopy
              label="نوع الفاتورة *"
              id="invoice-type"
              value={formData.type}
              onChange={(val) => setFormData({...formData, type: val as InvoiceType})}
              options={[
                { value: 'transaction', label: 'فاتورة معاملة' },
                { value: 'manual-internal', label: 'فاتورة يدوية - معاملة داخلية' },
                { value: 'manual-external', label: 'فاتورة يدوية - معاملة خارجية' }
              ]}
              required
            />
            <InputWithCopy
              label="رقم الفاتورة *"
              id="invoice-number"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
              placeholder="2025-XXX"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <InputWithCopy
              label="تاريخ الإصدار *"
              id="invoice-date"
              type="date"
              value={formData.invoiceDate}
              onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})}
              required
            />
            <InputWithCopy
              label="تاريخ الاستحقاق *"
              id="due-date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              required
            />
            <InputWithCopy
              label="المبلغ (ر.س) *"
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="0.00"
              required
            />
          </div>

          {formData.type === 'transaction' && (
            <InputWithCopy
              label="رقم المعاملة *"
              id="transaction-number"
              value={formData.transactionNumber}
              onChange={(e) => setFormData({...formData, transactionNumber: e.target.value})}
              placeholder="2501XXX"
              required
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <InputWithCopy
              label="اسم المالك *"
              id="owner-name"
              value={formData.ownerName}
              onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
              required
            />
            <InputWithCopy
              label="رقم الهوية *"
              id="owner-id"
              value={formData.ownerIdNumber}
              onChange={(e) => setFormData({...formData, ownerIdNumber: e.target.value})}
              placeholder="10XXXXXXXX"
              required
            />
          </div>

          <InputWithCopy
            label="رقم الرخصة (اختياري)"
            id="license-number"
            value={formData.licenseNumber}
            onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
            placeholder="BLD-2025-XXX"
          />

          <TextAreaWithCopy
            label="الوصف *"
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            required
          />

          <TextAreaWithCopy
            label="ملاحظات"
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows={2}
          />

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setFormData({
              invoiceNumber: '',
              invoiceDate: new Date().toISOString().split('T')[0],
              dueDate: '',
              amount: '',
              type: 'transaction',
              transactionNumber: '',
              ownerName: '',
              ownerIdNumber: '',
              licenseNumber: '',
              description: '',
              notes: ''
            })}>
              إلغاء
            </Button>
            <Button onClick={handleAddInvoice}>
              <Plus className="h-4 w-4 ml-1" />
              إضافة الفاتورة
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPaidInvoicesTab = () => {
    const paidInvoicesList = invoices.filter(inv => inv.paymentStatus === 'paid');
    return (
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الفواتير المسددة ({paidInvoicesList.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="table-rtl dense-table">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الفاتورة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المالك</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>طريقة السداد</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ السداد</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paidInvoicesList.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="text-right font-mono" style={{ fontFamily: 'Courier New, monospace' }}>{invoice.invoiceNumber}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.ownerName}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.amount.toLocaleString()} ر.س</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.paymentMethod ? getPaymentMethodLabel(invoice.paymentMethod) : '-'}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.paymentDate || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(invoice)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderPendingInvoicesTab = () => {
    const pendingInvoicesList = invoices.filter(inv => inv.paymentStatus === 'unpaid' || inv.paymentStatus === 'partial');
    return (
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الفواتير المعلقة ({pendingInvoicesList.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="table-rtl dense-table">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الفاتورة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المالك</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الاستحقاق</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingInvoicesList.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="text-right font-mono" style={{ fontFamily: 'Courier New, monospace' }}>{invoice.invoiceNumber}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.ownerName}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.amount.toLocaleString()} ر.س</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.remainingAmount.toLocaleString()} ر.س</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.dueDate}</TableCell>
                  <TableCell className="text-right">{getStatusBadge(invoice.paymentStatus)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(invoice)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowPaymentDialog(true);
                      }}>
                        <Wallet className="h-3 w-3 ml-1" />
                        سداد
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderCancelledInvoicesTab = () => {
    const cancelledInvoicesList = invoices.filter(inv => inv.invoiceStatus === 'cancelled');
    return (
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الفواتير المل��اة ({cancelledInvoicesList.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="table-rtl dense-table">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الفاتورة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المالك</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الإلغاء</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>السبب</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cancelledInvoicesList.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="text-right font-mono" style={{ fontFamily: 'Courier New, monospace' }}>{invoice.invoiceNumber}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.ownerName}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.amount.toLocaleString()} ر.س</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.cancelledDate || '-'}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{invoice.cancelReason || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(invoice)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderAlertsTab = () => (
    <Card className="card-rtl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>التنبيهات ({MOCK_ALERTS.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {MOCK_ALERTS.map((alert) => (
            <Card key={alert.id} className={`border-2 ${alert.isRead ? 'border-gray-200' : 'border-red-300'}`}>
              <CardContent className="dense-card-content">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className={`h-4 w-4 ${alert.isRead ? 'text-gray-400' : 'text-red-500'}`} />
                      <span className="font-mono" style={{ fontFamily: 'Courier New, monospace', fontSize: '14px' }}>{alert.invoiceNumber}</span>
                      <Badge className={alert.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                        {alert.priority === 'high' ? 'عاجل' : 'متوسط'}
                      </Badge>
                    </div>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', marginBottom: '8px' }}>
                      {alert.ownerName} - {alert.amount.toLocaleString()} ر.س
                    </p>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>
                      {alert.type === 'due-soon' && `تستحق خلال ${alert.daysRemaining} أيام`}
                      {alert.type === 'overdue' && `متأخرة ${Math.abs(alert.daysRemaining)} يوم`}
                      {alert.type === 'expired' && 'منتهية الصلاحية'}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    عرض
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderReportsTab = () => (
    <Card className="card-rtl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>التقارير</CardTitle>
        <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>تقارير شاملة عن الفواتير والمحصلات</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <FileCheck className="h-5 w-5" />
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير الفواتير الشامل</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <DollarSign className="h-5 w-5" />
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير المحصلات</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <Clock className="h-5 w-5" />
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير المتأخرات</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <Users className="h-5 w-5" />
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير حسب المالك</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSettingsTab = () => (
    <Card className="card-rtl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الإعدادات</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 'bold' }}>إعدادات التنبيهات</h3>
            <EnhancedSwitch
              id="alert-due-soon"
              checked={true}
              label="تنبيه قبل الاستحقاق"
              description="إرسال تنبيه قبل تاريخ استحقاق الفاتورة"
            />
            <EnhancedSwitch
              id="alert-overdue"
              checked={true}
              label="تنبيه عند التأخر"
              description="إرسال تنبيه عند تجاوز تاريخ الاستحقاق"
            />
            <InputWithCopy
              label="أيام التنبيه المسبق"
              id="alert-days"
              type="number"
              value="7"
              placeholder="7"
            />
          </div>

          <div className="space-y-3">
            <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 'bold' }}>إعدادات الصلاحية</h3>
            <InputWithCopy
              label="مدة صلاحية الفاتورة (أيام)"
              id="validity-days"
              type="number"
              value="30"
              placeholder="30"
            />
            <EnhancedSwitch
              id="auto-expire"
              checked={true}
              label="إلغاء تلقائي عند انتهاء الصلاحية"
              description="إلغاء الفاتورة تلقائياً عند تجاوز مدة الصلاحية"
            />
          </div>

          <div className="flex justify-end">
            <Button>
              <Settings className="h-4 w-4 ml-1" />
              حفظ الإعدادات
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // ===============================================
  // النوافذ المنبثقة
  // ===============================================

  // نافذة تسجيل سداد
  const PaymentDialog = () => (
    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
      <DialogContent className="max-w-2xl dialog-rtl">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تسجيل سداد</DialogTitle>
          <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {selectedInvoice && `الفاتورة: ${selectedInvoice.invoiceNumber} - المبلغ المتبقي: ${selectedInvoice.remainingAmount.toLocaleString()} ر.س`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputWithCopy
              label="المبلغ المدفوع (ر.س) *"
              id="payment-amount"
              type="number"
              value={paymentFormData.amount}
              onChange={(e) => setPaymentFormData({...paymentFormData, amount: e.target.value})}
              placeholder="0.00"
              required
            />
            <InputWithCopy
              label="تاريخ السداد *"
              id="payment-date"
              type="date"
              value={paymentFormData.paymentDate}
              onChange={(e) => setPaymentFormData({...paymentFormData, paymentDate: e.target.value})}
              required
            />
          </div>

          <SelectWithCopy
            label="طريقة السداد *"
            id="payment-method"
            value={paymentFormData.paymentMethod}
            onChange={(val) => setPaymentFormData({...paymentFormData, paymentMethod: val as PaymentMethod})}
            options={[
              { value: 'cash', label: 'نقدي' },
              { value: 'bank-transfer', label: 'تحويل بنكي' },
              { value: 'check', label: 'شيك' },
              { value: 'credit-card', label: 'بطاقة ائتمان' },
              { value: 'sadad', label: 'سداد' },
              { value: 'mada', label: 'مدى' }
            ]}
            required
          />

          <InputWithCopy
            label="الرقم المرجعي"
            id="payment-reference"
            value={paymentFormData.reference}
            onChange={(e) => setPaymentFormData({...paymentFormData, reference: e.target.value})}
            placeholder="رقم الشيك، رقم المرجع، إلخ"
          />

          <InputWithCopy
            label="اسم الدافع *"
            id="paid-by"
            value={paymentFormData.paidBy}
            onChange={(e) => setPaymentFormData({...paymentFormData, paidBy: e.target.value})}
            required
          />

          <div className="space-y-2">
            <label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 'bold' }}>
              صورة مستند السداد
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setPaymentFormData({...paymentFormData, proofImage: e.target.files?.[0] || null})}
                className="hidden"
                id="payment-proof"
              />
              <label htmlFor="payment-proof" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', color: '#6b7280' }}>
                  اضغط لرفع الصورة أو PDF
                </p>
                {paymentFormData.proofImage && (
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#10b981', marginTop: '8px' }}>
                    تم اختيار: {paymentFormData.proofImage.name}
                  </p>
                )}
              </label>
            </div>
          </div>

          <TextAreaWithCopy
            label="ملاحظات"
            id="payment-notes"
            value={paymentFormData.notes}
            onChange={(e) => setPaymentFormData({...paymentFormData, notes: e.target.value})}
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
            إلغاء
          </Button>
          <Button onClick={handleRecordPayment}>
            <Wallet className="h-4 w-4 ml-1" />
            تسجيل السداد
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // نافذة التفاصيل
  const DetailsDialog = () => (
    <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
      <DialogContent className="max-w-4xl dialog-rtl">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل الفاتورة</DialogTitle>
        </DialogHeader>
        
        {selectedInvoice && (
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {/* معلومات أساسية */}
              <Card>
                <CardHeader className="dense-card-content">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>معلومات الفاتورة</CardTitle>
                </CardHeader>
                <CardContent className="dense-card-content">
                  <div className="grid grid-cols-2 gap-3 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <div><span className="text-gray-500">رقم الفاتورة:</span> <span className="font-mono">{selectedInvoice.invoiceNumber}</span></div>
                    <div><span className="text-gray-500">تاريخ الإصدار:</span> {selectedInvoice.invoiceDate}</div>
                    <div><span className="text-gray-500">تاريخ الاستحقاق:</span> {selectedInvoice.dueDate}</div>
                    <div><span className="text-gray-500">النوع:</span> {selectedInvoice.type === 'transaction' ? 'فاتورة معاملة' : selectedInvoice.type === 'manual-internal' ? 'يدوية داخلية' : 'يدوية خارجية'}</div>
                  </div>
                </CardContent>
              </Card>

              {/* معلومات المالك */}
              <Card>
                <CardHeader className="dense-card-content">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>معلومات المالك</CardTitle>
                </CardHeader>
                <CardContent className="dense-card-content">
                  <div className="grid grid-cols-2 gap-3 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <div><span className="text-gray-500">الاسم:</span> {selectedInvoice.ownerName}</div>
                    <div><span className="text-gray-500">رقم الهوية:</span> <span className="font-mono">{selectedInvoice.ownerIdNumber}</span></div>
                  </div>
                </CardContent>
              </Card>

              {/* المبالغ */}
              <Card>
                <CardHeader className="dense-card-content">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>المبالغ</CardTitle>
                </CardHeader>
                <CardContent className="dense-card-content">
                  <div className="grid grid-cols-3 gap-3 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <div><span className="text-gray-500">المبلغ الإجمالي:</span> <span className="font-bold">{selectedInvoice.amount.toLocaleString()} ر.س</span></div>
                    <div><span className="text-gray-500">المدفوع:</span> <span className="text-green-600 font-bold">{selectedInvoice.paidAmount.toLocaleString()} ر.س</span></div>
                    <div><span className="text-gray-500">المتبقي:</span> <span className="text-red-600 font-bold">{selectedInvoice.remainingAmount.toLocaleString()} ر.س</span></div>
                  </div>
                  {selectedInvoice.paidAmount > 0 && (
                    <div className="mt-3">
                      <Progress value={(selectedInvoice.paidAmount / selectedInvoice.amount) * 100} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* معلومات السداد */}
              {selectedInvoice.paymentStatus !== 'unpaid' && (
                <Card>
                  <CardHeader className="dense-card-content">
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>معلومات السداد</CardTitle>
                  </CardHeader>
                  <CardContent className="dense-card-content">
                    <div className="grid grid-cols-2 gap-3 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <div><span className="text-gray-500">طريقة السداد:</span> {selectedInvoice.paymentMethod ? getPaymentMethodLabel(selectedInvoice.paymentMethod) : '-'}</div>
                      <div><span className="text-gray-500">تاريخ السداد:</span> {selectedInvoice.paymentDate || '-'}</div>
                      <div><span className="text-gray-500">الرقم المرجعي:</span> <span className="font-mono">{selectedInvoice.paymentReference || '-'}</span></div>
                      <div><span className="text-gray-500">اسم الدافع:</span> {selectedInvoice.paidBy || '-'}</div>
                    </div>
                    {selectedInvoice.paymentProofImage && (
                      <div className="mt-3">
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 ml-1" />
                          تحميل مستند السداد
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* الوصف والملاحظات */}
              <Card>
                <CardHeader className="dense-card-content">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>الوصف والملاحظات</CardTitle>
                </CardHeader>
                <CardContent className="dense-card-content">
                  <div className="space-y-2 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <div><span className="text-gray-500">الوصف:</span> {selectedInvoice.description}</div>
                    {selectedInvoice.notes && <div><span className="text-gray-500">ملاحظات:</span> {selectedInvoice.notes}</div>}
                  </div>
                </CardContent>
              </Card>

              {/* معلومات الإلغاء (إن وجدت) */}
              {selectedInvoice.invoiceStatus === 'cancelled' && (
                <Card className="border-red-300">
                  <CardHeader className="dense-card-content">
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', color: '#ef4444' }}>معلومات الإلغاء</CardTitle>
                  </CardHeader>
                  <CardContent className="dense-card-content">
                    <div className="grid grid-cols-2 gap-3 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <div><span className="text-gray-500">تاريخ الإلغاء:</span> {selectedInvoice.cancelledDate}</div>
                      <div><span className="text-gray-500">بواسطة:</span> {selectedInvoice.cancelledBy}</div>
                      <div className="col-span-2"><span className="text-gray-500">السبب:</span> {selectedInvoice.cancelReason}</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
            إغلاق
          </Button>
          <Button>
            <Download className="h-4 w-4 ml-1" />
            طباعة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // ===============================================
  // العرض الرئيسي
  // ===============================================

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
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
              <Receipt 
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
                  فواتير المعاملات
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
                    876
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
                استعراض وإدارة جميع فواتير المعاملات مع متابعة السداد
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
                12 تبويبات
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
        
        {/* محتوى التاب */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', paddingRight: '16px' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* النوافذ المنبثقة */}
      <PaymentDialog />
      <DetailsDialog />
    </div>
  );
};

export default TransactionInvoices_Complete_876;
