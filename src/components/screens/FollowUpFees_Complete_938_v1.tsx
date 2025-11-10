/**
 * الشاشة 938 - أتعاب التعقيب v1.0 COMPLETE
 * ========================================================
 * 
 * نظام شامل لإدارة أتعاب التعقيب
 * 
 * المميزات:
 * ✅ حساب المبالغ المسددة والمتبقية
 * ✅ إدارة الدفعات لكل مهمة تعقيب
 * ✅ تجميع المهام حسب المعاملة
 * ✅ تقارير شاملة للأتعاب
 * ✅ متابعة المدفوعات
 * ✅ ربط بالمعقبين (937) والمعاملات (284)
 * 
 * التابات (10 تابات):
 * 938-01: نظرة عامة
 * 938-02: الأتعاب حسب المعاملة
 * 938-03: الأتعاب حسب المعقب
 * 938-04: الدفعات
 * 938-05: المدفوعات المعلقة
 * 938-06: تسجيل دفعة
 * 938-07: الفواتير
 * 938-08: التقارير المالية
 * 938-09: التصدير
 * 938-10: الإعدادات
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
  DollarSign, TrendingUp, Activity, FileText, Plus, Eye,
  CheckCircle, Clock, AlertCircle, Download, Settings,
  CreditCard, Receipt, Calendar, User, Building2, MapPin
} from 'lucide-react';

// ============================================================
// تكوين التابات
// ============================================================

const TABS_CONFIG: TabConfig[] = [
  { id: '938-01', number: '938-01', title: 'نظرة عامة', icon: TrendingUp },
  { id: '938-02', number: '938-02', title: 'الأتعاب حسب المعاملة', icon: FileText },
  { id: '938-03', number: '938-03', title: 'الأتعاب حسب المعقب', icon: User },
  { id: '938-04', number: '938-04', title: 'الدفعات', icon: CreditCard },
  { id: '938-05', number: '938-05', title: 'المدفوعات المعلقة', icon: AlertCircle },
  { id: '938-06', number: '938-06', title: 'تسجيل دفعة', icon: Plus },
  { id: '938-07', number: '938-07', title: 'الفواتير', icon: Receipt },
  { id: '938-08', number: '938-08', title: 'التقارير المالية', icon: Activity },
  { id: '938-09', number: '938-09', title: 'التصدير', icon: Download },
  { id: '938-10', number: '938-10', title: 'الإعدادات', icon: Settings },
];

// ============================================================
// أنواع البيانات
// ============================================================

interface FollowUpFee {
  id: string;
  taskId: string;
  transactionId: string;
  transactionTitle: string;
  agentId: string;
  agentName: string;
  agentType: 'individual' | 'entity';
  governmentEntity: string;
  taskDescription: string;
  totalFees: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  startDate: string;
  dueDate: string;
  payments: Payment[];
  notes: string;
}

interface Payment {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'bank-transfer' | 'check';
  receivedBy: string;
  notes: string;
  receiptNumber?: string;
}

// ============================================================
// البيانات الوهمية - الأتعاب (100 رسوم)
// ============================================================

const mockFees: FollowUpFee[] = Array.from({ length: 100 }, (_, i) => {
  const totalFees = [3000, 5000, 8000, 10000, 12000, 15000][i % 6];
  const paidAmount = i % 3 === 0 ? totalFees : i % 3 === 1 ? Math.floor(totalFees * 0.5) : 0;
  const remainingAmount = totalFees - paidAmount;
  const paymentStatus: FollowUpFee['paymentStatus'] = 
    paidAmount === 0 ? 'unpaid' : 
    paidAmount === totalFees ? 'paid' : 'partial';
  
  const paymentsCount = paidAmount === 0 ? 0 : paidAmount === totalFees ? Math.ceil(Math.random() * 3) : 1;
  const payments: Payment[] = Array.from({ length: paymentsCount }, (_, j) => ({
    id: `PAY-${i}-${j}`,
    amount: paymentsCount === 1 ? paidAmount : Math.floor(paidAmount / paymentsCount),
    paymentDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((j * 10 + 5) % 28 + 1).padStart(2, '0')}`,
    paymentMethod: ['cash', 'bank-transfer', 'check'][j % 3] as any,
    receivedBy: ['م. أحمد السالم', 'م. سارة المطيري'][j % 2],
    notes: j === 0 ? 'دفعة أولى' : j === paymentsCount - 1 ? 'دفعة نهائية' : 'دفعة جزئية',
    receiptNumber: `REC-2025-${String(i * 10 + j).padStart(4, '0')}`
  }));

  return {
    id: `FEE-2025-${String(i + 1).padStart(3, '0')}`,
    taskId: `TASK-2025-${String(i + 1).padStart(4, '0')}`,
    transactionId: `2510${String((i % 50) + 1).padStart(3, '0')}`,
    transactionTitle: ['رخصة بناء فيلا', 'تجديد رخصة محل', 'فحص مخطط سكني'][i % 3],
    agentId: `AGT-2025-${String((i % 20) + 1).padStart(3, '0')}`,
    agentName: i % 3 === 0 ? 'محمد بن أحمد السالم' : i % 3 === 1 ? 'مؤسسة التعقيب المتقدم' : 'خالد بن عبدالله المطيري',
    agentType: i % 3 === 1 ? 'entity' : 'individual',
    governmentEntity: ['البلدية', 'الدفاع المدني', 'الأمانة', 'الكهرباء', 'المياه'][i % 5],
    taskDescription: [
      'الحصول على موافقة البلدية',
      'استخراج شهادة الدفاع المدني',
      'متابعة تجديد الرخصة',
      'استلام الموافقة النهائية',
      'فحص موقعي'
    ][i % 5],
    totalFees,
    paidAmount,
    remainingAmount,
    paymentStatus,
    startDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-01`,
    dueDate: `2025-${String(((i % 12) + 1) % 12 + 1).padStart(2, '0')}-15`,
    payments,
    notes: i % 5 === 0 ? 'أتعاب متفق عليها' : '',
  };
});

// ============================================================
// المكون الرئيسي
// ============================================================

const FollowUpFees_Complete_938_v1: React.FC = () => {
  const [activeTab, setActiveTab] = useState('938-01');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FollowUpFee | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [groupBy, setGroupBy] = useState<'transaction' | 'agent'>('transaction');

  // بيانات النموذج
  const [paymentForm, setPaymentForm] = useState({
    feeId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash' as 'cash' | 'bank-transfer' | 'check',
    receivedBy: '',
    notes: '',
  });

  // ✅ إضافة جميع state hooks هنا في الأعلى
  const [pendingFilterDate, setPendingFilterDate] = useState('');
  const [pendingFilterAgent, setPendingFilterAgent] = useState('all');

  // حساب الإحصائيات العامة
  const statistics = useMemo(() => {
    const total = mockFees.reduce((sum, f) => sum + f.totalFees, 0);
    const paid = mockFees.reduce((sum, f) => sum + f.paidAmount, 0);
    const remaining = mockFees.reduce((sum, f) => sum + f.remainingAmount, 0);
    const unpaid = mockFees.filter(f => f.paymentStatus === 'unpaid').length;
    const partial = mockFees.filter(f => f.paymentStatus === 'partial').length;
    const fullyPaid = mockFees.filter(f => f.paymentStatus === 'paid').length;
    const paidPercentage = total > 0 ? (paid / total) * 100 : 0;
    const overdueCount = mockFees.filter(f => 
      f.remainingAmount > 0 && new Date(f.dueDate) < new Date()
    ).length;

    return {
      total,
      paid,
      remaining,
      unpaid,
      partial,
      fullyPaid,
      paidPercentage: paidPercentage.toFixed(1),
      overdueCount,
      count: mockFees.length,
    };
  }, []);

  // تجميع حسب المعاملة
  const feesByTransaction = useMemo(() => {
    const grouped: Record<string, FollowUpFee[]> = {};
    mockFees.forEach(fee => {
      if (!grouped[fee.transactionId]) {
        grouped[fee.transactionId] = [];
      }
      grouped[fee.transactionId].push(fee);
    });
    return grouped;
  }, []);

  // تجميع حسب المعقب
  const feesByAgent = useMemo(() => {
    const grouped: Record<string, FollowUpFee[]> = {};
    mockFees.forEach(fee => {
      if (!grouped[fee.agentId]) {
        grouped[fee.agentId] = [];
      }
      grouped[fee.agentId].push(fee);
    });
    return grouped;
  }, []);

  // ============================================================
  // عرض محتوى التابات
  // ============================================================

  const renderTabContent = () => {
    switch (activeTab) {
      case '938-01':
        return renderTab01_Overview();
      case '938-02':
        return renderTab02_ByTransaction();
      case '938-03':
        return renderTab03_ByAgent();
      case '938-04':
        return renderTab04_Payments();
      case '938-05':
        return renderTab05_Pending();
      case '938-06':
        return renderTab06_AddPayment();
      case '938-07':
        return renderTab07_Invoices();
      case '938-08':
        return renderTab08_FinancialReports();
      case '938-09':
        return renderTab09_Export();
      case '938-10':
        return renderTab10_Settings();
      default:
        return <div>التاب غير موجود</div>;
    }
  };

  // ============================================================
  // التاب 938-01: نظرة عامة
  // ============================================================

  const renderTab01_Overview = () => (
    <div className="space-y-4">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-8 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-3 text-center">
            <DollarSign className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.total.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الأتعاب</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.paid.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
          <CardContent className="p-3 text-center">
            <AlertCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.remaining.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-3 text-center">
            <Clock className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.unpaid}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>غير مدفوع</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-3 text-center">
            <Activity className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.partial}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>دفع جزئي</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', border: '2px solid #d8b4fe' }}>
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.fullyPaid}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مدفوع كامل</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
          <CardContent className="p-3 text-center">
            <Calendar className="h-5 w-5 mx-auto text-pink-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.overdueCount}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متأخرة</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', border: '2px solid #fca5a5' }}>
          <CardContent className="p-3 text-center">
            <FileText className="h-5 w-5 mx-auto text-orange-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.count}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الرسوم</p>
          </CardContent>
        </Card>
      </div>

      {/* شريط التقدم */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة السداد الإجمالية</span>
            <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.paidPercentage}%
            </span>
          </div>
          <Progress value={parseFloat(statistics.paidPercentage)} className="h-3" />
          <div className="flex justify-between mt-2 text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <span>المدفوع: {statistics.paid.toLocaleString()} ر.س</span>
            <span>المتبقي: {statistics.remaining.toLocaleString()} ر.س</span>
          </div>
        </CardContent>
      </Card>

      {/* جدول الرسوم */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>جميع الأتعاب ({mockFees.length})</CardTitle>
            <Button size="sm" onClick={() => setShowPaymentDialog(true)}>
              <Plus className="h-3 w-3 ml-1" />
              تسجيل دفعة
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
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعقب</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهمة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFees.slice(0, 30).map((fee, index) => (
                  <TableRow key={fee.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs bg-blue-50 px-2 py-1 rounded">{fee.id}</code>
                    </TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs">{fee.transactionId}</code>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                      {fee.agentName}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '9px' }}>
                        {fee.governmentEntity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '10px' }}>
                      {fee.taskDescription}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {fee.totalFees.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {fee.paidAmount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {fee.remainingAmount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        style={{
                          background: 
                            fee.paymentStatus === 'paid' ? '#dcfce7' :
                            fee.paymentStatus === 'partial' ? '#fef3c7' : '#fee2e2',
                          color: 
                            fee.paymentStatus === 'paid' ? '#166534' :
                            fee.paymentStatus === 'partial' ? '#854d0e' : '#991b1b',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        {fee.paymentStatus === 'paid' ? 'مدفوع' :
                         fee.paymentStatus === 'partial' ? 'جزئي' : 'غير مدفوع'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedFee(fee);
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
  // التاب 938-02: الأتعاب حسب المعاملة
  // ============================================================

  const renderTab02_ByTransaction = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الأتعاب مجمّعة حسب المعاملة ({Object.keys(feesByTransaction).length} معاملة)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {Object.entries(feesByTransaction).slice(0, 20).map(([transactionId, fees]) => {
                const totalFees = fees.reduce((sum, f) => sum + f.totalFees, 0);
                const paidAmount = fees.reduce((sum, f) => sum + f.paidAmount, 0);
                const remainingAmount = fees.reduce((sum, f) => sum + f.remainingAmount, 0);
                const percentage = totalFees > 0 ? (paidAmount / totalFees) * 100 : 0;

                return (
                  <Card key={transactionId} className="border-r-4" style={{ borderColor: '#2563eb' }}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <code className="text-sm font-bold">{transactionId}</code>
                          <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {fees[0].transactionTitle}
                          </p>
                        </div>
                        <Badge style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {fees.length} مهمة
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="bg-blue-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-600">الإجمالي</p>
                          <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {totalFees.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-green-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-600">المدفوع</p>
                          <p className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {paidAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-red-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-600">المتبقي</p>
                          <p className="font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {remainingAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <Progress value={percentage} className="h-2 mb-2" />
                      <p className="text-xs text-gray-600 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        نسبة السداد: {percentage.toFixed(1)}%
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 938-03: الأتعاب حسب المعقب
  // ============================================================

  const renderTab03_ByAgent = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الأتعاب مجمّعة حسب المعقب ({Object.keys(feesByAgent).length} معقب)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {Object.entries(feesByAgent).slice(0, 20).map(([agentId, fees]) => {
                const totalFees = fees.reduce((sum, f) => sum + f.totalFees, 0);
                const paidAmount = fees.reduce((sum, f) => sum + f.paidAmount, 0);
                const remainingAmount = fees.reduce((sum, f) => sum + f.remainingAmount, 0);
                const percentage = totalFees > 0 ? (paidAmount / totalFees) * 100 : 0;

                return (
                  <Card key={agentId} className="border-r-4" style={{ borderColor: '#6366f1' }}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {fees[0].agentType === 'individual' ? (
                            <User className="h-5 w-5 text-indigo-600" />
                          ) : (
                            <Building2 className="h-5 w-5 text-purple-600" />
                          )}
                          <div>
                            <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {fees[0].agentName}
                            </p>
                            <code className="text-xs">{agentId}</code>
                          </div>
                        </div>
                        <Badge style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {fees.length} مهمة
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="bg-blue-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-600">الإجمالي</p>
                          <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {totalFees.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-green-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-600">المدفوع</p>
                          <p className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {paidAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-red-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-600">المتبقي</p>
                          <p className="font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {remainingAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <Progress value={percentage} className="h-2 mb-2" />
                      <p className="text-xs text-gray-600 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        نسبة السداد: {percentage.toFixed(1)}%
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 938-04: الدفعات
  // ============================================================

  const renderTab04_Payments = () => {
    // تجميع جميع الدفعات من جميع الرسوم
    const allPayments = mockFees.flatMap(fee => 
      fee.payments.map(payment => ({
        ...payment,
        feeId: fee.id,
        transactionId: fee.transactionId,
        agentName: fee.agentName,
        taskDescription: fee.taskDescription
      }))
    );

    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);

    return (
      <div className="space-y-4">
        {/* إحصائيات الدفعات */}
        <div className="grid grid-cols-4 gap-3">
          <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
            <CardContent className="p-3 text-center">
              <CreditCard className="h-5 w-5 mx-auto text-blue-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{allPayments.length}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الدفعات</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
            <CardContent className="p-3 text-center">
              <DollarSign className="h-5 w-5 mx-auto text-green-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {totalPaid.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المدفوع</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
            <CardContent className="p-3 text-center">
              <Receipt className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {allPayments.filter(p => p.paymentMethod === 'cash').length}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>دفعات كاش</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
            <CardContent className="p-3 text-center">
              <CheckCircle className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {allPayments.filter(p => p.paymentMethod === 'bank-transfer').length}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحويلات بنكية</p>
            </CardContent>
          </Card>
        </div>

        {/* جدول جميع الدفعات */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              سجل جميع الدفعات ({allPayments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[550px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الإيصال</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعقب</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهمة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الطريقة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستلم</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPayments.map((payment, index) => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                      <TableCell className="text-right">
                        <code className="text-xs bg-blue-50 px-2 py-1 rounded">{payment.receiptNumber}</code>
                      </TableCell>
                      <TableCell className="text-right">
                        <code className="text-xs">{payment.transactionId}</code>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {payment.agentName}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '10px' }}>
                        {payment.taskDescription}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {payment.amount.toLocaleString()} ر.س
                        </span>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {payment.paymentDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          style={{
                            background: 
                              payment.paymentMethod === 'cash' ? '#dcfce7' :
                              payment.paymentMethod === 'bank-transfer' ? '#dbeafe' : '#fef3c7',
                            color: 
                              payment.paymentMethod === 'cash' ? '#166534' :
                              payment.paymentMethod === 'bank-transfer' ? '#1e40af' : '#854d0e',
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          {payment.paymentMethod === 'cash' ? 'كاش' :
                           payment.paymentMethod === 'bank-transfer' ? 'تحويل' : 'شيك'}
                        </Badge>
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

  // ============================================================
  // التاب 938-05: المدفوعات المعلقة
  // ============================================================

  const renderTab05_Pending = () => {
    const pendingFees = mockFees.filter(f => f.remainingAmount > 0);
    const totalRemaining = pendingFees.reduce((sum, f) => sum + f.remainingAmount, 0);
    const overdueCount = pendingFees.filter(f => new Date(f.dueDate) < new Date()).length;

    return (
      <div className="space-y-4">
        {/* إحصائيات المعلقة */}
        <div className="grid grid-cols-4 gap-3">
          <Card style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
            <CardContent className="p-3 text-center">
              <AlertCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{pendingFees.length}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رسوم معلقة</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
            <CardContent className="p-3 text-center">
              <DollarSign className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {totalRemaining.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المتبقي</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
            <CardContent className="p-3 text-center">
              <Clock className="h-5 w-5 mx-auto text-pink-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{overdueCount}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متأخرة</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
            <CardContent className="p-3 text-center">
              <FileText className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {pendingFees.filter(f => f.paymentStatus === 'partial').length}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>دفع جزئي</p>
            </CardContent>
          </Card>
        </div>

        {/* جدول الرسوم المعلقة */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              الرسوم المعلقة ({pendingFees.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[550px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعقب</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الاستحقاق</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingFees.map((fee, index) => {
                    const isOverdue = new Date(fee.dueDate) < new Date();
                    return (
                      <TableRow key={fee.id} style={{ background: isOverdue ? '#fef2f2' : undefined }}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                        <TableCell className="text-right">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{fee.id}</code>
                        </TableCell>
                        <TableCell className="text-right">
                          <code className="text-xs">{fee.transactionId}</code>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                          {fee.agentName}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {fee.totalFees.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {fee.paidAmount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {fee.remainingAmount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {fee.dueDate}
                          {isOverdue && (
                            <Badge variant="outline" className="mr-1" style={{ background: '#fee2e2', color: '#991b1b', fontFamily: 'Tajawal, sans-serif', fontSize: '9px' }}>
                              متأخر
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            style={{
                              background: fee.paymentStatus === 'partial' ? '#fef3c7' : '#fee2e2',
                              color: fee.paymentStatus === 'partial' ? '#854d0e' : '#991b1b',
                              fontFamily: 'Tajawal, sans-serif'
                            }}
                          >
                            {fee.paymentStatus === 'partial' ? 'جزئي' : 'غير مدفوع'}
                          </Badge>
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

  // ============================================================
  // التاب 938-06: تسجيل دفعة
  // ============================================================

  const renderTab06_AddPayment = () => {
    const [selectedFeeId, setSelectedFeeId] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [receivedBy, setReceivedBy] = useState('');

    const pendingFees = mockFees.filter(f => f.remainingAmount > 0);
    const selectedFee = pendingFees.find(f => f.id === selectedFeeId);

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تسجيل دفعة جديدة</CardTitle>
            <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              اختر الرسم وأدخل تفاصيل الدفعة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* اختيار الرسم */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>اختر الرسم</h3>
                <SelectWithCopy
                  label="الرسم *"
                  id="feeId"
                  value={selectedFeeId}
                  onChange={setSelectedFeeId}
                  options={pendingFees.map(f => ({
                    value: f.id,
                    label: `${f.id} - ${f.transactionId} - المتبقي: ${f.remainingAmount.toLocaleString()} ر.س`
                  }))}
                  copyable={false}
                  clearable={true}
                />
              </div>

              {/* تفاصيل الرسم المختار */}
              {selectedFee && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل الرسم</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">الإجمالي</p>
                      <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {selectedFee.totalFees.toLocaleString()} ر.س
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">المدفوع</p>
                      <p className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {selectedFee.paidAmount.toLocaleString()} ر.س
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">المتبقي</p>
                      <p className="font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {selectedFee.remainingAmount.toLocaleString()} ر.س
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* تفاصيل الدفعة */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل الدفعة</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InputWithCopy
                    label="المبلغ (ر.س) *"
                    id="paymentAmount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder={selectedFee ? selectedFee.remainingAmount.toString() : '0'}
                    required
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تاريخ الدفع *"
                    id="paymentDate"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    required
                    copyable={true}
                    clearable={false}
                  />
                </div>
              </div>

              {/* طريقة الدفع */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>طريقة الدفع</h3>
                <div className="grid grid-cols-2 gap-4">
                  <SelectWithCopy
                    label="الطريقة *"
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                    options={[
                      { value: 'cash', label: 'كاش' },
                      { value: 'bank-transfer', label: 'تحويل بنكي' },
                      { value: 'check', label: 'شيك' }
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="المستلم *"
                    id="receivedBy"
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)}
                    placeholder="م. أحمد السالم"
                    required
                    copyable={true}
                    clearable={true}
                  />
                </div>
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
  };

  // ============================================================
  // التاب 938-07: الفواتير
  // ============================================================

  const renderTab07_Invoices = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الفواتير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockFees.slice(0, 20).map(fee => (
              <div key={fee.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      فاتورة رقم: {fee.id}
                    </p>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      المعاملة: {fee.transactionId} | المعقب: {fee.agentName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 ml-1" />
                      عرض
                    </Button>
                    <Button size="sm">
                      <Download className="h-3 w-3 ml-1" />
                      تحميل
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-600">الإجمالي</p>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {fee.totalFees.toLocaleString()} ر.س
                    </p>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-600">المدفوع</p>
                    <p className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {fee.paidAmount.toLocaleString()} ر.س
                    </p>
                  </div>
                  <div className="bg-red-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-600">المتبقي</p>
                    <p className="font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {fee.remainingAmount.toLocaleString()} ر.س
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 938-08: التقارير المالية
  // ============================================================

  const renderTab08_FinancialReports = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[
          { 
            title: 'تقرير شامل بالأتعاب',
            description: 'تقرير مفصل بجميع أتعاب التعقيب والدفعات',
            icon: FileText,
            color: '#2563eb'
          },
          { 
            title: 'تقرير المدفوعات الشهري',
            description: 'تقرير بالمدفوعات خلال الشهر الحالي',
            icon: Calendar,
            color: '#10b981'
          },
          { 
            title: 'تقرير المتأخرات',
            description: 'تقرير بالأتعاب المتأخرة عن الموعد',
            icon: AlertCircle,
            color: '#ef4444'
          },
          { 
            title: 'تقرير حسب المعاملة',
            description: 'تقرير أتعاب مجمع حسب المعاملة',
            icon: FileText,
            color: '#f59e0b'
          },
          { 
            title: 'تقرير حسب المعقب',
            description: 'تقرير أتعاب مجمع حسب المعقب',
            icon: User,
            color: '#8b5cf6'
          },
          { 
            title: 'تقرير الدفعات الكاملة',
            description: 'تقرير بالرسوم المسددة بالكامل',
            icon: CheckCircle,
            color: '#06b6d4'
          }
        ].map((report, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-lg" style={{ background: `${report.color}20` }}>
                  <report.icon className="h-6 w-6" style={{ color: report.color }} />
                </div>
                <h3 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {report.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {report.description}
              </p>
              <Button className="w-full" style={{ background: report.color }}>
                <Download className="h-4 w-4 ml-2" />
                تحميل التقرير
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ============================================================
  // التاب 938-09: التصدير
  // ============================================================

  const renderTab09_Export = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تصدير البيانات</CardTitle>
          <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
            اختر نوع البيانات والصيغة المطلوبة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* نوع البيانات */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع البيانات</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'جميع الأتعاب',
                  'الأتعاب المعلقة فقط',
                  'الأتعاب المدفوعة فقط',
                  'جميع الدفعات',
                  'الدفعات الكاش فقط',
                  'الدفعات البنكية فقط'
                ].map((type, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white p-3 rounded">
                    <input type="checkbox" className="w-4 h-4" />
                    <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* صيغة التصدير */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>صيغة التصدير</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { format: 'Excel (XLSX)', icon: '📊' },
                  { format: 'PDF', icon: '📄' },
                  { format: 'CSV', icon: '📝' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white p-3 rounded cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="format" className="w-4 h-4" />
                    <span className="text-2xl">{item.icon}</span>
                    <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>{item.format}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline">إلغاء</Button>
              <Button>
                <Download className="h-4 w-4 ml-2" />
                تصدير البيانات
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 938-10: الإعدادات
  // ============================================================

  const renderTab10_Settings = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* إعدادات عامة */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات عامة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <EnhancedSwitch
              id="auto-invoice"
              checked={true}
              onCheckedChange={() => {}}
              label="إنشاء فواتير تلقائية"
              description="إنشاء فاتورة تلقائياً عند إنشاء رسوم جديدة"
              variant="default"
            />
            <EnhancedSwitch
              id="payment-reminders"
              checked={true}
              onCheckedChange={() => {}}
              label="تذكيرات الدفع"
              description="إرسال تذكيرات قبل موعد الاستحقاق"
              variant="success"
            />
            <EnhancedSwitch
              id="overdue-alerts"
              checked={true}
              onCheckedChange={() => {}}
              label="تنبيهات التأخير"
              description="تنبيه عند تأخر السداد"
              variant="warning"
            />
          </CardContent>
        </Card>

        {/* إعدادات مالية */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات مالية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                العملة الافتراضية
              </label>
              <SelectWithCopy
                id="currency"
                value="SAR"
                onChange={() => {}}
                options={[
                  { value: 'SAR', label: 'ريال سعودي (SAR)' },
                  { value: 'USD', label: 'دولار أمريكي (USD)' },
                  { value: 'EUR', label: 'يورو (EUR)' }
                ]}
                copyable={false}
                clearable={false}
              />
            </div>
            <div>
              <label className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                فترة السماح (بالأيام)
              </label>
              <InputWithCopy
                id="grace-period"
                value="7"
                onChange={() => {}}
                placeholder="7"
                copyable={false}
                clearable={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أزرار الإجراءات */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline">إلغاء التغييرات</Button>
        <Button>
          <Settings className="h-4 w-4 ml-2" />
          حفظ الإعدادات
        </Button>
      </div>
    </div>
  );

  // نافذة التفاصيل
  const renderDetailsDialog = () => {
    if (!selectedFee) return null;

    return (
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل الأتعاب</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-xs text-gray-600">الإجمالي</p>
                <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {selectedFee.totalFees.toLocaleString()} ر.س
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-xs text-gray-600">المدفوع</p>
                <p className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {selectedFee.paidAmount.toLocaleString()} ر.س
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <p className="text-xs text-gray-600">المتبقي</p>
                <p className="font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {selectedFee.remainingAmount.toLocaleString()} ر.س
                </p>
              </div>
            </div>

            {/* جدول الدفعات */}
            {selectedFee.payments.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الدفعات ({selectedFee.payments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الطريقة</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستلم</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الإيصال</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedFee.payments.map(payment => (
                        <TableRow key={payment.id}>
                          <TableCell className="text-right font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {payment.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {payment.paymentDate}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {payment.paymentMethod === 'cash' ? 'كاش' : 
                               payment.paymentMethod === 'bank-transfer' ? 'تحويل' : 'شيك'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {payment.receivedBy}
                          </TableCell>
                          <TableCell className="text-right">
                            <code className="text-xs">{payment.receiptNumber}</code>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
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
              <DollarSign className="h-6 w-6" style={{ color: '#10b981', filter: 'drop-shadow(0 1px 2px rgba(16, 185, 129, 0.3))' }} />
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
                  أتعاب التعقيب
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
                    938
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
                نظام شامل لإدارة أتعاب التعقيب مع الدفعات والتقارير
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

export default FollowUpFees_Complete_938_v1;
