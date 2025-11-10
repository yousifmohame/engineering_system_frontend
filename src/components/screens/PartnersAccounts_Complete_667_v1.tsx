/**
 * الشاشة 667 - حسابات الشركاء v1.0
 * ======================================
 * 
 * شاشة شاملة لإدارة حسابات الشركاء مع:
 * - إدخال مدخلات مشتركة وفردية
 * - توزيع الأتعاب والنسب
 * - سجل السداد والدفع
 * - تابات سرية لكل شريك
 * - تقارير مالية تفصيلية
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { 
  DollarSign, Users, FileText, Plus, Calendar, MapPin, Building2, 
  TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, AlertCircle,
  Receipt, Wallet, CreditCard, Banknote, History, Settings, BarChart3,
  Eye, Edit, Trash2, Download, Filter, Search, RefreshCw, Save,
  UserCheck, Lock, Unlock, Share2, ArrowUpRight, ArrowDownRight,
  PieChart, Calculator, Briefcase, Shield
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
  name: string;
  percentage: number; // النسبة من الأتعاب
  color: string;
}

interface ExternalParty {
  name: string;
  type: 'percentage' | 'fixed'; // نسبة مئوية أو مبلغ ثابت
  value: number;
}

interface Entry {
  id: string;
  description: string; // وصف المعاملة
  serviceNumber: string; // رقم الطلب/الخدمة
  hijriYear: string; // السنة الهجرية
  licenseNumber: string; // رقم الرخصة
  licenseYear: string; // تاريخ الرخصة (سنة هجرية)
  sector: string; // القطاع
  district: string; // الحي
  totalFees: number; // إجمالي الأتعاب
  
  // توزيع الأتعاب
  partner1Share: number; // حصة الشريك الأول (نسبة مئوية)
  partner2Share: number; // حصة الشريك الثاني (نسبة مئوية)
  externalParty?: ExternalParty; // طرف خارجي (اختياري)
  
  // معلومات السداد
  payments: Payment[];
  
  // معلومات إضافية
  isPrivate: boolean; // مدخل خاص بشريك معين
  privateForPartner?: string; // معرف الشريك (إذا كان خاصاً)
  isVATIncluded: boolean; // خاضع للقيمة المضافة
  vatAmount: number; // مبلغ القيمة المضافة
  createdDate: string;
  createdBy: string;
  notes: string;
}

interface Payment {
  id: string;
  entryId: string;
  recipient: string; // partner1 | partner2 | external
  recipientName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'bank-transfer' | 'check' | 'other';
  paymentMethodDetails: string;
  isPartial: boolean; // دفع جزئي
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
// الشركاء الافتراضيين
// ============================================================

const PARTNERS: Partner[] = [
  { id: 'partner1', name: 'الشريك الأول', percentage: 50, color: '#2563eb' },
  { id: 'partner2', name: 'الشريك الثاني', percentage: 50, color: '#10b981' }
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
// المكون الرئيسي
// ============================================================

const PartnersAccounts_Complete_667_v1: React.FC = () => {
  // الحالات
  const [activeTab, setActiveTab] = useState('667-01');
  
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
      externalParty: undefined,
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
    {
      id: 'ENT-2024-006',
      description: 'رخصة بناء تجاري - حي الربوة',
      serviceNumber: '2502567',
      hijriYear: '1446',
      licenseNumber: 'L-2024-7012',
      licenseYear: '1446',
      sector: 'التجاري',
      district: 'الربوة',
      totalFees: 95000,
      partner1Share: 50,
      partner2Share: 50,
      payments: [],
      isPrivate: false,
      isVATIncluded: true,
      vatAmount: 14250,
      createdDate: '2024-11-12T10:00:00',
      createdBy: 'أحمد محمد',
      notes: 'معرض تجاري + مخزن'
    },
    {
      id: 'ENT-2024-007',
      description: 'رخصة بناء سكني - حي النرجس',
      serviceNumber: '2502890',
      hijriYear: '1446',
      licenseNumber: 'L-2024-7345',
      licenseYear: '1446',
      sector: 'السكني',
      district: 'النرجس',
      totalFees: 75000,
      partner1Share: 60,
      partner2Share: 40,
      payments: [],
      isPrivate: false,
      isVATIncluded: false,
      vatAmount: 0,
      createdDate: '2024-11-15T14:30:00',
      createdBy: 'خالد علي',
      notes: 'دوبلكس سكني'
    },
    {
      id: 'ENT-2024-008',
      description: 'رخصة بناء تعليمي - حي الرمال',
      serviceNumber: '2503123',
      hijriYear: '1446',
      licenseNumber: 'L-2024-7678',
      licenseYear: '1446',
      sector: 'التعليمي',
      district: 'الرمال',
      totalFees: 180000,
      partner1Share: 50,
      partner2Share: 40,
      externalParty: { name: 'مهندس استشاري', type: 'percentage', value: 10 },
      payments: [],
      isPrivate: false,
      isVATIncluded: true,
      vatAmount: 27000,
      createdDate: '2024-11-18T09:15:00',
      createdBy: 'أحمد محمد',
      notes: 'روضة أطفال - مرافق كاملة'
    },
    {
      id: 'ENT-2024-009',
      description: 'رخصة بناء سكني - حي الملز',
      serviceNumber: '2503456',
      hijriYear: '1446',
      licenseNumber: 'L-2024-7901',
      licenseYear: '1446',
      sector: 'السكني',
      district: 'الملز',
      totalFees: 55000,
      partner1Share: 50,
      partner2Share: 50,
      payments: [],
      isPrivate: false,
      isVATIncluded: false,
      vatAmount: 0,
      createdDate: '2024-11-20T11:00:00',
      createdBy: 'خالد علي',
      notes: 'فيلا صغيرة - دور واحد'
    },
    {
      id: 'ENT-2024-010',
      description: 'رخصة بناء تجاري - حي العليا',
      serviceNumber: '2503789',
      hijriYear: '1446',
      licenseNumber: 'L-2024-8234',
      licenseYear: '1446',
      sector: 'التجاري',
      district: 'العليا',
      totalFees: 135000,
      partner1Share: 50,
      partner2Share: 50,
      payments: [],
      isPrivate: false,
      isVATIncluded: true,
      vatAmount: 20250,
      createdDate: '2024-11-22T13:30:00',
      createdBy: 'أحمد محمد',
      notes: 'صالة عرض + مكاتب إدارية'
    },
    {
      id: 'ENT-2024-011',
      description: 'رخصة بناء صناعي - حي النخيل',
      serviceNumber: '2504012',
      hijriYear: '1446',
      licenseNumber: 'L-2024-8567',
      licenseYear: '1446',
      sector: 'الصناعي',
      district: 'النخيل',
      totalFees: 200000,
      partner1Share: 60,
      partner2Share: 40,
      payments: [],
      isPrivate: false,
      isVATIncluded: true,
      vatAmount: 30000,
      createdDate: '2024-11-25T10:45:00',
      createdBy: 'خالد علي',
      notes: 'ورشة تصنيع'
    },
    {
      id: 'ENT-2024-012',
      description: 'رخصة بناء سكني - حي الورود',
      serviceNumber: '2504345',
      hijriYear: '1446',
      licenseNumber: 'L-2024-8890',
      licenseYear: '1446',
      sector: 'السكني',
      district: 'الورود',
      totalFees: 70000,
      partner1Share: 50,
      partner2Share: 50,
      payments: [],
      isPrivate: false,
      isVATIncluded: false,
      vatAmount: 0,
      createdDate: '2024-11-27T12:00:00',
      createdBy: 'أحمد محمد',
      notes: 'عمارة سكنية 3 شقق'
    },
    {
      id: 'ENT-2024-013',
      description: 'رخصة بناء تجاري - حي الياسمين',
      serviceNumber: '2504678',
      hijriYear: '1446',
      licenseNumber: 'L-2024-9123',
      licenseYear: '1446',
      sector: 'التجاري',
      district: 'الياسمين',
      totalFees: 110000,
      partner1Share: 50,
      partner2Share: 50,
      payments: [],
      isPrivate: false,
      isVATIncluded: true,
      vatAmount: 16500,
      createdDate: '2024-11-29T14:20:00',
      createdBy: 'خالد علي',
      notes: 'مطعم + كافيه'
    },
    {
      id: 'ENT-2024-014',
      description: 'رخصة بناء إداري - حي الربوة',
      serviceNumber: '2504901',
      hijriYear: '1446',
      licenseNumber: 'L-2024-9456',
      licenseYear: '1446',
      sector: 'الإداري',
      district: 'الربوة',
      totalFees: 145000,
      partner1Share: 50,
      partner2Share: 50,
      payments: [],
      isPrivate: false,
      isVATIncluded: true,
      vatAmount: 21750,
      createdDate: '2024-12-01T09:30:00',
      createdBy: 'أحمد محمد',
      notes: 'برج إداري 8 أدوار'
    },
    {
      id: 'ENT-2024-015',
      description: 'رخصة بناء سكني - حي النرجس',
      serviceNumber: '2505234',
      hijriYear: '1446',
      licenseNumber: 'L-2024-9789',
      licenseYear: '1446',
      sector: 'السكني',
      district: 'النرجس',
      totalFees: 90000,
      partner1Share: 50,
      partner2Share: 50,
      payments: [],
      isPrivate: false,
      isVATIncluded: false,
      vatAmount: 0,
      createdDate: '2024-12-03T11:45:00',
      createdBy: 'خالد علي',
      notes: 'فيلا فاخرة - 3 أدوار + ملحق'
    },
    
    // مدخلات خاصة بالشريك الأول (5 مدخلات)
    {
      id: 'ENT-P1-001',
      description: 'مشروع خاص - استشارات هندسية',
      serviceNumber: 'P1-2024-001',
      hijriYear: '1446',
      licenseNumber: '',
      licenseYear: '',
      sector: 'الإداري',
      district: 'الملز',
      totalFees: 120000,
      partner1Share: 100,
      partner2Share: 0,
      payments: [],
      isPrivate: true,
      privateForPartner: 'partner1',
      isVATIncluded: true,
      vatAmount: 18000,
      createdDate: '2024-11-02T10:00:00',
      createdBy: 'الشريك الأول',
      notes: 'مشروع خاص - سري'
    },
    {
      id: 'ENT-P1-002',
      description: 'عقد تصميم معماري خاص',
      serviceNumber: 'P1-2024-002',
      hijriYear: '1446',
      licenseNumber: '',
      licenseYear: '',
      sector: 'السكني',
      district: 'العليا',
      totalFees: 85000,
      partner1Share: 100,
      partner2Share: 0,
      payments: [],
      isPrivate: true,
      privateForPartner: 'partner1',
      isVATIncluded: false,
      vatAmount: 0,
      createdDate: '2024-11-07T13:00:00',
      createdBy: 'الشريك الأول',
      notes: 'عميل خاص'
    },
    {
      id: 'ENT-P1-003',
      description: 'مشروع إشراف خاص',
      serviceNumber: 'P1-2024-003',
      hijriYear: '1446',
      licenseNumber: '',
      licenseYear: '',
      sector: 'التجاري',
      district: 'النخيل',
      totalFees: 180000,
      partner1Share: 100,
      partner2Share: 0,
      payments: [],
      isPrivate: true,
      privateForPartner: 'partner1',
      isVATIncluded: true,
      vatAmount: 27000,
      createdDate: '2024-11-14T09:30:00',
      createdBy: 'الشريك الأول',
      notes: 'إشراف كامل على مشروع تجاري'
    },
    {
      id: 'ENT-P1-004',
      description: 'استشارات فنية متخصصة',
      serviceNumber: 'P1-2024-004',
      hijriYear: '1446',
      licenseNumber: '',
      licenseYear: '',
      sector: 'الصناعي',
      district: 'الورود',
      totalFees: 90000,
      partner1Share: 100,
      partner2Share: 0,
      payments: [],
      isPrivate: true,
      privateForPartner: 'partner1',
      isVATIncluded: true,
      vatAmount: 13500,
      createdDate: '2024-11-21T11:00:00',
      createdBy: 'الشريك الأول',
      notes: 'مشروع صناعي متخصص'
    },
    {
      id: 'ENT-P1-005',
      description: 'تصميم داخلي حصري',
      serviceNumber: 'P1-2024-005',
      hijriYear: '1446',
      licenseNumber: '',
      licenseYear: '',
      sector: 'السكني',
      district: 'الياسمين',
      totalFees: 35000,
      partner1Share: 100,
      partner2Share: 0,
      payments: [],
      isPrivate: true,
      privateForPartner: 'partner1',
      isVATIncluded: false,
      vatAmount: 0,
      createdDate: '2024-11-28T14:30:00',
      createdBy: 'الشريك الأول',
      notes: 'تصميم فيلا VIP'
    },
    
    // مدخلات خاصة بالشريك الثاني (5 مدخلات)
    {
      id: 'ENT-P2-001',
      description: 'مشروع دراسات جدوى',
      serviceNumber: 'P2-2024-001',
      hijriYear: '1446',
      licenseNumber: '',
      licenseYear: '',
      sector: 'التجاري',
      district: 'الربوة',
      totalFees: 95000,
      partner1Share: 0,
      partner2Share: 100,
      payments: [],
      isPrivate: true,
      privateForPartner: 'partner2',
      isVATIncluded: true,
      vatAmount: 14250,
      createdDate: '2024-11-04T10:15:00',
      createdBy: 'الشريك الثاني',
      notes: 'دراسة جدوى لمركز تجاري'
    },
    {
      id: 'ENT-P2-002',
      description: 'تصميم إنشائي خاص',
      serviceNumber: 'P2-2024-002',
      hijriYear: '1446',
      licenseNumber: '',
      licenseYear: '',
      sector: 'السكني',
      district: 'النرجس',
      totalFees: 75000,
      partner1Share: 0,
      partner2Share: 100,
      payments: [],
      isPrivate: true,
      privateForPartner: 'partner2',
      isVATIncluded: false,
      vatAmount: 0,
      createdDate: '2024-11-11T12:00:00',
      createdBy: 'الشريك الثاني',
      notes: 'تصميم منزل مستقل'
    },
    {
      id: 'ENT-P2-003',
      description: 'استشارات MEP متقدمة',
      serviceNumber: 'P2-2024-003',
      hijriYear: '1446',
      licenseNumber: '',
      licenseYear: '',
      sector: 'الإداري',
      district: 'الرمال',
      totalFees: 150000,
      partner1Share: 0,
      partner2Share: 100,
      payments: [],
      isPrivate: true,
      privateForPartner: 'partner2',
      isVATIncluded: true,
      vatAmount: 22500,
      createdDate: '2024-11-17T09:45:00',
      createdBy: 'الشريك الثاني',
      notes: 'أنظمة MEP كاملة لمبنى إداري'
    },
    {
      id: 'ENT-P2-004',
      description: 'مشروع بحثي خاص',
      serviceNumber: 'P2-2024-004',
      hijriYear: '1446',
      licenseNumber: '',
      licenseYear: '',
      sector: 'التعليمي',
      district: 'الملز',
      totalFees: 62000,
      partner1Share: 0,
      partner2Share: 100,
      payments: [],
      isPrivate: true,
      privateForPartner: 'partner2',
      isVATIncluded: true,
      vatAmount: 9300,
      createdDate: '2024-11-24T13:20:00',
      createdBy: 'الشريك الثاني',
      notes: 'بحث علمي متخصص'
    },
    {
      id: 'ENT-P2-005',
      description: 'تقييم عقاري',
      serviceNumber: 'P2-2024-005',
      hijriYear: '1446',
      licenseNumber: '',
      licenseYear: '',
      sector: 'السكني',
      district: 'العليا',
      totalFees: 28000,
      partner1Share: 0,
      partner2Share: 100,
      payments: [],
      isPrivate: true,
      privateForPartner: 'partner2',
      isVATIncluded: false,
      vatAmount: 0,
      createdDate: '2024-12-02T15:00:00',
      createdBy: 'الشريك الثاني',
      notes: 'تقييم فيلتين'
    }
  ];

  const MOCK_PAYMENTS: Payment[] = [
    // دفعات للمدخلات المشتركة
    { id: 'PAY-001', entryId: 'ENT-2024-001', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 42500, paymentDate: '2024-11-05', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل بنك الراجحي', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-05T14:00:00' },
    { id: 'PAY-002', entryId: 'ENT-2024-001', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 42500, paymentDate: '2024-11-05', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل بنك الراجحي', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-05T14:00:00' },
    
    { id: 'PAY-003', entryId: 'ENT-2024-002', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 90000, paymentDate: '2024-11-08', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل البنك الأهلي', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-08T10:00:00' },
    { id: 'PAY-004', entryId: 'ENT-2024-002', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 60000, paymentDate: '2024-11-08', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل البنك الأهلي', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-08T10:00:00' },
    
    { id: 'PAY-005', entryId: 'ENT-2024-003', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 125000, paymentDate: '2024-11-10', paymentMethod: 'check', paymentMethodDetails: 'شيك رقم 45678', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-10T11:00:00' },
    { id: 'PAY-006', entryId: 'ENT-2024-003', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 75000, paymentDate: '2024-11-10', paymentMethod: 'check', paymentMethodDetails: 'شيك رقم 45679', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-10T11:00:00' },
    { id: 'PAY-007', entryId: 'ENT-2024-003', recipient: 'external', recipientName: 'مكتب استشاري خارجي', amount: 50000, paymentDate: '2024-11-10', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل بنك الإنماء', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-10T11:00:00' },
    
    { id: 'PAY-008', entryId: 'ENT-2024-004', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 32500, paymentDate: '2024-11-12', paymentMethod: 'cash', paymentMethodDetails: '', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-12T09:00:00' },
    { id: 'PAY-009', entryId: 'ENT-2024-004', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 32500, paymentDate: '2024-11-12', paymentMethod: 'cash', paymentMethodDetails: '', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-12T09:00:00' },
    
    { id: 'PAY-010', entryId: 'ENT-2024-005', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 84000, paymentDate: '2024-11-15', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل بنك الراجحي', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-15T13:00:00' },
    { id: 'PAY-011', entryId: 'ENT-2024-005', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 36000, paymentDate: '2024-11-15', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل بنك الراجحي', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-15T13:00:00' },
    
    { id: 'PAY-012', entryId: 'ENT-2024-006', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 47500, paymentDate: '2024-11-17', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل البنك الأهلي', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-17T10:00:00' },
    { id: 'PAY-013', entryId: 'ENT-2024-006', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 47500, paymentDate: '2024-11-17', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل البنك الأهلي', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-17T10:00:00' },
    
    { id: 'PAY-014', entryId: 'ENT-2024-007', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 45000, paymentDate: '2024-11-19', paymentMethod: 'check', paymentMethodDetails: 'شيك رقم 56789', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-19T11:00:00' },
    { id: 'PAY-015', entryId: 'ENT-2024-007', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 30000, paymentDate: '2024-11-19', paymentMethod: 'check', paymentMethodDetails: 'شيك رقم 56790', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-19T11:00:00' },
    
    { id: 'PAY-016', entryId: 'ENT-2024-008', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 60000, paymentDate: '2024-11-21', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل بنك الإنماء', isPartial: true, notes: 'دفعة أولى', paidBy: 'المدير المالي', createdDate: '2024-11-21T09:00:00' },
    { id: 'PAY-017', entryId: 'ENT-2024-008', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 48000, paymentDate: '2024-11-21', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل بنك الإنماء', isPartial: true, notes: 'دفعة أولى', paidBy: 'المدير المالي', createdDate: '2024-11-21T09:00:00' },
    { id: 'PAY-018', entryId: 'ENT-2024-008', recipient: 'external', recipientName: 'مهندس استشاري', amount: 18000, paymentDate: '2024-11-21', paymentMethod: 'cash', paymentMethodDetails: '', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-21T09:00:00' },
    
    { id: 'PAY-019', entryId: 'ENT-2024-009', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 27500, paymentDate: '2024-11-23', paymentMethod: 'cash', paymentMethodDetails: '', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-23T10:00:00' },
    { id: 'PAY-020', entryId: 'ENT-2024-009', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 27500, paymentDate: '2024-11-23', paymentMethod: 'cash', paymentMethodDetails: '', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-23T10:00:00' },
    
    { id: 'PAY-021', entryId: 'ENT-2024-010', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 67500, paymentDate: '2024-11-25', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل بنك الراجحي', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-25T14:00:00' },
    { id: 'PAY-022', entryId: 'ENT-2024-010', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 67500, paymentDate: '2024-11-25', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل بنك الراجحي', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-25T14:00:00' },
    
    { id: 'PAY-023', entryId: 'ENT-2024-011', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 120000, paymentDate: '2024-11-27', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل البنك الأهلي', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-27T11:00:00' },
    { id: 'PAY-024', entryId: 'ENT-2024-011', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 80000, paymentDate: '2024-11-27', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل البنك الأهلي', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-27T11:00:00' },
    
    { id: 'PAY-025', entryId: 'ENT-2024-012', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 35000, paymentDate: '2024-11-29', paymentMethod: 'check', paymentMethodDetails: 'شيك رقم 67890', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-29T13:00:00' },
    { id: 'PAY-026', entryId: 'ENT-2024-012', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 35000, paymentDate: '2024-11-29', paymentMethod: 'check', paymentMethodDetails: 'شيك رقم 67891', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-29T13:00:00' },
    
    { id: 'PAY-027', entryId: 'ENT-2024-013', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 30000, paymentDate: '2024-12-01', paymentMethod: 'cash', paymentMethodDetails: '', isPartial: true, notes: 'دفعة جزئية', paidBy: 'المدير المالي', createdDate: '2024-12-01T10:00:00' },
    { id: 'PAY-028', entryId: 'ENT-2024-013', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 30000, paymentDate: '2024-12-01', paymentMethod: 'cash', paymentMethodDetails: '', isPartial: true, notes: 'دفعة جزئية', paidBy: 'المدير المالي', createdDate: '2024-12-01T10:00:00' },
    
    // دفعات للمدخلات الخاصة بالشريك الأول
    { id: 'PAY-029', entryId: 'ENT-P1-001', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 120000, paymentDate: '2024-11-06', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل بنك الراجحي', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-06T15:00:00' },
    { id: 'PAY-030', entryId: 'ENT-P1-002', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 85000, paymentDate: '2024-11-09', paymentMethod: 'cash', paymentMethodDetails: '', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-09T14:00:00' },
    { id: 'PAY-031', entryId: 'ENT-P1-003', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 100000, paymentDate: '2024-11-16', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل البنك الأهلي', isPartial: true, notes: 'دفعة أولى', paidBy: 'المدير المالي', createdDate: '2024-11-16T10:00:00' },
    { id: 'PAY-032', entryId: 'ENT-P1-004', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 90000, paymentDate: '2024-11-23', paymentMethod: 'check', paymentMethodDetails: 'شيك رقم 78901', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-23T11:00:00' },
    { id: 'PAY-033', entryId: 'ENT-P1-005', recipient: 'partner1', recipientName: 'الشريك الأول', amount: 35000, paymentDate: '2024-11-30', paymentMethod: 'cash', paymentMethodDetails: '', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-30T15:00:00' },
    
    // دفعات للمدخلات الخاصة بالشريك الثاني
    { id: 'PAY-034', entryId: 'ENT-P2-001', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 95000, paymentDate: '2024-11-07', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل بنك الإنماء', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-07T14:00:00' },
    { id: 'PAY-035', entryId: 'ENT-P2-002', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 75000, paymentDate: '2024-11-13', paymentMethod: 'cash', paymentMethodDetails: '', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-13T13:00:00' },
    { id: 'PAY-036', entryId: 'ENT-P2-003', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 80000, paymentDate: '2024-11-19', paymentMethod: 'bank-transfer', paymentMethodDetails: 'تحويل بنك الراجحي', isPartial: true, notes: 'دفعة أولى', paidBy: 'المدير المالي', createdDate: '2024-11-19T09:00:00' },
    { id: 'PAY-037', entryId: 'ENT-P2-004', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 62000, paymentDate: '2024-11-26', paymentMethod: 'check', paymentMethodDetails: 'شيك رقم 89012', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-11-26T12:00:00' },
    { id: 'PAY-038', entryId: 'ENT-P2-005', recipient: 'partner2', recipientName: 'الشريك الثاني', amount: 28000, paymentDate: '2024-12-03', paymentMethod: 'cash', paymentMethodDetails: '', isPartial: false, notes: '', paidBy: 'المدير المالي', createdDate: '2024-12-03T16:00:00' }
  ];
  
  const [entries, setEntries] = useState<Entry[]>(MOCK_ENTRIES);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  
  // حالات النماذج
  const [showAddEntryDialog, setShowAddEntryDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  
  // فلاتر
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'year' | '30days'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  
  // نموذج إضافة مدخل
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

  // حفظ مدخل جديد
  const handleSaveEntry = () => {
    if (!newEntry.description || !newEntry.serviceNumber || !newEntry.totalFees) {
      toast.error('يرجى تعبئة الحقول الإلزامية');
      return;
    }
    
    // التحقق من مجموع النسب
    const totalPercentage = (newEntry.partner1Share || 0) + (newEntry.partner2Share || 0);
    if (newEntry.externalParty && newEntry.externalParty.type === 'percentage') {
      if (totalPercentage + newEntry.externalParty.value !== 100) {
        toast.error('مجموع النسب يجب أن يساوي 100%');
        return;
      }
    } else if (totalPercentage !== 100) {
      toast.error('مجموع نسب الشركاء يجب أن يساوي 100%');
      return;
    }
    
    const entry: Entry = {
      id: `ENT-${Date.now()}`,
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
      payments: [],
      isPrivate: newEntry.isPrivate || false,
      privateForPartner: newEntry.privateForPartner,
      isVATIncluded: newEntry.isVATIncluded || false,
      vatAmount: newEntry.isVATIncluded ? (newEntry.totalFees! * 0.15) : 0,
      createdDate: new Date().toISOString(),
      createdBy: 'النظام',
      notes: newEntry.notes || ''
    };
    
    setEntries([...entries, entry]);
    setShowAddEntryDialog(false);
    resetNewEntry();
    toast.success('تم إضافة المدخل بنجاح');
  };

  // حفظ دفعة
  const handleSavePayment = () => {
    if (!selectedEntry || !newPayment.recipient || !newPayment.amount) {
      toast.error('يرجى تعبئة جميع الحقول');
      return;
    }
    
    const payment: Payment = {
      id: `PAY-${Date.now()}`,
      entryId: selectedEntry.id,
      recipient: newPayment.recipient!,
      recipientName: newPayment.recipientName!,
      amount: newPayment.amount!,
      paymentDate: newPayment.paymentDate!,
      paymentMethod: newPayment.paymentMethod!,
      paymentMethodDetails: newPayment.paymentMethodDetails || '',
      isPartial: newPayment.isPartial || false,
      notes: newPayment.notes || '',
      paidBy: newPayment.paidBy || 'المدير المالي',
      createdDate: new Date().toISOString()
    };
    
    setPayments([...payments, payment]);
    setShowPaymentDialog(false);
    resetNewPayment();
    toast.success('تم تسجيل الدفعة بنجاح');
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
  // التاب 667-01: إضافة مدخل جديد
  // ============================================================

  const renderTab01_AddEntry = () => (
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

      {/* نموذج الإضافة */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة مدخل جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* معلومات أساسية */}
            <div className="grid grid-cols-2 gap-3">
              <InputWithCopy
                label="وصف المعاملة *"
                id="description"
                value={newEntry.description || ''}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                placeholder="أدخل وصف المعاملة"
                required
                copyable={true}
                clearable={true}
              />

              <InputWithCopy
                label="رقم الطلب/الخدمة *"
                id="serviceNumber"
                value={newEntry.serviceNumber || ''}
                onChange={(e) => setNewEntry({ ...newEntry, serviceNumber: e.target.value })}
                placeholder="رقم الطلب"
                required
                copyable={true}
                clearable={true}
              />
            </div>

            <div className="grid grid-cols-4 gap-3">
              <SelectWithCopy
                label="السنة الهجرية"
                id="hijriYear"
                value={newEntry.hijriYear || ''}
                onChange={(value) => setNewEntry({ ...newEntry, hijriYear: value })}
                options={HIJRI_YEARS.map(y => ({ value: y, label: y }))}
                copyable={true}
                clearable={true}
              />

              <InputWithCopy
                label="رقم الرخصة"
                id="licenseNumber"
                value={newEntry.licenseNumber || ''}
                onChange={(e) => setNewEntry({ ...newEntry, licenseNumber: e.target.value })}
                placeholder="رقم الرخصة"
                copyable={true}
                clearable={true}
              />

              <SelectWithCopy
                label="سنة الرخصة (هجري)"
                id="licenseYear"
                value={newEntry.licenseYear || ''}
                onChange={(value) => setNewEntry({ ...newEntry, licenseYear: value })}
                options={HIJRI_YEARS.map(y => ({ value: y, label: y }))}
                copyable={true}
                clearable={true}
              />

              <InputWithCopy
                label="إجمالي الأتعاب *"
                id="totalFees"
                type="number"
                value={newEntry.totalFees?.toString() || '0'}
                onChange={(e) => setNewEntry({ ...newEntry, totalFees: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                required
                copyable={true}
                clearable={true}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SelectWithCopy
                label="القطاع"
                id="sector"
                value={newEntry.sector || ''}
                onChange={(value) => setNewEntry({ ...newEntry, sector: value })}
                options={SECTORS.map(s => ({ value: s, label: s }))}
                copyable={true}
                clearable={true}
              />

              <SelectWithCopy
                label="الحي"
                id="district"
                value={newEntry.district || ''}
                onChange={(value) => setNewEntry({ ...newEntry, district: value })}
                options={DISTRICTS.map(d => ({ value: d, label: d }))}
                copyable={true}
                clearable={true}
              />
            </div>

            <Separator />

            {/* توزيع الأتعاب */}
            <div>
              <h3 className="text-base font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                توزيع الأتعاب
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <InputWithCopy
                  label="نسبة الشريك الأول (%)"
                  id="partner1Share"
                  type="number"
                  value={newEntry.partner1Share?.toString() || '50'}
                  onChange={(e) => setNewEntry({ ...newEntry, partner1Share: parseFloat(e.target.value) || 0 })}
                  placeholder="50"
                  copyable={true}
                  clearable={true}
                />

                <InputWithCopy
                  label="نسبة الشريك الثاني (%)"
                  id="partner2Share"
                  type="number"
                  value={newEntry.partner2Share?.toString() || '50'}
                  onChange={(e) => setNewEntry({ ...newEntry, partner2Share: parseFloat(e.target.value) || 0 })}
                  placeholder="50"
                  copyable={true}
                  clearable={true}
                />
              </div>

              {/* عرض المبالغ المحسوبة */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Card style={{ background: '#dbeafe', border: '2px solid #93c5fd' }}>
                  <CardContent className="p-2">
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      حصة الشريك الأول
                    </p>
                    <p className="text-lg font-bold text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {((newEntry.totalFees || 0) * ((newEntry.partner1Share || 50) / 100)).toLocaleString()} ر.س
                    </p>
                  </CardContent>
                </Card>

                <Card style={{ background: '#dcfce7', border: '2px solid #86efac' }}>
                  <CardContent className="p-2">
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      حصة الشريك الثاني
                    </p>
                    <p className="text-lg font-bold text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {((newEntry.totalFees || 0) * ((newEntry.partner2Share || 50) / 100)).toLocaleString()} ر.س
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* طرف خارجي */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <EnhancedSwitch
                    id="hasExternalParty"
                    checked={!!newEntry.externalParty}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewEntry({
                          ...newEntry,
                          externalParty: { name: '', type: 'percentage', value: 0 }
                        });
                      } else {
                        setNewEntry({ ...newEntry, externalParty: undefined });
                      }
                    }}
                    label="يوجد طرف خارجي"
                  />
                </div>

                {newEntry.externalParty && (
                  <div className="grid grid-cols-3 gap-3 p-3 rounded" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                    <InputWithCopy
                      label="اسم الطرف الخارجي"
                      id="externalPartyName"
                      value={newEntry.externalParty.name}
                      onChange={(e) => setNewEntry({
                        ...newEntry,
                        externalParty: { ...newEntry.externalParty!, name: e.target.value }
                      })}
                      placeholder="اسم الطرف"
                      copyable={true}
                      clearable={true}
                    />

                    <SelectWithCopy
                      label="نوع الحصة"
                      id="externalPartyType"
                      value={newEntry.externalParty.type}
                      onChange={(value) => setNewEntry({
                        ...newEntry,
                        externalParty: { ...newEntry.externalParty!, type: value as 'percentage' | 'fixed' }
                      })}
                      options={[
                        { value: 'percentage', label: 'نسبة مئوية (%)' },
                        { value: 'fixed', label: 'مبلغ ثابت (ر.س)' }
                      ]}
                      copyable={false}
                      clearable={false}
                    />

                    <InputWithCopy
                      label={newEntry.externalParty.type === 'percentage' ? 'النسبة (%)' : 'المبلغ (ر.س)'}
                      id="externalPartyValue"
                      type="number"
                      value={newEntry.externalParty.value.toString()}
                      onChange={(e) => setNewEntry({
                        ...newEntry,
                        externalParty: { ...newEntry.externalParty!, value: parseFloat(e.target.value) || 0 }
                      })}
                      placeholder="0"
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* إعدادات إضافية */}
            <div className="grid grid-cols-2 gap-3">
              <EnhancedSwitch
                id="isPrivate"
                checked={newEntry.isPrivate || false}
                onCheckedChange={(checked) => setNewEntry({ ...newEntry, isPrivate: checked })}
                label="مدخل خاص بشريك معين"
                description="لن يظهر للشريك الآخر"
              />

              <EnhancedSwitch
                id="isVATIncluded"
                checked={newEntry.isVATIncluded || false}
                onCheckedChange={(checked) => setNewEntry({ 
                  ...newEntry, 
                  isVATIncluded: checked,
                  vatAmount: checked ? ((newEntry.totalFees || 0) * 0.15) : 0
                })}
                label="خاضع للقيمة المضافة (15%)"
              />
            </div>

            {newEntry.isPrivate && (
              <SelectWithCopy
                label="الشريك المختص"
                id="privateForPartner"
                value={newEntry.privateForPartner || ''}
                onChange={(value) => setNewEntry({ ...newEntry, privateForPartner: value })}
                options={[
                  { value: 'partner1', label: 'الشريك الأول' },
                  { value: 'partner2', label: 'الشريك الثاني' }
                ]}
                copyable={false}
                clearable={false}
              />
            )}

            {newEntry.isVATIncluded && (
              <Card style={{ background: '#f3e8ff', border: '2px solid #c084fc' }}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        قيمة الضريبة المضافة (15%)
                      </p>
                      <p className="text-xl font-bold text-purple-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {newEntry.vatAmount?.toLocaleString()} ر.س
                      </p>
                    </div>
                    <Calculator className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            )}

            <TextAreaWithCopy
              label="ملاحظات"
              id="notes"
              value={newEntry.notes || ''}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              rows={3}
              placeholder="ملاحظات إضافية..."
              copyable={true}
              clearable={true}
            />

            {/* أزرار الإجراءات */}
            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button variant="outline" onClick={resetNewEntry}>
                <XCircle className="h-4 w-4 ml-1" />
                إعادة تعيين
              </Button>
              <Button 
                onClick={handleSaveEntry}
                style={{ background: '#10b981', color: '#fff' }}
              >
                <Save className="h-4 w-4 ml-1" />
                حفظ المدخل
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 667-02: قائمة المدخلات والسداد
  // ============================================================

  const renderTab02_EntriesList = () => {
    // حساب المدفوع والمتبقي لكل مدخل
    const entriesWithPayments = entries.map(entry => {
      const entryPayments = payments.filter(p => p.entryId === entry.id);
      const totalPaid = entryPayments.reduce((sum, p) => sum + p.amount, 0);
      const remaining = entry.totalFees - totalPaid;
      
      return {
        ...entry,
        totalPaid,
        remaining,
        payments: entryPayments
      };
    });

    return (
      <div className="space-y-4">
        {/* فلاتر */}
        <Card>
          <CardContent className="p-3">
            <div className="grid grid-cols-4 gap-3">
              <InputWithCopy
                label="بحث"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بالوصف أو رقم الطلب..."
                copyable={false}
                clearable={true}
              />

              <SelectWithCopy
                label="الفترة"
                id="period"
                value={filterPeriod}
                onChange={(value) => setFilterPeriod(value as any)}
                options={[
                  { value: 'week', label: 'آخر أسبوع' },
                  { value: 'month', label: 'آخر شهر' },
                  { value: '30days', label: 'آخر 30 يوم' },
                  { value: 'year', label: 'آخر سنة' }
                ]}
                copyable={false}
                clearable={false}
              />

              <Button variant="outline" className="mt-6">
                <Filter className="h-4 w-4 ml-1" />
                تطبيق الفلاتر
              </Button>

              <Button variant="outline" className="mt-6">
                <RefreshCw className="h-4 w-4 ml-1" />
                تحديث
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* الجدول */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قائمة المدخلات ({entriesWithPayments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الطلب</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحي</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأتعاب</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entriesWithPayments.map((entry, index) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {entry.description}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontFamily: 'monospace' }}>
                        {entry.serviceNumber}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {entry.sector}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {entry.district}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold' }}>
                        {entry.totalFees.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', color: '#10b981' }}>
                        {entry.totalPaid.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', color: '#ef4444' }}>
                        {entry.remaining.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          style={{ 
                            background: entry.remaining === 0 ? '#10b981' : 
                                       entry.totalPaid > 0 ? '#f59e0b' : '#ef4444',
                            color: '#fff'
                          }}
                        >
                          {entry.remaining === 0 ? 'مسدد' : 
                           entry.totalPaid > 0 ? 'جزئي' : 'معلق'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
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
                              setShowPaymentDialog(true);
                            }}
                            disabled={entry.remaining === 0}
                          >
                            <DollarSign className="h-3 w-3" />
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

        {/* نافذة الدفع */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="max-w-2xl dialog-rtl">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تسجيل دفعة جديدة
              </DialogTitle>
              <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {selectedEntry?.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <SelectWithCopy
                label="المستفيد *"
                id="recipient"
                value={newPayment.recipient || ''}
                onChange={(value) => {
                  const recipientName = value === 'partner1' ? 'الشريك الأول' :
                                       value === 'partner2' ? 'الشريك الثاني' :
                                       'طرف خارجي';
                  setNewPayment({ ...newPayment, recipient: value, recipientName });
                }}
                options={[
                  { value: 'partner1', label: 'الشريك الأول' },
                  { value: 'partner2', label: 'الشريك الثاني' },
                  { value: 'external', label: 'طرف خارجي' }
                ]}
                required
                copyable={false}
                clearable={false}
              />

              <div className="grid grid-cols-2 gap-3">
                <InputWithCopy
                  label="المبلغ *"
                  id="amount"
                  type="number"
                  value={newPayment.amount?.toString() || '0'}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  required
                  copyable={true}
                  clearable={true}
                />

                <InputWithCopy
                  label="تاريخ الدفع *"
                  id="paymentDate"
                  type="date"
                  value={newPayment.paymentDate || ''}
                  onChange={(e) => setNewPayment({ ...newPayment, paymentDate: e.target.value })}
                  required
                  copyable={true}
                  clearable={true}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SelectWithCopy
                  label="وسيلة الدفع *"
                  id="paymentMethod"
                  value={newPayment.paymentMethod || 'cash'}
                  onChange={(value) => setNewPayment({ ...newPayment, paymentMethod: value as any })}
                  options={PAYMENT_METHODS}
                  required
                  copyable={false}
                  clearable={false}
                />

                <InputWithCopy
                  label="تفاصيل وسيلة الدفع"
                  id="paymentMethodDetails"
                  value={newPayment.paymentMethodDetails || ''}
                  onChange={(e) => setNewPayment({ ...newPayment, paymentMethodDetails: e.target.value })}
                  placeholder="رقم الشيك، رقم التحويل..."
                  copyable={true}
                  clearable={true}
                />
              </div>

              <EnhancedSwitch
                id="isPartial"
                checked={newPayment.isPartial || false}
                onCheckedChange={(checked) => setNewPayment({ ...newPayment, isPartial: checked })}
                label="دفعة جزئية"
                description="ليس كامل المبلغ المستحق"
              />

              <TextAreaWithCopy
                label="ملاحظات"
                id="paymentNotes"
                value={newPayment.notes || ''}
                onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                rows={2}
                placeholder="ملاحظات إضافية..."
                copyable={true}
                clearable={true}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                <XCircle className="h-4 w-4 ml-1" />
                إلغاء
              </Button>
              <Button onClick={handleSavePayment} style={{ background: '#10b981', color: '#fff' }}>
                <Save className="h-4 w-4 ml-1" />
                حفظ الدفعة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* نافذة التفاصيل */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-4xl dialog-rtl">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تفاصيل المدخل
              </DialogTitle>
            </DialogHeader>

            {selectedEntry && (
              <div className="space-y-3">
                {/* بطاقات ملخصة */}
                <div className="grid grid-cols-4 gap-2">
                  <Card style={{ background: '#dbeafe' }}>
                    <CardContent className="p-2 text-center">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأتعاب</p>
                      <p className="text-lg font-bold text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {selectedEntry.totalFees.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card style={{ background: '#dcfce7' }}>
                    <CardContent className="p-2 text-center">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</p>
                      <p className="text-lg font-bold text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {payments.filter(p => p.entryId === selectedEntry.id).reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card style={{ background: '#fee2e2' }}>
                    <CardContent className="p-2 text-center">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</p>
                      <p className="text-lg font-bold text-red-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {(selectedEntry.totalFees - payments.filter(p => p.entryId === selectedEntry.id).reduce((sum, p) => sum + p.amount, 0)).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card style={{ background: '#f3e8ff' }}>
                    <CardContent className="p-2 text-center">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الدفعات</p>
                      <p className="text-lg font-bold text-purple-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {payments.filter(p => p.entryId === selectedEntry.id).length}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* معلومات المدخل */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلومات المدخل</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف: </span>
                        <span style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold' }}>{selectedEntry.description}</span>
                      </div>
                      <div>
                        <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الطلب: </span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{selectedEntry.serviceNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع: </span>
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedEntry.sector}</span>
                      </div>
                      <div>
                        <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحي: </span>
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedEntry.district}</span>
                      </div>
                      <div>
                        <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الشريك الأول: </span>
                        <span style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold' }}>
                          {selectedEntry.partner1Share}% ({(selectedEntry.totalFees * (selectedEntry.partner1Share / 100)).toLocaleString()} ر.س)
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الشريك الثاني: </span>
                        <span style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold' }}>
                          {selectedEntry.partner2Share}% ({(selectedEntry.totalFees * (selectedEntry.partner2Share / 100)).toLocaleString()} ر.س)
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* جدول الدفعات */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل الدفعات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px]">
                      <Table className="table-rtl">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستفيد</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوسيلة</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payments.filter(p => p.entryId === selectedEntry.id).map(payment => (
                            <TableRow key={payment.id}>
                              <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {payment.recipientName}
                              </TableCell>
                              <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold' }}>
                                {payment.amount.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {new Date(payment.paymentDate).toLocaleDateString('ar-SA')}
                              </TableCell>
                              <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {PAYMENT_METHODS.find(m => m.value === payment.paymentMethod)?.label}
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge style={{ background: payment.isPartial ? '#f59e0b' : '#10b981', color: '#fff', fontSize: '10px' }}>
                                  {payment.isPartial ? 'جزئي' : 'كامل'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                <XCircle className="h-4 w-4 ml-1" />
                إغلاق
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // ============================================================
  // التاب 667-03: مدخلات الشريك الأول (سرية)
  // ============================================================

  const renderTab03_Partner1Private = () => {
    const partner1Entries = entries.filter(
      e => e.isPrivate && e.privateForPartner === 'partner1'
    );

    return (
      <div className="space-y-4">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #2563eb' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Lock className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-bold text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  مدخلات الشريك الأول - سرية
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المدخلات الخاصة بالشريك الأول فقط - لا يمكن للشريك الثاني الاطلاع عليها
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قائمة المدخلات الخاصة ({partner1Entries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {partner1Entries.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  لا توجد مدخلات خاصة بالشريك الأول
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الطلب</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأتعاب</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>حصة الشريك</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partner1Entries.map(entry => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {entry.description}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'monospace' }}>
                          {entry.serviceNumber}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold' }}>
                          {entry.totalFees.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', color: '#2563eb', fontWeight: 'bold' }}>
                          {(entry.totalFees * (entry.partner1Share / 100)).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {new Date(entry.createdDate).toLocaleDateString('ar-SA')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Button 
          onClick={() => {
            setNewEntry({ ...newEntry, isPrivate: true, privateForPartner: 'partner1' });
            setActiveTab('667-01');
          }}
          style={{ background: '#2563eb', color: '#fff' }}
        >
          <Plus className="h-4 w-4 ml-1" />
          إضافة مدخل خاص جديد
        </Button>
      </div>
    );
  };

  // ============================================================
  // التاب 667-04: مدخلات الشريك الثاني (سرية)
  // ============================================================

  const renderTab04_Partner2Private = () => {
    const partner2Entries = entries.filter(
      e => e.isPrivate && e.privateForPartner === 'partner2'
    );

    return (
      <div className="space-y-4">
        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #10b981' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-lg font-bold text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  مدخلات الشريك الثاني - سرية
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المدخلات الخاصة بالشريك الثاني فقط - لا يمكن للشريك الأول الاطلاع عليها
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قائمة المدخلات الخاصة ({partner2Entries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {partner2Entries.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  لا توجد مدخلات خاصة بالشريك الثاني
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الطلب</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأتعاب</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>حصة الشريك</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partner2Entries.map(entry => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {entry.description}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'monospace' }}>
                          {entry.serviceNumber}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold' }}>
                          {entry.totalFees.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', color: '#10b981', fontWeight: 'bold' }}>
                          {(entry.totalFees * (entry.partner2Share / 100)).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {new Date(entry.createdDate).toLocaleDateString('ar-SA')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Button 
          onClick={() => {
            setNewEntry({ ...newEntry, isPrivate: true, privateForPartner: 'partner2' });
            setActiveTab('667-01');
          }}
          style={{ background: '#10b981', color: '#fff' }}
        >
          <Plus className="h-4 w-4 ml-1" />
          إضافة مدخل خاص جديد
        </Button>
      </div>
    );
  };

  // ============================================================
  // التاب 667-05: سجل الدفع والمتابعة
  // ============================================================

  const renderTab05_PaymentLog = () => {
    // حساب ملخص الدفع لكل شريك
    const partner1Summary: PaymentSummary = {
      partner: 'partner1',
      totalDue: statistics.partner1Total,
      totalPaid: statistics.partner1Paid,
      remaining: statistics.partner1Remaining,
      nextPaymentDate: undefined,
      nextPaymentAmount: undefined
    };

    const partner2Summary: PaymentSummary = {
      partner: 'partner2',
      totalDue: statistics.partner2Total,
      totalPaid: statistics.partner2Paid,
      remaining: statistics.partner2Remaining,
      nextPaymentDate: undefined,
      nextPaymentAmount: undefined
    };

    return (
      <div className="space-y-4">
        {/* فلتر الفترة */}
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <SelectWithCopy
                label="الفترة الزمنية"
                id="logPeriod"
                value={filterPeriod}
                onChange={(value) => setFilterPeriod(value as any)}
                options={[
                  { value: 'week', label: 'آخر أسبوع' },
                  { value: 'month', label: 'آخر شهر' },
                  { value: '30days', label: 'آخر 30 يوم' },
                  { value: 'year', label: 'آخر سنة' }
                ]}
                copyable={false}
                clearable={false}
              />
            </div>
          </CardContent>
        </Card>

        {/* ملخص الشريك الأول */}
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #2563eb' }}>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
              الشريك الأول
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3 mb-3">
              <Card>
                <CardContent className="p-2 text-center">
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المستحق</p>
                  <p className="text-xl font-bold text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {partner1Summary.totalDue.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-2 text-center">
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</p>
                  <p className="text-xl font-bold text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {partner1Summary.totalPaid.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-2 text-center">
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</p>
                  <p className="text-xl font-bold text-red-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {partner1Summary.remaining.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-2 text-center">
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة السداد</p>
                  <p className="text-xl font-bold text-purple-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {partner1Summary.totalDue > 0 ? ((partner1Summary.totalPaid / partner1Summary.totalDue) * 100).toFixed(1) : '0'}%
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600" 
                style={{ 
                  width: `${partner1Summary.totalDue > 0 ? (partner1Summary.totalPaid / partner1Summary.totalDue) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* ملخص الشريك الثاني */}
        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #10b981' }}>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
              الشريك الثاني
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3 mb-3">
              <Card>
                <CardContent className="p-2 text-center">
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المستحق</p>
                  <p className="text-xl font-bold text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {partner2Summary.totalDue.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-2 text-center">
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</p>
                  <p className="text-xl font-bold text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {partner2Summary.totalPaid.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-2 text-center">
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</p>
                  <p className="text-xl font-bold text-red-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {partner2Summary.remaining.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-2 text-center">
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة السداد</p>
                  <p className="text-xl font-bold text-purple-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {partner2Summary.totalDue > 0 ? ((partner2Summary.totalPaid / partner2Summary.totalDue) * 100).toFixed(1) : '0'}%
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-600" 
                style={{ 
                  width: `${partner2Summary.totalDue > 0 ? (partner2Summary.totalPaid / partner2Summary.totalDue) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* جدول جميع الدفعات */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              سجل جميع الدفعات ({payments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستفيد</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوسيلة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع بواسطة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {new Date(payment.paymentDate).toLocaleDateString('ar-SA')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge style={{ 
                          background: payment.recipient === 'partner1' ? '#2563eb' : '#10b981',
                          color: '#fff'
                        }}>
                          {payment.recipientName}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold' }}>
                        {payment.amount.toLocaleString()} ر.س
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {PAYMENT_METHODS.find(m => m.value === payment.paymentMethod)?.label}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge style={{ 
                          background: payment.isPartial ? '#f59e0b' : '#10b981',
                          color: '#fff'
                        }}>
                          {payment.isPartial ? 'جزئي' : 'كامل'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {payment.paidBy}
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

  // ============================================================
  // التاب 667-06: التقارير المالية
  // ============================================================

  const renderTab06_Reports = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Button variant="outline">
          <Download className="h-4 w-4 ml-1" />
          تقرير شامل
        </Button>
        <Button variant="outline">
          <PieChart className="h-4 w-4 ml-1" />
          تقرير التوزيع
        </Button>
        <Button variant="outline">
          <BarChart3 className="h-4 w-4 ml-1" />
          تقرير السداد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            ملخص مالي شامل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-3">
              <Card style={{ background: '#dbeafe' }}>
                <CardContent className="p-3 text-center">
                  <DollarSign className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الأتعاب</p>
                  <p className="text-2xl font-bold text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {statistics.totalFees.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card style={{ background: '#dcfce7' }}>
                <CardContent className="p-3 text-center">
                  <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المدفوع</p>
                  <p className="text-2xl font-bold text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {statistics.totalPaid.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card style={{ background: '#fee2e2' }}>
                <CardContent className="p-3 text-center">
                  <AlertCircle className="h-6 w-6 mx-auto text-red-600 mb-1" />
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المتبقي</p>
                  <p className="text-2xl font-bold text-red-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {statistics.totalRemaining.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card style={{ background: '#f3e8ff' }}>
                <CardContent className="p-3 text-center">
                  <Calculator className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة المضافة</p>
                  <p className="text-2xl font-bold text-purple-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {statistics.vatTotal.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الشريك الأول
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستحق:</span>
                      <span className="font-bold text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {statistics.partner1Total.toLocaleString()} ر.س
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع:</span>
                      <span className="font-bold text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {statistics.partner1Paid.toLocaleString()} ر.س
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي:</span>
                      <span className="font-bold text-red-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {statistics.partner1Remaining.toLocaleString()} ر.س
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الشريك الثاني
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستحق:</span>
                      <span className="font-bold text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {statistics.partner2Total.toLocaleString()} ر.س
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع:</span>
                      <span className="font-bold text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {statistics.partner2Paid.toLocaleString()} ر.س
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي:</span>
                      <span className="font-bold text-red-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {statistics.partner2Remaining.toLocaleString()} ر.س
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 667-07: الإعدادات
  // ============================================================

  const renderTab07_Settings = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إعدادات الشركاء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {PARTNERS.map(partner => (
                <Card key={partner.id} style={{ border: `2px solid ${partner.color}` }}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: partner.color }}>
                        {partner.name}
                      </h4>
                      <Users className="h-5 w-5" style={{ color: partner.color }} />
                    </div>
                    <div className="space-y-2">
                      <InputWithCopy
                        label="النسبة الافتراضية (%)"
                        id={`${partner.id}-percentage`}
                        type="number"
                        value={partner.percentage.toString()}
                        onChange={() => {}}
                        copyable={true}
                        clearable={false}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إعدادات القيمة المضافة
              </h4>
              
              <EnhancedSwitch
                id="vatEnabled"
                checked={true}
                onCheckedChange={() => {}}
                label="تفعيل القيمة المضافة"
                description="تطبيق ضريبة القيمة المضافة 15% على جميع المدخلات"
              />

              <InputWithCopy
                label="نسبة القيمة المضافة (%)"
                id="vatRate"
                type="number"
                value="15"
                onChange={() => {}}
                copyable={true}
                clearable={false}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <XCircle className="h-4 w-4 ml-1" />
          إلغاء
        </Button>
        <Button style={{ background: '#10b981', color: '#fff' }}>
          <Save className="h-4 w-4 ml-1" />
          حفظ الإعدادات
        </Button>
      </div>
    </div>
  );

  // ============================================================
  // العرض الرئيسي
  // ============================================================

  return (
    <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
      {/* السايد بار */}
      <UnifiedTabsSidebar
        tabs={TABS_CONFIG}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* المحتوى */}
      <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PartnersAccounts_Complete_667_v1;
