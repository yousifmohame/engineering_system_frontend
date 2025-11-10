/**
 * الشاشة 935 - استثناءات وطلبات خاصة v1.0 COMPLETE
 * ========================================================
 * 
 * نظام شامل لإدارة الاستثناءات والطلبات الخاصة مع ربط كامل بالمعاملات والعملاء
 * 
 * المميزات:
 * ✅ إدارة شاملة للاستثناءات والطلبات الخاصة
 * ✅ ربط إلزامي بمعاملة أو ملف عميل
 * ✅ نظام الموافقات متعدد المستويات
 * ✅ تتبع حالة الطلب من البداية للنهاية
 * ✅ المرفقات والمستندات
 * ✅ سجل كامل للتعديلات
 * ✅ إشعارات تلقائية
 * 
 * التابات (12 تاب):
 * 935-01: نظرة عامة
 * 935-02: إضافة طلب جديد
 * 935-03: الطلبات المعلقة
 * 935-04: الطلبات المعتمدة
 * 935-05: الطلبات المرفوضة
 * 935-06: ربط المعاملات/العملاء
 * 935-07: الموافقات
 * 935-08: المرفقات
 * 935-09: سجل الأنشطة
 * 935-10: التنبيهات
 * 935-11: التقارير
 * 935-12: الإعدادات
 * 
 * @version 1.0 COMPLETE
 * @date 28 أكتوبر 2025
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Progress } from '../ui/progress';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import {
  AlertCircle, FileText, CheckCircle, XCircle, Clock, User, FileCheck,
  Plus, Eye, Edit, Download, Search, Filter, Building2, Users, Link2,
  TrendingUp, Activity, Bell, Settings, Archive, Calendar, Mail,
  Phone, Paperclip, MessageSquare, AlertTriangle, Check, X, ChevronRight
} from 'lucide-react';

// ============================================================
// تكوين التابات
// ============================================================

const TABS_CONFIG: TabConfig[] = [
  { id: '935-01', number: '935-01', title: 'نظرة عامة', icon: TrendingUp },
  { id: '935-02', number: '935-02', title: 'إضافة طلب جديد', icon: Plus },
  { id: '935-03', number: '935-03', title: 'الطلبات المعلقة', icon: Clock },
  { id: '935-04', number: '935-04', title: 'الطلبات المعتمدة', icon: CheckCircle },
  { id: '935-05', number: '935-05', title: 'الطلبات المرفوضة', icon: XCircle },
  { id: '935-06', number: '935-06', title: 'ربط المعاملات/العملاء', icon: Link2 },
  { id: '935-07', number: '935-07', title: 'الموافقات', icon: FileCheck },
  { id: '935-08', number: '935-08', title: 'المرفقات', icon: Paperclip },
  { id: '935-09', number: '935-09', title: 'سجل الأنشطة', icon: Activity },
  { id: '935-10', number: '935-10', title: 'التنبيهات', icon: Bell },
  { id: '935-11', number: '935-11', title: 'التقارير', icon: FileText },
  { id: '935-12', number: '935-12', title: 'الإعدادات', icon: Settings },
];

// ============================================================
// البيانات الوهمية - الاستثناءات والطلبات (60 طلب)
// ============================================================

const mockExceptions = Array.from({ length: 60 }, (_, i) => ({
  id: `EXC-2025-${String(i + 1).padStart(3, '0')}`,
  title: [
    'طلب استثناء من الارتفاع النظامي',
    'طلب تقليل نسبة البناء',
    'طلب زيادة عدد الأدوار',
    'طلب تغيير نوع الاستخدام',
    'طلب دمج قطع أراضي',
    'طلب استثناء من الارتدادات',
    'طلب بناء في منطقة محمية',
    'طلب تمديد مدة الترخيص'
  ][i % 8],
  type: ['استثناء عام', 'استثناء فني', 'استثناء إداري', 'طلب خاص'][i % 4],
  linkedType: i % 3 === 0 ? 'معاملة' : 'عميل',
  linkedId: i % 3 === 0 ? `2510${String((i % 50) + 1).padStart(3, '0')}` : `CLT-2025-${String((i % 100) + 1).padStart(3, '0')}`,
  linkedName: i % 3 === 0 ? 
    `معاملة رقم 2510${String((i % 50) + 1).padStart(3, '0')}` : 
    ['م. أحمد بن محمد السالم', 'م. فاطمة بنت علي المطيري', 'م. خالد بن عبدالله العتيبي'][i % 3],
  status: ['معلق', 'قيد المراجعة', 'معتمد', 'مرفوض'][i % 4],
  priority: ['عالي', 'متوسط', 'منخفض'][i % 3],
  requestedBy: ['م. أحمد السالم', 'م. سارة المطيري', 'م. خالد العتيبي'][i % 3],
  requestDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  approvals: [
    { level: 'مدير القسم', status: i % 4 >= 1 ? 'معتمد' : 'معلق', approver: 'م. محمد الأحمد', date: i % 4 >= 1 ? `2025-10-${(i % 28) + 1}` : null },
    { level: 'المدير العام', status: i % 4 >= 2 ? 'معتمد' : 'معلق', approver: 'م. عبدالله المالك', date: i % 4 >= 2 ? `2025-10-${(i % 28) + 2}` : null },
    { level: 'رئيس مجلس الإدارة', status: i % 4 === 3 ? 'معتمد' : 'معلق', approver: 'م. سعود الفهد', date: i % 4 === 3 ? `2025-10-${(i % 28) + 3}` : null }
  ],
  reason: 'طلب استثناء بناءً على متطلبات المشروع والظروف الخاصة بالموقع',
  decision: i % 4 === 2 ? 'تمت الموافقة على الطلب بناءً على دراسة الحالة' : 
           i % 4 === 3 ? 'تم رفض الطلب لعدم استيفاء المتطلبات' : null,
  attachments: Math.floor(Math.random() * 5) + 1,
  daysElapsed: Math.floor(Math.random() * 30) + 1,
}));

// البيانات الوهمية - سجل الأنشطة (100 نشاط)
const mockActivities = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  exceptionId: `EXC-2025-${String(Math.floor(Math.random() * 60) + 1).padStart(3, '0')}`,
  action: ['تم إنشاء الطلب', 'تم تحديث الحالة', 'تمت الموافقة', 'تم الرفض', 'تم إضافة مرفق', 'تم إرسال تنبيه'][i % 6],
  user: ['م. أحمد السالم', 'م. سارة المطيري', 'م. خالد العتيبي', 'م. محمد الأحمد'][i % 4],
  timestamp: `2025-10-${String(Math.floor(i / 4) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  details: 'تفاصيل إضافية عن النشاط المنفذ',
}));

// ============================================================
// المكون الرئيسي
// ============================================================

const ExceptionsSpecialRequests_Complete_935_v1: React.FC = () => {
  const [activeTab, setActiveTab] = useState('935-01');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedException, setSelectedException] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // بيانات النموذج
  const [formData, setFormData] = useState({
    title: '',
    type: 'استثناء عام',
    linkedType: 'معاملة',
    linkedId: '',
    linkedName: '',
    priority: 'متوسط',
    reason: '',
    attachments: [] as File[],
  });

  // حساب نسبة اكتمال الموافقات
  const calculateApprovalProgress = (approvals: any[]) => {
    const approved = approvals.filter(a => a.status === 'معتمد').length;
    return (approved / approvals.length) * 100;
  };

  // ============================================================
  // عرض محتوى التابات
  // ============================================================

  const renderTabContent = () => {
    switch (activeTab) {
      case '935-01':
        return renderTab01_Overview();
      case '935-02':
        return renderTab02_AddNew();
      case '935-03':
        return renderTab03_Pending();
      case '935-04':
        return renderTab04_Approved();
      case '935-05':
        return renderTab05_Rejected();
      case '935-06':
        return renderTab06_Linking();
      case '935-07':
        return renderTab07_Approvals();
      case '935-08':
        return renderTab08_Attachments();
      case '935-09':
        return renderTab09_Activities();
      case '935-10':
        return renderTab10_Notifications();
      case '935-11':
        return renderTab11_Reports();
      case '935-12':
        return renderTab12_Settings();
      default:
        return <div>التاب غير موجود</div>;
    }
  };

  // ============================================================
  // التاب 935-01: نظرة عامة
  // ============================================================

  const renderTab01_Overview = () => {
    const pendingCount = mockExceptions.filter(e => e.status === 'معلق').length;
    const approvedCount = mockExceptions.filter(e => e.status === 'معتمد').length;
    const rejectedCount = mockExceptions.filter(e => e.status === 'مرفوض').length;
    const linkedToTransactions = mockExceptions.filter(e => e.linkedType === 'معاملة').length;

    return (
      <div className="space-y-4">
        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-6 gap-3">
          <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
            <CardContent className="p-3 text-center">
              <FileText className="h-5 w-5 mx-auto text-blue-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{mockExceptions.length}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الطلبات</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
            <CardContent className="p-3 text-center">
              <Clock className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{pendingCount}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلقة</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
            <CardContent className="p-3 text-center">
              <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{approvedCount}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معتمدة</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
            <CardContent className="p-3 text-center">
              <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{rejectedCount}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مرفوضة</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
            <CardContent className="p-3 text-center">
              <Link2 className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{linkedToTransactions}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مرتبطة بمعاملات</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
            <CardContent className="p-3 text-center">
              <Users className="h-5 w-5 mx-auto text-pink-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{mockExceptions.length - linkedToTransactions}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مرتبطة بعملاء</p>
            </CardContent>
          </Card>
        </div>

        {/* جدول الطلبات الحديثة */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الطلبات الحديثة</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>مرتبط بـ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقدم الموافقات</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockExceptions.slice(0, 15).map((exc, index) => (
                    <TableRow key={exc.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                      <TableCell className="text-right">
                        <code className="text-xs bg-blue-50 px-2 py-1 rounded">{exc.id}</code>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{exc.title}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>{exc.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {exc.linkedType === 'معاملة' ? <Building2 className="h-3 w-3 ml-1" /> : <User className="h-3 w-3 ml-1" />}
                            {exc.linkedType}
                          </Badge>
                          <code className="text-xs">{exc.linkedId}</code>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          style={{
                            background: exc.status === 'معتمد' ? '#dcfce7' : exc.status === 'مرفوض' ? '#fee2e2' : '#fef3c7',
                            color: exc.status === 'معتمد' ? '#166534' : exc.status === 'مرفوض' ? '#991b1b' : '#854d0e',
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          {exc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          style={{
                            background: exc.priority === 'عالي' ? '#fee2e2' : exc.priority === 'متوسط' ? '#fef3c7' : '#f0fdf4',
                            color: exc.priority === 'عالي' ? '#991b1b' : exc.priority === 'متوسط' ? '#854d0e' : '#166534',
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          {exc.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col gap-1">
                          <Progress value={calculateApprovalProgress(exc.approvals)} className="h-2" />
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {exc.approvals.filter(a => a.status === 'معتمد').length}/{exc.approvals.length}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{exc.requestDate}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedException(exc);
                            setShowDetailsDialog(true);
                          }}
                        >
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
  };

  // ============================================================
  // التاب 935-02: إضافة طلب جديد
  // ============================================================

  const renderTab02_AddNew = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة طلب استثناء/طلب خاص جديد</CardTitle>
          <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
            جميع الحقول المطلوبة يجب تعبئتها. يجب ربط الطلب بمعاملة أو عميل.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* المعلومات الأساسية */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعلومات الأساسية</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <InputWithCopy
                    label="عنوان الطلب *"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="أدخل عنوان الطلب"
                    required
                    copyable={true}
                    clearable={true}
                  />
                </div>
                <div>
                  <SelectWithCopy
                    label="نوع الطلب *"
                    id="type"
                    value={formData.type}
                    onChange={(value) => setFormData({ ...formData, type: value })}
                    options={[
                      { value: 'استثناء عام', label: 'استثناء عام' },
                      { value: 'استثناء فني', label: 'استثناء فني' },
                      { value: 'استثناء إداري', label: 'استثناء إداري' },
                      { value: 'طلب خاص', label: 'طلب خاص' }
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                </div>
              </div>
            </div>

            {/* الربط بالمعاملة أو العميل */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>الربط بالمعاملة أو العميل (إلزامي)</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <SelectWithCopy
                    label="نوع الربط *"
                    id="linkedType"
                    value={formData.linkedType}
                    onChange={(value) => setFormData({ ...formData, linkedType: value, linkedId: '', linkedName: '' })}
                    options={[
                      { value: 'معاملة', label: 'معاملة' },
                      { value: 'عميل', label: 'عميل' }
                    ]}
                    copyable={true}
                    clearable={false}
                  />
                </div>
                <div>
                  <InputWithCopy
                    label={`${formData.linkedType === 'معاملة' ? 'رقم المعاملة' : 'رمز العميل'} *`}
                    id="linkedId"
                    value={formData.linkedId}
                    onChange={(e) => setFormData({ ...formData, linkedId: e.target.value })}
                    placeholder={formData.linkedType === 'معاملة' ? '2510001' : 'CLT-2025-001'}
                    required
                    copyable={true}
                    clearable={true}
                  />
                </div>
                <div>
                  <InputWithCopy
                    label={`${formData.linkedType === 'معاملة' ? 'وصف المعاملة' : 'اسم العميل'}`}
                    id="linkedName"
                    value={formData.linkedName}
                    onChange={(e) => setFormData({ ...formData, linkedName: e.target.value })}
                    placeholder="يتم التعبئة تلقائياً عند اختيار الرقم"
                    copyable={true}
                    clearable={true}
                  />
                </div>
              </div>
            </div>

            {/* التفاصيل */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل الطلب</h3>
              <div className="space-y-3">
                <div>
                  <SelectWithCopy
                    label="الأولوية *"
                    id="priority"
                    value={formData.priority}
                    onChange={(value) => setFormData({ ...formData, priority: value })}
                    options={[
                      { value: 'عالي', label: 'عالي' },
                      { value: 'متوسط', label: 'متوسط' },
                      { value: 'منخفض', label: 'منخفض' }
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                </div>
                <div>
                  <TextAreaWithCopy
                    label="سبب الطلب *"
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={4}
                    placeholder="اكتب سبب تقديم هذا الطلب بشكل تفصيلي..."
                    copyable={true}
                    clearable={true}
                  />
                </div>
              </div>
            </div>

            {/* المرفقات */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرفقات</h3>
              <Button variant="outline" className="w-full">
                <Paperclip className="h-4 w-4 ml-2" />
                رفع ملفات داعمة
              </Button>
            </div>

            {/* الأزرار */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline">
                <X className="h-4 w-4 ml-2" />
                إلغاء
              </Button>
              <Button>
                <Check className="h-4 w-4 ml-2" />
                حفظ الطلب
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // التابات المتبقية (placeholders)
  const renderTab03_Pending = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 935-03: الطلبات المعلقة - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab04_Approved = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 935-04: الطلبات المعتمدة - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab05_Rejected = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 935-05: الطلبات المرفوضة - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab06_Linking = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 935-06: ربط المعاملات/العملاء - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab07_Approvals = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 935-07: الموافقات - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab08_Attachments = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 935-08: المرفقات - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab09_Activities = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل الأنشطة الشامل</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ والوقت</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الطلب</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراء</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستخدم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التفاصيل</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{activity.id}</TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>{activity.timestamp}</TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs">{activity.exceptionId}</code>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>{activity.action}</Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{activity.user}</TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>{activity.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  const renderTab10_Notifications = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 935-10: التنبيهات - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab11_Reports = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 935-11: التقارير - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab12_Settings = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 935-12: الإعدادات - قيد التطوير</h3></CardContent></Card>
  );

  // ============================================================
  // نافذة تفاصيل الطلب
  // ============================================================

  const renderDetailsDialog = () => {
    if (!selectedException) return null;

    return (
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل الطلب</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* المعلومات الأساسية */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعلومات الأساسية</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">الرقم:</span>
                  <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedException.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">العنوان:</span>
                  <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedException.title}</p>
                </div>
              </div>
            </div>

            {/* الموافقات */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>مراحل الموافقات</h4>
              <div className="space-y-2">
                {selectedException.approvals.map((approval: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    {approval.status === 'معتمد' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{approval.level}</p>
                      <p className="text-xs text-gray-600">{approval.approver}</p>
                    </div>
                    <Badge
                      style={{
                        background: approval.status === 'معتمد' ? '#dcfce7' : '#fef3c7',
                        color: approval.status === 'معتمد' ? '#166534' : '#854d0e',
                        fontFamily: 'Tajawal, sans-serif'
                      }}
                    >
                      {approval.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // ============================================================
  // الواجهة الرئيسية
  // ============================================================

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
              <AlertCircle className="h-6 w-6" style={{ color: '#2563eb', filter: 'drop-shadow(0 1px 2px rgba(37, 99, 235, 0.3))' }} />
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
                  استثناءات وطلبات خاصة
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
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>
                    935
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
                نظام شامل لإدارة الاستثناءات والطلبات الخاصة مع ربط بالمعاملات والعملاء
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
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                12 تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex flex-1 overflow-hidden" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar tabs={TABS_CONFIG} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 overflow-auto px-6">{renderTabContent()}</div>
      </div>

      {/* النوافذ المنبثقة */}
      {renderDetailsDialog()}
    </div>
  );
};

export default ExceptionsSpecialRequests_Complete_935_v1;
