/**
 * الشاشة 827 - سجلات التواصل
 * ============================
 * 
 * أرشفة شاملة لجميع المراسلات والاتصالات في النظام
 * 
 * المميزات:
 * - تصنيف المراسلات حسب الأطراف
 * - ربط تلقائي بالمعاملات عند ذكر رقم المعاملة
 * - طباعة تقارير مختصرة ومفصلة
 * - توثيق IP ومعلومات المرسل
 * - بحث وتصفية متقدمة
 * 
 * التابات (6 تبويبات):
 * 827-01: جميع السجلات
 * 827-02: بين فريق العمل
 * 827-03: المكتب والمالك
 * 827-04: المالك والجهات
 * 827-05: المكتب والجهات
 * 827-06: التقارير والإحصائيات
 * 
 * @version 1.0
 * @date 2025-10-25
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import {
  MessageSquare, Users, Building, Landmark, FileText, BarChart3,
  Plus, Edit, Trash2, Save, Search, Eye, Printer, Download,
  Mail, Phone, Send, Inbox, Archive, Clock, Calendar, Filter,
  CheckCircle, AlertCircle, Info, Globe, MapPin, User,
  Tag, Link2, Paperclip, Star, Flag, TrendingUp
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';

// ===== واجهات البيانات =====

interface CommunicationLog {
  id: string;
  code: string;
  type: 'email' | 'phone' | 'meeting' | 'letter' | 'whatsapp' | 'sms';
  category: 'team-internal' | 'office-owner' | 'owner-entities' | 'office-entities';
  subject: string;
  content: string;
  fromParty: {
    name: string;
    role: string;
    type: 'employee' | 'owner' | 'entity' | 'external';
  };
  toParty: {
    name: string;
    role: string;
    type: 'employee' | 'owner' | 'entity' | 'external';
  };
  transactionNumber?: string; // رقم المعاملة المرتبط (إذا وجد)
  linkedTransactions: string[]; // معاملات مرتبطة (تم ذكرها في المحتوى)
  attachments: string[];
  priority: 'عالية' | 'متوسطة' | 'منخفضة';
  status: 'مرسل' | 'مستلم' | 'قيد القراءة' | 'مجاب عليه' | 'أرشيف';
  ipAddress: string;
  location?: string;
  deviceInfo?: string;
  timestamp: string;
  readAt?: string;
  repliedAt?: string;
  createdBy: string;
  tags: string[];
  isImportant: boolean;
  isFlagged: boolean;
  createdDate: string;
}

const CommunicationLogs_Complete_827: React.FC = () => {
  const [activeTab, setActiveTab] = useState('827-01');

  // البيانات الوهمية
  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>([
    {
      id: '1',
      code: 'LOG-001',
      type: 'email',
      category: 'office-owner',
      subject: 'استلام المخططات النهائية للمعاملة 2501003',
      content: 'تم استلام المخططات النهائية للمشروع السكني وجاهزة للمراجعة',
      fromParty: { name: 'مهندس أحمد محمد', role: 'مدير المشاريع', type: 'employee' },
      toParty: { name: 'خالد العتيبي', role: 'المالك', type: 'owner' },
      transactionNumber: '2501003',
      linkedTransactions: ['2501003'],
      attachments: ['plans-final.pdf', 'notes.docx'],
      priority: 'عالية',
      status: 'مرسل',
      ipAddress: '192.168.1.100',
      location: 'الرياض، السعودية',
      deviceInfo: 'Windows 11 - Chrome',
      timestamp: '2025-01-15 14:30:00',
      createdBy: 'ahmed.mohamed',
      tags: ['مخططات', 'نهائي', 'سكني'],
      isImportant: true,
      isFlagged: false,
      createdDate: '2025-01-15',
    },
    {
      id: '2',
      code: 'LOG-002',
      type: 'phone',
      category: 'team-internal',
      subject: 'مكالمة بخصوص تحديث عرض السعر',
      content: 'تمت مناقشة التعديلات المطلوبة على عرض السعر للمشروع التجاري',
      fromParty: { name: 'سارة أحمد', role: 'محاسبة', type: 'employee' },
      toParty: { name: 'مهندس فهد', role: 'مهندس تصميم', type: 'employee' },
      linkedTransactions: [],
      attachments: [],
      priority: 'متوسطة',
      status: 'مجاب عليه',
      ipAddress: '192.168.1.101',
      location: 'الرياض، السعودية',
      timestamp: '2025-01-15 10:15:00',
      readAt: '2025-01-15 10:16:00',
      repliedAt: '2025-01-15 10:30:00',
      createdBy: 'sara.ahmed',
      tags: ['عرض سعر', 'داخلي'],
      isImportant: false,
      isFlagged: false,
      createdDate: '2025-01-15',
    },
    {
      id: '3',
      code: 'LOG-003',
      type: 'letter',
      category: 'office-entities',
      subject: 'طلب الحصول على رخصة بناء',
      content: 'تقديم طلب رسمي للحصول على رخصة البناء للمشروع رقم 2501005',
      fromParty: { name: 'مكتب الهندسة المعمارية', role: 'المكتب', type: 'employee' },
      toParty: { name: 'أمانة منطقة الرياض', role: 'جهة حكومية', type: 'entity' },
      transactionNumber: '2501005',
      linkedTransactions: ['2501005'],
      attachments: ['application-form.pdf', 'plans.pdf', 'deed.pdf'],
      priority: 'عالية',
      status: 'مرسل',
      ipAddress: '192.168.1.102',
      location: 'الرياض، السعودية',
      timestamp: '2025-01-14 09:00:00',
      createdBy: 'admin',
      tags: ['رخصة', 'أمانة', 'رسمي'],
      isImportant: true,
      isFlagged: true,
      createdDate: '2025-01-14',
    },
    {
      id: '4',
      code: 'LOG-004',
      type: 'whatsapp',
      category: 'owner-entities',
      subject: 'استفسار عن حالة الطلب',
      content: 'المالك يستفسر عن حالة طلب الترخيص المقدم للأمانة',
      fromParty: { name: 'عبدالله السالم', role: 'المالك', type: 'owner' },
      toParty: { name: 'أمانة منطقة الرياض', role: 'جهة حكومية', type: 'entity' },
      linkedTransactions: ['2501005'],
      attachments: [],
      priority: 'متوسطة',
      status: 'قيد القراءة',
      ipAddress: '',
      timestamp: '2025-01-16 16:45:00',
      createdBy: 'abdullah.salem',
      tags: ['استفسار', 'ترخيص'],
      isImportant: false,
      isFlagged: false,
      createdDate: '2025-01-16',
    },
    {
      id: '5',
      code: 'LOG-005',
      type: 'meeting',
      category: 'team-internal',
      subject: 'اجتماع فريق المشاريع الأسبوعي',
      content: 'اجتماع لمناقشة تقدم المشاريع الجارية وحل المشاكل',
      fromParty: { name: 'مدير المشاريع', role: 'مدير', type: 'employee' },
      toParty: { name: 'فريق المشاريع', role: 'فريق العمل', type: 'employee' },
      linkedTransactions: ['2501001', '2501002', '2501003', '2501004'],
      attachments: ['meeting-minutes.pdf'],
      priority: 'متوسطة',
      status: 'مجاب عليه',
      ipAddress: '192.168.1.103',
      location: 'قاعة الاجتماعات - المكتب',
      timestamp: '2025-01-13 10:00:00',
      createdBy: 'project.manager',
      tags: ['اجتماع', 'أسبوعي', 'فريق'],
      isImportant: true,
      isFlagged: false,
      createdDate: '2025-01-13',
    },
  ]);

  const TABS_CONFIG: TabConfig[] = [
    { id: '827-01', number: '827-01', title: 'جميع السجلات', icon: MessageSquare },
    { id: '827-02', number: '827-02', title: 'بين فريق العمل', icon: Users },
    { id: '827-03', number: '827-03', title: 'المكتب والمالك', icon: Building },
    { id: '827-04', number: '827-04', title: 'المالك والجهات', icon: Landmark },
    { id: '827-05', number: '827-05', title: 'المكتب والجهات', icon: FileText },
    { id: '827-06', number: '827-06', title: 'التقارير والإحصائيات', icon: BarChart3 },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'letter': return <FileText className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'sms': return <Send className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'team-internal':
        return { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' };
      case 'office-owner':
        return { bg: '#dcfce7', color: '#166534', border: '#86efac' };
      case 'owner-entities':
        return { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' };
      case 'office-entities':
        return { bg: '#e0e7ff', color: '#3730a3', border: '#a5b4fc' };
      default:
        return { bg: '#f3f4f6', color: '#6b7280', border: '#d1d5db' };
    }
  };

  const filterLogsByCategory = (category?: string) => {
    if (!category) return communicationLogs;
    return communicationLogs.filter(log => log.category === category);
  };

  const renderLogsTable = (category?: string) => {
    const filteredLogs = filterLogsByCategory(category);
    
    return (
      <div className="space-y-6">
        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي السجلات</p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1e40af' }}>
                    {filteredLogs.length}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مرسلة</p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#166534' }}>
                    {filteredLogs.filter(l => l.status === 'مرسل').length}
                  </p>
                </div>
                <Send className="h-8 w-8 text-green-600 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>قيد القراءة</p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#92400e' }}>
                    {filteredLogs.filter(l => l.status === 'قيد القراءة').length}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-yellow-700 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مجاب عليها</p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#3730a3' }}>
                    {filteredLogs.filter(l => l.status === 'مجاب عليه').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-indigo-700 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مهمة</p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '24px', fontWeight: 700, color: '#991b1b' }}>
                    {filteredLogs.filter(l => l.isImportant).length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-red-600 opacity-60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* الجدول */}
        <Card className="card-rtl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                سجلات التواصل
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" className="button-rtl">
                  <Filter className="h-4 w-4" />
                  تصفية
                </Button>
                <Button variant="outline" className="button-rtl">
                  <Printer className="h-4 w-4" />
                  طباعة
                </Button>
                <Button className="button-rtl">
                  <Plus className="h-4 w-4" />
                  سجل جديد
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموضوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>من</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إلى</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => {
                    const colors = getCategoryBadgeColor(log.category);
                    return (
                      <TableRow key={log.id}>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2">
                            <Badge className="font-mono">{log.code}</Badge>
                            {log.isImportant && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                            {log.isFlagged && <Flag className="h-3 w-3 text-red-500 fill-red-500" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {getTypeIcon(log.type)}
                            <span className="mr-1">
                              {log.type === 'email' && 'بريد'}
                              {log.type === 'phone' && 'مكالمة'}
                              {log.type === 'meeting' && 'اجتماع'}
                              {log.type === 'letter' && 'خطاب'}
                              {log.type === 'whatsapp' && 'واتساب'}
                              {log.type === 'sms' && 'رسالة'}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            style={{
                              fontFamily: 'Tajawal, sans-serif',
                              background: colors.bg,
                              color: colors.color,
                              border: `1px solid ${colors.border}`
                            }}
                          >
                            {log.category === 'team-internal' && 'فريق العمل'}
                            {log.category === 'office-owner' && 'مكتب-مالك'}
                            {log.category === 'owner-entities' && 'مالك-جهات'}
                            {log.category === 'office-entities' && 'مكتب-جهات'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, maxWidth: '300px' }}>
                          {log.subject}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                          <div>
                            <div>{log.fromParty.name}</div>
                            <div className="text-[10px]" style={{ color: '#6b7280' }}>{log.fromParty.role}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                          <div>
                            <div>{log.toParty.name}</div>
                            <div className="text-[10px]" style={{ color: '#6b7280' }}>{log.toParty.role}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {log.linkedTransactions.length > 0 ? (
                            <div className="flex gap-1 flex-wrap">
                              {log.linkedTransactions.map((txn, idx) => (
                                <Badge key={idx} variant="outline" className="font-mono text-[10px]">
                                  {txn}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs" style={{ color: '#9ca3af' }}>-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant="outline" 
                            style={{ 
                              fontFamily: 'Tajawal, sans-serif',
                              fontSize: '11px'
                            }}
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {log.timestamp}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Printer className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
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
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '827-01':
        return renderLogsTable();
      case '827-02':
        return renderLogsTable('team-internal');
      case '827-03':
        return renderLogsTable('office-owner');
      case '827-04':
        return renderLogsTable('owner-entities');
      case '827-05':
        return renderLogsTable('office-entities');
      case '827-06':
        return (
          <Card className="card-rtl">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التقارير والإحصائيات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                محتوى التقارير قيد التطوير...
              </p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ paddingTop: '40px', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
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
                  سجلات التواصل
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
                    827
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
                أرشفة شاملة لجميع المراسلات والاتصالات
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
        {/* السايد بار */}
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* المحتوى */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', padding: '0 20px 20px 20px' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CommunicationLogs_Complete_827;
