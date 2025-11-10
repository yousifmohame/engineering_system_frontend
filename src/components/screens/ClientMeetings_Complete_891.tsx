/**
 * الشاشة 891 - مقابلات العملاء الشاملة
 * ===========================================================================
 * 
 * نظام متكامل لإدارة جميع المقابلات مع العملاء
 * 
 * المميزات:
 * - تسجيل تفصيلي لكل مقابلة
 * - إدارة المخرجات (طلبات للعميل وطلبات من العميل)
 * - ربط المقابلات بالمعاملات
 * - Timeline تفاعلي
 * - نظام ملاحظات شامل
 * - 12 تاباً شاملاً
 * 
 * @version 1.0
 * @date نوفمبر 2025
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import {
  Users, Calendar, Clock, MapPin, FileText, CheckCircle, 
  AlertCircle, Plus, Edit, Save, Eye, Trash2, Link,
  UserCheck, UserPlus, UserX, MessageSquare, ClipboardList,
  Target, ArrowRight, ArrowLeft, Building2, Phone, Mail,
  Video, Coffee, Briefcase, TrendingUp, XCircle, Download,
  Upload, Filter, Search, BarChart3, PieChart, History,
  Settings, Star, Flag, Archive, Send, Paperclip, Hash
} from 'lucide-react';
import { toast } from 'sonner';

// ===== الواجهات =====

interface ClientMeeting {
  id: string;
  meetingNumber: string;
  date: string;
  time: string;
  duration: number; // بالدقائق
  location: string;
  locationType: 'مكتب' | 'موقع المشروع' | 'مكتب العميل' | 'عن بُعد' | 'أخرى';
  
  // بيانات العميل
  clientId: string;
  clientName: string;
  clientType: 'محتمل' | 'جديد' | 'قديم';
  clientCategory: 'VIP' | 'عادي' | 'حكومي' | 'خاص';
  clientPhone: string;
  clientEmail: string;
  
  // معلومات المقابلة
  meetingType: 'استشارة' | 'متابعة' | 'عرض مشروع' | 'تسليم' | 'توقيع عقد' | 'شكوى' | 'أخرى';
  meetingPurpose: string;
  meetingAgenda: string[];
  
  // الحضور
  attendees: Array<{
    id: string;
    name: string;
    role: string;
    type: 'موظف' | 'عميل' | 'طرف ثالث';
    attended: boolean;
  }>;
  
  // من دعا للمقابلة
  calledBy: {
    name: string;
    role: string;
  };
  
  // الربط بالمعاملة
  linkedTransaction?: {
    id: string;
    number: string;
    type: string;
    status: string;
  };
  
  // المخرجات - طلبات للعميل
  requestsToClient: Array<{
    id: string;
    description: string;
    type: 'مستند' | 'معلومات' | 'موافقة' | 'دفعة' | 'توقيع' | 'أخرى';
    priority: 'عاجل' | 'عالي' | 'متوسط' | 'منخفض';
    deadline: string;
    status: 'معلق' | 'مستلم' | 'ناقص' | 'مرفوض';
    assignedTo: string;
    notes: string;
    completionDate?: string;
  }>;
  
  // المخرجات - طلبات من العميل
  requestsFromClient: Array<{
    id: string;
    description: string;
    type: 'استشارة' | 'تعديل' | 'معلومات' | 'تقرير' | 'مخططات' | 'أخرى';
    priority: 'عاجل' | 'عالي' | 'متوسط' | 'منخفض';
    deadline: string;
    status: 'قيد التنفيذ' | 'مكتمل' | 'متأخر' | 'معلق';
    assignedTo: string;
    notes: string;
    completionDate?: string;
    completionPercent: number;
  }>;
  
  // ملاحظات المقابلة
  meetingSummary: string;
  keyPoints: string[];
  decisions: string[];
  nextSteps: string[];
  
  // المرفقات
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
  }>;
  
  // التقييم
  meetingRating?: number; // 1-5
  clientSatisfaction?: number; // 1-5
  
  // الحالة
  status: 'مجدول' | 'منعقد' | 'ملغي' | 'مؤجل';
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

const ClientMeetingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('891-01');
  const [showMeetingDialog, setShowMeetingDialog] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<ClientMeeting | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterClientType, setFilterClientType] = useState<string>('all');

  const TABS_CONFIG: TabConfig[] = [
    { id: '891-01', number: '891-01', title: 'نظرة عامة', icon: BarChart3 },
    { id: '891-02', number: '891-02', title: 'قائمة المقابلات', icon: ClipboardList },
    { id: '891-03', number: '891-03', title: 'Timeline المقابلات', icon: History },
    { id: '891-04', number: '891-04', title: 'طلبات للعملاء', icon: ArrowRight },
    { id: '891-05', number: '891-05', title: 'طلبات من العملاء', icon: ArrowLeft },
    { id: '891-06', number: '891-06', title: 'المقابلات المجدولة', icon: Calendar },
    { id: '891-07', number: '891-07', title: 'المقابلات المنعقدة', icon: CheckCircle },
    { id: '891-08', number: '891-08', title: 'ربط المعاملات', icon: Link },
    { id: '891-09', number: '891-09', title: 'تقييم المقابلات', icon: Star },
    { id: '891-10', number: '891-10', title: 'المرفقات والوثائق', icon: Paperclip },
    { id: '891-11', number: '891-11', title: 'التقارير والإحصائيات', icon: PieChart },
    { id: '891-12', number: '891-12', title: 'الإعدادات', icon: Settings },
  ];

  // بيانات وهمية شاملة
  const meetings: ClientMeeting[] = useMemo(() => [
    {
      id: 'MTG001',
      meetingNumber: 'MTG-2025-001',
      date: '2025-01-15',
      time: '10:00',
      duration: 90,
      location: 'قاعة الاجتماعات الرئيسية - الدور الثاني',
      locationType: 'مكتب',
      
      clientId: 'CLT-001',
      clientName: 'المهندس فهد بن عبدالله الدوسري',
      clientType: 'جديد',
      clientCategory: 'VIP',
      clientPhone: '+966501234567',
      clientEmail: 'fahad@example.com',
      
      meetingType: 'استشارة',
      meetingPurpose: 'مناقشة مشروع فيلا سكنية جديدة',
      meetingAgenda: [
        'مراجعة متطلبات العميل',
        'عرض نماذج التصاميم',
        'مناقشة الميزانية والجدول الزمني',
        'توضيح خطوات العمل',
      ],
      
      attendees: [
        { id: 'ATT001', name: 'المهندس أحمد السعيد', role: 'مدير المشاريع', type: 'موظف', attended: true },
        { id: 'ATT002', name: 'المهندسة نورة القحطاني', role: 'مصممة معمارية', type: 'موظف', attended: true },
        { id: 'ATT003', name: 'فهد الدوسري', role: 'المالك', type: 'عميل', attended: true },
        { id: 'ATT004', name: 'زوجة العميل', role: 'مالكة مشارك��', type: 'عميل', attended: true },
      ],
      
      calledBy: {
        name: 'المهندس أحمد السعيد',
        role: 'مدير المشاريع'
      },
      
      linkedTransaction: {
        id: 'TRN-2025-001',
        number: '2501001',
        type: 'فيلا سكنية',
        status: 'جديدة'
      },
      
      requestsToClient: [
        {
          id: 'RTC001',
          description: 'صورة من صك الملكية',
          type: 'مستند',
          priority: 'عاجل',
          deadline: '2025-01-20',
          status: 'مستلم',
          assignedTo: 'قسم التوثيق',
          notes: 'تم الاستلام بتاريخ 2025-01-18',
          completionDate: '2025-01-18'
        },
        {
          id: 'RTC002',
          description: 'الموافقة على التصميم المبدئي',
          type: 'موافقة',
          priority: 'عالي',
          deadline: '2025-01-25',
          status: 'معلق',
          assignedTo: 'قسم التصميم',
          notes: 'في انتظار مراجعة العميل'
        },
        {
          id: 'RTC003',
          description: 'دفعة الحجز 10%',
          type: 'دفعة',
          priority: 'عالي',
          deadline: '2025-01-22',
          status: 'معلق',
          assignedTo: 'القسم المالي',
          notes: 'بانتظار التحويل البنكي'
        }
      ],
      
      requestsFromClient: [
        {
          id: 'RFC001',
          description: 'عمل دراسة لإمكانية إضافة مسبح',
          type: 'استشارة',
          priority: 'متوسط',
          deadline: '2025-01-30',
          status: 'قيد التنفيذ',
          assignedTo: 'المهندس أحمد السعيد',
          notes: 'جاري دراسة الجدوى الفنية والتكلفة',
          completionPercent: 60
        },
        {
          id: 'RFC002',
          description: 'تقرير مفصل عن خيارات التشطيبات',
          type: 'تقرير',
          priority: 'عالي',
          deadline: '2025-01-28',
          status: 'مكتمل',
          assignedTo: 'المهندسة نورة القحطاني',
          notes: 'تم تسليم التقرير للعميل',
          completionDate: '2025-01-26',
          completionPercent: 100
        }
      ],
      
      meetingSummary: 'اجتماع ناجح ومثمر مع عميل جديد من فئة VIP. تم مناقشة جميع متطلبات المشروع وعرض نماذج مشابهة. أبدى العميل إعجابه الشديد بأعمالنا السابقة.',
      keyPoints: [
        'العميل يفضل التصميم العصري بلمسات تراثية',
        'الميزانية الإجمالية: 2.5 مليون ريال',
        'المدة المتوقعة: 18 شهراً',
        'يرغب في البدء بأسرع وقت ممكن'
      ],
      decisions: [
        'اعتماد التصميم المبدئي رقم 3',
        'البدء بإجراءات الترخيص فوراً',
        'تعيين فريق العمل للمشروع'
      ],
      nextSteps: [
        'استلام صك الملكية والمستندات',
        'إعداد العقد النهائي',
        'البدء برفع المخططات للبلدية',
        'جدولة الاجتماع القادم'
      ],
      
      attachments: [
        { id: 'ATT001', name: 'صك_الملكية.pdf', type: 'PDF', size: '2.3 MB', uploadDate: '2025-01-18' },
        { id: 'ATT002', name: 'التصميم_المبدئي.dwg', type: 'DWG', size: '5.1 MB', uploadDate: '2025-01-15' },
        { id: 'ATT003', name: 'محضر_الاجتماع.pdf', type: 'PDF', size: '850 KB', uploadDate: '2025-01-15' }
      ],
      
      meetingRating: 5,
      clientSatisfaction: 5,
      
      status: 'منعقد',
      createdBy: 'أحمد السعيد',
      createdDate: '2025-01-10',
      lastModified: '2025-01-18'
    },
    {
      id: 'MTG002',
      meetingNumber: 'MTG-2025-002',
      date: '2025-01-20',
      time: '14:00',
      duration: 60,
      location: 'موقع المشروع - حي الياسمين',
      locationType: 'موقع المشروع',
      
      clientId: 'CLT-002',
      clientName: 'شركة البناء المتطور',
      clientType: 'قديم',
      clientCategory: 'حكومي',
      clientPhone: '+966502345678',
      clientEmail: 'info@modernbuild.com',
      
      meetingType: 'متابعة',
      meetingPurpose: 'متابعة سير العمل في المشروع السكني',
      meetingAgenda: [
        'جولة تفقدية في الموقع',
        'مراجعة نسب الإنجاز',
        'مناقشة التحديات الحالية',
        'تحديد الخطوات القادمة'
      ],
      
      attendees: [
        { id: 'ATT005', name: 'المهندس خالد العتيبي', role: 'مدير التنفيذ', type: 'موظف', attended: true },
        { id: 'ATT006', name: 'ممثل الشركة', role: 'مدير المشروع', type: 'عميل', attended: true },
        { id: 'ATT007', name: 'المهندس سعد الغامدي', role: 'مهندس موقع', type: 'موظف', attended: true },
      ],
      
      calledBy: {
        name: 'المهندس خالد العتيبي',
        role: 'مدير التنفيذ'
      },
      
      linkedTransaction: {
        id: 'TRN-2024-456',
        number: '2412456',
        type: 'مجمع سكني',
        status: 'قيد التنفيذ'
      },
      
      requestsToClient: [
        {
          id: 'RTC004',
          description: 'الموافقة على التعديلات المقترحة',
          type: 'موافقة',
          priority: 'عاجل',
          deadline: '2025-01-22',
          status: 'معلق',
          assignedTo: 'قسم التصميم',
          notes: 'تعديلات طفيفة في واجهات المباني'
        }
      ],
      
      requestsFromClient: [
        {
          id: 'RFC003',
          description: 'تقرير أسبوعي بالتقدم',
          type: 'تقرير',
          priority: 'عالي',
          deadline: '2025-01-27',
          status: 'قيد التنفيذ',
          assignedTo: 'المهندس خالد العتيبي',
          notes: 'سيتم إرساله نهاية الأسبوع',
          completionPercent: 80
        }
      ],
      
      meetingSummary: 'اجتماع ميداني ناجح. المشروع يسير وفق الجدول الزمني المحدد.',
      keyPoints: [
        'نسبة الإنجاز الإجمالية: 65%',
        'لا توجد تأخيرات كبيرة',
        'جودة التنفيذ ممتازة'
      ],
      decisions: [
        'الموافقة على التعديلات البسيطة',
        'تسريع أعمال الواجهات'
      ],
      nextSteps: [
        'إرسال التقرير الأسبوعي',
        'جدولة الاجتماع القادم'
      ],
      
      attachments: [
        { id: 'ATT004', name: 'صور_الموقع.zip', type: 'ZIP', size: '15.2 MB', uploadDate: '2025-01-20' }
      ],
      
      meetingRating: 4,
      clientSatisfaction: 4,
      
      status: 'منعقد',
      createdBy: 'خالد العتيبي',
      createdDate: '2025-01-15',
      lastModified: '2025-01-20'
    },
    {
      id: 'MTG003',
      meetingNumber: 'MTG-2025-003',
      date: '2025-01-25',
      time: '11:00',
      duration: 45,
      location: 'اجتماع افتراضي عبر Zoom',
      locationType: 'عن بُعد',
      
      clientId: 'CLT-003',
      clientName: 'المهندسة سارة الأحمدي',
      clientType: 'محتمل',
      clientCategory: 'عادي',
      clientPhone: '+966503456789',
      clientEmail: 'sarah@example.com',
      
      meetingType: 'استشارة',
      meetingPurpose: 'استشارة أولية حول مشروع تجاري',
      meetingAgenda: [
        'التعريف بخدمات المكتب',
        'الاستماع لمتطلبات العميل',
        'تقديم عرض أولي',
        'الإجابة على الاستفسارات'
      ],
      
      attendees: [
        { id: 'ATT008', name: 'المهندسة نورة القحطاني', role: 'استشاري تصميم', type: 'موظف', attended: true },
        { id: 'ATT009', name: 'سارة الأحمدي', role: 'مالكة', type: 'عميل', attended: true },
      ],
      
      calledBy: {
        name: 'سارة الأحمدي',
        role: 'عميل محتمل'
      },
      
      requestsToClient: [],
      requestsFromClient: [
        {
          id: 'RFC004',
          description: 'عرض سعر مبدئي للمشروع',
          type: 'أخرى',
          priority: 'متوسط',
          deadline: '2025-01-30',
          status: 'قيد التنفيذ',
          assignedTo: 'قسم العروض',
          notes: 'جاري إعداد العرض المالي',
          completionPercent: 40
        }
      ],
      
      meetingSummary: 'اجتماع تعريفي جيد مع عميل محتمل. أبدت العميلة اهتماماً بخدماتنا.',
      keyPoints: [
        'المشروع: محل تجاري بمساحة 200م²',
        'الموقع: حي العليا',
        'الميزانية المتوقعة: 500 ألف ريال'
      ],
      decisions: [
        'إعداد عرض سعر تفصيلي',
        'جدولة زيارة ميدانية للموقع'
      ],
      nextSteps: [
        'إرسال عرض السعر',
        'انتظار قرار العميل'
      ],
      
      attachments: [],
      
      meetingRating: 3,
      clientSatisfaction: 4,
      
      status: 'منعقد',
      createdBy: 'نورة القحطاني',
      createdDate: '2025-01-22',
      lastModified: '2025-01-25'
    },
    {
      id: 'MTG004',
      meetingNumber: 'MTG-2025-004',
      date: '2025-02-05',
      time: '09:00',
      duration: 120,
      location: 'قاعة الاجتماعات الفرعية',
      locationType: 'مكتب',
      
      clientId: 'CLT-004',
      clientName: 'الأستاذ محمد بن سعد القرني',
      clientType: 'قديم',
      clientCategory: 'VIP',
      clientPhone: '+966504567890',
      clientEmail: 'mohammed@example.com',
      
      meetingType: 'توقيع عقد',
      meetingPurpose: 'توقيع عقد مشروع الفيلا الفاخرة',
      meetingAgenda: [
        'مراجعة بنود العقد',
        'التوقيع الرسمي',
        'استلام الدفعة الأولى',
        'تسليم نسخ العقد'
      ],
      
      attendees: [
        { id: 'ATT010', name: 'المهندس عبدالله السعيد', role: 'المدير العام', type: 'موظف', attended: false },
        { id: 'ATT011', name: 'محمد القرني', role: 'المالك', type: 'عميل', attended: false },
        { id: 'ATT012', name: 'المستشار القانوني', role: 'محامي', type: 'طرف ثالث', attended: false },
      ],
      
      calledBy: {
        name: 'المهندس عبدالله السعيد',
        role: 'المدير العام'
      },
      
      linkedTransaction: {
        id: 'TRN-2025-012',
        number: '2501012',
        type: 'فيلا فاخرة',
        status: 'في انتظار التوقيع'
      },
      
      requestsToClient: [
        {
          id: 'RTC005',
          description: 'إحضار الهوية الوطنية الأصلية',
          type: 'مستند',
          priority: 'عاجل',
          deadline: '2025-02-05',
          status: 'معلق',
          assignedTo: 'قسم العقود',
          notes: 'للتوقيع والتوثيق'
        },
        {
          id: 'RTC006',
          description: 'دفعة العقد الأولى 30%',
          type: 'دفعة',
          priority: 'عاجل',
          deadline: '2025-02-05',
          status: 'معلق',
          assignedTo: 'القسم المالي',
          notes: 'المبلغ: 900,000 ريال'
        }
      ],
      
      requestsFromClient: [],
      
      meetingSummary: '',
      keyPoints: [],
      decisions: [],
      nextSteps: [],
      
      attachments: [
        { id: 'ATT005', name: 'العقد_النهائي.pdf', type: 'PDF', size: '1.8 MB', uploadDate: '2025-01-30' }
      ],
      
      status: 'مجدول',
      createdBy: 'عبدالله السعيد',
      createdDate: '2025-01-28',
      lastModified: '2025-01-30'
    },
  ], []);

  // دوال مساعدة
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'مجدول': '#3b82f6',
      'منعقد': '#10b981',
      'ملغي': '#ef4444',
      'مؤجل': '#f59e0b',
    };
    return colors[status] || '#6b7280';
  };

  const getRequestStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'معلق': '#6b7280',
      'قيد التنفيذ': '#3b82f6',
      'مستلم': '#10b981',
      'مكتمل': '#10b981',
      'ناقص': '#f59e0b',
      'مرفوض': '#ef4444',
      'متأخر': '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  const getClientTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'محتمل': '#f59e0b',
      'جديد': '#3b82f6',
      'قديم': '#10b981',
    };
    return colors[type] || '#6b7280';
  };

  // الإحصائيات
  const stats = useMemo(() => {
    const total = meetings.length;
    const scheduled = meetings.filter(m => m.status === 'مجدول').length;
    const completed = meetings.filter(m => m.status === 'منعقد').length;
    const cancelled = meetings.filter(m => m.status === 'ملغي').length;
    
    const totalRequestsTo = meetings.reduce((sum, m) => sum + m.requestsToClient.length, 0);
    const totalRequestsFrom = meetings.reduce((sum, m) => sum + m.requestsFromClient.length, 0);
    
    const pendingRequestsTo = meetings.reduce((sum, m) => 
      sum + m.requestsToClient.filter(r => r.status === 'معلق').length, 0
    );
    const pendingRequestsFrom = meetings.reduce((sum, m) => 
      sum + m.requestsFromClient.filter(r => ['قيد التنفيذ', 'معلق'].includes(r.status)).length, 0
    );

    return {
      total,
      scheduled,
      completed,
      cancelled,
      totalRequestsTo,
      totalRequestsFrom,
      pendingRequestsTo,
      pendingRequestsFrom,
    };
  }, [meetings]);

  const renderTabContent = () => {
    // تاب 891-01: نظرة عامة
    if (activeTab === '891-01') {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                نظرة عامة - مقابلات العملاء
              </h3>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                إحصائيات شاملة لجميع المقابلات والطلبات
              </p>
            </div>
            <Button className="dense-button bg-[#10b981] hover:bg-[#059669] text-white">
              <Plus className="h-3.5 w-3.5 ml-2" />
              مقابلة جديدة
            </Button>
          </div>

          {/* بطاقات الإحصائيات */}
          <div className="stats-grid-8">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي المقابلات
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {stats.total}
                    </p>
                  </div>
                  <Users className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      مجدولة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {stats.scheduled}
                    </p>
                  </div>
                  <Calendar className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      منعقدة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {stats.completed}
                    </p>
                  </div>
                  <CheckCircle className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fee2e2', '--bg-to': '#fecaca', '--border-color': '#fca5a5' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      ملغية
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {stats.cancelled}
                    </p>
                  </div>
                  <XCircle className="stats-icon-compact text-red-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      طلبات للعملاء
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {stats.totalRequestsTo}
                    </p>
                  </div>
                  <ArrowRight className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fce7f3', '--bg-to': '#fbcfe8', '--border-color': '#f9a8d4' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      طلبات من العملاء
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {stats.totalRequestsFrom}
                    </p>
                  </div>
                  <ArrowLeft className="stats-icon-compact text-pink-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#ffedd5', '--bg-to': '#fed7aa', '--border-color': '#fdba74' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      طلبات معلقة (للعملاء)
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {stats.pendingRequestsTo}
                    </p>
                  </div>
                  <AlertCircle className="stats-icon-compact text-orange-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#f3e8ff', '--bg-to': '#e9d5ff', '--border-color': '#d8b4fe' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      طلبات جارية (من العملاء)
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {stats.pendingRequestsFrom}
                    </p>
                  </div>
                  <Target className="stats-icon-compact text-purple-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* آخر المقابلات */}
          <div className="grid grid-cols-2 dense-grid">
            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  آخر المقابلات المنعقدة
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-2">
                  {meetings.filter(m => m.status === 'منعقد').slice(0, 5).map((meeting) => (
                    <div
                      key={meeting.id}
                      className="p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                      style={{ border: '1px solid #e5e7eb' }}
                      onClick={() => {
                        setSelectedMeeting(meeting);
                        setShowMeetingDialog(true);
                      }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                            {meeting.clientName}
                          </p>
                          <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                            {meeting.meetingPurpose}
                          </p>
                        </div>
                        <Badge
                          style={{
                            backgroundColor: getClientTypeColor(meeting.clientType) + '20',
                            color: getClientTypeColor(meeting.clientType),
                            borderColor: getClientTypeColor(meeting.clientType)
                          }}
                          className="border text-[9px]"
                        >
                          {meeting.clientType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]" style={{ color: '#6b7280' }}>
                        <span className="flex items-center gap-0.5">
                          <Calendar className="h-2.5 w-2.5" />
                          {meeting.date}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          {meeting.time}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5" />
                          {meeting.locationType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المقابلات القادمة
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-2">
                  {meetings.filter(m => m.status === 'مجدول').map((meeting) => (
                    <div
                      key={meeting.id}
                      className="p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                      style={{ border: '1px solid #e5e7eb' }}
                      onClick={() => {
                        setSelectedMeeting(meeting);
                        setShowMeetingDialog(true);
                      }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                            {meeting.clientName}
                          </p>
                          <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                            {meeting.meetingPurpose}
                          </p>
                        </div>
                        <Badge
                          style={{
                            backgroundColor: '#fef3c7',
                            color: '#f59e0b',
                            borderColor: '#f59e0b'
                          }}
                          className="border text-[9px]"
                        >
                          {meeting.meetingType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]" style={{ color: '#6b7280' }}>
                        <span className="flex items-center gap-0.5">
                          <Calendar className="h-2.5 w-2.5" />
                          {meeting.date}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          {meeting.time}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Users className="h-2.5 w-2.5" />
                          {meeting.attendees.length}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* الطلبات المعلقة */}
          <Card className="card-rtl">
            <CardHeader className="card-header-dense">
              <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الطلبات المعلقة والجارية
              </CardTitle>
            </CardHeader>
            <CardContent className="dense-card-content">
              <div className="grid grid-cols-2 gap-4">
                {/* طلبات للعملاء */}
                <div>
                  <h4 className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, color: '#2563eb' }}>
                    طلبات معلقة للعملاء
                  </h4>
                  <div className="space-y-1">
                    {meetings.flatMap(m => 
                      m.requestsToClient.filter(r => r.status === 'معلق')
                    ).slice(0, 5).map((request, idx) => (
                      <div key={idx} className="p-2 rounded" style={{ backgroundColor: '#f8fafc', border: '1px solid #e5e7eb' }}>
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                          {request.description}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px]" style={{ color: '#6b7280' }}>
                            موعد: {request.deadline}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[9px]"
                            style={{
                              backgroundColor: request.priority === 'عاجل' ? '#fee2e2' : '#fef3c7',
                              borderColor: request.priority === 'عاجل' ? '#ef4444' : '#f59e0b',
                              color: request.priority === 'عاجل' ? '#ef4444' : '#f59e0b'
                            }}
                          >
                            {request.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* طلبات من العملاء */}
                <div>
                  <h4 className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, color: '#8b5cf6' }}>
                    طلبات جارية من العملاء
                  </h4>
                  <div className="space-y-1">
                    {meetings.flatMap(m => 
                      m.requestsFromClient.filter(r => ['قيد التنفيذ', 'معلق'].includes(r.status))
                    ).slice(0, 5).map((request, idx) => (
                      <div key={idx} className="p-2 rounded" style={{ backgroundColor: '#f8fafc', border: '1px solid #e5e7eb' }}>
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                          {request.description}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px]" style={{ color: '#6b7280' }}>
                            {request.assignedTo}
                          </span>
                          <div className="flex items-center gap-1">
                            <Progress value={request.completionPercent} className="h-1 w-16" />
                            <span className="text-[9px]" style={{ fontFamily: 'Courier New, monospace' }}>
                              {request.completionPercent}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // تاب 891-02: قائمة المقابلات
    if (activeTab === '891-02') {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قائمة جميع المقابلات
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" className="dense-button">
                <Filter className="h-3.5 w-3.5 ml-2" />
                تصفية
              </Button>
              <Button className="dense-button bg-[#10b981] hover:bg-[#059669] text-white">
                <Plus className="h-3.5 w-3.5 ml-2" />
                مقابلة جديدة
              </Button>
            </div>
          </div>

          {/* شريط البحث والتصفية */}
          <Card className="card-rtl">
            <CardContent className="dense-card-content">
              <div className="grid grid-cols-4 gap-2">
                <InputWithCopy
                  label=""
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="بحث بالاسم، الرقم، أو المعاملة..."
                  copyable={false}
                  clearable={true}
                />
                
                <SelectWithCopy
                  label=""
                  id="filterType"
                  value={filterType}
                  onChange={setFilterType}
                  options={[
                    { value: 'all', label: 'جميع الأنواع' },
                    { value: 'استشارة', label: 'استشارة' },
                    { value: 'متابعة', label: 'متابعة' },
                    { value: 'عرض مشروع', label: 'عرض مشروع' },
                    { value: 'توقيع عقد', label: 'توقيع عقد' },
                  ]}
                  copyable={false}
                  clearable={true}
                />
                
                <SelectWithCopy
                  label=""
                  id="filterClientType"
                  value={filterClientType}
                  onChange={setFilterClientType}
                  options={[
                    { value: 'all', label: 'جميع العملاء' },
                    { value: 'محتمل', label: 'محتمل' },
                    { value: 'جديد', label: 'جديد' },
                    { value: 'قديم', label: 'قديم' },
                  ]}
                  copyable={false}
                  clearable={true}
                />
                
                <Button variant="outline" className="dense-button">
                  <Download className="h-3.5 w-3.5 ml-2" />
                  تصدير
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* جدول المقابلات */}
          <Card className="card-rtl">
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الغرض</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المكان</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {meeting.meetingNumber}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <div className="flex flex-col">
                          <span className="text-xs">{meeting.date}</span>
                          <span className="text-[10px]" style={{ color: '#6b7280' }}>{meeting.time}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <div className="flex flex-col">
                          <span className="text-xs">{meeting.clientName}</span>
                          <Badge
                            style={{
                              backgroundColor: getClientTypeColor(meeting.clientType) + '20',
                              color: getClientTypeColor(meeting.clientType),
                              borderColor: getClientTypeColor(meeting.clientType)
                            }}
                            className="border text-[9px] w-fit"
                          >
                            {meeting.clientType}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-[10px]">
                          {meeting.meetingType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {meeting.meetingPurpose.substring(0, 30)}...
                      </TableCell>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        {meeting.locationType}
                      </TableCell>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                        {meeting.duration} د
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          style={{
                            backgroundColor: getStatusColor(meeting.status) + '20',
                            color: getStatusColor(meeting.status),
                            borderColor: getStatusColor(meeting.status)
                          }}
                          className="border text-[10px]"
                        >
                          {meeting.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="dense-button"
                          onClick={() => {
                            setSelectedMeeting(meeting);
                            setShowMeetingDialog(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      );
    }

    // باقي التابات
    return (
      <div className="space-y-2">
        <Card className="card-rtl">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-base mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              محتوى التاب قيد التطوير
            </h3>
            <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
              {TABS_CONFIG.find(t => t.id === activeTab)?.title}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 rtl-support" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
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
          marginBottom: '16px',
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
                  مقابلات العملاء
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
                    891
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
                نظام شامل لإدارة جميع المقابلات والطلبات مع العملاء
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
      <div className="flex" style={{ gap: '4px' }}>
        {/* السايد بار */}
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* محتوى التاب */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 140px)' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة تفاصيل المقابلة */}
      <Dialog open={showMeetingDialog} onOpenChange={setShowMeetingDialog}>
        <DialogContent className="max-w-6xl dialog-rtl" style={{ direction: 'rtl', maxHeight: '90vh', overflow: 'auto' }}>
          {selectedMeeting && (
            <>
              <DialogHeader className="dialog-header">
                <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  تفاصيل المقابلة - {selectedMeeting.meetingNumber}
                </DialogTitle>
                <DialogDescription className="dialog-description">
                  جميع معلومات وتفاصيل المقابلة والمخرجات
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3" style={{ padding: '16px 0' }}>
                {/* معلومات أساسية */}
                <Card className="card-rtl">
                  <CardHeader className="card-header-dense">
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      المعلومات الأساسية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="dense-card-content">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          رقم المقابلة
                        </Label>
                        <p className="text-sm font-mono">
                          {selectedMeeting.meetingNumber}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          التاريخ والوقت
                        </Label>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedMeeting.date} - {selectedMeeting.time}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          المدة
                        </Label>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedMeeting.duration} دقيقة
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          المكان
                        </Label>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedMeeting.location}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          نوع المكان
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          {selectedMeeting.locationType}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          الحالة
                        </Label>
                        <Badge
                          style={{
                            backgroundColor: getStatusColor(selectedMeeting.status) + '20',
                            color: getStatusColor(selectedMeeting.status),
                            borderColor: getStatusColor(selectedMeeting.status)
                          }}
                          className="border text-xs"
                        >
                          {selectedMeeting.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* بيانات العميل */}
                <Card className="card-rtl">
                  <CardHeader className="card-header-dense">
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      بيانات العميل
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="dense-card-content">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          اسم العميل
                        </Label>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                          {selectedMeeting.clientName}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          نوع العميل
                        </Label>
                        <Badge
                          style={{
                            backgroundColor: getClientTypeColor(selectedMeeting.clientType) + '20',
                            color: getClientTypeColor(selectedMeeting.clientType),
                            borderColor: getClientTypeColor(selectedMeeting.clientType)
                          }}
                          className="border text-xs"
                        >
                          {selectedMeeting.clientType}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          التصنيف
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          {selectedMeeting.clientCategory}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          الهاتف
                        </Label>
                        <p className="text-sm font-mono">
                          {selectedMeeting.clientPhone}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          البريد الإلكتروني
                        </Label>
                        <p className="text-sm font-mono">
                          {selectedMeeting.clientEmail}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* معلومات المقابلة */}
                <Card className="card-rtl">
                  <CardHeader className="card-header-dense">
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      معلومات المقابلة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="dense-card-content">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs mb-1 block" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          نوع المقابلة
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          {selectedMeeting.meetingType}
                        </Badge>
                      </div>
                      
                      <div>
                        <Label className="text-xs mb-1 block" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          الغرض من المقابلة
                        </Label>
                        <p className="text-sm p-2 rounded" style={{ fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc' }}>
                          {selectedMeeting.meetingPurpose}
                        </p>
                      </div>

                      <div>
                        <Label className="text-xs mb-1 block" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          جدول الأعمال
                        </Label>
                        <ol className="space-y-1 pr-5" style={{ listStyleType: 'arabic-indic' }}>
                          {selectedMeeting.meetingAgenda.map((item, idx) => (
                            <li key={idx} className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {item}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <Label className="text-xs mb-1 block" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          دعا إلى الاجتماع
                        </Label>
                        <div className="p-2 rounded" style={{ backgroundColor: '#f8fafc' }}>
                          <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                            {selectedMeeting.calledBy.name}
                          </p>
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                            {selectedMeeting.calledBy.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* الحضور */}
                <Card className="card-rtl">
                  <CardHeader className="card-header-dense">
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الحضور ({selectedMeeting.attendees.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="dense-card-content">
                    <Table className="table-rtl dense-table">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصفة</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحضور</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedMeeting.attendees.map((attendee) => (
                          <TableRow key={attendee.id}>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {attendee.name}
                            </TableCell>
                            <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              {attendee.role}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant="outline" className="text-[10px]">
                                {attendee.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {attendee.attended ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-400" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* الطلبات للعميل */}
                {selectedMeeting.requestsToClient.length > 0 && (
                  <Card className="card-rtl">
                    <CardHeader className="card-header-dense">
                      <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        طلبات للعميل ({selectedMeeting.requestsToClient.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="dense-card-content">
                      <div className="space-y-2">
                        {selectedMeeting.requestsToClient.map((request) => (
                          <div
                            key={request.id}
                            className="p-3 rounded"
                            style={{
                              backgroundColor: '#f8fafc',
                              border: `2px solid ${getRequestStatusColor(request.status)}40`
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <p className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                                  {request.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                                  <Badge variant="outline" className="text-[9px]">
                                    {request.type}
                                  </Badge>
                                  <span>•</span>
                                  <span>موعد: {request.deadline}</span>
                                  <span>•</span>
                                  <span>{request.assignedTo}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Badge
                                  style={{
                                    backgroundColor: getRequestStatusColor(request.status) + '20',
                                    color: getRequestStatusColor(request.status),
                                    borderColor: getRequestStatusColor(request.status)
                                  }}
                                  className="border text-xs"
                                >
                                  {request.status}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="text-[9px]"
                                  style={{
                                    backgroundColor: request.priority === 'عاجل' ? '#fee2e2' : '#fef3c7',
                                    borderColor: request.priority === 'عاجل' ? '#ef4444' : '#f59e0b',
                                    color: request.priority === 'عاجل' ? '#ef4444' : '#f59e0b'
                                  }}
                                >
                                  {request.priority}
                                </Badge>
                              </div>
                            </div>
                            {request.notes && (
                              <p className="text-xs p-2 rounded" style={{ fontFamily: 'Tajawal, sans-serif', backgroundColor: '#ffffff', color: '#6b7280' }}>
                                {request.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* الطلبات من العميل */}
                {selectedMeeting.requestsFromClient.length > 0 && (
                  <Card className="card-rtl">
                    <CardHeader className="card-header-dense">
                      <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        طلبات من العميل ({selectedMeeting.requestsFromClient.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="dense-card-content">
                      <div className="space-y-2">
                        {selectedMeeting.requestsFromClient.map((request) => (
                          <div
                            key={request.id}
                            className="p-3 rounded"
                            style={{
                              backgroundColor: '#f8fafc',
                              border: `2px solid ${getRequestStatusColor(request.status)}40`
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <p className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                                  {request.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                                  <Badge variant="outline" className="text-[9px]">
                                    {request.type}
                                  </Badge>
                                  <span>•</span>
                                  <span>موعد: {request.deadline}</span>
                                  <span>•</span>
                                  <span>{request.assignedTo}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Badge
                                  style={{
                                    backgroundColor: getRequestStatusColor(request.status) + '20',
                                    color: getRequestStatusColor(request.status),
                                    borderColor: getRequestStatusColor(request.status)
                                  }}
                                  className="border text-xs"
                                >
                                  {request.status}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="text-[9px]"
                                  style={{
                                    backgroundColor: request.priority === 'عاجل' ? '#fee2e2' : '#fef3c7',
                                    borderColor: request.priority === 'عاجل' ? '#ef4444' : '#f59e0b',
                                    color: request.priority === 'عاجل' ? '#ef4444' : '#f59e0b'
                                  }}
                                >
                                  {request.priority}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={request.completionPercent} className="h-2 flex-1" />
                              <span className="text-xs font-mono" style={{ minWidth: '40px' }}>
                                {request.completionPercent}%
                              </span>
                            </div>
                            {request.notes && (
                              <p className="text-xs p-2 rounded mt-2" style={{ fontFamily: 'Tajawal, sans-serif', backgroundColor: '#ffffff', color: '#6b7280' }}>
                                {request.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* الملخص */}
                {selectedMeeting.meetingSummary && (
                  <Card className="card-rtl">
                    <CardHeader className="card-header-dense">
                      <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        ملخص المقابلة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="dense-card-content">
                      <p className="text-sm p-3 rounded" style={{ fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', lineHeight: '1.8' }}>
                        {selectedMeeting.meetingSummary}
                      </p>

                      {selectedMeeting.keyPoints.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                            النقاط الرئيسية:
                          </h4>
                          <ul className="space-y-1 pr-5" style={{ listStyleType: 'disc' }}>
                            {selectedMeeting.keyPoints.map((point, idx) => (
                              <li key={idx} className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedMeeting.decisions.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                            القرارات:
                          </h4>
                          <ul className="space-y-1 pr-5" style={{ listStyleType: 'disc' }}>
                            {selectedMeeting.decisions.map((decision, idx) => (
                              <li key={idx} className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {decision}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedMeeting.nextSteps.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                            الخطوات القادمة:
                          </h4>
                          <ol className="space-y-1 pr-5" style={{ listStyleType: 'arabic-indic' }}>
                            {selectedMeeting.nextSteps.map((step, idx) => (
                              <li key={idx} className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* المرفقات */}
                {selectedMeeting.attachments.length > 0 && (
                  <Card className="card-rtl">
                    <CardHeader className="card-header-dense">
                      <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        المرفقات ({selectedMeeting.attachments.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="dense-card-content">
                      <div className="space-y-1">
                        {selectedMeeting.attachments.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                            style={{ border: '1px solid #e5e7eb' }}
                          >
                            <div className="flex items-center gap-2">
                              <Paperclip className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  {file.name}
                                </p>
                                <p className="text-[10px]" style={{ color: '#6b7280' }}>
                                  {file.size} • {file.uploadDate}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" className="dense-button">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowMeetingDialog(false)}
                  className="dense-button"
                >
                  إغلاق
                </Button>
                <Button className="dense-button bg-[#2563eb] hover:bg-[#1e40af] text-white">
                  <Edit className="h-3.5 w-3.5 ml-2" />
                  تعديل
                </Button>
                <Button className="dense-button bg-[#10b981] hover:bg-[#059669] text-white">
                  <Download className="h-3.5 w-3.5 ml-2" />
                  طباعة
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientMeetingsScreen;
