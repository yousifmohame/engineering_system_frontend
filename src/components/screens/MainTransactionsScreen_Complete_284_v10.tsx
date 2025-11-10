/**
 * الشاشة 284 - معالجة المعاملات v10.4 - النظام الشامل الكامل
 * ====================================================================
 * 
 * ✅ تحديثات v10.4 (توسعة المشروع والمكونات):
 * - إضافة 7 تابات جديدة (المجموع 46 تاباً)
 * - نظام الأوزان المتقدم (مجموع 107%)
 * - حساب نسبة الإنجاز الذكي
 * - وسم المعاملة كمنتهية تلقائياً عند اكتمال جميع التابات
 * 
 * التابات الجديدة v10.4 (7):
 * - مسميات وعدد الأدوار (قراءة ديناميكية)
 * - الارتدادات من الأربع جهات (لجميع الأدوار)
 * - المكونات التفصيلية النهائية (اختيارات متعددة + حسابات)
 * - المكونات حسب الرخصة القديمة
 * - المكونات حسب المقترح
 * - المكونات حسب القائم
 * - الحدود والمجاورين (مع الصور)
 * 
 * المميزات:
 * - 46 تاباً شاملاً (9 مراحل منظمة)
 * - نظام أوزان مرن قابل للتخصيص
 * - حفظ حالة الاكتمال لكل تاب
 * - حساب تلقائي لنسبة الإنجاز
 * - واجهة احترافية كاملة
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { 
  FileText, User, MapPin, Calendar, Clock, CheckCircle, AlertCircle,
  Edit, Save, Printer, Download, Eye, Settings, Phone, Mail,
  Building, CreditCard, Archive, History, Users, Shield, Database,
  Search, Filter, X, Plus, Send, Layers, TrendingUp, Award,
  BarChart3, FileCheck, Bell, Target, Paperclip, ExternalLink,
  ChevronDown, Home, UserPlus, FolderOpen, Stamp, FileSignature,
  Hash, RefreshCw, LucideIcon, MessageSquare, Briefcase, FileInput,
  ClipboardList, Receipt, Image as ImageIcon,
  DollarSign, Lock, Unlock, Calculator
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';
import { safeCopyToClipboard } from '../CopyHelper';

// استيراد التابات المطورة
import Tab_284_02_Notifications_Complete from './Tab_284_02_Notifications_Complete';
import Tab_284_03_Owner_Data_Complete from './Tab_284_03_Owner_Data_Complete';
import Tab_284_05_Applicant_Data_Complete from './Tab_284_05_Applicant_Data_Complete';
import Tab_RequestPurpose_Brief_Complete from './Tab_RequestPurpose_Brief_Complete';
import Tab_RequestPurpose_Detailed_Complete from './Tab_RequestPurpose_Detailed_Complete';
import Tab_FloorsNaming_Complete from './Tab_FloorsNaming_Complete';
import Tab_Setbacks_AllFloors_Complete from './Tab_Setbacks_AllFloors_Complete';
import Tab_FinalComponents_Detailed_Complete from './Tab_FinalComponents_Detailed_Complete';
import Tab_Components_Generic_Complete from './Tab_Components_Generic_Complete';
import Tab_Boundaries_Neighbors_Complete from './Tab_Boundaries_Neighbors_Complete';
import Tab_LandArea_Complete from './Tab_LandArea_Complete';

// ==================== الواجهات ====================

interface TabConfig {
  id: string;
  number: string;
  title: string;
  icon: LucideIcon;
  defaultWeight?: number;
}

interface TabCompletionStatus {
  tabId: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

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
  confidentialityLevel: 'عادية' | 'سرية';
  externalReferences: {
    entityName: string;
    licenseNumber: string;
    licenseYearHijri: string;
    serviceRequestNumber: string;
    serviceRequestYear: string;
    requestNumber: string;
    requestYear: string;
  }[];
  progressDetails: {
    stageName: string;
    percentage: number;
    status: string;
  }[];
  tabsCompletion: TabCompletionStatus[];
}

// ==================== تكوين التابات الجديدة (39 تاباً) ====================

const TABS_CONFIG: TabConfig[] = [
  // المرحلة 1: البيانات الأساسية (8 تابات) - محدثة
  { id: '284-01', number: '284-01', title: 'معلومات عامة', icon: FileText, defaultWeight: 3 },
  { id: '284-02', number: '284-02', title: 'الإشعارات والتنبيهات', icon: Bell, defaultWeight: 2 },
  { id: '284-03', number: '284-03', title: 'بيانات المالك', icon: User, defaultWeight: 4 },
  { id: '284-04', number: '284-04', title: 'بيانات الملكية', icon: Building, defaultWeight: 4 },
  { id: '284-05', number: '284-05', title: 'بيانات مقدم الطلب', icon: UserPlus, defaultWeight: 3 },
  { id: '284-06', number: '284-06', title: 'الموقع الجغرافي', icon: MapPin, defaultWeight: 3 },
  { id: '284-06B', number: '284-06B', title: 'الغرض المختصر من الطلب', icon: CheckCircle, defaultWeight: 2 },
  { id: '284-06C', number: '284-06C', title: 'الغرض التفصيلي من الطلب', icon: ClipboardList, defaultWeight: 3 },
  
  // المرحلة 2: المستندات والتحقق (4 تابات)
  { id: '284-07', number: '284-07', title: 'طلبات المالك', icon: ClipboardList, defaultWeight: 2 },
  { id: '284-08', number: '284-08', title: 'وثائق مستلمة من المالك', icon: FileInput, defaultWeight: 3 },
  { id: '284-09', number: '284-09', title: 'التحقق', icon: CheckCircle, defaultWeight: 3 },
  { id: '284-10', number: '284-10', title: 'طلبات المكتب', icon: Briefcase, defaultWeight: 2 },
  
  // المرحلة 3: العقود والمدفوعات (5 تابات) - حرجة
  { id: '284-11', number: '284-11', title: 'عرض السعر', icon: DollarSign, defaultWeight: 4 },
  { id: '284-12', number: '284-12', title: 'العقد', icon: FileSignature, defaultWeight: 5 },
  { id: '284-13', number: '284-13', title: 'المدفوعات', icon: CreditCard, defaultWeight: 4 },
  { id: '284-14', number: '284-14', title: 'مستحقات وفواتير', icon: Receipt, defaultWeight: 3 },
  { id: '284-15', number: '284-15', title: 'مستندات السداد', icon: FileCheck, defaultWeight: 3 },
  
  // المرحلة 4: الجهات والمتطلبات (7 تابات)
  { id: '284-16', number: '284-16', title: 'صور فواتير الجهات', icon: ImageIcon, defaultWeight: 1 },
  { id: '284-17', number: '284-17', title: 'طلبات الجهات', icon: Send, defaultWeight: 3 },
  { id: '284-18', number: '284-18', title: 'ملاحظات الجهات', icon: MessageSquare, defaultWeight: 2 },
  { id: '284-19', number: '284-19', title: 'متطلبات النظام', icon: Settings, defaultWeight: 3 },
  { id: '284-20', number: '284-20', title: 'مراسلات', icon: Mail, defaultWeight: 3 },
  { id: '284-21', number: '284-21', title: 'تعهدات المكتب', icon: FileSignature, defaultWeight: 3 },
  { id: '284-22', number: '284-22', title: 'تعهدات المالك', icon: FileSignature, defaultWeight: 3 },
  
  // المرحلة 5: الخطابات والتسليمات (4 تابات) - جديد
  { id: '284-23', number: '284-23', title: 'خطابات المكتب للجهات', icon: Mail, defaultWeight: 3 },
  { id: '284-24', number: '284-24', title: 'خطابات المكتب للمالك', icon: Mail, defaultWeight: 3 },
  { id: '284-25', number: '284-25', title: 'ملفات تسليم للجهات', icon: Send, defaultWeight: 2 },
  { id: '284-26', number: '284-26', title: 'ملفات تسليم للمالك', icon: Send, defaultWeight: 2 },
  
  // المرحلة 6: إدارة المشروع (4 تابات) - جديد
  { id: '284-27', number: '284-27', title: 'المهام', icon: ClipboardList, defaultWeight: 4 },
  { id: '284-28', number: '284-28', title: 'جدول زمني للإنجاز', icon: Calendar, defaultWeight: 3 },
  { id: '284-29', number: '284-29', title: 'فريق العمل', icon: Users, defaultWeight: 3 },
  { id: '284-30', number: '284-30', title: 'مراسلات داخلية بين فريق العمل', icon: MessageSquare, defaultWeight: 2 },
  
  // المرحلة 7: التقارير والنزاعات (3 تابات) - جديد
  { id: '284-31', number: '284-31', title: 'التقارير', icon: FileCheck, defaultWeight: 3 },
  { id: '284-32', number: '284-32', title: 'النزاعات', icon: AlertCircle, defaultWeight: 2 },
  { id: '284-33', number: '284-33', title: 'ربط بمعاملة أخرى', icon: Layers, defaultWeight: 2 },
  
  // المرحلة 8: الموافقات والزيارات (6 تابات) - جديد
  { id: '284-34', number: '284-34', title: 'موافقات المالك', icon: CheckCircle, defaultWeight: 3 },
  { id: '284-35', number: '284-35', title: 'زيارات الموقع', icon: MapPin, defaultWeight: 2 },
  { id: '284-36', number: '284-36', title: 'صور من الموقع', icon: ImageIcon, defaultWeight: 2 },
  { id: '284-37', number: '284-37', title: 'المخالفات المرصودة', icon: AlertCircle, defaultWeight: 2 },
  { id: '284-38', number: '284-38', title: 'مستحقات سابقة على المالك', icon: DollarSign, defaultWeight: 2 },
  { id: '284-39', number: '284-39', title: 'وثائق إنهاء المعاملة', icon: Archive, defaultWeight: 3 },
  
  // المرحلة 9: معلومات المشروع والمكونات (8 تابات) - جديد ⭐
  { id: '284-40', number: '284-40', title: 'مسميات وعدد الأدوار', icon: Layers, defaultWeight: 2 },
  { id: '284-41', number: '284-41', title: 'الارتدادات من الأربع جهات', icon: Target, defaultWeight: 3 },
  { id: '284-42', number: '284-42', title: 'المكونات التفصيلية النهائية', icon: Database, defaultWeight: 4 },
  { id: '284-43', number: '284-43', title: 'المكونات حسب الرخصة القديمة', icon: FileText, defaultWeight: 3 },
  { id: '284-44', number: '284-44', title: 'المكونات حسب المقترح', icon: Target, defaultWeight: 3 },
  { id: '284-45', number: '284-45', title: 'المكونات حسب القائم', icon: Building, defaultWeight: 3 },
  { id: '284-46', number: '284-46', title: 'الحدود والمجاورين', icon: MapPin, defaultWeight: 2 },
  { id: '284-47', number: '284-47', title: 'مساحة الأرض', icon: MapPin, defaultWeight: 3 },
];

const TOTAL_DEFAULT_WEIGHT = TABS_CONFIG.reduce((sum, tab) => sum + (tab.defaultWeight || 0), 0);

// ==================== المكون الرئيسي ====================

const MainTransactionsScreen_Complete_284_v10: React.FC = () => {
  const [activeTab, setActiveTab] = useState('284-01');
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'auto' | 'number' | 'owner' | 'id' | 'plan'>('auto');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('2025');
  const [filterTransactionType, setFilterTransactionType] = useState('');
  
  // حالات النوافذ المنبثقة
  const [showTransactionNumberDialog, setShowTransactionNumberDialog] = useState(false);
  const [showOwnerDialog, setShowOwnerDialog] = useState(false);
  const [showPlanLocationDialog, setShowPlanLocationDialog] = useState(false);
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

  // حالات نوافذ الأزرار السريعة
  const [showOfficeFeesDialog, setShowOfficeFeesDialog] = useState(false);
  const [showMessageOwnerDialog, setShowMessageOwnerDialog] = useState(false);
  const [showSendFilesDialog, setShowSendFilesDialog] = useState(false);
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showReactivateDialog, setShowReactivateDialog] = useState(false);
  const [showCompleteTransactionDialog, setShowCompleteTransactionDialog] = useState(false);
  const [showUploadFilesDialog, setShowUploadFilesDialog] = useState(false);
  const [showTransferOwnershipDialog, setShowTransferOwnershipDialog] = useState(false);

  // حالات نظام الاكتمال
  const [isEditMode, setIsEditMode] = useState<Record<string, boolean>>({});
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [selectedTabForCompletion, setSelectedTabForCompletion] = useState<string | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');

  // المستخدم الحالي
  const currentUser = {
    id: 'USR-001',
    name: 'المهندس أحمد العلي',
    permissions: [
      'VIEW_OFFICE_FEES',
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

  // أنواع المعاملات
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

  // حالات المعاملات
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
      detailedDesc: 'المعاملة قيد المعالجة النشطة من الفريق المختص',
      icon: Clock,
      requiresReason: false
    },
    'pending-approval': { 
      label: 'في انتظار الموافقة', 
      color: '#eab308',
      bgColor: 'rgba(234, 179, 8, 0.1)',
      shortDesc: 'بانتظار الاعتماد',
      detailedDesc: 'المعاملة مكتملة وبانتظار الموافقة النهائية',
      icon: AlertCircle,
      requiresReason: false
    },
    'approved': { 
      label: 'معتمدة', 
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.1)',
      shortDesc: 'تمت الموافقة',
      detailedDesc: 'تمت الموافقة على المعاملة رسمياً',
      icon: CheckCircle,
      requiresReason: false
    },
    'completed': { 
      label: 'مكتملة', 
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      shortDesc: 'اكتملت بنجاح',
      detailedDesc: 'المعاملة اكتملت بنجاح وتم إغلاقها نهائياً',
      icon: Award,
      requiresReason: false
    },
    'on-hold': { 
      label: 'متوقفة مؤقتاً', 
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      shortDesc: 'موقوفة مؤقتاً',
      detailedDesc: 'المعاملة موقوفة مؤقتاً بانتظار معلومات إضافية',
      icon: Layers,
      requiresReason: true
    },
    'cancelled': { 
      label: 'ملغاة', 
      color: '#6b7280',
      bgColor: 'rgba(107, 114, 128, 0.1)',
      shortDesc: 'تم الإلغاء',
      detailedDesc: 'المعاملة تم إلغاؤها نهائياً',
      icon: X,
      requiresReason: true
    },
    'rejected': { 
      label: 'مرفوضة', 
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      shortDesc: 'تم الرفض',
      detailedDesc: 'المعاملة تم رفضها رسمياً',
      icon: AlertCircle,
      requiresReason: true
    },
    'under-review': { 
      label: 'قيد المراجعة', 
      color: '#06b6d4',
      bgColor: 'rgba(6, 182, 212, 0.1)',
      shortDesc: 'تحت المراجعة',
      detailedDesc: 'المعاملة قيد المراجعة الفنية والقانونية',
      icon: Eye,
      requiresReason: false
    },
    'returned': { 
      label: 'معادة للتعديل', 
      color: '#f97316',
      bgColor: 'rgba(249, 115, 22, 0.1)',
      shortDesc: 'تحتاج تعديل',
      detailedDesc: 'المعاملة معادة للمالك لإجراء تعديلات',
      icon: Edit,
      requiresReason: true
    }
  };

  // بيانات المعاملات الوهمية
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
        }
      ],
      progressDetails: [
        { stageName: 'دراسة الأرض', percentage: 100, status: 'مكتمل' },
        { stageName: 'الرسومات', percentage: 85, status: 'جارٍ' },
        { stageName: 'الموافقات', percentage: 45, status: 'جارٍ' },
        { stageName: 'التنفيذ', percentage: 0, status: 'قادم' }
      ],
      tabsCompletion: [
        { tabId: '284-01', isCompleted: true, completedAt: '2025-01-15 10:00', completedBy: 'م. سارة الأحمد' },
        { tabId: '284-03', isCompleted: true, completedAt: '2025-01-15 11:00', completedBy: 'م. سارة الأحمد' }
      ]
    },
    { 
      id: '2501002', 
      number: '2501002', 
      ownerName: 'فاطمة علي القحطاني', 
      ownerId: '2345678901',
      ownerPhone: '0502345678',
      ownerEmail: 'fatima.qhtani@email.com',
      ownerAddress: 'جدة، حي الزهراء، شارع التحلية',
      planNumber: 'PLN-456',
      plotNumbers: ['789', '790', '791'],
      status: 'new', 
      type: 'تجاري', 
      date: '2025-01-20',
      mainCategory: 'مباني تجارية',
      subCategory: 'مجمع تجاري',
      location: {
        lat: 21.5433,
        lng: 39.1728,
        qrCode: 'https://maps.google.com/?q=21.5433,39.1728',
        address: 'جدة، حي الزهراء'
      },
      progress: 15,
      createdBy: 'م. خالد المحمدي',
      createdDateTime: '2025-01-20 14:15',
      statusReason: '',
      statusBy: 'م. خالد المحمدي',
      statusDate: '2025-01-20',
      confidentialityLevel: 'عادية',
      externalReferences: [
        {
          entityName: 'أمانة محافظة جدة',
          licenseNumber: 'JED-2025-0089',
          licenseYearHijri: '1446',
          serviceRequestNumber: 'SR-2501-0067',
          serviceRequestYear: '2025',
          requestNumber: 'REQ-25-002',
          requestYear: '2025'
        }
      ],
      progressDetails: [
        { stageName: 'دراسة الأرض', percentage: 60, status: 'جارٍ' },
        { stageName: 'الرسومات', percentage: 0, status: 'قادم' },
        { stageName: 'الموافقات', percentage: 0, status: 'قادم' },
        { stageName: 'التنفيذ', percentage: 0, status: 'قادم' }
      ],
      tabsCompletion: [
        { tabId: '284-01', isCompleted: true, completedAt: '2025-01-20 15:00', completedBy: 'م. خالد المحمدي' }
      ]
    },
    { 
      id: '2412045', 
      number: '2412045', 
      ownerName: 'محمد سعد العتيبي', 
      ownerId: '3456789012',
      ownerPhone: '0503456789',
      ownerEmail: 'mohammed.otaibi@email.com',
      ownerAddress: 'الدمام، حي الشاطئ، شارع الملك عبدالعزيز',
      planNumber: 'PLN-789',
      plotNumbers: ['1234'],
      status: 'completed', 
      type: 'سكني', 
      date: '2024-12-10',
      mainCategory: 'مباني سكنية',
      subCategory: 'عمارة سكنية',
      location: {
        lat: 26.3927,
        lng: 49.9777,
        qrCode: 'https://maps.google.com/?q=26.3927,49.9777',
        address: 'الدمام، حي الشاطئ'
      },
      progress: 100,
      createdBy: 'م. نورة العمري',
      createdDateTime: '2024-12-10 10:00',
      statusReason: '',
      statusBy: 'م. أحمد السالم',
      statusDate: '2025-01-10',
      confidentialityLevel: 'عادية',
      externalReferences: [
        {
          entityName: 'أمانة المنطقة الشرقية',
          licenseNumber: 'DMM-2024-0234',
          licenseYearHijri: '1446',
          serviceRequestNumber: 'SR-2412-0145',
          serviceRequestYear: '2024',
          requestNumber: 'REQ-24-045',
          requestYear: '2024'
        }
      ],
      progressDetails: [
        { stageName: 'دراسة الأرض', percentage: 100, status: 'مكتمل' },
        { stageName: 'الرسومات', percentage: 100, status: 'مكتمل' },
        { stageName: 'الموافقات', percentage: 100, status: 'مكتمل' },
        { stageName: 'التنفيذ', percentage: 100, status: 'مكتمل' }
      ],
      tabsCompletion: []
    },
    { 
      id: '2502001', 
      number: '2502001', 
      ownerName: 'سارة حسن الأحمد', 
      ownerId: '4567890123',
      ownerPhone: '0504567890',
      ownerEmail: 'sarah.ahmed@email.com',
      ownerAddress: 'مكة المكرمة، حي العزيزية، شارع الحج',
      planNumber: 'PLN-321',
      plotNumbers: ['567', '568'],
      status: 'on-hold', 
      type: 'استثماري', 
      date: '2025-02-05',
      mainCategory: 'مباني استثمارية',
      subCategory: 'برج سكني تجاري',
      location: {
        lat: 21.3891,
        lng: 39.8579,
        qrCode: 'https://maps.google.com/?q=21.3891,39.8579',
        address: 'مكة المكرمة، حي العزيزية'
      },
      progress: 42,
      createdBy: 'م. عبدالله الزهراني',
      createdDateTime: '2025-02-05 11:20',
      statusReason: 'في انتظار موافقة الدفاع المدني',
      statusBy: 'م. فهد الغامدي',
      statusDate: '2025-02-12',
      confidentialityLevel: 'سرية',
      externalReferences: [
        {
          entityName: 'أمانة العاصمة المقدسة',
          licenseNumber: 'MKK-2025-0012',
          licenseYearHijri: '1446',
          serviceRequestNumber: 'SR-2502-0008',
          serviceRequestYear: '2025',
          requestNumber: 'REQ-25-003',
          requestYear: '2025'
        }
      ],
      progressDetails: [
        { stageName: 'دراسة الأرض', percentage: 100, status: 'مكتمل' },
        { stageName: 'الرسومات', percentage: 70, status: 'جارٍ' },
        { stageName: 'الموافقات', percentage: 30, status: 'متوقف' },
        { stageName: 'التنفيذ', percentage: 0, status: 'قادم' }
      ],
      tabsCompletion: [
        { tabId: '284-01', isCompleted: true, completedAt: '2025-02-05 12:00', completedBy: 'م. عبدالله الزهراني' },
        { tabId: '284-03', isCompleted: true, completedAt: '2025-02-06 09:00', completedBy: 'م. عبدالله الزهراني' },
        { tabId: '284-04', isCompleted: true, completedAt: '2025-02-07 10:30', completedBy: 'م. عبدالله الزهراني' }
      ]
    },
    { 
      id: '2501003', 
      number: '2501003', 
      ownerName: 'خالد عبدالرحمن المطيري', 
      ownerId: '5678901234',
      ownerPhone: '0505678901',
      ownerEmail: 'khaled.mutairi@email.com',
      ownerAddress: 'المدينة المنورة، حي قباء، شارع سيد الشهداء',
      planNumber: 'PLN-654',
      plotNumbers: ['999', '1000', '1001', '1002'],
      status: 'approved', 
      type: 'صناعي', 
      date: '2025-01-25',
      mainCategory: 'مباني صناعية',
      subCategory: 'مصنع إنتاجي',
      location: {
        lat: 24.4672,
        lng: 39.6112,
        qrCode: 'https://maps.google.com/?q=24.4672,39.6112',
        address: 'المدينة المنورة، حي قباء'
      },
      progress: 88,
      createdBy: 'م. ريم الدوسري',
      createdDateTime: '2025-01-25 08:45',
      statusReason: '',
      statusBy: 'م. أحمد السالم',
      statusDate: '2025-02-15',
      confidentialityLevel: 'عادية',
      externalReferences: [
        {
          entityName: 'أمانة منطقة المدينة المنورة',
          licenseNumber: 'MED-2025-0034',
          licenseYearHijri: '1446',
          serviceRequestNumber: 'SR-2501-0078',
          serviceRequestYear: '2025',
          requestNumber: 'REQ-25-004',
          requestYear: '2025'
        }
      ],
      progressDetails: [
        { stageName: 'دراسة الأرض', percentage: 100, status: 'مكتمل' },
        { stageName: 'الرسومات', percentage: 100, status: 'مكتمل' },
        { stageName: 'الموافقات', percentage: 90, status: 'جارٍ' },
        { stageName: 'التنفيذ', percentage: 60, status: 'جارٍ' }
      ],
      tabsCompletion: [
        { tabId: '284-01', isCompleted: true, completedAt: '2025-01-25 09:30', completedBy: 'م. ريم الدوسري' },
        { tabId: '284-03', isCompleted: true, completedAt: '2025-01-26 10:00', completedBy: 'م. ريم الدوسري' },
        { tabId: '284-04', isCompleted: true, completedAt: '2025-01-27 11:15', completedBy: 'م. ريم الدوسري' },
        { tabId: '284-11', isCompleted: true, completedAt: '2025-02-01 14:00', completedBy: 'م. ريم الدوسري' },
        { tabId: '284-12', isCompleted: true, completedAt: '2025-02-03 15:30', completedBy: 'م. ريم الدوسري' }
      ]
    }
  ];

  // المستندات الوهمية للتوثيق
  const transactionDocuments = [
    { id: 'DOC-001', name: 'صك الملكية', category: 'ملكية', certified: true },
    { id: 'DOC-002', name: 'المخطط المساحي', category: 'مساحة', certified: false },
    { id: 'DOC-003', name: 'عقد الاتفاق', category: 'عقود', certified: true },
    { id: 'DOC-004', name: 'هوية المالك', category: 'هويات', certified: false },
    { id: 'DOC-005', name: 'الترخيص البلدي', category: 'تراخيص', certified: false },
    { id: 'DOC-006', name: 'الموافقة الأولية', category: 'موافقات', certified: true },
    { id: 'DOC-007', name: 'التقرير الفني', category: 'تقارير', certified: false },
    { id: 'DOC-008', name: 'إيصال الدفع', category: 'مالية', certified: true }
  ];

  // الموظفون المخولون بالتصديق
  const certifierEmployees = [
    { value: 'EMP-001', label: 'م. أحمد محمد السالم - مدير المشاريع' },
    { value: 'EMP-002', label: 'د. فاطمة علي القحطاني - مدير إدارة الجودة' },
    { value: 'EMP-003', label: 'م. خالد عبدالله المحمدي - رئيس قسم التوثيق' },
    { value: 'EMP-004', label: 'أ. سارة حسن الأحمد - مسؤول الامتثال' },
    { value: 'EMP-005', label: 'م. محمد سعد العتيبي - المدير التنفيذي' }
  ];

  // الوظائف المساعدة
  const parseTransactionNumber = (number: string) => {
    const year = number.substring(0, 2);
    const month = number.substring(2, 4);
    const sequence = number.substring(4);
    
    const monthNames: Record<string, string> = {
      '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'أبريل',
      '05': 'مايو', '06': 'يونيو', '07': 'يوليو', '08': 'أغسطس',
      '09': 'سبتمبر', '10': 'أكتوبر', '11': 'نوفمبر', '12': 'ديسمبر'
    };
    
    return {
      year,
      yearFull: `20${year}`,
      month,
      monthName: monthNames[month] || month,
      sequence
    };
  };

  const formatTransactionLabel = (t: Transaction) => {
    return `${t.number} • ${t.ownerName} • ${t.type}`;
  };

  const detectSearchType = (term: string): typeof searchType => {
    if (!term) return 'auto';
    if (/^\d{7}$/.test(term)) return 'number';
    if (/^\d{10}$/.test(term)) return 'id';
    if (/^PLN-/i.test(term)) return 'plan';
    return 'owner';
  };

  const detectedSearchType = detectSearchType(searchTerm);

  const filteredTransactions = mockTransactions.filter(t => {
    const matchesSearch = !searchTerm || 
      t.number.includes(searchTerm) ||
      t.ownerName.includes(searchTerm) ||
      t.ownerId?.includes(searchTerm) ||
      t.planNumber?.includes(searchTerm);
    
    const matchesType = !filterTransactionType || t.type === filterTransactionType;
    const matchesYear = !filterYear || t.number.substring(0, 2) === filterYear.substring(2);
    const matchesMonth = !filterMonth || t.number.substring(2, 4) === filterMonth;
    
    return matchesSearch && matchesType && matchesYear && matchesMonth;
  });

  const selectedTransactionData = mockTransactions.find(t => t.id === selectedTransaction);
  const currentTransaction = selectedTransactionData || mockTransactions[0];

  // وظائف نظام الاكتمال
  const isTabCompleted = (tabId: string): boolean => {
    return currentTransaction.tabsCompletion?.some(tc => tc.tabId === tabId && tc.isCompleted) || false;
  };

  const isTabEditable = (tabId: string): boolean => {
    return !isTabCompleted(tabId) || isEditMode[tabId] || false;
  };

  const toggleEditMode = (tabId: string) => {
    setIsEditMode(prev => ({ ...prev, [tabId]: !prev[tabId] }));
  };

  const openCompletionDialog = (tabId: string) => {
    setSelectedTabForCompletion(tabId);
    setShowCompletionDialog(true);
  };

  const handleSaveCompletion = () => {
    if (selectedTabForCompletion) {
      console.log('إتمام التاب:', selectedTabForCompletion, 'ملاحظات:', completionNotes);
      setShowCompletionDialog(false);
      setCompletionNotes('');
      setSelectedTabForCompletion(null);
    }
  };

  const handleSaveCertification = () => {
    if (!selectedDocumentForCert || !certificationType || !certifierEmployee) {
      alert('⚠️ الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }

    const certificationData = {
      document: selectedDocumentForCert,
      type: certificationType,
      employee: certifierEmployee,
      date: certificationDate,
      time: certificationTime,
      notes: certificationNotes
    };

    console.log('حفظ التوثيق:', certificationData);
    alert(`✅ تم حفظ التوثيق بنجاح!\n\nالمستند: ${transactionDocuments.find(d => d.id === selectedDocumentForCert)?.name}\nالنوع: ${certificationType}\nالموظف: ${certifierEmployee}\nالتاريخ: ${certificationDate} ${certificationTime}`);
    
    setSelectedDocumentForCert('');
    setCertificationType('digital');
    setCertifierEmployee('');
    setCertificationNotes('');
    setShowDigitalCertification(false);
  };

  const handlePrintCertification = () => {
    if (!selectedDocumentForCert) {
      alert('⚠️ الرجاء اختيار مستند أولاً');
      return;
    }
    alert('🖨️ جارٍ طباعة شهادة التوثيق...');
  };

  // رندر محتوى التاب
  const renderTabContent = () => {
    if (!currentTransaction) {
      return (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 280px)' }}>
          <Card className="max-w-2xl w-full card-rtl" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)' }}>
            <CardContent className="p-12 text-center">
              <FileText className="h-24 w-24 mx-auto text-blue-400 mb-4" />
              <h3 className="text-xl mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                لم يتم اختيار معاملة
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الرجاء اختيار معاملة من القائمة أعلاه لبدء المعالجة
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    const isCompleted = isTabCompleted(activeTab);
    const isEditable = isTabEditable(activeTab);
    const currentTabConfig = TABS_CONFIG.find(t => t.id === activeTab);

    // محتوى خاص بتاب "معلومات عامة" (284-01)
    if (activeTab === '284-01') {
      return (
        <div className="space-y-4">
          {/* شريط حالة التاب */}
          <Card className="card-rtl" style={{ 
            background: isCompleted 
              ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' 
              : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: `2px solid ${isCompleted ? '#10b981' : '#f59e0b'}`
          }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <Clock className="h-6 w-6 text-yellow-600" />
                  )}
                  <div>
                    <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: isCompleted ? '#065f46' : '#92400e' }}>
                      {isCompleted ? 'تم إكمال هذا التاب' : 'التاب قيد العمل'}
                    </h3>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: isCompleted ? '#059669' : '#b45309' }}>
                      {isCompleted 
                        ? `الوزن النسبي: ${currentTabConfig?.defaultWeight}% • مكتمل`
                        : `الوزن النسبي: ${currentTabConfig?.defaultWeight}% • قابل للتعديل`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {isCompleted && !isEditMode[activeTab] && (
                    <Button 
                      size="sm" 
                      onClick={() => toggleEditMode(activeTab)}
                      className="gap-2"
                      style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
                    >
                      <Unlock className="h-4 w-4" />
                      استكمال
                    </Button>
                  )}
                  
                  {isEditable && !isCompleted && (
                    <Button 
                      size="sm" 
                      onClick={() => openCompletionDialog(activeTab)}
                      className="gap-2"
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                    >
                      <Lock className="h-4 w-4" />
                      وسم كمكتمل
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* البطاقات الثمانية التفاعلية */}
          <div className="grid grid-cols-8 gap-1.5 px-[-17px] py-[0px] mt-[-8px] mr-[36px] mb-[2px] ml-[0px]">
            {/* 1. رقم المعاملة - تفاعلي */}
            <Card 
              className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setShowTransactionNumberDialog(true)}
              style={{ 
                border: '2px solid #93c5fd',
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
              }}
            >
              <CardContent className="p-1 text-center">
                <FileText className="h-3.5 w-3.5 mx-auto text-blue-600 mb-0.5" />
                <p className="text-xs font-mono mb-0" style={{ fontFamily: 'Courier New', color: '#1e40af' }}>
                  {currentTransaction.number}
                </p>
                <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  رقم المعاملة
                </p>
              </CardContent>
            </Card>

            {/* 2. المالك - تفاعلي */}
            <Card 
              className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setShowOwnerDialog(true)}
              style={{ 
                border: '2px solid #6ee7b7', 
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' 
              }}
            >
              <CardContent className="p-1 text-center">
                <User className="h-3.5 w-3.5 mx-auto text-green-600 mb-0.5" />
                <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif', color: '#065f46' }}>
                  {currentTransaction.ownerName}
                </p>
                <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المالك
                </p>
              </CardContent>
            </Card>

            {/* 3. رقم المخطط - تفاعلي */}
            <Card 
              className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setShowPlanLocationDialog(true)}
              style={{ 
                border: '2px solid #c4b5fd',
                background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)'
              }}
            >
              <CardContent className="p-1 text-center">
                <MapPin className="h-3.5 w-3.5 mx-auto text-purple-600 mb-0.5" />
                <p className="text-xs mb-0" style={{ fontFamily: 'Courier New', color: '#6b21a8' }}>
                  {currentTransaction.planNumber}
                </p>
                <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  ({currentTransaction.plotNumbers?.length || 0} قطع)
                </p>
              </CardContent>
            </Card>

            {/* 4. النوع - تفاعلي */}
            <Card 
              className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setShowTypeDialog(true)}
              style={{ 
                border: '2px solid #fdba74',
                background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)'
              }}
            >
              <CardContent className="p-0.5 text-center">
                <Building className="h-2.5 w-2.5 mx-auto text-orange-600 mb-0" />
                <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif', color: '#9a3412' }}>
                  {currentTransaction.type}
                </p>
                <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  النوع
                </p>
              </CardContent>
            </Card>

            {/* 5. التاريخ - تفاعلي */}
            <Card 
              className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setShowDateDialog(true)}
              style={{ 
                border: '2px solid #f9a8d4',
                background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)'
              }}
            >
              <CardContent className="p-1 text-center">
                <Calendar className="h-3.5 w-3.5 mx-auto text-pink-600 mb-0.5" />
                <p className="text-xs mb-0" style={{ fontFamily: 'Courier New', color: '#9f1239' }}>
                  {currentTransaction.date}
                </p>
                <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  تاريخ الإنشاء
                </p>
              </CardContent>
            </Card>

            {/* 6. الحالة - تفاعلي */}
            <Card 
              className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setShowStatusDialog(true)}
              style={{ 
                border: `2px solid ${transactionStatuses[currentTransaction.status]?.color || '#6b7280'}`,
                background: transactionStatuses[currentTransaction.status]?.bgColor || 'rgba(107, 114, 128, 0.1)'
              }}
            >
              <CardContent className="p-1 text-center">
                {React.createElement(transactionStatuses[currentTransaction.status]?.icon || AlertCircle, {
                  className: "h-3.5 w-3.5 mx-auto mb-0.5",
                  style: { color: transactionStatuses[currentTransaction.status]?.color || '#6b7280' }
                })}
                <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif', color: transactionStatuses[currentTransaction.status]?.color || '#6b7280' }}>
                  {transactionStatuses[currentTransaction.status]?.label || 'غير محدد'}
                </p>
                <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الحالة
                </p>
              </CardContent>
            </Card>

            {/* 7. الموقع الجغرافي - تفاعلي */}
            <Card 
              className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setShowPlanLocationDialog(true)}
              style={{ 
                border: '2px solid #67e8f9',
                background: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)'
              }}
            >
              <CardContent className="p-1 text-center">
                <MapPin className="h-3.5 w-3.5 mx-auto text-cyan-600 mb-0.5" />
                <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif', color: '#0e7490' }}>
                  {currentTransaction.location?.address?.split('،')[1] || 'الموقع'}
                </p>
                <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الموقع
                </p>
              </CardContent>
            </Card>

            {/* 8. نسبة الإنجاز - تفاعلي */}
            <Card 
              className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setShowProgressDialog(true)}
              style={{ 
                border: '2px solid #6ee7b7',
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
              }}
            >
              <CardContent className="p-1 text-center">
                <TrendingUp className="h-3.5 w-3.5 mx-auto text-emerald-600 mb-0.5" />
                <p className="text-xs font-mono mb-0" style={{ color: '#065f46' }}>
                  {currentTransaction.progress}%
                </p>
                <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نسبة الإنجاز
                </p>
              </CardContent>
            </Card>
          </div>

          {/* محتوى إضافي للتاب */}
          <Card className="card-rtl">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تفاصيل المعاملة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4" style={{ opacity: isEditable ? 1 : 0.6, pointerEvents: isEditable ? 'auto' : 'none' }}>
                <InputWithCopy
                  label="رقم المعاملة"
                  id="transaction-number"
                  value={currentTransaction.number}
                  disabled={!isEditable}
                  copyable={true}
                  clearable={false}
                />
                <InputWithCopy
                  label="اسم المالك"
                  id="owner-name"
                  value={currentTransaction.ownerName}
                  disabled={!isEditable}
                  copyable={true}
                  clearable={false}
                />
                <InputWithCopy
                  label="رقم الهوية"
                  id="owner-id"
                  value={currentTransaction.ownerId || ''}
                  disabled={!isEditable}
                  copyable={true}
                  clearable={false}
                />
                <InputWithCopy
                  label="رقم الجوال"
                  id="owner-phone"
                  value={currentTransaction.ownerPhone || ''}
                  disabled={!isEditable}
                  copyable={true}
                  clearable={false}
                />
              </div>

              {!isEditable && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center mt-4">
                  <Lock className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af', fontSize: '14px' }}>
                    هذا التاب مكتمل ومقفل. اضغط على زر "استكمال" لفتح التعديل.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    // التابات المطورة الجديدة
    if (activeTab === '284-06B') {
      return <Tab_RequestPurpose_Brief_Complete transactionId={selectedTransaction} readOnly={!isEditable} />;
    }
    
    if (activeTab === '284-06C') {
      return <Tab_RequestPurpose_Detailed_Complete transactionId={selectedTransaction} readOnly={!isEditable} />;
    }
    
    // التابات الجديدة - معلومات المشروع والمكونات ⭐
    if (activeTab === '284-40') {
      return <Tab_FloorsNaming_Complete transactionId={selectedTransaction} readOnly={!isEditable} />;
    }
    
    if (activeTab === '284-41') {
      return <Tab_Setbacks_AllFloors_Complete transactionId={selectedTransaction} readOnly={!isEditable} />;
    }
    
    if (activeTab === '284-42') {
      return <Tab_FinalComponents_Detailed_Complete transactionId={selectedTransaction} readOnly={!isEditable} />;
    }
    
    if (activeTab === '284-43') {
      return <Tab_Components_Generic_Complete transactionId={selectedTransaction} readOnly={!isEditable} type="old-license" />;
    }
    
    if (activeTab === '284-44') {
      return <Tab_Components_Generic_Complete transactionId={selectedTransaction} readOnly={!isEditable} type="proposed" />;
    }
    
    if (activeTab === '284-45') {
      return <Tab_Components_Generic_Complete transactionId={selectedTransaction} readOnly={!isEditable} type="existing" />;
    }
    
    if (activeTab === '284-46') {
      return <Tab_Boundaries_Neighbors_Complete transactionId={selectedTransaction} readOnly={!isEditable} />;
    }
    
    if (activeTab === '284-47') {
      return <Tab_LandArea_Complete transactionId={selectedTransaction} readOnly={!isEditable} />;
    }
    
    // محتوى افتراضي لباقي التابات
    return (
      <div className="space-y-4">
        <Card className="card-rtl" style={{ 
          background: isCompleted 
            ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' 
            : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: `2px solid ${isCompleted ? '#10b981' : '#f59e0b'}`
        }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isCompleted ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <Clock className="h-6 w-6 text-yellow-600" />
                )}
                <div>
                  <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: isCompleted ? '#065f46' : '#92400e' }}>
                    {isCompleted ? 'تم إكمال هذا التاب' : 'التاب قيد العمل'}
                  </h3>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: isCompleted ? '#059669' : '#b45309' }}>
                    {isCompleted 
                      ? `الوزن النسبي: ${currentTabConfig?.defaultWeight}% • مكتمل`
                      : `الوزن النسبي: ${currentTabConfig?.defaultWeight}% • قابل للتعديل`
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {isCompleted && !isEditMode[activeTab] && (
                  <Button 
                    size="sm" 
                    onClick={() => toggleEditMode(activeTab)}
                    className="gap-2"
                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
                  >
                    <Unlock className="h-4 w-4" />
                    استكمال
                  </Button>
                )}
                
                {isEditable && !isCompleted && (
                  <Button 
                    size="sm" 
                    onClick={() => openCompletionDialog(activeTab)}
                    className="gap-2"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  >
                    <Lock className="h-4 w-4" />
                    وسم كمكتمل
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {currentTabConfig?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" style={{ opacity: isEditable ? 1 : 0.6, pointerEvents: isEditable ? 'auto' : 'none' }}>
              <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                محتوى التاب "{currentTabConfig?.title}" سيتم تطويره هنا...
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <InputWithCopy
                  label="حقل مثال 1"
                  id="field1"
                  placeholder="أدخل البيانات"
                  disabled={!isEditable}
                />
                <InputWithCopy
                  label="حقل مثال 2"
                  id="field2"
                  placeholder="أدخل البيانات"
                  disabled={!isEditable}
                />
              </div>

              {!isEditable && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                  <Lock className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af', fontSize: '14px' }}>
                    هذا التاب مكتمل ومقفل. اضغط على زر "استكمال" لفتح التعديل.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-284-v10.3" position="top-right" />
      
      {/* الهيدر الكامل (سطرين) */}
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
          marginRight: '256px',
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
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap'
                }}
              >
                معالجة المعاملات
              </h1>
              

            </div>
          </div>
          
          <div 
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(251, 191, 36, 0.08) 100%)',
              borderRadius: '10px',
              border: '2px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              minWidth: '600px'
            }}
          >
            {/* رقم المعاملة */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <span 
                style={{ 
                  fontFamily: 'Tajawal, sans-serif', 
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#78716c',
                  whiteSpace: 'nowrap'
                }}
              >
                رقم المعاملة :
              </span>
              <span 
                className="font-mono"
                style={{ 
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#b45309',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '0.05em',
                  textShadow: '0 1px 2px rgba(245, 158, 11, 0.2)'
                }}
              >
                {selectedTransaction || currentTransaction?.number || '-------'}
              </span>
            </div>

            {/* فاصل عمودي */}
            <div 
              style={{ 
                width: '2px', 
                height: '30px', 
                background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.3) 0%, rgba(245, 158, 11, 0.6) 50%, rgba(245, 158, 11, 0.3) 100%)',
                flexShrink: 0
              }} 
            />

            {/* مؤشر الإنجاز */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
              <span 
                style={{ 
                  fontFamily: 'Tajawal, sans-serif', 
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#78716c',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                نسبة الإنجاز :
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <Progress 
                  value={currentTransaction?.progress || 0} 
                  className="h-2.5 flex-1"
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    borderRadius: '6px'
                  }}
                />
                <span 
                  className="font-mono"
                  style={{ 
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#d97706',
                    minWidth: '45px',
                    textAlign: 'left',
                    flexShrink: 0
                  }}
                >
                  {currentTransaction?.progress || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* السطر الثاني: الإجراءات السريعة (يظهر عند اختيار معاملة) */}
        {selectedTransaction && (
          <div 
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.95) 0%, rgba(243, 244, 246, 0.95) 100%)',
              borderTop: '1px solid rgba(229, 231, 235, 0.5)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: '6px'
            }}
          >
            {/* أتعاب المكتب - صلاحية خاصة */}
            {currentUser.permissions.includes('VIEW_OFFICE_FEES') && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowOfficeFeesDialog(true)}
                disabled={!selectedTransaction}
                style={{
                  height: '28px',
                  padding: '0 8px',
                  fontSize: '10px',
                  fontFamily: 'Tajawal, sans-serif',
                  background: selectedTransaction ? 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)' : '#f3f4f6',
                  border: '1.5px solid #eab308',
                  color: selectedTransaction ? '#713f12' : '#9ca3af',
                  fontWeight: 600,
                  opacity: selectedTransaction ? 1 : 0.5
                }}
                className="hover:shadow-md transition-all"
              >
                <DollarSign className="h-3 w-3 ml-1" />
                أتعاب المكتب
              </Button>
            )}

            {/* رسالة للمالك */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowMessageOwnerDialog(true)}
              disabled={!selectedTransaction}
              style={{
                height: '28px',
                padding: '0 8px',
                fontSize: '10px',
                fontFamily: 'Tajawal, sans-serif',
                background: selectedTransaction ? 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)' : '#f3f4f6',
                border: '1.5px solid #3b82f6',
                color: selectedTransaction ? '#1e3a8a' : '#9ca3af',
                fontWeight: 600,
                opacity: selectedTransaction ? 1 : 0.5
              }}
              className="hover:shadow-md transition-all"
            >
              <Mail className="h-3 w-3 ml-1" />
              رسالة للمالك
            </Button>

            {/* إرسال ملفات */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSendFilesDialog(true)}
              disabled={!selectedTransaction}
              style={{
                height: '28px',
                padding: '0 8px',
                fontSize: '10px',
                fontFamily: 'Tajawal, sans-serif',
                background: selectedTransaction ? 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)' : '#f3f4f6',
                border: '1.5px solid #a855f7',
                color: selectedTransaction ? '#581c87' : '#9ca3af',
                fontWeight: 600,
                opacity: selectedTransaction ? 1 : 0.5
              }}
              className="hover:shadow-md transition-all"
            >
              <Paperclip className="h-3 w-3 ml-1" />
              إرسال ملفات
            </Button>

            {/* إيقاف مؤقت */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPauseDialog(true)}
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

            {/* إلغاء المعاملة */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCancelDialog(true)}
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

            {/* إعادة التنشيط */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowReactivateDialog(true)}
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
              onClick={() => setShowCompleteTransactionDialog(true)}
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
              onClick={() => setShowUploadFilesDialog(true)}
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
              onClick={() => setShowTransferOwnershipDialog(true)}
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
            {/* اختيار المعاملة - موسع ومميز */}
            <div className="col-span-5">
              <select
                id="selected-transaction"
                value={selectedTransaction}
                onChange={(e) => setSelectedTransaction(e.target.value)}
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '4px 12px',
                  border: '3px solid #f59e0b',
                  borderRadius: '8px',
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#b45309',
                  direction: 'rtl',
                  textAlign: 'right',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(251, 191, 36, 0.12) 100%)',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#d97706';
                  e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.2), 0 2px 8px rgba(245, 158, 11, 0.35)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#f59e0b';
                  e.target.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.25)';
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
                        fontWeight: 700,
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

            {/* البحث الذكي - مصغر */}
            <div className="col-span-3">
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
                  fontSize: '11px',
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

            {/* نوع المعاملة - مصغر */}
            <div className="col-span-2">
              <select
                id="filter-type"
                value={filterTransactionType}
                onChange={(e) => setFilterTransactionType(e.target.value)}
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '4px 6px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '6px',
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: '10px',
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

            {/* السنة - مصغر */}
            <div className="col-span-1">
              <select
                id="filter-year"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '4px 4px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '6px',
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: '10px',
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
                <option value="">السنة</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>

            {/* الشهر - مصغر */}
            <div className="col-span-1">
              <select
                id="filter-month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '4px 4px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '6px',
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: '10px',
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
                <option value="">الشهر</option>
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
        {/* سايد بار مخصص للشاشة 284 */}
        <div
          style={{
            width: '220px',
            minWidth: '220px',
            height: 'calc(100vh - 72px)',
            position: 'fixed',
            top: '40px',
            right: '280px',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
            borderLeft: '2px solid #f59e0b',
            borderRadius: '16px 0 0 16px',
            boxShadow: '-4px 0 16px rgba(245, 158, 11, 0.25)',
            overflow: 'hidden',
            zIndex: 5
          }}
        >
          <ScrollArea className="h-full">
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
            
            <div className="p-2 space-y-0.5">
              {TABS_CONFIG.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                      border: isActive ? '2px solid #dc2626' : '2px solid transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'Tajawal, sans-serif',
                      fontSize: '14px',
                      fontWeight: isActive ? 700 : 600,
                      color: isActive ? '#dc2626' : '#1e40af',
                      textAlign: 'right',
                      direction: 'rtl',
                      boxShadow: isActive ? '0 4px 12px rgba(220, 38, 38, 0.3)' : 'none',
                      transform: isActive ? 'scale(1.03)' : 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                      }
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ flexShrink: 0, color: isActive ? '#dc2626' : '#1e40af' }} />
                    <span className="flex-1 text-right">{tab.title}</span>
                    <Badge 
                      className="font-mono"
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        background: isActive ? 'rgba(220, 38, 38, 0.1)' : 'rgba(30, 64, 175, 0.1)',
                        color: isActive ? '#dc2626' : '#1e40af',
                        border: `1px solid ${isActive ? '#dc2626' : '#1e40af'}`
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

        {/* محتوى الشاشة القابل للتمرير */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', marginRight: '220px' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة إتمام التاب */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="max-w-md" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px' }}>
              <Lock className="h-5 w-5 inline ml-2" />
              إتمام التاب
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#374151' }}>
              هل أنت متأكد من إتمام هذا التاب؟ سيتم قفل التعديل ولن تتمكن من التعديل إلا بعد الضغط على "استكمال".
            </p>
            
            <div>
              <label htmlFor="completion-notes" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                ملاحظات (اختياري)
              </label>
              <textarea
                id="completion-notes"
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                rows={4}
                placeholder="أضف أي ملاحظات..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: '13px',
                  direction: 'rtl',
                  textAlign: 'right',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompletionDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            <Button onClick={handleSaveCompletion} className="bg-gradient-to-r from-green-600 to-emerald-600">
              <CheckCircle className="h-4 w-4 ml-1" />
              تأكيد الإتمام
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة التوثيق الرقمي */}
      <Dialog open={showDigitalCertification} onOpenChange={setShowDigitalCertification}>
        <DialogContent 
          className="max-w-6xl" 
          style={{ 
            fontFamily: 'Tajawal, sans-serif', 
            direction: 'rtl',
            maxHeight: '90vh'
          }}
        >
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{
                  padding: '8px',
                  background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FileSignature className="h-6 w-6" style={{ color: '#7c3aed' }} />
              </div>
              <span style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                نظام التوثيق الرقمي السريع
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div style={{ maxHeight: 'calc(90vh - 180px)', overflowY: 'auto' }}>
            <div className="grid grid-cols-2 gap-6">
              {/* القسم الأيمن: قائمة المستندات */}
              <div>
                <h3 className="text-base mb-3" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1f2937' }}>
                  <Database className="h-4 w-4 inline ml-1" />
                  مستندات المعاملة
                </h3>
                
                <div className="space-y-2" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {transactionDocuments.map((doc) => (
                    <Card 
                      key={doc.id}
                      className={`card-rtl cursor-pointer transition-all ${selectedDocumentForCert === doc.id ? 'ring-2 ring-purple-500' : ''}`}
                      onClick={() => setSelectedDocumentForCert(doc.id)}
                      style={{ 
                        background: selectedDocumentForCert === doc.id 
                          ? 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)' 
                          : '#ffffff',
                        border: selectedDocumentForCert === doc.id ? '2px solid #7c3aed' : '1px solid #e5e7eb'
                      }}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              style={{
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: selectedDocumentForCert === doc.id 
                                  ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' 
                                  : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                borderRadius: '8px'
                              }}
                            >
                              <FileText className="h-5 w-5" style={{ color: selectedDocumentForCert === doc.id ? '#ffffff' : '#2563eb' }} />
                            </div>
                            <div>
                              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>
                                {doc.name}
                              </p>
                              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>
                                {doc.category}
                              </p>
                            </div>
                          </div>
                          
                          <Badge className={doc.certified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                            {doc.certified ? '✓ موثق' : '⏳ غير موثق'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* القسم الأيسر: نموذج التوثيق */}
              <div>
                <h3 className="text-base mb-3" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1f2937' }}>
                  <FileCheck className="h-4 w-4 inline ml-1" />
                  بيانات التوثيق
                </h3>

                <div className="space-y-4">
                  {/* المستند المحدد */}
                  <div 
                    style={{ 
                      padding: '12px',
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: '8px',
                      border: '1px solid #f59e0b'
                    }}
                  >
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#92400e', marginBottom: '4px' }}>
                      المستند المحدد:
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

      {/* نافذة رقم المعاملة والبيانات المرجعية */}
      <Dialog open={showTransactionNumberDialog} onOpenChange={setShowTransactionNumberDialog}>
        <DialogContent 
          className="max-w-4xl" 
          style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}
        >
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                borderRadius: '10px'
              }}>
                <FileText className="h-6 w-6" style={{ color: '#2563eb' }} />
              </div>
              <span style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                تفاصيل رقم المعاملة
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6" style={{ padding: '20px 0' }}>
            {/* القسم الأيمن: تحليل رقم المعاملة */}
            <div>
              <h3 className="text-base mb-3" style={{ fontWeight: 700, color: '#1f2937' }}>
                <Hash className="h-4 w-4 inline ml-1" />
                تحليل رقم المعاملة
              </h3>

              <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '13px', color: '#64748b' }}>رقم المعاملة الكامل:</span>
                    <span className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#1e40af' }}>
                      {currentTransaction.number}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 border-t border-blue-200 pt-3">
                    <div className="text-center">
                      <p style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>السنة</p>
                      <p className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#1e40af' }}>
                        20{currentTransaction.number.substring(0, 2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>الشهر</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e40af' }}>
                        {currentTransaction.number.substring(2, 4)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>التسلسل</p>
                      <p className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#1e40af' }}>
                        {currentTransaction.number.substring(4)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* القسم الأيسر: البيانات المرجعية الخارجية */}
            <div>
              <h3 className="text-base mb-3" style={{ fontWeight: 700, color: '#1f2937' }}>
                <ExternalLink className="h-4 w-4 inline ml-1" />
                البيانات المرجعية الخارجية
              </h3>

              {currentTransaction.externalReferences?.map((ref, idx) => (
                <Card key={idx} className="card-rtl mb-3" style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}>
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937' }}>
                        {ref.entityName}
                      </span>
                      <Badge style={{ fontSize: '9px' }}>جهة خارجية</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2" style={{ fontSize: '11px' }}>
                      <div>
                        <span style={{ color: '#6b7280' }}>رقم الرخصة:</span>
                        <span className="font-mono mr-2" style={{ color: '#1f2937', fontWeight: 600 }}>
                          {ref.licenseNumber}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>السنة الهجرية:</span>
                        <span className="font-mono mr-2" style={{ color: '#1f2937', fontWeight: 600 }}>
                          {ref.licenseYearHijri}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>رقم الطلب:</span>
                        <span className="font-mono mr-2" style={{ color: '#1f2937', fontWeight: 600 }}>
                          {ref.serviceRequestNumber}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>سنة الطلب:</span>
                        <span className="font-mono mr-2" style={{ color: '#1f2937', fontWeight: 600 }}>
                          {ref.serviceRequestYear}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <Database className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>
                    لا توجد بيانات مرجعية خارجية مسجلة
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
            <Button variant="outline" onClick={() => setShowTransactionNumberDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إغلاق
            </Button>
            <Button onClick={() => safeCopyToClipboard(currentTransaction.number, 'رقم المعاملة')}>
              <Download className="h-4 w-4 ml-1" />
              نسخ رقم المعاملة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة المالك */}
      <Dialog open={showOwnerDialog} onOpenChange={setShowOwnerDialog}>
        <DialogContent className="max-w-3xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: '10px'
              }}>
                <User className="h-5 w-5" style={{ color: '#10b981' }} />
              </div>
              بيانات المالك الكاملة
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4" style={{ padding: '20px 0' }}>
            <div className="grid grid-cols-2 gap-4">
              <InputWithCopy
                label="الاسم الكامل"
                id="owner-fullname"
                value={currentTransaction.ownerName}
                disabled
                copyable={true}
                clearable={false}
              />
              <InputWithCopy
                label="رقم الهوية"
                id="owner-id-full"
                value={currentTransaction.ownerId || ''}
                disabled
                copyable={true}
                clearable={false}
              />
              <InputWithCopy
                label="رقم الجوال"
                id="owner-phone-full"
                value={currentTransaction.ownerPhone || ''}
                disabled
                copyable={true}
                clearable={false}
              />
              <InputWithCopy
                label="البريد الإلكتروني"
                id="owner-email-full"
                value={currentTransaction.ownerEmail || ''}
                disabled
                copyable={true}
                clearable={false}
              />
            </div>

            <InputWithCopy
              label="العنوان الكامل"
              id="owner-address-full"
              value={currentTransaction.ownerAddress || ''}
              disabled
              copyable={true}
              clearable={false}
            />
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
            <Button variant="outline" onClick={() => setShowOwnerDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة المخطط والقطع */}
      <Dialog open={showPlanLocationDialog} onOpenChange={setShowPlanLocationDialog}>
        <DialogContent className="max-w-5xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
                borderRadius: '10px'
              }}>
                <MapPin className="h-5 w-5" style={{ color: '#8b5cf6' }} />
              </div>
              تفاصيل المخطط والقطع والموقع
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6" style={{ padding: '20px 0' }}>
            {/* القسم الأيمن: المخطط والقطع */}
            <div>
              <h3 className="text-base mb-3" style={{ fontWeight: 700, color: '#1f2937' }}>
                <Layers className="h-4 w-4 inline ml-1" />
                معلومات المخطط
              </h3>

              <Card className="card-rtl mb-4" style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', border: '2px solid #c4b5fd' }}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '13px', color: '#64748b' }}>رقم المخطط:</span>
                      <span className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#6b21a8' }}>
                        {currentTransaction.planNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '13px', color: '#64748b' }}>عدد القطع:</span>
                      <Badge style={{ fontSize: '12px', background: '#8b5cf6', color: '#fff' }}>
                        {currentTransaction.plotNumbers?.length || 0} قطع
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-sm mb-2" style={{ fontWeight: 600, color: '#1f2937' }}>
                أرقام القطع:
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {(currentTransaction.plotNumbers || []).map((plot, idx) => (
                  <div 
                    key={idx}
                    className="text-center p-2 rounded-lg"
                    style={{ 
                      background: '#f3e8ff',
                      border: '1px solid #c4b5fd'
                    }}
                  >
                    <span className="font-mono" style={{ fontSize: '13px', fontWeight: 600, color: '#6b21a8' }}>
                      {plot}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* القسم الأيسر: الموقع الجغرافي */}
            <div>
              <h3 className="text-base mb-3" style={{ fontWeight: 700, color: '#1f2937' }}>
                <MapPin className="h-4 w-4 inline ml-1" />
                الموقع الجغرافي
              </h3>

              {/* رمز QR */}
              <div className="bg-white border-2 border-purple-200 rounded-lg p-4 mb-4 text-center">
                <div 
                  className="mx-auto mb-3"
                  style={{
                    width: '140px',
                    height: '140px',
                    background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid #c4b5fd'
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#6b21a8', fontWeight: 600 }}>
                    QR Code
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#64748b' }}>
                  رمز الاستجابة السريعة للموقع
                </p>
              </div>

              {/* الإحداثيات */}
              <Card className="card-rtl" style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}>
                <CardContent className="p-3 space-y-2">
                  <div>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>خط العرض:</span>
                    <span className="font-mono mr-2" style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937' }}>
                      {currentTransaction.location?.lat || '0.000000'}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>خط الطول:</span>
                    <span className="font-mono mr-2" style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937' }}>
                      {currentTransaction.location?.lng || '0.000000'}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>العنوان:</span>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937', marginTop: '4px' }}>
                      {currentTransaction.location?.address || 'غير محدد'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
            <Button variant="outline" onClick={() => setShowPlanLocationDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إغلاق
            </Button>
            <Button>
              <MapPin className="h-4 w-4 ml-1" />
              فتح في الخريطة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة النوع والتصنيف */}
      <Dialog open={showTypeDialog} onOpenChange={setShowTypeDialog}>
        <DialogContent className="max-w-2xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
                borderRadius: '10px'
              }}>
                <Building className="h-5 w-5" style={{ color: '#f59e0b' }} />
              </div>
              تفاصيل النوع والتصنيف
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4" style={{ padding: '20px 0' }}>
            <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)', border: '2px solid #fdba74' }}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '13px', color: '#64748b' }}>النوع الرئيسي:</span>
                  <Badge style={{ fontSize: '13px', background: '#f59e0b', color: '#fff', padding: '4px 12px' }}>
                    {currentTransaction.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between border-t border-orange-200 pt-3">
                  <span style={{ fontSize: '13px', color: '#64748b' }}>التصنيف الرئيسي:</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#9a3412' }}>
                    {currentTransaction.mainCategory}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '13px', color: '#64748b' }}>التصنيف الفرعي:</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#9a3412' }}>
                    {currentTransaction.subCategory}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#9a3412', marginBottom: '8px' }}>
                معلومات إضافية:
              </h4>
              <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.6' }}>
                هذه المعاملة مصنفة ضمن {currentTransaction.type} في القسم {currentTransaction.mainCategory}.
                التصنيف الفرعي المحدد هو {currentTransaction.subCategory}.
              </p>
            </div>
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
            <Button variant="outline" onClick={() => setShowTypeDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة التاريخ */}
      <Dialog open={showDateDialog} onOpenChange={setShowDateDialog}>
        <DialogContent className="max-w-xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
                borderRadius: '10px'
              }}>
                <Calendar className="h-5 w-5" style={{ color: '#ec4899' }} />
              </div>
              تفاصيل التاريخ والإنشاء
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4" style={{ padding: '20px 0' }}>
            <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', border: '2px solid #f9a8d4' }}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '13px', color: '#64748b' }}>التاريخ والوقت:</span>
                  <span className="font-mono" style={{ fontSize: '14px', fontWeight: 600, color: '#9f1239' }}>
                    {currentTransaction.createdDateTime}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-pink-200 pt-3">
                  <span style={{ fontSize: '13px', color: '#64748b' }}>تاريخ الإنشاء:</span>
                  <span className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#9f1239' }}>
                    {currentTransaction.date}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '13px', color: '#64748b' }}>المنشئ:</span>
                  <Badge style={{ fontSize: '12px', background: '#ec4899', color: '#fff' }}>
                    {currentTransaction.createdBy}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '13px', color: '#64748b' }}>الفترة:</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#9f1239' }}>
                    {currentTransaction.number.substring(2, 4)}/20{currentTransaction.number.substring(0, 2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
            <Button variant="outline" onClick={() => setShowDateDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة الحالة */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="max-w-3xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: transactionStatuses[currentTransaction.status]?.bgColor || 'rgba(107, 114, 128, 0.1)',
                borderRadius: '10px'
              }}>
                {React.createElement(transactionStatuses[currentTransaction.status]?.icon || AlertCircle, {
                  className: "h-5 w-5",
                  style: { color: transactionStatuses[currentTransaction.status]?.color || '#6b7280' }
                })}
              </div>
              تفاصيل الحالة
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4" style={{ padding: '20px 0' }}>
            <Card className="card-rtl" style={{ 
              background: transactionStatuses[currentTransaction.status]?.bgColor || 'rgba(107, 114, 128, 0.1)', 
              border: `2px solid ${transactionStatuses[currentTransaction.status]?.color || '#6b7280'}` 
            }}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '13px', color: '#64748b' }}>الحالة الحالية:</span>
                  <Badge style={{ 
                    fontSize: '14px', 
                    background: transactionStatuses[currentTransaction.status]?.color || '#6b7280', 
                    color: '#fff',
                    padding: '6px 14px'
                  }}>
                    {transactionStatuses[currentTransaction.status]?.label || 'غير محدد'}
                  </Badge>
                </div>
                
                <div className="border-t pt-3" style={{ borderColor: transactionStatuses[currentTransaction.status]?.color + '40' || '#6b728040' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>الوصف المختصر:</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>
                    {transactionStatuses[currentTransaction.status]?.shortDesc || 'لا يوجد وصف'}
                  </p>
                </div>

                <div className="border-t pt-3" style={{ borderColor: transactionStatuses[currentTransaction.status]?.color + '40' || '#6b728040' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>الوصف التفصيلي:</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.6' }}>
                    {transactionStatuses[currentTransaction.status]?.detailedDesc || 'لا يوجد وصف تفصيلي'}
                  </p>
                </div>

                {currentTransaction.statusReason && (
                  <div className="border-t pt-3" style={{ borderColor: transactionStatuses[currentTransaction.status]?.color + '40' || '#6b728040' }}>
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>السبب:</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#ef4444' }}>
                      {currentTransaction.statusReason}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 border-t pt-3" style={{ borderColor: transactionStatuses[currentTransaction.status]?.color + '40' || '#6b728040' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>تم التحديث بواسطة:</p>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937' }}>
                      {currentTransaction.statusBy}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>تاريخ التحديث:</p>
                    <p className="font-mono" style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937' }}>
                      {currentTransaction.statusDate}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة نسبة الإنجاز */}
      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent className="max-w-4xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: '10px'
              }}>
                <TrendingUp className="h-5 w-5" style={{ color: '#10b981' }} />
              </div>
              تفاصيل نسبة الإنجاز
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6" style={{ padding: '20px 0' }}>
            {/* النسبة الإجمالية */}
            <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '2px solid #6ee7b7' }}>
              <CardContent className="p-6 text-center">
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>نسبة الإنجاز الإجمالية</p>
                <div 
                  className="font-mono mx-auto"
                  style={{ 
                    fontSize: '48px', 
                    fontWeight: 700, 
                    color: '#065f46',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    width: 'fit-content'
                  }}
                >
                  {currentTransaction.progress}%
                </div>
                <Progress value={currentTransaction.progress} className="mt-4" style={{ height: '12px' }} />
              </CardContent>
            </Card>

            {/* جدول مراحل التنفيذ */}
            <div>
              <h3 className="text-base mb-3" style={{ fontWeight: 700, color: '#1f2937' }}>
                <BarChart3 className="h-4 w-4 inline ml-1" />
                مراحل التنفيذ (8 مراحل)
              </h3>

              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرحلة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { phase: '١. التحضير الأولي', desc: 'جمع المستندات والبيانات', percent: 100, status: 'completed' },
                    { phase: '٢. التوثيق', desc: 'توثيق المستندات الرسمية', percent: 100, status: 'completed' },
                    { phase: '٣. التقييم الفني', desc: 'التقييم والمعاينة الميدانية', percent: 85, status: 'in-progress' },
                    { phase: '٤. الموافقات', desc: 'الحصول على الموافقات اللازمة', percent: 60, status: 'in-progress' },
                    { phase: '٥. التنفيذ', desc: 'البدء في تنفيذ المشروع', percent: 40, status: 'in-progress' },
                    { phase: '٦. المراجعة', desc: 'مراجعة جودة التنفيذ', percent: 0, status: 'pending' },
                    { phase: '٧. التسليم', desc: 'تسليم المشروع للمالك', percent: 0, status: 'pending' },
                    { phase: '٨. الإغلاق', desc: 'إغلاق المعاملة والأرشفة', percent: 0, status: 'pending' }
                  ].map((phase, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', fontWeight: 600 }}>
                        {phase.phase}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>
                        {phase.desc}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-mono" style={{ fontSize: '13px', fontWeight: 600, color: phase.status === 'completed' ? '#10b981' : phase.status === 'in-progress' ? '#f59e0b' : '#6b7280' }}>
                          {phase.percent}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge style={{ 
                          fontSize: '10px',
                          background: phase.status === 'completed' ? '#10b981' : phase.status === 'in-progress' ? '#f59e0b' : '#6b7280',
                          color: '#fff'
                        }}>
                          {phase.status === 'completed' ? 'مكتمل' : phase.status === 'in-progress' ? 'قيد العمل' : 'قادم'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
            <Button variant="outline" onClick={() => setShowProgressDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إغلاق
            </Button>
            <Button>
              <Printer className="h-4 w-4 ml-1" />
              طباعة التقرير
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نوافذ الأزرار السريعة */}
      
      {/* 1. نافذة أتعاب المكتب */}
      <Dialog open={showOfficeFeesDialog} onOpenChange={setShowOfficeFeesDialog}>
        <DialogContent className="max-w-5xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)',
                borderRadius: '10px'
              }}>
                <DollarSign className="h-5 w-5" style={{ color: '#f59e0b' }} />
              </div>
              أتعاب المكتب - المعاملة {currentTransaction?.number}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6" style={{ padding: '20px 0' }}>
            {/* القسم الأيمن: ملخص الأتعاب */}
            <div>
              <h3 className="text-base mb-3" style={{ fontWeight: 700, color: '#1f2937' }}>
                <Calculator className="h-4 w-4 inline ml-1" />
                ملخص الأتعاب
              </h3>

              <Card className="card-rtl mb-4" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '2px solid #fbbf24' }}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '13px', color: '#64748b' }}>الأتعاب الأساسية:</span>
                    <span className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#92400e' }}>
                      50,000 ريال
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-yellow-200 pt-2">
                    <span style={{ fontSize: '13px', color: '#64748b' }}>رسوم إضافية:</span>
                    <span className="font-mono" style={{ fontSize: '14px', fontWeight: 600, color: '#92400e' }}>
                      12,000 ريال
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '13px', color: '#64748b' }}>ضريبة القيمة المضافة (15%):</span>
                    <span className="font-mono" style={{ fontSize: '14px', fontWeight: 600, color: '#92400e' }}>
                      9,300 ريال
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t-2 border-yellow-400 pt-3 mt-3">
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>الإجمالي:</span>
                    <span className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: '#b45309' }}>
                      71,300 ريال
                    </span>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-sm mb-2" style={{ fontWeight: 600, color: '#1f2937' }}>
                حالة الدفعات:
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded" style={{ background: '#d1fae5' }}>
                  <span style={{ fontSize: '12px', color: '#065f46' }}>المدفوع:</span>
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 600, color: '#065f46' }}>
                    30,000 ريال
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded" style={{ background: '#fef3c7' }}>
                  <span style={{ fontSize: '12px', color: '#92400e' }}>المتبقي:</span>
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>
                    41,300 ريال
                  </span>
                </div>
              </div>
            </div>

            {/* القسم الأيسر: تفاصيل الأتعاب */}
            <div>
              <h3 className="text-base mb-3" style={{ fontWeight: 700, color: '#1f2937' }}>
                <Receipt className="h-4 w-4 inline ml-1" />
                تفصيل الأتعاب
              </h3>

              <Table className="table-rtl" style={{ fontSize: '12px' }}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">البند</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-right">رسوم الإشراف</TableCell>
                    <TableCell className="text-right font-mono">25,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-right">رسوم التصميم</TableCell>
                    <TableCell className="text-right font-mono">15,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-right">رسوم المتابعة</TableCell>
                    <TableCell className="text-right font-mono">10,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-right">رسوم التراخيص</TableCell>
                    <TableCell className="text-right font-mono">8,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-right">رسوم استشارية</TableCell>
                    <TableCell className="text-right font-mono">4,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
            <Button variant="outline" onClick={() => setShowOfficeFeesDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إغلاق
            </Button>
            <Button style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <Printer className="h-4 w-4 ml-1" />
              طباعة الفاتورة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. نافذة رسالة للمالك */}
      <Dialog open={showMessageOwnerDialog} onOpenChange={setShowMessageOwnerDialog}>
        <DialogContent className="max-w-3xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)',
                borderRadius: '10px'
              }}>
                <Mail className="h-5 w-5" style={{ color: '#2563eb' }} />
              </div>
              إرسال رسالة للمالك - {currentTransaction?.ownerName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4" style={{ padding: '20px 0' }}>
            <div className="grid grid-cols-2 gap-4">
              <InputWithCopy
                label="اسم المالك"
                id="msg-owner-name"
                value={currentTransaction?.ownerName || ''}
                disabled
                copyable={false}
                clearable={false}
              />
              <InputWithCopy
                label="رقم الجوال"
                id="msg-owner-phone"
                value={currentTransaction?.ownerPhone || ''}
                disabled
                copyable={true}
                clearable={false}
              />
            </div>

            <SelectWithCopy
              label="قناة الإرسال"
              id="msg-channel"
              value=""
              onChange={() => {}}
              options={[
                { value: 'sms', label: 'رسالة نصية (SMS)' },
                { value: 'whatsapp', label: 'واتساب' },
                { value: 'email', label: 'بريد إلكتروني' },
                { value: 'call', label: 'مكالمة هاتفية' }
              ]}
              copyable={false}
              clearable={true}
            />

            <InputWithCopy
              label="عنوان الرسالة"
              id="msg-subject"
              value=""
              onChange={() => {}}
              placeholder="أدخل عنوان الرسالة"
              copyable={false}
              clearable={true}
            />

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                نص الرسالة *
              </label>
              <textarea
                rows={6}
                className="input-field"
                style={{ fontFamily: 'Tajawal, sans-serif', width: '100%' }}
                placeholder="اكتب نص الرسالة هنا..."
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" style={{ fontSize: '11px' }}>
                <FileText className="h-3 w-3 ml-1" />
                إرفاق ملف
              </Button>
              <Button variant="outline" style={{ fontSize: '11px' }}>
                <ImageIcon className="h-3 w-3 ml-1" />
                إرفاق صورة
              </Button>
              <Button variant="outline" style={{ fontSize: '11px' }}>
                <Paperclip className="h-3 w-3 ml-1" />
                مستند المعاملة
              </Button>
            </div>
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
            <Button variant="outline" onClick={() => setShowMessageOwnerDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            <Button style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' }}>
              <Send className="h-4 w-4 ml-1" />
              إرسال الآن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. نافذة إرسال ملفات */}
      <Dialog open={showSendFilesDialog} onOpenChange={setShowSendFilesDialog}>
        <DialogContent className="max-w-4xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)',
                borderRadius: '10px'
              }}>
                <Paperclip className="h-5 w-5" style={{ color: '#a855f7' }} />
              </div>
              إرسال ملفات للمعاملة {currentTransaction?.number}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6" style={{ padding: '20px 0' }}>
            {/* القسم الأيمن: اختيار المستلم */}
            <div>
              <h3 className="text-base mb-3" style={{ fontWeight: 700, color: '#1f2937' }}>
                <Users className="h-4 w-4 inline ml-1" />
                تحديد المستلم
              </h3>

              <div className="space-y-3">
                <SelectWithCopy
                  label="نوع المستلم"
                  id="recipient-type"
                  value=""
                  onChange={() => {}}
                  options={[
                    { value: 'owner', label: 'المالك' },
                    { value: 'employee', label: 'موظف' },
                    { value: 'entity', label: 'جهة خارجية' },
                    { value: 'contractor', label: 'مقاول' }
                  ]}
                  copyable={false}
                  clearable={true}
                />

                <SelectWithCopy
                  label="اسم المستلم"
                  id="recipient-name"
                  value=""
                  onChange={() => {}}
                  options={[
                    { value: 'owner1', label: currentTransaction?.ownerName || '' },
                    { value: 'emp1', label: 'المهندس أحمد العلي' },
                    { value: 'emp2', label: 'المهندس محمد السعيد' }
                  ]}
                  copyable={false}
                  clearable={true}
                />

                <SelectWithCopy
                  label="طريقة الإرسال"
                  id="send-method"
                  value=""
                  onChange={() => {}}
                  options={[
                    { value: 'email', label: 'بريد إلكتروني' },
                    { value: 'whatsapp', label: 'واتساب' },
                    { value: 'portal', label: 'البوابة الإلكترونية' },
                    { value: 'hand', label: 'تسليم يدوي' }
                  ]}
                  copyable={false}
                  clearable={true}
                />

                <InputWithCopy
                  label="الموضوع"
                  id="send-subject"
                  value=""
                  onChange={() => {}}
                  placeholder="موضوع الإرسال"
                  copyable={false}
                  clearable={true}
                />
              </div>
            </div>

            {/* القسم الأيسر: اختيار الملفات */}
            <div>
              <h3 className="text-base mb-3" style={{ fontWeight: 700, color: '#1f2937' }}>
                <FileCheck className="h-4 w-4 inline ml-1" />
                الملفات المراد إرسالها
              </h3>

              <div 
                className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center mb-4"
                style={{ background: '#faf5ff', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
              >
                <Paperclip className="h-12 w-12 text-purple-400 mb-3" />
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                  اسحب الملفات هنا أو اضغط للتحديد
                </p>
                <Button variant="outline" style={{ fontSize: '12px' }}>
                  <FolderOpen className="h-4 w-4 ml-1" />
                  اختيار ملفات
                </Button>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.6' }}>
                  <strong>الملفات المسموحة:</strong> PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
                  <br />
                  <strong>الحجم الأقصى:</strong> 25 ميجابايت لكل ملف
                </p>
              </div>
            </div>
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
            <Button variant="outline" onClick={() => setShowSendFilesDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            <Button style={{ background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)' }}>
              <Send className="h-4 w-4 ml-1" />
              إرسال الملفات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. نافذة إيقاف مؤقت */}
      <Dialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
        <DialogContent className="max-w-2xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)',
                borderRadius: '10px'
              }}>
                <AlertCircle className="h-5 w-5" style={{ color: '#f59e0b' }} />
              </div>
              إيقاف مؤقت للمعاملة {currentTransaction?.number}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4" style={{ padding: '20px 0' }}>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#92400e', marginBottom: '4px' }}>
                    تنبيه مهم
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.6' }}>
                    سيتم إيقاف العمل على هذه المعاملة مؤقتاً. يجب تحديد سبب الإيقاف والمدة المتوقعة.
                  </p>
                </div>
              </div>
            </div>

            <SelectWithCopy
              label="سبب الإيقاف المؤقت *"
              id="pause-reason"
              value=""
              onChange={() => {}}
              options={[
                { value: 'waiting-owner', label: 'في انتظار رد المالك' },
                { value: 'waiting-docs', label: 'في انتظار مستندات' },
                { value: 'waiting-approval', label: 'في انتظار موافقة جهة' },
                { value: 'technical-issue', label: 'مشكلة فنية' },
                { value: 'financial-issue', label: 'مشكلة مالية' },
                { value: 'other', label: 'سبب آخر' }
              ]}
              copyable={false}
              clearable={true}
            />

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                تفاصيل السبب *
              </label>
              <textarea
                rows={4}
                className="input-field"
                style={{ fontFamily: 'Tajawal, sans-serif', width: '100%' }}
                placeholder="اذكر تفاصيل السبب بدقة..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputWithCopy
                label="المدة المتوقعة (بالأيام)"
                id="pause-duration"
                value=""
                onChange={() => {}}
                placeholder="مثال: 7"
                type="number"
                copyable={false}
                clearable={true}
              />
              <InputWithCopy
                label="تاريخ المتابعة المتوقع"
                id="pause-followup-date"
                value=""
                onChange={() => {}}
                type="date"
                copyable={false}
                clearable={true}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                <Bell className="h-4 w-4" />
                تنبيه تلقائي
              </label>
              <EnhancedSwitch
                id="pause-reminder"
                checked={false}
                onCheckedChange={() => {}}
                label="إرسال تذكير قبل تاريخ المتابعة"
                size="sm"
              />
            </div>
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
            <Button variant="outline" onClick={() => setShowPauseDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            <Button style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <AlertCircle className="h-4 w-4 ml-1" />
              إيقاف مؤقت
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. نافذة إلغاء المعاملة */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-2xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                borderRadius: '10px'
              }}>
                <X className="h-5 w-5" style={{ color: '#ef4444' }} />
              </div>
              إلغاء المعاملة {currentTransaction?.number}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4" style={{ padding: '20px 0' }}>
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#991b1b', marginBottom: '4px' }}>
                    ⚠️ تحذير: إجراء حرج
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.6' }}>
                    سيتم إلغاء هذه المعاملة نهائياً. هذا الإجراء لا يمكن التراجع عنه إلا بإعادة التنشيط اليدوية.
                  </p>
                </div>
              </div>
            </div>

            <SelectWithCopy
              label="سبب الإلغاء *"
              id="cancel-reason"
              value=""
              onChange={() => {}}
              options={[
                { value: 'owner-request', label: 'طلب من المالك' },
                { value: 'payment-issue', label: 'مشكلة في الدفع' },
                { value: 'legal-issue', label: 'مشكلة قانونية' },
                { value: 'duplicate', label: 'معاملة مكررة' },
                { value: 'wrong-data', label: 'بيانات خاطئة' },
                { value: 'other', label: 'سبب آخر' }
              ]}
              copyable={false}
              clearable={true}
            />

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                تفاصيل سبب الإلغاء *
              </label>
              <textarea
                rows={5}
                className="input-field"
                style={{ fontFamily: 'Tajawal, sans-serif', width: '100%' }}
                placeholder="اكتب تفاصيل دقيقة عن سبب الإلغاء (سيتم أرشفة هذه المعلومات)..."
              />
            </div>

            <InputWithCopy
              label="رقم المستند المرجعي (إن وجد)"
              id="cancel-reference"
              value=""
              onChange={() => {}}
              placeholder="مثال: طلب الإلغاء رقم..."
              copyable={false}
              clearable={true}
            />

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                <Archive className="h-4 w-4" />
                خيارات الأرشفة
              </label>
              <EnhancedSwitch
                id="cancel-archive"
                checked={true}
                onCheckedChange={() => {}}
                label="الاحتفاظ بالمعاملة في الأرشيف"
                size="sm"
                variant="default"
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.6' }}>
                <strong>ملاحظة:</strong> بعد الإلغاء، يمكنك إعادة تنشيط المعاملة في أي وقت من خلال زر "إعادة التنشيط".
              </p>
            </div>
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            <Button style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              <X className="h-4 w-4 ml-1" />
              تأكيد الإلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. نافذة إعادة التنشيط */}
      <Dialog open={showReactivateDialog} onOpenChange={setShowReactivateDialog}>
        <DialogContent className="max-w-2xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                borderRadius: '10px'
              }}>
                <RefreshCw className="h-5 w-5" style={{ color: '#22c55e' }} />
              </div>
              إعادة تنشيط المعاملة {currentTransaction?.number}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4" style={{ padding: '20px 0' }}>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#14532d', marginBottom: '4px' }}>
                    معلومات المعاملة الملغاة
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.6' }}>
                    المعاملة: {currentTransaction?.number} • المالك: {currentTransaction?.ownerName}
                    <br />
                    تاريخ الإلغاء: {currentTransaction?.statusDate} • السبب: {currentTransaction?.statusReason}
                  </p>
                </div>
              </div>
            </div>

            <SelectWithCopy
              label="سبب إعادة التنشيط *"
              id="reactivate-reason"
              value=""
              onChange={() => {}}
              options={[
                { value: 'error', label: 'إلغاء خاطئ' },
                { value: 'owner-changed-mind', label: 'تراجع المالك عن الإلغاء' },
                { value: 'issue-resolved', label: 'تم حل المشكلة' },
                { value: 'new-agreement', label: 'اتفاق جديد' },
                { value: 'other', label: 'سبب آخر' }
              ]}
              copyable={false}
              clearable={true}
            />

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                ملاحظات إعادة التنشيط *
              </label>
              <textarea
                rows={4}
                className="input-field"
                style={{ fontFamily: 'Tajawal, sans-serif', width: '100%' }}
                placeholder="اكتب سبب إعادة التنشيط بالتفصيل..."
              />
            </div>

            <SelectWithCopy
              label="الحالة بعد التنشيط"
              id="reactivate-new-status"
              value="in-progress"
              onChange={() => {}}
              options={[
                { value: 'new', label: 'جديدة' },
                { value: 'in-progress', label: 'قيد المعالجة' },
                { value: 'pending-approval', label: 'في انتظار الموافقة' }
              ]}
              copyable={false}
              clearable={false}
            />

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                <Bell className="h-4 w-4" />
                الإشعارات
              </label>
              <div className="space-y-2">
                <EnhancedSwitch
                  id="reactivate-notify-owner"
                  checked={true}
                  onCheckedChange={() => {}}
                  label="إشعار المالك بإعادة التنشيط"
                  size="sm"
                  variant="success"
                />
                <EnhancedSwitch
                  id="reactivate-notify-team"
                  checked={true}
                  onCheckedChange={() => {}}
                  label="إشعار فريق العمل"
                  size="sm"
                  variant="success"
                />
              </div>
            </div>
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
            <Button variant="outline" onClick={() => setShowReactivateDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            <Button style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
              <RefreshCw className="h-4 w-4 ml-1" />
              إعادة تنشيط
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 7. نافذة إنهاء المعاملة */}
      <Dialog open={showCompleteTransactionDialog} onOpenChange={setShowCompleteTransactionDialog}>
        <DialogContent className="max-w-3xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: '10px'
              }}>
                <CheckCircle className="h-5 w-5" style={{ color: '#10b981' }} />
              </div>
              إنهاء المعاملة {currentTransaction?.number}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4" style={{ padding: '20px 0' }}>
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#065f46', marginBottom: '4px' }}>
                    تهانينا! المعاملة على وشك الاكتمال
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.6' }}>
                    التأكد من اكتمال جميع المتطلبات قبل إنهاء المعاملة نهائياً.
                  </p>
                </div>
              </div>
            </div>

            {/* قائمة التحقق */}
            <Card className="card-rtl" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
              <CardHeader>
                <CardTitle style={{ fontSize: '14px' }}>
                  <ClipboardList className="h-4 w-4 inline ml-1" />
                  قائمة التحقق النهائية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span style={{ fontSize: '12px', color: '#1f2937' }}>جميع التابات مكتملة (39/39)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span style={{ fontSize: '12px', color: '#1f2937' }}>المستندات موثقة رقمياً</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span style={{ fontSize: '12px', color: '#1f2937' }}>الأتعاب مسددة بالكامل</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>في انتظار موافقة المالك النهائية</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <InputWithCopy
                label="تاريخ الإنهاء"
                id="complete-date"
                value={new Date().toISOString().split('T')[0]}
                onChange={() => {}}
                type="date"
                copyable={false}
                clearable={false}
              />
              <InputWithCopy
                label="رقم التسليم النهائي"
                id="complete-delivery-number"
                value=""
                onChange={() => {}}
                placeholder="DN-2025-001"
                copyable={false}
                clearable={true}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                ملاحظات الإنهاء
              </label>
              <textarea
                rows={3}
                className="input-field"
                style={{ fontFamily: 'Tajawal, sans-serif', width: '100%' }}
                placeholder="ملاحظات إضافية عن إنهاء المعاملة..."
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                <Archive className="h-4 w-4" />
                الأرشفة والتنبيهات
              </label>
              <div className="space-y-2">
                <EnhancedSwitch
                  id="complete-archive"
                  checked={true}
                  onCheckedChange={() => {}}
                  label="نقل المعاملة للأرشيف"
                  size="sm"
                  variant="success"
                />
                <EnhancedSwitch
                  id="complete-notify-owner"
                  checked={true}
                  onCheckedChange={() => {}}
                  label="إرسال شهادة إنجاز للمالك"
                  size="sm"
                  variant="success"
                />
                <EnhancedSwitch
                  id="complete-generate-report"
                  checked={true}
                  onCheckedChange={() => {}}
                  label="إنشاء تقرير نهائي تلقائي"
                  size="sm"
                  variant="success"
                />
              </div>
            </div>
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
            <Button variant="outline" onClick={() => setShowCompleteTransactionDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            <Button style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <CheckCircle className="h-4 w-4 ml-1" />
              إنهاء المعاملة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 8. نافذة رفع ملفات */}
      <Dialog open={showUploadFilesDialog} onOpenChange={setShowUploadFilesDialog}>
        <DialogContent className="max-w-4xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                borderRadius: '10px'
              }}>
                <Download className="h-5 w-5" style={{ color: '#a855f7', transform: 'rotate(180deg)' }} />
              </div>
              رفع ملفات للمعاملة {currentTransaction?.number}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6" style={{ padding: '20px 0' }}>
            {/* القسم الأيمن: معلومات الملف */}
            <div>
              <h3 className="text-base mb-3" style={{ fontWeight: 700, color: '#1f2937' }}>
                <FileCheck className="h-4 w-4 inline ml-1" />
                معلومات الملف
              </h3>

              <div className="space-y-3">
                <SelectWithCopy
                  label="تصنيف المستند *"
                  id="upload-category"
                  value=""
                  onChange={() => {}}
                  options={[
                    { value: 'drawing', label: 'رسومات هندسية' },
                    { value: 'license', label: 'تراخيص' },
                    { value: 'contract', label: 'عقود' },
                    { value: 'invoice', label: 'فواتير' },
                    { value: 'report', label: 'تقارير' },
                    { value: 'photo', label: 'صور الموقع' },
                    { value: 'other', label: 'أخرى' }
                  ]}
                  copyable={false}
                  clearable={true}
                />

                <InputWithCopy
                  label="اسم المستند"
                  id="upload-doc-name"
                  value=""
                  onChange={() => {}}
                  placeholder="مثال: المخطط النهائي"
                  copyable={false}
                  clearable={true}
                />

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                    وصف المستند
                  </label>
                  <textarea
                    rows={3}
                    className="input-field"
                    style={{ fontFamily: 'Tajawal, sans-serif', width: '100%' }}
                    placeholder="وصف مختصر للمستند..."
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                    <Shield className="h-4 w-4" />
                    الإعدادات
                  </label>
                  <div className="space-y-2">
                    <EnhancedSwitch
                      id="upload-confidential"
                      checked={false}
                      onCheckedChange={() => {}}
                      label="مستند سري"
                      size="sm"
                      variant="warning"
                    />
                    <EnhancedSwitch
                      id="upload-require-signature"
                      checked={false}
                      onCheckedChange={() => {}}
                      label="يتطلب توقيع رقمي"
                      size="sm"
                      variant="default"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* القسم الأيسر: منطقة الرفع */}
            <div>
              <h3 className="text-base mb-3" style={{ fontWeight: 700, color: '#1f2937' }}>
                <FolderOpen className="h-4 w-4 inline ml-1" />
                اختيار الملفات
              </h3>

              <div 
                className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center mb-4"
                style={{ background: '#faf5ff', minHeight: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
              >
                <div style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)',
                  borderRadius: '50%',
                  marginBottom: '16px'
                }}>
                  <Download className="h-12 w-12 text-purple-600" style={{ transform: 'rotate(180deg)' }} />
                </div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#6b21a8', marginBottom: '8px' }}>
                  اسحب الملفات هنا
                </p>
                <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px' }}>
                  أو اضغط لاختيار الملفات من جهازك
                </p>
                <Button variant="outline" style={{ fontSize: '13px' }}>
                  <FolderOpen className="h-4 w-4 ml-1" />
                  تصفح الملفات
                </Button>
              </div>

              <div className="space-y-2">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.6' }}>
                    <strong>الصيغ المدعومة:</strong>
                    <br />
                    PDF, DOC, DOCX, XLS, XLSX, DWG, DXF, JPG, PNG, ZIP
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.6' }}>
                    <strong>الحد الأقصى:</strong> 50 ميجابايت لكل ملف
                    <br />
                    <strong>عدد الملفات:</strong> حتى 10 ملفات في المرة الواحدة
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
            <Button variant="outline" onClick={() => setShowUploadFilesDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            <Button style={{ background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)' }}>
              <Download className="h-4 w-4 ml-1" style={{ transform: 'rotate(180deg)' }} />
              رفع الملفات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 9. نافذة نقل الملكية */}
      <Dialog open={showTransferOwnershipDialog} onOpenChange={setShowTransferOwnershipDialog}>
        <DialogContent className="max-w-3xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
            <DialogTitle style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
                borderRadius: '10px'
              }}>
                <UserPlus className="h-5 w-5" style={{ color: '#f97316' }} />
              </div>
              نقل ملكية المعاملة {currentTransaction?.number}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4" style={{ padding: '20px 0' }}>
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#9a3412', marginBottom: '4px' }}>
                    تنبيه: نقل الملكية
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.6' }}>
                    سيتم نقل ملكية هذه المعاملة من {currentTransaction?.ownerName} إلى عميل آخر.
                  </p>
                </div>
              </div>
            </div>

            {/* بيانات المالك الحالي */}
            <Card className="card-rtl" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
              <CardHeader>
                <CardTitle style={{ fontSize: '14px' }}>
                  <User className="h-4 w-4 inline ml-1" />
                  المالك الحالي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>الاسم:</span>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', marginTop: '2px' }}>
                      {currentTransaction?.ownerName}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>رقم الهوية:</span>
                    <p className="font-mono" style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', marginTop: '2px' }}>
                      {currentTransaction?.ownerId}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>الجوال:</span>
                    <p className="font-mono" style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', marginTop: '2px' }}>
                      {currentTransaction?.ownerPhone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* بيانات المالك الجديد */}
            <div>
              <h3 className="text-base mb-3" style={{ fontWeight: 700, color: '#1f2937' }}>
                <UserPlus className="h-4 w-4 inline ml-1" />
                بيانات المالك الجديد
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <InputWithCopy
                    label="رقم الهوية *"
                    id="new-owner-id"
                    value=""
                    onChange={() => {}}
                    placeholder="1XXXXXXXXX"
                    copyable={false}
                    clearable={true}
                  />
                  <Button variant="outline" style={{ marginTop: '28px' }}>
                    <Search className="h-4 w-4 ml-1" />
                    بحث
                  </Button>
                </div>

                <InputWithCopy
                  label="الاسم الكامل *"
                  id="new-owner-name"
                  value=""
                  onChange={() => {}}
                  placeholder="الاسم الرباعي"
                  copyable={false}
                  clearable={true}
                />

                <div className="grid grid-cols-2 gap-3">
                  <InputWithCopy
                    label="رقم الجوال *"
                    id="new-owner-phone"
                    value=""
                    onChange={() => {}}
                    placeholder="05XXXXXXXX"
                    copyable={false}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="البريد الإلكتروني"
                    id="new-owner-email"
                    value=""
                    onChange={() => {}}
                    placeholder="email@example.com"
                    copyable={false}
                    clearable={true}
                  />
                </div>

                <InputWithCopy
                  label="رقم مستند النقل"
                  id="transfer-document-number"
                  value=""
                  onChange={() => {}}
                  placeholder="رقم وثيقة نقل الملكية"
                  copyable={false}
                  clearable={true}
                />

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                    سبب النقل *
                  </label>
                  <textarea
                    rows={3}
                    className="input-field"
                    style={{ fontFamily: 'Tajawal, sans-serif', width: '100%' }}
                    placeholder="اذكر سبب نقل الملكية..."
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                    <Bell className="h-4 w-4" />
                    الإشعارات
                  </label>
                  <div className="space-y-2">
                    <EnhancedSwitch
                      id="transfer-notify-old-owner"
                      checked={true}
                      onCheckedChange={() => {}}
                      label="إشعار المالك السابق"
                      size="sm"
                      variant="warning"
                    />
                    <EnhancedSwitch
                      id="transfer-notify-new-owner"
                      checked={true}
                      onCheckedChange={() => {}}
                      label="إشعار المالك الجديد"
                      size="sm"
                      variant="success"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px' }}>
            <Button variant="outline" onClick={() => setShowTransferOwnershipDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            <Button style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}>
              <UserPlus className="h-4 w-4 ml-1" />
              تأكيد نقل الملكية
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainTransactionsScreen_Complete_284_v10;
