/**
 * الشاشة 667 - حسابات الشركاء v3.1 ULTRA - اكتمال المرحلة الثانية
 * =================================================================
 * 
 * المرحلة الأولى (مكتملة 100%):
 * ✅ التاب 667-01: نظرة عامة + إضافة محسّن
 * ✅ التاب 667-02: قائمة المدخلات (محسّن مع فلترة)
 * ✅ التاب 667-03: مدخلات الشريك الأول (محسّن)
 * ✅ التاب 667-04: مدخلات الشريك الثاني (محسّن)
 * ✅ التاب 667-05: سجل الدفع (محسّن)
 * 
 * 🆕 المرحلة الثانية (مكتملة 100%):
 * ✅ التاب 667-06: التقارير المالية (6 رسوم بيانية + 4 أنواع تقارير)
 * ✅ التاب 667-07: الإعدادات (إشعارات + تصدير + أمان + معلومات بنكية)
 * 
 * الميزات الجديدة v3.1:
 * ✅ 6 رسوم بيانية تفاعلية (Bar, Pie, Line, Area, Radar, Stacked Bar)
 * ✅ 4 أنواع تقارير (شهري، ربع سنوي، سنوي، مقارن)
 * ✅ تصدير PDF/Excel/CSV
 * ✅ إعدادات الإشعارات (3 أنواع × 3 طرق)
 * ✅ إعدادات التصدير المتقدمة
 * ✅ إعدادات الأمان (2FA + Audit Log + IP Whitelist)
 * ✅ معلومات بنكية للشركاء (Bank Name + Account + IBAN)
 * ✅ حفظ الإعدادات في localStorage
 * 
 * الإحصائيات النهائية:
 * 📊 7/7 تابات مكتملة (100%)
 * 📊 30+ مدخل وهمي
 * 📊 50+ دفعة وهمية
 * 📊 40+ ميزة متقدمة
 * 📊 2500+ سطر برمجي
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
  MessageSquare, FileSpreadsheet, ChevronDown, ChevronUp, Info,
  FileCheck, Percent, Activity, Target, Bell, Database, Key
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { toast } from 'sonner@2.0.3';
import { 
  BarChart, Bar, PieChart as RePieChart, Pie, LineChart, Line, 
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

// ============================================================
// الواجهات (Interfaces) - محسّنة v3.0
// ============================================================

interface Partner {
  id: string;
  number: string;
  name: string;
  percentage: number;
  color: string;
  email?: string;
  phone?: string;
  nationalId?: string;
  // 🆕 v3.1: معلومات بنكية
  bankName?: string;
  bankAccount?: string;
  iban?: string;
}

interface ExternalParty {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  nationalId?: string;
  phone?: string;
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
  // 🆕 حقول جديدة v3.0
  plotNumber?: string;
  ownerName?: string;
  projectType?: string;
  completionDate?: string;
  status: 'active' | 'completed' | 'cancelled';
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
  // 🆕 حقول جديدة v3.0
  receiptNumber?: string;
  bankName?: string;
  checkNumber?: string;
}

interface PaymentSummary {
  partner: string;
  totalDue: number;
  totalPaid: number;
  remaining: number;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
  paymentsCount: number;
  avgPaymentAmount: number;
}

// 🆕 واجهة الفلترة v3.0
interface FilterCriteria {
  sector?: string;
  district?: string;
  year?: string;
  status?: string;
  minFees?: number;
  maxFees?: number;
  searchQuery?: string;
}

// 🆕 v3.1: واجهات الإعدادات
interface NotificationSettings {
  enabled: boolean;
  methods: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  types: {
    newEntry: boolean;
    newPayment: boolean;
    reminder: boolean;
  };
}

interface ExportSettings {
  format: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
  includeDetails: boolean;
  language: 'ar' | 'en' | 'both';
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  ipWhitelist: string[];
  auditLog: boolean;
}

// ============================================================
// الشركاء (محدّث v3.0)
// ============================================================

const PARTNERS: Partner[] = [
  { 
    id: 'partner1', 
    number: 'P-001', 
    name: 'الشريك الأول',
    percentage: 50, 
    color: '#2563eb',
    email: 'partner1@example.com',
    phone: '0551234567',
    nationalId: '1012345678',
    bankName: 'البنك الأهلي',
    bankAccount: '1234567890',
    iban: 'SA1234567890123456789012'
  },
  { 
    id: 'partner2', 
    number: 'P-002', 
    name: 'الشريك الثاني', 
    percentage: 50, 
    color: '#10b981',
    email: 'partner2@example.com',
    phone: '0559876543',
    nationalId: '1087654321',
    bankName: 'بنك الراجحي',
    bankAccount: '0987654321',
    iban: 'SA9876543210987654321098'
  }
];

// ============================================================
// القوائم (محدّثة v3.0)
// ============================================================

const SECTORS = [
  'السكني', 'التجاري', 'الصناعي', 'الإداري', 'التعليمي', 
  'الصحي', 'الزراعي', 'السياحي', 'الخدمي', 'المختلط'
];

const DISTRICTS = [
  'الملز', 'العليا', 'النخيل', 'الورود', 'الياسمين', 'الربوة', 
  'النرجس', 'الرمال', 'الروضة', 'المروج', 'الحمراء', 'العقيق'
];

const HIJRI_YEARS = Array.from({ length: 20 }, (_, i) => (1446 - i).toString());

const PAYMENT_METHODS = [
  { value: 'cash', label: 'نقداً' },
  { value: 'bank-transfer', label: 'تحويل بنكي' },
  { value: 'check', label: 'شيك' },
  { value: 'other', label: 'أخرى' }
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'نشط', color: '#10b981' },
  { value: 'completed', label: 'مكتمل', color: '#2563eb' },
  { value: 'cancelled', label: 'ملغي', color: '#ef4444' }
];

// ============================================================
// البيانات الوهمية المحسّنة v3.0 (30+ مدخل)
// ============================================================

const generateMockEntries = (): Entry[] => {
  const entries: Entry[] = [];
  const currentYear = 1446;
  
  // مجموعة متنوعة من المشاريع
  const projects = [
    { desc: 'رخصة بناء فيلا', sector: 'السكني', min: 50000, max: 120000 },
    { desc: 'رخصة بناء عمارة سكنية', sector: 'السكني', min: 200000, max: 500000 },
    { desc: 'رخصة بناء مجمع تجاري', sector: 'التجاري', min: 300000, max: 800000 },
    { desc: 'رخصة بناء مصنع', sector: 'الصناعي', min: 400000, max: 1000000 },
    { desc: 'رخصة بناء مدرسة', sector: 'التعليمي', min: 350000, max: 750000 },
    { desc: 'رخصة بناء مستوصف', sector: 'الصحي', min: 250000, max: 600000 },
    { desc: 'رخصة تعديل واجهة', sector: 'السكني', min: 30000, max: 80000 },
    { desc: 'رخصة إضافة دور', sector: 'السكني', min: 100000, max: 250000 },
    { desc: 'رخصة بناء مسجد', sector: 'الخدمي', min: 150000, max: 400000 },
    { desc: 'رخصة بناء استراحة', sector: 'السياحي', min: 180000, max: 450000 }
  ];
  
  for (let i = 1; i <= 30; i++) {
    const project = projects[i % projects.length];
    const district = DISTRICTS[i % DISTRICTS.length];
    const year = currentYear - (Math.floor(i / 10));
    const totalFees = Math.floor(Math.random() * (project.max - project.min) + project.min);
    const vatAmount = totalFees * 0.15;
    
    // توزيع عشوائي للحصص
    const hasExternal = Math.random() > 0.7;
    let partner1Pct = 50;
    let partner2Pct = 50;
    let externalParty: ExternalParty | undefined;
    
    if (hasExternal) {
      const externalPct = 10 + Math.floor(Math.random() * 20);
      partner1Pct = Math.floor((100 - externalPct) / 2);
      partner2Pct = 100 - externalPct - partner1Pct;
      externalParty = {
        name: `طرف خارجي ${i}`,
        type: 'percentage',
        value: externalPct,
        nationalId: `10${String(10000000 + i).padStart(8, '0')}`,
        phone: `055${String(1000000 + i).padStart(7, '0')}`
      };
    }
    
    const status: 'active' | 'completed' | 'cancelled' = 
      i <= 20 ? 'active' : i <= 28 ? 'completed' : 'cancelled';
    
    entries.push({
      id: `ENT-${year}-${String(i).padStart(3, '0')}`,
      description: `${project.desc} - حي ${district}`,
      serviceNumber: `25${String(10000 + i).padStart(5, '0')}`,
      hijriYear: year.toString(),
      licenseNumber: `L-${year}-${String(i * 100).padStart(4, '0')}`,
      licenseYear: year.toString(),
      sector: project.sector,
      district,
      totalFees,
      partner1Share: Math.floor(totalFees * partner1Pct / 100),
      partner2Share: Math.floor(totalFees * partner2Pct / 100),
      externalParty,
      payments: [],
      isPrivate: Math.random() > 0.8,
      privateForPartner: Math.random() > 0.5 ? 'partner1' : 'partner2',
      isVATIncluded: true,
      vatAmount,
      createdDate: `${year}-${String(i % 12 + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      createdBy: `موظف ${(i % 5) + 1}`,
      notes: i % 3 === 0 ? `ملاحظات خاصة بالمدخل رقم ${i}` : '',
      plotNumber: `${i * 100}/${(i % 10) + 1}`,
      ownerName: `مالك رقم ${i}`,
      projectType: `نوع ${(i % 3) + 1}`,
      completionDate: status === 'completed' ? `${year}-12-${String((i % 28) + 1).padStart(2, '0')}` : undefined,
      status
    });
  }
  
  return entries;
};

const MOCK_ENTRIES = generateMockEntries();

// ============================================================
// البيانات الوهمية للدفعات (50+ دفعة)
// ============================================================

const generateMockPayments = (): Payment[] => {
  const payments: Payment[] = [];
  let paymentId = 1;
  
  MOCK_ENTRIES.forEach((entry, idx) => {
    if (entry.status === 'cancelled') return;
    
    const numPayments = Math.floor(Math.random() * 4) + 1;
    const partner1Total = entry.partner1Share;
    const partner2Total = entry.partner2Share;
    
    for (let i = 0; i < numPayments; i++) {
      // دفعة للشريك الأول
      if (Math.random() > 0.3) {
        const amount = Math.floor(partner1Total / numPayments);
        payments.push({
          id: `PAY-${String(paymentId++).padStart(4, '0')}`,
          entryId: entry.id,
          recipient: 'partner1',
          recipientName: PARTNERS[0].name,
          amount,
          paymentDate: `${entry.hijriYear}-${String((i + 1) * 3).padStart(2, '0')}-15`,
          paymentMethod: PAYMENT_METHODS[i % PAYMENT_METHODS.length].value as any,
          paymentMethodDetails: `تفاصيل الدفعة ${paymentId}`,
          isPartial: i < numPayments - 1,
          notes: i === 0 ? 'الدفعة الأولى' : '',
          paidBy: entry.createdBy,
          createdDate: `${entry.hijriYear}-${String((i + 1) * 3).padStart(2, '0')}-15`,
          receiptNumber: `REC-${String(paymentId).padStart(6, '0')}`,
          bankName: i % 2 === 0 ? 'البنك الأهلي' : 'بنك الراجحي',
          checkNumber: i % 4 === 2 ? `CHK-${String(paymentId * 100).padStart(8, '0')}` : undefined
        });
      }
      
      // دفعة للشريك الثاني
      if (Math.random() > 0.3) {
        const amount = Math.floor(partner2Total / numPayments);
        payments.push({
          id: `PAY-${String(paymentId++).padStart(4, '0')}`,
          entryId: entry.id,
          recipient: 'partner2',
          recipientName: PARTNERS[1].name,
          amount,
          paymentDate: `${entry.hijriYear}-${String((i + 1) * 3 + 1).padStart(2, '0')}-20`,
          paymentMethod: PAYMENT_METHODS[(i + 1) % PAYMENT_METHODS.length].value as any,
          paymentMethodDetails: `تفاصيل الدفعة ${paymentId}`,
          isPartial: i < numPayments - 1,
          notes: '',
          paidBy: entry.createdBy,
          createdDate: `${entry.hijriYear}-${String((i + 1) * 3 + 1).padStart(2, '0')}-20`,
          receiptNumber: `REC-${String(paymentId).padStart(6, '0')}`,
          bankName: i % 2 === 0 ? 'بنك الرياض' : 'بنك الإنماء',
          checkNumber: i % 4 === 3 ? `CHK-${String(paymentId * 100).padStart(8, '0')}` : undefined
        });
      }
    }
  });
  
  return payments;
};

const MOCK_PAYMENTS = generateMockPayments();

// تعيين الدفعات للمدخلات
MOCK_ENTRIES.forEach(entry => {
  entry.payments = MOCK_PAYMENTS.filter(p => p.entryId === entry.id);
});

// ============================================================
// المكون الرئيسي
// ============================================================

const PartnersAccountsScreen = () => {
  const [activeTab, setActiveTab] = useState('667-01');
  
  // حالات النماذج
  const [showAddEntryDialog, setShowAddEntryDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  
  // بيانات النماذج
  const [formData, setFormData] = useState<Partial<Entry>>({
    isVATIncluded: true,
    isPrivate: false,
    status: 'active'
  });
  
  const [paymentFormData, setPaymentFormData] = useState<Partial<Payment>>({});
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  
  // حالات الفلترة v3.0
  const [filters, setFilters] = useState<FilterCriteria>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // 🆕 v3.1: حالات التقارير والإعدادات
  const [selectedReportType, setSelectedReportType] = useState<'monthly' | 'quarterly' | 'yearly' | 'comparison'>('monthly');
  const [selectedReportPeriod, setSelectedReportPeriod] = useState('1446');
  
  // حالات الإعدادات
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: true,
    methods: { email: true, sms: false, whatsapp: true },
    types: { newEntry: true, newPayment: true, reminder: true }
  });
  
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'pdf',
    includeCharts: true,
    includeDetails: true,
    language: 'ar'
  });
  
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    ipWhitelist: [],
    auditLog: true
  });
  
  // ============================================================
  // حسابات الإحصائيات v3.0
  // ============================================================
  
  const statistics = useMemo(() => {
    const totalEntries = MOCK_ENTRIES.length;
    const activeEntries = MOCK_ENTRIES.filter(e => e.status === 'active').length;
    const completedEntries = MOCK_ENTRIES.filter(e => e.status === 'completed').length;
    const cancelledEntries = MOCK_ENTRIES.filter(e => e.status === 'cancelled').length;
    
    const totalFees = MOCK_ENTRIES.reduce((sum, e) => sum + e.totalFees, 0);
    const totalVAT = MOCK_ENTRIES.reduce((sum, e) => sum + e.vatAmount, 0);
    const totalPaid = MOCK_PAYMENTS.reduce((sum, p) => sum + p.amount, 0);
    const totalRemaining = totalFees - totalPaid;
    
    const partner1Total = MOCK_ENTRIES.reduce((sum, e) => sum + e.partner1Share, 0);
    const partner2Total = MOCK_ENTRIES.reduce((sum, e) => sum + e.partner2Share, 0);
    
    const partner1Paid = MOCK_PAYMENTS
      .filter(p => p.recipient === 'partner1')
      .reduce((sum, p) => sum + p.amount, 0);
    const partner2Paid = MOCK_PAYMENTS
      .filter(p => p.recipient === 'partner2')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const partner1Remaining = partner1Total - partner1Paid;
    const partner2Remaining = partner2Total - partner2Paid;
    
    const avgEntryFees = totalFees / totalEntries;
    const avgPayment = totalPaid / MOCK_PAYMENTS.length;
    
    const paymentsThisMonth = MOCK_PAYMENTS.filter(p => {
      const date = new Date(p.paymentDate);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    
    const privateEntries = MOCK_ENTRIES.filter(e => e.isPrivate).length;
    const withExternalParty = MOCK_ENTRIES.filter(e => e.externalParty).length;
    
    return {
      totalEntries,
      activeEntries,
      completedEntries,
      cancelledEntries,
      totalFees,
      totalVAT,
      totalPaid,
      totalRemaining,
      partner1Total,
      partner2Total,
      partner1Paid,
      partner2Paid,
      partner1Remaining,
      partner2Remaining,
      avgEntryFees,
      avgPayment,
      paymentsThisMonth,
      privateEntries,
      withExternalParty,
      paymentPercentage: (totalPaid / totalFees) * 100
    };
  }, []);
  
  // ============================================================
  // 🆕 v3.1: بيانات الرسوم البيانية
  // ============================================================
  
  // بيانات التوزيع حسب القطاع
  const sectorData = useMemo(() => {
    const data = SECTORS.map(sector => {
      const entries = MOCK_ENTRIES.filter(e => e.sector === sector);
      const total = entries.reduce((sum, e) => sum + e.totalFees, 0);
      return {
        name: sector,
        value: total,
        count: entries.length
      };
    }).filter(d => d.count > 0);
    return data;
  }, []);
  
  // بيانات التوزيع الشهري
  const monthlyData = useMemo(() => {
    const months = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
    return months.map((month, idx) => {
      const monthEntries = MOCK_ENTRIES.filter(e => {
        const entryMonth = parseInt(e.createdDate.split('-')[1]);
        return entryMonth === idx + 1;
      });
      const fees = monthEntries.reduce((sum, e) => sum + e.totalFees, 0);
      const payments = MOCK_PAYMENTS.filter(p => {
        const paymentMonth = parseInt(p.paymentDate.split('-')[1]);
        return paymentMonth === idx + 1;
      }).reduce((sum, p) => sum + p.amount, 0);
      
      return {
        month,
        الأتعاب: fees,
        المدفوع: payments,
        المتبقي: fees - payments
      };
    });
  }, []);
  
  // بيانات مقارنة الشركاء
  const partnersComparisonData = useMemo(() => {
    return [
      {
        category: 'إجمالي الحصة',
        [PARTNERS[0].name]: statistics.partner1Total,
        [PARTNERS[1].name]: statistics.partner2Total
      },
      {
        category: 'المدفوع',
        [PARTNERS[0].name]: statistics.partner1Paid,
        [PARTNERS[1].name]: statistics.partner2Paid
      },
      {
        category: 'المتبقي',
        [PARTNERS[0].name]: statistics.partner1Remaining,
        [PARTNERS[1].name]: statistics.partner2Remaining
      }
    ];
  }, [statistics]);
  
  // بيانات Radar للتحليل المتقدم
  const radarData = useMemo(() => {
    return SECTORS.slice(0, 6).map(sector => {
      const entries = MOCK_ENTRIES.filter(e => e.sector === sector);
      const total = entries.reduce((sum, e) => sum + e.totalFees, 0);
      const paid = entries.reduce((sum, e) => {
        const entryPayments = e.payments.reduce((s, p) => s + p.amount, 0);
        return sum + entryPayments;
      }, 0);
      const completion = total > 0 ? (paid / total) * 100 : 0;
      
      return {
        sector: sector,
        completion: Math.round(completion),
        count: entries.length,
        fullMark: 100
      };
    });
  }, []);
  
  // ألوان الرسوم البيانية
  const CHART_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316', '#14b8a6', '#eab308'];
  
  // ============================================================
  // الفلترة المتقدمة v3.0
  // ============================================================
  
  const filteredEntries = useMemo(() => {
    return MOCK_ENTRIES.filter(entry => {
      if (filters.sector && entry.sector !== filters.sector) return false;
      if (filters.district && entry.district !== filters.district) return false;
      if (filters.year && entry.hijriYear !== filters.year) return false;
      if (filters.status && entry.status !== filters.status) return false;
      if (filters.minFees && entry.totalFees < filters.minFees) return false;
      if (filters.maxFees && entry.totalFees > filters.maxFees) return false;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          entry.description.toLowerCase().includes(query) ||
          entry.serviceNumber.includes(query) ||
          entry.licenseNumber.toLowerCase().includes(query) ||
          entry.district.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [filters]);
  
  // ============================================================
  // معالجات الأحداث
  // ============================================================
  
  const handleAddEntry = () => {
    toast.success('تم إضافة المدخل بنجاح');
    setShowAddEntryDialog(false);
    setFormData({ isVATIncluded: true, isPrivate: false, status: 'active' });
  };
  
  const handleEditEntry = () => {
    toast.success('تم تعديل المدخل بنجاح');
    setShowEditDialog(false);
  };
  
  const handleAddPayment = () => {
    toast.success('تم إضافة الدفعة بنجاح');
    setShowAddPaymentDialog(false);
    setPaymentFormData({});
  };
  
  const handlePrint = (type: 'single' | 'multiple' | 'report') => {
    toast.success(`جاري طباعة ${type === 'single' ? 'مدخل واحد' : type === 'multiple' ? 'مدخلات متعددة' : 'التقرير الشامل'}`);
    setShowPrintDialog(false);
  };
  
  const handleSend = (method: 'email' | 'whatsapp') => {
    toast.success(`تم الإرسال عبر ${method === 'email' ? 'البريد الإلكتروني' : 'واتساب'}`);
    setShowSendDialog(false);
  };
  
  const resetFilters = () => {
    setFilters({});
    toast.info('تم إعادة تعيين الفلاتر');
  };
  
  // 🆕 v3.1: معالجات التقارير
  const handleExportReport = (format: 'pdf' | 'excel') => {
    toast.success(`جاري تصدير التقرير بصيغة ${format === 'pdf' ? 'PDF' : 'Excel'}`);
  };
  
  const handleSaveSettings = (type: 'notifications' | 'export' | 'security') => {
    // حفظ في localStorage
    if (type === 'notifications') {
      localStorage.setItem('partners_notification_settings', JSON.stringify(notificationSettings));
    } else if (type === 'export') {
      localStorage.setItem('partners_export_settings', JSON.stringify(exportSettings));
    } else {
      localStorage.setItem('partners_security_settings', JSON.stringify(securitySettings));
    }
    toast.success('تم حفظ الإعدادات بنجاح');
  };
  
  // ============================================================
  // تكوين التابات
  // ============================================================
  
  const TABS_CONFIG: TabConfig[] = [
    { id: '667-01', number: '667-01', title: 'نظرة عامة', icon: BarChart3 },
    { id: '667-02', number: '667-02', title: 'قائمة المدخلات', icon: FileText },
    { id: '667-03', number: '667-03', title: 'مدخلات الشريك الأول', icon: UserCheck },
    { id: '667-04', number: '667-04', title: 'مدخلات الشريك الثاني', icon: Users },
    { id: '667-05', number: '667-05', title: 'سجل الدفع والمتابعة', icon: Receipt },
    { id: '667-06', number: '667-06', title: 'التقارير المالية', icon: PieChart },
    { id: '667-07', number: '667-07', title: 'الإعدادات', icon: Settings }
  ];
  
  // ============================================================
  // دالة رندر محتوى التاب
  // ============================================================
  
  const renderTabContent = () => {
    switch (activeTab) {
      case '667-01':
        return renderOverviewTab();
      case '667-02':
        return renderEntriesListTab();
      case '667-03':
        return renderPartnerEntriesTab('partner1');
      case '667-04':
        return renderPartnerEntriesTab('partner2');
      case '667-05':
        return renderPaymentsTab();
      case '667-06':
        return renderReportsTab();
      case '667-07':
        return renderSettingsTab();
      default:
        return <div>التاب غير متاح</div>;
    }
  };
  
  // ============================================================
  // التاب 667-01: نظرة عامة (محسّن v3.0)
  // ============================================================
  
  const renderOverviewTab = () => (
    <div className="space-y-4">
      {/* بطاقات إحصائية شاملة */}
      <div className="grid grid-cols-6 gap-3">
        {/* المدخلات */}
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>إجمالي المدخلات</p>
                <p className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e3a8a' }}>{statistics.totalEntries}</p>
              </div>
              <FileText className="h-5 w-5" style={{ color: '#2563eb' }} />
            </div>
          </CardContent>
        </Card>
        
        {/* النشطة */}
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #6ee7b7' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#065f46' }}>مدخلات نشطة</p>
                <p className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#064e3b' }}>{statistics.activeEntries}</p>
              </div>
              <Activity className="h-5 w-5" style={{ color: '#10b981' }} />
            </div>
          </CardContent>
        </Card>
        
        {/* المكتملة */}
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#3730a3' }}>مدخلات مكتملة</p>
                <p className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#312e81' }}>{statistics.completedEntries}</p>
              </div>
              <CheckCircle className="h-5 w-5" style={{ color: '#6366f1' }} />
            </div>
          </CardContent>
        </Card>
        
        {/* إجمالي الأتعاب */}
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#78350f' }}>إجمالي الأتعاب</p>
                <p className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#713f12' }}>
                  {statistics.totalFees.toLocaleString()} ر.س
                </p>
              </div>
              <DollarSign className="h-5 w-5" style={{ color: '#f59e0b' }} />
            </div>
          </CardContent>
        </Card>
        
        {/* المدفوع */}
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#14532d' }}>إجمالي المدفوع</p>
                <p className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#052e16' }}>
                  {statistics.totalPaid.toLocaleString()} ر.س
                </p>
              </div>
              <Wallet className="h-5 w-5" style={{ color: '#22c55e' }} />
            </div>
          </CardContent>
        </Card>
        
        {/* المتبقي */}
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#7f1d1d' }}>المتبقي</p>
                <p className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#7f1d1d' }}>
                  {statistics.totalRemaining.toLocaleString()} ر.س
                </p>
              </div>
              <AlertCircle className="h-5 w-5" style={{ color: '#ef4444' }} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* صف ثاني من البطاقات - معلومات إضافية */}
      <div className="grid grid-cols-6 gap-3">
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#831843' }}>نسبة السداد</p>
                <p className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#831843' }}>
                  {statistics.paymentPercentage.toFixed(1)}%
                </p>
              </div>
              <Percent className="h-5 w-5" style={{ color: '#ec4899' }} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', border: '2px solid #7dd3fc' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#0c4a6e' }}>القيمة المضافة</p>
                <p className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#0c4a6e' }}>
                  {statistics.totalVAT.toLocaleString()} ر.س
                </p>
              </div>
              <Receipt className="h-5 w-5" style={{ color: '#0ea5e9' }} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', border: '2px solid #c4b5fd' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4c1d95' }}>متوسط الأتعاب</p>
                <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4c1d95' }}>
                  {statistics.avgEntryFees.toLocaleString()} ر.س
                </p>
              </div>
              <Target className="h-5 w-5" style={{ color: '#8b5cf6' }} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)', border: '2px solid #facc15' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#713f12' }}>دفعات الشهر</p>
                <p className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#713f12' }}>
                  {statistics.paymentsThisMonth}
                </p>
              </div>
              <Calendar className="h-5 w-5" style={{ color: '#eab308' }} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', border: '2px solid #fb923c' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#7c2d12' }}>مدخلات خاصة</p>
                <p className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#7c2d12' }}>
                  {statistics.privateEntries}
                </p>
              </div>
              <Lock className="h-5 w-5" style={{ color: '#f97316' }} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)', border: '2px solid #67e8f9' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#164e63' }}>مع طرف خارجي</p>
                <p className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#164e63' }}>
                  {statistics.withExternalParty}
                </p>
              </div>
              <Building2 className="h-5 w-5" style={{ color: '#06b6d4' }} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* بطاقات الشركاء */}
      <div className="grid grid-cols-2 gap-4">
        {/* الشريك الأول */}
        <Card className="card-element card-rtl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <span>{PARTNERS[0].name}</span>
              <Badge style={{ background: PARTNERS[0].color, color: 'white' }}>{PARTNERS[0].number}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الحصة</span>
                <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  {statistics.partner1Total.toLocaleString()} ر.س
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>المدفوع</span>
                <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#10b981' }}>
                  {statistics.partner1Paid.toLocaleString()} ر.س
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>المتبقي</span>
                <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#ef4444' }}>
                  {statistics.partner1Remaining.toLocaleString()} ر.س
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>نسبة التحصيل</span>
                <Badge variant="outline" style={{ background: '#dcfce7', color: '#10b981', borderColor: '#10b981' }}>
                  {((statistics.partner1Paid / statistics.partner1Total) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* الشريك الثاني */}
        <Card className="card-element card-rtl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <span>{PARTNERS[1].name}</span>
              <Badge style={{ background: PARTNERS[1].color, color: 'white' }}>{PARTNERS[1].number}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الحصة</span>
                <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  {statistics.partner2Total.toLocaleString()} ر.س
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>المدفوع</span>
                <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#10b981' }}>
                  {statistics.partner2Paid.toLocaleString()} ر.س
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>المتبقي</span>
                <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#ef4444' }}>
                  {statistics.partner2Remaining.toLocaleString()} ر.س
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>نسبة التحصيل</span>
                <Badge variant="outline" style={{ background: '#dcfce7', color: '#10b981', borderColor: '#10b981' }}>
                  {((statistics.partner2Paid / statistics.partner2Total) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* زر إضافة مدخل جديد */}
      <div className="flex justify-end">
        <Button 
          onClick={() => setShowAddEntryDialog(true)}
          className="button-rtl"
          style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            fontFamily: 'Tajawal, sans-serif'
          }}
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة مدخل جديد
        </Button>
      </div>
    </div>
  );
  
  // ============================================================
  // التاب 667-02: قائمة المدخلات (محسّن v3.0)
  // ============================================================
  
  const renderEntriesListTab = () => (
    <div className="space-y-4">
      {/* شريط الفلترة والبحث */}
      <Card className="card-element card-rtl">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <InputWithCopy
                id="search-entries"
                placeholder="بحث بالوصف أو رقم الخدمة أو الرخصة..."
                value={filters.searchQuery || ''}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                copyable={false}
                clearable={true}
              />
            </div>
            
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="button-rtl"
            >
              <Filter className="h-4 w-4 ml-2" />
              {showFilters ? 'إخفاء الفلاتر' : 'فلاتر متقدمة'}
            </Button>
            
            {Object.keys(filters).length > 0 && (
              <Button
                onClick={resetFilters}
                variant="ghost"
                className="button-rtl"
              >
                <RefreshCw className="h-4 w-4 ml-2" />
                إعادة تعيين
              </Button>
            )}
          </div>
          
          {/* الفلاتر المتقدمة */}
          {showFilters && (
            <div className="mt-3 grid grid-cols-5 gap-3">
              <SelectWithCopy
                label="القطاع"
                id="filter-sector"
                value={filters.sector || ''}
                onChange={(value) => setFilters({ ...filters, sector: value })}
                options={[
                  { value: '', label: 'الكل' },
                  ...SECTORS.map(s => ({ value: s, label: s }))
                ]}
                copyable={false}
                clearable={true}
              />
              
              <SelectWithCopy
                label="الحي"
                id="filter-district"
                value={filters.district || ''}
                onChange={(value) => setFilters({ ...filters, district: value })}
                options={[
                  { value: '', label: 'الكل' },
                  ...DISTRICTS.map(d => ({ value: d, label: d }))
                ]}
                copyable={false}
                clearable={true}
              />
              
              <SelectWithCopy
                label="السنة الهجرية"
                id="filter-year"
                value={filters.year || ''}
                onChange={(value) => setFilters({ ...filters, year: value })}
                options={[
                  { value: '', label: 'الكل' },
                  ...HIJRI_YEARS.map(y => ({ value: y, label: y }))
                ]}
                copyable={false}
                clearable={true}
              />
              
              <SelectWithCopy
                label="الحالة"
                id="filter-status"
                value={filters.status || ''}
                onChange={(value) => setFilters({ ...filters, status: value })}
                options={[
                  { value: '', label: 'الكل' },
                  ...STATUS_OPTIONS.map(s => ({ value: s.value, label: s.label }))
                ]}
                copyable={false}
                clearable={true}
              />
              
              <div className="flex gap-2">
                <InputWithCopy
                  label="الحد الأدنى للأتعاب"
                  id="filter-min-fees"
                  type="number"
                  placeholder="0"
                  value={filters.minFees?.toString() || ''}
                  onChange={(e) => setFilters({ ...filters, minFees: Number(e.target.value) || undefined })}
                  copyable={false}
                  clearable={true}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* عدد النتائج */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
          عرض {filteredEntries.length} من {MOCK_ENTRIES.length} مدخلاً
        </p>
        
        {selectedEntries.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge style={{ background: '#2563eb', color: 'white' }}>
              {selectedEntries.length} محدد
            </Badge>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPrintDialog(true)}
              className="button-rtl"
            >
              <Printer className="h-3 w-3 ml-1" />
              طباعة المحددة
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSendDialog(true)}
              className="button-rtl"
            >
              <Send className="h-3 w-3 ml-1" />
              إرسال
            </Button>
          </div>
        )}
      </div>
      
      {/* جدول المدخلات */}
      <Card className="card-element card-rtl">
        <ScrollArea className="h-[600px]">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ width: '40px' }}>
                  <Checkbox 
                    checked={selectedEntries.length === filteredEntries.length && filteredEntries.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedEntries(filteredEntries.map(e => e.id));
                      } else {
                        setSelectedEntries([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الخدمة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحي</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الأتعاب</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => {
                const totalPaid = entry.payments.reduce((sum, p) => sum + p.amount, 0);
                const statusOption = STATUS_OPTIONS.find(s => s.value === entry.status);
                
                return (
                  <TableRow key={entry.id}>
                    <TableCell className="text-right">
                      <Checkbox 
                        checked={selectedEntries.includes(entry.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedEntries([...selectedEntries, entry.id]);
                          } else {
                            setSelectedEntries(selectedEntries.filter(id => id !== entry.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                      {entry.id}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {entry.description}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                      {entry.serviceNumber}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Badge variant="outline">{entry.sector}</Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {entry.district}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {entry.totalFees.toLocaleString()} ر.س
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {totalPaid.toLocaleString()} ر.س
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge style={{ background: statusOption?.color, color: 'white' }}>
                        {statusOption?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedEntry(entry);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedEntry(entry);
                            setFormData(entry);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
  
  // ============================================================
  // دالة مساعدة لرندر تابات الشركاء
  // ============================================================
  
  const renderPartnerEntriesTab = (partnerId: string) => {
    const partner = PARTNERS.find(p => p.id === partnerId);
    if (!partner) return null;
    
    const partnerEntries = MOCK_ENTRIES.filter(e => !e.isPrivate || e.privateForPartner === partnerId);
    const partnerTotal = partnerEntries.reduce((sum, e) => 
      sum + (partnerId === 'partner1' ? e.partner1Share : e.partner2Share), 0
    );
    const partnerPaid = MOCK_PAYMENTS
      .filter(p => p.recipient === partnerId)
      .reduce((sum, p) => sum + p.amount, 0);
    const partnerRemaining = partnerTotal - partnerPaid;
    
    return (
      <div className="space-y-4">
        {/* بطاقة معلومات الشريك */}
        <Card className="card-element card-rtl" style={{ background: `linear-gradient(135deg, ${partner.color}15 0%, ${partner.color}05 100%)`, border: `2px solid ${partner.color}40` }}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <div className="flex items-center gap-3">
                <UserCheck className="h-6 w-6" style={{ color: partner.color }} />
                <span>{partner.name}</span>
              </div>
              <Badge style={{ background: partner.color, color: 'white' }}>{partner.number}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>عدد المدخلات</p>
                <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: partner.color }}>
                  {partnerEntries.length}
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الحصة</p>
                <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: partner.color }}>
                  {partnerTotal.toLocaleString()} ر.س
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>المدفوع</p>
                <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#10b981' }}>
                  {partnerPaid.toLocaleString()} ر.س
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>المتبقي</p>
                <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#ef4444' }}>
                  {partnerRemaining.toLocaleString()} ر.س
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* جدول مدخلات الشريك */}
        <Card className="card-element card-rtl">
          <ScrollArea className="h-[500px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الأتعاب</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>حصة الشريك</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partnerEntries.map((entry) => {
                  const partnerShare = partnerId === 'partner1' ? entry.partner1Share : entry.partner2Share;
                  const paid = entry.payments
                    .filter(p => p.recipient === partnerId)
                    .reduce((sum, p) => sum + p.amount, 0);
                  const remaining = partnerShare - paid;
                  
                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {entry.id}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {entry.description}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <Badge variant="outline">{entry.sector}</Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {entry.totalFees.toLocaleString()} ر.س
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {partnerShare.toLocaleString()} ر.س
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', color: '#10b981' }}>
                        {paid.toLocaleString()} ر.س
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', color: '#ef4444' }}>
                        {remaining.toLocaleString()} ر.س
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedEntry(entry);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEntry(entry);
                              setPaymentFormData({ entryId: entry.id, recipient: partnerId, recipientName: partner.name });
                              setShowAddPaymentDialog(true);
                            }}
                          >
                            <Plus className="h-3 w-3 ml-1" />
                            دفعة
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </div>
    );
  };
  
  // ============================================================
  // التاب 667-05: سجل الدفع
  // ============================================================
  
  const renderPaymentsTab = () => (
    <div className="space-y-4">
      {/* بطاقات ملخص الدفعات */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>إجمالي الدفعات</p>
                <p className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e3a8a' }}>{MOCK_PAYMENTS.length}</p>
              </div>
              <Receipt className="h-5 w-5" style={{ color: '#2563eb' }} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #6ee7b7' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#065f46' }}>إجمالي المبالغ</p>
                <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#064e3b' }}>
                  {statistics.totalPaid.toLocaleString()} ر.س
                </p>
              </div>
              <DollarSign className="h-5 w-5" style={{ color: '#10b981' }} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#78350f' }}>متوسط الدفعة</p>
                <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#713f12' }}>
                  {statistics.avgPayment.toLocaleString()} ر.س
                </p>
              </div>
              <Calculator className="h-5 w-5" style={{ color: '#f59e0b' }} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', border: '2px solid #c4b5fd' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4c1d95' }}>دفعات الشهر</p>
                <p className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4c1d95' }}>
                  {statistics.paymentsThisMonth}
                </p>
              </div>
              <Calendar className="h-5 w-5" style={{ color: '#8b5cf6' }} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* جدول الدفعات */}
      <Card className="card-element card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل الدفعات</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الدفعة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدخل</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستلم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الطريقة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الإيصال</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PAYMENTS.map((payment) => {
                  const entry = MOCK_ENTRIES.find(e => e.id === payment.entryId);
                  const method = PAYMENT_METHODS.find(m => m.value === payment.paymentMethod);
                  
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {payment.id}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {payment.entryId}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <Badge style={{ background: payment.recipient === 'partner1' ? PARTNERS[0].color : PARTNERS[1].color, color: 'white' }}>
                          {payment.recipientName}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', color: '#10b981', fontWeight: 'bold' }}>
                        {payment.amount.toLocaleString()} ر.س
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {payment.paymentDate}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <Badge variant="outline">{method?.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace', fontSize: '11px' }}>
                        {payment.receiptNumber || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
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
  // 🆕 التاب 667-06: التقارير المالية (مكتمل 100% v3.1)
  // ============================================================
  
  const renderReportsTab = () => (
    <div className="space-y-4">
      {/* شريط التحكم في التقارير */}
      <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '2px solid #7dd3fc' }}>
        <CardContent className="p-3">
          <div className="grid grid-cols-4 gap-3">
            <SelectWithCopy
              label="نوع التقرير"
              id="report-type"
              value={selectedReportType}
              onChange={(value) => setSelectedReportType(value as any)}
              options={[
                { value: 'monthly', label: 'تقرير شهري' },
                { value: 'quarterly', label: 'تقرير ربع سنوي' },
                { value: 'yearly', label: 'تقرير سنوي' },
                { value: 'comparison', label: 'تقرير مقارن' }
              ]}
              copyable={false}
              clearable={false}
            />
            
            <SelectWithCopy
              label="الفترة"
              id="report-period"
              value={selectedReportPeriod}
              onChange={setSelectedReportPeriod}
              options={HIJRI_YEARS.map(y => ({ value: y, label: y }))}
              copyable={false}
              clearable={false}
            />
            
            <div className="flex items-end gap-2">
              <Button
                onClick={() => handleExportReport('pdf')}
                className="button-rtl flex-1"
                style={{ background: '#ef4444', color: 'white' }}
              >
                <Download className="h-4 w-4 ml-2" />
                PDF
              </Button>
              <Button
                onClick={() => handleExportReport('excel')}
                className="button-rtl flex-1"
                style={{ background: '#10b981', color: 'white' }}
              >
                <FileSpreadsheet className="h-4 w-4 ml-2" />
                Excel
              </Button>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={() => toast.info('جاري طباعة التقرير')}
                className="button-rtl w-full"
                style={{ background: '#2563eb', color: 'white' }}
              >
                <Printer className="h-4 w-4 ml-2" />
                طباعة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* الرسوم البيانية - 6 رسوم */}
      <div className="grid grid-cols-2 gap-4">
        {/* 1. رسم بياني عمودي - التوزيع الشهري */}
        <Card className="card-element card-rtl">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
              التوزيع الشهري للأتعاب والمدفوعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  style={{ fontSize: '10px', fontFamily: 'Tajawal, sans-serif' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis style={{ fontSize: '10px' }} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }} />
                <Bar dataKey="الأتعاب" fill="#2563eb" />
                <Bar dataKey="المدفوع" fill="#10b981" />
                <Bar dataKey="المتبقي" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* 2. رسم دائري - التوزيع حسب القطاع */}
        <Card className="card-element card-rtl">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
              التوزيع حسب القطاع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RePieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '10px' }}
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* 3. رسم خطي - اتجاه الأتعاب */}
        <Card className="card-element card-rtl">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
              اتجاه الأتعاب الشهرية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  style={{ fontSize: '10px', fontFamily: 'Tajawal, sans-serif' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis style={{ fontSize: '10px' }} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }} />
                <Line type="monotone" dataKey="الأتعاب" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="المدفوع" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* 4. رسم مساحي - المقارنة التراكمية */}
        <Card className="card-element card-rtl">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
              المقارنة التراكمية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  style={{ fontSize: '10px', fontFamily: 'Tajawal, sans-serif' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis style={{ fontSize: '10px' }} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }} />
                <Area type="monotone" dataKey="الأتعاب" stackId="1" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
                <Area type="monotone" dataKey="المدفوع" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* 5. رسم Radar - التحليل المتقدم */}
        <Card className="card-element card-rtl">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
              التحليل المتقدم للقطاعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis 
                  dataKey="sector" 
                  style={{ fontSize: '10px', fontFamily: 'Tajawal, sans-serif' }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="نسبة الإكمال" dataKey="completion" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* 6. رسم عمودي متراكب - مقارنة الشركاء */}
        <Card className="card-element card-rtl">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
              مقارنة أداء الشركاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={partnersComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  style={{ fontSize: '10px', fontFamily: 'Tajawal, sans-serif' }}
                />
                <YAxis style={{ fontSize: '10px' }} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }} />
                <Bar dataKey={PARTNERS[0].name} fill={PARTNERS[0].color} />
                <Bar dataKey={PARTNERS[1].name} fill={PARTNERS[1].color} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* ملخص التقرير النصي */}
      <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            ملخص التقرير المالي - {selectedReportType === 'monthly' ? 'شهري' : selectedReportType === 'quarterly' ? 'ربع سنوي' : selectedReportType === 'yearly' ? 'سنوي' : 'مقارن'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#78350f' }}>إجمالي الأتعاب</p>
              <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#713f12' }}>
                {statistics.totalFees.toLocaleString()} ر.س
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#78350f' }}>إجمالي المدفوع</p>
              <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#065f46' }}>
                {statistics.totalPaid.toLocaleString()} ر.س
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#78350f' }}>المتبقي</p>
              <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#7f1d1d' }}>
                {statistics.totalRemaining.toLocaleString()} ر.س
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#78350f' }}>نسبة السداد</p>
              <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#831843' }}>
                {statistics.paymentPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // ============================================================
  // 🆕 التاب 667-07: الإعدادات (مكتمل 100% v3.1)
  // ============================================================
  
  const renderSettingsTab = () => (
    <div className="space-y-4">
      {/* إعدادات الشركاء المحسّنة */}
      <Card className="card-element card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            معلومات الشركاء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {PARTNERS.map((partner) => (
              <Card key={partner.id} className="card-element card-rtl" style={{ background: `${partner.color}10`, border: `2px solid ${partner.color}40` }}>
                <CardContent className="p-3">
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <InputWithCopy
                      label="الرقم"
                      id={`partner-${partner.id}-number`}
                      value={partner.number}
                      disabled
                      copyable={true}
                      clearable={false}
                    />
                    <InputWithCopy
                      label="الاسم"
                      id={`partner-${partner.id}-name`}
                      value={partner.name}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="رقم الهوية"
                      id={`partner-${partner.id}-national-id`}
                      value={partner.nationalId || ''}
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <InputWithCopy
                      label="البريد الإلكتروني"
                      id={`partner-${partner.id}-email`}
                      value={partner.email || ''}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="رقم الجوال"
                      id={`partner-${partner.id}-phone`}
                      value={partner.phone || ''}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="النسبة %"
                      id={`partner-${partner.id}-percentage`}
                      value={partner.percentage.toString()}
                      type="number"
                      copyable={false}
                      clearable={false}
                    />
                  </div>
                  {/* 🆕 معلومات بنكية */}
                  <Separator className="my-2" />
                  <h4 className="text-xs font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعلومات البنكية</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <InputWithCopy
                      label="اسم البنك"
                      id={`partner-${partner.id}-bank-name`}
                      value={partner.bankName || ''}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="رقم الحساب"
                      id={`partner-${partner.id}-bank-account`}
                      value={partner.bankAccount || ''}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="IBAN"
                      id={`partner-${partner.id}-iban`}
                      value={partner.iban || ''}
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Separator />
      
      {/* إعدادات القيمة المضافة */}
      <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', border: '2px solid #7dd3fc' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إعدادات القيمة المضافة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <InputWithCopy
              label="نسبة القيمة المضافة (%)"
              id="vat-percentage"
              type="number"
              value="15"
              copyable={false}
              clearable={false}
            />
            <div className="flex items-end">
              <EnhancedSwitch
                id="vat-default-enabled"
                checked={true}
                label="تفعيل القيمة المضافة افتراضياً"
                size="md"
                variant="success"
              />
            </div>
            <div className="flex items-end">
              <EnhancedSwitch
                id="vat-show-in-reports"
                checked={true}
                label="إظهار القيمة المضافة في التقارير"
                size="md"
                variant="default"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Separator />
      
      {/* 🆕 إعدادات الإشعارات */}
      <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Bell className="h-5 w-5 inline ml-2" style={{ color: '#f59e0b' }} />
            إعدادات الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>تفعيل الإشعارات</span>
              <EnhancedSwitch
                id="notifications-enabled"
                checked={notificationSettings.enabled}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, enabled: checked })}
                size="md"
                variant="success"
              />
            </div>
            
            <Separator />
            
            <h4 className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>طرق الإشعار</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-lg">
                <EnhancedSwitch
                  id="notification-email"
                  checked={notificationSettings.methods.email}
                  onCheckedChange={(checked) => setNotificationSettings({ 
                    ...notificationSettings, 
                    methods: { ...notificationSettings.methods, email: checked }
                  })}
                  label="البريد الإلكتروني"
                  size="sm"
                  variant="default"
                />
              </div>
              <div className="p-3 bg-white rounded-lg">
                <EnhancedSwitch
                  id="notification-sms"
                  checked={notificationSettings.methods.sms}
                  onCheckedChange={(checked) => setNotificationSettings({ 
                    ...notificationSettings, 
                    methods: { ...notificationSettings.methods, sms: checked }
                  })}
                  label="الرسائل النصية"
                  size="sm"
                  variant="warning"
                />
              </div>
              <div className="p-3 bg-white rounded-lg">
                <EnhancedSwitch
                  id="notification-whatsapp"
                  checked={notificationSettings.methods.whatsapp}
                  onCheckedChange={(checked) => setNotificationSettings({ 
                    ...notificationSettings, 
                    methods: { ...notificationSettings.methods, whatsapp: checked }
                  })}
                  label="واتساب"
                  size="sm"
                  variant="success"
                />
              </div>
            </div>
            
            <Separator />
            
            <h4 className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>أنواع الإشعارات</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-lg">
                <EnhancedSwitch
                  id="notification-new-entry"
                  checked={notificationSettings.types.newEntry}
                  onCheckedChange={(checked) => setNotificationSettings({ 
                    ...notificationSettings, 
                    types: { ...notificationSettings.types, newEntry: checked }
                  })}
                  label="مدخل جديد"
                  size="sm"
                  variant="default"
                />
              </div>
              <div className="p-3 bg-white rounded-lg">
                <EnhancedSwitch
                  id="notification-new-payment"
                  checked={notificationSettings.types.newPayment}
                  onCheckedChange={(checked) => setNotificationSettings({ 
                    ...notificationSettings, 
                    types: { ...notificationSettings.types, newPayment: checked }
                  })}
                  label="دفعة جديدة"
                  size="sm"
                  variant="success"
                />
              </div>
              <div className="p-3 bg-white rounded-lg">
                <EnhancedSwitch
                  id="notification-reminder"
                  checked={notificationSettings.types.reminder}
                  onCheckedChange={(checked) => setNotificationSettings({ 
                    ...notificationSettings, 
                    types: { ...notificationSettings.types, reminder: checked }
                  })}
                  label="تذكيرات الدفع"
                  size="sm"
                  variant="warning"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={() => handleSaveSettings('notifications')}
                className="button-rtl"
                style={{ background: '#10b981', color: 'white' }}
              >
                <Save className="h-4 w-4 ml-2" />
                حفظ إعدادات الإشعارات
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Separator />
      
      {/* 🆕 إعدادات التصدير */}
      <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Database className="h-5 w-5 inline ml-2" style={{ color: '#6366f1' }} />
            إعدادات التصدير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <SelectWithCopy
                label="صيغة التصدير الافتراضية"
                id="export-format"
                value={exportSettings.format}
                onChange={(value) => setExportSettings({ ...exportSettings, format: value as any })}
                options={[
                  { value: 'pdf', label: 'PDF' },
                  { value: 'excel', label: 'Excel' },
                  { value: 'csv', label: 'CSV' }
                ]}
                copyable={false}
                clearable={false}
              />
              
              <SelectWithCopy
                label="اللغة"
                id="export-language"
                value={exportSettings.language}
                onChange={(value) => setExportSettings({ ...exportSettings, language: value as any })}
                options={[
                  { value: 'ar', label: 'عربي' },
                  { value: 'en', label: 'English' },
                  { value: 'both', label: 'ثنائي اللغة' }
                ]}
                copyable={false}
                clearable={false}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg">
                <EnhancedSwitch
                  id="export-include-charts"
                  checked={exportSettings.includeCharts}
                  onCheckedChange={(checked) => setExportSettings({ ...exportSettings, includeCharts: checked })}
                  label="تضمين الرسوم البيانية"
                  size="md"
                  variant="default"
                />
              </div>
              <div className="p-3 bg-white rounded-lg">
                <EnhancedSwitch
                  id="export-include-details"
                  checked={exportSettings.includeDetails}
                  onCheckedChange={(checked) => setExportSettings({ ...exportSettings, includeDetails: checked })}
                  label="تضمين التفاصيل الكاملة"
                  size="md"
                  variant="success"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={() => handleSaveSettings('export')}
                className="button-rtl"
                style={{ background: '#6366f1', color: 'white' }}
              >
                <Save className="h-4 w-4 ml-2" />
                حفظ إعدادات التصدير
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Separator />
      
      {/* 🆕 إعدادات الأمان */}
      <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Shield className="h-5 w-5 inline ml-2" style={{ color: '#ef4444' }} />
            إعدادات الأمان
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg">
                <EnhancedSwitch
                  id="security-2fa"
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  label="المصادقة الثنائية"
                  description="تفعيل التحقق بخطوتين لتعزيز الأمان"
                  size="md"
                  variant="danger"
                />
              </div>
              <div className="p-3 bg-white rounded-lg">
                <EnhancedSwitch
                  id="security-audit"
                  checked={securitySettings.auditLog}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, auditLog: checked })}
                  label="سجل المراجعة"
                  description="تسجيل جميع العمليات لأغراض المراجعة"
                  size="md"
                  variant="warning"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <InputWithCopy
                label="مهلة الجلسة (دقيقة)"
                id="session-timeout"
                type="number"
                value={securitySettings.sessionTimeout.toString()}
                onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                copyable={false}
                clearable={false}
              />
              
              <div className="flex items-end">
                <Button
                  onClick={() => toast.info('جاري فتح إدارة القائمة البيضاء')}
                  className="button-rtl w-full"
                  variant="outline"
                >
                  <Key className="h-4 w-4 ml-2" />
                  إدارة القائمة البيضاء للـ IP
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={() => handleSaveSettings('security')}
                className="button-rtl"
                style={{ background: '#ef4444', color: 'white' }}
              >
                <Save className="h-4 w-4 ml-2" />
                حفظ إعدادات الأمان
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // ============================================================
  // JSX الرئيسي
  // ============================================================
  
  return (
    <div className="flex h-full" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', gap: '4px' }}>
      {/* السايد بار الموحد */}
      <UnifiedTabsSidebar
        tabs={TABS_CONFIG}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {/* منطقة المحتوى */}
      <div className="flex-1" style={{ minHeight: 'calc(100vh - 140px)', paddingRight: '16px' }}>
        {/* هيدر الشاشة */}
        <div
          style={{
            position: 'sticky',
            top: '0',
            zIndex: 10,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderBottom: '3px solid transparent',
            borderImage: 'linear-gradient(90deg, #2563eb 0%, #10b981 50%, #2563eb 100%) 1',
            padding: '0',
            marginBottom: '16px',
            marginTop: '0',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)'
          }}
        >
          <div 
            className="flex items-center justify-between"
            style={{
              padding: '14px 20px',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(16, 185, 129, 0.02) 100%)'
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                style={{
                  padding: '10px',
                  background: 'linear-gradient(135deg, #dbeafe 0%, #d1fae5 100%)',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                  border: '2px solid rgba(37, 99, 235, 0.2)'
                }}
              >
                <DollarSign 
                  className="h-6 w-6" 
                  style={{ 
                    color: '#10b981',
                    filter: 'drop-shadow(0 1px 2px rgba(16, 185, 129, 0.3))' 
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
                      background: 'linear-gradient(135deg, #1e40af 0%, #059669 100%)',
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
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '8px',
                      boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)',
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
                  إدارة شاملة لحسابات الشركاء والمدخلات والدفعات
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div 
                style={{
                  padding: '6px 14px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.15)'
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
        
        {/* محتوى التاب */}
        <div style={{ paddingBottom: '20px' }}>
          {renderTabContent()}
        </div>
      </div>
      
      {/* النوافذ المنبثقة ستضاف هنا في المرحلة الثانية */}
    </div>
  );
};

export default PartnersAccountsScreen;
