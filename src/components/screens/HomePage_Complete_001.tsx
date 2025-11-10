/**
 * الشاشة 001 - الصفحة الرئيسية القابلة للتخصيص v8.1
 * ========================================================
 * 
 * صفحة رئيسية ذكية مع:
 * - أزرار شاشات قابلة للتخصيص
 * - 3 أوضاع عرض (شبكة تفصيلية، شبكة مختصرة، قائمة)
 * - عدادات الإشعارات والمهام
 * - حفظ التفضيلات في قاعدة البيانات
 * - السحب والإفلات لإعادة الترتيب
 * - الشاشات الافتراضية المحددة
 * - 🆕 نظام استعلامات شامل (صك + قطعة/مخطط + هوية)
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Home, FileText, Plus, List, ClipboardList, Settings, Grid3x3, Grid2x2,
  Search, Star, Clock, AlertCircle, CheckCircle, Edit3, Save, X,
  LayoutGrid, LayoutList, Zap, TrendingUp, Users, Calendar, Bell,
  FolderOpen, Briefcase, Target, Award, Activity, Download, Upload,
  RefreshCw, BarChart3, PieChart, ArrowRight, Filter, SortAsc, ExternalLink,
  FileSearch, Map, IdCard, Eye, Image as ImageIcon, MapPin, Printer,
  type LucideIcon
} from 'lucide-react';
import QuickLinksManager from '../QuickLinksManager';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';

// تعريف الشاشة
interface ScreenShortcut {
  id: string;
  screenId: string;
  screenNumber: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
  notifications?: number;
  tasks?: number;
  route: string;
  category: 'transactions' | 'management' | 'reports' | 'settings';
  priority: number;
  isDefault: boolean;
}

// 🆕 واجهات الاستعلامات الجديدة
interface OwnershipDocument {
  documentNumber: string;
  ownerName: string;
  ownerIdNumber: string;
  ownerMobile?: string; // 🆕 رقم الجوال
  city: string;
  district: string;
  planNumber: string;
  plotNumbers: string[];
  area: number;
  type: string;
  status: string;
  image?: string;
  linkedTransactions: string[];
}

interface OwnerType {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  description: string;
  isActive: boolean;
}

// 🆕 واجهة المعاملات مع المخططات النهائية
interface TransactionWithDrawings {
  transactionNumber: string;
  transactionYear: string;
  ownerName: string;
  location: string;
  type: string;
  status: string;
  finalDrawings: FinalDrawing[];
}

interface FinalDrawing {
  id: string;
  name: string;
  type: 'architectural' | 'structural' | 'mep' | 'landscape' | 'sections' | 'elevations';
  fileUrl: string;
  fileSize: string;
  uploadDate: string;
  pageCount: number;
  isApproved: boolean;
}

// الشاشات المتاحة للإضافة
const AVAILABLE_SCREENS: ScreenShortcut[] = [
  {
    id: 'scr-284',
    screenId: '284',
    screenNumber: 'SCR-284',
    title: 'إدارة المعاملات',
    description: 'عرض وإدارة جميع المعاملات',
    icon: FileText,
    color: '#2563eb',
    bgGradient: 'from-blue-500 to-blue-600',
    notifications: 12,
    tasks: 8,
    route: '/transactions',
    category: 'transactions',
    priority: 1,
    isDefault: true
  },
  {
    id: 'scr-286',
    screenId: '286',
    screenNumber: 'SCR-286',
    title: 'إنشاء معاملة',
    description: 'إنشاء معاملة جديدة',
    icon: Plus,
    color: '#10b981',
    bgGradient: 'from-green-500 to-emerald-600',
    route: '/create-transaction',
    category: 'transactions',
    priority: 2,
    isDefault: true
  },
  {
    id: 'scr-285',
    screenId: '285',
    screenNumber: 'SCR-285',
    title: 'سجل المعاملات',
    description: 'سجل تاريخي للمعاملات',
    icon: ClipboardList,
    color: '#8b5cf6',
    bgGradient: 'from-purple-500 to-violet-600',
    notifications: 3,
    route: '/transactions-log',
    category: 'transactions',
    priority: 3,
    isDefault: true
  },
  {
    id: 'scr-999',
    screenId: '999',
    screenNumber: 'SCR-999',
    title: 'مهامي',
    description: 'المهام الشخصية والإشعارات',
    icon: CheckCircle,
    color: '#f59e0b',
    bgGradient: 'from-orange-500 to-amber-600',
    notifications: 5,
    tasks: 15,
    route: '/my-tasks',
    category: 'management',
    priority: 4,
    isDefault: true
  },
  {
    id: 'scr-901',
    screenId: '901',
    screenNumber: 'SCR-901',
    title: 'المستندات والملفات',
    description: 'إدارة المستندات',
    icon: FolderOpen,
    color: '#06b6d4',
    bgGradient: 'from-cyan-500 to-blue-600',
    notifications: 7,
    route: '/documents',
    category: 'management',
    priority: 5,
    isDefault: false
  },
  {
    id: 'scr-825',
    screenId: '825',
    screenNumber: 'SCR-825',
    title: 'تعيين المهام',
    description: 'توزيع المهام على الموظفين',
    icon: Users,
    color: '#ec4899',
    bgGradient: 'from-pink-500 to-rose-600',
    tasks: 12,
    route: '/assign-tasks',
    category: 'management',
    priority: 6,
    isDefault: false
  },
  {
    id: 'scr-820',
    screenId: '820',
    screenNumber: 'SCR-820',
    title: 'المواعيد',
    description: 'جدول المواعيد والاجتماعات',
    icon: Calendar,
    color: '#14b8a6',
    bgGradient: 'from-teal-500 to-cyan-600',
    notifications: 4,
    route: '/appointments',
    category: 'management',
    priority: 7,
    isDefault: false
  },
  {
    id: 'scr-947',
    screenId: '947',
    screenNumber: 'SCR-947',
    title: 'المستهدفات والأهداف',
    description: 'متابعة الأهداف والإنجازات',
    icon: Target,
    color: '#6366f1',
    bgGradient: 'from-indigo-500 to-purple-600',
    route: '/targets',
    category: 'reports',
    priority: 8,
    isDefault: false
  },
  {
    id: 'scr-950',
    screenId: '950',
    screenNumber: 'SCR-950',
    title: 'الإحصائيات',
    description: 'تقارير وإحصائيات الأعمال',
    icon: BarChart3,
    color: '#f97316',
    bgGradient: 'from-orange-600 to-red-600',
    route: '/statistics',
    category: 'reports',
    priority: 9,
    isDefault: false
  },
  {
    id: 'scr-222',
    screenId: '222',
    screenNumber: 'SCR-222',
    title: 'الحسابات والمالية',
    description: 'إدارة الحسابات المالية',
    icon: Briefcase,
    color: '#84cc16',
    bgGradient: 'from-lime-500 to-green-600',
    route: '/accounts',
    category: 'management',
    priority: 10,
    isDefault: false
  }
];

// 🆕 بيانات وهمية لأنواع الملاك
const OWNER_TYPES: OwnerType[] = [
  { id: '1', nameAr: 'فرد سعودي', nameEn: 'Saudi Individual', code: 'SAU-IND', description: 'مواطن سعودي', isActive: true },
  { id: '2', nameAr: 'فرد مقيم', nameEn: 'Resident Individual', code: 'RES-IND', description: 'مقيم في السعودية', isActive: true },
  { id: '3', nameAr: 'شركة سعودية', nameEn: 'Saudi Company', code: 'SAU-COM', description: 'شركة مسجلة في السعودية', isActive: true },
  { id: '4', nameAr: 'شركة أجنبية', nameEn: 'Foreign Company', code: 'FOR-COM', description: 'شركة أجنبية', isActive: true },
  { id: '5', nameAr: 'جهة حكومية', nameEn: 'Government Entity', code: 'GOV-ENT', description: 'جهة حكومية سعودية', isActive: true },
  { id: '6', nameAr: 'ملكية مشتركة', nameEn: 'Joint Ownership', code: 'JNT-OWN', description: 'أكثر من مالك', isActive: true },
  { id: '7', nameAr: 'ورثة', nameEn: 'Heirs', code: 'HEIRS', description: 'ملكية ورثة', isActive: true },
  { id: '8', nameAr: 'وقف', nameEn: 'Endowment', code: 'WAQF', description: 'وقف خيري أو ذري', isActive: true }
];

// 🆕 بيانات وهمية للمعاملات مع المخططات النهائية
const MOCK_TRANSACTIONS_WITH_DRAWINGS: TransactionWithDrawings[] = [
  {
    transactionNumber: '2501001',
    transactionYear: '2025',
    ownerName: 'أحمد محمد العتيبي',
    location: 'الرياض - النرجس - مخطط 3456',
    type: 'رخصة بناء سكني',
    status: 'معتمد',
    finalDrawings: [
      { id: 'd1', name: 'المخطط المعماري', type: 'architectural', fileUrl: '/drawings/arch-001.pdf', fileSize: '2.5 MB', uploadDate: '2025-01-15', pageCount: 12, isApproved: true },
      { id: 'd2', name: 'المخطط الإنشائي', type: 'structural', fileUrl: '/drawings/struct-001.pdf', fileSize: '3.2 MB', uploadDate: '2025-01-16', pageCount: 18, isApproved: true },
      { id: 'd3', name: 'مخطط الكهرباء والسباكة', type: 'mep', fileUrl: '/drawings/mep-001.pdf', fileSize: '1.8 MB', uploadDate: '2025-01-17', pageCount: 8, isApproved: true },
      { id: 'd4', name: 'الواجهات', type: 'elevations', fileUrl: '/drawings/elev-001.pdf', fileSize: '1.2 MB', uploadDate: '2025-01-18', pageCount: 6, isApproved: true }
    ]
  },
  {
    transactionNumber: '2501005',
    transactionYear: '2025',
    ownerName: 'فاطمة عبدالله الأحمدي',
    location: 'الرياض - العليا - مخطط 2890',
    type: 'رخصة بناء تجاري',
    status: 'معتمد',
    finalDrawings: [
      { id: 'd5', name: 'المخطط المعماري', type: 'architectural', fileUrl: '/drawings/arch-002.pdf', fileSize: '4.1 MB', uploadDate: '2025-01-20', pageCount: 24, isApproved: true },
      { id: 'd6', name: 'المخطط الإنشائي', type: 'structural', fileUrl: '/drawings/struct-002.pdf', fileSize: '5.3 MB', uploadDate: '2025-01-21', pageCount: 32, isApproved: true },
      { id: 'd7', name: 'مخطط الكهرباء والسباكة', type: 'mep', fileUrl: '/drawings/mep-002.pdf', fileSize: '2.9 MB', uploadDate: '2025-01-22', pageCount: 16, isApproved: true }
    ]
  },
  {
    transactionNumber: '2501012',
    transactionYear: '2025',
    ownerName: 'خالد سعد المطيري',
    location: 'الرياض - الملقا - مخطط 4123',
    type: 'رخصة بناء فيلا',
    status: 'معتمد',
    finalDrawings: [
      { id: 'd8', name: 'المخطط المعماري', type: 'architectural', fileUrl: '/drawings/arch-003.pdf', fileSize: '3.8 MB', uploadDate: '2025-01-25', pageCount: 20, isApproved: true },
      { id: 'd9', name: 'المخطط الإنشائي', type: 'structural', fileUrl: '/drawings/struct-003.pdf', fileSize: '4.5 MB', uploadDate: '2025-01-26', pageCount: 28, isApproved: true },
      { id: 'd10', name: 'مخطط الكهرباء والسباكة', type: 'mep', fileUrl: '/drawings/mep-003.pdf', fileSize: '2.2 MB', uploadDate: '2025-01-27', pageCount: 12, isApproved: true },
      { id: 'd11', name: 'المقاطع', type: 'sections', fileUrl: '/drawings/sec-003.pdf', fileSize: '1.5 MB', uploadDate: '2025-01-28', pageCount: 8, isApproved: true },
      { id: 'd12', name: 'تنسيق الموقع', type: 'landscape', fileUrl: '/drawings/land-003.pdf', fileSize: '1.1 MB', uploadDate: '2025-01-29', pageCount: 4, isApproved: true }
    ]
  }
];

// 🆕 بيانات وهمية لوثائق الملكية
const MOCK_DOCUMENTS: OwnershipDocument[] = [
  {
    documentNumber: '310105040083',
    ownerName: 'أحمد محمد العتيبي',
    ownerIdNumber: '1045678912',
    ownerMobile: '0501234567', // 🆕
    city: 'الرياض',
    district: 'النرجس',
    planNumber: '3456',
    plotNumbers: ['1522', '1523'],
    area: 600,
    type: 'صك إلكتروني',
    status: 'نشط',
    image: '/mock-deed-image.jpg',
    linkedTransactions: ['2501001', '2501025']
  },
  {
    documentNumber: '310205050092',
    ownerName: 'فاطمة عبدالله الأحمدي',
    ownerIdNumber: '1056789123',
    ownerMobile: '0551234567', // 🆕
    city: 'الرياض',
    district: 'العليا',
    planNumber: '2890',
    plotNumbers: ['842'],
    area: 400,
    type: 'صك عدلي',
    status: 'نشط',
    linkedTransactions: ['2501003']
  },
  {
    documentNumber: '310305060101',
    ownerName: 'خالد سعد المطيري',
    ownerIdNumber: '1067890234',
    ownerMobile: '0561234567', // 🆕
    city: 'الرياض',
    district: 'الملقا',
    planNumber: '4123',
    plotNumbers: ['2341', '2342', '2343'],
    area: 900,
    type: 'وثيقة REGA',
    status: 'نشط',
    linkedTransactions: []
  }
];

type ViewMode = 'grid-detailed' | 'grid-compact' | 'list';

const HomePage_Complete_001: React.FC = () => {
  // الحالات الرئيسية
  const [viewMode, setViewMode] = useState<ViewMode>('grid-detailed');
  const [userScreens, setUserScreens] = useState<ScreenShortcut[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
  const [selectedScreens, setSelectedScreens] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showQuickLinks, setShowQuickLinks] = useState(false);
  const [showOwnershipCheck, setShowOwnershipCheck] = useState(false);
  const [showRequestStatus, setShowRequestStatus] = useState(false);
  
  // 🆕 نوافذ الاستعلامات الجديدة
  const [showDeedInquiry, setShowDeedInquiry] = useState(false);
  const [showPlotInquiry, setShowPlotInquiry] = useState(false);
  const [showIdInquiry, setShowIdInquiry] = useState(false);
  const [showFinalDrawingsDialog, setShowFinalDrawingsDialog] = useState(false);
  
  // 🆕 حالات الاستعلامات
  const [deedNumber, setDeedNumber] = useState('');
  const [plotNumber, setPlotNumber] = useState('');
  const [planNumber, setPlanNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [selectedOwnerType, setSelectedOwnerType] = useState('');
  const [inquiryResults, setInquiryResults] = useState<OwnershipDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<OwnershipDocument | null>(null);
  const [showDocumentDetails, setShowDocumentDetails] = useState(false);
  
  // 🆕 حالات نظام المخططات النهائية
  const [drawingsSearchQuery, setDrawingsSearchQuery] = useState('');
  const [drawingsSearchResults, setDrawingsSearchResults] = useState<TransactionWithDrawings[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithDrawings | null>(null);
  const [showTransactionDrawings, setShowTransactionDrawings] = useState(false);
  
  // نوافذ البطاقات الإحصائية
  const [showActiveScreensDialog, setShowActiveScreensDialog] = useState(false);
  const [showPendingTasksDialog, setShowPendingTasksDialog] = useState(false);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [showDailyActivityDialog, setShowDailyActivityDialog] = useState(false);

  // تحميل التفضيلات من قاعدة البيانات (محاكاة)
  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = () => {
    // محاكاة تحميل من قاعدة البيانات
    const savedPreferences = localStorage.getItem('homepage_preferences');
    
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      setUserScreens(preferences.screens || getDefaultScreens());
      setViewMode(preferences.viewMode || 'grid-detailed');
    } else {
      setUserScreens(getDefaultScreens());
    }
  };

  const getDefaultScreens = (): ScreenShortcut[] => {
    return AVAILABLE_SCREENS.filter(s => s.isDefault).sort((a, b) => a.priority - b.priority);
  };

  const saveUserPreferences = async () => {
    setIsSaving(true);
    
    const preferences = {
      screens: userScreens,
      viewMode: viewMode,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem('homepage_preferences', JSON.stringify(preferences));
    
    setTimeout(() => {
      setIsSaving(false);
      setShowCustomizeDialog(false);
    }, 500);
  };

  const handleCustomizeScreens = () => {
    setSelectedScreens(userScreens.map(s => s.id));
    setShowCustomizeDialog(true);
  };

  const handleToggleScreen = (screenId: string) => {
    setSelectedScreens(prev => 
      prev.includes(screenId)
        ? prev.filter(id => id !== screenId)
        : [...prev, screenId]
    );
  };

  const handleApplyCustomization = () => {
    const newScreens = AVAILABLE_SCREENS
      .filter(s => selectedScreens.includes(s.id))
      .sort((a, b) => a.priority - b.priority);
    
    setUserScreens(newScreens);
    saveUserPreferences();
  };

  const handleResetToDefault = () => {
    setSelectedScreens(getDefaultScreens().map(s => s.id));
  };

  // 🆕 دالة البحث عن المخططات النهائية
  const handleFinalDrawingsSearch = () => {
    if (!drawingsSearchQuery.trim()) {
      alert('الرجاء إدخال رقم المعاملة أو اسم المالك');
      return;
    }

    const searchTerm = drawingsSearchQuery.toLowerCase();
    const results = MOCK_TRANSACTIONS_WITH_DRAWINGS.filter(tx => 
      tx.transactionNumber.includes(searchTerm) ||
      tx.ownerName.toLowerCase().includes(searchTerm) ||
      tx.location.toLowerCase().includes(searchTerm)
    );

    setDrawingsSearchResults(results);

    if (results.length === 0) {
      alert('لم يتم العثور على معاملات مطابقة');
    }
  };

  const handleViewTransactionDrawings = (transaction: TransactionWithDrawings) => {
    setSelectedTransaction(transaction);
    setShowTransactionDrawings(true);
    setShowFinalDrawingsDialog(false);
  };

  const handleDownloadDrawing = (drawing: FinalDrawing) => {
    console.log('تحميل المخطط:', drawing.name, drawing.fileUrl);
    alert(`جاري تحميل: ${drawing.name}`);
  };

  const handlePrintDrawing = (drawing: FinalDrawing) => {
    console.log('طباعة المخطط:', drawing.name);
    alert(`جاري إرسال للطباعة: ${drawing.name}`);
  };

  // 🆕 دوال الاستعلامات الجديدة
  const handleDeedInquiry = () => {
    if (!deedNumber.trim()) {
      alert('الرجاء إدخال رقم الوثيقة');
      return;
    }

    // البحث في البيانات الوهمية
    const results = MOCK_DOCUMENTS.filter(doc => 
      doc.documentNumber.includes(deedNumber)
    );

    setInquiryResults(results);

    if (results.length === 1) {
      setSelectedDocument(results[0]);
      setShowDocumentDetails(true);
      setShowDeedInquiry(false);
    } else if (results.length === 0) {
      alert('لم يتم العثور على الوثيقة في النظام');
    }
  };

  const handlePlotInquiry = () => {
    if (!planNumber.trim() && !plotNumber.trim()) {
      alert('الرجاء إدخال رقم المخطط أو رقم القطعة');
      return;
    }

    // البحث في البيانات الوهمية
    const results = MOCK_DOCUMENTS.filter(doc => {
      const matchesPlan = planNumber ? doc.planNumber.includes(planNumber) : true;
      const matchesPlot = plotNumber ? doc.plotNumbers.some(p => p.includes(plotNumber)) : true;
      return matchesPlan && matchesPlot;
    });

    setInquiryResults(results);

    if (results.length === 0) {
      alert('لم يتم العثور على نتائج');
    }
  };

  const handleIdInquiry = () => {
    if (!idNumber.trim()) {
      alert('الرجاء إدخال معيار البحث (رقم هوية، جوال، أو اسم)');
      return;
    }

    // البحث المرن في البيانات الوهمية
    const searchTerm = idNumber.trim().toLowerCase();
    let results = MOCK_DOCUMENTS.filter(doc => {
      // البحث برقم الهوية
      const matchesId = doc.ownerIdNumber.includes(idNumber);
      
      // البحث برقم الجوال
      const matchesMobile = doc.ownerMobile?.includes(idNumber) || false;
      
      // البحث بالاسم (رباعي أو جزء منه)
      const nameParts = doc.ownerName.toLowerCase().split(' ');
      const matchesName = nameParts.some(part => part.includes(searchTerm)) || 
                         doc.ownerName.toLowerCase().includes(searchTerm);
      
      return matchesId || matchesMobile || matchesName;
    });

    // تصفية حسب نوع المالك إذا تم اختياره (غير "الكل")
    if (selectedOwnerType && selectedOwnerType !== '') {
      // في التطبيق الحقيقي، سيتم التصفية حسب نوع المالك
      // حالياً نترك النتائج كما هي لأن البيانات الوهمية لا تحتوي على نوع المالك
    }

    setInquiryResults(results);

    if (results.length === 0) {
      alert('لم يتم العثور على نتائج مطابقة. جرب معيار بحث آخر.');
    }
  };

  // الشاشات المفلترة
  const filteredScreens = userScreens.filter(screen => {
    const matchesSearch = screen.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         screen.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || screen.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // إحصائيات سريعة
  const stats = {
    totalTasks: userScreens.reduce((sum, s) => sum + (s.tasks || 0), 0),
    totalNotifications: userScreens.reduce((sum, s) => sum + (s.notifications || 0), 0),
    activeScreens: userScreens.length
  };

  const handleScreenClick = (route: string) => {
    console.log('Navigate to:', route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50" style={{ direction: 'rtl' }}>
      <div className="container mx-auto p-4 space-y-3">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', fontSize: '18px' }}>
                الصفحة الرئيسية
              </h1>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                مرحباً بك في نظام إدارة الأعمال الهندسية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 🆕 زر استعلام عن صك */}
            <Button
              onClick={() => setShowDeedInquiry(true)}
              style={{ background: '#8b5cf6', color: '#fff', height: '32px', fontSize: '11px', padding: '0 12px' }}
              title="استعلام سريع عن صك برقم الوثيقة"
            >
              <FileSearch className="h-4 w-4 ml-1" />
              استعلام عن صك
            </Button>

            {/* 🆕 زر الاستعلام بالقطعة والمخطط */}
            <Button
              onClick={() => setShowPlotInquiry(true)}
              style={{ background: '#f59e0b', color: '#fff', height: '32px', fontSize: '11px', padding: '0 12px' }}
              title="استعلام بالقطعة والمخطط"
            >
              <Map className="h-4 w-4 ml-1" />
              قطعة ومخطط
            </Button>

            {/* 🆕 زر الاستعلام عن مالك */}
            <Button
              onClick={() => setShowIdInquiry(true)}
              style={{ background: '#10b981', color: '#fff', height: '32px', fontSize: '11px', padding: '0 12px' }}
              title="الاستعلام عن مالك (بالهوية، الجوال، أو الاسم)"
            >
              <IdCard className="h-4 w-4 ml-1" />
              الاستعلام عن مالك
            </Button>

            {/* 🆕 زر طباعة مخططات نهائية */}
            <Button
              onClick={() => setShowFinalDrawingsDialog(true)}
              style={{ background: '#dc2626', color: '#fff', height: '32px', fontSize: '11px', padding: '0 12px' }}
              title="طباعة المخططات النهائية لمعاملة"
            >
              <Printer className="h-4 w-4 ml-1" />
              طباعة مخططات
            </Button>

            <Button
              onClick={() => setShowOwnershipCheck(true)}
              style={{ background: '#06b6d4', color: '#fff', height: '32px', fontSize: '11px', padding: '0 12px' }}
              title="التحقق من وثائق الملكية"
            >
              <FileText className="h-4 w-4 ml-1" />
              وثائق الملكية
            </Button>
            
            <Button
              onClick={() => setShowRequestStatus(true)}
              style={{ background: '#ec4899', color: '#fff', height: '32px', fontSize: '11px', padding: '0 12px' }}
              title="التحقق من حالة الطلبات"
            >
              <Search className="h-4 w-4 ml-1" />
              حالة الطلبات
            </Button>
            
            <Button
              onClick={() => setShowQuickLinks(true)}
              style={{ background: '#2563eb', color: '#fff', height: '32px', fontSize: '11px', padding: '0 12px' }}
            >
              <ExternalLink className="h-4 w-4 ml-1" />
              روابط سريعة
            </Button>
            
            <Badge className="bg-blue-100 text-blue-700 text-xs">
              <code>SCR-001</code>
            </Badge>
          </div>
        </div>

        {/* 🆕 نافذة استعلام عن صك */}
        <Dialog open={showDeedInquiry} onOpenChange={setShowDeedInquiry}>
          <DialogContent className="max-w-2xl" style={{ direction: 'rtl' }}>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <FileSearch className="h-5 w-5 inline ml-2 text-purple-600" />
                استعلام سريع عن صك برقم الوثيقة
              </DialogTitle>
              <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                ابحث في جميع أنظمة النظام عن وثيقة الملكية وعرض التفاصيل الكاملة والصورة
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Card className="card-rtl bg-purple-50">
                <CardContent className="p-3">
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b21a8' }}>
                    <strong>خدمة شاملة:</strong> البحث يشمل جميع وثائق الملكية المسجلة في النظام (الشاشة 800)
                  </p>
                </CardContent>
              </Card>

              <InputWithCopy
                label="رقم وثيقة الملكية *"
                id="deed-number"
                value={deedNumber}
                onChange={(e) => setDeedNumber(e.target.value)}
                placeholder="مثال: 310105040083"
                copyable={false}
                clearable={true}
              />

              {inquiryResults.length > 0 && !showDocumentDetails && (
                <Card className="card-rtl">
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      النتائج ({inquiryResults.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        {inquiryResults.map((doc, idx) => (
                          <Card 
                            key={idx}
                            className="card-rtl cursor-pointer hover:bg-purple-50 transition-all"
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowDocumentDetails(true);
                              setShowDeedInquiry(false);
                            }}
                          >
                            <CardContent className="p-2">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-sm mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                                    {doc.documentNumber}
                                  </p>
                                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                    {doc.ownerName} - {doc.city}، {doc.district}
                                  </p>
                                </div>
                                <Badge style={{ background: '#8b5cf6' }}>
                                  {doc.plotNumbers.length} قطعة
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowDeedInquiry(false);
                setDeedNumber('');
                setInquiryResults([]);
              }}>
                <X className="h-4 w-4 ml-1" />
                إلغاء
              </Button>
              <Button onClick={handleDeedInquiry} style={{ background: '#8b5cf6', color: '#fff' }}>
                <Search className="h-4 w-4 ml-1" />
                بحث
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 🆕 نافذة تفاصيل الصك */}
        <Dialog open={showDocumentDetails} onOpenChange={setShowDocumentDetails}>
          <DialogContent className="max-w-5xl" style={{ direction: 'rtl' }}>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <FileText className="h-5 w-5 inline ml-2 text-purple-600" />
                تفاصيل وثيقة الملكية
              </DialogTitle>
            </DialogHeader>

            {selectedDocument && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* العمود الأيمن: المعلومات */}
                  <div className="space-y-3">
                    <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', border: '2px solid #d8b4fe' }}>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          معلومات الوثيقة
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b21a8' }}>رقم الوثيقة</Label>
                            <p className="font-mono" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                              {selectedDocument.documentNumber}
                            </p>
                          </div>
                          <div>
                            <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b21a8' }}>النوع</Label>
                            <p style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedDocument.type}</p>
                          </div>
                          <div>
                            <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b21a8' }}>المساحة</Label>
                            <p style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedDocument.area} م²</p>
                          </div>
                          <div>
                            <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b21a8' }}>الحالة</Label>
                            <Badge className="bg-green-500 text-white text-xs">{selectedDocument.status}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          معلومات المالك
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 space-y-2">
                        <div className="text-xs space-y-1">
                          <div>
                            <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>الاسم</Label>
                            <p style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                              {selectedDocument.ownerName}
                            </p>
                          </div>
                          <div>
                            <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>رقم الهوية</Label>
                            <p className="font-mono" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {selectedDocument.ownerIdNumber}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الموقع
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="text-xs space-y-1">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>المدينة</Label>
                              <p style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedDocument.city}</p>
                            </div>
                            <div>
                              <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>الحي</Label>
                              <p style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedDocument.district}</p>
                            </div>
                            <div>
                              <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>رقم المخطط</Label>
                              <p className="font-mono" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {selectedDocument.planNumber}
                              </p>
                            </div>
                            <div>
                              <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>أرقام القطع</Label>
                              <p className="font-mono" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {selectedDocument.plotNumbers.join(', ')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {selectedDocument.linkedTransactions.length > 0 && (
                      <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            المعاملات المرتبطة ({selectedDocument.linkedTransactions.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <div className="space-y-1">
                            {selectedDocument.linkedTransactions.map((tx, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <Badge className="font-mono bg-amber-500 text-white">{tx}</Badge>
                                <span style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>
                                  معاملة نشطة
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* العمود الأيسر: الصورة */}
                  <div>
                    <Card className="card-rtl h-full">
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <ImageIcon className="h-4 w-4" />
                          صورة الوثيقة
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                          {selectedDocument.image ? (
                            <img 
                              src={selectedDocument.image} 
                              alt="صورة الوثيقة" 
                              className="max-w-full max-h-full object-contain rounded"
                            />
                          ) : (
                            <div className="text-center">
                              <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                لا توجد صورة متاحة
                              </p>
                              <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                يمكن رفع الصورة من شاشة إدارة أرقام الملكية
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowDocumentDetails(false);
                setSelectedDocument(null);
              }}>
                <X className="h-4 w-4 ml-1" />
                إغلاق
              </Button>
              <Button style={{ background: '#2563eb', color: '#fff' }}>
                <Eye className="h-4 w-4 ml-1" />
                فتح في الشاشة 800
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 🆕 نافذة الاستعلام بالقطعة والمخطط */}
        <Dialog open={showPlotInquiry} onOpenChange={setShowPlotInquiry}>
          <DialogContent className="max-w-3xl" style={{ direction: 'rtl' }}>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Map className="h-5 w-5 inline ml-2 text-amber-600" />
                الاستعلام بالقطعة والمخطط
              </DialogTitle>
              <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                ابحث عن وثائق الملكية حسب رقم القطعة والمخطط أو المخطط فقط
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Card className="card-rtl bg-amber-50">
                <CardContent className="p-3">
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>
                    <strong>مرن:</strong> يمكنك البحث بالقطعة والمخطط معاً، أو المخطط فقط لعرض جميع القطع فيه
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <InputWithCopy
                  label="رقم القطعة"
                  id="plot-number"
                  value={plotNumber}
                  onChange={(e) => setPlotNumber(e.target.value)}
                  placeholder="مثال: 1522"
                  copyable={false}
                  clearable={true}
                />
                
                <InputWithCopy
                  label="رقم المخطط *"
                  id="plan-number"
                  value={planNumber}
                  onChange={(e) => setPlanNumber(e.target.value)}
                  placeholder="مثال: 3456"
                  copyable={false}
                  clearable={true}
                />
              </div>

              {inquiryResults.length > 0 && (
                <Card className="card-rtl">
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      النتائج ({inquiryResults.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <ScrollArea className="h-[300px]">
                      <Table className="table-rtl">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الوثيقة</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المالك</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المخطط</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطع</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراء</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inquiryResults.map((doc, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="text-right font-mono" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {doc.documentNumber}
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {doc.ownerName}
                              </TableCell>
                              <TableCell className="text-right font-mono" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {doc.planNumber}
                              </TableCell>
                              <TableCell className="text-right font-mono" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {doc.plotNumbers.join(', ')}
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {doc.area} م²
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDocument(doc);
                                    setShowDocumentDetails(true);
                                    setShowPlotInquiry(false);
                                  }}
                                  style={{ background: '#f59e0b', color: '#fff', height: '24px', fontSize: '10px' }}
                                >
                                  <Eye className="h-3 w-3 ml-1" />
                                  عرض
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowPlotInquiry(false);
                setPlotNumber('');
                setPlanNumber('');
                setInquiryResults([]);
              }}>
                <X className="h-4 w-4 ml-1" />
                إلغاء
              </Button>
              <Button onClick={handlePlotInquiry} style={{ background: '#f59e0b', color: '#fff' }}>
                <Search className="h-4 w-4 ml-1" />
                بحث
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 🆕 نافذة الاستعلام عن مالك */}
        <Dialog open={showIdInquiry} onOpenChange={setShowIdInquiry}>
          <DialogContent className="max-w-4xl" style={{ direction: 'rtl' }}>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <IdCard className="h-5 w-5 inline ml-2 text-green-600" />
                الاستعلام عن مالك
              </DialogTitle>
              <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                ابحث عن المالك باستخدام رقم الهوية، رقم الجوال، أو الاسم
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Card className="card-rtl bg-green-50">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d', fontWeight: '600' }}>
                      <strong>🔍 بحث مرن وذكي:</strong>
                    </p>
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#166534' }}>
                      • <strong>رقم الهوية:</strong> اختر نوع المالك أو اختر "الكل" للبحث العام<br />
                      • <strong>رقم الجوال:</strong> أدخل الرقم كاملاً أو جزء منه<br />
                      • <strong>الاسم:</strong> أدخل الاسم الرباعي أو أي جزء منه (الأول، الأب، الجد، العائلة)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* قسم البحث برقم الهوية */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <IdCard className="h-4 w-4 text-blue-600" />
                  <Label style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600', color: '#1e40af' }}>
                    البحث برقم الهوية
                  </Label>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <InputWithCopy
                    label="رقم الهوية"
                    id="id-number"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="مثال: 1045678912"
                    copyable={false}
                    clearable={true}
                  />
                  
                  <SelectWithCopy
                    label="نوع المالك (اختياري)"
                    id="owner-type"
                    value={selectedOwnerType}
                    onChange={setSelectedOwnerType}
                    options={[
                      { value: '', label: 'الكل (بحث عام)' },
                      ...OWNER_TYPES.filter(t => t.isActive).map(t => ({
                        value: t.id,
                        label: `${t.nameAr} (${t.code})`
                      }))
                    ]}
                    copyable={false}
                    clearable={true}
                  />
                </div>
              </div>

              <Separator />

              {/* قسم البحث برقم الجوال */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <Label style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600', color: '#7c3aed' }}>
                    البحث برقم الجوال
                  </Label>
                </div>
                
                <InputWithCopy
                  label="رقم الجوال"
                  id="mobile-number"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="مثال: 0501234567 أو 501234567"
                  copyable={false}
                  clearable={true}
                />
              </div>

              <Separator />

              {/* قسم البحث بالاسم */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-orange-600" />
                  <Label style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600', color: '#ea580c' }}>
                    البحث بالاسم
                  </Label>
                </div>
                
                <InputWithCopy
                  label="الاسم (رباعي أو جزء منه)"
                  id="owner-name"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="مثال: أحمد محمد أو أحمد أو العتيبي"
                  copyable={false}
                  clearable={true}
                />
                
                <Card className="card-rtl bg-blue-50">
                  <CardContent className="p-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                        <strong>نصيحة:</strong> يمكنك البحث بالاسم الرباعي الكامل، أو بجزء واحد فقط من الاسم (الأول، الأب، الجد، أو العائلة)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedOwnerType && selectedOwnerType !== '' && (
                <Card className="card-rtl bg-blue-50">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                        النوع المحدد: <strong>{OWNER_TYPES.find(t => t.id === selectedOwnerType)?.nameAr}</strong>
                        {' - '}
                        {OWNER_TYPES.find(t => t.id === selectedOwnerType)?.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {inquiryResults.length > 0 && (
                <Card className="card-rtl">
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      النتائج ({inquiryResults.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {inquiryResults.map((doc, idx) => (
                          <Card 
                            key={idx}
                            className="card-rtl cursor-pointer hover:bg-green-50 transition-all"
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowDocumentDetails(true);
                              setShowIdInquiry(false);
                            }}
                          >
                            <CardContent className="p-3">
                              <div className="grid grid-cols-4 gap-2 text-xs">
                                <div>
                                  <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>رقم الوثيقة</Label>
                                  <p className="font-mono" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                                    {doc.documentNumber}
                                  </p>
                                </div>
                                <div>
                                  <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>المالك</Label>
                                  <p style={{ fontFamily: 'Tajawal, sans-serif' }}>{doc.ownerName}</p>
                                </div>
                                <div>
                                  <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>الموقع</Label>
                                  <p style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                    {doc.city} - {doc.district}
                                  </p>
                                </div>
                                <div className="flex items-end justify-end">
                                  <Button
                                    size="sm"
                                    style={{ background: '#10b981', color: '#fff', height: '24px', fontSize: '10px' }}
                                  >
                                    <Eye className="h-3 w-3 ml-1" />
                                    تفاصيل
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
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowIdInquiry(false);
                setIdNumber('');
                setSelectedOwnerType('');
                setInquiryResults([]);
              }}>
                <X className="h-4 w-4 ml-1" />
                إلغاء
              </Button>
              <Button onClick={handleIdInquiry} style={{ background: '#10b981', color: '#fff' }}>
                <Search className="h-4 w-4 ml-1" />
                بحث
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* 🆕 نافذة طباعة المخططات النهائية */}
        <Dialog open={showFinalDrawingsDialog} onOpenChange={setShowFinalDrawingsDialog}>
          <DialogContent className="max-w-5xl" style={{ direction: 'rtl' }}>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Printer className="h-5 w-5 inline ml-2 text-red-600" />
                طباعة المخططات النهائية لمعاملة
              </DialogTitle>
              <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                ابحث عن المعاملة واستعرض جميع المخططات النهائية المعتمدة للطباعة أو التحميل
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* بطاقة توضيحية */}
              <Card className="card-rtl bg-red-50">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#991b1b' }}>
                      <strong>المخططات النهائية المعتمدة:</strong> يمكنك البحث بر��م المعاملة أو اسم المالك أو الموقع للوصول إلى جميع المخططات النهائية التي تم اعتمادها
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* حقل البحث */}
              <div className="flex gap-2">
                <InputWithCopy
                  label="البحث عن معاملة"
                  id="drawings-search"
                  value={drawingsSearchQuery}
                  onChange={(e) => setDrawingsSearchQuery(e.target.value)}
                  placeholder="رقم المعاملة، اسم المالك، أو الموقع"
                  copyable={false}
                  clearable={true}
                />
                <Button 
                  onClick={handleFinalDrawingsSearch}
                  style={{ background: '#dc2626', color: '#fff', alignSelf: 'flex-end', height: '42px' }}
                >
                  <Search className="h-4 w-4 ml-1" />
                  بحث
                </Button>
              </div>

              {/* نتائج البحث */}
              {drawingsSearchResults.length > 0 && (
                <Card className="card-rtl">
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      المعاملات المطابقة ({drawingsSearchResults.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {drawingsSearchResults.map((tx, idx) => (
                          <Card 
                            key={idx}
                            className="card-rtl cursor-pointer hover:bg-red-50 transition-all"
                            onClick={() => handleViewTransactionDrawings(tx)}
                          >
                            <CardContent className="p-3">
                              <div className="grid grid-cols-5 gap-3 text-xs">
                                <div>
                                  <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#991b1b' }}>رقم المعاملة</Label>
                                  <p className="font-mono" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                                    {tx.transactionNumber}
                                  </p>
                                </div>
                                <div>
                                  <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#991b1b' }}>المالك</Label>
                                  <p style={{ fontFamily: 'Tajawal, sans-serif' }}>{tx.ownerName}</p>
                                </div>
                                <div>
                                  <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#991b1b' }}>الموقع</Label>
                                  <p style={{ fontFamily: 'Tajawal, sans-serif' }}>{tx.location}</p>
                                </div>
                                <div>
                                  <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#991b1b' }}>عدد المخططات</Label>
                                  <Badge className="bg-red-500 text-white">
                                    {tx.finalDrawings.length} مخطط
                                  </Badge>
                                </div>
                                <div className="flex items-end justify-end">
                                  <Button
                                    size="sm"
                                    style={{ background: '#dc2626', color: '#fff', height: '24px', fontSize: '10px' }}
                                  >
                                    <Eye className="h-3 w-3 ml-1" />
                                    عرض المخططات
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
              )}

              {/* رسالة عدم وجود نتائج */}
              {drawingsSearchQuery && drawingsSearchResults.length === 0 && (
                <Card className="card-rtl bg-gray-50">
                  <CardContent className="p-4 text-center">
                    <Search className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      لم يتم العثور على معاملات مطابقة. جرب كلمة بحث أخرى.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowFinalDrawingsDialog(false);
                setDrawingsSearchQuery('');
                setDrawingsSearchResults([]);
              }}>
                <X className="h-4 w-4 ml-1" />
                إغلاق
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 🆕 نافذة استعراض مخططات المعاملة */}
        <Dialog open={showTransactionDrawings} onOpenChange={setShowTransactionDrawings}>
          <DialogContent className="max-w-6xl max-h-[90vh]" style={{ direction: 'rtl' }}>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Printer className="h-5 w-5 inline ml-2 text-red-600" />
                المخططات النهائية - معاملة رقم {selectedTransaction?.transactionNumber}
              </DialogTitle>
              <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {selectedTransaction?.ownerName} • {selectedTransaction?.location}
              </DialogDescription>
            </DialogHeader>

            {selectedTransaction && (
              <div className="space-y-4">
                {/* معلومات المعاملة */}
                <div className="grid grid-cols-4 gap-3">
                  <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
                    <CardContent className="p-3">
                      <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#991b1b', fontSize: '10px' }}>رقم المعاملة</Label>
                      <p className="font-mono" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', fontSize: '14px' }}>
                        {selectedTransaction.transactionNumber}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                    <CardContent className="p-3">
                      <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af', fontSize: '10px' }}>نوع المعاملة</Label>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600', fontSize: '13px' }}>
                        {selectedTransaction.type}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                    <CardContent className="p-3">
                      <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d', fontSize: '10px' }}>الحالة</Label>
                      <Badge className="bg-green-600 text-white text-xs">
                        {selectedTransaction.status}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                    <CardContent className="p-3">
                      <Label style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e', fontSize: '10px' }}>إجمالي المخططات</Label>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', fontSize: '14px', color: '#92400e' }}>
                        {selectedTransaction.finalDrawings.length} مخطط
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* قائمة المخططات */}
                <Card className="card-rtl">
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm flex items-center justify-between" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <span>المخططات النهائية المعتمدة</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            selectedTransaction.finalDrawings.forEach(d => handlePrintDrawing(d));
                          }}
                          style={{ background: '#dc2626', color: '#fff', height: '28px', fontSize: '11px' }}
                        >
                          <Printer className="h-3 w-3 ml-1" />
                          طباعة الكل
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            selectedTransaction.finalDrawings.forEach(d => handleDownloadDrawing(d));
                          }}
                          style={{ background: '#2563eb', color: '#fff', height: '28px', fontSize: '11px' }}
                        >
                          <Download className="h-3 w-3 ml-1" />
                          تحميل الكل
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <ScrollArea className="h-[400px]">
                      <Table className="table-rtl">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المخطط</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الصفحات</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الرفع</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedTransaction.finalDrawings.map((drawing, idx) => (
                            <TableRow key={drawing.id}>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {idx + 1}
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                                {drawing.name}
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                <Badge style={{
                                  background: 
                                    drawing.type === 'architectural' ? '#3b82f6' :
                                    drawing.type === 'structural' ? '#10b981' :
                                    drawing.type === 'mep' ? '#f59e0b' :
                                    drawing.type === 'landscape' ? '#84cc16' :
                                    drawing.type === 'sections' ? '#8b5cf6' :
                                    '#06b6d4'
                                }}>
                                  {
                                    drawing.type === 'architectural' ? 'معماري' :
                                    drawing.type === 'structural' ? 'إنشائي' :
                                    drawing.type === 'mep' ? 'كهرباء وسباكة' :
                                    drawing.type === 'landscape' ? 'تنسيق موقع' :
                                    drawing.type === 'sections' ? 'مقاطع' :
                                    'واجهات'
                                  }
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {drawing.pageCount} صفحة
                              </TableCell>
                              <TableCell className="text-right font-mono" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {drawing.fileSize}
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {drawing.uploadDate}
                              </TableCell>
                              <TableCell className="text-right">
                                {drawing.isApproved ? (
                                  <Badge className="bg-green-500 text-white text-xs">
                                    معتمد ✓
                                  </Badge>
                                ) : (
                                  <Badge className="bg-yellow-500 text-white text-xs">
                                    قيد المراجعة
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-1 justify-end">
                                  <Button
                                    size="sm"
                                    onClick={() => handlePrintDrawing(drawing)}
                                    style={{ background: '#dc2626', color: '#fff', height: '24px', fontSize: '10px', padding: '0 8px' }}
                                  >
                                    <Printer className="h-3 w-3 ml-1" />
                                    طباعة
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleDownloadDrawing(drawing)}
                                    style={{ background: '#2563eb', color: '#fff', height: '24px', fontSize: '10px', padding: '0 8px' }}
                                  >
                                    <Download className="h-3 w-3 ml-1" />
                                    تحميل
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      console.log('معاينة:', drawing.name);
                                      alert(`معاينة: ${drawing.name}`);
                                    }}
                                    style={{ background: '#10b981', color: '#fff', height: '24px', fontSize: '10px', padding: '0 8px' }}
                                  >
                                    <Eye className="h-3 w-3 ml-1" />
                                    معاينة
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

                {/* معلومات إضافية */}
                <Card className="card-rtl bg-blue-50">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                        <strong>ملاحظة:</strong> جميع المخططات المعروضة هنا معتمدة ونهائية. يمكنك طباعتها أو تحميلها مباشرة. 
                        للمزيد من التفاصيل، راجع شاشة إدارة المعاملات (284).
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowTransactionDrawings(false);
                setSelectedTransaction(null);
              }}>
                <X className="h-4 w-4 ml-1" />
                إغلاق
              </Button>
              <Button 
                onClick={() => {
                  setShowTransactionDrawings(false);
                  setShowFinalDrawingsDialog(true);
                }}
                style={{ background: '#6b7280', color: '#fff' }}
              >
                <ArrowRight className="h-4 w-4 ml-1" />
                رجوع للبحث
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* نافذة التحقق من وثائق الملكية (موجودة سابقاً) */}
        <Dialog open={showOwnershipCheck} onOpenChange={setShowOwnershipCheck}>
          <DialogContent className="max-w-2xl" style={{ direction: 'rtl' }}>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <FileText className="h-5 w-5 inline ml-2 text-cyan-600" />
                التحقق السريع من وثائق الملكية
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Card className="card-rtl bg-cyan-50">
                <CardContent className="p-3">
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#0e7490' }}>
                    <strong>خدمة التحقق السريع:</strong> يمكنك التحقق من حالة وثيقة الملكية باستخدام رقم الطلب أو رقم المعاملة مع السنة
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <InputWithCopy
                  label="رقم الطلب *"
                  id="request-number"
                  placeholder="مثال: 12345"
                  copyable={false}
                  clearable={true}
                />
                
                <InputWithCopy
                  label="السنة *"
                  id="request-year"
                  placeholder="مثال: 2025"
                  copyable={false}
                  clearable={true}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>أو</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InputWithCopy
                  label="رقم المعاملة *"
                  id="transaction-number"
                  placeholder="مثال: 2025001"
                  copyable={false}
                  clearable={true}
                />
                
                <InputWithCopy
                  label="السنة *"
                  id="transaction-year"
                  placeholder="مثال: 2025"
                  copyable={false}
                  clearable={true}
                />
              </div>

              <Card className="card-rtl bg-blue-50">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                      <strong>ملاحظة:</strong> يجب إدخال رقم الطلب + السنة، أو رقم المعاملة + السنة. إذا تم إدخال كليهما، سيتم البحث برقم الطلب أولاً.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOwnershipCheck(false)}>
                <X className="h-4 w-4 ml-1" />
                إلغاء
              </Button>
              <Button style={{ background: '#06b6d4', color: '#fff' }}>
                <Search className="h-4 w-4 ml-1" />
                بحث والتحقق
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* نافذة التحقق من حالة الطلبات (موجودة سابقاً) */}
        <Dialog open={showRequestStatus} onOpenChange={setShowRequestStatus}>
          <DialogContent className="max-w-2xl" style={{ direction: 'rtl' }}>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Search className="h-5 w-5 inline ml-2 text-pink-600" />
                التحقق من حالة الطلبات
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Card className="card-rtl bg-pink-50">
                <CardContent className="p-3">
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#9f1239' }}>
                    <strong>خدمة التحقق السريع:</strong> تتبع حالة طلبك أو معاملتك في أي وقت باستخدام الرقم والسنة
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <InputWithCopy
                  label="رقم الطلب *"
                  id="status-request-number"
                  placeholder="مثال: 54321"
                  copyable={false}
                  clearable={true}
                />
                
                <InputWithCopy
                  label="السنة *"
                  id="status-request-year"
                  placeholder="مثال: 2025"
                  copyable={false}
                  clearable={true}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>أو</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InputWithCopy
                  label="رقم المعاملة *"
                  id="status-transaction-number"
                  placeholder="مثال: 2025015"
                  copyable={false}
                  clearable={true}
                />
                
                <InputWithCopy
                  label="السنة *"
                  id="status-transaction-year"
                  placeholder="مثال: 2025"
                  copyable={false}
                  clearable={true}
                />
              </div>

              <Card className="card-rtl bg-purple-50">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b21a8' }}>
                      <strong>معلومة:</strong> يمكنك متابعة جميع مراحل المعاملة: قيد المعالجة، في الانتظار، مكتملة، أو أي حالة أخرى.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRequestStatus(false)}>
                <X className="h-4 w-4 ml-1" />
                إلغاء
              </Button>
              <Button style={{ background: '#ec4899', color: '#fff' }}>
                <Search className="h-4 w-4 ml-1" />
                بحث عن الحالة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* نافذة الروابط السريعة */}
        <QuickLinksManager 
          open={showQuickLinks} 
          onOpenChange={setShowQuickLinks} 
        />

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { 
              label: 'الشاشات النشطة', 
              value: stats.activeScreens, 
              icon: LayoutGrid, 
              color: '#2563eb',
              onClick: () => setShowActiveScreensDialog(true)
            },
            { 
              label: 'المهام المعلقة', 
              value: stats.totalTasks, 
              icon: CheckCircle, 
              color: '#f59e0b',
              onClick: () => setShowPendingTasksDialog(true)
            },
            { 
              label: 'الإشعارات', 
              value: stats.totalNotifications, 
              icon: Bell, 
              color: '#ef4444',
              onClick: () => setShowNotificationsDialog(true)
            },
            { 
              label: 'النشاط اليومي', 
              value: '95%', 
              icon: Activity, 
              color: '#10b981',
              onClick: () => setShowDailyActivityDialog(true)
            }
          ].map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <Card 
                key={i} 
                className="card-rtl hover:shadow-lg transition-all cursor-pointer"
                onClick={stat.onClick}
                style={{
                  border: '2px solid transparent',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                }}
              >
                <CardContent className="p-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-600 mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {stat.label}
                      </p>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: stat.color, fontSize: '16px' }}>
                        {stat.value}
                      </p>
                    </div>
                    <div style={{ color: stat.color }}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Toolbar */}
        <Card className="card-rtl">
          <CardContent className="p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ابحث عن شاشة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                  style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'right', direction: 'rtl' }}
                />
              </div>

              <div className="flex items-center gap-2">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[160px]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <SelectValue placeholder="جميع الفئات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    <SelectItem value="transactions">المعاملات</SelectItem>
                    <SelectItem value="management">الإدارة</SelectItem>
                    <SelectItem value="reports">التقارير</SelectItem>
                    <SelectItem value="settings">الإعدادات</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <Button
                    size="sm"
                    variant={viewMode === 'grid-detailed' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('grid-detailed')}
                    className="h-7 px-2"
                  >
                    <Grid3x3 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'grid-compact' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('grid-compact')}
                    className="h-7 px-2"
                  >
                    <Grid2x2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('list')}
                    className="h-7 px-2"
                  >
                    <List className="h-3 w-3" />
                  </Button>
                </div>

                <Button 
                  onClick={handleCustomizeScreens}
                  variant="outline"
                  size="sm"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Settings className="h-4 w-4 ml-1" />
                  تخصيص
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Screens Grid */}
        <div className={
          viewMode === 'grid-detailed' ? 'grid grid-cols-3 gap-3' :
          viewMode === 'grid-compact' ? 'grid grid-cols-4 gap-2' :
          'space-y-2'
        }>
          {filteredScreens.map((screen) => {
            const Icon = screen.icon;
            
            if (viewMode === 'list') {
              return (
                <Card 
                  key={screen.id} 
                  className="card-rtl hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleScreenClick(screen.route)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${screen.bgGradient}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600', fontSize: '14px' }}>
                          {screen.title}
                        </h3>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {screen.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {screen.notifications && screen.notifications > 0 && (
                          <Badge className="bg-red-500">
                            {screen.notifications}
                          </Badge>
                        )}
                        {screen.tasks && screen.tasks > 0 && (
                          <Badge className="bg-orange-500">
                            {screen.tasks}
                          </Badge>
                        )}
                        <Badge variant="outline">{screen.screenNumber}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }

            return (
              <Card 
                key={screen.id} 
                className="card-rtl hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleScreenClick(screen.route)}
              >
                <CardContent className={viewMode === 'grid-compact' ? 'p-3' : 'p-4'}>
                  <div className="flex flex-col items-center text-center">
                    <div className={`${viewMode === 'grid-compact' ? 'w-12 h-12' : 'w-16 h-16'} rounded-xl flex items-center justify-center bg-gradient-to-br ${screen.bgGradient} mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className={`${viewMode === 'grid-compact' ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
                    </div>
                    <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600', fontSize: viewMode === 'grid-compact' ? '13px' : '15px' }}>
                      {screen.title}
                    </h3>
                    {viewMode === 'grid-detailed' && (
                      <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {screen.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {screen.notifications && screen.notifications > 0 && (
                        <Badge className="bg-red-500 text-xs">
                          {screen.notifications} <Bell className="h-3 w-3 mr-1" />
                        </Badge>
                      )}
                      {screen.tasks && screen.tasks > 0 && (
                        <Badge className="bg-orange-500 text-xs">
                          {screen.tasks} <CheckCircle className="h-3 w-3 mr-1" />
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {screen.screenNumber}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Customize Dialog */}
        <Dialog open={showCustomizeDialog} onOpenChange={setShowCustomizeDialog}>
          <DialogContent className="max-w-4xl" style={{ direction: 'rtl' }}>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تخصيص الشاشات
              </DialogTitle>
              <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                اختر الشاشات التي تريد عرضها في الصفحة الرئيسية
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_SCREENS.map((screen) => {
                  const Icon = screen.icon;
                  const isSelected = selectedScreens.includes(screen.id);
                  
                  return (
                    <Card
                      key={screen.id}
                      className={`card-rtl cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleToggleScreen(screen.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${screen.bgGradient}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600', fontSize: '13px' }}>
                              {screen.title}
                            </h3>
                            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {screen.description}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={handleResetToDefault}>
                <RefreshCw className="h-4 w-4 ml-1" />
                إعادة تعيين
              </Button>
              <Button variant="outline" onClick={() => setShowCustomizeDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleApplyCustomization} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 ml-1 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 ml-1" />
                    حفظ
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HomePage_Complete_001;
