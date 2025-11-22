/**
 * الشاشة 936 - حسابات خاصة (المدفوعات الكاش) v1.0 CONNECTED
 * ========================================================
 * 
 * نظام شامل لتسجيل جميع المدفوعات النقدية (كاش فقط) مع ربط فعلي بـ backend
 * 
 * @version 1.0 CONNECTED
 * @date 22 نوفمبر 2025
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi, Payment } from '../../api/paymentApi';
import { transactionApi } from '../../api/transactionApi';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner';
import {
  DollarSign, FileText, Plus, Eye, Download, Search,
  Activity, CheckCircle, Banknote, Receipt, Image as ImageIcon,
  CreditCard, Paperclip, TrendingUp, Settings, Loader2,
  Calendar, ArrowRight, Wallet, PieChart, AlertTriangle, Clock, User, Building2, Filter, Edit
} from 'lucide-react';

// --- Helper: Format Client Name ---
const formatClientName = (nameData: any): string => {
  if (!nameData) return 'غير محدد';
  if (typeof nameData === 'string') return nameData;
  if (typeof nameData === 'object') {
    const { firstName, fatherName, grandFatherName, familyName } = nameData;
    return [firstName, fatherName, grandFatherName, familyName].filter(Boolean).join(' ');
  }
  return 'غير معروف';
};

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
// المكون الرئيسي
// ============================================================

const CashPayments_Complete_936_v1: React.FC = () => {
  const { employee } = useAuth();
  const [activeTab, setActiveTab] = useState('936-01');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  
  // For Add Payment
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
  const [allocations, setAllocations] = useState<{ itemId: string; itemName: string; category: string; totalCost: number; prevPaid: number; currentPaying: number }[]>([]);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const queryClient = useQueryClient();

  // Queries
  const { data: payments = [], isLoading: loadingPayments } = useQuery({
    queryKey: ['cashPayments'],
    queryFn: paymentApi.getAllCashPayments,
  });

  const { data: transactions = [], isLoading: loadingTransactions } = useQuery({
    queryKey: ['transactionsForPayment'],
    queryFn: async () => {
      const res = await transactionApi.getAllTransactions();
      return Array.isArray(res) ? res : (res.data || []);
    },
    enabled: activeTab === '936-01' || activeTab === '936-02' || activeTab === '936-03'
  });

  const { data: fullTransactionDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ['transactionDetails', selectedTransaction?.id],
    queryFn: () => transactionApi.getTransactionById(selectedTransaction.id),
    enabled: !!selectedTransaction?.id
  });

  const { data: transactionHistory = [], isLoading: loadingHistory } = useQuery({
    queryKey: ['transactionPayments', selectedTransaction?.id],
    queryFn: () => paymentApi.getPaymentsByTransaction(selectedTransaction.id),
    enabled: !!selectedTransaction?.id
  });

  // Mutation
  const createMutation = useMutation({
    mutationFn: paymentApi.createCashPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashPayments'] });
      queryClient.invalidateQueries({ queryKey: ['transactionPayments'] });
      queryClient.invalidateQueries({ queryKey: ['transactionsForPayment'] });
      queryClient.invalidateQueries({ queryKey: ['transactionDetails'] });
      toast.success('تم تسجيل الدفعة بنجاح');
      setShowReviewDialog(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`فشل التسجيل: ${error.response?.data?.message || 'خطأ غير معروف'}`);
      setShowReviewDialog(false);
    }
  });

  const resetForm = () => {
    setFormData({
      paymentDate: new Date().toISOString().split('T')[0],
      isFollowUpFee: false,
      notes: '',
      receiptImage: null,
    });
    setAllocations([]);
    setSelectedTransaction(null);
  };

  const initialFormData = {
    paymentDate: new Date().toISOString().split('T')[0],
    isFollowUpFee: false,
    notes: '',
    receiptImage: null as File | null,
  };
  const [formData, setFormData] = useState(initialFormData);

  // Populate allocations when transaction selected
  useEffect(() => {
    if (fullTransactionDetails?.costDetails) {
      const initialAllocations: { itemId: string; itemName: string; category: string; totalCost: number; prevPaid: number; currentPaying: number }[] = [];
      fullTransactionDetails.costDetails.forEach((cat: any) => {
        if (cat.items) {
          cat.items.forEach((item: any) => {
            const cost = Number(item.amount) || 0;
            const paid = Number(item.paid) || 0;
            const remaining = cost - paid;
            if (remaining > 0) {
              initialAllocations.push({
                itemId: item.id || item.name,
                itemName: item.name,
                category: cat.category,
                totalCost: cost,
                prevPaid: paid,
                currentPaying: 0
              });
            }
          });
        }
      });
      setAllocations(initialAllocations);
    }
  }, [fullTransactionDetails]);

  const totalAllocatedAmount = useMemo(() => {
    return allocations.reduce((sum, item) => sum + (Number(item.currentPaying) || 0), 0);
  }, [allocations]);

  const handleAllocationChange = (index: number, value: string) => {
    const newAllocations = [...allocations];
    const numValue = parseFloat(value);
    const item = newAllocations[index];
    const maxPayable = item.totalCost - item.prevPaid;
    if (numValue > maxPayable) {
      toast.warning(`المبلغ المدخل أكبر من المتبقي (${maxPayable.toLocaleString()})`);
      newAllocations[index].currentPaying = maxPayable;
    } else {
      newAllocations[index].currentPaying = numValue >= 0 ? numValue : 0;
    }
    setAllocations(newAllocations);
  };

  const handleReviewClick = () => {
    if (!selectedTransaction) {
      toast.error('الرجاء اختيار معاملة');
      return;
    }
    if (totalAllocatedAmount <= 0) {
      toast.error('الرجاء تخصيص مبلغ للدفع');
      return;
    }
    if (!employee?.id) {
      toast.error("بيانات الموظف غير متوفرة");
      return;
    }
    setShowReviewDialog(true);
  };

  const handleConfirmPayment = () => {
    const activeAllocations = allocations
      .filter(a => a.currentPaying > 0)
      .map(a => ({
        itemId: a.itemId,
        itemName: a.itemName,
        amount: a.currentPaying
      }));

    const submitData = new FormData();
    submitData.append('transactionId', selectedTransaction.transactionCode || selectedTransaction.id);
    submitData.append('amount', totalAllocatedAmount.toString());
    submitData.append('paymentDate', formData.paymentDate);
    submitData.append('isFollowUpFee', String(formData.isFollowUpFee));
    submitData.append('receivedById', employee?.id || '');
    submitData.append('notes', formData.notes);
    submitData.append('allocations', JSON.stringify(activeAllocations));
    if (formData.receiptImage) {
      submitData.append('receiptImage', formData.receiptImage);
    }
    createMutation.mutate(submitData);
  };

  const statistics = useMemo(() => {
    const totalCollected = payments.reduce((sum: number, p: Payment) => sum + Number(p.amount), 0);
    const count = payments.length;
    const todayPayments = payments.filter((p: Payment) => p.paymentDate === new Date().toISOString().split('T')[0]).length;
    const totalExpectedRevenue = transactions.reduce((sum: number, t: any) => sum + (Number(t.totalFees) || 0), 0);
    const totalRemaining = transactions.reduce((sum: number, t: any) => sum + (Number(t.remainingAmount) || 0), 0);
    const collectionRate = totalExpectedRevenue > 0 ? Math.round((totalCollected / totalExpectedRevenue) * 100) : 0;
    const followUpTotal = payments.filter(p => p.isFollowUpFee).reduce((sum, p) => sum + Number(p.amount), 0);
    const confirmed = payments.filter(p => p.status === 'مؤكد').length;

    return {
      totalCollected,
      totalExpectedRevenue,
      totalRemaining,
      collectionRate,
      count,
      todayPayments,
      avgPayment: count > 0 ? Math.round(totalCollected / count) : 0,
      followUpTotal,
      confirmed,
    };
  }, [payments, transactions]);

  // ============================================================
  // TABS RENDERING (same UI as mock version)
  // ============================================================

  const renderTab01_Overview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-3 text-center">
            <DollarSign className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {statistics.totalCollected.toLocaleString()}
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

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر 20 دفعة</CardTitle>
            <Button size="sm" onClick={() => setActiveTab('936-02')}>
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
                {payments.slice(0, 20).map((p: Payment, i: number) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{i + 1}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-mono">{p.transactionId}</Badge>
                    </TableCell>
                    <TableCell className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                      {formatClientName(p.clientName)}
                    </TableCell>
                    <TableCell className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {Number(p.amount).toLocaleString()} ر.س
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={p.isFollowUpFee ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}>
                        {p.paymentFor || (p.isFollowUpFee ? 'أتعاب تعقيب' : 'أتعاب مكتب')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {p.paymentDate}
                    </TableCell>
                    <TableCell className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                      {p.receivedByName || '---'}
                    </TableCell>
                    <TableCell className="text-right">
                      {p.receiptImage ? (
                        <Badge style={{ background: '#dcfce7', color: '#166534', fontFamily: 'Tajawal, sans-serif' }}>
                          <ImageIcon className="h-3 w-3 ml-1" />
                          موجود
                        </Badge>
                      ) : (
                        <Badge variant="outline">غير موجود</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        style={{
                          background: p.status === 'مؤكد' ? '#dcfce7' : '#fef3c7',
                          color: p.status === 'مؤكد' ? '#166534' : '#854d0e',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        {p.status || 'مؤكد'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedPayment(p);
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

  const renderTab02_AddPayment = () => {
    if (!selectedTransaction) {
      const filteredTransactions = transactions.filter((t: any) =>
        (t.transactionCode?.toLowerCase() || '').includes(transactionSearchTerm.toLowerCase()) ||
        (formatClientName(t.client?.name)?.toLowerCase() || '').includes(transactionSearchTerm.toLowerCase())
      );
      return (
        <div className="space-y-4">
          <Card className="border-blue-100">
            <CardHeader className="bg-blue-50/50 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-blue-900">اختر معاملة للسداد</CardTitle>
                  <CardDescription>ابحث عن المعاملة لإضافة دفعة جديدة لها</CardDescription>
                </div>
                <div className="relative w-72">
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="بحث برقم المعاملة أو اسم العميل..."
                    value={transactionSearchTerm}
                    onChange={(e) => setTransactionSearchTerm(e.target.value)}
                    className="pr-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[550px]">
                {loadingTransactions ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-gray-50 sticky top-0">
                      <TableRow>
                        <TableHead className="text-right">رقم المعاملة</TableHead>
                        <TableHead className="text-right">العميل</TableHead>
                        <TableHead className="text-right">النوع</TableHead>
                        <TableHead className="text-right">الإجمالي</TableHead>
                        <TableHead className="text-right">المدفوع</TableHead>
                        <TableHead className="text-right">المتبقي</TableHead>
                        <TableHead className="text-right">الإجراء</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((t: any) => (
                          <TableRow key={t.id} className="hover:bg-blue-50/30 transition-colors">
                            <TableCell className="font-mono font-medium text-blue-700">{t.transactionCode}</TableCell>
                            <TableCell>{formatClientName(t.client?.name)}</TableCell>
                            <TableCell><Badge variant="outline">{t.transactionType?.name || 'عام'}</Badge></TableCell>
                            <TableCell className="font-bold">{(t.totalFees || 0).toLocaleString()}</TableCell>
                            <TableCell className="text-green-600">{(t.paidAmount || 0).toLocaleString()}</TableCell>
                            <TableCell className="text-red-600 font-bold">{(t.remainingAmount || 0).toLocaleString()}</TableCell>
                            <TableCell>
                              <Button size="sm" onClick={() => setSelectedTransaction(t)} className="bg-blue-600 hover:bg-blue-700">
                                سداد <ArrowRight className="mr-2 h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            لا توجد معاملات مطابقة
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedTransaction(null);
            resetForm();
          }}
          className="mb-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
        >
          <ArrowRight className="ml-2 h-4 w-4" /> عودة للقائمة
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-t-4 border-t-blue-600">
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>تسجيل دفعة جديدة</CardTitle>
                    <CardDescription>
                      رقم المعاملة: <span className="font-mono font-bold text-blue-700">{selectedTransaction.transactionCode}</span>
                    </CardDescription>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-500">المتبقي للسداد</p>
                    <p className="text-2xl font-bold text-red-600">
                      {(selectedTransaction.remainingAmount || 0).toLocaleString()} <span className="text-sm text-gray-400">ر.س</span>
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">اسم العميل</p>
                    <p className="font-medium">{formatClientName(selectedTransaction.client?.name)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">رقم الجوال</p>
                    <p className="font-medium font-mono">{selectedTransaction.client?.mobile || '-'}</p>
                  </div>
                </div>

                <div className="border-t pt-2"></div>

                <div className="space-y-2">
                  <h3 className="font-bold text-sm text-gray-700 flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-blue-500" />
                    تخصيص مبلغ الدفع
                  </h3>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="text-right w-[30%]">البند</TableHead>
                          <TableHead className="text-right">التكلفة</TableHead>
                          <TableHead className="text-right">المدفوع</TableHead>
                          <TableHead className="text-right">المتبقي</TableHead>
                          <TableHead className="text-right w-[20%] bg-blue-50/50">المبلغ الحالي</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allocations.map((item, index) => (
                          <TableRow key={item.itemId}>
                            <TableCell className="font-medium">
                              {item.itemName}
                              <div className="text-[10px] text-gray-400">{item.category}</div>
                            </TableCell>
                            <TableCell>{item.totalCost.toLocaleString()}</TableCell>
                            <TableCell className="text-green-600">{item.prevPaid.toLocaleString()}</TableCell>
                            <TableCell className="text-red-600 font-bold">
                              {(item.totalCost - item.prevPaid).toLocaleString()}
                            </TableCell>
                            <TableCell className="bg-blue-50/30 p-1">
                              <Input
                                type="number"
                                className="h-8 bg-white border-blue-200 focus:ring-blue-500 text-center font-bold text-blue-700"
                                value={item.currentPaying || ''}
                                onChange={(e) => handleAllocationChange(index, e.target.value)}
                                placeholder="0"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter className="bg-gray-100 font-bold">
                        <TableRow>
                          <TableCell colSpan={4} className="text-left pl-4">إجمالي الدفعة الحالية:</TableCell>
                          <TableCell className="text-center text-green-700 text-lg">
                            {totalAllocatedAmount.toLocaleString()} <span className="text-xs">ر.س</span>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <InputWithCopy
                    label="تاريخ الدفع"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                  />
                  <div className="flex items-end pb-2">
                    <EnhancedSwitch
                      label="هل هي أتعاب تعقيب؟"
                      checked={formData.isFollowUpFee}
                      onCheckedChange={(c) => setFormData({ ...formData, isFollowUpFee: c })}
                      variant="warning"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <TextAreaWithCopy
                    label="ملاحظات"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                  <div className="bg-slate-50 p-4 rounded-lg border border-dashed border-slate-300">
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Paperclip className="h-4 w-4" /> صورة الإيصال (اختياري)
                    </label>
                    <input
                      type="file"
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
                      onChange={(e) => setFormData({ ...formData, receiptImage: e.target.files?.[0] || null })}
                      accept="image/*,.pdf"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleReviewClick}
                    disabled={createMutation.isPending}
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white min-w-[200px]"
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="animate-spin ml-2 h-4 w-4" />
                    ) : (
                      <CheckCircle className="ml-2 h-4 w-4" />
                    )}
                    مراجعة واعتماد الدفعة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-full bg-gray-50/50">
              <CardHeader>
                <CardTitle className="text-base">سجل المدفوعات السابقة</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px] px-4 pb-4">
                  {loadingHistory ? (
                    <div className="py-8 text-center">
                      <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                    </div>
                  ) : transactionHistory.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">لا يوجد دفعات سابقة</div>
                  ) : (
                    <div className="space-y-3">
                      {transactionHistory.map((p: Payment) => (
                        <div key={p.id} className="bg-white border p-3 rounded-lg shadow-sm relative overflow-hidden">
                          <div className={`absolute top-0 right-0 w-1 h-full ${p.isFollowUpFee ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                          <div className="flex justify-between items-start pr-2">
                            <div>
                              <p className="font-bold text-lg">{Number(p.amount).toLocaleString()}</p>
                              <p className="text-xs text-gray-500 mt-1">{p.paymentDate}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={p.isFollowUpFee ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}
                            >
                              {p.isFollowUpFee ? 'تعقيب' : 'مكتب'}
                            </Badge>
                          </div>
                          {p.notes && (
                            <p className="text-xs text-gray-600 mt-2 pr-2 border-t pt-2">{p.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderTab03_CashPayments = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
          جميع المدفوعات الكاش ({payments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">#</TableHead>
                <TableHead className="text-right">المعاملة</TableHead>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">الغرض</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">المستلم</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p: Payment, i: number) => (
                <TableRow key={p.id}>
                  <TableCell className="text-right">{i + 1}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">{p.transactionId}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{formatClientName(p.clientName)}</TableCell>
                  <TableCell className="font-bold text-green-600">{Number(p.amount).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={p.isFollowUpFee ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}>
                      {p.paymentFor || (p.isFollowUpFee ? 'أتعاب تعقيب' : 'أتعاب مكتب')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{p.paymentDate}</TableCell>
                  <TableCell className="text-sm">{p.receivedByName || '---'}</TableCell>
                  <TableCell>
                    <Badge
                      style={{
                        background: p.status === 'مؤكد' ? '#dcfce7' : '#fef3c7',
                        color: p.status === 'مؤكد' ? '#166534' : '#854d0e',
                        fontFamily: 'Tajawal, sans-serif'
                      }}
                    >
                      {p.status || 'مؤكد'}
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

  const renderTab04_FollowUpFees = () => {
    const followUpPayments = payments.filter((p: Payment) => p.isFollowUpFee);
    const total = followUpPayments.reduce((sum: number, p: Payment) => sum + Number(p.amount), 0);

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
                    <TableHead className="text-right">#</TableHead>
                    <TableHead className="text-right">المعاملة</TableHead>
                    <TableHead className="text-right">العميل</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">المستلم</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {followUpPayments.map((p: Payment, i: number) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-right">{i + 1}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono bg-amber-100">{p.transactionId}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{formatClientName(p.clientName)}</TableCell>
                      <TableCell className="font-bold text-yellow-600">{Number(p.amount).toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{p.paymentDate}</TableCell>
                      <TableCell className="text-sm">{p.receivedByName || '---'}</TableCell>
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

  const renderTab05_Report = () => (
    <Card>
      <CardContent className="p-8 text-center">
        <h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 936-05: تقرير المدفوعات - قيد التطوير</h3>
      </CardContent>
    </Card>
  );

  const renderTab06_Search = () => (
    <Card>
      <CardContent className="p-8 text-center">
        <h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 936-06: بحث وفلترة - قيد التطوير</h3>
      </CardContent>
    </Card>
  );

  const renderTab07_Statistics = () => (
    <Card>
      <CardContent className="p-8 text-center">
        <h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 936-07: الإحصائيات - قيد التطوير</h3>
      </CardContent>
    </Card>
  );

  const renderTab08_Receipts = () => (
    <Card>
      <CardContent className="p-8 text-center">
        <h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 936-08: صور الإيصالات - قيد التطوير</h3>
      </CardContent>
    </Card>
  );

  const renderTab09_Export = () => (
    <Card>
      <CardContent className="p-8 text-center">
        <h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 936-09: التصدير - قيد التطوير</h3>
      </CardContent>
    </Card>
  );

  const renderTab10_Settings = () => (
    <Card>
      <CardContent className="p-8 text-center">
        <h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 936-10: الإعدادات - قيد التطوير</h3>
      </CardContent>
    </Card>
  );

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
                <p className="font-bold">{selectedPayment.id}</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-xs text-gray-600">المبلغ</p>
                <p className="font-bold text-green-600">
                  {Number(selectedPayment.amount).toLocaleString()} ر.س
                </p>
              </div>
              <div className="bg-amber-50 p-3 rounded">
                <p className="text-xs text-gray-600">العميل</p>
                <p className="font-medium">{formatClientName(selectedPayment.clientName)}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <p className="text-xs text-gray-600">التاريخ</p>
                <p>{selectedPayment.paymentDate}</p>
              </div>
            </div>
            {selectedPayment.notes && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">ملاحظات</p>
                <p>{selectedPayment.notes}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderReviewDialog = () => (
    <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <CheckCircle className="h-5 w-5" />
            مراجعة وتأكيد الدفعة
          </DialogTitle>
          <DialogDescription>يرجى مراجعة تفاصيل توزيع الدفعة قبل الاعتماد النهائي</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="bg-gray-50 p-3 rounded border grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">المعاملة</p>
              <p className="font-bold">{selectedTransaction?.transactionCode}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">العميل</p>
              <p className="font-bold">{formatClientName(selectedTransaction?.client?.name)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">تاريخ الدفع</p>
              <p>{formData.paymentDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">إجمالي الدفعة</p>
              <p className="font-bold text-green-600 text-lg">{totalAllocatedAmount.toLocaleString()} ر.س</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2">تفاصيل التوزيع:</h4>
            <div className="border rounded overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>البند</TableHead>
                    <TableHead className="text-right">المبلغ المخصص</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations.filter(a => a.currentPaying > 0).map((item) => (
                    <TableRow key={item.itemId}>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell className="text-right font-bold">{item.currentPaying.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          {formData.notes && (
            <div className="bg-yellow-50 p-3 rounded border border-yellow-100 text-sm">
              <span className="font-bold">ملاحظات: </span> {formData.notes}
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
            تعديل
          </Button>
          <Button
            onClick={handleConfirmPayment}
            disabled={createMutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <CheckCircle className="h-4 w-4 ml-2" />}
            اعتماد نهائي
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      {/* Header */}
      <div
        style={{
          position: 'sticky',
          top: '0',
          zIndex: 10,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '3px solid transparent',
          borderImage: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%) 1',
          padding: '0',
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
              <Banknote className="h-6 w-6" style={{ color: '#10b981' }} />
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
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  حسابات خاصة (مدفوعات كاش)
                </h1>
                <div
                  style={{
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                    936
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
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
              <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                10 تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar tabs={TABS_CONFIG} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-auto px-6">
          {activeTab === '936-01' && renderTab01_Overview()}
          {activeTab === '936-02' && renderTab02_AddPayment()}
          {activeTab === '936-03' && renderTab03_CashPayments()}
          {activeTab === '936-04' && renderTab04_FollowUpFees()}
          {activeTab === '936-05' && renderTab05_Report()}
          {activeTab === '936-06' && renderTab06_Search()}
          {activeTab === '936-07' && renderTab07_Statistics()}
          {activeTab === '936-08' && renderTab08_Receipts()}
          {activeTab === '936-09' && renderTab09_Export()}
          {activeTab === '936-10' && renderTab10_Settings()}
        </div>
      </div>

      {renderDetailsDialog()}
      {renderReviewDialog()}
    </div>
  );
};

export default CashPayments_Complete_936_v1;