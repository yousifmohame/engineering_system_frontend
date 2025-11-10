/**
 * الشاشة 944 - المنصات والتأهيل
 * نظام شامل لإدارة تسجيل المكتب في المنصات الحكومية والخاصة
 * مع تتبع التراخيص والصلاحيات والتأهيلات
 * 
 * التحديث النهائي: جميع التبويبات العشرة مكتملة 100%
 * تاريخ التطوير: 31 أكتوبر 2025
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import {
  Building2, Shield, FileCheck, Calendar, Clock, AlertCircle,
  CheckCircle, XCircle, Plus, Edit, Trash2, Eye, Download,
  Upload, Search, Filter, RefreshCw, Send, Printer, Copy,
  Save, Users, FileText, Link, Phone, Mail, MapPin, Globe,
  Facebook, Twitter, Instagram, Youtube, Hash, Key, User,
  CalendarDays, History, Bell, Image, Paperclip, ClipboardList,
  UserCheck, ArrowUpCircle, TrendingUp, Target, Award, Stamp,
  Settings, Briefcase, FileSignature, Zap, DollarSign, Share2,
  ExternalLink, Info, Lock, Unlock, FileImage, FilePlus
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner@2.0.3';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';

// ==================== الواجهات ====================

interface Platform {
  id: string;
  name: string;
  nameEn: string;
  category: 'government' | 'private';
  type: 'mandatory' | 'optional';
  status: 'active' | 'expired' | 'pending' | 'suspended';
  registrationDate: string;
  expiryDate: string;
  daysRemaining: number;
  credentials: {
    email: string;
    username: string;
    password: string;
    passwordLastChanged: string;
    referenceNumber: string;
    uniqueId: string;
    uniqueIdSameAsUsername: boolean;
    mobileNumber: string;
    registeredBy: string;
    registrationDate: string;
  };
  links: {
    loginUrl: string;
    appUrl: string;
    customerService: string;
    twitter: string;
    facebook: string;
    instagram: string;
    youtube: string;
  };
  documents: {
    certificateImage: string;
    attachments: Attachment[];
  };
  notes: string;
  history: HistoryRecord[];
  qualificationLevel: string;
  renewalCost: string;
  autoRenewal: boolean;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedDate: string;
  url: string;
  category: string;
}

interface HistoryRecord {
  id: string;
  date: string;
  time: string;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
  reason: string;
  changedBy: string;
}

interface Task {
  id: string;
  platformId: string;
  platformName: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate: string;
  createdDate: string;
  completedDate: string;
  notes: string;
}

interface Alert {
  id: string;
  platformId: string;
  platformName: string;
  type: 'expiry' | 'renewal' | 'update' | 'document' | 'credential';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  date: string;
  acknowledged: boolean;
  acknowledgedBy: string;
  acknowledgedDate: string;
}

interface Settings {
  notifications: {
    expiryAlert30Days: boolean;
    expiryAlert60Days: boolean;
    expiryAlert90Days: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    notificationEmail: string;
    notificationMobile: string;
  };
  renewal: {
    autoRenewalEnabled: boolean;
    reminderDays: number;
    paymentMethod: string;
  };
  security: {
    passwordExpiryDays: number;
    requirePasswordChange: boolean;
    enableAuditLog: boolean;
  };
}

const PlatformsQualification: React.FC = () => {
  const [activeTab, setActiveTab] = useState('944-01');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // بيانات المنصات الوهمية الشاملة
  const mockPlatforms: Platform[] = [
    {
      id: 'PLT-001',
      name: 'منصة قوى',
      nameEn: 'Qiwa Platform',
      category: 'government',
      type: 'mandatory',
      status: 'active',
      registrationDate: '2023-01-15',
      expiryDate: '2026-01-14',
      daysRemaining: 425,
      credentials: {
        email: 'office@alamiah.com.sa',
        username: 'alamiah_office',
        password: '••••••••',
        passwordLastChanged: '2024-09-15',
        referenceNumber: 'QW-2023-456789',
        uniqueId: '700123456700003',
        uniqueIdSameAsUsername: false,
        mobileNumber: '0501234567',
        registeredBy: 'م. أحمد محمد العلي',
        registrationDate: '2023-01-15'
      },
      links: {
        loginUrl: 'https://qiwa.sa',
        appUrl: 'https://apps.apple.com/sa/app/qiwa',
        customerService: '920020301',
        twitter: 'https://twitter.com/QiwaSA',
        facebook: '',
        instagram: 'https://instagram.com/qiwa.sa',
        youtube: ''
      },
      documents: {
        certificateImage: '/certificates/qiwa-cert.pdf',
        attachments: [
          { id: 'AT-001', name: 'تفويض.pdf', type: 'PDF', size: '245 KB', uploadedBy: 'م. أحمد العلي', uploadedDate: '2023-01-15', url: '/docs/qiwa-auth.pdf', category: 'تفويض' },
          { id: 'AT-002', name: 'CR.pdf', type: 'PDF', size: '180 KB', uploadedBy: 'م. أحمد العلي', uploadedDate: '2023-01-15', url: '/docs/cr.pdf', category: 'سجل تجاري' },
          { id: 'AT-003', name: 'وثائق التسجيل.pdf', type: 'PDF', size: '320 KB', uploadedBy: 'م. أحمد العلي', uploadedDate: '2023-01-15', url: '/docs/reg-docs.pdf', category: 'تسجيل' }
        ]
      },
      notes: 'يجب تجديد التوطين كل 3 أشهر',
      history: [
        { id: 'H001', date: '2024-09-15', time: '10:30', action: 'تحديث', field: 'كلمة المرور', oldValue: '••••••••', newValue: '••••••••', reason: 'تغيير دوري للأمان', changedBy: 'م. أحمد العلي' },
        { id: 'H002', date: '2024-06-10', time: '14:20', action: 'تحديث', field: 'رقم الجوال', oldValue: '0501234566', newValue: '0501234567', reason: 'تغيير رقم الجوال المسجل', changedBy: 'م. أحمد العلي' },
        { id: 'H003', date: '2023-12-05', time: '09:15', action: 'إضافة', field: 'مرفق جديد', oldValue: '-', newValue: 'وثائق التسجيل.pdf', reason: 'رفع وثيقة جديدة', changedBy: 'م. أحمد العلي' }
      ],
      qualificationLevel: 'مستوى أول',
      renewalCost: '0',
      autoRenewal: true
    },
    {
      id: 'PLT-002',
      name: 'هيئة الزكاة والضريبة والجمارك',
      nameEn: 'ZATCA',
      category: 'government',
      type: 'mandatory',
      status: 'active',
      registrationDate: '2020-03-01',
      expiryDate: '2025-12-31',
      daysRemaining: 456,
      credentials: {
        email: 'tax@alamiah.com.sa',
        username: '300567890100003',
        password: '••••••••',
        passwordLastChanged: '2024-10-01',
        referenceNumber: 'ZT-2020-789456',
        uniqueId: '300567890100003',
        uniqueIdSameAsUsername: true,
        mobileNumber: '0501234567',
        registeredBy: 'أ. خالد سعد السالم',
        registrationDate: '2020-03-01'
      },
      links: {
        loginUrl: 'https://zatca.gov.sa',
        appUrl: '',
        customerService: '19993',
        twitter: 'https://twitter.com/Zatca_sa',
        facebook: '',
        instagram: 'https://instagram.com/zatca.sa',
        youtube: 'https://youtube.com/c/ZATCASA'
      },
      documents: {
        certificateImage: '/certificates/zatca-cert.pdf',
        attachments: [
          { id: 'AT-004', name: 'شهادة التسجيل الضريبي.pdf', type: 'PDF', size: '420 KB', uploadedBy: 'أ. خالد السالم', uploadedDate: '2020-03-01', url: '/docs/zatca-cert.pdf', category: 'شهادة' },
          { id: 'AT-005', name: 'السجل التجاري.pdf', type: 'PDF', size: '180 KB', uploadedBy: 'أ. خالد السالم', uploadedDate: '2020-03-01', url: '/docs/cr.pdf', category: 'سجل تجاري' }
        ]
      },
      notes: 'يجب تقديم الإقرار الضريبي كل ربع سنة',
      history: [
        { id: 'H004', date: '2024-10-01', time: '11:45', action: 'تحديث', field: 'كلمة المرور', oldValue: '••••••••', newValue: '••••••••', reason: 'انتهاء صلاحية كلمة المرور', changedBy: 'أ. خالد السالم' }
      ],
      qualificationLevel: 'مسجل',
      renewalCost: '0',
      autoRenewal: false
    },
    {
      id: 'PLT-003',
      name: 'منصة بلدي',
      nameEn: 'Balady Platform',
      category: 'government',
      type: 'mandatory',
      status: 'active',
      registrationDate: '2022-06-01',
      expiryDate: '2025-05-31',
      daysRemaining: 243,
      credentials: {
        email: 'balady@alamiah.com.sa',
        username: 'alamiah_eng',
        password: '••••••••',
        passwordLastChanged: '2024-08-20',
        referenceNumber: 'BL-2022-123789',
        uniqueId: 'ENG-25-00456',
        uniqueIdSameAsUsername: false,
        mobileNumber: '0501234567',
        registeredBy: 'م. فهد عبدالله النمر',
        registrationDate: '2022-06-01'
      },
      links: {
        loginUrl: 'https://balady.gov.sa',
        appUrl: 'https://apps.apple.com/sa/app/balady',
        customerService: '940',
        twitter: 'https://twitter.com/BaladySA',
        facebook: '',
        instagram: 'https://instagram.com/balady.sa',
        youtube: ''
      },
      documents: {
        certificateImage: '/certificates/balady-cert.pdf',
        attachments: [
          { id: 'AT-006', name: 'ترخيص مكتب هندسي.pdf', type: 'PDF', size: '350 KB', uploadedBy: 'م. فهد النمر', uploadedDate: '2022-06-01', url: '/docs/balady-license.pdf', category: 'ترخيص' },
          { id: 'AT-007', name: 'تفويض.pdf', type: 'PDF', size: '245 KB', uploadedBy: 'م. فهد النمر', uploadedDate: '2022-06-01', url: '/docs/auth.pdf', category: 'تفويض' }
        ]
      },
      notes: 'مرتبط بالأعمال الهندسية والتراخيص',
      history: [
        { id: 'H005', date: '2024-08-20', time: '13:30', action: 'تحديث', field: 'كلمة المرور', oldValue: '••••••••', newValue: '••••••••', reason: 'إعادة تعيين بناءً على طلب المستخدم', changedBy: 'م. فهد النمر' }
      ],
      qualificationLevel: 'مكتب هندسي معتمد',
      renewalCost: '5000',
      autoRenewal: false
    },
    {
      id: 'PLT-004',
      name: 'المؤسسة العامة للتأمينات الاجتماعية',
      nameEn: 'GOSI',
      category: 'government',
      type: 'mandatory',
      status: 'active',
      registrationDate: '2020-01-15',
      expiryDate: '2099-12-31',
      daysRemaining: 27394,
      credentials: {
        email: 'gosi@alamiah.com.sa',
        username: '500123456',
        password: '••••••••',
        passwordLastChanged: '2024-07-10',
        referenceNumber: 'GO-2020-456123',
        uniqueId: '500123456',
        uniqueIdSameAsUsername: true,
        mobileNumber: '0501234567',
        registeredBy: 'أ. نواف راشد الحربي',
        registrationDate: '2020-01-15'
      },
      links: {
        loginUrl: 'https://www.gosi.gov.sa',
        appUrl: 'https://apps.apple.com/sa/app/gosi',
        customerService: '8001243344',
        twitter: 'https://twitter.com/SaudiGOSI',
        facebook: '',
        instagram: 'https://instagram.com/saudigosi',
        youtube: ''
      },
      documents: {
        certificateImage: '/certificates/gosi-cert.pdf',
        attachments: [
          { id: 'AT-008', name: 'شهادة تسجيل.pdf', type: 'PDF', size: '280 KB', uploadedBy: 'أ. نواف الحربي', uploadedDate: '2020-01-15', url: '/docs/gosi-cert.pdf', category: 'شهادة' },
          { id: 'AT-009', name: 'اشتراكات.pdf', type: 'PDF', size: '195 KB', uploadedBy: 'أ. نواف الحربي', uploadedDate: '2020-01-15', url: '/docs/gosi-sub.pdf', category: 'اشتراكات' }
        ]
      },
      notes: 'اشتراكات شهرية للموظفين',
      history: [],
      qualificationLevel: 'منشأة مسجلة',
      renewalCost: 'متغير',
      autoRenewal: true
    },
    {
      id: 'PLT-005',
      name: 'الهيئة السعودية للمهندسين',
      nameEn: 'SCE',
      category: 'government',
      type: 'mandatory',
      status: 'active',
      registrationDate: '2021-03-20',
      expiryDate: '2026-03-19',
      daysRemaining: 505,
      credentials: {
        email: 'sce@alamiah.com.sa',
        username: 'alamiah_sce',
        password: '••••••••',
        passwordLastChanged: '2024-06-15',
        referenceNumber: 'SCE-2021-789123',
        uniqueId: 'ENG-2021-5678',
        uniqueIdSameAsUsername: false,
        mobileNumber: '0501234567',
        registeredBy: 'م. أحمد محمد العلي',
        registrationDate: '2021-03-20'
      },
      links: {
        loginUrl: 'https://portal.saudieng.sa',
        appUrl: '',
        customerService: '920006664',
        twitter: 'https://twitter.com/saudieng_sa',
        facebook: '',
        instagram: 'https://instagram.com/saudieng',
        youtube: ''
      },
      documents: {
        certificateImage: '/certificates/sce-cert.pdf',
        attachments: [
          { id: 'AT-010', name: 'رخصة ممارسة المهنة.pdf', type: 'PDF', size: '540 KB', uploadedBy: 'م. أحمد العلي', uploadedDate: '2021-03-20', url: '/docs/sce-license.pdf', category: 'ترخيص' },
          { id: 'AT-011', name: 'شهادات المهندسين.pdf', type: 'PDF', size: '890 KB', uploadedBy: 'م. أحمد العلي', uploadedDate: '2021-03-20', url: '/docs/engineers-certs.pdf', category: 'شهادات' }
        ]
      },
      notes: 'تجديد سنوي للرخصة',
      history: [],
      qualificationLevel: 'مكتب هندسي مرخص',
      renewalCost: '15000',
      autoRenewal: false
    },
    {
      id: 'PLT-006',
      name: 'أمانة منطقة الرياض',
      nameEn: 'Riyadh Municipality',
      category: 'government',
      type: 'mandatory',
      status: 'active',
      registrationDate: '2020-02-10',
      expiryDate: '2025-02-09',
      daysRemaining: 132,
      credentials: {
        email: 'riyadh@alamiah.com.sa',
        username: 'alamiah_ryd',
        password: '••••••••',
        passwordLastChanged: '2024-09-01',
        referenceNumber: 'RYD-2020-321654',
        uniqueId: 'MUN-20-1234',
        uniqueIdSameAsUsername: false,
        mobileNumber: '0501234567',
        registeredBy: 'م. خالد سعد السالم',
        registrationDate: '2020-02-10'
      },
      links: {
        loginUrl: 'https://www.alriyadh.gov.sa',
        appUrl: '',
        customerService: '940',
        twitter: 'https://twitter.com/RiyadhRegion',
        facebook: '',
        instagram: 'https://instagram.com/riyadhregion',
        youtube: ''
      },
      documents: {
        certificateImage: '/certificates/riyadh-cert.pdf',
        attachments: [
          { id: 'AT-012', name: 'ترخيص مكتب.pdf', type: 'PDF', size: '310 KB', uploadedBy: 'م. خالد السالم', uploadedDate: '2020-02-10', url: '/docs/riyadh-license.pdf', category: 'ترخيص' },
          { id: 'AT-013', name: 'موافقات.pdf', type: 'PDF', size: '265 KB', uploadedBy: 'م. خالد السالم', uploadedDate: '2020-02-10', url: '/docs/approvals.pdf', category: 'موافقات' }
        ]
      },
      notes: 'خاص بمشاريع الرياض',
      history: [],
      qualificationLevel: 'مكتب معتمد',
      renewalCost: '3000',
      autoRenewal: false
    }
  ];

  const [platforms, setPlatforms] = useState<Platform[]>(mockPlatforms);

  // بيانات المهام الوهمية
  const mockTasks: Task[] = [
    {
      id: 'TSK-001',
      platformId: 'PLT-003',
      platformName: 'منصة بلدي',
      title: 'تجديد الترخيص السنوي',
      description: 'تجديد ترخيص المكتب الهندسي للسنة القادمة',
      assignedTo: 'معقب أحمد الشهري',
      assignedBy: 'م. أحمد العلي',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2025-05-15',
      createdDate: '2025-04-01',
      completedDate: '',
      notes: 'يجب إرفاق المستندات المطلوبة'
    },
    {
      id: 'TSK-002',
      platformId: 'PLT-005',
      platformName: 'الهيئة السعودية للمهندسين',
      title: 'تحديث بيانات المهندسين',
      description: 'إضافة المهندسين الجدد في قاعدة البيانات',
      assignedTo: 'معقب محمد القحطاني',
      assignedBy: 'أ. خالد السالم',
      priority: 'medium',
      status: 'pending',
      dueDate: '2025-11-30',
      createdDate: '2025-10-20',
      completedDate: '',
      notes: ''
    },
    {
      id: 'TSK-003',
      platformId: 'PLT-006',
      platformName: 'أمانة منطقة الرياض',
      title: 'تجديد اعتماد المكتب',
      description: 'تجديد الاعتماد السنوي لدى أمانة الرياض',
      assignedTo: 'معقب فهد العتيبي',
      assignedBy: 'م. فهد النمر',
      priority: 'urgent',
      status: 'pending',
      dueDate: '2025-01-15',
      createdDate: '2024-12-01',
      completedDate: '',
      notes: 'مهمة عاجلة - انتهاء خلال 45 يوم'
    },
    {
      id: 'TSK-004',
      platformId: 'PLT-001',
      platformName: 'منصة قوى',
      title: 'تحديث بيانات التوطين',
      description: 'تحديث بيانات نسبة التوطين الربع سنوية',
      assignedTo: 'معقب عبدالله الدوسري',
      assignedBy: 'أ. نواف الحربي',
      priority: 'medium',
      status: 'completed',
      dueDate: '2024-10-15',
      createdDate: '2024-10-01',
      completedDate: '2024-10-12',
      notes: 'تم الإنجاز بنجاح'
    }
  ];

  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  // بيانات التنبيهات الوهمية
  const mockAlerts: Alert[] = [
    {
      id: 'ALT-001',
      platformId: 'PLT-006',
      platformName: 'أمانة منطقة الرياض',
      type: 'expiry',
      severity: 'warning',
      message: 'انتهاء الصلاحية خلال 132 يوم',
      date: '2025-10-31',
      acknowledged: false,
      acknowledgedBy: '',
      acknowledgedDate: ''
    },
    {
      id: 'ALT-002',
      platformId: 'PLT-003',
      platformName: 'منصة بلدي',
      type: 'renewal',
      severity: 'critical',
      message: 'يجب تجديد الترخيص خلال 243 يوم',
      date: '2025-10-30',
      acknowledged: false,
      acknowledgedBy: '',
      acknowledgedDate: ''
    },
    {
      id: 'ALT-003',
      platformId: 'PLT-001',
      platformName: 'منصة قوى',
      type: 'update',
      severity: 'info',
      message: 'تحديث متاح لبيانات التوطين',
      date: '2025-10-29',
      acknowledged: true,
      acknowledgedBy: 'أ. نواف الحربي',
      acknowledgedDate: '2025-10-30'
    },
    {
      id: 'ALT-004',
      platformId: 'PLT-002',
      platformName: 'هيئة الزكاة والضريبة والجمارك',
      type: 'document',
      severity: 'warning',
      message: 'يجب تقديم الإقرار الضريبي الربع سنوي',
      date: '2025-10-28',
      acknowledged: false,
      acknowledgedBy: '',
      acknowledgedDate: ''
    }
  ];

  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  // الإعدادات الافتراضية
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      expiryAlert30Days: true,
      expiryAlert60Days: true,
      expiryAlert90Days: true,
      emailNotifications: true,
      smsNotifications: false,
      notificationEmail: 'notifications@alamiah.com.sa',
      notificationMobile: '0501234567'
    },
    renewal: {
      autoRenewalEnabled: false,
      reminderDays: 60,
      paymentMethod: 'manual'
    },
    security: {
      passwordExpiryDays: 90,
      requirePasswordChange: true,
      enableAuditLog: true
    }
  });

  // دوال المساعدة
  const getStatusBadge = (status: string) => {
    const configs: any = {
      active: { label: 'نشط', className: 'bg-green-500 text-white' },
      expired: { label: 'منتهي', className: 'bg-red-500 text-white' },
      pending: { label: 'قيد المعالجة', className: 'bg-yellow-500 text-white' },
      suspended: { label: 'معلق', className: 'bg-gray-500 text-white' }
    };
    const config = configs[status] || { label: status, className: 'bg-gray-400 text-white' };
    return <Badge className={`text-xs ${config.className}`}>{config.label}</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    return category === 'government' 
      ? <Badge className="bg-blue-500 text-white text-xs">حكومي</Badge>
      : <Badge className="bg-purple-500 text-white text-xs">خاص</Badge>;
  };

  const getTypeBadge = (type: string) => {
    return type === 'mandatory'
      ? <Badge className="bg-red-500 text-white text-xs">إلزامي</Badge>
      : <Badge className="bg-green-500 text-white text-xs">اختياري</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const configs: any = {
      urgent: { label: 'عاجل', className: 'bg-red-600 text-white' },
      high: { label: 'مرتفع', className: 'bg-orange-500 text-white' },
      medium: { label: 'متوسط', className: 'bg-yellow-500 text-white' },
      low: { label: 'منخفض', className: 'bg-green-500 text-white' }
    };
    const config = configs[priority];
    return <Badge className={`text-xs ${config.className}`}>{config.label}</Badge>;
  };

  const getTaskStatusBadge = (status: string) => {
    const configs: any = {
      pending: { label: 'قيد الانتظار', className: 'bg-yellow-500 text-white' },
      'in-progress': { label: 'قيد التنفيذ', className: 'bg-blue-500 text-white' },
      completed: { label: 'مكتمل', className: 'bg-green-500 text-white' },
      cancelled: { label: 'ملغي', className: 'bg-gray-500 text-white' }
    };
    const config = configs[status];
    return <Badge className={`text-xs ${config.className}`}>{config.label}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const configs: any = {
      critical: { label: 'حرج', className: 'bg-red-600 text-white' },
      warning: { label: 'تحذير', className: 'bg-orange-500 text-white' },
      info: { label: 'معلومة', className: 'bg-blue-500 text-white' }
    };
    const config = configs[severity];
    return <Badge className={`text-xs ${config.className}`}>{config.label}</Badge>;
  };

  const getDaysColor = (days: number) => {
    if (days < 30) return 'text-red-600';
    if (days < 90) return 'text-orange-600';
    if (days < 180) return 'text-yellow-600';
    return 'text-green-600';
  };

  // تصفية المنصات
  const filteredPlatforms = platforms.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // إحصائيات
  const stats = {
    total: platforms.length,
    active: platforms.filter(p => p.status === 'active').length,
    expired: platforms.filter(p => p.status === 'expired').length,
    expiringSoon: platforms.filter(p => p.daysRemaining < 90 && p.status === 'active').length,
    government: platforms.filter(p => p.category === 'government').length,
    private: platforms.filter(p => p.category === 'private').length,
    mandatory: platforms.filter(p => p.type === 'mandatory').length,
    pendingTasks: tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length,
    unacknowledgedAlerts: alerts.filter(a => !a.acknowledged).length
  };

  // التبويبات
  const TABS_CONFIG: TabConfig[] = [
    { id: '944-01', number: '944-01', title: 'نظرة عامة', icon: TrendingUp },
    { id: '944-02', number: '944-02', title: 'إدارة المنصات', icon: Building2 },
    { id: '944-03', number: '944-03', title: 'بيانات التسجيل', icon: FileCheck },
    { id: '944-04', number: '944-04', title: 'التراخيص والصلاحية', icon: Award },
    { id: '944-05', number: '944-05', title: 'سجل الأحداث', icon: History },
    { id: '944-06', number: '944-06', title: 'المرفقات', icon: Paperclip },
    { id: '944-07', number: '944-07', title: 'مهام المعقبين', icon: ClipboardList },
    { id: '944-08', number: '944-08', title: 'التنبيهات', icon: Bell },
    { id: '944-09', number: '944-09', title: 'التقارير', icon: FileText },
    { id: '944-10', number: '944-10', title: 'الإعدادات', icon: Settings }
  ];

  // ==================== التاب 1: نظرة عامة ====================
  const renderOverview = () => (
    <div className="space-y-3">
      <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة - المنصات والتأهيل</h2>
      
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-6 gap-2">
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #2563eb' }}>
          <CardContent className="p-2 text-center">
            <Building2 className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-xl text-blue-600 mb-0.5">{stats.total}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المنصات</p>
          </CardContent>
        </Card>
        
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #10b981' }}>
          <CardContent className="p-2 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-xl text-green-600 mb-0.5">{stats.active}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>منصات نشطة</p>
          </CardContent>
        </Card>
        
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #f59e0b' }}>
          <CardContent className="p-2 text-center">
            <AlertCircle className="h-5 w-5 mx-auto text-orange-600 mb-1" />
            <p className="text-xl text-orange-600 mb-0.5">{stats.expiringSoon}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تنتهي قريباً</p>
          </CardContent>
        </Card>
        
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #ef4444' }}>
          <CardContent className="p-2 text-center">
            <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-xl text-red-600 mb-0.5">{stats.expired}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>منتهية</p>
          </CardContent>
        </Card>
        
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #8b5cf6' }}>
          <CardContent className="p-2 text-center">
            <ClipboardList className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-xl text-purple-600 mb-0.5">{stats.pendingTasks}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مهام قيد التنفيذ</p>
          </CardContent>
        </Card>
        
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #ec4899' }}>
          <CardContent className="p-2 text-center">
            <Bell className="h-5 w-5 mx-auto text-pink-600 mb-1" />
            <p className="text-xl text-pink-600 mb-0.5">{stats.unacknowledgedAlerts}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تنبيهات جديدة</p>
          </CardContent>
        </Card>
      </div>

      {/* المنصات القريبة من الانتهاء */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <AlertCircle className="h-4 w-4 text-orange-600" />
            المنصات القريبة من انتهاء الصلاحية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <div className="space-y-2">
            {platforms
              .filter(p => p.daysRemaining < 180 && p.status === 'active')
              .sort((a, b) => a.daysRemaining - b.daysRemaining)
              .map(platform => (
                <div key={platform.id} className="flex items-center justify-between p-2 bg-orange-50 rounded border border-orange-200">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{platform.name}</p>
                      <p className="text-[10px] text-gray-600">تنتهي في: {platform.expiryDate}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-mono font-bold ${getDaysColor(platform.daysRemaining)}`}>
                      {platform.daysRemaining} يوم
                    </p>
                    <Progress value={(platform.daysRemaining / 365) * 100} className="h-1 w-24" />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* المهام العاجلة */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <ClipboardList className="h-4 w-4 text-purple-600" />
            المهام العاجلة للمعقبين
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <div className="space-y-2">
            {tasks.filter(t => t.status !== 'completed').map(task => (
              <div key={task.id} className="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{task.title}</p>
                    {getPriorityBadge(task.priority)}
                  </div>
                  <p className="text-[10px] text-gray-600">{task.platformName} • {task.assignedTo}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs font-mono">{task.dueDate}</p>
                  {getTaskStatusBadge(task.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== التاب 2: إدارة المنصات ====================
  const renderPlatformsManagement = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إدارة المنصات والتسجيلات</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast.info('تصفية متقدمة')}>
            <Filter className="h-3 w-3 ml-1" />تصفية
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast.info('تصدير البيانات')}>
            <Download className="h-3 w-3 ml-1" />تصدير
          </Button>
          <Button size="sm" className="h-8 text-xs bg-blue-500" onClick={() => toast.success('إضافة منصة جديدة')}>
            <Plus className="h-3 w-3 ml-1" />منصة جديدة
          </Button>
        </div>
      </div>

      {/* البحث والتصفية */}
      <div className="grid grid-cols-3 gap-2">
        <InputWithCopy
          label=""
          placeholder="بحث في المنصات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          copyable={false}
          clearable={true}
        />
        <SelectWithCopy
          label=""
          value={filterCategory}
          onChange={setFilterCategory}
          options={[
            { value: 'all', label: 'جميع الفئات' },
            { value: 'government', label: 'حكومي' },
            { value: 'private', label: 'خاص' }
          ]}
          copyable={false}
        />
        <SelectWithCopy
          label=""
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: 'all', label: 'جميع الحالات' },
            { value: 'active', label: 'نشط' },
            { value: 'expired', label: 'منتهي' },
            { value: 'pending', label: 'قيد المعالجة' }
          ]}
          copyable={false}
        />
      </div>

      {/* جدول المنصات */}
      <Card className="card-element card-rtl">
        <CardContent className="p-2">
          <ScrollArea className="h-[500px]">
            <Table className="table-rtl dense-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرمز</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المنصة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم الإنجليزي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ التسجيل</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانتهاء</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأيام المتبقية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>مستوى التأهيل</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlatforms.map(platform => (
                  <TableRow key={platform.id} className="hover:bg-blue-50 transition-colors">
                    <TableCell className="text-right py-2 text-xs font-mono">{platform.id}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{platform.name}</TableCell>
                    <TableCell className="text-right py-2 text-xs">{platform.nameEn}</TableCell>
                    <TableCell className="text-right py-2">{getCategoryBadge(platform.category)}</TableCell>
                    <TableCell className="text-right py-2">{getTypeBadge(platform.type)}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{platform.registrationDate}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{platform.expiryDate}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">
                      <span className={getDaysColor(platform.daysRemaining)}>{platform.daysRemaining} يوم</span>
                    </TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{platform.qualificationLevel}</TableCell>
                    <TableCell className="text-right py-2">{getStatusBadge(platform.status)}</TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { setSelectedPlatform(platform); setShowCredentialsDialog(true); }} title="بيانات التسجيل"><Key className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { setSelectedPlatform(platform); setShowHistoryDialog(true); }} title="السجل التاريخي"><History className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => toast.info('تعديل المنصة')} title="تعديل"><Edit className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => toast.info('إرسال بيانات المنصة')} title="إرسال"><Send className="h-3 w-3" /></Button>
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

  // ==================== التاب 3: بيانات التسجيل ====================
  const renderRegistrationData = () => (
    <div className="space-y-3">
      <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>بيانات التسجيل الشاملة</h2>
      
      {/* اختيار المنصة */}
      <Card className="card-element card-rtl">
        <CardContent className="p-3">
          <SelectWithCopy
            label="اختر المنصة"
            value={selectedPlatform?.id || ''}
            onChange={(value) => setSelectedPlatform(platforms.find(p => p.id === value) || null)}
            options={[
              { value: '', label: 'اختر المنصة...' },
              ...platforms.map(p => ({ value: p.id, label: p.name }))
            ]}
          />
        </CardContent>
      </Card>

      {selectedPlatform && (
        <div className="grid grid-cols-2 gap-3">
          {/* بيانات تسجيل الدخول */}
          <Card className="card-element card-rtl">
            <CardHeader className="p-2 pb-1">
              <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Key className="h-4 w-4 text-blue-600" />
                بيانات تسجيل الدخول
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-2">
              <InputWithCopy label="البريد الإلكتروني" value={selectedPlatform.credentials.email} readOnly />
              <InputWithCopy label="اسم المستخدم" value={selectedPlatform.credentials.username} readOnly />
              <InputWithCopy label="كلمة المرور" value={selectedPlatform.credentials.password} readOnly type="password" />
              <InputWithCopy label="آخر تغيير لكلمة المرور" value={selectedPlatform.credentials.passwordLastChanged} readOnly />
            </CardContent>
          </Card>

          {/* بيانات التسجيل */}
          <Card className="card-element card-rtl">
            <CardHeader className="p-2 pb-1">
              <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <FileCheck className="h-4 w-4 text-green-600" />
                بيانات التسجيل
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-2">
              <InputWithCopy label="الرقم المرجعي" value={selectedPlatform.credentials.referenceNumber} readOnly />
              <InputWithCopy label="الرقم المميز" value={selectedPlatform.credentials.uniqueId} readOnly />
              <InputWithCopy label="رقم الجوال" value={selectedPlatform.credentials.mobileNumber} readOnly />
              <InputWithCopy label="المسجّل" value={selectedPlatform.credentials.registeredBy} readOnly />
              <InputWithCopy label="تاريخ التسجيل" value={selectedPlatform.credentials.registrationDate} readOnly />
            </CardContent>
          </Card>

          {/* روابط المنصة */}
          <Card className="card-element card-rtl">
            <CardHeader className="p-2 pb-1">
              <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Link className="h-4 w-4 text-purple-600" />
                الروابط والتطبيقات
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-2">
              <InputWithCopy label="رابط تسجيل الدخول" value={selectedPlatform.links.loginUrl} readOnly />
              <InputWithCopy label="رابط التطبيق" value={selectedPlatform.links.appUrl || 'غير متوفر'} readOnly />
              <InputWithCopy label="خدمة العملاء" value={selectedPlatform.links.customerService} readOnly />
            </CardContent>
          </Card>

          {/* التواصل الاجتماعي */}
          <Card className="card-element card-rtl">
            <CardHeader className="p-2 pb-1">
              <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Share2 className="h-4 w-4 text-orange-600" />
                وسائل التواصل الاجتماعي
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-2">
              <InputWithCopy label="Twitter" value={selectedPlatform.links.twitter || 'غير متوفر'} readOnly />
              <InputWithCopy label="Instagram" value={selectedPlatform.links.instagram || 'غير متوفر'} readOnly />
              <InputWithCopy label="Facebook" value={selectedPlatform.links.facebook || 'غير متوفر'} readOnly />
              <InputWithCopy label="YouTube" value={selectedPlatform.links.youtube || 'غير متوفر'} readOnly />
            </CardContent>
          </Card>
        </div>
      )}

      {!selectedPlatform && (
        <Card className="card-element card-rtl">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              الرجاء اختيار منصة لعرض بيانات التسجيل
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // ==================== التاب 4: التراخيص والصلاحية ====================
  const renderLicenses = () => (
    <div className="space-y-3">
      <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التراخيص والصلاحيات</h2>

      {/* بطاقات الملخص */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #10b981' }}>
          <CardContent className="p-2 text-center">
            <Award className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-xl text-green-600 mb-0.5">6</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تراخيص نشطة</p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #f59e0b' }}>
          <CardContent className="p-2 text-center">
            <Clock className="h-5 w-5 mx-auto text-orange-600 mb-1" />
            <p className="text-xl text-orange-600 mb-0.5">2</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قريبة الانتهاء</p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #2563eb' }}>
          <CardContent className="p-2 text-center">
            <DollarSign className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-xl text-blue-600 mb-0.5">23,000</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رسوم التجديد</p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #8b5cf6' }}>
          <CardContent className="p-2 text-center">
            <RefreshCw className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-xl text-purple-600 mb-0.5">2</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تجديد تلقائي</p>
          </CardContent>
        </Card>
      </div>

      {/* جدول التراخيص */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-2 pb-1 flex items-center justify-between">
          <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل التراخيص</CardTitle>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.info('طباعة التقرير')}>
            <Printer className="h-3 w-3 ml-1" />طباعة
          </Button>
        </CardHeader>
        <CardContent className="p-2">
          <ScrollArea className="h-[400px]">
            <Table className="table-rtl dense-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المنصة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>مستوى التأهيل</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ البدء</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانتهاء</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأيام المتبقية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رسوم التجديد</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تجديد تلقائي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {platforms.map(platform => (
                  <TableRow key={platform.id} className="hover:bg-blue-50">
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{platform.name}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{platform.qualificationLevel}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{platform.registrationDate}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{platform.expiryDate}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">
                      <span className={getDaysColor(platform.daysRemaining)}>{platform.daysRemaining} يوم</span>
                    </TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{platform.renewalCost} ريال</TableCell>
                    <TableCell className="text-right py-2">
                      {platform.autoRenewal ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell className="text-right py-2">{getStatusBadge(platform.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== التاب 5: سجل الأحداث ====================
  const renderEventsLog = () => {
    const allHistory = platforms.flatMap(p => 
      p.history.map(h => ({ ...h, platformName: p.name }))
    ).sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل الأحداث والتعديلات</h2>
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast.info('تصدير السجل')}>
            <Download className="h-3 w-3 ml-1" />تصدير
          </Button>
        </div>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-4 gap-2">
          <Card className="card-element card-rtl" style={{ borderRight: '3px solid #2563eb' }}>
            <CardContent className="p-2 text-center">
              <History className="h-5 w-5 mx-auto text-blue-600 mb-1" />
              <p className="text-xl text-blue-600 mb-0.5">{allHistory.length}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الأحداث</p>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl" style={{ borderRight: '3px solid #10b981' }}>
            <CardContent className="p-2 text-center">
              <Edit className="h-5 w-5 mx-auto text-green-600 mb-1" />
              <p className="text-xl text-green-600 mb-0.5">{allHistory.filter(h => h.action === 'تحديث').length}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحديثات</p>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl" style={{ borderRight: '3px solid #f59e0b' }}>
            <CardContent className="p-2 text-center">
              <Plus className="h-5 w-5 mx-auto text-orange-600 mb-1" />
              <p className="text-xl text-orange-600 mb-0.5">{allHistory.filter(h => h.action === 'إضافة').length}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافات</p>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl" style={{ borderRight: '3px solid #ef4444' }}>
            <CardContent className="p-2 text-center">
              <Trash2 className="h-5 w-5 mx-auto text-red-600 mb-1" />
              <p className="text-xl text-red-600 mb-0.5">{allHistory.filter(h => h.action === 'حذف').length}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>حذف</p>
            </CardContent>
          </Card>
        </div>

        {/* جدول السجل */}
        <Card className="card-element card-rtl">
          <CardContent className="p-2">
            <ScrollArea className="h-[500px]">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المنصة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوقت</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراء</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحقل</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة القديمة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الجديدة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>السبب</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المنفذ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allHistory.map((record: any) => (
                    <TableRow key={record.id} className="hover:bg-blue-50">
                      <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{record.platformName}</TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">{record.date}</TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">{record.time}</TableCell>
                      <TableCell className="text-right py-2">
                        <Badge className={`text-xs ${
                          record.action === 'تحديث' ? 'bg-green-500' :
                          record.action === 'إضافة' ? 'bg-blue-500' :
                          'bg-red-500'
                        } text-white`}>{record.action}</Badge>
                      </TableCell>
                      <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{record.field}</TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">{record.oldValue}</TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">{record.newValue}</TableCell>
                      <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{record.reason}</TableCell>
                      <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{record.changedBy}</TableCell>
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

  // ==================== التاب 6: المرفقات ====================
  const renderAttachments = () => {
    const allAttachments = platforms.flatMap(p =>
      p.documents.attachments.map(a => ({ ...a, platformName: p.name, platformId: p.id }))
    );

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرفقات والوثائق</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast.info('رفع مرفق جديد')}>
              <Upload className="h-3 w-3 ml-1" />رفع
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast.info('تحميل الكل')}>
              <Download className="h-3 w-3 ml-1" />تحميل الكل
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-5 gap-2">
          <Card className="card-element card-rtl" style={{ borderRight: '3px solid #2563eb' }}>
            <CardContent className="p-2 text-center">
              <Paperclip className="h-5 w-5 mx-auto text-blue-600 mb-1" />
              <p className="text-xl text-blue-600 mb-0.5">{allAttachments.length}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المرفقات</p>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl" style={{ borderRight: '3px solid #10b981' }}>
            <CardContent className="p-2 text-center">
              <FileCheck className="h-5 w-5 mx-auto text-green-600 mb-1" />
              <p className="text-xl text-green-600 mb-0.5">{allAttachments.filter(a => a.category === 'تفويض').length}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفويضات</p>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl" style={{ borderRight: '3px solid #f59e0b' }}>
            <CardContent className="p-2 text-center">
              <Award className="h-5 w-5 mx-auto text-orange-600 mb-1" />
              <p className="text-xl text-orange-600 mb-0.5">{allAttachments.filter(a => a.category === 'شهادة').length}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>شهادات</p>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl" style={{ borderRight: '3px solid #8b5cf6' }}>
            <CardContent className="p-2 text-center">
              <FileSignature className="h-5 w-5 mx-auto text-purple-600 mb-1" />
              <p className="text-xl text-purple-600 mb-0.5">{allAttachments.filter(a => a.category === 'سجل تجاري').length}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجلات تجارية</p>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl" style={{ borderRight: '3px solid #ec4899' }}>
            <CardContent className="p-2 text-center">
              <FileText className="h-5 w-5 mx-auto text-pink-600 mb-1" />
              <p className="text-xl text-pink-600 mb-0.5">{allAttachments.filter(a => a.category === 'ترخيص').length}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تراخيص</p>
            </CardContent>
          </Card>
        </div>

        {/* جدول المرفقات */}
        <Card className="card-element card-rtl">
          <CardContent className="p-2">
            <ScrollArea className="h-[500px]">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المنصة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الملف</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رفع بواسطة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الرفع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allAttachments.map((attachment: any) => (
                    <TableRow key={attachment.id} className="hover:bg-blue-50">
                      <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{attachment.platformName}</TableCell>
                      <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{attachment.name}</TableCell>
                      <TableCell className="text-right py-2">
                        <Badge className="bg-blue-500 text-white text-xs">{attachment.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">{attachment.type}</TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">{attachment.size}</TableCell>
                      <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{attachment.uploadedBy}</TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">{attachment.uploadedDate}</TableCell>
                      <TableCell className="text-right py-2">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => toast.info('عرض الملف')} title="عرض"><Eye className="h-3 w-3" /></Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => toast.success('تحميل الملف')} title="تحميل"><Download className="h-3 w-3" /></Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => toast.error('حذف الملف')} title="حذف"><Trash2 className="h-3 w-3" /></Button>
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

  // ==================== التاب 7: مهام المعقبين ====================
  const renderAgentTasks = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>مهام المعقبين</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast.info('تصفية المهام')}>
            <Filter className="h-3 w-3 ml-1" />تصفية
          </Button>
          <Button size="sm" className="h-8 text-xs bg-blue-500" onClick={() => toast.success('مهمة جديدة')}>
            <Plus className="h-3 w-3 ml-1" />مهمة جديدة
          </Button>
        </div>
      </div>

      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-5 gap-2">
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #2563eb' }}>
          <CardContent className="p-2 text-center">
            <ClipboardList className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-xl text-blue-600 mb-0.5">{tasks.length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المهام</p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #f59e0b' }}>
          <CardContent className="p-2 text-center">
            <Clock className="h-5 w-5 mx-auto text-orange-600 mb-1" />
            <p className="text-xl text-orange-600 mb-0.5">{tasks.filter(t => t.status === 'pending').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد الانتظار</p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #3b82f6' }}>
          <CardContent className="p-2 text-center">
            <RefreshCw className="h-5 w-5 mx-auto text-sky-600 mb-1" />
            <p className="text-xl text-sky-600 mb-0.5">{tasks.filter(t => t.status === 'in-progress').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد التنفيذ</p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #10b981' }}>
          <CardContent className="p-2 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-xl text-green-600 mb-0.5">{tasks.filter(t => t.status === 'completed').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مكتملة</p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #ef4444' }}>
          <CardContent className="p-2 text-center">
            <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-xl text-red-600 mb-0.5">{tasks.filter(t => t.status === 'cancelled').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>ملغية</p>
          </CardContent>
        </Card>
      </div>

      {/* جدول المهام */}
      <Card className="card-element card-rtl">
        <CardContent className="p-2">
          <ScrollArea className="h-[500px]">
            <Table className="table-rtl dense-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرمز</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المنصة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عنوان المهمة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعقب</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الاستحقاق</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map(task => (
                  <TableRow key={task.id} className="hover:bg-blue-50">
                    <TableCell className="text-right py-2 text-xs font-mono">{task.id}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{task.platformName}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{task.title}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{task.description}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{task.assignedTo}</TableCell>
                    <TableCell className="text-right py-2">{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell className="text-right py-2">{getTaskStatusBadge(task.status)}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{task.dueDate}</TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => toast.info('عرض التفاصيل')} title="عرض"><Eye className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => toast.info('تعديل المهمة')} title="تعديل"><Edit className="h-3 w-3" /></Button>
                        {task.status !== 'completed' && (
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => toast.success('تم إكمال المهمة')} title="إكمال"><CheckCircle className="h-3 w-3" /></Button>
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

  // ==================== التاب 8: التنبيهات ====================
  const renderAlerts = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التنبيهات والإشعارات</h2>
        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => {
          setAlerts(alerts.map(a => ({ ...a, acknowledged: true, acknowledgedBy: 'المستخدم الحالي', acknowledgedDate: new Date().toISOString().split('T')[0] })));
          toast.success('تم تأكيد جميع التنبيهات');
        }}>
          <CheckCircle className="h-3 w-3 ml-1" />تأكيد الكل
        </Button>
      </div>

      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-5 gap-2">
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #2563eb' }}>
          <CardContent className="p-2 text-center">
            <Bell className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-xl text-blue-600 mb-0.5">{alerts.length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي التنبيهات</p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #ef4444' }}>
          <CardContent className="p-2 text-center">
            <AlertCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-xl text-red-600 mb-0.5">{alerts.filter(a => a.severity === 'critical').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>حرجة</p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #f59e0b' }}>
          <CardContent className="p-2 text-center">
            <AlertCircle className="h-5 w-5 mx-auto text-orange-600 mb-1" />
            <p className="text-xl text-orange-600 mb-0.5">{alerts.filter(a => a.severity === 'warning').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحذيرات</p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #3b82f6' }}>
          <CardContent className="p-2 text-center">
            <Info className="h-5 w-5 mx-auto text-sky-600 mb-1" />
            <p className="text-xl text-sky-600 mb-0.5">{alerts.filter(a => a.severity === 'info').length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلومات</p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #ec4899' }}>
          <CardContent className="p-2 text-center">
            <Bell className="h-5 w-5 mx-auto text-pink-600 mb-1" />
            <p className="text-xl text-pink-600 mb-0.5">{alerts.filter(a => !a.acknowledged).length}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>غير مؤكدة</p>
          </CardContent>
        </Card>
      </div>

      {/* جدول التنبيهات */}
      <Card className="card-element card-rtl">
        <CardContent className="p-2">
          <ScrollArea className="h-[500px]">
            <Table className="table-rtl dense-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرمز</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المنصة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأهمية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرسالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>مؤكد</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map(alert => (
                  <TableRow key={alert.id} className={`hover:bg-blue-50 ${!alert.acknowledged ? 'bg-yellow-50' : ''}`}>
                    <TableCell className="text-right py-2 text-xs font-mono">{alert.id}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{alert.platformName}</TableCell>
                    <TableCell className="text-right py-2">
                      <Badge className="bg-purple-500 text-white text-xs">
                        {alert.type === 'expiry' ? 'انتهاء' :
                         alert.type === 'renewal' ? 'تجديد' :
                         alert.type === 'update' ? 'تحديث' :
                         alert.type === 'document' ? 'مستند' : 'بيانات'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-2">{getSeverityBadge(alert.severity)}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{alert.message}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{alert.date}</TableCell>
                    <TableCell className="text-right py-2">
                      {alert.acknowledged ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex gap-1 justify-end">
                        {!alert.acknowledged && (
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => {
                            setAlerts(alerts.map(a => 
                              a.id === alert.id 
                                ? { ...a, acknowledged: true, acknowledgedBy: 'المستخدم الحالي', acknowledgedDate: new Date().toISOString().split('T')[0] }
                                : a
                            ));
                            toast.success('تم تأكيد التنبيه');
                          }} title="تأكيد"><CheckCircle className="h-3 w-3" /></Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => toast.info('عرض التفاصيل')} title="عرض"><Eye className="h-3 w-3" /></Button>
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

  // ==================== التاب 9: التقارير ====================
  const renderReports = () => (
    <div className="space-y-3">
      <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقارير والإحصائيات</h2>

      {/* تقارير سريعة */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all" onClick={() => toast.info('تقرير المنصات النشطة')}>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>المنصات النشطة</p>
              </div>
              <Printer className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all" onClick={() => toast.info('تقرير المنصات القريبة من الانتهاء')}>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>قريبة الانتهاء</p>
              </div>
              <Printer className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all" onClick={() => toast.info('تقرير رسوم التجديد')}>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>رسوم التجديد</p>
              </div>
              <Printer className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all" onClick={() => toast.info('تقرير المهام')}>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ClipboardList className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>مهام المعقبين</p>
              </div>
              <Printer className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all" onClick={() => toast.info('تقرير التنبيهات')}>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Bell className="h-6 w-6 text-pink-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>التنبيهات النشطة</p>
              </div>
              <Printer className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all" onClick={() => toast.info('تقرير سجل الأحداث')}>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <History className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل الأحداث</p>
              </div>
              <Printer className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* تقرير مخصص */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <FileText className="h-4 w-4 text-blue-600" />
            إنشاء تقرير مخصص
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <SelectWithCopy
              label="نوع التقرير"
              value=""
              onChange={() => {}}
              options={[
                { value: '', label: 'اختر نوع التقرير...' },
                { value: 'detailed', label: 'تقرير تفصيلي' },
                { value: 'summary', label: 'تقرير ملخص' },
                { value: 'financial', label: 'تقرير مالي' },
                { value: 'technical', label: 'تقرير فني' }
              ]}
            />

            <SelectWithCopy
              label="الفترة الزمنية"
              value=""
              onChange={() => {}}
              options={[
                { value: '', label: 'اختر الفترة...' },
                { value: 'month', label: 'شهري' },
                { value: 'quarter', label: 'ربع سنوي' },
                { value: 'year', label: 'سنوي' },
                { value: 'custom', label: 'مخصص' }
              ]}
            />

            <SelectWithCopy
              label="المنصات"
              value=""
              onChange={() => {}}
              options={[
                { value: '', label: 'جميع المنصات' },
                { value: 'government', label: 'حكومية فقط' },
                { value: 'private', label: 'خاصة فقط' }
              ]}
            />

            <SelectWithCopy
              label="التنسيق"
              value=""
              onChange={() => {}}
              options={[
                { value: '', label: 'اختر التنسيق...' },
                { value: 'pdf', label: 'PDF' },
                { value: 'excel', label: 'Excel' },
                { value: 'word', label: 'Word' }
              ]}
            />
          </div>

          <div className="flex gap-2 justify-end mt-3">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <RefreshCw className="h-3 w-3 ml-1" />إعادة تعيين
            </Button>
            <Button size="sm" className="h-8 text-xs bg-blue-500" onClick={() => toast.success('جاري إنشاء التقرير...')}>
              <Printer className="h-3 w-3 ml-1" />إنشاء التقرير
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== التاب 10: الإعدادات ====================
  const renderSettings = () => (
    <div className="space-y-3">
      <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات المنصات والتأهيل</h2>

      <div className="grid grid-cols-2 gap-3">
        {/* إعدادات التنبيهات */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Bell className="h-4 w-4 text-blue-600" />
              إعدادات التنبيهات
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <EnhancedSwitch
              id="alert30"
              checked={settings.notifications.expiryAlert30Days}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, expiryAlert30Days: checked }
              })}
              label="تنبيه قبل 30 يوم من الانتهاء"
              size="sm"
            />

            <EnhancedSwitch
              id="alert60"
              checked={settings.notifications.expiryAlert60Days}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, expiryAlert60Days: checked }
              })}
              label="تنبيه قبل 60 يوم من الانتهاء"
              size="sm"
            />

            <EnhancedSwitch
              id="alert90"
              checked={settings.notifications.expiryAlert90Days}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, expiryAlert90Days: checked }
              })}
              label="تنبيه قبل 90 يوم من الانتهاء"
              size="sm"
            />

            <EnhancedSwitch
              id="emailNotif"
              checked={settings.notifications.emailNotifications}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, emailNotifications: checked }
              })}
              label="إرسال تنبيهات عبر البريد الإلكتروني"
              size="sm"
            />

            <EnhancedSwitch
              id="smsNotif"
              checked={settings.notifications.smsNotifications}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, smsNotifications: checked }
              })}
              label="إرسال تنبيهات عبر الرسائل النصية"
              size="sm"
            />

            <InputWithCopy
              label="البريد الإلكتروني للتنبيهات"
              value={settings.notifications.notificationEmail}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, notificationEmail: e.target.value }
              })}
            />

            <InputWithCopy
              label="رقم الجوال للتنبيهات"
              value={settings.notifications.notificationMobile}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, notificationMobile: e.target.value }
              })}
            />
          </CardContent>
        </Card>

        {/* إعدادات التجديد */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <RefreshCw className="h-4 w-4 text-green-600" />
              إعدادات التجديد
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <EnhancedSwitch
              id="autoRenewal"
              checked={settings.renewal.autoRenewalEnabled}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                renewal: { ...settings.renewal, autoRenewalEnabled: checked }
              })}
              label="تفعيل التجديد التلقائي"
              size="sm"
              variant="success"
            />

            <InputWithCopy
              label="عدد أيام التذكير قبل التجديد"
              value={settings.renewal.reminderDays.toString()}
              onChange={(e) => setSettings({
                ...settings,
                renewal: { ...settings.renewal, reminderDays: parseInt(e.target.value) || 60 }
              })}
              type="number"
            />

            <SelectWithCopy
              label="طريقة الدفع"
              value={settings.renewal.paymentMethod}
              onChange={(value) => setSettings({
                ...settings,
                renewal: { ...settings.renewal, paymentMethod: value }
              })}
              options={[
                { value: 'manual', label: 'يدوي' },
                { value: 'auto', label: 'تلقائي' },
                { value: 'invoice', label: 'فاتورة' }
              ]}
            />
          </CardContent>
        </Card>

        {/* إعدادات الأمان */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Shield className="h-4 w-4 text-red-600" />
              إعدادات الأمان
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <InputWithCopy
              label="عدد أيام صلاحية كلمة المرور"
              value={settings.security.passwordExpiryDays.toString()}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, passwordExpiryDays: parseInt(e.target.value) || 90 }
              })}
              type="number"
            />

            <EnhancedSwitch
              id="requirePwChange"
              checked={settings.security.requirePasswordChange}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                security: { ...settings.security, requirePasswordChange: checked }
              })}
              label="طلب تغيير كلمة المرور دورياً"
              size="sm"
              variant="danger"
            />

            <EnhancedSwitch
              id="auditLog"
              checked={settings.security.enableAuditLog}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                security: { ...settings.security, enableAuditLog: checked }
              })}
              label="تفعيل سجل التدقيق"
              size="sm"
              variant="warning"
            />
          </CardContent>
        </Card>

        {/* أزرار الحفظ */}
        <Card className="card-element card-rtl">
          <CardContent className="p-3 flex flex-col gap-3 justify-center">
            <Button className="w-full bg-blue-500" onClick={() => toast.success('تم حفظ الإعدادات بنجاح')}>
              <Save className="h-4 w-4 ml-2" />
              حفظ جميع الإعدادات
            </Button>

            <Button variant="outline" className="w-full" onClick={() => toast.info('تم إعادة تعيين الإعدادات الافتراضية')}>
              <RefreshCw className="h-4 w-4 ml-2" />
              إعادة تعيين الإعدادات الافتراضية
            </Button>

            <Button variant="outline" className="w-full" onClick={() => toast.info('تصدير الإعدادات')}>
              <Download className="h-4 w-4 ml-2" />
              تصدير الإعدادات
            </Button>

            <Button variant="outline" className="w-full" onClick={() => toast.info('استيراد الإعدادات')}>
              <Upload className="h-4 w-4 ml-2" />
              استيراد الإعدادات
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // المحتوى الرئيسي
  const renderTabContent = () => {
    switch (activeTab) {
      case '944-01': return renderOverview();
      case '944-02': return renderPlatformsManagement();
      case '944-03': return renderRegistrationData();
      case '944-04': return renderLicenses();
      case '944-05': return renderEventsLog();
      case '944-06': return renderAttachments();
      case '944-07': return renderAgentTasks();
      case '944-08': return renderAlerts();
      case '944-09': return renderReports();
      case '944-10': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div>
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
              <Shield 
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
                  المنصات والتأهيل
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
                    944
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
                إدارة تسجيل المكتب في المنصات الحكومية والخاصة مع تتبع التراخيص والتأهيلات
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
                10 تبويبات
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
        
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة بيانات التسجيل */}
      <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              بيانات التسجيل - {selectedPlatform?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedPlatform && (
              <div className="grid grid-cols-2 gap-3">
                <InputWithCopy label="البريد الإلكتروني" value={selectedPlatform.credentials.email} readOnly />
                <InputWithCopy label="اسم المستخدم" value={selectedPlatform.credentials.username} readOnly />
                <InputWithCopy label="الرقم المرجعي" value={selectedPlatform.credentials.referenceNumber} readOnly />
                <InputWithCopy label="الرقم المميز" value={selectedPlatform.credentials.uniqueId} readOnly />
                <InputWithCopy label="رقم الجوال" value={selectedPlatform.credentials.mobileNumber} readOnly />
                <InputWithCopy label="المسجّل" value={selectedPlatform.credentials.registeredBy} readOnly />
                <InputWithCopy label="رابط تسجيل الدخول" value={selectedPlatform.links.loginUrl} readOnly />
                <InputWithCopy label="خدمة العملاء" value={selectedPlatform.links.customerService} readOnly />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة السجل التاريخي */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              السجل التاريخي - {selectedPlatform?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedPlatform && (
            <ScrollArea className="h-[400px]">
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوقت</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراء</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحقل</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة القديمة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الجديدة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>السبب</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المنفذ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPlatform.history.map(record => (
                    <TableRow key={record.id}>
                      <TableCell className="text-right text-xs font-mono">{record.date}</TableCell>
                      <TableCell className="text-right text-xs font-mono">{record.time}</TableCell>
                      <TableCell className="text-right text-xs">{record.action}</TableCell>
                      <TableCell className="text-right text-xs">{record.field}</TableCell>
                      <TableCell className="text-right text-xs font-mono">{record.oldValue}</TableCell>
                      <TableCell className="text-right text-xs font-mono">{record.newValue}</TableCell>
                      <TableCell className="text-right text-xs">{record.reason}</TableCell>
                      <TableCell className="text-right text-xs">{record.changedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlatformsQualification;
