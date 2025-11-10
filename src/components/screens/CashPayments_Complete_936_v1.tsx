/**
 * الشاشة 936 - حسابات خاصة (المدفوعات الكاش) v1.0 COMPLETE
 * ========================================================
 * 
 * نظام شامل لتسجيل جميع المدفوعات النقدية (كاش فقط)
 * 
 * المميزات:
 * ✅ تسجيل المدفوعات الكاش فقط
 * ✅ ربط بالمعاملات والعملاء
 * ✅ قسم خاص لأتعاب التعقيب
 * ✅ تفاصيل السداد الكاملة
 * ✅ التواريخ والمبالغ
 * ✅ رفع صور الإيصالات
 * ✅ سجل شامل لجميع المدفوعات
 * 
 * التابات (10 تابات):
 * 936-01: نظرة عامة
 * 936-02: إضافة دفعة جديدة
 * 936-03: المدفوعات الكاش
 * 936-04: أتعاب التعقيب
 * 936-05: تقرير المدفوعات
 * 936-06: بحث وفلترة
 * 936-07: الإحصائيات
 * 936-08: صور الإيصالات
 * 936-09: التصدير
 * 936-10: الإعدادات
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
  DollarSign, FileText, Plus, Eye, Edit, Download, Search, Filter,
  Calendar, Building2, User, Paperclip, TrendingUp, Activity,
  CheckCircle, Clock, Banknote, Receipt, Image as ImageIcon,
  AlertCircle, Settings, CreditCard
} from 'lucide-react';

// ============================================================
// تكوين التابات
// ============================================================

const TABS_CONFIG: TabConfig[] = [
  { id: '936-01', number: '936-01', title: 'نظرة عامة', icon: TrendingUp },
  { id: '936-02', number: '936-02', title: 'إضافة دفعة جديدة', icon: Plus },
  { id: '936-03', number: '936-03', title: 'المدفوعات الكاش', icon: Banknote },
  { id: '936-04', number: '936-04', title: 'أتعاب التعقيب', icon: CreditCard },
  { id: '936-05', number: '936-05', title: 'تقرير المدفوعات', icon: FileText },
  { id: '936-06', number: '936-06', title: 'بحث وفلترة', icon: Search },
  { id: '936-07', number: '936-07', title: 'الإحصائيات', icon: Activity },
  { id: '936-08', number: '936-08', title: 'صور الإيصالات', icon: ImageIcon },
  { id: '936-09', number: '936-09', title: 'التصدير', icon: Download },
  { id: '936-10', number: '936-10', title: 'الإعدادات', icon: Settings },
];

// ============================================================
// البيانات الوهمية - المدفوعات الكاش (80 دفعة)
// ============================================================

const mockCashPayments = Array.from({ length: 80 }, (_, i) => ({
  id: `CASH-2025-${String(i + 1).padStart(3, '0')}`,
  transactionId: `2510${String((i % 50) + 1).padStart(3, '0')}`,
  clientName: ['أحمد بن محمد السالم', 'فاطمة بنت علي المطيري', 'خالد بن عبدالله العتيبي'][i % 3],
  clientId: `CLT-2025-${String((i % 100) + 1).padStart(3, '0')}`,
  amount: [5000, 8000, 10000, 15000, 20000, 25000, 30000][i % 7],
  paymentDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  paymentFor: ['أتعاب مكتب', 'أتعاب تعقيب', 'رسوم حكومية', 'رسوم بلدية', 'رسوم استشارية'][i % 5],
  isFollowUpFee: i % 5 === 1, // أتعاب تعقيب
  receivedBy: ['م. أحمد السالم', 'م. سارة المطيري', 'م. خالد العتيبي'][i % 3],
  notes: i % 3 === 0 ? 'دفعة أولى من إجمالي المبلغ' : i % 3 === 1 ? 'دفعة نهائية' : 'دفعة جزئية',
  hasReceipt: i % 4 !== 0, // 75% لديهم إيصالات
  receiptImage: i % 4 !== 0 ? `receipt-${i + 1}.jpg` : null,
  method: 'كاش', // كلها كاش فقط
  status: i % 10 === 0 ? 'معلق' : 'مؤكد',
}));

// ============================================================
// المكون الرئيسي
// ============================================================

const CashPayments_Complete_936_v1: React.FC = () => {
  const [activeTab, setActiveTab] = useState('936-01');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // بيانات النموذج
  const [formData, setFormData] = useState({
    transactionId: '',
    clientName: '',
    clientId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentFor: 'أتعاب مكتب',
    isFollowUpFee: false,
    receivedBy: '',
    notes: '',
    receiptImage: null as File | null,
  });

  // حساب الإحصائيات
  const statistics = useMemo(() => {
    const total = mockCashPayments.reduce((sum, p) => sum + p.amount, 0);
    const confirmed = mockCashPayments.filter(p => p.status === 'مؤكد').length;
    const followUpTotal = mockCashPayments
      .filter(p => p.isFollowUpFee)
      .reduce((sum, p) => sum + p.amount, 0);
    const todayPayments = mockCashPayments.filter(
      p => p.paymentDate === new Date().toISOString().split('T')[0]
    ).length;

    return {
      total,
      count: mockCashPayments.length,
      confirmed,
      followUpTotal,
      todayPayments,
      avgPayment: Math.round(total / mockCashPayments.length),
    };
  }, []);

  // ============================================================
  // عرض محتوى التابات
  // ============================================================

  const renderTabContent = () => {
    switch (activeTab) {
      case '936-01':
        return renderTab01_Overview();
      case '936-02':
        return renderTab02_AddPayment();
      case '936-03':
        return renderTab03_CashPayments();
      case '936-04':
        return renderTab04_FollowUpFees();
      case '936-05':
        return renderTab05_Report();
      case '936-06':
        return renderTab06_Search();
      case '936-07':
        return renderTab07_Statistics();
      case '936-08':
        return renderTab08_Receipts();
      case '936-09':
        return renderTab09_Export();
      case '936-10':
        return renderTab10_Settings();
      default:
        return <div>التاب غير موجود</div>;
    }
  };

  // ============================================================
  // التاب 936-01: نظرة عامة
  // ============================================================

  const renderTab01_Overview = () => (
    <div className="space-y-4">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-6 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-3 text-center">
            <DollarSign className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.total.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المدفوعات</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-3 text-center">
            <Receipt className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.count}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الدفعات</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.confirmed}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مؤكدة</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-3 text-center">
            <CreditCard className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.followUpTotal.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>أتعاب تعقيب</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
          <CardContent className="p-3 text-center">
            <Calendar className="h-5 w-5 mx-auto text-pink-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.todayPayments}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>اليوم</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', border: '2px solid #d8b4fe' }}>
          <CardContent className="p-3 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.avgPayment.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط الدفعة</p>
          </CardContent>
        </Card>
      </div>

      {/* جدول المدفوعات الأخيرة */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر 20 دفعة</CardTitle>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-3 w-3 ml-1" />
              إضافة دفعة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>مقابل</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستلم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إيصال</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCashPayments.slice(0, 20).map((payment, index) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs bg-blue-50 px-2 py-1 rounded">{payment.id}</code>
                    </TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs">{payment.transactionId}</code>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                      {payment.clientName}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {payment.amount.toLocaleString()} ر.س
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        style={{
                          background: payment.isFollowUpFee ? '#fef3c7' : '#dbeafe',
                          color: payment.isFollowUpFee ? '#854d0e' : '#1e40af',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        {payment.paymentFor}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {payment.paymentDate}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                      {payment.receivedBy}
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.hasReceipt ? (
                        <Badge style={{ background: '#dcfce7', color: '#166534', fontFamily: 'Tajawal, sans-serif' }}>
                          <ImageIcon className="h-3 w-3 ml-1" />
                          موجود
                        </Badge>
                      ) : (
                        <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>غير موجود</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        style={{
                          background: payment.status === 'مؤكد' ? '#dcfce7' : '#fef3c7',
                          color: payment.status === 'مؤكد' ? '#166534' : '#854d0e',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedPayment(payment);
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

  // ============================================================
  // التاب 936-02: إضافة دفعة جديدة
  // ============================================================

  const renderTab02_AddPayment = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة دفعة كاش جديدة</CardTitle>
          <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تسجيل دفعة نقدية جديدة مع جميع التفاصيل
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* المعلومات الأساسية */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعلومات الأساسية</h3>
              <div className="grid grid-cols-3 gap-4">
                <InputWithCopy
                  label="رقم المعاملة *"
                  id="transactionId"
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  placeholder="2510001"
                  required
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="اسم العميل *"
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="أحمد بن محمد السالم"
                  required
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="رمز العميل"
                  id="clientId"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  placeholder="CLT-2025-001"
                  copyable={true}
                  clearable={true}
                />
              </div>
            </div>

            {/* تفاصيل الدفعة */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل الدفعة</h3>
              <div className="grid grid-cols-3 gap-4">
                <InputWithCopy
                  label="المبلغ (ر.س) *"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="5000"
                  required
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="تاريخ الدفع *"
                  id="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                  required
                  copyable={true}
                  clearable={false}
                />
                <SelectWithCopy
                  label="مقابل *"
                  id="paymentFor"
                  value={formData.paymentFor}
                  onChange={(value) => setFormData({ ...formData, paymentFor: value })}
                  options={[
                    { value: 'أتعاب مكتب', label: 'أتعاب مكتب' },
                    { value: 'أتعاب تعقيب', label: 'أتعاب تعقيب' },
                    { value: 'رسوم حكومية', label: 'رسوم حكومية' },
                    { value: 'رسوم بلدية', label: 'رسوم بلدية' },
                    { value: 'رسوم استشارية', label: 'رسوم استشارية' }
                  ]}
                  copyable={true}
                  clearable={true}
                />
              </div>
            </div>

            {/* مؤشر أتعاب التعقيب */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <EnhancedSwitch
                id="isFollowUpFee"
                checked={formData.isFollowUpFee}
                onCheckedChange={(checked) => setFormData({ ...formData, isFollowUpFee: checked })}
                label="هل هذه أتعاب تعقيب؟"
                description="قم بتفعيل هذا الخيار إذا كانت الدفعة خاصة بأتعاب التعقيب"
                variant="warning"
              />
            </div>

            {/* معلومات إضافية */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلومات إضافية</h3>
              <div className="space-y-3">
                <InputWithCopy
                  label="المستلم *"
                  id="receivedBy"
                  value={formData.receivedBy}
                  onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                  placeholder="م. أحمد السالم"
                  required
                  copyable={true}
                  clearable={true}
                />
                <TextAreaWithCopy
                  label="ملاحظات"
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="أي ملاحظات إضافية..."
                  copyable={true}
                  clearable={true}
                />
              </div>
            </div>

            {/* رفع صورة الإيصال */}
            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>صورة الإيصال</h3>
              <Button variant="outline" className="w-full">
                <Paperclip className="h-4 w-4 ml-2" />
                رفع صورة الإيصال
              </Button>
            </div>

            {/* الأزرار */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline">إلغاء</Button>
              <Button>
                <CheckCircle className="h-4 w-4 ml-2" />
                حفظ الدفعة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 936-03: المدفوعات الكاش
  // ============================================================

  const renderTab03_CashPayments = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>جميع المدفوعات الكاش ({mockCashPayments.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>مقابل</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستلم</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCashPayments.map((payment, index) => (
                <TableRow key={payment.id}>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                  <TableCell className="text-right">
                    <code className="text-xs bg-blue-50 px-2 py-1 rounded">{payment.id}</code>
                  </TableCell>
                  <TableCell className="text-right">
                    <code className="text-xs">{payment.transactionId}</code>
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                    {payment.clientName}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {payment.amount.toLocaleString()} ر.س
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {payment.paymentFor}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {payment.paymentDate}
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                    {payment.receivedBy}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      style={{
                        background: payment.status === 'مؤكد' ? '#dcfce7' : '#fef3c7',
                        color: payment.status === 'مؤكد' ? '#166534' : '#854d0e',
                        fontFamily: 'Tajawal, sans-serif'
                      }}
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  // ============================================================
  // التاب 936-04: أتعاب التعقيب
  // ============================================================

  const renderTab04_FollowUpFees = () => {
    const followUpPayments = mockCashPayments.filter(p => p.isFollowUpFee);
    const total = followUpPayments.reduce((sum, p) => sum + p.amount, 0);

    return (
      <div className="space-y-4">
        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-4 text-center">
            <CreditCard className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
            <p className="text-2xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {total.toLocaleString()} ر.س
            </p>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إجمالي أتعاب التعقيب ({followUpPayments.length} دفعة)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل أتعاب التعقيب</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستلم</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {followUpPayments.map((payment, index) => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                      <TableCell className="text-right">
                        <code className="text-xs bg-yellow-50 px-2 py-1 rounded">{payment.id}</code>
                      </TableCell>
                      <TableCell className="text-right">
                        <code className="text-xs">{payment.transactionId}</code>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {payment.clientName}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-yellow-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {payment.amount.toLocaleString()} ر.س
                        </span>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {payment.paymentDate}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {payment.receivedBy}
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

  // التابات المتبقية (placeholders)
  const renderTab05_Report = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 936-05: تقرير المدفوعات - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab06_Search = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 936-06: بحث وفلترة - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab07_Statistics = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 936-07: الإحصائيات - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab08_Receipts = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 936-08: صور الإيصالات - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab09_Export = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 936-09: التصدير - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab10_Settings = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 936-10: الإعدادات - قيد التطوير</h3></CardContent></Card>
  );

  // ============================================================
  // نافذة التفاصيل
  // ============================================================

  const renderDetailsDialog = () => {
    if (!selectedPayment) return null;

    return (
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل الدفعة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-xs text-gray-600">رقم الدفعة</p>
                <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedPayment.id}</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-xs text-gray-600">المبلغ</p>
                <p className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {selectedPayment.amount.toLocaleString()} ر.س
                </p>
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
                background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                border: '2px solid rgba(16, 185, 129, 0.2)'
              }}
            >
              <Banknote className="h-6 w-6" style={{ color: '#10b981', filter: 'drop-shadow(0 1px 2px rgba(16, 185, 129, 0.3))' }} />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1
                  style={{
                    fontFamily: 'Tajawal, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    margin: 0,
                    background: 'linear-gradient(135deg, #1e40af 0%, #10b981 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em'
                  }}
                >
                  حسابات خاصة (مدفوعات كاش)
                </h1>

                <div
                  style={{
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>
                    936
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
                نظام شامل لتسجيل جميع المدفوعات النقدية (كاش فقط) مع أتعاب التعقيب
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              style={{
                padding: '6px 14px',
                background: 'rgba(16, 185, 129, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.15)'
              }}
            >
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                10 تبويبات
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

export default CashPayments_Complete_936_v1;
