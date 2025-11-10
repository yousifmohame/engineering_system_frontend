import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { CodeDisplay } from './CodeDisplay';
import {
  CreditCard, Building2, Plus, Edit, Trash2, Eye, Download,
  CheckCircle, AlertTriangle, Banknote, Smartphone, Globe,
  FileText, Send, Copy, QrCode
} from 'lucide-react';
import { copyToClipboard } from './utils/clipboard';

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  accountName: string;
  branch: string;
  swiftCode: string;
  currency: string;
  isActive: boolean;
  isDefault: boolean;
  balance: number;
  accountType: string;
}

interface PaymentMethod {
  id: string;
  type: 'bank_transfer' | 'cash' | 'check' | 'online' | 'wallet' | 'credit_card';
  name: string;
  details: string;
  isActive: boolean;
  fees: number;
  processingTime: string;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  clientName: string;
  transactionDate: string;
  description: string;
}

export function PaymentMethodsTab() {
  const [activeTab, setActiveTab] = useState('bank-accounts');

  // بيانات الحسابات البنكية
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'البنك الأهلي السعودي',
      accountNumber: '1234567890',
      iban: 'SA1234567890123456789012',
      accountName: 'المكتب الهندسي للاستشارات الفنية',
      branch: 'الرياض الرئيسي',
      swiftCode: 'NCBKSARI',
      currency: 'SAR',
      isActive: true,
      isDefault: true,
      balance: 250000,
      accountType: 'جاري'
    },
    {
      id: '2',
      bankName: 'بنك الراجحي',
      accountNumber: '0987654321',
      iban: 'SA0987654321098765432109',
      accountName: 'المكتب الهندسي للاستشارات الفنية',
      branch: 'فرع الملز',
      swiftCode: 'RJHISARI',
      currency: 'SAR',
      isActive: true,
      isDefault: false,
      balance: 180000,
      accountType: 'استثماري'
    },
    {
      id: '3',
      bankName: 'البنك السعودي الفرنسي',
      accountNumber: '5555666677',
      iban: 'SA5555666677789988776655',
      accountName: 'المكتب الهندسي للاستشارات الفنية',
      branch: 'برج المملكة',
      swiftCode: 'BSFRSARI',
      currency: 'USD',
      isActive: true,
      isDefault: false,
      balance: 45000,
      accountType: 'بالعملة الأجنبية'
    }
  ]);

  // وسائل الدفع الأخرى
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'online',
      name: 'مدى أونلاين',
      details: 'الدفع الإلكتروني عبر بوابة مدى',
      isActive: true,
      fees: 2.5,
      processingTime: 'فوري'
    },
    {
      id: '2',
      type: 'wallet',
      name: 'محفظة STC Pay',
      details: 'الدفع عبر محفظة STC الرقمية',
      isActive: true,
      fees: 1.5,
      processingTime: 'فوري'
    },
    {
      id: '3',
      type: 'check',
      name: 'شيك مصرفي',
      details: 'الدفع عبر الشيكات المصرفية',
      isActive: true,
      fees: 0,
      processingTime: '3-5 أيام عمل'
    },
    {
      id: '4',
      type: 'cash',
      name: 'دفع نقدي',
      details: 'الدفع النقدي في المكتب',
      isActive: true,
      fees: 0,
      processingTime: 'فوري'
    }
  ]);

  // المعاملات الحديثة
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    {
      id: 'TXN-001',
      amount: 15000,
      currency: 'SAR',
      paymentMethod: 'البنك الأهلي السعودي',
      status: 'completed',
      clientName: 'شركة البناء المتطور',
      transactionDate: '2025-01-22',
      description: 'رسوم استشارة هندسية - مشروع فيلا سكنية'
    },
    {
      id: 'TXN-002',
      amount: 8500,
      currency: 'SAR',
      paymentMethod: 'مدى أونلاين',
      status: 'pending',
      clientName: 'أحمد محمد السعود',
      transactionDate: '2025-01-21',
      description: 'رسوم مراجعة مخططات معمارية'
    },
    {
      id: 'TXN-003',
      amount: 25000,
      currency: 'SAR',
      paymentMethod: 'بنك الراجحي',
      status: 'completed',
      clientName: 'مؤسسة العمران الحديث',
      transactionDate: '2025-01-20',
      description: 'رسوم إشراف على التنفيذ - مجمع تجاري'
    }
  ]);

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'bank_transfer': return <Building2 className="w-4 h-4" />;
      case 'online': return <Globe className="w-4 h-4" />;
      case 'wallet': return <Smartphone className="w-4 h-4" />;
      case 'check': return <FileText className="w-4 h-4" />;
      case 'cash': return <Banknote className="w-4 h-4" />;
      case 'credit_card': return <CreditCard className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">مكتملة</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">قيد الانتظار</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">فشلت</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">ملغية</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatAmount = (amount: number, currency: string = 'SAR') => {
    const symbol = currency === 'USD' ? '$' : '⃁';
    return `${amount.toLocaleString()} ${symbol}`;
  };

  const sendAccountStatement = (accountId: string, type: 'full' | 'partial' = 'full') => {
    const account = bankAccounts.find(acc => acc.id === accountId);
    if (account) {
      // هنا سيتم إرسال كشف الحساب عبر بوابة العملاء
      console.log(`إرسال كشف حساب ${type === 'full' ? 'كامل' : 'جزئي'} لحساب ${account.accountNumber}`);
    }
  };

  return (
    <Card className="relative">
      <CodeDisplay code="PAYMENT-METHODS-TAB" position="bottom-right" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          وسائل سداد مستحقات المكتب
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bank-accounts">الحسابات البنكية</TabsTrigger>
            <TabsTrigger value="other-methods">وسائل أخرى</TabsTrigger>
            <TabsTrigger value="transactions">المعاملات</TabsTrigger>
          </TabsList>

          {/* تاب الحسابات البنكية */}
          <TabsContent value="bank-accounts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">الحسابات البنكية</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 ml-1" />
                إضافة حساب جديد
              </Button>
            </div>

            <div className="grid gap-4">
              {bankAccounts.map((account) => (
                <Card key={account.id} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{account.bankName}</h4>
                        <p className="text-sm text-gray-500">{account.branch}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {account.isDefault && (
                        <Badge className="bg-blue-100 text-blue-800">افتراضي</Badge>
                      )}
                      {account.isActive ? (
                        <Badge className="bg-green-100 text-green-800">نشط</Badge>
                      ) : (
                        <Badge variant="secondary">غير نشط</Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-500">رقم الحساب</Label>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm">{account.accountNumber}</p>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(account.accountNumber)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">IBAN</Label>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm">{account.iban}</p>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(account.iban)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">نوع الحساب</Label>
                      <p className="text-sm">{account.accountType}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">الرصيد</Label>
                      <p className="text-sm font-medium">{formatAmount(account.balance, account.currency)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-500">اسم الحساب</Label>
                      <p className="text-sm">{account.accountName}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">SWIFT Code</Label>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm">{account.swiftCode}</p>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(account.swiftCode)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">العملة</Label>
                      <p className="text-sm">{account.currency}</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 ml-1" />
                      تعديل
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 ml-1" />
                      عرض التفاصيل
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => sendAccountStatement(account.id, 'full')}
                    >
                      <Send className="w-4 h-4 ml-1" />
                      إرسال كشف كامل
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => sendAccountStatement(account.id, 'partial')}
                    >
                      <Send className="w-4 h-4 ml-1" />
                      إرسال كشف جزئي
                    </Button>
                    <Button variant="outline" size="sm">
                      <QrCode className="w-4 h-4 ml-1" />
                      رمز QR
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* تاب وسائل الدفع الأخرى */}
          <TabsContent value="other-methods" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">وسائل الدفع الأخرى</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 ml-1" />
                إضافة وسيلة دفع
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <Card key={method.id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getPaymentTypeIcon(method.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{method.name}</h4>
                        {method.isActive ? (
                          <Badge className="bg-green-100 text-green-800">نشط</Badge>
                        ) : (
                          <Badge variant="secondary">غير نشط</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{method.details}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <Label className="text-xs text-gray-500">الرسوم</Label>
                      <p className="text-sm">{method.fees}%</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">وقت المعالجة</Label>
                      <p className="text-sm">{method.processingTime}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 ml-1" />
                      تعديل
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 ml-1" />
                      التفاصيل
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* تاب المعاملات */}
          <TabsContent value="transactions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">المعاملات المالية الحديثة</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 ml-1" />
                  تصدير
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 ml-1" />
                  معاملة جديدة
                </Button>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم المعاملة</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>وسيلة الدفع</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">
                        {transaction.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                      <TableCell>{transaction.clientName}</TableCell>
                      <TableCell>{transaction.transactionDate}</TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* ملخص المعاملات */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <h4 className="text-sm text-gray-500 mb-1">إجمالي اليوم</h4>
                <p className="text-2xl font-semibold text-green-600">48,500 ⃁</p>
              </Card>
              <Card className="p-4 text-center">
                <h4 className="text-sm text-gray-500 mb-1">هذا الأسبوع</h4>
                <p className="text-2xl font-semibold text-blue-600">185,000 ⃁</p>
              </Card>
              <Card className="p-4 text-center">
                <h4 className="text-sm text-gray-500 mb-1">هذا الشهر</h4>
                <p className="text-2xl font-semibold text-purple-600">750,000 ⃁</p>
              </Card>
              <Card className="p-4 text-center">
                <h4 className="text-sm text-gray-500 mb-1">قيد الانتظار</h4>
                <p className="text-2xl font-semibold text-yellow-600">8,500 ⃁</p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}