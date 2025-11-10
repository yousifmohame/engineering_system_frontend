/**
 * الشاشة 284 - معالجة المعاملات v9.3
 * ===========================================
 * 
 * تحديثات v9.3:
 * ✅ سايد بار مخصص يبدأ من هيدر النظام (40px)
 * ✅ يمتد السايد بار حتى الفوتر (calc(100vh - 72px))
 * ✅ تكثيف فائق: خط 10px، padding مصغر، gap صفر
 * ✅ موضع fixed بدلاً من sticky لتغطية كامل الارتفاع
 * ✅ right: 280px (بعد سايد بار الشاشات)
 * 
 * تحديثات v9.2:
 * ✅ صفحة ترحيبية افتراضية (لا تفتح معاملة تلقائياً)
 * ✅ نافذة رقم المعاملة المحسّنة (max-w-7xl)
 * ✅ أزرار نسخ شاملة (كل صف + كل البيانات)
 * ✅ تمييز بصري للحقول المهمة:
 *    - رقم الرخصة (خلفية زرقاء)
 *    - سنة الرخصة الهجري (خلفية خضراء)
 *    - رقم طلب الخدمة (خلفية برتقالية)
 * ✅ جدول تفاعلي محسّن مع سكرول
 * ✅ حقل درجة السرية في Transaction interface
 * 
 * تحديثات v9.0:
 * ✅ تغيير الاسم إلى "معالجة المعاملات"
 * ✅ هيدر متطور مع اختيار معاملة
 * ✅ بحث ذكي (رقم المعاملة/اسم المالك/هوية/مخطط)
 * ✅ تصفية متقدمة (شهر/سنة)
 * ✅ شريط إجراءات سريعة أفقي
 * ✅ تكثيف البيانات 95%+
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { 
  FileText, User, MapPin, Calendar, Clock, CheckCircle, AlertCircle,
  Edit, Save, Printer, Download, Eye, Settings, Phone, Mail,
  Building, CreditCard, Archive, History, Users, Shield, Database,
  Search, Filter, X, Plus, Send, Layers, TrendingUp, Award,
  BarChart3, FileCheck, Bell, Target, Paperclip, ExternalLink,
  ChevronDown, Home, UserPlus, FolderOpen, Stamp, FileSignature,
  Hash, RefreshCw, LucideIcon
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';
import { copyToClipboard } from '../utils/clipboard';
import { safeCopyToClipboard } from '../CopyHelper';

// واجهة تعريف التاب
interface TabConfig {
  id: string;
  number: string;
  title: string;
  icon: LucideIcon;
}

const TABS_CONFIG: TabConfig[] = [
  { id: '284-01', number: '284-01', title: 'الحالة العامة', icon: Eye },
  { id: '284-02', number: '284-02', title: 'معلومات المعاملة', icon: FileText },
  { id: '284-03', number: '284-03', title: 'معلومات المالك', icon: User },
  { id: '284-04', number: '284-04', title: 'معلومات الأرض', icon: MapPin },
  { id: '284-05', number: '284-05', title: 'معلومات الملكية', icon: Building },
  { id: '284-06', number: '284-06', title: 'الوثائق', icon: Archive },
  { id: '284-07', number: '284-07', title: 'المدفوعات', icon: CreditCard },
  { id: '284-08', number: '284-08', title: 'التواصل', icon: Mail },
  { id: '284-09', number: '284-09', title: 'الموافقات', icon: CheckCircle },
  { id: '284-10', number: '284-10', title: 'الجدول الزمني', icon: Calendar },
  { id: '284-11', number: '284-11', title: 'فريق العمل', icon: Users },
  { id: '284-12', number: '284-12', title: 'التقدم', icon: TrendingUp },
  { id: '284-13', number: '284-13', title: 'الجودة', icon: Award },
  { id: '284-14', number: '284-14', title: 'المخاطر', icon: Shield },
  { id: '284-15', number: '284-15', title: 'الموارد', icon: Database },
  { id: '284-16', number: '284-16', title: 'التقارير', icon: FileCheck },
  { id: '284-17', number: '284-17', title: 'التحليلات', icon: BarChart3 },
  { id: '284-18', number: '284-18', title: 'القانوني', icon: FileSignature },
  { id: '284-19', number: '284-19', title: 'الإشعارات', icon: Bell },
  { id: '284-20', number: '284-20', title: 'السجل', icon: History },
  { id: '284-21', number: '284-21', title: 'المرفقات', icon: Paperclip },
  { id: '284-22', number: '284-22', title: 'الإحداثيات', icon: MapPin },
  { id: '284-23', number: '284-23', title: 'القياسات', icon: Target },
  { id: '284-24', number: '284-24', title: 'الجهات الخارجية', icon: ExternalLink },
  { id: '284-25', number: '284-25', title: 'الفوترة', icon: CreditCard },
  { id: '284-26', number: '284-26', title: 'الأرشفة', icon: Archive }
];

interface Transaction {
  id: string;
  number: string;
  ownerName: string;
  ownerId: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerAddress: string;
  planNumber: string;
  plotNumbers: string[];
  status: string;
  type: string;
  date: string;
  mainCategory: string;
  subCategory: string;
  location: {
    lat: number;
    lng: number;
    qrCode: string;
    address: string;
  };
  progress: number;
  createdBy: string;
  createdDateTime: string;
  statusReason: string;
  statusBy: string;
  statusDate: string;
  
  // درجة السرية
  confidentialityLevel: 'عادية' | 'سرية';  // جديد
  
  // البيانات المرجعية للمعاملة لدى الجهات
  externalReferences: {
    entityName: string;           // اسم الجهة
    licenseNumber: string;         // رقم الرخصة
    licenseYearHijri: string;      // سنة الرخصة بالهجري
    serviceRequestNumber: string;  // رقم طلب الخدمة
    serviceRequestYear: string;    // سنة طلب الخدمة
    requestNumber: string;         // رقم الطلب
    requestYear: string;           // سنة الطلب
  }[];
  
  // تفاصيل نسبة الإنجاز
  progressDetails: {
    stageName: string;
    percentage: number;
    status: string;
  }[];
}

const MainTransactionsScreen_Complete_284_v9: React.FC = () => {
  const [activeTab, setActiveTab] = useState('284-01');
  const [selectedTransaction, setSelectedTransaction] = useState('2501001');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'auto' | 'number' | 'owner' | 'id' | 'plan'>('auto');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('2025');
  const [autoProgress, setAutoProgress] = useState(true);
  const [filterTransactionType, setFilterTransactionType] = useState(''); // حالة تصفية نوع المعاملة
  
  // حالات النوافذ المنبثقة الجديدة (7 نوافذ)
  const [showTransactionNumberDialog, setShowTransactionNumberDialog] = useState(false);
  const [showOwnerDialog, setShowOwnerDialog] = useState(false);
  const [showPlanLocationDialog, setShowPlanLocationDialog] = useState(false); // مدمج
  const [showTypeDialog, setShowTypeDialog] = useState(false);
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  
  // حالة نافذة التوثيق الرقمي
  const [showDigitalCertification, setShowDigitalCertification] = useState(false);
  const [selectedDocumentForCert, setSelectedDocumentForCert] = useState('');
  const [certificationType, setCertificationType] = useState('digital');
  const [certifierEmployee, setCertifierEmployee] = useState('');
  const [certificationDate, setCertificationDate] = useState(new Date().toISOString().split('T')[0]);
  const [certificationTime, setCertificationTime] = useState(new Date().toTimeString().slice(0, 5));
  const [certificationNotes, setCertificationNotes] = useState('');

  // المستخدم الحالي مع الصلاحيات (للتحكم في ظهور الإجراءات السريعة)
  const currentUser = {
    id: 'USR-001',
    name: 'المهندس أحمد العلي',
    permissions: [
      'VIEW_OFFICE_FEES', // صلاحية عرض أتعاب المكتب
      'SEND_MESSAGES',
      'SEND_FILES',
      'HOLD_TRANSACTION',
      'CANCEL_TRANSACTION',
      'REACTIVATE_TRANSACTION',
      'COMPLETE_TRANSACTION',
      'UPLOAD_FILES',
      'TRANSFER_OWNERSHIP'
    ]
  };

  // أنواع المعاملات (من شاشة إعدادات المعاملات 701)
  const transactionTypes = [
    { value: 'سكني', label: 'سكني' },
    { value: 'تجاري', label: 'تجاري' },
    { value: 'صناعي', label: 'صناعي' },
    { value: 'زراعي', label: 'زراعي' },
    { value: 'إداري', label: 'إداري' },
    { value: 'خدمي', label: 'خدمي' },
    { value: 'استثماري', label: 'استثماري' },
    { value: 'سياحي', label: 'سياحي' }
  ];

  // حالات المعاملات مع الألوان والتفاصيل الكاملة (من شاشة إعدادات المعاملات 701-19)
  const transactionStatuses: Record<string, {
    label: string;
    color: string;
    bgColor: string;
    shortDesc: string;
    detailedDesc: string;
    icon: any;
    requiresReason: boolean;
  }> = {
    'new': { 
      label: 'جديدة', 
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      shortDesc: 'معاملة جديدة',
      detailedDesc: 'معاملة تم إنشاؤها حديثاً ولم تبدأ المعالجة بعد',
      icon: Plus,
      requiresReason: false
    },
    'in-progress': { 
      label: 'جارٍ العمل عليها', 
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      shortDesc: 'جارٍ المعالجة',
      detailedDesc: 'المعاملة قيد المعالجة النشطة من الفريق المختص، يتم العمل على المستندات والإجراءات المطلوبة',
      icon: Clock,
      requiresReason: false
    },
    'pending-approval': { 
      label: 'في انتظار الموافقة', 
      color: '#eab308',
      bgColor: 'rgba(234, 179, 8, 0.1)',
      shortDesc: 'بانتظار الاعتماد',
      detailedDesc: 'المعاملة مكتملة وبانتظار الموافقة النهائية من الإدارة المختصة',
      icon: AlertCircle,
      requiresReason: false
    },
    'approved': { 
      label: 'معتمدة', 
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.1)',
      shortDesc: 'تمت الموافقة',
      detailedDesc: 'تمت الموافقة على المعاملة رسمياً وهي جاهزة للتنفيذ والمتابعة',
      icon: CheckCircle,
      requiresReason: false
    },
    'completed': { 
      label: 'مكتملة', 
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      shortDesc: 'اكتملت بنجاح',
      detailedDesc: 'المعاملة اكتملت بنجاح وتم إغلاقها نهائياً، جميع المتطلبات مستوفاة',
      icon: Award,
      requiresReason: false
    },
    'on-hold': { 
      label: 'متوقفة مؤقتاً', 
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      shortDesc: 'موقوفة مؤقتاً',
      detailedDesc: 'المعاملة موقوفة مؤقتاً بانتظار معلومات إضافية أو مستندات مطلوبة أو قرار إداري',
      icon: Layers,
      requiresReason: true
    },
    'cancelled': { 
      label: 'ملغاة', 
      color: '#6b7280',
      bgColor: 'rgba(107, 114, 128, 0.1)',
      shortDesc: 'تم الإلغاء',
      detailedDesc: 'المعاملة تم إلغاؤها نهائياً من قبل المالك أو الإدارة، لن يتم استكمالها',
      icon: X,
      requiresReason: true
    },
    'rejected': { 
      label: 'مرفوضة', 
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      shortDesc: 'تم الرفض',
      detailedDesc: 'المعاملة تم رفضها رسمياً لعدم استيفاء الشروط أو المتطلبات المطلوبة',
      icon: AlertCircle,
      requiresReason: true
    },
    'under-review': { 
      label: 'قيد المراجعة', 
      color: '#06b6d4',
      bgColor: 'rgba(6, 182, 212, 0.1)',
      shortDesc: 'تحت المراجعة',
      detailedDesc: 'المعاملة قيد المراجعة الفنية والقانونية للتأكد من صحة جميع المستندات والإجراءات',
      icon: Eye,
      requiresReason: false
    },
    'returned': { 
      label: 'معادة للتعديل', 
      color: '#f97316',
      bgColor: 'rgba(249, 115, 22, 0.1)',
      shortDesc: 'تحتاج تعديل',
      detailedDesc: 'المعاملة معادة للمالك أو المسؤول لإجراء تعديلات أو استكمال نواقص قبل المتابعة',
      icon: Edit,
      requiresReason: true
    }
  };

  const mockTransactions: Transaction[] = [
    { 
      id: '2501001', 
      number: '2501001', 
      ownerName: 'أحمد محمد السالم', 
      ownerId: '1234567890',
      ownerPhone: '0501234567',
      ownerEmail: 'ahmed.salem@email.com',
      ownerAddress: 'الرياض، حي النرجس، شارع الأمير سلطان',
      planNumber: 'PLN-123',
      plotNumbers: ['425', '426'],
      status: 'in-progress', 
      type: 'سكني', 
      date: '2025-01-15',
      mainCategory: 'مباني سكنية',
      subCategory: 'فيلا خاصة',
      location: {
        lat: 24.7136,
        lng: 46.6753,
        qrCode: 'https://maps.google.com/?q=24.7136,46.6753',
        address: 'الرياض، حي النرجس'
      },
      progress: 65,
      createdBy: 'م. سارة الأحمد',
      createdDateTime: '2025-01-15 09:30',
      statusReason: '',
      statusBy: 'م. أحمد السالم',
      statusDate: '2025-01-16',
      confidentialityLevel: 'عادية',
      externalReferences: [
        {
          entityName: 'أمانة منطقة الرياض',
          licenseNumber: 'RUH-2024-0156',
          licenseYearHijri: '1446',
          serviceRequestNumber: 'SR-2501-0023',
          serviceRequestYear: '2025',
          requestNumber: 'REQ-25-001',
          requestYear: '2025'
        },
        {
          entityName: 'وزارة الشؤون البلدية',
          licenseNumber: 'MOM-2024-3421',
          licenseYearHijri: '1445',
          serviceRequestNumber: 'SR-2412-0891',
          serviceRequestYear: '2024',
          requestNumber: 'REQ-24-567',
          requestYear: '2024'
        }
      ],
      progressDetails: [
        { stageName: 'دراسة الأرض', percentage: 100, status: 'مكتمل' },
        { stageName: 'الرسومات', percentage: 85, status: 'جارٍ' },
        { stageName: 'الموافقات', percentage: 45, status: 'جارٍ' },
        { stageName: 'التنفيذ', percentage: 0, status: 'قادم' }
      ]
    },
    { 
      id: '2501002', 
      number: '2501002', 
      ownerName: 'سارة علي الأحمد', 
      ownerId: '0987654321',
      ownerPhone: '0509876543',
      ownerEmail: 'sara.ahmed@email.com',
      ownerAddress: 'الرياض، حي العليا، شارع التحلية',
      planNumber: 'PLN-124',
      plotNumbers: ['789'],
      status: 'pending-approval', 
      type: 'تجاري', 
      date: '2025-01-20',
      mainCategory: 'مباني تجارية',
      subCategory: 'مركز تسوق',
      location: {
        lat: 24.6877,
        lng: 46.7219,
        qrCode: 'https://maps.google.com/?q=24.6877,46.7219',
        address: 'الرياض، حي العليا'
      },
      progress: 85,
      createdBy: 'م. خالد المحمدي',
      createdDateTime: '2025-01-20 10:15',
      statusReason: '',
      statusBy: 'م. خالد المحمدي',
      statusDate: '2025-01-22',
      confidentialityLevel: 'سرية',
      externalReferences: [
        {
          entityName: 'أمانة الرياض - فرع العليا',
          licenseNumber: 'RUH-2024-0892',
          licenseYearHijri: '1446',
          serviceRequestNumber: 'SR-2501-0124',
          serviceRequestYear: '2025',
          requestNumber: 'REQ-25-089',
          requestYear: '2025'
        }
      ],
      progressDetails: [
        { stageName: 'التصاميم الأولية', percentage: 100, status: 'مكتمل' },
        { stageName: 'الموافقات البلدية', percentage: 90, status: 'جارٍ' },
        { stageName: 'التراخيص النهائية', percentage: 70, status: 'جارٍ' },
        { stageName: 'البدء بالتنفيذ', percentage: 0, status: 'قادم' }
      ]
    },
    { 
      id: '2502001', 
      number: '2502001', 
      ownerName: 'خالد عبدالله المحمدي', 
      ownerId: '5555555555', 
      planNumber: 'PLN-125',
      plotNumbers: ['101', '102', '103'],
      status: 'completed', 
      type: 'سكني', 
      date: '2025-02-10',
      mainCategory: 'مباني سكنية',
      subCategory: 'عمارة سكنية',
      location: {
        lat: 24.7743,
        lng: 46.7385,
        qrCode: 'https://maps.google.com/?q=24.7743,46.7385',
        address: 'الرياض، حي الملقا'
      },
      progress: 100,
      createdBy: 'م. فاطمة القحطاني',
      createdDateTime: '2025-02-10 08:00',
      statusReason: '',
      statusBy: 'م. فاطمة القحطاني',
      statusDate: '2025-02-15'
    },
    { 
      id: '2412015', 
      number: '2412015', 
      ownerName: 'فاطمة حسن القحطاني', 
      ownerId: '4444444444', 
      planNumber: 'PLN-126',
      plotNumbers: ['550'],
      status: 'approved', 
      type: 'صناعي', 
      date: '2024-12-05',
      mainCategory: 'مباني صناعية',
      subCategory: 'مصنع',
      location: {
        lat: 24.6507,
        lng: 46.7094,
        qrCode: 'https://maps.google.com/?q=24.6507,46.7094',
        address: 'الرياض، المنطقة الصناعية الثانية'
      },
      progress: 75,
      createdBy: 'م. محمد العتيبي',
      createdDateTime: '2024-12-05 11:30',
      statusReason: '',
      statusBy: 'م. محمد العتيبي',
      statusDate: '2024-12-08'
    },
    { 
      id: '2411008', 
      number: '2411008', 
      ownerName: 'محمد عبدالرحمن', 
      ownerId: '3333333333', 
      planNumber: 'PLN-127',
      plotNumbers: ['210'],
      status: 'completed', 
      type: 'سكني', 
      date: '2024-11-12',
      mainCategory: 'مباني سكنية',
      subCategory: 'دوبلكس',
      location: {
        lat: 24.7999,
        lng: 46.6663,
        qrCode: 'https://maps.google.com/?q=24.7999,46.6663',
        address: 'الرياض، حي الياسمين'
      },
      progress: 100,
      createdBy: 'م. نورة الغامدي',
      createdDateTime: '2024-11-12 14:20',
      statusReason: '',
      statusBy: 'م. نورة الغامدي',
      statusDate: '2024-11-18'
    },
    { 
      id: '2501003', 
      number: '2501003', 
      ownerName: 'نورة سعد الغامدي', 
      ownerId: '2222222222', 
      planNumber: 'PLN-128',
      plotNumbers: ['300', '301'],
      status: 'new', 
      type: 'زراعي', 
      date: '2025-01-22',
      mainCategory: 'مباني زراعية',
      subCategory: 'مزرعة',
      location: {
        lat: 24.5247,
        lng: 46.6342,
        qrCode: 'https://maps.google.com/?q=24.5247,46.6342',
        address: 'الخرج، منطقة الحاير'
      },
      progress: 15,
      createdBy: 'م. عبدالله العتيبي',
      createdDateTime: '2025-01-22 16:45',
      statusReason: '',
      statusBy: '',
      statusDate: ''
    },
    { 
      id: '2501004', 
      number: '2501004', 
      ownerName: 'عبدالله حسين العتيبي', 
      ownerId: '7777777777', 
      planNumber: 'PLN-129',
      plotNumbers: ['680'],
      status: 'on-hold', 
      type: 'استثماري', 
      date: '2025-01-25',
      mainCategory: 'مباني استثمارية',
      subCategory: 'برج سكني تجاري',
      location: {
        lat: 24.7242,
        lng: 46.6472,
        qrCode: 'https://maps.google.com/?q=24.7242,46.6472',
        address: 'الرياض، طريق الملك فهد'
      },
      progress: 40,
      createdBy: 'م. ريم الدوسري',
      createdDateTime: '2025-01-25 13:10',
      statusReason: 'بانتظار موافقة الهيئة العامة للاستثمار',
      statusBy: 'م. ريم الدوسري',
      statusDate: '2025-01-26'
    },
    { 
      id: '2502002', 
      number: '2502002', 
      ownerName: 'ريم محمد الدوسري', 
      ownerId: '8888888888', 
      planNumber: 'PLN-130',
      plotNumbers: ['915', '916', '917', '918'],
      status: 'rejected', 
      type: 'إداري', 
      date: '2025-02-12',
      mainCategory: 'مباني إدارية',
      subCategory: 'مبنى حكومي',
      location: {
        lat: 24.6340,
        lng: 46.7156,
        qrCode: 'https://maps.google.com/?q=24.6340,46.7156',
        address: 'الرياض، حي السفارات'
      },
      progress: 25,
      createdBy: 'م. أحمد السالم',
      createdDateTime: '2025-02-12 09:00',
      statusReason: 'عدم استيفاء الشروط الأمنية المطلوبة',
      statusBy: 'د. خالد الشهري',
      statusDate: '2025-02-14'
    },
  ];

  // دالة لاستخراج الرقم القصير من رقم المعاملة الكامل (النظام الجديد YYMM###)
  const getShortNumber = (fullNumber: string): string => {
    // النظام الجديد: YYMM### (7 أرقام)
    // مثال: 2501001 -> يعرض كما هو
    return fullNumber;
  };

  // دالة لتحليل رقم المعاملة (النظام الجديد)
  const parseTransactionNumber = (number: string): { year: string; month: string; sequence: string; yearFull: string; monthName: string } => {
    // YYMM### -> YY=السنة، MM=الشهر، ###=الرقم التسلسلي
    if (number.length !== 7) return { year: '', month: '', sequence: '', yearFull: '', monthName: '' };
    
    const yy = number.substring(0, 2);
    const mm = number.substring(2, 4);
    const seq = number.substring(4, 7);
    
    const monthNames = ['', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    
    return {
      year: yy,
      month: mm,
      sequence: seq,
      yearFull: `20${yy}`,
      monthName: monthNames[parseInt(mm)] || ''
    };
  };

  // دالة لاستخراج الاسم الأول والأخير فقط
  const getFirstAndLastName = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0];
    if (names.length === 2) return fullName;
    // إذا كان 3 أسماء أو أكثر، نأخذ الأول والأخير
    return `${names[0]} ${names[names.length - 1]}`;
  };

  // دالة للحصول على الاسم القصير للنوع
  const getShortTypeName = (type: string): string => {
    const typeMap: Record<string, string> = {
      'سكني': 'سكن',
      'تجاري': 'تجر',
      'صناعي': 'صنع',
      'زراعي': 'زرع',
      'إداري': 'إدر',
      'خدمي': 'خدم'
    };
    return typeMap[type] || type;
  };

  // دالة لتنسيق عرض المعاملة في القائمة المنسدلة
  const formatTransactionLabel = (t: Transaction): string => {
    const shortNum = getShortNumber(t.number);
    const shortName = getFirstAndLastName(t.ownerName);
    const shortType = getShortTypeName(t.type);
    return `${shortNum} • ${shortName} • ${shortType}`;
  };

  // اكتشاف نوع البحث تلقائياً (النظام الجديد)
  const detectedSearchType = useMemo(() => {
    if (!searchTerm) return 'auto';
    // رقم المعاملة الجديد: YYMM### (7 أرقام)
    if (/^\d{7}$/.test(searchTerm)) return 'number';
    // رقم المخطط
    if (/^PLN-/.test(searchTerm)) return 'plan';
    // رقم الهوية (10 أرقام)
    if (/^\d{10}$/.test(searchTerm)) return 'id';
    // جزء من رقم المعاملة (أقل من 7 أرقام)
    if (/^\d{1,6}$/.test(searchTerm)) return 'number';
    return 'owner';
  }, [searchTerm]);

  const filteredTransactions = useMemo(() => {
    let filtered = mockTransactions;
    
    if (searchTerm) {
      const type = searchType === 'auto' ? detectedSearchType : searchType;
      filtered = filtered.filter(t => {
        switch (type) {
          case 'number': return t.number.includes(searchTerm);
          case 'owner': return t.ownerName.includes(searchTerm);
          case 'id': return t.ownerId.includes(searchTerm);
          case 'plan': return t.planNumber.includes(searchTerm);
          default: return t.number.includes(searchTerm) || t.ownerName.includes(searchTerm) || t.ownerId.includes(searchTerm) || t.planNumber.includes(searchTerm);
        }
      });
    }

    if (filterYear) {
      filtered = filtered.filter(t => t.date.startsWith(filterYear));
    }

    if (filterMonth) {
      filtered = filtered.filter(t => t.date.includes(`-${filterMonth}-`));
    }

    if (filterTransactionType) {
      filtered = filtered.filter(t => t.type === filterTransactionType);
    }

    return filtered;
  }, [mockTransactions, searchTerm, searchType, detectedSearchType, filterYear, filterMonth, filterTransactionType]);

  const currentTransaction = selectedTransaction ? mockTransactions.find(t => t.id === selectedTransaction) : null;
  const selectedTransactionData = currentTransaction; // نسخة للاستخدام في الهيدر

  // مستندات المعاملة الوهمية
  const transactionDocuments = [
    { id: 'DOC-001', name: 'صك الملكية', type: 'ملكية', date: '2025-01-10', certified: false },
    { id: 'DOC-002', name: 'رخصة البناء', type: 'رخص', date: '2025-01-12', certified: true },
    { id: 'DOC-003', name: 'المخطط المساحي', type: 'مساحة', date: '2025-01-14', certified: false },
    { id: 'DOC-004', name: 'التصاميم الهندسية', type: 'هندسي', date: '2025-01-15', certified: false },
    { id: 'DOC-005', name: 'تقرير التربة', type: 'فني', date: '2025-01-08', certified: true },
    { id: 'DOC-006', name: 'الموافقة البلدية', type: 'موافقات', date: '2025-01-18', certified: false },
    { id: 'DOC-007', name: 'شهادة الدفاع المدني', type: 'موافقات', date: '2025-01-20', certified: false },
    { id: 'DOC-008', name: 'عقد الإشراف', type: 'عقود', date: '2025-01-05', certified: true },
  ];

  // الموظفون المخولون بالتصديق
  const certifierEmployees = [
    { value: 'EMP-001', label: 'م. أحمد السالم - مدير المشاريع' },
    { value: 'EMP-002', label: 'م. سارة الأحمد - مهندسة معمارية' },
    { value: 'EMP-003', label: 'د. خالد المحمدي - مستشار قانوني' },
    { value: 'EMP-004', label: 'م. فاطمة القحطاني - رئيسة القسم الفني' },
    { value: 'EMP-005', label: 'أ. محمد العتيبي - مدير التوثيق' },
  ];

  // دالة حفظ التوثيق
  const handleSaveCertification = () => {
    if (!selectedDocumentForCert || !certificationType || !certifierEmployee) {
      alert('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    const doc = transactionDocuments.find(d => d.id === selectedDocumentForCert);
    console.log('حفظ التوثيق:', {
      document: doc?.name,
      type: certificationType,
      certifier: certifierEmployee,
      date: certificationDate,
      time: certificationTime,
      notes: certificationNotes,
      transaction: currentTransaction.number
    });

    alert(`تم توثيق المستند "${doc?.name}" بنجاح!\nنوع التوثيق: ${certificationType}\nالتاريخ: ${certificationDate} ${certificationTime}`);
    
    // إعادة تعيين النموذج
    setSelectedDocumentForCert('');
    setCertificationType('digital');
    setCertifierEmployee('');
    setCertificationNotes('');
    setShowDigitalCertification(false);
  };

  // دالة طباعة شهادة التوثيق
  const handlePrintCertification = () => {
    const doc = transactionDocuments.find(d => d.id === selectedDocumentForCert);
    if (!doc) {
      alert('يرجى اختيار مستند أولاً');
      return;
    }
    
    alert(`جارٍ طباعة شهادة التوثيق للمستند: ${doc.name}`);
    // هنا سيتم إضافة كود الطباعة الفعلي
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      active: { label: 'نشطة', color: 'bg-blue-500' },
      pending: { label: 'معلقة', color: 'bg-yellow-500' },
      completed: { label: 'مكتملة', color: 'bg-green-500' }
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${s.color} text-white`}>{s.label}</Badge>;
  };

  const renderTabContent = () => {
    // إذا لم يتم اختيار معاملة، أظهر الصفحة الافتراضية
    if (!currentTransaction) {
      return (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 280px)' }}>
          <Card className="max-w-2xl w-full card-rtl" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)' }}>
            <CardContent className="p-12 text-center">
              <div className="mb-6">
                <FileText className="h-24 w-24 mx-auto text-blue-400 mb-4" />
              </div>
              <h2 className="text-2xl mb-4" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1e40af' }}>
                مرحباً بك في شاشة معالجة المعاملات
              </h2>
              <p className="text-base text-gray-600 mb-6" style={{ fontFamily: 'Tajawal, sans-serif', lineHeight: 1.8 }}>
                لبدء العمل، يرجى اختيار معاملة من القائمة المنسدلة في الأعلى، أو استخدام خيارات البحث والتصفية للوصول إلى المعاملة المطلوبة.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <FileText className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>معالجة شاملة</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <Search className="h-8 w-8 mx-auto text-green-500 mb-2" />
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>بحث متقدم</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <Database className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>بيانات تفصيلية</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    switch (activeTab) {
      case '284-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة العامة للمعاملة</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />تصدير
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {/* 1. بطاقة رقم المعاملة - تفاعلية */}
              <Card 
                className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setShowTransactionNumberDialog(true)}
                style={{ 
                  border: '2px solid transparent',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)'
                }}
              >
                <CardContent className="p-0.5 text-center">
                  <FileText className="h-3 w-3 mx-auto text-blue-600 mb-0" />
                  <p className="text-sm text-blue-600 mb-0 font-mono" style={{ lineHeight: 1.2 }}>
                    {currentTransaction.number}
                  </p>
                  <p className="text-[8px] text-gray-600 mt-0" style={{ fontFamily: 'Tajawal, sans-serif', lineHeight: 1 }}>
                    رقم المعاملة
                  </p>
                </CardContent>
              </Card>
              
              {/* 2. بطاقة المالك - تفاعلية */}
              <Card 
                className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setShowOwnerDialog(true)}
                style={{ 
                  border: '2px solid transparent',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)'
                }}
              >
                <CardContent className="p-0.5 text-center">
                  <User className="h-3 w-3 mx-auto text-green-600 mb-0" />
                  <p className="text-[10px] text-green-600 mb-0 truncate" style={{ fontFamily: 'Tajawal, sans-serif', lineHeight: 1.2 }}>
                    {getFirstAndLastName(currentTransaction.ownerName)}
                  </p>
                  <p className="text-[8px] text-gray-500 mt-0" style={{ fontFamily: 'Tajawal, sans-serif', lineHeight: 1 }}>المالك</p>
                </CardContent>
              </Card>
              
              {/* 3. بطاقة المخطط+الموقع المدمجة - تفاعلية */}
              <Card 
                className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setShowPlanLocationDialog(true)}
                style={{ 
                  border: '2px solid transparent',
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)'
                }}
              >
                <CardContent className="p-0.5 text-center">
                  <MapPin className="h-3 w-3 mx-auto text-purple-600 mb-0" />
                  <p className="text-[10px] text-purple-600 mb-0" style={{ fontFamily: 'Tajawal, sans-serif', lineHeight: 1.2 }}>
                    ({currentTransaction.planNumber})
                  </p>
                  <p className="text-[8px] text-cyan-600 mt-0" style={{ fontFamily: 'Tajawal, sans-serif', lineHeight: 1 }}>
                    {currentTransaction.plotNumbers.length} قطعة • QR
                  </p>
                </CardContent>
              </Card>
              
              {/* 4. بطاقة النوع - تفاعلية */}
              <Card 
                className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setShowTypeDialog(true)}
                style={{ 
                  border: '2px solid transparent',
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(251, 146, 60, 0.05) 100%)'
                }}
              >
                <CardContent className="p-0.5 text-center">
                  <Building className="h-3 w-3 mx-auto text-orange-600 mb-0" />
                  <p className="text-[10px] text-orange-600 mb-0 truncate" style={{ fontFamily: 'Tajawal, sans-serif', lineHeight: 1.2 }}>
                    {currentTransaction.type}
                  </p>
                  <p className="text-[8px] text-gray-500 mt-0" style={{ fontFamily: 'Tajawal, sans-serif', lineHeight: 1 }}>النوع</p>
                </CardContent>
              </Card>
              
              {/* 5. بطاقة التاريخ - تفاعلية */}
              <Card 
                className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setShowDateDialog(true)}
                style={{ 
                  border: '2px solid transparent',
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(244, 114, 182, 0.05) 100%)'
                }}
              >
                <CardContent className="p-0.5 text-center">
                  <Calendar className="h-3 w-3 mx-auto text-pink-600 mb-0" />
                  <p className="text-[10px] text-pink-600 mb-0" style={{ fontFamily: 'Tajawal, sans-serif', lineHeight: 1.2 }}>
                    {currentTransaction.date}
                  </p>
                  <p className="text-[8px] text-gray-500 mt-0" style={{ fontFamily: 'Tajawal, sans-serif', lineHeight: 1 }}>الإنشاء</p>
                </CardContent>
              </Card>
              
              {/* 6. بطاقة الحالة - تفاعلية بدون truncate */}
              <Card 
                className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setShowStatusDialog(true)}
                style={{ 
                  border: `2px solid ${transactionStatuses[currentTransaction.status]?.color || '#6b7280'}`,
                  background: transactionStatuses[currentTransaction.status]?.bgColor || 'rgba(107, 114, 128, 0.1)'
                }}
              >
                <CardContent className="p-0.5 text-center">
                  <div className="flex items-center justify-center mb-0">
                    {React.createElement(transactionStatuses[currentTransaction.status]?.icon || AlertCircle, { 
                      className: 'h-3 w-3',
                      style: { color: transactionStatuses[currentTransaction.status]?.color || '#6b7280' }
                    })}
                  </div>
                  <p 
                    className="text-[8px] mb-0" 
                    style={{ 
                      fontFamily: 'Tajawal, sans-serif',
                      color: transactionStatuses[currentTransaction.status]?.color || '#6b7280',
                      lineHeight: 1.2,
                      wordWrap: 'break-word',
                      whiteSpace: 'normal'
                    }}
                  >
                    {transactionStatuses[currentTransaction.status]?.label || 'غير محدد'}
                  </p>
                </CardContent>
              </Card>
              
              {/* 7. بطاقة نسبة الإنجاز - تفاعلية */}
              <Card 
                className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setShowProgressDialog(true)}
                style={{ 
                  border: '2px solid transparent',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)'
                }}
              >
                <CardContent className="p-0.5 text-center">
                  <TrendingUp className="h-3 w-3 mx-auto text-emerald-600 mb-0" />
                  <div className="flex items-center justify-center gap-0.5">
                    <span className="text-sm text-emerald-600 font-mono" style={{ lineHeight: 1 }}>
                      {currentTransaction.progress}
                    </span>
                    <span className="text-[8px] text-emerald-600">%</span>
                  </div>
                  <p className="text-[8px] text-gray-500 mt-0" style={{ fontFamily: 'Tajawal, sans-serif', lineHeight: 1 }}>الإنجاز</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <TrendingUp className="h-4 w-4" />
                  التقدم الكلي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المراحل المكتملة</span>
                      <span className="text-xs font-mono">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوثائق المرفوعة</span>
                      <span className="text-xs font-mono">80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموافقات</span>
                      <span className="text-xs font-mono">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '284-26':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الأرشفة</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">حفظ</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2 space-y-2">
                <EnhancedSwitch
                  id="auto-progress"
                  label="التقدم التلقائي"
                  description="تحديث حالة المعاملة تلقائياً"
                  checked={autoProgress}
                  onCheckedChange={setAutoProgress}
                  size="sm"
                  variant="success"
                />
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>محتوى التبويب قيد التطوير</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-284" position="top-right" />
      
      {/* الهيدر الاحترافي v4.2.3 - ملاصق لسايد بار الشاشات */}
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
          marginRight: '256px', // ✅ ملاصق لسايد بار الشاشات
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)'
        }}
      >
        {/* السطر الأول: معلومات الشاشة */}
        <div 
          className="flex items-center justify-between"
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(124, 58, 237, 0.02) 100%)'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                borderRadius: '10px',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.15)',
                border: '2px solid rgba(37, 99, 235, 0.2)'
              }}
            >
              <FileText 
                className="h-5 w-5" 
                style={{ 
                  color: '#2563eb',
                  filter: 'drop-shadow(0 1px 2px rgba(37, 99, 235, 0.3))' 
                }} 
              />
            </div>
            
            <div className="flex items-center gap-2">
              <h1 
                style={{ 
                  fontFamily: 'Tajawal, sans-serif', 
                  fontWeight: 700, 
                  fontSize: '18px', 
                  margin: 0,
                  background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em'
                }}
              >
                معالجة المعاملات
              </h1>
              
              <div
                style={{
                  padding: '3px 10px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  borderRadius: '6px',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <span 
                  className="font-mono" 
                  style={{ 
                    fontSize: '12px', 
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '0.05em'
                  }}
                >
                  284
                </span>
              </div>
            </div>
          </div>
          
          <div 
            style={{
              padding: '5px 12px',
              background: 'rgba(37, 99, 235, 0.08)',
              borderRadius: '6px',
              border: '1px solid rgba(37, 99, 235, 0.15)'
            }}
          >
            <span 
              style={{ 
                fontFamily: 'Tajawal, sans-serif', 
                fontSize: '11px', 
                color: '#475569',
                fontWeight: 600
              }}
            >
              26 تبويباً
            </span>
          </div>
        </div>

        {/* السطر الثاني: الإجراءات السريعة على المعاملة */}
        {selectedTransaction && (
          <div
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.04) 0%, rgba(147, 51, 234, 0.03) 100%)',
              borderTop: '1px solid rgba(37, 99, 235, 0.08)'
            }}
          >
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                gap: '6px',
                maxWidth: '100%'
              }}
            >
              {/* أتعاب المكتب - صلاحية خاصة */}
              {currentUser.permissions?.includes('VIEW_OFFICE_FEES') && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert('عرض تفاصيل الأتعاب')}
                  style={{
                    height: '28px',
                    padding: '0 8px',
                    fontSize: '10px',
                    fontFamily: 'Tajawal, sans-serif',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    border: '1.5px solid #f59e0b',
                    color: '#92400e',
                    fontWeight: 600
                  }}
                  className="hover:shadow-md transition-all"
                >
                  <CreditCard className="h-3 w-3 ml-1" />
                  أتعاب المكتب
                </Button>
              )}

              {/* إرسال رسالة للمالك */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => alert('إرسال رسالة للمالك')}
                disabled={!selectedTransaction}
                style={{
                  height: '28px',
                  padding: '0 8px',
                  fontSize: '10px',
                  fontFamily: 'Tajawal, sans-serif',
                  background: selectedTransaction ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' : '#f3f4f6',
                  border: '1.5px solid #3b82f6',
                  color: selectedTransaction ? '#1e40af' : '#9ca3af',
                  fontWeight: 600,
                  opacity: selectedTransaction ? 1 : 0.5
                }}
                className="hover:shadow-md transition-all"
              >
                <Send className="h-3 w-3 ml-1" />
                رسالة للمالك
              </Button>

              {/* إرسال ملفات */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => alert('إرسال ملفات')}
                disabled={!selectedTransaction}
                style={{
                  height: '28px',
                  padding: '0 8px',
                  fontSize: '10px',
                  fontFamily: 'Tajawal, sans-serif',
                  background: selectedTransaction ? 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' : '#f3f4f6',
                  border: '1.5px solid #6366f1',
                  color: selectedTransaction ? '#3730a3' : '#9ca3af',
                  fontWeight: 600,
                  opacity: selectedTransaction ? 1 : 0.5
                }}
                className="hover:shadow-md transition-all"
              >
                <Paperclip className="h-3 w-3 ml-1" />
                إرسال ملفات
              </Button>

              {/* إيقاف مؤقت - فقط للمعاملات النشطة */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => alert('إيقاف المعاملة مؤقتاً')}
                disabled={!selectedTransaction || selectedTransactionData?.status === 'on-hold' || selectedTransactionData?.status === 'cancelled' || selectedTransactionData?.status === 'completed'}
                style={{
                  height: '28px',
                  padding: '0 8px',
                  fontSize: '10px',
                  fontFamily: 'Tajawal, sans-serif',
                  background: (selectedTransaction && selectedTransactionData?.status !== 'on-hold' && selectedTransactionData?.status !== 'cancelled' && selectedTransactionData?.status !== 'completed') ? 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)' : '#f3f4f6',
                  border: '1.5px solid #eab308',
                  color: (selectedTransaction && selectedTransactionData?.status !== 'on-hold' && selectedTransactionData?.status !== 'cancelled' && selectedTransactionData?.status !== 'completed') ? '#713f12' : '#9ca3af',
                  fontWeight: 600,
                  opacity: (selectedTransaction && selectedTransactionData?.status !== 'on-hold' && selectedTransactionData?.status !== 'cancelled' && selectedTransactionData?.status !== 'completed') ? 1 : 0.5
                }}
                className="hover:shadow-md transition-all"
              >
                <AlertCircle className="h-3 w-3 ml-1" />
                إيقاف مؤقت
              </Button>

              {/* إلغاء المعاملة - فقط للمعاملات غير الملغاة */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => alert('إلغاء المعاملة')}
                disabled={!selectedTransaction || selectedTransactionData?.status === 'cancelled' || selectedTransactionData?.status === 'completed'}
                style={{
                  height: '28px',
                  padding: '0 8px',
                  fontSize: '10px',
                  fontFamily: 'Tajawal, sans-serif',
                  background: (selectedTransaction && selectedTransactionData?.status !== 'cancelled' && selectedTransactionData?.status !== 'completed') ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' : '#f3f4f6',
                  border: '1.5px solid #ef4444',
                  color: (selectedTransaction && selectedTransactionData?.status !== 'cancelled' && selectedTransactionData?.status !== 'completed') ? '#7f1d1d' : '#9ca3af',
                  fontWeight: 600,
                  opacity: (selectedTransaction && selectedTransactionData?.status !== 'cancelled' && selectedTransactionData?.status !== 'completed') ? 1 : 0.5
                }}
                className="hover:shadow-md transition-all"
              >
                <X className="h-3 w-3 ml-1" />
                إلغاء المعاملة
              </Button>

              {/* إعادة التنشيط - فقط للمعاملات الملغاة */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => alert('إعادة تنشيط المعاملة')}
                disabled={!selectedTransaction || selectedTransactionData?.status !== 'cancelled'}
                style={{
                  height: '28px',
                  padding: '0 8px',
                  fontSize: '10px',
                  fontFamily: 'Tajawal, sans-serif',
                  background: (selectedTransaction && selectedTransactionData?.status === 'cancelled') ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' : '#f3f4f6',
                  border: '1.5px solid #22c55e',
                  color: (selectedTransaction && selectedTransactionData?.status === 'cancelled') ? '#14532d' : '#9ca3af',
                  fontWeight: 600,
                  opacity: (selectedTransaction && selectedTransactionData?.status === 'cancelled') ? 1 : 0.5
                }}
                className="hover:shadow-md transition-all"
              >
                <RefreshCw className="h-3 w-3 ml-1" />
                إعادة تنشيط
              </Button>

              {/* إنهاء المعاملة */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => alert('إنهاء المعاملة')}
                disabled={!selectedTransaction || selectedTransactionData?.status === 'completed' || selectedTransactionData?.status === 'cancelled'}
                style={{
                  height: '28px',
                  padding: '0 8px',
                  fontSize: '10px',
                  fontFamily: 'Tajawal, sans-serif',
                  background: (selectedTransaction && selectedTransactionData?.status !== 'completed' && selectedTransactionData?.status !== 'cancelled') ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' : '#f3f4f6',
                  border: '1.5px solid #10b981',
                  color: (selectedTransaction && selectedTransactionData?.status !== 'completed' && selectedTransactionData?.status !== 'cancelled') ? '#065f46' : '#9ca3af',
                  fontWeight: 600,
                  opacity: (selectedTransaction && selectedTransactionData?.status !== 'completed' && selectedTransactionData?.status !== 'cancelled') ? 1 : 0.5
                }}
                className="hover:shadow-md transition-all"
              >
                <CheckCircle className="h-3 w-3 ml-1" />
                إنهاء المعاملة
              </Button>

              {/* رفع ملفات */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => alert('رفع ملفات للمعاملة')}
                disabled={!selectedTransaction}
                style={{
                  height: '28px',
                  padding: '0 8px',
                  fontSize: '10px',
                  fontFamily: 'Tajawal, sans-serif',
                  background: selectedTransaction ? 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)' : '#f3f4f6',
                  border: '1.5px solid #a855f7',
                  color: selectedTransaction ? '#581c87' : '#9ca3af',
                  fontWeight: 600,
                  opacity: selectedTransaction ? 1 : 0.5
                }}
                className="hover:shadow-md transition-all"
              >
                <span style={{ display: 'inline-block', transform: 'rotate(180deg)', marginLeft: '4px' }}>
                  <Download className="h-3 w-3" />
                </span>
                رفع ملفات
              </Button>

              {/* نقل الملكية */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => alert('نقل ملكية المعاملة')}
                disabled={!selectedTransaction}
                style={{
                  height: '28px',
                  padding: '0 8px',
                  fontSize: '10px',
                  fontFamily: 'Tajawal, sans-serif',
                  background: selectedTransaction ? 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)' : '#f3f4f6',
                  border: '1.5px solid #f97316',
                  color: selectedTransaction ? '#7c2d12' : '#9ca3af',
                  fontWeight: 600,
                  opacity: selectedTransaction ? 1 : 0.5
                }}
                className="hover:shadow-md transition-all"
              >
                <UserPlus className="h-3 w-3 ml-1" />
                نقل الملكية
              </Button>
            </div>
          </div>
        )}

        {/* شريط اختيار المعاملة والبحث */}
        <div 
          style={{
            padding: '6px 16px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
            borderTop: '1px solid rgba(37, 99, 235, 0.1)'
          }}
        >
          <div className="grid grid-cols-12 gap-2">
            {/* اختيار المعاملة - موسع */}
            <div className="col-span-4">
              <select
                id="selected-transaction"
                value={selectedTransaction}
                onChange={(e) => setSelectedTransaction(e.target.value)}
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '4px 8px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '6px',
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: '12px',
                  direction: 'rtl',
                  textAlign: 'right',
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {mockTransactions.map(t => {
                  const status = transactionStatuses[t.status as keyof typeof transactionStatuses];
                  return (
                    <option 
                      key={t.id} 
                      value={t.id}
                      style={{ 
                        fontFamily: 'Tajawal, sans-serif',
                        background: status?.bgColor || '#ffffff',
                        color: status?.color || '#000000'
                      }}
                    >
                      {formatTransactionLabel(t)} • {status?.label}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* البحث الذكي - مقلص */}
            <div className="col-span-4">
              <input
                type="text"
                id="search-transaction"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`بحث (${detectedSearchType === 'auto' ? 'تلقائي' : detectedSearchType === 'number' ? 'رقم' : detectedSearchType === 'owner' ? 'مالك' : detectedSearchType === 'id' ? 'هوية' : 'مخطط'})`}
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '4px 8px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '6px',
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: '12px',
                  direction: 'rtl',
                  textAlign: 'right',
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* نوع المعاملة - جديد */}
            <div className="col-span-2">
              <select
                id="filter-type"
                value={filterTransactionType}
                onChange={(e) => setFilterTransactionType(e.target.value)}
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '4px 8px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '6px',
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: '12px',
                  direction: 'rtl',
                  textAlign: 'right',
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">كل الأنواع</option>
                {transactionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* السنة - مقلص */}
            <div className="col-span-1">
              <select
                id="filter-year"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '4px 8px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '6px',
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: '12px',
                  direction: 'rtl',
                  textAlign: 'right',
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">كل السنوات</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>

            {/* الشهر - مقلص */}
            <div className="col-span-1">
              <select
                id="filter-month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '4px 8px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '6px',
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: '12px',
                  direction: 'rtl',
                  textAlign: 'right',
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">كل الأشهر</option>
                <option value="01">يناير</option>
                <option value="02">فبراير</option>
                <option value="03">مارس</option>
                <option value="04">أبريل</option>
                <option value="05">مايو</option>
                <option value="06">يونيو</option>
                <option value="07">يوليو</option>
                <option value="08">أغسطس</option>
                <option value="09">سبتمبر</option>
                <option value="10">أكتوبر</option>
                <option value="11">نوفمبر</option>
                <option value="12">ديسمبر</option>
              </select>
            </div>
          </div>
        </div>

        {/* شريط الإجراءات السريعة */}
        <div 
          style={{
            padding: '8px 20px',
            background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.8) 100%)',
            borderTop: '1px solid rgba(229, 231, 235, 0.5)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto'
          }}
        >
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 text-xs gap-1 flex-shrink-0 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-purple-300"
            onClick={() => setShowDigitalCertification(true)}
          >
            <FileSignature className="h-3 w-3 text-purple-600" />
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>التوثيق الرقمي</span>
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 flex-shrink-0">
            <Plus className="h-3 w-3" />إنشاء معاملة
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 flex-shrink-0">
            <UserPlus className="h-3 w-3" />إضافة مالك
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 flex-shrink-0">
            <FolderOpen className="h-3 w-3" />المستندات (750)
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 flex-shrink-0">
            <Stamp className="h-3 w-3" />الأختام (946)
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 flex-shrink-0">
            <FileSignature className="h-3 w-3" />التعهدات (940)
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 flex-shrink-0">
            <Printer className="h-3 w-3" />الطباعة (831)
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 flex-shrink-0">
            <Download className="h-3 w-3" />تصدير
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 flex-shrink-0">
            <History className="h-3 w-3" />السجل (285)
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 flex-shrink-0">
            <Settings className="h-3 w-3" />الإعدادات (701)
          </Button>
        </div>
      </div>

      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        {/* سايد بار مخصص للشاشة 284 - يبدأ من هيدر النظام */}
        <div
          style={{
            width: '220px',
            minWidth: '220px',
            height: 'calc(100vh - 72px)', // من هيدر النظام إلى الفوتر
            position: 'fixed',
            top: '40px', // من أسفل هيدر النظام مباشرة
            right: '280px', // بعد سايد بار الشاشات (256px + 24px gap)
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
            border: '2px solid #f59e0b',
            borderRadius: '16px 0 0 16px',
            boxShadow: '-4px 0 16px rgba(245, 158, 11, 0.25)',
            overflow: 'hidden',
            zIndex: 5
          }}
        >
          <ScrollArea 
            className="h-full" 
            style={{ 
              '--scrollbar-width': '8px',
              '--scrollbar-track-color': 'rgba(245, 158, 11, 0.2)',
              '--scrollbar-thumb-color': '#d97706',
              '--scrollbar-thumb-hover-color': '#f59e0b'
            } as React.CSSProperties}
          >
            <style>{`
              .scroll-area-viewport::-webkit-scrollbar {
                width: 8px !important;
                display: block !important;
              }
              .scroll-area-viewport::-webkit-scrollbar-track {
                background: rgba(245, 158, 11, 0.2) !important;
                border-radius: 6px !important;
              }
              .scroll-area-viewport::-webkit-scrollbar-thumb {
                background: #d97706 !important;
                border-radius: 6px !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
              }
              .scroll-area-viewport::-webkit-scrollbar-thumb:hover {
                background: #f59e0b !important;
              }
            `}</style>
            
            <div className="space-y-0 px-[17px] py-[9px] mx-[10px] my-[0px]">
              {TABS_CONFIG.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full p-1.5 rounded-xl transition-all duration-300 text-right
                      flex items-center gap-1
                      ${isActive 
                        ? 'bg-white shadow-lg scale-[1.03] border-2' 
                        : 'bg-white/20 hover:bg-white/40 hover:shadow-md'
                      }
                    `}
                    style={{
                      borderColor: isActive ? '#dc2626' : 'transparent',
                      backdropFilter: isActive ? 'blur(10px)' : 'none'
                    }}
                  >
                    <Icon 
                      className="h-4 w-4 flex-shrink-0" 
                      style={{ color: isActive ? '#dc2626' : '#1e40af' }}
                    />
                    
                    <div 
                      className="flex-1 text-right line-clamp-1" 
                      style={{ 
                        fontFamily: 'Tajawal, sans-serif',
                        fontWeight: 700,
                        fontSize: '10px',
                        color: isActive ? '#dc2626' : '#1e3a8a',
                        lineHeight: '1.3'
                      }}
                    >
                      {tab.title}
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className="font-mono flex-shrink-0"
                      style={{
                        background: isActive ? '#fef2f2' : 'rgba(255, 255, 255, 0.6)',
                        border: `1px solid ${isActive ? '#dc2626' : '#1e40af'}`,
                        color: isActive ? '#dc2626' : '#1e40af',
                        padding: '1px 5px',
                        fontSize: '9px',
                        lineHeight: '1.2'
                      }}
                    >
                      {tab.number}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
        
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 320px)', paddingLeft: '236px', paddingRight: '16px' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة التوثيق الرقمي السريع */}
      <Dialog open={showDigitalCertification} onOpenChange={setShowDigitalCertification}>
        <DialogContent 
          className="max-w-6xl dialog-rtl"
          style={{ 
            maxHeight: '90vh', 
            overflow: 'auto',
            fontFamily: 'Tajawal, sans-serif'
          }}
        >
          <DialogHeader className="dialog-header" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '16px' }}>
            <div className="flex items-center gap-3">
              <div 
                style={{
                  padding: '10px',
                  background: 'linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%)',
                  borderRadius: '12px',
                  border: '2px solid #a855f7'
                }}
              >
                <FileSignature className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <DialogTitle 
                  className="dialog-title" 
                  style={{ 
                    fontFamily: 'Tajawal, sans-serif',
                    fontSize: '20px',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  التوثيق الرقمي السريع للمستندات
                </DialogTitle>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
                  المعاملة رقم: <span className="font-mono" style={{ color: '#2563eb', fontWeight: 600 }}>{currentTransaction.number}</span> • {currentTransaction.ownerName}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="form-rtl" style={{ padding: '20px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              {/* القسم الأيمن: قائمة المستندات */}
              <div>
                <div 
                  style={{ 
                    padding: '12px 16px',
                    background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    border: '2px solid #93c5fd'
                  }}
                >
                  <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px', color: '#1e40af', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FolderOpen className="h-4 w-4" />
                    مستندات المعاملة ({transactionDocuments.length})
                  </h3>
                </div>

                <div style={{ maxHeight: '400px', overflow: 'auto', paddingRight: '8px' }}>
                  <div className="space-y-2">
                    {transactionDocuments.map((doc) => (
                      <Card 
                        key={doc.id}
                        className={`cursor-pointer transition-all ${selectedDocumentForCert === doc.id ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:bg-gray-50'}`}
                        onClick={() => setSelectedDocumentForCert(doc.id)}
                        style={{ 
                          border: selectedDocumentForCert === doc.id ? '2px solid #a855f7' : '1px solid #e5e7eb'
                        }}
                      >
                        <CardContent style={{ padding: '12px' }}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, margin: 0 }}>
                                  {doc.name}
                                </p>
                              </div>
                              <div className="flex items-center gap-3" style={{ fontSize: '12px', color: '#64748b' }}>
                                <span className="flex items-center gap-1">
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                    {doc.type}
                                  </Badge>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {doc.date}
                                </span>
                                <span className="font-mono text-[11px]">{doc.id}</span>
                              </div>
                            </div>
                            <div>
                              {doc.certified ? (
                                <Badge className="bg-green-500 text-white text-[10px] px-2 py-0.5">
                                  <CheckCircle className="h-3 w-3 ml-1" />
                                  موثق
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-orange-400 text-orange-600">
                                  <AlertCircle className="h-3 w-3 ml-1" />
                                  غير موثق
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* القسم الأيسر: نموذج التوثيق */}
              <div>
                <div 
                  style={{ 
                    padding: '12px 16px',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    border: '2px solid #fbbf24'
                  }}
                >
                  <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px', color: '#92400e', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Stamp className="h-4 w-4" />
                    بيانات التوثيق
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* المستند المحدد */}
                  <div 
                    style={{ 
                      padding: '12px',
                      background: selectedDocumentForCert ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : '#f9fafb',
                      borderRadius: '8px',
                      border: selectedDocumentForCert ? '2px solid #86efac' : '1px dashed #d1d5db'
                    }}
                  >
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                      المستند المحدد للتوثيق:
                    </p>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, color: selectedDocumentForCert ? '#166534' : '#9ca3af' }}>
                      {selectedDocumentForCert 
                        ? transactionDocuments.find(d => d.id === selectedDocumentForCert)?.name 
                        : 'لم يتم اختيار مستند بعد'}
                    </p>
                  </div>

                  {/* نوع التوثيق */}
                  <SelectWithCopy
                    label="نوع التوثيق *"
                    id="certification-type"
                    value={certificationType}
                    onChange={setCertificationType}
                    options={[
                      { value: 'digital', label: '🔐 توثيق رقمي (Digital Signature)' },
                      { value: 'stamp', label: '🏛️ ختم رسمي (Official Stamp)' },
                      { value: 'signature', label: '✍️ توقيع يدوي (Manual Signature)' },
                      { value: 'notary', label: '📋 توثيق كتابي (Notary)' },
                      { value: 'electronic', label: '💻 توثيق إلكتروني (E-Certification)' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />

                  {/* الموظف المصدق */}
                  <SelectWithCopy
                    label="الموظف المصدق *"
                    id="certifier-employee"
                    value={certifierEmployee}
                    onChange={setCertifierEmployee}
                    options={certifierEmployees}
                    copyable={true}
                    clearable={true}
                  />

                  {/* التاريخ والوقت */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <InputWithCopy
                      label="تاريخ التوثيق *"
                      id="certification-date"
                      type="date"
                      value={certificationDate}
                      onChange={(e) => setCertificationDate(e.target.value)}
                      copyable={true}
                      clearable={false}
                    />
                    <InputWithCopy
                      label="وقت التوثيق *"
                      id="certification-time"
                      type="time"
                      value={certificationTime}
                      onChange={(e) => setCertificationTime(e.target.value)}
                      copyable={true}
                      clearable={false}
                    />
                  </div>

                  {/* الملاحظات */}
                  <div className="form-group">
                    <label 
                      htmlFor="certification-notes" 
                      style={{ 
                        display: 'block',
                        fontFamily: 'Tajawal, sans-serif',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#374151',
                        marginBottom: '8px',
                        textAlign: 'right'
                      }}
                    >
                      ملاحظات التوثيق (اختياري)
                    </label>
                    <textarea
                      id="certification-notes"
                      value={certificationNotes}
                      onChange={(e) => setCertificationNotes(e.target.value)}
                      rows={4}
                      placeholder="أضف أي ملاحظات أو تفاصيل إضافية حول التوثيق..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontFamily: 'Tajawal, sans-serif',
                        fontSize: '13px',
                        direction: 'rtl',
                        textAlign: 'right',
                        resize: 'vertical',
                        transition: 'all 0.2s',
                        background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2563eb';
                        e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* معلومات إضافية */}
                  <div 
                    style={{ 
                      padding: '12px',
                      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                      borderRadius: '8px',
                      border: '1px solid #93c5fd'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, color: '#1e40af', margin: 0 }}>
                        معلومات الأمان
                      </p>
                    </div>
                    <div className="space-y-1" style={{ fontSize: '11px', color: '#64748b' }}>
                      <p style={{ margin: 0 }}>✓ سيتم حفظ جميع بيانات التوثيق بشكل مشفر</p>
                      <p style={{ margin: 0 }}>✓ سيتم إرسال إشعار للموظف المصدق</p>
                      <p style={{ margin: 0 }}>✓ سيتم تسجيل التوثيق في سجل النشاط</p>
                      <p style={{ margin: 0 }}>✓ يمكن طباعة شهادة التوثيق بعد الحفظ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter 
            style={{ 
              borderTop: '2px solid #e5e7eb', 
              paddingTop: '16px',
              display: 'flex',
              gap: '12px',
              justifyContent: 'space-between'
            }}
          >
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDigitalCertification(false)}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <X className="h-4 w-4 ml-1" />
                إلغاء
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={handlePrintCertification}
                disabled={!selectedDocumentForCert}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Printer className="h-4 w-4 ml-1" />
                طباعة الشهادة
              </Button>
              <Button 
                onClick={handleSaveCertification}
                disabled={!selectedDocumentForCert || !certificationType || !certifierEmployee}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Save className="h-4 w-4 ml-1" />
                حفظ التوثيق
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 1. نافذة رقم المعاملة والبيانات المرجعية - محسّنة v9.2 */}
      <Dialog open={showTransactionNumberDialog} onOpenChange={setShowTransactionNumberDialog}>
        <DialogContent 
          className="max-w-7xl" 
          style={{ 
            fontFamily: 'Tajawal, sans-serif', 
            direction: 'rtl',
            maxHeight: '90vh',
            height: 'auto'
          }}
        >
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{
                  padding: '8px',
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FileText className="h-6 w-6" style={{ color: '#2563eb' }} />
              </div>
              <span style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                تفاصيل رقم المعاملة والبيانات المرجعية
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4" style={{ maxHeight: 'calc(90vh - 180px)', overflowY: 'auto', paddingLeft: '4px' }}>
            {/* رقم المعاملة لدى المكتب - مع زر نسخ */}
            <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)', border: '2px solid #93c5fd' }}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1e40af' }}>
                    رقم المعاملة لدى المكتب
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const success = await safeCopyToClipboard(currentTransaction.number);
                      if (success) {
                        alert('✅ تم نسخ رقم المعاملة بنجاح');
                      } else {
                        alert('❌ فشل في نسخ رقم المعاملة');
                      }
                    }}
                    style={{ 
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    <FileText className="h-3 w-3 ml-1" />
                    نسخ الرقم
                  </Button>
                </div>
                <div className="flex items-center justify-center p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)', border: '2px solid #60a5fa' }}>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>الرقم المرجعي</p>
                    <p className="text-4xl text-blue-600 font-mono mb-3" style={{ fontWeight: 800, letterSpacing: '2px' }}>
                      {currentTransaction.number}
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-700">السنة: <strong>{parseTransactionNumber(currentTransaction.number).yearFull}</strong></span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-700">الشهر: <strong>{parseTransactionNumber(currentTransaction.number).monthName}</strong></span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-700">الترتيب: <strong>{parseTransactionNumber(currentTransaction.number).sequence}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* البيانات المرجعية للمعاملة لدى الجهات - جدول محسّن */}
            <Card className="card-rtl" style={{ border: '2px solid #e5e7eb' }}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1f2937' }}>
                    <Database className="h-5 w-5 inline ml-2 text-purple-600" />
                    البيانات المرجعية للمعاملة لدى الجهات
                  </h3>
                  <Badge className="bg-purple-100 text-purple-700" style={{ fontSize: '12px' }}>
                    {currentTransaction.externalReferences?.length || 0} جهة
                  </Badge>
                </div>
                
                <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <Table className="table-rtl">
                    <TableHeader style={{ position: 'sticky', top: 0, zIndex: 1, background: '#f8fafc' }}>
                      <TableRow style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', borderBottom: '2px solid #cbd5e1' }}>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: '13px' }}>
                          <Building className="h-4 w-4 inline ml-1" />
                          اسم الجهة
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: '13px', minWidth: '150px' }}>
                          <FileText className="h-4 w-4 inline ml-1 text-blue-600" />
                          رقم الرخصة
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: '13px', minWidth: '140px' }}>
                          <Calendar className="h-4 w-4 inline ml-1 text-green-600" />
                          سنة الرخصة (هجري)
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: '13px', minWidth: '160px' }}>
                          <FileCheck className="h-4 w-4 inline ml-1 text-orange-600" />
                          رقم طلب الخدمة
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: '13px' }}>
                          سنة طلب الخدمة
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: '13px' }}>
                          رقم الطلب
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: '13px' }}>
                          سنة الطلب
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: '13px', width: '120px' }}>
                          الإجراءات
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentTransaction.externalReferences?.map((ref, index) => (
                        <TableRow 
                          key={index}
                          style={{ 
                            borderBottom: '1px solid #e5e7eb',
                            transition: 'background 0.2s'
                          }}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600 }}>
                            {ref.entityName}
                          </TableCell>
                          
                          {/* رقم الرخصة - مميز بخلفية زرقاء */}
                          <TableCell className="text-right">
                            <div 
                              style={{ 
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                borderRadius: '8px',
                                border: '1px solid #93c5fd'
                              }}
                            >
                              <FileText className="h-3 w-3 text-blue-600" />
                              <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af' }}>
                                {ref.licenseNumber}
                              </span>
                            </div>
                          </TableCell>
                          
                          {/* سنة الرخصة - مميز بخلفية خضراء */}
                          <TableCell className="text-right">
                            <div 
                              style={{ 
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                                borderRadius: '8px',
                                border: '1px solid #6ee7b7'
                              }}
                            >
                              <Calendar className="h-3 w-3 text-green-600" />
                              <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#065f46' }}>
                                {ref.licenseYearHijri}
                              </span>
                            </div>
                          </TableCell>
                          
                          {/* رقم طلب الخدمة - مميز بخلفية برتقالية */}
                          <TableCell className="text-right">
                            <div 
                              style={{ 
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
                                borderRadius: '8px',
                                border: '1px solid #fb923c'
                              }}
                            >
                              <FileCheck className="h-3 w-3 text-orange-600" />
                              <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#9a3412' }}>
                                {ref.serviceRequestNumber}
                              </span>
                            </div>
                          </TableCell>
                          
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                            {ref.serviceRequestYear}
                          </TableCell>
                          <TableCell className="text-right font-mono" style={{ fontSize: '13px' }}>
                            {ref.requestNumber}
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                            {ref.requestYear}
                          </TableCell>
                          
                          {/* زر نسخ الصف */}
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={async () => {
                                const rowData = `${ref.entityName} | رخصة: ${ref.licenseNumber} (${ref.licenseYearHijri}) | خدمة: ${ref.serviceRequestNumber} (${ref.serviceRequestYear}) | طلب: ${ref.requestNumber} (${ref.requestYear})`;
                                const success = await safeCopyToClipboard(rowData);
                                if (success) {
                                  alert('✅ تم نسخ بيانات الصف بنجاح');
                                } else {
                                  alert('❌ فشل في نسخ بيانات الصف');
                                }
                              }}
                              style={{ 
                                padding: '4px 8px',
                                height: 'auto'
                              }}
                              title="نسخ بيانات الصف"
                            >
                              <FileText className="h-3 w-3 text-gray-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* ملاحظات ومعلومات */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1px solid #93c5fd' }}>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" style={{ flexShrink: 0 }} />
                  <div>
                    <p className="text-sm text-blue-900 mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                      معلومات هامة
                    </p>
                    <p className="text-xs text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif', lineHeight: 1.6 }}>
                      يتم الحصول على البيانات المرجعية من تاب "بيانات المعاملة" في شاشة معالجة المعاملات (284) وشاشة إنشاء معاملة (286)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '1px solid #86efac' }}>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" style={{ flexShrink: 0 }} />
                  <div>
                    <p className="text-sm text-green-900 mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                      الحقول المميزة
                    </p>
                    <ul className="text-xs text-green-700 space-y-0.5" style={{ fontFamily: 'Tajawal, sans-serif', lineHeight: 1.5 }}>
                      <li>🔵 رقم الرخصة (خلفية زرقاء)</li>
                      <li>🟢 سنة الرخصة الهجري (خلفية خضراء)</li>
                      <li>🟠 رقم طلب الخدمة (خلفية برتقالية)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px', display: 'flex', gap: '8px' }}>
            <Button
              variant="outline"
              onClick={async () => {
                // نسخ جميع البيانات
                const allData = currentTransaction.externalReferences?.map((ref, i) => 
                  `${i + 1}. ${ref.entityName} | رخصة: ${ref.licenseNumber} (${ref.licenseYearHijri}) | خدمة: ${ref.serviceRequestNumber} (${ref.serviceRequestYear}) | طلب: ${ref.requestNumber} (${ref.requestYear})`
                ).join('\n');
                copyToClipboard(`رقم المعاملة: ${currentTransaction.number}\n\nالبيانات المرجعية:\n${allData}`).then(success => {
                  if (success) alert('تم نسخ جميع البيانات');
                });
              }}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Database className="h-4 w-4 ml-1" />
              نسخ كل البيانات
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowTransactionNumberDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <X className="h-4 w-4 ml-1" />
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة منبثقة: تفاصيل النوع والتصنيف */}
      <Dialog open={showTypeDialog} onOpenChange={setShowTypeDialog}>
        <DialogContent className="max-w-xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px' }}>
              <Building className="h-5 w-5 inline ml-2" />
              تفاصيل النوع والتصنيف
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* النوع الرئيسي */}
            <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(251, 146, 60, 0.05) 100%)' }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                    النوع الرئيسي
                  </h3>
                  <Badge className="bg-orange-500">{currentTransaction.type}</Badge>
                </div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {currentTransaction.mainCategory}
                </p>
              </CardContent>
            </Card>

            {/* التصنيف الفرعي */}
            <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, rgba(252, 211, 77, 0.05) 100%)' }}>
              <CardContent className="p-4">
                <h3 className="text-base mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                  التصنيف الفرعي
                </h3>
                <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {currentTransaction.subCategory}
                </p>
              </CardContent>
            </Card>

            {/* معلومات إضافية */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-xs text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                💡 يتم تحديد التصنيف الرئيسي والفرعي من شاشة إعدادات المعاملات (701) - تاب أنواع المعاملات
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTypeDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة منبثقة: تفاصيل الإنشاء */}
      <Dialog open={showDateDialog} onOpenChange={setShowDateDialog}>
        <DialogContent className="max-w-xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px' }}>
              <Calendar className="h-5 w-5 inline ml-2" />
              تفاصيل إنشاء المعاملة
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* معلومات الإنشاء */}
            <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(244, 114, 182, 0.05) 100%)' }}>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-pink-600" />
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الإنشاء</p>
                    </div>
                    <p className="text-base text-pink-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {currentTransaction.date}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-pink-600" />
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوقت</p>
                    </div>
                    <p className="text-base text-pink-600 font-mono">
                      {currentTransaction.createdDateTime.split(' ')[1]}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-pink-600" />
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>أنشئت بواسطة</p>
                    </div>
                    <p className="text-base text-pink-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {currentTransaction.createdBy}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* التاريخ الكامل */}
            <div className="p-4 rounded-lg border-2 border-pink-200" style={{ background: '#fdf2f8' }}>
              <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ والوقت الكامل</p>
              <p className="text-lg text-pink-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {currentTransaction.createdDateTime}
              </p>
            </div>

            {/* رقم المعاملة */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-700 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</p>
                  <p className="text-lg text-blue-900 font-mono">{currentTransaction.number}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-700 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة</p>
                  <p className="text-sm text-blue-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {parseTransactionNumber(currentTransaction.number).monthName} {parseTransactionNumber(currentTransaction.number).yearFull}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDateDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة منبثقة: تفاصيل الحالة */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="max-w-2xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px' }}>
              {React.createElement(transactionStatuses[currentTransaction.status]?.icon || AlertCircle, { 
                className: 'h-5 w-5 inline ml-2',
                style: { color: transactionStatuses[currentTransaction.status]?.color }
              })}
              تفاصيل حالة المعاملة
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* الحالة الحالية */}
            <Card 
              className="card-rtl" 
              style={{ 
                background: transactionStatuses[currentTransaction.status]?.bgColor,
                border: `2px solid ${transactionStatuses[currentTransaction.status]?.color}`
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                    الحالة الحالية
                  </h3>
                  <Badge style={{ background: transactionStatuses[currentTransaction.status]?.color, color: '#ffffff' }}>
                    {transactionStatuses[currentTransaction.status]?.label}
                  </Badge>
                </div>
                <p 
                  className="text-sm mb-2" 
                  style={{ 
                    fontFamily: 'Tajawal, sans-serif',
                    color: transactionStatuses[currentTransaction.status]?.color,
                    fontWeight: 600
                  }}
                >
                  {transactionStatuses[currentTransaction.status]?.shortDesc}
                </p>
                <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {transactionStatuses[currentTransaction.status]?.detailedDesc}
                </p>
              </CardContent>
            </Card>

            {/* السبب (إذا كانت الحالة تتطلب سبب) */}
            {transactionStatuses[currentTransaction.status]?.requiresReason && currentTransaction.statusReason && (
              <Card className="card-rtl" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '2px solid rgba(239, 68, 68, 0.2)' }}>
                <CardContent className="p-4">
                  <h3 className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                    السبب
                  </h3>
                  <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {currentTransaction.statusReason}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* معلومات التحديث */}
            {currentTransaction.statusBy && (
              <Card className="card-rtl">
                <CardContent className="p-4">
                  <h3 className="text-sm mb-3" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                    معلومات التحديث
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-gray-500" />
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>تم بواسطة</p>
                      </div>
                      <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {currentTransaction.statusBy}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</p>
                      </div>
                      <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {currentTransaction.statusDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ملاحظة */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-xs text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                💡 يتم إدارة حالات المعاملات من شاشة إعدادات المعاملات (701) - تاب حالات المعاملات (701-19)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. نافذة المالك */}
      <Dialog open={showOwnerDialog} onOpenChange={setShowOwnerDialog}>
        <DialogContent className="max-w-xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px' }}>
              <User className="h-5 w-5 inline ml-2" />
              معلومات المالك الكاملة
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)' }}>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم الكامل</p>
                    <p className="text-base text-green-700" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      {currentTransaction.ownerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الهوية الوطنية</p>
                    <p className="text-sm text-green-700 font-mono">{currentTransaction.ownerId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الجوال</p>
                    <p className="text-sm text-green-700 font-mono" dir="ltr">{currentTransaction.ownerPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>البريد الإلكتروني</p>
                    <p className="text-sm text-green-700 font-mono" dir="ltr">{currentTransaction.ownerEmail}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان الكامل</p>
                    <p className="text-sm text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {currentTransaction.ownerAddress}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOwnerDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. نافذة المخطط+الموقع المدمجة */}
      <Dialog open={showPlanLocationDialog} onOpenChange={setShowPlanLocationDialog}>
        <DialogContent className="max-w-4xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px' }}>
              <MapPin className="h-5 w-5 inline ml-2" />
              المخطط والموقع الجغرافي
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* قسم المخطط */}
            <div>
              <h3 className="text-base mb-3" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                📍 معلومات المخطط
              </h3>
              <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)' }}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المخطط</p>
                      <p className="text-sm text-purple-600 font-mono">{currentTransaction.planNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد القطع</p>
                      <p className="text-sm text-purple-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {currentTransaction.plotNumbers?.length || 0} قطعة
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {currentTransaction.plotNumbers?.map((plot, index) => (
                      <div 
                        key={index}
                        className="p-2 text-center rounded-lg border-2 border-purple-200"
                        style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' }}
                      >
                        <p className="text-[10px] text-gray-500 mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>قطعة</p>
                        <p className="text-base text-purple-600 font-mono">{plot}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* قسم الموقع */}
            <div>
              <h3 className="text-base mb-3" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                🗺️ الموقع الجغرافي
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(34, 211, 238, 0.05) 100%)' }}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</p>
                        <p className="text-sm text-cyan-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {currentTransaction.location?.address}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>خط العرض</p>
                          <p className="text-xs text-cyan-700 font-mono">{currentTransaction.location?.lat}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>خط الطول</p>
                          <p className="text-xs text-cyan-700 font-mono">{currentTransaction.location?.lng}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-rtl">
                  <CardContent className="p-4">
                    <div className="flex justify-center">
                      <div 
                        className="p-3 rounded-lg border-4 border-cyan-200" 
                        style={{ background: '#ffffff' }}
                      >
                        <div 
                          className="flex items-center justify-center"
                          style={{ 
                            width: '150px', 
                            height: '150px',
                            background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                            borderRadius: '8px'
                          }}
                        >
                          <div className="text-center">
                            <MapPin className="h-12 w-12 mx-auto text-cyan-600 mb-1" />
                            <p className="text-[10px] text-cyan-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>QR Code</p>
                            <p className="text-[9px] text-cyan-600 mt-1 font-mono">{currentTransaction.planNumber}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-center text-gray-500 mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      امسح الرمز للوصول للموقع
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="grid grid-cols-3 gap-3">
              <Button 
                className="w-full"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
                onClick={() => alert('جارٍ فتح المخطط...')}
              >
                <Eye className="h-4 w-4 ml-2" />
                استعراض المخطط
              </Button>
              <Button 
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
                onClick={() => window.open(currentTransaction.location?.qrCode, '_blank')}
              >
                <ExternalLink className="h-4 w-4 ml-2" />
                فتح في الخريطة
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
                onClick={() => {
                  copyToClipboard(`${currentTransaction.location?.lat}, ${currentTransaction.location?.lng}`).then(success => {
                    if (success) alert('تم نسخ الإحداثيات!');
                  });
                }}
              >
                <Download className="h-4 w-4 ml-2" />
                نسخ الإحداثيات
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlanLocationDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 7. نافذة نسبة الإنجاز */}
      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent className="max-w-2xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px' }}>
              <TrendingUp className="h-5 w-5 inline ml-2" />
              تفاصيل نسبة الإنجاز
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* المؤشر الدائري الكبير */}
            <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-center">
                  <div 
                    className="relative"
                    style={{ 
                      width: '180px', 
                      height: '180px',
                      borderRadius: '50%',
                      background: `conic-gradient(#10b981 0% ${currentTransaction.progress}%, #e5e7eb ${currentTransaction.progress}% 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div 
                      className="absolute"
                      style={{ 
                        width: '140px', 
                        height: '140px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                      }}
                    >
                      <span className="text-4xl text-emerald-600 font-mono" style={{ fontWeight: 700 }}>
                        {currentTransaction.progress}%
                      </span>
                      <span className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        نسبة الإنجاز
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* جدول المراحل */}
            <Card className="card-rtl">
              <CardContent className="p-4">
                <h3 className="text-sm mb-3" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                  تفاصيل المراحل
                </h3>
                <div className="space-y-3">
                  {currentTransaction.progressDetails?.map((stage, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stage.stageName}</span>
                          <span className="text-xs font-mono">{stage.percentage}%</span>
                        </div>
                        <Progress value={stage.percentage} className="h-2" />
                      </div>
                      <Badge 
                        className={
                          stage.status === 'مكتمل' ? 'bg-green-500' :
                          stage.status === 'جارٍ' ? 'bg-blue-500' : 'bg-gray-400'
                        }
                      >
                        {stage.status === 'مكتمل' ? '✅' : stage.status === 'جارٍ' ? '🔄' : '⏳'} {stage.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProgressDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainTransactionsScreen_Complete_284_v9;
