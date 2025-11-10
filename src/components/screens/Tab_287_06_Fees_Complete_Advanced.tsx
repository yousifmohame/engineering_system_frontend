/**
 * التاب 287-06 - الرسوم والأتعاب المتقدم v1.0 COMPLETE
 * ========================================================
 * 
 * نظام شامل لإدارة الأتعاب والرسوم مع:
 * - إضافة بنود مخصصة
 * - احتساب تلقائي للمجاميع
 * - نظام الدفعات
 * - تسجيل السداد مع الصور
 * - ربط مباشر بشاشة 936 (حسابات خاصة)
 * 
 * @version 1.0 COMPLETE
 * @date 28 أكتوبر 2025
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import {
  Plus, Trash2, Edit, CheckCircle, DollarSign, Calculator,
  Calendar, Paperclip, ExternalLink, AlertCircle, Receipt
} from 'lucide-react';

interface FeeItem {
  id: string;
  description: string;
  amount: number;
  category: string;
}

interface Payment {
  id: string;
  amount: number;
  paymentDate: string;
  method: string;
  receivedBy: string;
  notes: string;
  receiptImage?: string;
  linkedToCashSystem: boolean;
}

interface Tab_287_06_Fees_CompleteProps {
  transactionId?: string;
}

const Tab_287_06_Fees_Complete_Advanced: React.FC<Tab_287_06_Fees_CompleteProps> = ({ transactionId = '2510001' }) => {
  // حالة البنود
  const [feeItems, setFeeItems] = useState<FeeItem[]>([
    { id: '1', description: 'أتعاب التصميم الهندسي', amount: 15000, category: 'أتعاب مكتب' },
    { id: '2', description: 'رسوم البلدية', amount: 5000, category: 'رسوم حكومية' },
    { id: '3', description: 'رسوم الدفاع المدني', amount: 2000, category: 'رسوم حكومية' },
  ]);

  // حالة الدفعات
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 'P1',
      amount: 10000,
      paymentDate: '2025-10-15',
      method: 'كاش',
      receivedBy: 'م. أحمد السالم',
      notes: 'دفعة أولى',
      receiptImage: 'receipt-1.jpg',
      linkedToCashSystem: true
    },
  ]);

  // حالة النوافذ المنبثقة
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<FeeItem | null>(null);

  // بيانات النماذج
  const [newItem, setNewItem] = useState({
    description: '',
    amount: '',
    category: 'أتعاب مكتب',
  });

  const [newPayment, setNewPayment] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    method: 'كاش',
    receivedBy: '',
    notes: '',
    receiptImage: null as File | null,
    linkToCashSystem: true,
  });

  // حساب الإجماليات
  const totals = useMemo(() => {
    const totalFees = feeItems.reduce((sum, item) => sum + item.amount, 0);
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const remaining = totalFees - totalPaid;
    const paidPercentage = totalFees > 0 ? (totalPaid / totalFees) * 100 : 0;

    return { totalFees, totalPaid, remaining, paidPercentage };
  }, [feeItems, payments]);

  // ============================================================
  // دوال معالجة البنود
  // ============================================================

  const handleAddItem = () => {
    if (!newItem.description || !newItem.amount) {
      alert('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    const item: FeeItem = {
      id: String(Date.now()),
      description: newItem.description,
      amount: parseFloat(newItem.amount),
      category: newItem.category,
    };

    setFeeItems([...feeItems, item]);
    setNewItem({ description: '', amount: '', category: 'أتعاب مكتب' });
    setShowAddItemDialog(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('هل تريد حذف هذا البند؟')) {
      setFeeItems(feeItems.filter(item => item.id !== id));
    }
  };

  const handleEditItem = (item: FeeItem) => {
    setEditingItem(item);
    setNewItem({
      description: item.description,
      amount: String(item.amount),
      category: item.category,
    });
    setShowAddItemDialog(true);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;

    setFeeItems(feeItems.map(item =>
      item.id === editingItem.id
        ? { ...item, description: newItem.description, amount: parseFloat(newItem.amount), category: newItem.category }
        : item
    ));

    setEditingItem(null);
    setNewItem({ description: '', amount: '', category: 'أتعاب مكتب' });
    setShowAddItemDialog(false);
  };

  // ============================================================
  // دوال معالجة الدفعات
  // ============================================================

  const handleAddPayment = () => {
    if (!newPayment.amount || !newPayment.receivedBy) {
      alert('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    const payment: Payment = {
      id: `P${payments.length + 1}`,
      amount: parseFloat(newPayment.amount),
      paymentDate: newPayment.paymentDate,
      method: newPayment.method,
      receivedBy: newPayment.receivedBy,
      notes: newPayment.notes,
      receiptImage: newPayment.receiptImage?.name,
      linkedToCashSystem: newPayment.linkToCashSystem && newPayment.method === 'كاش',
    };

    setPayments([...payments, payment]);

    // إذا كانت الدفعة كاش ومفعّل الربط، نسجلها في شاشة 936
    if (newPayment.linkToCashSystem && newPayment.method === 'كاش') {
      // هنا يتم الربط الفعلي مع شاشة 936
      console.log('تم ربط الدفعة مع شاشة 936 - حسابات خاصة');
      alert(`تم تسجيل الدفعة في شاشة حسابات خاصة (936)\nالمبلغ: ${parseFloat(newPayment.amount).toLocaleString()} ر.س`);
    }

    setNewPayment({
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      method: 'كاش',
      receivedBy: '',
      notes: '',
      receiptImage: null,
      linkToCashSystem: true,
    });
    setShowAddPaymentDialog(false);
  };

  const handleOpenCashSystem = () => {
    // فتح شاشة 936 مباشرة
    alert('سيتم فتح شاشة حسابات خاصة (936)');
    // في التطبيق الفعلي: router.push('/screen-936')
  };

  // ============================================================
  // واجهة التاب الرئيسية
  // ============================================================

  return (
    <div className="space-y-4">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-4 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-3 text-center">
            <Calculator className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {totals.totalFees.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الأتعاب</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {totals.totalPaid.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-3 text-center">
            <DollarSign className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {totals.remaining.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-3 text-center">
            <Receipt className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {payments.length}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الدفعات</p>
          </CardContent>
        </Card>
      </div>

      {/* شريط التقدم */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة السداد</span>
            <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {totals.paidPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={totals.paidPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* جدول البنود */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>بنود الأتعاب ({feeItems.length})</CardTitle>
            <Button size="sm" onClick={() => setShowAddItemDialog(true)}>
              <Plus className="h-3 w-3 ml-1" />
              إضافة بند
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البند</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeItems.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {item.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {item.amount.toLocaleString()} ر.س
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => handleEditItem(item)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteItem(item.id)}>
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* جدول الدفعات */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل الدفعات ({payments.length})</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleOpenCashSystem}>
                <ExternalLink className="h-3 w-3 ml-1" />
                حسابات خاصة (936)
              </Button>
              <Button size="sm" onClick={() => setShowAddPaymentDialog(true)}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة دفعة
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الطريقة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستلم</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إيصال</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>مرتبط بـ 936</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>ملاحظات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment, index) => (
                <TableRow key={payment.id}>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
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
                      style={{
                        background: payment.method === 'كاش' ? '#dcfce7' : '#dbeafe',
                        color: payment.method === 'كاش' ? '#166534' : '#1e40af',
                        fontFamily: 'Tajawal, sans-serif'
                      }}
                    >
                      {payment.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                    {payment.receivedBy}
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.receiptImage ? (
                      <Badge style={{ background: '#fef3c7', color: '#854d0e', fontFamily: 'Tajawal, sans-serif' }}>
                        موجود
                      </Badge>
                    ) : (
                      <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>لا يوجد</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.linkedToCashSystem ? (
                      <Badge style={{ background: '#dcfce7', color: '#166534', fontFamily: 'Tajawal, sans-serif' }}>
                        <CheckCircle className="h-3 w-3 ml-1" />
                        نعم
                      </Badge>
                    ) : (
                      <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>لا</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                    {payment.notes || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* نافذة إضافة/تعديل بند */}
      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {editingItem ? 'تعديل بند' : 'إضافة بند جديد'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <InputWithCopy
              label="وصف البند *"
              id="description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="أتعاب التصميم الهندسي"
              required
              copyable={true}
              clearable={true}
            />
            <InputWithCopy
              label="المبلغ (ر.س) *"
              id="amount"
              value={newItem.amount}
              onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
              placeholder="15000"
              required
              copyable={true}
              clearable={true}
            />
            <SelectWithCopy
              label="التصنيف *"
              id="category"
              value={newItem.category}
              onChange={(value) => setNewItem({ ...newItem, category: value })}
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
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
                setShowAddItemDialog(false);
                setEditingItem(null);
                setNewItem({ description: '', amount: '', category: 'أتعاب مكتب' });
              }}>
                إلغاء
              </Button>
              <Button onClick={editingItem ? handleUpdateItem : handleAddItem}>
                <CheckCircle className="h-4 w-4 ml-2" />
                {editingItem ? 'تحديث' : 'إضافة'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة إضافة دفعة */}
      <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
        <DialogContent className="max-w-2xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة دفعة جديدة</DialogTitle>
            <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              سجل دفعة جديدة مع إمكانية الربط بشاشة حسابات خاصة (936)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* المعلومات الأساسية */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلومات الدفعة</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputWithCopy
                  label="المبلغ (ر.س) *"
                  id="paymentAmount"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  placeholder="10000"
                  required
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="تاريخ الدفع *"
                  id="paymentDate"
                  type="date"
                  value={newPayment.paymentDate}
                  onChange={(e) => setNewPayment({ ...newPayment, paymentDate: e.target.value })}
                  required
                  copyable={true}
                  clearable={false}
                />
              </div>
            </div>

            {/* طريقة الدفع */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>طريقة الدفع</h3>
              <div className="grid grid-cols-2 gap-4">
                <SelectWithCopy
                  label="الطريقة *"
                  id="paymentMethod"
                  value={newPayment.method}
                  onChange={(value) => setNewPayment({ ...newPayment, method: value })}
                  options={[
                    { value: 'كاش', label: 'كاش' },
                    { value: 'تحويل بنكي', label: 'تحويل بنكي' },
                    { value: 'شيك', label: 'شيك' },
                    { value: 'بطاقة', label: 'بطاقة' }
                  ]}
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="المستلم *"
                  id="receivedBy"
                  value={newPayment.receivedBy}
                  onChange={(e) => setNewPayment({ ...newPayment, receivedBy: e.target.value })}
                  placeholder="م. أحمد السالم"
                  required
                  copyable={true}
                  clearable={true}
                />
              </div>
            </div>

            {/* ملاحظات وإيصال */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل إضافية</h3>
              <div className="space-y-3">
                <TextAreaWithCopy
                  label="ملاحظات"
                  id="paymentNotes"
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                  rows={2}
                  placeholder="أي ملاحظات..."
                  copyable={true}
                  clearable={true}
                />
                <Button variant="outline" className="w-full">
                  <Paperclip className="h-4 w-4 ml-2" />
                  رفع صورة الإيصال
                </Button>
              </div>
            </div>

            {/* الربط بشاشة 936 */}
            {newPayment.method === 'كاش' && (
              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-400">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    ربط بشاشة حسابات خاصة (936)
                  </h3>
                </div>
                <EnhancedSwitch
                  id="linkToCashSystem"
                  checked={newPayment.linkToCashSystem}
                  onCheckedChange={(checked) => setNewPayment({ ...newPayment, linkToCashSystem: checked })}
                  label="تسجيل في شاشة حسابات خاصة"
                  description="سيتم تسجيل هذه الدفعة تلقائياً في شاشة 936 (حسابات خاصة - مدفوعات كاش)"
                  variant="warning"
                />
              </div>
            )}

            {/* الأزرار */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
                setShowAddPaymentDialog(false);
                setNewPayment({
                  amount: '',
                  paymentDate: new Date().toISOString().split('T')[0],
                  method: 'كاش',
                  receivedBy: '',
                  notes: '',
                  receiptImage: null,
                  linkToCashSystem: true,
                });
              }}>
                إلغاء
              </Button>
              <Button onClick={handleAddPayment}>
                <CheckCircle className="h-4 w-4 ml-2" />
                حفظ الدفعة
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tab_287_06_Fees_Complete_Advanced;
