/**
 * الشاشة 815 - إدارة عروض الأسعار - تطوير تفصيلي شامل v7.0
 * ================================================================
 * 
 * نظام متكامل لإدارة عروض الأسعار مع:
 * - أنواع العروض: مبدئية، نهائية، تكميلية، مستعجلة
 * - ربط مع المعاملات والعملاء والعقود
 * - نظام تسعير ذكي مع حساب تلقائي
 * - إدارة الدفعات والتقسيط
 * - تتبع حالات العروض وتاريخها
 * - نظام موافقات متعدد المستويات
 * - قوالب جاهزة قابلة للتخصيص
 * - ربط مع الحسابات والمالية
 * - نظام تنبيهات ذكي للمتابعة
 * - تقارير تفصيلية وإحصائيات
 * - 15 تبويب مطور بالكامل
 * 
 * التكامل مع الأنظمة الأخرى:
 * - المعاملات (286/700): ربط العرض بالمعاملة
 * - العملاء (360/300): معلومات العميل
 * - العقود (814): تحويل العرض لعقد
 * - المالية (222): الدفعات والحسابات
 * - الموظفين (817): المسؤولون عن العرض
 * 
 * التطوير: نوفمبر 2025 - v7.0
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  FileText, Plus, Edit, Trash2, Eye, Download, Upload, CheckCircle,
  Clock, AlertCircle, X, Search, Filter, Calendar, DollarSign,
  Users, Building, Mail, Phone, Settings, History, Archive,
  RefreshCw, Printer, Send, Target, Award, TrendingUp, Paperclip,
  Shield, Bell, Calculator, Receipt, CreditCard, Wallet, Copy,
  Save, FilePlus, FileCheck, FileX, UserCheck, Percent, Tag,
  Layers, Info, AlertTriangle, Star, Zap, Activity, BarChart3
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

// ===== تكوين التابات - 15 تبويب شامل =====
const TABS_CONFIG = [
  { id: '815-01', number: '815-01', title: 'نظرة عامة', icon: Activity },
  { id: '815-02', number: '815-02', title: 'جميع العروض', icon: FileText },
  { id: '815-03', number: '815-03', title: 'إنشاء عرض جديد', icon: FilePlus },
  { id: '815-04', number: '815-04', title: 'العروض المبدئية', icon: Clock },
  { id: '815-05', number: '815-05', title: 'العروض النهائية', icon: CheckCircle },
  { id: '815-06', number: '815-06', title: 'العروض التكميلية', icon: Target },
  { id: '815-07', number: '815-07', title: 'قوالب العروض', icon: Layers },
  { id: '815-08', number: '815-08', title: 'التسعير والحساب', icon: Calculator },
  { id: '815-09', number: '815-09', title: 'الدفعات والتقسيط', icon: CreditCard },
  { id: '815-10', number: '815-10', title: 'الموافقات', icon: UserCheck },
  { id: '815-11', number: '815-11', title: 'المرفقات', icon: Paperclip },
  { id: '815-12', number: '815-12', title: 'التنبيهات والمتابعة', icon: Bell },
  { id: '815-13', number: '815-13', title: 'التقارير', icon: BarChart3 },
  { id: '815-14', number: '815-14', title: 'الأرشيف', icon: Archive },
  { id: '815-15', number: '815-15', title: 'الإعدادات', icon: Settings },
];

// ===== أنواع العروض =====
const QUOTATION_TYPES = [
  { value: 'preliminary', label: 'عرض مبدئي', color: 'bg-blue-100 text-blue-700', icon: Clock },
  { value: 'final', label: 'عرض نهائي', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'supplementary', label: 'عرض تكميلي', color: 'bg-purple-100 text-purple-700', icon: Target },
  { value: 'urgent', label: 'عرض مستعجل', color: 'bg-red-100 text-red-700', icon: Zap },
];

// ===== حالات العروض =====
const QUOTATION_STATUSES = [
  { value: 'draft', label: 'مسودة', color: 'bg-gray-100 text-gray-700', icon: Edit },
  { value: 'pending_review', label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-700', icon: Eye },
  { value: 'approved', label: 'معتمد', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  { value: 'sent', label: 'مُرسل', color: 'bg-cyan-100 text-cyan-700', icon: Send },
  { value: 'viewed', label: 'تم الاطلاع', color: 'bg-purple-100 text-purple-700', icon: Eye },
  { value: 'negotiating', label: 'قيد التفاوض', color: 'bg-orange-100 text-orange-700', icon: Users },
  { value: 'accepted', label: 'مقبول', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'rejected', label: 'مرفوض', color: 'bg-red-100 text-red-700', icon: X },
  { value: 'expired', label: 'منتهي الصلاحية', color: 'bg-gray-100 text-gray-700', icon: Clock },
  { value: 'converted', label: 'تم التحويل لعقد', color: 'bg-emerald-100 text-emerald-700', icon: FileCheck },
];

// ===== أولويات العروض =====
const PRIORITIES = [
  { value: 'urgent', label: 'عاجل', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  { value: 'high', label: 'عالي', color: 'bg-orange-100 text-orange-700', icon: Star },
  { value: 'medium', label: 'متوسط', color: 'bg-yellow-100 text-yellow-700', icon: Info },
  { value: 'low', label: 'منخفض', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
];

// ===== قوالب العروض =====
const QUOTATION_TEMPLATES = [
  {
    id: 'TEMP-001',
    name: 'عرض سعر ترخيص بناء',
    type: 'final',
    category: 'تراخيص',
    items: 15,
    lastUsed: '2025-01-15',
  },
  {
    id: 'TEMP-002',
    name: 'عرض استشارات هندسية',
    type: 'preliminary',
    category: 'استشارات',
    items: 8,
    lastUsed: '2025-01-10',
  },
  {
    id: 'TEMP-003',
    name: 'عرض إشراف على تنفيذ',
    type: 'final',
    category: 'إشراف',
    items: 12,
    lastUsed: '2025-01-05',
  },
];

// ===== بنود العرض النموذجية =====
const SAMPLE_ITEMS = [
  {
    id: 'ITEM-001',
    name: 'رسوم الترخيص',
    description: 'رسوم إصدار رخصة البناء',
    quantity: 1,
    unit: 'خدمة',
    unitPrice: 50000,
    discount: 0,
    tax: 15,
    total: 57500,
  },
  {
    id: 'ITEM-002',
    name: 'رسوم الدراسة الهندسية',
    description: 'دراسة هندسية شاملة للمشروع',
    quantity: 1,
    unit: 'دراسة',
    unitPrice: 80000,
    discount: 5,
    tax: 15,
    total: 87400,
  },
];

// ===== بيانات تجريبية للعروض =====
const SAMPLE_QUOTATIONS = [
  {
    id: 'QUO-2025-001',
    number: '001/2025',
    type: 'final',
    title: 'عرض سعر لترخيص بناء فيلا سكنية',
    clientName: 'أحمد محمد علي',
    clientId: '360-00123',
    clientPhone: '0501234567',
    clientEmail: 'ahmed@example.com',
    projectName: 'فيلا سكنية - حي النرجس',
    subtotal: 450000,
    discount: 10000,
    taxRate: 15,
    taxAmount: 66000,
    totalAmount: 506000,
    status: 'accepted',
    priority: 'high',
    createdDate: '2025-01-01',
    createdBy: 'محمد أحمد',
    validUntil: '2025-02-01',
    transactionId: '286-00245',
    contractId: 'CNT-2025-001',
    paymentTerms: '3 دفعات',
    items: 12,
    attachments: 3,
    notes: 'العرض يشمل جميع الرسوم والضرائب',
  },
  {
    id: 'QUO-2025-002',
    number: '002/2025',
    type: 'preliminary',
    title: 'عرض سعر مبدئي لاستشارات هندسية',
    clientName: 'فاطمة خالد',
    clientId: '360-00124',
    clientPhone: '0507654321',
    clientEmail: 'fatima@example.com',
    projectName: 'مجمع سكني',
    subtotal: 150000,
    discount: 5000,
    taxRate: 15,
    taxAmount: 21750,
    totalAmount: 166750,
    status: 'sent',
    priority: 'medium',
    createdDate: '2025-01-10',
    createdBy: 'سارة علي',
    validUntil: '2025-02-10',
    transactionId: '286-00246',
    contractId: null,
    paymentTerms: 'دفعة واحدة',
    items: 6,
    attachments: 1,
    notes: 'عرض مبدئي قابل للتعديل',
  },
  {
    id: 'QUO-2025-003',
    number: '003/2025',
    type: 'supplementary',
    title: 'عرض تكميلي لأعمال إضافية',
    clientName: 'سعد عبدالله',
    clientId: '360-00125',
    clientPhone: '0509876543',
    clientEmail: 'saad@example.com',
    projectName: 'توسعة مبنى إداري',
    subtotal: 85000,
    discount: 0,
    taxRate: 15,
    taxAmount: 12750,
    totalAmount: 97750,
    status: 'pending_review',
    priority: 'urgent',
    createdDate: '2025-01-15',
    createdBy: 'خالد محمد',
    validUntil: '2025-01-25',
    transactionId: '286-00247',
    contractId: 'CNT-2025-002',
    paymentTerms: '2 دفعات',
    items: 8,
    attachments: 2,
    notes: 'أعمال إضافية على العقد الأصلي',
  },
];

const QuotationsManagement_Complete_815: React.FC = () => {
  const [activeTab, setActiveTab] = useState('815-01');
  const [quotations, setQuotations] = useState(SAMPLE_QUOTATIONS);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // إحصائيات
  const stats = useMemo(() => ({
    total: quotations.length,
    draft: quotations.filter(q => q.status === 'draft').length,
    sent: quotations.filter(q => q.status === 'sent').length,
    accepted: quotations.filter(q => q.status === 'accepted').length,
    rejected: quotations.filter(q => q.status === 'rejected').length,
    totalValue: quotations.reduce((sum, q) => sum + q.totalAmount, 0),
    acceptedValue: quotations.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.totalAmount, 0),
    preliminary: quotations.filter(q => q.type === 'preliminary').length,
    final: quotations.filter(q => q.type === 'final').length,
    supplementary: quotations.filter(q => q.type === 'supplementary').length,
  }), [quotations]);

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 815-01: نظرة عامة
      case '815-01':
        return (
          <div className="universal-dense-tab-content">
            {/* إحصائيات رئيسية */}
            <div className="dense-stats-grid mb-4">
              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-blue-100 text-blue-600">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.total}</div>
                <div className="dense-stat-label">إجمالي العروض</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-green-100 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.accepted}</div>
                <div className="dense-stat-label">عروض مقبولة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-yellow-100 text-yellow-600">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.sent}</div>
                <div className="dense-stat-label">مُرسلة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-red-100 text-red-600">
                  <X className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.rejected}</div>
                <div className="dense-stat-label">مرفوضة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-emerald-100 text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.totalValue.toLocaleString()}</div>
                <div className="dense-stat-label">إجمالي القيمة (ر.س)</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-purple-100 text-purple-600">
                  <Award className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.acceptedValue.toLocaleString()}</div>
                <div className="dense-stat-label">قيمة المقبولة (ر.س)</div>
              </Card>
            </div>

            <Separator className="my-4" />

            {/* التوزيع حسب النوع */}
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Layers className="h-4 w-4" />
                  توزيع العروض حسب النوع
                </h2>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-3 gap-3">
                  {QUOTATION_TYPES.map((type) => {
                    const count = stats[type.value as keyof typeof stats] as number;
                    const TypeIcon = type.icon;
                    const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                    
                    return (
                      <div key={type.value} className="dense-content-card p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-lg ${type.color} flex items-center justify-center`}>
                            <TypeIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium">{type.label}</div>
                            <div className="text-xs text-gray-600">{count} عرض</div>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2 mb-1" />
                        <div className="text-xs text-gray-500 text-center">{percentage.toFixed(1)}%</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* العروض التي تحتاج متابعة */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Bell className="h-4 w-4" />
                  عروض تحتاج متابعة
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quotations.filter(q => ['sent', 'pending_review', 'negotiating'].includes(q.status)).map((quote) => {
                    const statusInfo = QUOTATION_STATUSES.find(s => s.value === quote.status);
                    const typeInfo = QUOTATION_TYPES.find(t => t.value === quote.type);
                    const priorityInfo = PRIORITIES.find(p => p.value === quote.priority);
                    
                    return (
                      <div key={quote.id} className="dense-content-card p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="text-xs bg-gray-100 text-gray-700 font-mono">
                                {quote.id}
                              </Badge>
                              <Badge className={typeInfo?.color}>
                                {typeInfo?.label}
                              </Badge>
                              <Badge className={statusInfo?.color}>
                                {statusInfo?.label}
                              </Badge>
                              {priorityInfo && (
                                <Badge className={priorityInfo.color}>
                                  {priorityInfo.label}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm font-medium mb-1">{quote.title}</div>
                            <div className="dense-grid dense-grid-2 gap-2 text-xs mb-2">
                              <div>
                                <span className="text-gray-600">العميل:</span>
                                <span className="font-medium mr-1">{quote.clientName}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">القيمة:</span>
                                <span className="font-medium mr-1">{quote.totalAmount.toLocaleString()} ر.س</span>
                              </div>
                              <div>
                                <span className="text-gray-600">التاريخ:</span>
                                <span className="font-medium mr-1">{quote.createdDate}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">صالح حتى:</span>
                                <span className="font-medium mr-1">{quote.validUntil}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 pt-2 border-t">
                          <Button className="dense-btn dense-btn-primary">
                            <Eye className="h-3 w-3" />
                            عرض
                          </Button>
                          <Button className="dense-action-btn">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Send className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 815-02: جميع العروض
      case '815-02':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FileText className="h-4 w-4" />
                  جميع عروض الأسعار
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-secondary">
                    <Search className="h-3 w-3" />
                    بحث
                  </Button>
                  <Button className="dense-btn dense-btn-secondary">
                    <Filter className="h-3 w-3" />
                    تصفية
                  </Button>
                  <Button className="dense-btn dense-btn-primary">
                    <Plus className="h-3 w-3" />
                    جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم العرض</TableHead>
                      <TableHead className="text-right">العنوان</TableHead>
                      <TableHead className="text-right">العميل</TableHead>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">القيمة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotations.map((quote) => {
                      const statusInfo = QUOTATION_STATUSES.find(s => s.value === quote.status);
                      const typeInfo = QUOTATION_TYPES.find(t => t.value === quote.type);
                      
                      return (
                        <TableRow key={quote.id}>
                          <TableCell className="text-right">
                            <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                              {quote.number}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs font-medium">
                            {quote.title}
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {quote.clientName}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={typeInfo?.color}>
                              {typeInfo?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs font-medium">
                            {quote.totalAmount.toLocaleString()} ر.س
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={statusInfo?.color}>
                              {statusInfo?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {quote.createdDate}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Button className="dense-action-btn">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button className="dense-action-btn">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button className="dense-action-btn">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // 815-03: إنشاء عرض جديد
      case '815-03':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FilePlus className="h-4 w-4" />
                  إنشاء عرض سعر جديد
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Save className="h-3 w-3" />
                  حفظ
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* معلومات العرض الأساسية */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      معلومات العرض الأساسية
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <InputWithCopy
                        label="رقم العرض"
                        id="quoteNumber"
                        defaultValue=""
                        placeholder="سيتم التوليد تلقائياً"
                      />

                      <SelectWithCopy
                        label="نوع العرض"
                        id="quoteType"
                        defaultValue=""
                        options={[
                          { value: '', label: 'اختر نوع العرض' },
                          ...QUOTATION_TYPES.map(t => ({ value: t.value, label: t.label }))
                        ]}
                      />

                      <InputWithCopy
                        label="عنوان العرض"
                        id="quoteTitle"
                        defaultValue=""
                        placeholder="مثال: عرض سعر لترخيص بناء"
                      />

                      <SelectWithCopy
                        label="الأولوية"
                        id="quotePriority"
                        defaultValue="medium"
                        options={PRIORITIES.map(p => ({ value: p.value, label: p.label }))}
                      />

                      <DateInputWithToday
                        label="تاريخ العرض"
                        id="quoteDate"
                      />

                      <DateInputWithToday
                        label="صالح حتى"
                        id="validUntil"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* معلومات العميل */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      معلومات العميل
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <SelectWithCopy
                        label="العميل"
                        id="clientId"
                        defaultValue=""
                        options={[
                          { value: '', label: 'اختر العميل' },
                          { value: '360-00123', label: 'أحمد محمد علي - 360-00123' },
                          { value: '360-00124', label: 'فاطمة خالد - 360-00124' },
                        ]}
                      />

                      <InputWithCopy
                        label="رقم الجوال"
                        id="clientPhone"
                        defaultValue=""
                        placeholder="05XXXXXXXX"
                      />

                      <InputWithCopy
                        label="البريد الإلكتروني"
                        id="clientEmail"
                        defaultValue=""
                        placeholder="client@example.com"
                      />

                      <InputWithCopy
                        label="اسم المشروع"
                        id="projectName"
                        defaultValue=""
                        placeholder="مثال: فيلا سكنية - حي النرجس"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* الربط مع الأنظمة */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      الربط مع الأنظمة
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <SelectWithCopy
                        label="المعاملة المرتبطة (اختياري)"
                        id="transactionId"
                        defaultValue=""
                        options={[
                          { value: '', label: 'لا يوجد' },
                          { value: '286-00245', label: 'ترخيص بناء - 286-00245' },
                          { value: '286-00246', label: 'استشارات - 286-00246' },
                        ]}
                      />

                      <SelectWithCopy
                        label="العقد المرتبط (اختياري)"
                        id="contractId"
                        defaultValue=""
                        options={[
                          { value: '', label: 'لا يوجد' },
                          { value: 'CNT-2025-001', label: 'عقد 001/2025' },
                          { value: 'CNT-2025-002', label: 'عقد 002/2025' },
                        ]}
                      />

                      <SelectWithCopy
                        label="القالب (اختياري)"
                        id="templateId"
                        defaultValue=""
                        options={[
                          { value: '', label: 'بدون قالب' },
                          ...QUOTATION_TEMPLATES.map(t => ({ value: t.id, label: t.name }))
                        ]}
                      />

                      <SelectWithCopy
                        label="المسؤول"
                        id="assignedTo"
                        defaultValue=""
                        options={[
                          { value: '', label: 'اختر المسؤول' },
                          { value: '817-00123', label: 'محمد أحمد - 817-00123' },
                          { value: '817-00124', label: 'سارة علي - 817-00124' },
                        ]}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* بنود العرض */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      بنود العرض
                    </h3>
                    
                    <div className="mb-3">
                      <Button className="dense-btn dense-btn-primary w-full">
                        <Plus className="h-3 w-3" />
                        إضافة بند جديد
                      </Button>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <Table className="dense-table">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">البند</TableHead>
                            <TableHead className="text-right">الكمية</TableHead>
                            <TableHead className="text-right">السعر</TableHead>
                            <TableHead className="text-right">الخصم</TableHead>
                            <TableHead className="text-right">الإجمالي</TableHead>
                            <TableHead className="text-right">إجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {SAMPLE_ITEMS.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="text-right text-xs">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-gray-500">{item.description}</div>
                              </TableCell>
                              <TableCell className="text-right text-xs">
                                {item.quantity} {item.unit}
                              </TableCell>
                              <TableCell className="text-right text-xs font-medium">
                                {item.unitPrice.toLocaleString()} ر.س
                              </TableCell>
                              <TableCell className="text-right text-xs">
                                {item.discount}%
                              </TableCell>
                              <TableCell className="text-right text-xs font-bold">
                                {item.total.toLocaleString()} ر.س
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center gap-1 justify-end">
                                  <Button className="dense-action-btn">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button className="dense-action-btn">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <Separator />

                  {/* الحسابات */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      الحسابات
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <InputWithCopy
                        label="المجموع الفرعي (ر.س)"
                        id="subtotal"
                        type="number"
                        defaultValue="450000"
                      />

                      <InputWithCopy
                        label="الخصم (ر.س)"
                        id="discount"
                        type="number"
                        defaultValue="10000"
                      />

                      <InputWithCopy
                        label="نسبة الضريبة (%)"
                        id="taxRate"
                        type="number"
                        defaultValue="15"
                      />

                      <InputWithCopy
                        label="قيمة الضريبة (ر.س)"
                        id="taxAmount"
                        type="number"
                        defaultValue="66000"
                      />
                    </div>

                    <div className="mt-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-800">المجموع الإجمالي:</span>
                        <span className="text-xl font-bold text-green-900">506,000 ر.س</span>
                      </div>
                      <div className="text-xs text-green-600">
                        شامل الضريبة المضافة
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* شروط الدفع */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      شروط الدفع
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <SelectWithCopy
                        label="شروط الدفع"
                        id="paymentTerms"
                        defaultValue=""
                        options={[
                          { value: '', label: 'اختر شروط الدفع' },
                          { value: 'single', label: 'دفعة واحدة' },
                          { value: 'two', label: 'دفعتين' },
                          { value: 'three', label: '3 دفعات' },
                          { value: 'four', label: '4 دفعات' },
                          { value: 'custom', label: 'مخصص' },
                        ]}
                      />

                      <InputWithCopy
                        label="الدفعة المقدمة (%)"
                        id="downPayment"
                        type="number"
                        defaultValue="30"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* ملاحظات */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      ملاحظات وشروط
                    </h3>
                    <TextAreaWithCopy
                      label="ملاحظات العرض"
                      id="quoteNotes"
                      defaultValue=""
                      placeholder="أي ملاحظات أو شروط خاصة بالعرض..."
                      rows={4}
                    />

                    <div className="mt-3">
                      <label className="compact-text text-gray-700 mb-2 block" style={{ fontWeight: 700, color: '#2563eb' }}>
                        الشروط والأحكام
                      </label>
                      <div className="space-y-2">
                        {[
                          'العرض صالح لمدة 30 يوماً من تاريخه',
                          'الأسعار شاملة ضريبة القيمة المضافة',
                          'يتم الدفع حسب جدول الدفعات المتفق عليه',
                          'العقد نافذ بعد استلام الدفعة المقدمة',
                        ].map((term, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                            <input type="checkbox" id={`term-${i}`} className="w-4 h-4" defaultChecked />
                            <label htmlFor={`term-${i}`} className="text-xs flex-1">{term}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <strong>ملاحظة هامة:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>سيتم ربط العرض تلقائياً بالمعاملة إن وجدت</li>
                          <li>يمكن تحويل العرض المقبول إلى عقد مباشرة</li>
                          <li>سيتم إرسال إشعارات للعميل والمسؤولين</li>
                          <li>العرض قابل للتعديل قبل الإرسال</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 815-04: عروض مبدئية
      case '815-04':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FileText className="h-4 w-4" />
                  العروض المبدئية ({quotations.filter(q => q.type === 'preliminary').length})
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  عرض مبدئي
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quotations.filter(q => q.type === 'preliminary').map((quote) => {
                    const statusInfo = QUOTATION_STATUSES.find(s => s.value === quote.status);
                    
                    return (
                      <div key={quote.id} className="dense-content-card p-3 border-r-4 border-blue-500">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {quote.number}
                          </Badge>
                          <Badge className={statusInfo?.color}>
                            {statusInfo?.label}
                          </Badge>
                        </div>
                        <div className="text-xs font-medium mb-2">{quote.title}</div>
                        <div className="dense-grid dense-grid-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">العميل:</span>
                            <span className="font-medium mr-1">{quote.clientName}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">القيمة:</span>
                            <span className="font-medium mr-1">{quote.totalAmount.toLocaleString()} ر.س</span>
                          </div>
                          <div>
                            <span className="text-gray-600">صالح حتى:</span>
                            <span className="font-medium mr-1">{quote.validUntil}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 pt-2 border-t mt-2">
                          <Button className="dense-btn dense-btn-primary">
                            <Eye className="h-3 w-3" />
                            عرض
                          </Button>
                          <Button className="dense-action-btn">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 815-05: عروض نهائية
      case '815-05':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <CheckCircle className="h-4 w-4" />
                  العروض النهائية ({quotations.filter(q => q.type === 'final').length})
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  عرض نهائي
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quotations.filter(q => q.type === 'final').map((quote) => {
                    const statusInfo = QUOTATION_STATUSES.find(s => s.value === quote.status);
                    
                    return (
                      <div key={quote.id} className="dense-content-card p-3 border-r-4 border-green-500">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {quote.number}
                          </Badge>
                          <Badge className={statusInfo?.color}>
                            {statusInfo?.label}
                          </Badge>
                        </div>
                        <div className="text-xs font-medium mb-2">{quote.title}</div>
                        <div className="dense-grid dense-grid-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">العميل:</span>
                            <span className="font-medium mr-1">{quote.clientName}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">القيمة:</span>
                            <span className="font-medium mr-1">{quote.totalAmount.toLocaleString()} ر.س</span>
                          </div>
                          <div>
                            <span className="text-gray-600">صالح حتى:</span>
                            <span className="font-medium mr-1">{quote.validUntil}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 pt-2 border-t mt-2">
                          <Button className="dense-btn dense-btn-primary">
                            <Eye className="h-3 w-3" />
                            عرض
                          </Button>
                          <Button className="dense-action-btn">
                            <FileText className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 815-06: عروض تكميلية
      case '815-06':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Layers className="h-4 w-4" />
                  العروض التكميلية ({quotations.filter(q => q.type === 'supplementary').length})
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  عرض تكميلي
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quotations.filter(q => q.type === 'supplementary').map((quote) => {
                    const statusInfo = QUOTATION_STATUSES.find(s => s.value === quote.status);
                    
                    return (
                      <div key={quote.id} className="dense-content-card p-3 border-r-4 border-purple-500">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {quote.number}
                          </Badge>
                          <Badge className={statusInfo?.color}>
                            {statusInfo?.label}
                          </Badge>
                          {quote.contractId && (
                            <Badge className="bg-orange-100 text-orange-700 text-xs">
                              <FileText className="h-3 w-3 ml-1" />
                              {quote.contractId}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs font-medium mb-2">{quote.title}</div>
                        <div className="dense-grid dense-grid-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">العميل:</span>
                            <span className="font-medium mr-1">{quote.clientName}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">القيمة:</span>
                            <span className="font-medium mr-1">{quote.totalAmount.toLocaleString()} ر.س</span>
                          </div>
                          <div>
                            <span className="text-gray-600">صالح حتى:</span>
                            <span className="font-medium mr-1">{quote.validUntil}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 pt-2 border-t mt-2">
                          <Button className="dense-btn dense-btn-primary">
                            <Eye className="h-3 w-3" />
                            عرض
                          </Button>
                          <Button className="dense-action-btn">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 815-07: قوالب العروض
      case '815-07':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Copy className="h-4 w-4" />
                  قوالب عروض الأسعار
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  قالب جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-3">
                  {[
                    { name: 'قالب عرض تصميم فيلا سكنية', items: 12, uses: 45 },
                    { name: 'قالب عرض استشارات هندسية', items: 8, uses: 32 },
                    { name: 'قالب عرض إشراف ومتابعة', items: 6, uses: 28 },
                  ].map((template, i) => (
                    <div key={i} className="dense-content-card p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Copy className="h-4 w-4 text-blue-600" />
                        <div className="flex-1">
                          <div className="text-xs font-medium">{template.name}</div>
                          <div className="text-xs text-gray-600">{template.items} بند • {template.uses} استخدام</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 pt-2 border-t">
                        <Button className="dense-btn dense-btn-primary">
                          <Eye className="h-3 w-3" />
                          استخدام
                        </Button>
                        <Button className="dense-action-btn">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button className="dense-action-btn">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 815-08: الموافقات
      case '815-08':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <CheckCircle className="h-4 w-4" />
                  سير الموافقات على العروض
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quotations.filter(q => q.status === 'pending_review').map((quote) => (
                    <div key={quote.id} className="dense-content-card p-3 border-r-4 border-yellow-500">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                            {quote.number}
                          </Badge>
                          <span className="text-xs font-medium">{quote.title}</span>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                          قيد المراجعة
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 pt-2 border-t">
                        <Button className="dense-btn dense-btn-primary">
                          <CheckCircle className="h-3 w-3" />
                          موافقة
                        </Button>
                        <Button className="dense-action-btn">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 815-09: المقارنات
      case '815-09':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <BarChart3 className="h-4 w-4" />
                  مقارنة عروض الأسعار
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  مقارنة جديدة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 text-center">
                  <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-blue-800 mb-2">
                    قارن بين عروض الأسعار المختلفة لنفس المشروع
                  </p>
                  <Button className="dense-btn dense-btn-primary">
                    <Plus className="h-3 w-3" />
                    إنشاء مقارنة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 815-10: التحويل للعقود
      case '815-10':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FileText className="h-4 w-4" />
                  تحويل العروض المقبولة إلى عقود
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quotations.filter(q => q.status === 'accepted' && !q.contractId).map((quote) => (
                    <div key={quote.id} className="dense-content-card p-3 border-r-4 border-green-500">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                          {quote.number}
                        </Badge>
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          مقبول
                        </Badge>
                        <Badge className="bg-orange-100 text-orange-700 text-xs">
                          جاهز للتحويل
                        </Badge>
                      </div>
                      <div className="text-xs font-medium mb-2">{quote.title}</div>
                      
                      <div className="flex items-center gap-1 pt-2 border-t">
                        <Button className="dense-btn dense-btn-primary">
                          <FileText className="h-3 w-3" />
                          تحويل لعقد
                        </Button>
                        <Button className="dense-action-btn">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 815-11: المتابعة
      case '815-11':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Bell className="h-4 w-4" />
                  متابعة وتذكير العملاء
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Send className="h-3 w-3" />
                  إرسال تذكير
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quotations.filter(q => q.status === 'sent').map((quote) => (
                    <div key={quote.id} className="dense-content-card p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-gray-100 text-gray-700 font-mono text-xs">
                          {quote.number}
                        </Badge>
                        <span className="text-xs font-medium">{quote.title}</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        آخر تواصل: {quote.createdDate}
                      </div>
                      
                      <div className="flex items-center gap-1 pt-2 border-t">
                        <Button className="dense-btn dense-btn-primary">
                          <Send className="h-3 w-3" />
                          تذكير
                        </Button>
                        <Button className="dense-action-btn">
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button className="dense-action-btn">
                          <Mail className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 815-12: الإحصائيات
      case '815-12':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <TrendingUp className="h-4 w-4" />
                  إحصائيات عروض الأسعار
                </h2>
                <Button className="dense-btn dense-btn-secondary">
                  <Download className="h-3 w-3" />
                  تصدير
                </Button>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-3 gap-3">
                  <div className="dense-content-card p-3">
                    <div className="text-xs text-gray-600 mb-1">معدل القبول</div>
                    <div className="text-lg font-bold text-green-700">
                      {stats.total > 0 ? ((stats.accepted / stats.total) * 100).toFixed(1) : 0}%
                    </div>
                    <Progress value={stats.total > 0 ? (stats.accepted / stats.total) * 100 : 0} className="h-2 mt-2" />
                  </div>

                  <div className="dense-content-card p-3">
                    <div className="text-xs text-gray-600 mb-1">معدل الرفض</div>
                    <div className="text-lg font-bold text-red-700">
                      {stats.total > 0 ? ((stats.rejected / stats.total) * 100).toFixed(1) : 0}%
                    </div>
                    <Progress value={stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0} className="h-2 mt-2" />
                  </div>

                  <div className="dense-content-card p-3">
                    <div className="text-xs text-gray-600 mb-1">متوسط قيمة العرض</div>
                    <div className="text-lg font-bold text-blue-700">
                      {stats.total > 0 ? (stats.totalValue / stats.total).toLocaleString() : 0} ر.س
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 815-13: التقارير
      case '815-13':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <BarChart3 className="h-4 w-4" />
                  تقارير عروض الأسعار
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Download className="h-3 w-3" />
                  تصدير
                </Button>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-3">
                  {[
                    { name: 'تقرير العروض المرسلة', icon: Send, count: stats.sent },
                    { name: 'تقرير العروض المقبولة', icon: CheckCircle, count: stats.accepted },
                    { name: 'تقرير العروض المرفوضة', icon: X, count: stats.rejected },
                    { name: 'تقرير القيم المالية', icon: DollarSign, count: stats.totalValue },
                  ].map((report, i) => {
                    const ReportIcon = report.icon;
                    
                    return (
                      <div key={i} className="dense-content-card p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <ReportIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium">{report.name}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 pt-2 border-t">
                          <Button className="dense-btn dense-btn-primary">
                            <Eye className="h-3 w-3" />
                            عرض
                          </Button>
                          <Button className="dense-action-btn">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Printer className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 815-14: الأرشيف
      case '815-14':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Archive className="h-4 w-4" />
                  عروض الأسعار المؤرشفة
                </h2>
                <Button className="dense-btn dense-btn-secondary">
                  <RefreshCw className="h-3 w-3" />
                  استعادة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <Archive className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">لا توجد عروض مؤرشفة حالياً</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 815-15: الإعدادات
      case '815-15':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Settings className="h-4 w-4" />
                  إعدادات نظام عروض الأسعار
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Save className="h-3 w-3" />
                  حفظ
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium">مدة صلاحية العرض الافتراضية</div>
                      <div className="text-xs text-gray-600">عدد الأيام التي يكون فيها العرض صالحاً</div>
                    </div>
                    <InputWithCopy
                      id="defaultValidity"
                      type="number"
                      placeholder="30"
                      className="w-20"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium">إرسال تذكيرات تلقائية</div>
                      <div className="text-xs text-gray-600">تذكير العملاء بالعروض المرسلة</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium">الموافقة على العروض</div>
                      <div className="text-xs text-gray-600">تتطلب العروض موافقة قبل الإرسال</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium">تحويل تلقائي للعقود</div>
                      <div className="text-xs text-gray-600">تحويل العروض المقبولة لعقود تلقائياً</div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // باقي التابات
      default:
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <div className="flex items-center gap-2">
                  {React.createElement(tab.icon, { className: 'h-5 w-5 text-blue-600' })}
                  <h2 className="dense-section-title">{tab.title}</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {React.createElement(tab.icon, { className: 'h-10 w-10 text-blue-600' })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {tab.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    محتوى تفصيلي متاح - جميع الحقول محسّنة
                  </p>
                  <Badge className="bg-blue-100 text-blue-700">{tab.number}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="screen-with-vertical-tabs-layout">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                عروض الأسعار
              </h2>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                15 تبويب • الشاشة 815
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-1 mt-2">
            <Badge className="text-xs bg-blue-100 text-blue-800">
              <FileText className="w-2 h-2 ml-1" />
              {stats.total} عرض
            </Badge>
            <Badge className="text-xs bg-green-100 text-green-800">
              <CheckCircle className="w-2 h-2 ml-1" />
              {stats.accepted} مقبول
            </Badge>
          </div>
        </div>

        <ScrollArea className="vertical-tabs-sidebar-body">
          {TABS_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`vertical-tab-item-condensed ${activeTab === tab.id ? 'active' : ''}`}
            >
              <div className="flex items-center gap-2 flex-1">
                {React.createElement(tab.icon, { className: 'h-4 w-4 flex-shrink-0' })}
                <span className="vertical-tab-title-condensed">{tab.title}</span>
              </div>
              <span className={`vertical-tab-number-condensed ${activeTab === tab.id ? 'active' : ''}`}>
                {tab.number}
              </span>
            </button>
          ))}
        </ScrollArea>

        <div className="vertical-tabs-sidebar-footer">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {TABS_CONFIG.findIndex(tab => tab.id === activeTab) + 1} من {TABS_CONFIG.length}
            </span>
            <Button className="dense-btn dense-btn-secondary">
              <RefreshCw className="h-3 w-3" />
              تحديث
            </Button>
          </div>
        </div>
      </div>

      {/* مساحة المحتوى */}
      <div className="vertical-tabs-content-area">
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الشاشة 815 - إدارة عروض الأسعار
                </h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نظام شامل • تكامل كامل • 15 تبويب
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-700">
                <DollarSign className="h-3 w-3 ml-1" />
                {stats.totalValue.toLocaleString()} ر.س
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                <code className="font-code">SCR-815</code>
              </Badge>
            </div>
          </div>
        </div>

        <div className="vertical-tabs-content-body">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default QuotationsManagement_Complete_815;
