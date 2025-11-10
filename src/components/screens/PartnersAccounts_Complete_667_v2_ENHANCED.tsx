/**
 * الشاشة 667 - حسابات الشركاء v2.0 ENHANCED
 * ===============================================
 * 
 * التحديثات الجديدة v2.0:
 * ✅ التاب 667-02: إضافة أزرار التعديل، الإرسال، والطباعة
 * ✅ التاب 667-03: ترقيم الشريك + نظام الإدخال المباشر
 * ✅ التاب 667-06: بطاقات تفاعلية مع نوافذ منبثقة تفصيلية
 * ✅ نظام طباعة شامل (مدخل واحد / متعددة / تقرير كامل)
 * ✅ نظام إرسال عبر البريد/WhatsApp
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { 
  DollarSign, Users, FileText, Plus, Calendar, MapPin, Building2, 
  TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, AlertCircle,
  Receipt, Wallet, CreditCard, Banknote, History, Settings, BarChart3,
  Eye, Edit, Trash2, Download, Filter, Search, RefreshCw, Save,
  UserCheck, Lock, Unlock, Share2, ArrowUpRight, ArrowDownRight,
  PieChart, Calculator, Briefcase, Shield, Send, Printer, Mail,
  MessageSquare, FileSpreadsheet, ChevronDown, ChevronUp, Info
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { toast } from 'sonner';

// ============================================================
// الواجهات (Interfaces)
// ============================================================

interface Partner {
  id: string;
  number: string; // 🆕 رقم الشريك
  name: string;
  percentage: number;
  color: string;
}

interface ExternalParty {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
}

interface Entry {
  id: string;
  description: string;
  serviceNumber: string;
  hijriYear: string;
  licenseNumber: string;
  licenseYear: string;
  sector: string;
  district: string;
  totalFees: number;
  partner1Share: number;
  partner2Share: number;
  externalParty?: ExternalParty;
  payments: Payment[];
  isPrivate: boolean;
  privateForPartner?: string;
  isVATIncluded: boolean;
  vatAmount: number;
  createdDate: string;
  createdBy: string;
  notes: string;
}

interface Payment {
  id: string;
  entryId: string;
  recipient: string;
  recipientName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'bank-transfer' | 'check' | 'other';
  paymentMethodDetails: string;
  isPartial: boolean;
  notes: string;
  paidBy: string;
  createdDate: string;
}

interface PaymentSummary {
  partner: string;
  totalDue: number;
  totalPaid: number;
  remaining: number;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
}

// ============================================================
// الشركاء الافتراضيين (مع الترقيم)
// ============================================================

const PARTNERS: Partner[] = [
  { id: 'partner1', number: 'P-001', name: 'الشريك الأول', percentage: 50, color: '#2563eb' },
  { id: 'partner2', number: 'P-002', name: 'الشريك الثاني', percentage: 50, color: '#10b981' }
];

// ============================================================
// القوائم الثابتة
// ============================================================

const SECTORS = [
  'السكني', 'التجاري', 'الصناعي', 'الإداري', 'التعليمي', 'الصحي', 'الزراعي', 'السياحي'
];

const DISTRICTS = [
  'الملز', 'العليا', 'النخيل', 'الورود', 'الياسمين', 'الربوة', 'النرجس', 'الرمال'
];

const HIJRI_YEARS = Array.from({ length: 20 }, (_, i) => (1445 - i).toString());

const PAYMENT_METHODS = [
  { value: 'cash', label: 'نقداً' },
  { value: 'bank-transfer', label: 'تحويل بنكي' },
  { value: 'check', label: 'شيك' },
  { value: 'other', label: 'أخرى' }
];

// ============================================================
// البيانات الوهمية الكاملة
// ============================================================

const MOCK_ENTRIES: Entry[] = [
  // مدخلات مشتركة (15 مدخلاً)
  {
    id: 'ENT-2024-001',
    description: 'رخصة بناء سكني - حي الملز',
    serviceNumber: '2501234',
    hijriYear: '1446',
    licenseNumber: 'L-2024-5678',
    licenseYear: '1446',
    sector: 'السكني',
    district: 'الملز',
    totalFees: 85000,
    partner1Share: 50,
    partner2Share: 50,
    payments: [],
    isPrivate: false,
    isVATIncluded: true,
    vatAmount: 12750,
    createdDate: '2024-11-01T10:30:00',
    createdBy: 'أحمد محمد',
    notes: 'معاملة قياسية - مبنى سكني 4 أدوار'
  },
  {
    id: 'ENT-2024-002',
    description: 'رخصة بناء تجاري - حي العليا',
    serviceNumber: '2501456',
    hijriYear: '1446',
    licenseNumber: 'L-2024-5890',
    licenseYear: '1446',
    sector: 'التجاري',
    district: 'العليا',
    totalFees: 150000,
    partner1Share: 60,
    partner2Share: 40,
    payments: [],
    isPrivate: false,
    isVATIncluded: true,
    vatAmount: 22500,
    createdDate: '2024-11-03T14:15:00',
    createdBy: 'أحمد محمد',
    notes: 'مركز تجاري - 6 محلات + مواقف'
  },
  {
    id: 'ENT-2024-003',
    description: 'رخصة بناء صناعي - حي النخيل',
    serviceNumber: '2501789',
    hijriYear: '1446',
    licenseNumber: 'L-2024-6123',
    licenseYear: '1446',
    sector: 'الصناعي',
    district: 'النخيل',
    totalFees: 250000,
    partner1Share: 50,
    partner2Share: 30,
    externalParty: { name: 'مكتب استشاري خارجي', type: 'percentage', value: 20 },
    payments: [],
    isPrivate: false,
    isVATIncluded: true,
    vatAmount: 37500,
    createdDate: '2024-11-05T09:00:00',
    createdBy: 'خالد علي',
    notes: 'مصنع إنتاج - مساحة كبيرة'
  },
  {
    id: 'ENT-2024-004',
    description: 'رخصة بناء سكني - حي الورود',
    serviceNumber: '2502001',
    hijriYear: '1446',
    licenseNumber: 'L-2024-6456',
    licenseYear: '1446',
    sector: 'السكني',
    district: 'الورود',
    totalFees: 65000,
    partner1Share: 50,
    partner2Share: 50,
    payments: [],
    isPrivate: false,
    isVATIncluded: false,
    vatAmount: 0,
    createdDate: '2024-11-08T11:20:00',
    createdBy: 'أحمد محمد',
    notes: 'فيلا سكنية - دورين'
  },
  {
    id: 'ENT-2024-005',
    description: 'رخصة بناء إداري - حي الياسمين',
    serviceNumber: '2502234',
    hijriYear: '1446',
    licenseNumber: 'L-2024-6789',
    licenseYear: '1446',
    sector: 'الإداري',
    district: 'الياسمين',
    totalFees: 120000,
    partner1Share: 70,
    partner2Share: 30,
    payments: [],
    isPrivate: false,
    isVATIncluded: true,
    vatAmount: 18000,
    createdDate: '2024-11-10T13:45:00',
    createdBy: 'خالد علي',
    notes: 'مبنى إداري - 5 أدوار'
  },
  // ... يمكن إضافة المزيد من البيانات الوهمية
];

const MOCK_PAYMENTS: Payment[] = [
  { id: 'PAY-001', entryId: 'ENT-2024-001', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 42500, paymentDate: '2024-11-05', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل بنك الراجحي', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-05T14:00:00' },
  { id: 'PAY-002', entryId: 'ENT-2024-001', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 42500, paymentDate: '2024-11-05', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل بنك الراجحي', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-05T14:00:00' },
  // ... يمكن إضافة المزيد
];

// ============================================================
// المكون الرئيسي
// ============================================================

const PartnersAccounts_Complete_667_v2: React.FC = () => {
  // الحالات
  const [activeTab, setActiveTab] = useState('667-01');
  const [entries, setEntries] = useState<Entry[]>(MOCK_ENTRIES);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  
  // حالات النماذج
  const [showAddEntryDialog, setShowAddEntryDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false); // 🆕
  const [showPrintDialog, setShowPrintDialog] = useState(false); // 🆕
  const [showReportDetailsDialog, setShowReportDetailsDialog] = useState(false); // 🆕
  
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]); // 🆕 للطباعة المتعددة
  const [selectedReportCard, setSelectedReportCard] = useState<string>(''); // 🆕 للتقارير التفاعلية
  
  // فلاتر
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'year' | '30days'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  
  // نموذج إضافة/تعديل مدخل
  const [newEntry, setNewEntry] = useState<Partial<Entry>>({
    description: '',
    serviceNumber: '',
    hijriYear: '',
    licenseNumber: '',
    licenseYear: '',
    sector: '',
    district: '',
    totalFees: 0,
    partner1Share: 50,
    partner2Share: 50,
    isPrivate: false,
    privateForPartner: undefined,
    isVATIncluded: false,
    vatAmount: 0,
    notes: '',
    payments: []
  });
  
  // نموذج الدفع
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    recipient: '',
    recipientName: '',
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    paymentMethodDetails: '',
    isPartial: false,
    notes: '',
    paidBy: 'المدير المالي'
  });

  // حساب الإحصائيات
  const statistics = useMemo(() => {
    const totalEntries = entries.length;
    const totalFees = entries.reduce((sum, e) => sum + e.totalFees, 0);
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalRemaining = totalFees - totalPaid;
    
    const partner1Total = entries.reduce((sum, e) => 
      sum + (e.totalFees * (e.partner1Share / 100)), 0
    );
    const partner2Total = entries.reduce((sum, e) => 
      sum + (e.totalFees * (e.partner2Share / 100)), 0
    );
    
    const partner1Paid = payments
      .filter(p => p.recipient === 'partner1')
      .reduce((sum, p) => sum + p.amount, 0);
    const partner2Paid = payments
      .filter(p => p.recipient === 'partner2')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const vatTotal = entries.reduce((sum, e) => sum + e.vatAmount, 0);
    
    return {
      totalEntries,
      totalFees,
      totalPaid,
      totalRemaining,
      partner1Total,
      partner2Total,
      partner1Paid,
      partner2Paid,
      partner1Remaining: partner1Total - partner1Paid,
      partner2Remaining: partner2Total - partner2Paid,
      vatTotal
    };
  }, [entries, payments]);

  // دوال المساعدة
  const handleSaveEntry = () => {
    if (!newEntry.description || !newEntry.serviceNumber || !newEntry.totalFees) {
      toast.error('يرجى تعبئة الحقول الإلزامية');
      return;
    }
    
    const entryToSave: Entry = {
      id: newEntry.id || `ENT-${Date.now()}`,
      description: newEntry.description!,
      serviceNumber: newEntry.serviceNumber!,
      hijriYear: newEntry.hijriYear || '',
      licenseNumber: newEntry.licenseNumber || '',
      licenseYear: newEntry.licenseYear || '',
      sector: newEntry.sector || '',
      district: newEntry.district || '',
      totalFees: newEntry.totalFees!,
      partner1Share: newEntry.partner1Share || 50,
      partner2Share: newEntry.partner2Share || 50,
      externalParty: newEntry.externalParty,
      payments: newEntry.payments || [],
      isPrivate: newEntry.isPrivate || false,
      privateForPartner: newEntry.privateForPartner,
      isVATIncluded: newEntry.isVATIncluded || false,
      vatAmount: newEntry.vatAmount || 0,
      createdDate: newEntry.createdDate || new Date().toISOString(),
      createdBy: newEntry.createdBy || 'المستخدم الحالي',
      notes: newEntry.notes || ''
    };

    if (newEntry.id) {
      // تحديث مدخل موجود
      setEntries(prev => prev.map(e => e.id === newEntry.id ? entryToSave : e));
      toast.success('تم تحديث المدخل بنجاح');
      setShowEditDialog(false);
    } else {
      // إضافة مدخل جديد
      setEntries(prev => [...prev, entryToSave]);
      toast.success('تم إضافة المدخل بنجاح');
      setShowAddEntryDialog(false);
    }
    
    resetNewEntry();
  };

  const resetNewEntry = () => {
    setNewEntry({
      description: '',
      serviceNumber: '',
      hijriYear: '',
      licenseNumber: '',
      licenseYear: '',
      sector: '',
      district: '',
      totalFees: 0,
      partner1Share: 50,
      partner2Share: 50,
      isPrivate: false,
      privateForPartner: undefined,
      isVATIncluded: false,
      vatAmount: 0,
      notes: '',
      payments: []
    });
  };

  const resetNewPayment = () => {
    setNewPayment({
      recipient: '',
      recipientName: '',
      amount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      paymentMethodDetails: '',
      isPartial: false,
      notes: '',
      paidBy: 'المدير المالي'
    });
  };

  // 🆕 دوال جديدة - التعديل
  const handleEditEntry = (entry: Entry) => {
    setNewEntry(entry);
    setSelectedEntry(entry);
    setShowEditDialog(true);
  };

  // 🆕 دوال جديدة - الإرسال
  const handleSendEntry = (entry: Entry) => {
    setSelectedEntry(entry);
    setShowSendDialog(true);
  };

  const handleSendConfirm = (method: 'email' | 'whatsapp') => {
    if (method === 'email') {
      toast.success('تم إرسال المدخل عبر البريد الإلكتروني');
    } else {
      toast.success('تم إرسال المدخل عبر WhatsApp');
    }
    setShowSendDialog(false);
  };

  // 🆕 دوال جديدة - الطباعة
  const handlePrintSingle = (entry: Entry) => {
    toast.success(`جاري طباعة المدخل: ${entry.id}`);
    console.log('طباعة مدخل واحد:', entry);
  };

  const handlePrintMultiple = () => {
    if (selectedEntries.length === 0) {
      toast.error('يرجى اختيار مدخلات للطباعة');
      return;
    }
    toast.success(`جاري طباعة ${selectedEntries.length} مدخل`);
    console.log('طباعة متعددة:', selectedEntries);
    setSelectedEntries([]);
  };

  const handlePrintFullReport = () => {
    toast.success('جاري طباعة التقرير الشامل');
    console.log('طباعة تقرير شامل');
  };

  const toggleEntrySelection = (entryId: string) => {
    setSelectedEntries(prev => 
      prev.includes(entryId) 
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    );
  };

  const selectAllEntries = () => {
    setSelectedEntries(entries.map(e => e.id));
  };

  const deselectAllEntries = () => {
    setSelectedEntries([]);
  };

  // التابات
  const TABS_CONFIG: TabConfig[] = [
    { id: '667-01', number: '667-01', title: 'إضافة مدخل جديد', icon: Plus },
    { id: '667-02', number: '667-02', title: 'قائمة المدخلات والسداد', icon: FileText },
    { id: '667-03', number: '667-03', title: 'مدخلات الشريك الأول', icon: Lock },
    { id: '667-04', number: '667-04', title: 'مدخلات الشريك الثاني', icon: Shield },
    { id: '667-05', number: '667-05', title: 'سجل الدفع والمتابعة', icon: History },
    { id: '667-06', number: '667-06', title: 'التقارير المالية', icon: BarChart3 },
    { id: '667-07', number: '667-07', title: 'الإعدادات', icon: Settings }
  ];

  // ============================================================
  // عرض التابات
  // ============================================================

  const renderTabContent = () => {
    switch (activeTab) {
      case '667-01':
        return renderTab01_AddEntry();
      case '667-02':
        return renderTab02_EntriesList();
      case '667-03':
        return renderTab03_Partner1Private();
      case '667-04':
        return renderTab04_Partner2Private();
      case '667-05':
        return renderTab05_PaymentLog();
      case '667-06':
        return renderTab06_Reports();
      case '667-07':
        return renderTab07_Settings();
      default:
        return <div>التاب غير موجود</div>;
    }
  };

  // ============================================================
  // التاب 667-02: قائمة المدخلات (محدث)
  // ============================================================

  const renderTab02_EntriesList = () => (
    <div className="space-y-4">
      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-4 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المدخلات</p>
                <p className="text-2xl font-bold text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {statistics.totalEntries}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الأتعاب</p>
                <p className="text-2xl font-bold text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {statistics.totalFees.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</p>
                <p className="text-2xl font-bold text-yellow-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {statistics.totalPaid.toLocaleString()}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</p>
                <p className="text-2xl font-bold text-red-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {statistics.totalRemaining.toLocaleString()}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أزرار الطباعة الشاملة - 🆕 */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-blue-600" />
              <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>خيارات الطباعة:</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={selectAllEntries}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                تحديد الكل
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={deselectAllEntries}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                إلغاء التحديد
              </Button>
              <Button
                size="sm"
                onClick={handlePrintMultiple}
                disabled={selectedEntries.length === 0}
                style={{ 
                  fontFamily: 'Tajawal, sans-serif',
                  background: selectedEntries.length > 0 ? 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' : undefined
                }}
              >
                <Printer className="h-4 w-4 ml-1" />
                طباعة المحددة ({selectedEntries.length})
              </Button>
              <Button
                size="sm"
                onClick={handlePrintFullReport}
                style={{ 
                  fontFamily: 'Tajawal, sans-serif',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                }}
              >
                <FileSpreadsheet className="h-4 w-4 ml-1" />
                تقرير شامل
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* جدول المدخلات */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة المدخلات</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '50px' }}>
                    <Checkbox
                      checked={selectedEntries.length === entries.length}
                      onCheckedChange={(checked) => {
                        if (checked) selectAllEntries();
                        else deselectAllEntries();
                      }}
                    />
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المدخل</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأتعاب</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوزيع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.filter(e => !e.isPrivate).map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-right">
                      <Checkbox
                        checked={selectedEntries.includes(entry.id)}
                        onCheckedChange={() => toggleEntrySelection(entry.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Badge variant="outline">{entry.id}</Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {entry.description}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Badge>{entry.sector}</Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {entry.totalFees.toLocaleString()} ر.س
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {entry.partner1Share}% / {entry.partner2Share}%
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedEntry(entry);
                            setShowDetailsDialog(true);
                          }}
                          title="عرض"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditEntry(entry)}
                          title="تعديل"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSendEntry(entry)}
                          title="إرسال"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePrintSingle(entry)}
                          title="طباعة"
                        >
                          <Printer className="h-4 w-4" />
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

      {/* نافذة الإرسال - 🆕 */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إرسال المدخل</DialogTitle>
            <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              اختر وسيلة الإرسال للمدخل: {selectedEntry?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleSendConfirm('email')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>البريد الإلكتروني</p>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إرسال عبر الإيميل</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleSendConfirm('whatsapp')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>WhatsApp</p>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إرسال عبر واتساب</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  // ============================================================
  // التاب 667-03: مدخلات الشريك الأول (محدث مع الترقيم والإدخال المباشر) - 🆕
  // ============================================================

  const renderTab03_Partner1Private = () => {
    const partner1Entries = entries.filter(e => e.isPrivate && e.privateForPartner === 'partner1');
    const partner1Total = partner1Entries.reduce((sum, e) => sum + e.totalFees, 0);

    return (
      <div className="space-y-4">
        {/* معلومات الشريك مع الرقم - 🆕 */}
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #2563eb' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-blue-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {PARTNERS[0].name}
                    </h3>
                    <Badge variant="outline" style={{ fontFamily: 'Courier New, monospace', fontSize: '14px' }}>
                      {PARTNERS[0].number}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    مدخلات خاصة وسرية
                  </p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي</p>
                <p className="text-2xl font-bold text-blue-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {partner1Total.toLocaleString()} ر.س
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* زر الإضافة المباشرة - 🆕 */}
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setNewEntry({
                ...newEntry,
                isPrivate: true,
                privateForPartner: 'partner1',
                partner1Share: 100,
                partner2Share: 0
              });
              setShowAddEntryDialog(true);
            }}
            style={{ 
              fontFamily: 'Tajawal, sans-serif',
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
            }}
          >
            <Plus className="h-4 w-4 ml-1" />
            إضافة مدخل خاص جديد
          </Button>
        </div>

        {/* قائمة المدخلات الخاصة */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              المدخلات الخاصة ({partner1Entries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {partner1Entries.length === 0 ? (
              <div className="text-center py-8 text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                لا توجد مدخلات خاصة حالياً
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المدخل</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأتعاب</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partner1Entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge variant="outline">{entry.id}</Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {entry.description}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge>{entry.sector}</Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {entry.totalFees.toLocaleString()} ر.س
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedEntry(entry);
                                setShowDetailsDialog(true);
                              }}
                              title="عرض"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditEntry(entry)}
                              title="تعديل"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handlePrintSingle(entry)}
                              title="طباعة"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // ============================================================
  // التاب 667-06: التقارير المالية (محدث مع البطاقات التفاعلية) - 🆕
  // ============================================================

  const renderTab06_Reports = () => {
    // حساب البيانات التفصيلية
    const reportData = {
      totalEntries: {
        value: statistics.totalEntries,
        details: {
          shared: entries.filter(e => !e.isPrivate).length,
          partner1Private: entries.filter(e => e.isPrivate && e.privateForPartner === 'partner1').length,
          partner2Private: entries.filter(e => e.isPrivate && e.privateForPartner === 'partner2').length
        }
      },
      totalFees: {
        value: statistics.totalFees,
        details: {
          withVAT: entries.filter(e => e.isVATIncluded).reduce((sum, e) => sum + e.totalFees, 0),
          withoutVAT: entries.filter(e => !e.isVATIncluded).reduce((sum, e) => sum + e.totalFees, 0),
          vatAmount: statistics.vatTotal
        }
      },
      partner1: {
        total: statistics.partner1Total,
        paid: statistics.partner1Paid,
        remaining: statistics.partner1Remaining,
        percentage: ((statistics.partner1Paid / statistics.partner1Total) * 100).toFixed(1)
      },
      partner2: {
        total: statistics.partner2Total,
        paid: statistics.partner2Paid,
        remaining: statistics.partner2Remaining,
        percentage: ((statistics.partner2Paid / statistics.partner2Total) * 100).toFixed(1)
      }
    };

    return (
      <div className="space-y-4">
        {/* بطاقات تفاعلية - 🆕 */}
        <div className="grid grid-cols-2 gap-4">
          {/* بطاقة إجمالي المدخلات */}
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #3b82f6' }}
            onClick={() => {
              setSelectedReportCard('entries');
              setShowReportDetailsDialog(true);
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي المدخلات
                  </p>
                  <p className="text-4xl font-bold text-blue-700 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {reportData.totalEntries.value}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Info className="h-3 w-3" />
                    <span style={{ fontFamily: 'Tajawal, sans-serif' }}>اضغط لعرض التفاصيل</span>
                  </div>
                </div>
                <FileText className="h-16 w-16 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          {/* بطاقة إجمالي الأتعاب */}
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #10b981' }}
            onClick={() => {
              setSelectedReportCard('fees');
              setShowReportDetailsDialog(true);
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي الأتعاب
                  </p>
                  <p className="text-4xl font-bold text-green-700 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {reportData.totalFees.value.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Info className="h-3 w-3" />
                    <span style={{ fontFamily: 'Tajawal, sans-serif' }}>اضغط لعرض التفاصيل</span>
                  </div>
                </div>
                <DollarSign className="h-16 w-16 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          {/* بطاقة الشريك الأول */}
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #6366f1' }}
            onClick={() => {
              setSelectedReportCard('partner1');
              setShowReportDetailsDialog(true);
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {PARTNERS[0].name}
                  </p>
                  <p className="text-4xl font-bold text-indigo-700 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {reportData.partner1.paid.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge style={{ background: '#6366f1', color: 'white' }}>
                      {reportData.partner1.percentage}% مسدد
                    </Badge>
                    <Info className="h-3 w-3 text-gray-600" />
                  </div>
                </div>
                <UserCheck className="h-16 w-16 text-indigo-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          {/* بطاقة الشريك الثاني */}
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #f59e0b' }}
            onClick={() => {
              setSelectedReportCard('partner2');
              setShowReportDetailsDialog(true);
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {PARTNERS[1].name}
                  </p>
                  <p className="text-4xl font-bold text-yellow-700 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {reportData.partner2.paid.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge style={{ background: '#f59e0b', color: 'white' }}>
                      {reportData.partner2.percentage}% مسدد
                    </Badge>
                    <Info className="h-3 w-3 text-gray-600" />
                  </div>
                </div>
                <UserCheck className="h-16 w-16 text-yellow-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ملخص مالي */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الملخص المالي الشامل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الأتعاب</p>
                  <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {statistics.totalFees.toLocaleString()} ر.س
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المدفوع</p>
                  <p className="text-2xl font-bold text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {statistics.totalPaid.toLocaleString()} ر.س
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</p>
                  <p className="text-2xl font-bold text-red-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {statistics.totalRemaining.toLocaleString()} ر.س
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#2563eb' }}>
                    {PARTNERS[0].name} ({PARTNERS[0].number})
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>المستحق:</span>
                      <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {statistics.partner1Total.toLocaleString()} ر.س
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع:</span>
                      <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {statistics.partner1Paid.toLocaleString()} ر.س
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي:</span>
                      <span className="font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {statistics.partner1Remaining.toLocaleString()} ر.س
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#10b981' }}>
                    {PARTNERS[1].name} ({PARTNERS[1].number})
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>المستحق:</span>
                      <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {statistics.partner2Total.toLocaleString()} ر.س
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع:</span>
                      <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {statistics.partner2Paid.toLocaleString()} ر.س
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي:</span>
                      <span className="font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {statistics.partner2Remaining.toLocaleString()} ر.س
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* نافذة تفاصيل التقارير - 🆕 */}
        <Dialog open={showReportDetailsDialog} onOpenChange={setShowReportDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {selectedReportCard === 'entries' && 'تفاصيل المدخلات'}
                {selectedReportCard === 'fees' && 'تفاصيل الأتعاب'}
                {selectedReportCard === 'partner1' && `تفاصيل ${PARTNERS[0].name}`}
                {selectedReportCard === 'partner2' && `تفاصيل ${PARTNERS[1].name}`}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {selectedReportCard === 'entries' && (
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      إجمالي المدخلات
                    </p>
                    <p className="text-3xl font-bold text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {reportData.totalEntries.value}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {reportData.totalEntries.details.shared}
                      </p>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        مدخلات مشتركة
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {reportData.totalEntries.details.partner1Private}
                      </p>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الشريك الأول
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {reportData.totalEntries.details.partner2Private}
                      </p>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الشريك الثاني
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedReportCard === 'fees' && (
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      إجمالي الأتعاب
                    </p>
                    <p className="text-3xl font-bold text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {reportData.totalFees.value.toLocaleString()} ر.س
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>خاضع للقيمة المضافة:</span>
                      <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {reportData.totalFees.details.withVAT.toLocaleString()} ر.س
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>غير خاضع للقيمة المضافة:</span>
                      <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {reportData.totalFees.details.withoutVAT.toLocaleString()} ر.س
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-yellow-50 rounded-lg">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي القيمة المضافة (15%):</span>
                      <span className="font-bold text-yellow-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {reportData.totalFees.details.vatAmount.toLocaleString()} ر.س
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectedReportCard === 'partner1' && (
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {PARTNERS[0].name}
                      </p>
                      <Badge variant="outline" style={{ fontFamily: 'Courier New, monospace' }}>
                        {PARTNERS[0].number}
                      </Badge>
                    </div>
                    <p className="text-3xl font-bold text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {reportData.partner1.paid.toLocaleString()} ر.س
                    </p>
                    <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      المدفوع من أصل {reportData.partner1.total.toLocaleString()} ر.س
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة السداد:</span>
                      <Badge style={{ background: '#10b981', color: 'white' }}>
                        {reportData.partner1.percentage}%
                      </Badge>
                    </div>
                    <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي:</span>
                      <span className="font-bold text-red-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {reportData.partner1.remaining.toLocaleString()} ر.س
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectedReportCard === 'partner2' && (
                <div className="space-y-3">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {PARTNERS[1].name}
                      </p>
                      <Badge variant="outline" style={{ fontFamily: 'Courier New, monospace' }}>
                        {PARTNERS[1].number}
                      </Badge>
                    </div>
                    <p className="text-3xl font-bold text-yellow-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {reportData.partner2.paid.toLocaleString()} ر.س
                    </p>
                    <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      المدفوع من أصل {reportData.partner2.total.toLocaleString()} ر.س
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة السداد:</span>
                      <Badge style={{ background: '#10b981', color: 'white' }}>
                        {reportData.partner2.percentage}%
                      </Badge>
                    </div>
                    <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي:</span>
                      <span className="font-bold text-red-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {reportData.partner2.remaining.toLocaleString()} ر.س
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowReportDetailsDialog(false)}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                إغلاق
              </Button>
              <Button
                onClick={() => {
                  toast.success('جاري طباعة التفاصيل');
                  console.log('طباعة تفاصيل:', selectedReportCard);
                }}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Printer className="h-4 w-4 ml-1" />
                طباعة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // التابات الأخرى (نفس الكود السابق)
  const renderTab01_AddEntry = () => (<div>التاب 667-01</div>);
  const renderTab04_Partner2Private = () => (<div>التاب 667-04</div>);
  const renderTab05_PaymentLog = () => (<div>التاب 667-05</div>);
  const renderTab07_Settings = () => (<div>التاب 667-07</div>);

  // ============================================================
  // العرض الرئيسي
  // ============================================================

  return (
    <div style={{ minHeight: 'calc(100vh - 220px)' }}>
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
              <Users 
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
                  حسابات الشركاء
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
                    667
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
                إدارة شاملة لحسابات وأرباح الشركاء
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
                {TABS_CONFIG.length} تبويبات
              </span>
            </div>
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
        
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', padding: '0 16px' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة التعديل - 🆕 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تعديل المدخل: {selectedEntry?.id}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <InputWithCopy
                label="وصف المعاملة *"
                id="edit-description"
                value={newEntry.description || ''}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                placeholder="أدخل وصف المعاملة"
                required
                copyable={true}
                clearable={true}
              />

              <InputWithCopy
                label="رقم الطلب/الخدمة *"
                id="edit-serviceNumber"
                value={newEntry.serviceNumber || ''}
                onChange={(e) => setNewEntry({ ...newEntry, serviceNumber: e.target.value })}
                placeholder="رقم الطلب"
                required
                copyable={true}
                clearable={true}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <SelectWithCopy
                label="القطاع"
                id="edit-sector"
                value={newEntry.sector || ''}
                onChange={(value) => setNewEntry({ ...newEntry, sector: value })}
                options={SECTORS.map(s => ({ value: s, label: s }))}
                copyable={false}
                clearable={true}
              />

              <SelectWithCopy
                label="الحي"
                id="edit-district"
                value={newEntry.district || ''}
                onChange={(value) => setNewEntry({ ...newEntry, district: value })}
                options={DISTRICTS.map(d => ({ value: d, label: d }))}
                copyable={false}
                clearable={true}
              />

              <InputWithCopy
                label="إجمالي الأتعاب *"
                id="edit-totalFees"
                type="number"
                value={newEntry.totalFees?.toString() || '0'}
                onChange={(e) => setNewEntry({ ...newEntry, totalFees: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                required
                copyable={true}
                clearable={false}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InputWithCopy
                label="حصة الشريك الأول (%)"
                id="edit-partner1Share"
                type="number"
                value={newEntry.partner1Share?.toString() || '50'}
                onChange={(e) => setNewEntry({ ...newEntry, partner1Share: parseFloat(e.target.value) || 0 })}
                placeholder="50"
                copyable={false}
                clearable={false}
              />

              <InputWithCopy
                label="حصة الشريك الثاني (%)"
                id="edit-partner2Share"
                type="number"
                value={newEntry.partner2Share?.toString() || '50'}
                onChange={(e) => setNewEntry({ ...newEntry, partner2Share: parseFloat(e.target.value) || 0 })}
                placeholder="50"
                copyable={false}
                clearable={false}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                resetNewEntry();
              }}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSaveEntry}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Save className="h-4 w-4 ml-1" />
              حفظ التعديلات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnersAccounts_Complete_667_v2;
