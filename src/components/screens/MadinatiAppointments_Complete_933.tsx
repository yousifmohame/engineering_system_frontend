/**
 * الشاشة 933 - مواعيد مدينتي
 * ========================================================
 * 
 * نظام شامل لإدارة المواعيد في مراكز مدينتي
 * 
 * المميزات:
 * ✅ إدارة مواعيد المراكز
 * ✅ ربط بالمعاملات والموظفين
 * ✅ تتبع الأهداف والنتائج
 * ✅ رفع الملفات وإرسال التفاصيل
 * ✅ خريطة تفاعلية للمراكز
 * ✅ نظام المواعيد المترابطة
 * ✅ إدارة شاملة لخدمات المراكز
 * 
 * @version 1.2
 * @date 30 أكتوبر 2025
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { Checkbox } from '../ui/checkbox';
import {
  MapPin, Calendar, Plus, Eye, Edit, Download, Settings, TrendingUp,
  Clock, CheckCircle, XCircle, AlertCircle, Users, Building2, FileText,
  Send, Paperclip, Link2, ChevronLeft, Map, Navigation, Phone, Mail,
  User, Briefcase, Target, ListChecks, Files, Share2, X, Save,
  CalendarClock, CalendarCheck, CalendarX, Filter, Search, RefreshCw,
  Trash2, CheckSquare
} from 'lucide-react';

// ============================================================
// تكوين التابات
// ============================================================

const TABS_CONFIG: TabConfig[] = [
  { id: '933-01', number: '933-01', title: 'نظرة عامة', icon: TrendingUp },
  { id: '933-02', number: '933-02', title: 'قائمة المواعيد', icon: Calendar },
  { id: '933-03', number: '933-03', title: 'إضافة موعد', icon: Plus },
  { id: '933-04', number: '933-04', title: 'مراكز مدينتي', icon: Building2 },
  { id: '933-05', number: '933-05', title: 'المتابعة', icon: Clock },
  { id: '933-06', number: '933-06', title: 'التقارير', icon: Download },
  { id: '933-07', number: '933-07', title: 'الإعدادات', icon: Settings },
];

// ============================================================
// أنواع البيانات
// ============================================================

interface MadinatiCenter {
  id: string;
  name: string;
  code: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  workingHours: string;
  phone: string;
  email: string;
  services: string[];
  isActive: boolean;
}

interface Appointment {
  id: string;
  code: string;
  centerId: string;
  centerName: string;
  date: string;
  time: string;
  assignedTo: 'employee' | 'agent';
  employeeId?: string;
  employeeName?: string;
  agentId?: string;
  agentName?: string;
  transactionId?: string;
  transactionType: 'full' | 'simple';
  transactionNumber?: string;
  objective: string;
  required: string;
  result?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  isExecuted: boolean;
  hasRelatedAppointments: boolean;
  relatedAppointments: string[];
  attachments: {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
  }[];
  createdBy: string;
  createdDate: string;
  notes?: string;
}

// ============================================================
// بيانات تجريبية - مراكز مدينتي
// ============================================================

const MADINATI_CENTERS: MadinatiCenter[] = [
  {
    id: 'CTR-001',
    name: 'مكتب مدينتي - الخليج',
    code: 'MDT-KH-01',
    address: 'حي الخليج، الرياض',
    location: { lat: 24.7136, lng: 46.6753 },
    workingHours: '8:00 ص - 4:00 م',
    phone: '0112345001',
    email: 'alkhalij@madinati.gov.sa',
    services: ['استخراج رخص البناء', 'تراخيص الهدم', 'شهادات الإنجاز', 'استعلامات عامة'],
    isActive: true
  },
  {
    id: 'CTR-002',
    name: 'مكتب مدينتي - قرطبة',
    code: 'MDT-QR-02',
    address: 'حي قرطبة، الرياض',
    location: { lat: 24.6478, lng: 46.7152 },
    workingHours: '8:00 ص - 4:00 م',
    phone: '0112345002',
    email: 'qurtoba@madinati.gov.sa',
    services: ['استخراج رخص البناء', 'تراخيص التعديل', 'شهادات الإنجاز'],
    isActive: true
  },
  {
    id: 'CTR-003',
    name: 'مكتب مدينتي - العقيق',
    code: 'MDT-AQ-03',
    address: 'حي العقيق، الرياض',
    location: { lat: 24.7305, lng: 46.7836 },
    workingHours: '8:00 ص - 4:00 م',
    phone: '0112345003',
    email: 'alaqiq@madinati.gov.sa',
    services: ['استخراج رخص البناء', 'شهادات الإنجاز', 'استعلامات فنية'],
    isActive: true
  },
  {
    id: 'CTR-004',
    name: 'مكتب مدينتي - النفل',
    code: 'MDT-NF-04',
    address: 'حي النفل، الرياض',
    location: { lat: 24.6877, lng: 46.6219 },
    workingHours: '8:00 ص - 4:00 م',
    phone: '0112345004',
    email: 'alnafl@madinati.gov.sa',
    services: ['استخراج رخص البناء', 'تراخيص الإضافة', 'شهادات الإنجاز'],
    isActive: true
  },
  {
    id: 'CTR-005',
    name: 'مكتب مدينتي - المغرزات',
    code: 'MDT-MG-05',
    address: 'حي المغرزات، الرياض',
    location: { lat: 24.6408, lng: 46.7156 },
    workingHours: '8:00 ص - 4:00 م',
    phone: '0112345005',
    email: 'almaghrazat@madinati.gov.sa',
    services: ['استخراج رخص البناء', 'تراخيص التعديل', 'شهادات الإنجاز'],
    isActive: true
  },
  {
    id: 'CTR-006',
    name: 'مكتب مدينتي - المعذر',
    code: 'MDT-MZ-06',
    address: 'حي الناصرية، الرياض',
    location: { lat: 24.7521, lng: 46.6894 },
    workingHours: '8:00 ص - 4:00 م',
    phone: '0112345006',
    email: 'almoathar@madinati.gov.sa',
    services: ['استخراج رخص البناء', 'شهادات الإنجاز', 'استعلامات عامة'],
    isActive: true
  },
  {
    id: 'CTR-007',
    name: 'مكتب مدينتي - المنصورة',
    code: 'MDT-MN-07',
    address: 'حي المنصورة، الرياض',
    location: { lat: 24.6712, lng: 46.7489 },
    workingHours: '8:00 ص - 4:00 م',
    phone: '0112345007',
    email: 'almansoura@madinati.gov.sa',
    services: ['استخراج رخص البناء', 'تراخيص الهدم', 'شهادات الإنجاز'],
    isActive: true
  },
  {
    id: 'CTR-008',
    name: 'مكتب مدينتي - ظهرة لبن',
    code: 'MDT-ZL-08',
    address: 'حي ظهرة لبن، الرياض',
    location: { lat: 24.6156, lng: 46.7832 },
    workingHours: '8:00 ص - 4:00 م',
    phone: '0112345008',
    email: 'dhahrat.laban@madinati.gov.sa',
    services: ['استخراج رخص البناء', 'تراخيص الإضافة', 'شهادات الإنجاز'],
    isActive: true
  },
  {
    id: 'CTR-009',
    name: 'مكتب مدينتي - طويق',
    code: 'MDT-TW-09',
    address: 'حي العريجاء، الرياض',
    location: { lat: 24.7894, lng: 46.6127 },
    workingHours: '8:00 ص - 4:00 م',
    phone: '0112345009',
    email: 'tuwaiq@madinati.gov.sa',
    services: ['استخراج رخص البناء', 'شهادات الإنجاز', 'استعلامات فنية'],
    isActive: true
  },
  {
    id: 'CTR-010',
    name: 'مكتب مدينتي - السلام',
    code: 'MDT-SL-10',
    address: 'حي السلام، الرياض',
    location: { lat: 24.6345, lng: 46.6521 },
    workingHours: '8:00 ص - 4:00 م',
    phone: '0112345010',
    email: 'alsalam@madinati.gov.sa',
    services: ['استخراج رخص البناء', 'تراخيص التعديل', 'شهادات الإنجاز'],
    isActive: true
  },
  {
    id: 'CTR-011',
    name: 'مكتب مدينتي - عكاظ',
    code: 'MDT-OK-11',
    address: 'حي عكاظ، الرياض',
    location: { lat: 24.7623, lng: 46.7214 },
    workingHours: '8:00 ص - 4:00 م',
    phone: '0112345011',
    email: 'okaz@madinati.gov.sa',
    services: ['استخراج رخص البناء', 'تراخيص الهدم', 'شهادات الإنجاز'],
    isActive: true
  },
  {
    id: 'CTR-012',
    name: 'مكتب مدينتي - الحائر',
    code: 'MDT-HA-12',
    address: 'حي الحائر، الرياض',
    location: { lat: 24.5234, lng: 46.7412 },
    workingHours: '8:00 ص - 4:00 م',
    phone: '0112345012',
    email: 'alhair@madinati.gov.sa',
    services: ['استخراج رخص البناء', 'شهادات الإنجاز', 'استعلامات عامة'],
    isActive: true
  }
];

// ============================================================
// بيانات تجريبية - المواعيد
// ============================================================

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-001',
    code: 'MDT-2501-001',
    centerId: 'CTR-001',
    centerName: 'مكتب مدينتي - الخليج',
    date: '2025-01-15',
    time: '10:00 ص',
    assignedTo: 'employee',
    employeeId: 'EMP-001',
    employeeName: 'أحمد محمد العلي',
    transactionId: 'TXN-2501001',
    transactionType: 'full',
    transactionNumber: '2501001',
    objective: 'استلام رخصة بناء معتمدة',
    required: 'أصل الصك + نسخة من المخططات + إيصال السداد',
    result: 'تم استلام الرخصة بنجاح، الرقم: 12345',
    status: 'completed',
    isExecuted: true,
    hasRelatedAppointments: true,
    relatedAppointments: ['APT-005'],
    attachments: [
      { id: 'ATT-001', name: 'رخصة_البناء.pdf', type: 'PDF', size: '2.5 MB', uploadDate: '2025-01-15' },
      { id: 'ATT-002', name: 'المخططات.pdf', type: 'PDF', size: '5.8 MB', uploadDate: '2025-01-15' }
    ],
    createdBy: 'محمد خالد السعيد',
    createdDate: '2025-01-10',
    notes: 'موعد مهم - معاملة VIP'
  },
  {
    id: 'APT-002',
    code: 'MDT-2501-002',
    centerId: 'CTR-002',
    centerName: 'مكتب مدينتي - قرطبة',
    date: '2025-01-20',
    time: '11:30 ص',
    assignedTo: 'agent',
    agentId: 'AGT-001',
    agentName: 'خالد عبدالله الشمري',
    transactionId: 'TXN-2501005',
    transactionType: 'full',
    transactionNumber: '2501005',
    objective: 'تقديم طلب ترخيص تعديل',
    required: 'مخططات التعديل + تقرير المكتب الهندسي',
    status: 'scheduled',
    isExecuted: false,
    hasRelatedAppointments: false,
    relatedAppointments: [],
    attachments: [],
    createdBy: 'سارة أحمد القحطاني',
    createdDate: '2025-01-12'
  },
  {
    id: 'APT-003',
    code: 'MDT-2501-003',
    centerId: 'CTR-003',
    centerName: 'مكتب مدينتي - العقيق',
    date: '2025-01-18',
    time: '09:00 ص',
    assignedTo: 'employee',
    employeeId: 'EMP-002',
    employeeName: 'فهد سعد الدوسري',
    transactionId: 'TXN-2501012',
    transactionType: 'simple',
    transactionNumber: '2501012',
    objective: 'استعلام عن حالة طلب',
    required: 'رقم الطلب + الهوية الوطنية',
    result: 'الطلب قيد المراجعة، سيتم الرد خلال 3 أيام',
    status: 'completed',
    isExecuted: true,
    hasRelatedAppointments: false,
    relatedAppointments: [],
    attachments: [],
    createdBy: 'نورة سليمان المطيري',
    createdDate: '2025-01-15',
    notes: 'استعلام سريع'
  },
  {
    id: 'APT-004',
    code: 'MDT-2501-004',
    centerId: 'CTR-004',
    centerName: 'مكتب مدينتي - النفل',
    date: '2025-01-17',
    time: '02:00 م',
    assignedTo: 'agent',
    agentId: 'AGT-002',
    agentName: 'عبدالرحمن فيصل العتيبي',
    transactionType: 'simple',
    objective: 'تقديم شكوى',
    required: 'تفاصيل الشكوى + الوثائق الداعمة',
    status: 'cancelled',
    isExecuted: false,
    hasRelatedAppointments: false,
    relatedAppointments: [],
    attachments: [],
    createdBy: 'منى راشد الحربي',
    createdDate: '2025-01-14',
    notes: 'تم الإلغاء بطلب من المعقب'
  },
  {
    id: 'APT-005',
    code: 'MDT-2501-005',
    centerId: 'CTR-001',
    centerName: 'مكتب مدينتي - الخليج',
    date: '2025-01-22',
    time: '10:30 ص',
    assignedTo: 'employee',
    employeeId: 'EMP-001',
    employeeName: 'أحمد محمد العلي',
    transactionId: 'TXN-2501001',
    transactionType: 'full',
    transactionNumber: '2501001',
    objective: 'استلام شهادة الإنجاز',
    required: 'رخصة البناء الأصلية + تقرير المهندس المشرف',
    status: 'scheduled',
    isExecuted: false,
    hasRelatedAppointments: false,
    relatedAppointments: [],
    attachments: [],
    createdBy: 'محمد خالد السعيد',
    createdDate: '2025-01-16',
    notes: 'موعد متابعة للموعد APT-001'
  },
  {
    id: 'APT-006',
    code: 'MDT-2501-006',
    centerId: 'CTR-005',
    centerName: 'مكتب مدينتي - المغرزات',
    date: '2025-01-16',
    time: '01:00 م',
    assignedTo: 'employee',
    employeeId: 'EMP-003',
    employeeName: 'سعيد ناصر الغامدي',
    transactionId: 'TXN-2501020',
    transactionType: 'full',
    transactionNumber: '2501020',
    objective: 'استشارة فنية حول المخططات',
    required: 'المخططات الحالية',
    status: 'no-show',
    isExecuted: false,
    hasRelatedAppointments: false,
    relatedAppointments: [],
    attachments: [
      { id: 'ATT-003', name: 'مخططات_أولية.pdf', type: 'PDF', size: '4.2 MB', uploadDate: '2025-01-14' }
    ],
    createdBy: 'ريم عبدالعزيز الراجحي',
    createdDate: '2025-01-11',
    notes: 'الموظف لم يحضر'
  }
];

// ============================================================
// المكون الرئيسي
// ============================================================

const MadinatiAppointments_Complete_933: React.FC = () => {
  const [activeTab, setActiveTab] = useState('933-01');
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [showCenterDialog, setShowCenterDialog] = useState(false);
  const [showSendDetailsDialog, setShowSendDetailsDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<MadinatiCenter | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCenter, setFilterCenter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // حقول إضافة موعد جديد
  const [newAppointment, setNewAppointment] = useState({
    centerId: '',
    date: '',
    time: '',
    assignedTo: 'employee' as 'employee' | 'agent',
    employeeId: '',
    agentId: '',
    transactionType: 'full' as 'full' | 'simple',
    transactionId: '',
    objective: '',
    required: '',
    notes: ''
  });

  // حقول إرسال التفاصيل
  const [sendDetails, setSendDetails] = useState({
    includeObjective: true,
    includeRequired: true,
    includeResult: true,
    includeAttachments: true,
    includeNotes: true,
    includeCenterInfo: true,
    includeTransactionInfo: true,
    additionalMessage: ''
  });

  // ============================================================
  // إدارة خدمات المراكز - الإصدار v1.2
  // ============================================================
  
  // قائمة الخدمات المتاحة (يمكن تعديلها)
  const [availableServices, setAvailableServices] = useState<string[]>([
    'استخراج رخص البناء',
    'تراخيص الهدم',
    'تراخيص التعديل',
    'تراخيص الإضافة',
    'شهادات الإنجاز',
    'شهادات الإشغال',
    'استعلامات عامة',
    'استعلامات فنية',
    'استشارات هندسية',
    'مراجعة المخططات',
    'فسح البناء',
    'تعديل الرخص'
  ]);

  // خدمات كل مركز (مصفوفة من الخدمات لكل مركز)
  const [centerServices, setCenterServices] = useState<Record<string, string[]>>({});

  // نافذة إضافة خدمة جديدة
  const [showAddServiceDialog, setShowAddServiceDialog] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [serviceToEdit, setServiceToEdit] = useState<string | null>(null);

  // تحميل الخدمات من localStorage عند البدء
  useEffect(() => {
    const savedServices = localStorage.getItem('madinati_available_services');
    const savedCenterServices = localStorage.getItem('madinati_center_services');
    
    if (savedServices) {
      setAvailableServices(JSON.parse(savedServices));
    }
    
    if (savedCenterServices) {
      setCenterServices(JSON.parse(savedCenterServices));
    } else {
      // تهيئة خدمات المراكز من البيانات الأساسية
      const initialServices: Record<string, string[]> = {};
      MADINATI_CENTERS.forEach(center => {
        initialServices[center.id] = center.services;
      });
      setCenterServices(initialServices);
    }
  }, []);

  // حفظ الخدمات في localStorage
  const saveServicesToLocalStorage = () => {
    localStorage.setItem('madinati_available_services', JSON.stringify(availableServices));
    localStorage.setItem('madinati_center_services', JSON.stringify(centerServices));
  };

  // إضافة خدمة جديدة
  const handleAddService = () => {
    if (newServiceName.trim()) {
      setAvailableServices([...availableServices, newServiceName.trim()]);
      setNewServiceName('');
      setShowAddServiceDialog(false);
    }
  };

  // تعديل اسم خدمة
  const handleEditService = (oldName: string, newName: string) => {
    const updatedServices = availableServices.map(s => s === oldName ? newName : s);
    setAvailableServices(updatedServices);
    
    // تحديث الخدمات في المراكز
    const updatedCenterServices = { ...centerServices };
    Object.keys(updatedCenterServices).forEach(centerId => {
      updatedCenterServices[centerId] = updatedCenterServices[centerId].map(s => 
        s === oldName ? newName : s
      );
    });
    setCenterServices(updatedCenterServices);
    setServiceToEdit(null);
  };

  // حذف خدمة
  const handleDeleteService = (serviceName: string) => {
    if (confirm(`هل أنت متأكد من حذف خدمة "${serviceName}"؟`)) {
      setAvailableServices(availableServices.filter(s => s !== serviceName));
      
      // إزالة الخدمة من جميع المراكز
      const updatedCenterServices = { ...centerServices };
      Object.keys(updatedCenterServices).forEach(centerId => {
        updatedCenterServices[centerId] = updatedCenterServices[centerId].filter(s => 
          s !== serviceName
        );
      });
      setCenterServices(updatedCenterServices);
    }
  };

  // تبديل خدمة لمركز محدد
  const toggleServiceForCenter = (centerId: string, serviceName: string) => {
    const currentServices = centerServices[centerId] || [];
    const updated = currentServices.includes(serviceName)
      ? currentServices.filter(s => s !== serviceName)
      : [...currentServices, serviceName];
    
    setCenterServices({
      ...centerServices,
      [centerId]: updated
    });
  };

  // تحديد/إلغاء تحديد خدمة لجميع المراكز
  const toggleServiceForAllCenters = (serviceName: string) => {
    const allHaveService = MADINATI_CENTERS.every(center => 
      (centerServices[center.id] || []).includes(serviceName)
    );
    
    const updated = { ...centerServices };
    MADINATI_CENTERS.forEach(center => {
      const currentServices = updated[center.id] || [];
      if (allHaveService) {
        // إزالة من الجميع
        updated[center.id] = currentServices.filter(s => s !== serviceName);
      } else {
        // إضافة للجميع
        if (!currentServices.includes(serviceName)) {
          updated[center.id] = [...currentServices, serviceName];
        }
      }
    });
    
    setCenterServices(updated);
  };

  // التحقق من وجود خدمة في مركز
  const hasService = (centerId: string, serviceName: string) => {
    return (centerServices[centerId] || []).includes(serviceName);
  };

  // التحقق من وجود خدمة في جميع المراكز
  const allCentersHaveService = (serviceName: string) => {
    return MADINATI_CENTERS.every(center => hasService(center.id, serviceName));
  };

  // إحصائيات الخدمات
  const serviceStatistics = useMemo(() => {
    const stats: Record<string, number> = {};
    availableServices.forEach(service => {
      stats[service] = MADINATI_CENTERS.filter(center => 
        hasService(center.id, service)
      ).length;
    });
    return stats;
  }, [availableServices, centerServices]);

  // الإحصائيات
  const statistics = useMemo(() => ({
    total: MOCK_APPOINTMENTS.length,
    scheduled: MOCK_APPOINTMENTS.filter(a => a.status === 'scheduled').length,
    completed: MOCK_APPOINTMENTS.filter(a => a.status === 'completed').length,
    cancelled: MOCK_APPOINTMENTS.filter(a => a.status === 'cancelled').length,
    noShow: MOCK_APPOINTMENTS.filter(a => a.status === 'no-show').length,
    withTransaction: MOCK_APPOINTMENTS.filter(a => a.transactionId).length,
    withRelated: MOCK_APPOINTMENTS.filter(a => a.hasRelatedAppointments).length,
    activeCenters: MADINATI_CENTERS.filter(c => c.isActive).length
  }), []);

  // تصفية المواعيد
  const filteredAppointments = useMemo(() => {
    return MOCK_APPOINTMENTS.filter(apt => {
      const statusMatch = filterStatus === 'all' || apt.status === filterStatus;
      const centerMatch = filterCenter === 'all' || apt.centerId === filterCenter;
      const searchMatch = searchTerm === '' ||
        apt.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.centerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.agentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.objective.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && centerMatch && searchMatch;
    });
  }, [filterStatus, filterCenter, searchTerm]);

  // معالجات الأحداث
  const handleViewAppointment = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowAppointmentDialog(true);
  };

  const handleViewCenter = (center: MadinatiCenter) => {
    setSelectedCenter(center);
    setShowCenterDialog(true);
  };

  const handleSendDetails = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowSendDetailsDialog(true);
  };

  const handleSaveAppointment = () => {
    // حفظ الموعد الجديد
    alert('تم حفظ الموعد بنجاح');
    setNewAppointment({
      centerId: '',
      date: '',
      time: '',
      assignedTo: 'employee',
      employeeId: '',
      agentId: '',
      transactionType: 'full',
      transactionId: '',
      objective: '',
      required: '',
      notes: ''
    });
  };

  const handleSendAppointmentDetails = () => {
    // إرسال تفاصيل الموعد
    alert(`تم إرسال تفاصيل الموعد ${selectedAppointment?.code} بنجاح`);
    setShowSendDetailsDialog(false);
  };

  // دوال العرض
  const renderTabContent = () => {
    switch (activeTab) {
      case '933-01': return renderTab01_Overview();
      case '933-02': return renderTab02_AppointmentsList();
      case '933-03': return renderTab03_AddAppointment();
      case '933-04': return renderTab04_Centers();
      case '933-05': return renderTab05_FollowUp();
      case '933-06': return renderTab06_Reports();
      case '933-07': return renderTab07_Settings();
      default: return <div className="p-6">التاب قيد التطوير</div>;
    }
  };

  // ============================================================
  // التاب 933-01: نظرة عامة
  // ============================================================

  const renderTab01_Overview = () => (
    <div className="space-y-4">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-8 gap-3">
        {[
          { label: 'إجمالي المواعيد', value: statistics.total, icon: Calendar, color: '#3b82f6' },
          { label: 'مجدولة', value: statistics.scheduled, icon: CalendarClock, color: '#f59e0b' },
          { label: 'مكتملة', value: statistics.completed, icon: CalendarCheck, color: '#10b981' },
          { label: 'ملغاة', value: statistics.cancelled, icon: CalendarX, color: '#ef4444' },
          { label: 'عدم حضور', value: statistics.noShow, icon: XCircle, color: '#6b7280' },
          { label: 'مع معاملات', value: statistics.withTransaction, icon: Link2, color: '#8b5cf6' },
          { label: 'مواعيد مرتبطة', value: statistics.withRelated, icon: Share2, color: '#ec4899' },
          { label: 'مراكز نشطة', value: statistics.activeCenters, icon: Building2, color: '#06b6d4' },
        ].map((stat) => (
          <Card key={stat.label} style={{ background: `${stat.color}15`, border: `2px solid ${stat.color}` }}>
            <CardContent className="p-3 text-center">
              <stat.icon className="h-5 w-5 mx-auto mb-1" style={{ color: stat.color }} />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* المواعيد القادمة */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>المواعيد القادمة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {MOCK_APPOINTMENTS.filter(a => a.status === 'scheduled').slice(0, 5).map(apt => (
              <Card key={apt.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleViewAppointment(apt)}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="font-bold text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{apt.code}</p>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{apt.centerName}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{apt.date}</p>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{apt.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 933-02: قائمة المواعيد
  // ============================================================

  const renderTab02_AppointmentsList = () => (
    <div className="space-y-4">
      {/* شريط التصفية */}
      <Card>
        <CardContent className="p-3">
          <div className="grid grid-cols-4 gap-2">
            <InputWithCopy
              label=""
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث..."
              copyable={false}
              clearable={true}
            />
            <SelectWithCopy
              label=""
              id="filterStatus"
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { value: 'all', label: 'جميع الحالات' },
                { value: 'scheduled', label: 'مجدولة' },
                { value: 'completed', label: 'مكتملة' },
                { value: 'cancelled', label: 'ملغاة' },
                { value: 'no-show', label: 'عدم حضور' }
              ]}
              copyable={false}
              clearable={true}
            />
            <SelectWithCopy
              label=""
              id="filterCenter"
              value={filterCenter}
              onChange={setFilterCenter}
              options={[
                { value: 'all', label: 'جميع المراكز' },
                ...MADINATI_CENTERS.map(c => ({ value: c.id, label: c.name }))
              ]}
              copyable={false}
              clearable={true}
            />
            <Button onClick={() => { setSearchTerm(''); setFilterStatus('all'); setFilterCenter('all'); }}>
              <RefreshCw className="h-4 w-4 ml-1" />
              إعادة تعيين
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* جدول المواعيد */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المركز</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ والوقت</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المكلف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الهدف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map(apt => (
                  <TableRow key={apt.id} className="hover:bg-gray-50">
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Badge>{apt.code}</Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {apt.centerName}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <div>
                        <p className="font-bold text-sm">{apt.date}</p>
                        <p className="text-xs text-gray-600">{apt.time}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <div>
                        <Badge variant="outline">
                          {apt.assignedTo === 'employee' ? 'موظف' : 'معقب'}
                        </Badge>
                        <p className="text-sm mt-1">{apt.employeeName || apt.agentName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {apt.transactionNumber ? (
                        <div>
                          <Badge style={{ background: '#8b5cf6' }}>{apt.transactionNumber}</Badge>
                          <p className="text-xs text-gray-600 mt-1">
                            {apt.transactionType === 'full' ? 'كاملة' : 'بسيطة'}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <p className="text-sm truncate max-w-[200px]">{apt.objective}</p>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Badge style={{
                        background: apt.status === 'completed' ? '#10b981' :
                          apt.status === 'scheduled' ? '#f59e0b' :
                            apt.status === 'cancelled' ? '#ef4444' : '#6b7280'
                      }}>
                        {apt.status === 'completed' ? 'مكتمل' :
                          apt.status === 'scheduled' ? 'مجدول' :
                            apt.status === 'cancelled' ? 'ملغي' : 'عدم حضور'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="outline" onClick={() => handleViewAppointment(apt)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSendDetails(apt)}>
                          <Send className="h-3 w-3" />
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

  // ============================================================
  // التاب 933-03: إضافة موعد
  // ============================================================

  const renderTab03_AddAppointment = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة موعد جديد</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* المركز */}
          <SelectWithCopy
            label="المركز *"
            id="centerId"
            value={newAppointment.centerId}
            onChange={(value) => setNewAppointment({ ...newAppointment, centerId: value })}
            options={MADINATI_CENTERS.map(c => ({ value: c.id, label: c.name }))}
            copyable={true}
            clearable={true}
          />

          {/* التاريخ */}
          <InputWithCopy
            label="التاريخ *"
            id="date"
            type="date"
            value={newAppointment.date}
            onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
            copyable={true}
            clearable={true}
          />

          {/* الوقت */}
          <InputWithCopy
            label="الوقت *"
            id="time"
            type="time"
            value={newAppointment.time}
            onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
            copyable={true}
            clearable={true}
          />

          {/* التكليف */}
          <SelectWithCopy
            label="تكليف إلى *"
            id="assignedTo"
            value={newAppointment.assignedTo}
            onChange={(value) => setNewAppointment({ ...newAppointment, assignedTo: value as 'employee' | 'agent' })}
            options={[
              { value: 'employee', label: 'موظف' },
              { value: 'agent', label: 'معقب' }
            ]}
            copyable={false}
            clearable={false}
          />

          {/* اختيار الموظف/المعقب */}
          {newAppointment.assignedTo === 'employee' ? (
            <SelectWithCopy
              label="الموظف *"
              id="employeeId"
              value={newAppointment.employeeId}
              onChange={(value) => setNewAppointment({ ...newAppointment, employeeId: value })}
              options={[
                { value: 'EMP-001', label: 'أحمد محمد العلي' },
                { value: 'EMP-002', label: 'فهد سعد الدوسري' },
                { value: 'EMP-003', label: 'سعيد ناصر الغامدي' }
              ]}
              copyable={true}
              clearable={true}
            />
          ) : (
            <SelectWithCopy
              label="المعقب *"
              id="agentId"
              value={newAppointment.agentId}
              onChange={(value) => setNewAppointment({ ...newAppointment, agentId: value })}
              options={[
                { value: 'AGT-001', label: 'خالد عبدالله الشمري' },
                { value: 'AGT-002', label: 'عبدالرحمن فيصل العتيبي' }
              ]}
              copyable={true}
              clearable={true}
            />
          )}

          {/* نوع المعاملة */}
          <SelectWithCopy
            label="نوع المعاملة"
            id="transactionType"
            value={newAppointment.transactionType}
            onChange={(value) => setNewAppointment({ ...newAppointment, transactionType: value as 'full' | 'simple' })}
            options={[
              { value: 'full', label: 'معاملة كاملة' },
              { value: 'simple', label: 'معاملة بسيطة' }
            ]}
            copyable={false}
            clearable={false}
          />

          {/* رقم المعاملة */}
          <InputWithCopy
            label="رقم المعاملة"
            id="transactionId"
            value={newAppointment.transactionId}
            onChange={(e) => setNewAppointment({ ...newAppointment, transactionId: e.target.value })}
            placeholder="اختياري"
            copyable={true}
            clearable={true}
          />

          {/* الهدف */}
          <div className="col-span-2">
            <TextAreaWithCopy
              label="الهدف من الموعد *"
              id="objective"
              value={newAppointment.objective}
              onChange={(e) => setNewAppointment({ ...newAppointment, objective: e.target.value })}
              rows={2}
              copyable={true}
              clearable={true}
            />
          </div>

          {/* المطلوب */}
          <div className="col-span-2">
            <TextAreaWithCopy
              label="المطلوب إحضاره *"
              id="required"
              value={newAppointment.required}
              onChange={(e) => setNewAppointment({ ...newAppointment, required: e.target.value })}
              rows={2}
              copyable={true}
              clearable={true}
            />
          </div>

          {/* ملاحظات */}
          <div className="col-span-2">
            <TextAreaWithCopy
              label="ملاحظات"
              id="notes"
              value={newAppointment.notes}
              onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
              rows={2}
              copyable={true}
              clearable={true}
            />
          </div>

          {/* أزرار الحفظ */}
          <div className="col-span-2 flex gap-2 justify-end">
            <Button onClick={handleSaveAppointment}>
              <Save className="h-4 w-4 ml-1" />
              حفظ الموعد
            </Button>
            <Button variant="outline" onClick={() => setNewAppointment({
              centerId: '',
              date: '',
              time: '',
              assignedTo: 'employee',
              employeeId: '',
              agentId: '',
              transactionType: 'full',
              transactionId: '',
              objective: '',
              required: '',
              notes: ''
            })}>
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // ============================================================
  // التاب 933-04: مراكز مدينتي
  // ============================================================

  const renderTab04_Centers = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {MADINATI_CENTERS.map(center => (
          <Card
            key={center.id}
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => handleViewCenter(center)}
            style={{
              border: `3px solid ${center.isActive ? '#10b981' : '#6b7280'}`,
              background: `linear-gradient(135deg, ${center.isActive ? '#d1fae5' : '#e5e7eb'} 0%, ${center.isActive ? '#f0fdf4' : '#f3f4f6'} 100%)`
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div style={{
                  padding: '12px',
                  background: `linear-gradient(135deg, ${center.isActive ? '#10b981' : '#6b7280'} 0%, ${center.isActive ? '#059669' : '#4b5563'} 100%)`,
                  borderRadius: '12px'
                }}>
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{center.name}</h3>
                    <Badge style={{ background: center.isActive ? '#10b981' : '#6b7280' }}>
                      {center.code}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {center.address}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      {center.workingHours}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      {center.phone}
                    </div>
                  </div>
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {center.services.slice(0, 2).map((service, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {center.services.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{center.services.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ============================================================
  // التاب 933-05: المتابعة
  // ============================================================

  const renderTab05_FollowUp = () => (
    <div className="space-y-4">
      {/* إحصائيات المتابعة */}
      <div className="grid grid-cols-6 gap-3">
        {[
          { label: 'تحتاج متابعة', value: MOCK_APPOINTMENTS.filter(a => a.status === 'scheduled').length, icon: Clock, color: '#f59e0b' },
          { label: 'تم التنفيذ', value: MOCK_APPOINTMENTS.filter(a => a.isExecuted).length, icon: CheckCircle, color: '#10b981' },
          { label: 'لم ينفذ', value: MOCK_APPOINTMENTS.filter(a => !a.isExecuted && a.status !== 'cancelled').length, icon: XCircle, color: '#ef4444' },
          { label: 'مع نتائج', value: MOCK_APPOINTMENTS.filter(a => a.result).length, icon: FileText, color: '#3b82f6' },
          { label: 'بدون نتائج', value: MOCK_APPOINTMENTS.filter(a => !a.result && a.status === 'completed').length, icon: AlertCircle, color: '#6b7280' },
          { label: 'عدم حضور', value: MOCK_APPOINTMENTS.filter(a => a.status === 'no-show').length, icon: XCircle, color: '#9ca3af' },
        ].map((stat) => (
          <Card key={stat.label} style={{ background: `${stat.color}15`, border: `2px solid ${stat.color}` }}>
            <CardContent className="p-3 text-center">
              <stat.icon className="h-5 w-5 mx-auto mb-1" style={{ color: stat.color }} />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* جدول المتابعة */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>جدول المتابعة</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسؤول</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الهدف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التنفيذ</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النتيجة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_APPOINTMENTS.map(apt => (
                  <TableRow key={apt.id} className="hover:bg-gray-50">
                    <TableCell className="text-right font-mono" style={{ fontFamily: 'Courier New, monospace' }}>{apt.code}</TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{apt.date}</TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {apt.employeeName || apt.agentName || '-'}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {apt.objective.substring(0, 30)}...
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge style={{
                        background: apt.status === 'completed' ? '#10b981' : 
                                   apt.status === 'scheduled' ? '#f59e0b' :
                                   apt.status === 'cancelled' ? '#6b7280' : '#ef4444'
                      }}>
                        {apt.status === 'completed' ? 'مكتمل' :
                         apt.status === 'scheduled' ? 'مجدول' :
                         apt.status === 'cancelled' ? 'ملغى' : 'عدم حضور'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge style={{ background: apt.isExecuted ? '#10b981' : '#ef4444' }}>
                        {apt.isExecuted ? 'نعم' : 'لا'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {apt.result ? (
                        <span className="text-green-600 text-xs">✓ يوجد</span>
                      ) : (
                        <span className="text-red-600 text-xs">✗ لا يوجد</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="outline" onClick={() => handleViewAppointment(apt)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        {!apt.isExecuted && apt.status === 'scheduled' && (
                          <Button size="sm" style={{ background: '#10b981' }}>
                            <CheckCircle className="h-3 w-3" />
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

  // ============================================================
  // التاب 933-06: التقارير
  // ============================================================

  const renderTab06_Reports = () => (
    <div className="space-y-4">
      {/* أنواع التقارير */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            title: 'تقرير المواعيد الشامل',
            description: 'تقرير تفصيلي بجميع المواعيد',
            icon: FileText,
            color: '#3b82f6',
            items: [
              'جميع المواعيد مع التفاصيل',
              'الحالات والنتائج',
              'المرفقات والملاحظات',
              'إحصائيات تفصيلية'
            ]
          },
          {
            title: 'تقرير الأداء',
            description: 'تقييم أداء الموظفين والمعقبين',
            icon: TrendingUp,
            color: '#10b981',
            items: [
              'عدد المواعيد المنفذة',
              'معدل النجاح',
              'متوسط وقت الإنجاز',
              'التقييم العام'
            ]
          },
          {
            title: 'تقرير المراكز',
            description: 'إحصائيات المراكز والخدمات',
            icon: Building2,
            color: '#f59e0b',
            items: [
              'توزيع المواعيد على المراكز',
              'الخدمات الأكثر طلباً',
              'أوقات الذروة',
              'معدلات الإنجاز'
            ]
          }
        ].map((report, idx) => (
          <Card key={idx} style={{ border: `2px solid ${report.color}`, background: `${report.color}08` }}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div style={{
                  padding: '10px',
                  background: `linear-gradient(135deg, ${report.color} 0%, ${report.color}dd 100%)`,
                  borderRadius: '10px'
                }}>
                  <report.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                    {report.title}
                  </CardTitle>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {report.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {report.items.map((item, i) => (
                  <li key={i} className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <CheckCircle className="h-3 w-3" style={{ color: report.color }} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex gap-2">
                <Button size="sm" style={{ background: report.color }}>
                  <Download className="h-3 w-3 ml-1" />
                  تحميل PDF
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-3 w-3 ml-1" />
                  معاينة
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* تقرير سريع */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير سريع - آخر 30 يوم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات المواعيد</h4>
              <div className="space-y-2">
                {[
                  { label: 'إجمالي المواعيد', value: MOCK_APPOINTMENTS.length },
                  { label: 'مكتملة', value: MOCK_APPOINTMENTS.filter(a => a.status === 'completed').length },
                  { label: 'مجدولة', value: MOCK_APPOINTMENTS.filter(a => a.status === 'scheduled').length },
                  { label: 'ملغاة', value: MOCK_APPOINTMENTS.filter(a => a.status === 'cancelled').length },
                  { label: 'عدم حضور', value: MOCK_APPOINTMENTS.filter(a => a.status === 'no-show').length },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</span>
                    <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>التنفيذ والنتائج</h4>
              <div className="space-y-2">
                {[
                  { label: 'تم التنفيذ', value: MOCK_APPOINTMENTS.filter(a => a.isExecuted).length },
                  { label: 'لم ينفذ', value: MOCK_APPOINTMENTS.filter(a => !a.isExecuted).length },
                  { label: 'مع نتائج', value: MOCK_APPOINTMENTS.filter(a => a.result).length },
                  { label: 'بدون نتائج', value: MOCK_APPOINTMENTS.filter(a => !a.result && a.status === 'completed').length },
                  { label: 'مع مرفقات', value: MOCK_APPOINTMENTS.filter(a => a.attachments.length > 0).length },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</span>
                    <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <Button>
              <Download className="h-4 w-4 ml-1" />
              تحميل التقرير الكامل
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 ml-1" />
              تحديث البيانات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 933-07: الإعدادات
  // ============================================================

  const renderTab07_Settings = () => (
    <div className="space-y-4">
      {/* إعدادات عامة */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الإعدادات العامة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <EnhancedSwitch
              id="auto-remind"
              label="التذكير التلقائي بالمواعيد"
              description="إرسال تذكير قبل الموعد بـ 24 ساعة"
              checked={true}
              variant="success"
            />
            <EnhancedSwitch
              id="require-result"
              label="إلزامية تسجيل النتيجة"
              description="يجب تسجيل نتيجة الموعد عند الإكمال"
              checked={true}
              variant="warning"
            />
            <EnhancedSwitch
              id="allow-agent"
              label="السماح بتكليف المعقبين"
              description="إمكانية تكليف المعقبين بالمواعيد"
              checked={true}
              variant="default"
            />
            <EnhancedSwitch
              id="show-map"
              label="عرض الخريطة التفاعلية"
              description="إظهار خريطة المراكز في الشاشة الرئيسية"
              checked={true}
              variant="default"
            />
          </div>
        </CardContent>
      </Card>

      {/* إدارة خدمات مراكز مدينتي - جديد v1.2 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إدارة خدمات مراكز مدينتي
            </CardTitle>
            <Button onClick={() => setShowAddServiceDialog(true)}>
              <Plus className="h-4 w-4 ml-1" />
              إضافة خدمة جديدة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
              <CardContent className="p-3 text-center">
                <div className="flex flex-col">
                  <ListChecks className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {availableServices.length}
                  </p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي الخدمات
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #6ee7b7' }}>
              <CardContent className="p-3 text-center">
                <div className="flex flex-col">
                  <Building2 className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {MADINATI_CENTERS.length}
                  </p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    عدد المراكز
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
              <CardContent className="p-3 text-center">
                <div className="flex flex-col">
                  <CheckSquare className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
                  <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {Object.values(centerServices).reduce((sum, services) => sum + services.length, 0)}
                  </p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    خدمات مفعّلة
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
              <CardContent className="p-3 text-center">
                <div className="flex flex-col">
                  <Target className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {Math.round((Object.values(centerServices).reduce((sum, services) => sum + services.length, 0) / 
                      (availableServices.length * MADINATI_CENTERS.length)) * 100) || 0}%
                  </p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    نسبة التغطية
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* جدول الخدمات والمراكز */}
          <div style={{ 
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <ScrollArea style={{ height: '500px' }}>
              <Table className="table-rtl">
                <TableHeader style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 10 }}>
                  <TableRow>
                    <TableHead className="text-right" style={{ 
                      fontFamily: 'Tajawal, sans-serif',
                      minWidth: '200px',
                      fontWeight: 700,
                      fontSize: '14px',
                      borderLeft: '2px solid #e5e7eb'
                    }}>
                      الخدمة
                    </TableHead>
                    <TableHead className="text-center" style={{ 
                      fontFamily: 'Tajawal, sans-serif',
                      width: '100px',
                      fontWeight: 700,
                      fontSize: '13px',
                      borderLeft: '2px solid #e5e7eb'
                    }}>
                      <div className="flex flex-col items-center gap-1">
                        <span>تحديد الكل</span>
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      </div>
                    </TableHead>
                    {MADINATI_CENTERS.map(center => (
                      <TableHead key={center.id} className="text-center" style={{ 
                        fontFamily: 'Tajawal, sans-serif',
                        minWidth: '100px',
                        fontWeight: 600,
                        fontSize: '11px',
                        borderLeft: '1px solid #e5e7eb'
                      }}>
                        <div className="flex flex-col items-center gap-1">
                          <span>{center.name.split('-')[1]?.trim()}</span>
                          <Badge variant="outline" style={{ fontSize: '9px' }}>
                            {(centerServices[center.id] || []).length}
                          </Badge>
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-center" style={{ 
                      fontFamily: 'Tajawal, sans-serif',
                      width: '120px',
                      fontWeight: 700,
                      fontSize: '13px'
                    }}>
                      الإجراءات
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableServices.map((service, index) => (
                    <TableRow key={index} style={{
                      background: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                    }}>
                      <TableCell className="text-right" style={{ 
                        fontFamily: 'Tajawal, sans-serif',
                        fontWeight: 600,
                        borderLeft: '2px solid #e5e7eb'
                      }}>
                        {serviceToEdit === service ? (
                          <InputWithCopy
                            id={`edit-service-${index}`}
                            value={service}
                            onChange={(e) => {
                              const newServices = [...availableServices];
                              newServices[index] = e.target.value;
                              setAvailableServices(newServices);
                            }}
                            copyable={false}
                            clearable={false}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <ListChecks className="h-4 w-4 text-blue-600" />
                            <span>{service}</span>
                            <Badge variant="outline" style={{ fontSize: '9px' }}>
                              {serviceStatistics[service]}/{MADINATI_CENTERS.length}
                            </Badge>
                          </div>
                        )}
                      </TableCell>
                      
                      {/* عمود تحديد الكل */}
                      <TableCell className="text-center" style={{ 
                        borderLeft: '2px solid #e5e7eb',
                        background: allCentersHaveService(service) ? '#dbeafe' : 'transparent'
                      }}>
                        <div className="flex justify-center">
                          <Checkbox
                            checked={allCentersHaveService(service)}
                            onCheckedChange={() => toggleServiceForAllCenters(service)}
                            style={{ transform: 'scale(1.2)' }}
                          />
                        </div>
                      </TableCell>
                      
                      {/* أعمدة المراكز */}
                      {MADINATI_CENTERS.map(center => (
                        <TableCell key={center.id} className="text-center" style={{ 
                          borderLeft: '1px solid #e5e7eb',
                          background: hasService(center.id, service) ? '#dcfce7' : 'transparent'
                        }}>
                          <div className="flex justify-center">
                            <Checkbox
                              checked={hasService(center.id, service)}
                              onCheckedChange={() => toggleServiceForCenter(center.id, service)}
                            />
                          </div>
                        </TableCell>
                      ))}
                      
                      {/* عمود الإجراءات */}
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          {serviceToEdit === service ? (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setServiceToEdit(null)}
                                style={{ padding: '4px 8px' }}
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setServiceToEdit(null);
                                  // استعادة القيمة الأصلية
                                }}
                                style={{ padding: '4px 8px' }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setServiceToEdit(service)}
                                style={{ padding: '4px 8px' }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeleteService(service)}
                                style={{ padding: '4px 8px', color: '#ef4444' }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* ملاحظات */}
          <div className="mt-4 p-3" style={{
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            border: '2px solid #93c5fd',
            borderRadius: '8px'
          }}>
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                  ملاحظات مهمة:
                </p>
                <ul className="text-xs space-y-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e3a8a' }}>
                  <li>• استخدم عمود "تحديد الكل" لتفعيل/إلغاء خدمة لجميع المراكز دفعة واحدة</li>
                  <li>• يمكنك إضافة خدمات جديدة أو تعديل الأسماء أو حذف خدمات غير مستخدمة</li>
                  <li>• التغييرات تُحفظ تلقائياً في localStorage</li>
                  <li>• الخلفية الخضراء تشير إلى تفعيل الخدمة، والبيضاء تشير إلى عدم التفعيل</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إعدادات التنبيهات */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات التنبيهات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <EnhancedSwitch
            id="notify-new"
            label="تنبيه عند إنشاء موعد جديد"
            description="إشعار فوري للمسؤول المكلف"
            checked={true}
            variant="success"
          />
          <EnhancedSwitch
            id="notify-complete"
            label="تنبيه عند إكمال موعد"
            description="إشعار لمنشئ الموعد عند الإكمال"
            checked={true}
            variant="success"
          />
          <EnhancedSwitch
            id="notify-cancel"
            label="تنبيه عند إلغاء موعد"
            description="إشعار لجميع المعنيين بالموعد"
            checked={true}
            variant="warning"
          />
          <EnhancedSwitch
            id="notify-noshow"
            label="تنبيه عند عدم الحضور"
            description="تسجيل تلقائي في النظام"
            checked={false}
            variant="danger"
          />
        </CardContent>
      </Card>

      {/* إعدادات المراكز */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إدارة المراكز</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {MADINATI_CENTERS.map(center => (
              <div key={center.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5" style={{ color: center.isActive ? '#10b981' : '#6b7280' }} />
                  <div>
                    <p className="font-bold text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{center.name}</p>
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{center.code}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" style={{ fontSize: '9px' }}>
                        {(centerServices[center.id] || []).length} خدمة
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge style={{ background: center.isActive ? '#10b981' : '#6b7280' }}>
                    {center.isActive ? 'نشط' : 'غير نشط'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 ml-1" />
                    تعديل
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button>
              <Plus className="h-4 w-4 ml-1" />
              إضافة مركز جديد
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* أزرار الحفظ */}
      <div className="flex gap-2 justify-end">
        <Button onClick={saveServicesToLocalStorage}>
          <Save className="h-4 w-4 ml-1" />
          حفظ الإعدادات
        </Button>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 ml-1" />
          استعادة الافتراضي
        </Button>
      </div>
    </div>
  );

  // ============================================================
  // نافذة تفاصيل الموعد
  // ============================================================

  const renderAppointmentDialog = () => {
    if (!selectedAppointment) return null;

    return (
      <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
        <DialogContent className="max-w-4xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar className="h-6 w-6 text-blue-600" />
              تفاصيل الموعد - {selectedAppointment.code}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* معلومات أساسية */}
            <Card style={{ border: '2px solid #3b82f6' }}>
              <CardHeader className="pb-2">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  معلومات الموعد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-xs text-gray-600">المركز</p>
                    <p className="font-bold text-sm">{selectedAppointment.centerName}</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <p className="text-xs text-gray-600">التاريخ والوقت</p>
                    <p className="font-bold text-sm">{selectedAppointment.date} - {selectedAppointment.time}</p>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <p className="text-xs text-gray-600">المكلف</p>
                    <p className="font-bold text-sm">
                      {selectedAppointment.assignedTo === 'employee' ? 'موظف' : 'معقب'}: {selectedAppointment.employeeName || selectedAppointment.agentName}
                    </p>
                  </div>
                  <div className="bg-amber-50 p-2 rounded">
                    <p className="text-xs text-gray-600">الحالة</p>
                    <Badge style={{
                      background: selectedAppointment.status === 'completed' ? '#10b981' :
                        selectedAppointment.status === 'scheduled' ? '#f59e0b' :
                          selectedAppointment.status === 'cancelled' ? '#ef4444' : '#6b7280'
                    }}>
                      {selectedAppointment.status === 'completed' ? 'مكتمل' :
                        selectedAppointment.status === 'scheduled' ? 'مجدول' :
                          selectedAppointment.status === 'cancelled' ? 'ملغي' : 'عدم حضور'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* المعاملة المرتبطة */}
            {selectedAppointment.transactionId && (
              <Card style={{ border: '2px solid #8b5cf6' }}>
                <CardHeader className="pb-2">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                    المعاملة المرتبطة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge style={{ background: '#8b5cf6' }}>{selectedAppointment.transactionNumber}</Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        نوع المعاملة: {selectedAppointment.transactionType === 'full' ? 'كاملة' : 'بسيطة'}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Link2 className="h-4 w-4 ml-1" />
                      عرض المعاملة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* الهدف والمطلوب والنتيجة */}
            <div className="grid grid-cols-1 gap-3">
              <Card style={{ border: '2px solid #10b981' }}>
                <CardHeader className="pb-2">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                    <Target className="h-4 w-4 inline ml-1" />
                    الهدف من الموعد
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {selectedAppointment.objective}
                  </p>
                </CardContent>
              </Card>

              <Card style={{ border: '2px solid #f59e0b' }}>
                <CardHeader className="pb-2">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                    <ListChecks className="h-4 w-4 inline ml-1" />
                    المطلوب إحضاره
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {selectedAppointment.required}
                  </p>
                </CardContent>
              </Card>

              {selectedAppointment.result && (
                <Card style={{ border: '2px solid #06b6d4' }}>
                  <CardHeader className="pb-2">
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                      <CheckCircle className="h-4 w-4 inline ml-1" />
                      النتيجة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {selectedAppointment.result}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* المرفقات */}
            {selectedAppointment.attachments.length > 0 && (
              <Card style={{ border: '2px solid #ec4899' }}>
                <CardHeader className="pb-2">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                    <Paperclip className="h-4 w-4 inline ml-1" />
                    المرفقات ({selectedAppointment.attachments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedAppointment.attachments.map(file => (
                      <div key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <Files className="h-4 w-4 text-pink-600" />
                          <div>
                            <p className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {file.type} - {file.size}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* المواعيد المرتبطة */}
            {selectedAppointment.hasRelatedAppointments && (
              <Card style={{ border: '2px solid #8b5cf6' }}>
                <CardHeader className="pb-2">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                    <Share2 className="h-4 w-4 inline ml-1" />
                    مواعيد مرتبطة ({selectedAppointment.relatedAppointments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedAppointment.relatedAppointments.map(relatedId => {
                      const related = MOCK_APPOINTMENTS.find(a => a.id === relatedId);
                      if (!related) return null;
                      return (
                        <div key={relatedId} className="flex items-center justify-between bg-purple-50 p-2 rounded">
                          <div>
                            <Badge>{related.code}</Badge>
                            <p className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {related.objective}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleViewAppointment(related)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* أزرار الإجراءات */}
            <div className="flex gap-2 justify-end pt-2" style={{ borderTop: '1px solid #e5e7eb' }}>
              <Button onClick={() => handleSendDetails(selectedAppointment)}>
                <Send className="h-4 w-4 ml-1" />
                إرسال التفاصيل
              </Button>
              <Button variant="outline" onClick={() => setShowAppointmentDialog(false)}>
                إغلاق
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // ============================================================
  // نافذة تفاصيل المركز
  // ============================================================

  const renderCenterDialog = () => {
    if (!selectedCenter) return null;

    return (
      <Dialog open={showCenterDialog} onOpenChange={setShowCenterDialog}>
        <DialogContent className="max-w-3xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 className="h-6 w-6 text-green-600" />
              {selectedCenter.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* معلومات المركز */}
            <Card style={{ border: '2px solid #10b981' }}>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-xs text-gray-600 mb-1">رمز المركز</p>
                    <Badge style={{ background: '#10b981' }}>{selectedCenter.code}</Badge>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-xs text-gray-600 mb-1">الحالة</p>
                    <Badge style={{ background: selectedCenter.isActive ? '#10b981' : '#6b7280' }}>
                      {selectedCenter.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                  <div className="col-span-2 bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-600 mb-1">العنوان</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <p className="text-sm font-bold">{selectedCenter.address}</p>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-3 rounded">
                    <p className="text-xs text-gray-600 mb-1">ساعات العمل</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <p className="text-sm font-bold">{selectedCenter.workingHours}</p>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-xs text-gray-600 mb-1">الهاتف</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-purple-600" />
                      <p className="text-sm font-bold">{selectedCenter.phone}</p>
                    </div>
                  </div>
                  <div className="col-span-2 bg-sky-50 p-3 rounded">
                    <p className="text-xs text-gray-600 mb-1">البريد الإلكتروني</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-sky-600" />
                      <p className="text-sm font-bold">{selectedCenter.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* الخدمات المتاحة */}
            <Card style={{ border: '2px solid #3b82f6' }}>
              <CardHeader className="pb-2">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  الخدمات المتاحة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedCenter.services.map((service, idx) => (
                    <Badge key={idx} variant="outline" style={{ borderColor: '#3b82f6', color: '#3b82f6' }}>
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* الموقع على الخريطة */}
            <Card style={{ border: '2px solid #ec4899' }}>
              <CardHeader className="pb-2">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  الموقع الجغرافي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-pink-50 p-2 rounded">
                    <p className="text-xs text-gray-600">خط العرض</p>
                    <code className="font-bold text-sm">{selectedCenter.location.lat.toFixed(6)}</code>
                  </div>
                  <div className="bg-pink-50 p-2 rounded">
                    <p className="text-xs text-gray-600">خط الطول</p>
                    <code className="font-bold text-sm">{selectedCenter.location.lng.toFixed(6)}</code>
                  </div>
                </div>
                <Button
                  className="w-full mt-3"
                  onClick={() => window.open(`https://www.google.com/maps?q=${selectedCenter.location.lat},${selectedCenter.location.lng}`, '_blank')}
                >
                  <Navigation className="h-4 w-4 ml-1" />
                  فتح في خرائط جوجل
                </Button>
              </CardContent>
            </Card>

            {/* أزرار */}
            <div className="flex gap-2 justify-end pt-2" style={{ borderTop: '1px solid #e5e7eb' }}>
              <Button variant="outline" onClick={() => setShowCenterDialog(false)}>
                إغلاق
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // ============================================================
  // نافذة إرسال التفاصيل
  // ============================================================

  const renderSendDetailsDialog = () => {
    if (!selectedAppointment) return null;

    return (
      <Dialog open={showSendDetailsDialog} onOpenChange={setShowSendDetailsDialog}>
        <DialogContent className="max-w-2xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Send className="h-6 w-6 text-blue-600" />
              إرسال تفاصيل الموعد - {selectedAppointment.code}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* اختيار العناصر */}
            <Card style={{ border: '2px solid #3b82f6' }}>
              <CardHeader className="pb-2">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  اختر العناصر المراد إرسالها
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <EnhancedSwitch
                    id="includeObjective"
                    checked={sendDetails.includeObjective}
                    onCheckedChange={(checked) => setSendDetails({ ...sendDetails, includeObjective: checked })}
                    label="الهدف من الموعد"
                    size="sm"
                  />
                  <EnhancedSwitch
                    id="includeRequired"
                    checked={sendDetails.includeRequired}
                    onCheckedChange={(checked) => setSendDetails({ ...sendDetails, includeRequired: checked })}
                    label="المطلوب إحضاره"
                    size="sm"
                  />
                  <EnhancedSwitch
                    id="includeResult"
                    checked={sendDetails.includeResult}
                    onCheckedChange={(checked) => setSendDetails({ ...sendDetails, includeResult: checked })}
                    label="النتيجة"
                    size="sm"
                  />
                  <EnhancedSwitch
                    id="includeAttachments"
                    checked={sendDetails.includeAttachments}
                    onCheckedChange={(checked) => setSendDetails({ ...sendDetails, includeAttachments: checked })}
                    label="المرفقات"
                    size="sm"
                  />
                  <EnhancedSwitch
                    id="includeNotes"
                    checked={sendDetails.includeNotes}
                    onCheckedChange={(checked) => setSendDetails({ ...sendDetails, includeNotes: checked })}
                    label="الملاحظات"
                    size="sm"
                  />
                  <EnhancedSwitch
                    id="includeCenterInfo"
                    checked={sendDetails.includeCenterInfo}
                    onCheckedChange={(checked) => setSendDetails({ ...sendDetails, includeCenterInfo: checked })}
                    label="معلومات المركز"
                    size="sm"
                  />
                  <EnhancedSwitch
                    id="includeTransactionInfo"
                    checked={sendDetails.includeTransactionInfo}
                    onCheckedChange={(checked) => setSendDetails({ ...sendDetails, includeTransactionInfo: checked })}
                    label="معلومات المعاملة"
                    size="sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* رسالة إضافية */}
            <Card style={{ border: '2px solid #10b981' }}>
              <CardHeader className="pb-2">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  رسالة إضافية (اختياري)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TextAreaWithCopy
                  label=""
                  id="additionalMessage"
                  value={sendDetails.additionalMessage}
                  onChange={(e) => setSendDetails({ ...sendDetails, additionalMessage: e.target.value })}
                  rows={3}
                  placeholder="أضف رسالة إضافية..."
                  copyable={true}
                  clearable={true}
                />
              </CardContent>
            </Card>

            {/* معاينة */}
            <Card style={{ border: '2px solid #f59e0b', background: '#fffbeb' }}>
              <CardHeader className="pb-2">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                  <AlertCircle className="h-4 w-4 inline ml-1 text-amber-600" />
                  معاينة الإرسال
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  سيتم إرسال التفاصيل إلى:{' '}
                  <span className="font-bold">
                    {selectedAppointment.employeeName || selectedAppointment.agentName}
                  </span>
                </p>
                <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  عدد العناصر المحددة: {
                    [
                      sendDetails.includeObjective,
                      sendDetails.includeRequired,
                      sendDetails.includeResult,
                      sendDetails.includeAttachments,
                      sendDetails.includeNotes,
                      sendDetails.includeCenterInfo,
                      sendDetails.includeTransactionInfo
                    ].filter(Boolean).length
                  }
                </p>
              </CardContent>
            </Card>

            {/* أزرار */}
            <div className="flex gap-2 justify-end pt-2" style={{ borderTop: '1px solid #e5e7eb' }}>
              <Button onClick={handleSendAppointmentDetails}>
                <Send className="h-4 w-4 ml-1" />
                إرسال الآن
              </Button>
              <Button variant="outline" onClick={() => setShowSendDetailsDialog(false)}>
                <X className="h-4 w-4 ml-1" />
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // ============================================================
  // العرض الرئيسي
  // ============================================================

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
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
              <Calendar
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
                  مواعيد مدينتي
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
                    933
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
                <span
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#94a3b8',
                    display: 'inline-block'
                  }}
                ></span>
                إدارة شاملة للمواعيد في مراكز مدينتي مع ربط المعاملات والموظفين
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
        <UnifiedTabsSidebar tabs={TABS_CONFIG} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 px-6" style={{ minHeight: 'calc(100vh - 140px)' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* النوافذ المنبثقة */}
      {renderAppointmentDialog()}
      {renderCenterDialog()}
      {renderSendDetailsDialog()}
      
      {/* نافذة إضافة خدمة جديدة */}
      <Dialog open={showAddServiceDialog} onOpenChange={setShowAddServiceDialog}>
        <DialogContent className="max-w-md" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Plus className="h-6 w-6 text-green-600" />
              إضافة خدمة جديدة
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              أدخل اسم الخدمة الجديدة التي ترغب في إضافتها لمراكز مدينتي
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <InputWithCopy
              label="اسم الخدمة"
              id="new-service-name"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="مثال: استخراج رخص التشغيل"
              required={true}
              copyable={false}
              clearable={true}
            />
            
            <div className="p-3" style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              border: '2px solid #fcd34d',
              borderRadius: '8px'
            }}>
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>
                    ستتم إضافة الخدمة الجديدة إلى قائمة الخدمات المتاحة، ويمكنك تحديدها للمراكز المناسبة من الجدول
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end mt-6">
            <Button
              onClick={handleAddService}
              disabled={!newServiceName.trim()}
              style={{
                background: newServiceName.trim() ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : undefined,
                color: '#ffffff'
              }}
            >
              <Plus className="h-4 w-4 ml-1" />
              إضافة الخدمة
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddServiceDialog(false);
                setNewServiceName('');
              }}
            >
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MadinatiAppointments_Complete_933;
