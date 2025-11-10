/**
 * الشاشة 940 - تعهدات وإقرارات
 * ===========================================================================
 * 
 * شاشة شاملة لإدارة التعهدات والإقرارات مع ربط بالمعاملات والعملاء
 * ونظام التوثيق الإلكتروني
 * 
 * المميزات:
 * - نظام تابات رأسي مكثف
 * - ربط بالمعاملات والعملاء
 * - التوثيق الإلكتروني (مكتب/مالك)
 * - طباعة وتصدير
 * - نماذج قابلة للتخصيص
 * - سجل كامل للتعهدات
 * 
 * التابات:
 * 940-01: تعهدات العملاء
 * 940-02: إقرارات العملاء
 * 940-03: تعهدات المالكين
 * 940-04: إقرارات المالكين
 * 940-05: تعهدات الموظفين
 * 940-06: إقرارات الموظفين
 * 940-07: تعهدات المقاولين
 * 940-08: إقرارات المقاولين
 * 940-09: تعهدات الاستشاريين
 * 940-10: إقرارات الاستشاريين
 * 940-11: سجل التعهدات والإقرارات
 * 940-12: التوثيق الإلكتروني
 * 
 * @version 1.0
 * @date 2025-10-20
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
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import {
  FileText, Plus, Search, Filter, Download, Printer, Send, Edit, Eye, 
  CheckCircle, XCircle, Clock, AlertTriangle, FileSignature, Users,
  Building2, Briefcase, HardHat, UserCheck, FileCheck, Shield,
  Calendar, Archive, Share2, Lock, Unlock, RefreshCw, Save,
  ChevronLeft, ChevronRight, User, Building
} from 'lucide-react';

// ===== واجهات البيانات =====

interface Commitment {
  id: string;
  commitmentNumber: string;
  type: 'تعهد' | 'إقرار';
  category: 'عميل' | 'مالك' | 'موظف' | 'مقاول' | 'استشاري';
  title: string;
  templateId: string;
  templateName: string;
  entityName: string;
  entityId: string;
  transactionNumber?: string;
  transactionId?: string;
  content: string;
  status: 'مسودة' | 'قيد المراجعة' | 'موثق' | 'مكتمل' | 'ملغي';
  authenticationMethod: 'مكتب' | 'مالك' | 'كلاهما';
  authenticationStatus: 'غير موثق' | 'موثق جزئياً' | 'موثق كلياً';
  officeAuthenticatedBy?: string;
  officeAuthenticationDate?: string;
  ownerAuthenticatedBy?: string;
  ownerAuthenticationDate?: string;
  createdBy: string;
  createdDate: string;
  lastModified: string;
  expiryDate?: string;
  notes?: string;
}

interface CommitmentTemplate {
  id: string;
  templateNumber: string;
  name: string;
  type: 'تعهد' | 'إقرار';
  category: 'عميل' | 'مالك' | 'موظف' | 'مقاول' | 'استشاري';
  content: string;
  fields: string[];
  authenticationRequired: 'مكتب' | 'مالك' | 'كلاهما';
  status: 'نشط' | 'معلق' | 'محذوف';
  usageCount: number;
  createdDate: string;
}

const CommitmentsDeclarationsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('940-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null);

  // تكوين التابات
  const TABS_CONFIG = [
    { id: '940-01', number: '940-01', title: 'تعهدات العملاء', icon: Users, category: 'عميل', type: 'تعهد' },
    { id: '940-02', number: '940-02', title: 'إقرارات العملاء', icon: FileCheck, category: 'عميل', type: 'إقرار' },
    { id: '940-03', number: '940-03', title: 'تعهدات المالكين', icon: Building, category: 'مالك', type: 'تعهد' },
    { id: '940-04', number: '940-04', title: 'إقرارات المالكين', icon: Shield, category: 'مالك', type: 'إقرار' },
    { id: '940-05', number: '940-05', title: 'تعهدات الموظفين', icon: UserCheck, category: 'موظف', type: 'تعهد' },
    { id: '940-06', number: '940-06', title: 'إقرارات الموظفين', icon: FileSignature, category: 'موظف', type: 'إقرار' },
    { id: '940-07', number: '940-07', title: 'تعهدات المقاولين', icon: HardHat, category: 'مقاول', type: 'تعهد' },
    { id: '940-08', number: '940-08', title: 'إقرارات المقاولين', icon: FileText, category: 'مقاول', type: 'إقرار' },
    { id: '940-09', number: '940-09', title: 'تعهدات الاستشاريين', icon: Briefcase, category: 'استشاري', type: 'تعهد' },
    { id: '940-10', number: '940-10', title: 'إقرارات الاستشاريين', icon: Building2, category: 'استشاري', type: 'إقرار' },
    { id: '940-11', number: '940-11', title: 'سجل التعهدات والإقرارات', icon: Archive, category: null, type: null },
    { id: '940-12', number: '940-12', title: 'التوثيق الإلكتروني', icon: FileSignature, category: null, type: null },
  ];

  // بيانات تجريبية - التعهدات والإقرارات
  const sampleCommitments: Commitment[] = useMemo(() => [
    {
      id: 'COM001',
      commitmentNumber: 'CMT-2025-001',
      type: 'تعهد',
      category: 'عميل',
      title: 'تعهد باستلام المستندات',
      templateId: 'TPL001',
      templateName: 'تعهد استلام المستندات',
      entityName: 'مؤسسة البناء الحديث',
      entityId: 'CLT001',
      transactionNumber: 'TRX-2025-0123',
      transactionId: 'TRX001',
      content: 'أتعهد أنا الموقع أدناه باستلام جميع المستندات الخاصة بالمعاملة...',
      status: 'موثق',
      authenticationMethod: 'كلاهما',
      authenticationStatus: 'موثق كلياً',
      officeAuthenticatedBy: 'أحمد السالم',
      officeAuthenticationDate: '2025-10-15',
      ownerAuthenticatedBy: 'محمد البناء',
      ownerAuthenticationDate: '2025-10-16',
      createdBy: 'سارة أحمد',
      createdDate: '2025-10-10',
      lastModified: '2025-10-16',
      expiryDate: '2026-10-10',
      notes: 'تم التوثيق بنجاح من الطرفين'
    },
    {
      id: 'COM002',
      commitmentNumber: 'DCL-2025-002',
      type: 'إقرار',
      category: 'مالك',
      title: 'إقرار بملكية العقار',
      templateId: 'TPL015',
      templateName: 'إقرار الملكية',
      entityName: 'خالد العتيبي',
      entityId: 'OWN001',
      transactionNumber: 'TRX-2025-0456',
      transactionId: 'TRX002',
      content: 'أقر أنا الموقع أدناه بأنني المالك الشرعي للعقار رقم...',
      status: 'قيد المراجعة',
      authenticationMethod: 'مكتب',
      authenticationStatus: 'غير موثق',
      createdBy: 'فاطمة محمد',
      createdDate: '2025-10-18',
      lastModified: '2025-10-18',
      notes: 'بانتظار مراجعة المدير'
    },
    {
      id: 'COM003',
      commitmentNumber: 'CMT-2025-003',
      type: 'تعهد',
      category: 'موظف',
      title: 'تعهد بالسرية المهنية',
      templateId: 'TPL025',
      templateName: 'تعهد السرية',
      entityName: 'عبدالله الحربي',
      entityId: 'EMP025',
      content: 'أتعهد أنا الموقع أدناه بالحفاظ على سرية المعلومات...',
      status: 'مكتمل',
      authenticationMethod: 'مكتب',
      authenticationStatus: 'موثق كلياً',
      officeAuthenticatedBy: 'مدير الموارد البشرية',
      officeAuthenticationDate: '2025-10-12',
      createdBy: 'إدارة الموارد البشرية',
      createdDate: '2025-10-10',
      lastModified: '2025-10-12',
      expiryDate: '2026-10-10'
    },
    {
      id: 'COM004',
      commitmentNumber: 'DCL-2025-004',
      type: 'إقرار',
      category: 'مقاول',
      title: 'إقرار باستلام الموقع',
      templateId: 'TPL030',
      templateName: 'إقرار استلام الموقع',
      entityName: 'مؤسسة المقاولات المتقدمة',
      entityId: 'CNT005',
      transactionNumber: 'TRX-2025-0789',
      transactionId: 'TRX003',
      content: 'نقر نحن الموقعون أدناه باستلام موقع المشروع بحالة جيدة...',
      status: 'موثق',
      authenticationMethod: 'كلاهما',
      authenticationStatus: 'موثق كلياً',
      officeAuthenticatedBy: 'مهندس المشروع',
      officeAuthenticationDate: '2025-10-14',
      ownerAuthenticatedBy: 'المدير التنفيذي',
      ownerAuthenticationDate: '2025-10-15',
      createdBy: 'قسم المشاريع',
      createdDate: '2025-10-12',
      lastModified: '2025-10-15'
    },
    {
      id: 'COM005',
      commitmentNumber: 'CMT-2025-005',
      type: 'تعهد',
      category: 'استشاري',
      title: 'تعهد بتقديم التقارير',
      templateId: 'TPL040',
      templateName: 'تعهد التقارير الدورية',
      entityName: 'مكتب الاستشارات الهندسية',
      entityId: 'CSL008',
      transactionNumber: 'TRX-2025-0321',
      transactionId: 'TRX004',
      content: 'نتعهد نحن الموقعون بتقديم التقارير الفنية الدورية...',
      status: 'مسودة',
      authenticationMethod: 'مالك',
      authenticationStatus: 'غير موثق',
      createdBy: 'قسم الاستشارات',
      createdDate: '2025-10-19',
      lastModified: '2025-10-19',
      expiryDate: '2026-04-19'
    },
    {
      id: 'COM006',
      commitmentNumber: 'DCL-2025-006',
      type: 'إقرار',
      category: 'عميل',
      title: 'إقرار بصحة البيانات',
      templateId: 'TPL008',
      templateName: 'إقرار صحة البيانات',
      entityName: 'شركة التطوير العقاري',
      entityId: 'CLT015',
      transactionNumber: 'TRX-2025-0654',
      transactionId: 'TRX005',
      content: 'نقر نحن الموقعون بأن جميع البيانات المقدمة صحيحة...',
      status: 'قيد المراجعة',
      authenticationMethod: 'مكتب',
      authenticationStatus: 'غير موثق',
      createdBy: 'منسق المعاملات',
      createdDate: '2025-10-17',
      lastModified: '2025-10-18'
    },
  ], []);

  // بيانات تجريبية - القوالب
  const sampleTemplates: CommitmentTemplate[] = useMemo(() => [
    {
      id: 'TPL001',
      templateNumber: 'TPL-001',
      name: 'تعهد استلام المستندات',
      type: 'تعهد',
      category: 'عميل',
      content: 'أتعهد أنا {{entity_name}} باستلام المستندات التالية: {{documents_list}}',
      fields: ['entity_name', 'documents_list', 'date'],
      authenticationRequired: 'كلاهما',
      status: 'نشط',
      usageCount: 45,
      createdDate: '2024-01-15'
    },
    {
      id: 'TPL015',
      templateNumber: 'TPL-015',
      name: 'إقرار الملكية',
      type: 'إقرار',
      category: 'مالك',
      content: 'أقر أنا {{owner_name}} بأنني المالك الشرعي للعقار رقم {{property_number}}',
      fields: ['owner_name', 'property_number', 'location'],
      authenticationRequired: 'مكتب',
      status: 'نشط',
      usageCount: 128,
      createdDate: '2024-01-20'
    },
    {
      id: 'TPL025',
      templateNumber: 'TPL-025',
      name: 'تعهد السرية',
      type: 'تعهد',
      category: 'موظف',
      content: 'أتعهد أنا {{employee_name}} بالحفاظ على سرية المعلومات المتعلقة بالعمل',
      fields: ['employee_name', 'position', 'date'],
      authenticationRequired: 'مكتب',
      status: 'نشط',
      usageCount: 87,
      createdDate: '2024-02-10'
    },
  ], []);

  // الحصول على التاب النشط
  const currentTab = TABS_CONFIG.find(tab => tab.id === activeTab);

  // عرض محتوى التابات
  const renderTabContent = () => {
    // فلترة التعهدات حسب التاب
    const filteredCommitments = sampleCommitments.filter(commitment => {
      if (activeTab === '940-11' || activeTab === '940-12') return true; // عرض الكل في السجل والتوثيق
      
      const tab = currentTab;
      if (!tab || !tab.category || !tab.type) return false;
      
      return commitment.category === tab.category && commitment.type === tab.type;
    });

    // التابات 940-01 إلى 940-10: قوائم التعهدات والإقرارات
    if (activeTab !== '940-11' && activeTab !== '940-12') {
      return (
        <div className="space-y-2">
          {/* رأس الشاشة */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                {currentTab?.title}
              </h3>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                إدارة {currentTab?.type === 'تعهد' ? 'تعهدات' : 'إقرارات'} {currentTab?.category}
              </p>
            </div>
            <div className="flex gap-1">
              <Button 
                className="dense-button bg-[#10b981] hover:bg-[#059669] text-white"
                onClick={() => setShowCreateDialog(true)}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Plus className="h-3.5 w-3.5 ml-2" />
                {currentTab?.type} جديد
              </Button>
              <Button 
                variant="outline" 
                className="dense-button button-rtl" 
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Download className="h-3.5 w-3.5 ml-2" />
                تصدير
              </Button>
            </div>
          </div>

          {/* إحصائيات سريعة */}
          <div className="stats-grid-6">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي {currentTab?.type === 'تعهد' ? 'التعهدات' : 'الإقرارات'}
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredCommitments.length}
                    </p>
                  </div>
                  <FileText className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      موثقة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredCommitments.filter(c => c.status === 'موثق' || c.status === 'مكتمل').length}
                    </p>
                  </div>
                  <CheckCircle className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      قيد المراجعة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredCommitments.filter(c => c.status === 'قيد المراجعة').length}
                    </p>
                  </div>
                  <Clock className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fee2e2', '--bg-to': '#fecaca', '--border-color': '#fca5a5' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      مسودات
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredCommitments.filter(c => c.status === 'مسودة').length}
                    </p>
                  </div>
                  <Edit className="stats-icon-compact text-[#ef4444] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      موثق كلياً
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredCommitments.filter(c => c.authenticationStatus === 'موثق كلياً').length}
                    </p>
                  </div>
                  <Shield className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#f3e8ff', '--bg-to': '#e9d5ff', '--border-color': '#d8b4fe' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      بانتظار التوثيق
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredCommitments.filter(c => c.authenticationStatus === 'غير موثق').length}
                    </p>
                  </div>
                  <AlertTriangle className="stats-icon-compact text-purple-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* البحث والتصفية */}
          <Card className="bg-blue-50 border-blue-200 card-rtl">
            <CardContent className="p-2">
              <div className="grid grid-cols-4 dense-grid form-rtl">
                <div className="col-span-2 form-group">
                  <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>بحث</Label>
                  <div className="flex gap-1">
                    <Input
                      placeholder="ابحث برقم أو عنوان أو اسم..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="dense-input"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    />
                    <Button className="dense-button bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                      <Search className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="form-group">
                  <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="dense-select" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="الكل">الكل</SelectItem>
                      <SelectItem value="مسودة">مسودة</SelectItem>
                      <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                      <SelectItem value="موثق">موثق</SelectItem>
                      <SelectItem value="مكتمل">مكتمل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group">
                  <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>حالة التوثيق</Label>
                  <Select>
                    <SelectTrigger className="dense-select" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue placeholder="اختر حالة التوثيق" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="الكل">الكل</SelectItem>
                      <SelectItem value="غير موثق">غير موثق</SelectItem>
                      <SelectItem value="موثق جزئياً">موثق جزئياً</SelectItem>
                      <SelectItem value="موثق كلياً">موثق كلياً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* جدول التعهدات/الإقرارات */}
          <Card className="card-rtl">
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>حالة التوثيق</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCommitments.map((commitment) => (
                    <TableRow key={commitment.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {commitment.commitmentNumber}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {commitment.title}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {commitment.entityName}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {commitment.transactionNumber || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={
                          commitment.status === 'موثق' || commitment.status === 'مكتمل' ? 'bg-green-100 text-green-700' :
                          commitment.status === 'قيد المراجعة' ? 'bg-yellow-100 text-yellow-700' :
                          commitment.status === 'مسودة' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {commitment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={
                          commitment.authenticationStatus === 'موثق كلياً' ? 'bg-green-100 text-green-700' :
                          commitment.authenticationStatus === 'موثق جزئياً' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {commitment.authenticationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {commitment.createdDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="dense-button"
                            onClick={() => {
                              setSelectedCommitment(commitment);
                              setShowAuthDialog(true);
                            }}
                          >
                            <FileSignature className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="dense-button">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="dense-button">
                            <Printer className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="dense-button">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </div>
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

    // تاب 940-11: سجل التعهدات والإقرارات
    if (activeTab === '940-11') {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                سجل التعهدات والإقرارات
              </h3>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                سجل شامل لجميع التعهدات والإقرارات في النظام
              </p>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" className="dense-button button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Download className="h-3.5 w-3.5 ml-2" />
                تقرير Excel
              </Button>
              <Button variant="outline" className="dense-button button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Printer className="h-3.5 w-3.5 ml-2" />
                طباعة
              </Button>
            </div>
          </div>

          {/* إحصائيات شاملة */}
          <div className="stats-grid-8">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      الإجمالي
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleCommitments.length}
                    </p>
                  </div>
                  <Archive className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      تعهدات
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleCommitments.filter(c => c.type === 'تعهد').length}
                    </p>
                  </div>
                  <FileCheck className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إقرارات
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleCommitments.filter(c => c.type === 'إقرار').length}
                    </p>
                  </div>
                  <FileSignature className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      عملاء
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleCommitments.filter(c => c.category === 'عميل').length}
                    </p>
                  </div>
                  <Users className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#f3e8ff', '--bg-to': '#e9d5ff', '--border-color': '#d8b4fe' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      مالكين
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleCommitments.filter(c => c.category === 'مالك').length}
                    </p>
                  </div>
                  <Building className="stats-icon-compact text-purple-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fee2e2', '--bg-to': '#fecaca', '--border-color': '#fca5a5' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      موظفين
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleCommitments.filter(c => c.category === 'موظف').length}
                    </p>
                  </div>
                  <UserCheck className="stats-icon-compact text-[#ef4444] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#ffedd5', '--bg-to': '#fed7aa', '--border-color': '#fdba74' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      مقاولين
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleCommitments.filter(c => c.category === 'مقاول').length}
                    </p>
                  </div>
                  <HardHat className="stats-icon-compact text-orange-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dcfce7', '--bg-to': '#bbf7d0', '--border-color': '#86efac' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      استشاريين
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleCommitments.filter(c => c.category === 'استشاري').length}
                    </p>
                  </div>
                  <Briefcase className="stats-icon-compact text-green-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* جدول السجل الشامل */}
          <Card className="card-rtl">
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوثيق</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleCommitments.map((commitment) => (
                    <TableRow key={commitment.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {commitment.commitmentNumber}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={
                          commitment.type === 'تعهد' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }>
                          {commitment.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-gray-100 text-gray-700">
                          {commitment.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {commitment.title}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {commitment.entityName}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={
                          commitment.status === 'موثق' || commitment.status === 'مكتمل' ? 'bg-green-100 text-green-700' :
                          commitment.status === 'قيد المراجعة' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }>
                          {commitment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={
                          commitment.authenticationStatus === 'موثق كلياً' ? 'bg-green-100 text-green-700' :
                          commitment.authenticationStatus === 'موثق جزئياً' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {commitment.authenticationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {commitment.createdDate}
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

    // تاب 940-12: التوثيق الإلكتروني
    if (activeTab === '940-12') {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                التوثيق الإلكتروني
              </h3>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                إدارة التوثيق الإلكتروني للتعهدات والإقرارات
              </p>
            </div>
            <Button 
              className="dense-button bg-[#10b981] hover:bg-[#059669] text-white"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <RefreshCw className="h-3.5 w-3.5 ml-2" />
              تحديث الحالة
            </Button>
          </div>

          {/* إحصائيات التوثيق */}
          <div className="stats-grid-6">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      موثق كلياً
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleCommitments.filter(c => c.authenticationStatus === 'موثق كلياً').length}
                    </p>
                  </div>
                  <CheckCircle className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      موثق جزئياً
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleCommitments.filter(c => c.authenticationStatus === 'موثق جزئياً').length}
                    </p>
                  </div>
                  <Clock className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fee2e2', '--bg-to': '#fecaca', '--border-color': '#fca5a5' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      غير موثق
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleCommitments.filter(c => c.authenticationStatus === 'غير موثق').length}
                    </p>
                  </div>
                  <XCircle className="stats-icon-compact text-[#ef4444] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      توثيق المكتب
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleCommitments.filter(c => c.officeAuthenticatedBy).length}
                    </p>
                  </div>
                  <Building2 className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      توثيق المالك
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleCommitments.filter(c => c.ownerAuthenticatedBy).length}
                    </p>
                  </div>
                  <User className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#f3e8ff', '--bg-to': '#e9d5ff', '--border-color': '#d8b4fe' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      توثيق مزدوج
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleCommitments.filter(c => c.authenticationMethod === 'كلاهما').length}
                    </p>
                  </div>
                  <Shield className="stats-icon-compact text-purple-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* قائمة التوثيق */}
          <div className="grid grid-cols-2 dense-grid">
            {/* بانتظار توثيق المكتب */}
            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  بانتظار توثيق المكتب
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-2">
                  {sampleCommitments
                    .filter(c => !c.officeAuthenticatedBy && (c.authenticationMethod === 'مكتب' || c.authenticationMethod === 'كلاهما'))
                    .map((commitment) => (
                      <Card key={commitment.id} className="bg-yellow-50 border-yellow-200 card-rtl">
                        <CardContent className="p-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                                {commitment.title}
                              </p>
                              <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                                {commitment.entityName}
                              </p>
                            </div>
                            <Button 
                              className="dense-button bg-[#10b981] hover:bg-[#059669] text-white"
                              onClick={() => {
                                setSelectedCommitment(commitment);
                                setShowAuthDialog(true);
                              }}
                            >
                              <FileSignature className="h-3.5 w-3.5 ml-1" />
                              توثيق
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* بانتظار توثيق المالك */}
            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  بانتظار توثيق المالك
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-2">
                  {sampleCommitments
                    .filter(c => !c.ownerAuthenticatedBy && (c.authenticationMethod === 'مالك' || c.authenticationMethod === 'كلاهما'))
                    .map((commitment) => (
                      <Card key={commitment.id} className="bg-blue-50 border-blue-200 card-rtl">
                        <CardContent className="p-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                                {commitment.title}
                              </p>
                              <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                                {commitment.entityName}
                              </p>
                            </div>
                            <Button 
                              className="dense-button bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                              onClick={() => {
                                setSelectedCommitment(commitment);
                                setShowAuthDialog(true);
                              }}
                            >
                              <Send className="h-3.5 w-3.5 ml-1" />
                              إرسال
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 rtl-support" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      {/* رأس الشاشة */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
              تعهدات وإقرارات
            </h1>
            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
              إدارة شاملة للتعهدات والإقرارات مع التوثيق الإلكتروني
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#2563eb] text-white" style={{ fontFamily: 'Courier New, monospace' }}>
              SCR-940
            </Badge>
            <Badge className="bg-green-100 text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              12 تاب
            </Badge>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex gap-3" style={{ direction: 'rtl' }}>
        {/* السايد بار الرأسي للتابات */}
        <Card className="w-56 card-rtl" style={{ height: 'fit-content' }}>
          <CardContent className="p-2">
            <div className="space-y-1">
              {TABS_CONFIG.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-right p-2 rounded transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#2563eb] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {React.createElement(tab.icon, { className: 'h-4 w-4' })}
                      <span className="text-xs">{tab.title}</span>
                    </div>
                    <span 
                      className="text-[10px] px-1 rounded"
                      style={{ 
                        fontFamily: 'Courier New, monospace',
                        backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'rgba(37,99,235,0.1)'
                      }}
                    >
                      {tab.number}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* منطقة المحتوى */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة إنشاء تعهد/إقرار جديد */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl dialog-rtl" style={{ direction: 'rtl' }}>
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إنشاء {currentTab?.type} جديد
            </DialogTitle>
            <DialogDescription className="dialog-description" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              أدخل بيانات {currentTab?.type} الجديد
            </DialogDescription>
          </DialogHeader>

          <div className="form-rtl form-dense">
            <div className="grid grid-cols-2 dense-grid">
              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  القالب *
                </Label>
                <Select>
                  <SelectTrigger className="dense-select" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <SelectValue placeholder="اختر القالب" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleTemplates
                      .filter(t => t.category === currentTab?.category && t.type === currentTab?.type)
                      .map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الجهة *
                </Label>
                <Input
                  className="dense-input"
                  placeholder="اسم الجهة"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المعاملة المرتبطة
                </Label>
                <Input
                  className="dense-input"
                  placeholder="رقم المعاملة (اختياري)"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  طريقة التوثيق *
                </Label>
                <Select>
                  <SelectTrigger className="dense-select" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <SelectValue placeholder="اختر طريقة التوثيق" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مكتب">توثيق من المكتب</SelectItem>
                    <SelectItem value="مالك">توثيق من المالك</SelectItem>
                    <SelectItem value="كلاهما">توثيق مزدوج</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="form-group">
              <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                المحتوى *
              </Label>
              <Textarea
                className="dense-input"
                rows={8}
                placeholder="محتوى التعهد أو الإقرار..."
                style={{ fontFamily: 'Tajawal, sans-serif', height: 'auto', minHeight: '120px' }}
              />
            </div>

            <div className="form-group">
              <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                ملاحظات
              </Label>
              <Textarea
                className="dense-input"
                rows={3}
                placeholder="ملاحظات إضافية..."
                style={{ fontFamily: 'Tajawal, sans-serif', height: 'auto', minHeight: '70px' }}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2" style={{ direction: 'rtl' }}>
            <Button 
              className="dense-button bg-[#10b981] hover:bg-[#059669] text-white"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Save className="h-3.5 w-3.5 ml-2" />
              حفظ
            </Button>
            <Button 
              variant="outline" 
              className="dense-button"
              onClick={() => setShowCreateDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة التوثيق */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="max-w-3xl dialog-rtl" style={{ direction: 'rtl' }}>
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              التوثيق الإلكتروني
            </DialogTitle>
            <DialogDescription className="dialog-description" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              توثيق {selectedCommitment?.type}: {selectedCommitment?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedCommitment && (
            <div className="space-y-3">
              {/* معلومات التعهد/الإقرار */}
              <Card className="bg-blue-50 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الرقم
                      </p>
                      <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                        {selectedCommitment.commitmentNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الجهة
                      </p>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        {selectedCommitment.entityName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        طريقة التوثيق
                      </p>
                      <Badge className="bg-blue-100 text-blue-700">
                        {selectedCommitment.authenticationMethod}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الحالة الحالية
                      </p>
                      <Badge className={
                        selectedCommitment.authenticationStatus === 'موثق كلياً' ? 'bg-green-100 text-green-700' :
                        selectedCommitment.authenticationStatus === 'موثق جزئياً' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {selectedCommitment.authenticationStatus}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* خيارات التوثيق */}
              <div className="grid grid-cols-2 gap-3">
                {/* توثيق المكتب */}
                {(selectedCommitment.authenticationMethod === 'مكتب' || selectedCommitment.authenticationMethod === 'كلاهما') && (
                  <Card className="card-rtl">
                    <CardHeader className="card-header-dense">
                      <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        توثيق المكتب
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="dense-card-content">
                      {selectedCommitment.officeAuthenticatedBy ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              تم التوثيق بنجاح
                            </span>
                          </div>
                          <div>
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              الموثق
                            </p>
                            <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                              {selectedCommitment.officeAuthenticatedBy}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              تاريخ التوثيق
                            </p>
                            <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                              {selectedCommitment.officeAuthenticationDate}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                            لم يتم التوثيق من قبل المكتب بعد
                          </p>
                          <Button 
                            className="w-full dense-button bg-[#10b981] hover:bg-[#059669] text-white"
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          >
                            <FileSignature className="h-3.5 w-3.5 ml-2" />
                            توثيق الآن
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* توثيق المالك */}
                {(selectedCommitment.authenticationMethod === 'مالك' || selectedCommitment.authenticationMethod === 'كلاهما') && (
                  <Card className="card-rtl">
                    <CardHeader className="card-header-dense">
                      <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        توثيق المالك
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="dense-card-content">
                      {selectedCommitment.ownerAuthenticatedBy ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              تم التوثيق بنجاح
                            </span>
                          </div>
                          <div>
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              الموثق
                            </p>
                            <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                              {selectedCommitment.ownerAuthenticatedBy}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              تاريخ التوثيق
                            </p>
                            <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                              {selectedCommitment.ownerAuthenticationDate}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                            لم يتم التوثيق من قبل المالك بعد
                          </p>
                          <Button 
                            className="w-full dense-button bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          >
                            <Send className="h-3.5 w-3.5 ml-2" />
                            إرسال للمالك
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2" style={{ direction: 'rtl' }}>
            <Button 
              variant="outline" 
              className="dense-button"
              onClick={() => setShowAuthDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommitmentsDeclarationsScreen;
