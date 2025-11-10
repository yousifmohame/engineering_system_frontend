# 🔧 مرجع سريع للمطورين: نظام سجلات السداد 905-06

## 📍 الملف الرئيسي
```
/components/screens/OfficeBranches_Complete_905_v1.tsx
```

---

## 📦 الاستيرادات الجديدة

```typescript
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { toast } from 'sonner@2.0.3';
import { Receipt, CreditCard, Save, X, Trash2 } from 'lucide-react';
```

---

## 🎯 نموذج البيانات

```typescript
interface PaymentRecord {
  id: string;
  branchId: string;
  serviceType: string;
  invoiceNumber: string;
  billPeriod: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber: string;
  paidBy: string;
  notes: string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  attachments?: string[];
}
```

---

## 🔄 States الجديدة

```typescript
const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
const [showAddPayment, setShowAddPayment] = useState(false);
const [selectedBranchForPayment, setSelectedBranchForPayment] = useState<Branch | null>(null);
const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);

const [paymentForm, setPaymentForm] = useState({
  serviceType: '',
  invoiceNumber: '',
  billPeriod: '',
  issueDate: '',
  dueDate: '',
  amount: '',
  paidAmount: '',
  paymentDate: '',
  paymentMethod: '',
  referenceNumber: '',
  paidBy: '',
  notes: ''
});
```

---

## ⚙️ الدوال الرئيسية

### 1. حفظ سجل سداد
```typescript
const handleSavePayment = () => {
  // التحقق من البيانات
  if (!selectedBranchForPayment) {
    toast.error('يجب تحديد الفرع أولاً');
    return;
  }
  
  if (!paymentForm.serviceType || !paymentForm.amount || !paymentForm.paymentDate) {
    toast.error('يجب تعبئة الحقول الإلزامية');
    return;
  }

  // حساب الحالة
  const amount = parseFloat(paymentForm.amount);
  const paidAmount = parseFloat(paymentForm.paidAmount || paymentForm.amount);
  
  let status: 'paid' | 'partial' | 'pending' | 'overdue' = 'paid';
  if (paidAmount === 0) status = 'pending';
  else if (paidAmount < amount) status = 'partial';
  else if (paidAmount >= amount && new Date(paymentForm.paymentDate) > new Date(paymentForm.dueDate)) 
    status = 'overdue';

  // إنشاء السجل
  const newPayment: PaymentRecord = {
    id: editingPayment?.id || `PAY-${Date.now()}`,
    branchId: selectedBranchForPayment.id,
    // ... باقي الحقول
    status
  };

  // الحفظ
  if (editingPayment) {
    setPaymentRecords(prev => prev.map(p => p.id === editingPayment.id ? newPayment : p));
    toast.success('تم تحديث سجل السداد بنجاح');
  } else {
    setPaymentRecords(prev => [...prev, newPayment]);
    toast.success('تم إضافة سجل السداد بنجاح');
  }

  // إعادة تعيين
  setPaymentForm({ /* ... */ });
  setShowAddPayment(false);
  setEditingPayment(null);
};
```

### 2. حذف سجل
```typescript
const handleDeletePayment = (paymentId: string) => {
  if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
    setPaymentRecords(prev => prev.filter(p => p.id !== paymentId));
    toast.success('تم حذف السجل بنجاح');
  }
};
```

---

## 🎨 مكونات UI

### 1. زر إضافة سجل
```tsx
<Button 
  size="sm" 
  onClick={() => {
    setSelectedBranchForPayment(branch);
    setEditingPayment(null);
    setPaymentForm({ /* ... */ });
    setShowAddPayment(true);
  }}
  style={{ background: '#10b981', color: 'white' }}
>
  <Plus className="h-4 w-4 ml-1" />
  إضافة سجل سداد
</Button>
```

### 2. ملخص السدادات
```tsx
const branchPayments = paymentRecords.filter(p => p.branchId === branch.id);
const totalPaid = branchPayments.reduce((sum, p) => sum + p.paidAmount, 0);
const totalDue = branchPayments.reduce((sum, p) => sum + p.amount, 0);

<div className="p-3 rounded-lg mb-3" style={{ background: '...', border: '...' }}>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Receipt className="h-5 w-5" style={{ color: '#0284c7' }} />
      <h4>ملخص السدادات ({branchPayments.length})</h4>
    </div>
    <div className="flex gap-4">
      {/* إجمالي الفواتير */}
      <div className="text-center">
        <p>إجمالي الفواتير</p>
        <p>{totalDue.toLocaleString('ar-SA')} ر.س</p>
      </div>
      {/* إجمالي المدفوع */}
      {/* المتبقي */}
    </div>
  </div>
</div>
```

### 3. جدول السجلات
```tsx
<Table className="table-rtl dense-table">
  <TableHeader>
    <TableRow>
      <TableHead>نوع الخدمة</TableHead>
      <TableHead>الفترة</TableHead>
      <TableHead>المبلغ</TableHead>
      <TableHead>المدفوع</TableHead>
      <TableHead>تاريخ السداد</TableHead>
      <TableHead>الحالة</TableHead>
      <TableHead>الإجراءات</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {branchPayments.map((payment) => (
      <TableRow key={payment.id}>
        <TableCell>{payment.serviceType}</TableCell>
        <TableCell>{payment.billPeriod}</TableCell>
        <TableCell className="font-mono">
          {payment.amount.toLocaleString('ar-SA')} ر.س
        </TableCell>
        <TableCell className="font-mono" style={{ color: '#059669' }}>
          {payment.paidAmount.toLocaleString('ar-SA')} ر.س
        </TableCell>
        <TableCell>
          {new Date(payment.paymentDate).toLocaleDateString('ar-SA')}
        </TableCell>
        <TableCell>
          <Badge style={{ background: getStatusColor(payment.status) }}>
            {getStatusLabel(payment.status)}
          </Badge>
        </TableCell>
        <TableCell>
          <Button size="sm" variant="ghost" onClick={() => editPayment(payment)}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleDeletePayment(payment.id)}>
            <Trash2 className="h-3 w-3" style={{ color: '#dc2626' }} />
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 4. نافذة الإضافة/التعديل
```tsx
<Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
  <DialogContent className="max-w-4xl dialog-rtl" style={{ maxHeight: '90vh' }}>
    <DialogHeader>
      <DialogTitle>
        {editingPayment ? 'تعديل سجل السداد' : 'إضافة سجل سداد جديد'}
      </DialogTitle>
      <DialogDescription>{selectedBranchForPayment?.name}</DialogDescription>
    </DialogHeader>

    <ScrollArea style={{ maxHeight: 'calc(90vh - 140px)' }}>
      <div className="form-rtl space-y-3 p-4">
        {/* قسم معلومات الفاتورة */}
        <div className="p-3 rounded-lg" style={{ background: '#f1f5f9', border: '2px solid #cbd5e1' }}>
          <h4>معلومات الفاتورة</h4>
          <div className="grid grid-cols-2 gap-3">
            <SelectWithCopy
              label="نوع الخدمة *"
              value={paymentForm.serviceType}
              onChange={(value) => setPaymentForm(prev => ({ ...prev, serviceType: value }))}
              options={serviceTypes.map(type => ({ value: type, label: type }))}
              copyable={true}
              clearable={true}
            />
            {/* ... باقي الحقول */}
          </div>
        </div>

        {/* قسم معلومات السداد */}
        {/* قسم الملاحظات */}

        {/* أزرار الحفظ */}
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={() => setShowAddPayment(false)}>
            <X className="h-4 w-4 ml-1" />
            إلغاء
          </Button>
          <Button onClick={handleSavePayment} style={{ background: '#10b981', color: 'white' }}>
            <Save className="h-4 w-4 ml-1" />
            {editingPayment ? 'تحديث السجل' : 'حفظ السجل'}
          </Button>
        </div>
      </div>
    </ScrollArea>
  </DialogContent>
</Dialog>
```

---

## 🎨 الألوان المستخدمة

### ألوان الحالات
```typescript
const STATUS_COLORS = {
  paid: '#10b981',      // أخضر
  partial: '#f59e0b',   // برتقالي
  overdue: '#dc2626',   // أحمر
  pending: '#6b7280'    // رمادي
};

const STATUS_LABELS = {
  paid: 'مسدد',
  partial: 'جزئي',
  overdue: 'متأخر',
  pending: 'معلق'
};
```

### ألوان الأقسام
```typescript
const SECTION_COLORS = {
  invoice: { bg: '#f1f5f9', border: '#cbd5e1' },        // رمادي-أزرق
  payment: { bg: '#f0fdf4', border: '#86efac' },        // أخضر فاتح
  notes: { bg: '#fef3c7', border: '#fcd34d' },          // أصفر كريمي
  summary: { bg: '#f0f9ff', border: '#0ea5e9' }         // أزرق سماوي
};
```

---

## 📋 القوائم الثابتة

```typescript
const serviceTypes = [
  'كهرباء', 'مياه', 'هاتف', 'إنترنت', 'إيجار',
  'صرف صحي', 'نظافة', 'صيانة', 'أمن وحراسة', 'أخرى'
];

const paymentMethods = [
  'نقدي', 'شيك', 'تحويل بنكي', 'سداد', 
  'مدى', 'بطاقة ائتمان', 'أخرى'
];
```

---

## 🔍 دوال مساعدة

### حساب الحالة
```typescript
const calculateStatus = (amount: number, paidAmount: number, paymentDate: string, dueDate: string) => {
  if (paidAmount === 0) return 'pending';
  if (paidAmount < amount) return 'partial';
  if (paidAmount >= amount && new Date(paymentDate) > new Date(dueDate)) return 'overdue';
  return 'paid';
};
```

### تنسيق المبلغ
```typescript
const formatAmount = (amount: number) => {
  return amount.toLocaleString('ar-SA') + ' ر.س';
};
```

### تنسيق التاريخ
```typescript
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA');
};
```

---

## ⚠️ نقاط هامة

### 1. التحقق من البيانات
```typescript
// الحقول الإلزامية
const requiredFields = ['serviceType', 'amount', 'paymentDate'];

// التحقق قبل الحفظ
if (!requiredFields.every(field => paymentForm[field])) {
  toast.error('يجب تعبئة الحقول الإلزامية');
  return;
}
```

### 2. المبلغ المدفوع الافتراضي
```typescript
// إذا لم يتم إدخال المبلغ المدفوع، استخدم المبلغ الكلي
const paidAmount = parseFloat(paymentForm.paidAmount || paymentForm.amount);
```

### 3. معرّف فريد
```typescript
// استخدم timestamp للمعرّف
const id = editingPayment?.id || `PAY-${Date.now()}`;
```

### 4. إعادة تعيين النموذج
```typescript
// بعد الحفظ، أعد تعيين جميع الحقول
setPaymentForm({
  serviceType: '', invoiceNumber: '', billPeriod: '',
  issueDate: '', dueDate: '', amount: '', paidAmount: '',
  paymentDate: '', paymentMethod: '', referenceNumber: '',
  paidBy: '', notes: ''
});
```

---

## 🧪 الاختبار

### اختبار إضافة سجل
```typescript
// 1. افتح النافذة
setShowAddPayment(true);

// 2. املأ البيانات
setPaymentForm({
  serviceType: 'كهرباء',
  amount: '12500',
  paymentDate: '2025-01-18',
  // ... باقي الحقول
});

// 3. احفظ
handleSavePayment();

// 4. تحقق من النتيجة
expect(paymentRecords.length).toBe(1);
expect(paymentRecords[0].status).toBe('paid');
```

---

## 📚 المراجع السريعة

- **التوثيق الشامل**: `/SCREEN_905_TAB_06_PAYMENT_RECORDS_COMPLETE.md`
- **دليل المستخدم**: `/QUICK_905_06_PAYMENT_GUIDE.md`
- **ملخص التسليم**: `/SCREEN_905_v1.6_PAYMENT_SYSTEM_DELIVERY.md`
- **الإرشادات**: `/guidelines/Guidelines.md`

---

**آخر تحديث**: نوفمبر 2025  
**الإصدار**: v1.6  
**للمطورين فقط** 🔧
