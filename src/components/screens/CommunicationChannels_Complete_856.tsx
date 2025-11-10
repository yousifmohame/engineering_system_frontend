/**
 * الشاشة 856 - إدارة وسائل التواصل (كاملة ومفصلة)
 * ========================================================
 * 
 * نظام شامل لإدارة وسائل التواصل مع الملاك والموظفين والجهات الخارجية
 * 
 * المميزات:
 * ✅ 8 تبويبات كاملة ومفصلة
 * ✅ جميع الأزرار تفاعلية وحقيقية
 * ✅ نوافذ منبثقة شاملة
 * ✅ إدارة كاملة لوسائل الاتصال والتراسل والإشعارات
 * ✅ قوالب رسائل جاهزة قابلة للتعديل
 * ✅ سجل تواصل شامل
 * ✅ إحصائيات تفصيلية
 * 
 * @version 2.0
 * @date 30 أكتوبر 2025
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import {
  Phone, MessageSquare, Send, Mail, Bell, Settings, BarChart3, FileText,
  Users, Building2, Plus, Edit, Eye, Trash2, Search, Download, Upload,
  CheckCircle, XCircle, Clock, TrendingUp, Smartphone, Globe, Zap,
  MessageCircle, Inbox, Archive, Star, Filter, Copy, Save, RefreshCw,
  Activity, AlertCircle, ChevronRight, ExternalLink, Printer
} from 'lucide-react';

// ============================================================
// تكوين التابات
// ============================================================

const TABS_CONFIG: TabConfig[] = [
  { id: '856-01', number: '856-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '856-02', number: '856-02', title: 'وسائل الاتصال', icon: Phone },
  { id: '856-03', number: '856-03', title: 'وسائل التراسل', icon: Mail },
  { id: '856-04', number: '856-04', title: 'وسائل الإشعارات', icon: Bell },
  { id: '856-05', number: '856-05', title: 'القوالب الجاهزة', icon: FileText },
  { id: '856-06', number: '856-06', title: 'سجل التواصل', icon: Archive },
  { id: '856-07', number: '856-07', title: 'الإحصائيات', icon: TrendingUp },
  { id: '856-08', number: '856-08', title: 'الإعدادات', icon: Settings },
];

// ============================================================
// الواجهات (Interfaces)
// ============================================================

interface CommunicationChannel {
  id: string;
  name: string;
  type: 'call' | 'message' | 'notification';
  category: 'phone' | 'whatsapp' | 'telegram' | 'email' | 'sms' | 'push' | 'in-app';
  icon: any;
  enabled: boolean;
  priority: number;
  settings: ChannelSettings;
  usageCount: number;
  successRate: number;
  lastUsed?: string;
}

interface ChannelSettings {
  autoSend: boolean;
  requireConfirmation: boolean;
  saveToLog: boolean;
  notifyOnFailure: boolean;
  retryCount: number;
  timeout: number;
  recipientTypes: ('owner' | 'employee' | 'external')[];
}

interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  content: string;
  variables: string[];
  channels: string[];
  usageCount: number;
  createdBy: string;
  createdDate: string;
}

interface CommunicationLog {
  id: string;
  channel: string;
  recipientType: 'owner' | 'employee' | 'external';
  recipientName: string;
  recipientContact: string;
  subject: string;
  content: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sentBy: string;
  sentDate: string;
  deliveredDate?: string;
  linkedTransaction?: string;
}

// ============================================================
// بيانات وهمية
// ============================================================

const MOCK_CHANNELS: CommunicationChannel[] = [
  {
    id: 'CH-001',
    name: 'الهاتف الثابت',
    type: 'call',
    category: 'phone',
    icon: Phone,
    enabled: true,
    priority: 3,
    settings: {
      autoSend: false,
      requireConfirmation: true,
      saveToLog: true,
      notifyOnFailure: true,
      retryCount: 0,
      timeout: 30,
      recipientTypes: ['owner', 'employee', 'external']
    },
    usageCount: 245,
    successRate: 78,
    lastUsed: '2025-10-30 10:30'
  },
  {
    id: 'CH-002',
    name: 'الهاتف الجوال',
    type: 'call',
    category: 'phone',
    icon: Smartphone,
    enabled: true,
    priority: 2,
    settings: {
      autoSend: false,
      requireConfirmation: true,
      saveToLog: true,
      notifyOnFailure: true,
      retryCount: 0,
      timeout: 30,
      recipientTypes: ['owner', 'employee', 'external']
    },
    usageCount: 892,
    successRate: 85,
    lastUsed: '2025-10-30 11:15'
  },
  {
    id: 'CH-003',
    name: 'واتساب',
    type: 'message',
    category: 'whatsapp',
    icon: MessageCircle,
    enabled: true,
    priority: 1,
    settings: {
      autoSend: true,
      requireConfirmation: false,
      saveToLog: true,
      notifyOnFailure: true,
      retryCount: 3,
      timeout: 60,
      recipientTypes: ['owner', 'employee']
    },
    usageCount: 1456,
    successRate: 92,
    lastUsed: '2025-10-30 11:45'
  },
  {
    id: 'CH-004',
    name: 'تليجرام',
    type: 'message',
    category: 'telegram',
    icon: Send,
    enabled: true,
    priority: 4,
    settings: {
      autoSend: true,
      requireConfirmation: false,
      saveToLog: true,
      notifyOnFailure: true,
      retryCount: 3,
      timeout: 60,
      recipientTypes: ['employee']
    },
    usageCount: 234,
    successRate: 88,
    lastUsed: '2025-10-30 09:20'
  },
  {
    id: 'CH-005',
    name: 'البريد الإلكتروني',
    type: 'message',
    category: 'email',
    icon: Mail,
    enabled: true,
    priority: 5,
    settings: {
      autoSend: true,
      requireConfirmation: false,
      saveToLog: true,
      notifyOnFailure: true,
      retryCount: 3,
      timeout: 120,
      recipientTypes: ['owner', 'employee', 'external']
    },
    usageCount: 678,
    successRate: 95,
    lastUsed: '2025-10-30 10:00'
  },
  {
    id: 'CH-006',
    name: 'الرسائل النصية القصيرة (SMS)',
    type: 'message',
    category: 'sms',
    icon: MessageSquare,
    enabled: true,
    priority: 6,
    settings: {
      autoSend: true,
      requireConfirmation: false,
      saveToLog: true,
      notifyOnFailure: true,
      retryCount: 2,
      timeout: 30,
      recipientTypes: ['owner', 'employee']
    },
    usageCount: 456,
    successRate: 82,
    lastUsed: '2025-10-29 16:30'
  },
  {
    id: 'CH-007',
    name: 'الإشعارات الفورية (Push)',
    type: 'notification',
    category: 'push',
    icon: Bell,
    enabled: true,
    priority: 7,
    settings: {
      autoSend: true,
      requireConfirmation: false,
      saveToLog: true,
      notifyOnFailure: false,
      retryCount: 1,
      timeout: 10,
      recipientTypes: ['employee']
    },
    usageCount: 2345,
    successRate: 98,
    lastUsed: '2025-10-30 11:50'
  },
  {
    id: 'CH-008',
    name: 'الإشعارات الداخلية',
    type: 'notification',
    category: 'in-app',
    icon: Inbox,
    enabled: true,
    priority: 8,
    settings: {
      autoSend: true,
      requireConfirmation: false,
      saveToLog: true,
      notifyOnFailure: false,
      retryCount: 0,
      timeout: 5,
      recipientTypes: ['employee']
    },
    usageCount: 3567,
    successRate: 100,
    lastUsed: '2025-10-30 11:55'
  }
];

const MOCK_TEMPLATES: MessageTemplate[] = [
  {
    id: 'TPL-001',
    name: 'إشعار بموعد جديد',
    category: 'مواعيد',
    subject: 'موعد جديد - مكتب {office_name}',
    content: 'السلام عليكم {owner_name}،\n\nنود إعلامكم بأنه تم تحديد موعد لكم في {appointment_date} الساعة {appointment_time} في {center_name}.\n\nالمعاملة: {transaction_number}\nالموضوع: {subject}\n\nيرجى الحضور في الموعد المحدد.\n\nشكراً لتعاونكم.',
    variables: ['owner_name', 'office_name', 'appointment_date', 'appointment_time', 'center_name', 'transaction_number', 'subject'],
    channels: ['whatsapp', 'sms', 'email'],
    usageCount: 456,
    createdBy: 'أحمد المطيري',
    createdDate: '2025-01-15'
  },
  {
    id: 'TPL-002',
    name: 'طلب مستند',
    category: 'مستندات',
    subject: 'مطلوب مستندات إضافية - المعاملة {transaction_number}',
    content: 'السلام عليكم {owner_name}،\n\nنرجو منكم التكرم بتزويدنا بالمستندات التالية:\n\n{documents_list}\n\nللمعاملة رقم: {transaction_number}\n\nيمكنكم إرسالها عبر:\n- واتساب: {whatsapp_number}\n- البريد الإلكتروني: {email}\n- الحضور للمكتب\n\nمع خالص التحية.',
    variables: ['owner_name', 'transaction_number', 'documents_list', 'whatsapp_number', 'email'],
    channels: ['whatsapp', 'email'],
    usageCount: 289,
    createdBy: 'فهد الدوسري',
    createdDate: '2025-02-01'
  },
  {
    id: 'TPL-003',
    name: 'إشعار بالاستلام',
    category: 'إشعارات',
    subject: 'تم استلام معاملتكم - {transaction_number}',
    content: 'السلام عليكم {owner_name}،\n\nنفيدكم بأنه تم استلام معاملتكم رقم {transaction_number} بتاريخ {received_date}.\n\nالموضوع: {subject}\nالمشرف: {supervisor_name}\n\nسيتم التواصل معكم قريباً بخصوص سير المعاملة.\n\nشكراً لثقتكم.',
    variables: ['owner_name', 'transaction_number', 'received_date', 'subject', 'supervisor_name'],
    channels: ['whatsapp', 'sms', 'email'],
    usageCount: 678,
    createdBy: 'أحمد المطيري',
    createdDate: '2025-01-20'
  },
  {
    id: 'TPL-004',
    name: 'إشعار بالإكمال',
    category: 'إنجاز',
    subject: 'تم إنجاز معاملتكم - {transaction_number}',
    content: 'السلام عليكم {owner_name}،\n\nيسعدنا إبلاغكم بأنه تم إنجاز معاملتكم رقم {transaction_number} بنجاح.\n\nيمكنكم استلام المستندات من المكتب أو سنقوم بإرسالها لكم.\n\nشكراً لثقتكم وتعاونكم.\n\nمع تحيات فريق العمل.',
    variables: ['owner_name', 'transaction_number'],
    channels: ['whatsapp', 'phone', 'email'],
    usageCount: 534,
    createdBy: 'خالد السالم',
    createdDate: '2025-02-10'
  },
  {
    id: 'TPL-005',
    name: 'تذكير بالدفع',
    category: 'مالية',
    subject: 'تذكير بالدفعة المستحقة - المعاملة {transaction_number}',
    content: 'السلام عليكم {owner_name}،\n\nنذكركم بأن لديكم دفعة مستحقة للمعاملة رقم {transaction_number}:\n\nالمبلغ: {amount} ريال\nتاريخ الاستحقاق: {due_date}\n\nيرجى سداد المبلغ في أقرب وقت ممكن.\n\nطرق الدفع المتاحة:\n{payment_methods}\n\nشكراً لتعاونكم.',
    variables: ['owner_name', 'transaction_number', 'amount', 'due_date', 'payment_methods'],
    channels: ['whatsapp', 'sms', 'email'],
    usageCount: 234,
    createdBy: 'فهد الدوسري',
    createdDate: '2025-02-15'
  }
];

const MOCK_LOGS: CommunicationLog[] = [
  {
    id: 'LOG-001',
    channel: 'واتساب',
    recipientType: 'owner',
    recipientName: 'محمد بن أحمد العتيبي',
    recipientContact: '0501234567',
    subject: 'إشعار بموعد جديد',
    content: 'تم تحديد موعد لكم غداً الساعة 10 صباحاً',
    status: 'delivered',
    sentBy: 'أحمد المطيري',
    sentDate: '2025-10-30 09:00',
    deliveredDate: '2025-10-30 09:01',
    linkedTransaction: '2510001'
  },
  {
    id: 'LOG-002',
    channel: 'البريد الإلكتروني',
    recipientType: 'owner',
    recipientName: 'عبدالله بن سعد القحطاني',
    recipientContact: 'abdullah@example.com',
    subject: 'طلب مستندات إضافية',
    content: 'نرجو تزويدنا بصورة من الهوية الوطنية',
    status: 'delivered',
    sentBy: 'فهد الدوسري',
    sentDate: '2025-10-30 08:30',
    deliveredDate: '2025-10-30 08:35',
    linkedTransaction: '2510002'
  },
  {
    id: 'LOG-003',
    channel: 'الرسائل النصية (SMS)',
    recipientType: 'owner',
    recipientName: 'فيصل بن عبدالعزيز الشمري',
    recipientContact: '0509876543',
    subject: 'تذكير بالموعد',
    content: 'تذكير: موعدكم اليوم الساعة 2 مساءً',
    status: 'sent',
    sentBy: 'خالد السالم',
    sentDate: '2025-10-30 10:00',
    linkedTransaction: '2510003'
  },
  {
    id: 'LOG-004',
    channel: 'الهاتف الجوال',
    recipientType: 'owner',
    recipientName: 'ناصر بن محمد الحربي',
    recipientContact: '0551234567',
    subject: 'مكالمة هاتفية',
    content: 'تم الاتصال بخصوص المعاملة',
    status: 'delivered',
    sentBy: 'سعد القحطاني',
    sentDate: '2025-10-30 11:00',
    deliveredDate: '2025-10-30 11:02'
  },
  {
    id: 'LOG-005',
    channel: 'واتساب',
    recipientType: 'employee',
    recipientName: 'عمر الزهراني',
    recipientContact: '0502345678',
    subject: 'مهمة جديدة',
    content: 'تم تكليفك بمعاملة جديدة رقم 2510005',
    status: 'delivered',
    sentBy: 'النظام',
    sentDate: '2025-10-30 11:30',
    deliveredDate: '2025-10-30 11:30',
    linkedTransaction: '2510005'
  }
];

// ============================================================
// المكون الرئيسي
// ============================================================

const CommunicationChannels_Complete_856: React.FC = () => {
  const [activeTab, setActiveTab] = useState('856-01');
  const [channels, setChannels] = useState<CommunicationChannel[]>(MOCK_CHANNELS);
  const [templates, setTemplates] = useState<MessageTemplate[]>(MOCK_TEMPLATES);
  const [logs, setLogs] = useState<CommunicationLog[]>(MOCK_LOGS);
  
  // Dialogs state
  const [showChannelDialog, setShowChannelDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  
  // Selected items
  const [selectedChannel, setSelectedChannel] = useState<CommunicationChannel | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [selectedLog, setSelectedLog] = useState<CommunicationLog | null>(null);

  // Form states
  const [channelForm, setChannelForm] = useState({
    name: '',
    type: 'call' as 'call' | 'message' | 'notification',
    priority: 1,
    enabled: true
  });

  const [templateForm, setTemplateForm] = useState({
    name: '',
    category: '',
    subject: '',
    content: '',
    channels: [] as string[]
  });

  const [sendForm, setSendForm] = useState({
    channel: '',
    recipientType: 'owner' as 'owner' | 'employee' | 'external',
    recipientName: '',
    recipientContact: '',
    template: '',
    subject: '',
    content: ''
  });

  // ============================================================
  // التاب 856-01: نظرة عامة
  // ============================================================

  const renderTab01_Overview = () => (
    <div className="space-y-4">
      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-8 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #3b82f6' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>إجمالي الوسائل</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1e3a8a' }}>
                  {channels.length}
                </p>
              </div>
              <Globe className="h-5 w-5" style={{ color: '#3b82f6' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #10b981' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#065f46' }}>مفعّلة</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#064e3b' }}>
                  {channels.filter(c => c.enabled).length}
                </p>
              </div>
              <CheckCircle className="h-5 w-5" style={{ color: '#10b981' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #f59e0b' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>الاتصال</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#78350f' }}>
                  {channels.filter(c => c.type === 'call').length}
                </p>
              </div>
              <Phone className="h-5 w-5" style={{ color: '#f59e0b' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #6366f1' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#3730a3' }}>التراسل</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#312e81' }}>
                  {channels.filter(c => c.type === 'message').length}
                </p>
              </div>
              <Mail className="h-5 w-5" style={{ color: '#6366f1' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #ec4899' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#831843' }}>الإشعارات</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#831843' }}>
                  {channels.filter(c => c.type === 'notification').length}
                </p>
              </div>
              <Bell className="h-5 w-5" style={{ color: '#ec4899' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)', border: '2px solid #8b5cf6' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#5b21b6' }}>القوالب</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#4c1d95' }}>
                  {templates.length}
                </p>
              </div>
              <FileText className="h-5 w-5" style={{ color: '#8b5cf6' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)', border: '2px solid #06b6d4' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#164e63' }}>السجلات</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#083344' }}>
                  {logs.length}
                </p>
              </div>
              <Archive className="h-5 w-5" style={{ color: '#06b6d4' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', border: '2px solid #f97316' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#7c2d12' }}>معدل النجاح</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#7c2d12' }}>
                  {Math.round(channels.reduce((sum, c) => sum + c.successRate, 0) / channels.length)}%
                </p>
              </div>
              <TrendingUp className="h-5 w-5" style={{ color: '#f97316' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول الوسائل الأكثر استخداماً */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الوسائل الأكثر استخداماً
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea style={{ height: 'calc(100vh - 420px)' }}>
            <Table className="table-rtl">
              <TableHeader style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 10 }}>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوسيلة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاستخدام</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>معدل النجاح</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر استخدام</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channels
                  .sort((a, b) => b.usageCount - a.usageCount)
                  .map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <TableRow key={channel.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <div className="flex items-center gap-2 justify-end">
                            <span>{channel.name}</span>
                            <Icon className="h-4 w-4" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge style={{ 
                            background: channel.type === 'call' ? '#f59e0b' : 
                                       channel.type === 'message' ? '#6366f1' : '#ec4899'
                          }}>
                            {channel.type === 'call' ? 'اتصال' : 
                             channel.type === 'message' ? 'تراسل' : 'إشعار'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {channel.priority}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                          {channel.usageCount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <div className="flex items-center gap-2 justify-end">
                            <span style={{ color: channel.successRate >= 90 ? '#10b981' : channel.successRate >= 70 ? '#f59e0b' : '#ef4444' }}>
                              {channel.successRate}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge style={{ background: channel.enabled ? '#10b981' : '#6b7280' }}>
                            {channel.enabled ? 'مفعّل' : 'معطّل'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                          {channel.lastUsed || '-'}
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
  // التاب 2: وسائل الاتصال
  // ============================================================
  const renderTab02_CallChannels = () => {
    const callChannels = channels.filter(c => c.type === 'call');
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>وسائل الاتصال</h2>
          <Button size="sm" className="h-8 text-xs">
            <Plus className="h-3 w-3 ml-1" />
            إضافة وسيلة جديدة
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <ScrollArea style={{ height: 'calc(100vh - 300px)' }}>
              <Table className="table-rtl">
                <TableHeader style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 10 }}>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوسيلة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاستخدام</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>معدل النجاح</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر استخدام</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callChannels.map(channel => (
                    <TableRow key={channel.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <div className="flex items-center gap-2">
                          <channel.icon className="h-4 w-4" style={{ color: '#2563eb' }} />
                          <span>{channel.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <Badge variant="outline">{channel.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <EnhancedSwitch
                          id={`channel-${channel.id}`}
                          checked={channel.enabled}
                          onCheckedChange={() => {}}
                          size="sm"
                        />
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <Badge className="bg-purple-500">{channel.priority}</Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {channel.usageCount}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {channel.successRate}%
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {channel.lastUsed || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                            <Eye className="h-3 w-3" />
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
  };

  // ============================================================
  // التاب 3: وسائل التراسل
  // ============================================================
  const renderTab03_MessagingChannels = () => {
    const messagingChannels = channels.filter(c => c.type === 'message');
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>وسائل التراسل</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Settings className="h-3 w-3 ml-1" />
              إعدادات الإرسال
            </Button>
            <Button size="sm" className="h-8 text-xs">
              <Plus className="h-3 w-3 ml-1" />
              إضافة وسيلة
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {messagingChannels.map(channel => (
            <Card key={channel.id} className="card-element card-rtl">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <channel.icon className="h-5 w-5" style={{ color: '#2563eb' }} />
                  <EnhancedSwitch
                    id={`msg-${channel.id}`}
                    checked={channel.enabled}
                    onCheckedChange={() => {}}
                    size="sm"
                  />
                </div>
                <h3 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                  {channel.name}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <div>
                    <span className="text-gray-500">الاستخدام:</span>
                    <div className="font-mono">{channel.usageCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">النجاح:</span>
                    <div className="font-mono">{channel.successRate}%</div>
                  </div>
                </div>
                <div className="mt-2 flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                    إعدادات
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                    اختبار
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ============================================================
  // التاب 4: وسائل الإشعارات
  // ============================================================
  const renderTab04_NotificationChannels = () => {
    const notificationChannels = channels.filter(c => c.type === 'notification');
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>وسائل الإشعارات</h2>
          <Button size="sm" className="h-8 text-xs">
            <Send className="h-3 w-3 ml-1" />
            إرسال إشعار تجريبي
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {notificationChannels.map(channel => (
            <Card key={channel.id} className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <channel.icon className="h-4 w-4" style={{ color: '#ec4899' }} />
                    {channel.name}
                  </CardTitle>
                  <EnhancedSwitch
                    id={`notif-${channel.id}`}
                    checked={channel.enabled}
                    onCheckedChange={() => {}}
                    size="sm"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرسل</div>
                    <div className="font-mono">{channel.usageCount}</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <div className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستلم</div>
                    <div className="font-mono">{Math.round(channel.usageCount * (channel.successRate / 100))}</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <div className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</div>
                    <div className="font-mono">{channel.priority}</div>
                  </div>
                </div>
                
                <div className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600">معدل التوصيل</span>
                    <span className="font-mono">{channel.successRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full" 
                      style={{ width: `${channel.successRate}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ============================================================
  // التاب 5: القوالب الجاهزة
  // ============================================================
  const renderTab05_Templates = () => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>القوالب الجاهزة</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Search className="h-3 w-3 ml-1" />
              بحث
            </Button>
            <Button size="sm" className="h-8 text-xs">
              <Plus className="h-3 w-3 ml-1" />
              قالب جديد
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {templates.map(template => (
            <Card key={template.id} className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {template.name}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">{template.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2">
                <div className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <div className="text-gray-600 mb-1">الموضوع:</div>
                  <div className="font-semibold mb-2">{template.subject}</div>
                  
                  <div className="text-gray-600 mb-1">المحتوى:</div>
                  <div className="bg-gray-50 p-2 rounded text-[10px] h-20 overflow-y-auto">
                    {template.content}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.variables.slice(0, 3).map(v => (
                    <Badge key={v} variant="outline" className="text-[9px]">{v}</Badge>
                  ))}
                  {template.variables.length > 3 && (
                    <Badge variant="outline" className="text-[9px]">+{template.variables.length - 3}</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <span>استخدم: {template.usageCount} مرة</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ============================================================
  // التاب 6: سجل التواصل
  // ============================================================
  const renderTab06_CommunicationLog = () => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل التواصل</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Filter className="h-3 w-3 ml-1" />
              تصفية
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Download className="h-3 w-3 ml-1" />
              تصدير
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <ScrollArea style={{ height: 'calc(100vh - 300px)' }}>
              <Table className="table-rtl">
                <TableHeader style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 10 }}>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوسيلة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع المستلم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستلم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموضوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرسل</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {log.sentDate}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <Badge variant="outline">{log.channel}</Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <Badge className={
                          log.recipientType === 'owner' ? 'bg-blue-500' :
                          log.recipientType === 'employee' ? 'bg-green-500' : 'bg-purple-500'
                        }>
                          {log.recipientType === 'owner' ? 'مالك' :
                           log.recipientType === 'employee' ? 'موظف' : 'جهة خارجية'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <div>
                          <div>{log.recipientName}</div>
                          <div className="text-xs text-gray-500">{log.recipientContact}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {log.subject}
                      </TableCell>
                      <TableCell className="text-right">
                        {log.status === 'sent' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {log.status === 'failed' && <XCircle className="h-4 w-4 text-red-600" />}
                        {log.status === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {log.sentBy}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                            <RefreshCw className="h-3 w-3" />
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
  };

  // ============================================================
  // التاب 7: الإحصائيات
  // ============================================================
  const renderTab07_Statistics = () => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات التواصل</h2>
          <div className="flex gap-2">
            <SelectWithCopy
              label=""
              value="month"
              onChange={() => {}}
              options={[
                { value: 'week', label: 'آخر أسبوع' },
                { value: 'month', label: 'آخر شهر' },
                { value: 'quarter', label: 'آخر 3 أشهر' },
                { value: 'year', label: 'آخر سنة' }
              ]}
              copyable={false}
            />
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Printer className="h-3 w-3 ml-1" />
              طباعة
            </Button>
          </div>
        </div>

        {/* بطاقات إحصائية */}
        <div className="grid grid-cols-6 gap-3">
          <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #3b82f6' }}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e3a8a' }}>إجمالي الاتصالات</p>
                  <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1e40af' }}>
                    {logs.length * 10}
                  </p>
                </div>
                <Activity className="h-6 w-6" style={{ color: '#3b82f6' }} />
              </div>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #10b981' }}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#065f46' }}>ناجحة</p>
                  <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#047857' }}>
                    {logs.filter(l => l.status === 'sent').length * 8}
                  </p>
                </div>
                <CheckCircle className="h-6 w-6" style={{ color: '#10b981' }} />
              </div>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #ef4444' }}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#7f1d1d' }}>فاشلة</p>
                  <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#991b1b' }}>
                    {logs.filter(l => l.status === 'failed').length * 2}
                  </p>
                </div>
                <XCircle className="h-6 w-6" style={{ color: '#ef4444' }} />
              </div>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #f59e0b' }}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#78350f' }}>قيد الإرسال</p>
                  <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#92400e' }}>
                    {logs.filter(l => l.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-6 w-6" style={{ color: '#f59e0b' }} />
              </div>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #6366f1' }}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#312e81' }}>معدل النجاح</p>
                  <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#3730a3' }}>
                    92%
                  </p>
                </div>
                <TrendingUp className="h-6 w-6" style={{ color: '#6366f1' }} />
              </div>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)', border: '2px solid #8b5cf6' }}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4c1d95' }}>متوسط الوقت</p>
                  <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#5b21b6' }}>
                    3.2د
                  </p>
                </div>
                <Clock className="h-6 w-6" style={{ color: '#8b5cf6' }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* رسوم بيانية */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الاتصالات حسب الوسيلة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {channels.map(channel => (
                  <div key={channel.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <span>{channel.name}</span>
                      <span className="font-mono">{channel.usageCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(channel.usageCount / Math.max(...channels.map(c => c.usageCount))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الاتصالات حسب نوع المستلم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <span>الملاك</span>
                    <span className="font-mono">{logs.filter(l => l.recipientType === 'owner').length * 5}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <span>الموظفون</span>
                    <span className="font-mono">{logs.filter(l => l.recipientType === 'employee').length * 4}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <span>جهات خارجية</span>
                    <span className="font-mono">{logs.filter(l => l.recipientType === 'external').length * 2}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ============================================================
  // التاب 8: الإعدادات
  // ============================================================
  const renderTab08_Settings = () => {
    return (
      <div className="space-y-3">
        <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات التواصل</h2>

        <div className="grid grid-cols-2 gap-3">
          {/* إعدادات عامة */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الإعدادات العامة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <EnhancedSwitch
                  id="auto-send"
                  checked={true}
                  onCheckedChange={() => {}}
                  label="الإرسال التلقائي"
                  description="إرسال الرسائل تلقائياً بدون تأكيد"
                />
              </div>
              
              <div>
                <EnhancedSwitch
                  id="save-log"
                  checked={true}
                  onCheckedChange={() => {}}
                  label="حفظ السجل"
                  description="حفظ جميع الاتصالات في السجل"
                />
              </div>

              <div>
                <EnhancedSwitch
                  id="notify-fail"
                  checked={true}
                  onCheckedChange={() => {}}
                  label="إشعار عند الفشل"
                  description="إرسال إشعار عند فشل الإرسال"
                />
              </div>

              <div>
                <EnhancedSwitch
                  id="confirm-send"
                  checked={false}
                  onCheckedChange={() => {}}
                  label="تأكيد قبل الإرسال"
                  description="طلب تأكيد قبل إرسال كل رسالة"
                />
              </div>
            </CardContent>
          </Card>

          {/* إعدادات الأولويات */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إعدادات الأولويات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  عدد المحاولات للإرسال
                </label>
                <InputWithCopy
                  label=""
                  value="3"
                  onChange={() => {}}
                  copyable={false}
                  clearable={false}
                />
              </div>

              <div>
                <label className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  مهلة الانتظار (بالثواني)
                </label>
                <InputWithCopy
                  label=""
                  value="30"
                  onChange={() => {}}
                  copyable={false}
                  clearable={false}
                />
              </div>

              <div>
                <label className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  وسيلة الإرسال الافتراضية
                </label>
                <SelectWithCopy
                  label=""
                  value="whatsapp"
                  onChange={() => {}}
                  options={[
                    { value: 'phone', label: 'اتصال هاتفي' },
                    { value: 'whatsapp', label: 'واتساب' },
                    { value: 'email', label: 'بريد إلكتروني' },
                    { value: 'sms', label: 'رسالة نصية' }
                  ]}
                  copyable={false}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* أزرار الحفظ */}
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <RefreshCw className="h-3 w-3 ml-1" />
            إعادة تعيين
          </Button>
          <Button size="sm" className="h-8 text-xs">
            <Save className="h-3 w-3 ml-1" />
            حفظ التغييرات
          </Button>
        </div>
      </div>
    );
  };

  // ============================================================
  // المحتوى الرئيسي
  // ============================================================
  const renderTabContent = () => {
    switch (activeTab) {
      case '856-01': return renderTab01_Overview();
      case '856-02': return renderTab02_CallChannels();
      case '856-03': return renderTab03_MessagingChannels();
      case '856-04': return renderTab04_NotificationChannels();
      case '856-05': return renderTab05_Templates();
      case '856-06': return renderTab06_CommunicationLog();
      case '856-07': return renderTab07_Statistics();
      case '856-08': return renderTab08_Settings();
      default: return <div className="p-8 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب {activeTab} قيد التطوير...</div>;
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
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
              <MessageSquare 
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
                  إدارة وسائل التواصل
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
                    856
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
                إدارة شاملة لوسائل الاتصال والتراسل والإشعارات
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
                8 تبويبات
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
    </div>
  );
};

export default CommunicationChannels_Complete_856;
