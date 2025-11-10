/**
 * تابات متقدمة لإدارة المكتب - نسخة شاملة
 * التابات: هيكل الملكية، العقود والاتفاقيات، التراخيص والاعتمادات، التكاليف الدورية، الاجتماعات والمحاضر
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import {
  Users, FileText, Building2, TrendingUp, PieChart, Calendar,
  Plus, Edit, Trash2, Eye, Download, Upload, Search, Filter,
  CheckCircle, XCircle, AlertCircle, DollarSign, Percent,
  Award, FileCheck, Shield, Clock, MapPin, Phone, Mail,
  Briefcase, FileSignature, UserCheck, Settings, Printer,
  Copy, Save, RotateCcw, CalendarDays, MessageSquare,
  Handshake, Stamp, FileBarChart, BookOpen, Target
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner@2.0.3';

// ==================== الواجهات ====================

interface Partner {
  id: string;
  name: string;
  nationalId: string;
  role: string;
  sharePercentage: number;
  investmentAmount: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  phone: string;
  email: string;
  responsibilities: string[];
  votingPower: number;
  profitShare: number;
}

interface Contract {
  id: string;
  title: string;
  type: string;
  party: string;
  value: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending' | 'cancelled';
  renewalType: 'auto' | 'manual' | 'none';
  description: string;
  attachments: number;
  nextReview: string;
}

interface License {
  id: string;
  name: string;
  type: string;
  number: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired' | 'suspended';
  daysRemaining: number;
  renewalCost: string;
  category: string;
}

interface RecurringCost {
  id: string;
  name: string;
  category: string;
  amount: string;
  frequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  nextDueDate: string;
  paymentMethod: string;
  provider: string;
  autoPayment: boolean;
  lastPayment: string;
  status: 'active' | 'overdue' | 'suspended';
}

interface Meeting {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  attendees: string[];
  location: string;
  agenda: string[];
  decisions: string[];
  actionItems: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  minutesAttached: boolean;
}

const OfficeManagementAdvancedTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ownership');
  const [showPartnerDialog, setShowPartnerDialog] = useState(false);
  const [showContractDialog, setShowContractDialog] = useState(false);
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  const [showCostDialog, setShowCostDialog] = useState(false);
  const [showMeetingDialog, setShowMeetingDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // بيانات الشركاء الوهمية
  const mockPartners: Partner[] = [
    {
      id: 'PTR-001',
      name: 'م. أحمد محمد العلي',
      nationalId: '1234567890',
      role: 'المدير العام',
      sharePercentage: 40,
      investmentAmount: '2,000,000',
      joinDate: '2020-01-15',
      status: 'active',
      phone: '0501234567',
      email: 'ahmed@example.com',
      responsibilities: ['الإدارة العامة', 'التخطيط الاستراتيجي', 'العلاقات الخارجية'],
      votingPower: 40,
      profitShare: 40
    },
    {
      id: 'PTR-002',
      name: 'م. خالد سعد السالم',
      nationalId: '2345678901',
      role: 'المدير التنفيذي',
      sharePercentage: 35,
      investmentAmount: '1,750,000',
      joinDate: '2020-01-15',
      status: 'active',
      phone: '0502345678',
      email: 'khaled@example.com',
      responsibilities: ['العمليات اليومية', 'إدارة المشاريع', 'الموارد البشرية'],
      votingPower: 35,
      profitShare: 35
    },
    {
      id: 'PTR-003',
      name: 'م. فهد عبدالله النمر',
      nationalId: '3456789012',
      role: 'شريك',
      sharePercentage: 15,
      investmentAmount: '750,000',
      joinDate: '2021-06-01',
      status: 'active',
      phone: '0503456789',
      email: 'fahad@example.com',
      responsibilities: ['التصميم الهندسي', 'الجودة والمطابقة'],
      votingPower: 15,
      profitShare: 15
    },
    {
      id: 'PTR-004',
      name: 'د. نواف راشد الحربي',
      nationalId: '4567890123',
      role: 'شريك',
      sharePercentage: 10,
      investmentAmount: '500,000',
      joinDate: '2022-03-15',
      status: 'active',
      phone: '0504567890',
      email: 'nawaf@example.com',
      responsibilities: ['الاستشارات الفنية', 'البحث والتطوير'],
      votingPower: 10,
      profitShare: 10
    }
  ];

  // بيانات العقود الوهمية
  const mockContracts: Contract[] = [
    {
      id: 'CNT-001',
      title: 'عقد إيجار المقر الرئيسي',
      type: 'إيجار',
      party: 'شركة العقارات المتحدة',
      value: '180,000',
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      status: 'active',
      renewalType: 'manual',
      description: 'عقد إيجار المكتب الرئيسي - طريق الملك فهد',
      attachments: 5,
      nextReview: '2025-10-01'
    },
    {
      id: 'CNT-002',
      title: 'اتفاقية الصيانة السنوية',
      type: 'خدمات',
      party: 'مؤسسة الصيانة الشاملة',
      value: '45,000',
      startDate: '2024-06-01',
      endDate: '2025-05-31',
      status: 'active',
      renewalType: 'auto',
      description: 'صيانة دورية للمعدات والأجهزة',
      attachments: 3,
      nextReview: '2025-04-01'
    },
    {
      id: 'CNT-003',
      title: 'عقد التأمين الشامل',
      type: 'تأمين',
      party: 'شركة التأمين الوطنية',
      value: '25,000',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      status: 'active',
      renewalType: 'manual',
      description: 'تأمين شامل ضد الأخطار',
      attachments: 2,
      nextReview: '2025-01-01'
    },
    {
      id: 'CNT-004',
      title: 'اتفاقية برمجيات التصميم',
      type: 'اشتراك',
      party: 'Autodesk Arabia',
      value: '120,000',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'pending',
      renewalType: 'auto',
      description: 'رخص AutoCAD و Revit - 15 مستخدم',
      attachments: 4,
      nextReview: '2024-11-15'
    },
    {
      id: 'CNT-005',
      title: 'عقد خدمات المحاسبة',
      type: 'خدمات مهنية',
      party: 'مكتب المحاسبون القانونيون',
      value: '60,000',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      renewalType: 'manual',
      description: 'خدمات محاسبية ومراجعة سنوية',
      attachments: 6,
      nextReview: '2024-11-01'
    }
  ];

  // بيانات التراخيص الوهمية
  const mockLicenses: License[] = [
    {
      id: 'LIC-001',
      name: 'رخصة ممارسة المهنة',
      type: 'مهني',
      number: 'ENG-2024-5678',
      issuer: 'الهيئة السعودية للمهندسين',
      issueDate: '2024-01-15',
      expiryDate: '2027-01-14',
      status: 'valid',
      daysRemaining: 823,
      renewalCost: '15,000',
      category: 'هندسة معمارية'
    },
    {
      id: 'LIC-002',
      name: 'سجل تجاري',
      type: 'تجاري',
      number: '1010567890',
      issuer: 'وزارة التجارة',
      issueDate: '2020-03-01',
      expiryDate: '2025-02-28',
      status: 'valid',
      daysRemaining: 486,
      renewalCost: '1,200',
      category: 'تجاري'
    },
    {
      id: 'LIC-003',
      name: 'شهادة تصنيف المقاولين',
      type: 'تصنيف',
      number: 'CONT-A-12345',
      issuer: 'وزارة الشؤون البلدية',
      issueDate: '2023-06-01',
      expiryDate: '2025-05-31',
      status: 'expiring',
      daysRemaining: 242,
      renewalCost: '25,000',
      category: 'المباني العامة - الدرجة الأولى'
    },
    {
      id: 'LIC-004',
      name: 'رخصة الدفاع المدني',
      type: 'سلامة',
      number: 'CD-2024-8901',
      issuer: 'الدفاع المدني',
      issueDate: '2024-02-01',
      expiryDate: '2025-01-31',
      status: 'expiring',
      daysRemaining: 92,
      renewalCost: '3,500',
      category: 'السلامة والأمن'
    },
    {
      id: 'LIC-005',
      name: 'شهادة الأيزو 9001',
      type: 'جودة',
      number: 'ISO-9001-2023-456',
      issuer: 'الهيئة السعودية للمواصفات',
      issueDate: '2023-09-01',
      expiryDate: '2026-08-31',
      status: 'valid',
      daysRemaining: 1035,
      renewalCost: '35,000',
      category: 'إدارة الجودة'
    },
    {
      id: 'LIC-006',
      name: 'ترخيص البيئة',
      type: 'بيئي',
      number: 'ENV-2024-1234',
      issuer: 'الهيئة العامة للأرصاد',
      issueDate: '2024-04-01',
      expiryDate: '2025-03-31',
      status: 'valid',
      daysRemaining: 182,
      renewalCost: '8,000',
      category: 'الحماية البيئية'
    }
  ];

  // بيانات التكاليف الدورية الوهمية
  const mockCosts: RecurringCost[] = [
    {
      id: 'REC-001',
      name: 'إيجار المقر الرئيسي',
      category: 'إيجارات',
      amount: '15,000',
      frequency: 'monthly',
      nextDueDate: '2025-11-01',
      paymentMethod: 'تحويل بنكي',
      provider: 'شركة العقارات المتحدة',
      autoPayment: true,
      lastPayment: '2025-10-01',
      status: 'active'
    },
    {
      id: 'REC-002',
      name: 'رواتب الموظفين',
      category: 'رواتب',
      amount: '185,000',
      frequency: 'monthly',
      nextDueDate: '2025-11-01',
      paymentMethod: 'نظام WPS',
      provider: 'بنك الراجحي',
      autoPayment: true,
      lastPayment: '2025-10-01',
      status: 'active'
    },
    {
      id: 'REC-003',
      name: 'فواتير الكهرباء',
      category: 'مرافق',
      amount: '4,500',
      frequency: 'monthly',
      nextDueDate: '2025-11-05',
      paymentMethod: 'سداد',
      provider: 'الشركة السعودية للكهرباء',
      autoPayment: true,
      lastPayment: '2025-10-05',
      status: 'active'
    },
    {
      id: 'REC-004',
      name: 'اشتراك الإنترنت',
      category: 'اتصالات',
      amount: '1,200',
      frequency: 'monthly',
      nextDueDate: '2025-11-10',
      paymentMethod: 'بطاقة ائتمان',
      provider: 'STC',
      autoPayment: true,
      lastPayment: '2025-10-10',
      status: 'active'
    },
    {
      id: 'REC-005',
      name: 'تأمين المركبات',
      category: 'تأمينات',
      amount: '12,000',
      frequency: 'annual',
      nextDueDate: '2025-12-15',
      paymentMethod: 'تحويل بنكي',
      provider: 'شركة التأمين الوطنية',
      autoPayment: false,
      lastPayment: '2024-12-15',
      status: 'active'
    },
    {
      id: 'REC-006',
      name: 'صيانة دورية للمعدات',
      category: 'صيانة',
      amount: '3,750',
      frequency: 'quarterly',
      nextDueDate: '2025-12-01',
      paymentMethod: 'شيك',
      provider: 'مؤسسة الصيانة الشاملة',
      autoPayment: false,
      lastPayment: '2025-09-01',
      status: 'active'
    },
    {
      id: 'REC-007',
      name: 'اشتراك برمجيات التصميم',
      category: 'برمجيات',
      amount: '10,000',
      frequency: 'monthly',
      nextDueDate: '2025-11-01',
      paymentMethod: 'بطاقة ائتمان',
      provider: 'Autodesk Arabia',
      autoPayment: true,
      lastPayment: '2025-10-01',
      status: 'active'
    },
    {
      id: 'REC-008',
      name: 'خدمات المحاسبة',
      category: 'خدمات مهنية',
      amount: '30,000',
      frequency: 'semi-annual',
      nextDueDate: '2026-01-01',
      paymentMethod: 'تحويل بنكي',
      provider: 'مكتب المحاسبون القانونيون',
      autoPayment: false,
      lastPayment: '2025-07-01',
      status: 'active'
    }
  ];

  // بيانات الاجتماعات الوهمية
  const mockMeetings: Meeting[] = [
    {
      id: 'MTG-001',
      title: 'اجتماع مجلس الإدارة الشهري',
      type: 'مجلس إدارة',
      date: '2025-10-28',
      time: '10:00',
      duration: '2 ساعة',
      attendees: ['م. أحمد العلي', 'م. خالد السالم', 'م. فهد النمر', 'د. نواف الحربي'],
      location: 'قاعة الاجتماعات - المقر الرئيسي',
      agenda: ['مراجعة الأداء المالي', 'خطة التوسع 2026', 'تعيينات جديدة'],
      decisions: ['الموافقة على الميزانية', 'افتتاح فرع جديد'],
      actionItems: ['إعداد دراسة جدوى الفرع', 'مقابلات التوظيف'],
      status: 'completed',
      minutesAttached: true
    },
    {
      id: 'MTG-002',
      title: 'اجتماع الشركاء الربع سنوي',
      type: 'شركاء',
      date: '2025-11-05',
      time: '14:00',
      duration: '3 ساعات',
      attendees: ['جميع الشركاء', 'المدير المالي'],
      location: 'فندق الريتز كارلتون',
      agenda: ['عرض نتائج الربع الثالث', 'توزيع الأرباح', 'خطة 2026'],
      decisions: [],
      actionItems: [],
      status: 'scheduled',
      minutesAttached: false
    },
    {
      id: 'MTG-003',
      title: 'اجتماع التخطيط الاستراتيجي',
      type: 'استراتيجي',
      date: '2025-10-20',
      time: '09:00',
      duration: '4 ساعات',
      attendees: ['الإدارة العليا', 'رؤساء الأقسام'],
      location: 'مركز المؤتمرات',
      agenda: ['مراجعة الرؤية والرسالة', 'تحديد الأهداف 2026', 'تطوير العمليات'],
      decisions: ['تحديث الهيكل التنظيمي', 'زيادة الاستثمار في التقنية'],
      actionItems: ['إعداد الخطة التفصيلية', 'تقييم البرمجيات الحالية'],
      status: 'completed',
      minutesAttached: true
    },
    {
      id: 'MTG-004',
      title: 'اجتماع لجنة الجودة',
      type: 'لجنة',
      date: '2025-11-10',
      time: '11:00',
      duration: '1.5 ساعة',
      attendees: ['مدير الجودة', 'المراجعين الداخليين', 'رؤساء المشاريع'],
      location: 'قاعة التدريب',
      agenda: ['مراجعة شكاوى العملاء', 'تحديث إجراءات الجودة', 'خطة التدريب'],
      decisions: [],
      actionItems: [],
      status: 'scheduled',
      minutesAttached: false
    }
  ];

  // دوال المساعدة
  const getStatusBadge = (status: string) => {
    const configs: any = {
      active: { label: 'نشط', className: 'bg-green-500 text-white' },
      inactive: { label: 'غير نشط', className: 'bg-gray-500 text-white' },
      pending: { label: 'قيد الانتظار', className: 'bg-yellow-500 text-white' },
      expired: { label: 'منتهي', className: 'bg-red-500 text-white' },
      cancelled: { label: 'ملغي', className: 'bg-gray-600 text-white' },
      valid: { label: 'ساري', className: 'bg-green-500 text-white' },
      expiring: { label: 'قرب الانتهاء', className: 'bg-orange-500 text-white' },
      suspended: { label: 'معلق', className: 'bg-purple-500 text-white' },
      overdue: { label: 'متأخر', className: 'bg-red-600 text-white' },
      scheduled: { label: 'مجدول', className: 'bg-blue-500 text-white' },
      completed: { label: 'مكتمل', className: 'bg-green-600 text-white' }
    };
    const config = configs[status] || { label: status, className: 'bg-gray-400 text-white' };
    return <Badge className={`text-xs px-2 py-0.5 ${config.className}`}>{config.label}</Badge>;
  };

  const getFrequencyLabel = (freq: string) => {
    const labels: any = {
      monthly: 'شهري',
      quarterly: 'ربع سنوي',
      'semi-annual': 'نصف سنوي',
      annual: 'سنوي'
    };
    return labels[freq] || freq;
  };

  // ==================== التاب 1: هيكل الملكية ====================
  const renderOwnershipStructure = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>هيكل الملكية والشراكة</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <Printer className="h-3 w-3 ml-1" />طباعة الهيكل
          </Button>
          <Button size="sm" className="h-8 text-xs bg-blue-500" onClick={() => setShowPartnerDialog(true)}>
            <Plus className="h-3 w-3 ml-1" />إضافة شريك
          </Button>
        </div>
      </div>

      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-5 gap-2">
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #2563eb' }}>
          <CardContent className="p-2 text-center">
            <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-xl text-blue-600 mb-0.5">{mockPartners.length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الشركاء</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #10b981' }}>
          <CardContent className="p-2 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-xl text-green-600 mb-0.5">{mockPartners.filter(p => p.status === 'active').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>شركاء نشطون</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #8b5cf6' }}>
          <CardContent className="p-2 text-center">
            <DollarSign className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-xl text-purple-600 mb-0.5">5,000,000</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رأس المال (ر.س)</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #f59e0b' }}>
          <CardContent className="p-2 text-center">
            <Percent className="h-5 w-5 mx-auto text-orange-600 mb-1" />
            <p className="text-xl text-orange-600 mb-0.5">100%</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة التوزيع</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #ec4899' }}>
          <CardContent className="p-2 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-pink-600 mb-1" />
            <p className="text-xl text-pink-600 mb-0.5">4</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>سنوات التأسيس</p>
          </CardContent>
        </Card>
      </div>

      {/* مخطط توزيع الحصص */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <PieChart className="h-4 w-4" />
            توزيع حصص الملكية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <div className="space-y-2">
            {mockPartners.map(partner => (
              <div key={partner.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{partner.name}</span>
                  <span className="text-xs font-mono">{partner.sharePercentage}%</span>
                </div>
                <Progress value={partner.sharePercentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* جدول تفاصيل الشركاء */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <FileText className="h-4 w-4" />
            تفاصيل الشركاء والصلاحيات
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <ScrollArea className="h-[400px]">
            <Table className="table-rtl dense-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المنصب</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة الملكية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القوة التصويتية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة الأرباح</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيمة الاستثمار</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانضمام</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPartners.map(partner => (
                  <TableRow key={partner.id} className="hover:bg-blue-50 transition-colors">
                    <TableCell className="text-right py-2 text-xs font-mono">{partner.id}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{partner.name}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{partner.role}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{partner.sharePercentage}%</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{partner.votingPower}%</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{partner.profitShare}%</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{partner.investmentAmount} ر.س</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{partner.joinDate}</TableCell>
                    <TableCell className="text-right py-2">{getStatusBadge(partner.status)}</TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { setSelectedItem(partner); setShowPartnerDialog(true); }}><Eye className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Edit className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Download className="h-3 w-3" /></Button>
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

  // ==================== التاب 2: العقود والاتفاقيات ====================
  const renderContracts = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>العقود والاتفاقيات</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <Filter className="h-3 w-3 ml-1" />تصفية
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <Download className="h-3 w-3 ml-1" />تصدير
          </Button>
          <Button size="sm" className="h-8 text-xs bg-green-500" onClick={() => setShowContractDialog(true)}>
            <Plus className="h-3 w-3 ml-1" />عقد جديد
          </Button>
        </div>
      </div>

      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-6 gap-2">
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #2563eb' }}>
          <CardContent className="p-2 text-center">
            <FileText className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-xl text-blue-600 mb-0.5">{mockContracts.length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي العقود</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #10b981' }}>
          <CardContent className="p-2 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-xl text-green-600 mb-0.5">{mockContracts.filter(c => c.status === 'active').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>عقود نشطة</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #f59e0b' }}>
          <CardContent className="p-2 text-center">
            <Clock className="h-5 w-5 mx-auto text-orange-600 mb-1" />
            <p className="text-xl text-orange-600 mb-0.5">{mockContracts.filter(c => c.status === 'pending').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد المراجعة</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #8b5cf6' }}>
          <CardContent className="p-2 text-center">
            <RotateCcw className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-xl text-purple-600 mb-0.5">{mockContracts.filter(c => c.renewalType === 'auto').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تجديد تلقائي</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #ef4444' }}>
          <CardContent className="p-2 text-center">
            <AlertCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-xl text-red-600 mb-0.5">2</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحتاج مراجعة</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #06b6d4' }}>
          <CardContent className="p-2 text-center">
            <DollarSign className="h-5 w-5 mx-auto text-cyan-600 mb-1" />
            <p className="text-xl text-cyan-600 mb-0.5">430,000</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيمة إجمالية</p>
          </CardContent>
        </Card>
      </div>

      {/* جدول العقود */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Handshake className="h-4 w-4" />
            سجل العقود والاتفاقيات
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <ScrollArea className="h-[450px]">
            <Table className="table-rtl dense-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عنوان العقد</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الطرف الثاني</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ البداية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانتهاء</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التجديد</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المراجعة القادمة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرفقات</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockContracts.map(contract => (
                  <TableRow key={contract.id} className="hover:bg-green-50 transition-colors">
                    <TableCell className="text-right py-2 text-xs font-mono">{contract.id}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.title}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Badge variant="outline" className="text-xs">{contract.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.party}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{contract.value} ر.س</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{contract.startDate}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{contract.endDate}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Badge className={contract.renewalType === 'auto' ? 'bg-purple-500 text-white text-xs' : 'bg-gray-500 text-white text-xs'}>
                        {contract.renewalType === 'auto' ? 'تلقائي' : contract.renewalType === 'manual' ? 'يدوي' : 'بدون'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{contract.nextReview}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{contract.attachments}</TableCell>
                    <TableCell className="text-right py-2">{getStatusBadge(contract.status)}</TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { setSelectedItem(contract); setShowContractDialog(true); }}><Eye className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Edit className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Download className="h-3 w-3" /></Button>
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

  // ==================== التاب 3: التراخيص والاعتمادات ====================
  const renderLicenses = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التراخيص والاعتمادات</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <Search className="h-3 w-3 ml-1" />بحث
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <Download className="h-3 w-3 ml-1" />تصدير
          </Button>
          <Button size="sm" className="h-8 text-xs bg-purple-500" onClick={() => setShowLicenseDialog(true)}>
            <Plus className="h-3 w-3 ml-1" />ترخيص جديد
          </Button>
        </div>
      </div>

      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-6 gap-2">
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #2563eb' }}>
          <CardContent className="p-2 text-center">
            <Award className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-xl text-blue-600 mb-0.5">{mockLicenses.length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي التراخيص</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #10b981' }}>
          <CardContent className="p-2 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-xl text-green-600 mb-0.5">{mockLicenses.filter(l => l.status === 'valid').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تراخيص سارية</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #f59e0b' }}>
          <CardContent className="p-2 text-center">
            <AlertCircle className="h-5 w-5 mx-auto text-orange-600 mb-1" />
            <p className="text-xl text-orange-600 mb-0.5">{mockLicenses.filter(l => l.status === 'expiring').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قرب الانتهاء</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #ef4444' }}>
          <CardContent className="p-2 text-center">
            <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-xl text-red-600 mb-0.5">{mockLicenses.filter(l => l.status === 'expired').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>منتهية</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #8b5cf6' }}>
          <CardContent className="p-2 text-center">
            <Shield className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-xl text-purple-600 mb-0.5">5</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>أنواع التراخيص</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #06b6d4' }}>
          <CardContent className="p-2 text-center">
            <DollarSign className="h-5 w-5 mx-auto text-cyan-600 mb-1" />
            <p className="text-xl text-cyan-600 mb-0.5">87,700</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تكلفة التجديد</p>
          </CardContent>
        </Card>
      </div>

      {/* جدول التراخيص */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <FileCheck className="h-4 w-4" />
            سجل التراخيص والاعتمادات المهنية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <ScrollArea className="h-[450px]">
            <Table className="table-rtl dense-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الترخيص</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الترخيص</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة المصدرة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الإصدار</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانتهاء</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأيام المتبقية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تكلفة التجديد</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLicenses.map(license => (
                  <TableRow key={license.id} className="hover:bg-purple-50 transition-colors">
                    <TableCell className="text-right py-2 text-xs font-mono">{license.id}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{license.name}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Badge variant="outline" className="text-xs">{license.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{license.number}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{license.issuer}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{license.issueDate}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{license.expiryDate}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">
                      <span className={license.daysRemaining < 90 ? 'text-red-600' : license.daysRemaining < 180 ? 'text-orange-600' : 'text-green-600'}>
                        {license.daysRemaining} يوم
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{license.renewalCost} ر.س</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{license.category}</TableCell>
                    <TableCell className="text-right py-2">{getStatusBadge(license.status)}</TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { setSelectedItem(license); setShowLicenseDialog(true); }}><Eye className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Edit className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="تجديد"><RotateCcw className="h-3 w-3" /></Button>
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

  // ==================== التاب 4: التكاليف الدورية ====================
  const renderRecurringCosts = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التكاليف والمصاريف الدورية</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <Filter className="h-3 w-3 ml-1" />تصفية
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <Printer className="h-3 w-3 ml-1" />طباعة
          </Button>
          <Button size="sm" className="h-8 text-xs bg-orange-500" onClick={() => setShowCostDialog(true)}>
            <Plus className="h-3 w-3 ml-1" />تكلفة جديدة
          </Button>
        </div>
      </div>

      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-6 gap-2">
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #2563eb' }}>
          <CardContent className="p-2 text-center">
            <DollarSign className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-xl text-blue-600 mb-0.5">{mockCosts.length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي التكاليف</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #10b981' }}>
          <CardContent className="p-2 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-xl text-green-600 mb-0.5">{mockCosts.filter(c => c.status === 'active').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تكاليف نشطة</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #8b5cf6' }}>
          <CardContent className="p-2 text-center">
            <RotateCcw className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-xl text-purple-600 mb-0.5">{mockCosts.filter(c => c.autoPayment).length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>دفع تلقائي</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #f59e0b' }}>
          <CardContent className="p-2 text-center">
            <CalendarDays className="h-5 w-5 mx-auto text-orange-600 mb-1" />
            <p className="text-xl text-orange-600 mb-0.5">205,450</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>شهري (ر.س)</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #06b6d4' }}>
          <CardContent className="p-2 text-center">
            <Target className="h-5 w-5 mx-auto text-cyan-600 mb-1" />
            <p className="text-xl text-cyan-600 mb-0.5">3,750</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>ربع سنوي (ر.س)</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #ec4899' }}>
          <CardContent className="p-2 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-pink-600 mb-1" />
            <p className="text-xl text-pink-600 mb-0.5">2,495,400</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي السنوي</p>
          </CardContent>
        </Card>
      </div>

      {/* رسم بياني للتكاليف الشهرية */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <PieChart className="h-4 w-4" />
            توزيع التكاليف حسب الفئة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <div className="grid grid-cols-4 gap-2">
            {[
              { name: 'رواتب', amount: '185,000', percentage: 90, color: '#2563eb' },
              { name: 'إيجارات', amount: '15,000', percentage: 7.3, color: '#10b981' },
              { name: 'برمجيات', amount: '10,000', percentage: 4.9, color: '#8b5cf6' },
              { name: 'مرافق واتصالات', amount: '5,700', percentage: 2.8, color: '#f59e0b' }
            ].map(item => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.name}</span>
                  <span className="text-xs font-mono">{item.amount} ر.س</span>
                </div>
                <Progress value={item.percentage} className="h-2" style={{ backgroundColor: `${item.color}33` }} />
                <span className="text-[10px] text-gray-500 font-mono">{item.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* جدول التكاليف */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <FileBarChart className="h-4 w-4" />
            سجل التكاليف والمصاريف الدورية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <ScrollArea className="h-[400px]">
            <Table className="table-rtl dense-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم التكلفة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التكرار</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ القادم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>طريقة الدفع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المزود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>دفع تلقائي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر دفع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCosts.map(cost => (
                  <TableRow key={cost.id} className="hover:bg-orange-50 transition-colors">
                    <TableCell className="text-right py-2 text-xs font-mono">{cost.id}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cost.name}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Badge variant="outline" className="text-xs">{cost.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{cost.amount} ر.س</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{getFrequencyLabel(cost.frequency)}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{cost.nextDueDate}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cost.paymentMethod}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cost.provider}</TableCell>
                    <TableCell className="text-right py-2 text-xs">
                      {cost.autoPayment ? <CheckCircle className="h-3.5 w-3.5 text-green-600 mx-auto" /> : <XCircle className="h-3.5 w-3.5 text-gray-400 mx-auto" />}
                    </TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{cost.lastPayment}</TableCell>
                    <TableCell className="text-right py-2">{getStatusBadge(cost.status)}</TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { setSelectedItem(cost); setShowCostDialog(true); }}><Eye className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Edit className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="دفع"><DollarSign className="h-3 w-3" /></Button>
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

  // ==================== التاب 5: الاجتماعات والمحاضر ====================
  const renderMeetings = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاجتماعات والمحاضر</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <Calendar className="h-3 w-3 ml-1" />التقويم
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <Download className="h-3 w-3 ml-1" />تصدير
          </Button>
          <Button size="sm" className="h-8 text-xs bg-cyan-500" onClick={() => setShowMeetingDialog(true)}>
            <Plus className="h-3 w-3 ml-1" />اجتماع جديد
          </Button>
        </div>
      </div>

      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-6 gap-2">
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #2563eb' }}>
          <CardContent className="p-2 text-center">
            <Calendar className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-xl text-blue-600 mb-0.5">{mockMeetings.length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الاجتماعات</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #10b981' }}>
          <CardContent className="p-2 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-xl text-green-600 mb-0.5">{mockMeetings.filter(m => m.status === 'completed').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مكتملة</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #f59e0b' }}>
          <CardContent className="p-2 text-center">
            <Clock className="h-5 w-5 mx-auto text-orange-600 mb-1" />
            <p className="text-xl text-orange-600 mb-0.5">{mockMeetings.filter(m => m.status === 'scheduled').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مجدولة</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #8b5cf6' }}>
          <CardContent className="p-2 text-center">
            <FileText className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-xl text-purple-600 mb-0.5">{mockMeetings.filter(m => m.minutesAttached).length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>محاضر موثقة</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #06b6d4' }}>
          <CardContent className="p-2 text-center">
            <Users className="h-5 w-5 mx-auto text-cyan-600 mb-1" />
            <p className="text-xl text-cyan-600 mb-0.5">12</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>حضور متوسط</p>
          </CardContent>
        </Card>
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #ec4899' }}>
          <CardContent className="p-2 text-center">
            <Target className="h-5 w-5 mx-auto text-pink-600 mb-1" />
            <p className="text-xl text-pink-600 mb-0.5">8</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>بنود عمل نشطة</p>
          </CardContent>
        </Card>
      </div>

      {/* جدول الاجتماعات */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <BookOpen className="h-4 w-4" />
            سجل الاجتماعات والمحاضر
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <ScrollArea className="h-[450px]">
            <Table className="table-rtl dense-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عنوان الاجتماع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوقت</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المكان</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحضور</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>بنود الأجندة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القرارات</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>بنود العمل</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المحضر</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMeetings.map(meeting => (
                  <TableRow key={meeting.id} className="hover:bg-cyan-50 transition-colors">
                    <TableCell className="text-right py-2 text-xs font-mono">{meeting.id}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{meeting.title}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Badge variant="outline" className="text-xs">{meeting.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{meeting.date}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{meeting.time}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{meeting.duration}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{meeting.location}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{meeting.attendees.length}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{meeting.agenda.length}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{meeting.decisions.length}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{meeting.actionItems.length}</TableCell>
                    <TableCell className="text-right py-2 text-xs">
                      {meeting.minutesAttached ? <CheckCircle className="h-3.5 w-3.5 text-green-600 mx-auto" /> : <XCircle className="h-3.5 w-3.5 text-gray-400 mx-auto" />}
                    </TableCell>
                    <TableCell className="text-right py-2">{getStatusBadge(meeting.status)}</TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { setSelectedItem(meeting); setShowMeetingDialog(true); }}><Eye className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Edit className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="المحضر"><Download className="h-3 w-3" /></Button>
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

  // المحتوى الرئيسي
  return (
    <div className="p-4">
      {activeTab === 'ownership' && renderOwnershipStructure()}
      {activeTab === 'contracts' && renderContracts()}
      {activeTab === 'licenses' && renderLicenses()}
      {activeTab === 'costs' && renderRecurringCosts()}
      {activeTab === 'meetings' && renderMeetings()}

      {/* النوافذ المنبثقة - سيتم إضافتها لاحقاً */}
    </div>
  );
};

export default OfficeManagementAdvancedTabs;
