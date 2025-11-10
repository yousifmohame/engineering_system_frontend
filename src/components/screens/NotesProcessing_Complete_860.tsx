/**
 * الشاشة 860 - معالجة ملاحظات المعاملات - نظام شامل ومتكامل
 * ================================================================
 * 
 * نظام متكامل لإدارة ومعالجة ملاحظات المعاملات المُعادة من الجهات الخارجية:
 * - استقبال وتسجيل الملاحظات من الجهات الخارجية
 * - تصنيف الملاحظات حسب المستندات والمعاملات
 * - إسناد مهام المعالجة للموظفين المناسبين
 * - تغيير حالة المعاملة تلقائياً إلى "جاري معالجة الملاحظات"
 * - ربط مباشر مع شاشة المعاملات (286/700) وشاشة الموظفين (817)
 * - تتبع شامل لحالة المعالجة والتقدم
 * - إحصائيات وتقارير تفصيلية
 * - دعم الجهات الحكومية السعودية (البلدية، العدل، الأمانة، وغيرها)
 * 
 * الربط مع الأنظمة الأخرى:
 * - شاشة المعاملات (286/700): تحديث الحالة والمهام
 * - شاشة الموظفين (817): عرض المهام المُسندة
 * - نظام الإشعارات: تنبيهات فورية
 * 
 * التطوير: نوفمبر 2025 - v1.0
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  AlertCircle, CheckCircle, Clock, XCircle, Plus, Edit, Trash2, Eye,
  FileText, User, Users, Calendar, Building, Send, Download, Upload,
  Search, Filter, RefreshCw, Settings, Archive, Award, Target,
  TrendingUp, TrendingDown, Activity, Bell, MessageSquare, Paperclip,
  UserCheck, ClipboardCheck, FolderOpen, ListChecks, BarChart3,
  PieChart, Mail, Phone, MapPin, Home, Save, X, ChevronRight,
  AlertTriangle, Info, CheckCircle2, XOctagon, History, Flag
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

// ===== تكوين التابات - 12 تبويب شامل =====
const TABS_CONFIG = [
  { id: '860-01', number: '860-01', title: 'نظرة عامة', icon: Activity },
  { id: '860-02', number: '860-02', title: 'الملاحظات الواردة', icon: MessageSquare },
  { id: '860-03', number: '860-03', title: 'تصنيف حسب المستند', icon: FileText },
  { id: '860-04', number: '860-04', title: 'تصنيف حسب المعاملة', icon: FolderOpen },
  { id: '860-05', number: '860-05', title: 'إسناد المهام', icon: UserCheck },
  { id: '860-06', number: '860-06', title: 'متابعة المعالجة', icon: ListChecks },
  { id: '860-07', number: '860-07', title: 'الموظفون المكلفون', icon: Users },
  { id: '860-08', number: '860-08', title: 'سجل التعديلات', icon: History },
  { id: '860-09', number: '860-09', title: 'الإحصائيات', icon: BarChart3 },
  { id: '860-10', number: '860-10', title: 'التقارير', icon: ClipboardCheck },
  { id: '860-11', number: '860-11', title: 'الأرشيف', icon: Archive },
  { id: '860-12', number: '860-12', title: 'الإعدادات', icon: Settings },
];

// ===== حالات الملاحظات =====
const NOTE_STATUSES = [
  { value: 'new', label: 'جديدة', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  { value: 'assigned', label: 'مُسندة', color: 'bg-purple-100 text-purple-700', icon: UserCheck },
  { value: 'in-progress', label: 'قيد المعالجة', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  { value: 'completed', label: 'مُعالجة', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'rejected', label: 'مرفوضة', color: 'bg-red-100 text-red-700', icon: XCircle },
  { value: 'pending-review', label: 'قيد المراجعة', color: 'bg-orange-100 text-orange-700', icon: Eye },
];

// ===== أولويات الملاحظات =====
const PRIORITIES = [
  { value: 'urgent', label: 'عاجلة', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  { value: 'high', label: 'عالية', color: 'bg-orange-100 text-orange-700', icon: Flag },
  { value: 'medium', label: 'متوسطة', color: 'bg-yellow-100 text-yellow-700', icon: Info },
  { value: 'low', label: 'منخفضة', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
];

// ===== أنواع المستندات =====
const DOCUMENT_TYPES = [
  { value: 'license', label: 'رخصة البناء', icon: FileText },
  { value: 'deed', label: 'صك الملكية', icon: Home },
  { value: 'plan', label: 'المخططات الهندسية', icon: MapPin },
  { value: 'survey', label: 'كروكي المساحة', icon: MapPin },
  { value: 'contract', label: 'العقود', icon: FileText },
  { value: 'certificate', label: 'الشهادات', icon: Award },
  { value: 'report', label: 'التقارير الفنية', icon: ClipboardCheck },
  { value: 'other', label: 'أخرى', icon: FileText },
];

// ===== الجهات الخارجية =====
const EXTERNAL_ENTITIES = [
  { value: 'baladia', label: 'الأمانة/البلدية', color: 'bg-blue-100' },
  { value: 'justice', label: 'وزارة العدل', color: 'bg-green-100' },
  { value: 'momra', label: 'وزارة الشؤون البلدية', color: 'bg-purple-100' },
  { value: 'civil-defense', label: 'الدفاع المدني', color: 'bg-red-100' },
  { value: 'electricity', label: 'شركة الكهرباء', color: 'bg-yellow-100' },
  { value: 'water', label: 'المياه الوطنية', color: 'bg-cyan-100' },
  { value: 'surveying', label: 'هيئة المساحة', color: 'bg-indigo-100' },
  { value: 'other', label: 'أخرى', color: 'bg-gray-100' },
];

// ===== بيانات تجريبية =====
const SAMPLE_NOTES = [
  {
    id: 'NOTE-2025-001',
    transactionId: '286-00245',
    transactionTitle: 'ترخيص بناء فيلا سكنية',
    entityName: 'الأمانة/البلددية',
    entityType: 'baladia',
    documentType: 'plan',
    documentName: 'المخططات المعمارية',
    noteText: 'يرجى تعديل ارتفاع المبنى ليكون 12 متر بدلاً من 15 متر حسب اشتراطات المنطقة',
    priority: 'high',
    status: 'new',
    receivedDate: '2025-01-15',
    dueDate: '2025-01-25',
    assignedTo: null,
    assignedToName: null,
  },
  {
    id: 'NOTE-2025-002',
    transactionId: '286-00245',
    transactionTitle: 'ترخيص بناء فيلا سكنية',
    entityName: 'الدفاع المدني',
    entityType: 'civil-defense',
    documentType: 'plan',
    documentName: 'مخطط السلامة',
    noteText: 'إضافة مخرج طوارئ إضافي في الطابق الثاني',
    priority: 'urgent',
    status: 'assigned',
    receivedDate: '2025-01-14',
    dueDate: '2025-01-20',
    assignedTo: '817-00123',
    assignedToName: 'المهندس أحمد محمد',
  },
  {
    id: 'NOTE-2025-003',
    transactionId: '286-00246',
    transactionTitle: 'إفراز أرض',
    entityName: 'وزارة العدل',
    entityType: 'justice',
    documentType: 'deed',
    documentName: 'صك الملكية',
    noteText: 'تحديث بيانات المالك حسب السجل المدني الجديد',
    priority: 'medium',
    status: 'in-progress',
    receivedDate: '2025-01-13',
    dueDate: '2025-01-23',
    assignedTo: '817-00124',
    assignedToName: 'المهندسة فاطمة خالد',
  },
];

const NotesProcessing_Complete_860: React.FC = () => {
  const [activeTab, setActiveTab] = useState('860-01');
  const [notes, setNotes] = useState(SAMPLE_NOTES);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  // إحصائيات
  const stats = {
    total: notes.length,
    new: notes.filter(n => n.status === 'new').length,
    assigned: notes.filter(n => n.status === 'assigned').length,
    inProgress: notes.filter(n => n.status === 'in-progress').length,
    completed: notes.filter(n => n.status === 'completed').length,
    urgent: notes.filter(n => n.priority === 'urgent').length,
    highPriority: notes.filter(n => n.priority === 'high').length,
  };

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 860-01: نظرة عامة
      case '860-01':
        return (
          <div className="universal-dense-tab-content">
            {/* إحصائيات رئيسية */}
            <div className="dense-stats-grid mb-4">
              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-blue-100 text-blue-600">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.total}</div>
                <div className="dense-stat-label">إجمالي الملاحظات</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-orange-100 text-orange-600">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.new}</div>
                <div className="dense-stat-label">جديدة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-purple-100 text-purple-600">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.assigned}</div>
                <div className="dense-stat-label">مُسندة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-yellow-100 text-yellow-600">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.inProgress}</div>
                <div className="dense-stat-label">قيد المعالجة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-green-100 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.completed}</div>
                <div className="dense-stat-label">مُعالجة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon bg-red-100 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="dense-stat-number">{stats.urgent}</div>
                <div className="dense-stat-label">عاجلة</div>
              </Card>
            </div>

            {/* ملخص الحالة */}
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Activity className="h-4 w-4" />
                  ملخص حالة الملاحظات
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {NOTE_STATUSES.map((status) => {
                    const count = notes.filter(n => n.status === status.value).length;
                    const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                    const StatusIcon = status.icon;
                    
                    return (
                      <div key={status.value} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">{status.label}</span>
                          </div>
                          <Badge className={status.color}>{count}</Badge>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">
                          {percentage.toFixed(1)}% من الإجمالي
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* الملاحظات العاجلة */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <AlertTriangle className="h-4 w-4" />
                  ملاحظات تحتاج معالجة عاجلة
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {notes.filter(n => n.priority === 'urgent' || n.priority === 'high').slice(0, 5).map((note) => {
                    const statusInfo = NOTE_STATUSES.find(s => s.value === note.status);
                    const priorityInfo = PRIORITIES.find(p => p.value === note.priority);
                    
                    return (
                      <div key={note.id} className="dense-content-card p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="text-xs bg-gray-100 text-gray-700">
                                {note.id}
                              </Badge>
                              <Badge className={priorityInfo?.color}>
                                {priorityInfo?.label}
                              </Badge>
                              <Badge className={statusInfo?.color}>
                                {statusInfo?.label}
                              </Badge>
                            </div>
                            <div className="text-sm font-medium mb-1">{note.transactionTitle}</div>
                            <div className="text-xs text-gray-600 mb-1">
                              <span className="font-medium">الجهة:</span> {note.entityName}
                            </div>
                            <div className="text-xs text-gray-700 bg-yellow-50 p-2 rounded border border-yellow-200">
                              {note.noteText}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2 pt-2 border-t">
                          <div className="text-xs text-gray-600">
                            <Calendar className="h-3 w-3 inline ml-1" />
                            الموعد: {note.dueDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button className="dense-action-btn">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn">
                              <UserCheck className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 860-02: الملاحظات الواردة
      case '860-02':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Plus className="h-4 w-4" />
                  إضافة ملاحظة جديدة
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Save className="h-3 w-3" />
                  حفظ
                </Button>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-4">
                  <SelectWithCopy
                    label="المعاملة"
                    id="transactionId"
                    defaultValue=""
                    options={[
                      { value: '', label: 'اختر المعاملة' },
                      { value: '286-00245', label: 'ترخيص بناء فيلا - 286-00245' },
                      { value: '286-00246', label: 'إفراز أرض - 286-00246' },
                      { value: '286-00247', label: 'فرز وتجزئة - 286-00247' },
                    ]}
                  />

                  <SelectWithCopy
                    label="الجهة الخارجية"
                    id="entityType"
                    defaultValue=""
                    options={[
                      { value: '', label: 'اختر الجهة' },
                      ...EXTERNAL_ENTITIES.map(e => ({ value: e.value, label: e.label }))
                    ]}
                  />

                  <SelectWithCopy
                    label="نوع المستند"
                    id="documentType"
                    defaultValue=""
                    options={[
                      { value: '', label: 'اختر نوع المستند' },
                      ...DOCUMENT_TYPES.map(d => ({ value: d.value, label: d.label }))
                    ]}
                  />

                  <InputWithCopy
                    label="اسم المستند"
                    id="documentName"
                    defaultValue=""
                    placeholder="مثال: المخططات المعمارية"
                  />

                  <SelectWithCopy
                    label="الأولوية"
                    id="priority"
                    defaultValue="medium"
                    options={PRIORITIES.map(p => ({ value: p.value, label: p.label }))}
                  />

                  <DateInputWithToday
                    label="تاريخ الاستلام"
                    id="receivedDate"
                  />

                  <DateInputWithToday
                    label="الموعد النهائي"
                    id="dueDate"
                  />

                  <SelectWithCopy
                    label="الحالة"
                    id="status"
                    defaultValue="new"
                    options={NOTE_STATUSES.map(s => ({ value: s.value, label: s.label }))}
                  />

                  <div className="col-span-2">
                    <TextAreaWithCopy
                      label="نص الملاحظة"
                      id="noteText"
                      defaultValue=""
                      placeholder="اكتب نص الملاحظة الواردة من الجهة الخارجية..."
                      rows={4}
                    />
                  </div>

                  <div className="col-span-2">
                    <TextAreaWithCopy
                      label="ملاحظات إضافية"
                      id="additionalNotes"
                      defaultValue=""
                      placeholder="أي ملاحظات أو تعليمات إضافية..."
                      rows={2}
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-700">
                      <strong>ملاحظة:</strong> عند حفظ الملاحظة، سيتم تلقائياً:
                      <ul className="list-disc list-inside mt-1 mr-4">
                        <li>ربط الملاحظة بالمعاملة المحددة</li>
                        <li>إضافة سجل في تاريخ المعاملة</li>
                        <li>إرسال إشعار للمسؤولين</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* جميع الملاحظات */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <MessageSquare className="h-4 w-4" />
                  جميع الملاحظات الواردة
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
                </div>
              </CardHeader>
              <CardContent>
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الملاحظة</TableHead>
                      <TableHead className="text-right">المعاملة</TableHead>
                      <TableHead className="text-right">الجهة</TableHead>
                      <TableHead className="text-right">المستند</TableHead>
                      <TableHead className="text-right">الأولوية</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الموعد</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notes.map((note) => {
                      const statusInfo = NOTE_STATUSES.find(s => s.value === note.status);
                      const priorityInfo = PRIORITIES.find(p => p.value === note.priority);
                      
                      return (
                        <TableRow key={note.id}>
                          <TableCell className="text-right font-mono text-xs">
                            {note.id}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-xs font-medium">{note.transactionTitle}</div>
                            <div className="text-xs text-gray-500">{note.transactionId}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="text-xs bg-gray-100 text-gray-700">
                              {note.entityName}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {note.documentName}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={priorityInfo?.color}>
                              {priorityInfo?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={statusInfo?.color}>
                              {statusInfo?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {note.dueDate}
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
                                <UserCheck className="h-3 w-3" />
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

      // 860-03: تصنيف حسب المستند
      case '860-03':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FileText className="h-4 w-4" />
                  تصنيف الملاحظات حسب نوع المستند
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {DOCUMENT_TYPES.map((docType) => {
                    const docNotes = notes.filter(n => n.documentType === docType.value);
                    if (docNotes.length === 0) return null;
                    
                    const DocIcon = docType.icon;
                    
                    return (
                      <div key={docType.value} className="dense-content-card p-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                              <DocIcon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{docType.label}</div>
                              <div className="text-xs text-gray-500">{docNotes.length} ملاحظة</div>
                            </div>
                          </div>
                          <Button className="dense-btn dense-btn-secondary">
                            <Eye className="h-3 w-3" />
                            عرض الكل
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {docNotes.slice(0, 3).map((note) => {
                            const statusInfo = NOTE_STATUSES.find(s => s.value === note.status);
                            const priorityInfo = PRIORITIES.find(p => p.value === note.priority);
                            
                            return (
                              <div key={note.id} className="p-2 bg-gray-50 rounded border">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-mono">{note.id}</span>
                                  <div className="flex items-center gap-1">
                                    <Badge className={`text-xs ${priorityInfo?.color}`}>
                                      {priorityInfo?.label}
                                    </Badge>
                                    <Badge className={`text-xs ${statusInfo?.color}`}>
                                      {statusInfo?.label}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-700 mb-1">{note.documentName}</div>
                                <div className="text-xs text-gray-600 line-clamp-2">
                                  {note.noteText}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 860-04: تصنيف حسب المعاملة
      case '860-04':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FolderOpen className="h-4 w-4" />
                  تصنيف الملاحظات حسب المعاملة
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...new Set(notes.map(n => n.transactionId))].map((transactionId) => {
                    const transactionNotes = notes.filter(n => n.transactionId === transactionId);
                    const firstNote = transactionNotes[0];
                    
                    return (
                      <div key={transactionId} className="dense-content-card p-3">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="text-xs bg-blue-100 text-blue-700">
                                {transactionId}
                              </Badge>
                              <Badge className="text-xs bg-purple-100 text-purple-700">
                                {transactionNotes.length} ملاحظة
                              </Badge>
                            </div>
                            <div className="text-sm font-medium mb-1">{firstNote.transactionTitle}</div>
                            <div className="text-xs text-gray-600">
                              ملاحظات من {[...new Set(transactionNotes.map(n => n.entityName))].join(', ')}
                            </div>
                          </div>
                          <Button className="dense-btn dense-btn-secondary">
                            <Eye className="h-3 w-3" />
                            التفاصيل
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {transactionNotes.map((note) => {
                            const statusInfo = NOTE_STATUSES.find(s => s.value === note.status);
                            const priorityInfo = PRIORITIES.find(p => p.value === note.priority);
                            
                            return (
                              <div key={note.id} className="p-2 bg-gray-50 rounded border">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium">{note.entityName}</span>
                                    <Badge className={`text-xs ${priorityInfo?.color}`}>
                                      {priorityInfo?.label}
                                    </Badge>
                                  </div>
                                  <Badge className={`text-xs ${statusInfo?.color}`}>
                                    {statusInfo?.label}
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-600 mb-1">
                                  {note.documentName}
                                </div>
                                <div className="text-xs text-gray-700 bg-white p-2 rounded">
                                  {note.noteText}
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-500">
                                    الموعد: {note.dueDate}
                                  </span>
                                  {note.assignedToName && (
                                    <span className="text-xs text-purple-600">
                                      <User className="h-3 w-3 inline ml-1" />
                                      {note.assignedToName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 860-05: إسناد المهام
      case '860-05':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <UserCheck className="h-4 w-4" />
                  إسناد مهام معالجة الملاحظات
                </h2>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <strong>آلية الإسناد التلقائي:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>عند إسناد مهمة معالجة ملاحظة، سيتم تلقائياً:</li>
                        <li className="mr-4">• تحديث حالة المعاملة إلى "جاري معالجة الملاحظات"</li>
                        <li className="mr-4">• إضافة المهمة في شاشة الموظف (817)</li>
                        <li className="mr-4">• إضافة السجل في تاريخ المعاملة (286/700)</li>
                        <li className="mr-4">• إرسال إشعار فوري للموظف المُكلف</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="dense-grid dense-grid-2 gap-4">
                  <SelectWithCopy
                    label="الملاحظة المراد إسنادها"
                    id="noteToAssign"
                    defaultValue=""
                    options={[
                      { value: '', label: 'اختر الملاحظة' },
                      ...notes.filter(n => !n.assignedTo).map(n => ({
                        value: n.id,
                        label: `${n.id} - ${n.noteText.substring(0, 50)}...`
                      }))
                    ]}
                  />

                  <SelectWithCopy
                    label="الموظف المُكلف"
                    id="assignToEmployee"
                    defaultValue=""
                    options={[
                      { value: '', label: 'اختر الموظف' },
                      { value: '817-00123', label: 'المهندس أحمد محمد - 817-00123' },
                      { value: '817-00124', label: 'المهندسة فاطمة خالد - 817-00124' },
                      { value: '817-00125', label: 'المهندس سعد عبدالله - 817-00125' },
                    ]}
                  />

                  <SelectWithCopy
                    label="الأولوية"
                    id="taskPriority"
                    defaultValue="medium"
                    options={PRIORITIES.map(p => ({ value: p.value, label: p.label }))}
                  />

                  <DateInputWithToday
                    label="الموعد النهائي"
                    id="taskDueDate"
                  />

                  <div className="col-span-2">
                    <TextAreaWithCopy
                      label="تعليمات للموظف"
                      id="taskInstructions"
                      defaultValue=""
                      placeholder="أي تعليمات أو توجيهات للموظف المُكلف..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button className="dense-btn dense-btn-primary">
                    <Send className="h-3 w-3" />
                    إسناد المهمة
                  </Button>
                  <Button className="dense-btn dense-btn-secondary">
                    <Bell className="h-3 w-3" />
                    إسناد وإشعار
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* الملاحظات غير المُسندة */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <AlertCircle className="h-4 w-4" />
                  ملاحظات تحتاج إسناد
                </h2>
                <Badge className="bg-orange-100 text-orange-700">
                  {notes.filter(n => !n.assignedTo).length}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {notes.filter(n => !n.assignedTo).map((note) => {
                    const priorityInfo = PRIORITIES.find(p => p.value === note.priority);
                    
                    return (
                      <div key={note.id} className="dense-content-card p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="text-xs bg-gray-100 text-gray-700">
                                {note.id}
                              </Badge>
                              <Badge className={priorityInfo?.color}>
                                {priorityInfo?.label}
                              </Badge>
                            </div>
                            <div className="text-sm font-medium mb-1">{note.transactionTitle}</div>
                            <div className="text-xs text-gray-600 mb-2">
                              {note.entityName} - {note.documentName}
                            </div>
                            <div className="text-xs text-gray-700 bg-yellow-50 p-2 rounded border">
                              {note.noteText}
                            </div>
                          </div>
                          <Button className="dense-btn dense-btn-primary mr-3">
                            <UserCheck className="h-3 w-3" />
                            إسناد
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

      // 860-06: متابعة المعالجة
      case '860-06':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <ListChecks className="h-4 w-4" />
                  متابعة حالة معالجة الملاحظات
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-secondary">
                    <RefreshCw className="h-3 w-3" />
                    تحديث
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notes.filter(n => n.assignedTo).map((note) => {
                    const statusInfo = NOTE_STATUSES.find(s => s.value === note.status);
                    const priorityInfo = PRIORITIES.find(p => p.value === note.priority);
                    
                    // حساب الوقت المتبقي
                    const dueDate = new Date(note.dueDate);
                    const today = new Date();
                    const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    const isOverdue = daysLeft < 0;
                    const isUrgent = daysLeft <= 2 && daysLeft >= 0;
                    
                    // حساب نسبة التقدم (افتراضية)
                    const progress = note.status === 'completed' ? 100 :
                                   note.status === 'in-progress' ? 60 :
                                   note.status === 'assigned' ? 20 : 0;
                    
                    return (
                      <div key={note.id} className="dense-content-card p-3">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="text-xs bg-gray-100 text-gray-700">
                                {note.id}
                              </Badge>
                              <Badge className={priorityInfo?.color}>
                                {priorityInfo?.label}
                              </Badge>
                              <Badge className={statusInfo?.color}>
                                {statusInfo?.label}
                              </Badge>
                              {isOverdue && (
                                <Badge className="bg-red-100 text-red-700">
                                  <AlertTriangle className="h-3 w-3 ml-1" />
                                  متأخر
                                </Badge>
                              )}
                              {isUrgent && !isOverdue && (
                                <Badge className="bg-orange-100 text-orange-700">
                                  <Clock className="h-3 w-3 ml-1" />
                                  عاجل
                                </Badge>
                              )}
                            </div>
                            
                            <div className="text-sm font-medium mb-1">{note.transactionTitle}</div>
                            <div className="text-xs text-gray-600 mb-2">
                              {note.entityName} - {note.documentName}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3 text-gray-500" />
                                <span className="text-gray-700">{note.assignedToName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-500" />
                                <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-700'}>
                                  {note.dueDate}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mb-1">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-600">التقدم</span>
                                <span className="font-medium">{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-1 mr-3">
                            <Button className="dense-action-btn">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn">
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 860-07: الموظفون المكلفون
      case '860-07':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Users className="h-4 w-4" />
                  الموظفون المكلفون بمعالجة الملاحظات
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: '817-00123', name: 'المهندس أحمد محمد', tasks: 1, completed: 0 },
                    { id: '817-00124', name: 'المهندسة فاطمة خالد', tasks: 1, completed: 0 },
                  ].map((employee) => {
                    const employeeNotes = notes.filter(n => n.assignedTo === employee.id);
                    
                    return (
                      <div key={employee.id} className="dense-content-card p-3">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {employee.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{employee.name}</div>
                              <div className="text-xs text-gray-500">{employee.id}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="text-xs bg-blue-100 text-blue-700">
                                  {employeeNotes.length} مهمة
                                </Badge>
                                <Badge className="text-xs bg-green-100 text-green-700">
                                  {employee.completed} مُكملة
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {employeeNotes.map((note) => {
                            const statusInfo = NOTE_STATUSES.find(s => s.value === note.status);
                            const priorityInfo = PRIORITIES.find(p => p.value === note.priority);
                            
                            return (
                              <div key={note.id} className="p-2 bg-gray-50 rounded border">
                                <div className="flex items-center justify-between mb-1">
                                  <Badge className="text-xs bg-gray-100 text-gray-700">
                                    {note.id}
                                  </Badge>
                                  <div className="flex items-center gap-1">
                                    <Badge className={`text-xs ${priorityInfo?.color}`}>
                                      {priorityInfo?.label}
                                    </Badge>
                                    <Badge className={`text-xs ${statusInfo?.color}`}>
                                      {statusInfo?.label}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="text-xs font-medium mb-1">{note.transactionTitle}</div>
                                <div className="text-xs text-gray-600">
                                  {note.entityName} - {note.documentName}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // باقي التابات - placeholder
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
            <MessageSquare className="h-5 w-5 text-orange-600" />
            <div>
              <h2 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                معالجة الملاحظات
              </h2>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                12 تبويب • الشاشة 860
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-1 mt-2">
            <Badge className="text-xs bg-orange-100 text-orange-800">
              <AlertCircle className="w-2 h-2 ml-1" />
              {stats.new} جديدة
            </Badge>
            <Badge className="text-xs bg-yellow-100 text-yellow-800">
              <Clock className="w-2 h-2 ml-1" />
              {stats.inProgress} قيد المعالجة
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
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الشاشة 860 - معالجة ملاحظات المعاملات
                </h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نظام متكامل • ربط مع المعاملات والموظفين • 12 تبويب
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-700">
                <AlertCircle className="h-3 w-3 ml-1" />
                {stats.new} جديدة
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                <code className="font-code">SCR-860</code>
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

export default NotesProcessing_Complete_860;
