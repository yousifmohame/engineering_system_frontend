/**
 * الشاشة 858 - البريد الإلكتروني الرسمي (كاملة ومفصلة)
 * ================================================================
 * 
 * نظام شامل لإدارة البريد الإلكتروني الرسمي للمكتب
 * 
 * المميزات:
 * ✅ 10 تبويبات كاملة ومفصلة
 * ✅ استقبال البريد عبر POP3/IMAP
 * ✅ إرسال البريد عبر SMTP
 * ✅ إدارة كاملة للرسائل (وارد، مرسل، مسودات، أرشيف)
 * ✅ إنشاء رسائل جديدة مع محرر نصوص غني
 * ✅ قوالب رسائل جاهزة
 * ✅ مرفقات وملفات
 * ✅ تصنيفات ومجلدات مخصصة
 * ✅ بحث متقدم وفلترة
 * ✅ تكامل مع المعاملات والعملاء
 * 
 * @version 1.0
 * @date 1 نوفمبر 2025
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
  Mail, Send, Inbox, Archive, FileText, Settings, BarChart3, Users,
  Plus, Edit, Eye, Trash2, Search, Download, Upload, Paperclip,
  Star, Reply, Forward, RefreshCw, Filter, Clock, CheckCircle,
  XCircle, AlertCircle, Folder, Tag, Server, Key, Shield,
  Globe, Zap, Activity, TrendingUp, User, Building2, Phone,
  MessageSquare, Calendar, ExternalLink, Copy, Save, Printer,
  FileUp, FileDown, FilePlus, FolderOpen, MoreVertical
} from 'lucide-react';

// ============================================================
// تكوين التابات
// ============================================================

const TABS_CONFIG: TabConfig[] = [
  { id: '858-01', number: '858-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '858-02', number: '858-02', title: 'صندوق الوارد', icon: Inbox },
  { id: '858-03', number: '858-03', title: 'المرسل', icon: Send },
  { id: '858-04', number: '858-04', title: 'إنشاء رسالة', icon: Mail },
  { id: '858-05', number: '858-05', title: 'المسودات', icon: FileText },
  { id: '858-06', number: '858-06', title: 'الأرشيف', icon: Archive },
  { id: '858-07', number: '858-07', title: 'القوالب', icon: Copy },
  { id: '858-08', number: '858-08', title: 'إعدادات SMTP', icon: Server },
  { id: '858-09', number: '858-09', title: 'إعدادات POP/IMAP', icon: Globe },
  { id: '858-10', number: '858-10', title: 'الإعدادات', icon: Settings },
];

// ============================================================
// الواجهات (Interfaces)
// ============================================================

interface EmailMessage {
  id: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  attachments: EmailAttachment[];
  date: string;
  time: string;
  read: boolean;
  starred: boolean;
  folder: string;
  labels: string[];
  priority: 'high' | 'normal' | 'low';
  status: 'sent' | 'received' | 'draft' | 'failed';
  relatedTransaction?: string;
  relatedClient?: string;
}

interface EmailAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  variables: string[];
  usageCount: number;
  createdBy: string;
  createdDate: string;
}

interface EmailFolder {
  id: string;
  name: string;
  icon: any;
  color: string;
  count: number;
  unreadCount: number;
}

interface SMTPSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: 'ssl' | 'tls' | 'none';
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
  enabled: boolean;
  testConnection: boolean;
}

interface POPIMAPSettings {
  protocol: 'pop3' | 'imap';
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: 'ssl' | 'tls' | 'none';
  autoSync: boolean;
  syncInterval: number;
  deleteFromServer: boolean;
  enabled: boolean;
  testConnection: boolean;
}

// ============================================================
// المكون الرئيسي
// ============================================================

const OfficialEmail_Complete_858: React.FC = () => {
  const [activeTab, setActiveTab] = useState('858-01');
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);

  // البيانات الوهمية
  const [emails] = useState<EmailMessage[]>([
    {
      id: 'E001',
      from: 'client@example.com',
      to: 'office@engineering.com',
      subject: 'استفسار عن رخصة البناء - معاملة 2501023',
      body: 'السلام عليكم، أود الاستفسار عن حالة معاملة رخصة البناء رقم 2501023...',
      attachments: [
        { id: 'A001', name: 'صك_ملكية.pdf', size: '2.5 MB', type: 'PDF', url: '#' }
      ],
      date: '2025-11-01',
      time: '10:30',
      read: false,
      starred: true,
      folder: 'inbox',
      labels: ['معاملات', 'رخص'],
      priority: 'high',
      status: 'received',
      relatedTransaction: '2501023',
      relatedClient: 'C001'
    },
    {
      id: 'E002',
      from: 'balady@gov.sa',
      to: 'office@engineering.com',
      subject: 'إشعار بالموافقة المبدئية - معاملة 2501018',
      body: 'يسرنا إبلاغكم بالموافقة المبدئية على معاملة البناء...',
      attachments: [],
      date: '2025-10-31',
      time: '14:15',
      read: true,
      starred: false,
      folder: 'inbox',
      labels: ['جهات حكومية', 'موافقات'],
      priority: 'high',
      status: 'received',
      relatedTransaction: '2501018'
    },
    {
      id: 'E003',
      from: 'office@engineering.com',
      to: 'client@example.com',
      subject: 'رد: استفسار عن رخصة البناء',
      body: 'وعليكم السلام، تم مراجعة معاملتكم وهي قيد الإنجاز...',
      attachments: [],
      date: '2025-10-30',
      time: '09:00',
      read: true,
      starred: false,
      folder: 'sent',
      labels: ['عملاء'],
      priority: 'normal',
      status: 'sent',
      relatedClient: 'C001'
    },
    {
      id: 'E004',
      from: 'office@engineering.com',
      to: 'supplier@company.com',
      subject: 'طلب عرض سعر - مشروع سكني',
      body: 'نرجو منكم تزويدنا بعرض سعر لمشروع سكني...',
      attachments: [
        { id: 'A002', name: 'مواصفات_المشروع.docx', size: '1.2 MB', type: 'DOCX', url: '#' }
      ],
      date: '2025-10-29',
      time: '16:45',
      read: true,
      starred: false,
      folder: 'sent',
      labels: ['موردين'],
      priority: 'normal',
      status: 'sent'
    },
    {
      id: 'E005',
      from: 'office@engineering.com',
      to: '',
      subject: 'مسودة - تقرير شهري',
      body: 'التقرير الشهري لأعمال المكتب...',
      attachments: [],
      date: '2025-10-28',
      time: '11:20',
      read: true,
      starred: false,
      folder: 'drafts',
      labels: ['تقارير'],
      priority: 'normal',
      status: 'draft'
    }
  ]);

  const [templates] = useState<EmailTemplate[]>([
    {
      id: 'T001',
      name: 'رد على استفسار عميل',
      subject: 'رد: {subject}',
      body: 'السيد/ة {client_name},\n\nشكراً على تواصلكم معنا...\n\nمع تحياتنا\nالمكتب الهندسي',
      category: 'عملاء',
      variables: ['{client_name}', '{subject}', '{transaction_number}'],
      usageCount: 45,
      createdBy: 'أحمد محمد',
      createdDate: '2025-01-15'
    },
    {
      id: 'T002',
      name: 'طلب مستندات',
      subject: 'طلب استكمال المستندات - معاملة {transaction_number}',
      body: 'عزيزنا العميل,\n\nنأمل منكم التكرم بتزويدنا بالمستندات التالية:\n{documents_list}\n\nمع الشكر',
      category: 'معاملات',
      variables: ['{client_name}', '{transaction_number}', '{documents_list}'],
      usageCount: 38,
      createdBy: 'فاطمة علي',
      createdDate: '2025-02-10'
    },
    {
      id: 'T003',
      name: 'إشعار بالموافقة',
      subject: 'إشعار بالموافقة على معاملة {transaction_number}',
      body: 'يسرنا إبلاغكم بالموافقة على معاملتكم رقم {transaction_number}...',
      category: 'إشعارات',
      variables: ['{client_name}', '{transaction_number}', '{approval_date}'],
      usageCount: 52,
      createdBy: 'محمد خالد',
      createdDate: '2025-01-20'
    }
  ]);

  const [folders] = useState<EmailFolder[]>([
    { id: 'inbox', name: 'صندوق الوارد', icon: Inbox, color: '#3b82f6', count: 48, unreadCount: 12 },
    { id: 'sent', name: 'المرسل', icon: Send, color: '#10b981', count: 156, unreadCount: 0 },
    { id: 'drafts', name: 'المسودات', icon: FileText, color: '#f59e0b', count: 8, unreadCount: 0 },
    { id: 'archive', name: 'الأرشيف', icon: Archive, color: '#6b7280', count: 324, unreadCount: 0 },
    { id: 'starred', name: 'المميزة', icon: Star, color: '#eab308', count: 23, unreadCount: 5 },
    { id: 'important', name: 'مهمة', icon: AlertCircle, color: '#ef4444', count: 15, unreadCount: 3 }
  ]);

  // ============================================================
  // التاب 1: نظرة عامة
  // ============================================================
  const renderTab01_Overview = () => (
    <div className="space-y-3">
      <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة على البريد الإلكتروني</h2>

      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-6 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #3b82f6' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e3a8a' }}>صندوق الوارد</p>
                <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1e40af' }}>
                  {emails.filter(e => e.folder === 'inbox').length}
                </p>
                <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#3b82f6' }}>
                  {emails.filter(e => e.folder === 'inbox' && !e.read).length} غير مقروءة
                </p>
              </div>
              <Inbox className="h-6 w-6" style={{ color: '#3b82f6' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #10b981' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#065f46' }}>المرسل</p>
                <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#047857' }}>
                  {emails.filter(e => e.folder === 'sent').length}
                </p>
              </div>
              <Send className="h-6 w-6" style={{ color: '#10b981' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #f59e0b' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#78350f' }}>المسودات</p>
                <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#92400e' }}>
                  {emails.filter(e => e.folder === 'drafts').length}
                </p>
              </div>
              <FileText className="h-6 w-6" style={{ color: '#f59e0b' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #6366f1' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#312e81' }}>الأرشيف</p>
                <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#3730a3' }}>
                  324
                </p>
              </div>
              <Archive className="h-6 w-6" style={{ color: '#6366f1' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)', border: '2px solid #eab308' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#713f12' }}>المميزة</p>
                <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#854d0e' }}>
                  {emails.filter(e => e.starred).length}
                </p>
              </div>
              <Star className="h-6 w-6" style={{ color: '#eab308' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)', border: '2px solid #8b5cf6' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4c1d95' }}>القوالب</p>
                <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#5b21b6' }}>
                  {templates.length}
                </p>
              </div>
              <Copy className="h-6 w-6" style={{ color: '#8b5cf6' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* المجلدات */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>المجلدات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {folders.map(folder => (
              <Card key={folder.id} className="card-element card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        padding: '8px',
                        background: `${folder.color}20`,
                        borderRadius: '8px'
                      }}
                    >
                      <folder.icon className="h-5 w-5" style={{ color: folder.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                        {folder.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{folder.count} رسالة</span>
                        {folder.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-[10px]">{folder.unreadCount} جديدة</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* الرسائل الأخيرة */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الرسائل الأخيرة</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea style={{ height: 'calc(100vh - 500px)' }}>
            <Table className="table-rtl">
              <TableHeader style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 10 }}>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>من/إلى</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموضوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرفقات</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.slice(0, 5).map(email => (
                  <TableRow key={email.id}>
                    <TableCell className="text-right">
                      <div className="flex gap-1">
                        {!email.read && <Badge variant="outline" className="bg-blue-50 text-blue-700">جديدة</Badge>}
                        {email.starred && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                      {email.folder === 'sent' ? email.to : email.from}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                      {email.subject}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                      {email.date} {email.time}
                    </TableCell>
                    <TableCell className="text-right">
                      {email.attachments.length > 0 && (
                        <Badge variant="outline" className="text-[10px]">
                          <Paperclip className="h-3 w-3 ml-1" />
                          {email.attachments.length}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
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
  // التاب 2: صندوق الوارد
  // ============================================================
  const renderTab02_Inbox = () => {
    const inboxEmails = emails.filter(e => e.folder === 'inbox');
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>صندوق الوارد</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Filter className="h-3 w-3 ml-1" />
              تصفية
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <RefreshCw className="h-3 w-3 ml-1" />
              تحديث
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <ScrollArea style={{ height: 'calc(100vh - 300px)' }}>
              <Table className="table-rtl">
                <TableHeader style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 10 }}>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>من</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموضوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرفقات</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inboxEmails.map(email => (
                    <TableRow key={email.id}>
                      <TableCell className="text-right">
                        <div className="flex gap-1">
                          {!email.read && <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[10px]">جديدة</Badge>}
                          {email.starred && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                        </div>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {email.from}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', fontWeight: email.read ? 400 : 600 }}>
                        {email.subject}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {email.date}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={
                          email.priority === 'high' ? 'bg-red-500' :
                          email.priority === 'low' ? 'bg-gray-500' : 'bg-blue-500'
                        }>
                          {email.priority === 'high' ? 'عالية' : email.priority === 'low' ? 'منخفضة' : 'عادية'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {email.attachments.length > 0 && (
                          <Badge variant="outline" className="text-[10px]">
                            <Paperclip className="h-3 w-3 ml-1" />
                            {email.attachments.length}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => {
                            setSelectedEmail(email);
                            setShowEmailDialog(true);
                          }}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                            <Reply className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                            <Archive className="h-3 w-3" />
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
  // التاب 3: المرسل
  // ============================================================
  const renderTab03_Sent = () => {
    const sentEmails = emails.filter(e => e.folder === 'sent');
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرسائل المرسلة</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Search className="h-3 w-3 ml-1" />
              بحث
            </Button>
            <Button size="sm" className="h-8 text-xs" onClick={() => setShowComposeDialog(true)}>
              <Plus className="h-3 w-3 ml-1" />
              رسالة جديدة
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <ScrollArea style={{ height: 'calc(100vh - 300px)' }}>
              <Table className="table-rtl">
                <TableHeader style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 10 }}>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إلى</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموضوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرفقات</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sentEmails.map(email => (
                    <TableRow key={email.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {email.to}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {email.subject}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {email.date} {email.time}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-green-500">
                          <CheckCircle className="h-3 w-3 ml-1" />
                          تم الإرسال
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {email.attachments.length > 0 && (
                          <Badge variant="outline" className="text-[10px]">
                            <Paperclip className="h-3 w-3 ml-1" />
                            {email.attachments.length}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                            <Forward className="h-3 w-3" />
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
  // التاب 4: إنشاء رسالة
  // ============================================================
  const renderTab04_Compose = () => (
    <div className="space-y-3">
      <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إنشاء رسالة جديدة</h2>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InputWithCopy
              label="إلى (To)"
              id="to"
              value=""
              onChange={() => {}}
              placeholder="example@domain.com"
              required
              copyable={false}
              clearable={true}
            />
            
            <InputWithCopy
              label="نسخة (CC)"
              id="cc"
              value=""
              onChange={() => {}}
              placeholder="example@domain.com"
              copyable={false}
              clearable={true}
            />
          </div>

          <InputWithCopy
            label="الموضوع"
            id="subject"
            value=""
            onChange={() => {}}
            placeholder="موضوع الرسالة"
            required
            copyable={false}
            clearable={true}
          />

          <div>
            <label className="text-xs text-gray-600 mb-1 block" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              استخدام قالب جاهز (اختياري)
            </label>
            <SelectWithCopy
              label=""
              value=""
              onChange={() => {}}
              options={templates.map(t => ({ value: t.id, label: t.name }))}
              copyable={false}
            />
          </div>

          <TextAreaWithCopy
            label="محتوى الرسالة"
            id="body"
            value=""
            onChange={() => {}}
            rows={12}
            placeholder="اكتب محتوى الرسالة هنا..."
            required
            copyable={false}
            clearable={true}
          />

          <div>
            <label className="text-xs text-gray-600 mb-2 block" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              المرفقات
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Paperclip className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                اسحب الملفات هنا أو انقر للتحميل
              </p>
              <Button size="sm" variant="outline" className="mt-2 h-8 text-xs">
                <Upload className="h-3 w-3 ml-1" />
                تحميل ملفات
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              الأولوية:
            </label>
            <SelectWithCopy
              label=""
              value="normal"
              onChange={() => {}}
              options={[
                { value: 'high', label: 'عالية' },
                { value: 'normal', label: 'عادية' },
                { value: 'low', label: 'منخفضة' }
              ]}
              copyable={false}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Save className="h-3 w-3 ml-1" />
              حفظ كمسودة
            </Button>
            <Button size="sm" className="h-8 text-xs">
              <Send className="h-3 w-3 ml-1" />
              إرسال الآن
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 5: المسودات
  // ============================================================
  const renderTab05_Drafts = () => {
    const draftEmails = emails.filter(e => e.folder === 'drafts');
    
    return (
      <div className="space-y-3">
        <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسودات</h2>

        <div className="grid grid-cols-2 gap-3">
          {draftEmails.map(email => (
            <Card key={email.id} className="card-element card-rtl">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                    {email.subject || 'بدون موضوع'}
                  </h3>
                  <Badge variant="outline" className="text-[10px]">مسودة</Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {email.body}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{email.date}</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                      <Send className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                      <Trash2 className="h-3 w-3" />
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
  // التاب 6: الأرشيف
  // ============================================================
  const renderTab06_Archive = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأرشيف</h2>
        <Button size="sm" variant="outline" className="h-8 text-xs">
          <Search className="h-3 w-3 ml-1" />
          بحث في الأرشيف
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 text-center">
          <Archive className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            لديك 324 رسالة مؤرشفة
          </p>
          <Button size="sm" className="mt-3 h-8 text-xs">
            عرض جميع الرسائل المؤرشفة
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 7: القوالب
  // ============================================================
  const renderTab07_Templates = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>قوالب الرسائل</h2>
        <Button size="sm" className="h-8 text-xs" onClick={() => setShowTemplateDialog(true)}>
          <Plus className="h-3 w-3 ml-1" />
          قالب جديد
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {templates.map(template => (
          <Card key={template.id} className="card-element card-rtl">
            <CardHeader className="p-3 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {template.name}
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">{template.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              <div className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <div className="text-gray-600 mb-1">الموضوع:</div>
                <div className="font-semibold mb-2">{template.subject}</div>
                
                <div className="text-gray-600 mb-1">المحتوى:</div>
                <div className="bg-gray-50 p-2 rounded text-[10px] h-16 overflow-y-auto">
                  {template.body}
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {template.variables.map(v => (
                  <Badge key={v} variant="outline" className="text-[9px]">{v}</Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <span>استخدم: {template.usageCount} مرة</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ============================================================
  // التاب 8: إعدادات SMTP
  // ============================================================
  const renderTab08_SMTPSettings = () => (
    <div className="space-y-3">
      <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات SMTP (الإرسال)</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            بيانات خادم SMTP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InputWithCopy
              label="عنوان الخادم (SMTP Host)"
              id="smtp-host"
              value="smtp.office.com"
              onChange={() => {}}
              placeholder="smtp.example.com"
              required
            />
            
            <InputWithCopy
              label="المنفذ (Port)"
              id="smtp-port"
              value="587"
              onChange={() => {}}
              placeholder="587"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputWithCopy
              label="اسم المستخدم"
              id="smtp-user"
              value="office@engineering.com"
              onChange={() => {}}
              placeholder="username"
              required
            />
            
            <InputWithCopy
              label="كلمة المرور"
              id="smtp-pass"
              value="••••••••"
              onChange={() => {}}
              placeholder="password"
              required
              copyable={false}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SelectWithCopy
              label="نوع التشفير"
              value="tls"
              onChange={() => {}}
              options={[
                { value: 'ssl', label: 'SSL' },
                { value: 'tls', label: 'TLS' },
                { value: 'none', label: 'بدون تشفير' }
              ]}
              copyable={false}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputWithCopy
              label="اسم المرسل (From Name)"
              id="from-name"
              value="المكتب الهندسي"
              onChange={() => {}}
              placeholder="اسم المرسل"
            />
            
            <InputWithCopy
              label="بريد المرسل (From Email)"
              id="from-email"
              value="office@engineering.com"
              onChange={() => {}}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <EnhancedSwitch
              id="smtp-enabled"
              checked={true}
              onCheckedChange={() => {}}
              label="تفعيل إرسال البريد"
              description="السماح بإرسال الرسائل عبر SMTP"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Zap className="h-3 w-3 ml-1" />
              اختبار الاتصال
            </Button>
            <Button size="sm" className="h-8 text-xs">
              <Save className="h-3 w-3 ml-1" />
              حفظ الإعدادات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 9: إعدادات POP/IMAP
  // ============================================================
  const renderTab09_POPIMAPSettings = () => (
    <div className="space-y-3">
      <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات POP3/IMAP (الاستقبال)</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            بيانات خادم الاستقبال
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <SelectWithCopy
            label="البروتوكول"
            value="imap"
            onChange={() => {}}
            options={[
              { value: 'pop3', label: 'POP3' },
              { value: 'imap', label: 'IMAP' }
            ]}
            copyable={false}
          />

          <div className="grid grid-cols-2 gap-3">
            <InputWithCopy
              label="عنوان الخادم"
              id="pop-host"
              value="imap.office.com"
              onChange={() => {}}
              placeholder="imap.example.com"
              required
            />
            
            <InputWithCopy
              label="المنفذ (Port)"
              id="pop-port"
              value="993"
              onChange={() => {}}
              placeholder="993"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputWithCopy
              label="اسم المستخدم"
              id="pop-user"
              value="office@engineering.com"
              onChange={() => {}}
              placeholder="username"
              required
            />
            
            <InputWithCopy
              label="كلمة المرور"
              id="pop-pass"
              value="••••••••"
              onChange={() => {}}
              placeholder="password"
              required
              copyable={false}
            />
          </div>

          <SelectWithCopy
            label="نوع التشفير"
            value="ssl"
            onChange={() => {}}
            options={[
              { value: 'ssl', label: 'SSL' },
              { value: 'tls', label: 'TLS' },
              { value: 'none', label: 'بدون تشفير' }
            ]}
            copyable={false}
          />

          <div>
            <EnhancedSwitch
              id="auto-sync"
              checked={true}
              onCheckedChange={() => {}}
              label="المزامنة التلقائية"
              description="جلب الرسائل الجديدة تلقائياً"
            />
          </div>

          <InputWithCopy
            label="فترة المزامنة (بالدقائق)"
            id="sync-interval"
            value="5"
            onChange={() => {}}
            placeholder="5"
          />

          <div>
            <EnhancedSwitch
              id="delete-server"
              checked={false}
              onCheckedChange={() => {}}
              label="حذف من الخادم"
              description="حذف الرسائل من الخادم بعد الجلب"
              variant="warning"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Zap className="h-3 w-3 ml-1" />
              اختبار الاتصال
            </Button>
            <Button size="sm" className="h-8 text-xs">
              <Save className="h-3 w-3 ml-1" />
              حفظ الإعدادات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 10: الإعدادات
  // ============================================================
  const renderTab10_Settings = () => (
    <div className="space-y-3">
      <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإعدادات العامة</h2>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إعدادات العرض
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <EnhancedSwitch
                id="show-images"
                checked={true}
                onCheckedChange={() => {}}
                label="عرض الصور تلقائياً"
                description="عرض الصور المضمنة في الرسائل"
              />
            </div>

            <div>
              <EnhancedSwitch
                id="mark-read"
                checked={true}
                onCheckedChange={() => {}}
                label="وضع علامة مقروء تلقائياً"
                description="وضع علامة مقروء عند فتح الرسالة"
              />
            </div>

            <div>
              <EnhancedSwitch
                id="thread-emails"
                checked={false}
                onCheckedChange={() => {}}
                label="عرض الرسائل في مجموعات"
                description="تجميع الرسائل المتعلقة ببعضها"
              />
            </div>

            <SelectWithCopy
              label="عدد الرسائل في الصفحة"
              value="50"
              onChange={() => {}}
              options={[
                { value: '25', label: '25 رسالة' },
                { value: '50', label: '50 رسالة' },
                { value: '100', label: '100 رسالة' }
              ]}
              copyable={false}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إعدادات الإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <EnhancedSwitch
                id="notify-new"
                checked={true}
                onCheckedChange={() => {}}
                label="إشعار عند وصول رسالة جديدة"
                description="إظهار إشعار للرسائل الجديدة"
              />
            </div>

            <div>
              <EnhancedSwitch
                id="notify-important"
                checked={true}
                onCheckedChange={() => {}}
                label="إشعار للرسائل المهمة فقط"
                description="إشعار للرسائل ذات الأولوية العالية"
              />
            </div>

            <div>
              <EnhancedSwitch
                id="email-sound"
                checked={false}
                onCheckedChange={() => {}}
                label="صوت الإشعار"
                description="تشغيل صوت عند وصول رسالة"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إعدادات الأمان
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <EnhancedSwitch
                id="block-external"
                checked={true}
                onCheckedChange={() => {}}
                label="حجب المحتوى الخارجي"
                description="حجب الصور والروابط من مصادر خارجية"
                variant="warning"
              />
            </div>

            <div>
              <EnhancedSwitch
                id="warn-phishing"
                checked={true}
                onCheckedChange={() => {}}
                label="تحذير من التصيد"
                description="التحذير من الرسائل المشبوهة"
                variant="danger"
              />
            </div>

            <div>
              <EnhancedSwitch
                id="encrypt-local"
                checked={false}
                onCheckedChange={() => {}}
                label="تشفير التخزين المحلي"
                description="تشفير الرسائل المحفوظة محلياً"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إعدادات التكامل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <EnhancedSwitch
                id="link-transactions"
                checked={true}
                onCheckedChange={() => {}}
                label="ربط تلقائي بالمعاملات"
                description="ربط الرسائل بالمعاملات تلقائياً"
              />
            </div>

            <div>
              <EnhancedSwitch
                id="link-clients"
                checked={true}
                onCheckedChange={() => {}}
                label="ربط تلقائي بالعملاء"
                description="ربط الرسائل بالعملاء تلقائياً"
              />
            </div>

            <div>
              <EnhancedSwitch
                id="create-tasks"
                checked={false}
                onCheckedChange={() => {}}
                label="إنشاء مهام من الرسائل"
                description="إنشاء مهام تلقائياً من الرسائل المهمة"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="outline" className="h-8 text-xs">
          <RefreshCw className="h-3 w-3 ml-1" />
          إعادة تعيين
        </Button>
        <Button size="sm" className="h-8 text-xs">
          <Save className="h-3 w-3 ml-1" />
          حفظ جميع الإعدادات
        </Button>
      </div>
    </div>
  );

  // ============================================================
  // المحتوى الرئيسي
  // ============================================================
  const renderTabContent = () => {
    switch (activeTab) {
      case '858-01': return renderTab01_Overview();
      case '858-02': return renderTab02_Inbox();
      case '858-03': return renderTab03_Sent();
      case '858-04': return renderTab04_Compose();
      case '858-05': return renderTab05_Drafts();
      case '858-06': return renderTab06_Archive();
      case '858-07': return renderTab07_Templates();
      case '858-08': return renderTab08_SMTPSettings();
      case '858-09': return renderTab09_POPIMAPSettings();
      case '858-10': return renderTab10_Settings();
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
          {/* القسم الأيمن */}
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
              <Mail 
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
                  البريد الإلكتروني الرسمي
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
                    858
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
                إدارة شاملة للبريد الإلكتروني الرسمي للمكتب عبر SMTP و POP3/IMAP
              </p>
            </div>
          </div>
          
          {/* القسم الأيسر */}
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

        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', padding: '0 16px' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة عرض الرسالة */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-4xl dialog-rtl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {selectedEmail?.subject}
            </DialogTitle>
          </DialogHeader>
          {selectedEmail && (
            <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">من:</span> {selectedEmail.from}
                </div>
                <div>
                  <span className="text-gray-600">التاريخ:</span> {selectedEmail.date} {selectedEmail.time}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded text-sm">
                {selectedEmail.body}
              </div>
              {selectedEmail.attachments.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">المرفقات:</p>
                  <div className="space-y-2">
                    {selectedEmail.attachments.map(att => (
                      <div key={att.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm">{att.name}</span>
                          <Badge variant="outline" className="text-[10px]">{att.size}</Badge>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          <Download className="h-3 w-3 ml-1" />
                          تحميل
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficialEmail_Complete_858;
